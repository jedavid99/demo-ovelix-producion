import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UseGuards, Request, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  createRepairStateRequestSchema,
  updateRepairStateRequestSchema,
  createPaymentMethodSchema,
  updatePaymentMethodSchema,
  createTaxRateSchema,
  updateTaxRateSchema,
  createBankAccountSchema,
  updateBankAccountSchema,
  updateNotificationPreferenceSchema,
  updateIntegrationSchema,
  updatePlanSchema,
  createCategorySchema,
  updateCategorySchema,
} from './dto/settings.dto';

@ApiTags('Métodos de Pago / Configuración')
@ApiBearerAuth()
@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  // ---------- Estados de reparación ----------

  @ApiOperation({ summary: 'Obtener los estados de reparación' })
  @Get('repair-states')
  @Roles('DESARROLLADOR', 'ADMIN')
  async getRepairStates() {
    return this.settingsService.getRepairStates();
  }

  @ApiOperation({ summary: 'Obtener las solicitudes de estado de reparación' })
  @Get('repair-state-requests')
  @Roles('DESARROLLADOR', 'ADMIN')
  async getRepairStateRequests(@Request() req) {
    return this.settingsService.getRepairStateRequests(req.user.empresa_id);
  }

  @ApiOperation({ summary: 'Crear una solicitud de estado de reparación' })
  @Post('repair-state-requests')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'TECNICO', 'VENTAS')
  async createRepairStateRequest(
    @Request() req,
    @Body(new ZodValidationPipe(createRepairStateRequestSchema)) body: any,
  ) {
    return this.settingsService.createRepairStateRequest(
      req.user.empresa_id,
      req.user.id,
      body,
    );
  }

  @ApiOperation({ summary: 'Actualizar una solicitud de estado de reparación' })
  @Patch('repair-state-requests/:id')
  @Roles('DESARROLLADOR', 'ADMIN')
  async updateRepairStateRequest(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Request() req,
    @Body(new ZodValidationPipe(updateRepairStateRequestSchema)) body: { estado: string },
  ) {
    return this.settingsService.updateRepairStateRequest(id, req.user.empresa_id, body.estado);
  }

  // ---------- Métodos de pago ----------

  @ApiOperation({ summary: 'Obtener los métodos de pago de la empresa' })
  @Get('payment-methods')
  @Roles('DESARROLLADOR', 'ADMIN')
  async getPaymentMethods(@Request() req) {
    return this.settingsService.getPaymentMethods(req.user.empresa_id);
  }

  @ApiOperation({ summary: 'Crear un método de pago' })
  @Post('payment-methods')
  @Roles('DESARROLLADOR', 'ADMIN')
  async createPaymentMethod(@Request() req, @Body(new ZodValidationPipe(createPaymentMethodSchema)) body: any) {
    return this.settingsService.createPaymentMethod(req.user.empresa_id, body);
  }

  @ApiOperation({ summary: 'Actualizar un método de pago' })
  @Put('payment-methods/:id')
  @Roles('DESARROLLADOR', 'ADMIN')
  async updatePaymentMethod(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req, @Body(new ZodValidationPipe(updatePaymentMethodSchema)) body: any) {
    return this.settingsService.updatePaymentMethod(id, req.user.empresa_id, body);
  }

  @ApiOperation({ summary: 'Eliminar un método de pago' })
  @Delete('payment-methods/:id')
  @Roles('DESARROLLADOR', 'ADMIN')
  async deletePaymentMethod(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.settingsService.deletePaymentMethod(id, req.user.empresa_id);
  }

  // ---------- Porcentajes / impuestos ----------

  @ApiOperation({ summary: 'Obtener los porcentajes de impuestos de la empresa' })
  @Get('tax-rates')
  @Roles('DESARROLLADOR', 'ADMIN')
  async getTaxRates(@Request() req) {
    return this.settingsService.getTaxRates(req.user.empresa_id);
  }

  @ApiOperation({ summary: 'Crear un porcentaje de impuesto' })
  @Post('tax-rates')
  @Roles('DESARROLLADOR', 'ADMIN')
  async createTaxRate(@Request() req, @Body(new ZodValidationPipe(createTaxRateSchema)) body: any) {
    return this.settingsService.createTaxRate(req.user.empresa_id, body);
  }

  @ApiOperation({ summary: 'Actualizar un porcentaje de impuesto' })
  @Put('tax-rates/:id')
  @Roles('DESARROLLADOR', 'ADMIN')
  async updateTaxRate(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req, @Body(new ZodValidationPipe(updateTaxRateSchema)) body: any) {
    return this.settingsService.updateTaxRate(id, req.user.empresa_id, body);
  }

  @ApiOperation({ summary: 'Eliminar un porcentaje de impuesto' })
  @Delete('tax-rates/:id')
  @Roles('DESARROLLADOR', 'ADMIN')
  async deleteTaxRate(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.settingsService.deleteTaxRate(id, req.user.empresa_id);
  }

  // ---------- Cuentas bancarias ----------

  @ApiOperation({ summary: 'Obtener las cuentas bancarias de la empresa' })
  @Get('bank-accounts')
  @Roles('DESARROLLADOR', 'ADMIN')
  async getBankAccounts(@Request() req) {
    return this.settingsService.getBankAccounts(req.user.empresa_id);
  }

  @ApiOperation({ summary: 'Crear una cuenta bancaria' })
  @Post('bank-accounts')
  @Roles('DESARROLLADOR', 'ADMIN')
  async createBankAccount(@Request() req, @Body(new ZodValidationPipe(createBankAccountSchema)) body: any) {
    return this.settingsService.createBankAccount(req.user.empresa_id, body);
  }

  @ApiOperation({ summary: 'Actualizar una cuenta bancaria' })
  @Put('bank-accounts/:id')
  @Roles('DESARROLLADOR', 'ADMIN')
  async updateBankAccount(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req, @Body(new ZodValidationPipe(updateBankAccountSchema)) body: any) {
    return this.settingsService.updateBankAccount(id, req.user.empresa_id, body);
  }

  @ApiOperation({ summary: 'Eliminar una cuenta bancaria' })
  @Delete('bank-accounts/:id')
  @Roles('DESARROLLADOR', 'ADMIN')
  async deleteBankAccount(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.settingsService.deleteBankAccount(id, req.user.empresa_id);
  }

  // ---------- Preferencias de notificación ----------

  @ApiOperation({ summary: 'Obtener las preferencias de notificación de la empresa' })
  @Get('notification-preferences')
  @Roles('DESARROLLADOR', 'ADMIN')
  async getNotificationPreferences(@Request() req) {
    return this.settingsService.getNotificationPreferences(req.user.empresa_id);
  }

  @ApiOperation({ summary: 'Actualizar una preferencia de notificación' })
  @Patch('notification-preferences/:id')
  @Roles('DESARROLLADOR', 'ADMIN')
  async updateNotificationPreference(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req, @Body(new ZodValidationPipe(updateNotificationPreferenceSchema)) body: { activo: boolean }) {
    return this.settingsService.updateNotificationPreference(id, req.user.empresa_id, body);
  }

  // ---------- Integraciones ----------

  @ApiOperation({ summary: 'Obtener las integraciones de la empresa' })
  @Get('integrations')
  @Roles('DESARROLLADOR', 'ADMIN')
  async getIntegrations(@Request() req) {
    return this.settingsService.getIntegrations(req.user.empresa_id);
  }

  @ApiOperation({ summary: 'Actualizar el estado de una integración' })
  @Patch('integrations/:id')
  @Roles('DESARROLLADOR', 'ADMIN')
  async updateIntegration(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req, @Body(new ZodValidationPipe(updateIntegrationSchema)) body: { conectado: boolean }) {
    return this.settingsService.updateIntegration(id, req.user.empresa_id, body);
  }

  // ---------- Plan ----------

  @ApiOperation({ summary: 'Obtener el plan de la empresa' })
  @Get('plan')
  @Roles('DESARROLLADOR', 'ADMIN')
  async getPlan(@Request() req) {
    return this.settingsService.getPlan(req.user.empresa_id);
  }

  @ApiOperation({ summary: 'Actualizar el plan de la empresa' })
  @Put('plan')
  @Roles('DESARROLLADOR')
  async updatePlan(@Request() req, @Body(new ZodValidationPipe(updatePlanSchema)) body: { plan?: string; meses?: number; activo?: boolean }) {
    return this.settingsService.updatePlan(req.user.empresa_id, body);
  }

  // ---------- Categorías de stock ----------

  @ApiOperation({ summary: 'Obtener las categorías de stock de la empresa' })
  @Get('categories')
  @Roles('DESARROLLADOR', 'ADMIN')
  async getCategories(@Request() req) {
    return this.settingsService.getCategories(req.user.empresa_id);
  }

  @ApiOperation({ summary: 'Crear una categoría de stock' })
  @Post('categories')
  @Roles('DESARROLLADOR', 'ADMIN')
  async createCategory(@Request() req, @Body(new ZodValidationPipe(createCategorySchema)) body: any) {
    return this.settingsService.createCategory(req.user.empresa_id, body);
  }

  @ApiOperation({ summary: 'Actualizar una categoría de stock' })
  @Put('categories/:id')
  @Roles('DESARROLLADOR', 'ADMIN')
  async updateCategory(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req, @Body(new ZodValidationPipe(updateCategorySchema)) body: any) {
    return this.settingsService.updateCategory(id, req.user.empresa_id, body);
  }

  @ApiOperation({ summary: 'Eliminar una categoría de stock' })
  @Delete('categories/:id')
  @Roles('DESARROLLADOR', 'ADMIN')
  async deleteCategory(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.settingsService.deleteCategory(id, req.user.empresa_id);
  }
}

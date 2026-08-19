import { Controller, Get, Put, Body, Query, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TenantPagesService } from './tenant-pages.service';
import { UpdateTenantPageDto, updateTenantPageSchema } from './dto/tenant-pages.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@ApiTags('Página de presupuesto')
@ApiBearerAuth()
@Controller('tenant-pages')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TenantPagesController {
  constructor(private tenantPagesService: TenantPagesService) {}

  /** Empresa a configurar: la del token, o la elegida por ?empresa_id= (solo DESARROLLADOR global). */
  private resolveEmpresaId(user: any, queryEmpresaId?: string): string {
    if (user.empresa_id) {
      if (queryEmpresaId && queryEmpresaId !== user.empresa_id && user.rol !== 'DESARROLLADOR') {
        throw new ForbiddenException('No tenés permiso para configurar la página de otra empresa');
      }
      return user.empresa_id;
    }
    if (user.rol === 'DESARROLLADOR' && queryEmpresaId?.trim()) {
      return queryEmpresaId.trim();
    }
    return '';
  }

  @ApiOperation({ summary: 'Obtener la configuración de la página de presupuesto de la empresa' })
  @Get()
  @Roles('DESARROLLADOR', 'ADMIN')
  async get(@Request() req, @Query('empresa_id') empresaId?: string) {
    return this.tenantPagesService.getForCompany(this.resolveEmpresaId(req.user, empresaId));
  }

  @ApiOperation({ summary: 'Guardar la configuración de la página de presupuesto de la empresa' })
  @Put()
  @Roles('DESARROLLADOR', 'ADMIN')
  async update(
    @Request() req,
    @Query('empresa_id') empresaId: string | undefined,
    @Body(new ZodValidationPipe(updateTenantPageSchema)) body: UpdateTenantPageDto,
  ) {
    return this.tenantPagesService.upsert(this.resolveEmpresaId(req.user, empresaId), body);
  }
}
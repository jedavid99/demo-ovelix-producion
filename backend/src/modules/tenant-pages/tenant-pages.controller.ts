import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
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

  @ApiOperation({ summary: 'Obtener la configuración de la página de presupuesto de la empresa' })
  @Get()
  @Roles('DESARROLLADOR', 'ADMIN')
  async get(@Request() req) {
    return this.tenantPagesService.getForCompany(req.user.empresa_id);
  }

  @ApiOperation({ summary: 'Guardar la configuración de la página de presupuesto de la empresa' })
  @Put()
  @Roles('DESARROLLADOR', 'ADMIN')
  async update(
    @Request() req,
    @Body(new ZodValidationPipe(updateTenantPageSchema)) body: UpdateTenantPageDto,
  ) {
    return this.tenantPagesService.upsert(req.user.empresa_id, body);
  }
}
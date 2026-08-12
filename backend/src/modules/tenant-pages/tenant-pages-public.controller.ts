import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { TenantPagesService } from './tenant-pages.service';

@Public()
@ApiTags('Página de presupuesto (pública)')
@Controller('public/tenant-pages')
export class TenantPagesPublicController {
  constructor(private tenantPagesService: TenantPagesService) {}

  @ApiOperation({ summary: 'Obtener la configuración pública por slug (subdominio)' })
  @Get(':slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.tenantPagesService.getPublicBySlug(slug);
  }
}
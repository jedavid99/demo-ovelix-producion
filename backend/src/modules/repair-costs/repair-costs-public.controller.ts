import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { RepairCostsService } from './repair-costs.service';

@Public()
@ApiTags('Costos de reparación (público)')
@Controller('public/repair-costs')
export class RepairCostsPublicController {
  constructor(private repairCostsService: RepairCostsService) {}

  @ApiOperation({ summary: 'Obtener el tarifario de reparaciones de una empresa por slug' })
  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.repairCostsService.findPublicBySlug(slug);
  }
}
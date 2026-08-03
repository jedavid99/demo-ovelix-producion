import { Controller, Get, Put, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BusinessInfoService } from './business-info.service';
import { UpdateBusinessInfoDto, updateBusinessInfoSchema } from './dto/update-business-info.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
@ApiTags('Información de la Empresa')
@ApiBearerAuth()
@Controller('business-info')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BusinessInfoController {
  constructor(private businessInfoService: BusinessInfoService) {}

  @ApiOperation({ summary: 'Obtener la información de la empresa' })
  @Get()
  @Roles('DESARROLLADOR', 'ADMIN')
  async get(@Request() req) {
    return this.businessInfoService.get(req.user);
  }

  @ApiOperation({ summary: 'Actualizar la información de la empresa' })
  @Put()
  @Roles('DESARROLLADOR', 'ADMIN')
  async update(@Body(new ZodValidationPipe(updateBusinessInfoSchema)) updateBusinessInfoDto: UpdateBusinessInfoDto, @Request() req) {
    return this.businessInfoService.update(updateBusinessInfoDto, req.user);
  }

  @ApiOperation({ summary: 'Actualizar el logo de la empresa' })
  @Patch('logo')
  @Roles('DESARROLLADOR', 'ADMIN')
  async updateLogo(@Body('logo_url') logoUrl: string, @Request() req) {
    return this.businessInfoService.updateLogo(logoUrl, req.user);
  }
}

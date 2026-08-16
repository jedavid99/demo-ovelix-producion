import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RepairCostsService } from './repair-costs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { createRepairCostSchema, updateRepairCostSchema } from './dto/repair-costs.dto';

@ApiTags('Costos de Reparación')
@ApiBearerAuth()
@Controller('repair-costs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RepairCostsController {
  constructor(private repairCostsService: RepairCostsService) {}

  @ApiOperation({ summary: 'Obtener los costos de reparación de la empresa' })
  @Get()
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'TECNICO', 'VENTAS')
  async findAll(
    @Request() req,
    @Query('search') search?: string,
    @Query('categoria') categoria?: string,
    @Query('tipo_equipo') tipo_equipo?: string,
  ) {
    return this.repairCostsService.findAll(req.user.empresa_id, search, categoria, tipo_equipo);
  }

  @ApiOperation({ summary: 'Obtener un costo de reparación por id' })
  @Get(':id')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'TECNICO', 'VENTAS')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.repairCostsService.findOne(id, req.user.empresa_id);
  }

  @ApiOperation({ summary: 'Crear un costo de reparación' })
  @Post()
  @Roles('DESARROLLADOR', 'ADMIN')
  async create(
    @Request() req,
    @Body(new ZodValidationPipe(createRepairCostSchema)) body: any,
  ) {
    return this.repairCostsService.create(req.user.empresa_id, body);
  }

  @ApiOperation({ summary: 'Actualizar un costo de reparación' })
  @Put(':id')
  @Roles('DESARROLLADOR', 'ADMIN')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Request() req,
    @Body(new ZodValidationPipe(updateRepairCostSchema)) body: any,
  ) {
    return this.repairCostsService.update(id, req.user.empresa_id, body);
  }

  @ApiOperation({ summary: 'Eliminar un costo de reparación' })
  @Delete(':id')
  @Roles('DESARROLLADOR', 'ADMIN')
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.repairCostsService.remove(id, req.user.empresa_id);
  }
}
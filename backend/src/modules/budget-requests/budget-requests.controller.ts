import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BudgetRequestsService } from './budget-requests.service';
import { UpdateBudgetRequestDto, updateBudgetRequestSchema } from './dto/update-budget-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@ApiTags('Solicitudes de presupuesto')
@ApiBearerAuth()
@Controller('budget-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BudgetRequestsController {
  constructor(private budgetRequestsService: BudgetRequestsService) {}

  @ApiOperation({ summary: 'Listar solicitudes de presupuesto con filtros y paginación' })
  @Get()
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA')
  async findAll(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('estado') estado?: string,
  ) {
    return this.budgetRequestsService.findAll(req.user, page ? parseInt(page) : 1, limit ? parseInt(limit) : 10, {
      estado,
    });
  }

  @ApiOperation({ summary: 'Obtener una solicitud de presupuesto por ID' })
  @Get(':id')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.budgetRequestsService.findOne(id, req.user);
  }

  @ApiOperation({ summary: 'Actualizar una solicitud (precio ajustado, notas, estado)' })
  @Put(':id')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateBudgetRequestSchema)) updateDto: UpdateBudgetRequestDto,
    @Request() req,
  ) {
    return this.budgetRequestsService.update(id, updateDto, req.user);
  }

  @ApiOperation({ summary: 'Convertir una solicitud confirmada en reparación (agregarla a la lista)' })
  @Post(':id/convert')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA')
  async convertToRepair(@Param('id') id: string, @Request() req) {
    return this.budgetRequestsService.convertToRepair(id, req.user);
  }

  @ApiOperation({ summary: 'Eliminar una solicitud de presupuesto' })
  @Delete(':id')
  @Roles('DESARROLLADOR', 'ADMIN')
  async delete(@Param('id') id: string, @Request() req) {
    return this.budgetRequestsService.remove(id, req.user);
  }
}
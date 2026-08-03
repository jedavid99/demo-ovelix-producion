import { Controller, Get, Post, Put, Delete, Patch, Body, Param, Query, UseGuards, Request, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto, createBudgetSchema } from './dto/create-budget.dto';
import { UpdateBudgetDto, updateBudgetSchema } from './dto/update-budget.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
@ApiTags('Presupuestos')
@ApiBearerAuth()
@Controller('budgets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BudgetsController {
  constructor(private budgetsService: BudgetsService) {}

  @ApiOperation({ summary: 'Listar presupuestos con filtros y paginación' })
  @Get()
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'TECNICO')
  async findAll(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('estado') estado?: string,
    @Query('reparacion_id') reparacion_id?: string,
  ) {
    return this.budgetsService.findAll(req.user, page ? parseInt(page) : 1, limit ? parseInt(limit) : 10, {
      estado,
      reparacion_id,
    });
  }

  @ApiOperation({ summary: 'Obtener presupuestos de una reparación' })
  @Get('repair/:reparacionId')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'TECNICO')
  async getByRepair(@Param('reparacionId', new ParseUUIDPipe({ version: '4' })) reparacionId: string, @Request() req) {
    return this.budgetsService.getByRepair(reparacionId, req.user);
  }

  @ApiOperation({ summary: 'Obtener un presupuesto por ID' })
  @Get(':id')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'TECNICO')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.budgetsService.findOne(id, req.user);
  }

  @ApiOperation({ summary: 'Crear un nuevo presupuesto' })
  @Post()
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'TECNICO')
  async create(@Body(new ZodValidationPipe(createBudgetSchema)) createBudgetDto: CreateBudgetDto, @Request() req) {
    return this.budgetsService.create(createBudgetDto, req.user);
  }

  @ApiOperation({ summary: 'Actualizar un presupuesto existente' })
  @Put(':id')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'TECNICO')
  async update(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Body(new ZodValidationPipe(updateBudgetSchema)) updateBudgetDto: UpdateBudgetDto, @Request() req) {
    return this.budgetsService.update(id, updateBudgetDto, req.user);
  }

  @ApiOperation({ summary: 'Aprobar un presupuesto' })
  @Post(':id/approve')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA')
  async approve(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.budgetsService.approve(id, req.user);
  }

  @ApiOperation({ summary: 'Rechazar un presupuesto' })
  @Post(':id/reject')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA')
  async reject(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req, @Body('notas') notas?: string) {
    return this.budgetsService.reject(id, notas, req.user);
  }

  @ApiOperation({ summary: 'Eliminar un presupuesto' })
  @Delete(':id')
  @Roles('DESARROLLADOR', 'ADMIN')
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.budgetsService.delete(id, req.user);
  }
}

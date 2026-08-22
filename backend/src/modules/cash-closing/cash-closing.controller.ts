import { Controller, Get, Post, Put, Delete, Patch, Body, Param, Query, UseGuards, Request, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CashClosingService } from './cash-closing.service';
import { CreateCashClosingDto, createCashClosingSchema } from './dto/create-cash-closing.dto';
import { UpdateCashClosingDto, updateCashClosingSchema } from './dto/update-cash-closing.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
@ApiTags('Cierre de Caja')
@ApiBearerAuth()
@Controller('cash-closing')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CashClosingController {
  constructor(private cashClosingService: CashClosingService) {}

  @ApiOperation({ summary: 'Listar cierres de caja con filtros y paginación' })
  @Get()
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA')
  async findAll(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('estado') estado?: string,
    @Query('fecha_desde') fecha_desde?: string,
    @Query('fecha_hasta') fecha_hasta?: string,
  ) {
    return this.cashClosingService.findAll(req.user, page ? parseInt(page) : 1, limit ? parseInt(limit) : 10, {
      estado,
      fecha_desde,
      fecha_hasta,
    });
  }

  @ApiOperation({ summary: 'Obtener un cierre de caja por ID' })
  @Get(':id')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.cashClosingService.findOne(id, req.user);
  }

  @ApiOperation({ summary: 'Crear un nuevo cierre de caja' })
  @Post()
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA')
  async create(@Body(new ZodValidationPipe(createCashClosingSchema)) createCashClosingDto: CreateCashClosingDto, @Request() req) {
    return this.cashClosingService.create(createCashClosingDto, req.user);
  }

  @ApiOperation({ summary: 'Actualizar un cierre de caja existente' })
  @Put(':id')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA')
  async update(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Body(new ZodValidationPipe(updateCashClosingSchema)) updateCashClosingDto: UpdateCashClosingDto, @Request() req) {
    return this.cashClosingService.update(id, updateCashClosingDto, req.user);
  }

  @ApiOperation({ summary: 'Eliminar un cierre de caja' })
  @Delete(':id')
  @Roles('DESARROLLADOR', 'ADMIN')
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.cashClosingService.delete(id, req.user);
  }

  @ApiOperation({ summary: 'Cerrar un cierre de caja' })
  @Patch(':id/close')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA')
  async close(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.cashClosingService.close(id, req.user);
  }

  @ApiOperation({ summary: 'Obtener los cierres de caja de una fecha determinada' })
  @Get('by-date/:date')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA')
  async getByDate(@Param('date') date: string, @Request() req) {
    return this.cashClosingService.getByDate(date, req.user);
  }

  @ApiOperation({ summary: 'Obtener resumen diario de ventas por método de pago' })
  @Get('daily-summary/:date')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA')
  async getDailySummary(@Param('date') date: string, @Request() req) {
    return this.cashClosingService.getDailySummary(date, req.user);
  }

  @ApiOperation({ summary: 'Verificar si es hora de cerrar la caja' })
  @Get('closing-time-check')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA')
  async checkClosingTime(@Request() req) {
    return this.cashClosingService.checkClosingTime(req.user);
  }
}

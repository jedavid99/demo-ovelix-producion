import { Controller, Get, Post, Put, Delete, Patch, Body, Param, Query, UseGuards, UseInterceptors, Request, Res, StreamableFile, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../../common/decorators/public.decorator';
import { RepairsService } from './repairs.service';
import { CreateRepairDto, createRepairSchema } from './dto/create-repair.dto';
import { UpdateRepairDto, updateRepairSchema } from './dto/update-repair.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { AddPartDto, addPartSchema } from './dto/add-part.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { GenerateConfigPdfDto, generateConfigPdfSchema } from './dto/generate-config-pdf.dto';
import { Response } from 'express';

@ApiTags('Reparaciones')
@ApiBearerAuth()
@Controller('repairs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RepairsController {
  constructor(private repairsService: RepairsService) {}

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 consultas por minuto por IP
  @ApiOperation({ summary: 'Buscar una reparación por su número de orden (público)' })
  @Get('public/:numeroReparacion')
  async findByOrderNumber(@Param('numeroReparacion') numeroReparacion: string) {
    return this.repairsService.findByOrderNumber(numeroReparacion);
  }

  @ApiOperation({ summary: 'Listar reparaciones con filtros y paginación' })
  @Get()
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'TECNICO', 'VENTAS')
  async findAll(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('estado') estado?: string,
    @Query('cliente_id') cliente_id?: string,
    @Query('tecnico_id') tecnico_id?: string,
    @Query('fecha_desde') fecha_desde?: string,
    @Query('fecha_hasta') fecha_hasta?: string,
  ) {
    return this.repairsService.findAll(req.user, page ? parseInt(page) : 1, limit ? parseInt(limit) : 10, {
      estado,
      cliente_id,
      tecnico_id,
      fecha_desde,
      fecha_hasta,
    });
  }

  @ApiOperation({ summary: 'Obtener una reparación por ID' })
  @Get(':id')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'TECNICO', 'VENTAS')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.repairsService.findOne(id, req.user);
  }

  @ApiOperation({ summary: 'Crear una nueva reparación' })
  @Post()
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA')
  async create(@Body(new ZodValidationPipe(createRepairSchema)) createRepairDto: CreateRepairDto, @Request() req) {
    return this.repairsService.create(createRepairDto, req.user);
  }

  @ApiOperation({ summary: 'Actualizar una reparación existente' })
  @Put(':id')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'TECNICO')
  async update(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Body(new ZodValidationPipe(updateRepairSchema)) updateRepairDto: UpdateRepairDto, @Request() req) {
    return this.repairsService.update(id, updateRepairDto, req.user);
  }

  @ApiOperation({ summary: 'Eliminar una reparación' })
  @Delete(':id')
  @Roles('DESARROLLADOR', 'ADMIN')
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.repairsService.delete(id, req.user);
  }

  @ApiOperation({ summary: 'Actualizar el estado de una reparación' })
  @Patch(':id/estado')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'TECNICO')
  async updateStatus(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Body() dto: UpdateStatusDto, @Request() req) {
    return this.repairsService.updateStatus(id, dto, req.user);
  }

  @ApiOperation({ summary: 'Obtener el historial de cambios de una reparación' })
  @Get(':id/historial')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'TECNICO')
  async getHistory(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.repairsService.getHistory(id, req.user);
  }

  @ApiOperation({ summary: 'Obtener los estados permitidos para una reparación' })
  @Get(':id/estados-permitidos')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'TECNICO')
  async getPermittedStates(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.repairsService.getPermittedStates(id, req.user);
  }

  @ApiOperation({ summary: 'Completar una reparación' })
  @Patch(':id/complete')
  @Roles('DESARROLLADOR', 'ADMIN', 'TECNICO')
  async complete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Body() data: { total_reparacion: number; metodo_pago?: string }, @Request() req) {
    return this.repairsService.complete(id, data, req.user);
  }

  @ApiOperation({ summary: 'Asignar un técnico a una reparación' })
  @Patch(':id/assign')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA')
  async assignTechnician(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Body('tecnico_id') tecnico_id: string, @Request() req) {
    return this.repairsService.assignTechnician(id, tecnico_id, req.user);
  }

  @ApiOperation({ summary: 'Agregar una pieza o repuesto a una reparación' })
  @Post(':id/parts')
  @Roles('DESARROLLADOR', 'ADMIN', 'TECNICO')
  async addPart(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Body(new ZodValidationPipe(addPartSchema)) addPartDto: AddPartDto, @Request() req) {
    return this.repairsService.addPart(id, addPartDto, req.user);
  }

  @ApiOperation({ summary: 'Obtener las reparaciones de un cliente' })
  @Get('client/:clienteId')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'TECNICO', 'VENTAS')
  async getByClient(@Param('clienteId') clienteId: string, @Request() req) {
    return this.repairsService.getByClient(clienteId, req.user);
  }

  @ApiOperation({ summary: 'Obtener las reparaciones de un técnico' })
  @Get('technician/:tecnicoId')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'TECNICO')
  async getByTechnician(@Param('tecnicoId', new ParseUUIDPipe({ version: '4' })) tecnicoId: string, @Request() req) {
    return this.repairsService.getByTechnician(tecnicoId, req.user);
  }

  @ApiOperation({ summary: 'Generar el PDF de la orden de servicio' })
  @Get(':id/pdf')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'TECNICO', 'VENTAS')
  @UseInterceptors()
  async generatePdf(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req, @Res() res: Response) {
    const pdfBuffer = await this.repairsService.generatePdf(id, req.user);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=orden-servicio-${id}.pdf`);
    res.send(pdfBuffer);
  }

  @ApiOperation({ summary: 'Generar un PDF de configuración de servicio' })
  @Post('generate-config-pdf')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'TECNICO', 'VENTAS')
  @UseInterceptors()
  async generateConfigPdf(@Body(new ZodValidationPipe(generateConfigPdfSchema)) body: GenerateConfigPdfDto, @Res() res: Response) {
    const pdfBuffer = await this.repairsService.generateConfigPdf(body);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=orden-servicio.pdf');
    res.send(pdfBuffer);
  }
}

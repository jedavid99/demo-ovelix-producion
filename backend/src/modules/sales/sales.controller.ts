import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSaleDto, createSaleSchema } from './dto/create-sale.dto';
import { UpdateSaleDto, updateSaleSchema } from './dto/update-sale.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
@ApiTags('Ventas')
@ApiBearerAuth()
@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesController {
  constructor(private salesService: SalesService) {}

  @ApiOperation({ summary: 'Listar ventas con filtros y paginación' })
  @Get()
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'VENTAS')
  async findAll(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('cliente_id') cliente_id?: string,
    @Query('vendedor_id') vendedor_id?: string,
    @Query('estado') estado?: string,
    @Query('fecha_desde') fecha_desde?: string,
    @Query('fecha_hasta') fecha_hasta?: string,
    @Query('metodo_pago') metodo_pago?: string,
  ) {
    return this.salesService.findAll(req.user, page ? parseInt(page) : 1, limit ? parseInt(limit) : 10, {
      cliente_id,
      vendedor_id,
      estado,
      fecha_desde,
      fecha_hasta,
      metodo_pago,
    });
  }

  @ApiOperation({ summary: 'Obtener una venta por ID' })
  @Get(':id')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'VENTAS')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.salesService.findOne(id, req.user);
  }

  @ApiOperation({ summary: 'Crear una nueva venta' })
  @Post()
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'VENTAS')
  async create(@Body(new ZodValidationPipe(createSaleSchema)) createSaleDto: CreateSaleDto, @Request() req) {
    return this.salesService.create(createSaleDto, req.user);
  }

  @ApiOperation({ summary: 'Actualizar una venta existente' })
  @Put(':id')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'VENTAS')
  async update(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Body(new ZodValidationPipe(updateSaleSchema)) updateSaleDto: UpdateSaleDto, @Request() req) {
    return this.salesService.update(id, updateSaleDto, req.user);
  }

  @ApiOperation({ summary: 'Anular una venta' })
  @Delete(':id/anular')
  @Roles('DESARROLLADOR', 'ADMIN')
  async anular(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.salesService.anular(id, req.user);
  }

  @ApiOperation({ summary: 'Obtener las ventas de una fecha determinada' })
  @Get('by-date/:date')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'VENTAS')
  async getByDate(@Param('date') date: string, @Request() req, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.salesService.getByDate(
      date,
      req.user,
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
    );
  }
}

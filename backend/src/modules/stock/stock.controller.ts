import { Controller, Get, Post, Put, Delete, Patch, Body, Param, Query, UseGuards, Request, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { StockService } from './stock.service';
import { CreateStockItemDto, createStockItemSchema } from './dto/create-stock-item.dto';
import { UpdateStockItemDto, updateStockItemSchema } from './dto/update-stock-item.dto';
import { AdjustStockDto, adjustStockSchema } from './dto/adjust-stock.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
@ApiTags('Stock')
@ApiBearerAuth()
@Controller('stock')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StockController {
  constructor(private stockService: StockService) {}

  @ApiOperation({ summary: 'Listar el stock con filtros y paginación' })
  @Get()
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'TECNICO', 'VENTAS')
  async findAll(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('categoria') categoria?: string,
    @Query('estado') estado?: string,
    @Query('search') search?: string,
  ) {
    return this.stockService.findAll(req.user, page ? parseInt(page) : 1, limit ? parseInt(limit) : 10, {
      categoria,
      estado,
      search,
    });
  }

  @ApiOperation({ summary: 'Obtener los ítems de stock bajo' })
  @Get('low')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'TECNICO')
  async getLowStock(@Request() req) {
    return this.stockService.getLowStock(req.user);
  }

  @ApiOperation({ summary: 'Obtener los movimientos de stock con filtros' })
  @Get('movements')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'TECNICO')
  async getMovements(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('tipo') tipo?: string,
    @Query('item_id') item_id?: string,
    @Query('fecha_desde') fecha_desde?: string,
    @Query('fecha_hasta') fecha_hasta?: string,
  ) {
    return this.stockService.getMovements(req.user, page ? parseInt(page) : 1, limit ? parseInt(limit) : 10, {
      tipo,
      item_id,
      fecha_desde,
      fecha_hasta,
    });
  }

  @ApiOperation({ summary: 'Obtener las categorías de stock' })
  @Get('categories')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'TECNICO', 'VENTAS')
  async getCategories(@Request() req) {
    return this.stockService.getCategories(req.user);
  }

  @ApiOperation({ summary: 'Obtener un ítem de stock por ID' })
  @Get(':id')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'TECNICO', 'VENTAS')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.stockService.findOne(id, req.user);
  }

  @ApiOperation({ summary: 'Crear un nuevo ítem de stock' })
  @Post()
  @Roles('DESARROLLADOR', 'ADMIN')
  async create(@Body(new ZodValidationPipe(createStockItemSchema)) createStockItemDto: CreateStockItemDto, @Request() req) {
    return this.stockService.create(createStockItemDto, req.user);
  }

  @ApiOperation({ summary: 'Ajustar el stock de un ítem' })
  @Post('adjust')
  @Roles('DESARROLLADOR', 'ADMIN')
  async adjust(@Body(new ZodValidationPipe(adjustStockSchema)) adjustStockDto: AdjustStockDto, @Request() req) {
    return this.stockService.adjust(adjustStockDto, req.user);
  }

  @ApiOperation({ summary: 'Actualizar un ítem de stock existente' })
  @Put(':id')
  @Roles('DESARROLLADOR', 'ADMIN')
  async update(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Body(new ZodValidationPipe(updateStockItemSchema)) updateStockItemDto: UpdateStockItemDto, @Request() req) {
    return this.stockService.update(id, updateStockItemDto, req.user);
  }

  @ApiOperation({ summary: 'Eliminar un ítem de stock' })
  @Delete(':id')
  @Roles('DESARROLLADOR', 'ADMIN')
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.stockService.delete(id, req.user);
  }

  @ApiOperation({ summary: 'Activar un ítem de stock' })
  @Patch(':id/activate')
  @Roles('DESARROLLADOR', 'ADMIN')
  async activate(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.stockService.activate(id, req.user);
  }

  @ApiOperation({ summary: 'Desactivar un ítem de stock' })
  @Patch(':id/deactivate')
  @Roles('DESARROLLADOR', 'ADMIN')
  async deactivate(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.stockService.deactivate(id, req.user);
  }
}

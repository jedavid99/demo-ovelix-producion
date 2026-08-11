import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto, UpdateExpenseDto, createExpenseSchema, updateExpenseSchema } from './dto/expense.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@ApiTags('Gastos')
@ApiBearerAuth()
@Controller('expenses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @ApiOperation({ summary: 'Listar gastos con filtros y paginación' })
  @Get()
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'VENTAS')
  async findAll(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('categoria') categoria?: string,
    @Query('estado') estado?: string,
    @Query('metodo_pago') metodo_pago?: string,
    @Query('search') search?: string,
    @Query('fecha_desde') fecha_desde?: string,
    @Query('fecha_hasta') fecha_hasta?: string,
  ) {
    return this.expensesService.findAll(req.user, page ? parseInt(page) : 1, limit ? parseInt(limit) : 10, {
      categoria,
      estado,
      metodo_pago,
      search,
      fecha_desde,
      fecha_hasta,
    });
  }

  @ApiOperation({ summary: 'Obtener resumen de gastos (KPIs)' })
  @Get('summary')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'VENTAS')
  async summary(@Request() req) {
    return this.expensesService.summary(req.user);
  }

  @ApiOperation({ summary: 'Obtener las categorías de gastos' })
  @Get('categories')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'VENTAS')
  async getCategories(@Request() req) {
    return this.expensesService.getCategories(req.user);
  }

  @ApiOperation({ summary: 'Obtener un gasto por ID' })
  @Get(':id')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'VENTAS')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.expensesService.findOne(id, req.user);
  }

  @ApiOperation({ summary: 'Crear un nuevo gasto' })
  @Post()
  @Roles('DESARROLLADOR', 'ADMIN', 'VENTAS')
  async create(@Body(new ZodValidationPipe(createExpenseSchema)) createExpenseDto: CreateExpenseDto, @Request() req) {
    return this.expensesService.create(createExpenseDto, req.user);
  }

  @ApiOperation({ summary: 'Actualizar un gasto existente' })
  @Put(':id')
  @Roles('DESARROLLADOR', 'ADMIN')
  async update(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Body(new ZodValidationPipe(updateExpenseSchema)) updateExpenseDto: UpdateExpenseDto, @Request() req) {
    return this.expensesService.update(id, updateExpenseDto, req.user);
  }

  @ApiOperation({ summary: 'Eliminar un gasto' })
  @Delete(':id')
  @Roles('DESARROLLADOR', 'ADMIN')
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.expensesService.delete(id, req.user);
  }
}

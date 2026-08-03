import { Controller, Get, Post, Put, Delete, Patch, Body, Param, Query, UseGuards, Request, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto, createClientSchema } from './dto/create-client.dto';
import { UpdateClientDto, updateClientSchema } from './dto/update-client.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
@ApiTags('Clientes')
@ApiBearerAuth()
@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @ApiOperation({ summary: 'Listar clientes con búsqueda y paginación' })
  @Get()
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'TECNICO', 'VENTAS')
  async findAll(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.clientsService.findAll(
      req.user,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      search,
    );
  }

  @ApiOperation({ summary: 'Obtener un cliente por ID' })
  @Get(':id')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'TECNICO', 'VENTAS')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.clientsService.findOne(id, req.user);
  }

  @ApiOperation({ summary: 'Obtener las reparaciones de un cliente' })
  @Get(':id/repairs')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'TECNICO', 'VENTAS')
  async getRepairs(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.clientsService.getRepairs(id, req.user);
  }

  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  @Post()
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA')
  async create(@Body(new ZodValidationPipe(createClientSchema)) createClientDto: CreateClientDto, @Request() req) {
    return this.clientsService.create(createClientDto, req.user);
  }

  @ApiOperation({ summary: 'Actualizar un cliente existente' })
  @Put(':id')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA')
  async update(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Body(new ZodValidationPipe(updateClientSchema)) updateClientDto: UpdateClientDto, @Request() req) {
    return this.clientsService.update(id, updateClientDto, req.user);
  }

  @ApiOperation({ summary: 'Eliminar un cliente' })
  @Delete(':id')
  @Roles('DESARROLLADOR', 'ADMIN')
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.clientsService.delete(id, req.user);
  }

  @ApiOperation({ summary: 'Activar un cliente' })
  @Patch(':id/activate')
  @Roles('DESARROLLADOR', 'ADMIN')
  async activate(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.clientsService.activate(id, req.user);
  }

  @ApiOperation({ summary: 'Desactivar un cliente' })
  @Patch(':id/deactivate')
  @Roles('DESARROLLADOR', 'ADMIN')
  async deactivate(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.clientsService.deactivate(id, req.user);
  }
}

import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { UpdateBookingEstadoDto, updateBookingEstadoSchema } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@ApiTags('Reservas')
@ApiBearerAuth()
@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @ApiOperation({ summary: 'Listar reservas con filtros y paginación' })
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
    return this.bookingsService.findAll(req.user, page ? parseInt(page) : 1, limit ? parseInt(limit) : 10, {
      estado,
      fecha_desde,
      fecha_hasta,
    });
  }

  @ApiOperation({ summary: 'Obtener una reserva por ID' })
  @Get(':id')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.bookingsService.findOne(id, req.user);
  }

  @ApiOperation({ summary: 'Actualizar el estado de una reserva' })
  @Put(':id/estado')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA')
  async updateEstado(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateBookingEstadoSchema)) updateDto: UpdateBookingEstadoDto,
    @Request() req,
  ) {
    return this.bookingsService.updateEstado(id, updateDto, req.user);
  }

  @ApiOperation({ summary: 'Eliminar una reserva' })
  @Delete(':id')
  @Roles('DESARROLLADOR', 'ADMIN')
  async delete(@Param('id') id: string, @Request() req) {
    return this.bookingsService.remove(id, req.user);
  }
}

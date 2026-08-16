import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../../common/decorators/public.decorator';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, createBookingSchema } from './dto/create-booking.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@Public()
@ApiTags('Reservas (público)')
@Controller('public/bookings')
export class BookingsPublicController {
  constructor(private bookingsService: BookingsService) {}

  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Crear una reserva de turno desde la página pública (sin autenticación)' })
  @Post()
  async create(@Body(new ZodValidationPipe(createBookingSchema)) createBookingDto: CreateBookingDto) {
    return this.bookingsService.createPublic(createBookingDto);
  }
}

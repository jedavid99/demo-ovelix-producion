import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../../common/decorators/public.decorator';
import { BudgetRequestsService } from './budget-requests.service';
import { CreateBudgetRequestDto, createBudgetRequestSchema } from './dto/create-budget-request.dto';
import { PayBudgetRequestDto, payBudgetRequestSchema } from './dto/pay-budget-request.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { z } from 'zod';

const numeroParamSchema = z.object({ numero: z.string().min(1).max(40) });

@Public()
@ApiTags('Solicitudes de presupuesto (público)')
@Controller('public/budget-requests')
export class BudgetRequestsPublicController {
  constructor(private budgetRequestsService: BudgetRequestsService) {}

  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Guardar una solicitud de presupuesto desde la página pública (sin autenticación)' })
  @Post()
  async create(@Body(new ZodValidationPipe(createBudgetRequestSchema)) createDto: CreateBudgetRequestDto) {
    return this.budgetRequestsService.createPublic(createDto);
  }

  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Consultar el estado de una solicitud por número de orden (público)' })
  @Get(':numero')
  async findByOrderNumber(@Param() params: { numero: string }) {
    return this.budgetRequestsService.findByOrderNumber(params.numero);
  }

  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'El cliente confirma la reparación con el costo enviado por el admin (público)' })
  @Post(':numero/confirm')
  async confirm(@Param() params: { numero: string }) {
    return this.budgetRequestsService.confirmPublic(params.numero);
  }

  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'El cliente registra la forma de pago cuando el admin ya confirmó el precio (público)' })
  @Post(':numero/payment')
  async pay(@Param() params: { numero: string }, @Body(new ZodValidationPipe(payBudgetRequestSchema)) payDto: PayBudgetRequestDto) {
    return this.budgetRequestsService.payPublic(params.numero, payDto);
  }

  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'El cliente cancela/elimina su reserva (cambió de opinión)' })
  @Delete(':numero')
  async cancel(@Param() params: { numero: string }) {
    return this.budgetRequestsService.cancelPublic(params.numero);
  }
}
import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Public } from '../../common/decorators/public.decorator';
import { BudgetRequestsService } from './budget-requests.service';
import { CreateBudgetRequestDto, createBudgetRequestSchema } from './dto/create-budget-request.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

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
  async findByOrderNumber(@Param('numero') numero: string) {
    return this.budgetRequestsService.findByOrderNumber(numero);
  }
}
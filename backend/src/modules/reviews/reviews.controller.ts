import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { createReviewSchema } from './dto/create-review.dto';

@ApiTags('Reseñas')
@ApiBearerAuth()
@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiOperation({ summary: 'Listar reseñas con filtros y paginación' })
  @Get()
  findAll(@Request() req, @Query('page') page?: string, @Query('limit') limit?: string, @Query('entidad') entidad?: string, @Query('entidad_id') entidad_id?: string) {
    const user = req.user;
    const empresa_id = user.rol === 'DESARROLLADOR' ? undefined : user.empresa_id;
    return this.reviewsService.findAll({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 50,
      empresa_id,
      entidad,
      entidad_id,
    });
  }

  @ApiOperation({ summary: 'Crear una nueva reseña' })
  @Post()
  async create(@Request() req, @Body(new ZodValidationPipe(createReviewSchema)) body: any) {
    return this.reviewsService.create(body, req.user);
  }
}

import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { CreateBrandDto, createBrandSchema } from './dto/create-brand.dto';
import { UpdateBrandDto, updateBrandSchema } from './dto/update-brand.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@ApiTags('Marcas')
@ApiBearerAuth()
@Controller('brands')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BrandsController {
  constructor(private brandsService: BrandsService) {}

  @ApiOperation({ summary: 'Listar todas las marcas de la empresa' })
  @Get()
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'TECNICO', 'VENTAS')
  async findAll(@Request() req, @Query('search') search?: string) {
    return this.brandsService.findAll(req.user.empresa_id, search);
  }

  @ApiOperation({ summary: 'Obtener una marca por ID' })
  @Get(':id')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'TECNICO', 'VENTAS')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.brandsService.findOne(id, req.user.empresa_id);
  }

  @ApiOperation({ summary: 'Crear una nueva marca' })
  @Post()
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'VENTAS')
  async create(@Body(new ZodValidationPipe(createBrandSchema)) createBrandDto: CreateBrandDto, @Request() req) {
    return this.brandsService.create(createBrandDto, req.user);
  }

  @ApiOperation({ summary: 'Actualizar una marca existente' })
  @Put(':id')
  @Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'VENTAS')
  async update(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Body(new ZodValidationPipe(updateBrandSchema)) updateBrandDto: UpdateBrandDto, @Request() req) {
    return this.brandsService.update(id, updateBrandDto, req.user);
  }

  @ApiOperation({ summary: 'Eliminar una marca' })
  @Delete(':id')
  @Roles('DESARROLLADOR', 'ADMIN')
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.brandsService.remove(id, req.user.empresa_id);
  }
}

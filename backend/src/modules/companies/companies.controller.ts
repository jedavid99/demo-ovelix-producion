import { Controller, Get, Post, Put, Patch, Body, Param, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto, createCompanySchema } from './dto/create-company.dto';
import { UpdateCompanyDto, updateCompanySchema } from './dto/update-company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
@ApiTags('Empresas')
@ApiBearerAuth()
@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @ApiOperation({ summary: 'Listar empresas con paginación' })
  @Get()
  @Roles('DESARROLLADOR')
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.companiesService.findAll(
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
    );
  }

  @ApiOperation({ summary: 'Obtener una empresa por ID' })
  @Get(':id')
  @Roles('DESARROLLADOR')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.companiesService.findOne(id);
  }

  @ApiOperation({ summary: 'Crear una nueva empresa' })
  @Post()
  @Roles('DESARROLLADOR')
  async create(@Body(new ZodValidationPipe(createCompanySchema)) createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @ApiOperation({ summary: 'Actualizar una empresa existente' })
  @Put(':id')
  @Roles('DESARROLLADOR')
  async update(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Body(new ZodValidationPipe(updateCompanySchema)) updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @ApiOperation({ summary: 'Activar una empresa' })
  @Patch(':id/activate')
  @Roles('DESARROLLADOR')
  async activate(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.companiesService.activate(id);
  }

  @ApiOperation({ summary: 'Desactivar una empresa' })
  @Patch(':id/deactivate')
  @Roles('DESARROLLADOR')
  async deactivate(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.companiesService.deactivate(id);
  }
}

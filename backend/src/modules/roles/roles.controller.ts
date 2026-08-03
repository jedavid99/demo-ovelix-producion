import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @ApiOperation({ summary: 'Listar todos los roles' })
  @Get()
  @Roles('DESARROLLADOR')
  async findAll() {
    return this.rolesService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un rol por ID' })
  @Get(':id')
  @Roles('DESARROLLADOR')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.rolesService.findOne(id);
  }

  @ApiOperation({ summary: 'Crear un nuevo rol' })
  @Post()
  @Roles('DESARROLLADOR')
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @ApiOperation({ summary: 'Actualizar un rol existente' })
  @Put(':id')
  @Roles('DESARROLLADOR')
  async update(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @ApiOperation({ summary: 'Eliminar un rol' })
  @Delete(':id')
  @Roles('DESARROLLADOR')
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.rolesService.delete(id);
  }
}

import { Controller, Get, Post, Put, Patch, Body, Param, Query, UseGuards, Request, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, createUserSchema } from './dto/create-user.dto';
import { UpdateUserDto, updateUserSchema } from './dto/update-user.dto';
import { ChangePasswordDto, changePasswordSchema } from './dto/change-password.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
@ApiTags('Usuarios')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Listar usuarios con paginación' })
  @Get()
  @Roles('DESARROLLADOR', 'ADMIN')
  async findAll(@Request() req, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.usersService.findAll(
      req.user,
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
    );
  }

  @ApiOperation({ summary: 'Listar solicitudes de usuarios pendientes de aprobación' })
  @Get('pending')
  @Roles('DESARROLLADOR', 'ADMIN')
  async findPending(@Request() req) {
    return this.usersService.findPending(req.user);
  }

  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @Get(':id')
  @Roles('DESARROLLADOR', 'ADMIN')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.usersService.findOne(id, req.user);
  }

  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @Post()
  @Roles('DESARROLLADOR', 'ADMIN')
  async create(@Body(new ZodValidationPipe(createUserSchema)) createUserDto: CreateUserDto, @Request() req) {
    return this.usersService.create(createUserDto, req.user);
  }

  @ApiOperation({ summary: 'Actualizar el propio perfil del usuario autenticado' })
  @Patch('me')
  async updateSelf(@Body(new ZodValidationPipe(updateUserSchema)) updateUserDto: UpdateUserDto, @Request() req) {
    return this.usersService.update(req.user.id, updateUserDto, req.user);
  }

  @ApiOperation({ summary: 'Actualizar un usuario existente' })
  @Put(':id')
  @Roles('DESARROLLADOR', 'ADMIN')
  async update(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Body(new ZodValidationPipe(updateUserSchema)) updateUserDto: UpdateUserDto, @Request() req) {
    return this.usersService.update(id, updateUserDto, req.user);
  }

  @ApiOperation({ summary: 'Activar un usuario' })
  @Patch(':id/activate')
  @Roles('DESARROLLADOR', 'ADMIN')
  async activate(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.usersService.activate(id, req.user);
  }

  @ApiOperation({ summary: 'Desactivar un usuario' })
  @Patch(':id/deactivate')
  @Roles('DESARROLLADOR', 'ADMIN')
  async deactivate(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.usersService.deactivate(id, req.user);
  }

  @ApiOperation({ summary: 'Cambiar la contraseña de un usuario' })
  @Post(':id/change-password')
  @Roles('DESARROLLADOR', 'ADMIN', 'TECNICO', 'RECEPCIONISTA', 'VENTAS')
  async changePassword(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Body(new ZodValidationPipe(changePasswordSchema)) changePasswordDto: ChangePasswordDto, @Request() req) {
    return this.usersService.changePassword(id, changePasswordDto, req.user);
  }

  @ApiOperation({ summary: 'Actualizar el estado de aprobación de un usuario' })
  @Patch(':id/status')
  @Roles('DESARROLLADOR', 'ADMIN')
  async updateStatus(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body('status') status: 'ACTIVE' | 'REJECTED',
    @Request() req,
  ) {
    return this.usersService.updateStatus(id, status, req.user);
  }
}

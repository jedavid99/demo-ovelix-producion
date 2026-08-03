import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { BackupsService } from './backups.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Respaldos')
@ApiBearerAuth()
@Controller('backups')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('DESARROLLADOR')
export class BackupsController {
  constructor(private readonly backupsService: BackupsService) {}

  @ApiOperation({ summary: 'Listar todos los respaldos de base de datos' })
  @Get()
  findAll() {
    return this.backupsService.findAll();
  }

  @ApiOperation({ summary: 'Crear un nuevo respaldo de base de datos' })
  @Post()
  create() {
    return this.backupsService.create();
  }

  @ApiOperation({ summary: 'Descargar un respaldo por ID' })
  @Get(':id/download')
  download(@Param('id') id: string) {
    return this.backupsService.download(id);
  }

  @ApiOperation({ summary: 'Eliminar un respaldo' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.backupsService.delete(id);
  }
}

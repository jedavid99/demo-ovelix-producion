import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DatabaseService } from './database.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Base de Datos')
@ApiBearerAuth()
@Controller('database')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('DESARROLLADOR')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @ApiOperation({ summary: 'Obtener estadísticas de la base de datos' })
  @Get('stats')
  getStats() {
    return this.databaseService.getStats();
  }
}

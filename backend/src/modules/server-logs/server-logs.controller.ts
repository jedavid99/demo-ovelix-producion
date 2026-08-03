import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ServerLogsService } from './server-logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Logs del Servidor')
@ApiBearerAuth()
@Controller('server-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('DESARROLLADOR')
export class ServerLogsController {
  constructor(private readonly serverLogsService: ServerLogsService) {}

  @ApiOperation({ summary: 'Listar logs del servidor con filtros y paginación' })
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('level') level?: string,
    @Query('module') module?: string,
  ) {
    return this.serverLogsService.findAll({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 100,
      level,
      module,
    });
  }

  @ApiOperation({ summary: 'Obtener estadísticas de los logs del servidor' })
  @Get('stats')
  getStats() {
    return this.serverLogsService.getStats();
  }
}

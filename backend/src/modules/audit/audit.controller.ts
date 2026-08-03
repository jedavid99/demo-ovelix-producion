import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Auditoría')
@ApiBearerAuth()
@Controller('audit')
@UseGuards(JwtAuthGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @ApiOperation({ summary: 'Listar registros de auditoría con filtros y paginación' })
  @Get()
  findAll(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('usuario_id') usuario_id?: string,
    @Query('entidad') entidad?: string,
  ) {
    const user = req.user;
    const isDev = user.rol === 'DESARROLLADOR';
    const isAdmin = user.rol === 'ADMIN';

    let empresa_id = user.empresa_id;
    if (isDev) {
      empresa_id = undefined;
    }

    let effectiveUsuarioId = usuario_id;
    if (!isDev && !isAdmin && usuario_id && usuario_id !== user.id) {
      effectiveUsuarioId = user.id;
    } else if (!isDev && !isAdmin) {
      effectiveUsuarioId = user.id;
    }

    return this.auditService.findAll({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 50,
      empresa_id,
      usuario_id: effectiveUsuarioId,
      entidad,
    });
  }

  @ApiOperation({ summary: 'Obtener estadísticas de auditoría' })
  @Get('stats')
  getStats(@Request() req) {
    const user = req.user;
    const empresa_id = user.rol === 'DESARROLLADOR' ? undefined : user.empresa_id;
    return this.auditService.getStats(empresa_id);
  }
}

import { Controller, Get, Post, Delete, Put, Body, Param, UseGuards, Request, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Notificaciones')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({ summary: 'Listar las notificaciones del usuario autenticado' })
  @Get()
  async findAll(@Request() req, @Query('unreadOnly') unreadOnly?: string) {
    return this.notificationsService.findByUser(req.user.id, unreadOnly === 'true');
  }

  @ApiOperation({ summary: 'Obtener el conteo de notificaciones no leídas' })
  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    const count = await this.notificationsService.getUnreadCount(req.user.id);
    return { count };
  }

  @ApiOperation({ summary: 'Marcar una notificación como leída' })
  @Post('mark-read/:id')
  async markAsRead(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.notificationsService.markAsRead(id, req.user.id);
  }

  @ApiOperation({ summary: 'Marcar todas las notificaciones como leídas' })
  @Post('mark-all-read')
  async markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }

  @ApiOperation({ summary: 'Eliminar una notificación' })
  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Request() req) {
    return this.notificationsService.delete(id, req.user.id);
  }
}

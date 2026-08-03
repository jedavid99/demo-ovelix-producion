import { Controller, Get, Post, Body, Query, HttpException, HttpStatus, Res, Header, Param, UseInterceptors, Request, UseGuards, Logger, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { WhatsappService } from './whatsapp.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PrismaService } from '../../database/prisma.service';
import { RepairsService } from '../repairs/repairs.service';

@ApiTags('WhatsApp')
@ApiBearerAuth()
@Controller('whatsapp')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('DESARROLLADOR', 'ADMIN', 'RECEPCIONISTA', 'VENTAS', 'TECNICO')
export class WhatsappController {
  constructor(
    private readonly ws: WhatsappService,
    private readonly prisma: PrismaService,
    private readonly repairsService: RepairsService,
  ) {}

  private readonly logger = new Logger(WhatsappController.name);

  @ApiOperation({ summary: 'Obtener el estado de la sesión de WhatsApp de la empresa' })
  @Get('status')
  async getStatus(@Request() req) {
    const empresaId = req.user.empresa_id;
    if (!empresaId) {
      throw new HttpException('Usuario no tiene empresa asignada', HttpStatus.BAD_REQUEST);
    }
    const status = await this.ws.getSessionStatus(empresaId);
    return {
      connected: this.ws.isConnected(empresaId),
      ...status,
    };
  }

  @ApiOperation({ summary: 'Obtener la imagen del código QR de la sesión' })
  @Get('qr.png')
  @Header('Content-Type', 'image/png')
  async getQRImage(@Request() req, @Res() res: Response) {
    try {
      const empresaId = req.user.empresa_id;
      if (!empresaId) {
        throw new HttpException('Usuario no tiene empresa asignada', HttpStatus.BAD_REQUEST);
      }
      const qrBuffer = await this.ws.getQRAsPNG(empresaId);
      res.send(qrBuffer);
    } catch (error) {
      throw new HttpException('QR no disponible', HttpStatus.NOT_FOUND);
    }
  }

  @ApiOperation({ summary: 'Generar un nuevo código QR de vinculación' })
  @Post('generate-qr')
  @Roles('DESARROLLADOR', 'ADMIN')
  async generateQR(@Request() req) {
    const empresaId = req.user.empresa_id;
    if (!empresaId) {
      throw new HttpException('Usuario no tiene empresa asignada', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.ws.generateQR(empresaId);
      return { success: true };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Regenerar el código QR de vinculación' })
  @Post('regenerate-qr')
  @Roles('DESARROLLADOR', 'ADMIN')
  async regenerateQR(@Request() req) {
    const empresaId = req.user.empresa_id;
    if (!empresaId) {
      throw new HttpException('Usuario no tiene empresa asignada', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.ws.regenerateQR(empresaId);
      return { success: true };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Solicitar un código de vinculación por número de teléfono' })
  @Post('request-pairing-code')
  @Roles('DESARROLLADOR', 'ADMIN')
  async requestPairingCode(@Request() req, @Body() body: { phoneNumber: string }) {
    const empresaId = req.user.empresa_id;
    if (!empresaId) {
      throw new HttpException('Usuario no tiene empresa asignada', HttpStatus.BAD_REQUEST);
    }
    if (!body.phoneNumber) {
      throw new HttpException('Número de teléfono requerido', HttpStatus.BAD_REQUEST);
    }
    try {
      const code = await this.ws.requestPairingCode(empresaId, body.phoneNumber);
      return { success: true, pairingCode: code };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Desconectar la sesión de WhatsApp de la empresa' })
  @Post('disconnect')
  @Roles('DESARROLLADOR', 'ADMIN')
  async disconnect(@Request() req) {
    const empresaId = req.user.empresa_id;
    if (!empresaId) {
      throw new HttpException('Usuario no tiene empresa asignada', HttpStatus.BAD_REQUEST);
    }
    try {
      await this.ws.disconnectCompany(empresaId);
      return { success: true };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Enviar un mensaje de texto por WhatsApp' })
  @Post('send')
  async send(@Request() req: any, @Body() body: { to: string; message: string; clienteId?: string }) {
    try {
      const empresaId = req.user.empresa_id;
      if (!empresaId) {
        throw new HttpException('Usuario no tiene empresa asignada', HttpStatus.BAD_REQUEST);
      }
      return await this.ws.sendText(empresaId, body.to, body.message, body.clienteId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Enviar una imagen por WhatsApp' })
  @Post('send-image')
  async sendImage(@Request() req: any, @Body() body: { to: string; imageUrl: string; caption?: string }) {
    try {
      const empresaId = req.user.empresa_id;
      if (!empresaId) {
        throw new HttpException('Usuario no tiene empresa asignada', HttpStatus.BAD_REQUEST);
      }
      return await this.ws.sendImage(empresaId, body.to, body.imageUrl, body.caption);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Enviar un documento por WhatsApp' })
  @Post('send-document')
  async sendDocument(@Request() req: any, @Body() body: { to: string; pdfUrl: string; filename: string; caption?: string }) {
    try {
      const empresaId = req.user.empresa_id;
      if (!empresaId) {
        throw new HttpException('Usuario no tiene empresa asignada', HttpStatus.BAD_REQUEST);
      }
      return await this.ws.sendDocument(empresaId, body.to, body.pdfUrl, body.filename, body.caption);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Obtener los chats de WhatsApp de la empresa' })
  @Get('chats')
  async getChats(@Request() req: any) {
    const empresaId = req.user.empresa_id;
    if (!empresaId) {
      throw new HttpException('Usuario no tiene empresa asignada', HttpStatus.BAD_REQUEST);
    }
    try {
      return await this.ws.getChats(empresaId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Obtener mensajes de un chat por JID' })
  @Get('messages')
  async getMessages(
    @Request() req: any,
    @Query('jid') jid: string,
    @Query('limit') limit?: string,
  ) {
    if (!jid) throw new HttpException('jid es requerido', HttpStatus.BAD_REQUEST);
    const empresaId = req.user.empresa_id;
    if (!empresaId) {
      throw new HttpException('Usuario no tiene empresa asignada', HttpStatus.BAD_REQUEST);
    }
    try {
      const limitNum = limit ? parseInt(limit, 10) : 50;
      return await this.ws.getMessages(empresaId, jid, limitNum);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Obtener mensajes de WhatsApp de un cliente' })
  @Get('messages/client/:clienteId')
  async getClientMessages(
    @Request() req: any,
    @Param('clienteId', new ParseUUIDPipe({ version: '4' })) clienteId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      const pageNum = page ? parseInt(page) : 1;
      const limitNum = limit ? parseInt(limit) : 50;
      return await this.ws.getMessagesByClient(
        clienteId,
        pageNum,
        limitNum,
        req.user.empresa_id,
        req.user.rol
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Error obteniendo mensajes del cliente:', error.stack ?? error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Simular la recepción de un mensaje de prueba (solo desarrollo)' })
  @Post('test-receive-message')
  @Roles('DESARROLLADOR')
  async testReceiveMessage(@Request() req: any, @Body() body: { clienteId: string; mensaje: string; numero: string }) {
    if (process.env.NODE_ENV === 'production') {
      throw new HttpException('Endpoint de prueba deshabilitado en producción', HttpStatus.FORBIDDEN);
    }
    try {
      const mockMessage = {
        key: {
          remoteJid: body.numero,
          fromMe: false,
        },
        message: {
          conversation: body.mensaje,
        },
        messageTimestamp: Math.floor(Date.now() / 1000),
      };

      const empresaId = req.user.empresa_id;
      if (!empresaId) {
        throw new HttpException('Usuario no tiene empresa asignada', HttpStatus.BAD_REQUEST);
      }
      await this.ws.saveReceivedMessage(mockMessage, empresaId);

      return { success: true, message: 'Mensaje de prueba recibido y guardado' };
    } catch (error) {
      this.logger.error('Error en prueba de mensaje recibido:', error.stack ?? error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Enviar un mensaje a un cliente por su ID' })
  @Post('send-to-client')
  async sendToClient(@Request() req, @Body() body: { clienteId: string; message: string }) {
    try {
      const empresaId = req.user.empresa_id;
      if (!empresaId) {
        throw new HttpException('Usuario no tiene empresa asignada', HttpStatus.BAD_REQUEST);
      }

      const cliente = await this.prisma.client.findFirst({
        where: { id: body.clienteId, empresa_id: empresaId },
      });

      if (!cliente) {
        throw new HttpException('Cliente no encontrado', HttpStatus.NOT_FOUND);
      }

      const result = await this.ws.sendText(empresaId, cliente.telefono, body.message, body.clienteId);
      return result;
    } catch (error) {
      this.logger.error('Error enviando mensaje:', error.stack ?? error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Obtener los clientes activos de la empresa para WhatsApp' })
  @Get('clients')
  async getClients(@Request() req) {
    try {
      const empresaId = req.user.empresa_id;
      if (!empresaId) {
        throw new HttpException('Usuario no tiene empresa asignada', HttpStatus.BAD_REQUEST);
      }

      const clients = await this.prisma.client.findMany({
        where: {
          estado: 'activo',
          empresa_id: empresaId,
        },
        select: {
          id: true,
          nombre_completo: true,
          telefono: true,
          email: true,
          fecha_registro: true,
        },
      });
      return clients;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Enviar el PDF de una orden de servicio por WhatsApp' })
  @Post('send-order-pdf')
  @UseInterceptors()
  async sendOrderPdf(@Request() req, @Body() body: { clienteId: string; repairId: string; caption?: string }) {
    try {
      const empresaId = req.user.empresa_id;
      if (!empresaId) {
        throw new HttpException('Usuario no tiene empresa asignada', HttpStatus.BAD_REQUEST);
      }

      const cliente = await this.prisma.client.findFirst({
        where: { id: body.clienteId, empresa_id: empresaId },
      });

      if (!cliente) {
        throw new HttpException('Cliente no encontrado', HttpStatus.NOT_FOUND);
      }

      const pdfBuffer = await this.repairsService.generatePdf(body.repairId, req.user);

      const filename = `orden-servicio-${body.repairId}.pdf`;
      const result = await this.ws.sendDocumentBuffer(
        empresaId,
        cliente.telefono,
        pdfBuffer,
        filename,
        body.caption,
        body.clienteId
      );

      return result;
    } catch (error) {
      this.logger.error('Error enviando PDF:', error.stack ?? error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

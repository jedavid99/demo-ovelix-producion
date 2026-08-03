import { Injectable, OnModuleInit, HttpException, HttpStatus, Logger } from '@nestjs/common';
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import * as fs from 'fs/promises';
import axios from 'axios';
import * as QRCode from 'qrcode';
import { PrismaService } from '../../database/prisma.service';

interface WhatsAppSessionData {
  sock: any;
  qrCode: string | null;
  isReady: boolean;
  authFolder: string;
  pairingInProgress: boolean;
}

@Injectable()
export class WhatsappService implements OnModuleInit {
  private sessions: Map<string, WhatsAppSessionData> = new Map();
  private connecting: Set<string> = new Set();
  private readonly baseAuthFolder = 'auth_info';
  private readonly logger = new Logger(WhatsappService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const sessions = await this.prisma.whatsAppSession.findMany({
      where: { estado: 'connected' },
    });
    for (const session of sessions) {
      this.logger.log('🔄 Reconnectando sesión para empresa:', session.empresa_id);
      this.connectCompany(session.empresa_id);
    }
  }

  private getSessionKey(empresaId: string): string {
    return `${empresaId}`;
  }

  private getAuthFolder(empresaId: string): string {
    return `${this.baseAuthFolder}/${empresaId}`;
  }

  private async connectCompany(empresaId: string, retryCount = 0): Promise<void> {
    this.logger.log('🔌 connectCompany llamado con:', { empresaId, retryCount });
    const sessionKey = this.getSessionKey(empresaId);
    const authFolder = this.getAuthFolder(empresaId);

    if (this.connecting.has(empresaId)) return;
    this.connecting.add(empresaId);

    try {
      const existing = this.sessions.get(sessionKey);
      if (existing?.isReady) {
        this.logger.log('✅ Sesión ya está conectada');
        return;
      }
      if (existing) {
        existing.sock.end(undefined).catch(() => {});
        this.sessions.delete(sessionKey);
      }

      await fs.mkdir(authFolder, { recursive: true });

      this.logger.log('🔑 Inicializando estado de autenticación');
      const { state, saveCreds } = await useMultiFileAuthState(authFolder);

      this.logger.log('📱 Creando socket de WhatsApp');
      const sock = makeWASocket({
        auth: state,
        browser: ['Chrome', '120', 'Windows'],
      });

      sock.ev.on('creds.update', async () => {
        await saveCreds();
        const session = this.sessions.get(sessionKey);
        if (session?.pairingInProgress) {
          session.pairingInProgress = false;
          this.logger.log('🔗 Vinculación detectada, actualizando estado');
          await this.prisma.whatsAppSession.update({
            where: { empresa_id: empresaId },
            data: { estado: 'linking' },
          }).catch(() => {});
        }
      });

      sock.ev.on('connection.update', async (update: any) => {
        this.logger.log('📡 Connection update:', update);
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          this.logger.log('📲 QR recibido');
          const session = this.sessions.get(sessionKey);
          if (session) session.pairingInProgress = true;
          try {
            await this.prisma.whatsAppSession.upsert({
              where: { empresa_id: empresaId },
              update: {
                qr_code: qr,
                qr_expires_at: new Date(Date.now() + 5 * 60 * 1000),
                estado: 'qr_generated',
              },
              create: {
                empresa_id: empresaId,
                qr_code: qr,
                estado: 'qr_generated',
              },
            });
          } catch (error) {
            this.logger.error('❌ Error guardando QR en BD:', error.stack ?? error);
          }
        }

        if (connection === 'close') {
          const closedSession = this.sessions.get(sessionKey);
          if (closedSession) closedSession.pairingInProgress = false;
          this.sessions.delete(sessionKey);
          const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
          const isLoggedOut = statusCode === DisconnectReason.loggedOut;
          const isTransient = statusCode === DisconnectReason.connectionLost
            || statusCode === DisconnectReason.connectionClosed
            || statusCode === DisconnectReason.timedOut
            || statusCode === DisconnectReason.restartRequired;

          if (isLoggedOut) {
            this.logger.log('🚪 Sesión desconectada (logout)');
            await this.disconnectCompany(empresaId);
          } else if (isTransient && retryCount < 5) {
            const delay = Math.min(1000 * Math.pow(2, retryCount), 60000);
            this.logger.log(`🔄 Error transitorio, reintento ${retryCount + 1}/5 en ${delay / 1000}s...`);
            setTimeout(() => this.connectCompany(empresaId, retryCount + 1), delay);
          } else if (isTransient) {
            this.logger.log('❌ Error transitorio persistente, máximo de reintentos alcanzado');
            await this.prisma.whatsAppSession.update({
              where: { empresa_id: empresaId },
              data: { estado: 'error', qr_code: null },
            }).catch(() => {});
          } else {
            this.logger.log('❌ Error de conexión no recuperable');
            await this.prisma.whatsAppSession.update({
              where: { empresa_id: empresaId },
              data: { estado: 'error', qr_code: null },
            }).catch(() => {});
          }
        }

        if (connection === 'open') {
          this.logger.log('✅ Conexión abierta');
          const openSession = this.sessions.get(sessionKey);
          if (openSession) openSession.pairingInProgress = false;
          const user = sock.user;
          const phoneNumber = user?.id?.split(':')[0];

          await this.prisma.whatsAppSession.update({
            where: { empresa_id: empresaId },
            data: {
              estado: 'connected',
              telefono: phoneNumber,
              qr_code: null,
              qr_expires_at: null,
              last_activity: new Date(),
            },
          });

          this.sessions.set(sessionKey, {
            sock,
            qrCode: null,
            isReady: true,
            authFolder,
            pairingInProgress: false,
          });
        }
      });

      sock.ev.on('messages.upsert', async (m: any) => {
        const msg = m.messages[0];
        if (!msg.key.fromMe) {
          await this.saveReceivedMessage(msg, empresaId);
        }
      });

      this.sessions.set(sessionKey, {
        sock,
        qrCode: null,
        isReady: false,
        authFolder,
        pairingInProgress: false,
      });
    } finally {
      this.connecting.delete(empresaId);
    }
  }

  async generateQR(empresaId: string): Promise<void> {
    this.logger.log('🔧 generateQR llamado con:', { empresaId });

    await this.prisma.whatsAppSession.upsert({
      where: { empresa_id: empresaId },
      update: { estado: 'connecting', last_activity: new Date(), qr_code: null },
      create: { empresa_id: empresaId, estado: 'connecting' },
    });

    this.connectCompany(empresaId);
  }

  async regenerateQR(empresaId: string): Promise<void> {
    this.logger.log('🔧 regenerateQR llamado con:', { empresaId });
    await this.disconnectCompany(empresaId);
    await this.generateQR(empresaId);
  }

  async requestPairingCode(empresaId: string, phoneNumber: string): Promise<string> {
    this.logger.log('🔌 requestPairingCode llamado con:', { empresaId, phoneNumber });
    const sessionKey = this.getSessionKey(empresaId);
    const authFolder = this.getAuthFolder(empresaId);

    await this.prisma.whatsAppSession.upsert({
      where: { empresa_id: empresaId },
      update: { estado: 'connecting', last_activity: new Date() },
      create: { empresa_id: empresaId, estado: 'connecting' },
    });

    await fs.rm(authFolder, { recursive: true, force: true }).catch(() => {});
    await fs.mkdir(authFolder, { recursive: true });

    const { state, saveCreds } = await useMultiFileAuthState(authFolder);

    const sock = makeWASocket({
      auth: state,
      browser: ['Chrome', '120', 'Windows'],
      syncFullHistory: false,
    });

    sock.ev.on('creds.update', async () => {
      await saveCreds();
      const session = this.sessions.get(sessionKey);
      if (session?.pairingInProgress) {
        session.pairingInProgress = false;
        this.logger.log('🔗 Vinculación detectada (pairing code), actualizando estado');
        await this.prisma.whatsAppSession.update({
          where: { empresa_id: empresaId },
          data: { estado: 'linking' },
        }).catch(() => {});
      }
    });

    // Store session immediately so reconnection works
    this.sessions.set(sessionKey, { sock, qrCode: null, isReady: false, authFolder, pairingInProgress: false });

    const code = await new Promise<string>((resolve, reject) => {
      let pairingRequested = false;
      const timeout = setTimeout(() => {
        reject(new Error('No se pudo conectar con WhatsApp. Verifica tu conexión a internet.'));
      }, 60000);

      sock.ev.on('connection.update', async (update: any) => {
        const { connection, lastDisconnect, qr } = update;

        if (connection === 'close') {
          this.sessions.delete(sessionKey);
          clearTimeout(timeout);
          const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
          const isLoggedOut = statusCode === DisconnectReason.loggedOut;
          const isTransient = !isLoggedOut && (
            statusCode === DisconnectReason.connectionLost
            || statusCode === DisconnectReason.connectionClosed
            || statusCode === DisconnectReason.timedOut
            || statusCode === DisconnectReason.restartRequired
          );

          if (isLoggedOut) {
            reject(new Error('Sesión cerrada'));
          } else if (isTransient) {
            reject(new Error('Conexión perdida. Intenta de nuevo.'));
          } else {
            reject(new Error('No se pudo conectar con WhatsApp'));
          }
        }

        if (connection === 'open') {
          clearTimeout(timeout);
          const user = sock.user;
          const phone = user?.id?.split(':')[0];
          await this.prisma.whatsAppSession.update({
            where: { empresa_id: empresaId },
            data: {
              estado: 'connected',
              telefono: phone,
              last_activity: new Date(),
            },
          });
          this.sessions.set(sessionKey, { sock, qrCode: null, isReady: true, authFolder, pairingInProgress: false });
          resolve('');
        }

        if (!pairingRequested && connection === 'connecting' && !qr) {
          pairingRequested = true;
          try {
            const pairingCode = await sock.requestPairingCode(phoneNumber);
            clearTimeout(timeout);
            const pairingSession = this.sessions.get(sessionKey);
            if (pairingSession) pairingSession.pairingInProgress = true;
            resolve(pairingCode);
          } catch (err) {
            clearTimeout(timeout);
            reject(new Error('Error al solicitar código de vinculación'));
          }
        }
      });
    });

    return code;
  }

  async disconnectCompany(empresaId: string): Promise<void> {
    const sessionKey = this.getSessionKey(empresaId);
    const session = this.sessions.get(sessionKey);

    if (session?.sock) {
      await session.sock.logout();
      session.sock.end(undefined);
    }

    this.sessions.delete(sessionKey);

    const authFolder = this.getAuthFolder(empresaId);
    await fs.rm(authFolder, { recursive: true, force: true }).catch(() => {});

    await this.prisma.whatsAppSession.update({
      where: { empresa_id: empresaId },
      data: {
        estado: 'disconnected',
        qr_code: null,
        qr_expires_at: null,
        telefono: null,
      },
    }).catch(() => {});
  }

  getSession(empresaId: string): WhatsAppSessionData | undefined {
    const sessionKey = this.getSessionKey(empresaId);
    return this.sessions.get(sessionKey);
  }

  async getSessionStatus(empresaId: string) {
    const session = await this.prisma.whatsAppSession.findUnique({
      where: { empresa_id: empresaId },
    });

    if (!session) {
      return { estado: 'disconnected', qr_code: null, qr_image: null, telefono: null };
    }

    if (session.estado === 'qr_generated' && session.qr_expires_at && new Date() > session.qr_expires_at) {
      await this.prisma.whatsAppSession.update({
        where: { empresa_id: empresaId },
        data: { estado: 'disconnected', qr_code: null, qr_expires_at: null },
      }).catch(() => {});
      return { estado: 'disconnected', qr_code: null, qr_image: null, telefono: null };
    }

    let qr_image: string | null = null;
    if (session.qr_code) {
      try {
        qr_image = await QRCode.toDataURL(session.qr_code);
      } catch (e) {
        this.logger.error('Error generando imagen QR:', e.stack ?? e);
      }
    }

    return {
      estado: session.estado,
      qr_code: session.qr_code,
      qr_image,
      telefono: session.telefono,
    };
  }

  async getQRAsPNG(empresaId: string): Promise<Buffer> {
    const session = await this.prisma.whatsAppSession.findUnique({
      where: { empresa_id: empresaId },
    });
    if (!session?.qr_code) throw new Error('QR no disponible');
    return await QRCode.toBuffer(session.qr_code);
  }

  isConnected(empresaId: string): boolean {
    const session = this.getSession(empresaId);
    return session?.isReady || false;
  }

  private normalizePhoneNumber(phone: string): string {
    let normalized = phone.replace(/\D/g, '');
    if (!normalized) return phone;

    if (normalized.startsWith('549')) return normalized;

    if (normalized.startsWith('54')) {
      normalized = normalized.substring(2);
    }

    if (normalized.startsWith('15')) {
      normalized = '11' + normalized.substring(2);
    }

    return '549' + normalized;
  }

  async sendText(empresaId: string, to: string, text: string, clienteId?: string) {
    const session = this.getSession(empresaId);
    if (!session?.isReady) throw new Error('WhatsApp no conectado para esta empresa');

    const normalizedPhone = this.normalizePhoneNumber(to);
    const jid = to.includes('@s.whatsapp.net') ? to : `${normalizedPhone}@s.whatsapp.net`;

    const result = await session.sock.sendMessage(jid, { text });

    if (clienteId) {
      try {
        await this.prisma.mensajeWhatsapp.create({
          data: {
            cliente_id: clienteId,
            numero_telefono: normalizedPhone,
            direccion: 'sent',
            mensaje: text,
            tipo: 'text',
            fecha_envio: new Date(),
            whatsapp_message_id: result.key?.id,
          },
        });
      } catch (error) {
        this.logger.error('❌ Error guardando mensaje en BD:', error.stack ?? error);
      }
    }

    return { success: true, messageId: result.key?.id };
  }

  async sendImage(empresaId: string, to: string, imageUrl: string, caption?: string) {
    const session = this.getSession(empresaId);
    if (!session?.isReady) throw new Error('WhatsApp no conectado para esta empresa');

    const normalizedPhone = this.normalizePhoneNumber(to);
    const jid = to.includes('@s.whatsapp.net') ? to : `${normalizedPhone}@s.whatsapp.net`;
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    await session.sock.sendMessage(jid, {
      image: buffer,
      caption: caption || '',
    });
    return { success: true };
  }

  async sendDocument(empresaId: string, to: string, pdfUrl: string, filename: string, caption?: string) {
    const session = this.getSession(empresaId);
    if (!session?.isReady) throw new Error('WhatsApp no conectado para esta empresa');

    const normalizedPhone = this.normalizePhoneNumber(to);
    const jid = to.includes('@s.whatsapp.net') ? to : `${normalizedPhone}@s.whatsapp.net`;
    const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    await session.sock.sendMessage(jid, {
      document: buffer,
      mimetype: 'application/pdf',
      fileName: filename,
      caption: caption || '',
    });
    return { success: true };
  }

  async sendDocumentBuffer(empresaId: string, to: string, pdfBuffer: Buffer, filename: string, caption?: string, clienteId?: string) {
    const session = this.getSession(empresaId);
    if (!session?.isReady) throw new Error('WhatsApp no conectado para esta empresa');

    const normalizedPhone = this.normalizePhoneNumber(to);
    const jid = to.includes('@s.whatsapp.net') ? to : `${normalizedPhone}@s.whatsapp.net`;

    const result = await session.sock.sendMessage(jid, {
      document: pdfBuffer,
      mimetype: 'application/pdf',
      fileName: filename,
      caption: caption || '',
    });

    if (clienteId) {
      try {
        await this.prisma.mensajeWhatsapp.create({
          data: {
            cliente_id: clienteId,
            numero_telefono: normalizedPhone,
            direccion: 'sent',
            mensaje: caption || `Documento: ${filename}`,
            tipo: 'pdf',
            archivo_url: filename,
            fecha_envio: new Date(),
            whatsapp_message_id: result.key?.id,
          },
        });
      } catch (error) {
        this.logger.error('Error guardando mensaje PDF en BD:', error.stack ?? error);
      }
    }

    return { success: true, messageId: result.key?.id };
  }

  async getChats(empresaId: string) {
    const session = this.getSession(empresaId);
    if (!session?.isReady) return [];
    try {
      return await session.sock.getChats();
    } catch (error) {
      this.logger.error('Error getting chats:', error.stack ?? error);
      return [];
    }
  }

  async getMessages(empresaId: string, jid: string, limit = 50) {
    const session = this.getSession(empresaId);
    if (!session?.isReady) return [];
    try {
      return await session.sock.loadMessages(jid, limit);
    } catch (error) {
      this.logger.error('Error getting messages:', error.stack ?? error);
      return [];
    }
  }

  public async saveReceivedMessage(msg: any, empresaId: string) {
    try {
      const remoteJid = msg.key.remoteJidAlt || msg.key.remoteJid;
      const from = remoteJid.replace('@s.whatsapp.net', '');
      const normalizedPhone = this.normalizePhoneNumber(from);
      const strippedPhone = normalizedPhone.replace(/^549/, '');

      const cliente = await this.prisma.client.findFirst({
        where: {
          empresa_id: empresaId,
          OR: [
            { telefono: normalizedPhone },
            { telefono: strippedPhone },
            { telefono: { contains: normalizedPhone } },
            { telefono: { contains: strippedPhone } },
          ],
        },
      });

      if (cliente) {
        const messageText = msg.message?.conversation ||
                          msg.message?.extendedTextMessage?.text ||
                          '';

        await this.prisma.mensajeWhatsapp.create({
          data: {
            cliente_id: cliente.id,
            numero_telefono: normalizedPhone,
            direccion: 'received',
            mensaje: messageText,
            tipo: 'text',
            fecha_envio: new Date(msg.messageTimestamp * 1000),
            whatsapp_message_id: msg.key.id,
          },
        });
      }
    } catch (error) {
      this.logger.error('Error guardando mensaje recibido en BD:', error.stack ?? error);
    }
  }

  async getMessagesByClient(
    clienteId: string,
    page: number = 1,
    limit: number = 50,
    empresaId: string,
    userRol: string
  ) {
    try {
      if (userRol !== 'DESARROLLADOR') {
        const cliente = await this.prisma.client.findUnique({
          where: { id: clienteId },
        });
        if (!cliente) {
          throw new HttpException('Cliente no encontrado', HttpStatus.NOT_FOUND);
        }
        if (cliente.empresa_id !== empresaId) {
          throw new HttpException('No tienes permiso para ver mensajes de este cliente', HttpStatus.FORBIDDEN);
        }
      }

      const skip = (page - 1) * limit;
      const [messages, total] = await Promise.all([
        this.prisma.mensajeWhatsapp.findMany({
          where: { cliente_id: clienteId },
          orderBy: { fecha_envio: 'asc' },
          skip,
          take: limit,
        }),
        this.prisma.mensajeWhatsapp.count({
          where: { cliente_id: clienteId },
        }),
      ]);

      return {
        data: messages,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      };
    } catch (error) {
      this.logger.error('Error obteniendo mensajes del cliente:', error.stack ?? error);
      return {
        data: [],
        meta: { total: 0, page, limit, totalPages: 0 },
      };
    }
  }
}

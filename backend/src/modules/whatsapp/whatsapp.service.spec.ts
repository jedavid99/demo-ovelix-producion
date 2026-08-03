import { Test, TestingModule } from '@nestjs/testing';
import { WhatsappService } from './whatsapp.service';
import { PrismaService } from '../../database/prisma.service';
import axios from 'axios';
import * as QRCode from 'qrcode';

jest.mock('@whiskeysockets/baileys', () => {
  const createSock = () => ({
    ev: { on: jest.fn() },
    sendMessage: jest.fn(),
    end: jest.fn().mockResolvedValue(undefined),
    logout: jest.fn().mockResolvedValue(undefined),
    requestPairingCode: jest.fn(),
    getChats: jest.fn(),
    loadMessages: jest.fn(),
  });
  return {
    __esModule: true,
    default: jest.fn(() => createSock()),
    useMultiFileAuthState: jest.fn().mockResolvedValue({ state: {}, saveCreds: jest.fn() }),
    DisconnectReason: {
      loggedOut: 401,
      connectionLost: 402,
      connectionClosed: 403,
      timedOut: 408,
      restartRequired: 515,
    },
  };
});

jest.mock('fs/promises', () => ({
  mkdir: jest.fn().mockResolvedValue(undefined),
  rm: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('axios', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
}));

jest.mock('qrcode', () => ({
  __esModule: true,
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,fake'),
  toBuffer: jest.fn().mockResolvedValue(Buffer.from('png-bytes')),
}));

const axiosGetMock = axios.get as unknown as jest.Mock;
const qrToDataURLMock = QRCode.toDataURL as unknown as jest.Mock;
const qrToBufferMock = QRCode.toBuffer as unknown as jest.Mock;

describe('WhatsappService', () => {
  let service: WhatsappService;
  let prisma: any;
  let sock: any;

  function seedConnectedSession(empresaId: string) {
    (service as any).sessions.set(empresaId, {
      sock,
      qrCode: null,
      isReady: true,
      authFolder: `auth_info/${empresaId}`,
      pairingInProgress: false,
    });
  }

  beforeEach(async () => {
    prisma = {
      whatsAppSession: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn().mockResolvedValue({}),
        upsert: jest.fn(),
      },
      mensajeWhatsapp: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
      client: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
      },
    };

    sock = {
      ev: { on: jest.fn() },
      sendMessage: jest.fn().mockResolvedValue({ key: { id: 'wa-msg-1' } }),
      end: jest.fn().mockResolvedValue(undefined),
      logout: jest.fn().mockResolvedValue(undefined),
      requestPairingCode: jest.fn().mockResolvedValue('CODE-123'),
      getChats: jest.fn().mockResolvedValue([{ id: 'chat-1' }]),
      loadMessages: jest.fn().mockResolvedValue([{ id: 'msg-1' }]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WhatsappService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<WhatsappService>(WhatsappService);
  });

  describe('isConnected', () => {
    it('returns false when there is no session', () => {
      expect(service.isConnected('emp-1')).toBe(false);
    });

    it('returns true when the session is ready', () => {
      seedConnectedSession('emp-1');
      expect(service.isConnected('emp-1')).toBe(true);
    });
  });

  describe('sendText', () => {
    it('throws an error when whatsapp is not connected', async () => {
      await expect(service.sendText('emp-1', '1155551234', 'Hola')).rejects.toThrow(
        'WhatsApp no conectado para esta empresa',
      );
    });

    it('normalizes the phone number and sends the message via the socket', async () => {
      seedConnectedSession('emp-1');
      sock.sendMessage.mockResolvedValue({ key: { id: 'wa-1' } });

      const result = await service.sendText('emp-1', '1155551234', 'Hola', 'client-1');

      expect(sock.sendMessage).toHaveBeenCalledWith('5491155551234@s.whatsapp.net', { text: 'Hola' });
      expect(result).toEqual({ success: true, messageId: 'wa-1' });
    });

    it('persists the message when clienteId is provided', async () => {
      seedConnectedSession('emp-1');
      sock.sendMessage.mockResolvedValue({ key: { id: 'wa-1' } });
      prisma.mensajeWhatsapp.create.mockResolvedValue({});

      await service.sendText('emp-1', '1155551234', 'Hola', 'client-1');

      expect(prisma.mensajeWhatsapp.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            cliente_id: 'client-1',
            numero_telefono: '5491155551234',
            direccion: 'sent',
            mensaje: 'Hola',
            tipo: 'text',
            whatsapp_message_id: 'wa-1',
          }),
        }),
      );
    });

    it('passes the jid through when it already contains @s.whatsapp.net', async () => {
      seedConnectedSession('emp-1');
      await service.sendText('emp-1', '5491155551234@s.whatsapp.net', 'Hola');
      expect(sock.sendMessage).toHaveBeenCalledWith('5491155551234@s.whatsapp.net', { text: 'Hola' });
    });
  });

  describe('sendImage', () => {
    it('throws an error when whatsapp is not connected', async () => {
      await expect(service.sendImage('emp-1', '1155551234', 'http://img/x.png')).rejects.toThrow(
        'WhatsApp no conectado para esta empresa',
      );
    });

    it('downloads the image with axios and sends it', async () => {
      seedConnectedSession('emp-1');
      axiosGetMock.mockResolvedValue({ data: Buffer.from('image-bytes') });
      sock.sendMessage.mockResolvedValue({});

      const result = await service.sendImage('emp-1', '1155551234', 'http://img/x.png', 'caption');

      expect(axiosGetMock).toHaveBeenCalledWith('http://img/x.png', { responseType: 'arraybuffer' });
      expect(sock.sendMessage).toHaveBeenCalledWith(
        '5491155551234@s.whatsapp.net',
        expect.objectContaining({ image: expect.any(Buffer), caption: 'caption' }),
      );
      expect(result).toEqual({ success: true });
    });
  });

  describe('sendDocument', () => {
    it('throws an error when whatsapp is not connected', async () => {
      await expect(service.sendDocument('emp-1', '1155551234', 'http://doc/x.pdf', 'x.pdf')).rejects.toThrow(
        'WhatsApp no conectado para esta empresa',
      );
    });

    it('downloads the pdf with axios and sends it as document', async () => {
      seedConnectedSession('emp-1');
      axiosGetMock.mockResolvedValue({ data: Buffer.from('pdf-bytes') });
      sock.sendMessage.mockResolvedValue({});

      const result = await service.sendDocument('emp-1', '1155551234', 'http://doc/x.pdf', 'x.pdf', 'cap');

      expect(axiosGetMock).toHaveBeenCalledWith('http://doc/x.pdf', { responseType: 'arraybuffer' });
      expect(sock.sendMessage).toHaveBeenCalledWith(
        '5491155551234@s.whatsapp.net',
        expect.objectContaining({
          document: expect.any(Buffer),
          mimetype: 'application/pdf',
          fileName: 'x.pdf',
          caption: 'cap',
        }),
      );
      expect(result).toEqual({ success: true });
    });
  });

  describe('sendDocumentBuffer', () => {
    it('throws an error when whatsapp is not connected', async () => {
      await expect(
        service.sendDocumentBuffer('emp-1', '1155551234', Buffer.from('pdf'), 'x.pdf'),
      ).rejects.toThrow('WhatsApp no conectado para esta empresa');
    });

    it('sends the buffer and persists the message when clienteId is provided', async () => {
      seedConnectedSession('emp-1');
      sock.sendMessage.mockResolvedValue({ key: { id: 'doc-1' } });
      prisma.mensajeWhatsapp.create.mockResolvedValue({});

      const result = await service.sendDocumentBuffer(
        'emp-1',
        '1155551234',
        Buffer.from('pdf'),
        'x.pdf',
        'Cap',
        'client-1',
      );

      expect(sock.sendMessage).toHaveBeenCalledWith(
        '5491155551234@s.whatsapp.net',
        expect.objectContaining({ document: expect.any(Buffer), mimetype: 'application/pdf', fileName: 'x.pdf', caption: 'Cap' }),
      );
      expect(prisma.mensajeWhatsapp.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ cliente_id: 'client-1', tipo: 'pdf', archivo_url: 'x.pdf' }),
        }),
      );
      expect(result).toEqual({ success: true, messageId: 'doc-1' });
    });
  });

  describe('getChats', () => {
    it('returns an empty array when not connected', async () => {
      await expect(service.getChats('emp-1')).resolves.toEqual([]);
    });

    it('returns the chats from the socket when connected', async () => {
      seedConnectedSession('emp-1');
      sock.getChats.mockResolvedValue([{ id: 'chat-1' }]);

      const result = await service.getChats('emp-1');

      expect(sock.getChats).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });
  });

  describe('getMessages', () => {
    it('returns an empty array when not connected', async () => {
      await expect(service.getMessages('emp-1', 'jid', 50)).resolves.toEqual([]);
    });

    it('loads messages from the socket with the given jid and limit', async () => {
      seedConnectedSession('emp-1');
      sock.loadMessages.mockResolvedValue([{ id: 'msg-1' }]);

      const result = await service.getMessages('emp-1', '5491155551234@s.whatsapp.net', 10);

      expect(sock.loadMessages).toHaveBeenCalledWith('5491155551234@s.whatsapp.net', 10);
      expect(result).toHaveLength(1);
    });
  });

  describe('getSessionStatus', () => {
    it('returns disconnected defaults when there is no session in DB', async () => {
      prisma.whatsAppSession.findUnique.mockResolvedValue(null);

      const result = await service.getSessionStatus('emp-1');

      expect(result).toEqual({ estado: 'disconnected', qr_code: null, qr_image: null, telefono: null });
    });

    it('expires stale qr sessions and returns disconnected', async () => {
      prisma.whatsAppSession.findUnique.mockResolvedValue({
        empresa_id: 'emp-1',
        estado: 'qr_generated',
        qr_code: 'qr-data',
        qr_expires_at: new Date(Date.now() - 5000),
        telefono: null,
      });

      const result = await service.getSessionStatus('emp-1');

      expect(prisma.whatsAppSession.update).toHaveBeenCalledWith({
        where: { empresa_id: 'emp-1' },
        data: { estado: 'disconnected', qr_code: null, qr_expires_at: null },
      });
      expect(result.estado).toBe('disconnected');
    });

    it('generates the qr image for a valid qr session', async () => {
      prisma.whatsAppSession.findUnique.mockResolvedValue({
        empresa_id: 'emp-1',
        estado: 'qr_generated',
        qr_code: 'qr-data',
        qr_expires_at: new Date(Date.now() + 60000),
        telefono: '5491155551234',
      });
      qrToDataURLMock.mockResolvedValue('data:image/png;base64,fake');

      const result = await service.getSessionStatus('emp-1');

      expect(qrToDataURLMock).toHaveBeenCalledWith('qr-data');
      expect(result.estado).toBe('qr_generated');
      expect(result.qr_image).toBe('data:image/png;base64,fake');
      expect(result.telefono).toBe('5491155551234');
    });
  });

  describe('getQRAsPNG', () => {
    it('throws when there is no qr code', async () => {
      prisma.whatsAppSession.findUnique.mockResolvedValue(null);
      await expect(service.getQRAsPNG('emp-1')).rejects.toThrow('QR no disponible');
    });

    it('returns the qr code as a PNG buffer', async () => {
      prisma.whatsAppSession.findUnique.mockResolvedValue({ qr_code: 'qr-data' });
      qrToBufferMock.mockResolvedValue(Buffer.from('png-bytes'));

      const buffer = await service.getQRAsPNG('emp-1');

      expect(qrToBufferMock).toHaveBeenCalledWith('qr-data');
      expect(Buffer.isBuffer(buffer)).toBe(true);
    });
  });

  describe('saveReceivedMessage', () => {
    const incomingMessage = {
      key: { remoteJid: '5491155551234@s.whatsapp.net', id: 'm-1' },
      message: { conversation: 'Hola, consulta' },
      messageTimestamp: 1700000000,
    };

    it('persists the message when a matching client is found', async () => {
      prisma.client.findFirst.mockResolvedValue({ id: 'client-1' });
      prisma.mensajeWhatsapp.create.mockResolvedValue({});

      await service.saveReceivedMessage(incomingMessage, 'emp-1');

      expect(prisma.client.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ empresa_id: 'emp-1' }),
        }),
      );
      expect(prisma.mensajeWhatsapp.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            cliente_id: 'client-1',
            numero_telefono: '5491155551234',
            direccion: 'received',
            mensaje: 'Hola, consulta',
            whatsapp_message_id: 'm-1',
          }),
        }),
      );
    });

    it('does not persist when no matching client is found', async () => {
      prisma.client.findFirst.mockResolvedValue(null);

      await service.saveReceivedMessage(incomingMessage, 'emp-1');

      expect(prisma.mensajeWhatsapp.create).not.toHaveBeenCalled();
    });
  });

  describe('getMessagesByClient', () => {
    it('returns the paginated messages for a developer user without checking the client', async () => {
      prisma.mensajeWhatsapp.findMany.mockResolvedValue([{ id: 'm-1' }]);
      prisma.mensajeWhatsapp.count.mockResolvedValue(1);

      const result = await service.getMessagesByClient('client-1', 1, 50, 'emp-1', 'DESARROLLADOR');

      expect(prisma.client.findUnique).not.toHaveBeenCalled();
      expect(result.data).toHaveLength(1);
      expect(result.meta).toEqual({ total: 1, page: 1, limit: 50, totalPages: 1 });
    });

    it('returns empty data when the client is not found', async () => {
      prisma.client.findUnique.mockResolvedValue(null);

      const result = await service.getMessagesByClient('client-1', 1, 50, 'emp-1', 'ADMIN');

      expect(result.data).toEqual([]);
      expect(result.meta).toEqual({ total: 0, page: 1, limit: 50, totalPages: 0 });
      expect(prisma.mensajeWhatsapp.findMany).not.toHaveBeenCalled();
    });

    it('returns empty data when the client belongs to another empresa', async () => {
      prisma.client.findUnique.mockResolvedValue({ id: 'client-1', empresa_id: 'other-emp' });

      const result = await service.getMessagesByClient('client-1', 1, 50, 'emp-1', 'ADMIN');

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
    });

    it('returns the messages for a client of the same empresa', async () => {
      prisma.client.findUnique.mockResolvedValue({ id: 'client-1', empresa_id: 'emp-1' });
      prisma.mensajeWhatsapp.findMany.mockResolvedValue([{ id: 'm-1' }, { id: 'm-2' }]);
      prisma.mensajeWhatsapp.count.mockResolvedValue(2);

      const result = await service.getMessagesByClient('client-1', 1, 50, 'emp-1', 'ADMIN');

      expect(prisma.mensajeWhatsapp.findMany).toHaveBeenCalledWith({
        where: { cliente_id: 'client-1' },
        orderBy: { fecha_envio: 'asc' },
        skip: 0,
        take: 50,
      });
      expect(result.data).toHaveLength(2);
      expect(result.meta).toEqual({ total: 2, page: 1, limit: 50, totalPages: 1 });
    });
  });

  describe('generateQR', () => {
    it('marks the session as connecting and starts the connection flow', async () => {
      prisma.whatsAppSession.upsert.mockResolvedValue({});
      const makeWASocket = (await import('@whiskeysockets/baileys')).default as unknown as jest.Mock;

      await service.generateQR('emp-1');
      await new Promise((resolve) => setImmediate(resolve));

      expect(prisma.whatsAppSession.upsert).toHaveBeenCalledWith({
        where: { empresa_id: 'emp-1' },
        update: expect.objectContaining({ estado: 'connecting' }),
        create: expect.objectContaining({ empresa_id: 'emp-1', estado: 'connecting' }),
      });
      expect(makeWASocket).toHaveBeenCalled();
    });
  });
});

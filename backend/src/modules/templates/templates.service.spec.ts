import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { PrismaService } from '../../database/prisma.service';
import {
  sendTemplateSchema,
  createEmailTemplateSchema,
  createWhatsAppTemplateSchema,
} from './dto/template.dto';

describe('TemplatesService', () => {
  let service: TemplatesService;
  let prisma: any;

  const uuid = '11111111-1111-4111-8111-111111111111';

  beforeEach(async () => {
    prisma = {
      emailTemplate: {
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn(),
      },
      whatsAppTemplate: {
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findUnique: jest.fn(),
      },
      user: {
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplatesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<TemplatesService>(TemplatesService);
  });

  describe('getEmailTemplates', () => {
    it('returns all email templates ordered by updated_at desc', async () => {
      prisma.emailTemplate.findMany.mockResolvedValue([{ id: 't-1' }]);

      const result = await service.getEmailTemplates();

      expect(prisma.emailTemplate.findMany).toHaveBeenCalledWith({ orderBy: { updated_at: 'desc' } });
      expect(result).toHaveLength(1);
    });
  });

  describe('getWhatsAppTemplates', () => {
    it('returns all whatsapp templates ordered by updated_at desc', async () => {
      prisma.whatsAppTemplate.findMany.mockResolvedValue([{ id: 't-2' }]);

      const result = await service.getWhatsAppTemplates();

      expect(prisma.whatsAppTemplate.findMany).toHaveBeenCalledWith({ orderBy: { updated_at: 'desc' } });
      expect(result).toHaveLength(1);
    });
  });

  describe('createEmailTemplate', () => {
    it('creates an email template with default empty variables', async () => {
      prisma.emailTemplate.create.mockResolvedValue({ id: 't-1', name: 'Bienvenida' });

      const result = await service.createEmailTemplate({
        name: 'Bienvenida',
        subject: 'Hola',
        body: 'Cuerpo',
        type: 'bienvenida',
      });

      expect(prisma.emailTemplate.create).toHaveBeenCalledWith({
        data: {
          name: 'Bienvenida',
          subject: 'Hola',
          body: 'Cuerpo',
          type: 'bienvenida',
          variables: [],
        },
      });
      expect(result.name).toBe('Bienvenida');
    });

    it('passes variables through when provided', async () => {
      prisma.emailTemplate.create.mockResolvedValue({});
      await service.createEmailTemplate({
        name: 'Bienvenida',
        subject: 'Hola',
        body: 'Cuerpo',
        variables: ['{name}', '{email}'],
      });

      expect(prisma.emailTemplate.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ variables: ['{name}', '{email}'] }),
      });
    });
  });

  describe('createWhatsAppTemplate', () => {
    it('creates a whatsapp template with default empty variables', async () => {
      prisma.whatsAppTemplate.create.mockResolvedValue({ id: 't-2', name: 'Turno' });

      const result = await service.createWhatsAppTemplate({
        name: 'Turno',
        message: 'Tu turno fue reservado',
      });

      expect(prisma.whatsAppTemplate.create).toHaveBeenCalledWith({
        data: {
          name: 'Turno',
          message: 'Tu turno fue reservado',
          type: undefined,
          variables: [],
        },
      });
      expect(result.name).toBe('Turno');
    });
  });

  describe('updateEmailTemplate', () => {
    it('updates the email template by id', async () => {
      prisma.emailTemplate.update.mockResolvedValue({ id: 't-1', subject: 'Nuevo asunto' });

      const result = await service.updateEmailTemplate('t-1', { subject: 'Nuevo asunto' });

      expect(prisma.emailTemplate.update).toHaveBeenCalledWith({ where: { id: 't-1' }, data: { subject: 'Nuevo asunto' } });
      expect(result.subject).toBe('Nuevo asunto');
    });
  });

  describe('updateWhatsAppTemplate', () => {
    it('updates the whatsapp template by id', async () => {
      prisma.whatsAppTemplate.update.mockResolvedValue({ id: 't-2', message: 'Nuevo mensaje' });

      const result = await service.updateWhatsAppTemplate('t-2', { message: 'Nuevo mensaje' });

      expect(prisma.whatsAppTemplate.update).toHaveBeenCalledWith({ where: { id: 't-2' }, data: { message: 'Nuevo mensaje' } });
      expect(result.message).toBe('Nuevo mensaje');
    });
  });

  describe('deleteEmailTemplate', () => {
    it('deletes the email template by id', async () => {
      prisma.emailTemplate.delete.mockResolvedValue({ id: 't-1' });

      await service.deleteEmailTemplate('t-1');

      expect(prisma.emailTemplate.delete).toHaveBeenCalledWith({ where: { id: 't-1' } });
    });
  });

  describe('deleteWhatsAppTemplate', () => {
    it('deletes the whatsapp template by id', async () => {
      prisma.whatsAppTemplate.delete.mockResolvedValue({ id: 't-2' });

      await service.deleteWhatsAppTemplate('t-2');

      expect(prisma.whatsAppTemplate.delete).toHaveBeenCalledWith({ where: { id: 't-2' } });
    });
  });

  describe('sendEmailTemplate', () => {
    it('throws NotFoundException when the template does not exist', async () => {
      prisma.emailTemplate.findUnique.mockResolvedValue(null);

      await expect(
        service.sendEmailTemplate({ templateId: uuid, userIds: [uuid], companyId: uuid }),
      ).rejects.toThrow(NotFoundException);
    });

    it('replaces variables and marks recipients as sent', async () => {
      prisma.emailTemplate.findUnique.mockResolvedValue({
        id: uuid,
        name: 'Bienvenida',
        subject: 'Hola {name}',
        body: 'Empresa: {empresa}, email: {email}',
      });
      prisma.user.findMany.mockResolvedValue([
        { id: 'u1', email: 'a@b.com', nombre: 'Juan', empresa: { razon_social: 'ACME' } },
        { id: 'u2', email: 'c@d.com', nombre: 'Ana', empresa: { razon_social: 'ACME' } },
      ]);

      const result = await service.sendEmailTemplate({
        templateId: uuid,
        userIds: ['u1', 'u2'],
        companyId: uuid,
      });

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: { id: { in: ['u1', 'u2'] }, empresa_id: uuid },
      });
      expect(result.template).toBe('Bienvenida');
      expect(result.sent).toBe(2);
      expect(result.recipients[0]).toEqual(
        expect.objectContaining({
          userId: 'u1',
          email: 'a@b.com',
          subject: 'Hola Juan',
          body: 'Empresa: ACME, email: a@b.com',
          sent: true,
        }),
      );
    });
  });

  describe('sendWhatsAppTemplate', () => {
    it('throws NotFoundException when the template does not exist', async () => {
      prisma.whatsAppTemplate.findUnique.mockResolvedValue(null);

      await expect(
        service.sendWhatsAppTemplate({ templateId: uuid, userIds: [uuid], companyId: uuid }),
      ).rejects.toThrow(NotFoundException);
    });

    it('replaces variables in the message', async () => {
      prisma.whatsAppTemplate.findUnique.mockResolvedValue({
        id: uuid,
        name: 'Turno',
        message: 'Hola {name} ({email})',
      });
      prisma.user.findMany.mockResolvedValue([
        { id: 'u1', email: 'a@b.com', nombre: 'Juan', telefono: '1155551234' },
      ]);

      const result = await service.sendWhatsAppTemplate({
        templateId: uuid,
        userIds: ['u1'],
        companyId: uuid,
      });

      expect(result.template).toBe('Turno');
      expect(result.sent).toBe(1);
      expect(result.recipients[0]).toEqual(
        expect.objectContaining({
          userId: 'u1',
          phone: '1155551234',
          message: 'Hola Juan (a@b.com)',
          sent: true,
        }),
      );
    });
  });

  describe('zod schema validation (used by ZodValidationPipe in controller)', () => {
    it('sendTemplateSchema rejects invalid UUIDs', () => {
      const result = sendTemplateSchema.safeParse({
        templateId: 'not-a-uuid',
        userIds: [uuid],
        companyId: uuid,
      });
      expect(result.success).toBe(false);
    });

    it('sendTemplateSchema rejects empty userIds', () => {
      const result = sendTemplateSchema.safeParse({
        templateId: uuid,
        userIds: [],
        companyId: uuid,
      });
      expect(result.success).toBe(false);
    });

    it('createEmailTemplateSchema rejects empty name and subject', () => {
      expect(createEmailTemplateSchema.safeParse({ name: '', subject: 's', body: 'b' }).success).toBe(false);
      expect(createEmailTemplateSchema.safeParse({ name: 'n', subject: '', body: 'b' }).success).toBe(false);
    });

    it('createWhatsAppTemplateSchema rejects empty message', () => {
      expect(createWhatsAppTemplateSchema.safeParse({ name: 'n', message: '' }).success).toBe(false);
    });
  });
});

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CreateEmailTemplateDto,
  UpdateEmailTemplateDto,
  CreateWhatsAppTemplateDto,
  UpdateWhatsAppTemplateDto,
  SendTemplateDto,
} from './dto/template.dto';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  async getEmailTemplates() {
    return await this.prisma.emailTemplate.findMany({
      orderBy: { updated_at: 'desc' },
    });
  }

  async getWhatsAppTemplates() {
    return await this.prisma.whatsAppTemplate.findMany({
      orderBy: { updated_at: 'desc' },
    });
  }

  async createEmailTemplate(createDto: CreateEmailTemplateDto) {
    return await this.prisma.emailTemplate.create({
      data: {
        name: createDto.name,
        subject: createDto.subject,
        body: createDto.body,
        type: createDto.type,
        variables: createDto.variables || [],
      },
    });
  }

  async createWhatsAppTemplate(createDto: CreateWhatsAppTemplateDto) {
    return await this.prisma.whatsAppTemplate.create({
      data: {
        name: createDto.name,
        message: createDto.message,
        type: createDto.type,
        variables: createDto.variables || [],
      },
    });
  }

  async updateEmailTemplate(id: string, updateDto: UpdateEmailTemplateDto) {
    return await this.prisma.emailTemplate.update({
      where: { id },
      data: updateDto,
    });
  }

  async updateWhatsAppTemplate(id: string, updateDto: UpdateWhatsAppTemplateDto) {
    return await this.prisma.whatsAppTemplate.update({
      where: { id },
      data: updateDto,
    });
  }

  async deleteEmailTemplate(id: string) {
    return await this.prisma.emailTemplate.delete({
      where: { id },
    });
  }

  async deleteWhatsAppTemplate(id: string) {
    return await this.prisma.whatsAppTemplate.delete({
      where: { id },
    });
  }

  async sendEmailTemplate(sendDto: SendTemplateDto) {
    const { templateId, userIds, companyId } = sendDto;
    
    // Obtener la plantilla
    const template = await this.prisma.emailTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      throw new NotFoundException('Plantilla de email no encontrada');
    }

    // Obtener los usuarios
    const users = await this.prisma.user.findMany({
      where: {
        id: { in: userIds },
        empresa_id: companyId,
      },
    });

    // Aquí se implementaría el envío real de emails
    // Por ahora, simulamos el envío
    const results = users.map(user => ({
      userId: user.id,
      email: user.email,
      subject: this.replaceVariables(template.subject, user),
      body: this.replaceVariables(template.body, user),
      sent: true,
    }));

    return {
      template: template.name,
      sent: results.length,
      recipients: results,
    };
  }

  async sendWhatsAppTemplate(sendDto: SendTemplateDto) {
    const { templateId, userIds, companyId } = sendDto;
    
    // Obtener la plantilla
    const template = await this.prisma.whatsAppTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      throw new NotFoundException('Plantilla de WhatsApp no encontrada');
    }

    // Obtener los usuarios
    const users = await this.prisma.user.findMany({
      where: {
        id: { in: userIds },
        empresa_id: companyId,
      },
    });

    // Aquí se implementaría el envío real de WhatsApp
    // Por ahora, simulamos el envío
    const results = users.map(user => ({
      userId: user.id,
      phone: user.telefono,
      message: this.replaceVariables(template.message, user),
      sent: true,
    }));

    return {
      template: template.name,
      sent: results.length,
      recipients: results,
    };
  }

  private replaceVariables(text: string, user: any): string {
    if (!text) return '';
    let result = text;
    result = result.replace(/\{name\}/g, user.nombre || '');
    result = result.replace(/\{email\}/g, user.email || '');
    result = result.replace(/\{empresa\}/g, user.empresa?.razon_social || '');
    return result;
  }
}

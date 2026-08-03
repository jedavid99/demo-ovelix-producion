import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TemplatesService } from './templates.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  createEmailTemplateSchema,
  updateEmailTemplateSchema,
  createWhatsAppTemplateSchema,
  updateWhatsAppTemplateSchema,
  sendTemplateSchema,
} from './dto/template.dto';

@ApiTags('Plantillas')
@ApiBearerAuth()
@Controller('templates')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('DESARROLLADOR')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @ApiOperation({ summary: 'Obtener las plantillas de email' })
  @Get('emails')
  getEmailTemplates() {
    return this.templatesService.getEmailTemplates();
  }

  @ApiOperation({ summary: 'Obtener las plantillas de WhatsApp' })
  @Get('whatsapp')
  getWhatsAppTemplates() {
    return this.templatesService.getWhatsAppTemplates();
  }

  @ApiOperation({ summary: 'Crear una plantilla de email' })
  @Post('emails')
  createEmailTemplate(@Body(new ZodValidationPipe(createEmailTemplateSchema)) createDto: any) {
    return this.templatesService.createEmailTemplate(createDto);
  }

  @ApiOperation({ summary: 'Crear una plantilla de WhatsApp' })
  @Post('whatsapp')
  createWhatsAppTemplate(@Body(new ZodValidationPipe(createWhatsAppTemplateSchema)) createDto: any) {
    return this.templatesService.createWhatsAppTemplate(createDto);
  }

  @ApiOperation({ summary: 'Actualizar una plantilla de email' })
  @Put('emails/:id')
  updateEmailTemplate(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Body(new ZodValidationPipe(updateEmailTemplateSchema)) updateDto: any) {
    return this.templatesService.updateEmailTemplate(id, updateDto);
  }

  @ApiOperation({ summary: 'Actualizar una plantilla de WhatsApp' })
  @Put('whatsapp/:id')
  updateWhatsAppTemplate(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string, @Body(new ZodValidationPipe(updateWhatsAppTemplateSchema)) updateDto: any) {
    return this.templatesService.updateWhatsAppTemplate(id, updateDto);
  }

  @ApiOperation({ summary: 'Eliminar una plantilla de email' })
  @Delete('emails/:id')
  deleteEmailTemplate(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.templatesService.deleteEmailTemplate(id);
  }

  @ApiOperation({ summary: 'Eliminar una plantilla de WhatsApp' })
  @Delete('whatsapp/:id')
  deleteWhatsAppTemplate(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.templatesService.deleteWhatsAppTemplate(id);
  }

  @ApiOperation({ summary: 'Enviar una plantilla de email' })
  @Post('send-email')
  sendEmailTemplate(@Body(new ZodValidationPipe(sendTemplateSchema)) sendDto: any) {
    return this.templatesService.sendEmailTemplate(sendDto);
  }

  @ApiOperation({ summary: 'Enviar una plantilla de WhatsApp' })
  @Post('send-whatsapp')
  sendWhatsAppTemplate(@Body(new ZodValidationPipe(sendTemplateSchema)) sendDto: any) {
    return this.templatesService.sendWhatsAppTemplate(sendDto);
  }
}

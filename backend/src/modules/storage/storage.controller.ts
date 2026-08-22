import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';
import { StorageService } from './storage.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { z } from 'zod';

const uploadSchema = z.object({
  folder: z.string().optional().default('uploads'),
});

type UploadDto = z.infer<typeof uploadSchema>;

const deleteSchema = z.object({
  key: z.string().min(1, 'La clave del archivo es requerida'),
});

type DeleteDto = z.infer<typeof deleteSchema>;

@ApiTags('Archivos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  @ApiOperation({ summary: 'Subir un archivo imagen a Cloudflare R2' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: 'Imagen (JPEG, PNG, WebP, GIF, AVIF) hasta 10MB' },
        folder: { type: 'string', description: 'Carpeta destino (default: uploads)', example: 'repairs' },
      },
      required: ['file'],
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ZodValidationPipe(uploadSchema)) dto: UploadDto,
    @Request() req: any,
  ) {
    const folder = `${req.user.empresa_id}/${dto.folder}`;
    return this.storageService.uploadFile(file, folder);
  }

  @Delete(':key(*)')
  @ApiOperation({ summary: 'Eliminar un archivo de R2' })
  async remove(
    @Param('key') key: string,
  ) {
    await this.storageService.deleteFile(key);
    return { message: 'Archivo eliminado correctamente' };
  }
}

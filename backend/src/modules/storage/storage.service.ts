import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { extname } from 'path';

@Injectable()
export class StorageService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;
  private readonly logger = new Logger(StorageService.name);

  private static readonly ALLOWED_MIME = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/avif',
  ];
  private static readonly MAX_SIZE = 10 * 1024 * 1024; // 10 MB

  constructor(private config: ConfigService) {
    const accountId = this.config.get<string>('R2_ACCOUNT_ID');
    const accessKeyId = this.config.get<string>('R2_ACCESS_KEY_ID');
    const secretAccessKey = this.config.get<string>('R2_SECRET_ACCESS_KEY');
    this.bucket = this.config.get<string>('R2_BUCKET_NAME') || '';
    this.publicUrl = this.config.get<string>('R2_PUBLIC_URL') || '';

    this.s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: accessKeyId || '', secretAccessKey: secretAccessKey || '' },
    });
  }

  private validateFile(file: Express.Multer.File) {
    if (!StorageService.ALLOWED_MIME.includes(file.mimetype)) {
      throw new BadRequestException(
        `Tipo de archivo no permitido: ${file.mimetype}. Solo se aceptan imágenes (JPEG, PNG, WebP, GIF, AVIF).`,
      );
    }
    if (file.size > StorageService.MAX_SIZE) {
      throw new BadRequestException(
        `El archivo excede el tamaño máximo de ${StorageService.MAX_SIZE / 1024 / 1024} MB.`,
      );
    }
  }

  private buildKey(folder: string, originalName: string): string {
    const ext = extname(originalName).toLowerCase() || '.jpg';
    const id = randomUUID();
    return `${folder}/${id}${ext}`;
  }

  async uploadFile(
    file: Express.Multer.File,
    folder = 'uploads',
  ): Promise<{ url: string; key: string }> {
    this.validateFile(file);

    const key = this.buildKey(folder, file.originalname);

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentLength: file.size,
      }),
    );

    const url = `${this.publicUrl}/${key}`;
    this.logger.log(`File uploaded: ${key}`);
    return { url, key };
  }

  async deleteFile(key: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
    this.logger.log(`File deleted: ${key}`);
  }

  async getSignedUploadUrl(
    fileName: string,
    contentType: string,
    folder = 'uploads',
    expiresIn = 300,
  ): Promise<{ url: string; key: string }> {
    const key = this.buildKey(folder, fileName);

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn });
    return { url, key };
  }
}

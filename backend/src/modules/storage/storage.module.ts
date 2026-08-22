import { Module } from '@nestjs/common';
import { UploadController } from './storage.controller';
import { StorageService } from './storage.service';

@Module({
  controllers: [UploadController],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}

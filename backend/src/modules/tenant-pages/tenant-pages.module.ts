import { Module } from '@nestjs/common';
import { TenantPagesController } from './tenant-pages.controller';
import { TenantPagesPublicController } from './tenant-pages-public.controller';
import { TenantPagesService } from './tenant-pages.service';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TenantPagesController, TenantPagesPublicController],
  providers: [TenantPagesService],
  exports: [TenantPagesService],
})
export class TenantPagesModule {}
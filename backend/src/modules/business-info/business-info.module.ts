import { Module } from '@nestjs/common';
import { BusinessInfoController } from './business-info.controller';
import { BusinessInfoService } from './business-info.service';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BusinessInfoController],
  providers: [BusinessInfoService],
  exports: [BusinessInfoService],
})
export class BusinessInfoModule {}

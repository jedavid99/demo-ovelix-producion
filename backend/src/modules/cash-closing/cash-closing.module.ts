import { Module } from '@nestjs/common';
import { CashClosingController } from './cash-closing.controller';
import { CashClosingService } from './cash-closing.service';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CashClosingController],
  providers: [CashClosingService],
  exports: [CashClosingService],
})
export class CashClosingModule {}

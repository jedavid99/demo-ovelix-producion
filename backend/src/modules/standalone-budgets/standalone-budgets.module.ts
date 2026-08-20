import { Module } from '@nestjs/common';
import { StandaloneBudgetsController } from './standalone-budgets.controller';
import { StandaloneBudgetsService } from './standalone-budgets.service';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StandaloneBudgetsController],
  providers: [StandaloneBudgetsService],
  exports: [StandaloneBudgetsService],
})
export class StandaloneBudgetsModule {}
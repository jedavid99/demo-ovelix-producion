import { Module } from '@nestjs/common';
import { BudgetRequestsService } from './budget-requests.service';
import { BudgetRequestsController } from './budget-requests.controller';
import { BudgetRequestsPublicController } from './budget-requests-public.controller';
import { PrismaModule } from '../../database/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [BudgetRequestsController, BudgetRequestsPublicController],
  providers: [BudgetRequestsService],
  exports: [BudgetRequestsService],
})
export class BudgetRequestsModule {}
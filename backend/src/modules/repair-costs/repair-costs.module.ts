import { Module } from '@nestjs/common';
import { RepairCostsService } from './repair-costs.service';
import { RepairCostsController } from './repair-costs.controller';
import { RepairCostsPublicController } from './repair-costs-public.controller';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RepairCostsController, RepairCostsPublicController],
  providers: [RepairCostsService],
  exports: [RepairCostsService],
})
export class RepairCostsModule {}
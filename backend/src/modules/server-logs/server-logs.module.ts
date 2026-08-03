import { Module } from '@nestjs/common';
import { ServerLogsController } from './server-logs.controller';
import { ServerLogsService } from './server-logs.service';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ServerLogsController],
  providers: [ServerLogsService],
  exports: [ServerLogsService],
})
export class ServerLogsModule {}

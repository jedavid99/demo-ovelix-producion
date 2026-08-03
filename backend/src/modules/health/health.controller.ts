import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { Public } from '../../common/decorators/public.decorator';
import { PrismaService } from '../../database/prisma.service';

@SkipThrottle()
@ApiTags('Salud')
@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Public()
  @ApiOperation({ summary: 'Verificar estado del servidor y conexión a la base de datos' })
  @Get()
  async health() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        uptime: process.uptime(),
        db: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        uptime: process.uptime(),
        db: 'disconnected',
        timestamp: new Date().toISOString(),
      };
    }
  }
}

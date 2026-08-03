import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { PrismaService } from '../../database/prisma.service';

describe('HealthController', () => {
  let controller: HealthController;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      $queryRaw: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: PrismaService, useValue: prisma }],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  describe('health', () => {
    it('should return ok status when database responds', async () => {
      prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

      const result = await controller.health();

      expect(prisma.$queryRaw).toHaveBeenCalled();
      expect(result.status).toBe('ok');
      expect(result.db).toBe('connected');
      expect(result.uptime).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });

    it('should return error status when database query fails', async () => {
      prisma.$queryRaw.mockRejectedValue(new Error('connection refused'));

      const result = await controller.health();

      expect(result.status).toBe('error');
      expect(result.db).toBe('disconnected');
      expect(result.uptime).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });
  });
});

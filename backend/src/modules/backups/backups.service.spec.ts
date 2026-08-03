import { Test, TestingModule } from '@nestjs/testing';
import { BackupsService } from './backups.service';
import { PrismaService } from '../../database/prisma.service';

describe('BackupsService', () => {
  let service: BackupsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BackupsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<BackupsService>(BackupsService);
  });

  describe('findAll', () => {
    it('should return an empty list with pagination meta', async () => {
      const result = await service.findAll();

      expect(result).toEqual({
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: 50,
          totalPages: 0,
        },
      });
    });
  });

  describe('create', () => {
    it('should return a placeholder message', async () => {
      const result = await service.create();

      expect(result).toEqual({
        message: 'Backup creation not implemented yet',
      });
    });
  });

  describe('download', () => {
    it('should return a placeholder message', async () => {
      const result = await service.download('backup-1');

      expect(result).toEqual({
        message: 'Backup download not implemented yet',
      });
    });
  });

  describe('delete', () => {
    it('should return a placeholder message', async () => {
      const result = await service.delete('backup-1');

      expect(result).toEqual({
        message: 'Backup deletion not implemented yet',
      });
    });
  });
});

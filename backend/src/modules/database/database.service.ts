import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class DatabaseService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [companies, users, clients, repairs] = await Promise.all([
      this.prisma.company.count(),
      this.prisma.user.count(),
      this.prisma.client.count(),
      this.prisma.repair.count(),
    ]);

    return {
      companies,
      users,
      clients,
      repairs,
    };
  }
}

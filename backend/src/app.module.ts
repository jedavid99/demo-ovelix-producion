import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { z } from 'zod';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PermissionsGuard } from './modules/permissions/permissions.guard';
import { PrismaModule } from './database/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { ClientsModule } from './modules/clients/clients.module';
import { RepairsModule } from './modules/repairs/repairs.module';
import { BudgetsModule } from './modules/budgets/budgets.module';
import { StandaloneBudgetsModule } from './modules/standalone-budgets/standalone-budgets.module';
import { StockModule } from './modules/stock/stock.module';
import { SalesModule } from './modules/sales/sales.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { CashClosingModule } from './modules/cash-closing/cash-closing.module';
import { BusinessInfoModule } from './modules/business-info/business-info.module';
import { RolesModule } from './modules/roles/roles.module';
import { AuditModule } from './modules/audit/audit.module';
import { ServerLogsModule } from './modules/server-logs/server-logs.module';
import { DatabaseModule } from './modules/database/database.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { BackupsModule } from './modules/backups/backups.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { WhatsappModule } from './modules/whatsapp/whatsapp.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { BrandsModule } from './modules/brands/brands.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { SettingsModule } from './modules/settings/settings.module';
import { TenantPagesModule } from './modules/tenant-pages/tenant-pages.module';
import { RepairCostsModule } from './modules/repair-costs/repair-costs.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { BudgetRequestsModule } from './modules/budget-requests/budget-requests.module';
import { StorageModule } from './modules/storage/storage.module';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().optional(),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL es requerida'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET es requerida'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET es requerida'),
  DEV_INVITE_TOKEN: z.string().optional(),
  CORS_ORIGIN: z.string().optional(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: (config: Record<string, unknown>) => envSchema.parse(config),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
    ClientsModule,
    RepairsModule,
    BudgetsModule,
    StandaloneBudgetsModule,
    StockModule,
    SalesModule,
    ExpensesModule,
    CashClosingModule,
    BusinessInfoModule,
    RolesModule,
    AuditModule,
    ServerLogsModule,
    DatabaseModule,
    AnalyticsModule,
    BackupsModule,
    TemplatesModule,
    PermissionsModule,
    WhatsappModule,
    NotificationsModule,
    BrandsModule,
    ReviewsModule,
    SettingsModule,
    TenantPagesModule,
    RepairCostsModule,
    BookingsModule,
    BudgetRequestsModule,
    StorageModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
})
export class AppModule {}

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async findAll(page?: number, limit?: number) {
    const select = {
      id: true,
      codigo_empresa: true,
      slug: true,
      razon_social: true,
      email: true,
      telefono: true,
      direccion: true,
      ciudad: true,
      provincia: true,
      codigo_postal: true,
      activo: true,
      created_at: true,
      updated_at: true,
      _count: {
        select: {
          users: true,
          clients: true,
          repairs: true,
        },
      },
    } as const;

    const orderBy = { created_at: 'desc' } as const;

    if (page && limit) {
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        this.prisma.company.findMany({
          select,
          orderBy,
          skip,
          take: limit,
        }),
        this.prisma.company.count(),
      ]);
      return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }

    const companies = await this.prisma.company.findMany({
      select,
      orderBy,
    });

    return companies;
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      select: {
        id: true,
        codigo_empresa: true,
        slug: true,
        razon_social: true,
        email: true,
        telefono: true,
        direccion: true,
        ciudad: true,
        provincia: true,
        codigo_postal: true,
        activo: true,
        created_at: true,
        updated_at: true,
        _count: {
          select: {
            users: true,
            clients: true,
            repairs: true,
            stockItems: true,
            sales: true,
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundException('Empresa no encontrada');
    }

    return company;
  }

  async create(data: CreateCompanyDto) {
    const validatedData = data;

    // Verificar que el código de empresa no exista
    const existingCompany = await this.prisma.company.findUnique({
      where: { codigo_empresa: validatedData.codigo_empresa },
    });

    if (existingCompany) {
      throw new ConflictException('El código de empresa ya existe');
    }

    const slug = validatedData.slug ?? validatedData.codigo_empresa.toLowerCase();
    const existingSlug = await this.prisma.company.findUnique({ where: { slug } });
    if (existingSlug) {
      throw new ConflictException('El slug ya está en uso');
    }

    // Crear la empresa y el primer administrador en una transacción
    const result = await this.prisma.$transaction(async (tx) => {
      // Crear empresa
      const company = await tx.company.create({
        data: {
          codigo_empresa: validatedData.codigo_empresa,
          slug,
          razon_social: validatedData.razon_social,
          email: validatedData.email,
          telefono: validatedData.telefono,
          direccion: validatedData.direccion,
          ciudad: validatedData.ciudad,
          provincia: validatedData.provincia,
          codigo_postal: validatedData.codigo_postal,
        },
      });

      // Hashear contraseña del administrador
      const hashedPassword = await bcrypt.hash(validatedData.admin_password, 12);

      // Get the ADMIN role
      const adminRole = await tx.role.findUnique({
        where: { name: 'ADMIN' },
      });

      if (!adminRole) {
        throw new ConflictException('Rol ADMIN no encontrado');
      }

      // Crear primer administrador
      const admin = await tx.user.create({
        data: {
          email: validatedData.admin_email,
          password: hashedPassword,
          nombre: validatedData.admin_nombre,
          apellido: validatedData.admin_apellido,
          dni: validatedData.admin_dni,
          telefono: validatedData.admin_telefono,
          rol_id: adminRole.id,
          empresa_id: company.id,
        },
        select: {
          id: true,
          email: true,
          nombre: true,
          apellido: true,
          rol: true,
        },
      });

      // Sembrar configuración por defecto de la empresa
      await this.seedCompanyDefaults(tx, company.id);

      return { company, admin };
    });

    return result;
  }

  async update(id: string, data: UpdateCompanyDto) {
    const validatedData = data;

    const company = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Empresa no encontrada');
    }

    // Si se cambia el código, verificar que no exista
    if (validatedData.codigo_empresa && validatedData.codigo_empresa !== company.codigo_empresa) {
      const existingCompany = await this.prisma.company.findUnique({
        where: { codigo_empresa: validatedData.codigo_empresa },
      });

      if (existingCompany) {
        throw new ConflictException('El código de empresa ya existe');
      }
    }

    // Si se cambia el slug, verificar que no exista
    if (validatedData.slug && validatedData.slug !== company.slug) {
      const existingSlug = await this.prisma.company.findUnique({
        where: { slug: validatedData.slug },
      });

      if (existingSlug) {
        throw new ConflictException('El slug ya está en uso');
      }
    }

    const updatedCompany = await this.prisma.company.update({
      where: { id },
      data: validatedData,
    });

    return updatedCompany;
  }

  private async seedCompanyDefaults(tx: any, empresaId: string) {
    // Métodos de pago por defecto
    const defaultPaymentMethods = [
      { nombre: 'Efectivo', descripcion: 'Pagos estándar en mostrador' },
      { nombre: 'Tarjeta de crédito/débito', descripcion: 'Visa, Mastercard, AMEX vía terminal integrada' },
      { nombre: 'Transferencia bancaria', descripcion: 'Pagos facturados para clientes corporativos' },
    ];

    await Promise.all(
      defaultPaymentMethods.map((m) =>
        tx.paymentMethod.create({
          data: { ...m, empresa_id: empresaId, activo: true },
        }),
      ),
    );

    // Preferencias de notificación por defecto
    const defaultNotificationEvents = [
      { evento: 'NUEVO_TICKET', titulo: 'Nuevo ticket creado', descripcion: 'Se envía cuando se abre una nueva orden de reparación' },
      { evento: 'REPARACION_FINALIZADA', titulo: 'Reparación finalizada', descripcion: 'Se envía cuando el estado cambia a "Listo para recoger"' },
      { evento: 'PAGO_VENCIDO', titulo: 'Pago vencido', descripcion: 'Se envía cuando una factura permanece impagada después de la fecha de vencimiento' },
    ];

    await Promise.all(
      defaultNotificationEvents.map((e) =>
        tx.notificationPreference.create({
          data: { ...e, empresa_id: empresaId, activo: true },
        }),
      ),
    );

    // Integraciones por defecto
    const defaultIntegrations = [
      { nombre: 'whatsapp', descripcion: 'Envía notificaciones de estado y chatea con clientes desde el panel.', conectado: false },
      { nombre: 'arca', descripcion: 'Facturación electrónica y comprobantes fiscales de ARCA (AFIP).', conectado: false },
      { nombre: 'mobbex', descripcion: 'Plataforma de pagos para cobrar online por Mercado Pago, tarjetas y más.', conectado: false },
    ];

    await Promise.all(
      defaultIntegrations.map((i) =>
        tx.integration.create({
          data: { ...i, empresa_id: empresaId },
        }),
      ),
    );

    // Plan por defecto: DEMO de prueba (1 mes)
    const now = new Date();
    await tx.planSubscription.create({
      data: {
        empresa_id: empresaId,
        plan: 'DEMO',
        meses: 1,
        fecha_inicio: now,
        fecha_vencimiento: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        activo: true,
      },
    });
  }

  async activate(id: string) {
    return this.update(id, { activo: true });
  }

  async deactivate(id: string) {
    return this.update(id, { activo: false });
  }
}

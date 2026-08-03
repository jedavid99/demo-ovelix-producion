import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { EstadoReparacion } from '../repairs/enums/estado-reparacion.enum';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async findAll(currentUser: any, page: number = 1, limit: number = 10, search?: string) {
    // Para desarrolladores sin empresa, mostrar todos los clientes
    const where: any = {
      ...(currentUser.empresa_id && { empresa_id: currentUser.empresa_id }),
      ...(search && {
        OR: [
          { nombre_completo: { contains: search, mode: 'insensitive' as const } },
          { telefono: { contains: search } },
          { email: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [clients, total] = await Promise.all([
      this.prisma.client.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { fecha_registro: 'desc' },
      }),
      this.prisma.client.count({ where }),
    ]);

    return {
      data: clients,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, currentUser: any) {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException('Cliente no encontrado');
    }

    // Validar permisos (multi-tenant)
    // Desarrolladores pueden ver cualquier cliente
    if (currentUser.rol !== 'DESARROLLADOR') {
      if (!currentUser.empresa_id || client.empresa_id !== currentUser.empresa_id) {
        throw new ForbiddenException('No tienes permiso para ver este cliente');
      }
    }

    return client;
  }

  async getRepairs(id: string, currentUser: any) {
    const client = await this.findOne(id, currentUser);

    const repairs = await this.prisma.repair.findMany({
      where: { cliente_id: id },
      orderBy: { fecha_ingreso: 'desc' },
    });

    return repairs;
  }

  async create(data: CreateClientDto, currentUser: any) {
    const validatedData = data;

    // Para desarrolladores, usar la empresa_id proporcionada en el request o permitir null
    let empresaId = currentUser.empresa_id;
    
    // Si es desarrollador y no tiene empresa_id, permitir que se especifique en el request
    if (currentUser.rol === 'DESARROLLADOR' && !empresaId && validatedData.empresa_id) {
      empresaId = validatedData.empresa_id;
    }

    if (!empresaId) {
      throw new ForbiddenException('Se requiere una empresa para crear un cliente');
    }

    // Verificar si ya existe un cliente con el mismo teléfono en la empresa
    const existingClient = await this.prisma.client.findFirst({
      where: {
        telefono: validatedData.telefono,
        empresa_id: empresaId,
      },
    });

    if (existingClient) {
      throw new ConflictException('Ya existe un cliente con este teléfono');
    }

    // Filtrar campos undefined para no enviarlos a Prisma
    const clientData: any = {
      nombre_completo: validatedData.nombre_completo,
      telefono: validatedData.telefono,
      empresa_id: empresaId,
    };

    // Solo agregar campos opcionales si están definidos
    if (validatedData.dni) clientData.dni = validatedData.dni;
    if (validatedData.direccion) clientData.direccion = validatedData.direccion;
    if (validatedData.ciudad) clientData.ciudad = validatedData.ciudad;
    if (validatedData.provincia) clientData.provincia = validatedData.provincia;
    if (validatedData.codigo_postal) clientData.codigo_postal = validatedData.codigo_postal;
    if (validatedData.notas) clientData.notas = validatedData.notas;
    if (validatedData.email) clientData.email = validatedData.email;
    if (validatedData.limite_credito) clientData.limite_credito = validatedData.limite_credito;

    const client = await this.prisma.client.create({
      data: clientData,
    });

    return client;
  }

  async update(id: string, data: UpdateClientDto, currentUser: any) {
    const validatedData = data;

    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException('Cliente no encontrado');
    }

    // Validar permisos
    if (currentUser.rol !== 'DESARROLLADOR' && client.empresa_id !== currentUser.empresa_id) {
      throw new ForbiddenException('No tienes permiso para editar este cliente');
    }

    // Si se cambia el teléfono, verificar que no exista
    if (validatedData.telefono && validatedData.telefono !== client.telefono) {
      const existingClient = await this.prisma.client.findFirst({
        where: {
          telefono: validatedData.telefono,
          empresa_id: client.empresa_id,
          id: { not: id },
        },
      });

      if (existingClient) {
        throw new ConflictException('Ya existe un cliente con este teléfono');
      }
    }

    const updatedClient = await this.prisma.client.update({
      where: { id },
      data: {
        ...validatedData,
        fecha_actualizacion: new Date(),
      },
    });

    return updatedClient;
  }

  async delete(id: string, currentUser: any) {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException('Cliente no encontrado');
    }

    // Validar permisos
    if (currentUser.rol !== 'DESARROLLADOR' && client.empresa_id !== currentUser.empresa_id) {
      throw new ForbiddenException('No tienes permiso para eliminar este cliente');
    }

    // Verificar si tiene reparaciones activas
    const activeRepairs = await this.prisma.repair.count({
      where: {
        cliente_id: id,
        estado: { 
          notIn: [
            EstadoReparacion.ENTREGADO_AL_CLIENTE, 
            EstadoReparacion.CANCELADO_POR_CLIENTE, 
            EstadoReparacion.PRESUPUESTO_RECHAZADO
          ] 
        },
      },
    });

    if (activeRepairs > 0) {
      throw new ForbiddenException('No se puede eliminar un cliente con reparaciones activas');
    }

    await this.prisma.client.delete({
      where: { id },
    });

    return { message: 'Cliente eliminado exitosamente' };
  }

  async activate(id: string, currentUser: any) {
    return this.update(id, { estado: 'activo' }, currentUser);
  }

  async deactivate(id: string, currentUser: any) {
    return this.update(id, { estado: 'inactivo' }, currentUser);
  }
}

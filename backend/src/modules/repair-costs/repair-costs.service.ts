import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateRepairCostDto, UpdateRepairCostDto } from './dto/repair-costs.dto';

@Injectable()
export class RepairCostsService {
  constructor(private prisma: PrismaService) {}

  async findAll(empresaId: string, search?: string, categoria?: string, tipo_equipo?: string) {
    return this.prisma.repairCost.findMany({
      where: {
        empresa_id: empresaId,
        ...(search
          ? {
              OR: [
                { nombre: { contains: search } },
                { descripcion: { contains: search } },
                { notas: { contains: search } },
                { modelo: { contains: search } },
                { marcas: { some: { nombre: { contains: search, mode: 'insensitive' } } } },
              ],
            }
          : {}),
        ...(categoria ? { categoria } : {}),
        ...(tipo_equipo ? { tipo_equipo } : {}),
      },
      include: {
        marcas: { select: { id: true, nombre: true } },
        modelos: { include: { marca: { select: { id: true, nombre: true } } } },
      },
      orderBy: [{ activo: 'desc' }, { created_at: 'asc' }],
    });
  }

  async findOne(id: string, empresaId: string) {
    const cost = await this.prisma.repairCost.findUnique({
      where: { id },
      include: {
        marcas: { select: { id: true, nombre: true } },
        modelos: { include: { marca: { select: { id: true, nombre: true } } } },
      },
    });
    if (!cost || cost.empresa_id !== empresaId) {
      throw new NotFoundException('Costo de reparación no encontrado');
    }
    return cost;
  }

  async findPublicBySlug(slug: string) {
    const normalized = slug.toLowerCase();
    const company =
      (await this.prisma.company.findUnique({ where: { slug: normalized } })) ??
      (await this.prisma.company.findUnique({ where: { codigo_empresa: normalized } })) ??
      (await this.prisma.company.findFirst({
        where: { slug: { equals: normalized, mode: 'insensitive' }, activo: true },
      })) ??
      (await this.prisma.company.findFirst({
        where: { codigo_empresa: { equals: normalized, mode: 'insensitive' }, activo: true },
      }));
    if (!company) {
      throw new NotFoundException('Empresa no encontrada');
    }
    const items = await this.prisma.repairCost.findMany({
      where: { empresa_id: company.id, activo: true },
      include: {
        marcas: { select: { nombre: true } },
        modelos: { include: { marca: { select: { nombre: true } } } },
      },
      orderBy: [{ categoria: 'asc' }, { created_at: 'asc' }],
    });
    return items.map((i) => ({
      ...i,
      precio: Number(i.precio),
      marcas: i.marcas.map((b) => b.nombre),
      modelos: i.modelos.map((m) => ({ marca: m.marca.nombre, nombre: m.nombre })),
    }));
  }

  async create(empresaId: string, data: CreateRepairCostDto) {
    const { marcas = [], modelos = [], ...rest } = data;
    return this.prisma.$transaction(async (tx) => {
      const cost = await tx.repairCost.create({
        data: {
          nombre: rest.nombre,
          categoria: rest.categoria,
          tipo_equipo: rest.tipo_equipo || null,
          precio: rest.precio,
          tiempo_estimado: rest.tiempo_estimado ?? '',
          descripcion: rest.descripcion || null,
          notas: rest.notas || null,
          modelo: rest.modelo || null,
          activo: rest.activo ?? true,
          empresa_id: empresaId,
        },
      });
      await this.syncBrandsAndModels(tx, cost.id, empresaId, marcas, modelos);
      return this.findOneTx(tx, cost.id, empresaId);
    });
  }

  async update(id: string, empresaId: string, data: UpdateRepairCostDto) {
    const cost = await this.prisma.repairCost.findUnique({ where: { id } });
    if (!cost || cost.empresa_id !== empresaId) {
      throw new NotFoundException('Costo de reparación no encontrado');
    }
    const { marcas = [], modelos = [], ...rest } = data;
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.repairCost.update({
        where: { id },
        data: {
          ...rest,
          modelo: rest.modelo ?? null,
          tipo_equipo: rest.tipo_equipo ?? null,
          marcas: { set: [] },
          modelos: { set: [] },
        },
      });
      await this.syncBrandsAndModels(tx, updated.id, empresaId, marcas, modelos);
      return this.findOneTx(tx, updated.id, empresaId);
    });
  }

  private async findOneTx(tx: Prisma.TransactionClient, id: string, empresaId: string) {
    const cost = await tx.repairCost.findUnique({
      where: { id },
      include: {
        marcas: { select: { id: true, nombre: true } },
        modelos: { include: { marca: { select: { id: true, nombre: true } } } },
      },
    });
    if (!cost || cost.empresa_id !== empresaId) {
      throw new NotFoundException('Costo de reparación no encontrado');
    }
    return cost;
  }

  /** Convierte nombres de marcas/modelos en relaciones del RepairCost (upsert + connect). */
  private async syncBrandsAndModels(
    tx: Prisma.TransactionClient,
    costId: string,
    empresaId: string,
    marcas: string[] = [],
    modelos: { marca?: string; nombre?: string }[] = [],
  ) {
    const brandNames = marcas.map((m) => m.trim()).filter(Boolean);
    const modelPairs = modelos
      .filter((m) => m.marca && m.nombre)
      .map((m) => ({ marca: m.marca as string, nombre: m.nombre as string }));

    const brandIds: string[] = [];
    for (const nombre of brandNames) {
      const brand = await tx.brand.upsert({
        where: { nombre_empresa_id: { nombre, empresa_id: empresaId } },
        update: {},
        create: { nombre, empresa_id: empresaId },
      });
      brandIds.push(brand.id);
    }

    const modelIds: string[] = [];
    for (const { marca, nombre } of modelPairs) {
      const brand = await tx.brand.upsert({
        where: { nombre_empresa_id: { nombre: marca, empresa_id: empresaId } },
        update: {},
        create: { nombre: marca, empresa_id: empresaId },
      });
      if (!brandIds.includes(brand.id)) {
        brandIds.push(brand.id);
      }
      const model = await tx.deviceModel.upsert({
        where: { nombre_marca_id: { nombre, marca_id: brand.id } },
        update: {},
        create: { nombre, marca_id: brand.id, empresa_id: empresaId },
      });
      modelIds.push(model.id);
    }

    await tx.repairCost.update({
      where: { id: costId },
      data: {
        marcas: { set: brandIds.map((id) => ({ id })) },
        modelos: { set: modelIds.map((id) => ({ id })) },
      },
    });
  }

  async remove(id: string, empresaId: string) {
    const cost = await this.prisma.repairCost.findUnique({ where: { id } });
    if (!cost || cost.empresa_id !== empresaId) {
      throw new NotFoundException('Costo de reparación no encontrado');
    }
    await this.prisma.repairCost.delete({ where: { id } });
    return { message: 'Costo de reparación eliminado correctamente' };
  }
}
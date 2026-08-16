import { Injectable, NotFoundException } from '@nestjs/common';
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
              ],
            }
          : {}),
        ...(categoria ? { categoria } : {}),
        ...(tipo_equipo ? { tipo_equipo } : {}),
      },
      orderBy: [{ activo: 'desc' }, { created_at: 'asc' }],
    });
  }

  async findOne(id: string, empresaId: string) {
    const cost = await this.prisma.repairCost.findUnique({ where: { id } });
    if (!cost || cost.empresa_id !== empresaId) {
      throw new NotFoundException('Costo de reparación no encontrado');
    }
    return cost;
  }

  async findPublicBySlug(slug: string) {
    const normalized = slug.toLowerCase();
    const company = await this.prisma.company.findUnique({ where: { codigo_empresa: normalized } });
    const resolved =
      company ??
      (await this.prisma.company.findFirst({
        where: { codigo_empresa: { equals: normalized, mode: 'insensitive' }, activo: true },
      }));
    if (!resolved) {
      throw new NotFoundException('Empresa no encontrada');
    }
    const items = await this.prisma.repairCost.findMany({
      where: { empresa_id: resolved.id, activo: true },
      orderBy: [{ categoria: 'asc' }, { created_at: 'asc' }],
    });
    return items.map((i) => ({ ...i, precio: Number(i.precio) }));
  }

  async create(empresaId: string, data: CreateRepairCostDto) {
    return this.prisma.repairCost.create({
      data: {
        empresa_id: empresaId,
        nombre: data.nombre,
        categoria: data.categoria,
        tipo_equipo: data.tipo_equipo || null,
        precio: data.precio,
        tiempo_estimado: data.tiempo_estimado ?? '',
        descripcion: data.descripcion || null,
        notas: data.notas || null,
        modelo: data.modelo || null,
        activo: data.activo ?? true,
      },
    });
  }

  async update(id: string, empresaId: string, data: UpdateRepairCostDto) {
    const cost = await this.prisma.repairCost.findUnique({ where: { id } });
    if (!cost || cost.empresa_id !== empresaId) {
      throw new NotFoundException('Costo de reparación no encontrado');
    }
    return this.prisma.repairCost.update({
      where: { id },
      data,
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
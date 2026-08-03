import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async findAll(empresaId: string, search?: string) {
    const where: any = { empresa_id: empresaId };

    if (search) {
      where.nombre = {
        contains: search,
        mode: 'insensitive',
      };
    }

    return this.prisma.brand.findMany({
      where,
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: string, empresaId: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException('Marca no encontrada');
    }

    if (brand.empresa_id !== empresaId) {
      throw new ForbiddenException('No tienes permiso para ver esta marca');
    }

    return brand;
  }

  async create(createBrandDto: CreateBrandDto, currentUser: any) {
    // Verificar si ya existe una marca con el mismo nombre en la empresa
    const existingBrand = await this.prisma.brand.findFirst({
      where: {
        nombre: createBrandDto.nombre,
        empresa_id: currentUser.empresa_id,
      },
    });

    if (existingBrand) {
      throw new ConflictException('Ya existe una marca con este nombre en tu empresa');
    }

    return this.prisma.brand.create({
      data: {
        nombre: createBrandDto.nombre,
        empresa_id: currentUser.empresa_id,
      },
    });
  }

  async update(id: string, updateBrandDto: UpdateBrandDto, currentUser: any) {
    const brand = await this.findOne(id, currentUser.empresa_id);

    // Si se está actualizando el nombre, verificar que no exista otra marca con ese nombre
    if (updateBrandDto.nombre && updateBrandDto.nombre !== brand.nombre) {
      const existingBrand = await this.prisma.brand.findFirst({
        where: {
          nombre: updateBrandDto.nombre,
          empresa_id: currentUser.empresa_id,
          id: { not: id },
        },
      });

      if (existingBrand) {
        throw new ConflictException('Ya existe una marca con este nombre en tu empresa');
      }
    }

    return this.prisma.brand.update({
      where: { id },
      data: updateBrandDto,
    });
  }

  async remove(id: string, empresaId: string) {
    const brand = await this.findOne(id, empresaId);

    // Verificar si la marca está siendo usada en reparaciones o stock
    const repairCount = await this.prisma.repair.count({
      where: { marca: brand.nombre },
    });

    const stockCount = await this.prisma.stockItem.count({
      where: { marca: brand.nombre },
    });

    if (repairCount > 0 || stockCount > 0) {
      throw new ConflictException(
        `No se puede eliminar la marca porque está siendo usada en ${repairCount} reparaciones y ${stockCount} items de stock`
      );
    }

    await this.prisma.brand.delete({
      where: { id },
    });

    return { message: 'Marca eliminada correctamente' };
  }
}

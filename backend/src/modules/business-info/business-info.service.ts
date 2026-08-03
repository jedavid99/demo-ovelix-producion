import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UpdateBusinessInfoDto } from './dto/update-business-info.dto';

@Injectable()
export class BusinessInfoService {
  private readonly cache = new Map<string, { data: any; expiresAt: number }>();
  private static readonly CACHE_TTL_MS = 60_000;

  constructor(private prisma: PrismaService) {}

  async get(currentUser: any) {
    const empresaId = currentUser.empresa_id;

    const cached = this.cache.get(empresaId);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    const businessInfo = await (this.prisma as any).businessInfo.findUnique({
      where: { empresa_id: empresaId },
    });

    let result: any;
    if (!businessInfo) {
      // Si no existe, crear uno con datos por defecto
      result = await this.createDefault(currentUser);
    } else {
      result = businessInfo;
    }

    this.cache.set(empresaId, { data: result, expiresAt: Date.now() + BusinessInfoService.CACHE_TTL_MS });
    return result;
  }

  async update(data: UpdateBusinessInfoDto, currentUser: any) {
    const validatedData = data;

    const businessInfo = await (this.prisma as any).businessInfo.findUnique({
      where: { empresa_id: currentUser.empresa_id },
    });

    let result: any;

    if (!businessInfo) {
      result = await this.createDefault(currentUser, validatedData);
    } else {
      result = await (this.prisma as any).businessInfo.update({
        where: { empresa_id: currentUser.empresa_id },
        data: {
          ...validatedData,
          fecha_actualizacion: new Date(),
        },
      });
    }

    this.cache.set(currentUser.empresa_id, { data: result, expiresAt: Date.now() + BusinessInfoService.CACHE_TTL_MS });
    return result;
  }

  async updateLogo(logoUrl: string, currentUser: any) {
    const businessInfo = await this.get(currentUser);

    const updatedInfo = await (this.prisma as any).businessInfo.update({
      where: { empresa_id: currentUser.empresa_id },
      data: {
        logo_url: logoUrl,
        fecha_actualizacion: new Date(),
      },
    });

    this.cache.set(currentUser.empresa_id, { data: updatedInfo, expiresAt: Date.now() + BusinessInfoService.CACHE_TTL_MS });
    return updatedInfo;
  }

  private async createDefault(currentUser: any, data?: UpdateBusinessInfoDto) {
    const company = await (this.prisma as any).company.findUnique({
      where: { id: currentUser.empresa_id },
    });

    if (!company) {
      throw new NotFoundException('Empresa no encontrada');
    }

    const businessInfo = await (this.prisma as any).businessInfo.create({
      data: {
        empresa_id: currentUser.empresa_id,
        nombre_negocio: data?.nombre_negocio || company.razon_social,
        propietario_nombre: data?.propietario_nombre || '',
        telefono: data?.telefono || company.telefono || '',
        email: data?.email || company.email || '',
        direccion: data?.direccion || company.direccion || '',
        ciudad: data?.ciudad || company.ciudad || '',
        provincia: data?.provincia || company.provincia || '',
        codigo_postal: data?.codigo_postal || company.codigo_postal || '',
        sitio_web: data?.sitio_web || '',
        logo_url: data?.logo_url || '',
        descripcion: data?.descripcion || '',
        horarios: data?.horarios || {},
        moneda: data?.moneda || 'ARS',
        formato_fecha: data?.formato_fecha || 'DD/MM/YYYY',
        zona_horaria: data?.zona_horaria || 'America/Argentina/Buenos_Aires',
      },
    });

    return businessInfo;
  }
}

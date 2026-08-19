import type { Repair } from '../types/repairs.types';
import { repairApi } from './repairApi';

export interface RepairsData {
  repairs: Repair[];
  total: number;
}

interface RawRepair extends Repair {
  cliente?: { nombre_completo?: string; dni?: string | null };
  cliente_id?: string;
}

let cache: RepairsData | null = null;
let inflight: Promise<RepairsData> | null = null;

export function getRepairsCache(): RepairsData | null {
  return cache;
}

export function setRepairsCache(data: RepairsData) {
  cache = data;
}

export function clearRepairsCache() {
  cache = null;
  inflight = null;
}

/** Trae las reparaciones desde la API (con normalización) y guarda en caché. */
export async function fetchRepairsData(): Promise<RepairsData> {
  if (inflight) return inflight;

  inflight = (async () => {
    const clientsResponse = await repairApi.getClients(1000);
    const clientDniMap = (Array.isArray(clientsResponse) ? clientsResponse : []).reduce<Record<string, string | null>>(
      (acc, client: { id?: string; dni?: string | null }) => {
        if (client.id) acc[client.id] = client.dni || null;
        return acc;
      },
      {},
    );

    const rawArray = await repairApi.getRepairs(1000, 'updated_at:desc');
    const repairsArray = (Array.isArray(rawArray) ? rawArray : []).map((r: RawRepair) => ({
      ...r,
      cliente_nombre: r.cliente_nombre || r.cliente?.nombre_completo || 'Cliente no especificado',
      dni: r.dni || r.cliente?.dni || clientDniMap[r.cliente_id] || null,
      problema_reportado: r.problema_reportado || 'Sin problema',
      categoria_dispositivo: r.categoria_dispositivo || 'Sin categoría',
      estado: r.estado?.toLowerCase() || r.estado,
    }));

    const data: RepairsData = {
      repairs: repairsArray,
      total: repairsArray.length,
    };
    cache = data;
    return data;
  })().finally(() => {
    inflight = null;
  });

  return inflight;
}
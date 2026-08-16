import { PrismaClient } from '@prisma/client';

// Utilidad independiente del seed principal: crea reparaciones de prueba
// para la página pública de seguimiento. Idempotente: upsert por numero_reparacion.
// Uso: npm run prisma:seed:repairs  (o npx ts-node prisma/seed-test-repairs.ts)
const prisma = new PrismaClient();

const rep = {
  EMP001: 'company-001',
  EMP002: 'company-002',
  tec1: 'user-tec-001',
  tec2: 'user-tec-002',
};

const repairSeeds = [
  {
    numero: 'REP-20260805-0001',
    empresa: rep.EMP001,
    cliente: 'client-emp1-1',
    tecnico: rep.tec1,
    estado: 'EN_REPARACION' as const,
    dispositivo: 'iPhone 12',
    marca: 'Apple',
    modelo: 'iPhone 12',
    problema: 'No enciende y se recalienta',
    diagnosis: 'Falla en el circuito de energía',
    realizada: 'Reemplazo de batería y limpieza de placa',
    ingreso: new Date('2026-08-05T10:00:00-03:00'),
    estimada: new Date('2026-08-10T18:00:00-03:00'),
    total: 65000,
    garantia: 3,
  },
  {
    numero: 'REP-20260806-0002',
    empresa: rep.EMP001,
    cliente: 'client-emp1-2',
    tecnico: rep.tec1,
    estado: 'EN_DIAGNOSTICO' as const,
    dispositivo: 'MacBook Pro',
    marca: 'Apple',
    modelo: 'MacBook Pro 14',
    problema: 'Pantalla rota',
    diagnosis: null,
    realizada: null,
    ingreso: new Date('2026-08-06T12:00:00-03:00'),
    estimada: null,
    total: null,
    garantia: null,
  },
  {
    numero: 'REP-20260807-0003',
    empresa: rep.EMP002,
    cliente: 'client-emp2-1',
    tecnico: rep.tec2,
    estado: 'LISTO_PARA_RETIRAR' as const,
    dispositivo: 'Galaxy S23',
    marca: 'Samsung',
    modelo: 'Galaxy S23',
    problema: 'La pantalla no responde al tacto',
    diagnosis: 'Módulo de display dañado',
    realizada: 'Cambio de display',
    ingreso: new Date('2026-08-07T09:00:00-03:00'),
    estimada: new Date('2026-08-09T18:00:00-03:00'),
    total: 145000,
    garantia: 6,
  },
  {
    numero: 'REP-20260808-0004',
    empresa: rep.EMP002,
    cliente: 'client-emp2-2',
    tecnico: rep.tec2,
    estado: 'ENTREGADO_AL_CLIENTE' as const,
    dispositivo: 'Moto G54',
    marca: 'Motorola',
    modelo: 'Moto G54',
    problema: 'La batería se descarga muy rápido',
    diagnosis: 'Batería degradada',
    realizada: 'Reemplazo de batería',
    ingreso: new Date('2026-08-02T11:00:00-03:00'),
    estimada: new Date('2026-08-04T18:00:00-03:00'),
    entrega: new Date('2026-08-04T16:00:00-03:00'),
    total: 48000,
    garantia: 3,
  },
  {
    numero: 'REP-20260804-0005',
    empresa: rep.EMP001,
    cliente: 'client-emp1-3',
    tecnico: rep.tec1,
    estado: 'CANCELADO_POR_CLIENTE' as const,
    dispositivo: 'PlayStation 5',
    marca: 'Sony',
    modelo: 'PS5',
    problema: 'No enciende',
    diagnosis: 'Fuente dañada',
    realizada: null,
    ingreso: new Date('2026-08-04T10:00:00-03:00'),
    estimada: null,
    total: null,
    garantia: null,
  },
  {
    numero: 'REP-20260809-0006',
    empresa: rep.EMP002,
    cliente: 'client-emp2-3',
    tecnico: rep.tec2,
    estado: 'PRESUPUESTADO_ESPERANDO_OK' as const,
    dispositivo: 'Galaxy A54',
    marca: 'Samsung',
    modelo: 'Galaxy A54',
    problema: 'El cristal está roto',
    diagnosis: 'Cristal roto, funcionamiento OK',
    realizada: null,
    ingreso: new Date('2026-08-09T15:00:00-03:00'),
    estimada: null,
    total: 38000,
    garantia: null,
  },
  {
    numero: 'REP-20260803-0007',
    empresa: rep.EMP001,
    cliente: 'client-emp1-4',
    tecnico: rep.tec1,
    estado: 'EN_PRUEBAS_CONTROL_CALIDAD' as const,
    dispositivo: 'Notebook HP',
    marca: 'HP',
    modelo: 'Pavilion 15',
    problema: 'Se apaga sola',
    diagnosis: 'Falla térmica',
    realizada: 'Cambio de pasta térmica y limpieza',
    ingreso: new Date('2026-08-03T09:00:00-03:00'),
    estimada: new Date('2026-08-11T18:00:00-03:00'),
    total: 22000,
    garantia: 1,
  },
];

async function main() {
  let count = 0;
  for (const r of repairSeeds) {
    await prisma.repair.upsert({
      where: { numero_reparacion: r.numero },
      update: {},
      create: {
        numero_reparacion: r.numero,
        empresa_id: r.empresa,
        cliente_id: r.cliente,
        tecnico_asignado_id: r.tecnico,
        estado: r.estado,
        dispositivo: r.dispositivo,
        marca: r.marca,
        modelo: r.modelo,
        problema_reportado: r.problema,
        diagnosis: r.diagnosis,
        reparacion_realizada: r.realizada,
        fecha_ingreso: r.ingreso,
        fecha_estimada_entrega: r.estimada,
        fecha_entrega: r.entrega ?? null,
        total_reparacion: r.total,
        garantia_meses: r.garantia,
      },
    });
    count += 1;
    console.log(`upsert ${r.numero} -> ${r.estado}`);
  }
  console.log(`${count} test repairs OK`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e.message);
  await prisma.$disconnect();
  process.exit(1);
});

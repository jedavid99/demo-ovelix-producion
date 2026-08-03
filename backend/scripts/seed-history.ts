import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando migración de historial de estados...');

  const repairs = await prisma.repair.findMany({
    select: {
      id: true,
      estado: true,
      created_at: true,
    },
  });

  console.log(`Encontradas ${repairs.length} reparaciones para procesar`);

  let created = 0;
  let skipped = 0;

  for (const repair of repairs) {
    // Verificar si ya tiene historial
    const existingHistory = await prisma.repairStateHistory.findFirst({
      where: { repair_id: repair.id },
    });

    if (existingHistory) {
      console.log(`Saltando reparación ${repair.id} - ya tiene historial`);
      skipped++;
      continue;
    }

    try {
      await prisma.repairStateHistory.create({
        data: {
          repair_id: repair.id,
          estado: repair.estado,
          nota: 'Estado inicial (migración)',
          createdAt: repair.created_at,
          usuario_id: null,
        },
      });
      console.log(`Historial creado para reparación ${repair.id}`);
      created++;
    } catch (error) {
      console.error(`Error creando historial para reparación ${repair.id}:`, error);
    }
  }

  console.log(`\nMigración completada:`);
  console.log(`- Creados: ${created}`);
  console.log(`- Saltados: ${skipped}`);
  console.log(`- Total procesados: ${repairs.length}`);
}

main()
  .catch((e) => {
    console.error('Error en la migración:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

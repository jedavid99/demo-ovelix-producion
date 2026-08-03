import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Verificar mensajes en la base de datos
    const messages = await prisma.mensajeWhatsapp.findMany({
      include: {
        cliente: {
          select: {
            nombre_completo: true,
            telefono: true,
          },
        },
      },
      orderBy: { fecha_envio: 'desc' },
    });

    console.log('Total de mensajes en BD:', messages.length);
    console.log('Mensajes:', JSON.stringify(messages, null, 2));

    // Verificar mensajes por cliente
    const clients = await prisma.client.findMany({
      where: { estado: 'activo' },
      select: { id: true, nombre_completo: true, telefono: true },
    });

    console.log('\nClientes activos:', clients.length);
    
    for (const client of clients) {
      const clientMessages = await prisma.mensajeWhatsapp.findMany({
        where: { cliente_id: client.id },
        orderBy: { fecha_envio: 'desc' },
      });
      
      console.log(`\nCliente: ${client.nombre_completo} (${client.telefono})`);
      console.log(`Mensajes: ${clientMessages.length}`);
      
      if (clientMessages.length > 0) {
        console.log('Últimos mensajes:', clientMessages.slice(0, 3));
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.company
  .findMany({ select: { codigo_empresa: true, razon_social: true, activo: true }, take: 10 })
  .then((r) => {
    console.log(JSON.stringify(r, null, 1));
    return p.$disconnect();
  })
  .catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
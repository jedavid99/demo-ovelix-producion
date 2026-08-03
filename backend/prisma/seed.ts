import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create default roles
  const roles = [
    {
      name: 'DESARROLLADOR',
      description: 'Acceso completo al sistema y configuraciones',
      permissions: ['Empresas', 'Usuarios', 'Seguridad', 'Monitoreo', 'Backup', 'API'],
    },
    {
      name: 'ADMIN',
      description: 'Administrador de empresa con acceso a gestión',
      permissions: ['Ventas', 'Stock', 'Reparaciones', 'Clientes', 'Finanzas'],
    },
    {
      name: 'TECNICO',
      description: 'Técnico de reparaciones con acceso limitado',
      permissions: ['Reparaciones', 'Presupuestos'],
    },
    {
      name: 'RECEPCIONISTA',
      description: 'Recepcionista con acceso a gestión de clientes y reparaciones',
      permissions: ['Clientes', 'Reparaciones'],
    },
    {
      name: 'VENTAS',
      description: 'Personal de ventas con acceso a ventas y stock',
      permissions: ['Ventas', 'Stock'],
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  console.log('Roles created successfully!');

  // Create 2 companies
  const company1 = await prisma.company.upsert({
    where: { codigo_empresa: 'EMP001' },
    update: {},
    create: {
      codigo_empresa: 'EMP001',
      razon_social: 'Tech Reparaciones S.A.',
      email: 'contacto@techreparaciones.com',
      telefono: '+54 11 1234-5678',
      direccion: 'Av. Corrientes 1234',
      ciudad: 'Buenos Aires',
      provincia: 'Buenos Aires',
      codigo_postal: 'C1043',
      activo: true,
    },
  });

  const company2 = await prisma.company.upsert({
    where: { codigo_empresa: 'EMP002' },
    update: {},
    create: {
      codigo_empresa: 'EMP002',
      razon_social: 'ElectroFix Soluciones',
      email: 'contacto@electrofix.com',
      telefono: '+54 11 9876-5432',
      direccion: 'Calle Belgrano 567',
      ciudad: 'Córdoba',
      provincia: 'Córdoba',
      codigo_postal: '5000',
      activo: true,
    },
  });

  console.log('Companies created successfully!');

  // Get developer role
  const developerRole = await prisma.role.findUnique({
    where: { name: 'DESARROLLADOR' },
  });

  if (!developerRole) {
    throw new Error('Developer role not found');
  }

  // Create developer user (without company for global access)
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  // Check if developer user already exists
  const existingDeveloper = await prisma.user.findFirst({
    where: {
      email: 'developer@techreparaciones.com',
      rol: {
        name: 'DESARROLLADOR'
      }
    }
  });

  let developerUser;
  if (existingDeveloper) {
    // Update existing developer to remove company association
    developerUser = await prisma.user.update({
      where: { id: existingDeveloper.id },
      data: {
        empresa_id: null,
        password: hashedPassword,
        nombre: 'Juan',
        apellido: 'Pérez',
        dni: '12345678',
        telefono: '+54 11 9876-5432',
        rol_id: developerRole.id,
        activo: true,
        permissions: [], // Use default role permissions
      }
    });
  } else {
    // Create new developer user without company
    developerUser = await prisma.user.create({
      data: {
        email: 'developer@techreparaciones.com',
        password: hashedPassword,
        nombre: 'Juan',
        apellido: 'Pérez',
        dni: '12345678',
        telefono: '+54 11 9876-5432',
        rol_id: developerRole.id,
        empresa_id: null, // Developer without company for global access
        activo: true,
        permissions: [], // Use default role permissions
      },
    });
  }

  console.log('Developer user created successfully!');
  console.log('Developer email: developer@techreparaciones.com');
  console.log('Developer password: admin123');

  // Get admin and technician roles
  const adminRole = await prisma.role.findUnique({
    where: { name: 'ADMIN' },
  });

  const technicianRole = await prisma.role.findUnique({
    where: { name: 'TECNICO' },
  });

  if (!adminRole || !technicianRole) {
    throw new Error('Admin or Technician role not found');
  }

  // Create 2 admin users (one per company)
  const adminUsers = [
    {
      email: 'admin@techreparaciones.com',
      nombre: 'María',
      apellido: 'García',
      dni: '87654321',
      telefono: '+54 11 5555-6666',
      empresa_id: company1.id,
    },
    {
      email: 'admin@electrofix.com',
      nombre: 'Roberto',
      apellido: 'Martínez',
      dni: '12345678',
      telefono: '+54 11 7777-8888',
      empresa_id: company2.id,
    },
  ];

  for (const adminData of adminUsers) {
    const existingAdmin = await prisma.user.findFirst({
      where: {
        email: adminData.email,
        empresa_id: adminData.empresa_id,
      }
    });

    if (existingAdmin) {
      await prisma.user.update({
        where: { id: existingAdmin.id },
        data: {
          password: hashedPassword,
          nombre: adminData.nombre,
          apellido: adminData.apellido,
          dni: adminData.dni,
          telefono: adminData.telefono,
          rol_id: adminRole.id,
          empresa_id: adminData.empresa_id,
          activo: true,
          permissions: [],
        }
      });
    } else {
      await prisma.user.create({
        data: {
          email: adminData.email,
          password: hashedPassword,
          nombre: adminData.nombre,
          apellido: adminData.apellido,
          dni: adminData.dni,
          telefono: adminData.telefono,
          rol_id: adminRole.id,
          empresa_id: adminData.empresa_id,
          activo: true,
          permissions: [],
        },
      });
    }
    console.log(`Admin user created: ${adminData.email}`);
  }

  // Create 2 technician users (one per company)
  const technicianUsers = [
    {
      email: 'tecnico@techreparaciones.com',
      nombre: 'Carlos',
      apellido: 'López',
      dni: '11223344',
      telefono: '+54 11 3333-4444',
      empresa_id: company1.id,
    },
    {
      email: 'tecnico@electrofix.com',
      nombre: 'Ana',
      apellido: 'Rodríguez',
      dni: '55667788',
      telefono: '+54 11 9999-0000',
      empresa_id: company2.id,
    },
  ];

  for (const techData of technicianUsers) {
    const existingTech = await prisma.user.findFirst({
      where: {
        email: techData.email,
        empresa_id: techData.empresa_id,
      }
    });

    if (existingTech) {
      await prisma.user.update({
        where: { id: existingTech.id },
        data: {
          password: hashedPassword,
          nombre: techData.nombre,
          apellido: techData.apellido,
          dni: techData.dni,
          telefono: techData.telefono,
          rol_id: technicianRole.id,
          empresa_id: techData.empresa_id,
          activo: true,
          permissions: [],
        }
      });
    } else {
      await prisma.user.create({
        data: {
          email: techData.email,
          password: hashedPassword,
          nombre: techData.nombre,
          apellido: techData.apellido,
          dni: techData.dni,
          telefono: techData.telefono,
          rol_id: technicianRole.id,
          empresa_id: techData.empresa_id,
          activo: true,
          permissions: [],
        },
      });
    }
    console.log(`Technician user created: ${techData.email}`);
  }

  // Create 5 clients for each company
  const clientsCompany1 = [
    {
      nombre_completo: 'Carlos López',
      email: 'carlos.lopez@email.com',
      telefono: '+54 11 4444-3333',
      dni: '11223344',
      direccion: 'Calle Falsa 123',
      ciudad: 'Buenos Aires',
      provincia: 'Buenos Aires',
      codigo_postal: 'C1000',
    },
    {
      nombre_completo: 'Laura Fernández',
      email: 'laura.fernandez@email.com',
      telefono: '+54 11 5555-6666',
      dni: '22334455',
      direccion: 'Av. Libertador 456',
      ciudad: 'Buenos Aires',
      provincia: 'Buenos Aires',
      codigo_postal: 'C1010',
    },
    {
      nombre_completo: 'Pedro González',
      email: 'pedro.gonzalez@email.com',
      telefono: '+54 11 6666-7777',
      dni: '33445566',
      direccion: 'Calle San Martín 789',
      ciudad: 'Buenos Aires',
      provincia: 'Buenos Aires',
      codigo_postal: 'C1020',
    },
    {
      nombre_completo: 'Sofía Ramírez',
      email: 'sofia.ramirez@email.com',
      telefono: '+54 11 7777-8888',
      dni: '44556677',
      direccion: 'Av. Santa Fe 321',
      ciudad: 'Buenos Aires',
      provincia: 'Buenos Aires',
      codigo_postal: 'C1030',
    },
    {
      nombre_completo: 'Diego Torres',
      email: 'diego.torres@email.com',
      telefono: '+54 11 8888-9999',
      dni: '55667788',
      direccion: 'Calle Belgrano 654',
      ciudad: 'Buenos Aires',
      provincia: 'Buenos Aires',
      codigo_postal: 'C1040',
    },
  ];

  const clientsCompany2 = [
    {
      nombre_completo: 'Mariana Benítez',
      email: 'mariana.benitez@email.com',
      telefono: '+54 11 1111-2222',
      dni: '66778899',
      direccion: 'Calle Colón 123',
      ciudad: 'Córdoba',
      provincia: 'Córdoba',
      codigo_postal: '5000',
    },
    {
      nombre_completo: 'Javier Castro',
      email: 'javier.castro@email.com',
      telefono: '+54 11 2222-3333',
      dni: '77889900',
      direccion: 'Av. Vélez Sarsfield 456',
      ciudad: 'Córdoba',
      provincia: 'Córdoba',
      codigo_postal: '5001',
    },
    {
      nombre_completo: 'Valentina Flores',
      email: 'valentina.flores@email.com',
      telefono: '+54 11 3333-4444',
      dni: '88990011',
      direccion: 'Calle San Juan 789',
      ciudad: 'Córdoba',
      provincia: 'Córdoba',
      codigo_postal: '5002',
    },
    {
      nombre_completo: 'Fernando Mendoza',
      email: 'fernando.mendoza@email.com',
      telefono: '+54 11 4444-5555',
      dni: '99001122',
      direccion: 'Av. Hipólito Yrigoyen 321',
      ciudad: 'Córdoba',
      provincia: 'Córdoba',
      codigo_postal: '5003',
    },
    {
      nombre_completo: 'Camila Ríos',
      email: 'camila.rios@email.com',
      telefono: '+54 11 5555-6666',
      dni: '00112233',
      direccion: 'Calle Independencia 654',
      ciudad: 'Córdoba',
      provincia: 'Córdoba',
      codigo_postal: '5004',
    },
  ];

  // Create clients for company 1
  for (let i = 0; i < clientsCompany1.length; i++) {
    const clientData = clientsCompany1[i];
    await prisma.client.upsert({
      where: { id: `client-emp1-${i + 1}` },
      update: {},
      create: {
        id: `client-emp1-${i + 1}`,
        ...clientData,
        estado: 'activo',
        empresa_id: company1.id,
      },
    });
  }
  console.log('5 clients created for Tech Reparaciones S.A.');

  // Create clients for company 2
  for (let i = 0; i < clientsCompany2.length; i++) {
    const clientData = clientsCompany2[i];
    await prisma.client.upsert({
      where: { id: `client-emp2-${i + 1}` },
      update: {},
      create: {
        id: `client-emp2-${i + 1}`,
        ...clientData,
        estado: 'activo',
        empresa_id: company2.id,
      },
    });
  }
  console.log('5 clients created for ElectroFix Soluciones');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

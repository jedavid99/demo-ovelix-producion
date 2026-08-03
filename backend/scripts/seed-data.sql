-- Script SQL para insertar datos de prueba en la base de datos
-- Ejecutar en orden: Roles -> Companies -> Users -> Clients

-- ============================================
-- 1. INSERT ROLES
-- ============================================
INSERT INTO "Role" (id, name, description, permissions, created_at, updated_at) VALUES
('role-dev-001', 'DESARROLLADOR', 'Acceso completo al sistema y configuraciones', ARRAY['Empresas', 'Usuarios', 'Seguridad', 'Monitoreo', 'Backup', 'API'], NOW(), NOW()),
('role-admin-001', 'ADMIN', 'Administrador de empresa con acceso a gestión', ARRAY['Ventas', 'Stock', 'Reparaciones', 'Clientes', 'Finanzas'], NOW(), NOW()),
('role-tec-001', 'TECNICO', 'Técnico de reparaciones con acceso limitado', ARRAY['Reparaciones', 'Presupuestos'], NOW(), NOW()),
('role-rec-001', 'RECEPCIONISTA', 'Recepcionista con acceso a gestión de clientes y reparaciones', ARRAY['Clientes', 'Reparaciones'], NOW(), NOW()),
('role-ventas-001', 'VENTAS', 'Personal de ventas con acceso a ventas y stock', ARRAY['Ventas', 'Stock'], NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- 2. INSERT COMPANIES
-- ============================================
INSERT INTO "Company" (id, codigo_empresa, razon_social, email, telefono, direccion, ciudad, provincia, codigo_postal, activo, created_at, updated_at) VALUES
('company-001', 'EMP001', 'Tech Reparaciones S.A.', 'contacto@techreparaciones.com', '+54 11 1234-5678', 'Av. Corrientes 1234', 'Buenos Aires', 'Buenos Aires', 'C1043', true, NOW(), NOW()),
('company-002', 'EMP002', 'ElectroFix Soluciones', 'contacto@electrofix.com', '+54 11 9876-5432', 'Calle Belgrano 567', 'Córdoba', 'Córdoba', '5000', true, NOW(), NOW())
ON CONFLICT (codigo_empresa) DO NOTHING;

-- ============================================
-- 3. INSERT USERS
-- Password: admin123 (bcrypt hash)
-- ============================================
INSERT INTO "User" (id, email, password, nombre, apellido, dni, telefono, activo, empresa_id, rol_id, created_at, updated_at) VALUES
-- Developer (sin empresa para acceso global)
('user-dev-001', 'developer@techreparaciones.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Juan', 'Pérez', '12345678', '+54 11 9876-5432', true, NULL, 'role-dev-001', NOW(), NOW()),
-- Admin Tech Reparaciones
('user-admin-001', 'admin@techreparaciones.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'María', 'García', '87654321', '+54 11 5555-6666', true, 'company-001', 'role-admin-001', NOW(), NOW()),
-- Admin ElectroFix
('user-admin-002', 'admin@electrofix.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Roberto', 'Martínez', '12345678', '+54 11 7777-8888', true, 'company-002', 'role-admin-001', NOW(), NOW()),
-- Técnico Tech Reparaciones
('user-tec-001', 'tecnico@techreparaciones.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Carlos', 'López', '11223344', '+54 11 3333-4444', true, 'company-001', 'role-tec-001', NOW(), NOW()),
-- Técnico ElectroFix
('user-tec-002', 'tecnico@electrofix.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ana', 'Rodríguez', '55667788', '+54 11 9999-0000', true, 'company-002', 'role-tec-001', NOW(), NOW())
ON CONFLICT (email, empresa_id) DO NOTHING;

-- ============================================
-- 4. INSERT CLIENTS - Tech Reparaciones S.A.
-- ============================================
INSERT INTO "Client" (id, nombre_completo, email, telefono, dni, direccion, ciudad, provincia, codigo_postal, estado, deuda_actual, empresa_id, fecha_registro) VALUES
('client-emp1-1', 'Carlos López', 'carlos.lopez@email.com', '+54 11 4444-3333', '11223344', 'Calle Falsa 123', 'Buenos Aires', 'Buenos Aires', 'C1000', 'activo', 0.00, 'company-001', NOW()),
('client-emp1-2', 'Laura Fernández', 'laura.fernandez@email.com', '+54 11 5555-6666', '22334455', 'Av. Libertador 456', 'Buenos Aires', 'Buenos Aires', 'C1010', 'activo', 0.00, 'company-001', NOW()),
('client-emp1-3', 'Pedro González', 'pedro.gonzalez@email.com', '+54 11 6666-7777', '33445566', 'Calle San Martín 789', 'Buenos Aires', 'Buenos Aires', 'C1020', 'activo', 0.00, 'company-001', NOW()),
('client-emp1-4', 'Sofía Ramírez', 'sofia.ramirez@email.com', '+54 11 7777-8888', '44556677', 'Av. Santa Fe 321', 'Buenos Aires', 'Buenos Aires', 'C1030', 'activo', 0.00, 'company-001', NOW()),
('client-emp1-5', 'Diego Torres', 'diego.torres@email.com', '+54 11 8888-9999', '55667788', 'Calle Belgrano 654', 'Buenos Aires', 'Buenos Aires', 'C1040', 'activo', 0.00, 'company-001', NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. INSERT CLIENTS - ElectroFix Soluciones
-- ============================================
INSERT INTO "Client" (id, nombre_completo, email, telefono, dni, direccion, ciudad, provincia, codigo_postal, estado, deuda_actual, empresa_id, fecha_registro) VALUES
('client-emp2-1', 'Mariana Benítez', 'mariana.benitez@email.com', '+54 11 1111-2222', '66778899', 'Calle Colón 123', 'Córdoba', 'Córdoba', '5000', 'activo', 0.00, 'company-002', NOW()),
('client-emp2-2', 'Javier Castro', 'javier.castro@email.com', '+54 11 2222-3333', '77889900', 'Av. Vélez Sarsfield 456', 'Córdoba', 'Córdoba', '5001', 'activo', 0.00, 'company-002', NOW()),
('client-emp2-3', 'Valentina Flores', 'valentina.flores@email.com', '+54 11 3333-4444', '88990011', 'Calle San Juan 789', 'Córdoba', 'Córdoba', '5002', 'activo', 0.00, 'company-002', NOW()),
('client-emp2-4', 'Fernando Mendoza', 'fernando.mendoza@email.com', '+54 11 4444-5555', '99001122', 'Av. Hipólito Yrigoyen 321', 'Córdoba', 'Córdoba', '5003', 'activo', 0.00, 'company-002', NOW()),
('client-emp2-5', 'Camila Ríos', 'camila.rios@email.com', '+54 11 5555-6666', '00112233', 'Calle Independencia 654', 'Córdoba', 'Córdoba', '5004', 'activo', 0.00, 'company-002', NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- RESUMEN DE DATOS CREADOS
-- ============================================
-- Roles: 5 (DESARROLLADOR, ADMIN, TECNICO, RECEPCIONISTA, VENTAS)
-- Empresas: 2 (Tech Reparaciones S.A., ElectroFix Soluciones)
-- Usuarios: 5 (1 developer, 2 admins, 2 técnicos)
-- Clientes: 10 (5 por empresa)
-- Contraseña para todos: admin123

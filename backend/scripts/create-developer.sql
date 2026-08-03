-- Script para crear un usuario desarrollador
-- Ejecuta esto directamente en tu base de datos PostgreSQL

-- Insertar usuario desarrollador
-- La contraseña debe estar hasheada con bcrypt (cost factor 12)
-- Para generar el hash, puedes usar: bcrypt.hash('tu_contraseña', 12)

-- Ejemplo con contraseña "admin123" (hash generado con bcrypt cost 12)
INSERT INTO "User" (
    id,
    email,
    password,
    nombre,
    apellido,
    dni,
    telefono,
    rol,
    activo,
    empresa_id,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'desarrollador@ovelix.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7qvqZqZqZq', -- contraseña: admin123
    'Desarrollador',
    'Sistema',
    NULL,
    NULL,
    'DESARROLLADOR',
    true,
    NULL, -- empresa_id es NULL para desarrolladores globales
    NOW(),
    NOW()
);

-- Verificar que el usuario fue creado
SELECT id, email, nombre, apellido, rol, activo FROM "User" WHERE rol = 'DESARROLLADOR';

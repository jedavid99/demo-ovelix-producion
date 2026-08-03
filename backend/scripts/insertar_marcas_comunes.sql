-- Script SQL para insertar marcas comunes en la tabla Brand
-- Reemplaza TU_EMPRESA_ID con el ID de tu empresa

-- Primero, obtén el empresa_id de tu empresa:
-- SELECT id, codigo_empresa, razon_social FROM "Company";

-- Luego, inserta las marcas reemplazando TU_EMPRESA_ID con el ID correcto

INSERT INTO "Brand" (id, nombre, empresa_id, created_at, updated_at) VALUES
-- Marcas de Teléfonos
(gen_random_uuid(), 'Apple', 'TU_EMPRESA_ID', NOW(), NOW()),
(gen_random_uuid(), 'Samsung', 'TU_EMPRESA_ID', NOW(), NOW()),
(gen_random_uuid(), 'Xiaomi', 'TU_EMPRESA_ID', NOW(), NOW()),
(gen_random_uuid(), 'Motorola', 'TU_EMPRESA_ID', NOW(), NOW()),
(gen_random_uuid(), 'LG', 'TU_EMPRESA_ID', NOW(), NOW()),
(gen_random_uuid(), 'Huawei', 'TU_EMPRESA_ID', NOW(), NOW()),
(gen_random_uuid(), 'Oppo', 'TU_EMPRESA_ID', NOW(), NOW()),
(gen_random_uuid(), 'Vivo', 'TU_EMPRESA_ID', NOW(), NOW()),
(gen_random_uuid(), 'OnePlus', 'TU_EMPRESA_ID', NOW(), NOW()),
(gen_random_uuid(), 'Google', 'TU_EMPRESA_ID', NOW(), NOW()),
(gen_random_uuid(), 'Sony', 'TU_EMPRESA_ID', NOW(), NOW()),
(gen_random_uuid(), 'Nokia', 'TU_EMPRESA_ID', NOW(), NOW()),
(gen_random_uuid(), 'ZTE', 'TU_EMPRESA_ID', NOW(), NOW()),
(gen_random_uuid(), 'Alcatel', 'TU_EMPRESA_ID', NOW(), NOW()),
(gen_random_uuid(), 'Realme', 'TU_EMPRESA_ID', NOW(), NOW()),

-- Marcas de Laptops/Notebooks
(gen_random_uuid(), 'Dell', 'TU_EMPRESA_ID', NOW(), NOW()),
(gen_random_uuid(), 'HP', 'TU_EMPRESA_ID', NOW(), NOW()),
(gen_random_uuid(), 'Lenovo', 'TU_EMPRESA_ID', NOW(), NOW()),
(gen_random_uuid(), 'Asus', 'TU_EMPRESA_ID', NOW(), NOW()),
(gen_random_uuid(), 'Acer', 'TU_EMPRESA_ID', NOW(), NOW()),
(gen_random_uuid(), 'MSI', 'TU_EMPRESA_ID', NOW(), NOW()),
(gen_random_uuid(), 'Toshiba', 'TU_EMPRESA_ID', NOW(), NOW()),
(gen_random_uuid(), 'Microsoft', 'TU_EMPRESA_ID', NOW(), NOW()),
(gen_random_uuid(), 'Razer', 'TU_EMPRESA_ID', NOW(), NOW()),
(gen_random_uuid(), 'Gigabyte', 'TU_EMPRESA_ID', NOW(), NOW()),

-- Marcas de Tablets
(gen_random_uuid(), 'Amazon', 'TU_EMPRESA_ID', NOW(), NOW()),

-- Marcas de Smartwatches
(gen_random_uuid(), 'Garmin', 'TU_EMPRESA_ID', NOW(), NOW()),
(gen_random_uuid(), 'Fitbit', 'TU_EMPRESA_ID', NOW(), NOW()),

-- Marcas de Audífonos
(gen_random_uuid(), 'Bose', 'TU_EMPRESA_ID', NOW(), NOW()),
(gen_random_uuid(), 'JBL', 'TU_EMPRESA_ID', NOW(), NOW()),
(gen_random_uuid(), 'Sennheiser', 'TU_EMPRESA_ID', NOW(), NOW()),
(gen_random_uuid(), 'Audio-Technica', 'TU_EMPRESA_ID', NOW(), NOW()),
(gen_random_uuid(), 'Sony', 'TU_EMPRESA_ID', NOW(), NOW()),

-- Marcas de Consolas
(gen_random_uuid(), 'Nintendo', 'TU_EMPRESA_ID', NOW(), NOW()),

-- Marcas generales
(gen_random_uuid(), 'Otro', 'TU_EMPRESA_ID', NOW(), NOW())
ON CONFLICT (nombre, empresa_id) DO NOTHING;

-- Verificar las marcas insertadas
-- SELECT * FROM "Brand" WHERE empresa_id = 'TU_EMPRESA_ID' ORDER BY nombre;

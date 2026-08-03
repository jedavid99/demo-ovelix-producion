# ovelix (TechRepair Pro)

Sistema de gestión para talleres de reparación técnica (Órdenes de servicio, clientes, stock, ventas, caja, WhatsApp).

## Estructura del Proyecto

```
overlix-demo/
├── frontend/          # Aplicación React 18 + Vite + TypeScript + Tailwind + shadcn/ui
├── backend/           # API NestJS + Prisma + PostgreSQL
├── backend/scripts/   # Scripts auxiliares (SQL y utilidades)
└── README.md          # Este archivo
```

## Características

- Gestión de reparaciones con historial de estados y garantías
- Gestión de clientes, ventas y caja diaria
- Gestión de stock, marcas y categorías
- Presupuestos y generación de PDFs (orden de servicio, tickets térmicos)
- Integración WhatsApp (Baileys) para notificar y chatear con clientes
- Roles, permisos por usuario y multi-empresa
- Autenticación JWT + rate limiting + validación con Zod
- Documentación Swagger/OpenAPI

## Tecnologías

### Frontend
- React 18, TypeScript, Vite 5
- Tailwind CSS 3, shadcn/ui (Radix), Framer Motion
- React Router, Axios

### Backend
- NestJS 10, TypeScript
- Prisma ORM + PostgreSQL
- JWT (access + refresh con hash en BD), Passport
- Zod (validación de DTOs), @nestjs/throttler, Swagger/OpenAPI
- PDFKit, qrcode, Baileys (WhatsApp)

## Instalación

### Prerrequisitos
- Node.js 18+
- npm
- PostgreSQL 14+ (o Supabase Postgres remoto)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend disponible en `http://localhost:5173`

### Backend

```bash
cd backend
npm install
cp .env.example .env        # editar credenciales
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

Backend disponible en `http://localhost:3000`

## Variables de Entorno

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
```

### Backend (.env) — ver `.env.example`
```
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://...:5432/ovelix?schema=public"   # puede usar pooler de Supabase
DIRECT_URL="postgresql://...:5432/ovelix?schema=public"      # conexión directa (migraciones)
JWT_SECRET="..."
JWT_REFRESH_SECRET="..."
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
DEV_INVITE_TOKEN="..."                                        # requerido para POST /auth/register-developer
CORS_ORIGIN="http://localhost:5173"
```

> El boot falla si faltan `DATABASE_URL`, `JWT_SECRET` o `JWT_REFRESH_SECRET` (validación fail-fast).

## Scripts

### Frontend
- `npm run dev` — servidor de desarrollo (:5173)
- `npm run build` — build de producción
- `npm run lint` — ESLint

### Backend
- `npm run start:dev` — NestJS watch mode (:3000)
- `npm run build` / `npm run start:prod` — producción
- `npm test` — tests unitarios (Jest)
- `npm run prisma:generate` — regenerar cliente Prisma
- `npm run prisma:migrate` / `prisma:deploy` — migraciones
- `npm run prisma:studio` — GUI de Prisma
- `npm run prisma:seed` — datos de ejemplo

## API Documentation

- Swagger UI: `http://localhost:3000/api/docs`
- Los controladores están anotados con `@ApiTags`/`@ApiOperation`/`@ApiBearerAuth`

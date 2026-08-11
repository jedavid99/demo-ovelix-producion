# AGENTS.md — TechRepair Pro (ovelix)

## Stack
- **Frontend**: React 18 + TypeScript + Vite 5 + Tailwind CSS 3 + shadcn/ui (Radix primitives)
- **Backend**: NestJS 10 + Prisma (PostgreSQL) + JWT auth
- **Deploy**: Frontend → Vercel, Backend → Railway (`railway.json` sets `rootDirectory: backend`)

## Dev Commands

```bash
cd frontend    && npm run dev     # Vite dev server at :5173
cd frontend    && npm run build   # production build
cd frontend    && npm run lint    # ESLint (.ts,.tsx,.js,.jsx)
cd backend     && npm run start:dev   # NestJS watch mode at :3000
cd backend     && npm run build   # nest build → dist/
cd backend     && npm run start:prod  # node dist/main
cd backend     && npm run prisma:generate  # after schema changes
cd backend     && npm run prisma:migrate   # dev migration
cd backend     && npm run prisma:deploy    # prod migration (no interactive)
cd backend     && npm run prisma:seed      # ts-node prisma/seed.ts
cd backend     && npm run test            # Jest unit tests (rootDir src, *.spec.ts)
cd backend     && npx jest src/modules/<x>/<x>.spec.ts  # single test
```

## Gotchas

- **Frontend has NO test command** — only `build`, `dev`, `preview`, `lint`.
- **Dev auth mock**: `frontend/src/main.tsx` imports `./setupMocks`, which patches `window.fetch` when hostname is `localhost`/`127.0.0.1` to mock `GET /api/auth/me` and `/api/logout`. Auth works in-browser without a backend; "logged in" state is `localStorage.adminAuth === 'true'`. Don't mistake this for real auth or remove the import.
- **Backend response envelope**: `backend/src/main.ts` sets global prefix `/api` and applies a global `TransformInterceptor` — every success response is `{ data, statusCode, timestamp, path }`. Frontend axios helpers depend on this shape.
- **Backend is strict**: global `JwtAuthGuard` (all routes require JWT unless `@Public()`), `ValidationPipe` with `whitelist` + `forbidNonWhitelisted`, helmet, compression. Swagger at `/api/docs`.
- **`@/` alias** (`frontend/src/`) is set in `vite.config.ts` but NOT in `backend` — backend uses relative imports.
- **Dead next/* compat**: `vite.config.ts` aliases `next/link`, `next/image`, `next/navigation` to `src/compat/next.tsx`, but that file does NOT exist. Don't use `next/*` imports.
- **Stray empty root dirs**: `components/`, `constants/`, `hooks/`, `pages/`, `services/`, `types/` at repo root are empty leftovers — put code in `frontend/`, never there.

## Architecture

- `frontend/src/app/router.tsx` — all routes, **static imports** (no lazy loading). Route `<Route>` elements wrap in `PrivateRoute` → `ProtectedRoute` → `AdminLayout`.
- `frontend/src/features/` — feature modules (auth, repairs, clients, sales, products, settings, shipments, whatsapp, developer, etc.), each with own components/hooks/types/constants
- `frontend/src/shared/` — shared UI components, layouts, hooks, lib utilities
- `frontend/src/pages/` — top-level non-feature pages (RepairStatus, QRScanner)
- `frontend/src/contexts/` — AuthContext, LoadingContext, ThemeContext; `frontend/src/app/shared/contexts/` — AppContext
- `backend/src/modules/` — NestJS modules (auth, clients, repairs, brands, budgets, cash-closing, sales, stock, whatsapp, ...)
- `backend/src/database/prisma.service.ts` — Prisma client singleton
- `backend/src/common/` — global interceptors, filters, guards

## Code Conventions

- `@/` alias maps to `frontend/src/` (used in all imports)
- Barrel exports at original paths when refactoring large files into subfolders (e.g. `IPhoneInventoryList.tsx` → `export { default } from './iPhoneInventoryList/IPhoneInventoryList'`)
- Shadcn UI components in `src/shared/components/ui/` — use `cn()` utility from `src/shared/lib/utils.ts` for class merging
- CSS: Tailwind utility classes + `tw-animate-css` + `shadcn/tailwind.css`
- Dark mode via `class` strategy on `<html>` (`tailwind.config.cjs`)
- ESLint: `no-console` (warn, allow warn/error), `@typescript-eslint/no-unused-vars` (warn)
- `MotionConfig reducedMotion="user"` wraps App.tsx — do not remove

## Refactoring Pattern

Files >250 lines get split into `moduleName/` subfolders with pattern:
```
OriginalFile.tsx → OriginalFile.tsx (barrel re-export)
                   moduleName/
                     types.ts | constants.ts
                     hooks/use*.ts
                     components/*.tsx
                     ModuleName.tsx (assembled)
```

## Key Files

- `frontend/src/App.tsx` — root component with ErrorBoundary + MotionConfig
- `frontend/src/app/router.tsx` — all routes
- `frontend/src/app/providers.tsx` — exports `ClientProviders` (Theme, App, Loading, Auth providers)
- `frontend/src/main.tsx` — entrypoint (React.StrictMode + BrowserRouter + setupMocks)
- `frontend/src/index.css` — Tailwind layers + @media (prefers-reduced-motion) fallback
- `frontend/vite.config.ts` — path aliases (@/, next/* compat)
- `backend/src/main.ts` — global prefix, guards, pipes, Swagger setup

## Agent Skills

- `.agents/skills/nestjs-best-practices` is installed (see `skills-lock.json`). Use it when writing/reviewing backend NestJS code. Available skills are loaded via the `skill` tool.
- `.agents/skills/frontend-design` (anthropics/skills) is installed. Use it when building/designing frontend UI.

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2,
  Users,
  Wrench,
  ArrowDownToLine,
  Shield,
  Activity,
  Building,
  BarChart,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import api from '../../services/api';
import { LoadingState } from '@/shared/components/async/LoadingState';
import { ErrorState } from '@/shared/components/async/ErrorState';

const ROLE_BADGE = (role: string) => {
  switch (role) {
    case 'DESARROLLADOR':
      return 'bg-purple-100 text-purple-800';
    case 'ADMIN':
      return 'bg-blue-100 text-blue-800';
    case 'TECNICO':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-muted text-foreground';
  }
};

interface DashboardCompany {
  id: string;
  codigo_empresa: string;
  razon_social: string;
  activo: boolean;
  _count?: { users?: number; clients?: number; repairs?: number };
}

interface DashboardUser {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  activo: boolean;
  empresa_id?: string | null;
  rol?: { id: string; name: string };
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const fade = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export default function DeveloperDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [companies, setCompanies] = useState<DashboardCompany[]>([]);
  const [users, setUsers] = useState<DashboardUser[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [statsRes, companiesRes, usersRes] = await Promise.all([
          api.get('/analytics/stats'),
          api.get('/companies'),
          api.get('/users'),
        ]);
        if (!active) return;
        setStats(statsRes.data?.data ?? statsRes.data ?? null);
        setCompanies(Array.isArray(companiesRes.data?.data) ? companiesRes.data.data : []);
        setUsers(Array.isArray(usersRes.data?.data) ? usersRes.data.data : []);
      } catch {
        if (active) setError('No se pudieron cargar los datos. Verificá tu conexión e intentá de nuevo.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <LoadingState label="Cargando panel..." />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => {
          setLoading(true);
          setError(null);
          window.location.reload();
        }}
      />
    );
  }

  const companyById = (id: string) => companies.find((c) => c.id === id);

  const kpis = [
    { label: 'Empresas activas', value: stats?.companies ?? companies.length, icon: Building2, chip: 'bg-blue-100 text-blue-600', path: '/developer/companies' },
    { label: 'Usuarios registrados', value: stats?.users ?? users.length, icon: Users, chip: 'bg-green-100 text-green-700', path: '/developer/users' },
    { label: 'Reparaciones', value: stats?.repairs ?? 0, icon: Wrench, chip: 'bg-purple-100 text-purple-700', path: '/developer/analytics/stats' },
    { label: 'Ventas', value: stats?.sales ?? 0, icon: ArrowDownToLine, chip: 'bg-orange-100 text-orange-700', path: '/developer/analytics/stats' },
  ];

  const recentCompanies = companies.slice(0, 5);
  const recentUsers = users.slice(0, 6);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fade} className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Panel Desarrollador · Resumen
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground">Vista general</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Empresas y usuarios registrados en el sistema, con métricas de actividad
          </p>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 sm:flex">
          <Activity className="h-4 w-4 text-primary" />
          <span className="font-mono text-xs text-muted-foreground">En vivo</span>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <motion.button
              key={kpi.label}
              variants={fade}
              onClick={() => navigate(kpi.path)}
              className="group rounded-xl border border-border bg-card p-5 text-left shadow-sm transition-colors hover:border-primary/40"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className={`rounded-lg p-3 ${kpi.chip}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {kpi.label}
                </span>
              </div>
              <div className="text-3xl font-bold tabular-nums tracking-tight text-foreground">
                {kpi.value.toLocaleString('es-AR')}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Listados */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Empresas */}
        <motion.div variants={fade} className="rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-foreground">Empresas registradas</h3>
            </div>
            <button
              onClick={() => navigate('/developer/companies')}
              className="text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              Ver todas
            </button>
          </div>
          <ul className="divide-y divide-border">
            {recentCompanies.length === 0 && (
              <li className="px-5 py-10 text-center text-sm text-muted-foreground">
                Todavía no hay empresas registradas.
              </li>
            )}
            {recentCompanies.map((company) => (
              <li key={company.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-semibold text-white">
                    {(company.razon_social || company.codigo_empresa || '?')
                      .toString()
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-medium text-foreground">{company.razon_social || '—'}</div>
                    <div className="font-mono text-xs text-muted-foreground">
                      {company.codigo_empresa} · {company._count?.users ?? 0} usuario{(company._count?.users ?? 0) === 1 ? '' : 's'}
                    </div>
                  </div>
                </div>
                {company.activo ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Activa
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                    <XCircle className="h-3.5 w-3.5" /> Inactiva
                  </span>
                )}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Usuarios */}
        <motion.div variants={fade} className="rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-foreground">Usuarios recientes</h3>
            </div>
            <button
              onClick={() => navigate('/developer/users')}
              className="text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              Ver todos
            </button>
          </div>
          <ul className="divide-y divide-border">
            {recentUsers.length === 0 && (
              <li className="px-5 py-10 text-center text-sm text-muted-foreground">
                Todavía no hay usuarios registrados.
              </li>
            )}
            {recentUsers.map((user) => {
              const company = user.empresa_id ? companyById(user.empresa_id) : null;
              return (
                <li key={user.id} className="flex items-center justify-between gap-4 px-5 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-xs font-semibold text-white">
                      {(user.nombre || '?').charAt(0)}
                      {(user.apellido || '').charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-medium text-foreground">
                        {user.nombre} {user.apellido}
                      </div>
                      <div className="truncate font-mono text-xs text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_BADGE(user.rol?.name || '')}`}>
                      {user.rol?.name || '—'}
                    </span>
                    <span className="hidden font-mono text-xs text-muted-foreground sm:block">
                      {company ? company.codigo_empresa : user.rol?.name === 'DESARROLLADOR' ? 'ovelix' : '-'}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </motion.div>
      </div>

      {/* Accesos rápidos */}
      <motion.div variants={fade} className="flex flex-wrap gap-3">
        <button
          onClick={() => navigate('/developer/companies')}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary/40"
        >
          <Building2 className="h-4 w-4 text-primary" />
          Gestionar empresas
        </button>
        <button
          onClick={() => navigate('/developer/users')}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary/40"
        >
          <Users className="h-4 w-4 text-primary" />
          Usuarios del sistema
        </button>
        <button
          onClick={() => navigate('/developer/analytics/stats')}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary/40"
        >
          <BarChart className="h-4 w-4 text-primary" />
          Estadísticas
        </button>
        <button
          onClick={() => navigate('/developer/security/roles')}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary/40"
        >
          <Shield className="h-4 w-4 text-primary" />
          Roles y permisos
        </button>
      </motion.div>
    </motion.div>
  );
}
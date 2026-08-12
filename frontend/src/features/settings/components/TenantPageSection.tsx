import React, { useEffect, useState } from 'react';
import { Globe, Palette, Store, Phone, Wrench, Save, Plus, Trash2, Loader2 } from 'lucide-react';
import { toast } from '@/shared/components/ui/use-toast';
import type { TenantPageConfig, TenantPageResponse } from '../types/tenantPage/tenantPage.types';
import { tenantPagesApi } from '../services/tenantPagesApi';

function Field({
  label, value, onChange, type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground dark:text-muted-foreground mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground"
      />
    </div>
  );
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
      <div className="p-6 border-b border-border flex items-center gap-3">
        <div className="size-10 bg-primary/5 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
          <span className="text-primary">{icon}</span>
        </div>
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

const THEME_FIELDS: { key: keyof TenantPageConfig['theme']; label: string }[] = [
  { key: 'primaryColor', label: 'Color primario (botones)' },
  { key: 'onPrimary', label: 'Texto sobre primario' },
  { key: 'accentText', label: 'Texto de acento' },
  { key: 'accentFill', label: 'Fill de acento' },
  { key: 'onAccentFill', label: 'Texto sobre acento' },
  { key: 'accentHover', label: 'Hover de acento' },
  { key: 'secondaryFill', label: 'Fill secundario' },
  { key: 'onSecondaryFill', label: 'Texto sobre secundario' },
  { key: 'secondaryHover', label: 'Hover secundario' },
];

export const TenantPageSection: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<TenantPageConfig | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [company, setCompany] = useState<TenantPageResponse['company'] | null>(null);

  useEffect(() => {
    let mounted = true;
    tenantPagesApi
      .get()
      .then((res) => {
        if (!mounted) return;
        setConfig(JSON.parse(JSON.stringify(res.config)));
        setEnabled(!!res.enabled);
        setCompany(res.company);
      })
      .catch(() => {
        if (!mounted) return;
        toast({ title: 'Error', description: 'No se pudo cargar la configuración de la página', variant: 'destructive' });
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const save = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const saved = await tenantPagesApi.update({ config, enabled });
      setEnabled(!!saved.enabled);
      setConfig(JSON.parse(JSON.stringify(saved.config)));
      toast({ title: 'Éxito', description: 'Página de presupuesto actualizada' });
    } catch (e) {
      toast({ title: 'Error', description: 'No se pudo guardar. Revisá que los campos estén completos.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Cargando configuración...</span>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="bg-card rounded-xl border border-border p-10 text-center text-muted-foreground">
        No hay configuración disponible.
      </div>
    );
  }

  const setField = (section: any, key: string, value: unknown) => {
    setConfig((prev) => (prev ? { ...prev, [section]: { ...prev[section], [key]: value } } : prev));
  };

  const setItemField = (index: number, key: string, value: string) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const items = prev.services.items.map((item, i) => (i === index ? { ...item, [key]: value } : item));
      return { ...prev, services: { ...prev.services, items } };
    });
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Página de presupuesto</h2>
            <p className="text-sm text-muted-foreground">
              Configurá la página pública que se muestra en{' '}
              <span className="font-mono">{company?.slug ? `${company.slug}.presupuesto.com` : 'tu subdominio'}</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="size-4"
              />
              Publicada
            </label>
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>

      {!enabled && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 px-4 py-3 rounded-lg text-sm">
          La página no está publicada. Activá "Publicada" y guardá para que tu subdominio la muestre.
        </div>
      )}

      <Card title="Perfil de la marca" icon={<Store size={18} />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Nombre" value={config.brand.name} onChange={(v) => setField('brand', 'name', v)} />
          <Field label="Texto del logo" value={config.brand.logoText} onChange={(v) => setField('brand', 'logoText', v)} />
          <Field label="Tagline" value={config.brand.tagline} onChange={(v) => setField('brand', 'tagline', v)} />
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Hero — titular" value={config.hero.headline1} onChange={(v) => setField('hero', 'headline1', v)} />
          <Field label="Hero — acento" value={config.hero.headlineAccent} onChange={(v) => setField('hero', 'headlineAccent', v)} />
          <Field label="Hero — descripción" value={config.hero.description} onChange={(v) => setField('hero', 'description', v)} />
          <Field label="Hero — CTA principal" value={config.hero.cta1} onChange={(v) => setField('hero', 'cta1', v)} />
        </div>
      </Card>

      <Card title="Tema" icon={<Palette size={18} />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {THEME_FIELDS.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-foreground dark:text-muted-foreground mb-1.5">{label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.theme[key]}
                  onChange={(e) => setField('theme', key, e.target.value)}
                  className="h-10 w-12 border border-input rounded-lg bg-background cursor-pointer"
                />
                <input
                  type="text"
                  value={config.theme[key]}
                  onChange={(e) => setField('theme', key, e.target.value)}
                  className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Contacto" icon={<Phone size={18} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['phone', 'whatsapp', 'email', 'address', 'city'] as const).map((key) => (
            <Field
              key={key}
              label={key.toUpperCase()}
              value={(config.contact[key] as string) || ''}
              onChange={(v) => setField('contact', key, v)}
            />
          ))}
        </div>
      </Card>

      <Card title="Servicios" icon={<Wrench size={18} />}>
        <div className="space-y-4">
          {config.services.items.map((item, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
              <div className="md:col-span-2">
                <Field label="Ícono" value={item.icon} onChange={(v) => setItemField(i, 'icon', v)} />
              </div>
              <div className="md:col-span-3">
                <Field label="Título" value={item.title} onChange={(v) => setItemField(i, 'title', v)} />
              </div>
              <div className="md:col-span-5">
                <Field label="Descripción" value={item.desc} onChange={(v) => setItemField(i, 'desc', v)} />
              </div>
              <div className="md:col-span-2 flex items-end gap-2">
                <div className="flex-1">
                  <Field label="Precio" value={item.price} onChange={(v) => setItemField(i, 'price', v)} />
                </div>
                <button
                  onClick={() =>
                    setConfig((prev) =>
                      prev ? { ...prev, services: { ...prev.services, items: prev.services.items.filter((_, x) => x !== i) } } : prev,
                    )
                  }
                  className="h-10 px-3 rounded-lg border border-input text-destructive hover:bg-destructive/10 transition-colors"
                  aria-label={`Eliminar servicio ${item.title}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() =>
              setConfig((prev) =>
                prev
                  ? {
                      ...prev,
                      services: {
                        ...prev.services,
                        items: [...prev.services.items, { icon: 'zap', title: 'NUEVO SERVICIO', desc: '', price: 'DESDE $0' }],
                      },
                    }
                  : prev,
              )
            }
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <Plus size={16} /> Agregar servicio
          </button>
        </div>
      </Card>

      <Card title="Subdominio" icon={<Globe size={18} />}>
        <p className="text-sm text-muted-foreground">
          Tu página se sirve en el subdominio <span className="font-mono">{company?.slug || '—'}.presupuesto.com</span>.
          El slug se toma del <span className="font-mono">codigo_empresa</span> de tu empresa en Overlix.
        </p>
      </Card>
    </div>
  );
};
export default TenantPageSection;
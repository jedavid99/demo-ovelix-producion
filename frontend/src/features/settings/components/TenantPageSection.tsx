import React, { useEffect, useState } from 'react';
import {
  Globe,
  Palette,
  Store,
  Phone,
  Wrench,
  FileText,
  Clock,
  Save,
  Plus,
  Trash2,
  Loader2,
  Copy,
  Check,
  ExternalLink,
  Upload,
  RotateCcw,
  Award,
  Cpu,
  CreditCard,
} from 'lucide-react';
import { toast } from '@/shared/components/ui/use-toast';
import type { TenantPageConfig, TenantPageResponse } from '../types/tenantPage/tenantPage.types';
import { tenantPagesApi } from '../services/tenantPagesApi';

function Field({
  label, value, onChange, type = 'text', placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground dark:text-muted-foreground mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
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

const DEFAULT_THEME: TenantPageConfig['theme'] = {
  primaryColor: '#0066ff',
  onPrimary: '#ffffff',
  accentText: '#8db8f5',
  accentFill: '#7fc4e0',
  onAccentFill: '#0a2530',
  accentHover: '#5fa0be',
  secondaryFill: '#1e3f57',
  onSecondaryFill: '#cfe4f3',
  secondaryHover: '#3c517d',
};

export const TenantPageSection: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<TenantPageConfig | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [company, setCompany] = useState<TenantPageResponse['company'] | null>(null);
  const [copied, setCopied] = useState(false);

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
    } catch {
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

  const setField = (section: keyof TenantPageConfig, key: string, value: unknown) => {
    setConfig((prev) => (prev ? { ...prev, [section]: { ...prev[section], [key]: value } } : prev));
  };

  const setItemField = (index: number, key: string, value: string) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const items = prev.services.items.map((item, i) => (i === index ? { ...item, [key]: value } : item));
      return { ...prev, services: { ...prev.services, items } };
    });
  };

  const setLegalPageField = (index: number, key: 'label' | 'slug' | 'content', value: string) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const legalPages = (prev.footer.legalPages ?? []).map((p, i) => (i === index ? { ...p, [key]: value } : p));
      return { ...prev, footer: { ...prev.footer, legalPages } };
    });
  };

  const addLegalPage = () => {
    setConfig((prev) => {
      if (!prev) return prev;
      const legalPages = [...(prev.footer.legalPages ?? []), { label: 'NUEVA PÁGINA', slug: '', content: '' }];
      return { ...prev, footer: { ...prev.footer, legalPages } };
    });
  };

  const removeLegalPage = (index: number) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const legalPages = (prev.footer.legalPages ?? []).filter((_, i) => i !== index);
      return { ...prev, footer: { ...prev.footer, legalPages } };
    });
  };

  const setScheduleField = (index: number, key: 'day' | 'hours' | 'closed', value: string | boolean) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const schedule = (prev.schedule ?? []).map((r, i) => (i === index ? { ...r, [key]: value } : r));
      return { ...prev, schedule };
    });
  };

  const setAboutField = (key: 'title' | 'description' | 'badgeTitle' | 'badgeText', value: string) => {
    setConfig((prev) => (prev ? { ...prev, about: { ...prev.about, [key]: value } } : prev));
  };

  const setFeatureField = (index: number, key: 'title' | 'desc', value: string) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const features = prev.about.features.map((f, i) => (i === index ? { ...f, [key]: value } : f));
      return { ...prev, about: { ...prev.about, features } };
    });
  };

  const addFeature = () => {
    setConfig((prev) => {
      if (!prev || (prev.about.features?.length ?? 0) >= 4) return prev;
      return {
        ...prev,
        about: { ...prev.about, features: [...prev.about.features, { title: 'NUEVO PUNTO', desc: '' }] },
      };
    });
  };

  const removeFeature = (index: number) => {
    setConfig((prev) => {
      if (!prev || (prev.about.features?.length ?? 0) <= 2) return prev;
      return { ...prev, about: { ...prev.about, features: prev.about.features.filter((_, i) => i !== index) } };
    });
  };

  const setValuationField = (key: 'resultsTitle' | 'resultsSubtitle' | 'badgeLabel', value: string) => {
    setConfig((prev) => (prev ? { ...prev, valuation: { ...prev.valuation, [key]: value } } : prev));
  };

  const setCheckoutField = (key: 'deliveryCost' | 'cbu' | 'alias' | 'accountNumber', value: string | number) => {
    setConfig((prev) => (prev ? { ...prev, checkout: { ...prev.checkout, [key]: value } } : prev));
  };

  const setResultField = (
    index: number,
    key: 'badge' | 'title' | 'desc' | 'label' | 'price' | 'img',
    value: string,
  ) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const results = prev.valuation.results.map((r, i) => (i === index ? { ...r, [key]: value } : r));
      return { ...prev, valuation: { ...prev.valuation, results } };
    });
  };

  const addResult = () => {
    setConfig((prev) => {
      if (!prev || (prev.valuation.results?.length ?? 0) >= 12) return prev;
      return {
        ...prev,
        valuation: {
          ...prev.valuation,
          results: [
            ...prev.valuation.results,
            {
              badge: 'NUEVO',
              title: 'NUEVA SOLUCIÓN TÉCNICA',
              desc: '',
              label: 'Costo estimado',
              price: 'DESDE $0',
              img: undefined,
            },
          ],
        },
      };
    });
  };

  const removeResult = (index: number) => {
    setConfig((prev) => {
      if (!prev || (prev.valuation.results?.length ?? 0) <= 1) return prev;
      return { ...prev, valuation: { ...prev.valuation, results: prev.valuation.results.filter((_, i) => i !== index) } };
    });
  };

  const addScheduleRow = () => {
    setConfig((prev) => {
      if (!prev) return prev;
      const schedule = [...(prev.schedule ?? []), { day: '', hours: '09:00 - 18:00', closed: false }];
      return { ...prev, schedule };
    });
  };

  const removeScheduleRow = (index: number) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const schedule = (prev.schedule ?? []).filter((_, i) => i !== index);
      return { ...prev, schedule };
    });
  };

  const pageUrl = `https://${company?.slug || 'tu-empresa'}.presupuesto.com`;
  const localTestUrl =
    typeof window !== 'undefined' && /localhost|127\.0\.0\.1/.test(window.location.hostname)
      ? `${window.location.origin}/presupuesto.${company?.slug || 'tu-empresa'}`
      : null;

  const resetTheme = () => setConfig((prev) => (prev ? { ...prev, theme: { ...DEFAULT_THEME } } : prev));

  const onLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setField('brand', 'logo', String(reader.result));
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: 'Error', description: 'No se pudo copiar el link', variant: 'destructive' });
    }
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
        <div className="mt-6 border-t border-border pt-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-border bg-muted/30 flex items-center justify-center min-h-[96px] overflow-hidden">
              {config.brand.logo ? (
                <img src={config.brand.logo} alt="Logo del negocio" className="max-h-16 max-w-full w-auto object-contain p-2" />
              ) : (
                <span className="text-sm text-muted-foreground">Sin logo</span>
              )}
            </div>
            <div className="md:col-span-2 space-y-2">
              <Field
                label="Logo del negocio (URL)"
                value={config.brand.logo ?? ''}
                onChange={(v) => setField('brand', 'logo', v)}
                placeholder="https://... o elegí un archivo"
              />
              <div className="flex items-center gap-2 flex-wrap">
                <label className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-input text-sm font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer">
                  <Upload size={15} /> Subir imagen
                  <input type="file" accept="image/*" className="hidden" onChange={onLogoFile} />
                </label>
                {config.brand.logo && (
                  <button
                    onClick={() => setField('brand', 'logo', '')}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-input text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 size={14} /> Quitar
                  </button>
                )}
              </div>
            </div>
          </div>
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
        <button
          onClick={resetTheme}
          className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-lg border border-input text-sm font-semibold text-foreground hover:bg-muted transition-colors"
        >
          <RotateCcw size={15} /> Restablecer colores por defecto
        </button>
      </Card>

      <Card title="Contacto" icon={<Phone size={18} />}>
        <p className="text-sm text-muted-foreground mb-4">
          Teléfono, WhatsApp y correo se toman de los datos de tu empresa: se muestran aquí y en tu página, pero no se
          editan desde esta configuración.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {(['phone', 'whatsapp', 'email'] as const).map((key) => (
            <div key={key} className="rounded-lg border border-border bg-muted/40 px-4 py-3">
              <span className="block text-[11px] font-bold uppercase tracking-wide text-muted-foreground mb-1">{key}</span>
              <span className="block text-sm font-semibold text-foreground break-words">
                {config.contact[key] || '—'}
              </span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Dirección"
            value={(config.contact.address as string) || ''}
            onChange={(v) => setField('contact', 'address', v)}
          />
          <Field
            label="Ciudad"
            value={(config.contact.city as string) || ''}
            onChange={(v) => setField('contact', 'city', v)}
          />
          <div className="md:col-span-2">
            <Field
              label="Mapa (embed de Google Maps)"
              value={(config.contact.mapEmbed as string) || ''}
              onChange={(v) => setField('contact', 'mapEmbed', v)}
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
          </div>
          <Field
            label="Instagram (link del perfil)"
            value={(config.contact.instagram as string) || ''}
            onChange={(v) => setField('contact', 'instagram', v)}
            placeholder="https://www.instagram.com/mi.negocio"
          />
          <Field
            label="Facebook (link de la página)"
            value={(config.contact.facebook as string) || ''}
            onChange={(v) => setField('contact', 'facebook', v)}
            placeholder="https://www.facebook.com/minegocio"
          />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Pegá el link de <span className="font-mono">Compartir → Insertar un mapa</span> de Google Maps para mostrar el
          mapa en el footer y en la página UBICACIÓN. Si lo dejás vacío se muestra un link "Cómo llegar" con la dirección.
        </p>
      </Card>

      <Card title="Horarios" icon={<Clock size={18} />}>
        <p className="text-sm text-muted-foreground mb-4">
          Se muestra en el footer de tu página (columna HORARIOS). Horario en formato{' '}
          <span className="font-mono">09:00 - 18:00</span>; marcá "Cerrado" para días sin atención.
        </p>
        <div className="space-y-2">
          {(config.schedule ?? []).map((row, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
              <div className="md:col-span-4">
                <Field label="Día" value={row.day} onChange={(v) => setScheduleField(i, 'day', v)} />
              </div>
              <div className="md:col-span-5">
                <Field
                  label="Horario"
                  value={row.hours}
                  placeholder="09:00 - 18:00"
                  onChange={(v) => setScheduleField(i, 'hours', v)}
                />
              </div>
              <div className="md:col-span-2 flex items-end">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground cursor-pointer pb-2.5">
                  <input
                    type="checkbox"
                    checked={!!row.closed}
                    onChange={(e) => setScheduleField(i, 'closed', e.target.checked)}
                    className="size-4"
                  />
                  Cerrado
                </label>
              </div>
              <div className="md:col-span-1 flex items-end justify-end">
                <button
                  onClick={() => removeScheduleRow(i)}
                  className="h-10 px-3 rounded-lg border border-input text-destructive hover:bg-destructive/10 transition-colors"
                  aria-label={`Eliminar ${row.day || 'día'}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={addScheduleRow}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <Plus size={16} /> Agregar día
          </button>
        </div>
      </Card>

      <Card title="NUESTRO SELLO" icon={<Award size={18} />}>
        <p className="text-sm text-muted-foreground mb-4">
          Se muestra en la sección "NUESTRO SELLO" de tu página. Editá los puntos por defecto y agregá hasta{' '}
          <span className="font-semibold text-foreground">4 en total</span> (mínimo 2, los originales).
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Título de la sección" value={config.about.title} onChange={(v) => setAboutField('title', v)} />
          <Field
            label="Descripción"
            value={config.about.description}
            onChange={(v) => setAboutField('description', v)}
          />
          <Field
            label="Badge — título"
            value={config.about.badgeTitle}
            onChange={(v) => setAboutField('badgeTitle', v)}
          />
          <Field label="Badge — texto" value={config.about.badgeText} onChange={(v) => setAboutField('badgeText', v)} />
        </div>
        <div className="mt-5 space-y-3">
          {config.about.features.map((f, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
              <div className="md:col-span-4">
                <Field
                  label="Título del punto"
                  value={f.title}
                  onChange={(v) => setFeatureField(i, 'title', v)}
                />
              </div>
              <div className="md:col-span-7">
                <Field label="Descripción" value={f.desc} onChange={(v) => setFeatureField(i, 'desc', v)} />
              </div>
              <div className="md:col-span-1 flex items-end justify-end">
                <button
                  onClick={() => removeFeature(i)}
                  disabled={(config.about.features?.length ?? 0) <= 2}
                  className="h-10 px-3 rounded-lg border border-input text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label={`Eliminar punto ${f.title}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={addFeature}
            disabled={(config.about.features?.length ?? 0) >= 4}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={16} /> Agregar punto ({config.about.features?.length ?? 0}/4)
          </button>
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

      <Card title="Soluciones técnicas" icon={<Cpu size={18} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <Field
            label="Título de la sección"
            value={config.valuation.resultsTitle}
            onChange={(v) => setValuationField('resultsTitle', v)}
          />
          <Field
            label="Subtítulo"
            value={config.valuation.resultsSubtitle}
            onChange={(v) => setValuationField('resultsSubtitle', v)}
          />
          <Field
            label="Badge (encima de las tarjetas)"
            value={config.valuation.badgeLabel}
            onChange={(v) => setValuationField('badgeLabel', v)}
          />
        </div>
        <div className="space-y-4">
          {config.valuation.results.map((r, i) => (
            <div key={i} className="border border-border rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                <div className="md:col-span-3">
                  <Field label="Badge" value={r.badge} onChange={(v) => setResultField(i, 'badge', v)} />
                </div>
                <div className="md:col-span-5">
                  <Field label="Título" value={r.title} onChange={(v) => setResultField(i, 'title', v)} />
                </div>
                <div className="md:col-span-4 flex items-end justify-end">
                  <button
                    onClick={() => removeResult(i)}
                    disabled={(config.valuation.results?.length ?? 0) <= 1}
                    className="h-10 px-3 rounded-lg border border-input text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label={`Eliminar solución ${r.title}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                <div className="md:col-span-3">
                  <Field label="Etiqueta de precio" value={r.label} onChange={(v) => setResultField(i, 'label', v)} />
                </div>
                <div className="md:col-span-3">
                  <Field label="Precio" value={r.price} onChange={(v) => setResultField(i, 'price', v)} />
                </div>
                <div className="md:col-span-6">
                  <Field label="Descripción" value={r.desc} onChange={(v) => setResultField(i, 'desc', v)} />
                </div>
              </div>
              <Field label="Imagen (URL)" value={r.img ?? ''} onChange={(v) => setResultField(i, 'img', v)} />
            </div>
          ))}
          <button
            onClick={addResult}
            disabled={(config.valuation.results?.length ?? 0) >= 12}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={16} /> Agregar solución ({config.valuation.results?.length ?? 0}/12)
          </button>
        </div>
      </Card>

      <Card title="Pagos y envío" icon={<CreditCard size={18} />}>
        <p className="text-sm text-muted-foreground mb-4">
          Datos para que el cliente abone la seña por transferencia y el costo del envío cuando el cliente no lleve el
          equipo al local. Se muestran en el formulario de presupuesto.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-foreground dark:text-muted-foreground mb-1.5">
              Costo de envío (ARS)
            </label>
            <input
              type="number"
              min={0}
              value={config.checkout?.deliveryCost ?? 0}
              onChange={(e) => setCheckoutField('deliveryCost', Number(e.target.value) || 0)}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-foreground"
            />
          </div>
          <div />
          <Field
            label="CBU"
            value={config.checkout?.cbu ?? ''}
            onChange={(v) => setCheckoutField('cbu', v)}
            placeholder="0000003100000000000001"
          />
          <Field
            label="Alias"
            value={config.checkout?.alias ?? ''}
            onChange={(v) => setCheckoutField('alias', v)}
            placeholder="mi.negocio.alias"
          />
          <Field
            label="Número de cuenta"
            value={config.checkout?.accountNumber ?? ''}
            onChange={(v) => setCheckoutField('accountNumber', v)}
            placeholder="0000000000001"
          />
        </div>
      </Card>

      <Card title="Páginas legales" icon={<FileText size={18} />}>
        <p className="text-sm text-muted-foreground mb-4">
          Se muestran en el footer de tu página (LEGAL, PRIVACIDAD, UBICACIÓN, GARANTÍA...). El slug arma la URL{' '}
          <span className="font-mono">/legal/&#123;slug&#125;</span>.
        </p>
        <div className="space-y-4">
          {(config.footer.legalPages ?? []).map((page, i) => (
            <div key={i} className="border border-border rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Etiqueta" value={page.label} onChange={(v) => setLegalPageField(i, 'label', v)} />
                <Field label="Slug" value={page.slug} onChange={(v) => setLegalPageField(i, 'slug', v)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground dark:text-muted-foreground mb-1.5">
                  Contenido
                </label>
                <textarea
                  value={page.content}
                  onChange={(e) => setLegalPageField(i, 'content', e.target.value)}
                  rows={6}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => removeLegalPage(i)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-input text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 size={15} /> Eliminar página
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={addLegalPage}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <Plus size={16} /> Agregar página legal
          </button>
        </div>
      </Card>

      <Card title="Link de tu página" icon={<Globe size={18} />}>
        <p className="text-sm text-muted-foreground mb-4">
          Enviá este link a tus clientes para que vean tu página de presupuesto, consulten horarios y reserven un turno.
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <span className="flex-1 rounded-lg border border-input bg-muted/50 px-4 py-2.5 text-sm font-mono text-foreground truncate">
            {pageUrl}
          </span>
          <button
            onClick={copyLink}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Copiado' : 'Copiar'}
          </button>
          <a
            href={pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-input text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <ExternalLink size={15} /> Abrir
          </a>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          El subdominio se arma con el <span className="font-mono">slug</span> de tu empresa. En localhost también podés
          probarla con <span className="font-mono">/presupuesto.&#123;slug&#125;</span>.
        </p>
        {localTestUrl && (
          <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <span className="flex-1 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-2.5 text-sm font-mono text-foreground truncate">
              {localTestUrl}
            </span>
            <button
              onClick={() => {
                try {
                  navigator.clipboard.writeText(localTestUrl);
                } catch {
                  /* noop */
                }
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Copy size={15} /> Copiar link local
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};
export default TenantPageSection;
import { useState, useEffect } from 'react';
import { settingsApi } from '@/features/settings/services/settingsApi';
import type { TaxRate } from '@/features/settings/types/settings.types';

export function useTaxRates() {
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const rates = await settingsApi.getTaxRates();
        if (active) setTaxRates(Array.isArray(rates) ? rates.filter(r => r.activo) : []);
      } catch {
        if (active) setTaxRates([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return { taxRates, loading };
}

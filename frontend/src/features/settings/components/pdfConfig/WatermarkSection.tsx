import { Settings } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import type { ServiceOrderData } from '../../types/pdfConfig/pdfConfig.types';

interface WatermarkSectionProps {
  showWatermark: boolean;
  watermarkUrl: string;
  onChange: <K extends keyof ServiceOrderData>(key: K, value: ServiceOrderData[K]) => void;
}

export const WatermarkSection = ({ showWatermark, watermarkUrl, onChange }: WatermarkSectionProps) => (
  <Card>
    <CardContent className="p-4 space-y-3">
      <h3 className="font-bold text-foreground flex items-center gap-2"><Settings size={16} className="text-primary" /> Marca de agua</h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm">Mostrar marca de agua</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={showWatermark} onChange={(e) => onChange('showWatermark', e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-card after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
        {showWatermark && <Input value={watermarkUrl} onChange={(e) => onChange('watermarkUrl', e.target.value)} placeholder="URL del logo (marca de agua)" />}
      </div>
    </CardContent>
  </Card>
);

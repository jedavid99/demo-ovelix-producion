import React from 'react';
import { Download, Printer, Eye } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import ServiceOrderPreview from '@/features/settings/ServiceOrderPreview';
import { usePDFConfig } from '../../hooks/pdfConfig/usePDFConfig';
import { getSectionMeta } from '../../constants/settings.constants';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { CompanySection } from '../../components/pdfConfig/CompanySection';
import { WarrantySection } from '../../components/pdfConfig/WarrantySection';
import { WatermarkSection } from '../../components/pdfConfig/WatermarkSection';
import { ConfigActions } from '../../components/pdfConfig/ConfigActions';

export default function PDFConfigPage() {
  const { data, isGenerating, previewRef, handleChange, resetData, handleSave, generatePDF, handlePrint } = usePDFConfig();
  const meta = getSectionMeta('pdf');

  return (
    <div className="space-y-6 pb-24">
      <SectionHeader
        icon={meta.icon}
        eyebrow={meta.eyebrow}
        title={meta.label}
        description={meta.description}
        actions={
          <div className="flex gap-2">
            <Button onClick={handlePrint} variant="outline"><Printer size={16} /> Imprimir</Button>
            <Button onClick={generatePDF} disabled={isGenerating}>
              {isGenerating ? <span className="animate-spin">⟳</span> : <Download size={16} />}
              {isGenerating ? 'Generando...' : 'Descargar PDF'}
            </Button>
          </div>
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-2 space-y-4">
            <CompanySection data={data} onChange={handleChange} />
            <WarrantySection warrantyMonths={data.warrantyMonths} warrantyTerms={data.warrantyTerms} onChange={handleChange} />
            <WatermarkSection showWatermark={data.showWatermark} watermarkUrl={data.watermarkUrl} onChange={handleChange} />
            <ConfigActions onReset={resetData} onSave={handleSave} />
          </div>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Eye size={18} className="text-primary" />
                <h3 className="font-bold text-foreground">Vista previa</h3>
                <Badge variant="outline" className="ml-auto text-[10px] font-mono">A4</Badge>
              </div>
              <div className="border border-border rounded-lg overflow-hidden bg-muted/30">
                <div ref={previewRef} className="transform scale-[0.7] origin-top-left w-[143%]">
                  <ServiceOrderPreview data={data} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">La vista previa se actualiza automáticamente con cada cambio.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

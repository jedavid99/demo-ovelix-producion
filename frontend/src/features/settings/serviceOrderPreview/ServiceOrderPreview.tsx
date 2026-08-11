import { usePrintStyles } from './hooks/usePrintStyles';
import { Watermark, ServiceOrderHeader, CustomerDeviceInfo } from './components/TopSection';
import { ProblemDescription, WarrantyBlock, AuthorizationTotal, PerforationLine } from './components/BottomSection';
import { TechnicalSection } from './components/TechnicalSection';
import { PrintFooter } from './components/PrintFooter';
import type { ServiceOrderPreviewProps } from './types';

export default function ServiceOrderPreviewOptimized({ data, className = '' }: ServiceOrderPreviewProps) {
  usePrintStyles();

  return (
    <div className={`bg-white text-[#191c1d] font-sans ${className}`} style={{ fontFamily: 'Inter, Roboto, sans-serif', fontSize: '11px' }}>
      <div className="max-w-[800px] mx-auto border border-[#e2e8f0] rounded-lg shadow-md print-container overflow-hidden relative" style={{ borderRadius: '8px' }}>
        <Watermark data={data} />

        <section className="p-6 relative z-10">
          <ServiceOrderHeader data={data} />
          <CustomerDeviceInfo data={data} />
          <ProblemDescription data={data} />
          <WarrantyBlock data={data} />
          <AuthorizationTotal data={data} />
        </section>

        <PerforationLine />
        <TechnicalSection data={data} />
        <PrintFooter />
      </div>
    </div>
  );
}

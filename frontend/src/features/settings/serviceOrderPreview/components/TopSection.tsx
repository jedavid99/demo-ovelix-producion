import { texts } from '../constants/texts';
import type { ServiceOrderData } from '../types';

export function Watermark({ data }: { data: ServiceOrderData }) {
  if (!data.showWatermark) return null;
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10 z-0">
      {data.watermarkUrl ? (
        <img src={data.watermarkUrl} alt="Watermark Logo" loading="lazy" className="w-48 h-auto object-contain" />
      ) : (
        <div className="text-6xl font-bold text-[#003fb1] transform -rotate-45">
          {data.companyName || 'LOGO'}
        </div>
      )}
    </div>
  );
}

export function ServiceOrderHeader({ data }: { data: ServiceOrderData }) {
  return (
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-[#2563eb] to-[#1e40af] rounded-lg flex items-center justify-center text-white font-bold text-xl" style={{ borderRadius: '8px' }}>
          {data.companyName?.charAt(0) || 'T'}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a] uppercase tracking-tight" style={{ color: '#0f172a' }}>
            {data.companyName || 'TechFix Reparaciones'}
          </h1>
          <p className="text-xs font-semibold uppercase text-[#64748b] mt-1 tracking-wider">{texts.authorizedCenter}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs font-semibold uppercase text-[#64748b] mb-1">{texts.serviceOrder}</div>
        <div className="text-3xl font-bold text-[#2563eb]" style={{ color: '#2563eb' }}>{data.orderNumber || '#SO-2024-0892'}</div>
        <div className="text-sm font-mono text-[#64748b] mt-1">{texts.date}: {data.orderDate || '24 oct 2024'}</div>
      </div>
    </div>
  );
}

export function CustomerDeviceInfo({ data }: { data: ServiceOrderData }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div className="border border-[#e2e8f0] p-4 rounded-lg bg-gradient-to-br from-[#f8fafc] to-white" style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="text-xs font-semibold uppercase text-[#64748b] mb-2 tracking-wider">{texts.customerInfo}</div>
        <div className="text-lg font-semibold text-[#0f172a]">{data.clientName || 'Juan Pérez'}</div>
        <div className="text-sm text-[#475569] mt-2 space-y-1">
          <div className="flex items-center gap-2"><span className="text-[#64748b]">📧</span><span>{data.clientEmail || 'jperez@ejemplo.com'}</span></div>
          <div className="flex items-center gap-2"><span className="text-[#64748b]">📱</span><span>{data.clientPhone || '+54 9 11 1234-5678'}</span></div>
        </div>
      </div>
      <div className="border border-[#e2e8f0] p-4 rounded-lg bg-gradient-to-br from-[#f8fafc] to-white" style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="text-xs font-semibold uppercase text-[#64748b] mb-2 tracking-wider">{texts.deviceInfo}</div>
        <div className="text-lg font-semibold text-[#0f172a]">{data.deviceModel || 'Laptop Dell XPS 15'}</div>
        <div className="text-sm text-[#475569] mt-2 space-y-1">
          <div className="flex justify-between"><span className="text-[#64748b]">N/S:</span><span className="font-mono">{data.deviceSerial || '5XJ2K93-8821'}</span></div>
          <div className="flex justify-between"><span className="text-[#64748b]">IMEI:</span><span className="font-mono">{data.deviceImei || '—'}</span></div>
        </div>
      </div>
    </div>
  );
}

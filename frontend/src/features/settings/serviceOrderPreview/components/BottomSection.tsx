import { texts } from '../constants/texts';
import type { ServiceOrderData } from '../types';

export function ProblemDescription({ data }: { data: ServiceOrderData }) {
  return (
    <div className="mb-4 border border-[#e2e8f0] rounded-lg overflow-hidden" style={{ borderRadius: '8px' }}>
      <div className="bg-gradient-to-r from-[#f1f5f9] to-[#f8fafc] px-4 py-2 border-b border-[#e2e8f0] text-xs font-semibold uppercase text-[#0f172a] tracking-wider">
        {texts.problemDescription}
      </div>
      <div className="p-4 text-sm text-[#475569] min-h-[60px] leading-relaxed">
        {data.repairDescription || 'El cliente reporta estrangulamiento térmico frecuente y apagados repentinos durante tareas de alto rendimiento. El ventilador emite un ruido metálico. Solicita limpieza interna, reemplazo de pasta térmica y diagnóstico de hardware.'}
      </div>
    </div>
  );
}

export function WarrantyBlock({ data }: { data: ServiceOrderData }) {
  if (!data.warrantyTerms) return null;
  return (
    <div className="mt-4 border border-[#e2e8f0] rounded-lg overflow-hidden" style={{ borderRadius: '8px' }}>
      <div className="bg-gradient-to-r from-[#f1f5f9] to-[#f8fafc] px-4 py-2 border-b border-[#e2e8f0] text-xs font-semibold uppercase text-[#0f172a] tracking-wider flex items-center gap-2">
        <span>{texts.warranty}</span>
        {data.warrantyMonths && <span className="text-[#2563eb] font-bold">- {data.warrantyMonths} MESES</span>}
      </div>
      <div className="p-4 text-xs text-[#475569] whitespace-pre-line leading-relaxed">
        {data.warrantyTerms}
      </div>
    </div>
  );
}

export function AuthorizationTotal({ data }: { data: ServiceOrderData }) {
  return (
    <div className="flex justify-between items-end mt-6">
      <div className="w-1/2">
        <div className="text-xs font-semibold uppercase text-[#64748b] mb-2 tracking-wider">{texts.customerAuthorization}</div>
        <div className="border-b-2 border-[#94a3b8] h-10 w-full mb-1" style={{ borderBottomWidth: '2px' }} />
        <div className="text-xs font-mono text-[#64748b]">{data.clientName || 'Juan Pérez'} - {texts.digitalSignature}</div>
      </div>
      <div className="text-right">
        <div className="text-xs font-semibold uppercase text-[#64748b] tracking-wider mb-1">{texts.estimatedTotal}</div>
        <div className="text-3xl font-bold text-[#2563eb]" style={{ color: '#2563eb' }}>${data.totalPrice || '150.00'}</div>
        <div className="text-xs text-[#64748b] mt-1">{texts.exclTaxes}</div>
      </div>
    </div>
  );
}

export function PerforationLine() {
  return (
    <div className="relative py-3 flex items-center justify-center z-10">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-[1px] bg-gradient-to-r from-[#737686] via-[#737686] to-transparent bg-repeat-x" style={{ backgroundSize: '15px 1px' }} />
      </div>
      <div className="relative bg-white px-3 flex items-center gap-2 text-[#737686]">
        <span className="transform rotate-90 text-xs">✂</span>
        <span className="text-[10px] font-semibold italic tracking-wider">{texts.cutHere}</span>
      </div>
    </div>
  );
}

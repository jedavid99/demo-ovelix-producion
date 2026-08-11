import { texts } from '../constants/texts';
import type { ServiceOrderData } from '../types';

export function TechnicalSection({ data }: { data: ServiceOrderData }) {
  return (
    <section className="p-6 bg-[#ffffff] relative z-10">
      <div className="flex justify-between items-center mb-4 border-b-2 border-[#e2e8f0] pb-3">
        <div>
          <div className="text-xs font-semibold uppercase text-[#64748b] tracking-wider">{texts.technicalRoutingCopy}</div>
          <div className="text-lg font-semibold text-[#0f172a]">{data.orderNumber || '#SO-2024-0892'}</div>
        </div>
        <div className="flex gap-3">
          <div className="text-right">
            <div className="text-xs font-semibold uppercase text-[#64748b] tracking-wider">{texts.priority}</div>
            <span className="bg-gradient-to-r from-[#dbeafe] to-[#bfdbfe] text-[#1e40af] px-3 py-1 rounded-md text-xs font-semibold" style={{ borderRadius: '6px' }}>{texts.standard}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="col-span-1 space-y-4">
          <DiagnosticChecklist />
          <TimeTracking />
        </div>
        <div className="col-span-2">
          <PartsTable />
          <TechnicianNotes data={data} />
        </div>
      </div>

      <div className="flex justify-between items-end border-t-2 border-[#e2e8f0] pt-4">
        <div className="w-1/3">
          <div className="text-xs font-semibold uppercase text-[#64748b] mb-2 tracking-wider">{texts.technicianSignature}</div>
          <div className="border-b-2 border-[#94a3b8] h-10 w-full mb-1" style={{ borderBottomWidth: '2px' }} />
          <div className="font-mono text-xs text-[#64748b]">{texts.techId}: {data.technicianName || '_________'}</div>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold uppercase text-[#64748b] mb-1 tracking-wider">{texts.finalQCStatus}</div>
          <div className="flex gap-2 justify-end">
            <div className="w-6 h-6 border-2 border-[#94a3b8] rounded-md flex items-center justify-center font-bold text-xs bg-white" style={{ borderRadius: '6px' }}>P</div>
            <div className="w-6 h-6 border-2 border-[#94a3b8] rounded-md flex items-center justify-center font-bold text-xs bg-white" style={{ borderRadius: '6px' }}>F</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DiagnosticChecklist() {
  return (
    <div className="border border-[#e2e8f0] p-4 rounded-lg bg-gradient-to-br from-[#f8fafc] to-white" style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div className="text-xs font-semibold uppercase text-[#64748b] mb-3 tracking-wider">{texts.diagnosticChecklist}</div>
      <div className="space-y-2">
        {[texts.powerSupply, texts.batteryHealth, texts.motherboard, texts.coolingSystem].map((item) => (
          <div key={item} className="flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-[#94a3b8] rounded-md flex items-center justify-center text-[9px] bg-white" style={{ borderRadius: '4px' }} />
            <span className="text-sm text-[#475569]">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimeTracking() {
  return (
    <div className="border border-[#e2e8f0] p-4 rounded-lg bg-gradient-to-br from-[#f8fafc] to-white" style={{ borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div className="text-xs font-semibold uppercase text-[#64748b] mb-3 tracking-wider">{texts.timeTracking}</div>
      <div className="space-y-2">
        <div className="flex justify-between border-b border-[#e2e8f0] pb-2">
          <span className="text-sm text-[#475569]">{texts.start}:</span>
          <span className="font-mono text-sm text-[#0f172a] bg-white px-2 py-1 rounded border border-[#e2e8f0]">__:__</span>
        </div>
        <div className="flex justify-between border-b border-[#e2e8f0] pb-2">
          <span className="text-sm text-[#475569]">{texts.end}:</span>
          <span className="font-mono text-sm text-[#0f172a] bg-white px-2 py-1 rounded border border-[#e2e8f0]">__:__</span>
        </div>
      </div>
    </div>
  );
}

function PartsTable() {
  return (
    <div className="border border-[#e2e8f0] rounded-lg overflow-hidden" style={{ borderRadius: '8px' }}>
      <table className="w-full text-left">
        <thead className="bg-gradient-to-r from-[#f1f5f9] to-[#f8fafc] border-b-2 border-[#e2e8f0]">
          <tr>
            <th className="px-4 py-2 text-xs font-semibold uppercase text-[#0f172a]">{texts.partNumberDescription}</th>
            <th className="px-4 py-2 text-xs font-semibold uppercase text-[#0f172a] w-20">{texts.qty}</th>
            <th className="px-4 py-2 text-xs font-semibold uppercase text-[#0f172a] w-28">{texts.location}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e2e8f0]">
          <tr className="hover:bg-[#f8fafc]">
            <td className="px-4 py-3 font-mono text-sm text-[#0f172a]">MX-6 Compuesto Térmico (4g)</td>
            <td className="px-4 py-3 text-sm text-[#475569]">1</td>
            <td className="px-4 py-3 text-sm text-[#475569]">Estante A-4</td>
          </tr>
          <tr className="hover:bg-[#f8fafc]">
            <td className="px-4 py-3 font-mono text-sm text-[#0f172a]">Ventilador de Refrigeración (L)</td>
            <td className="px-4 py-3 text-sm text-[#475569]">1</td>
            <td className="px-4 py-3 text-sm text-[#475569]">Contenedor 12</td>
          </tr>
          <tr className="h-10"><td /><td /><td /></tr>
          <tr className="h-10"><td /><td /><td /></tr>
        </tbody>
      </table>
    </div>
  );
}

function TechnicianNotes({ data }: { data: ServiceOrderData }) {
  return (
    <div className="mt-4 border border-[#e2e8f0] rounded-lg overflow-hidden" style={{ borderRadius: '8px' }}>
      <div className="bg-gradient-to-r from-[#f1f5f9] to-[#f8fafc] px-4 py-2 border-b border-[#e2e8f0] text-xs font-semibold uppercase text-[#0f172a] tracking-wider">
        {texts.technicianProgressNotes}
      </div>
      <div className="p-4 min-h-[70px] font-mono text-sm text-[#475569] italic leading-relaxed bg-white">
        {data.technicianNotes || '[Registrar aquí los resultados del diagnóstico y los factores estresantes de los componentes...]'}
      </div>
    </div>
  );
}

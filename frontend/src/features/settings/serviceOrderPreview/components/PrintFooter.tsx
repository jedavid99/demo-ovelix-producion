import { texts } from '../constants/texts';

export function PrintFooter() {
  return (
    <footer className="p-4 border-t-2 border-[#e2e8f0] flex justify-between bg-gradient-to-r from-[#f8fafc] to-white font-mono text-[10px] text-[#64748b] uppercase relative z-10" style={{ borderTopWidth: '2px' }}>
      <span className="font-semibold">{texts.formId}</span>
      <span className="italic">{texts.confidential}</span>
      <span>{texts.page}</span>
    </footer>
  );
}

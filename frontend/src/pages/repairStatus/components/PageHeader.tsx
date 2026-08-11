import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import logo from '/ovelix-claro.png';

export function PageHeader() {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-[#c2c6d6]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-[#424754] hover:text-[#0058be] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Volver</span>
          </button>
          <img src={logo} alt="ovelix" loading="lazy" className="w-10 h-10 rounded-full object-cover" />
        </div>
      </div>
    </div>
  );
}

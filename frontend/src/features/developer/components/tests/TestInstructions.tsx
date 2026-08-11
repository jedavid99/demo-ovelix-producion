import { Eye } from 'lucide-react';

export const TestInstructions = () => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
    <div className="flex items-start space-x-3">
      <Eye className="w-5 h-5 text-yellow-600 mt-0.5" />
      <div>
        <h4 className="font-semibold text-yellow-900 mb-2">Instrucciones para Pruebas Visuales</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Haz clic en "Probar Visualmente" para abrir cada página en una nueva pestaña</li>
          <li>• Navega por la interfaz como lo haría un usuario final</li>
          <li>• Verifica que todos los elementos sean visibles y funcionales</li>
          <li>• Prueba los formularios, botones y filtros</li>
          <li>• Toma notas sobre mejoras posibles en UX/UI</li>
          <li>• Verifica la responsividad en diferentes tamaños de pantalla</li>
        </ul>
      </div>
    </div>
  </div>
);

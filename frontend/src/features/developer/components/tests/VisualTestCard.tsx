import { Eye, ExternalLink } from 'lucide-react';
import type { VisualTest } from '../../types/tests/tests.types';

interface VisualTestCardProps {
  test: VisualTest;
  onOpen: (path: string) => void;
}

export const VisualTestCard = ({ test, onOpen }: VisualTestCardProps) => {
  const Icon = test.icon;
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xs font-medium text-primary bg-primary/5 px-2 py-1 rounded">
            {test.category}
          </span>
        </div>
        <h3 className="font-semibold text-foreground mb-2">{test.name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{test.description}</p>
        <div className="space-y-2 mb-4">
          <p className="text-xs font-semibold text-foreground">Funcionalidades:</p>
          <ul className="space-y-1">
            {test.features.map((feature, idx) => (
              <li key={idx} className="text-xs text-muted-foreground flex items-center">
                <span className="w-1 h-1 bg-primary rounded-full mr-2"></span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={() => onOpen(test.path)}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm"
        >
          <Eye className="w-4 h-4" />
          <span>Probar Visualmente</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

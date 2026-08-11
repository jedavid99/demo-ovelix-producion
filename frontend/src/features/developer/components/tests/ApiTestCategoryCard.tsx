import { Play, TestTube, Check, X, AlertCircle } from 'lucide-react';
import type { ApiTestCategory, TestResult } from '../../types/tests/tests.types';

interface ApiTestCategoryCardProps {
  category: ApiTestCategory;
  testResults: TestResult[];
  isRunning: boolean;
  onRun: (category: ApiTestCategory) => void;
}

const getStatusIcon = (status: TestResult['status']) => {
  switch (status) {
    case 'success': return <Check className="w-5 h-5 text-success" />;
    case 'error': return <X className="w-5 h-5 text-destructive" />;
    default: return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
  }
};

const getStatusColor = (status: TestResult['status']) => {
  switch (status) {
    case 'success': return 'bg-green-50 border-green-200';
    case 'error': return 'bg-destructive/10 border-red-200';
    default: return 'bg-muted border-border';
  }
};

export const ApiTestCategoryCard = ({ category, testResults, isRunning, onRun }: ApiTestCategoryCardProps) => {
  const Icon = category.icon;
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-muted border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">{category.name}</h3>
          <span className="text-xs text-muted-foreground">({category.tests.length} tests)</span>
        </div>
        <button
          onClick={() => onRun(category)}
          disabled={isRunning}
          className="flex items-center space-x-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-3 h-3" />
          <span>Ejecutar</span>
        </button>
      </div>
      <div className="p-4">
        <div className="space-y-2">
          {category.tests.map((test) => {
            const result = testResults.find(r => r.name === test.name);
            return (
              <div
                key={test.name}
                className={`flex items-center justify-between p-3 rounded-lg border ${result ? getStatusColor(result.status) : 'bg-muted border-border'}`}
              >
                <div className="flex items-center space-x-3">
                  {result ? getStatusIcon(result.status) : <TestTube className="w-4 h-4 text-muted-foreground" />}
                  <div>
                    <div className="text-sm font-medium text-foreground">{test.name}</div>
                    <div className="text-xs text-muted-foreground">{test.method} {test.endpoint}</div>
                  </div>
                </div>
                {result && (
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">{result.duration}ms</div>
                    {result.message && <div className="text-xs text-muted-foreground">{result.message}</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

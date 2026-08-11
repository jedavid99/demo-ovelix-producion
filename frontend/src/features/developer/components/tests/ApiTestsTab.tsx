import { Play } from 'lucide-react';
import type { ApiTestCategory, TestResult } from '../../types/tests/tests.types';
import { TestStats } from './TestStats';
import { ApiTestCategoryCard } from './ApiTestCategoryCard';

interface ApiTestsTabProps {
  apiTestCategories: ApiTestCategory[];
  testResults: TestResult[];
  isRunning: boolean;
  totalTests: number;
  successCount: number;
  errorCount: number;
  onRunAll: () => void;
  onClear: () => void;
  onRunCategory: (category: ApiTestCategory) => void;
}

export const ApiTestsTab = ({
  apiTestCategories,
  testResults,
  isRunning,
  totalTests,
  successCount,
  errorCount,
  onRunAll,
  onClear,
  onRunCategory,
}: ApiTestsTabProps) => (
  <>
    <div className="flex items-center justify-between">
      <div className="flex space-x-3">
        <button
          onClick={onClear}
          disabled={isRunning}
          className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Limpiar
        </button>
        <button
          onClick={onRunAll}
          disabled={isRunning}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4" />
          <span>Ejecutar Todas</span>
        </button>
      </div>
    </div>
    <TestStats totalTests={totalTests} successCount={successCount} errorCount={errorCount} />
    <div className="space-y-4">
      {apiTestCategories.map((category) => (
        <ApiTestCategoryCard
          key={category.name}
          category={category}
          testResults={testResults}
          isRunning={isRunning}
          onRun={onRunCategory}
        />
      ))}
    </div>
  </>
);

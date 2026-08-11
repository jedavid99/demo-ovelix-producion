import React, { useState } from 'react';
import { Eye, Server } from 'lucide-react';
import { visualTests, apiTestCategories } from '../../constants/tests/tests.constants';
import { runSingleTest } from '../../services/tests/tests.service';
import { VisualTestsTab } from '../../components/tests/VisualTestsTab';
import { ApiTestsTab } from '../../components/tests/ApiTestsTab';
import type { TestResult, ApiTestCategory } from '../../types/tests/tests.types';

export default function DeveloperTestsPage() {
  const [activeTab, setActiveTab] = useState<'visual' | 'api'>('visual');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const categories = ['all', ...Array.from(new Set(visualTests.map(t => t.category)))];

  const filteredTests = selectedCategory === 'all'
    ? visualTests
    : visualTests.filter(t => t.category === selectedCategory);

  const openTest = (path: string) => {
    window.open(path, '_blank');
  };

  const runCategoryTests = async (category: ApiTestCategory) => {
    setIsRunning(true);
    for (const test of category.tests) {
      const result = await runSingleTest(test);
      setTestResults(prev => [...prev, result]);
    }
    setIsRunning(false);
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    for (const category of apiTestCategories) {
      for (const test of category.tests) {
        const result = await runSingleTest(test);
        setTestResults(prev => [...prev, result]);
      }
    }
    setIsRunning(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const successCount = testResults.filter(r => r.status === 'success').length;
  const errorCount = testResults.filter(r => r.status === 'error').length;
  const totalTests = apiTestCategories.reduce((acc, cat) => acc + cat.tests.length, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Pruebas del Sistema</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Pruebas de API endpoints y pruebas visuales de la interfaz de usuario
        </p>
      </div>

      <div className="flex space-x-2 border-b border-border">
        <button
          onClick={() => setActiveTab('visual')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'visual'
              ? 'text-primary border-b-2 border-blue-600'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Eye className="w-4 h-4 inline mr-2" />
          Pruebas Visuales
        </button>
        <button
          onClick={() => setActiveTab('api')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'api'
              ? 'text-primary border-b-2 border-blue-600'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Server className="w-4 h-4 inline mr-2" />
          Pruebas de API
        </button>
      </div>

      {activeTab === 'visual' ? (
        <VisualTestsTab
          categories={categories}
          selectedCategory={selectedCategory}
          filteredTests={filteredTests}
          onSelectCategory={setSelectedCategory}
          onOpenTest={openTest}
        />
      ) : (
        <ApiTestsTab
          apiTestCategories={apiTestCategories}
          testResults={testResults}
          isRunning={isRunning}
          totalTests={totalTests}
          successCount={successCount}
          errorCount={errorCount}
          onRunAll={runAllTests}
          onClear={clearResults}
          onRunCategory={runCategoryTests}
        />
      )}
    </div>
  );
}

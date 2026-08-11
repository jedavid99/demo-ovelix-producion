import type { VisualTest } from '../../types/tests/tests.types';
import { FilterBar } from './FilterBar';
import { VisualTestCard } from './VisualTestCard';
import { TestInstructions } from './TestInstructions';

interface VisualTestsTabProps {
  categories: string[];
  selectedCategory: string;
  filteredTests: VisualTest[];
  onSelectCategory: (category: string) => void;
  onOpenTest: (path: string) => void;
}

export const VisualTestsTab = ({
  categories,
  selectedCategory,
  filteredTests,
  onSelectCategory,
  onOpenTest,
}: VisualTestsTabProps) => (
  <>
    <FilterBar
      categories={categories}
      selectedCategory={selectedCategory}
      onSelectCategory={onSelectCategory}
    />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTests.map((test) => (
        <VisualTestCard key={test.id} test={test} onOpen={onOpenTest} />
      ))}
    </div>
    <TestInstructions />
  </>
);

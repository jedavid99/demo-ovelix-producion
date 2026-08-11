interface FilterBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const FilterBar = ({ categories, selectedCategory, onSelectCategory }: FilterBarProps) => (
  <div className="flex flex-wrap gap-2">
    {categories.map((category) => (
      <button
        key={category}
        onClick={() => onSelectCategory(category)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          selectedCategory === category
            ? 'bg-primary text-white'
            : 'bg-card border border-border text-foreground hover:bg-muted'
        }`}
      >
        {category === 'all' ? 'Todas' : category}
      </button>
    ))}
  </div>
);


import { useState } from 'react';
import { Link } from 'react-router-dom';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategoryFilterProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const displayCategories = isExpanded 
    ? categories 
    : categories.slice(0, 6);

  const handleCategoryClick = (category: string) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-serif text-lg font-semibold">Categories</h3>
        {categories.length > 6 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-primary hover:underline"
          >
            {isExpanded ? 'Show Less' : 'Show All'}
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {/* All category option */}
        <span 
          onClick={() => handleCategoryClick('')}
          className={`category-chip cursor-pointer ${!selectedCategory ? 'bg-primary text-primary-foreground' : ''}`}
        >
          All
        </span>
        
        {displayCategories.map((category) => (
          <span
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`category-chip cursor-pointer ${selectedCategory === category ? 'bg-primary text-primary-foreground' : ''}`}
          >
            {category}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;

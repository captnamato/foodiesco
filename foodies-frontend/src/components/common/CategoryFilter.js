import React from 'react';
import { cn } from '../../utils/cn';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  const handleCategoryClick = (categoryId) => {
    if (categoryId === selectedCategory) {
      // If clicking the same category, remove the filter
      onCategoryChange('');
    } else if (categoryId === 'all') {
      // If clicking "All", remove the category filter
      onCategoryChange('');
    } else {
      // Set the new category filter
      onCategoryChange(categoryId);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <button
        onClick={() => handleCategoryClick('all')}
        className={cn(
          'px-4 py-2 rounded-full text-sm font-medium transition-colors',
          !selectedCategory
            ? 'bg-foodies-orange text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        )}
      >
        All Recipes
      </button>

      {categories.map((category) => (
        <button
          key={category._id}
          onClick={() => handleCategoryClick(category._id)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            selectedCategory === category._id
              ? 'bg-foodies-orange text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
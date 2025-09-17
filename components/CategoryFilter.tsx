import React from 'react';
import { StarIcon } from './icons/StarIcon';
import { useLanguage } from './LanguageContext';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  const { t } = useLanguage();
  
  const getDisplayName = (categoryKey: string) => {
    if (categoryKey === 'category_for_you') {
      return t('category_for_you');
    }
    return categoryKey;
  };

  return (
    <div className="flex justify-center flex-wrap gap-3 mb-8">
      {categories.map(categoryKey => (
        <button
          key={categoryKey}
          onClick={() => onSelectCategory(categoryKey)}
          className={`px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
            selectedCategory === categoryKey
              ? 'bg-[#FF8C69] text-white shadow-lg'
              : 'bg-white text-[#004D40] hover:bg-orange-100 border border-orange-200'
          }`}
        >
          {categoryKey === 'category_for_you' && <StarIcon />}
          {getDisplayName(categoryKey)}
        </button>
      ))}
    </div>
  );
};
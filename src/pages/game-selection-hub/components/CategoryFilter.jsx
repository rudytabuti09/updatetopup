import React from 'react';
import Icon from '../../../components/AppIcon';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-gaming font-bold text-foreground mb-4">Kategori Game</h3>
      <div className="flex flex-wrap gap-3">
        {categories?.map((category) => (
          <button
            key={category?.id}
            onClick={() => onCategoryChange(category?.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              selectedCategory === category?.id
                ? 'bg-gradient-to-r from-primary to-secondary text-black shadow-neon-glow'
                : 'bg-surface/50 text-foreground hover:bg-primary/10 hover:text-primary border border-border/50'
            }`}
          >
            <Icon name={category?.icon} size={18} />
            <span>{category?.name}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              selectedCategory === category?.id
                ? 'bg-black/20 text-black' :'bg-primary/20 text-primary'
            }`}>
              {category?.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
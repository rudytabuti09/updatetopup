import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilterPanel = ({ filters, onFiltersChange, onClearFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const priceRanges = [
    { id: 'under-50k', label: 'Di bawah Rp 50.000', min: 0, max: 50000 },
    { id: '50k-100k', label: 'Rp 50.000 - Rp 100.000', min: 50000, max: 100000 },
    { id: '100k-250k', label: 'Rp 100.000 - Rp 250.000', min: 100000, max: 250000 },
    { id: '250k-500k', label: 'Rp 250.000 - Rp 500.000', min: 250000, max: 500000 },
    { id: 'above-500k', label: 'Di atas Rp 500.000', min: 500000, max: Infinity }
  ];

  const processingSpeed = [
    { id: 'instant', label: 'Instan (< 1 menit)', icon: 'Zap' },
    { id: 'fast', label: 'Cepat (1-5 menit)', icon: 'Clock' },
    { id: 'normal', label: 'Normal (5-15 menit)', icon: 'Timer' }
  ];

  const sortOptions = [
    { id: 'popular', label: 'Paling Populer', icon: 'TrendingUp' },
    { id: 'rating', label: 'Rating Tertinggi', icon: 'Star' },
    { id: 'price-low', label: 'Harga Terendah', icon: 'ArrowUp' },
    { id: 'price-high', label: 'Harga Tertinggi', icon: 'ArrowDown' },
    { id: 'newest', label: 'Terbaru', icon: 'Clock' }
  ];

  const handleFilterChange = (filterType, value, checked) => {
    const newFilters = { ...filters };
    
    if (filterType === 'priceRange') {
      newFilters.priceRange = checked ? value : null;
    } else if (filterType === 'processingSpeed') {
      if (checked) {
        newFilters.processingSpeed = [...(newFilters?.processingSpeed || []), value];
      } else {
        newFilters.processingSpeed = (newFilters?.processingSpeed || [])?.filter(speed => speed !== value);
      }
    } else if (filterType === 'sortBy') {
      newFilters.sortBy = value;
    } else if (filterType === 'hasPromo') {
      newFilters.hasPromo = checked;
    }
    
    onFiltersChange(newFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters?.priceRange) count++;
    if (filters?.processingSpeed?.length > 0) count += filters?.processingSpeed?.length;
    if (filters?.hasPromo) count++;
    return count;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-8">
      {/* Filter Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Icon name="Filter" size={20} className="text-primary" />
          <h3 className="text-lg font-gaming font-bold text-foreground">Filter & Urutkan</h3>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded-full">
              {getActiveFiltersCount()} aktif
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {getActiveFiltersCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-text-secondary hover:text-primary"
            >
              <Icon name="X" size={16} className="mr-1" />
              Hapus Semua
            </Button>
          )}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden p-2 rounded-lg hover:bg-primary/10 text-text-secondary hover:text-primary transition-colors"
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={20} />
          </button>
        </div>
      </div>
      {/* Filter Content */}
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block`}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sort By */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Urutkan Berdasarkan</h4>
            <div className="space-y-2">
              {sortOptions?.map((option) => (
                <label key={option?.id} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="sortBy"
                    value={option?.id}
                    checked={filters?.sortBy === option?.id}
                    onChange={(e) => handleFilterChange('sortBy', option?.id, e?.target?.checked)}
                    className="w-4 h-4 text-primary bg-surface border-border focus:ring-primary/20 focus:ring-2"
                  />
                  <Icon name={option?.icon} size={16} className="text-text-secondary group-hover:text-primary transition-colors" />
                  <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                    {option?.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Rentang Harga</h4>
            <div className="space-y-2">
              {priceRanges?.map((range) => (
                <label key={range?.id} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="priceRange"
                    value={range?.id}
                    checked={filters?.priceRange === range?.id}
                    onChange={(e) => handleFilterChange('priceRange', range?.id, e?.target?.checked)}
                    className="w-4 h-4 text-primary bg-surface border-border focus:ring-primary/20 focus:ring-2"
                  />
                  <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                    {range?.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Processing Speed */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Kecepatan Proses</h4>
            <div className="space-y-2">
              {processingSpeed?.map((speed) => (
                <label key={speed?.id} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    value={speed?.id}
                    checked={filters?.processingSpeed?.includes(speed?.id) || false}
                    onChange={(e) => handleFilterChange('processingSpeed', speed?.id, e?.target?.checked)}
                    className="w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary/20 focus:ring-2"
                  />
                  <Icon name={speed?.icon} size={16} className="text-text-secondary group-hover:text-primary transition-colors" />
                  <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                    {speed?.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Special Offers */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Penawaran Khusus</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters?.hasPromo || false}
                  onChange={(e) => handleFilterChange('hasPromo', null, e?.target?.checked)}
                  className="w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary/20 focus:ring-2"
                />
                <Icon name="Tag" size={16} className="text-text-secondary group-hover:text-primary transition-colors" />
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                  Sedang Promo
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
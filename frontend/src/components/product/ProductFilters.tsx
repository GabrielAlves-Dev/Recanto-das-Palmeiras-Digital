import React from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { SearchIcon, FilterIcon } from 'lucide-react';

interface PriceRange {
  min: string;
  max: string;
}

interface ProductFiltersProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  priceRange: PriceRange;
  onPriceRangeChange: (newPriceRange: PriceRange) => void;
  showFilters: boolean;
  onToggleShowFilters: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchQuery,
  onSearchQueryChange,
  priceRange,
  onPriceRangeChange,
  showFilters,
  onToggleShowFilters,
}) => {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <SearchIcon size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onToggleShowFilters}>
            <FilterIcon size={18} className="mr-1" />
            Filtros
          </Button>
        </div>
      </div>
      {showFilters && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <p className="font-medium text-sm mb-2">Faixa de Preço</p>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => onPriceRangeChange({ ...priceRange, min: e.target.value })}
              fullWidth={false}
            />
            <span>-</span>
            <Input
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => onPriceRangeChange({ ...priceRange, max: e.target.value })}
              fullWidth={false}
            />
          </div>
        </div>
      )}
    </>
  );
};

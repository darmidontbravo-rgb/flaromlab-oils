import React from 'react';
import { Filter } from 'lucide-react';

export default function FilterPanel({
  selectedFamily,
  selectedPriceRange,
  selectedSynthesis,
  onFamilyChange,
  onPriceChange,
  onSynthesisChange,
}) {
  const families = [
    'ALL',
    'ROSACEAE',
    'MYRTACEAE',
    'LAMIACEAE',
    'RUTACEAE',
    'ASTERACEAE',
    'APIACEAE',
    'ZINGIBERACEAE',
    'CUPRESSACEAE',
    'PINACEAE',
  ];

  const priceRanges = [
    'ALL',
    'Very Low',
    'Low',
    'Low-Moderate',
    'Moderate',
    'Moderate-High',
    'High',
    'Very High',
  ];

  const synthesisLevels = [
    'ALL',
    'Very High',
    'High',
    'Medium-High',
    'Medium',
    'Low-Medium',
    'Low',
  ];

  return (
    <div className="space-y-4">
      {/* Family Filter */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          <Filter className="w-4 h-4 inline mr-2" />
          Botanical Family
        </label>
        <select
          value={selectedFamily}
          onChange={(e) => onFamilyChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm"
        >
          {families.map((family) => (
            <option key={family} value={family}>
              {family === 'ALL' ? 'All Families' : family}
            </option>
          ))}
        </select>
      </div>

      {/* Price Filter */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
        <select
          value={selectedPriceRange}
          onChange={(e) => onPriceChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm"
        >
          {priceRanges.map((range) => (
            <option key={range} value={range}>
              {range === 'ALL' ? 'All Prices' : range}
            </option>
          ))}
        </select>
      </div>

      {/* Synthesis Filter */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Synthesis</label>
        <select
          value={selectedSynthesis}
          onChange={(e) => onSynthesisChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm"
        >
          {synthesisLevels.map((level) => (
            <option key={level} value={level}>
              {level === 'ALL' ? 'All Levels' : level}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

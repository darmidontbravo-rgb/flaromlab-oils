import React from 'react';
import { Droplet, TrendingUp, DollarSign, CheckCircle, Circle } from 'lucide-react';

export default function OilCard({ oil, isComparing, isSelected, onCompareToggle }) {
  const oilName = Object.keys(oil).length > 0 ? Object.entries(oil)[0][0] : 'Unknown';
  
  const getSynthesisColor = (synthesis) => {
    if (!synthesis) return 'bg-gray-100 text-gray-800';
    if (synthesis.includes('Very High')) return 'bg-green-100 text-green-800';
    if (synthesis.includes('High')) return 'bg-blue-100 text-blue-800';
    if (synthesis.includes('Medium')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getPriceColor = (price) => {
    if (!price) return 'text-gray-600';
    if (price.includes('Very High')) return 'text-red-600 font-bold';
    if (price.includes('High')) return 'text-orange-600 font-semibold';
    if (price.includes('Moderate')) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className={`rounded-xl shadow-md p-6 border-2 transition-all duration-300 ${
      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:shadow-lg hover:border-amber-300'
    }`}>
      {/* Header with Compare Button */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <Droplet className="w-6 h-6 text-amber-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-800 truncate">{oilName}</h3>
            <p className="text-sm text-gray-600 italic truncate">{oil.latin_name}</p>
          </div>
        </div>
        
        {isComparing && (
          <button
            onClick={() => onCompareToggle(oil)}
            className="ml-2 flex-shrink-0 focus:outline-none"
          >
            {isSelected ? (
              <CheckCircle className="w-6 h-6 text-blue-600" />
            ) : (
              <Circle className="w-6 h-6 text-gray-400 hover:text-blue-400" />
            )}
          </button>
        )}
      </div>

      {/* Family & Origin */}
      <div className="mb-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">Family:</span>
          <span className="text-sm bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium">
            {oil.family}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">Origin:</span>
          <span className="text-sm text-gray-600">{oil.origin}</span>
        </div>
      </div>

      {/* Components */}
      {oil.components && (
        <div className="mb-4">
          <h4 className="text-sm font-bold text-gray-700 mb-2">Main Components:</h4>
          <div className="space-y-1">
            {Object.entries(oil.components)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3)
              .map(([component, percentage]) => (
                <div key={component} className="flex justify-between items-center text-xs">
                  <span className="text-gray-600 truncate">{component}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <span className="text-gray-700 font-semibold w-10">{percentage}%</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Synthesis Opportunity */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-gray-600" />
          <span className={`text-xs font-bold px-3 py-1 rounded-lg ${getSynthesisColor(
            oil.synthesis_opportunity
          )}`}>
            {oil.synthesis_opportunity || 'Unknown'}
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-4 h-4 text-gray-600" />
        <span className={`text-sm font-semibold ${getPriceColor(oil.price_range)}`}>
          {oil.price_range || 'N/A'}
        </span>
      </div>

      {/* IFRA Category */}
      {oil.ifra_category && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            <span className="font-semibold">IFRA:</span> {oil.ifra_category}
          </p>
        </div>
      )}

      {/* Properties */}
      {oil.properties && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-700 italic">{oil.properties}</p>
        </div>
      )}
    </div>
  );
}

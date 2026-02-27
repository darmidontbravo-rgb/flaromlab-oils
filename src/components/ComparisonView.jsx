import React from 'react';
import { BarChart3, TrendingUp, DollarSign } from 'lucide-react';

export default function ComparisonView({ oils }) {
  if (oils.length < 2) return null;

  const allComponents = new Set();
  oils.forEach(oil => {
    if (oil.components) {
      Object.keys(oil.components).forEach(comp => allComponents.add(comp));
    }
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 overflow-x-auto">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Comparison Analysis</h2>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-300">
              <th className="text-left p-3 font-bold text-gray-800 sticky left-0 bg-gray-100 w-48">Property</th>
              {oils.map((oil, idx) => (
                <th key={idx} className="text-center p-3 font-bold text-gray-800 min-w-32 bg-amber-50">
                  {oil.name || 'Oil ' + (idx + 1)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Family */}
            <tr className="border-b border-gray-200 hover:bg-gray-50">
              <td className="p-3 font-semibold text-gray-700 sticky left-0 bg-white">Family</td>
              {oils.map((oil, idx) => (
                <td key={idx} className="text-center p-3">
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded text-xs font-semibold">
                    {oil.family}
                  </span>
                </td>
              ))}
            </tr>

            {/* Origin */}
            <tr className="border-b border-gray-200 hover:bg-gray-50">
              <td className="p-3 font-semibold text-gray-700 sticky left-0 bg-white">Origin</td>
              {oils.map((oil, idx) => (
                <td key={idx} className="text-center p-3 text-gray-600">
                  {oil.origin}
                </td>
              ))}
            </tr>

            {/* Price */}
            <tr className="border-b border-gray-200 hover:bg-gray-50">
              <td className="p-3 font-semibold text-gray-700 sticky left-0 bg-white flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Price
              </td>
              {oils.map((oil, idx) => (
                <td key={idx} className="text-center p-3">
                  <span className={`px-3 py-1 rounded text-xs font-bold ${
                    oil.price_range?.includes('Very High') ? 'bg-red-100 text-red-800' :
                    oil.price_range?.includes('High') ? 'bg-orange-100 text-orange-800' :
                    oil.price_range?.includes('Moderate') ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {oil.price_range}
                  </span>
                </td>
              ))}
            </tr>

            {/* Synthesis */}
            <tr className="border-b border-gray-200 hover:bg-gray-50">
              <td className="p-3 font-semibold text-gray-700 sticky left-0 bg-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Synthesis
              </td>
              {oils.map((oil, idx) => (
                <td key={idx} className="text-center p-3">
                  <span className={`px-3 py-1 rounded text-xs font-bold ${
                    oil.synthesis_opportunity?.includes('Very High') ? 'bg-green-100 text-green-800' :
                    oil.synthesis_opportunity?.includes('High') ? 'bg-blue-100 text-blue-800' :
                    oil.synthesis_opportunity?.includes('Medium') ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {oil.synthesis_opportunity}
                  </span>
                </td>
              ))}
            </tr>

            {/* Components */}
            {Array.from(allComponents).slice(0, 5).map((component) => (
              <tr key={component} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-3 font-semibold text-gray-700 text-xs sticky left-0 bg-white">
                  {component}
                </td>
                {oils.map((oil, idx) => (
                  <td key={idx} className="text-center p-3">
                    {oil.components?.[component] ? (
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-amber-600">
                          {oil.components[component]}%
                        </span>
                        <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-amber-500 h-2 rounded-full"
                            style={{ width: `${Math.min(oil.components[component], 100)}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {allComponents.size > 5 && (
        <p className="mt-4 text-sm text-gray-600 text-center">
          Showing top 5 components. {allComponents.size - 5} more available.
        </p>
      )}
    </div>
  );
}

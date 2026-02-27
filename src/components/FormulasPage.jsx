import React, { useState, useEffect } from 'react';
import { Search, DollarSign, Beaker, ChevronDown, ChevronUp, Filter } from 'lucide-react';

export default function FormulasPage() {
  const [formulas, setFormulas] = useState([]);
  const [filteredFormulas, setFilteredFormulas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPriceRange, setSelectedPriceRange] = useState('ALL');
  const [compareList, setCompareList] = useState([]);
  const [expandedFormula, setExpandedFormula] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFormulas = async () => {
      try {
        const response = await fetch('/data/formulas.json');
        const data = await response.json();
        setFormulas(data.formulas || []);
        setFilteredFormulas(data.formulas || []);
        setLoading(false);
      } catch (error) {
        console.error('Error loading formulas:', error);
        setLoading(false);
      }
    };
    loadFormulas();
  }, []);

  useEffect(() => {
    let filtered = formulas;

    if (searchTerm) {
      filtered = filtered.filter(f =>
        f.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(f => f.category === selectedCategory);
    }

    if (selectedPriceRange !== 'ALL') {
      const [minStr, maxStr] = selectedPriceRange.split('-');
      const min = parseInt(minStr);
      const max = maxStr === '+' ? Infinity : parseInt(maxStr);
      filtered = filtered.filter(f => f.cost_usd_per_liter >= min && f.cost_usd_per_liter <= max);
    }

    setFilteredFormulas(filtered);
  }, [searchTerm, selectedCategory, selectedPriceRange, formulas]);

  const toggleCompare = (formula) => {
    if (compareList.some(f => f.id === formula.id)) {
      setCompareList(compareList.filter(f => f.id !== formula.id));
    } else {
      if (compareList.length < 5) {
        setCompareList([...compareList, formula]);
      }
    }
  };

  const toggleExpand = (formulaId) => {
    setExpandedFormula(expandedFormula === formulaId ? null : formulaId);
  };

  const categories = ['ALL', ...new Set(formulas.map(f => f.category))];
  const priceRanges = ['ALL', '0-35', '35-50', '50-75', '75+'];

  if (loading) {
    return <div className="text-center py-16">Loading formulas...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDEBAR - FILTERS */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-24 z-40 lg:z-30 lg:top-0">
              <div className="bg-white rounded-xl shadow-lg p-6">
                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Search className="w-4 h-4 inline mr-2" />
                    Search
                  </label>
                  <input
                    type="text"
                    placeholder="Formula name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Category Filter */}
                <div className="mb-6 border-t pt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Filter className="w-4 h-4 inline mr-2" />
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6 border-t pt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Cost Range
                  </label>
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {priceRanges.map(range => (
                      <option key={range} value={range}>
                        {range === 'ALL' ? 'All Prices' : `$${range}/L`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Compare Selection */}
                <div className="border-t pt-6">
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700">
                      Selected: <span className="text-blue-600">{compareList.length}/5</span>
                    </p>
                    {compareList.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {compareList.map(f => (
                          <div key={f.id} className="text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded flex justify-between items-center">
                            <span>{f.id}</span>
                            <button
                              onClick={() => toggleCompare(f)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT CONTENT - FORMULAS */}
          <div className="flex-1 min-w-0">
            {/* Results Info */}
            <div className="mb-6">
              <p className="text-lg font-semibold text-gray-800">
                Found <span className="text-blue-600">{filteredFormulas.length}</span> formulas
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>

            {/* Formulas List */}
            <div className="space-y-4">
              {filteredFormulas.map((formula) => (
                <div
                  key={formula.id}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all ${
                    compareList.some(f => f.id === formula.id) ? 'ring-2 ring-blue-500 shadow-xl' : ''
                  }`}
                >
                  {/* Header - Always visible */}
                  <div
                    onClick={() => toggleExpand(formula.id)}
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors flex justify-between items-start"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{formula.name}</h3>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {formula.id}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{formula.category} • {formula.components?.length || 0} molecules</p>
                      
                      {/* Quick Stats */}
                      <div className="grid grid-cols-4 gap-3">
                        <div className="bg-amber-50 p-3 rounded">
                          <p className="text-xs text-gray-600">Cost</p>
                          <p className="font-bold text-amber-700">${formula.cost_usd_per_liter}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded">
                          <p className="text-xs text-gray-600">Retail</p>
                          <p className="font-bold text-green-700">${formula.retail_price_usd_per_liter}</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded">
                          <p className="text-xs text-gray-600">Margin</p>
                          <p className="font-bold text-purple-700">{formula.profit_margin}</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded">
                          <p className="text-xs text-gray-600">Shelf Life</p>
                          <p className="font-bold text-blue-700">{formula.shelf_life_months}m</p>
                        </div>
                      </div>
                    </div>

                    {/* Expand/Collapse Icon + Compare Button */}
                    <div className="ml-4 flex flex-col items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompare(formula);
                        }}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                          compareList.some(f => f.id === formula.id)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                      >
                        {compareList.some(f => f.id === formula.id) ? '✓ Selected' : 'Select'}
                      </button>
                      {expandedFormula === formula.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Content - Components List */}
                  {expandedFormula === formula.id && (
                    <div className="border-t bg-gray-50 p-6">
                      <h4 className="font-bold text-lg text-gray-800 mb-4">Components</h4>
                      
                      {/* Components Vertical List */}
                      <div className="space-y-2">
                        {formula.components?.map((comp, idx) => (
                          <div
                            key={idx}
                            className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all flex justify-between items-center"
                          >
                            <div className="flex-1">
                              <div className="font-semibold text-gray-800">{comp.mol}</div>
                              <div className="text-xs text-gray-500">CAS: {comp.cas}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-600">{comp.percent}%</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Additional Info */}
                      <div className="mt-6 pt-6 border-t space-y-2">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Application:</span> {formula.application}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">IFRA Category:</span> {formula.ifra_category}
                        </p>
                        {formula.notes && (
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Notes:</span> {formula.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredFormulas.length === 0 && (
              <div className="text-center py-16">
                <Beaker className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-600 mb-2">No formulas found</h3>
                <p className="text-gray-500">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

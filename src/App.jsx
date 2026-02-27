import React, { useState, useEffect } from 'react';
import { Search, Filter, Droplet, Zap, DollarSign, Beaker } from 'lucide-react';
import SearchComponent from './components/Search';
import OilCard from './components/OilCard';
import ComparisonView from './components/ComparisonView';
import FilterPanel from './components/FilterPanel';
import FormulasPage from './components/FormulasPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('oils');
  const [oils, setOils] = useState([]);
  const [filteredOils, setFilteredOils] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFamily, setSelectedFamily] = useState('ALL');
  const [selectedPriceRange, setSelectedPriceRange] = useState('ALL');
  const [selectedSynthesis, setSelectedSynthesis] = useState('ALL');
  const [comparisonMode, setComparisonMode] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOils = async () => {
      try {
        const response = await fetch('/data/oils.json');
        const data = await response.json();
        const oilsArray = Object.entries(data.oils || {}).map(([name, oil]) => ({
          name,
          ...oil
        }));
        setOils(oilsArray);
        setFilteredOils(oilsArray);
        setLoading(false);
      } catch (error) {
        console.error('Error loading oils:', error);
        setLoading(false);
      }
    };
    loadOils();
  }, []);

  useEffect(() => {
    let filtered = oils;
    if (searchTerm) {
      filtered = filtered.filter(oil =>
        oil.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedFamily !== 'ALL') {
      filtered = filtered.filter(oil => oil.family === selectedFamily);
    }
    if (selectedPriceRange !== 'ALL') {
      filtered = filtered.filter(oil => oil.price_range?.includes(selectedPriceRange));
    }
    if (selectedSynthesis !== 'ALL') {
      filtered = filtered.filter(oil => oil.synthesis_opportunity?.includes(selectedSynthesis));
    }
    setFilteredOils(filtered);
  }, [searchTerm, selectedFamily, selectedPriceRange, selectedSynthesis, oils]);

  const toggleCompare = (oil) => {
    if (compareList.some(item => item.name === oil.name)) {
      setCompareList(compareList.filter(item => item.name !== oil.name));
    } else {
      if (compareList.length < 5) {
        setCompareList([...compareList, oil]);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-center">
          <Droplet className="w-12 h-12 text-amber-600 mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold text-gray-800">Loading Database...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-600 to-orange-600 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <Droplet className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Flaromlab Portal</h1>
          </div>
          <p className="text-amber-100">Essential oils, formulas & synthetic molecules database</p>
          
          {/* Tabs */}
          <div className="flex gap-4 mt-4 border-t border-amber-400 pt-4">
            <button
              onClick={() => setActiveTab('oils')}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold transition-colors ${
                activeTab === 'oils'
                  ? 'bg-white text-amber-600'
                  : 'text-amber-100 hover:text-white'
              }`}
            >
              <Droplet className="w-4 h-4" />
              Essential Oils (72)
            </button>
            <button
              onClick={() => setActiveTab('formulas')}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold transition-colors ${
                activeTab === 'formulas'
                  ? 'bg-white text-orange-600'
                  : 'text-amber-100 hover:text-white'
              }`}
            >
              <Beaker className="w-4 h-4" />
              Formulas (9)
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'oils' ? (
          // OILS TAB
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="sticky top-24 z-40 lg:z-30 lg:top-0">
                <div className="bg-white rounded-xl shadow-lg p-6 lg:mb-0 mb-6">
                  <div className="mb-6">
                    <SearchComponent value={searchTerm} onChange={setSearchTerm} />
                  </div>

                  <div className="mb-6 border-t pt-6">
                    <h3 className="font-bold text-lg mb-4 text-gray-800">Filters</h3>
                    <FilterPanel
                      selectedFamily={selectedFamily}
                      selectedPriceRange={selectedPriceRange}
                      selectedSynthesis={selectedSynthesis}
                      onFamilyChange={setSelectedFamily}
                      onPriceChange={setSelectedPriceRange}
                      onSynthesisChange={setSelectedSynthesis}
                    />
                  </div>

                  <div className="border-t pt-6">
                    <button
                      onClick={() => setComparisonMode(!comparisonMode)}
                      className={`w-full px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                        comparisonMode
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      <Zap className="w-4 h-4" />
                      Compare ({compareList.length}/5)
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              {comparisonMode && compareList.length > 0 && (
                <div className="mb-8">
                  <ComparisonView oils={compareList} />
                </div>
              )}

              <div className="mb-6 text-gray-600">
                <p className="text-lg font-semibold">
                  Found <span className="text-amber-600">{filteredOils.length}</span> oils
                  {searchTerm && ` matching "${searchTerm}"`}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredOils.map((oil, index) => (
                  <OilCard
                    key={index}
                    oil={oil}
                    isComparing={comparisonMode}
                    isSelected={compareList.some(item => item.name === oil.name)}
                    onCompareToggle={toggleCompare}
                  />
                ))}
              </div>

              {filteredOils.length === 0 && (
                <div className="text-center py-16">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-600 mb-2">No oils found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // FORMULAS TAB
          <FormulasPage />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-3">Database</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">72 Essential Oils</a></li>
                <li><a href="#" className="hover:text-white transition">9 Formulas</a></li>
                <li><a href="#" className="hover:text-white transition">96+ Molecules</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Search</a></li>
                <li><a href="#" className="hover:text-white transition">Compare</a></li>
                <li><a href="#" className="hover:text-white transition">Analyze</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">API Docs</a></li>
                <li><a href="#" className="hover:text-white transition">Guide</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">About</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Flaromlab</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
            <p>&copy; 2026 Flaromlab. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

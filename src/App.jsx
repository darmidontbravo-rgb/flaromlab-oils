import React, { useState, useEffect } from 'react';
import { Search, Filter, Droplet, Zap, DollarSign, Beaker, Atom, Lightbulb, FlaskConical, BarChart3 } from 'lucide-react';
import SearchComponent from './components/Search';
import OilCard from './components/OilCard';
import ComparisonView from './components/ComparisonView';
import FilterPanel from './components/FilterPanel';
import FormulasPage from './components/FormulasPage';
import MoleculesPage from './components/MoleculesPage';
import FormulaBuilder from './components/FormulaBuilder';
import SynthesisPage from './components/SynthesisPage';
import AnalyticsDashboard from './components/AnalyticsDashboard';

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
  const [moleculeCount, setMoleculeCount] = useState(0);

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
    const countMolecules = async () => {
      try {
        let totalMols = 0;
        const fileNames = [
          'molecules_part1.json',
          'molecules_part2.json',
          'molecules_part3.json',
          'molecules_part4_expanded.json',
          'molecules_part5_expanded.json',
          'molecules_part6_expanded.json',
          'molecules_part7_expanded.json'
        ];
        
        for (const fileName of fileNames) {
          try {
            const response = await fetch(`/data/${fileName}`);
            if (response.ok) {
              const data = await response.json();
              totalMols += (data.molecules || []).length;
            }
          } catch (e) {
            // Skip missing files
          }
        }
        
        setMoleculeCount(totalMols);
      } catch (error) {
        console.error('Error counting molecules:', error);
      }
    };
    
    countMolecules();
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pb-24 lg:pb-0">
      {/* Header - Desktop Top Tabs */}
      <header className="bg-gradient-to-r from-amber-600 to-orange-600 text-white sticky top-0 z-50 shadow-lg hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <Droplet className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Flaromlab Portal</h1>
          </div>
          <p className="text-amber-100">Essential oils, formulas & synthetic molecules database</p>
          
          {/* Desktop Tabs */}
          <div className="flex gap-4 mt-4 border-t border-amber-400 pt-4 overflow-x-auto">
            {[
              { id: 'oils', label: 'Essential Oils (72)', icon: Droplet },
              { id: 'formulas', label: 'Formulas (9)', icon: Beaker },
              { id: 'molecules', label: 'Molecules (105)', icon: Atom },
              { id: 'builder', label: 'Formula Builder', icon: Lightbulb },
              { id: 'synthesis', label: 'Synthesis', icon: FlaskConical },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white text-amber-600'
                      : 'text-amber-100 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Mobile Header - Compact */}
      <header className="bg-gradient-to-r from-amber-600 to-orange-600 text-white sticky top-0 z-50 shadow-lg lg:hidden">
        <div className="px-4 py-4">
          <div className="flex items-center gap-2 mb-2">
            <Droplet className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Flaromlab</h1>
          </div>
          <p className="text-xs text-amber-100">Essential oils & formulas</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {activeTab === 'oils' ? (
          // OILS TAB
          <div className="px-4 py-8">
            <SearchComponent searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            
            <div className="grid lg:grid-cols-4 gap-8 mt-8">
              <FilterPanel
                selectedFamily={selectedFamily}
                setSelectedFamily={setSelectedFamily}
                selectedPriceRange={selectedPriceRange}
                setSelectedPriceRange={setSelectedPriceRange}
                selectedSynthesis={selectedSynthesis}
                setSelectedSynthesis={setSelectedSynthesis}
              />
              
              <div className="lg:col-span-3">
                {comparisonMode && compareList.length > 0 && (
                  <ComparisonView oils={compareList} onClose={() => setComparisonMode(false)} />
                )}
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredOils.map((oil) => (
                    <OilCard
                      key={oil.name}
                      oil={oil}
                      isSelected={compareList.some(item => item.name === oil.name)}
                      onToggleCompare={() => toggleCompare(oil)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'formulas' ? (
          <FormulasPage />
        ) : activeTab === 'molecules' ? (
          <MoleculesPage />
        ) : activeTab === 'builder' ? (
          <FormulaBuilder />
        ) : activeTab === 'synthesis' ? (
          <SynthesisPage />
        ) : (
          <AnalyticsDashboard />
        )}
      </main>

      {/* Bottom Tab Bar - Mobile Only */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg lg:hidden z-40">
        <div className="grid grid-cols-6 gap-0">
          {[
            { id: 'oils', label: 'Oils', icon: Droplet },
            { id: 'formulas', label: 'Formulas', icon: Beaker },
            { id: 'molecules', label: 'Molecules', icon: Atom },
            { id: 'builder', label: 'Builder', icon: Lightbulb },
            { id: 'synthesis', label: 'Synthesis', icon: FlaskConical },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-3 px-2 transition-colors ${
                  activeTab === tab.id
                    ? 'text-amber-600 border-t-2 border-amber-600'
                    : 'text-gray-600 hover:text-amber-600'
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-semibold text-center truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

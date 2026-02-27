import React, { useState, useEffect } from 'react';
import { Search, Beaker, ChevronDown, ChevronUp, Thermometer, Zap, Clock, DollarSign } from 'lucide-react';

export default function SynthesisPage() {
  const [molecules, setMolecules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [expandedMolecule, setExpandedMolecule] = useState(null);
  const [expandedMethod, setExpandedMethod] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSynthesis = async () => {
      try {
        const part1 = await fetch('/data/synthesis_part1.json').then(r => r.json());
        const part2 = await fetch('/data/synthesis_part2.json').then(r => r.json());
        const part3 = await fetch('/data/synthesis_part3.json').then(r => r.json());
        
        const allMols = [
          ...part1.molecules,
          ...part2.molecules,
          ...part3.molecules
        ];
        
        setMolecules(allMols);
        setLoading(false);
      } catch (error) {
        console.error('Error loading synthesis data:', error);
        setLoading(false);
      }
    };
    loadSynthesis();
  }, []);

  const filtered = molecules.filter(m => {
    const matchSearch = !searchTerm || 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.cas.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'ALL' || m.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const categories = ['ALL', ...new Set(molecules.map(m => m.category))];

  if (loading) {
    return <div className="text-center py-16 text-gray-600">Loading synthesis database...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Synthesis Guides</h1>
        <p className="text-gray-600 mb-8">Detailed synthesis routes for {filtered.length} molecules</p>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDEBAR */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-24 z-40 lg:z-30 lg:top-0">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Search className="w-4 h-4 inline mr-2" />
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Molecule name or CAS..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                <div className="mt-6 pt-6 border-t">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <p className="text-xs text-gray-500">
                    <strong>Total:</strong> {molecules.length} molecules<br/>
                    <strong>Found:</strong> {filtered.length}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <div className="flex-1">
            <div className="space-y-4">
              {filtered.map((mol) => (
                <div key={mol.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-all border-l-4 border-green-500 overflow-hidden">
                  
                  {/* Header */}
                  <div
                    onClick={() => setExpandedMolecule(expandedMolecule === mol.id ? null : mol.id)}
                    className="p-4 cursor-pointer hover:bg-green-50 flex justify-between items-start"
                  >
                    <div className="flex-1">
                      <div className="font-bold text-lg text-gray-800">{mol.name}</div>
                      <div className="text-sm text-gray-600">CAS: {mol.cas}</div>
                      <div className="text-xs text-green-600 font-semibold mt-1">{mol.category} • {mol.methods?.length || 0} routes</div>
                    </div>
                    <div>
                      {expandedMolecule === mol.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Methods */}
                  {expandedMolecule === mol.id && mol.methods && (
                    <div className="bg-green-50 px-4 py-4 border-t space-y-4">
                      {mol.methods.map((method, idx) => (
                        <div key={idx} className="bg-white rounded-lg border border-green-200 overflow-hidden">
                          
                          {/* Method Header */}
                          <div
                            onClick={() => setExpandedMethod(expandedMethod === `${mol.id}-${idx}` ? null : `${mol.id}-${idx}`)}
                            className="p-4 cursor-pointer hover:bg-green-50 flex justify-between items-center"
                          >
                            <div className="flex-1">
                              <div className="font-semibold text-gray-800">{method.name}</div>
                              <div className="text-sm text-gray-600 mt-1">
                                Yield: {method.yield} • Time: {method.time}
                              </div>
                            </div>
                            {expandedMethod === `${mol.id}-${idx}` ? (
                              <ChevronUp className="w-4 h-4 text-green-600" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-green-600" />
                            )}
                          </div>

                          {/* Method Details */}
                          {expandedMethod === `${mol.id}-${idx}` && (
                            <div className="bg-white px-4 py-4 border-t space-y-3 text-sm">
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-start gap-2">
                                  <Thermometer className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                                  <div>
                                    <div className="font-semibold text-gray-700">Temperature</div>
                                    <div className="text-gray-600">{method.temp}</div>
                                  </div>
                                </div>

                                <div className="flex items-start gap-2">
                                  <Zap className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                                  <div>
                                    <div className="font-semibold text-gray-700">Pressure</div>
                                    <div className="text-gray-600">{method.pressure}</div>
                                  </div>
                                </div>

                                <div className="flex items-start gap-2">
                                  <Clock className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                                  <div>
                                    <div className="font-semibold text-gray-700">Time</div>
                                    <div className="text-gray-600">{method.time}</div>
                                  </div>
                                </div>

                                <div className="flex items-start gap-2">
                                  <DollarSign className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                                  <div>
                                    <div className="font-semibold text-gray-700">Cost</div>
                                    <div className="text-gray-600">{method.cost_per_kg}</div>
                                  </div>
                                </div>
                              </div>

                              <div className="pt-3 border-t">
                                <div className="font-semibold text-gray-700 mb-2">Reagents:</div>
                                <div className="flex flex-wrap gap-2">
                                  {method.reagents?.map((reagent, i) => (
                                    <span key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">
                                      {reagent}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="pt-3 border-t">
                                <div className="font-semibold text-gray-700">Yield</div>
                                <div className="text-lg font-bold text-green-600">{method.yield}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <Beaker className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-600 mb-2">No molecules found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

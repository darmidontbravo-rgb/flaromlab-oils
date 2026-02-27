import React, { useState, useEffect } from 'react';
import { Search, Filter, Beaker, ChevronDown, ChevronUp, DollarSign } from 'lucide-react';

export default function MoleculesPage() {
  const [molecules, setMolecules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [expandedMolecule, setExpandedMolecule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMolecules = async () => {
      try {
        console.log('Starting to load molecules...');
        const allMolecules = [];
        
        // Load all 7 parts sequentially to ensure we get all data
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
            console.log(`Loading ${fileName}...`);
            const response = await fetch(`/data/${fileName}`);
            
            if (!response.ok) {
              console.warn(`Failed to load ${fileName}: ${response.status}`);
              continue;
            }
            
            const data = await response.json();
            const mols = data.molecules || [];
            
            console.log(`Loaded ${mols.length} molecules from ${fileName}`);
            allMolecules.push(...mols);
            
          } catch (error) {
            console.warn(`Error loading ${fileName}:`, error);
          }
        }
        
        console.log(`Total molecules loaded: ${allMolecules.length}`);
        
        if (allMolecules.length === 0) {
          setError('No molecules loaded. Check console for errors.');
        }
        
        setMolecules(allMolecules);
        setLoading(false);
        
      } catch (error) {
        console.error('Critical error loading molecules:', error);
        setError(`Error: ${error.message}`);
        setLoading(false);
      }
    };
    
    loadMolecules();
  }, []);

  const filtered = molecules.filter(m => {
    const matchSearch = !searchTerm || 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (m.cas && m.cas.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCategory = selectedCategory === 'ALL' || m.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const categories = ['ALL', ...new Set(molecules.map(m => m.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="text-center py-16 text-gray-600">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full mb-4"></div>
        <p>Loading molecules database...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-red-600">
        <p className="font-bold mb-2">Error loading molecules</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Molecules Database</h1>
        <p className="text-gray-600 mb-8">Complete library of {molecules.length} molecules for perfumery and flavoring</p>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDEBAR - FILTERS */}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <div className="mt-6 pt-6 border-t">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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

          {/* RIGHT CONTENT - RESULTS */}
          <div className="flex-1">
            <div className="mb-6">
              <p className="text-lg font-semibold text-gray-800">
                Found <span className="text-purple-600">{filtered.length}</span> molecules
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>

            <div className="space-y-4">
              {filtered.map((mol) => (
                <div key={mol.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-all border-l-4 border-purple-500 overflow-hidden">
                  
                  {/* HEADER */}
                  <div
                    onClick={() => setExpandedMolecule(expandedMolecule === mol.id ? null : mol.id)}
                    className="p-4 cursor-pointer hover:bg-purple-50 flex justify-between items-start"
                  >
                    <div className="flex-1">
                      <div className="font-bold text-lg text-gray-800">{mol.name}</div>
                      <div className="text-sm text-gray-600">CAS: {mol.cas || 'N/A'}</div>
                      <div className="text-xs text-purple-600 font-semibold mt-1">{mol.category || 'General'}</div>
                    </div>
                    <div className="text-right ml-4">
                      {mol.price_usd_per_kg && (
                        <div className="text-sm font-bold text-purple-700 mb-2">
                          <DollarSign className="w-3 h-3 inline" />
                          {mol.price_usd_per_kg}/kg
                        </div>
                      )}
                      {expandedMolecule === mol.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                  </div>

                  {/* EXPANDED DETAILS */}
                  {expandedMolecule === mol.id && (
                    <div className="bg-purple-50 p-4 border-t space-y-3 text-sm">
                      {mol.description && (
                        <div className="mb-4 p-3 bg-white rounded border-l-2 border-purple-400">
                          <div className="font-semibold text-gray-700 mb-2">Description</div>
                          <div className="text-gray-600 text-xs leading-relaxed">{mol.description}</div>
                        </div>
                      )}
                      
                      {mol.organoleptic && (
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-700">Organoleptic:</span>
                          <span className="text-gray-600 text-right">{mol.organoleptic}</span>
                        </div>
                      )}
                      
                      {mol.odor && (
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-700">Odor:</span>
                          <span className="text-gray-600">{mol.odor}</span>
                        </div>
                      )}
                      
                      {mol.shelf_life && (
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-700">Shelf Life:</span>
                          <span className="text-gray-600">{mol.shelf_life}</span>
                        </div>
                      )}
                      
                      {mol.regulatory && (
                        <div className="pt-2 border-t">
                          <span className="font-semibold text-gray-700 block mb-2">Regulatory:</span>
                          <div className="flex flex-wrap gap-2">
                            {mol.regulatory.fema_gras && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">FEMA: {mol.regulatory.fema_gras}</span>}
                            {mol.regulatory.eu_approved && <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">EU: {mol.regulatory.eu_approved}</span>}
                            {mol.regulatory.prop_65 && <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">Prop 65: {mol.regulatory.prop_65}</span>}
                          </div>
                        </div>
                      )}
                      
                      {mol.compatibility && Array.isArray(mol.compatibility) && mol.compatibility.length > 0 && (
                        <div className="pt-2 border-t">
                          <span className="font-semibold text-gray-700 block mb-2">Compatible with:</span>
                          <div className="flex flex-wrap gap-2">
                            {mol.compatibility.map((c, i) => (
                              <span key={i} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {mol.suppliers && Array.isArray(mol.suppliers) && mol.suppliers.length > 0 && (
                        <div>
                          <span className="font-semibold text-gray-700">Suppliers:</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {mol.suppliers.map((s, i) => (
                              <span key={i} className="bg-white px-2 py-1 rounded text-xs text-gray-700 border border-gray-200">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
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

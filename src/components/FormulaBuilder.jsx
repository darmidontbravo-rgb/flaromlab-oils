import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, BarChart3 } from 'lucide-react';

export default function FormulaBuilder() {
  const [molecules, setMolecules] = useState([]);
  const [formulaName, setFormulaName] = useState('');
  const [formulaCategory, setFormulaCategory] = useState('Custom');
  const [components, setComponents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMolecule, setSelectedMolecule] = useState('');
  const [selectedPercent, setSelectedPercent] = useState('');
  const [savedFormulas, setSavedFormulas] = useState([]);

  useEffect(() => {
    const loadMolecules = async () => {
      try {
        const part1 = await fetch('/data/molecules_part1.json').then(r => r.json());
        const part2 = await fetch('/data/molecules_part2.json').then(r => r.json());
        const part3 = await fetch('/data/molecules_part3.json').then(r => r.json());
        const part4 = await fetch('/data/molecules_part4.json').then(r => r.json());
        const part5 = await fetch('/data/molecules_part5.json').then(r => r.json());
        const allMols = [...part1.molecules, ...part2.molecules, ...part3.molecules, ...part4.molecules, ...part5.molecules];
        setMolecules(allMols);
        const saved = localStorage.getItem('myFormulas');
        if (saved) setSavedFormulas(JSON.parse(saved));
      } catch (error) {
        console.error('Error:', error);
      }
    };
    loadMolecules();
  }, []);

  const addComponent = () => {
    if (selectedMolecule && selectedPercent) {
      const mol = molecules.find(m => m.id === selectedMolecule);
      if (mol) {
        setComponents([...components, { ...mol, percent: parseFloat(selectedPercent) }]);
        setSelectedMolecule('');
        setSelectedPercent('');
      }
    }
  };

  const removeComponent = (index) => {
    setComponents(components.filter((_, i) => i !== index));
  };

  const calculateCost = () => {
    return components.reduce((sum, c) => sum + (c.price_usd_per_kg || 0) * c.percent / 100, 0);
  };

  const calculateRetail = () => calculateCost() * 6.5;
  const calculateMargin = () => {
    const cost = calculateCost();
    return cost > 0 ? (calculateRetail() / cost).toFixed(1) : '0';
  };

  const totalPercent = components.reduce((sum, c) => sum + c.percent, 0);

  const saveFormula = () => {
    if (!formulaName) { alert('Enter name'); return; }
    if (Math.abs(totalPercent - 100) > 0.1) { alert('Total must be 100%'); return; }
    const newFormula = {
      id: 'CUSTOM-' + Date.now(),
      name: formulaName,
      category: formulaCategory,
      components: components.map(c => ({ id: c.id, name: c.name, percent: c.percent })),
      cost: calculateCost(),
      retail: calculateRetail(),
      createdAt: new Date().toLocaleDateString()
    };
    const updated = [...savedFormulas, newFormula];
    setSavedFormulas(updated);
    localStorage.setItem('myFormulas', JSON.stringify(updated));
    alert('Saved!');
    resetForm();
  };

  const resetForm = () => {
    setFormulaName('');
    setFormulaCategory('Custom');
    setComponents([]);
  };

  const filteredMols = molecules.filter(m => 
    !components.find(c => c.id === m.id) &&
    (m.name?.toLowerCase().includes(searchTerm.toLowerCase()) || m.cas?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Formula Builder</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-800">Formula Details</h2>
              <input type="text" placeholder="Formula name..." value={formulaName} onChange={(e) => setFormulaName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              <select value={formulaCategory} onChange={(e) => setFormulaCategory(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option>Custom</option>
                <option>Chocolate</option>
                <option>Rose</option>
                <option>Vanilla</option>
                <option>Fruity</option>
                <option>Herbal</option>
              </select>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-800">Add Molecules</h2>
              <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              <select value={selectedMolecule} onChange={(e) => setSelectedMolecule(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option value="">Select...</option>
                {filteredMols.map(mol => (<option key={mol.id} value={mol.id}>{mol.name}</option>))}
              </select>
              <div className="flex gap-2">
                <input type="number" placeholder="%" value={selectedPercent} onChange={(e) => setSelectedPercent(e.target.value)} min="0.1" max="100" step="0.1" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg" />
                <button onClick={addComponent} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"><Plus className="w-4 h-4" /> Add</button>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Components ({components.length})</h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {components.map((comp, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
                    <div>
                      <div className="font-semibold">{comp.name}</div>
                      <div className="text-sm text-gray-600">CAS: {comp.cas}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{comp.percent}%</div>
                        <div className="text-xs text-gray-600">${(comp.price_usd_per_kg * comp.percent / 100).toFixed(2)}</div>
                      </div>
                      <button onClick={() => removeComponent(idx)} className="text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t-2 text-lg font-bold">Total: {totalPercent.toFixed(1)}%</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-lg p-6 text-white h-fit sticky top-24">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><BarChart3 className="w-6 h-6" /> Summary</h2>
            <div className="space-y-4">
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <div className="text-sm opacity-90">Total Cost</div>
                <div className="text-3xl font-bold">${calculateCost().toFixed(2)}/L</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <div className="text-sm opacity-90">Retail Price</div>
                <div className="text-3xl font-bold">${calculateRetail().toFixed(2)}/L</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <div className="text-sm opacity-90">Margin</div>
                <div className="text-3xl font-bold">{calculateMargin()}x</div>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                <div className="text-sm opacity-90">Components</div>
                <div className="text-3xl font-bold">{components.length}</div>
              </div>
            </div>
            <button onClick={saveFormula} disabled={Math.abs(totalPercent - 100) > 0.1} className="w-full mt-6 bg-white text-blue-600 font-bold py-3 rounded-lg hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Save</button>
            <button onClick={resetForm} className="w-full mt-2 bg-white/20 hover:bg-white/30 text-white font-bold py-2 rounded-lg">Reset</button>
          </div>
        </div>
        {savedFormulas.length > 0 && (
          <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Formulas</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedFormulas.map(formula => (
                <div key={formula.id} className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
                  <div className="font-bold">{formula.name}</div>
                  <div className="text-sm text-gray-600">{formula.category}</div>
                  <div className="text-sm mt-2">
                    <div>Cost: ${formula.cost.toFixed(2)}/L</div>
                    <div>Retail: ${formula.retail.toFixed(2)}/L</div>
                    <div>Parts: {formula.components.length}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
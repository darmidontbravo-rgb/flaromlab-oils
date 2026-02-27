import React, { useState, useEffect } from 'react';
import { TrendingUp, PieChart, BarChart3, Trophy, Activity } from 'lucide-react';

export default function AnalyticsDashboard() {
  const [formulas, setFormulas] = useState([]);
  const [molecules, setMolecules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const formulasRes = await fetch('/data/formulas.json').then(r => r.json());
        const part1 = await fetch('/data/molecules_part1.json').then(r => r.json());
        const part2 = await fetch('/data/molecules_part2.json').then(r => r.json());
        const part3 = await fetch('/data/molecules_part3.json').then(r => r.json());
        const part4 = await fetch('/data/molecules_part4.json').then(r => r.json());
        const part5 = await fetch('/data/molecules_part5.json').then(r => r.json());
        
        setFormulas(formulasRes.formulas || []);
        const allMols = [
          ...part1.molecules,
          ...part2.molecules,
          ...part3.molecules,
          ...part4.molecules,
          ...part5.molecules
        ];
        setMolecules(allMols);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const calculateStats = () => {
    const stats = {
      totalFormulas: formulas.length,
      totalMolecules: molecules.length,
      avgCost: formulas.length > 0 ? (formulas.reduce((sum, f) => sum + (f.cost || 0), 0) / formulas.length).toFixed(2) : 0,
      avgMargin: formulas.length > 0 ? (formulas.reduce((sum, f) => sum + (f.cost && f.retail ? f.retail / f.cost : 0), 0) / formulas.length).toFixed(1) : 0,
      totalRevenue: formulas.reduce((sum, f) => sum + (f.retail || 0), 0).toFixed(2)
    };
    return stats;
  };

  const getCategoryBreakdown = () => {
    const breakdown = {};
    molecules.forEach(mol => {
      breakdown[mol.category] = (breakdown[mol.category] || 0) + 1;
    });
    return Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
  };

  const getTopMolecules = () => {
    const usage = {};
    formulas.forEach(formula => {
      if (formula.components) {
        formula.components.forEach(comp => {
          usage[comp.id] = (usage[comp.id] || 0) + 1;
        });
      }
    });
    return Object.entries(usage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id, count]) => {
        const mol = molecules.find(m => m.id === id);
        return { name: mol?.name || id, usage: count };
      });
  };

  const stats = calculateStats();
  const categoryBreakdown = getCategoryBreakdown();
  const topMolecules = getTopMolecules();

  if (loading) {
    return <div className="text-center py-16 text-gray-600">Loading analytics...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600 mb-8">Perfumery & Flavorist Intelligence</p>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 font-semibold">Total Formulas</div>
                <div className="text-3xl font-bold text-indigo-600 mt-2">{stats.totalFormulas}</div>
              </div>
              <Activity className="w-8 h-8 text-indigo-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 font-semibold">Molecules</div>
                <div className="text-3xl font-bold text-purple-600 mt-2">{stats.totalMolecules}</div>
              </div>
              <PieChart className="w-8 h-8 text-purple-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 font-semibold">Avg Cost</div>
                <div className="text-3xl font-bold text-green-600 mt-2">${stats.avgCost}/L</div>
              </div>
              <BarChart3 className="w-8 h-8 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 font-semibold">Avg Margin</div>
                <div className="text-3xl font-bold text-orange-600 mt-2">{stats.avgMargin}x</div>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 font-semibold">Revenue</div>
                <div className="text-3xl font-bold text-red-600 mt-2">${stats.totalRevenue}</div>
              </div>
              <Trophy className="w-8 h-8 text-red-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Category Breakdown */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Molecules by Category</h2>
            <div className="space-y-3">
              {categoryBreakdown.map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <span className="font-semibold text-gray-700">{category}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-indigo-600">{count}</span>
                    <span className="text-gray-600 text-sm ml-2">({((count / molecules.length) * 100).toFixed(1)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Molecules */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Top 10 Most Used Molecules</h2>
            <div className="space-y-3">
              {topMolecules.length > 0 ? (
                topMolecules.map(({ name, usage }, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </div>
                      <span className="font-semibold text-gray-700">{name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-purple-600">{usage}</span>
                      <span className="text-gray-600 text-sm ml-2">formulas</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No formula data available</div>
              )}
            </div>
          </div>
        </div>

        {/* Price Analysis */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Price Analysis</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 font-semibold">Min Cost</div>
              <div className="text-2xl font-bold text-green-600 mt-2">
                ${Math.min(...formulas.map(f => f.cost || 0)).toFixed(2)}/L
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 font-semibold">Median Cost</div>
              <div className="text-2xl font-bold text-indigo-600 mt-2">
                ${(formulas.length > 0 ? formulas.sort((a, b) => (a.cost || 0) - (b.cost || 0))[Math.floor(formulas.length / 2)]?.cost || 0).toFixed(2)}/L
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 font-semibold">Max Cost</div>
              <div className="text-2xl font-bold text-orange-600 mt-2">
                ${Math.max(...formulas.map(f => f.cost || 0)).toFixed(2)}/L
              </div>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="mt-8 bg-indigo-50 rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Insights</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✓ {stats.totalMolecules} molecules available for formula creation</li>
            <li>✓ Average formula profit margin: {stats.avgMargin}x (excellent ROI)</li>
            <li>✓ Top category: {categoryBreakdown[0]?.[0]} with {categoryBreakdown[0]?.[1]} molecules</li>
            <li>✓ {topMolecules.length > 0 ? topMolecules[0].name : 'Data'} is the most versatile ingredient</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

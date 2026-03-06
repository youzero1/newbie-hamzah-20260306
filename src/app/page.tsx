'use client';

import { useState, useEffect, useCallback } from 'react';
import Calculator from '@/components/Calculator';
import CalculationHistory from '@/components/CalculationHistory';
import SharedCalculations from '@/components/SharedCalculations';
import { CalculationRecord } from '@/types';

export default function Home() {
  const [calculations, setCalculations] = useState<CalculationRecord[]>([]);
  const [sharedCalculations, setSharedCalculations] = useState<CalculationRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'calculator' | 'shared'>('calculator');
  const [loading, setLoading] = useState(false);

  const fetchCalculations = useCallback(async () => {
    try {
      const res = await fetch('/api/calculations');
      const data = await res.json();
      if (data.success) {
        setCalculations(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch calculations:', err);
    }
  }, []);

  const fetchSharedCalculations = useCallback(async () => {
    try {
      const res = await fetch('/api/shared');
      const data = await res.json();
      if (data.success) {
        setSharedCalculations(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch shared calculations:', err);
    }
  }, []);

  useEffect(() => {
    fetchCalculations();
    fetchSharedCalculations();
  }, [fetchCalculations, fetchSharedCalculations]);

  const handleCalculationSave = async (expression: string, result: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/calculations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression, result }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchCalculations();
      }
    } catch (err) {
      console.error('Failed to save calculation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (calculationId: number) => {
    try {
      const res = await fetch('/api/shared', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calculationId }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchCalculations();
        await fetchSharedCalculations();
      }
    } catch (err) {
      console.error('Failed to share calculation:', err);
    }
  };

  const handleDelete = async (calculationId: number) => {
    try {
      const res = await fetch(`/api/calculations?id=${calculationId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        await fetchCalculations();
        await fetchSharedCalculations();
      }
    } catch (err) {
      console.error('Failed to delete calculation:', err);
    }
  };

  return (
    <main className="min-h-screen py-6 px-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">
              newbie
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">The social calculator</p>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-2xl p-1 shadow-md border border-slate-100">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'calculator'
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              🧮 Calculator
            </button>
            <button
              onClick={() => { setActiveTab('shared'); fetchSharedCalculations(); }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'shared'
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              🌐 Community Feed
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {activeTab === 'calculator' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calculator */}
            <div className="flex justify-center">
              <Calculator onCalculate={handleCalculationSave} />
            </div>
            {/* History */}
            <div>
              <CalculationHistory
                calculations={calculations}
                onShare={handleShare}
                onDelete={handleDelete}
                loading={loading}
              />
            </div>
          </div>
        ) : (
          <SharedCalculations sharedCalculations={sharedCalculations} onRefresh={fetchSharedCalculations} />
        )}
      </div>
    </main>
  );
}

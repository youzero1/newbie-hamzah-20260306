'use client';

import React from 'react';
import { CalculationRecord } from '@/types';

interface CalculationHistoryProps {
  calculations: CalculationRecord[];
  onShare: (id: number) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function CalculationHistory({
  calculations,
  onShare,
  onDelete,
  loading,
}: CalculationHistoryProps) {
  return (
    <div className="card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📋</span>
          <h2 className="text-lg font-bold text-slate-700">My History</h2>
        </div>
        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
          {calculations.length} entries
        </span>
      </div>

      {loading && (
        <div className="text-center py-4 text-slate-400 text-sm">Saving...</div>
      )}

      {calculations.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <div className="text-5xl mb-3">🔢</div>
          <p className="text-slate-400 font-medium">No calculations yet</p>
          <p className="text-slate-300 text-sm mt-1">Start calculating to see your history here!</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto scrollbar-thin space-y-2 pr-1" style={{ maxHeight: '520px' }}>
          {calculations.map((calc) => (
            <div
              key={calc.id}
              className="group bg-slate-50 hover:bg-white rounded-2xl p-4 border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-200 animate-slide-up"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-slate-400 text-xs font-mono truncate">{calc.expression}</p>
                  <p className="text-slate-800 font-bold text-xl font-mono">{calc.result}</p>
                  <p className="text-slate-300 text-xs mt-1">{formatDate(calc.createdAt)}</p>
                </div>
                <div className="flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!calc.isShared ? (
                    <button
                      onClick={() => onShare(calc.id)}
                      className="flex items-center gap-1 bg-sky-50 hover:bg-sky-100 text-sky-600 text-xs font-semibold px-3 py-1.5 rounded-xl border border-sky-200 hover:border-sky-300 transition-colors whitespace-nowrap"
                    >
                      🌐 Share
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 bg-emerald-50 text-emerald-500 text-xs font-semibold px-3 py-1.5 rounded-xl border border-emerald-200 whitespace-nowrap">
                      ✓ Shared
                    </span>
                  )}
                  <button
                    onClick={() => onDelete(calc.id)}
                    className="flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-400 text-xs font-semibold px-3 py-1.5 rounded-xl border border-rose-200 hover:border-rose-300 transition-colors whitespace-nowrap"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

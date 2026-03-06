'use client';

import React from 'react';

interface SharedEntry {
  id: number;
  calculationId: number;
  expression: string;
  result: string;
  sharedBy: string;
  sharedAt: string;
}

interface SharedCalculationsProps {
  sharedCalculations: SharedEntry[];
  onRefresh: () => void;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const AVATAR_COLORS = [
  'from-sky-400 to-blue-500',
  'from-violet-400 to-purple-500',
  'from-rose-400 to-pink-500',
  'from-amber-400 to-orange-500',
  'from-emerald-400 to-teal-500',
  'from-indigo-400 to-blue-600',
];

export default function SharedCalculations({ sharedCalculations, onRefresh }: SharedCalculationsProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-700 flex items-center gap-2">
            <span>🌐</span> Community Feed
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">Calculations shared by the community</p>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-600 text-sm font-semibold px-4 py-2 rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm transition-all"
        >
          🔄 Refresh
        </button>
      </div>

      {sharedCalculations.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">🌐</div>
          <h3 className="text-xl font-bold text-slate-600 mb-2">Nothing shared yet</h3>
          <p className="text-slate-400">
            Be the first! Go to the Calculator tab and share a calculation.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sharedCalculations.map((entry, i) => (
            <div
              key={entry.id}
              className="card p-5 hover:shadow-2xl transition-all duration-200 animate-fade-in"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                >
                  {(entry.sharedBy || 'A')[0].toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-700 text-sm">{entry.sharedBy || 'Anonymous'}</span>
                    <span className="text-slate-400 text-xs flex-shrink-0">{timeAgo(entry.sharedAt)}</span>
                  </div>

                  <div className="mt-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-3">
                    <p className="text-slate-400 text-xs font-mono truncate">{entry.expression}</p>
                    <p className="text-white font-bold text-2xl font-mono mt-0.5">{entry.result}</p>
                  </div>

                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-xs text-slate-400">
                      {new Date(entry.sharedAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-500 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                      Public
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

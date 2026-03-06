'use client';

import React from 'react';

interface DisplayProps {
  expression: string;
  current: string;
}

export default function Display({ expression, current }: DisplayProps) {
  const fontSize =
    current.length > 12
      ? 'text-2xl'
      : current.length > 8
      ? 'text-3xl'
      : 'text-4xl';

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 mb-4 min-h-[120px] flex flex-col justify-between">
      <div className="text-slate-400 text-sm font-mono min-h-[20px] text-right truncate">
        {expression || '\u00A0'}
      </div>
      <div className={`text-white font-bold text-right font-mono ${fontSize} break-all leading-tight mt-2`}>
        {current || '0'}
      </div>
    </div>
  );
}

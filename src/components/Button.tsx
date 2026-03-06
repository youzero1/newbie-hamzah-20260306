'use client';

import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'number' | 'operator' | 'equals' | 'clear' | 'function';
  wide?: boolean;
}

const variantClasses: Record<string, string> = {
  number:
    'bg-white hover:bg-slate-50 text-slate-800 shadow-sm border border-slate-200 hover:border-slate-300',
  operator:
    'bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-200 hover:border-sky-300',
  equals:
    'bg-gradient-to-br from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-200',
  clear:
    'bg-rose-50 hover:bg-rose-100 text-rose-500 border border-rose-200 hover:border-rose-300',
  function:
    'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200',
};

export default function Button({ label, onClick, variant = 'number', wide = false }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`btn-calc h-14 ${
        wide ? 'col-span-2' : ''
      } ${variantClasses[variant]} text-xl font-semibold`}
    >
      {label}
    </button>
  );
}

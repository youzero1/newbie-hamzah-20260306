'use client';

import React, { useState, useCallback } from 'react';
import Display from './Display';
import Button from './Button';

interface CalculatorProps {
  onCalculate: (expression: string, result: string) => void;
}

type ButtonConfig = {
  label: string;
  variant: 'number' | 'operator' | 'equals' | 'clear' | 'function';
  wide?: boolean;
  action: string;
};

const BUTTONS: ButtonConfig[] = [
  { label: 'AC', variant: 'clear', action: 'clear' },
  { label: '⌫', variant: 'function', action: 'backspace' },
  { label: '%', variant: 'operator', action: 'percent' },
  { label: '÷', variant: 'operator', action: '/' },

  { label: '7', variant: 'number', action: '7' },
  { label: '8', variant: 'number', action: '8' },
  { label: '9', variant: 'number', action: '9' },
  { label: '×', variant: 'operator', action: '*' },

  { label: '4', variant: 'number', action: '4' },
  { label: '5', variant: 'number', action: '5' },
  { label: '6', variant: 'number', action: '6' },
  { label: '−', variant: 'operator', action: '-' },

  { label: '1', variant: 'number', action: '1' },
  { label: '2', variant: 'number', action: '2' },
  { label: '3', variant: 'number', action: '3' },
  { label: '+', variant: 'operator', action: '+' },

  { label: '+/−', variant: 'function', action: 'negate' },
  { label: '0', variant: 'number', action: '0' },
  { label: '.', variant: 'number', action: '.' },
  { label: '=', variant: 'equals', action: '=' },
];

export default function Calculator({ onCalculate }: CalculatorProps) {
  const [current, setCurrent] = useState('0');
  const [expression, setExpression] = useState('');
  const [operator, setOperator] = useState<string | null>(null);
  const [prevValue, setPrevValue] = useState<string | null>(null);
  const [justCalculated, setJustCalculated] = useState(false);

  const formatResult = (num: number): string => {
    if (!isFinite(num)) return 'Error';
    if (Number.isInteger(num) && Math.abs(num) < 1e15) return String(num);
    const str = num.toPrecision(12);
    return parseFloat(str).toString();
  };

  const calculate = useCallback(
    (a: string, b: string, op: string): string => {
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      if (isNaN(numA) || isNaN(numB)) return 'Error';
      switch (op) {
        case '+':
          return formatResult(numA + numB);
        case '-':
          return formatResult(numA - numB);
        case '*':
          return formatResult(numA * numB);
        case '/':
          if (numB === 0) return 'Error';
          return formatResult(numA / numB);
        default:
          return b;
      }
    },
    []
  );

  const handleAction = useCallback(
    (action: string) => {
      if (action === 'clear') {
        setCurrent('0');
        setExpression('');
        setOperator(null);
        setPrevValue(null);
        setJustCalculated(false);
        return;
      }

      if (action === 'backspace') {
        if (justCalculated) return;
        setCurrent((prev) => (prev.length <= 1 ? '0' : prev.slice(0, -1)));
        return;
      }

      if (action === 'percent') {
        const val = parseFloat(current);
        if (isNaN(val)) return;
        const result = String(val / 100);
        setCurrent(result);
        return;
      }

      if (action === 'negate') {
        if (current === '0') return;
        setCurrent((prev) =>
          prev.startsWith('-') ? prev.slice(1) : '-' + prev
        );
        return;
      }

      if (action === '=') {
        if (!operator || prevValue === null) return;
        const exprStr = `${prevValue} ${operator === '*' ? '×' : operator === '/' ? '÷' : operator === '-' ? '−' : '+'} ${current}`;
        const result = calculate(prevValue, current, operator);
        setExpression(`${exprStr} =`);
        setCurrent(result);
        setOperator(null);
        setPrevValue(null);
        setJustCalculated(true);
        if (result !== 'Error') {
          onCalculate(exprStr, result);
        }
        return;
      }

      // Operator
      if (['+', '-', '*', '/'].includes(action)) {
        if (operator && prevValue !== null && !justCalculated) {
          const intermediate = calculate(prevValue, current, operator);
          setPrevValue(intermediate);
          setCurrent(intermediate);
          setExpression(
            `${intermediate} ${action === '*' ? '×' : action === '/' ? '÷' : action === '-' ? '−' : '+'}`
          );
        } else {
          setPrevValue(current);
          setExpression(
            `${current} ${action === '*' ? '×' : action === '/' ? '÷' : action === '-' ? '−' : '+'}`
          );
        }
        setOperator(action);
        setJustCalculated(false);
        return;
      }

      // Digit or decimal
      if (action === '.') {
        if (justCalculated) {
          setCurrent('0.');
          setJustCalculated(false);
          return;
        }
        if (current.includes('.')) return;
        setCurrent((prev) => prev + '.');
        return;
      }

      // Number
      if (justCalculated) {
        setCurrent(action);
        setExpression('');
        setJustCalculated(false);
        return;
      }

      setCurrent((prev) => {
        if (prev === '0') return action;
        if (prev === '-0') return '-' + action;
        if (prev.length >= 15) return prev;
        return prev + action;
      });
    },
    [current, operator, prevValue, justCalculated, calculate, onCalculate]
  );

  return (
    <div className="card p-6 w-full max-w-sm">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-2xl">🧮</span>
        <h2 className="text-lg font-bold text-slate-700">Calculator</h2>
      </div>
      <Display expression={expression} current={current} />
      <div className="grid grid-cols-4 gap-2.5">
        {BUTTONS.map((btn) => (
          <Button
            key={btn.action + btn.label}
            label={btn.label}
            onClick={() => handleAction(btn.action)}
            variant={btn.variant}
            wide={btn.wide}
          />
        ))}
      </div>
    </div>
  );
}

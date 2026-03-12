
import React from 'react';

interface NumberInputProps {
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  placeholder?: string;
  suffix?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({ label, value, onChange, placeholder, suffix }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-800 border-2 border-slate-700 text-white text-2xl font-bold p-4 rounded-xl focus:border-yellow-500 focus:outline-none transition-colors appearance-none"
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold uppercase pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};

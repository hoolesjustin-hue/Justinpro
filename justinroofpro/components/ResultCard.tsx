import React from 'react';

interface ResultCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subValue?: string;
  highlight?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({ label, value, unit, subValue, highlight }) => {
  return (
    <div className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
      highlight 
        ? 'bg-yellow-500 border-yellow-400 text-slate-950 shadow-lg shadow-yellow-500/10' 
        : 'bg-slate-900 border-slate-800 text-white'
    }`}>
      <span className={`text-[10px] uppercase font-black tracking-widest mb-1 ${highlight ? 'text-slate-900/70' : 'text-slate-500'}`}>
        {label}
      </span>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-black mono tracking-tighter">{value}</span>
        {unit && <span className="text-[10px] font-black uppercase opacity-70">{unit}</span>}
      </div>
      {subValue && (
        <div className={`mt-1 text-[10px] font-black uppercase mono ${highlight ? 'text-slate-900/60' : 'text-slate-500'}`}>
          {subValue}
        </div>
      )}
    </div>
  );
};
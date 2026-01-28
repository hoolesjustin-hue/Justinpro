import React, { useMemo } from 'react';
import { NumberInput } from './NumberInput';
import { ResultCard } from './ResultCard';

interface Props {
  length: string;
  setLength: (val: string) => void;
  width: string;
  setWidth: (val: string) => void;
}

export const MainAreaCalculator: React.FC<Props> = ({ length, setLength, width, setWidth }) => {
  const results = useMemo(() => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    
    const baseSqft = l * w;
    const totalWithWaste = baseSqft * 1.1;

    return {
      baseSqft: Math.round(baseSqft),
      baseSquares: (baseSqft / 100).toFixed(2),
      totalWithWaste: Math.ceil(totalWithWaste),
      wasteSquares: (totalWithWaste / 100).toFixed(2),
      iso4x4: Math.ceil(totalWithWaste / 16),
      iso4x8: Math.ceil(totalWithWaste / 32),
      board3x8: Math.ceil(totalWithWaste / 24),
      capRolls: Math.ceil(totalWithWaste / 75),
      baseRolls: Math.ceil(totalWithWaste / 96)
    };
  }, [length, width]);

  const handleReset = () => {
    setLength('');
    setWidth('');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberInput label="Length" value={length} onChange={setLength} placeholder="0.00" suffix="FT" />
        <NumberInput label="Width" value={width} onChange={setWidth} placeholder="0.00" suffix="FT" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ResultCard label="Base Area" value={results.baseSqft} unit="SQFT" subValue={`${results.baseSquares} SQ`} />
        <ResultCard label="Area (+10%)" value={results.totalWithWaste} unit="SQFT" subValue={`${results.wasteSquares} SQ`} highlight />
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1 border-b border-slate-800 pb-2 italic">
          Material Estimate
        </h3>
        <div className="grid grid-cols-1 gap-2.5">
          {[
            { label: "4' x 4' ISO Board", val: results.iso4x4 },
            { label: "4' x 8' ISO Board", val: results.iso4x8 },
            { label: "3' x 8' Board", val: results.board3x8 },
            { label: "Cap Rolls (3'x25')", val: results.capRolls },
            { label: "Base Rolls (3'x32')", val: results.baseRolls }
          ].map((item, i) => (
            <div key={i} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400 font-black text-[11px] uppercase tracking-wide">{item.label}</span>
              <span className="text-2xl font-black text-yellow-500 mono">{item.val}</span>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={handleReset}
        className="w-full bg-slate-900 text-slate-500 font-black p-5 rounded-2xl border-2 border-slate-800 hover:text-white hover:border-slate-700 transition-all active:scale-95 text-[10px] uppercase tracking-[0.2em]"
      >
        RESET ALL DATA
      </button>
    </div>
  );
};
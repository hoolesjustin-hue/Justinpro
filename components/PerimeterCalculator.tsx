
import React, { useMemo } from 'react';
import { NumberInput } from './NumberInput';
import { ResultCard } from './ResultCard';

interface Props {
  segments: string[];
  setSegments: (segs: string[]) => void;
  parapetHeight: string;
  setParapetHeight: (val: string) => void;
}

export const PerimeterCalculator: React.FC<Props> = ({ segments, setSegments, parapetHeight, setParapetHeight }) => {
  const results = useMemo(() => {
    const totalPerimeter = segments.reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
    const height = parseFloat(parapetHeight) || 0;
    
    // Wall Factor: (Height + 16 inches) / 12
    const wallFactor = (height + 16) / 12;
    const wallSqft = totalPerimeter * wallFactor;

    return {
      totalPerimeter: Math.ceil(totalPerimeter),
      wallFactor: wallFactor.toFixed(2),
      wallSqft: Math.ceil(wallSqft),
      peelStick: Math.ceil(wallSqft / 100),
      capRolls: Math.ceil(wallSqft / 75),
      ffRolls: Math.ceil(wallSqft / 85)
    };
  }, [segments, parapetHeight]);

  const updateSegment = (index: number, value: string) => {
    const newSegments = [...segments];
    newSegments[index] = value;
    setSegments(newSegments);
  };

  const addSegment = () => {
    setSegments([...segments, '']);
  };

  const handleReset = () => {
    setSegments(Array(4).fill(''));
    setParapetHeight('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 gap-4">
        <NumberInput label="Parapet Height" value={parapetHeight} onChange={setParapetHeight} placeholder="0" suffix="IN" />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1 border-b border-slate-800 pb-2 italic">
          Perimeter Segments (Linear FT)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {segments.map((val, idx) => (
            <input
              key={idx}
              type="number"
              inputMode="decimal"
              value={val}
              onChange={(e) => updateSegment(idx, e.target.value)}
              placeholder={`Seg ${idx + 1}`}
              className="bg-slate-800 border border-slate-700 text-white text-lg font-bold p-3 rounded-lg focus:border-yellow-500 focus:outline-none text-center"
            />
          ))}
          <button
            onClick={addSegment}
            className="bg-slate-800/50 border-2 border-dashed border-slate-700 text-slate-500 hover:text-yellow-500 hover:border-yellow-500 rounded-lg flex items-center justify-center transition-all active:scale-95"
            title="Add Segment"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ResultCard label="Total Perimeter" value={results.totalPerimeter} unit="FT" />
        <ResultCard label="Wall Factor" value={results.wallFactor} unit="X" />
        <ResultCard label="Wall Area" value={results.wallSqft} unit="SQFT" highlight />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1 border-b border-slate-800 pb-2 italic">
          Wall Materials
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
           <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">Peel & Stick Rolls</span>
            <span className="text-3xl font-black text-yellow-500 mono">{results.peelStick}</span>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">Cap Rolls</span>
            <span className="text-3xl font-black text-yellow-500 mono">{results.capRolls}</span>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">FF Rolls</span>
            <span className="text-3xl font-black text-yellow-500 mono">{results.ffRolls}</span>
          </div>
        </div>
      </div>

      <button 
        onClick={handleReset}
        className="w-full bg-slate-800 text-slate-400 font-bold p-4 rounded-xl border-2 border-slate-700 hover:text-white hover:border-slate-600 transition-all active:scale-95 text-xs uppercase tracking-widest"
      >
        CLEAR ALL SEGMENTS
      </button>
    </div>
  );
};

import React, { useMemo } from 'react';
import { NumberInput } from './NumberInput';
import { ResultCard } from './ResultCard';
import { AreaSegment } from '../types';

interface Props {
  segments: AreaSegment[];
  setSegments: (val: AreaSegment[]) => void;
  doubleIso: boolean;
  setDoubleIso: (val: boolean) => void;
  isoThickness: string;
  setIsoThickness: (val: string) => void;
}

export const MainAreaCalculator: React.FC<Props> = ({ 
  segments, 
  setSegments, 
  doubleIso, 
  setDoubleIso,
  isoThickness,
  setIsoThickness
}) => {
  const results = useMemo(() => {
    let baseSqft = 0;
    
    segments.forEach(seg => {
      const l = parseFloat(seg.length) || 0;
      const w = parseFloat(seg.width) || 0;
      baseSqft += l * w;
    });

    const totalWithWaste = baseSqft * 1.1;
    const isoMultiplier = doubleIso ? 2 : 1;
    
    const isoLabel = isoThickness ? `${isoThickness}" ISO Board` : 'ISO Board';

    return {
      baseSqft: Math.round(baseSqft),
      baseSquares: (baseSqft / 100).toFixed(2),
      totalWithWaste: Math.ceil(totalWithWaste),
      wasteSquares: (totalWithWaste / 100).toFixed(2),
      iso4x4: Math.ceil(totalWithWaste / 16) * isoMultiplier,
      iso4x8: Math.ceil(totalWithWaste / 32) * isoMultiplier,
      board3x8: Math.ceil(totalWithWaste / 24),
      capRolls: Math.ceil(totalWithWaste / 75),
      baseRolls: Math.ceil(totalWithWaste / 96),
      isoLabel
    };
  }, [segments, doubleIso, isoThickness]);

  const handleReset = () => {
    setSegments([{ length: '', width: '' }]);
    setDoubleIso(false);
    setIsoThickness('');
  };

  const updateSegment = (index: number, field: keyof AreaSegment, value: string) => {
    const newSegments = [...segments];
    newSegments[index] = { ...newSegments[index], [field]: value };
    setSegments(newSegments);
  };

  const addSegment = () => {
    setSegments([...segments, { length: '', width: '' }]);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="space-y-6">
        {segments.map((segment, index) => (
          <div key={index} className="relative">
            {segments.length > 1 && (
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 italic">Section {index + 1}</h4>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NumberInput 
                label="Length" 
                value={segment.length} 
                onChange={(val) => updateSegment(index, 'length', val)} 
                placeholder="0.00" 
                suffix="FT" 
              />
              <NumberInput 
                label="Width" 
                value={segment.width} 
                onChange={(val) => updateSegment(index, 'width', val)} 
                placeholder="0.00" 
                suffix="FT" 
              />
            </div>
          </div>
        ))}
        
        <button
          onClick={addSegment}
          className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-700 text-slate-500 font-black uppercase tracking-widest hover:border-yellow-500 hover:text-yellow-500 transition-all active:scale-95 text-xs flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
          Add Another Section
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ResultCard label="Base Area" value={results.baseSqft} unit="SQFT" subValue={`${results.baseSquares} SQ`} />
        <ResultCard label="Area (+10%)" value={results.totalWithWaste} unit="SQFT" subValue={`${results.wasteSquares} SQ`} highlight />
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 px-1 border-b border-slate-800 pb-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">
              Material Estimate
            </h3>
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${doubleIso ? 'bg-yellow-500 border-yellow-500' : 'border-slate-600 group-hover:border-slate-400'}`}>
                {doubleIso && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-slate-950" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <input 
                type="checkbox" 
                checked={doubleIso} 
                onChange={(e) => setDoubleIso(e.target.checked)} 
                className="hidden"
              />
              <span className={`text-[9px] font-black uppercase tracking-wider transition-colors ${doubleIso ? 'text-yellow-500' : 'text-slate-500 group-hover:text-slate-400'}`}>
                Double ISO
              </span>
            </label>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-900/50 p-2 rounded-xl border border-slate-800/50">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider whitespace-nowrap pl-1">ISO Thickness:</span>
            <input 
              type="text" 
              inputMode="decimal"
              value={isoThickness}
              onChange={(e) => setIsoThickness(e.target.value)}
              placeholder="0.0"
              className="bg-transparent text-white font-bold text-sm w-full focus:outline-none placeholder:text-slate-700"
            />
            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider pr-1">IN</span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2.5">
          {[
            { label: `4' x 4' ${results.isoLabel}`, val: results.iso4x4 },
            { label: `4' x 8' ${results.isoLabel}`, val: results.iso4x8 },
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
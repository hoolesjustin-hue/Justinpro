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
  duotackLayers: string;
  setDuotackLayers: (val: string) => void;
  customProductName: string;
  setCustomProductName: (val: string) => void;
  customProductWidth: string;
  setCustomProductWidth: (val: string) => void;
  customProductLength: string;
  setCustomProductLength: (val: string) => void;
}

export const MainAreaCalculator: React.FC<Props> = ({ 
  segments, 
  setSegments, 
  doubleIso, 
  setDoubleIso,
  isoThickness,
  setIsoThickness,
  duotackLayers,
  setDuotackLayers,
  customProductName,
  setCustomProductName,
  customProductWidth,
  setCustomProductWidth,
  customProductLength,
  setCustomProductLength
}) => {
  const results = useMemo(() => {
    let baseSqft = 0;
    let sopralapFeet = 0;
    
    segments.forEach(seg => {
      const l = parseFloat(seg.length) || 0;
      const w = parseFloat(seg.width) || 0;
      baseSqft += l * w;

      if (l > 0 && w > 0) {
        const runs = Math.max(0, Math.floor((l - 0.001) / 8));
        sopralapFeet += runs * w;
      }
    });

    const totalWithWaste = baseSqft * 1.1;
    const isoMultiplier = doubleIso ? 2 : 1;
    
    const isoLabel = isoThickness ? `${isoThickness}" ISO Board` : 'ISO Board';
    
    const layers = parseFloat(duotackLayers) || 0;
    const duotackBoxes = Math.ceil((totalWithWaste * layers) / 480);

    const customW = parseFloat(customProductWidth) || 0;
    const customL = parseFloat(customProductLength) || 0;
    const customCoverage = customW * customL;
    const customUnits = customCoverage > 0 ? Math.ceil(totalWithWaste / customCoverage) : 0;

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
      sopraVaporRolls: Math.ceil(totalWithWaste / 469),
      sopralapRolls: Math.ceil(sopralapFeet / 33),
      duotackBoxes,
      customUnits,
      isoLabel
    };
  }, [segments, doubleIso, isoThickness, duotackLayers, customProductWidth, customProductLength]);

  const handleReset = () => {
    setSegments([{ length: '', width: '' }]);
    setDoubleIso(false);
    setIsoThickness('');
    setDuotackLayers('2');
    setCustomProductName('');
    setCustomProductWidth('');
    setCustomProductLength('');
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
                onChange={(e) => {
                  const checked = e.target.checked;
                  setDoubleIso(checked);
                  setDuotackLayers(checked ? '3' : '2');
                }} 
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

          {/* Custom Material Input */}
          <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-800/50 flex flex-col gap-3">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider pl-1">Custom Material (Area)</span>
            <input 
              type="text" 
              value={customProductName}
              onChange={(e) => setCustomProductName(e.target.value)}
              placeholder="Product Name (e.g. DensDeck)"
              className="bg-slate-950 border border-slate-800 text-white px-3 py-2 rounded-xl text-sm w-full focus:outline-none focus:border-yellow-500"
            />
            <div className="flex gap-2">
              <div className="flex-1 flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 focus-within:border-yellow-500">
                <input 
                  type="text" 
                  inputMode="decimal"
                  value={customProductWidth}
                  onChange={(e) => setCustomProductWidth(e.target.value)}
                  placeholder="Width"
                  className="bg-transparent text-white w-full focus:outline-none text-sm"
                />
                <span className="text-[10px] text-slate-600 font-bold">FT</span>
              </div>
              <div className="flex-1 flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 focus-within:border-yellow-500">
                <input 
                  type="text" 
                  inputMode="decimal"
                  value={customProductLength}
                  onChange={(e) => setCustomProductLength(e.target.value)}
                  placeholder="Length"
                  className="bg-transparent text-white w-full focus:outline-none text-sm"
                />
                <span className="text-[10px] text-slate-600 font-bold">FT</span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2.5">
          {[
            { label: `4' x 4' ${results.isoLabel}`, val: results.iso4x4 },
            { label: `4' x 8' ${results.isoLabel}`, val: results.iso4x8 },
            { label: "3' x 8' Board", val: results.board3x8 },
            { label: "Sopra Vapor Rolls (3.5'x134')", val: results.sopraVaporRolls },
            { label: "Cap Rolls (3'x25')", val: results.capRolls },
            { label: "Base Rolls (3'x32')", val: results.baseRolls },
            { label: "Sopralap Rolls (33')", val: results.sopralapRolls }
          ].map((item, i) => (
            <div key={i} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400 font-black text-[11px] uppercase tracking-wide">{item.label}</span>
              <span className="text-2xl font-black text-yellow-500 mono">{item.val}</span>
            </div>
          ))}
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
            <div className="flex flex-col gap-1.5">
              <span className="text-slate-400 font-black text-[11px] uppercase tracking-wide">Duotack 365 (Boxes)</span>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Layers:</span>
                <input 
                  type="number" 
                  inputMode="numeric"
                  value={duotackLayers}
                  onChange={(e) => setDuotackLayers(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-white px-2 py-0.5 rounded-md text-xs w-16 focus:outline-none focus:border-yellow-500 font-mono"
                />
              </div>
            </div>
            <span className="text-2xl font-black text-yellow-500 mono">{results.duotackBoxes}</span>
          </div>
          {results.customUnits > 0 && (
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-400 font-black text-[11px] uppercase tracking-wide">
                {customProductName || 'Custom Material'} ({customProductWidth}'x{customProductLength}')
              </span>
              <span className="text-2xl font-black text-yellow-500 mono">{results.customUnits}</span>
            </div>
          )}
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

import React, { useMemo, useState, useEffect } from 'react';

interface Props {
  areaLength: string;
  areaWidth: string;
  perimeterSegments: string[];
  parapetHeight: string;
}

interface ListItem {
  id: string;
  name: string;
  count: number;
  selected: boolean;
  isCustom?: boolean;
}

export const MaterialList: React.FC<Props> = ({ 
  areaLength, 
  areaWidth, 
  perimeterSegments, 
  parapetHeight 
}) => {
  const [email, setEmail] = useState<string>(() => localStorage.getItem('roof_pro_saved_email') || '');
  const [customMaterials, setCustomMaterials] = useState<ListItem[]>(() => {
    const saved = localStorage.getItem('roof_pro_custom_materials');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Track which calculated items are unselected (opt-out logic)
  const [unselectedIds, setUnselectedIds] = useState<Set<string>>(new Set());

  // Input state for new custom material
  const [newName, setNewName] = useState('');
  const [newCount, setNewCount] = useState('');

  useEffect(() => {
    localStorage.setItem('roof_pro_saved_email', email);
  }, [email]);

  useEffect(() => {
    localStorage.setItem('roof_pro_custom_materials', JSON.stringify(customMaterials));
  }, [customMaterials]);

  const materials = useMemo(() => {
    // Area calcs
    const al = parseFloat(areaLength) || 0;
    const aw = parseFloat(areaWidth) || 0;
    const baseSqft = al * aw;
    const areaTotalWithWaste = Math.ceil(baseSqft * 1.1);

    // Perimeter calcs
    const totalPerimeter = perimeterSegments.reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
    const height = parseFloat(parapetHeight) || 0;
    const wallFactor = (height + 16) / 12;
    const wallSqft = Math.ceil(totalPerimeter * wallFactor);

    // Base calculated items
    const baseList: ListItem[] = [
      { id: 'iso44', name: "4' x 4' ISO Board", count: Math.ceil(areaTotalWithWaste / 16), selected: !unselectedIds.has('iso44') },
      { id: 'iso48', name: "4' x 8' ISO Board", count: Math.ceil(areaTotalWithWaste / 32), selected: !unselectedIds.has('iso48') },
      { id: 'board38', name: "3' x 8' Board", count: Math.ceil(areaTotalWithWaste / 24), selected: !unselectedIds.has('board38') },
      { id: 'caparea', name: "Cap Rolls (Main Area)", count: Math.ceil(areaTotalWithWaste / 75), selected: !unselectedIds.has('caparea') },
      { id: 'basearea', name: "Base Rolls (Main Area)", count: Math.ceil(areaTotalWithWaste / 96), selected: !unselectedIds.has('basearea') },
      { id: 'pswall', name: "Peel & Stick Rolls (Wall)", count: Math.ceil(wallSqft / 100), selected: !unselectedIds.has('pswall') },
      { id: 'capwall', name: "Cap Rolls (Wall)", count: Math.ceil(wallSqft / 75), selected: !unselectedIds.has('capwall') },
      { id: 'ffwall', name: "FF Rolls (Wall)", count: Math.ceil(wallSqft / 85), selected: !unselectedIds.has('ffwall') }
    ].filter(item => item.count > 0);

    return {
      summary: {
        mainAreaSqft: areaTotalWithWaste,
        wallAreaSqft: wallSqft,
        totalPerimeter: Math.ceil(totalPerimeter)
      },
      calculatedItems: baseList,
      allDisplayItems: [...baseList, ...customMaterials]
    };
  }, [areaLength, areaWidth, perimeterSegments, parapetHeight, unselectedIds, customMaterials]);

  const toggleSelection = (id: string, isCustom?: boolean) => {
    if (isCustom) {
      setCustomMaterials(prev => prev.map(item => 
        item.id === id ? { ...item, selected: !item.selected } : item
      ));
    } else {
      setUnselectedIds(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    }
  };

  const addCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCount) return;
    
    const newItem: ListItem = {
      id: `custom-${Date.now()}`,
      name: newName,
      count: parseInt(newCount) || 1,
      selected: true,
      isCustom: true
    };

    setCustomMaterials(prev => [...prev, newItem]);
    setNewName('');
    setNewCount('');
  };

  const removeCustomItem = (id: string) => {
    setCustomMaterials(prev => prev.filter(item => item.id !== id));
  };

  const handleSendEmail = () => {
    const selectedItems = materials.allDisplayItems.filter(item => item.selected);
    if (selectedItems.length === 0) {
      alert("Please select at least one item to export.");
      return;
    }
    if (!email) {
      alert("Please enter a destination email address first.");
      return;
    }

    const date = new Date().toLocaleDateString();
    const subject = `Roof Material List - ${date}`;
    
    let body = `Material List Exported from JustinRoofPRO\n`;
    body += `Date: ${date}\n\n`;
    body += `--- PROJECT DETAILS ---\n`;
    body += `Main Area: ${materials.summary.mainAreaSqft} SQFT (+10%)\n`;
    body += `Wall Area: ${materials.summary.wallAreaSqft} SQFT\n`;
    body += `Total Perimeter: ${materials.summary.totalPerimeter} FT\n\n`;
    body += `--- MATERIALS ORDERED ---\n`;
    selectedItems.forEach(item => {
      body += `- [X] ${item.name}: ${item.count}\n`;
    });
    body += `\nSent via JustinRoofPRO Field Tool`;

    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Configuration Section */}
      <div className="bg-slate-900 border border-slate-700 p-5 rounded-3xl space-y-4 shadow-xl">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Saved Export Email</label>
        <div className="relative">
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="orders@company.com"
            className="w-full bg-slate-800 border-2 border-slate-700 text-white p-4 rounded-2xl focus:border-yellow-500 focus:outline-none transition-all font-bold"
          />
        </div>
      </div>

      {/* Checklist Section */}
      <div className="bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-800/50 space-y-6">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Checklist</h3>
          <span className="bg-yellow-500 text-slate-950 text-[10px] font-black px-2 py-1 rounded italic">
            {materials.allDisplayItems.filter(i => i.selected).length} SELECTED
          </span>
        </div>

        {materials.allDisplayItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">List is empty</p>
          </div>
        ) : (
          <div className="space-y-3">
            {materials.allDisplayItems.map((item) => (
              <div 
                key={item.id} 
                onClick={() => toggleSelection(item.id, item.isCustom)}
                className={`flex justify-between items-center p-4 rounded-2xl border transition-all cursor-pointer select-none active:scale-[0.98] ${
                  item.selected 
                  ? 'bg-slate-800/80 border-yellow-500/50 shadow-lg shadow-yellow-500/5' 
                  : 'bg-slate-950/20 border-slate-800 opacity-40 grayscale'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-all ${
                    item.selected ? 'bg-yellow-500 border-yellow-500' : 'bg-transparent border-slate-700'
                  }`}>
                    {item.selected && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-950" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-slate-200 font-bold text-[11px] uppercase tracking-tight">{item.name}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-xl font-black text-yellow-500 mono">{item.count}</span>
                  {item.isCustom && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeCustomItem(item.id); }}
                      className="p-2 text-slate-600 hover:text-red-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Custom Item Form */}
        <form onSubmit={addCustomItem} className="mt-8 pt-6 border-t border-slate-800 space-y-4">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 italic">Add Custom Item</h4>
          <div className="flex gap-2">
            <input 
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Item Name (e.g. Nails)"
              className="flex-grow bg-slate-800/50 border border-slate-700 text-white p-3 rounded-xl focus:border-yellow-500 focus:outline-none text-xs font-bold"
            />
            <input 
              type="number"
              value={newCount}
              onChange={(e) => setNewCount(e.target.value)}
              placeholder="Qty"
              className="w-20 bg-slate-800/50 border border-slate-700 text-white p-3 rounded-xl focus:border-yellow-500 focus:outline-none text-center text-xs font-bold mono"
            />
            <button 
              type="submit"
              className="bg-slate-700 text-yellow-500 p-3 rounded-xl hover:bg-slate-600 active:scale-95 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </form>

        <button 
          onClick={handleSendEmail}
          disabled={materials.allDisplayItems.filter(i => i.selected).length === 0}
          className={`w-full py-5 rounded-2xl font-black uppercase tracking-tighter flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl mt-4 ${
            materials.allDisplayItems.filter(i => i.selected).length === 0 
            ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700' 
            : 'bg-yellow-500 text-slate-950 shadow-yellow-500/10'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          SEND SELECTED ITEMS
        </button>
      </div>
    </div>
  );
};

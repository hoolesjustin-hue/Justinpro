import React, { useState, useEffect } from 'react';
import { CalculatorTab, AreaSegment } from './types';
import { MainAreaCalculator } from './components/MainAreaCalculator';
import { PerimeterCalculator } from './components/PerimeterCalculator';
import { MaterialList } from './components/MaterialList';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CalculatorTab>(CalculatorTab.MAIN_AREA);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  
  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Lifted state for calculators
  const [areaSegments, setAreaSegments] = useState<AreaSegment[]>([{ length: '', width: '' }]);
  const [perimeterSegments, setPerimeterSegments] = useState<string[]>(Array(4).fill(''));
  const [parapetHeight, setParapetHeight] = useState<string>('');
  const [doubleIso, setDoubleIso] = useState<boolean>(false);
  const [isoThickness, setIsoThickness] = useState<string>('');

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    });

    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      triggerToast('App Installed Successfully!');
    });
  }, []);

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      // If no prompt (like on iOS), show the guide
      setShowGuide(true);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Justin's Professional Roofing",
          text: 'Field material calculator for roofing professionals.',
          url: window.location.href,
        });
      } else {
        throw new Error('Share not supported');
      }
    } catch (err) {
      await navigator.clipboard.writeText(window.location.href);
      triggerToast('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-yellow-500 selection:text-slate-950">
      {/* Toast Notification */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] transition-all duration-300 transform ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
        <div className="bg-yellow-500 text-slate-950 px-6 py-3 rounded-2xl font-black uppercase text-sm shadow-2xl flex items-center gap-3 border-2 border-yellow-400 whitespace-nowrap">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          {toastMessage}
        </div>
      </div>

      {/* Installation Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/98 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-slate-900 border-2 border-slate-700 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl space-y-6 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-black uppercase italic tracking-tighter">Install <span className="text-yellow-500">App</span></h2>
              <button onClick={() => setShowGuide(false)} className="text-slate-500 hover:text-white p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-slate-800/50 rounded-3xl border border-yellow-500/20 space-y-4">
                <h3 className="text-white font-black uppercase tracking-widest italic text-xs flex items-center gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Setup as a Field App
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">
                  On iOS/Safari, tap the share icon and then "Add to Home Screen". On Android, use the button below or your browser menu.
                </p>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <span className="bg-yellow-500 text-slate-950 w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] shrink-0">1</span>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-200 uppercase">iOS / Safari</p>
                      <p className="text-[11px] text-slate-500 font-medium">Tap 'Share' then 'Add to Home Screen'</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="bg-yellow-500 text-slate-950 w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] shrink-0">2</span>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-200 uppercase">Android / Chrome</p>
                      <p className="text-[11px] text-slate-500 font-medium">Tap the 'Install' button or 'Add to Home Screen' in menu.</p>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowGuide(false)}
                className="w-full bg-yellow-500 text-slate-950 font-black py-4 rounded-2xl uppercase tracking-tighter shadow-lg shadow-yellow-500/20 active:scale-95 transition-all text-sm italic"
              >
                GOT IT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 shadow-2xl px-4 pt-4 pb-6">
        <div className="max-w-xl mx-auto flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-xl shadow-yellow-500/20 shrink-0">
                <span className="text-slate-950 font-black text-3xl leading-none italic">J</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-[1.1rem] font-black tracking-tighter uppercase italic leading-none flex flex-col sm:flex-row sm:gap-1.5 sm:items-center text-slate-100">
                  <span>Justin's</span>
                  <span className="text-yellow-500">SBS Roofing Calculator</span>
                </h1>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1 ml-0.5 italic">Field Tool v5.4 By Justin Hooles</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={handleInstallClick}
                className={`p-3 rounded-2xl border transition-all active:scale-90 group ${
                  deferredPrompt 
                  ? 'bg-yellow-500 text-slate-950 border-yellow-400 shadow-lg shadow-yellow-500/20' 
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
                title="Install App"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </button>
              <button 
                onClick={handleShare}
                className="p-3 bg-yellow-500 text-slate-950 rounded-2xl shadow-lg active:scale-90 transition-all font-black"
                title="Share & Save"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
          </div>

          <nav className="flex bg-slate-900 p-1.5 rounded-3xl border border-slate-800 shadow-inner overflow-hidden">
            <button 
              onClick={() => setActiveTab(CalculatorTab.MAIN_AREA)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-2xl text-[9px] font-black tracking-widest transition-all duration-300 ${
                activeTab === CalculatorTab.MAIN_AREA 
                  ? 'bg-yellow-500 text-slate-950 shadow-xl scale-[1.02]' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              AREA
            </button>
            <button 
              onClick={() => setActiveTab(CalculatorTab.PERIMETER)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-2xl text-[9px] font-black tracking-widest transition-all duration-300 ${
                activeTab === CalculatorTab.PERIMETER 
                  ? 'bg-yellow-500 text-slate-950 shadow-xl scale-[1.02]' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              WALL
            </button>
            <button 
              onClick={() => setActiveTab(CalculatorTab.MATERIAL_LIST)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-2xl text-[9px] font-black tracking-widest transition-all duration-300 ${
                activeTab === CalculatorTab.MATERIAL_LIST 
                  ? 'bg-yellow-500 text-slate-950 shadow-xl scale-[1.02]' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              EXPORT
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-xl mx-auto px-4 pt-4">
        <div className="bg-slate-900/40 p-1 rounded-[3rem] border border-slate-800 shadow-2xl">
          <div className="bg-slate-950/60 p-6 rounded-[2.8rem] border border-slate-800 min-h-[500px]">
            {activeTab === CalculatorTab.MAIN_AREA && (
              <MainAreaCalculator 
                segments={areaSegments} 
                setSegments={setAreaSegments}
                doubleIso={doubleIso}
                setDoubleIso={setDoubleIso}
                isoThickness={isoThickness}
                setIsoThickness={setIsoThickness}
              />
            )}
            {activeTab === CalculatorTab.PERIMETER && (
              <PerimeterCalculator 
                segments={perimeterSegments} 
                setSegments={setPerimeterSegments} 
                parapetHeight={parapetHeight} 
                setParapetHeight={setParapetHeight} 
              />
            )}
            {activeTab === CalculatorTab.MATERIAL_LIST && (
              <MaterialList 
                areaSegments={areaSegments}
                perimeterSegments={perimeterSegments}
                parapetHeight={parapetHeight}
                doubleIso={doubleIso}
                isoThickness={isoThickness}
              />
            )}
          </div>
        </div>
      </main>

      {/* Sticky Footer Status */}
      <footer className="mt-12 px-8 pb-16 text-center">
        <div className="inline-flex items-center gap-4 bg-slate-900/50 px-6 py-3 rounded-full border border-slate-800 backdrop-blur-md">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">System Active</span>
          </div>
          <div className="w-px h-3 bg-slate-800"></div>
          <button 
            onClick={handleInstallClick}
            className="text-[10px] text-yellow-500/80 font-black uppercase tracking-widest hover:text-yellow-400"
          >
            {deferredPrompt ? 'Install App' : 'App Guide'}
          </button>
        </div>
        <p className="mt-6 text-[9px] text-slate-700 font-black uppercase tracking-[0.4em]">
          Justin's Professional Roofing Field Tool
        </p>
      </footer>
    </div>
  );
};

export default App;
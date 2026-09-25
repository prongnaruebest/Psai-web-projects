import React from 'react';
import { Volume2, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export default function ChordDiagram({ chord, onStrum }) {
  if (!chord) return null;

  const handleStrum = () => {
    soundEngine.playChord(chord.freqs, 'down');
    if (onStrum) onStrum(chord.name);
  };

  const handlePluckString = (stringIndex) => {
    const freq = chord.freqs[stringIndex];
    if (freq > 0) {
      soundEngine.playPluck(freq, 1.5, 'acoustic');
    }
  };

  // 6 strings: Index 0=String 6(E), 1=5(A), 2=4(D), 3=3(G), 4=2(B), 5=1(e)
  const strings = [6, 5, 4, 3, 2, 1];
  const frets = [1, 2, 3, 4];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col items-center shadow-lg">
      {/* Chord Header */}
      <div className="flex items-center justify-between w-full mb-2">
        <div>
          <span className="text-2xl font-black text-amber-400 font-mono tracking-tight">{chord.name}</span>
          <span className="text-xs text-slate-400 block">{chord.fullName}</span>
        </div>
        <button
          onClick={handleStrum}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition active:scale-95 cursor-pointer"
          title="ดีดคอร์ดนี้เพื่อฟังเสียง"
        >
          <Volume2 className="w-4 h-4" />
          <span>ดีดฟังเสียง</span>
        </button>
      </div>

      {/* Interactive Fretboard Visualizer */}
      <div className="relative py-2 px-4 select-none">
        {/* Top Status Indicators (X = Mute, O = Open) */}
        <div className="grid grid-cols-6 gap-5 mb-1.5 text-center font-mono text-xs font-bold">
          {chord.frets.map((fretVal, idx) => (
            <div 
              key={idx} 
              className={fretVal === -1 ? 'text-red-400' : fretVal === 0 ? 'text-emerald-400' : 'text-slate-600'}
            >
              {fretVal === -1 ? '✕' : fretVal === 0 ? '○' : ''}
            </div>
          ))}
        </div>

        {/* Nut (The thick bar at fret 0) */}
        <div className="w-full h-2 bg-amber-200/80 rounded-t-sm mb-0.5 shadow-sm" />

        {/* Fret Grid */}
        <div className="relative border-b-2 border-slate-600 bg-slate-950/60 rounded-b-sm">
          {frets.map((fretNum) => (
            <div 
              key={fretNum} 
              className="relative h-10 border-b border-slate-600/70 grid grid-cols-6 gap-5 items-center px-1"
            >
              {/* Fret number label */}
              <span className="absolute -left-5 text-[10px] text-slate-500 font-mono">
                {fretNum}
              </span>

              {/* Strings and Finger Placement Dots */}
              {chord.frets.map((fretVal, strIdx) => {
                const isPressedHere = fretVal === fretNum;
                const fingerNum = chord.fingers[strIdx];

                return (
                  <div 
                    key={strIdx} 
                    onClick={() => handlePluckString(strIdx)}
                    className="relative flex items-center justify-center h-full group/str cursor-pointer"
                    title={`สายที่ ${6 - strIdx} (คลิกเพื่อฟัง)`}
                  >
                    {/* Vertical string line with realistic gauge thickness */}
                    <div 
                      className={`absolute top-0 bottom-0 bg-slate-400 group-hover/str:bg-amber-400 transition-colors ${
                        strIdx === 0 ? 'w-[3px]' :
                        strIdx === 1 ? 'w-[2.5px]' :
                        strIdx === 2 ? 'w-[2px]' :
                        strIdx === 3 ? 'w-[1.5px]' :
                        strIdx === 4 ? 'w-[1.2px]' : 'w-[1px]'
                      }`} 
                    />

                    {/* Finger Placement Circle */}
                    {isPressedHere && (
                      <div className="z-10 w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.6)] animate-pulse">
                        {fingerNum > 0 ? fingerNum : '•'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* String Names at Bottom */}
        <div className="grid grid-cols-6 gap-5 mt-2 text-center font-mono text-[11px] text-slate-400">
          <span>6(E)</span>
          <span>5(A)</span>
          <span>4(D)</span>
          <span>3(G)</span>
          <span>2(B)</span>
          <span>1(e)</span>
        </div>
      </div>

      {/* Chord Tips & Finger Guide */}
      <div className="w-full mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-300 flex items-start gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
        <p className="line-clamp-2">{chord.tips}</p>
      </div>
    </div>
  );
}

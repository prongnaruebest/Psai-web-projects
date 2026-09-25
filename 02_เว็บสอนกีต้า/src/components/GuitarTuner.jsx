import React, { useState } from 'react';
import { Radio, Volume2, Check } from 'lucide-react';
import { soundEngine, GUITAR_TUNER_NOTES } from '../utils/audio';

export default function GuitarTuner() {
  const [activeString, setActiveString] = useState(null);

  const handleTune = (noteObj) => {
    setActiveString(noteObj.string);
    soundEngine.playPluck(noteObj.freq, 2.5, 'acoustic');
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-teal-400" />
          <h3 className="font-bold text-white text-base">เครื่องตั้งสายมาตรฐาน (Standard Tuner E-A-D-G-B-E)</h3>
        </div>
        <span className="text-xs text-slate-400">440 Hz Standard Pitch</span>
      </div>

      <p className="text-xs text-slate-300 mb-4">
        คลิกที่สายแต่ละเส้นเพื่อฟังเสียงอ้างอิง แล้วบิดลูกบิดกีตาร์ของคุณให้เสียงตรงกัน
      </p>

      {/* 6 Guitar Tuning Pegs/Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
        {GUITAR_TUNER_NOTES.map((n) => {
          const isSelected = activeString === n.string;
          return (
            <button
              key={n.string}
              onClick={() => handleTune(n)}
              className={`flex flex-col items-center p-3 rounded-xl border transition-all active:scale-95 cursor-pointer ${
                isSelected
                  ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.3)]'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <span className="text-xs font-medium text-slate-400">สาย {n.string}</span>
              <span className="text-2xl font-black font-mono my-1">{n.note}</span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Volume2 className="w-3 h-3" />
                {n.freq.toFixed(1)} Hz
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

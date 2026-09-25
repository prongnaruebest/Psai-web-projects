import React, { useState } from 'react';
import { CHORDS_DATA } from '../data/chords';
import ChordDiagram from './ChordDiagram';

export default function ChordLibraryView() {
  const [filter, setFilter] = useState('all');
  const chordList = Object.values(CHORDS_DATA);

  const filteredChords = chordList.filter((c) => {
    if (filter === 'all') return true;
    return c.category === filter;
  });

  return (
    <div className="space-y-6">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h3 className="font-bold text-white text-base">คลังคอร์ดกีตาร์มาตรฐาน (Guitar Chord Library)</h3>
          <p className="text-xs text-slate-400">คลิกที่สายเพื่อฟังโน้ตทีละสาย หรือกดดีดทั้งคอร์ด</p>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            ทั้งหมด ({chordList.length})
          </button>
          <button
            onClick={() => setFilter('beginner')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === 'beginner' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            มือใหม่ (Open)
          </button>
          <button
            onClick={() => setFilter('intermediate')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === 'intermediate' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            ระดับกลาง (Barre)
          </button>
          <button
            onClick={() => setFilter('advanced')}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === 'advanced' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            ระดับสูง (7th/Jazz)
          </button>
        </div>
      </div>

      {/* Grid of Chord Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredChords.map((chord) => (
          <ChordDiagram key={chord.name} chord={chord} />
        ))}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Music, Play, Pause, Award, CheckCircle, Sparkles, Volume2 } from 'lucide-react';
import { SONGS_DATA } from '../data/songs';
import { CHORDS_DATA } from '../data/chords';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

export default function SongPlayer({ onAddExp, onPracticeStateChange }) {
  const [selectedSong, setSelectedSong] = useState(SONGS_DATA[0]);
  const [activeChordIndex, setActiveChordIndex] = useState(null);
  const [isPlayingProgression, setIsPlayingProgression] = useState(false);
  const [completedSongs, setCompletedSongs] = useState({});

  useEffect(() => {
    let interval = null;
    if (isPlayingProgression) {
      if (onPracticeStateChange) onPracticeStateChange(true);
      let idx = 0;
      const chords = selectedSong.chords;

      // Play first chord immediately
      playChordByName(chords[0]);
      setActiveChordIndex(0);

      const intervalMs = (60 / selectedSong.bpm) * 4 * 1000; // 4 beats per chord bar

      interval = setInterval(() => {
        idx = (idx + 1) % chords.length;
        setActiveChordIndex(idx);
        playChordByName(chords[idx]);
      }, intervalMs);
    } else {
      if (onPracticeStateChange) onPracticeStateChange(false);
      setActiveChordIndex(null);
    }
    return () => clearInterval(interval);
  }, [isPlayingProgression, selectedSong]);

  const playChordByName = (chordName) => {
    const chord = CHORDS_DATA[chordName];
    if (chord) {
      soundEngine.playChord(chord.freqs, 'down');
    }
  };

  const handleToggleAutoPlay = () => {
    soundEngine.init();
    setIsPlayingProgression(!isPlayingProgression);
  };

  const handleCompleteSong = () => {
    if (!completedSongs[selectedSong.id]) {
      setCompletedSongs((prev) => ({ ...prev, [selectedSong.id]: true }));
      soundEngine.playLevelUpFanfare();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      if (onAddExp) {
        onAddExp(selectedSong.expReward, `เล่นจบเพลง ${selectedSong.title}!`);
      }
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header & Song Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Music className="w-5 h-5 text-amber-400" />
            คลังเพลงฝึกซ้อม (Easy Songs Repertoire)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            รวมเพลงง่ายๆ สำหรับฝึกตีคอร์ด ร้องเพลง และสร้างความสนุก
          </p>
        </div>

        {/* Song Select Dropdown / Chips */}
        <div className="flex flex-wrap gap-2">
          {SONGS_DATA.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedSong(s);
                setIsPlayingProgression(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition active:scale-95 cursor-pointer ${
                selectedSong.id === s.id
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Song Details Hero */}
      <div className="rounded-xl bg-slate-950 border border-slate-800 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-2xl font-black text-white">{selectedSong.title}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {selectedSong.artist}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              {selectedSong.difficulty}
            </span>
          </div>
          <p className="text-xs text-slate-300">{selectedSong.description}</p>
        </div>

        {/* Song Metadata Chips */}
        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">CAPO</span>
            <span className="font-bold text-slate-200">{selectedSong.capo}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">TEMPO</span>
            <span className="font-bold text-amber-400">{selectedSong.bpm} BPM</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">EXP REWARD</span>
            <span className="font-bold text-emerald-400">+{selectedSong.expReward} EXP</span>
          </div>
        </div>
      </div>

      {/* Strumming Pattern Banner */}
      <div className="rounded-xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 border border-amber-500/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold text-amber-400 tracking-wider uppercase block">
            แพทเทิร์นการดีดคอร์ด (Strumming Pattern)
          </span>
          <span className="text-lg font-mono font-bold text-white tracking-widest">
            {selectedSong.strummingPattern}
          </span>
        </div>

        <button
          onClick={handleToggleAutoPlay}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer ${
            isPlayingProgression
              ? 'bg-rose-500 hover:bg-rose-600 text-white'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
          }`}
        >
          {isPlayingProgression ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isPlayingProgression ? 'หยุดดีดอัตโนมัติ' : 'ดีดตามจังหวะอัตโนมัติ'}</span>
        </button>
      </div>

      {/* Song Chords Buttons */}
      <div>
        <span className="text-xs font-semibold text-slate-400 mb-2 block">
          คอร์ดที่ใช้ในเพลงนี้ (คลิกเพื่อฟังเสียง):
        </span>
        <div className="flex flex-wrap gap-3">
          {selectedSong.chords.map((chordName, i) => {
            const isActive = activeChordIndex === i;
            return (
              <button
                key={chordName}
                onClick={() => playChordByName(chordName)}
                className={`px-5 py-3 rounded-xl font-mono text-lg font-black transition cursor-pointer flex items-center gap-2 border ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.6)] scale-105'
                    : 'bg-slate-950 text-slate-200 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <span>{chordName}</span>
                <Volume2 className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-500'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Lyrics & Chords Section */}
      <div className="space-y-4">
        {selectedSong.sections.map((sec, secIdx) => (
          <div key={secIdx} className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4">
            <span className="text-xs font-bold text-amber-400/90 uppercase tracking-wider block mb-3">
              [{sec.name}]
            </span>
            <div className="space-y-3 font-mono">
              {sec.lines.map((line, lIdx) => (
                <div key={lIdx} className="group">
                  <div className="text-amber-400 font-bold text-sm h-5">{line.chord}</div>
                  <div className="text-slate-200 text-base">{line.lyric}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Mark Completed Button */}
      <div className="flex items-center justify-end pt-2">
        <button
          onClick={handleCompleteSong}
          disabled={completedSongs[selectedSong.id]}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
            completedSongs[selectedSong.id]
              ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-400 cursor-default'
              : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 active:scale-95'
          }`}
        >
          {completedSongs[selectedSong.id] ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>สำเร็จเพลงนี้แล้ว (+{selectedSong.expReward} EXP)</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>ฝึกเพลงนี้คล่องแล้ว (รับ EXP)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

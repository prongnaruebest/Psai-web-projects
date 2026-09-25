import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Volume2, 
  VolumeX, 
  Trophy, 
  Sparkles, 
  Calendar, 
  BookOpen, 
  Music, 
  Radio, 
  Grid,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';

import AvatarCharacter, { getEvolutionStage, EVOLUTION_STAGES } from './components/AvatarCharacter';
import PracticeRoutine from './components/PracticeRoutine';
import RoadmapView from './components/RoadmapView';
import SongPlayer from './components/SongPlayer';
import ChordLibraryView from './components/ChordLibraryView';
import GuitarTuner from './components/GuitarTuner';
import { soundEngine } from './utils/audio';
import confetti from 'canvas-confetti';

const EXP_PER_LEVEL = 350;

export default function App() {
  // Gamification States (loaded from localStorage)
  const [exp, setExp] = useState(() => {
    const saved = localStorage.getItem('gq_exp');
    return saved ? parseInt(saved, 10) : 150;
  });

  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('gq_streak');
    return saved ? parseInt(saved, 10) : 3;
  });

  const [completedLessons, setCompletedLessons] = useState(() => {
    const saved = localStorage.getItem('gq_lessons');
    return saved ? JSON.parse(saved) : { 'lesson-1': true };
  });

  const [activeTab, setActiveTab] = useState('routine'); // 'routine', 'roadmap', 'songs', 'chords', 'tuner'
  const [isPlayingAvatar, setIsPlayingAvatar] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [notification, setNotification] = useState(null);

  // Derived Level and Evolution Stage
  const level = Math.max(1, Math.min(100, Math.floor(exp / EXP_PER_LEVEL) + 1));
  const currentExpInLevel = exp % EXP_PER_LEVEL;
  const expProgressPercent = Math.min(100, (currentExpInLevel / EXP_PER_LEVEL) * 100);
  const currentStage = getEvolutionStage(level);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('gq_exp', exp.toString());
  }, [exp]);

  useEffect(() => {
    localStorage.setItem('gq_streak', streak.toString());
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('gq_lessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleAddExp = (amount, reason = '') => {
    const prevLevel = level;
    const newExp = exp + amount;
    const newLevel = Math.max(1, Math.min(100, Math.floor(newExp / EXP_PER_LEVEL) + 1));

    setExp(newExp);
    soundEngine.playExpSound();

    if (newLevel > prevLevel) {
      soundEngine.playLevelUpFanfare();
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 }
      });
      showNotification(`🎉 LEVEL UP! ก้าวสู่เลเวล ${newLevel} แล้ว!`);
    } else if (reason) {
      showNotification(`+${amount} EXP: ${reason}`);
    }
  };

  const handleCompleteLesson = (lessonId, rewardExp) => {
    setCompletedLessons((prev) => ({ ...prev, [lessonId]: true }));
    handleAddExp(rewardExp, 'สำเร็จบทเรียน!');
  };

  const toggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  // Quick testing helpers for evolution stages
  const handleQuickLevelSet = (targetLvl) => {
    const targetExp = (targetLvl - 1) * EXP_PER_LEVEL + 50;
    setExp(targetExp);
    soundEngine.playLevelUpFanfare();
    confetti({ particleCount: 100, spread: 70 });
    showNotification(`แปลงร่างสู่เลเวล ${targetLvl}!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 px-5 py-3 rounded-xl font-bold text-sm shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 fill-current" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.5)]">
              <span className="text-xl">🎸</span>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                GuitarQuest
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Zero to Hero
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">เส้นทางฝึกกีตาร์และพัฒนาตัวละครอนิเมะ</p>
            </div>
          </div>

          {/* Gamification Stats: Level, EXP Bar, Streak */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Streak Counter */}
            <div 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold shadow-sm"
              title="สถิติการฝึกติดต่อกันรายวัน"
            >
              <Flame className="w-4 h-4 fill-orange-500 animate-pulse" />
              <span>{streak} วันซ้อน!</span>
            </div>

            {/* Level & EXP Progress */}
            <div className="flex flex-col items-end min-w-[130px] sm:min-w-[170px]">
              <div className="flex items-center justify-between w-full text-xs font-bold mb-1">
                <span className="text-amber-400 font-mono">Lv. {level}</span>
                <span className="text-slate-400 text-[10px] font-mono">
                  {currentExpInLevel} / {EXP_PER_LEVEL} EXP
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700/50">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                  style={{ width: `${expProgressPercent}%` }}
                />
              </div>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
              title={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 space-y-6 flex-1">
        
        {/* HERO SECTION: Animated Character Stage & Evolution Hub */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Avatar Visualizer (Left 4 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <AvatarCharacter 
              level={level} 
              isPlaying={isPlayingAvatar} 
              onInteract={() => {
                soundEngine.playExpSound();
                setIsPlayingAvatar(true);
                setTimeout(() => setIsPlayingAvatar(false), 2000);
              }}
            />
          </div>

          {/* Player Evolution Dashboard & Quick Stage Selector (Right 7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
            <div>
              {/* Header Info */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <h2 className="text-xl font-black text-white">บันทึกพัฒนาการตัวละคร (Avatar Status)</h2>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
                  EXP ทั้งหมด: {exp.toLocaleString()}
                </span>
              </div>

              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                ตัวละครอนิเมะของคุณจะเจริญเติบโตและเปลี่ยนรูปลักษณ์ไปตามเลเวลการฝึกจริง ยิ่งฝึกตารางประจำวันมากเท่าไร กีตาร์ อุปกรณ์ และเวทีการแสดงจะยิ่งอัปเกรดเป็นตำนาน!
              </p>

              {/* Passive Stage Perk */}
              <div className="rounded-xl bg-slate-950 border border-slate-800/80 p-3.5 mb-4 text-xs space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>บัฟพิเศษประจำร่าง (Passive Perk):</span>
                </div>
                <p className="text-slate-300 pl-6">{currentStage.passiveBonus}</p>
              </div>

              {/* Evolution Roadmap Preview */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-400 block">เส้นทางการเติบโต 6 ระดับ (Evolution Roadmap):</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {EVOLUTION_STAGES.map((st) => {
                    const isUnlocked = level >= st.minLevel;
                    const isCurrent = currentStage.stage === st.stage;
                    return (
                      <button
                        key={st.stage}
                        onClick={() => handleQuickLevelSet(st.minLevel)}
                        className={`p-2 rounded-xl text-left border text-xs transition cursor-pointer active:scale-95 ${
                          isCurrent
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-md'
                            : isUnlocked
                            ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                            : 'bg-slate-950/40 border-slate-900 text-slate-600 hover:border-slate-800'
                        }`}
                      >
                        <div className="text-[10px] text-slate-400">ขั้นที่ {st.stage} (Lv.{st.minLevel})</div>
                        <div className="truncate font-semibold">{st.badge.split(' ')[1]}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-4 mt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-400">💡 คลิกที่ตัวละครด้านซ้ายเพื่อสั่งให้ดีดกีตาร์และโยกหัว</span>
              <button
                onClick={() => handleAddExp(50, 'กดซ้อมอิสระ')}
                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold transition active:scale-95 cursor-pointer"
              >
                +50 EXP (ทดสอบดีดเล่น)
              </button>
            </div>
          </div>
        </section>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('routine')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'routine'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>ตารางการฝึก (Practice Routine)</span>
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'roadmap'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>เส้นทางการฝึก 12 บทเรียน (Roadmap)</span>
          </button>

          <button
            onClick={() => setActiveTab('songs')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'songs'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>คลังเพลงฝึกง่าย (Song Player)</span>
          </button>

          <button
            onClick={() => setActiveTab('chords')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'chords'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>คลังคอร์ด & เสียงดีด (Chord Library)</span>
          </button>

          <button
            onClick={() => setActiveTab('tuner')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'tuner'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>เครื่องตั้งสาย (Guitar Tuner)</span>
          </button>
        </nav>

        {/* Tab Content Display */}
        <section className="transition-all duration-300">
          {activeTab === 'routine' && (
            <PracticeRoutine 
              onAddExp={handleAddExp} 
              onPracticeStateChange={setIsPlayingAvatar} 
            />
          )}

          {activeTab === 'roadmap' && (
            <RoadmapView 
              userLevel={level} 
              completedLessons={completedLessons} 
              onCompleteLesson={handleCompleteLesson} 
            />
          )}

          {activeTab === 'songs' && (
            <SongPlayer 
              onAddExp={handleAddExp} 
              onPracticeStateChange={setIsPlayingAvatar} 
            />
          )}

          {activeTab === 'chords' && (
            <ChordLibraryView />
          )}

          {activeTab === 'tuner' && (
            <GuitarTuner />
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-6 px-4 text-center text-xs text-slate-500">
        <p>🎸 GuitarQuest: From Zero to Hero • Gamified Guitar Learning System</p>
        <p className="mt-1">ฝึกซ้อมสม่ำเสมอวันละ 15-30 นาที แล้วพัฒนาตัวละครของคุณสู่ Guitar God!</p>
      </footer>
    </div>
  );
}

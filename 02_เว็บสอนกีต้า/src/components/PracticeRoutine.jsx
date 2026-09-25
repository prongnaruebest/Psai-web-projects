import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward, CheckCircle2, Flame, Award, Volume2, VolumeX, Clock } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

const ROUTINE_PLANS = [
  {
    id: 'quick-15',
    title: 'โหมดเร่งด่วน (15 นาที)',
    subtitle: 'เหมาะสำหรับวันเวลาน้อย รักษาสถิติ Streak 🔥',
    totalMinutes: 15,
    expBonus: 120,
    steps: [
      { name: 'Warm-up & Spider Walk', durationSec: 180, desc: 'วอร์มนิ้ว 1-2-3-4 บนสาย 6 ถึงสาย 1 ผ่อนคลายข้อมือ' },
      { name: 'Chord Switching (คู่คอร์ดปราบเซียน)', durationSec: 360, desc: 'ฝึกเปลี่ยน Em -> C และ G -> D อย่างต่อเนื่อง' },
      { name: 'Strumming Rhythm (ตีคอร์ดตามจังหวะ)', durationSec: 360, desc: 'แพทเทิร์น ลง-ลง-ขึ้น-ขึ้น-ลง กับเมโทรนอม' }
    ]
  },
  {
    id: 'standard-30',
    title: 'โหมดมาตรฐาน (30 นาที) ★ แนะนำ',
    subtitle: 'สูตรยอดนิยม พัฒนาเร็วขึ้น 3 เท่า ก้าวสู่ร่างต่อไป!',
    totalMinutes: 30,
    expBonus: 300,
    steps: [
      { name: 'Warm-up & Finger Stretching', durationSec: 300, desc: 'ยืดข้อนิ้ว + Spider Walk สลับคู่สาย 1-2-3-4' },
      { name: 'Chord Switching & Clean Tone', durationSec: 600, desc: 'สลับคอร์ดเปิด & คอร์ดทาบ ให้เสียงใสกริ๊บทุกสาย' },
      { name: 'Technique & Metronome Groove', durationSec: 420, desc: 'เกากีตาร์ Fingerpicking หรือไล่ Minor Pentatonic Scale' },
      { name: 'Song Application (เล่นเพลงจริง)', durationSec: 480, desc: 'นำเทคนิคมาเล่นกับเพลง เช่น Zombie หรือ Stand by Me' }
    ]
  },
  {
    id: 'pro-60',
    title: 'โหมดจริงจัง (60 นาที)',
    subtitle: 'ระดับ Pro / ทุ่มสุดตัวเพื่อปลดล็อก Guitar God 👑',
    totalMinutes: 60,
    expBonus: 750,
    steps: [
      { name: 'Advanced Warmup & Chromatic', durationSec: 600, desc: 'ไล่นิ้ว 4 ช่องทั่วนิ้วบอร์ด Alternate Picking' },
      { name: 'Barre Chords & Harmonic Voicing', durationSec: 900, desc: 'คอร์ดทาบ F, Bm และคอร์ดแจ๊ส 7th ทั่วคอกีตาร์' },
      { name: 'Speed Picking & Bending/Vibrato', durationSec: 900, desc: 'ดันสายเต็มเสียง ควบคุมสำเนียง Vibrato ให้ก้องกังวาน' },
      { name: 'Song Mastery & Improvisation', durationSec: 1200, desc: 'บรรเลงเพลงเต็มท่อน + โซโล่สดตาม Backing Track' }
    ]
  }
];

export default function PracticeRoutine({ onAddExp, onPracticeStateChange }) {
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(1); // Default 30 min
  const activePlan = ROUTINE_PLANS[selectedPlanIndex];

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(activePlan.steps[0].durationSec);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Metronome State
  const [metronomeActive, setMetronomeActive] = useState(false);
  const [bpm, setBpm] = useState(80);
  const [currentBeat, setCurrentBeat] = useState(0);
  const metronomeTimerRef = useRef(null);

  // Sync timer when plan changes
  useEffect(() => {
    setCurrentStepIdx(0);
    setTimeLeft(activePlan.steps[0].durationSec);
    setIsRunning(false);
    setIsCompleted(false);
  }, [selectedPlanIndex]);

  // Notify parent component about playing state for avatar animation
  useEffect(() => {
    if (onPracticeStateChange) {
      onPracticeStateChange(isRunning);
    }
  }, [isRunning, onPracticeStateChange]);

  // Main countdown timer
  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // Step complete!
      soundEngine.playExpSound();
      if (currentStepIdx < activePlan.steps.length - 1) {
        const nextIdx = currentStepIdx + 1;
        setCurrentStepIdx(nextIdx);
        setTimeLeft(activePlan.steps[nextIdx].durationSec);
      } else {
        // Entire routine completed!
        setIsRunning(false);
        setIsCompleted(true);
        soundEngine.playLevelUpFanfare();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
        if (onAddExp) {
          onAddExp(activePlan.expBonus, 'สำเร็จตารางฝึกซ้อมประจำวัน!');
        }
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, currentStepIdx, activePlan]);

  // Metronome Sound Engine Loop
  useEffect(() => {
    if (metronomeActive) {
      const intervalMs = (60 / bpm) * 1000;
      metronomeTimerRef.current = setInterval(() => {
        setCurrentBeat((prev) => {
          const next = (prev + 1) % 4;
          soundEngine.playMetronomeClick(next === 0);
          return next;
        });
      }, intervalMs);
    } else {
      clearInterval(metronomeTimerRef.current);
      setCurrentBeat(0);
    }
    return () => clearInterval(metronomeTimerRef.current);
  }, [metronomeActive, bpm]);

  const handleToggleTimer = () => {
    soundEngine.init();
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(activePlan.steps[currentStepIdx].durationSec);
  };

  const handleSkipStep = () => {
    if (currentStepIdx < activePlan.steps.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      setTimeLeft(activePlan.steps[nextIdx].durationSec);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentStep = activePlan.steps[currentStepIdx];
  const stepProgress = ((currentStep.durationSec - timeLeft) / currentStep.durationSec) * 100;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header & Plan Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            ตารางการฝึกซ้อมกีตาร์ (Practice Routine)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            ฝึกสม่ำเสมอทุกวันเพื่อเก็บ EXP และอัปเกรดร่างตัวละครอนิเมะของคุณ
          </p>
        </div>

        {/* Plan Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {ROUTINE_PLANS.map((plan, idx) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlanIndex(idx)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                selectedPlanIndex === idx
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {plan.totalMinutes} นาที
            </button>
          ))}
        </div>
      </div>

      {/* Routine Steps Indicator */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {activePlan.steps.map((st, i) => {
          const isDone = i < currentStepIdx || isCompleted;
          const isCurrent = i === currentStepIdx && !isCompleted;
          return (
            <div
              key={i}
              className={`p-2.5 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                  : isDone
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400'
                  : 'bg-slate-950/40 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span>ด่าน {i + 1}</span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span>{Math.round(st.durationSec / 60)} น.</span>
                )}
              </div>
              <p className="text-xs font-medium truncate">{st.name}</p>
            </div>
          );
        })}
      </div>

      {/* Main Active Timer Display */}
      {!isCompleted ? (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-700/60 p-6 text-center shadow-inner">
          {/* Progress Bar Top */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300"
              style={{ width: `${stepProgress}%` }}
            />
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
            ช่วงที่ {currentStepIdx + 1} / {activePlan.steps.length}: {currentStep.name}
          </div>
          
          <div className="text-6xl sm:text-7xl font-mono font-black tracking-tight text-white my-2 drop-shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            {formatTime(timeLeft)}
          </div>

          <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
            {currentStep.desc}
          </p>

          {/* Timer Buttons */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleToggleTimer}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition active:scale-95 cursor-pointer ${
                isRunning
                  ? 'bg-rose-500 hover:bg-rose-600 text-white'
                  : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950'
              }`}
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              <span>{isRunning ? 'หยุดพักชั่วคราว' : 'เริ่มฝึกตามเวลา'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              title="รีเซ็ตเวลานี้"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={handleSkipStep}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              title="ข้ามไปช่วงถัดไป"
            >
              <FastForward className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        /* Completed Celebration Card */
        <div className="rounded-2xl bg-gradient-to-b from-amber-500/20 to-slate-950 border border-amber-500/50 p-8 text-center space-y-4">
          <Award className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
          <h3 className="text-2xl font-black text-white">สุดยอดมาก! ฝึกครบตามตารางแล้ว</h3>
          <p className="text-sm text-slate-300">
            คุณได้รับ <span className="font-bold text-amber-400">+{activePlan.expBonus} EXP</span> ตัวละครคู่หูของคุณเติบโตขึ้นอย่างงดงาม!
          </p>
          <button
            onClick={() => {
              setIsCompleted(false);
              setCurrentStepIdx(0);
              setTimeLeft(activePlan.steps[0].durationSec);
            }}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition"
          >
            เริ่มรอบใหม่อีกครั้ง
          </button>
        </div>
      )}

      {/* Built-in Interactive Metronome */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEngine.init();
              setMetronomeActive(!metronomeActive);
            }}
            className={`p-3 rounded-xl border font-bold transition flex items-center gap-2 cursor-pointer ${
              metronomeActive
                ? 'bg-amber-500 border-amber-400 text-slate-950 animate-pulse'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {metronomeActive ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            <span className="text-xs">{metronomeActive ? 'ปิดเมโทรนอม' : 'เปิดเมโทรนอม'}</span>
          </button>

          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>จังหวะ (Metronome):</span>
              <span className="text-amber-400 font-mono text-base">{bpm} BPM</span>
            </div>
            <div className="text-xs text-slate-400">
              จังหวะ 4/4 (เสียงเคาะสูงที่จังหวะที่ 1)
            </div>
          </div>
        </div>

        {/* 4 Beat visualizer dots */}
        <div className="flex items-center gap-2">
          {[0, 1, 2, 3].map((b) => (
            <div
              key={b}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-100 ${
                metronomeActive && currentBeat === b
                  ? b === 0
                    ? 'bg-amber-400 scale-125 shadow-[0_0_10px_#f59e0b]'
                    : 'bg-teal-400 scale-110 shadow-[0_0_8px_#2dd4bf]'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* BPM Slider */}
        <div className="flex items-center gap-3 w-full md:w-56">
          <input
            type="range"
            min="40"
            max="180"
            step="2"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { BookOpen, CheckCircle, Lock, Star, ChevronRight, Award, Sparkles } from 'lucide-react';
import { CURRICULUM_DATA } from '../data/curriculum';
import { CHORDS_DATA } from '../data/chords';
import ChordDiagram from './ChordDiagram';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

export default function RoadmapView({ userLevel, completedLessons, onCompleteLesson }) {
  const [selectedLesson, setSelectedLesson] = useState(CURRICULUM_DATA[0]);

  const handleClaimLesson = (lesson) => {
    if (completedLessons[lesson.id]) return;
    soundEngine.playLevelUpFanfare();
    confetti({
      particleCount: 110,
      spread: 75,
      origin: { y: 0.6 }
    });
    onCompleteLesson(lesson.id, lesson.expReward);
  };

  const phases = [
    { key: 'beginner', title: 'Phase 1: มือใหม่เริ่มต้น (Beginner)', badge: '🌱 พื้นฐานแน่นปึ้ก' },
    { key: 'intermediate', title: 'Phase 2: ระดับกลาง (Intermediate)', badge: '⚡ คอร์ดทาบ & เกากีตาร์' },
    { key: 'advanced', title: 'Phase 3: ระดับสูง (Advanced / Pro)', badge: '👑 จอมยุทธ์กีตาร์' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left 2 Cols: The Visual Roadmap Skill Tree */}
      <div className="lg:col-span-2 space-y-6">
        {phases.map((phase) => {
          const lessonsInPhase = CURRICULUM_DATA.filter((l) => l.phase === phase.key);

          return (
            <div key={phase.key} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  {phase.title}
                </h3>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-amber-300">
                  {phase.badge}
                </span>
              </div>

              {/* Lesson Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lessonsInPhase.map((lesson) => {
                  const isLocked = userLevel < lesson.levelRequired;
                  const isDone = !!completedLessons[lesson.id];
                  const isSelected = selectedLesson?.id === lesson.id;

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => !isLocked && setSelectedLesson(lesson)}
                      className={`relative p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                          : isDone
                          ? 'border-emerald-500/40 bg-emerald-950/20 hover:border-emerald-500/60'
                          : isLocked
                          ? 'border-slate-800 bg-slate-950/50 opacity-60 cursor-not-allowed'
                          : 'border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-amber-400">
                          {lesson.phaseTitle.split(':')[0]}
                        </span>
                        {isDone ? (
                          <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            <CheckCircle className="w-3.5 h-3.5" /> ผ่านแล้ว
                          </span>
                        ) : isLocked ? (
                          <span className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                            <Lock className="w-3 h-3" /> ต้องมี Lv.{lesson.levelRequired}
                          </span>
                        ) : (
                          <span className="text-[11px] text-amber-300 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                            +{lesson.expReward} EXP
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-white mb-1 line-clamp-1">{lesson.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{lesson.shortDesc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Right Col: Selected Lesson Interactive Detail & Chords */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 h-fit sticky top-4">
        {selectedLesson ? (
          <>
            <div>
              <div className="flex items-center justify-between text-xs text-amber-400 font-bold mb-1">
                <span>รายละเอียดบทเรียน</span>
                <span>+{selectedLesson.expReward} EXP</span>
              </div>
              <h3 className="text-xl font-black text-white">{selectedLesson.title}</h3>
              <p className="text-xs text-slate-300 mt-2">{selectedLesson.shortDesc}</p>
            </div>

            {/* Key takeaways */}
            <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 space-y-2">
              <span className="text-xs font-bold text-slate-300 block mb-1">💡 หัวใจสำคัญที่ต้องฝึก:</span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedLesson.keyTakeaways.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Lesson Chords if available */}
            {selectedLesson.chords && selectedLesson.chords.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-300 block">
                  🎸 คอร์ดประจำบทเรียน (คลิกดูและฟังเสียง):
                </span>
                <div className="grid grid-cols-1 gap-3">
                  {selectedLesson.chords.slice(0, 1).map((chordName) => (
                    <ChordDiagram key={chordName} chord={CHORDS_DATA[chordName]} />
                  ))}
                </div>
              </div>
            )}

            {/* Practical Exercise Goal */}
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3.5 text-xs">
              <span className="font-bold text-amber-300 block mb-1">🎯 ภารกิจผ่านด่าน:</span>
              <p className="text-slate-300">{selectedLesson.exercise.description}</p>
              <div className="mt-2 text-slate-400 font-mono text-[11px]">
                เป้าหมายความเร็ว: <span className="text-amber-400 font-bold">{selectedLesson.exercise.targetBpm} BPM</span>
              </div>
            </div>

            {/* Complete & Claim Reward Button */}
            <button
              onClick={() => handleClaimLesson(selectedLesson)}
              disabled={completedLessons[selectedLesson.id]}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer ${
                completedLessons[selectedLesson.id]
                  ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-400 cursor-default'
                  : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-lg'
              }`}
            >
              {completedLessons[selectedLesson.id] ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>บทเรียนนี้ผ่านแล้ว</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>ฝึกผ่านแล้ว! กดรับ +{selectedLesson.expReward} EXP</span>
                </>
              )}
            </button>
          </>
        ) : (
          <div className="text-center py-12 text-slate-500">
            เลือกบทเรียนทางด้านซ้ายเพื่อดูรายละเอียด
          </div>
        )}
      </div>
    </div>
  );
}

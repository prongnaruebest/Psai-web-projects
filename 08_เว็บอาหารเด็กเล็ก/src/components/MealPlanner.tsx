'use strict';
'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Dices, 
  Printer, 
  Trash2, 
  Plus, 
  Clock, 
  RefreshCw, 
  CheckCircle,
  Sparkles,
  ChevronRight,
  Scissors
} from 'lucide-react';
import { DayOfWeek, MealSlot, Recipe, WeeklyPlan } from '../types/recipe';
import { DAYS_OF_WEEK, MEAL_TYPES, RECIPES_DATA } from '../data/recipes';
import { SelectMealModal } from './SelectMealModal';
import confetti from 'canvas-confetti';

interface MealPlannerProps {
  weeklyPlan: WeeklyPlan;
  onUpdateWeeklyPlan: (plan: WeeklyPlan) => void;
  recipes: Recipe[];
}

export const MealPlanner: React.FC<MealPlannerProps> = ({
  weeklyPlan,
  onUpdateWeeklyPlan,
  recipes,
}) => {
  const [selectedDayTab, setSelectedDayTab] = useState<DayOfWeek>('mon');
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    day: DayOfWeek | null;
    slot: MealSlot | null;
  }>({
    isOpen: false,
    day: null,
    slot: null,
  });

  const slots: MealSlot[] = ['breakfast', 'lunch', 'dinner', 'snack'];

  // Smart Auto-Populate Algorithm
  const handleAutoPopulate = () => {
    const newPlan: WeeklyPlan = {
      mon: {},
      tue: {},
      wed: {},
      thu: {},
      fri: {},
      sat: {},
      sun: {},
    };

    const usedRecently: string[] = [];

    DAYS_OF_WEEK.forEach((day) => {
      slots.forEach((slot) => {
        // Find matching candidates for this slot
        const candidates = recipes.filter((r) => {
          const matchMeal = r.mealTypes.includes(slot);
          const notRecentlyUsed = !usedRecently.slice(-6).includes(r.id);
          return matchMeal && notRecentlyUsed;
        });

        const pool = candidates.length > 0 
          ? candidates 
          : recipes.filter((r) => r.mealTypes.includes(slot));

        if (pool.length > 0) {
          const chosen = pool[Math.floor(Math.random() * pool.length)];
          newPlan[day.id][slot] = chosen.id;
          usedRecently.push(chosen.id);
        }
      });
    });

    onUpdateWeeklyPlan(newPlan);

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#FDBA74', '#FB923C', '#86EFAC', '#60A5FA', '#F472B6'],
      });
    } catch {
      // ignore
    }
  };

  const handleClearPlan = () => {
    if (confirm('คุณต้องการล้างตารางอาหารทั้งหมดหรือไม่?')) {
      onUpdateWeeklyPlan({
        mon: {},
        tue: {},
        wed: {},
        thu: {},
        fri: {},
        sat: {},
        sun: {},
      });
    }
  };

  const handleOpenSelect = (day: DayOfWeek, slot: MealSlot) => {
    setModalState({
      isOpen: true,
      day,
      slot,
    });
  };

  const handleSelectRecipe = (day: DayOfWeek, slot: MealSlot, recipeId: string) => {
    const updated: WeeklyPlan = {
      ...weeklyPlan,
      [day]: {
        ...weeklyPlan[day],
        [slot]: recipeId,
      },
    };
    onUpdateWeeklyPlan(updated);
  };

  const handleRemoveRecipe = (day: DayOfWeek, slot: MealSlot) => {
    const dayPlan = { ...weeklyPlan[day] };
    delete dayPlan[slot];
    onUpdateWeeklyPlan({
      ...weeklyPlan,
      [day]: dayPlan,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Recipe lookup helper
  const getRecipe = (id?: string) => {
    if (!id) return null;
    return recipes.find((r) => r.id === id) || null;
  };

  // Count planned meals
  const totalPlanned = DAYS_OF_WEEK.reduce((acc, d) => {
    const dayMeals = weeklyPlan[d.id] || {};
    return acc + Object.keys(dayMeals).length;
  }, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Planner Header Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-150 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-xs">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-stone-900">
                  ตารางอาหาร 7 วัน สำหรับหนูน้อย (Weekly Planner)
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  วางแผนแล้ว {totalPlanned}/28 มื้อ
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                จัดล่วงหน้า ช่วยให้เตรียมวัตถุดิบง่าย ไม่ต้องคิดปวดหัวทุกมื้อ สารอาหารสมดุลครบถ้วน
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleAutoPopulate}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-orange-400 to-amber-400 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-200 hover:from-orange-500 hover:to-amber-500 transition-all cursor-pointer active:scale-95"
            >
              <Dices className="w-4 h-4" />
              <span>สุ่มจัดตารางอัตโนมัติ</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-stone-100 text-stone-700 hover:bg-stone-200 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              title="พิมพ์ตารางอาหารติดตู้เย็น"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์ตาราง</span>
            </button>

            {totalPlanned > 0 && (
              <button
                onClick={handleClearPlan}
                className="p-2 rounded-2xl text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                title="ล้างตารางทั้งหมด"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Day Tabs (For Easy Mobile Navigation) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {DAYS_OF_WEEK.map((d) => {
          const isSelected = selectedDayTab === d.id;
          const dayMealsCount = Object.keys(weeklyPlan[d.id] || {}).length;
          return (
            <button
              key={d.id}
              onClick={() => setSelectedDayTab(d.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-stone-800 text-white shadow-xs scale-102'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-orange-400' : 'bg-stone-300'}`} />
              <span>{d.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-stone-700 text-white' : 'bg-stone-100 text-stone-500'
              }`}>
                {dayMealsCount}/4
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Day Detailed Card (Mobile-First Card View) */}
      {(() => {
        const currentDayInfo = DAYS_OF_WEEK.find((d) => d.id === selectedDayTab)!;
        const dayMeals = weeklyPlan[selectedDayTab] || {};

        return (
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-150 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-xl text-sm font-bold ${currentDayInfo.bgColor} ${currentDayInfo.color}`}>
                  {currentDayInfo.label}
                </span>
                <span className="text-xs text-stone-400 font-medium">
                  (แผนอาหาร 4 มื้อของวัน)
                </span>
              </div>

              {/* Quick switcher to next day */}
              <div className="flex items-center gap-1 text-xs">
                {DAYS_OF_WEEK.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDayTab(d.id)}
                    className={`w-7 h-7 rounded-xl font-bold transition-all ${
                      selectedDayTab === d.id
                        ? 'bg-stone-800 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {d.shortLabel}
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Meal Slots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {slots.map((slot) => {
                const slotInfo = MEAL_TYPES.find((m) => m.id === slot)!;
                const recipeId = dayMeals[slot];
                const recipe = getRecipe(recipeId);

                return (
                  <div
                    key={slot}
                    className={`rounded-2xl p-3.5 border transition-all flex flex-col justify-between ${
                      recipe
                        ? 'bg-orange-50/40 border-orange-200 shadow-2xs'
                        : 'bg-stone-50/60 border-dashed border-stone-200 hover:border-orange-300'
                    }`}
                  >
                    {/* Slot Header */}
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-xs font-bold text-stone-700 flex items-center gap-1">
                        <span>{slotInfo.emoji}</span>
                        <span>{slotInfo.label}</span>
                      </span>
                      {recipe && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenSelect(selectedDayTab, slot)}
                            className="text-[11px] text-orange-600 hover:text-orange-800 font-semibold p-1 hover:bg-orange-100 rounded-lg transition-colors cursor-pointer"
                            title="เปลี่ยนเมนู"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleRemoveRecipe(selectedDayTab, slot)}
                            className="text-[11px] text-stone-400 hover:text-red-500 font-semibold p-1 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="ลบเมนู"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Slot Content */}
                    {recipe ? (
                      <div className="space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start gap-2">
                            <span className="text-2xl p-1 rounded-xl bg-white border border-orange-100 shrink-0">
                              {recipe.emoji}
                            </span>
                            <div>
                              <h4 className="font-bold text-stone-900 text-xs sm:text-sm leading-tight line-clamp-2">
                                {recipe.title}
                              </h4>
                              <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-1">
                                <Clock className="w-3 h-3 text-orange-500" />
                                {recipe.prepTimeMinutes + recipe.cookTimeMinutes} นาที
                              </p>
                            </div>
                          </div>

                          {/* Texture note preview */}
                          <div className="mt-2 text-[10px] text-stone-600 bg-white p-2 rounded-xl border border-orange-100/80 leading-relaxed line-clamp-2">
                            <strong className="text-orange-700">หั่น:</strong> {recipe.textureNote.cutting}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Empty Slot */
                      <button
                        onClick={() => handleOpenSelect(selectedDayTab, slot)}
                        className="py-6 flex flex-col items-center justify-center text-stone-400 hover:text-orange-500 transition-colors cursor-pointer w-full"
                      >
                        <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center mb-1 text-stone-400 shadow-2xs">
                          <Plus className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold">+ เพิ่มเมนู</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Full 7-Day Table View (Great for Print & Desktop Overview) */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-150 shadow-xs print:shadow-none print:border-none">
        <h3 className="text-base font-black text-stone-900 mb-3 flex items-center gap-2">
          <span>📋 ภาพรวมทั้งสัปดาห์ (7-Day Overview)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/80">
                <th className="py-2.5 px-3 font-bold text-stone-600 rounded-tl-2xl">วัน</th>
                {slots.map((s) => {
                  const m = MEAL_TYPES.find((mt) => mt.id === s)!;
                  return (
                    <th key={s} className="py-2.5 px-3 font-bold text-stone-600">
                      {m.emoji} {m.label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {DAYS_OF_WEEK.map((d) => {
                const dayMeals = weeklyPlan[d.id] || {};
                return (
                  <tr key={d.id} className="hover:bg-orange-50/30 transition-colors">
                    <td className="py-3 px-3 font-bold whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-lg ${d.bgColor} ${d.color}`}>
                        {d.label}
                      </span>
                    </td>
                    {slots.map((s) => {
                      const recipe = getRecipe(dayMeals[s]);
                      return (
                        <td key={s} className="py-3 px-3 align-top">
                          {recipe ? (
                            <div className="flex items-center gap-1.5 group cursor-pointer" onClick={() => handleOpenSelect(d.id, s)}>
                              <span className="text-base shrink-0">{recipe.emoji}</span>
                              <span className="font-semibold text-stone-800 line-clamp-1 group-hover:text-orange-600">
                                {recipe.title}
                              </span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleOpenSelect(d.id, s)}
                              className="text-[11px] text-stone-400 hover:text-orange-500 font-medium cursor-pointer"
                            >
                              + เพิ่ม
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Select Meal Modal */}
      <SelectMealModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, day: null, slot: null })}
        day={modalState.day}
        slot={modalState.slot}
        recipes={recipes}
        onSelectRecipe={handleSelectRecipe}
      />
    </div>
  );
};

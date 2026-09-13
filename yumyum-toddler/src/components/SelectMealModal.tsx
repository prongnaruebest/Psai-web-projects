'use strict';
'use client';

import React, { useState } from 'react';
import { X, Search, Clock, Check, Utensils } from 'lucide-react';
import { Recipe, DayOfWeek, MealSlot } from '../types/recipe';
import { DAYS_OF_WEEK, MEAL_TYPES, NUTRITION_BENEFIT_LABELS } from '../data/recipes';

interface SelectMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: DayOfWeek | null;
  slot: MealSlot | null;
  recipes: Recipe[];
  onSelectRecipe: (day: DayOfWeek, slot: MealSlot, recipeId: string) => void;
}

export const SelectMealModal: React.FC<SelectMealModalProps> = ({
  isOpen,
  onClose,
  day,
  slot,
  recipes,
  onSelectRecipe,
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  if (!isOpen || !day || !slot) return null;

  const dayInfo = DAYS_OF_WEEK.find((d) => d.id === day);
  const slotInfo = MEAL_TYPES.find((m) => m.id === slot);

  // Filter recipes
  const filtered = recipes.filter((r) => {
    if (filterType !== 'all' && !r.mealTypes.includes(filterType as any)) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const inTitle = r.title.toLowerCase().includes(q);
      const inDesc = r.description.toLowerCase().includes(q);
      const inTags = r.ingredientTags.some((t) => t.toLowerCase().includes(q));
      if (!inTitle && !inDesc && !inTags) return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-orange-100 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-150 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${dayInfo?.bgColor} ${dayInfo?.color}`}>
                {dayInfo?.label}
              </span>
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                {slotInfo?.emoji} {slotInfo?.label}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-stone-900 mt-1">
              เลือกเมนูอาหารสำหรับมื้อนี้
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter bar */}
        <div className="py-3 space-y-2 shrink-0">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาชื่อเมนูหรือวัตถุดิบ..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-xl font-semibold whitespace-nowrap cursor-pointer transition-all ${
                filterType === 'all'
                  ? 'bg-stone-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setFilterType(slot)}
              className={`px-3 py-1 rounded-xl font-semibold whitespace-nowrap cursor-pointer transition-all ${
                filterType === slot
                  ? 'bg-orange-500 text-white'
                  : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
              }`}
            >
              ตรงมื้อ {slotInfo?.emoji}
            </button>
            {MEAL_TYPES.map((m) => {
              if (m.id === slot) return null;
              return (
                <button
                  key={m.id}
                  onClick={() => setFilterType(m.id)}
                  className={`px-3 py-1 rounded-xl font-semibold whitespace-nowrap cursor-pointer transition-all ${
                    filterType === m.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {m.emoji} {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Recipe List */}
        <div className="overflow-y-auto flex-1 space-y-2 pr-1">
          {filtered.length > 0 ? (
            filtered.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => {
                  onSelectRecipe(day, slot, recipe.id);
                  onClose();
                }}
                className="p-3 rounded-2xl border border-stone-200 hover:border-orange-300 hover:bg-orange-50/40 transition-all flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-1.5 rounded-xl bg-orange-50 border border-orange-100 shrink-0">
                    {recipe.emoji}
                  </span>
                  <div>
                    <h4 className="font-bold text-stone-900 text-xs sm:text-sm group-hover:text-orange-600 transition-colors">
                      {recipe.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-orange-500" />
                        {recipe.prepTimeMinutes + recipe.cookTimeMinutes} นาที
                      </span>
                      <span>•</span>
                      <span>{recipe.difficulty}</span>
                    </div>
                    {/* Benefits */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {recipe.nutritionBenefits.slice(0, 2).map((b) => {
                        const info = NUTRITION_BENEFIT_LABELS[b];
                        if (!info) return null;
                        return (
                          <span
                            key={b}
                            className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-md border ${info.color}`}
                          >
                            {info.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <button className="px-3 py-1.5 rounded-xl bg-stone-100 group-hover:bg-orange-500 group-hover:text-white text-stone-700 text-xs font-bold transition-all shrink-0">
                  เลือก
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-xs text-stone-500">
              ไม่พบเมนูที่ตรงกับการค้นหา
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

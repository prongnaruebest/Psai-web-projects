'use strict';
'use client';

import React from 'react';
import { Search, Filter, ShieldCheck, X, Sparkles, Utensils } from 'lucide-react';
import { Allergen, MealType, Situation } from '../types/recipe';
import { ALLERGENS, MEAL_TYPES, SITUATIONS } from '../data/recipes';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedMealType: MealType | 'all';
  onSelectMealType: (type: MealType | 'all') => void;
  selectedSituation: Situation | 'all';
  onSelectSituation: (situation: Situation | 'all') => void;
  excludedAllergens: Allergen[];
  onToggleAllergen: (allergen: Allergen) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedMealType,
  onSelectMealType,
  selectedSituation,
  onSelectSituation,
  excludedAllergens,
  onToggleAllergen,
  onResetFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="space-y-3">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ค้นหาชื่อเมนู เช่น ข้าวต้ม, แซลมอน, แพนเค้ก, ไข่ตุ๋น..."
          className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white border border-stone-200 text-stone-800 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Meal Type Tabs (Horizontal Scrollable on Mobile) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => onSelectMealType('all')}
          className={`px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedMealType === 'all'
              ? 'bg-stone-800 text-white shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          🍽️ ทุกมื้อ
        </button>
        {MEAL_TYPES.map((m) => {
          const isSelected = selectedMealType === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelectMealType(m.id)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                isSelected
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              <span>{m.emoji}</span>
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Situations (Moods / Challenges) */}
      <div className="bg-white/80 p-3 rounded-2xl border border-stone-150">
        <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>เลือกตามสถานการณ์ของลูก:</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
          {SITUATIONS.map((sit) => {
            const isSelected = selectedSituation === sit.id;
            return (
              <button
                key={sit.id}
                onClick={() => onSelectSituation(isSelected ? 'all' : sit.id)}
                className={`p-2 rounded-2xl text-left transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-amber-100/80 border-amber-400 text-amber-950 font-bold ring-2 ring-amber-200 shadow-2xs'
                    : 'bg-stone-50/70 border-stone-200 text-stone-700 hover:bg-amber-50/50 hover:border-amber-200'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{sit.emoji}</span>
                  <span className="text-xs font-semibold leading-tight line-clamp-1">
                    {sit.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Allergy Safety Filter (Exclusions) */}
      <div className="bg-rose-50/60 p-3 rounded-2xl border border-rose-150">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="text-[11px] font-bold text-rose-800 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
            <span>ตัวกรองความปลอดภัย (ลูกแพ้อะไร - คลิกเพื่อตัดออก):</span>
          </div>
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="text-[11px] font-semibold text-stone-500 hover:text-stone-800 underline cursor-pointer"
            >
              รีเซ็ตตัวกรองทั้งหมด
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {ALLERGENS.map((allergen) => {
            const isExcluded = excludedAllergens.includes(allergen.id);
            return (
              <button
                key={allergen.id}
                onClick={() => onToggleAllergen(allergen.id)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all border cursor-pointer flex items-center gap-1 ${
                  isExcluded
                    ? 'bg-rose-500 text-white border-rose-600 shadow-2xs line-through opacity-90'
                    : 'bg-white text-stone-700 border-rose-200 hover:bg-rose-100/60'
                }`}
                title={isExcluded ? `ตัดเมนูที่มี ${allergen.label} ออกแล้ว` : `คลิกหากลูกแพ้ ${allergen.label}`}
              >
                <span>{allergen.emoji}</span>
                <span>{allergen.label}</span>
                {isExcluded && <span className="text-[10px] no-underline">✕</span>}
              </button>
            );
          })}
        </div>
        {excludedAllergens.length > 0 && (
          <p className="text-[11px] text-rose-600 mt-1.5 font-medium">
            🛡️ กำลังซ่อนเมนูที่มีสารก่อภูมิแพ้ที่คุณเลือก ({excludedAllergens.length} รายการ)
          </p>
        )}
      </div>
    </div>
  );
};

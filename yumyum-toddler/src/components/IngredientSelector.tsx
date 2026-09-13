'use strict';
'use client';

import React, { useState } from 'react';
import { Refrigerator, Plus, X, RotateCcw, Sparkles } from 'lucide-react';
import { POPULAR_INGREDIENTS } from '../data/recipes';

interface IngredientSelectorProps {
  selectedIngredients: string[];
  onToggleIngredient: (ingredient: string) => void;
  onClearIngredients: () => void;
  filterByIngredient: boolean;
  onToggleFilterByIngredient: () => void;
  matchedCount: number;
}

export const IngredientSelector: React.FC<IngredientSelectorProps> = ({
  selectedIngredients,
  onToggleIngredient,
  onClearIngredients,
  filterByIngredient,
  onToggleFilterByIngredient,
  matchedCount,
}) => {
  const [customInput, setCustomInput] = useState('');
  const [showAll, setShowAll] = useState(false);

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customInput.trim();
    if (trimmed && !selectedIngredients.includes(trimmed)) {
      onToggleIngredient(trimmed);
      setCustomInput('');
    }
  };

  const displayedIngredients = showAll ? POPULAR_INGREDIENTS : POPULAR_INGREDIENTS.slice(0, 14);

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-150 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <Refrigerator className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-stone-800 text-base flex items-center gap-1.5">
              วัตถุดิบในตู้เย็นวันนี้
              {selectedIngredients.length > 0 && (
                <span className="text-xs bg-orange-500 text-white font-semibold px-2 py-0.5 rounded-full">
                  เลือก {selectedIngredients.length} อย่าง
                </span>
              )}
            </h2>
            <p className="text-xs text-stone-500">
              จิ้มเลือกของที่มีในบ้าน เพื่อให้ระบบจับคู่เมนูที่ทำได้ทันที
            </p>
          </div>
        </div>

        {/* Clear and Match mode toggle */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {selectedIngredients.length > 0 && (
            <button
              onClick={onClearIngredients}
              className="text-xs text-stone-500 hover:text-stone-700 font-medium flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ล้างที่เลือก</span>
            </button>
          )}

          <button
            onClick={onToggleFilterByIngredient}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              filterByIngredient
                ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {filterByIngredient ? `กรองเฉพาะที่ตรงกัน (${matchedCount} เมนู)` : 'แสดงทั้งหมด (เรียงตามที่ตรงกัน)'}
            </span>
          </button>
        </div>
      </div>

      {/* Selected tags badges */}
      {selectedIngredients.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-3 p-2.5 rounded-2xl bg-orange-50/70 border border-orange-100">
          <span className="text-xs font-bold text-orange-800 mr-1">กำลังหาเมนูจาก:</span>
          {selectedIngredients.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white text-orange-700 border border-orange-200 text-xs font-semibold shadow-2xs"
            >
              {item}
              <button
                onClick={() => onToggleIngredient(item)}
                className="hover:text-red-500 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Ingredient Multi-select Chips */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {displayedIngredients.map((ingredient) => {
          const isSelected = selectedIngredients.includes(ingredient);
          return (
            <button
              key={ingredient}
              onClick={() => onToggleIngredient(ingredient)}
              className={`px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center gap-1 ${
                isSelected
                  ? 'bg-orange-500 text-white shadow-xs font-bold scale-102 ring-2 ring-orange-200'
                  : 'bg-stone-50 text-stone-700 border border-stone-200/80 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200'
              }`}
            >
              <span>{ingredient}</span>
              {isSelected && <span className="text-[10px]">✓</span>}
            </button>
          );
        })}

        {/* View more/less button */}
        <button
          onClick={() => setShowAll(!showAll)}
          className="px-3 py-1.5 rounded-2xl text-xs font-semibold text-orange-600 bg-orange-50/60 hover:bg-orange-100 transition-colors cursor-pointer border border-dashed border-orange-200"
        >
          {showAll ? 'ย่อวัตถุดิบ' : `+ ดูเพิ่มอีก ${POPULAR_INGREDIENTS.length - 14} อย่าง`}
        </button>
      </div>

      {/* Add Custom Ingredient Form */}
      <form onSubmit={handleAddCustom} className="mt-3 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="หรือพิมพ์ชื่อวัตถุดิบอื่นที่มีในตู้เย็น เช่น เต้าหู้ปลา, เห็ดเข็มทอง..."
            className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-2xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white text-stone-800 placeholder-stone-400"
          />
        </div>
        <button
          type="submit"
          disabled={!customInput.trim()}
          className="px-3 py-2 rounded-2xl bg-stone-800 text-white text-xs font-semibold disabled:opacity-40 hover:bg-stone-900 transition-all flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>เพิ่ม</span>
        </button>
      </form>
    </div>
  );
};

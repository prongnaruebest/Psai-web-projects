'use strict';
'use client';

import React, { useState } from 'react';
import { 
  Clock, 
  ChefHat, 
  Heart, 
  Share2, 
  Check, 
  AlertTriangle, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Scissors, 
  Baby,
  ShieldAlert
} from 'lucide-react';
import { Recipe } from '../types/recipe';
import { NUTRITION_BENEFIT_LABELS, ALLERGENS } from '../data/recipes';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  selectedIngredients: string[];
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isFavorite,
  onToggleFavorite,
  selectedIngredients,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  // Match count with selected fridge ingredients
  const matchedTags = recipe.ingredientTags.filter((tag) =>
    selectedIngredients.some((sel) => sel.toLowerCase() === tag.toLowerCase())
  );

  const toggleCheckIngredient = (index: number) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleShare = () => {
    const text = `🍽️ ไอเดียเมนูหนูน้อย 1.8 ขวบ: ${recipe.title}\n\n` +
      `⏱️ เวลา: เตรียม ${recipe.prepTimeMinutes} นาที ปรุง ${recipe.cookTimeMinutes} นาที\n` +
      `👶 คำแนะนำเนื้อสัมผัส: ${recipe.textureNote.cutting}\n` +
      `💡 ทริคเด็กกินยาก: ${recipe.parentTip}\n\n` +
      `พบกับไอเดียเมนูสำหรับเด็ก 20 เดือนเพิ่มเติมได้ที่ YumYum Toddler`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className="bg-white rounded-3xl border border-stone-150 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col">
      {/* Top Header Card */}
      <div className="p-4 sm:p-5 flex-1">
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl sm:text-4xl p-2 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
              {recipe.emoji}
            </span>
            <div>
              <h3 className="font-black text-stone-900 text-base sm:text-lg leading-snug">
                {recipe.title}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-stone-500 flex-wrap">
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-orange-500" />
                  {recipe.prepTimeMinutes + recipe.cookTimeMinutes} นาที
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium">
                  <ChefHat className="w-3.5 h-3.5 text-stone-400" />
                  {recipe.difficulty}
                </span>
                {matchedTags.length > 0 && (
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[11px]">
                    ตรงกับตู้เย็น {matchedTags.length} อย่าง
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons: Favorite & Share */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleShare}
              className="p-2 rounded-2xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              title="คัดลอกสรุปสูตรอาหาร"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onToggleFavorite(recipe.id)}
              className={`p-2 rounded-2xl transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-rose-50 text-rose-500'
                  : 'text-stone-300 hover:text-rose-400 hover:bg-rose-50/50'
              }`}
              title={isFavorite ? 'ลบออกจากเมนูโปรด' : 'บันทึกเป็นเมนูโปรด'}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-stone-600 mt-2.5 leading-relaxed">
          {recipe.description}
        </p>

        {/* Nutrition Benefit Badges */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {recipe.nutritionBenefits.map((benefitKey) => {
            const info = NUTRITION_BENEFIT_LABELS[benefitKey];
            if (!info) return null;
            return (
              <span
                key={benefitKey}
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${info.color}`}
              >
                <span>{info.emoji}</span>
                <span>{info.label}</span>
              </span>
            );
          })}
        </div>

        {/* Texture & Safety Guidance for 20-month-old (Crucial Requirement) */}
        <div className="mt-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
            <Scissors className="w-3.5 h-3.5 text-orange-600" />
            <span>คำแนะนำเนื้อสัมผัสสำหรับวัย 1.8 ขวบ (20 เดือน):</span>
          </div>
          <div className="space-y-1 text-xs text-stone-700">
            <p>
              <strong className="text-stone-900">ขนาดการหั่น:</strong> {recipe.textureNote.cutting}
            </p>
            <p>
              <strong className="text-stone-900">ระดับความนิ่ม:</strong> {recipe.textureNote.softness}
            </p>
            <div className="flex items-start gap-1 text-rose-700 font-medium text-[11px] pt-1">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-500" />
              <span>{recipe.textureNote.safetyTip}</span>
            </div>
          </div>
        </div>

        {/* Allergen Indicators if any */}
        {recipe.allergens.length > 0 && (
          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-stone-400 font-medium">มีสารก่อภูมิแพ้:</span>
            {recipe.allergens.map((alg) => {
              const allergenInfo = ALLERGENS.find((a) => a.id === alg);
              return (
                <span
                  key={alg}
                  className="text-[11px] font-semibold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-lg border border-stone-200"
                >
                  {allergenInfo ? `${allergenInfo.emoji} ${allergenInfo.label}` : alg}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Expandable Section: Ingredients & Steps */}
      {isExpanded && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 border-t border-stone-100 bg-stone-50/50 space-y-4 animate-fadeIn">
          {/* Ingredients with checklist */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 flex items-center justify-between">
              <span>วัตถุดิบและสัดส่วน (สำหรับ 1-2 มื้อเด็ก)</span>
              <span className="text-[10px] text-stone-400 font-normal lowercase">(แตะเพื่อติ๊กเตรียมของ)</span>
            </h4>
            <ul className="space-y-1.5">
              {recipe.ingredients.map((item, idx) => {
                const isChecked = !!checkedIngredients[idx];
                const isMatchedWithFridge = selectedIngredients.some((sel) =>
                  item.name.toLowerCase().includes(sel.toLowerCase())
                );
                return (
                  <li
                    key={idx}
                    onClick={() => toggleCheckIngredient(idx)}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs sm:text-sm cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-stone-200/50 text-stone-400 line-through'
                        : isMatchedWithFridge
                        ? 'bg-emerald-50 text-stone-800 border border-emerald-200/60 font-medium'
                        : 'bg-white text-stone-700 border border-stone-150'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCheckIngredient(idx)}
                        className="rounded text-orange-500 focus:ring-orange-400 w-3.5 h-3.5"
                      />
                      <span>{item.name}</span>
                      {isMatchedWithFridge && (
                        <span className="text-[10px] font-bold bg-emerald-500 text-white px-1.5 py-0.2 rounded-full">
                          มีในตู้เย็น
                        </span>
                      )}
                    </div>
                    <span className="font-semibold text-stone-500">{item.amount}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Quick Steps */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              ขั้นตอนการทำอย่างย่อ (3-4 ขั้นตอน ทำง่าย)
            </h4>
            <ol className="space-y-2">
              {recipe.steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                  <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center shrink-0 text-xs mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Parent's Tip */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-2xl border border-amber-200 text-xs text-amber-950">
            <div className="font-bold flex items-center gap-1.5 text-orange-600 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>เคล็ดลับคุณพ่อคุณแม่ (Parent's Tip)</span>
            </div>
            <p className="leading-relaxed text-stone-700">{recipe.parentTip}</p>
          </div>
        </div>
      )}

      {/* Expand / Collapse Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-2.5 px-4 bg-stone-50 hover:bg-orange-50/60 border-t border-stone-150 text-xs font-bold text-stone-600 hover:text-orange-600 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
      >
        {isExpanded ? (
          <>
            <span>ซ่อนสูตรและวิธีทำ</span>
            <ChevronUp className="w-4 h-4" />
          </>
        ) : (
          <>
            <span>ดูวัตถุดิบและวิธีทำ ({recipe.steps.length} ขั้นตอน)</span>
            <ChevronDown className="w-4 h-4" />
          </>
        )}
      </button>
    </article>
  );
};

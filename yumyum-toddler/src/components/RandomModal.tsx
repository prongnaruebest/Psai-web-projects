'use strict';
'use client';

import React, { useEffect, useState } from 'react';
import { X, Dices, Sparkles, Heart, Clock, Scissors, ChefHat } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Recipe } from '../types/recipe';
import { NUTRITION_BENEFIT_LABELS } from '../data/recipes';

interface RandomModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipes: Recipe[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const RandomModal: React.FC<RandomModalProps> = ({
  isOpen,
  onClose,
  recipes,
  favorites,
  onToggleFavorite,
}) => {
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const rollRandom = () => {
    if (recipes.length === 0) return;
    setIsSpinning(true);

    // Fun slot-machine style fast flicker
    let counter = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * recipes.length);
      setCurrentRecipe(recipes[randomIndex]);
      counter++;
      if (counter > 8) {
        clearInterval(interval);
        const finalIndex = Math.floor(Math.random() * recipes.length);
        setCurrentRecipe(recipes[finalIndex]);
        setIsSpinning(false);

        // Fire confetti
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#FDBA74', '#FB923C', '#86EFAC', '#F43F5E', '#FEF08A'],
          });
        } catch {
          // ignore if canvas-confetti fails
        }
      }
    }, 60);
  };

  useEffect(() => {
    if (isOpen) {
      rollRandom();
    }
  }, [isOpen]);

  if (!isOpen || !currentRecipe) return null;

  const isFav = favorites.includes(currentRecipe.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-orange-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>สุ่มเมนูมื้อนี้ให้ลูกน้อย!</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900">
            🎲 เมนูแนะนำจานเด็ด
          </h2>
          <p className="text-xs text-stone-500">
            ไม่ต้องคิดเยอะ เมนูนี้อร่อย ปลอดภัย โภชนาการครบถ้วน
          </p>
        </div>

        {/* Recipe Showcase */}
        <div className={`p-4 rounded-3xl bg-amber-50/50 border border-amber-200 transition-all ${
          isSpinning ? 'opacity-40 scale-98 blur-2xs' : 'opacity-100 scale-100'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl p-2.5 rounded-2xl bg-white border border-amber-200 shadow-xs">
              {currentRecipe.emoji}
            </span>
            <div className="flex-1">
              <h3 className="text-lg font-black text-stone-900 leading-tight">
                {currentRecipe.title}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-stone-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-orange-500" />
                  {currentRecipe.prepTimeMinutes + currentRecipe.cookTimeMinutes} นาที
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ChefHat className="w-3.5 h-3.5 text-stone-400" />
                  {currentRecipe.difficulty}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-stone-600 mb-3">
            {currentRecipe.description}
          </p>

          {/* Nutrition Badges */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {currentRecipe.nutritionBenefits.map((bKey) => {
              const info = NUTRITION_BENEFIT_LABELS[bKey];
              if (!info) return null;
              return (
                <span
                  key={bKey}
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${info.color}`}
                >
                  {info.emoji} {info.label}
                </span>
              );
            })}
          </div>

          {/* Texture note */}
          <div className="bg-white p-3 rounded-2xl border border-amber-100 text-xs space-y-1 mb-3">
            <div className="flex items-center gap-1 text-orange-700 font-bold">
              <Scissors className="w-3.5 h-3.5" />
              <span>คำแนะนำเนื้อสัมผัสวัย 20 เดือน:</span>
            </div>
            <p className="text-stone-700">{currentRecipe.textureNote.cutting}</p>
          </div>

          {/* Parent's Tip */}
          <div className="bg-orange-100/70 p-3 rounded-2xl text-xs text-orange-950 font-medium">
            💡 <strong>ทริคแม่:</strong> {currentRecipe.parentTip}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-5 flex items-center justify-between gap-2.5">
          <button
            onClick={() => onToggleFavorite(currentRecipe.id)}
            className={`flex-1 py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              isFav
                ? 'bg-rose-50 text-rose-600 border-rose-200'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-rose-50 hover:text-rose-600'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{isFav ? 'อยู่ในเมนูโปรดแล้ว' : 'บันทึกเป็นเมนูโปรด'}</span>
          </button>

          <button
            disabled={isSpinning}
            onClick={rollRandom}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Dices className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>สุ่มใหม่อีกรอบ!</span>
          </button>
        </div>
      </div>
    </div>
  );
};

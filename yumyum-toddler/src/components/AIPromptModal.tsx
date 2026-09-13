'use strict';
'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, MessageSquare } from 'lucide-react';
import { Allergen, MealType, Situation } from '../types/recipe';
import { ALLERGENS, MEAL_TYPES, SITUATIONS } from '../data/recipes';

interface AIPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIngredients: string[];
  selectedMealType: MealType | 'all';
  selectedSituation: Situation | 'all';
  excludedAllergens: Allergen[];
}

export const AIPromptModal: React.FC<AIPromptModalProps> = ({
  isOpen,
  onClose,
  selectedIngredients,
  selectedMealType,
  selectedSituation,
  excludedAllergens,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const mealName = selectedMealType === 'all' ? 'มื้อใดก็ได้' : MEAL_TYPES.find((m) => m.id === selectedMealType)?.label || '';
  const sitName = selectedSituation === 'all' ? 'ทั่วไป' : SITUATIONS.find((s) => s.id === selectedSituation)?.label || '';
  const ingredientListStr = selectedIngredients.length > 0 ? selectedIngredients.join(', ') : 'วัตถุดิบทั่วไปในครัว';
  const allergyStr = excludedAllergens.length > 0 
    ? excludedAllergens.map(a => ALLERGENS.find(al => al.id === a)?.label).join(', ')
    : 'ไม่มีประวัติแพ้อาหาร';

  const promptText = `ช่วยคิดไอเดียเมนูอาหารสำหรับเด็กวัย 1 ปี 8 เดือน (20 เดือน) ให้หน่อยครับ/ค่ะ

📌 ข้อมูลและเงื่อนไขของน้อง:
- อายุ: 1.8 ขวบ (20 เดือน)
- มื้ออาหาร: ${mealName}
- สถานการณ์/โจทย์ของวันนี้: ${sitName}
- วัตถุดิบที่มีในตู้เย็นตอนนี้: ${ingredientListStr}
- สิ่งที่ต้องหลีกเลี่ยง/แพ้อาหาร: ${allergyStr}

⚠️ กฎความปลอดภัยสำคัญ:
1. ห้ามใส่น้ำตาล ผงชูรส และลดเกลือ/ซีอิ๊วให้น้อยที่สุด
2. ระบุขนาดการหั่นชิ้นอาหารเพื่อป้องกันสำลัก (Choking hazard) สำหรับเด็กวัย 20 เดือน (เช่น ผลไม้ทรงกลมผ่า 4 ซีกแนวยาว, ผักต้มจนนิ่ม)
3. ระบุทริคสำหรับดึงดูดใจเด็กให้กินง่าย หรือเทคนิคซ่อนผัก

ขอ 2-3 ไอเดียเมนู พร้อมวิธีทำอย่างย่อ 3-4 ขั้นตอน และบอกสารอาหารเด่นครับ ขอบคุณครับ!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-purple-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-stone-900">
              AI Prompt Generator สำหรับถามต่อ
            </h2>
            <p className="text-xs text-stone-500">
              สร้าง Prompt อัตโนมัติจากของในตู้เย็น เพื่อนำไปถาม ChatGPT หรือ Gemini
            </p>
          </div>
        </div>

        <div className="relative my-4">
          <textarea
            readOnly
            value={promptText}
            rows={11}
            className="w-full text-xs sm:text-sm font-mono p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-stone-800 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-stone-500">
            {copied ? '✅ คัดลอกสำเร็จแล้ว นำไปวางในแชท AI ได้เลย!' : '💡 คัดลอกแล้วนำไปวางถาม AI เพื่อได้เมนูแปลกใหม่เพิ่ม'}
          </span>
          <button
            onClick={handleCopy}
            className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-200 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก Prompt'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

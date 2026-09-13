'use strict';
'use client';

import React from 'react';
import { X, BookOpen, AlertTriangle, Heart, Shield, CheckCircle2, Award, Apple } from 'lucide-react';

interface NutritionGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NutritionGuideModal: React.FC<NutritionGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-emerald-100 max-h-[90vh] overflow-y-auto"
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
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              คู่มือแพทย์ & โภชนาการเด็ก
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
              โภชนาการ & พัฒนาการหนูน้อย 1.8 ขวบ (20 เดือน)
            </h2>
          </div>
        </div>

        {/* Guide Content */}
        <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
          {/* Section 1: Development */}
          <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
            <h3 className="font-bold text-emerald-900 flex items-center gap-2 mb-2 text-sm sm:text-base">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>พัฒนาการการเคี้ยวและการกินของวัย 20 เดือน</span>
            </h3>
            <ul className="space-y-1.5 list-disc list-inside text-stone-600">
              <li><strong>ฟันกรามน้ำนมชุดแรกเริ่มขึ้น:</strong> เด็กสามารถบดเคี้ยวอาหารชิ้นหยาบ ชิ้นนุ่ม หรือเนื้อสัตว์สับได้ดีขึ้น ไม่จำเป็นต้องปั่นละเอียดแล้ว</li>
              <li><strong>ความต้องการกินเอง (Self-feeding):</strong> ชอบใช้มือหยิบอาหารเข้าปาก หรือเริ่มหัดถือช้อน ควรส่งเสริมด้วยเมนู Finger Food เป็นประจำ</li>
              <li><strong>กระเพาะอาหารยังมีขนาดเล็ก:</strong> ควรแบ่งเป็น 3 มื้อหลัก และ 1-2 มื้อว่างที่มีประโยชน์</li>
            </ul>
          </div>

          {/* Section 2: Golden Rules of Safety */}
          <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-150">
            <h3 className="font-bold text-rose-900 flex items-center gap-2 mb-2 text-sm sm:text-base">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>อาหารอันตรายเสี่ยงสำลัก (Choking Hazards) ที่ต้องระวัง!</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-600">
              <div className="bg-white/80 p-2.5 rounded-xl border border-rose-100">
                <strong className="text-rose-700 block mb-0.5">🍇 ผลไม้/อาหารทรงกลม</strong>
                องุ่น, มะเขือเทศราชินี, ไส้กรอก <strong>ต้องผ่า 4 ซีกแนวยาวเสมอ</strong> ห้ามผ่าตามขวางเป็นแว่นกลม
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-rose-100">
                <strong className="text-rose-700 block mb-0.5">🥜 ถั่วแข็ง & เมล็ดพืช</strong>
                หลีกเลี่ยงถั่วลิสง เม็ดมะม่วงหิมพานต์ เมล็ดข้าวโพดเต็มเมล็ด หรือป๊อปคอร์น
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-rose-100">
                <strong className="text-rose-700 block mb-0.5">🥕 ผักและผลไม้เนื้อแข็ง</strong>
                แครอท, บรอกโคลี, แอปเปิ้ลดิบ ต้องต้มหรือนึ่งจนนิ่ม บดด้วยนิ้วหรือเหงือกได้
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-rose-100">
                <strong className="text-rose-700 block mb-0.5">🪑 ท่าทางการนั่งกิน</strong>
                ต้องให้นั่งกินบนเก้าอี้กินข้าว (High Chair) นิ่งๆ เสมอ ห้ามวิ่งเล่นหรือเดินกินเด็ดขาด
              </div>
            </div>
          </div>

          {/* Section 3: Milk & Iron balance */}
          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-150">
            <h3 className="font-bold text-amber-900 flex items-center gap-2 mb-2 text-sm sm:text-base">
              <Apple className="w-4 h-4 text-amber-700" />
              <span>สมดุลของ "นม" และ "ธาตุเหล็ก"</span>
            </h3>
            <p className="text-stone-600 mb-2">
              วัย 1.8 ขวบ อาหาร 3 มื้อคือแหล่งพลังงานหลัก นมคืออาหารเสริม:
            </p>
            <ul className="space-y-1 list-disc list-inside text-stone-600">
              <li><strong>จำกัดปริมาณนม:</strong> ไม่ควรเกิน 16-24 ออนซ์ (ประมาณ 2-3 กล่องเล็ก) ต่อวัน เพื่อไม่ให้อิ่มนมจนไม่ยอมกินข้าว</li>
              <li><strong>ระวังโรคซีด:</strong> หากดื่มนมวัวมากเกินไปจะขัดขวางการดูดซึมธาตุเหล็ก ควรเสริมตับไก่ เลือด ไข่แดง และผักใบเขียวสัปดาห์ละ 2-3 ครั้ง</li>
            </ul>
          </div>

          {/* Section 4: Picky Eaters */}
          <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-150">
            <h3 className="font-bold text-sky-900 flex items-center gap-2 mb-2 text-sm sm:text-base">
              <Heart className="w-4 h-4 text-sky-600" />
              <span>จิตวิทยาเมื่อลูก "เบื่ออาหาร / ปฏิเสธผัก"</span>
            </h3>
            <ul className="space-y-1 list-disc list-inside text-stone-600">
              <li><strong>อย่าบังคับหรือต่อรอง:</strong> การบังคับจะสร้างความทรงจำเชิงลบกับมื้ออาหาร หากไม่กินให้เก็บจานใน 30 นาที</li>
              <li><strong>กฎ 10-15 ครั้ง:</strong> เด็กวัยนี้อาจต้องเห็นและปฏิเสธผักชนิดเดิมถึง 10-15 ครั้ง ก่อนจะยอมชิมครั้งแรก เป็นเรื่องปกติ</li>
              <li><strong>เทคนิคซ่อนผัก & ทำเป็นแท่ง:</strong> สับละเอียดปนในไข่ตุ๋น, ซอสพาสต้า หรือปั่นทำแพนเค้ก</li>
            </ul>
          </div>
        </div>

        {/* Footer Button */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-200 transition-all cursor-pointer"
          >
            เข้าใจแล้ว เริ่มทำอาหารให้ลูกเลย!
          </button>
        </div>
      </div>
    </div>
  );
};

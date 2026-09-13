'use strict';
'use client';

import React, { useState } from 'react';
import { ShieldAlert, ChevronDown, ChevronUp, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export const SafetyBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200 rounded-3xl p-4 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-amber-400 text-white shadow-xs shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-amber-950">
                กฎความปลอดภัยอาหารสำหรับหนูน้อย 1.8 ขวบ (20 เดือน)
              </h3>
              <span className="text-[11px] font-semibold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full">
                สำคัญมาก ⚠️
              </span>
            </div>
            <p className="text-xs text-amber-800/90 mt-0.5">
              งดปรุงรสจัด • ระวังชิ้นอาหารติดคอ (Choking Hazard) • หั่นผักผลไม้กลม 4 ซีกเสมอ
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-100/70 hover:bg-amber-200 transition-colors shrink-0 cursor-pointer"
        >
          {isExpanded ? (
            <>
              <span>ย่อข้อความ</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <span>ดูข้อควรระวัง</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-3 border-t border-amber-200/70 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-amber-900 animate-fadeIn">
          <div className="bg-white/70 p-3 rounded-2xl border border-amber-100">
            <div className="font-bold flex items-center gap-1.5 text-orange-600 mb-1">
              <AlertCircle className="w-4 h-4" />
              <span>ป้องกันการสำลัก (Choking)</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              อาหารทรงกลม เช่น องุ่น มะเขือเทศราชินี ไส้กรอก <strong>ต้องผ่า 4 ซีกแนวยาวเสมอ</strong> ห้ามให้กินทั้งลูก และหลีกเลี่ยงถั่วแข็งเต็มเมล็ด
            </p>
          </div>

          <div className="bg-white/70 p-3 rounded-2xl border border-amber-100">
            <div className="font-bold flex items-center gap-1.5 text-amber-600 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>การปรุงรส & ไตเด็ก</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              <strong>ไม่เติมน้ำตาลและผงชูรส</strong> ลดโซเดียม ปรุงรสด้วยรสหวานธรรมชาติจากผลไม้ ผักต้ม หรือน้ำต้มกระดูก เพื่อปกป้องไตและไม่ให้ติดรสหวาน
            </p>
          </div>

          <div className="bg-white/70 p-3 rounded-2xl border border-amber-100">
            <div className="font-bold flex items-center gap-1.5 text-emerald-600 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>เนื้อสัมผัส & พัฒนาการ</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              วัย 20 เดือนฟันกรามเริ่มขึ้น ควรฝึกเคี้ยวชิ้นนุ่มขนาด 0.5 ซม. หรือ Finger food ชิ้นจับพอดีมือ หลีกเลี่ยงอาหารเหนียวและกระด้าง
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

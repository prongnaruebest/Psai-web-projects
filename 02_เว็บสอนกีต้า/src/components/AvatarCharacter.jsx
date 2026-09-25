import React from 'react';

// Character Evolution Stages metadata
export const EVOLUTION_STAGES = [
  {
    stage: 1,
    minLevel: 1,
    maxLevel: 5,
    title: 'Beginner Kid (หนูน้อยเริ่มต้น)',
    subtitle: 'นิ้วยังนิ่ม พลาสเตอร์ยาเต็มมือ กีตาร์ไม้ตัวเก่า',
    themeColor: 'from-amber-700/30 to-amber-950/40',
    borderColor: 'border-amber-700/50',
    aura: 'shadow-amber-900/30',
    badge: '🌱 Rookie Novice',
    guitarType: 'กีตาร์ไม้ผุพัง (Old Acoustic)',
    passiveBonus: '+10% EXP จากการจูนสายและสไปเดอร์วอล์ก'
  },
  {
    stage: 2,
    minLevel: 6,
    maxLevel: 15,
    title: 'Bedroom Strummer (นักดีดในห้องนอน)',
    subtitle: 'เริ่มดีดคล่อง นิ้วเริ่มด้าน กีตาร์โปร่งติดคาโป้สุดเท่',
    themeColor: 'from-emerald-700/30 to-teal-950/40',
    borderColor: 'border-emerald-500/50',
    aura: 'shadow-emerald-500/30',
    badge: '🎵 Bedroom Hero',
    guitarType: 'กีตาร์โปร่ง Folk ไม้สปรูซพร้อมคาโป้',
    passiveBonus: '+15% EXP จากการเปลี่ยนคอร์ด 4 คอร์ดมหัศจรรย์'
  },
  {
    stage: 3,
    minLevel: 16,
    maxLevel: 30,
    title: 'Campfire Troubadour (นักดนตรีรอบกองไฟ)',
    subtitle: 'ข้ามพ้นคอร์ด F ไปแล้ว สะกดใจเพื่อนๆ ใต้แสงดาว',
    themeColor: 'from-amber-600/30 to-orange-950/40',
    borderColor: 'border-orange-500/50',
    aura: 'shadow-orange-500/40',
    badge: '🔥 Campfire Star',
    guitarType: 'Dreadnought Acoustic เกรดพรีเมียม',
    passiveBonus: '+20% EXP จากการฝึก Fingerstyle & คอร์ดทาบ'
  },
  {
    stage: 4,
    minLevel: 31,
    maxLevel: 50,
    title: 'Indie Rocker (ร็อกเกอร์สุดคูล)',
    subtitle: 'จับกีตาร์ไฟฟ้า เสื้อแจ็กเก็ตยีนส์ โยกหัวตามจังหวะกรูฟ',
    themeColor: 'from-indigo-600/30 to-purple-950/40',
    borderColor: 'border-indigo-500/50',
    aura: 'shadow-indigo-500/40',
    badge: '⚡ Indie Rocker',
    guitarType: 'Stratocaster สี Sonic Blue + แอมป์ Marshall จิ๋ว',
    passiveBonus: '+25% EXP จากการฝึก Pentatonic Solo'
  },
  {
    stage: 5,
    minLevel: 51,
    maxLevel: 75,
    title: 'Stage Virtuoso (เทพกีตาร์สายโชว์)',
    subtitle: 'สปอร์ตไลต์ส่องประกาย กวาดสวีปและแท็ปปิ้งสะกดคนดู',
    themeColor: 'from-rose-600/30 to-pink-950/40',
    borderColor: 'border-rose-500/50',
    aura: 'shadow-rose-500/50',
    badge: '🎸 Stage Virtuoso',
    guitarType: 'Les Paul Flame Top สี Cherry Sunburst',
    passiveBonus: '+30% EXP จากการฝึกเทคนิคขั้นสูง & แจ๊ส'
  },
  {
    stage: 6,
    minLevel: 76,
    maxLevel: 100,
    title: 'Legendary Guitar God (เทพเจ้าแห่งสายกีตาร์)',
    subtitle: 'ออร่าสีทองเปล่งประกาย สั่นสะเทือนเวทีระดับตำนานโลก',
    themeColor: 'from-yellow-500/40 to-amber-950/60',
    borderColor: 'border-yellow-400',
    aura: 'shadow-yellow-400/80',
    badge: '👑 Guitar God',
    guitarType: 'Double-Neck Custom Golden Axe แห่งโชคชะตา',
    passiveBonus: '+50% EXP โบนัสความเร็วและการอิมโพรไวส์ไร้ขีดจำกัด'
  }
];

export function getEvolutionStage(level) {
  return EVOLUTION_STAGES.find(s => level >= s.minLevel && level <= s.maxLevel) || EVOLUTION_STAGES[EVOLUTION_STAGES.length - 1];
}

export default function AvatarCharacter({ level, isPlaying = false, onInteract }) {
  const currentStage = getEvolutionStage(level);
  const stageNum = currentStage.stage;

  return (
    <div 
      onClick={onInteract}
      className={`relative group cursor-pointer select-none rounded-2xl bg-gradient-to-b ${currentStage.themeColor} border ${currentStage.borderColor} p-6 flex flex-col items-center justify-center transition-all duration-500 hover:scale-[1.02] shadow-xl ${currentStage.aura}`}
    >
      {/* Background Stage Aura Lights */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        {stageNum >= 3 && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
        )}
        {stageNum >= 4 && (
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
        )}
        {stageNum >= 5 && (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-500/15 via-transparent to-transparent animate-pulse" />
        )}
        {stageNum === 6 && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-400/25 via-amber-500/10 to-transparent animate-glow" />
        )}
      </div>

      {/* Stage Badge Header */}
      <div className="z-10 flex items-center justify-between w-full mb-3">
        <span className="text-xs font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-amber-400 backdrop-blur-sm">
          {currentStage.badge}
        </span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300">
          ร่างพัฒนาที่ {stageNum}/6
        </span>
      </div>

      {/* SVG Anime Avatar Graphic with Dynamic Props & Layers */}
      <div className={`relative w-56 h-64 flex items-center justify-center ${isPlaying ? 'animate-headbang' : 'animate-float'}`}>
        
        {/* Legendary Halo/Wings for Stage 6 */}
        {stageNum === 6 && (
          <div className="absolute -top-4 w-32 h-8 border-2 border-yellow-300 rounded-full blur-[1px] animate-pulse shadow-[0_0_20px_#fde047]" />
        )}

        {/* Anime Character SVG */}
        <svg 
          viewBox="0 0 200 240" 
          className="w-full h-full drop-shadow-2xl overflow-visible"
        >
          <defs>
            <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffdfcb" />
              <stop offset="100%" stopColor="#f3be9b" />
            </linearGradient>
            <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stageNum >= 5 ? '#e11d48' : stageNum >= 4 ? '#312e81' : '#451a03'} />
              <stop offset="100%" stopColor={stageNum >= 5 ? '#881337' : stageNum >= 4 ? '#1e1b4b' : '#291102'} />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#a16207" />
            </linearGradient>
            <linearGradient id="guitarGrad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id="guitarGradElectric" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={stageNum === 5 ? '#ef4444' : '#06b6d4'} />
              <stop offset="100%" stopColor={stageNum === 5 ? '#991b1b' : '#0891b2'} />
            </linearGradient>
          </defs>

          {/* BACK ACCESSORY: Stage 6 Golden Wings */}
          {stageNum === 6 && (
            <g className="animate-pulse">
              <path d="M 40,90 Q 5,60 10,130 Q 35,115 50,110 Z" fill="url(#goldGrad)" opacity="0.8" />
              <path d="M 160,90 Q 195,60 190,130 Q 165,115 150,110 Z" fill="url(#goldGrad)" opacity="0.8" />
            </g>
          )}

          {/* BODY / CLOTHING */}
          {/* Base Torso */}
          <rect 
            x="75" y="110" width="50" height="70" rx="10" 
            fill={
              stageNum === 1 ? '#64748b' : // plain shirt
              stageNum === 2 ? '#0284c7' : // cool blue tee
              stageNum === 3 ? '#d97706' : // cozy orange sweater
              stageNum === 4 ? '#1e293b' : // denim/rocker vest
              stageNum === 5 ? '#dc2626' : // stage red jacket
              '#eab308'                    // golden coat
            } 
          />

          {/* Stage 1: Band-aid patches on chest/arms */}
          {stageNum === 1 && (
            <rect x="85" y="130" width="14" height="6" rx="2" fill="#fed7aa" transform="rotate(20 85 130)" />
          )}

          {/* Stage 3: Cozy Scarf */}
          {stageNum === 3 && (
            <path d="M 70,110 Q 100,125 130,110 Q 135,130 115,132 Q 95,130 70,110" fill="#b45309" />
          )}

          {/* Stage 4 & 5: Rocker Jacket Collar */}
          {(stageNum === 4 || stageNum === 5) && (
            <path d="M 75,110 L 95,140 L 105,140 L 125,110 Z" fill="#0f172a" />
          )}

          {/* HEAD & NECK */}
          <rect x="92" y="90" width="16" height="25" fill="url(#skinGrad)" rx="4" />
          {/* Head Base */}
          <circle cx="100" cy="75" r="32" fill="url(#skinGrad)" />

          {/* ANIME FACE */}
          {/* Blushing Cheeks */}
          <ellipse cx="80" cy="85" rx="5" ry="3" fill="#fb7185" opacity="0.6" />
          <ellipse cx="120" cy="85" rx="5" ry="3" fill="#fb7185" opacity="0.6" />

          {/* Anime Eyes */}
          {isPlaying ? (
            // Joyful closed curved eyes (smiling > <)
            <g stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round">
              <path d="M 75,76 Q 83,70 90,76" />
              <path d="M 110,76 Q 117,70 125,76" />
            </g>
          ) : (
            // Big sparkle anime eyes
            <g>
              <ellipse cx="83" cy="74" rx="6" ry="8" fill="#1e293b" />
              <ellipse cx="117" cy="74" rx="6" ry="8" fill="#1e293b" />
              {/* Eye Sparkles */}
              <circle cx="81" cy="71" r="2.5" fill="#ffffff" />
              <circle cx="84" cy="77" r="1.2" fill="#ffffff" />
              <circle cx="115" cy="71" r="2.5" fill="#ffffff" />
              <circle cx="118" cy="77" r="1.2" fill="#ffffff" />
            </g>
          )}

          {/* Mouth */}
          {isPlaying ? (
            <path d="M 94,88 Q 100,98 106,88 Z" fill="#e11d48" />
          ) : (
            <path d="M 96,87 Q 100,92 104,87" stroke="#475569" strokeWidth="2" fill="none" strokeLinecap="round" />
          )}

          {/* Stage 1: Cheek bandaid */}
          {stageNum === 1 && (
            <rect x="75" y="86" width="10" height="4" rx="1" fill="#fed7aa" stroke="#d97706" strokeWidth="0.5" />
          )}

          {/* Stage 4: Rocker Cool Sunglasses */}
          {stageNum === 4 && (
            <g>
              <rect x="74" y="68" width="22" height="12" rx="3" fill="#020617" />
              <rect x="104" y="68" width="22" height="12" rx="3" fill="#020617" />
              <line x1="96" y1="74" x2="104" y2="74" stroke="#020617" strokeWidth="3" />
            </g>
          )}

          {/* HAIR STYLES */}
          {/* Stage 3 Beanie Hat */}
          {stageNum === 3 && (
            <path d="M 68,68 Q 100,32 132,68 Q 100,60 68,68" fill="#451a03" />
          )}
          {/* Anime Hair Bangs */}
          <path 
            d="M 65,70 Q 75,35 100,35 Q 125,35 135,70 Q 125,60 115,62 Q 100,52 85,62 Q 75,60 65,70" 
            fill="url(#hairGrad)" 
          />
          {/* Spiky hair tufts for Stage 4+ */}
          {stageNum >= 4 && (
            <g fill="url(#hairGrad)">
              <polygon points="68,50 55,30 75,40" />
              <polygon points="132,50 145,30 125,40" />
              <polygon points="100,35 102,15 110,35" />
            </g>
          )}

          {/* GUITARS ACCORDING TO STAGES */}
          <g transform={`rotate(${isPlaying ? -15 : -25} 100 160)`}>
            {/* Guitar Neck */}
            <rect x="20" y="145" width="90" height="10" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="1" />
            {/* Frets */}
            <line x1="40" y1="145" x2="40" y2="155" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="60" y1="145" x2="60" y2="155" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="80" y1="145" x2="80" y2="155" stroke="#cbd5e1" strokeWidth="1" />
            {/* Headstock */}
            <rect x="10" y="143" width="15" height="14" rx="2" fill="#451a03" />

            {/* Stage 2+ Capo on fret 2 */}
            {stageNum >= 2 && (
              <rect x="50" y="143" width="4" height="14" rx="1" fill="#000000" stroke="#f59e0b" strokeWidth="0.8" />
            )}

            {/* GUITAR BODY */}
            {stageNum <= 3 ? (
              // Acoustic Guitar Body
              <g>
                <path 
                  d="M 100,130 C 130,120 160,135 160,150 C 160,165 140,175 160,185 C 160,195 125,200 100,180 C 90,170 90,140 100,130 Z" 
                  fill={stageNum === 1 ? '#a16207' : 'url(#guitarGrad1)'} 
                  stroke="#451a03" 
                  strokeWidth="2" 
                />
                {/* Soundhole */}
                <circle cx="125" cy="155" r="10" fill="#1e1b4b" stroke="#fef08a" strokeWidth="1.5" />
                {/* Stage 1: Wood crack / tape */}
                {stageNum === 1 && (
                  <path d="M 135,170 L 150,180" stroke="#451a03" strokeWidth="2" strokeDasharray="2,2" />
                )}
              </g>
            ) : stageNum <= 5 ? (
              // Electric Guitar Body (Double Cutaway)
              <g>
                <path 
                  d="M 95,130 C 115,115 155,130 155,150 C 155,170 145,175 160,185 C 160,200 115,205 95,185 C 80,170 80,140 95,130 Z" 
                  fill="url(#guitarGradElectric)" 
                  stroke="#0f172a" 
                  strokeWidth="2.5" 
                />
                {/* Pickups */}
                <rect x="110" y="147" width="8" height="16" rx="2" fill="#000000" />
                <rect x="125" y="147" width="8" height="16" rx="2" fill="#000000" />
                <rect x="140" y="147" width="8" height="16" rx="2" fill="#000000" />
              </g>
            ) : (
              // Stage 6: Golden Double-Neck Guitar God Axe
              <g>
                <rect x="20" y="130" width="85" height="8" rx="2" fill="#eab308" />
                <path 
                  d="M 95,120 C 125,100 170,120 170,150 C 170,180 150,180 170,200 C 170,215 105,220 90,190 Z" 
                  fill="url(#goldGrad)" 
                  stroke="#713f12" 
                  strokeWidth="3" 
                />
                <circle cx="130" cy="155" r="14" fill="#451a03" stroke="#fef08a" strokeWidth="2" />
              </g>
            )}
          </g>

          {/* ARMS & HANDS */}
          {/* Left Hand holding neck */}
          <circle cx="55" cy="160" r="8" fill="url(#skinGrad)" />
          {/* Stage 1 Bandaged fingers */}
          {stageNum === 1 && (
            <circle cx="53" cy="158" r="3" fill="#fed7aa" stroke="#d97706" strokeWidth="0.8" />
          )}

          {/* Right Strumming Arm */}
          <g className={isPlaying ? 'animate-strum' : ''}>
            <ellipse cx="140" cy="155" rx="8" ry="12" fill="url(#skinGrad)" transform="rotate(30 140 155)" />
            {/* Pick in fingers */}
            <polygon points="144,162 148,168 140,166" fill="#f59e0b" />
          </g>

          {/* FLOATING NOTES / EFFECTS */}
          {isPlaying && (
            <g className="animate-bounce">
              <text x="30" y="50" fill="#f59e0b" fontSize="20" fontWeight="bold">♪</text>
              <text x="160" y="60" fill="#38bdf8" fontSize="24" fontWeight="bold">♫</text>
              <text x="175" y="110" fill="#ec4899" fontSize="18" fontWeight="bold">♬</text>
            </g>
          )}

          {/* Stage 5 & 6 Lightning sparks */}
          {stageNum >= 5 && (
            <g fill="#fde047" className="animate-pulse">
              <polygon points="30,120 20,135 28,135 18,155 35,138 27,138" />
              <polygon points="175,140 165,155 173,155 163,175 180,158 172,158" />
            </g>
          )}
        </svg>
      </div>

      {/* Evolution Info Card */}
      <div className="z-10 w-full mt-3 pt-3 border-t border-slate-700/50 text-center">
        <h3 className="text-base font-bold text-white tracking-wide flex items-center justify-center gap-1.5">
          {currentStage.title}
        </h3>
        <p className="text-xs text-slate-300 mt-1 line-clamp-1">{currentStage.subtitle}</p>
        
        <div className="mt-2.5 px-3 py-1.5 rounded-lg bg-slate-900/70 border border-slate-800 text-[11px] text-amber-300/90 flex items-center justify-center gap-2">
          <span>🎸 {currentStage.guitarType}</span>
        </div>
      </div>
    </div>
  );
}

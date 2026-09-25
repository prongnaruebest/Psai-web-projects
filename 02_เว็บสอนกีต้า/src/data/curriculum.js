// Comprehensive Guitar Curriculum from Beginner to Advanced

export const CURRICULUM_DATA = [
  // --- PHASE 1: BEGINNER ---
  {
    id: 'lesson-1',
    phase: 'beginner',
    phaseTitle: 'Phase 1: ก้าวแรกจากศูนย์ (Beginner)',
    levelRequired: 1,
    title: 'บทที่ 1: รู้จักกีตาร์ ท่าจับ และการตั้งสาย',
    shortDesc: 'กายวิภาคของกีตาร์ วิธีจับปิ๊ก ท่าทางที่ถูกต้อง และการจูนสายมาตรฐาน E A D G B E',
    expReward: 100,
    durationMin: 15,
    keyTakeaways: [
      'ชื่อและหมายเลขสาย: 6(E ต่ำ), 5(A), 4(D), 3(G), 2(B), 1(E สูง)',
      'การถือปิ๊กกีตาร์แบบผ่อนคลาย ไม่เกร็งข้อมือ',
      'นั่งหลังตรง กีตาร์วางบนตักขวา (หรือซ้ายแบบคลาสสิก)'
    ],
    exercise: {
      type: 'tuning_and_plucking',
      targetBpm: 60,
      description: 'ดีดสายเปิดทีละสาย 6 -> 1 อย่างช้าๆ ให้เสียงก้องกังวาน ไม่บั้งสาย'
    }
  },
  {
    id: 'lesson-2',
    phase: 'beginner',
    phaseTitle: 'Phase 1: ก้าวแรกจากศูนย์ (Beginner)',
    levelRequired: 2,
    title: 'บทที่ 2: Spider Walk & กำลังนิ้วพิฆาต',
    shortDesc: 'แบบฝึกหัดแมงมุมไต่สาย สร้างแรงกดนิ้ว ป้องกันอาการนิ้วด้านเจ็บ และแยกประสาทสัมผัส 4 นิ้ว',
    expReward: 150,
    durationMin: 15,
    keyTakeaways: [
      'ใช้นิ้วชี้(1), กลาง(2), นาง(3), ก้อย(4) กดเฟรต 1-2-3-4 ทีละสาย',
      'กดให้ชิดเส้นเฟรตมากที่สุดเพื่อลดแรงกดและไม่ให้เกิดเสียงบัส (Buzz)',
      'ห้ามยกนิ้วอื่นขึ้นสูงเกินไป ให้ลอยใกล้ฟิงเกอร์บอร์ดเสมอ'
    ],
    exercise: {
      type: 'spider_walk',
      targetBpm: 70,
      description: 'ฝึกนิ้ว 1-2-3-4 บนสาย 6 แล้วเลื่อนไปสาย 5 จนถึงสาย 1'
    }
  },
  {
    id: 'lesson-3',
    phase: 'beginner',
    phaseTitle: 'Phase 1: ก้าวแรกจากศูนย์ (Beginner)',
    levelRequired: 4,
    title: 'บทที่ 3: 4 คอร์ดมหัศจรรย์ (Em - C - G - D)',
    chords: ['Em', 'C', 'G', 'D'],
    shortDesc: 'เซ็ตคอร์ดเล่นได้เป็นพันเพลง! เรียนรู้รูปทรงคอร์ดเปิด และเทคนิคการเปลี่ยนคอร์ดแบบมี Anchor Finger',
    expReward: 250,
    durationMin: 20,
    keyTakeaways: [
      'Em: คอร์ดนิ้วสองนิ้วที่อบอุ่นและจำง่ายที่สุด',
      'C: จำเป็นต้องโก่งข้อนิ้วเพื่อไม่ให้แตะสายล่าง',
      'G -> D: ใช้เทคนิควางนิ้วนางรอเป็นนิ้วหลัก (Pivot/Anchor)'
    ],
    exercise: {
      type: 'chord_switching',
      targetBpm: 65,
      description: 'เปลี่ยนวน Em -> C -> G -> D จังหวะละ 4 ครั้งต่อเนื่องโดยไม่หยุดชะงัก'
    }
  },
  {
    id: 'lesson-4',
    phase: 'beginner',
    phaseTitle: 'Phase 1: ก้าวแรกจากศูนย์ (Beginner)',
    levelRequired: 7,
    title: 'บทที่ 4: แพทเทิร์นตีคอร์ดสากล (Strumming 101)',
    chords: ['G', 'Em', 'C', 'D'],
    shortDesc: 'จังหวะ ดีดลง-ดีดขึ้น ให้เป็นธรรมชาติ จังหวะ "ลง-ลง-ขึ้น-ขึ้น-ลง" (D-DU-UD) ที่ใช้ใน 80% ของเพลงป๊อป',
    expReward: 300,
    durationMin: 20,
    keyTakeaways: [
      'การเหวี่ยงข้อมือเหมือนสลัดน้ำออกจากมือ ไม่ใช้ข้อศอกเป็นตัวหมุนหลัก',
      'จังหวะ 1(ลง) 2(ลง-ขึ้น) 3(ขึ้น) 4(ลง)',
      'รักษาการแกว่งมือลง-ขึ้นเป็นคลื่นสม่ำเสมอ แม้จะไม่โดนสาย (Ghost Strum)'
    ],
    exercise: {
      type: 'strumming_pattern',
      pattern: '↓ . ↓ ↑ . ↑ ↓ ↑',
      targetBpm: 80,
      description: 'ตีแพทเทิร์น D DU UD วนกับคอร์ด G - Em - C - D'
    }
  },

  // --- PHASE 2: INTERMEDIATE ---
  {
    id: 'lesson-5',
    phase: 'intermediate',
    phaseTitle: 'Phase 2: ปลดล็อกระดับกลาง (Intermediate)',
    levelRequired: 15,
    title: 'บทที่ 5: ทลายกำแพงคอร์ดทาบ (F & Bm Barre Chords)',
    chords: ['F', 'Bm', 'Am', 'C'],
    shortDesc: 'เทคนิคการใช้ข้างนิ้วชี้ทาบสาย และการส่งแรงจากแผ่นหลังและข้อศอก ไม่บีบด้วยนิ้วโป้งจนหมดแรง',
    expReward: 450,
    durationMin: 25,
    keyTakeaways: [
      'ใช้ด้านข้างของนิ้วชี้ (ส่วนที่กระดูกแข็ง) ทาบสาย ไม่ใช้เนื้อนุ่มด้านหน้า',
      'ดึงศอกซ้ายเข้าหาลำตัวเล็กน้อยเพื่อให้กีตาร์แนบตัว ลดภาระแรงกดนิ้วโป้ง',
      'ถ้ายังทาบไม่ไหว ให้เริ่มจาก Small F (ทาบแค่ 2 สายล่าง) ก่อน'
    ],
    exercise: {
      type: 'barre_mastery',
      targetBpm: 75,
      description: 'ฝึกสลับ C -> F -> Am -> G ให้เสียงบาร์ทุกสายดังใส ชัดเจน'
    }
  },
  {
    id: 'lesson-6',
    phase: 'intermediate',
    phaseTitle: 'Phase 2: ปลดล็อกระดับกลาง (Intermediate)',
    levelRequired: 22,
    title: 'บทที่ 6: ศาสตร์การเกากีตาร์ (Fingerstyle & Arpeggio)',
    chords: ['C', 'Am', 'F', 'G'],
    shortDesc: 'การใช้ นิ้วโป้ง(P), ชี้(I), กลาง(M), นาง(A) แยกคุมสายเบสและสายเมโลดี้ เพื่อเล่นเพลงอะคูสติกสุดซึ้ง',
    expReward: 500,
    durationMin: 25,
    keyTakeaways: [
      'นิ้วโป้ง (P) คุมสายเบส 6, 5, 4 เท่านั้น',
      'นิ้วชี้(I) คุมสาย 3, กลาง(M) คุมสาย 2, นาง(A) คุมสาย 1',
      'แพทเทิร์นคลาสสิก: เบส - 3 - 2 - 3 - 1 - 3 - 2 - 3'
    ],
    exercise: {
      type: 'fingerpicking_pattern',
      targetBpm: 85,
      description: 'เกาคอร์ดวน C - Am - F - G สไตล์เพลงรักบัลลาด'
    }
  },
  {
    id: 'lesson-7',
    phase: 'intermediate',
    phaseTitle: 'Phase 2: ปลดล็อกระดับกลาง (Intermediate)',
    levelRequired: 30,
    title: 'บทที่ 7: บันไดเสียง Pentatonic & สำเนียงบลูส์',
    shortDesc: 'กล่องสเกล A Minor Pentatonic Box 1 คัมภีร์โซโล่กีตาร์ร็อกและบลูส์ พร้อม Hammer-on และ Pull-off',
    expReward: 600,
    durationMin: 30,
    keyTakeaways: [
      '5 โน้ตมหัศจรรย์: A, C, D, E, G ในตำแหน่งเฟรต 5-8',
      'เทคนิค Hammer-on (เคาะนิ้ว) และ Pull-off (เกี่ยวนิ้ว) เพื่อความเร็วและลื่นไหล',
      'การดันสาย (Bend) ครึ่งเสียงและเต็มเสียง เพื่อถ่ายทอดอารมณ์กรีดร้องของสายกีตาร์'
    ],
    exercise: {
      type: 'scale_run',
      targetBpm: 90,
      description: 'ไล่สเกล A Minor Pentatonic ขึ้น-ลง พร้อมดีดสลับ Alternate Picking'
    }
  },
  {
    id: 'lesson-8',
    phase: 'intermediate',
    phaseTitle: 'Phase 2: ปลดล็อกระดับกลาง (Intermediate)',
    levelRequired: 40,
    title: 'บทที่ 8: Percussive Strumming & Slap Guitar',
    chords: ['Em', 'G', 'C', 'D'],
    shortDesc: 'เปลี่ยนกีตาร์โปร่งให้กลายเป็นชุดกลอง! เทคนิคเคาะสาย (Mute Slap) และ Palm Muting สร้างกรูฟสะกดคนดู',
    expReward: 700,
    durationMin: 30,
    keyTakeaways: [
      'การใช้ส้นมือตบลงบนสายให้เกิดเสียงคล้ายสแนร์กลอง (Snare Click) ในจังหวะที่ 2 และ 4',
      'Palm Mute: วางสันมือเบาๆ ชิดหย่อง (Bridge) สร้างเสียงทุ้มแน่นตุ้บๆ สไตล์ร็อก',
      'การดีดพร้อมตบสายแบบ Ed Sheeran สไตล์'
    ],
    exercise: {
      type: 'percussive_groove',
      targetBpm: 95,
      description: 'เล่นคอร์ดพร้อมตบสายในจังหวะ 2 และ 4 ให้กรูฟหนึบแน่น'
    }
  },

  // --- PHASE 3: ADVANCED ---
  {
    id: 'lesson-9',
    phase: 'advanced',
    phaseTitle: 'Phase 3: จอมยุทธ์กีตาร์ขั้นสูง (Advanced / Pro)',
    levelRequired: 55,
    title: 'บทที่ 9: คอร์ดแจ๊ส สีสันเสียงใหม่ (maj7, m7, 9th, sus4)',
    chords: ['Cmaj7', 'Dm7', 'G7', 'C'],
    shortDesc: 'ก้าวข้ามคอร์ดธรรมดา สู่โลกฮาร์โมนีขั้นสูง Voicing สไตล์ City Pop, Neo-Soul และ Jazz Fusion',
    expReward: 850,
    durationMin: 35,
    keyTakeaways: [
      'โครงสร้าง 2-5-1 (ii - V - I) เสาหลักของดนตรีแจ๊ส: Dm7 -> G7 -> Cmaj7',
      'Drop 2 Voicings และการละเว้นโน้ต 5 เพื่อเสียงที่คมชัด โปร่งใส',
      'Chord Substitutions (การแทนที่คอร์ดสร้างความประหลาดใจ)'
    ],
    exercise: {
      type: 'jazz_ii_v_i',
      targetBpm: 100,
      description: 'เล่นคอร์ดพร็อกเกรสชัน Dm7 -> G7 -> Cmaj7 ด้วยสวิงกรูฟ'
    }
  },
  {
    id: 'lesson-10',
    phase: 'advanced',
    phaseTitle: 'Phase 3: จอมยุทธ์กีตาร์ขั้นสูง (Advanced / Pro)',
    levelRequired: 70,
    title: 'บทที่ 10: เทคนิค Solo ขั้นเทพ (Sweep & Tapping)',
    shortDesc: 'การกวาดปิ๊ก Sweep Picking ข้าม 5 สาย และ Two-Hand Tapping สไตล์ Eddie Van Halen',
    expReward: 1000,
    durationMin: 40,
    keyTakeaways: [
      'Sweep Picking: ปิ๊กต้องไหลผ่านสายเป็นจังหวะเดียวพร้อมนิ้วซ้ายยกออกทันทีเพื่อไม่ให้เสียงซ้อน',
      'Finger Tapping: ใช้นิ้วชี้หรือนิ้วกลางมือขวาเคาะและสะกิดโน้ตบนเฟรตสูง',
      'การควบคุมเสียงรบกวน (String Muting) ด้วยมือทั้งสองข้าง'
    ],
    exercise: {
      type: 'sweep_arpeggio',
      targetBpm: 110,
      description: 'ฝึก Minor Arpeggio Sweep 3 สาย และ 5 สาย ตามเมโทรนอม'
    }
  },
  {
    id: 'lesson-11',
    phase: 'advanced',
    phaseTitle: 'Phase 3: จอมยุทธ์กีตาร์ขั้นสูง (Advanced / Pro)',
    levelRequired: 85,
    title: 'บทที่ 11: ทฤษฎี Modes & กลิ่นอายเสียงดนตรี',
    shortDesc: 'Dorian, Mixolydian, Lydian เข้าใจอารมณ์ของแต่ละโหมดและการอิมโพรไวส์ไร้ขีดจำกัด',
    expReward: 1200,
    durationMin: 45,
    keyTakeaways: [
      'Dorian Mode: กลิ่นฟังก์และแจ๊สร็อก (โน้ต 6th ยกสูง)',
      'Mixolydian Mode: กลิ่นร็อกคลาสสิกและบลูส์ (โน้ต b7)',
      'การคิดแบบ Modal Interchange เพื่อนำมาแต่งเพลงของตัวเอง'
    ],
    exercise: {
      type: 'modal_jam',
      targetBpm: 115,
      description: 'อิมโพรไวส์ Dorian เหนือคอร์ดแจมมิ่ง Dm7 - G'
    }
  },
  {
    id: 'lesson-12',
    phase: 'advanced',
    phaseTitle: 'Phase 3: จอมยุทธ์กีตาร์ขั้นสูง (Advanced / Pro)',
    levelRequired: 95,
    title: 'บทที่ 12: ก้าวสู่ Guitar God - เอกลักษณ์ & จิตวิญญาณ',
    shortDesc: 'การพัฒนา Dynamic, Touch, Phrasing และสร้างเสียงที่เป็นลายเซ็นของตัวเองบนเวทีระดับโลก',
    expReward: 1500,
    durationMin: 50,
    keyTakeaways: [
      'Phrasing สำคัญกว่าความเร็ว: รู้จักเว้นวรรคหายใจเหมือนนักร้อง',
      'Micro-bending และสำเนียง Vibrato ที่เป็นเอกลักษณ์เฉพาะตัว',
      'การควบคุมความรู้สึก อารมณ์ และการส่งพลังสู่คนฟัง'
    ],
    exercise: {
      type: 'master_solo',
      targetBpm: 120,
      description: 'บรรเลงโซโล่สดความยาว 3 นาทีโดยผสมผสานทุกเทคนิคที่ได้เรียนรู้มา'
    }
  }
];

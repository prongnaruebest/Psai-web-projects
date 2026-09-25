// Chord database with string frets [-1=mute, 0=open, 1..=fret] and real frequencies

export const CHORDS_DATA = {
  Em: {
    name: 'Em',
    fullName: 'E Minor',
    frets: [0, 2, 2, 0, 0, 0], // E, A, D, G, B, e
    fingers: [0, 2, 3, 0, 0, 0],
    freqs: [82.41, 123.47, 164.81, 196.00, 246.94, 329.63],
    category: 'beginner',
    difficulty: 'ง่ายมาก',
    description: 'คอร์ดที่เล่นง่ายที่สุดในโลก ใช้นิ้วเพียง 2 นิ้วเท่านั้น',
    tips: 'วางนิ้วชี้ที่สาย 5 เฟรต 2 และนิ้วกลางที่สาย 4 เฟรต 2 ดีดได้ครบทุกสาย'
  },
  C: {
    name: 'C',
    fullName: 'C Major',
    frets: [-1, 3, 2, 0, 1, 0],
    fingers: [0, 3, 2, 0, 1, 0],
    freqs: [0, 130.81, 164.81, 196.00, 261.63, 329.63],
    category: 'beginner',
    difficulty: 'ง่าย',
    description: 'คอร์ดพื้นฐานยอดนิยม อารมณ์สดใส สว่างไสว',
    tips: 'อย่าให้นิ้วชี้โดนสาย 1 ด้านล่าง ดีดตั้งแต่สาย 5 ลงไป (ไม่ดีดสาย 6)'
  },
  G: {
    name: 'G',
    fullName: 'G Major',
    frets: [3, 2, 0, 0, 0, 3],
    fingers: [2, 1, 0, 0, 0, 3],
    freqs: [98.00, 123.47, 146.83, 196.00, 246.94, 392.00],
    category: 'beginner',
    difficulty: 'ปานกลาง',
    description: 'คอร์ดแห่งความอบอุ่นและมีพลัง พบในเพลงสากลและเพลงไทยนับพันเพลง',
    tips: 'โก่งนิ้วก้อยหรือนิ้วนางที่สาย 1 ให้ตั้งฉาก เพื่อไม่ให้บล็อกสาย 2'
  },
  D: {
    name: 'D',
    fullName: 'D Major',
    frets: [-1, -1, 0, 2, 3, 2],
    fingers: [0, 0, 0, 1, 3, 2],
    freqs: [0, 0, 146.83, 220.00, 293.66, 369.99],
    category: 'beginner',
    difficulty: 'ง่าย',
    description: 'คอร์ดรูปสามเหลี่ยม สว่าง ก้องกังวาน ดีดตั้งแต่สาย 4 ลงไป',
    tips: 'จำรูปทรงสามเหลี่ยม ใช้นิ้วโป้งช่วยประคองด้านหลังคอกีตาร์'
  },
  Am: {
    name: 'Am',
    fullName: 'A Minor',
    frets: [-1, 0, 2, 2, 1, 0],
    fingers: [0, 0, 2, 3, 1, 0],
    freqs: [0, 110.00, 164.81, 220.00, 261.63, 329.63],
    category: 'beginner',
    difficulty: 'ง่าย',
    description: 'คอร์ดเศร้าปนซึ้ง รูปฟอร์มเหมือน E แต่เลื่อนลงมาคนละหนึ่งสาย',
    tips: 'ดีดตั้งแต่สาย 5 ลงไป เสียงเบสหลักคือสาย 5 เปิด'
  },
  F: {
    name: 'F',
    fullName: 'F Major (Barre & Mini)',
    frets: [1, 3, 3, 2, 1, 1],
    fingers: [1, 3, 4, 2, 1, 1],
    freqs: [87.31, 130.81, 174.61, 220.00, 261.63, 349.23],
    category: 'intermediate',
    difficulty: 'ท้าทาย (คอร์ดทาบ)',
    description: 'กำแพงด่านแรกของมือกีตาร์ทุกคน ถ้าข้ามคอร์ดนี้ได้จะเล่นได้อีก 1,000 เพลง!',
    tips: 'เอียงขอบนิ้วชี้ด้านข้างแนบกับเฟรต 1 ไม่ใช่ด้านเนื้อนุ่ม และดันข้อศอกเข้าหาตัว'
  },
  Bm: {
    name: 'Bm',
    fullName: 'B Minor (Barre)',
    frets: [-1, 2, 4, 4, 3, 2],
    fingers: [0, 1, 3, 4, 2, 1],
    freqs: [0, 123.47, 185.00, 246.94, 293.66, 369.99],
    category: 'intermediate',
    difficulty: 'ท้าทาย',
    description: 'คอร์ดทาบเฟรต 2 ทรง Am ยอดฮิตสำหรับเพลงป๊อปและร็อก',
    tips: 'ทาบนิ้วชี้ตั้งแต่สาย 5 ลงไปถึงสาย 1'
  },
  Cmaj7: {
    name: 'Cmaj7',
    fullName: 'C Major 7th',
    frets: [-1, 3, 2, 0, 0, 0],
    fingers: [0, 3, 2, 0, 0, 0],
    freqs: [0, 130.81, 164.81, 196.00, 246.94, 329.63],
    category: 'advanced',
    difficulty: 'ปานกลาง (แจ๊ส/นีโอโซล)',
    description: 'เสียงละมุน ฟังสบาย ชวนฝัน นิยมในเพลง City Pop และ Jazz',
    tips: 'เพียงแค่ยกนิ้วชี้ออกจากคอร์ด C ปกติ ก็จะได้เสียง Cmaj7 แสนหวาน'
  },
  Dm7: {
    name: 'Dm7',
    fullName: 'D Minor 7th',
    frets: [-1, -1, 0, 2, 1, 1],
    fingers: [0, 0, 0, 2, 1, 1],
    freqs: [0, 0, 146.83, 220.00, 261.63, 349.23],
    category: 'advanced',
    difficulty: 'ปานกลาง',
    description: 'คอร์ดแจ๊ส/R&B ใช้นิ้วชี้ทาบ 2 สายพร้อมกัน',
    tips: 'ใช้นิ้วชี้นาบสาย 1 และสาย 2 ที่เฟรต 1 พร้อมกัน'
  },
  G7: {
    name: 'G7',
    fullName: 'G Dominant 7th',
    frets: [3, 2, 0, 0, 0, 1],
    fingers: [3, 2, 0, 0, 0, 1],
    freqs: [98.00, 123.47, 146.83, 196.00, 246.94, 349.23],
    category: 'advanced',
    difficulty: 'ง่าย-ปานกลาง',
    description: 'คอร์ดที่มีความตึงเครียด (Tension) มักใช้ส่งเข้าคอร์ด C ในเพลงบลูส์และโฟล์ก',
    tips: 'นิ้วชี้อยู่ที่สาย 1 เฟรต 1 ตัวโน้ต F จะสร้างความตึงเครียดที่รอการคลี่คลาย'
  }
};

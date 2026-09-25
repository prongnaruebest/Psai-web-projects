// Song Library for Practice with Chords, Strumming Patterns & Tabs

export const SONGS_DATA = [
  {
    id: 'song-zombie',
    title: 'Zombie',
    artist: 'The Cranberries',
    difficulty: 'ง่ายมาก (ระดับเริ่มต้น)',
    level: 3,
    bpm: 84,
    capo: 'No Capo (สายเปิด)',
    chords: ['Em', 'C', 'G', 'D'],
    strummingPattern: '↓ . ↓ ↑ . ↑ ↓ ↑  (D DU UD)',
    description: 'เพลง 4 คอร์ดในตำนานที่มือใหม่ทุกคนต้องเล่นเป็น วน 4 คอร์ดเดิมทั้งเพลง!',
    expReward: 200,
    sections: [
      {
        name: 'Verse 1',
        lines: [
          { chord: 'Em', lyric: 'Another head hangs lowly' },
          { chord: 'C', lyric: 'Child is slowly taken' },
          { chord: 'G', lyric: 'And the violence, caused such silence' },
          { chord: 'D', lyric: 'Who are we mistaken?' }
        ]
      },
      {
        name: 'Chorus',
        lines: [
          { chord: 'Em', lyric: 'In your head, in your head' },
          { chord: 'C', lyric: 'Zombie, zombie, zombie-ie-ie' },
          { chord: 'G', lyric: "What's in your head, in your head" },
          { chord: 'D', lyric: 'Zombie, zombie, zombie-ie-ie, oh' }
        ]
      }
    ]
  },
  {
    id: 'song-stand-by-me',
    title: 'Stand By Me',
    artist: 'Ben E. King',
    difficulty: 'ง่าย (ระดับเริ่มต้น)',
    level: 4,
    bpm: 118,
    capo: 'Capo 2 (หรือเล่นคีย์ G ปกติ)',
    chords: ['G', 'Em', 'C', 'D'],
    strummingPattern: '↓ . X ↑ . ↑ X ↑  (มีตบสายเบาๆ)',
    description: 'คลาสสิกตลอดกาล มีกรูฟอบอุ่น เหมาะสำหรับฝึกสลับคอร์ด G -> Em -> C -> D',
    expReward: 220,
    sections: [
      {
        name: 'Verse 1',
        lines: [
          { chord: 'G', lyric: 'When the night has come' },
          { chord: 'Em', lyric: 'And the land is dark' },
          { chord: 'C', lyric: 'And the moon is the only' },
          { chord: 'D', lyric: "Light we'll see" }
        ]
      },
      {
        name: 'Chorus',
        lines: [
          { chord: 'G', lyric: 'No I won’t be afraid, no I won’t be afraid' },
          { chord: 'Em', lyric: 'Just as long as you stand, stand by me' },
          { chord: 'C', lyric: 'So darlin’, darlin’, stand by me' },
          { chord: 'D', lyric: 'Oh, stand by me' }
        ]
      }
    ]
  },
  {
    id: 'song-som-san',
    title: 'ซมซาน',
    artist: 'Loso (พี่เสก โลโซ)',
    difficulty: 'ง่าย-ปานกลาง',
    level: 5,
    bpm: 120,
    capo: 'No Capo',
    chords: ['G', 'Em', 'C', 'D'],
    strummingPattern: '↓ . ↓ ↑ . ↑ ↓ ↑  (ดีดกระแทกจังหวะแน่นๆ)',
    description: 'เพลงชาติมือกีตาร์โปร่งไทย วัยรุ่นทุกคนต้องผ่านเพลงนี้!',
    expReward: 250,
    sections: [
      {
        name: 'Verse 1',
        lines: [
          { chord: 'G', lyric: 'เกิดมาไม่เคยเจอใครเหมือนเธอ' },
          { chord: 'Em', lyric: 'หลับตาก็ละเมอ เห็นหน้าเธอละออ' },
          { chord: 'C', lyric: 'เธอคงไม่รู้ว่ามีใครเขารอ' },
          { chord: 'D', lyric: 'ได้โปรดเถอะหนอ ขอใจเธอคืน' }
        ]
      },
      {
        name: 'Chorus',
        lines: [
          { chord: 'G', lyric: 'ฮู้.. ซมซานมานานเท่าใด' },
          { chord: 'Em', lyric: 'เธอรู้ไหม ใจมันเหงา' },
          { chord: 'C', lyric: 'อยากมีเธอเป็นคู่ใจข้างกาย' },
          { chord: 'D', lyric: 'ตลอดไป.. โอ้เธอ' }
        ]
      }
    ]
  },
  {
    id: 'song-tears-in-heaven',
    title: 'Tears In Heaven',
    artist: 'Eric Clapton',
    difficulty: 'ระดับกลาง (Fingerstyle)',
    level: 18,
    bpm: 78,
    capo: 'No Capo',
    chords: ['C', 'G', 'Am', 'F'],
    strummingPattern: 'P - I - M - A  (เกา 4 นิ้วหวานละมุน)',
    description: 'เพลง Fingerstyle คลาสสิก ฝึกแยกประสาทนิ้วโป้งกับนิ้วเกา',
    expReward: 400,
    sections: [
      {
        name: 'Intro / Verse',
        lines: [
          { chord: 'C', lyric: 'Would you know my name' },
          { chord: 'G', lyric: 'If I saw you in heaven?' },
          { chord: 'Am', lyric: 'Would it be the same' },
          { chord: 'F', lyric: 'If I saw you in heaven?' }
        ]
      }
    ]
  },
  {
    id: 'song-fly-me-to-the-moon',
    title: 'Fly Me To The Moon',
    artist: 'Frank Sinatra / Jazz Style',
    difficulty: 'ระดับสูง (Jazz Voicings)',
    level: 55,
    bpm: 120,
    capo: 'No Capo',
    chords: ['Am', 'Dm7', 'G7', 'Cmaj7', 'F'],
    strummingPattern: 'Swing 4-beat per bar (ชัฟเฟิลเบาๆ สไตล์แจ๊ส)',
    description: 'เรียนรู้การเคลื่อนของฮาร์โมนีสไตล์แจ๊ส และการใช้คอร์ด 7th',
    expReward: 650,
    sections: [
      {
        name: 'Verse 1',
        lines: [
          { chord: 'Am', lyric: 'Fly me to the moon' },
          { chord: 'Dm7', lyric: 'And let me play among the stars' },
          { chord: 'G7', lyric: 'Let me see what spring is like on' },
          { chord: 'Cmaj7', lyric: 'A-Jupiter and Mars' }
        ]
      }
    ]
  }
];

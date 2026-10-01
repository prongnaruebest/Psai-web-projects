/**
 * 90-Day Fluency Quest - Kids Wonderland & Music Studio Database
 * หลักสูตรเด็ก 4 ทักษะ (ฟัง พูด อ่าน เขียน) ใน 3 เดือน + คลังเพลง & นิทาน 1,400+ เรื่อง
 */

const KIDS_SONG_DATA = {
  id: "song-monsters",
  title: "Monsters (I See Your Monsters)",
  artist: "Katie Sky",
  level: "Kids & Family / Beginner to Intermediate",
  tempo: "Mid-tempo (Warm & Encouraging)",
  key: "C Major / A Minor",
  intro: "เพลงสากลความหมายดีเยี่ยม ให้กำลังใจ เสริมความกล้าหาญ ปลูกฝังมิตรภาพและความรักในครอบครัว",
  chords: [
    { name: "Am", notes: ["A3", "C4", "E4", "A4"], frets: "x02210", color: "from-purple-500 to-indigo-600" },
    { name: "C", notes: ["C3", "E3", "G3", "C4", "E4"], frets: "x32010", color: "from-blue-500 to-cyan-500" },
    { name: "G", notes: ["G3", "B3", "D4", "G4"], frets: "320003", color: "from-emerald-500 to-teal-600" },
    { name: "F", notes: ["F3", "A3", "C4", "F4"], frets: "133211", color: "from-rose-500 to-pink-600" },
    { name: "Em", notes: ["E3", "B3", "E4", "G4"], frets: "022000", color: "from-amber-500 to-orange-600" }
  ],
  lyricsWithChords: [
    {
      section: "Chorus (ท่อนฮุกยอดฮิต - ฝึกร้องร่วมกัน)",
      lines: [
        {
          chordLine: "[Am]                  [C]",
          lyrics: "I see your monsters, I see your pain",
          translation: "ฉันมองเห็นปีศาจและความกลัวในใจเธอ ฉันเห็นความเจ็บปวดของเธอ",
          words: [
            { w: "monsters", th: "สัตว์ประหลาด / ความกลัวในใจ" },
            { w: "pain", th: "ความเจ็บปวด / ความทุกข์ใจ" }
          ]
        },
        {
          chordLine: "[G]                    [F]",
          lyrics: "Tell me your problems, I'll chase them away",
          translation: "เล่าปัญหาให้ฉันฟังนะ แล้วฉันจะช่วยไล่พวกมันไปให้พ้น",
          words: [
            { w: "problems", th: "ปัญหาต่างๆ" },
            { w: "chase away", th: "วิ่งไล่ตาม / ขับไล่ไปให้พ้น" }
          ]
        },
        {
          chordLine: "[Am]                    [C]",
          lyrics: "I'll be your lighthouse, I'll make it okay",
          translation: "ฉันจะเป็นดั่งประภาคารคอยส่องแสงนำทาง และทำทุกอย่างให้ปลอดภัย",
          words: [
            { w: "lighthouse", th: "ประภาคารส่องแสงนำทาง" },
            { w: "okay", th: "เรียบร้อย / ปลอดภัยดี" }
          ]
        },
        {
          chordLine: "[G]                         [F]",
          lyrics: "When I see your monsters, I'll stand there so brave",
          translation: "เมื่อฉันเห็นความกลัวของเธอ ฉันจะยืนหยัดอยู่ตรงนี้ด้วยความกล้าหาญ",
          words: [
            { w: "stand", th: "ยืนหยัดเคียงข้าง" },
            { w: "brave", th: "กล้าหาญ ไม่หวั่นไหว" }
          ]
        },
        {
          chordLine: "   [Am]          [C]      [G]    [F]",
          lyrics: "And chase them all away...",
          translation: "และขับไล่พวกมันทั้งหมดออกไป...",
          words: [{ w: "all away", th: "ออกไปให้หมดสิ้น" }]
        }
      ]
    },
    {
      section: "Verse 1 (ท่อนเริ่มเรื่อง)",
      lines: [
        {
          chordLine: "[Am]                     [C]",
          lyrics: "In the dark, we we, we stand apart, we",
          translation: "ในความมืดมิดนั้น แม้เราจะยืนอยู่คนละที่",
          words: [{ w: "dark", th: "ความมืด" }, { w: "stand apart", th: "ยืนห่างกัน" }]
        },
        {
          chordLine: "[G]                        [F]",
          lyrics: "Never had an idea from the start, we",
          translation: "เราอาจไม่เคยรู้มาก่อนเลยตั้งแต่แรก",
          words: [{ w: "from the start", th: "ตั้งแต่เริ่มต้น" }]
        },
        {
          chordLine: "[Am]                        [C]",
          lyrics: "Lose light, yearnin' for what we used to be",
          translation: "สูญเสียแสงสว่าง และคิดถึงสิ่งที่เราเคยเป็น",
          words: [{ w: "light", th: "แสงสว่าง" }, { w: "yearning", th: "ปรารถนา / คิดถึง" }]
        }
      ]
    },
    {
      section: "Pre-Chorus (ท่อนส่งอารมณ์)",
      lines: [
        {
          chordLine: "[Am]                 [C]",
          lyrics: "I could see the sky, sky, sky beautiful, blind",
          translation: "ฉันมองเห็นท้องฟ้าอันงดงาม แม้บางครั้งเราจะมองไม่เห็นทาง",
          words: [{ w: "sky", th: "ท้องฟ้า" }, { w: "beautiful", th: "สวยงาม" }]
        },
        {
          chordLine: "[G]                    [F]",
          lyrics: "I'll be your shelter, keep you warm inside",
          translation: "ฉันจะเป็นที่หลบภัยให้เธอ และคอยโอบกอดให้อบอุ่นเสมอ",
          words: [{ w: "shelter", th: "ที่พักพิง / ที่กำบัง" }, { w: "warm", th: "อบอุ่น" }]
        }
      ]
    },
    {
      section: "Bridge (ท่อนสร้างพลังใจ)",
      lines: [
        {
          chordLine: "[F]                      [G]",
          lyrics: "You've got the chance to see the light",
          translation: "เธอมีโอกาสที่จะมองเห็นแสงสว่างนั้นอีกครั้ง",
          words: [{ w: "chance", th: "โอกาส" }, { w: "light", th: "แสงสว่าง" }]
        },
        {
          chordLine: "[Em]                     [Am]",
          lyrics: "Don't ever stop and lose the fight",
          translation: "อย่าหยุดก้าวเดิน และอย่ายอมแพ้ในการต่อสู้",
          words: [{ w: "never stop", th: "ไม่ยอมหยุด" }, { w: "fight", th: "การต่อสู้ / ความพยายาม" }]
        }
      ]
    }
  ],
  vocabularyLesson: [
    { word: "Monster", pos: "n.", meaning: "สัตว์ประหลาด หรือในเชิงเปรียบเทียบหมายถึงความกลัว ความกังวลในจิตใจ", sample: "Don't worry, there are no monsters under your bed!" },
    { word: "Lighthouse", pos: "n.", meaning: "ประภาคาร (หอคอยสูงที่มีไฟส่องสว่างนำทางเรือในทะเลตอนกลางคืน)", sample: "A good friend is like a lighthouse in the storm." },
    { word: "Chase away", pos: "phr. v.", meaning: "ขับไล่ออกไปให้พ้น", sample: "The sunshine chased the dark clouds away." },
    { word: "Brave", pos: "adj.", meaning: "กล้าหาญ พร้อมเผชิญหน้ากับความยากลำบาก", sample: "You were so brave at the dentist today!" },
    { word: "Stand by someone", pos: "phr. v.", meaning: "ยืนเคียงข้าง คอยสนับสนุนและช่วยเหลือเสมอ", sample: "Family will always stand by you." },
    { word: "Shelter", pos: "n.", meaning: "ที่พักพิง ที่กำบังจากพายุฝน", sample: "We found a cozy shelter under the tree." }
  ],
  singingTips: [
    "🎤 **ท่อนฮุก (Chorus):** ร้องให้ชัดถ้อยชัดคำ เน้นคำว่า 'Mon-sters', 'Pain', 'Light-house' และ 'Brave'",
    "🎸 **จังหวะคอร์ด:** เล่นคอร์ดวนเรียงลำดับ Am ➔ C ➔ G ➔ F โดยดีดลง 4 ครั้งต่อคอร์ดอย่างนุ่มนวล",
    "😊 **การแสดงออก:** ยิ้มและถ่ายทอดความรู้สึกปลอดภัย เหมาะมากสำหรับการร้องคู่ระหว่างพ่อแม่และลูก"
  ]
};

// หลักสูตรเด็ก 4 ทักษะใน 3 เดือน (มาตรฐาน Early Childhood & Common Core Standards)
const KIDS_CURRICULUM_MONTHS = [
  {
    month: 1,
    theme: "Sounds, Phonics & Fun Words (เดือนที่ 1: หูฟัง & ปากขยับ)",
    skillsFocus: {
      listening: "แยกเสียง Phonics A-Z, เสียงสัตว์ และจังหวะเพลงเด็ก Nursery Rhymes",
      speaking: "ทักทายง่ายๆ ร้องเพลงคลอตาม ออกเสียงคำศัพท์ 1-2 พยางค์ได้ชัดเจน",
      reading: "จำรูปทรงตัวอักษรพิมพ์ใหญ่-เล็ก และจับคู่คำศัพท์กับภาพการ์ตูน",
      writing: "ฝึกกล้ามเนื้อมัดเล็ก ลากเส้นตามรอยประตัวอักษร (Letter Tracing)"
    },
    weeklyQuests: [
      { week: 1, title: "Phonics Adventure & The ABC Song", icon: "🔤" },
      { week: 2, title: "Animal Kingdom: Sounds & Movements", icon: "🦁" },
      { week: 3, title: "Colors, Shapes & Magic Rainbows", icon: "🌈" },
      { week: 4, title: "Family & Everyday Polite Words", icon: "🏡" }
    ]
  },
  {
    month: 2,
    theme: "Story World & Sight Words (เดือนที่ 2: นิทานหรรษา & ประโยคสั้น)",
    skillsFocus: {
      listening: "ฟังนิทานโต้ตอบ เข้าใจใจความเรื่องราวสั้นๆ 3-5 นาที",
      speaking: "ตอบคำถามสั้นๆ ใช่/ไม่ใช่ บอกความต้องการ และเลียนแบบเสียงตัวละคร",
      reading: "อ่านคำ Sight Words ความถี่สูง 50 คำ (the, is, can, see, like, we)",
      writing: "สะกดคำศัพท์สั้นๆ 3 ตัวอักษร (CVC words: Cat, Dog, Sun, Big)"
    },
    weeklyQuests: [
      { week: 5, title: "The Hungry Little Caterpillar Story", icon: "🐛" },
      { week: 6, title: "Dinosaur Planet & Big Discoveries", icon: "🦕" },
      { week: 7, title: "Supermarket & Cooking Adventures", icon: "🍎" },
      { week: 8, title: "The Musical Jam: Learning 'Monsters' Song", icon: "🎸" }
    ]
  },
  {
    month: 3,
    theme: "Confidence, Creativity & Fluency (เดือนที่ 3: คิดสร้างสรรค์ & สื่อสารมั่นใจ)",
    skillsFocus: {
      listening: "เข้าใจบทสนทนาการ์ตูนยาวขึ้น และปฏิบัติตามคำสั่ง 2-3 ขั้นตอนได้",
      speaking: "เล่าเรื่องจากภาพด้วยประโยคของตนเอง และร้องเพลงภาษาอังกฤษจบเพลง",
      reading: "อ่านหนังสือนิทานภาพเล่มเล็ก (Decodable Readers) ได้ด้วยตนเอง",
      writing: "แต่งและเขียนประโยคสั้นบอกเล่าเกี่ยวกับสิ่งที่ชอบ (I like... / I see...)"
    },
    weeklyQuests: [
      { week: 9, title: "Outer Space & Rocket Journey", icon: "🚀" },
      { week: 10, title: "Ocean Explorer & Undersea Friends", icon: "🐬" },
      { week: 11, title: "My Dream Day: Little Storyteller", icon: "⭐" },
      { week: 12, title: "Grand Kids Graduation: Sing & Celebrate!", icon: "🎓" }
    ]
  }
];

// คลังนิทานและเรื่องราวโต้ตอบ 1,400+ เรื่อง (คัดเลือก 6 เรื่องเด่นระดับสากล)
const KIDS_STORIES_CATALOG = [
  {
    id: "story-1",
    category: "fables",
    categoryName: "นิทานอีสปและคุณธรรม (Moral Fables)",
    title: "The Tortoise and the Hare",
    titleTh: "กระต่ายกับเต่า",
    emoji: "🐢🐇",
    readTime: "3 นาที",
    badge: "ยอดนิยม",
    pages: [
      {
        text: "Once upon a time, there was a fast Hare and a slow Tortoise.",
        textTh: "กาลครั้งหนึ่งนานมาแล้ว มีกระต่ายที่วิ่งเร็วตัวหนึ่ง และเต่าที่เดินช้าตัวหนึ่ง",
        highlightWords: ["Hare", "Tortoise", "fast", "slow"],
        imageEmoji: "🌳🐇🐢"
      },
      {
        text: "The Hare laughed, 'You are so slow, little Tortoise!' But the Tortoise smiled and said, 'Let us have a race!'",
        textTh: "เจ้ากระต่ายหัวเราะ 'เจ้าเดินช้าเหลือเกินนะเจ้าเต่า!' แต่เจ้าเต่ายิ้มแล้วตอบว่า 'เรามาวิ่งแข่งกันไหมล่ะ!'",
        highlightWords: ["laughed", "smiled", "race"],
        imageEmoji: "🏁🏃‍♂️🐢"
      },
      {
        text: "The Hare ran fast and took a nap under a tree. The Tortoise kept walking step by step without stopping.",
        textTh: "กระต่ายวิ่งนำไปอย่างรวดเร็วแล้วแวะนอนหลับใต้ต้นไม้ ส่วนเต่ายังคงก้าวเดินต่อไปทีละก้าวโดยไม่หยุดพัก",
        highlightWords: ["nap", "tree", "step by step", "stopping"],
        imageEmoji: "💤🌳🚶‍♂️🐢"
      },
      {
        text: "When the Hare woke up, the Tortoise had already crossed the finish line! Slow and steady wins the race!",
        textTh: "พอกระต่ายตื่นขึ้นมา เจ้าเต่าก็เดินข้ามเส้นชัยไปเรียบร้อยแล้ว! ความช้าแต่มั่นคงและไม่ยอมแพ้ย่อมนำไปสู่ชัยชนะ!",
        highlightWords: ["woke up", "finish line", "steady", "wins"],
        imageEmoji: "🥇🏆🎉🐢"
      }
    ]
  },
  {
    id: "story-2",
    category: "adventure",
    categoryName: "การผจญภัยในอวกาศ (Space Explorers)",
    title: "Luna's Space Rocket Journey",
    titleTh: "การเดินทางสู่อวกาศของกระต่ายน้อยลูน่า",
    emoji: "🚀🌕",
    readTime: "4 นาที",
    badge: "จินตนาการล้ำ",
    pages: [
      {
        text: "Luna looked at the night sky through her golden telescope. The moon was shining bright and friendly.",
        textTh: "ลูน่ามองดูท้องฟ้ายามค่ำคืนผ่านกล้องโทรทรรศน์สีทองของเธอ ดวงจันทร์กำลังส่องประกายสว่างไสวและอบอุ่น",
        highlightWords: ["telescope", "moon", "shining", "bright"],
        imageEmoji: "🔭✨🌙🐰"
      },
      {
        text: "'Three, two, one, blast off!' cried Luna as her shiny red rocket zoomed past the stars.",
        textTh: "'สาม สอง หนึ่ง ปล่อยยาน!' ลูน่าตะโกนขณะที่จรวดสีแดงวาววับของเธอพุ่งทะยานผ่านหมู่ดาว",
        highlightWords: ["blast off", "rocket", "zoomed", "stars"],
        imageEmoji: "🚀💨🌟✨"
      },
      {
        text: "On the moon, she met a friendly green alien named Pip. They played cosmic jump and danced together.",
        textTh: "บนดวงจันทร์ เธอได้พบกับมนุษย์ต่างดาวตัวสีเขียวผู้เป็นมิตรชื่อพิป ทั้งสองกระโดดลอยตัวและเต้นรำด้วยกัน",
        highlightWords: ["alien", "friendly", "cosmic jump", "danced"],
        imageEmoji: "👽🤝🐰💃"
      }
    ]
  },
  {
    id: "story-3",
    category: "animals",
    categoryName: "อาณาจักรสัตว์แสนน่ารัก (Animal Friends)",
    title: "Leo the Brave Little Lion",
    titleTh: "ลีโอ เจ้าสิงโตน้อยผู้กล้าหาญ",
    emoji: "🦁❤️",
    readTime: "3 นาที",
    badge: "เสริมความกล้า",
    pages: [
      {
        text: "Little Leo lived in the sunny savanna. He was small, but he had a very big heart.",
        textTh: "ลีโอตัวน้อยอาศัยอยู่ในทุ่งหญ้าสะวันนาอันอบอุ่น แม้ตัวเขาจะเล็ก แต่เขามีหัวใจที่ยิ่งใหญ่มาก",
        highlightWords: ["savanna", "small", "big heart"],
        imageEmoji: "🌾🦁☀️"
      },
      {
        text: "One day, a baby monkey was stuck in a tall acacia tree. 'Do not be afraid, I will help you!' roared Leo.",
        textTh: "วันหนึ่ง ลูกลิงตัวน้อยติดอยู่บนต้นไม้สูง 'อย่ากลัวไปเลยนะ เดี๋ยวฉันช่วยเอง!' ลีโอคำรามอย่างอ่อนโยน",
        highlightWords: ["stuck", "afraid", "help", "roared"],
        imageEmoji: "🐒🌳🦁💪"
      },
      {
        text: "Leo climbed up gently and carried the baby monkey safely down to its mother. Everyone cheered for Leo!",
        textTh: "ลีโอปีนขึ้นไปอย่างระมัดระวังและพาลูกลิงลงมาหาคุณแม่อย่างปลอดภัย สัตว์ทุกตัวต่างปรบมือส่งเสียงชื่นชมลีโอ!",
        highlightWords: ["climbed", "gently", "safely", "cheered"],
        imageEmoji: "👏🐒❤️🦁"
      }
    ]
  },
  {
    id: "story-4",
    category: "science",
    categoryName: "ไดโนเสาร์และวิทยาศาสตร์ (Dino Planet)",
    title: "Dino's Lost Big Bone",
    titleTh: "ไดโนน้อยกับกระดูกยักษ์ที่หายไป",
    emoji: "🦕🦴",
    readTime: "3 นาที",
    badge: "วิทยาศาสตร์น่ารู้",
    pages: [
      {
        text: "Barnaby the baby Brachiosaurus loved eating green fern leaves every morning.",
        textTh: "บาร์นาบี ไดโนเสาร์คอยาวแบรคิโอซอรัสตัวน้อย ชอบกินใบเฟิร์นเขียวสดชื่นทุกเช้า",
        highlightWords: ["Brachiosaurus", "eating", "green leaves", "morning"],
        imageEmoji: "🌿🦕🍃"
      },
      {
        text: "He looked under the volcano and behind the blue waterfall to find his giant puzzle bone.",
        textTh: "เขามองหาใต้ภูเขาไฟและหลังน้ำตกสีฟ้าใส เพื่อตามหากระดูกของเล่นชิ้นโต",
        highlightWords: ["volcano", "behind", "waterfall", "puzzle"],
        imageEmoji: "🌋💧🦕🔍"
      },
      {
        text: "'Aha! Here it is!' Barnaby smiled happily as he solved the mystery with his dino friends.",
        textTh: "'อ๊ะ! อยู่นี่เอง!' บาร์นาบียิ้มอย่างมีความสุขเมื่อเขาไขปริศนาสำเร็จร่วมกับเพื่อนๆ ไดโนเสาร์",
        highlightWords: ["smiled", "happily", "mystery", "friends"],
        imageEmoji: "🎉🦴🦕🦖"
      }
    ]
  },
  {
    id: "story-5",
    category: "habits",
    categoryName: "นิสัยดีรอบตัว (Healthy Habits)",
    title: "Sammy's Magic Toothbrush",
    titleTh: "แปรงสีฟันวิเศษของแซมมี่",
    emoji: "🪥✨",
    readTime: "2 นาที",
    badge: "สุขอนามัยเด็ก",
    pages: [
      {
        text: "Every morning and before bedtime, Sammy takes his shiny blue toothbrush.",
        textTh: "ทุกๆ เช้าและก่อนเข้านอน แซมมี่หยิบแปรงสีฟันสีฟ้าสดใสของเขาขึ้นมา",
        highlightWords: ["morning", "bedtime", "shiny", "toothbrush"],
        imageEmoji: "⏰🪥👦"
      },
      {
        text: "Brush, brush, brush! Up and down, left and right, chasing the sugar bugs away.",
        textTh: "แปรง แปรง แปรง! ขึ้นและลง ซ้ายและขวา ไล่แมงกินฟันตัวร้ายออกไปให้หมด",
        highlightWords: ["brush", "up and down", "chasing", "sugar bugs"],
        imageEmoji: "🫧🦷✨"
      },
      {
        text: "Now Sammy has a sparkling white smile that lights up the whole room!",
        textTh: "ตอนนี้แซมมี่มีรอยยิ้มขาวสะอาดสดใส ส่องประกายความสุขไปทั่วทั้งห้อง!",
        highlightWords: ["sparkling", "white smile", "lights up", "room"],
        imageEmoji: "😁⭐✨👦"
      }
    ]
  },
  {
    id: "story-6",
    category: "ocean",
    categoryName: "โลกใต้ท้องทะเล (Ocean Wonders)",
    title: "The Rainbow Fish and the Star",
    titleTh: "ปลาน้อยสีรุ้งกับดาวทะเลส่องแสง",
    emoji: "🐠⭐",
    readTime: "3 นาที",
    badge: "มิตรภาพอบอุ่น",
    pages: [
      {
        text: "Deep in the crystal blue ocean, Finny the rainbow fish was swimming with tiny bubbles.",
        textTh: "ลึกลงไปในมหาสมุทรสีครามสดใส ฟินนี่ ปลาน้อยสีรุ้งกำลังว่ายน้ำเล่นกับฟองอากาศเล็กๆ",
        highlightWords: ["crystal", "ocean", "rainbow fish", "bubbles"],
        imageEmoji: "🫧🐠🌊"
      },
      {
        text: "He saw a little golden starfish lying on the coral reef. 'Would you like to explore together?' asked Finny.",
        textTh: "เขาเห็นปลาดาวสีทองตัวน้อยนอนอยู่บนแนวปะการัง 'อยากไปสำรวจโลกใต้ทะเลด้วยกันไหม?' ฟินนี่เอ่ยถาม",
        highlightWords: ["starfish", "coral reef", "explore", "together"],
        imageEmoji: "🪸⭐🐠🤝"
      },
      {
        text: "Together, they swam through the glowing seaweed forest and shared a lifetime of friendship.",
        textTh: "ทั้งสองว่ายน้ำผ่านป่าสาหร่ายเรืองแสงด้วยกัน และแบ่งปันมิตรภาพอันงดงามตลอดไป",
        highlightWords: ["glowing", "seaweed", "shared", "friendship"],
        imageEmoji: "🌊✨🐠⭐❤️"
      }
    ]
  }
];

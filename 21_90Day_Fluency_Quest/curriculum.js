/**
 * 90-Day Fluency Quest - Curriculum Database
 * 3 Phases | 90 Days | 270 Micro-Missions
 */

const CURRICULUM_PHASES = [
  {
    phase: 1,
    name: "Phase 1: Foundation & Habit Loop",
    nameTh: "ช่วงที่ 1: วางรากฐานและสร้างนิสัย (Day 1 - 30)",
    color: "emerald",
    desc: "สร้างคลังคำศัพท์ความถี่สูง 800-1,000 คำ ฝึกฟังจับใจความ และปรับรูปปากการออกเสียงให้คุ้นชิน",
    daysRange: [1, 30]
  },
  {
    phase: 2,
    name: "Phase 2: Comprehension & Immersion",
    nameTh: "ช่วงที่ 2: เชื่อมโยงบริบทและเริ่มคิดเป็นภาษา (Day 31 - 60)",
    color: "blue",
    desc: "ก้าวข้ามการแปลในหัว ทำความเข้าใจบทสนทนาจริงระดับธรรมชาติ เล่าเรื่องราว และโต้ตอบสถานการณ์เฉพาะหน้า",
    daysRange: [31, 60]
  },
  {
    phase: 3,
    name: "Phase 3: Fluency & Spontaneous Output",
    nameTh: "ช่วงที่ 3: สื่อสารคล่องแคล่วและเอาตัวรอดได้จริง (Day 61 - 90)",
    color: "purple",
    desc: "แลกเปลี่ยนความคิดเห็น ถกเถียงประเด็น นำเสนอไอเดีย และใช้สำนวนสแลงอย่างมั่นใจ ไหลลื่นเป็นธรรมชาติ",
    daysRange: [61, 90]
  }
];

// ชุดข้อมูลละเอียดสำหรับวันที่สำคัญ และ Template Engine สำหรับทั้ง 90 วัน
const CURRICULUM_DATA_TEMPLATES = [
  // --- WEEK 1 ---
  {
    day: 1,
    phase: 1,
    theme: "Survival Greetings & Introductions",
    themeTh: "การทักทายและการแนะนำตัวเบื้องต้น",
    vocab: [
      { term: "Pleasure to meet you", ipa: "/ˈpleʒər tuː miːt juː/", meaning: "ยินดีที่ได้รู้จัก (สุภาพและเป็นธรรมชาติ)", example: "Hi Sarah, it's a pleasure to meet you." },
      { term: "Originally from", ipa: "/əˈrɪdʒənəli frʌm/", meaning: "มีภูมิลำเนาเดิมมาจาก...", example: "I'm originally from Chiang Mai, but I live in Bangkok." },
      { term: "Currently working as", ipa: "/ˈkɜːrəntli ˈwɜːrkɪŋ æz/", meaning: "ปัจจุบันทำงานในตำแหน่ง...", example: "I am currently working as a software developer." },
      { term: "In my spare time", ipa: "/ɪn maɪ speər taɪm/", meaning: "ในเวลาว่างของฉัน...", example: "In my spare time, I enjoy reading and making coffee." },
      { term: "Looking forward to", ipa: "/ˈlʊkɪŋ ˈfɔːrwərd tuː/", meaning: "ตั้งตารอคอยที่จะ...", example: "I'm looking forward to working with your team." }
    ],
    shadowing: {
      title: "Self-Introduction at Networking Event",
      script: "Hi everyone! My name is Alex. I'm originally from Bangkok, and I currently work as a product designer. In my spare time, I love exploring local cafes and cycling. It's a real pleasure to meet all of you, and I'm really looking forward to our time together.",
      translation: "สวัสดีทุกคนครับ! ผมชื่ออเล็กซ์ มาจากกรุงเทพฯ ปัจจุบันทำงานเป็นนักออกแบบผลิตภัณฑ์ ในเวลาว่างผมชอบตระเวนคาเฟ่และปั่นจักรยาน ยินดีมากที่ได้พบทุกคน และตั้งตารอที่จะได้ทำกิจกรรมร่วมกันครับ",
      keyFocus: "สังเกตการเชื่อมเสียง: 'pleasure to meet you' และ 'looking forward to'"
    },
    roleplay: {
      scenario: "คุณกำลังอยู่ที่งาน Meetup นานาชาติ และพบกับ Taylor ซึ่งยืนอยู่คนเดียว",
      aiPersona: "Taylor (เพื่อนใหม่จากแคนาดา เป็นกันเอง ยิ้มแย้ม)",
      starterMessage: "Hey there! Looks like a great turnout today. I'm Taylor from Vancouver. What brings you to this event?",
      starterTranslation: "หวัดดีครับ! วันนี้คนมาเยอะอบอุ่นดีจัง ผมเทย์เลอร์จากแวนคูเวอร์ คุณมาร่วมงานนี้เพราะอะไรเหรอครับ?",
      checklist: ["แนะนำชื่อและงานของคุณ", "บอกว่าคุณสนใจอะไรในงานนี้", "ถามคำถามกลับหา Taylor เพื่อสานต่อบทสนทนา"]
    }
  },
  {
    day: 2,
    phase: 1,
    theme: "Coffee Shop & Custom Orders",
    themeTh: "สั่งกาแฟและเครื่องดื่มแบบปรับแต่งเฉพาะตัว",
    vocab: [
      { term: "Could I get a...", ipa: "/kʊd aɪ ɡet ə/", meaning: "ขอสั่ง...หน่อยครับ/ค่ะ (สุภาพและนิยมที่สุด)", example: "Could I get an iced Americano with oat milk, please?" },
      { term: "For here or to go?", ipa: "/fɔːr hɪər ɔːr tuː ɡoʊ/", meaning: "ทานนี่หรือนำกลับบ้าน?", example: "Would that be for here or to go today?" },
      { term: "Half-sweet", ipa: "/hæf swiːt/", meaning: "หวานน้อย (50%)", example: "Can I have my vanilla latte half-sweet?" },
      { term: "Dairy-free substitute", ipa: "/ˈdeəri friː ˈsʌbstɪtjuːt/", meaning: "ทางเลือกนมที่ไม่ใช่นมวัว (เช่น นมข้าวโอ๊ต นมอัลมอนด์)", example: "Do you have any dairy-free substitutes available?" },
      { term: "Keep the change", ipa: "/kiːp ðə tʃeɪndʒ/", meaning: "ไม่ต้องทอนครับ/ค่ะ (ให้เป็นทิป)", example: "Here is twenty dollars. Please keep the change!" }
    ],
    shadowing: {
      title: "Ordering Morning Brew with Nuance",
      script: "Hi good morning! Could I please get a large iced latte with oat milk, half-sweet? Oh, and could you make that to go? Thank you so much, keep the change!",
      translation: "สวัสดีตอนเช้าครับ! ขอดื่มลาเต้เย็นแก้วใหญ่นมโอ๊ต หวานน้อย แก้วหนึ่งครับ? อ้อ รบกวนใส่แก้วกลับบ้านด้วยนะครับ ขอบคุณมากครับ ไม่ต้องทอนนะ!",
      keyFocus: "จังหวะการลงเสียงท้ายประโยคคำถาม 'to go?' และความนุ่มนวลของ 'Could I please get...'"
    },
    roleplay: {
      scenario: "คุณแวะซื้อกาแฟที่คาเฟ่ยอดฮิตในนิวยอร์ก บาริสต้ากำลังรอรับออเดอร์",
      aiPersona: "Sam (บาริสต้าอารมณ์ดี พูดเร็วและกระฉับกระเฉง)",
      starterMessage: "Morning! Welcome to Blue Peak Cafe. What can I get started for you today?",
      starterTranslation: "อรุณสวัสดิ์ครับ! ยินดีต้อนรับสู่ Blue Peak Cafe วันนี้รับเครื่องดื่มอะไรดีครับ?",
      checklist: ["สั่งเครื่องดื่มพร้อมระบุขนาดและความหวาน", "ระบุว่าทานที่นี่หรือนำกลับ (for here or to go)", "ถามราคาหรือขอบคุณอย่างสุภาพ"]
    }
  },
  {
    day: 3,
    phase: 1,
    theme: "Asking Directions & Navigation",
    themeTh: "การถามทางและการเดินทางในเมือง",
    vocab: [
      { term: "Excuse me, how do I get to...", ipa: "/ɪkˈskjuːz miː haʊ duː aɪ ɡet tuː/", meaning: "ขอโทษนะครับ จะไป...ได้อย่างไร?", example: "Excuse me, how do I get to the nearest subway station?" },
      { term: "Within walking distance", ipa: "/wɪˈðɪn ˈwɔːkɪŋ ˈdɪstəns/", meaning: "อยู่ในระยะที่เดินถึงได้", example: "The museum is well within walking distance from here." },
      { term: "Head straight for two blocks", ipa: "/hed streɪt fɔːr tuː blɑːks/", meaning: "ตรงไปอีก 2 บล็อก/แยก", example: "Head straight for two blocks, then take a sharp right." },
      { term: "Can't miss it", ipa: "/kænt mɪs ɪt/", meaning: "หาเจอแน่นอน ไม่มีทางพลาด", example: "It has a huge neon sign, you really can't miss it!" },
      { term: "On the opposite side of", ipa: "/ɑːn ðiː ˈɑːpəzɪt saɪd ʌv/", meaning: "อยู่ฝั่งตรงข้ามกับ...", example: "The bank is on the opposite side of the avenue." }
    ],
    shadowing: {
      title: "Guiding a Lost Tourist",
      script: "Excuse me! Just head straight down this street for two blocks. Once you see the library, turn left. The metro station will be right across the street. You honestly can't miss it!",
      translation: "ขอโทษนะครับ! แค่ตรงไปตามถนนนี้อีก 2 บล็อก พอเห็นหอสมุดให้เลี้ยวซ้าย สถานีรถไฟใต้ดินจะอยู่ตรงข้ามถนนเลยครับ ไม่มีทางหลงแน่นอน!",
      keyFocus: "เน้นคำบุพบททิศทาง: 'straight down', 'turn left', 'across the street'"
    },
    roleplay: {
      scenario: "คุณกำลังเดินหลงทางในลอนดอนและแบตเตอรี่โทรศัพท์หมด จึงเข้าไปถามทางเจ้าหน้าที่ตำรวจ",
      aiPersona: "Officer Higgins (สุภาพ ใจเย็น ให้ข้อมูลชัดเจน)",
      starterMessage: "Good afternoon. You look a bit disoriented. Are you looking for a particular place, sir/ma'am?",
      starterTranslation: "สวัสดีตอนบ่ายครับ ดูเหมือนคุณกำลังสับสน กำลังมองหาสถานที่ไหนเป็นพิเศษหรือเปล่าครับ?",
      checklist: ["กล่าวขออภัยอย่างสุภาพและบอกจุดหมายที่ต้องการไป", "ถามว่าเดินไปได้ไหม หรือต้องนั่งรถไฟใต้ดิน", "ทวนเส้นทางสั้นๆ เพื่อความแน่ใจ"]
    }
  },
  // Day 7: Weekly Boss Battle 1
  {
    day: 7,
    phase: 1,
    theme: "⚔️ BOSS BATTLE 1: Survival Fluency Sprint",
    themeTh: "ทดสอบบอสสัปดาห์ที่ 1: การเอาตัวรอด 3 สถานการณ์รวด",
    vocab: [
      { term: "Would you mind...", ipa: "/wʊd juː maɪnd/", meaning: "คุณจะรังเกียจไหมถ้าจะ...", example: "Would you mind giving me a hand with this suitcase?" },
      { term: "I appreciate your help", ipa: "/aɪ əˈpriːʃieɪt jɔːr help/", meaning: "ขอบคุณในความช่วยเหลืออย่างยิ่ง", example: "Thank you so much, I truly appreciate your help." },
      { term: "Let me double-check", ipa: "/let miː ˈdʌbl tʃek/", meaning: "ขอผมตรวจเช็กซ้ำอีกรอบ", example: "Let me double-check the reservation details." }
    ],
    shadowing: {
      title: "Sprint Review: Fluid Conversation",
      script: "Excuse me, would you mind helping me for a second? I have a booking under Alex, but my phone battery just died. I really appreciate your patience while I find my passport.",
      translation: "ขอโทษนะครับ รบกวนช่วยสักครู่ได้ไหมครับ? ผมจองห้องไว้ในชื่ออเล็กซ์ แต่โทรศัพท์แบตหมด ขอบคุณมากที่กรุณารอสักครู่ระหว่างที่ผมหาพาสปอร์ตครับ",
      keyFocus: "ความต่อเนื่องของการพูดโดยไม่หยุดชะงัก (Speaking flow and linking)"
    },
    roleplay: {
      scenario: "โรงแรม 5 ดาว: เที่ยวบินดีเลย์ 4 ชั่วโมง คุณมาถึงเคาน์เตอร์เช็กอินตอนเที่ยงคืนและพาสปอร์ตอยู่ในกระเป๋าใบใหญ่",
      aiPersona: "Morgan (พนักงานฟรอนต์ของโรงแรมระดับลักชูรี)",
      starterMessage: "Good evening, welcome to The Grand Horizon. You must be tired from travel. May I have your name and reservation reference?",
      starterTranslation: "สวัสดีรอบดึกครับ ยินดีต้อนรับสู่ The Grand Horizon คุณคงเหนื่อยจากการเดินทาง ขอทราบชื่อและรหัสการจองด้วยครับ",
      checklist: ["แจ้งชื่อและอธิบายว่าทำไมมาเช็กอินดึก", "ขอน้ำดื่มหรือถามเกี่ยวกับอาหารเช้าพรุ่งนี้", "ขอบคุณสำหรับการต้อนรับ"]
    }
  },
  // Day 14: Boss Battle 2
  {
    day: 14,
    phase: 1,
    theme: "⚔️ BOSS BATTLE 2: The Emergency & Clarification Challenge",
    themeTh: "ทดสอบบอสสัปดาห์ที่ 2: การแก้ปัญหาเฉพาะหน้าและขอความชัดเจน",
    vocab: [
      { term: "What do you mean by that?", ipa: "/wʌt duː juː miːn baɪ ðæt/", meaning: "ความหมายคืออย่างไรหรือครับ? (ขอคำอธิบายเพิ่มเติม)", example: "Could you clarify what you mean by priority boarding?" },
      { term: "Is there any alternative?", ipa: "/ɪz ðeər ˈeni ɔːlˈtɜːrnətɪv/", meaning: "มีทางเลือกอื่นอีกไหมครับ?", example: "If this flight is fully booked, is there any alternative route?" },
      { term: "Could you rephrase that?", ipa: "/kʊd juː ˌriːˈfreɪz ðæt/", meaning: "ช่วยพูดอีกแบบให้ฟังหน่อยได้ไหมครับ?", example: "Sorry, could you rephrase that a bit more slowly?" }
    ],
    shadowing: {
      title: "Handling Confusion Calmly",
      script: "I apologize, but could you please rephrase that for me? My English is still improving, and I want to make sure I understand the flight transfer procedure correctly. Thank you for your patience!",
      translation: "ขออภัยครับ ช่วยอธิบายอีกแบบได้ไหมครับ? ภาษาอังกฤษของผมกำลังฝึกอยู่ อยากมั่นใจว่าเข้าใจขั้นตอนเปลี่ยนเครื่องถูกต้อง ขอบคุณที่ใจเย็นครับ!",
      keyFocus: "ความมั่นใจในการถามเมื่อฟังไม่ทัน ไม่ต้องกลัวที่จะขอให้พูดซ้ำ"
    },
    roleplay: {
      scenario: "สนามบินชิคาโก: ไฟลต์ต่อเครื่องยกเลิกเนื่องจากพายุหิมะ คุณต้องไปเจรจากับเจ้าหน้าที่สายการบินเพื่อขอตั๋วใหม่และที่พัก",
      aiPersona: "Agent Davis (เจ้าหน้าที่สายการบินที่งานยุ่งแต่พร้อมช่วยเหลือ)",
      starterMessage: "Next in line, please! Yes, I see your flight to Dallas was grounded due to weather. How can I assist you right now?",
      starterTranslation: "ท่านถัดไปครับ! ครับ ไฟลต์ไปดัลลัสถูกระงับจากสภาพอากาศ มีอะไรให้ผมช่วยเหลือตอนนี้ครับ?",
      checklist: ["สอบถามเที่ยวบินถัดไปที่เป็นไปได้เร็วที่สุด", "สอบถามเรื่องสิทธิ์ที่พักหรือคูปองอาหาร", "สรุปข้อตกลงเพื่อให้แน่ใจว่าไม่ตกหล่น"]
    }
  },
  // Day 30: Grand Phase 1 Finale
  {
    day: 30,
    phase: 1,
    theme: "🏆 PHASE 1 FINALE: 30-Day Foundation Mastery",
    themeTh: "การทดสอบจบเฟส 1: ประเมินคลังคำศัพท์และปฏิกิริยาตอบสนอง",
    vocab: [
      { term: "Without hesitation", ipa: "/wɪˈðaʊt ˌhezɪˈteɪʃn/", meaning: "โดยไม่ลังเล", example: "She answered all questions without hesitation." },
      { term: "To make oneself understood", ipa: "/tuː meɪk wʌnˈself ˌʌndərˈstʊd/", meaning: "สื่อสารให้คนอื่นเข้าใจความต้องการของเราได้", example: "Even with simple words, he can make himself understood." },
      { term: "Milestone achieved", ipa: "/ˈmaɪlstoʊn əˈtʃiːvd/", meaning: "บรรลุเป้าหมายก้าวสำคัญ", example: "Congratulations, you have a massive milestone achieved today!" }
    ],
    shadowing: {
      title: "Phase 1 Graduation Speech",
      script: "Thirty days ago, speaking this language felt daunting and unnatural. Today, I can introduce myself, navigate cities, order meals, and handle daily challenges with true confidence. This is just the beginning of my fluency journey!",
      translation: "30 วันก่อน การพูดภาษานี้รู้สึกยากและไม่เป็นธรรมชาติ แต่วันนี้ ฉันสามารถแนะนำตัว นำทาง สั่งอาหาร และแก้ปัญหาในชีวิตประจำวันได้อย่างมั่นใจ นี่เป็นเพียงจุดเริ่มต้นของการพูดคล่อง!",
      keyFocus: "พลังเสียง ความหนักแน่น และความภาคภูมิใจในความพยายาม"
    },
    roleplay: {
      scenario: "งานปาร์ตี้ขอบคุณผู้เข้าร่วมโปรเจกต์ 30 วัน คุณกำลังคุยกับโค้ชภาษาเกี่ยวกับพัฒนาการของคุณ",
      aiPersona: "Coach Elena (ผู้เชี่ยวชาญด้านภาษาศาสตร์ที่อบอุ่นและให้กำลังใจ)",
      starterMessage: "Congratulations on reaching Day 30! Looking back over the past month, what was the most rewarding moment for your speaking confidence?",
      starterTranslation: "ยินดีด้วยที่มาถึงวันที่ 30 ครับ! พอมองย้อนกลับไป 1 เดือนที่ผ่านมา อะไรคือช่วงเวลาที่คุณรู้สึกภูมิใจที่สุดในความมั่นใจของตัวเอง?",
      checklist: ["เล่าถึงเรื่องที่เคยยากในวันแรกๆ", "บอกถึงจุดที่คุณรู้สึกว่าทำได้ดีขึ้นมากแล้ว", "บอกเป้าหมายที่คุณอยากพิชิตในเฟส 2"]
    }
  },
  // Day 45: Phase 2 Midpoint
  {
    day: 45,
    phase: 2,
    theme: "Storytelling & Expressing Strong Opinions",
    themeTh: "การเล่าเรื่องในอดีตและการแสดงความคิดเห็นแบบมีน้ำหนัก",
    vocab: [
      { term: "From my perspective", ipa: "/frʌm maɪ pərˈspektɪv/", meaning: "ในมุมมองของฉันแล้ว...", example: "From my perspective, remote work increases productivity significantly." },
      { term: "It turns out that", ipa: "/ɪt tɜːrnz aʊt ðæt/", meaning: "ปรากฏว่า / เรื่องกลับกลายเป็นว่า...", example: "It turns out that the meeting was postponed until Friday." },
      { term: "To cut a long story short", ipa: "/tuː kʌt ə lɔːŋ ˈstɔːri ʃɔːrt/", meaning: "สรุปเรื่องราวให้สั้นๆ ก็คือ...", example: "To cut a long story short, we missed the train and had to take a cab." }
    ],
    shadowing: {
      title: "Sharing an Unexpected Incident",
      script: "You won't believe what happened yesterday! To cut a long story short, I was running late for my interview, and it turns out the interviewer was the very same person who helped me find my umbrella on the bus!",
      translation: "คุณจะไม่เชื่อแน่ว่าเมื่อวานเกิดอะไรขึ้น! สรุปสั้นๆ คือผมกำลังรีบไปสัมภาษณ์งาน ปรากฏว่าผู้สัมภาษณ์เป็นคนเดียวกับคนที่ช่วยผมหาร่มบนรถเมล์เป๊ะเลย!",
      keyFocus: "การเปลี่ยนน้ำเสียงแสดงความตื่นเต้น (Storytelling prosody)"
    },
    roleplay: {
      scenario: "คุณกำลังสนทนาในร้านกาแฟกับเพื่อนร่วมงานเกี่ยวกับข้อดีข้อเสียของ AI ในชีวิตประจำวัน",
      aiPersona: "Jordan (เพื่อนร่วมงานช่างคิด ชอบแลกเปลี่ยนประเด็นทันสมัย)",
      starterMessage: "Hey! I just read an article claiming AI will completely transform how we learn languages and work. What's your take on that?",
      starterTranslation: "เฮ้! เพิ่งอ่านบทความมาว่า AI จะเปลี่ยนวิธีเรียนภาษาและทำงานโดยสิ้นเชิง คุณมีความคิดเห็นยังไงกับเรื่องนี้บ้าง?",
      checklist: ["ใช้คำเชื่อมความคิดเห็น เช่น 'From my perspective' หรือ 'In my opinion'", "ยกตัวอย่างประกอบ 1 ตัวอย่าง", "ถามความคิดเห็นของ Jordan ต่อ"]
    }
  },
  // Day 60: Phase 2 Boss Battle
  {
    day: 60,
    phase: 2,
    theme: "⚔️ BOSS BATTLE 3: The Job Interview Simulation",
    themeTh: "ทดสอบบอสเฟส 2: การสัมภาษณ์งานมืออาชีพและการแก้ปัญหา",
    vocab: [
      { term: "Strengths and weaknesses", ipa: "/streŋkθs ænd ˈwiːknəsɪz/", meaning: "จุดแข็งและจุดที่ต้องพัฒนา", example: "My greatest strength is problem-solving under pressure." },
      { term: "Demonstrated track record", ipa: "/ˈdemənstreɪtɪd træk ˈrekərd/", meaning: "ประวัติผลงานที่พิสูจน์ได้จริง", example: "I have a demonstrated track record of leading creative campaigns." },
      { term: "Adaptable to change", ipa: "/əˈdæptəbl tuː tʃeɪndʒ/", meaning: "ปรับตัวเข้ากับการเปลี่ยนแปลงได้อย่างรวดเร็ว", example: "Our team is highly adaptable to sudden market shifts." }
    ],
    shadowing: {
      title: "Articulating Your Value Proposition",
      script: "Throughout my career, I have consistently demonstrated a strong ability to adapt to fast-paced environments. When faced with complex challenges, my focus is always on collaboration, data-driven decisions, and clear communication.",
      translation: "ตลอดการทำงานของฉัน ฉันได้พิสูจน์ความสามารถในการปรับตัวกับสภาพแวดล้อมที่เปลี่ยนแปลงเร็วเสมอ เมื่อเจอปัญหายากๆ ฉันเน้นความร่วมมือ การตัดสินใจด้วยข้อมูล และการสื่อสารที่ชัดเจน",
      keyFocus: "ความน่าเชื่อถือ น้ำเสียงมั่นคง ไหลลื่น ชัดถ้อยชัดคำ"
    },
    roleplay: {
      scenario: "การสัมภาษณ์งานกับหัวหน้าแผนกของบริษัทนานาชาติชั้นนำผ่านทางวิดีโอคอล",
      aiPersona: "Director Vance (ผู้จัดการฝ่ายสรรหาบุคลากร มุ่งมั่นและถามตรงประเด็น)",
      starterMessage: "Welcome to our interview. We reviewed your profile and were quite intrigued. Could you walk me through a major challenge you overcame recently?",
      starterTranslation: "ยินดีต้อนรับสู่การสัมภาษณ์ครับ เราตรวจดูประวัติของคุณแล้วรู้สึกน่าสนใจ ช่วยเล่าถึงความท้าทายสำคัญที่คุณเพิ่งก้าวผ่านมาได้ให้ฟังหน่อยครับ?",
      checklist: ["เล่าสถานการณ์ (Situation & Task)", "บอกสิ่งที่คุณลงมือแก้ (Action taken)", "สรุปผลลัพธ์ที่น่าประทับใจ (Result achieved)"]
    }
  },
  // Day 75: Phase 3 Advanced Debate
  {
    day: 75,
    phase: 3,
    theme: "Nuances, Humor & Diplomatic Disagreement",
    themeTh: "การใช้มุกตลก ชั้นเชิงภาษา และการเห็นต่างอย่างสุภาพ",
    vocab: [
      { term: "With all due respect", ipa: "/wɪð ɔːl djuː rɪˈspekt/", meaning: "ด้วยความเคารพอย่างยิ่ง (ใช้เปิดก่อนเห็นต่างอย่างสุภาพ)", example: "With all due respect, I believe our priority should be user safety." },
      { term: "Take it with a grain of salt", ipa: "/teɪk ɪt wɪð ə ɡreɪn ʌv sɔːlt/", meaning: "ฟังหูไว้หู / อย่าเพิ่งเชื่อทั้งหมด", example: "That rumor is everywhere, but I'd take it with a grain of salt." },
      { term: "Play devil's advocate", ipa: "/pleɪ ˈdevlz ˈædvəkət/", meaning: "ขอลองเสนออีกมุมมองหนึ่งที่ตรงกันข้าม (เพื่อทดสอบแนวคิด)", example: "Just to play devil's advocate, what happens if our budget gets slashed?" }
    ],
    shadowing: {
      title: "Disagreeing Diplomatically in a Meeting",
      script: "I completely see where you're coming from, Mark. However, just to play devil's advocate for a moment, have we considered the long-term sustainability of this approach? Perhaps there is middle ground we can explore.",
      translation: "ฉันเข้าใจมุมมองของคุณอย่างยิ่งครับมาร์ก แต่ถ้าขอลองเสนออีกมุมหนึ่งดู เราคำนึงถึงความยั่งยืนระยะยาวของวิธีนี้หรือยังครับ? บางทีอาจมีจุดร่วมตรงกลางที่เราสามารถลองดูได้",
      keyFocus: "น้ำเสียงประนีประนอม สุภาพแต่มั่นคง (Diplomatic tone)"
    },
    roleplay: {
      scenario: "การประชุมกลยุทธ์ประจำไตรมาส: เพื่อนร่วมงานเสนอให้ตัดงบดูแลลูกค้าเพื่อไปลงโฆษณา คุณต้องการเสนอแย้งอย่างสร้างสรรค์",
      aiPersona: "Sarah (ฝ่ายการตลาดที่มั่นใจในแผนงานของเธอมาก)",
      starterMessage: "I think we should shift 60% of our customer support budget directly into aggressive social ads next month. What are your thoughts on this strategy?",
      starterTranslation: "ฉันคิดว่าเราควรโยกงบ 60% ของฝ่ายดูแลลูกค้าไปทุ่มกับการยิงแอดโซเชียลเดือนหน้า คุณคิดยังไงกับกลยุทธ์นี้บ้าง?",
      checklist: ["แสดงความเข้าใจในเป้าหมายของอีกฝ่ายก่อน", "ใช้เทคนิค 'Play devil's advocate' เพื่อชี้ความเสี่ยง", "เสนอทางออกที่เป็น win-win ทั้งสองฝ่าย"]
    }
  },
  // Day 90: Grand Master Boss Battle
  {
    day: 90,
    phase: 3,
    theme: "👑 GRAND FINALE: 90-Day Fluency Master Quest",
    themeTh: "ศึกสุดท้ายวันที่ 90: บรรลุการสื่อสารภาษาอังกฤษอย่างคล่องแคล่ว",
    vocab: [
      { term: "Second nature", ipa: "/ˈsekənd ˈneɪtʃər/", meaning: "เป็นธรรมชาติเหมือนสัญชาตญาณที่สอง", example: "Thinking in English has genuinely become second nature to me." },
      { term: "Overcome barriers", ipa: "/ˌoʊvərˈkʌm ˈbæriərz/", meaning: "ก้าวข้ามทุกอุปสรรคและกำแพงกั้น", example: "Through persistence, I overcame all speaking barriers." },
      { term: "Lifelong journey", ipa: "/ˈlaɪflɔːŋ ˈdʒɜːrni/", meaning: "การเดินทางตลอดชีวิตที่ไม่สิ้นสุด", example: "Mastering a language is not a destination, but a rich lifelong journey." }
    ],
    shadowing: {
      title: "The 90-Day Victory Declaration",
      script: "Ninety days of dedication, showing up day after day, turning hesitation into habit, and fear into fluency. I have proven to myself that limits only exist in the mind. English is no longer a subject I study—it is a voice I live and think in!",
      translation: "90 วันแห่งความมุ่งมั่น ตั้งใจฝึกฝนวันแล้ววันเล่า เปลี่ยนความลังเลให้เป็นนิสัย และเปลี่ยนความกลัวเป็นความคล่องแคล่ว ฉันพิสูจน์ให้ตัวเองเห็นแล้วว่าขีดจำกัดมีแค่ในใจ ภาษาอังกฤษไม่ได้เป็นเพียงวิชาที่ต้องเรียนอีกต่อไป แต่เป็นเสียงที่ฉันใช้ชีวิตและคิดในใจ!",
      keyFocus: "ความคล่องระดับสูงสุด น้ำเสียงทรงพลัง สละสลวย และปลดปล่อยความมั่นใจเต็มที่"
    },
    roleplay: {
      scenario: "เวที TEDx Talks: คุณได้รับเชิญให้ขึ้นพูดสุนทรพจน์ 3 นาที เล่าถึงการเปลี่ยนชีวิตผ่านการพิชิตภาษาใหม่ใน 90 วัน",
      aiPersona: "Host Brian (พิธีกรเวทีระดับโลก อารมณ์ดีและตื่นเต้นกับการสัมภาษณ์คุณ)",
      starterMessage: "Ladies and gentlemen, welcome our keynote speaker who transformed their life through disciplined language immersion! Tell us, what was the secret that carried you across the 90-day finish line?",
      starterTranslation: "สุภาพบุรุษและสุภาพสตรี ขอต้อนรับวิทยากรของเราผู้เปลี่ยนชีวิตด้วยการฝึกฝนภาษาอย่างต่อเนื่อง! บอกพวกเราทีครับ อะไรคือความลับที่พาคุณข้ามเส้นชัย 90 วันนี้ได้?",
      checklist: ["ตอบอย่างมั่นใจ ไม่แปลในหัว", "แบ่งปันบทเรียนสำคัญที่ได้เรียนรู้เกี่ยวกับวินัย", "ส่งต่อแรงบันดาลใจให้คนอื่นๆ ที่กำลังเริ่มต้น"]
    }
  }
];

// ฟังก์ชันสร้างฐานข้อมูลภารกิจเต็ม 90 วันแบบไดนามิก (ครบทุกวัน 1 ถึง 90)
function generateFull90DayCurriculum() {
  const days = [];
  const knownTemplatesMap = new Map();
  CURRICULUM_DATA_TEMPLATES.forEach(t => knownTemplatesMap.set(t.day, t));

  // คลังหัวข้อหมุนเวียนสำหรับวันที่ไม่ได้ระบุเฉพาะ
  const genericThemes = [
    { theme: "Daily Commute & Public Transit", themeTh: "การเดินทางด้วยรถไฟฟ้า รถเมล์ และแท็กซี่" },
    { theme: "Doctor & Pharmacy Visit", themeTh: "พบแพทย์ ซื้อยา และอธิบายอาการป่วย" },
    { theme: "Shopping & Asking for Discounts", themeTh: "ซื้อของ ลองเสื้อผ้า และขอส่วนลด" },
    { theme: "Dining at Fine Restaurants", themeTh: "จองโต๊ะ สั่งอาหารจานพิเศษ และติชมบริการ" },
    { theme: "Tech Support & Device Trouble", themeTh: "แก้ปัญหาคอมพิวเตอร์และแจ้งปัญหาเน็ต" },
    { theme: "Fitness, Gym & Workout Routine", themeTh: "ฟิตเนส ออกกำลังกาย และดูแลโภชนาการ" },
    { theme: "Hotel Amenities & Special Requests", themeTh: "ขอบริการพิเศษในโรงแรมและแจ้งทำความสะอาด" },
    { theme: "Discussing Weather & Outdoor Plans", themeTh: "พยากรณ์อากาศและนัดหมายทริปเที่ยว" },
    { theme: "Bank & International Money Transfers", themeTh: "ธุรกรรมการเงิน แลกเงิน และเปิดบัญชี" },
    { theme: "Renting an Apartment & Landlord Chat", themeTh: "ติดต่อเช่าห้องพัก ตรวจสภาพห้อง และสัญญา" },
    { theme: "Workplace Emails & Instant Messaging", themeTh: "เขียนอีเมลประสานงานและแชตกับทีม" },
    { theme: "Expressing Agreement & Polite Pushback", themeTh: "การเห็นด้วยและการแย้งอย่างมีศิลปะ" },
    { theme: "Describing People & Personalities", themeTh: "อธิบายบุคลิก นิสัย และรูปร่างหน้าตา" },
    { theme: "Cooking Recipes & Food Culture", themeTh: "แลกเปลี่ยนสูตรทำอาหารและวัฒนธรรมการกิน" },
    { theme: "Travel Bucket List & Scenic Spots", themeTh: "เล่าสถานที่ท่องเที่ยวในฝันและประสบการณ์เที่ยว" }
  ];

  for (let day = 1; day <= 90; day++) {
    // กำหนด Phase
    const phase = day <= 30 ? 1 : day <= 60 ? 2 : 3;

    if (knownTemplatesMap.has(day)) {
      const item = knownTemplatesMap.get(day);
      days.push(formatCurriculumDay(item, day, phase));
    } else {
      // สร้างข้อมูลประจำวันตามหลักสูตรอัตโนมัติ
      const themeObj = genericThemes[(day - 1) % genericThemes.length];
      const isBoss = day % 7 === 0;

      const dynamicDay = {
        day: day,
        phase: phase,
        theme: isBoss ? `⚔️ BOSS BATTLE: Day ${day} Challenge` : themeObj.theme,
        themeTh: isBoss ? `ทดสอบความชำนาญประจำสัปดาห์ (Day ${day})` : themeObj.themeTh,
        vocab: generateSampleVocab(day, themeObj.theme),
        shadowing: {
          title: `Daily Speech Flow: ${themeObj.theme}`,
          script: `Mastering English during Day ${day} is all about consistency. Today we focus on ${themeObj.theme.toLowerCase()}. Practice with clarity, pronounce each syllable naturally, and notice how your confidence grows with every repetition.`,
          translation: `การฝึกภาษาในวันที่ ${day} หัวใจสำคัญคือความสม่ำเสมอ วันนี้เราเน้นเรื่อง ${themeObj.themeTh} ฝึกพูดให้ชัดเจนและเป็นธรรมชาติ คุณจะสัมผัสได้ถึงความมั่นใจที่เพิ่มขึ้นในทุกๆ วัน!`,
          keyFocus: `เน้นความชัดเจนของคำเชื่อมและน้ำเสียงที่เป็นธรรมชาติ`
        },
        roleplay: {
          scenario: `สถานการณ์จำลองวันที่ ${day}: สนทนาเรื่อง ${themeObj.themeTh} กับชาวต่างชาติ`,
          aiPersona: `Alex (คู่สนทนาภาษาอังกฤษที่เป็นกันเองและชวนคุยสนุก)`,
          starterMessage: `Hello there! Today we are practicing ${themeObj.theme}. How was your experience dealing with this topic recently?`,
          starterTranslation: `สวัสดีครับ! วันนี้เรามาฝึกเรื่อง ${themeObj.themeTh} กัน คุณมีประสบการณ์เกี่ยวกับเรื่องนี้เมื่อเร็วๆ นี้บ้างไหมครับ?`,
          checklist: [`ใช้คำศัพท์ใหม่ของวันนี้อย่างน้อย 2 คำ`, `ตอบกลับด้วยประโยคสมบูรณ์ 2-3 ประโยค`, `ถามคำถามกลับ 1 ข้อเพื่อสานต่อบทสนทนา`]
        }
      };

      days.push(formatCurriculumDay(dynamicDay, day, phase));
    }
  }

  return days;
}

function generateSampleVocab(day, theme) {
  const commonSets = [
    [
      { term: "Make a point of", ipa: "/meɪk ə pɔɪnt ʌv/", meaning: "ตั้งใจทำเป็นประจำ", example: "I make a point of speaking English for 15 minutes each day." },
      { term: "Get the hang of", ipa: "/ɡet ðə hæŋ ʌv/", meaning: "เริ่มเข้าใจวิธีทำ / เริ่มจับทางได้", example: "It took a few days, but I finally got the hang of shadowing." },
      { term: "On a daily basis", ipa: "/ɑːn ə ˈdeɪli ˈbeɪsɪs/", meaning: "เป็นประจำทุกวัน", example: "Listen to native podcasts on a daily basis." },
      { term: "Without further ado", ipa: "/wɪˈðaʊt ˈfɜːrðər əˈduː/", meaning: "ไม่ให้เป็นการเสียเวลา", example: "Without further ado, let's begin today's mission!" },
      { term: "Keep up the momentum", ipa: "/kiːp ʌp ðə moʊˈmentəm/", meaning: "รักษาแรงเหวี่ยงและความต่อเนื่องไว้", example: "You are doing great, keep up the momentum!" }
    ],
    [
      { term: "Look into something", ipa: "/lʊk ˈɪntuː/", meaning: "ตรวจสอบ / ค้นหาข้อมูลเพิ่มเติม", example: "I will look into that flight schedule tonight." },
      { term: "In the meantime", ipa: "/ɪn ðə ˈmiːntaɪm/", meaning: "ในระหว่างนี้ / ระหว่างที่รอ", example: "In the meantime, feel free to enjoy a cup of tea." },
      { term: "As far as I know", ipa: "/æz fɑːr æz aɪ noʊ/", meaning: "เท่าที่ฉันทราบ", example: "As far as I know, the store opens at nine in the morning." },
      { term: "Call it a day", ipa: "/kɔːl ɪt ə deɪ/", meaning: "พอแค่นี้สำหรับวันนี้ / เลิกงาน", example: "We finished our mission, so let's call it a day!" },
      { term: "Step out of comfort zone", ipa: "/step aʊt ʌv ˈkʌmfərt zoʊn/", meaning: "ก้าวออกจากกรอบความเคยชินเดิมๆ", example: "Speaking with strangers helps you step out of your comfort zone." }
    ]
  ];
  return commonSets[day % commonSets.length];
}

function formatCurriculumDay(item, day, phase) {
  return {
    day: day,
    phase: phase,
    theme: item.theme,
    themeTh: item.themeTh,
    quests: [
      {
        id: `m-${day}-1`,
        dayNumber: day,
        orderIndex: 1,
        type: "vocab_sprint",
        title: `Vocab Sprint: ${item.vocab.length} Essential Power Words`,
        titleTh: `ท่องศัพท์ความถี่สูง: ${item.vocab.length} คำหลักพร้อมประโยคจริง`,
        theme: item.theme,
        durationMinutes: 8,
        xpReward: 50,
        content: {
          items: item.vocab
        }
      },
      {
        id: `m-${day}-2`,
        dayNumber: day,
        orderIndex: 2,
        type: "shadowing_lab",
        title: item.shadowing.title,
        titleTh: `ห้องปฏิบัติการ Shadowing: ฟังและพูดตามทันที`,
        theme: item.theme,
        durationMinutes: 10,
        xpReward: 60,
        content: item.shadowing
      },
      {
        id: `m-${day}-3`,
        dayNumber: day,
        orderIndex: 3,
        type: "ai_roleplay",
        title: `AI Sandbox: ${item.roleplay.aiPersona.split(' ')[0]} Encounter`,
        titleTh: `จำลองสถานการณ์สนทนาสดกับ AI`,
        theme: item.theme,
        durationMinutes: 12,
        xpReward: 100,
        content: item.roleplay
      }
    ]
  };
}

// สร้างชุดข้อมูลทั้งหมด 90 วันพร้อมใช้งาน
const FULL_CURRICULUM = generateFull90DayCurriculum();

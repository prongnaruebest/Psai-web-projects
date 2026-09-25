# -*- coding: utf-8 -*-
import json

# Define the next 100 AI Monetization Prompts (201 - 300) across 10 new categories
new_money_prompts = []

# Categories 21-30 mapping
new_categories = [
    # Cat 21: Executive Ghostwriting (201-210)
    (21, "Executive Ghostwriting", "25,000 - 100,000 บ./ด.", "3-5 วัน", "Intermediate", ["Claude", "ChatGPT", "Grammarly"], [
        ("เขียนโพสต์ Thought Leadership บน LinkedIn ให้ผู้บริหาร", "Executive LinkedIn Ghostwriter", "ระบุวิสัยทัศน์หรือบทเรียนธุรกิจ เช่น การบริหารทีมในยุควิกฤต"),
        ("ร่างบทความความคิดเห็น (Op-Ed) เสนอสำนักข่าวธุรกิจ", "Op-Ed Columnist & Ghostwriter", "ระบุประเด็นสังคม/ธุรกิจ เช่น ผลกระทบของ AI ต่อแรงงาน"),
        ("เขียนหนังสืออัตชีวประวัติหรือบันทึกความทรงจำ (Memoir)", "Memoir & Biographer Ghostwriter", "ระบุช่วงเวลาชีวิตหรือจุดเปลี่ยนสำคัญ"),
        ("ร่างสุนทรพจน์สำหรับงานสัมมนาใหญ่ (Keynote Speech)", "Keynote Speechwriter", "ระบุธีมงาน เช่น นวัตกรรมแห่งอนาคต 2030"),
        ("เขียนจดหมายข่าวรายสัปดาห์ (Substack) ให้ CEO", "Executive Newsletter Ghostwriter", "ระบุอุตสาหกรรม เช่น พลังงานสะอาด, เทคโนโลยีสุขภาพ"),
        ("จัดทำหนังสือแถลงนโยบายองค์กร (Executive Manifesto)", "Corporate Manifesto Strategist", "ระบุค่านิยมและวิสัยทัศน์ 5 ปีของบริษัท"),
        ("เขียนชุดโพสต์ Twitter/X สร้าง Personal Brand ให้ผู้ก่อตั้ง", "Founder Personal Branding Ghostwriter", "ระบุหัวข้อ เช่น บทเรียนสร้างธุรกิจจากศูนย์สู่ 10 ล้าน"),
        ("ร่างแถลงการณ์สื่อสารภาวะวิกฤต (Crisis Communication)", "Crisis PR Communication Specialist", "ระบุสถานการณ์วิกฤต เช่น ปัญหาสินค้าชำรุด, ดราม่าโซเชียล"),
        ("เตรียมชุดคำตอบสัมภาษณ์รายการพอดแคสต์ให้ผู้บริหาร", "Executive Media Training Strategist", "ระบุรายการพอดแคสต์หรือคำถามยากๆ ที่น่าจะถูกถาม"),
        ("เขียนข้อความขอบคุณและสานสัมพันธ์ลูกค้ารายใหญ่ (VIP Letters)", "Executive Relationship Copywriter", "ระบุเหตุการณ์ เช่น ครบรอบสัญญา, เทศกาลปีใหม่")
    ]),

    # Cat 22: AI Stock Photography & Art Licensing (211-220)
    (22, "AI Stock Art & Licensing", "15,000 - 60,000 บ./ด.", "24-48 ชม.", "Beginner", ["Midjourney", "DALL-E 3", "Photoshop"], [
        ("สร้างชุดภาพถ่ายสต็อกสไตล์พาณิชย์สำหรับ Adobe Stock", "Commercial Stock Photo Director", "ระบุคอนเซปต์ เช่น การประชุมธุรกิจยุคใหม่, ครอบครัวอบอุ่น"),
        ("ออกแบบลวดลายไร้รอยต่อ (Seamless Pattern) สำหรับพิมพ์ผ้า", "Textile & Surface Pattern Designer", "ระบุสไตล์ เช่น ลายดอกไม้สีน้ำวินเทจ, ลายเรขาคณิตโมเดิร์น"),
        ("สร้างภาพ Mockup สินค้าเสมือนจริงสำหรับนักออกแบบ", "Product Mockup Art Director", "ระบุสินค้า เช่น ขวดเครื่องสำอางหรู, กล่องพัสดุแบรนด์"),
        ("ออกแบบชุดไอคอนเวกเตอร์ 3D สำหรับแอพพลิเคชันและเว็บ", "3D UI Asset Designer", "ระบุธีม เช่น ไอคอนฟินเทค, ไอคอนสุขภาพ"),
        ("สร้างภาพตัวละครและการ์ดเกมกระดาน (Board Game Assets)", "Game Concept Artist", "ระบุธีม เช่น แฟนตาซียุคกลาง, อวกาศไซไฟ"),
        ("ออกแบบภาพปกหนังสือนิยายระดับพรีเมียม (Book Cover Art)", "Book Cover Creative Director", "ระบุแนวเรื่อง เช่น สยองขวัญจิตวิทยา, โรแมนติกคอเมดี้"),
        ("สร้างภาพเรนเดอร์สถาปัตยกรรมและตกแต่งภายใน (ArchViz)", "Architectural Visualization Artist", "ระบุสไตล์ เช่น นอร์ดิกมินิมอล, ลอฟต์อินดัสเทรียล"),
        ("สร้างคลังวิดีโอ Footage B-Roll สั้นสำหรับขายสต็อก", "AI Video Footage Director", "ระบุฉาก เช่น หยดน้ำค้างบนใบไม้แบบ Macro, ไฟนีออนเมืองโตเกียว"),
        ("ออกแบบภาพลายสัก Flash Tattoo สำหรับขายช่างสัก", "Tattoo Flash Artist", "ระบุสไตล์ เช่น ลายเส้นมินิมอล, สไตล์ญี่ปุ่นโบราณ"),
        ("ออกแบบภาพประกอบหนังสือนิทานเด็กที่ตัวละครหน้าตาคงที่", "Children Book Illustrator", "ระบุตัวละคร เช่น กระต่ายน้อยใส่แว่นตาเสื้อสีแดง")
    ]),

    # Cat 23: Multilingual & Dubbing (221-230)
    (23, "Global Translation & Dubbing", "20,000 - 90,000 บ./ด.", "3-5 วัน", "Intermediate", ["ElevenLabs", "DeepL", "Whisper"], [
        ("ปรับสคริปต์วิดีโอเพื่อการพากย์เสียงข้ามภาษา (Lip-Sync Dubbing)", "Localization & Dubbing Director", "ระบุภาษา เช่น แปลจากคลิปสอนภาษาอังกฤษเป็นไทย"),
        ("กำกับการใช้เสียงพากย์ AI โคลนเสียงให้สมจริงมีอารมณ์", "AI Voice Acting Director", "ระบุอารมณ์ เช่น ตื่นเต้นเร้าใจ, สงบอบอุ่น"),
        ("แปลและถอดความการ์ตูนมังงะ/คอมิกส์พร้อมคำอุทานเสียง (SFX)", "Comic & Manga Localization Specialist", "ระบุประเภทการ์ตูน"),
        ("ตรวจทานและเกลาสำนวนหนังสือนิยายแปลต่างประเทศ", "Literary Translation Editor", "ระบุแนววรรณกรรม"),
        ("สร้างและจัดจังหวะคำบรรยาย Subtitle แบบสองภาษา", "Subtitling & Timing Specialist", "ระบุวิดีโอและภาษาคู่"),
        ("เขียนสคริปต์บรรยายเสียง Audio Guide สำหรับพิพิธภัณฑ์และท่องเที่ยว", "Museum & Tourism Audio Scriptwriter", "ระบุสถานที่ เช่น วัดพระแก้ว, แกลเลอรีศิลปะ"),
        ("แปลและแปลงเนื้อหาคอร์สเรียนออนไลน์สำหรับตลาดอินเตอร์", "Global E-Learning Localization Specialist", "ระบุเนื้อหาคอร์ส"),
        ("สร้างเสียงนิทานก่อนนอนหลายภาษาพร้อมดนตรีประกอบ", "Multilingual Bedtime Story Producer", "ระบุชื่อเรื่องและภาษาเป้าหมาย"),
        ("แปลบทสนทนาตัวละครในเกมให้อารมณ์เข้าถึงผู้เล่นท้องถิ่น", "Video Game Localization Writer", "ระบุสไตล์เกม เช่น RPG ย้อนยุค"),
        ("ตรวจสอบความถูกต้องของเอกสารธุรกิจสองภาษา", "Business Document Localization Editor", "ระบุเอกสาร เช่น สัญญาความร่วมมือ, คู่มือพนักงาน")
    ]),

    # Cat 24: Custom Sales Chatbots (231-240)
    (24, "Sales & Support Chatbots", "30,000 - 120,000 บ./ด.", "1-2 สัปดาห์", "Intermediate", ["ChatGPT API", "Voiceflow", "Botpress"], [
        ("ออกแบบ System Prompt สำหรับแชทบอทแนะนำอสังหาริมทรัพย์", "Real Estate AI Consultant", "ระบุประเภทโครงการ เช่น คอนโดแนวรถไฟฟ้า, บ้านเดี่ยวหรู"),
        ("สร้างแชทบอทนัดหมายแพทย์และบริการคลินิกความงาม", "Healthcare & Clinic AI Bot Designer", "ระบุบริการ เช่น เลเซอร์ผิวพรรณ, ปลูกผม"),
        ("ออกแบบแชทบอทคัดกรองลูกค้าราคาสูง (High-Ticket Qualifier)", "B2B Sales Qualification Bot Architect", "ระบุเกณฑ์ เช่น งบประมาณเกิน 100,000 บาท"),
        ("สร้างแชทบอททวงตะกร้าสินค้าค้างผ่าน Line OA / Messenger", "E-Commerce Recovery Bot Specialist", "ระบุร้านค้าและโปรโมชั่นส่วนลดพิเศษ"),
        ("ออกแบบแชทบอทรับออเดอร์ร้านอาหารและจัดการคิว", "Restaurant Operations AI Specialist", "ระบุเมนูเด่นและระบบจองโต๊ะ"),
        ("เขียน Prompt แชทบอทตอบคำถามลูกค้าแบบไร้ภาพหลอน (Zero Hallucination)", "Knowledge Base AI Bot Engineer", "ระบุคู่มือสินค้าหรือนโยบายบริษัท"),
        ("สร้างบอทตอบคำถามประกันภัยและคำนวณเบี้ยประกันจำลอง", "Insurance Advisor AI Architect", "ระบุแผนประกัน เช่น ประกันสุขภาพเหมาจ่าย"),
        ("ออกแบบแชทบอทประเมินราคารถยนต์มือสองหรือแลกเทิร์น", "Automotive Trade-in AI Bot Expert", "ระบุข้อมูลรถที่ต้องประเมิน"),
        ("สร้างแชทบอทโค้ชติดตามเป้าหมายออกกำลังกายและลดน้ำหนัก", "Fitness Accountability AI Coach", "ระบุโปรแกรม เช่น คุมอาหาร IF, เวทเทรนนิ่ง"),
        ("ออกแบบแชทบอทผู้ช่วยส่วนตัวระดับ VIP สำหรับสมาชิกระดับบน", "VIP Concierge AI Prompt Architect", "ระบุสิทธิพิเศษของคลับหรือโรงแรมหรู")
    ]),

    # Cat 25: AI Podcasting & Audio (241-250)
    (25, "AI Podcasting & Audio", "15,000 - 80,000 บ./ด.", "3-7 วัน", "Beginner", ["ElevenLabs", "Descript", "Suno"], [
        ("เขียนสคริปต์พอดแคสต์คดีฆาตกรรมปริศนา (True Crime)", "True Crime Podcast Producer", "ระบุคดีหรือเหตุการณ์ลึกลับในอดีต"),
        ("เขียนสคริปต์สารคดีเสียงเจาะลึกบุคคลระดับโลก", "Documentary Audio Narrative Writer", "ระบุบุคคล เช่น Steve Jobs, Leonardo da Vinci"),
        ("เขียนสคริปต์สรุปข่าวเทคโนโลยีประจำวันความยาว 5 นาที", "Daily Tech News Audio Producer", "ระบุประเด็นข่าวร้อนรอบวัน"),
        ("เขียนบทเสียงนำสมาธิฝึกสติและการหายใจเพื่อผ่อนคลาย", "Mindfulness Meditation Scriptwriter", "ระบุเป้าหมาย เช่น ลดความเครียด, คลายวิตกกังวล"),
        ("เขียนบทนิทานกล่อมนอนเสริมสร้างจินตนาการพร้อมระบุจังหวะเสียงดนตรี", "Bedtime Audio Story Architect", "ระบุแนวแฟนตาซีผจญภัยในป่าเวทมนตร์"),
        ("ดัดแปลงวรรณกรรมคลาสสิกเป็นละครวิทยุเสียงสมจริง (Audio Drama)", "Audio Drama Script Adaptor", "ระบุชื่อวรรณกรรม เช่น เชอร์ล็อก โฮล์มส์"),
        ("เขียนบทบรรยายปรัชญาและข้อคิดยามเช้าสร้างพลังใจ", "Philosophical Audio Essayist", "ระบุหัวข้อ เช่น ความกล้าหาญในการล้มเหลว"),
        ("สร้างสคริปต์จำลองบทสัมภาษณ์บุคคลในประวัติศาสตร์", "Historical Interview Audio Producer", "ระบุบุคคล เช่น ไอน์สไตน์, พระนางคลีโอพัตรา"),
        ("เขียนบทเรียนสอนภาษาอังกฤษผ่านการฟังบทสนทนาสมจริง", "Conversational Language Audio Lesson Designer", "ระบุสถานการณ์ เช่น การสั่งอาหารในภัตตาคารหรู"),
        ("เขียนสคริปต์เรื่องเล่าแนว ASMR กระซิบเล่าเรื่องช่วยให้นอนหลับลึก", "ASMR Sleep Story Specialist", "ระบุบรรยากาศ เช่น นั่งข้างหน้าต่างในคืนฝนตก")
    ]),

    # Cat 26: Paid Media & Ad Optimization (251-260)
    (26, "Paid Media & Ad Campaigns", "30,000 - 150,000 บ./ด.", "3-5 วัน", "Intermediate", ["Meta Ads", "Google Ads", "TikTok Ads"], [
        ("เขียนชุดก๊อปปี้โฆษณา Facebook 5 มุมมองทดสอบหา Creative แตก", "Direct Response Ad Copywriter", "ระบุสินค้า เช่น เวย์โปรตีน, ครีมกันแดด"),
        ("เขียนพาดหัวและข้อความโฆษณา Google Search Ads อัตราคลิกสูง", "Google Search Ads Specialist", "ระบุบริการ เช่น ซ่อมหลังคารั่ว, ทนายความคดีแพ่ง"),
        ("ร่างบรีฟจ้างดาว TikTok ทำคลิป UGC ป้ายยาที่คนดูไม่ปัดทิ้ง", "TikTok UGC Creative Director", "ระบุสินค้าและข้อห้ามในการพูด"),
        ("เขียนสคริปต์โฆษณา YouTube In-Stream สูตรหยุดปุ่มกดข้าม 5 วินาที", "YouTube Video Ad Strategist", "ระบุคอร์สเรียนหรือซอฟต์แวร์ B2B"),
        ("วิเคราะห์แก้ปัญหาโฆษณาอ่อนล้า (Ad Fatigue) และคิดมุมโฆษณาใหม่", "Creative Fatigue Optimization Expert", "ระบุแคมเปญเดิมที่ยอดเริ่มตก"),
        ("เขียนข้อความโฆษณา Retargeting เจาะจงคนที่เคยเข้าชมเว็บไซต์", "Dynamic Retargeting Ad Copywriter", "ระบุสินค้าที่ดูค้างไว้"),
        ("ออกแบบคำถาม Lead Form บน Facebook ให้ได้เบอร์ติดต่อที่มีคุณภาพ", "Lead Generation Ad Specialist", "ระบุธุรกิจ เช่น สถาบันสอนพิเศษ, ขายรถยนต์"),
        ("สร้างตารางคำนวณและวางแผนงบประมาณยิงแอดหาจุดคุ้มทุน (Target ROAS)", "Paid Media Financial Planner", "ระบุยอดขายเป้าหมายและต้นทุนสินค้า"),
        ("เขียนพาดหัวโฆษณา Native Ads ดักทราฟฟิกบนเว็บข่าวชั้นนำ", "Native Advertising Copywriter", "ระบุสินค้าเพื่อสุขภาพหรือการเงิน"),
        ("จัดทำบรีฟส่งให้ Influencer ยิงแอดแบบ Spark Ads เพิ่มยอดเข้าถึง", "Influencer Paid Partnership Coordinator", "ระบุข้อความสำคัญและสิ่งที่ต้องทำในคลิป")
    ]),

    # Cat 27: Indie Game Dev & Game Assets (261-270)
    (27, "Game Dev & Digital Assets", "20,000 - 100,000 บ./ด.", "2-4 สัปดาห์", "Intermediate", ["Unity", "Unreal Engine", "Godot"], [
        ("ออกแบบโครงข่ายบทสนทนาแตกกิ่ง (Branching Dialogue Tree)", "Game Narrative Designer", "ระบุธีมเกม เช่น สืบสวนไซเบอร์พังก์"),
        ("เขียนเควสต์และคำบรรยายไอเทมในเกม RPG สไตล์แฟนตาซี", "RPG Quest & Item Lore Writer", "ระบุระดับความยากและของรางวัล"),
        ("สร้างคัมภีร์ข้อมูลโลกในเกมและประวัติศาสตร์ (Worldbuilding Bible)", "Worldbuilding & Lore Architect", "ระบุชนเผ่า ภูมิประเทศ และระบบเวทมนตร์"),
        ("ออกแบบระบบเศรษฐกิจและค่าเงินในเกมไม่ให้เกิดเงินเฟ้อ", "Game Economy Balancing Specialist", "ระบุประเภทเกม เช่น เกมทำฟาร์ม, เกม MMO"),
        ("สร้างคาแรคเตอร์และบทพูด NPC ที่มีนิสัยเฉพาะตัวไม่ซ้ำใคร", "NPC Character Designer", "ระบุบทบาท เช่น พ่อค้าหน้าเลือด, อัศวินชรา"),
        ("ออกแบบกลไกปริศนาในเกมและลำดับความยากของด่าน", "Puzzle Level Design Specialist", "ระบุประเภทปริศนา เช่น ปริศนากลไกแสง, รหัสตัวเลข"),
        ("เขียนข้อความหน้า Steam Store Page และสคริปต์ตัวอย่างเกม", "Steam Page Marketing Strategist", "ระบุชื่อเกมและฟีเจอร์เด่น"),
        ("จัดทำเอกสารข้อกำหนดการสร้างเกมฉบับสมบูรณ์ (Game Design Document - GDD)", "Lead Game Producer", "ระบุแกนหลักการเล่น (Core Gameplay Loop)"),
        ("ออกแบบ Mood Board ดนตรีและเสียงประกอบฉากในเกม", "Game Audio Director", "ระบุบรรยากาศฉาก เช่น ดันเจี้ยนใต้ดินอันมืดมิด"),
        ("ออกแบบ Flow สิ่งกีดขวางในเกมวิ่งตะลุยด่าน (Platformer)", "Platformer Level Flow Designer", "ระบุทักษะการกระโดดของตัวละคร")
    ]),

    # Cat 28: Paid Newsletter & Substack (271-280)
    (28, "Paid Newsletters & Substack", "20,000 - 150,000 บ./ด.", "1-2 สัปดาห์", "Beginner", ["Substack", "Beehiiv", "ConvertKit"], [
        ("เขียนสรุปข่าวเชิงลึกเฉพาะกลุ่มประจำสัปดาห์ (Niche Digest)", "Curated Newsletter Editor", "ระบุแวดวง เช่น สตาร์ทอัพเทคโนโลยีชีวภาพ"),
        ("เขียนบทความวิจัยเชิงลึกหลัง Paywall ที่คนยอมจ่ายเงินอ่าน", "Premium Research Newsletter Writer", "ระบุหัวข้อ เช่น เจาะลึกอุตสาหกรรมชิปประมวลผล"),
        ("เขียนอีเมลเปลี่ยนผู้อ่านฟรีให้กลายเป็นสมาชิกรายเดือน (Free to Paid)", "Newsletter Monetization Strategist", "ระบุสิทธิพิเศษของสมาชิกระดับ VIP"),
        ("ออกแบบระบบสะสมแต้มแนะนำเพื่อน (Referral Program) ดึงดูดสมาชิก", "Newsletter Referral Loop Architect", "ระบุของรางวัล เช่น สรุปหนังสือพิเศษ, สติกเกอร์"),
        ("จัดทำ Media Kit และตารางแพ็กเกจสปอนเซอร์โฆษณาในจดหมายข่าว", "Newsletter Advertising Sales Director", "ระบุจำนวนผู้ติดตามและ Open Rate"),
        ("เขียนชุดอีเมลต้อนรับสมาชิกใหม่ 3 ฉบับสร้างความประทับใจแรก", "Subscriber Onboarding Email Copywriter", "ระบุแนวคิดของจดหมายข่าว"),
        ("ออกแบบแบบสอบถามสำรวจความต้องการผู้อ่านเพื่อเปิดบริการเสริม", "Subscriber Research & Feedback Specialist", "ระบุเป้าหมาย เช่น ต้องการเปิดคอร์สหรือจัดสัมมนา"),
        ("ร่างจดหมายชวนนักเขียน Newsletter ท่านอื่นทำ Cross-Promotion", "Newsletter Partnership Coordinator", "ระบุกลุ่มผู้อ่านที่คล้ายกัน"),
        ("เขียนแคมเปญเสนอส่วนลดค่าสมาชิกรายปีในช่วงเทศกาล (Flash Sale)", "Annual Subscription Promo Copywriter", "ระบุข้อเสนอ เช่น ลด 30% สำหรับ 50 ท่านแรก"),
        ("เขียนชุดอีเมลดึงสมาชิกที่กดยกเลิกให้กลับมาสมัครใหม่ (Win-Back)", "Subscriber Retention & Win-Back Specialist", "ระบุเนื้อหาใหม่ที่เพิ่มเข้ามา")
    ]),

    # Cat 29: Deal Sourcing & Brokering (281-290)
    (29, "Deal Sourcing & Matchmaking", "50,000 - 500,000+ บ./ดีล", "2-4 สัปดาห์", "Advanced", ["LinkedIn Sales Nav", "Perplexity", "Excel"], [
        ("เขียนจดหมายทักหาเจ้าของที่ดินหรืออสังหาฯ นอกตลาด (Off-Market Offer)", "Off-Market Real Estate Acquisition Specialist", "ระบุทำเลที่ต้องการซื้อ"),
        ("ร่างบันทึกข้อเสนอเข้าซื้อกิจการ SME (Acquisition Memo)", "M&A Deal Sourcing Consultant", "ระบุประเภทธุรกิจ เช่น ธุรกิจโรงพิมพ์, แบรนด์เครื่องสำอาง"),
        ("เขียนเอกสารเสนอขายสต็อกสินค้าลดล้างสต็อกให้นายทุน (Liquidation Pitch)", "Inventory Liquidation Broker", "ระบุประเภทสินค้าและมูลค่าส่วนลด"),
        ("เขียนข้อความแนะนำสตาร์ทอัพให้นักลงทุน Angel Investor นัดพบ", "Startup Investor Relations Specialist", "ระบุจุดเด่นและยอดเติบโต"),
        ("เขียนข้อความทาบทามผู้บริหารระดับสูงย้ายงาน (Executive Headhunting)", "Executive Search Consultant", "ระบุตำแหน่งงานและแพ็กเกจผลตอบแทน"),
        ("เขียนข้อเสนอจับคู่แบรนด์กับอินฟลูเอนเซอร์เพื่อแคมเปญใหญ่", "Sponsorship Matchmaking Broker", "ระบุแบรนด์สินค้าและครีเอเตอร์เป้าหมาย"),
        ("ร่างข้อตกลงจับมือเป็นพันธมิตรทางธุรกิจร่วมกัน (Joint Venture Proposal)", "Strategic Alliance Consultant", "ระบุผลประโยชน์ร่วมกันของทั้งสองฝ่าย"),
        ("เขียนข้อเสนอจัดงานสัมมนาออนไลน์ร่วมกันระหว่างสองบริษัท (Co-Webinar)", "Co-Marketing Partnership Manager", "ระบุหัวข้อสัมมนาและกลุ่มเป้าหมาย"),
        ("เขียนข้อความเชิญชวน Top Affiliate ให้มาร่วมโปรโมตสินค้าใหม่", "Affiliate Recruiter & Network Director", "ระบุค่าคอมมิชชันและรางวัลพิเศษ"),
        ("ร่างจดหมายเสนอขายทรัพย์สินหรูส่วนบุคคล (รถโบราณ/งานศิลปะ)", "Luxury Asset Private Broker", "ระบุประวัติและความหายากของทรัพย์สิน")
    ]),

    # Cat 30: Enterprise AI Transformation (291-300)
    (30, "Enterprise AI Consulting", "50,000 - 300,000+ บ./ด.", "2-4 สัปดาห์", "Advanced", ["OpenAI Enterprise", "Microsoft Copilot", "Zapier"], [
        ("จัดทำคู่มือนโยบายการใช้ AI ในองค์กรอย่างปลอดภัย (AI Usage Policy)", "Corporate AI Governance Consultant", "ระบุข้อมูลความลับที่ห้ามกรอก"),
        ("วางแผน Roadmap การนำเครื่องมือ AI มาใช้ในแต่ละแผนกของบริษัท", "Digital Transformation Director", "ระบุแผนกเป้าหมาย เช่น ฝ่ายบุคคล, ฝ่ายขาย, ฝ่ายจัดซื้อ"),
        ("ออกแบบระบบคัดแยกและตอบเคสลูกค้าอัตโนมัติลดภาระทีมซัพพอร์ต", "Customer Operations Automation Architect", "ระบุประเภทคำร้องเรียนที่พบบ่อย"),
        ("ออกแบบ Workflow ช่วยทีมขายสรุปการประชุมและบันทึก CRM อัตโนมัติ", "Sales Enablement AI Consultant", "ระบุระบบ CRM ที่ใช้ เช่น HubSpot, Salesforce"),
        ("กำหนดเกณฑ์ AI สแกนคัดกรองเรซูเม่ผู้สมัครงานอย่างเป็นธรรม", "HR Talent Acquisition AI Strategist", "ระบุตำแหน่งและเกณฑ์คุณสมบัติหลัก"),
        ("จัดทำพิมพ์เขียวระบบสรุปงบการเงินและตรวจจับความผิดปกติด้วย AI", "Financial Operations AI Consultant", "ระบุรูปแบบรายงานประจำเดือน"),
        ("ออกแบบขั้นตอนตรวจทานสัญญาทางกฎหมายเบื้องต้นด้วย AI ก่อนส่งทนาย", "Legal Tech Workflow Consultant", "ระบุประเภทสัญญา เช่น สัญญาจ้างบริการ, ข้อตกลง NDA"),
        ("สร้างระบบสรุปการประชุมและดึงรายการสิ่งที่ต้องทำ (Action Items) อัตโนมัติ", "Meeting Productivity AI Architect", "ระบุรูปแบบการประชุม เช่น ประชุมอัปเดตสปรินต์"),
        ("เขียนบันทึกสื่อสารการเปลี่ยนแปลงเพื่อลดความกลัวพนักงานต่อ AI", "Organizational Change Management Specialist", "ระบุแนวทางการพัฒนาทักษะพนักงาน"),
        ("จัดทำ Executive Dashboard วัดผลความคุ้มค่า (ROI) จากการใช้ AI ในองค์กร", "Chief AI Officer (CAIO) Advisor", "ระบุชั่วโมงทำงานที่ประหยัดได้และต้นทุนที่ลดลง")
    ])
]

prompt_id_counter = 201
for cat_id, cat_name, income, timeframe, difficulty, tools, items in new_categories:
    for title, role, var_ph in items:
        p_obj = {
            "id": prompt_id_counter,
            "mode": "money",
            "categoryId": cat_id,
            "categoryName": cat_name,
            "title": title,
            "role": role,
            "prompt": f"คุณคือ {role}\nฉันต้องการสร้างผลงานระดับมืออาชีพที่สามารถสร้างรายได้หรือปิดดีลได้จริงในหัวข้อ [{var_ph}]\nเป้าหมายทางธุรกิจ: [ระบุเป้าหมาย เช่น สร้างรายได้ทันที, ประหยัดเวลา 80%, ปิดการขายลูกค้าระดับองค์กร]\nจงสร้างผลงานฉบับสมบูรณ์พร้อมใช้:\n1. ร่างเนื้อหาที่มีโครงสร้างระดับพรีเมียม ไร้คำฟุ่มเฟือย มีพลังจูงใจ\n2. ขั้นตอนการลงมือทำแบบ Step-by-Step ที่ทำตามได้ทันที\n3. Checklist ตรวจสอบความถูกต้องและคุณภาพก่อนส่งมอบงาน\n4. คำแนะนำเทคนิคเพิ่มเติมสำหรับการต่อยอดสร้างรายได้ซ้ำ (Recurring Income)",
            "variables": [var_ph, "ระบุเป้าหมาย เช่น สร้างรายได้ทันที"],
            "income": income,
            "timeframe": timeframe,
            "difficulty": difficulty,
            "tools": tools
        }
        new_money_prompts.append(p_obj)
        prompt_id_counter += 1

print(f"Generated {len(new_money_prompts)} additional AI Monetization prompts (IDs 201-300)!")

# Load existing 200 prompts
with open('web_prompts_100.json', 'r', encoding='utf-8') as f:
    existing_prompts = json.load(f)

# Combine: 100 Web Dev (1-100) + 100 Money Part 1 (101-200) + 100 Money Part 2 (201-300) = 300 Prompts!
all_300_prompts = existing_prompts + new_money_prompts

print(f"Total Combined Prompts: {len(all_300_prompts)} (Web: 100, Money: 200)")

with open('web_prompts_100.json', 'w', encoding='utf-8') as f:
    json.dump(all_300_prompts, f, ensure_ascii=False, indent=2)

# Also save standalone 200 Money Prompts file
money_200 = [p for p in all_300_prompts if p.get('mode') == 'money']
with open('ai_money_prompts_200.json', 'w', encoding='utf-8') as f:
    json.dump(money_200, f, ensure_ascii=False, indent=2)

# Generate updated Markdown file for the 200 Money Prompts
md_lines = [
    "# 💰 200 สุดยอด Prompts สำหรับใช้ AI หาเงินและสร้างธุรกิจ (AI Monetization Master Guide)",
    "> **คลังรวม 200 โปรมป์ต์ระดับโปรสำหรับการสร้างรายได้จริง ครอบคลุม 20 ช่องทางธุรกิจดิจิทัล**",
    "> พร้อมโครงสร้าง R-T-C-F, ระดับความยาก, ศักยภาพรายได้, และเครื่องมือแนะนำครบถ้วน\n",
    "---"
]

current_cid = None
for p in money_200:
    cid = p['categoryId']
    if cid != current_cid:
        current_cid = cid
        md_lines.append(f"\n## หมวดหมู่: {p['categoryName']} (หมวดที่ {cid})")
        md_lines.append(f"**ศักยภาพรายได้**: `{p.get('income', '-')}` | **ความเร็ว**: `{p.get('timeframe', '-')}` | **ระดับ**: `{p.get('difficulty', '-')}`\n")
    
    md_lines.append(f"### #{p['id']} {p['title']}")
    md_lines.append(f"**บทบาท AI**: `{p['role']}`")
    if p.get('tools'):
        md_lines.append(f"**เครื่องมือแนะนำ**: {', '.join(p['tools'])}\n")
    md_lines.append("```markdown")
    md_lines.append(p['prompt'])
    md_lines.append("```\n")

with open('ai_money_prompts_200_collection.md', 'w', encoding='utf-8') as f:
    f.write("\n".join(md_lines))

print("Successfully generated ai_money_prompts_200_collection.md and updated web_prompts_100.json!")

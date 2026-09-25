# -*- coding: utf-8 -*-
import json
import re

prompts = [
    # หมวดที่ 1: Digital Products & Templates (1-10)
    {
        "id": 101, "mode": "money", "categoryId": 11, "categoryName": "Digital Products",
        "title": "วางโครงสร้างและเขียน E-Book สร้างรายได้ใน 24 ชั่วโมง",
        "role": "Bestselling Digital Author & Product Strategist",
        "prompt": "คุณคือ Bestselling Digital Author & Product Strategist\nจงช่วยฉันสร้างโครงร่างและเนื้อหาสำหรับ E-Book ดิจิทัลที่ขายได้จริงในหัวข้อ [ระบุหัวข้อ เช่น เทคนิคการใช้ AI ลดเวลาทำงาน 80% หรือ คู่มือจัดพอร์ตการเงินฉบับมือใหม่]\nกลุ่มเป้าหมาย: [ระบุกลุ่มเป้าหมาย เช่น ฟรีแลนซ์, พนักงานออฟฟิศ]\nสิ่งที่ต้องการ:\n1. ชื่อเรื่องหลัก (Title) และชื่อรอง (Subtitle) ที่สะดุดตาและกระตุ้นความอยากซื้อ 5 แบบ\n2. โครงสร้างสารบัญ 7 บทแบบ Step-by-Step ที่พาผู้อ่านจาก Pain Point ไปสู่ผลลัพธ์ที่จับต้องได้\n3. โครงร่างเนื้อหาแบบละเอียดของบทที่ 1 พร้อมเทคนิค Actionable Checklist ท้ายบท\n4. แผนการตั้งราคา (Price Tiering) สำหรับขายไฟล์ PDF, Notion Template แถม และ Video Walkthrough",
        "variables": ["ระบุหัวข้อ เช่น เทคนิคการใช้ AI ลดเวลาทำงาน 80%", "ระบุกลุ่มเป้าหมาย เช่น ฟรีแลนซ์, พนักงานออฟฟิศ"]
    },
    {
        "id": 102, "mode": "money", "categoryId": 11, "categoryName": "Digital Products",
        "title": "ออกแบบและสร้าง Notion Template สำหรับวางขาย",
        "role": "Notion Certified Creator & Product Architect",
        "prompt": "คุณคือ Notion Certified Creator & Product Architect\nฉันต้องการสร้าง Notion Template เพื่อนำไปวางขายบน Gumroad / Etsy ในหัวข้อ [ระบุ เช่น ระบบบริหารจัดการธุรกิจ SME, Dashboard ติดตามเป้าหมายชีวิตและสุขภาพ]\n1. ออกแบบสถาปัตยกรรมฐานข้อมูล (Database Architecture) และความสัมพันธ์ของ Databases ที่จำเป็น (Relations, Rollups, Formulas)\n2. รายการมุมมอง (Views) ที่ต้องมี เช่น Kanban Board, Calendar, Gallery, Table พร้อม Filter logic\n3. โครงสร้าง Dashboard หน้าแรก (Home Hub) ให้สวยงาม ใช้งานง่าย และไม่ซับซ้อน\n4. ข้อความ Copywriting สำหรับหน้าขายสินค้าบน Gumroad รวมถึง Bullet Points จุดเด่น และ FAQ",
        "variables": ["ระบุ เช่น ระบบบริหารจัดการธุรกิจ SME"]
    },
    {
        "id": 103, "mode": "money", "categoryId": 11, "categoryName": "Digital Products",
        "title": "สร้างชุด Prompt Pack คุณภาพสูงสำหรับขายเฉพาะกลุ่ม",
        "role": "Prompt Engineer & Digital Asset Monetizer",
        "prompt": "คุณคือ Prompt Engineer & Digital Asset Monetizer\nจงสร้างชุด 'Mega Prompt Pack' จำนวน 15 สุดยอด Prompts สำหรับกลุ่มอาชีพ [ระบุกลุ่มอาชีพ เช่น นายหน้าอสังหาริมทรัพย์ / เจ้าของร้านอาหาร / ทนายความ]:\nข้อกำหนด:\n1. แต่ละ Prompt ต้องมี Role, Task, Context, และตัวแปร [ ... ] ที่นำไปใช้ได้ทันที\n2. ครอบคลุมงานประจำวันที่กลุ่มอาชีพนี้ต้องเสียเวลามากที่สุด 5 ด้าน\n3. ตัวอย่างผลลัพธ์ (Sample Output) ที่แสดงถึงความคุ้มค่าของการซื้อ Prompt Pack นี้\n4. ข้อความแนะนำวิธีนำ Prompt Pack ไปบันทึกเป็นคีย์ลัด (Text Expander / Shortcuts)",
        "variables": ["ระบุกลุ่มอาชีพ เช่น นายหน้าอสังหาริมทรัพย์ / เจ้าของร้านอาหาร / ทนายความ"]
    },
    {
        "id": 104, "mode": "money", "categoryId": 11, "categoryName": "Digital Products",
        "title": "ออกแบบชุดเทมเพลต Canva เพื่อขายบน Etsy / ตลาดออนไลน์",
        "role": "Canva Top Seller & Visual Content Strategist",
        "prompt": "คุณคือ Canva Top Seller & Visual Content Strategist\nจงวางแผนชุดเทมเพลต Canva (30 ชิ้น) เพื่อวางขายให้กลุ่มลูกค้า [ระบุ เช่น โค้ชสอนออนไลน์ / ร้านเสริมสวยและสปา]:\n1. รายการประเภทชิ้นงานที่ต้องทำ (เช่น Instagram Carousel 10 ชิ้น, Story Promo 10 ชิ้น, Quote Cards 10 ชิ้น)\n2. พาเลตสี (Color Palette) และธีมฟอนต์ที่ดูหรูหรา น่าเชื่อถือ\n3. ข้อความพาดหัว (Headlines) และเนื้อหาตัวอย่างในแต่ละเทมเพลต (ห้ามใช้ Lorem Ipsum)\n4. คำอธิบายสินค้าและคีย์เวิร์ด SEO สำหรับตั้งชื่อสินค้าบน Etsy เพื่อให้ติดอันดับค้นหา",
        "variables": ["ระบุ เช่น โค้ชสอนออนไลน์ / ร้านเสริมสวยและสปา"]
    },
    {
        "id": 105, "mode": "money", "categoryId": 11, "categoryName": "Digital Products",
        "title": "สร้างโมเดล Google Sheets / Excel ทางการเงินสำหรับขาย",
        "role": "Financial Modeling Expert & Spreadsheet Monetizer",
        "prompt": "คุณคือ Financial Modeling Expert & Spreadsheet Monetizer\nจงออกแบบเทมเพลต Google Sheets / Excel สำหรับ [ระบุ เช่น คำนวณกำไร-ขาดทุนร้านค้าออนไลน์ หรือ วางแผนอิสรภาพทางการเงิน FIRE]:\n1. ผังโครงสร้างชีต (Tabs Structure): Input, Calculations, Dashboard, Settings\n2. รายการสูตรและฟังก์ชันขั้นสูงที่ต้องใช้ (เช่น XLOOKUP, QUERY, IMPORTRANGE, SPARKLINE)\n3. การตั้งค่า Conditional Formatting และ Data Validation เพื่อป้องกันผู้ใช้กรอกผิด\n4. กลยุทธ์การใส่ลายน้ำ/ล็อกเซลล์เพื่อป้องกันการละเมิดลิขสิทธิ์ และคู่มือการใช้งานแบบ 1 หน้ากระดาษ",
        "variables": ["ระบุ เช่น คำนวณกำไร-ขาดทุนร้านค้าออนไลน์"]
    },
    {
        "id": 106, "mode": "money", "categoryId": 11, "categoryName": "Digital Products",
        "title": "สร้างชุดภาพประกอบและ Digital Printables (Etsy / Printful)",
        "role": "Print-on-Demand Creative Director",
        "prompt": "คุณคือ Print-on-Demand Creative Director\nฉันต้องการสร้างสินค้า Digital Wall Art / Printable Planner สำหรับวางขายในตลาดต่างประเทศ (Etsy/Creative Market)\nในธีม [ระบุ เช่น Boho Botanical, Cyberpunk Minimalism, Motivational Typography]\n1. แนะนำ 10 คอนเซปต์งานภาพยอดนิยมที่มียอดค้นหาสูง แต่การแข่งขันปานกลาง\n2. Prompt สร้างภาพด้วย Midjourney / DALL-E แบบลงลึกสไตล์ แสง อัตราส่วนภาพ และองค์ประกอบศิลป์\n3. ขนาดสัดส่วนไฟล์มาตรฐานที่ลูกค้าต้องการดาวน์โหลด (2:3, 3:4, 4:5, ISO Paper)\n4. ไฟล์แถม (Bonus File) ที่ช่วยเพิ่มคะแนนรีวิว 5 ดาว",
        "variables": ["ระบุ เช่น Boho Botanical, Cyberpunk Minimalism"]
    },
    {
        "id": 107, "mode": "money", "categoryId": 11, "categoryName": "Digital Products",
        "title": "สร้างคลังชุดคำถามและแบบทดสอบ (Interview & Exam Prep Kit)",
        "role": "HR Director & Career Coach",
        "prompt": "คุณคือ HR Director & Career Coach\nจงสร้างชุดคู่มือเตรียมตัวสัมภาษณ์งานเจาะจงตำแหน่ง [ระบุ เช่น Senior Frontend Developer / Data Analyst / Product Manager]:\n1. รวมคำถามสัมภาษณ์ยอดนิยม 20 ข้อ (แยกเป็น Technical, Behavioral ตามเกณฑ์ STAR, และ Culture Fit)\n2. ตัวอย่างคำตอบระดับคะแนนเต็ม 10 พร้อมจุดที่ผู้สัมภาษณ์มองหา\n3. คำถามที่ผู้สมัครควรถามกลับผู้สัมภาษณ์เพื่อสร้างความประทับใจ 5 ข้อ\n4. ตาราง Checklist ตรวจสอบเรซูเม่และพอร์ตโฟลิโอก่อนส่งใบสมัคร",
        "variables": ["ระบุ เช่น Senior Frontend Developer / Data Analyst"]
    },
    {
        "id": 108, "mode": "money", "categoryId": 11, "categoryName": "Digital Products",
        "title": "สร้าง Cheat Sheet สรุปสูตรลัดเฉพาะทางสำหรับขาย",
        "role": "Educational Designer & Knowledge Distiller",
        "prompt": "คุณคือ Educational Designer & Knowledge Distiller\nจงสรุปความรู้เรื่อง [ระบุ เช่น คำสั่ง Docker & Kubernetes ที่ใช้บ่อย, สูตร Excel ขั้นสูง, กฎหมายภาษีสำหรับฟรีแลนซ์] ให้เป็น 'Ultimate 2-Page Cheat Sheet':\n1. จัดหมวดหมู่ตารางข้อมูลให้อ่านเข้าใจได้ใน 3 วินาที\n2. มี Syntax, คำอธิบายสั้น 1 บรรทัด, และ Use Case จริง\n3. Common Mistakes หรือจุดที่คนมักทำพลาด พร้อมวิธีแก้ปัญหาทันที\n4. คำโปรยหน้าปกที่ทำให้ลูกค้ารู้สึกว่า 'ประหยัดเวลาค้นหา Google ไปได้ 100 ชั่วโมง'",
        "variables": ["ระบุ เช่น คำสั่ง Docker & Kubernetes ที่ใช้บ่อย"]
    },
    {
        "id": 109, "mode": "money", "categoryId": 11, "categoryName": "Digital Products",
        "title": "ออกแบบเสียง Sound Effects / ดนตรี Lofi สำหรับ Content Creator",
        "role": "Music Producer & Audio Asset Strategist",
        "prompt": "คุณคือ Music Producer & Audio Asset Strategist\nจงวางแผนสร้างชุดแพ็กเกจ 'Royalty-Free Audio Pack for Creators' สำหรับขายในธีม [ระบุ เช่น Lofi Study Beats, Cyberpunk Game SFX, Vlog Background Tunes]:\n1. รายการ 10 เพลง/เสียงที่ตอบโจทย์ YouTuber และ Streamer\n2. Prompts ละเอียดสำหรับสั่งงานเครื่องมือสร้างเสียง AI (เช่น Suno AI, Udio, ElevenLabs Sound FX)\n3. เอกสาร Commercial License Agreement แบบเรียบง่ายที่ให้ลูกค้านำไปใช้ในเชิงพาณิชย์ได้\n4. แผนการโปรโมตผ่าน YouTube Shorts / TikTok ด้วยคลิปแจกเสียงฟรี 3 ชิ้นเพื่อดึงคนซื้อชุดเต็ม",
        "variables": ["ระบุ เช่น Lofi Study Beats, Cyberpunk Game SFX"]
    },
    {
        "id": 110, "mode": "money", "categoryId": 11, "categoryName": "Digital Products",
        "title": "สร้างระบบ Bundle สรุปหนังสือธุรกิจ (Executive Book Summaries)",
        "role": "Business Strategy Executive & Knowledge Curator",
        "prompt": "คุณคือ Business Strategy Executive & Knowledge Curator\nจงสร้างชุดสรุปหนังสือธุรกิจระดับโลก 3 เล่มในหมวด [ระบุ เช่น การตลาด, การบริหารเวลา, การสร้างทีม]:\n1. บทสรุปแบบ 1-Page Summary ต่อเล่ม (Core Philosophy, 3 Big Ideas, Action Steps)\n2. คำคมเด็ด (Key Quotes) พร้อมการนำไปปรับใช้ในธุรกิจทันที\n3. Framework แผนภาพสรุปความคิดที่จำง่าย\n4. ข้อเสนอแนะการรวมแพ็กเกจขายแบบ Subscription (สรุปหนังสือใหม่ทุกสัปดาห์)",
        "variables": ["ระบุ เช่น การตลาด, การบริหารเวลา, การสร้างทีม"]
    }
]

# Generate more structured prompts for categories 2 to 10
# หมวด 2: Freelancing (111-120)
freelance_titles = [
    ("เขียน Sales Copywriting หน้าปิดการขาย (Landing Page) ให้ลูกค้า", "Copywriting for Landing Pages", "ระบุสินค้า เช่น ซอฟต์แวร์ CRM, คอร์สเรียนออนไลน์"),
    ("รับจ้างเขียนบทความ SEO คุณภาพสูงแบบ Long-Form", "High-Ranking SEO Article", "ระบุคีย์เวิร์ด เช่น รถยนต์ไฟฟ้า 2026, วิตามินเสริมภูมิคุ้มกัน"),
    ("บริการเขียนอีเมล Cold Email ดึงดูดลูกค้าระดับองค์กร B2B", "B2B Cold Outreach Sequence", "ระบุบริการ เช่น พัฒนาเว็บ, ออกแบบแบรนด์"),
    ("รับจ้างจัดทำ Resume & LinkedIn Profile ให้ผู้บริหาร", "Executive Resume & LinkedIn Makeover", "ระบุตำแหน่ง เช่น Chief Marketing Officer (CMO)"),
    ("บริการเขียนสคริปต์วิดีโอ YouTube ให้ Influencer", "YouTube Video Scriptwriting", "ระบุหัวข้อ เช่น ประวัติศาสตร์การเงิน, รีวิว Gadget"),
    ("รับแปลงเสียง Podcast เป็น Show Notes และ Social Snippets", "Podcast Show Notes & Repurposing", "ระบุธีมรายการ เช่น สัมภาษณ์สตาร์ทอัพ"),
    ("บริการแปลและถอดความภาษา (Localization) เชิงธุรกิจ", "Business Translation & Localization", "ระบุภาษาต้นทางและปลายทาง เช่น อังกฤษเป็นไทย"),
    ("รับจัดการปฏิทินคอนเทนต์รายเดือน (Social Media Calendar)", "Monthly Social Media Content Calendar", "ระบุธุรกิจ เช่น คลินิกทันตกรรม, แบรนด์เสื้อผ้า"),
    ("บริการเขียน Press Release ข่าวประชาสัมพันธ์เปิดตัวสินค้า", "Press Release for Product Launch", "ระบุสินค้าและไฮไลต์สำคัญ"),
    ("บริการร่างสัญญาจ้างและข้อตกลงฟรีแลนซ์มาตรฐาน", "Freelance Service Agreement Drafting", "ระบุขอบเขตงาน เช่น พัฒนาระบบเว็บ 3 เดือน")
]

for idx, (title, role_type, var_ph) in enumerate(freelance_titles, 111):
    prompts.append({
        "id": idx, "mode": "money", "categoryId": 12, "categoryName": "Freelancing & Client Services",
        "title": title,
        "role": f"Elite Freelance {role_type} Consultant",
        "prompt": f"คุณคือ Elite Freelance {role_type} Consultant\nฉันต้องการส่งมอบงานระดับพรีเมียมให้ลูกค้าในโปรเจกต์ [{var_ph}]\nเป้าหมายของลูกค้า: [ระบุเป้าหมาย เช่น เพิ่มยอดขาย 200%, สร้างความน่าเชื่อถือ]\nจงสร้างผลงานฉบับสมบูรณ์:\n1. ร่างผลงานที่มีโครงสร้างระดับมืออาชีพ ไร้คำฟุ่มเฟือย\n2. การวิเคราะห์จุดแข็ง จุดขาย และจิตวิทยาจูงใจ\n3. Checklist ตรวจสอบคุณภาพก่อนส่งมอบงานให้ลูกค้าประทับใจและกลับมาจ้างซ้ำ\n4. คำแนะนำเพิ่มเติมสำหรับการคิดราคาแบบ Value-based Pricing แทนการคิดรายชั่วโมง",
        "variables": [var_ph, "ระบุเป้าหมาย เช่น เพิ่มยอดขาย 200%"]
    })

# หมวด 3: Faceless Content Creator & Video (121-130)
media_titles = [
    ("วางกลยุทธ์ช่อง YouTube ไร้หน้า (Faceless Channel) ทำเงินจาก Ads", "Faceless YouTube Strategist", "ระบุ Niche เช่น สรุปประวัติศาสตร์, ข้อคิดปรัชญา Stoic"),
    ("เขียนสคริปต์ TikTok / Shorts ไวรัลสูตร 3 วินาทีแรกหยุดนิ้ว", "Short-Form Video Viral Architect", "ระบุหัวข้อ เช่น จิตวิทยาการเงิน, เทคนิคเรียนเก่ง"),
    ("เขียน Instagram Carousel คอนเทนต์สร้างผู้ติดตามและขายของ", "Instagram Growth Strategist", "ระบุหัวข้อ เช่น 5 ทักษะที่ AI แทนที่ไม่ได้"),
    ("สร้าง Twitter/X Thread ที่มีคนรีทวีตหลักพันเพื่อดึงดูดลูกค้า", "Viral Thread Writer & Ghostwriter", "ระบุประเด็น เช่น บทเรียนชีวิตจากมหาเศรษฐี"),
    ("ระบบ Repurpose คอนเทนต์ 1 ชิ้น กระจายลง 5 แพลตฟอร์ม", "Content Multiplication Specialist", "ระบุเนื้อหาต้นฉบับ เช่น วิดีโอสัมภาษณ์ 1 ตอน"),
    ("เขียนอีเมลเสนอตัวรับสปอนเซอร์ชิป (Sponsorship Pitch)", "Influencer Brand Partnership Specialist", "ระบุสถิติช่อง เช่น ผู้ติดตาม 50,000 คน ยอดวิวเฉลี่ย 20,000"),
    ("ออกแบบคอร์สสอนสดและ Community บน Discord / Skool", "Community Monetization Architect", "ระบุหัวข้อชุมชน เช่น ชุมชนนักลงทุนอสังหาฯ"),
    ("เขียน Storytelling เรื่องเล่าดึงดูดอารมณ์เพื่อปิดการขาย", "Master Storyteller & Brand Narrative Expert", "ระบุสินค้าที่ต้องการผูกเรื่องราว"),
    ("วางแผนเกาะกระแสไวรัล (Trend Hijacking) สู่ยอดขาย", "Trend Analyst & Real-time Marketer", "ระบุกระแสหรือเทรนด์ปัจจุบัน"),
    ("เขียนสคริปต์ไลฟ์สดขายของ (Live Commerce Script)", "Live Selling & Pitch Master", "ระบุสินค้า เช่น อุปกรณ์แคมป์ปิ้ง, สกินแคร์")
]

for idx, (title, role_type, var_ph) in enumerate(media_titles, 121):
    prompts.append({
        "id": idx, "mode": "money", "categoryId": 13, "categoryName": "Content Creator & Media",
        "title": title,
        "role": role_type,
        "prompt": f"คุณคือ {role_type}\nฉันต้องการสร้างคอนเทนต์ระดับไวรัลที่สามารถเปลี่ยนยอดวิวให้เป็นรายได้ในหัวข้อ [{var_ph}]\nเป้าหมายยอดผู้ชมและ Conversion: [ระบุ เช่น ต้องการยอดวิว 100K และดึงคนเข้า Line OA/Bio Link]\nจงจัดทำแผนงานและสคริปต์:\n1. 3 Hooks สำหรับ 3 วินาทีแรกที่กระตุกความสนใจอย่างแรง (Pattern Interrupt)\n2. เนื้อหาหลัก (Core Body) แบบ Fast-paced ไม่น่าเบื่อ\n3. Call-to-Action (CTA) ที่แนบเนียน ชี้ชวนให้คลิกลิงก์ซื้อสินค้าหรือกดติดตาม\n4. คำแนะนำเรื่องการเลือกเสียงเพลง, B-Roll, และการตัดต่อเพื่อรักษา Watch Time สูงสุด",
        "variables": [var_ph, "ระบุ เช่น ต้องการยอดวิว 100K"]
    })

# หมวด 4: Affiliate Marketing (131-140)
affiliate_titles = [
    ("เขียนบทความรีวิวสินค้าแบบ Buyer Intent เน้นปิดการขาย", "Affiliate Review Copywriter", "ระบุสินค้า เช่น เก้าอี้สุขภาพ, ซอฟต์แวร์ตัดต่อวิดีโอ"),
    ("เขียนบทความเปรียบเทียบ 'A vs B' สำหรับคนพร้อมรูดบัตร", "Comparison Article Specialist", "ระบุสินค้า 2 ตัว เช่น Notion vs Obsidian"),
    ("เขียนบทความ '10 อันดับสินค้าที่ดีที่สุดประจำปี' (Roundup Review)", "SEO Affiliate Roundup Strategist", "ระบุหมวดหมู่ เช่น โน้ตบุ๊กทำงานที่ดีที่สุด"),
    ("ออกแบบอีเมล Affiliate Sequence 5 ฉบับแบบไม่ยัดเยียด", "Affiliate Email Funnel Specialist", "ระบุสินค้า Affiliate ที่เป็นตัวแทน"),
    ("เขียน Lead Magnet ดึงดูดคนมาโหลดเพื่อเก็บรายชื่อทำ Affiliate", "Lead Generation Strategist", "ระบุกลุ่มเป้าหมาย เช่น คนอยากลดน้ำหนัก"),
    ("เขียนคำตอบแนะนำสินค้าบน Quora และ Reddit อย่างเป็นธรรมชาติ", "Organic Forum Marketer", "ระบุคำถามที่พบบ่อยในวงการ"),
    ("สร้างชุดโบนัสพิเศษ (Bonus Stack) ดึงดูดให้ซื้อผ่านลิงก์เรา", "Affiliate Incentive Architect", "ระบุสินค้าหลักที่คนอื่นก็ขายเหมือนกัน"),
    ("เขียนสคริปต์ TikTok ป้ายยา Affiliate สินค้า Shopee / TikTok Shop", "TikTok Shop Affiliate Pro", "ระบุสินค้าของใช้ในบ้านหรือแกดเจ็ต"),
    ("วางแผนทำ SEO Keyword Clustering ดักคีย์เวิร์ดทำเงิน", "SEO Semantic Clustering Architect", "ระบุ Niche ตลาด เช่น คอนโดมิเนียม"),
    ("สคริปต์วิดีโอแกะกล่อง Unboxing และสาธิตสินค้า Affiliate", "Product Demonstration & Review Specialist", "ระบุอุปกรณ์ไอทีหรือเครื่องใช้ไฟฟ้า")
]

for idx, (title, role_type, var_ph) in enumerate(affiliate_titles, 131):
    prompts.append({
        "id": idx, "mode": "money", "categoryId": 14, "categoryName": "Affiliate Marketing",
        "title": title,
        "role": role_type,
        "prompt": f"คุณคือ {role_type}\nฉันกำลังทำแคมเปญ Affiliate Marketing สำหรับผลิตภัณฑ์ [{var_ph}]\nเป้าหมายคือดึงดูดผู้ซื้อที่มีเจตนาซื้อสูง (High Buyer Intent) เพื่อคลิกลิงก์ Affiliate ของฉัน\nจงสร้างเนื้อหาและกลยุทธ์:\n1. โครงสร้างเนื้อหาที่เน้นข้อเท็จจริง ข้อดี ข้อเสีย อย่างเป็นกลางเพื่อสร้าง Trust\n2. จุดเน้นย้ำความคุ้มค่า (ROI / Cost per use) ที่ทำให้ลูกค้ารู้สึกว่า 'ต้องซื้อเดี๋ยวนี้'\n3. ตำแหน่งการวาง Affiliate Link และปุ่ม Call-to-Action ที่ได้ CTR สูงสุด\n4. ข้อความกำกับความโปร่งใส (Affiliate Disclosure) ตามกฎหมายอย่างสุภาพ",
        "variables": [var_ph]
    })

# หมวด 5: E-Commerce & Dropshipping (141-150)
ecom_titles = [
    ("วิเคราะห์หา Winning Product สินค้าทำเงินสำหรับ Dropshipping", "Dropshipping Product Research Expert", "ระบุงบประมาณและตลาด เช่น Shopee ไทย หรือ Shopify อเมริกา"),
    ("เขียนคำบรรยายสินค้า (Product Description) ที่อ่านแล้วอยากซื้อทันที", "E-Commerce Conversion Copywriter", "ระบุสินค้า เช่น เครื่องนวดคอพกพา"),
    ("เขียนข้อความโฆษณา Facebook / TikTok Ads ทดสอบ 3 มุมมอง", "Paid Ads Creative Strategist", "ระบุสินค้าและจุดขายหลัก"),
    ("เขียนระบบอีเมลตามตระกร้าสินค้าที่ถูกทิ้ง (Abandoned Cart Recovery)", "E-Commerce Retention Specialist", "ระบุร้านค้าและสินค้า"),
    ("ออกแบบชุดข้อเสนอ Upsell และ Cross-sell เพิ่มยอดบิลเฉลี่ย (AOV)", "AOV Optimization Architect", "ระบุสินค้าหลักและสินค้าเสริม"),
    ("ร่างบทเจรจาต่อรองกับซัพพลายเออร์จีน / โรงงานเพื่อลดต้นทุน", "Supply Chain & Sourcing Negotiator", "ระบุจำนวนสั่งซื้อและสเปกสินค้า"),
    ("เขียนแบรนด์สตอรี่ (Brand Story) เปลี่ยนสินค้าราคาถูกให้ดูพรีเมียม", "Brand Identity & Positioning Strategist", "ระบุแนวคิดของแบรนด์"),
    ("เขียนเทมเพลต DM ทักหา Micro-Influencer ให้รีวิวสินค้าแลกของ", "Influencer Seeding Coordinator", "ระบุสินค้าที่ต้องการส่งให้รีวิว"),
    ("ออกแบบสโลแกนและกราฟิกสำหรับ Print-on-Demand (เสื้อยืด/แก้ว)", "POD Apparel Creative Director", "ระบุ Niche เช่น คนรักแมว, คนรักการวิ่ง"),
    ("เขียนระบบตอบแชทปิดการขายอัตโนมัติสำหรับแอดมินเพจ", "Social Commerce Chat Closer", "ระบุคำถามยอดฮิต เช่น มีเก็บปลายทางไหม ราคาเท่าไหร่")
]

for idx, (title, role_type, var_ph) in enumerate(ecom_titles, 141):
    prompts.append({
        "id": idx, "mode": "money", "categoryId": 15, "categoryName": "E-Commerce & Dropshipping",
        "title": title,
        "role": role_type,
        "prompt": f"คุณคือ {role_type}\nฉันต้องการเพิ่มยอดขายและอัตรากำไรสำหรับร้านค้าออนไลน์ สินค้าคือ [{var_ph}]\nจงจัดทำกลยุทธ์และเนื้อหาฉบับพร้อมใช้:\n1. การระบุ Pain Point และ Emotion Trigger ที่ทำให้ลูกค้าหยุดไถฟีด\n2. ข้อความขายสินค้าที่ชูคุณประโยชน์ (Benefit) เหนือสเปก (Feature)\n3. การทลายข้อโต้แย้งเรื่องราคาและระยะเวลาจัดส่ง\n4. ตารางตัวเลขประมาณการกำไรและเกณฑ์ ROAS (Return on Ad Spend) ที่คุ้มทุน",
        "variables": [var_ph]
    })

# หมวด 6: AI Agency & Automation (151-160)
agency_titles = [
    ("เขียน Proposal เสนอบริการ AI Chatbot ให้ธุรกิจท้องถิ่น", "AI Automation Agency (AAA) Founder", "ระบุประเภทธุรกิจ เช่น คลินิกทันตกรรม, อู่ซ่อมรถ, ร้านอาหาร"),
    ("ร่าง Cold Email หาเจ้าของธุรกิจเสนอบริการลดต้นทุนด้วย AI", "B2B Cold Outreach Master", "ระบุตำแหน่งเป้าหมาย เช่น Managing Director, Head of Operations"),
    ("จัดทำ AI Workflow Audit Checklist สำหรับเข้าไปตรวจสอบบริษัทลูกค้า", "Business Process Automation Consultant", "ระบุแผนก เช่น แผนกบริการลูกค้า, แผนกบัญชี"),
    ("ออกแบบแพ็กเกจราคาแบบรายเดือน (Monthly Retainer) สำหรับเอเจนซี่ AI", "Agency Pricing & Packaging Strategist", "ระบุบริการ เช่น ดูแลระบบแชทบอท + ทำคอนเทนต์อัตโนมัติ"),
    ("ร่างสัญญาให้บริการ AI และข้อตกลงระดับบริการ (SLA Agreement)", "Technology Legal & Service Level Architect", "ระบุขอบเขตการรับประกันระบบ uptime"),
    ("เขียนสคริปต์สัมภาษณ์ Onboarding ลูกค้าใหม่แบบมืออาชีพ", "Client Success & Onboarding Director", "ระบุข้อมูลที่ต้องเก็บจากลูกค้า"),
    ("จัดทำ Case Study ความสำเร็จเพื่อใช้ปิดลูกค้ารายต่อไป", "Case Study Marketing Specialist", "ระบุผลลัพธ์ เช่น ประหยัดเวลา 40 ชั่วโมง/สัปดาห์"),
    ("วางโครงสร้างหลักสูตรสอนพนักงานในองค์กรใช้ AI (Corporate Training)", "Corporate AI Training Director", "ระบุหัวข้อ เช่น การใช้ Generative AI สำหรับฝ่ายขาย"),
    ("สคริปต์การโทรพูดคุยปิดการขายแบบ High-Ticket (Discovery Call)", "High-Ticket Sales Closer", "ระบุราคาบริการ เช่น โปรเจกต์ละ 50,000 - 150,000 บาท"),
    ("ออกแบบระบบสร้าง Lead อัตโนมัติด้วย Web Scraping + AI Enrichment", "Lead Generation Systems Engineer", "ระบุกลุ่มเป้าหมาย เช่น ผู้จัดการฝ่ายจัดซื้อในไทย")
]

for idx, (title, role_type, var_ph) in enumerate(agency_titles, 151):
    prompts.append({
        "id": idx, "mode": "money", "categoryId": 16, "categoryName": "AI Agency & Consulting",
        "title": title,
        "role": role_type,
        "prompt": f"คุณคือ {role_type}\nฉันกำลังดำเนินธุรกิจ AI Automation Agency (AAA) เพื่อเสนอบริการให้ [{var_ph}]\nเป้าหมายคือปิดสัญญารายเดือน (Retainer) หรือโปรเจกต์ระดับพรีเมียม\nจงจัดทำเอกสารและแผนการ:\n1. การนำเสนอปัญหาที่ธุรกิจของเขากำลังเสียเงินหรือเสียเวลาโดยไม่รู้ตัว\n2. ทางออกด้วยระบบ AI Automation (เช่น Make.com, n8n, OpenAI API, Chatbot) ที่จับต้องได้\n3. การคำนวณตัวเลข ROI ที่ลูกค้าจะได้รับคืนชัดเจน\n4. สคริปต์ปิดท้ายเพื่อชวนนัดประชุม Demo System ภายใน 15 นาที",
        "variables": [var_ph]
    })

# หมวด 7: Micro-SaaS & Web Tools (161-170)
saas_titles = [
    ("วิเคราะห์ไอเดีย Micro-SaaS ที่แก้ปัญหาเฉพาะกลุ่มและทำเงินเร็ว", "Micro-SaaS Product Architect", "ระบุตลาด เช่น เครื่องมือสำหรับครู, โปรแกรมร้านทำเล็บ"),
    ("วางขอบเขตฟีเจอร์ MVP (Minimum Viable Product) ให้เสร็จใน 7 วัน", "Lean Startup Technical Lead", "ระบุไอเดียผลิตภัณฑ์"),
    ("ออกแบบ Chrome Extension ที่สร้างรายได้แบบ Freemium", "Browser Extension Monetization Expert", "ระบุฟังก์ชัน เช่น เครื่องมือช่วยกรอกข้อมูล, ตัวช่วยแปลภาษา"),
    ("เขียนแผนธุรกิจ No-Code Web Tool คิดเงินรายเดือน", "No-Code SaaS Strategist", "ระบุเครื่องมือ เช่น Bubble, FlutterFlow"),
    ("วางกลยุทธ์ Pricing & Tiering สำหรับ AI Wrapper Tool", "SaaS Pricing & Economics Specialist", "ระบุต้นทุน API และการตั้งราคาแบบ Profit Margin 70%+"),
    ("เขียนข้อความเปิดตัวบน Product Hunt ให้ติด Top 5 ประจำวัน", "Product Hunt Launch Strategist", "ระบุชื่อแอปและจุดเด่นหลัก"),
    ("ออกแบบ In-App Upgrade Hooks กระตุ้นให้ผู้ใช้ฟรีเปลี่ยนเป็นลูกค้าเสียเงิน", "Product-Led Growth (PLG) Specialist", "ระบุฟีเจอร์ที่ล็อกไว้หลัง Paywall"),
    ("เขียนแบบสอบถามดักจับเหตุผลที่ลูกค้ายกเลิกสมาชิก (Churn Reduction)", "Customer Retention Specialist", "ระบุประเภทซอฟต์แวร์"),
    ("วางแผนการเข้าซื้อผู้ใช้คนแรก 100 คน (First 100 Paying Users)", "Growth Hacker & User Acquisition Expert", "ระบุช่องทาง เช่น Cold DM, Reddit, SEO"),
    ("ร่างประกาศขายกิจการ Micro-SaaS บน Acquire.com หรือ Flippa", "M&A Digital Broker", "ระบุสถิติ เช่น MRR $1,000, กำไร 85%")
]

for idx, (title, role_type, var_ph) in enumerate(saas_titles, 161):
    prompts.append({
        "id": idx, "mode": "money", "categoryId": 17, "categoryName": "Micro-SaaS & Web Tools",
        "title": title,
        "role": role_type,
        "prompt": f"คุณคือ {role_type}\nฉันกำลังพัฒนาและสร้างรายได้จากผลิตภัณฑ์ Micro-SaaS / Web Tool ในหัวข้อ [{var_ph}]\nเป้าหมายคือสร้างกระแสเงินสดแบบ Passive Income รายเดือน (MRR)\nจงวางแผนงานเชิงลึก:\n1. Core Value Proposition ที่ทำให้ผู้ใช้ยอมจ่ายเงินเป็นรายเดือน\n2. ฟังก์ชันหลักสำหรับเวอร์ชันแรกที่ทำน้อยแต่ได้ผลมาก (Kill Features)\n3. แผนการบริหารต้นทุน API ไม่ให้ขาดทุนเมื่อมีผู้ใช้งานเพิ่มขึ้น\n4. แผนการตลาดดึงดูดผู้ใช้งานกลุ่มแรกแบบไม่ใช้เงินยิงแอดแม้แต่บาทเดียว",
        "variables": [var_ph]
    })

# หมวด 8: Courses & Paid Communities (171-180)
course_titles = [
    ("ทดสอบความต้องการตลาดก่อนสร้างคอร์ส (Course Pre-validation)", "Online Education Launch Strategist", "ระบุหัวข้อคอร์ส เช่น สอนตัดต่อวิดีโอด้วยมือถือ"),
    ("ออกแบบโครงสร้างหลักสูตรและ Syllabus คอร์สออนไลน์ระดับพรีเมียม", "Curriculum Design Specialist", "ระบุระดับผู้เรียน เช่น ระดับเริ่มต้นสู่มืออาชีพ"),
    ("เขียนสคริปต์บทเรียนวิดีโอ (Video Lecture Script) ที่ชวนติดตาม", "Master Online Instructor", "ระบุหัวข้อย่อยของบทเรียน"),
    ("เขียนหน้าเว็บปิดการขายคอร์สออนไลน์แบบ Long-Form Sales Page", "High-Converting Course Copywriter", "ระบุราคาคอร์สและผลลัพธ์ที่ผู้เรียนจะได้"),
    ("เขียนสคริปต์สัมมนาสดเปิดตัวคอร์ส (Webinar Pitch Script)", "Webinar Selling Master", "ระบุหัวข้อสัมมนาฟรี 60 นาที"),
    ("วางปฏิทินกิจกรรมสร้างความผูกพันใน Paid Community (Skool/Facebook VIP)", "Community Engagement Manager", "ระบุกลุ่มผู้เรียน เช่น กลุ่มนายหน้าอสังหาฯ"),
    ("ออกแบบแบบทดสอบและโครงงานจบ (Capstone Project) วัดผลสัมฤทธิ์", "Instructional Assessment Designer", "ระบุทักษะที่ต้องการวัดผล"),
    ("เขียนแคมเปญ Early Bird Presale ปิดยอดขายก่อนคอร์สเปิดสอน", "Launch Campaign Copywriter", "ระบุระยะเวลาโปรโมชั่น เช่น 5 วันก่อนเปิดระบบ"),
    ("ออกแบบแคมเปญ Challenge 5 วัน เปลี่ยนผู้ติดตามเป็นนักเรียนเสียเงิน", "5-Day Challenge Funnel Architect", "ระบุเป้าหมายของความท้าทาย 5 วัน"),
    ("เขียนระบบ Affiliate ให้นักเรียนเดิมช่วยแชร์คอร์สเพื่อรับค่าคอมมิชชัน", "Student Advocacy & Referral Specialist", "ระบุเปอร์เซ็นต์ส่วนแบ่ง เช่น 30-50%")
]

for idx, (title, role_type, var_ph) in enumerate(course_titles, 171):
    prompts.append({
        "id": idx, "mode": "money", "categoryId": 18, "categoryName": "Courses & Communities",
        "title": title,
        "role": role_type,
        "prompt": f"คุณคือ {role_type}\nฉันกำลังสร้างธุรกิจคอร์สออนไลน์หรือชุมชนการเรียนรู้แบบเสียเงินในหัวข้อ [{var_ph}]\nเป้าหมายคือสร้างรายได้จากการสอนและสร้างผลลัพธ์ให้นักเรียนประสบความสำเร็จจริง\nจงจัดทำพิมพ์เขียว:\n1. การกำหนด Transformation Statement: 'จากคนที่ [ปัญหาเดิม] กลายเป็นคนที่ [ผลลัพธ์ใหม่]'\n2. แผนการสอนและกิจกรรมการลงมือทำจริงในแต่ละสัปดาห์\n3. กลยุทธ์การตั้งราคา (Price Positioning) และการตั้งเงื่อนไขรับประกันความพึงพอใจ\n4. สคริปต์ข้อความปิดการขายที่กระตุ้นการตัดสินใจทันที",
        "variables": [var_ph]
    })

# หมวด 9: High-Ticket Copywriting (181-190)
copy_titles = [
    ("เขียนสคริปต์ Video Sales Letter (VSL) ความยาว 15 นาที", "Master VSL Copywriter", "ระบุบริการ เช่น โปรแกรมเทรนนิ่งสุขภาพส่วนบุคคล"),
    ("เขียน Advertorial หน้าสะพานเชื่อม (Bridge Page) ดึงดูดคนอ่าน", "Direct Response Advertorial Writer", "ระบุปัญหาที่ลูกค้ากำลังเครียด"),
    ("เขียนหน้า Application Funnel สำหรับคัดเลือกลูกค้าราคาสูง", "High-Ticket Funnel Architect", "ระบุบริการ เช่น บริการที่ปรึกษาธุรกิจ 100,000+ บาท"),
    ("เขียนชุดอีเมลตอกย้ำคุณค่า (Indoctrination Sequence) สำหรับลีดใหม่", "Email Lead Nurturing Specialist", "ระบุแบรนด์และบริการ"),
    ("เขียน SMS และข้อความแจ้งเตือน Flash Sale 24 ชั่วโมงสุดท้าย", "Urgency & Scarcity Copywriter", "ระบุข้อเสนอพิเศษ"),
    ("เขียน Whitepaper และกรณีศึกษาสำหรับกลุ่มธุรกิจ B2B", "B2B Whitepaper & Case Study Specialist", "ระบุเทคโนโลยีหรือโซลูชัน"),
    ("เขียนจดหมายขายแบบ Direct-Response ฉบับคลาสสิก", "Legendary Direct-Response Copywriter", "ระบุข้อเสนอที่ไม่สามารถปฏิเสธได้"),
    ("เขียนบทสลายข้อโต้แย้งสำหรับเซลส์คุยโทรศัพท์ปิดการขาย", "Sales Objection Handling Master", "ระบุข้อโต้แย้งยอดฮิต เช่น 'ขอปรึกษาแฟนก่อน' 'แพงจัง'"),
    ("เขียนข้อความโฆษณา Retargeting ตามหลอนลูกค้าที่เกือบซื้อ", "Retargeting Ad Strategist", "ระบุสินค้าที่ค้างในตะกร้า"),
    ("ร่าง Proposal เสนอราคางานที่ปรึกษาระดับ Exclusive", "Executive Consulting Proposal Writer", "ระบุชื่อโปรเจกต์และผลประโยชน์ทางธุรกิจ")
]

for idx, (title, role_type, var_ph) in enumerate(copy_titles, 181):
    prompts.append({
        "id": idx, "mode": "money", "categoryId": 19, "categoryName": "High-Ticket Copywriting",
        "title": title,
        "role": role_type,
        "prompt": f"คุณคือ {role_type}\nฉันต้องการเขียนงานขายระดับพรีเมียมเพื่อปิดดีลราคาสูงสำหรับ [{var_ph}]\nกลุ่มเป้าหมายคือลูกค้าระดับ Decision Maker ที่มีงบประมาณและต้องการผลลัพธ์ที่แน่นอน\nจงสร้างข้อความขายเชิงจิตวิทยา:\n1. การเปิดเรื่องด้วย Hook ที่ทรงพลังและเข้าถึงแก่นปัญหาของลูกค้าทันที\n2. การสร้างความน่าเชื่อถือและการนำเสนอข้อเสนอแบบ Grand Slam Offer\n3. การเปรียบเทียบต้นทุนของ 'การไม่ทำอะไรเลย' (Cost of Inaction)\n4. Call-to-Action ที่ชัดเจน หนักแน่น และไร้ความเสี่ยง (Risk Reversal Guarantee)",
        "variables": [var_ph]
    })

# หมวด 10: Market Research & Business Intelligence (191-200)
biz_titles = [
    ("ผ่าแผนธุรกิจและกลยุทธ์การทำกำไรของคู่แข่งในตลาด (Competitor Teardown)", "Competitive Intelligence Analyst", "ระบุชื่อคู่แข่งหรือกลุ่มธุรกิจ"),
    ("วิเคราะห์หาช่องว่างทางการตลาด (Market Gap) ที่ยังไม่มีใครทำ", "Market Opportunity Scout", "ระบุอุตสาหกรรม เช่น อาหารสัตว์เลี้ยง, บริการผู้สูงอายุ"),
    ("สรุปรายงานวิเคราะห์แนวโน้มอุตสาหกรรมและการเติบโตใน 3 ปีข้างหน้า", "Industry Trend Forecaster", "ระบุเทรนด์ เช่น AI Hardware, Clean Energy"),
    ("สร้างแบบจำลองการเงินและคำนวณจุดคุ้มทุน (Break-Even Analysis)", "CFO & Financial Feasibility Analyst", "ระบุต้นทุนคงที่และราคาขายต่อหน่วย"),
    ("วิเคราะห์งบการเงินและสัญญาณสุขภาพธุรกิจของบริษัทในตลาดหลักทรัพย์", "Fundamental Financial Analyst", "ระบุชื่อหุ้นหรือรายงานประจำปี"),
    ("ประเมินความคุ้มค่าของการลงทุนอสังหาริมทรัพย์ปล่อยเช่า (Rental Yield Model)", "Real Estate Investment Analyst", "ระบุทำเล ราคาคอนโด และค่าเช่าคาดการณ์"),
    ("สร้าง Pitch Deck โครงสร้าง 10 สไลด์สำหรับขอทุนนักลงทุน / Angel Investor", "Venture Capital Pitch Deck Architect", "ระบุธุรกิจและเป้าหมายการระดมทุน"),
    ("วิเคราะห์กระแสร้องเรียนของผู้บริโภคเพื่อเปลี่ยนเป็นโอกาสทำธุรกิจ", "Customer Sentiment & Pain-Point Miner", "ระบุสินค้าที่มีคนบ่นใน Pantip / Reddit / Amazon"),
    ("เขียนแผนธุรกิจฉบับ 1 หน้า (Lean Canvas) สำหรับธุรกิจใหม่", "Lean Startup Strategist", "ระบุไอเดียธุรกิจ"),
    ("จัดทำ Risk Assessment Matrix ประเมินความเสี่ยงก่อนลงทุนก้อนใหญ่", "Enterprise Risk Management Consultant", "ระบุโปรเจกต์การลงทุน")
]

for idx, (title, role_type, var_ph) in enumerate(biz_titles, 191):
    prompts.append({
        "id": idx, "mode": "money", "categoryId": 20, "categoryName": "Business Intelligence & Investing",
        "title": title,
        "role": role_type,
        "prompt": f"คุณคือ {role_type}\nฉันต้องการรายงานวิเคราะห์เชิงลึกสำหรับการตัดสินใจลงทุนหรือวางแผนธุรกิจในหัวข้อ [{var_ph}]\nเป้าหมายคือมองเห็นโอกาสทำเงินและควบคุมความเสี่ยงอย่างรัดกุม\nจงจัดทำรายงานวิเคราะห์:\n1. ภาพรวมสถานการณ์ตลาด ขนาดตลาด (TAM/SAM/SOM) และแรงขับเคลื่อนหลัก\n2. การวิเคราะห์จุดแข็ง จุดอ่อน โอกาส และอุปสรรค (SWOT Analysis) เชิงลึก\n3. ประมาณการทางการเงิน ตัวเลขผลตอบแทนที่คาดหวัง และระยะเวลาคืนทุน\n4. คำแนะนำเชิงกลยุทธ์ 3 ขั้นตอนที่ควรลงมือทำทันที",
        "variables": [var_ph]
    })

print(f"Generated {len(prompts)} AI Monetization Prompts successfully!")

# Save to ai_money_prompts_100.json
with open('ai_money_prompts_100.json', 'w', encoding='utf-8') as f:
    json.dump(prompts, f, ensure_ascii=False, indent=2)

# Also generate a markdown collection file
md_lines = [
    "# 💰 100 สุดยอด Prompts สำหรับใช้ AI หาเงินและสร้างธุรกิจ (AI Monetization Master Prompts)",
    "> **รวม 100 โปรมป์ต์คุณภาพสูงที่ออกแบบเพื่อการสร้างรายได้จริง ครอบคลุม 10 ช่องทางธุรกิจดิจิทัล**",
    "> พร้อมโครงสร้าง R-T-C-F และตัวแปร `[...]` สำหรับปรับแต่งใช้งานได้ทันที\n",
    "---",
    "## 📑 สารบัญหมวดหมู่",
    "- [หมวดที่ 1: การสร้างและขายสินค้าดิจิทัล (Digital Products & Templates)](#หมวดที่-1-การสร้างและขายสินค้าดิจิทัล)",
    "- [หมวดที่ 2: งานรับจ้างฟรีแลนซ์และการให้บริการ (Freelancing & Client Services)](#หมวดที่-2-งานรับจ้างฟรีแลนซ์และการให้บริการ)",
    "- [หมวดที่ 3: คอนเทนต์ครีเอเตอร์และ Social Media (Content Creator & Media)](#หมวดที่-3-คอนเทนต์ครีเอเตอร์และ-social-media)",
    "- [หมวดที่ 4: การตลาดแบบ Affiliate Marketing](#หมวดที่-4-การตลาดแบบ-affiliate-marketing)",
    "- [หมวดที่ 5: อีคอมเมิร์ซและการขายของออนไลน์ (E-Commerce & Dropshipping)](#หมวดที่-5-อีคอมเมิร์ซและการขายของออนไลน์)",
    "- [หมวดที่ 6: การเปิดเอเจนซี่ AI และบริการที่ปรึกษา (AI Agency & Consulting)](#หมวดที่-6-การเปิดเอเจนซี่-ai-และบริการที่ปรึกษา)",
    "- [หมวดที่ 7: การพัฒนา Micro-SaaS และ Web Tools](#หมวดที่-7-การพัฒนา-micro-saas-และ-web-tools)",
    "- [หมวดที่ 8: การสร้างคอร์สออนไลน์และการสอน (Courses & Communities)](#หมวดที่-8-การสร้างคอร์สออนไลน์และการสอน)",
    "- [หมวดที่ 9: การเขียนงานขายและ Copywriting ระดับพรีเมียม (High-Ticket Copywriting)](#หมวดที่-9-การเขียนงานขายและ-copywriting-ระดับพรีเมียม)",
    "- [หมวดที่ 10: การลงทุน การเทรด และการวิเคราะห์ข้อมูลตลาด (Business Intelligence & Investing)](#หมวดที่-10-การลงทุน-การเทรด-และการวิเคราะห์ข้อมูลตลาด)",
    "\n---"
]

cat_names_th = {
    11: "หมวดที่ 1: การสร้างและขายสินค้าดิจิทัล (Digital Products & Templates)",
    12: "หมวดที่ 2: งานรับจ้างฟรีแลนซ์และการให้บริการ (Freelancing & Client Services)",
    13: "หมวดที่ 3: คอนเทนต์ครีเอเตอร์และ Social Media (Content Creator & Media)",
    14: "หมวดที่ 4: การตลาดแบบ Affiliate Marketing",
    15: "หมวดที่ 5: อีคอมเมิร์ซและการขายของออนไลน์ (E-Commerce & Dropshipping)",
    16: "หมวดที่ 6: การเปิดเอเจนซี่ AI และบริการที่ปรึกษา (AI Agency & Consulting)",
    17: "หมวดที่ 7: การพัฒนา Micro-SaaS และ Web Tools",
    18: "หมวดที่ 8: การสร้างคอร์สออนไลน์และการสอน (Courses & Communities)",
    19: "หมวดที่ 9: การเขียนงานขายและ Copywriting ระดับพรีเมียม (High-Ticket Copywriting)",
    20: "หมวดที่ 10: การลงทุน การเทรด และการวิเคราะห์ข้อมูลตลาด (Business Intelligence & Investing)"
}

current_cat = None
for p in prompts:
    cid = p['categoryId']
    if cid != current_cat:
        current_cat = cid
        md_lines.append(f"\n## {cat_names_th.get(cid, p['categoryName'])}\n")
    
    md_lines.append(f"### {p['id']}. {p['title']}")
    md_lines.append(f"**บทบาท**: `{p['role']}`\n")
    md_lines.append("```markdown")
    md_lines.append(p['prompt'])
    md_lines.append("```\n")

with open('ai_money_prompts_100_collection.md', 'w', encoding='utf-8') as f:
    f.write("\n".join(md_lines))

print("Successfully saved ai_money_prompts_100.json and ai_money_prompts_100_collection.md!")

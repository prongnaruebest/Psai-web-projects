# 📖 คู่มือการสร้าง Web Novel Reader ฉบับสมบูรณ์
> อ้างอิงจากต้นแบบสถาปัตยกรรม: [xianni-reader-psai.netlify.app](https://xianni-reader-psai.netlify.app/)
> รองรับทั้งการอ่าน (Read), การฟังด้วยเสียง AI (Listen), และการติดตั้งเป็นแอปมือถือ (PWA)

---

## สารบัญ
1. [สถาปัตยกรรมข้อมูลและระบบไฟล์ (Data Architecture)](#1-สถาปัตยกรรมข้อมูลและระบบไฟล์)
2. [Master Prompt สำหรับ AI Coder (สั่งสร้างทั้งระบบ)](#2-master-prompt-สำหรับ-ai-coder)
3. [Prompt สำหรับระบบ AI อ่านให้ฟัง (Text-to-Speech & Audiobook)](#3-prompt-สำหรับระบบ-ai-อ่านให้ฟัง)
4. [สคริปต์แปลงไฟล์จาก EPUB เป็น JSON (Python Extractor)](#4-สคริปต์แปลงไฟล์จาก-epub-เป็น-json)
5. [สคริปต์สร้างเสียงพากย์ภาษาไทยฟรี (Edge-TTS Engine)](#5-สคริปต์สร้างเสียงพากย์ภาษาไทยฟรี)
6. [การตั้งค่า PWA และ Service Worker อ่านแบบ Offline](#6-การตั้งค่า-pwa-และ-service-worker)
7. [ขั้นตอนการ Deploy สู่ Netlify / Cloudflare Pages](#7-ขั้นตอนการ-deploy)

---

## 1. สถาปัตยกรรมข้อมูลและระบบไฟล์

เพื่อให้นิยายขนาดยาว (เช่น 44 เล่ม 2,088 ตอน) โหลดได้เร็วภายในเสี้ยววินาที ระบบจะแยกไฟล์เป็นก้อนย่อย (Chunking):

```text
📁 novel-reader/
├── 📄 index.html              # หน้าเว็บหลัก (Bookshelf View + Reader View)
├── 📄 style.css               # ระบบธีม (Sepia, Light, Dark, Forest) และฟอนต์ภาษาไทย
├── 📄 app.js                  # Engine ควบคุมการอ่าน, คีย์ลัด, และ LocalStorage
├── 📄 sw.js                   # Service Worker สำหรับเปิดอ่าน Offline
├── 📄 manifest.json           # Web App Manifest สำหรับติดตั้งเป็น PWA
├── 📁 covers/                 # รูปปกหนังสือ cover_01.jpg ถึง cover_44.jpg
├── 📁 data/
│   ├── 📄 manifest.json       # เมทาดาทาของหนังสือทุกเล่ม (จำนวนตอน, จำนวนหน้า, ช่วงบท)
│   ├── 📄 search_index.json   # ดัชนีค้นหาด่วน (มีเฉพาะ id ตอน, ชื่อตอน, เล่มที่อยู่)
│   ├── 📄 vol_01.json         # เนื้อหาตอนที่ 1 - 47
│   ├── 📄 vol_02.json         # เนื้อหาตอนที่ 48 - 94
│   └── 📄 vol_XX.json         # เล่มอื่นๆ จนครบชุด
└── 📁 audio/ (ตัวเลือกเสริม)
    └── 📁 vol_01/             # ไฟล์เสียง MP3 ที่สร้างจาก Edge-TTS
```

---

## 2. Master Prompt สำหรับ AI Coder

สามารถคัดลอก Prompt ด้านล่างนี้ไปสั่งใน AI (เช่น Antigravity, Cursor, Claude Code, ChatGPT, หรือ v0.dev):

```markdown
Act as a Principal Frontend Engineer and UI/UX Designer.
Build a complete, responsive, standalone e-Reader Single Page Application for long-form web novels (inspired by modern reader apps like Netlify Xian Ni Reader).

TECH STACK:
- HTML5, Modern CSS Variables, Pure ES6+ JavaScript.
- Lucide Icons or FontAwesome 6.
- Google Fonts: Sarabun, Noto Sans Thai, Prompt, Pridi, Chakra Petch.

CORE APPLICATION VIEWS:
1. Bookshelf View:
   - Hero banner with book cover preview, bilingual title ("Xian Ni (仙逆) ฝืนลิขิตฟ้า ข้าขอเป็นเซียน"), author, synopsis, and metadata tags (44 volumes, 2,088 chapters).
   - "Continue Reading" button (dynamically retrieves last read volume/chapter from localStorage) + "Start Volume 1" button.
   - Volume filter bar with real-time text search.
   - Responsive grid of Volume cards with cover image, chapter range, and progress bar indicating % completed.

2. Reader View:
   - Sticky top reading progress bar showing scroll depth of the active chapter.
   - Top navigation: Back to Bookshelf, volume selector dropdown, chapter selector dropdown, PDF original reference tag.
   - Comfortable typography layout: indented paragraphs, optimal line-height (1.85), responsive container width (680px - 1100px).
   - Bottom chapter navigation: Previous Chapter button, slider scrub bar for jumping between chapters in the current volume, Next Chapter button.
   - Volume Completed transition card with 1-click button to jump to the next volume.
   - Floating action buttons: Previous, TOC drawer toggle, Next, Scroll to Top.

3. Drawers & Modals:
   - TOC Drawer: Accordion of all volumes and chapters + Bookmarks tab + Story overview stats.
   - Quick Search Modal (triggered by Ctrl+K or '/'): Fast filter by chapter ID or keywords.
   - Reading Settings Modal:
     * 4 Themes: Sepia (#FBF0D9), Light (#FFFFFF), Dark (#1A1A1A), Forest (#EBF2EA).
     * Thai Fonts: Sarabun, Noto Sans Thai, Prompt, Pridi, Chakra Petch.
     * Font size range slider (14px - 34px).
     * Line height segmented buttons (1.5, 1.85, 2.2).
     * Page width selector (Narrow 680px, Standard 860px, Wide 1100px).

4. State Management:
   - Store settings, last_read position, bookmarks, and volume reading progress in localStorage.
   - Keyboard shortcuts: Arrow Left/Right (Previous/Next Chapter), 'T' (TOC), 'B' (Bookmark), 'Esc' (Close modals).
```

---

## 3. Prompt สำหรับระบบ AI อ่านให้ฟัง (Text-to-Speech & Audiobook)

```markdown
เพิ่มระบบ "AI อ่านออกเสียงภาษาไทย (Speech & Audiobook Companion)" ให้กับ Web Novel Reader:

1. Web Speech API Engine (Client-Side ฟรีในตัวเบราว์เซอร์):
   - มีปุ่ม "ฟังเสียงอ่าน" ลอยตัวด้านล่างหน้าจอ
   - เมื่อกดเล่น ให้ใช้ `window.speechSynthesis` อ่านเนื้อหาทีละย่อหน้าด้วยเสียงภาษาไทย (`th-TH`)
   - ขณะอ่าน ให้เพิ่มคลาสไฮไลต์ที่ย่อหน้านั้น และเลื่อนหน้าจอตามอัตโนมัติ (Auto-scroll)
   - ผู้ใช้สามารถคลิกที่ย่อหน้าใดก็ได้เพื่อสั่งให้เริ่มอ่านจากย่อหน้านั้นทันที
   - ปรับสปีดเสียงได้: 0.8x, 1.0x, 1.25x, 1.5x, 2.0x
   - เมื่ออ่านจบตอน ให้โหลดตอนถัดไปและอ่านต่อเนื่องอัตโนมัติ

2. Audio Player UI:
   - มีปุ่ม Play/Pause, ข้ามย่อหน้าก่อนหน้า/ถัดไป, แถบเวลา และปุ่มเลือกความเร็วเสียง
```

---

## 4. สคริปต์แปลงไฟล์จาก EPUB เป็น JSON

ใช้ Python สกัดเนื้อหาจากโฟลเดอร์ `Ebook EPUB` ออกมาเป็นไฟล์ `data/vol_XX.json`:

```python
import os, re, csv, json, ebooklib
from ebooklib import epub
from bs4 import BeautifulSoup

EPUB_DIR = "Ebook EPUB"
DATA_DIR = "data"
os.makedirs(DATA_DIR, exist_ok=True)

CHAP_REGEX = re.compile(r'^(?:ตอนที่\s*)?(\d+)[\s:.-]+(.*)$')

for vol_num in range(1, 45):
    vol_str = f"{vol_num:02d}"
    epub_files = [f for f in os.listdir(EPUB_DIR) if f"เล่ม_{vol_str}_" in f]
    if not epub_files:
        continue
        
    book = epub.read_epub(os.path.join(EPUB_DIR, epub_files[0]))
    chapters = []
    
    for item in book.get_items():
        if item.get_type() == ebooklib.ITEM_DOCUMENT:
            soup = BeautifulSoup(item.get_content(), 'html.parser')
            lines = [p.get_text().strip() for p in soup.find_all(['p', 'h1', 'h2', 'h3']) if p.get_text().strip()]
            if not lines: continue
            
            match = CHAP_REGEX.match(lines[0])
            chap_id = int(match.group(1)) if match else len(chapters) + 1
            chap_title = lines[0]
            paragraphs = lines[1:] if match else lines
            
            chapters.append({"id": chap_id, "title": chap_title, "paragraphs": paragraphs})
            
    with open(os.path.join(DATA_DIR, f"vol_{vol_str}.json"), "w", encoding="utf-8") as f:
        json.dump(chapters, f, ensure_ascii=False)
    print(f"✅ สกัดเล่มที่ {vol_num} เรียบร้อย ({len(chapters)} ตอน)")
```

---

## 5. สคริปต์สร้างเสียงพากย์ภาษาไทยฟรี (Edge-TTS Engine)

ติดตั้งไลบรารี: `pip install edge-tts`

```python
import asyncio, edge_tts

# เสียงพากย์ไทยระดับพรีเมียม: "th-TH-PremwadeeNeural" (หญิง) หรือ "th-TH-NiwatNeural" (ชาย)
VOICE = "th-TH-NiwatNeural"

async def generate_audio(text, output_mp3):
    communicate = edge_tts.Communicate(text, VOICE, rate="+0%", pitch="+0Hz")
    await communicate.save(output_mp3)

# ตัวอย่างการเรียกใช้:
# asyncio.run(generate_audio("หวังหลินก้าวเข้าสู่เส้นทางเซียน...", "chapter_0001.mp3"))
```

---

## 6. การตั้งค่า PWA และ Service Worker

สร้างไฟล์ `sw.js` เพื่อให้สามารถบันทึกเนื้อหาลงเครื่องและเปิดอ่านโดยไม่ต้องต่ออินเทอร์เน็ต:

```javascript
const CACHE_NAME = 'novel-reader-v1';
const ASSETS = ['/', '/index.html', '/style.css', '/app.js', '/data/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
```

---

## 7. ขั้นตอนการ Deploy

1. รวมไฟล์ทั้งหมด (`index.html`, `style.css`, `app.js`, `covers/`, `data/`) ไว้ในโฟลเดอร์เดียว
2. นำไปสร้าง Repository บน **GitHub**
3. ไปที่ [Netlify.com](https://www.netlify.com/) หรือ [Cloudflare Pages](https://pages.cloudflare.com/) ➔ กด **Add new site** ➔ เลือก Repository
4. ตั้งค่า Publish directory เป็น `/` แล้วกด Deploy
5. จะได้รับโดเมน `.netlify.app` ที่เปิดอ่านได้รวดเร็ว ปลอดภัย และเสถียรทั่วโลกทันที!

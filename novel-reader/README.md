# หออักษรา

เว็บไซต์อ่านนิยายภาษาไทยส่วนตัว ตัวอย่างนี้ใช้เนื้อหาสมมติ 4 เล่ม 72 ตอน และไม่รวมงานที่มีลิขสิทธิ์ของบุคคลอื่น

## เริ่มใช้งาน

```bash
npm install
npm run dev
```

เปิด `http://localhost:3000`

## ตรวจสอบก่อนเผยแพร่

```bash
npm run validate:data
npm run typecheck
npm run lint
npm run build
```

## การเพิ่มหนังสือ เล่ม และตอน

- แก้ metadata และรายการเล่มใน `app/lib/data.ts`
- เพิ่มชื่อและข้อมูลอ้างอิงตอนในรายการ `chapters`
- เนื้อหาของแต่ละตอนควรมาจากไฟล์ข้อมูลที่คุณมีสิทธิ์ใช้งาน และให้ `getChapter()` โหลดเฉพาะตอนที่เปิด
- ปรับ `scripts/validate-data.mjs` ให้ตรงกับจำนวนเล่ม จำนวนตอน และช่วงหน้าจริง
- อย่าแก้หรือเขียนทับไฟล์ EPUB/PDF ต้นฉบับ ให้สร้างข้อมูลเว็บเป็นสำเนาแยกเสมอ

## เส้นทางหลัก

- `/` ชั้นหนังสือ
- `/book/cloud-inscription` รายละเอียดคอลเลกชัน
- `/book/cloud-inscription/chapter/1` หน้าอ่านรายตอน
- `/book/cloud-inscription/bookmarks` ที่คั่นหน้า

สถานะการอ่าน การตั้งค่า ตำแหน่ง scroll และที่คั่นหน้าเก็บใน browser ของอุปกรณ์นั้นด้วย storage schema เวอร์ชัน 1

## การเผยแพร่

โปรเจกต์ตั้งค่าสำหรับ OpenAI Sites และ Cloudflare-compatible output แล้ว ตัวแปร `SITE_URL` ควรเป็น origin จริงของเว็บเพื่อให้ social metadata ใช้ URL ที่ถูกต้อง

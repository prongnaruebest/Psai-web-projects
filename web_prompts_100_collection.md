# 🌐 Ultimate Web Prompts Collection (100 Master Prompts)
> **คลังรวม 100 สุดยอด Prompt คุณภาพสูงสำหรับการวางแผน ออกแบบ พัฒนา ทดสอบ และดูแลเว็บไซต์/เว็บแอปพลิเคชัน**
> ออกแบบตามหลักวิศวกรรมการสั่งการ (Prompt Architecture Framework: Role-Task-Context-Format) พร้อมช่องตัวแปร `[...]` สำหรับนำไปแทนค่าและใช้งานได้ทันที

---

## 🧭 โครงสร้างของ Master Prompt ในคอลเลกชันนี้
ทุก Prompt ได้รับการออกแบบตามมาตรฐาน **R-T-C-F**:
- **Role (บทบาท)**: กำหนดความเชี่ยวชาญระดับสูงของ AI
- **Task (ภารกิจ)**: สิ่งที่ต้องทำอย่างละเอียดและชัดเจน
- **Context & Constraints (บริบทและข้อจำกัด)**: ข้อกำหนดทางเทคนิค มาตรฐานความปลอดภัย หรือเงื่อนไขเฉพาะ
- **Format (รูปแบบผลลัพธ์)**: ผลลัพธ์ที่ต้องการ เช่น Code, Architecture Diagram, Step-by-step, Table, Checklist

---

## 📑 สารบัญหมวดหมู่ (Categories)
- [หมวดที่ 1: การวางแผนและการออกแบบสถาปัตยกรรมเว็บ (Architecture & Planning)](#หมวดที่-1-การวางแผนและการออกแบบสถาปัตยกรรมเว็บ) (Prompt 1–10)
- [หมวดที่ 2: การออกแบบ UI/UX และดีไซน์ซิสเต็ม (UI/UX Design & Design Systems)](#หมวดที่-2-การออกแบบ-uiux-และดีไซน์ซิสเต็ม) (Prompt 11–20)
- [หมวดที่ 3: การพัฒนาส่วนหน้า (Frontend Development & Components)](#หมวดที่-3-การพัฒนาส่วนหน้า) (Prompt 21–30)
- [หมวดที่ 4: การพัฒนาส่วนหลังและ API (Backend & API Engineering)](#หมวดที่-4-การพัฒนาส่วนหลังและ-api) (Prompt 31–40)
- [หมวดที่ 5: ฐานข้อมูลและการจัดการ Data (Database & Caching)](#หมวดที่-5-ฐานข้อมูลและการจัดการ-data) (Prompt 41–50)
- [หมวดที่ 6: ความปลอดภัยและการปกป้องระบบเว็บ (Web Security & Compliance)](#หมวดที่-6-ความปลอดภัยและการปกป้องระบบเว็บ) (Prompt 51–60)
- [หมวดที่ 7: การทดสอบและการประกันคุณภาพ (Testing & QA Automation)](#หมวดที่-7-การทดสอบและการประกันคุณภาพ) (Prompt 61–70)
- [หมวดที่ 8: ประสิทธิภาพ ความเร็ว และ Core Web Vitals (Performance & SEO)](#หมวดที่-8-ประสิทธิภาพ-ความเร็ว-และ-core-web-vitals) (Prompt 71–80)
- [หมวดที่ 9: DevOps, CI/CD และการ Deploy (Deployment & Cloud Infrastructure)](#หมวดที่-9-devops-cicd-และการ-deploy) (Prompt 81–90)
- [หมวดที่ 10: คอนเทนต์ การตลาด และการเพิ่ม Conversion (Web Copywriting, CRO & Analytics)](#หมวดที่-10-คอนเทนต์-การตลาด-และการเพิ่ม-conversion) (Prompt 91–100)

---

## หมวดที่ 1: การวางแผนและการออกแบบสถาปัตยกรรมเว็บ

### 1. ประเมินและเลือก Tech Stack & Architecture
```markdown
คุณคือ Principal Web Architect
จงช่วยประเมินและเลือก Tech Stack ที่เหมาะสมที่สุดสำหรับโปรเจกต์เว็บของฉัน:
- ประเภทโปรเจกต์: [เช่น SaaS B2B, E-commerce, Content Portal, Internal Dashboard]
- จำนวนผู้ใช้ที่คาดหวัง: [เช่น 10,000 DAU, ผู้ใช้พร้อมกันสูงสุด 1,000 คน]
- ทักษะทีมงานปัจจุบัน: [เช่น ถนัด TypeScript/React, Python, Go]
- งบประมาณและโครงสร้างพื้นฐาน: [เช่น เน้นประหยัดต้นทุน, Cloud-native AWS/GCP]
- ข้อกำหนดพิเศษ: [เช่น ต้องการ Real-time, รองรับ SEO สูง, Data privacy]

กรุณาวิเคราะห์เปรียบเทียบสถาปัตยกรรม (Monolith vs Modular Monolith vs Serverless/Microservices) พร้อมระบุ Frontend Framework, Backend, Database, Hosting แนะนำข้อดี ข้อเสีย และความเสี่ยงที่ต้องระวัง สรุปเป็นตาราง Decision Matrix
```

### 2. ออกแบบ ER Diagram และความสัมพันธ์ของข้อมูล
```markdown
คุณคือ Senior Database Architect
ฉันกำลังจะสร้างระบบเว็บสำหรับ [ระบุประเภทธุรกิจ เช่น ระบบจองคอร์สเรียนออนไลน์, ระบบจัดการคลังสินค้า]
ฟังก์ชันหลักประกอบด้วย:
[ระบุฟังก์ชัน 3-5 ข้อ เช่น สมาชิกจองเวลา, ชำระเงิน, ออกใบเสร็จ, ผู้สอนตรวจการบ้าน]

จงออกแบบ Entity-Relationship (ER) Model ครบถ้วน:
1. รายชื่อ Entities ทั้งหมดพร้อม Primary Key, Foreign Key และ Attributes ที่จำเป็น
2. ความสัมพันธ์ (1:1, 1:N, N:M) พร้อมคำอธิบาย Cardinality
3. แผนภาพแสดงผลแบบ Mermaid Diagram syntax
4. ข้อเสนอแนะเรื่อง Normalization (3NF) และจุดที่ควรทำ Denormalization เพื่อ Performance
```

### 3. จัดทำ Product Requirement Document (PRD) สำหรับเว็บ
```markdown
คุณคือ Lead Technical Product Manager
จงแปลงไอเดียเว็บแอพพลิเคชัน [ระบุชื่อหรือไอเดีย เช่น เว็บจับคู่อินฟลูเอนเซอร์กับแบรนด์] ให้เป็นเอกสาร Product Requirement Document (PRD) ฉบับสมบูรณ์สำหรับทีมนักพัฒนา ประกอบด้วย:
1. Problem Statement & Business Goals
2. Target Audience & User Personas (2 กลุ่ม)
3. Core Features (แยกเป็น Must-Have, Should-Have, Could-Have ตาม MoSCoW)
4. Functional Requirements พร้อม Acceptance Criteria รายข้อ (Given-When-Then format)
5. Non-Functional Requirements (Performance, Security, Browser Support)
6. Out of Scope สำหรับเวอร์ชัน MVP
```

### 4. ออกแบบ User Journey และ Information Architecture (IA)
```markdown
คุณคือ Senior UX Architect
จงออกแบบ Information Architecture (IA) และ User Journey Map สำหรับเว็บไซต์ [ระบุประเภท เช่น เว็บคลินิกความงามที่เน้นนัดหมายแพทย์]:
1. Sitemap แบบลำดับชั้น (Hierarchical Tree) แสดงทุกหน้าหลักและหน้ารอง
2. Global Navigation & Footer Structure
3. Step-by-Step User Flow สำหรับ 2 Core Actions:
   - Flow A: [เช่น ผู้ใช้ใหม่ค้นหาบริการจนถึงยืนยันการจอง]
   - Flow B: [เช่น ผู้ใช้เดิมเข้ามารีวิวหรือเลื่อนนัด]
4. จุดที่เสี่ยงต่อ Drop-off พร้อมแนวทางป้องกัน
```

### 5. วิเคราะห์ Monorepo vs Multi-repo สำหรับเว็บโปรเจกต์
```markdown
คุณคือ Senior DevOps & Infrastructure Architect
โปรเจกต์เว็บของฉันมีส่วนประกอบดังนี้:
[เช่น Next.js Web App, Mobile App (React Native), Node.js Microservices 2 ตัว, Shared UI Component Library]
ทีมงานมี [ระบุจำนวนคน เช่น นักพัฒนา 8 คน]

จงวิเคราะห์เชิงลึกว่าควรใช้ Monorepo หรือ Multi-repo:
1. เปรียบเทียบตามเกณฑ์: Code Sharing, CI/CD Speed, Dependency Management, Versioning, Developer Experience
2. หากเลือก Monorepo แนะนำ Tooling ที่เหมาะสม (Turborepo, Nx, pnpm workspaces) พร้อมเหตุผล
3. ตัวอย่างโครงสร้างโฟลเดอร์ (Folder Directory Tree)
4. อุปสรรคและข้อผิดพลาดทั่วไปในการทำ Monorepo ที่ต้องระวัง
```

### 6. ออกแบบ RESTful API Specification
```markdown
คุณคือ Lead API Architect
จงออกแบบ RESTful API Specification สำหรับโมดูล [ระบุโมดูล เช่น ระบบจัดการสมาชิกและสิทธิ์การใช้งาน (User & Subscription Management)]:
1. รายการ Endpoints ทั้งหมด (HTTP Methods: GET, POST, PUT, PATCH, DELETE)
2. URL Naming Convention ตามมาตรฐาน REST
3. Request Headers, URL Parameters, Query Strings และ Request Body (JSON Schema)
4. Response Bodies สำหรับ Success (200, 201) และ Error Cases (400, 401, 403, 404, 422, 500)
5. กลยุทธ์ Pagination, Sorting, และ Filtering สำหรับรายการข้อมูล
```

### 7. วางกลยุทธ์ State Management ใน Frontend Application
```markdown
คุณคือ Frontend System Architect
ฉันกำลังพัฒนาเว็บแอพพลิเคชัน [ระบุประเภท เช่น ระบบตัดต่อกราฟิกออนไลน์ หรือ กระดานเทรดหุ้น] ด้วย [React / Vue / Svelte]
มีประเภทของ State ดังนี้:
- Server Cache State (ข้อมูลจาก API)
- Global UI State (Theme, Sidebar open/close, Notification)
- Complex Form State
- Real-time Stream State (WebSocket ticks)

จงวางสถาปัตยกรรม State Management ที่มีประสิทธิภาพสูงสุด:
1. แนะนำเครื่องมือแยกตามประเภท State (เช่น TanStack Query + Zustand)
2. อธิบายเหตุผลที่ไม่ควรเก็บทุกอย่างไว้ใน Global State ก้อนเดียว
3. โค้ดตัวอย่างโครงสร้าง Store และ Custom Hooks
4. แนวทางป้องกัน Unnecessary Re-renders
```

### 8. วางแผนสถาปัตยกรรมรองรับ Traffic Spike (High Scalability)
```markdown
คุณคือ Cloud Solutions Architect
เว็บไซต์ [ระบุประเภท เช่น เว็บจำหน่ายบัตรคอนเสิร์ต / Flash Sale แคมเปญ 11.11] คาดว่าจะมีผู้เข้าชมพุ่งสูงขึ้นจาก 1,000 เป็น 200,000 คนพร้อมกันในเวลา 5 นาที
Tech Stack ปัจจุบัน: [ระบุ เช่น Node.js, PostgreSQL, Nginx, Redis]

จงวางแผนรับมือ Traffic Spike ครอบคลุม:
1. Bottlenecks การไหลของข้อมูลตั้งแต่ DNS -> CDN -> Load Balancer -> Web Server -> Database
2. Virtual Waiting Room (Queue system) เพื่อชะลอผู้ใช้
3. กลยุทธ์ Caching หลากหลายระดับ (Edge, Reverse Proxy, In-Memory)
4. การจัดการ Database Connection Pooling และ Read Replica
5. แผน Fallback & Graceful Degradation หากเซอร์วิสบางตัวเริ่มตอบสนองช้า
```

### 9. ประเมินการเลือกใช้ Third-Party Services (Build vs Buy)
```markdown
คุณคือ CTO / Technical Consultant
ฉันกำลังประเมินว่าจะ "เขียนเอง (Build)" หรือ "ใช้บริการภายนอก (Buy/SaaS)" สำหรับระบบ [ระบุระบบ เช่น Authentication & Authorization / In-app Billing / Search Engine]
บริบทธุรกิจ: [ระบุ เช่น Startup กำลังทดสอบตลาด มีเวลาพัฒนา 2 เดือน / องค์กรขนาดใหญ่เน้นความปลอดภัยและ Data Sovereignity]

กรุณาจัดทำรายงานประเมินผล:
1. เปรียบเทียบบริการยอดนิยม 3 ตัวเลือก (เช่น Auth0 vs Supabase Auth vs NextAuth.js เขียนเอง)
2. ประเมิน Total Cost of Ownership (TCO) ในระยะ 6 เดือนแรก vs ระยะขยายตัว (Scale)
3. ความเสี่ยงเรื่อง Vendor Lock-in และแนวทางป้องกัน
4. สรุปคำแนะนำสุดท้ายพร้อมเงื่อนไขการตัดสินใจ
```

### 10. แผนการ Refactor Legacy Web App (Strangler Fig Pattern)
```markdown
คุณคือ Senior Software Modernization Consultant
บริษัทมีเว็บแอพพลิเคชันเดิมที่เขียนด้วย [ระบุ เช่น PHP/jQuery แบบ Monolith ขนาดใหญ่ หรือ AngularJS เก่า] ซึ่งมีโค้ดพันกันแน่น แต่มีผู้ใช้งานจริงทุกวัน ไม่สามารถหยุดระบบเพื่อเขียนใหม่ทั้งหมด (Big Bang Rewrite) ได้
เป้าหมายคือย้ายไประบบใหม่ [ระบุ เช่น Next.js + NestJS + TypeScript]

จงเขียนแผนปฏิบัติการ Refactoring ด้วย Strangler Fig Pattern:
1. กลยุทธ์การตั้ง Reverse Proxy หน้าเว็บเพื่อทยอยส่ง Route ไปหาระบบใหม่
2. การแชร์ Session / Authentication ระหว่างเว็บเก่าและเว็บใหม่
3. แผนการแบ่ง Phase 1, Phase 2, Phase 3 โดยเลือกโมดูลที่มีความเสี่ยงต่ำก่อน
4. แผนการ Rollback และการตรวจสอบความถูกต้องของข้อมูล (Data Reconciliation)
```

---

## หมวดที่ 2: การออกแบบ UI/UX และดีไซน์ซิสเต็ม

### 11. ออกแบบ Design System Tokens & Color Palette
```markdown
คุณคือ Senior Design System Engineer
จงออกแบบระบบ Design Tokens สำหรับเว็บไซต์ [ระบุประเภทและสไตล์ เช่น เว็บไซต์ FinTech ที่ต้องการความน่าเชื่อถือ ปลอดภัย และโมเดิร์น]:
1. Primary, Secondary, Accent, และ Neutral Grayscale Palette (ระบุรหัส HEX, RGB และ HSL)
2. Semantic Colors (Success, Warning, Danger, Info)
3. การตรวจสอบ Contrast Ratio ตามมาตรฐาน WCAG 2.1 Level AA (อย่างน้อย 4.5:1 สำหรับ Body Text)
4. Spacing Scale (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px)
5. Typography Scale (Font-family, Font-size, Line-height, Letter-spacing)
6. โค้ดส่งออกในรูปแบบ Tailwind CSS Theme Configuration (`tailwind.config.js`) หรือ CSS Variables
```

### 12. ออกแบบ Wireframe Layout ผ่าน Text-based Architecture
```markdown
คุณคือ Senior UI/UX Designer
จงบรรยายโครงสร้าง Wireframe หน้า Landing Page สำหรับผลิตภัณฑ์ [ระบุผลิตภัณฑ์ เช่น AI Writing Assistant สำหรับนักการตลาด]
กำหนดเป้าหมาย: อัตรา Conversion สู่การทดลองใช้ฟรี (Free Trial Sign-up) สูงสุด
กรุณาแจกแจงโครงสร้างทีละ Section ตั้งแต่บนลงล่าง:
1. Visual Hierarchy และสัดส่วนพื้นที่ (Layout Grid System)
2. องค์ประกอบภายในแต่ละบล็อก (Headline, Sub-headline, Media Placement, CTA Button)
3. รูปแบบ Bento Grid หรือ Card Layout สำหรับจัดแสดงจุดเด่น
4. สัญลักษณ์ความน่าเชื่อถือ (Trust Badges, Social Proof Logos)
5. คำแนะนำเรื่อง F-Pattern หรือ Z-Pattern Eye Tracking
```

### 13. กำหนด Responsive Breakpoints & Multi-Device Behavior
```markdown
คุณคือ Mobile-First Web Designer
จงกำหนดแนวทางการแสดงผลแบบ Responsive Design สำหรับหน้า [ระบุหน้า เช่น หน้ารายการสินค้าและตัวกรอง (Product Catalog with Filter Drawer)]:
1. Breakpoint Standards: Mobile (<640px), Tablet (768px-1023px), Desktop (1024px-1279px), Wide Desktop (1280px+)
2. การปรับเปลี่ยน Layout ของแต่ละ Breakpoint (เช่น จาก Sidebar Filter กลายเป็น Drawer Popup ใน Mobile)
3. พฤติกรรม Touch Targets (ขนาดปุ่มขั้นต่ำ 44x44px บน Mobile)
4. การจัดการรูปภาพ Responsive (srcset, sizes, aspect-ratio) เพื่อป้องกัน Layout Shift
```

### 14. ตรวจสอบการเข้าถึง (Accessibility / WCAG 2.1 AA Audit)
```markdown
คุณคือ Web Accessibility (A11y) Specialist
ฉันต้องการให้เว็บไซต์ของฉันผ่านเกณฑ์ WCAG 2.1 Level AA อย่างสมบูรณ์
หน้าเว็บเป้าหมายคือ [ระบุหน้า เช่น หน้าแบบฟอร์มชำระเงิน และ Modal ยืนยันคำสั่งซื้อ]
จงให้ Checklist และแนวทางปฏิบัติอย่างละเอียด:
1. การจัดการ Semantic HTML (`<main>`, `<nav>`, `<fieldset>`, `<legend>`, `<dialog>`)
2. ARIA Attributes ที่จำเป็น (`aria-expanded`, `aria-haspopup`, `aria-describedby`, `aria-live`)
3. การควบคุม Keyboard Navigation (Tab order, Focus Indicators, ESC key listener, Focus Trap)
4. การรองรับ Screen Readers และคำบรรยาย Alt text สำหรับกรณีข้อมูลเชิงซ้อน
5. ข้อผิดพลาดทั่วไปเกี่ยวกับ A11y ที่พบบ่อยในเว็บยุคใหม่และวิธีแก้ไข
```

### 15. ออกแบบ Micro-interactions และ Animation Specifications
```markdown
คุณคือ Creative Frontend Motion Designer
จงออกแบบ Motion Guide สำหรับ Micro-interactions บนเว็บไซต์ [ระบุประเภท เช่น เว็บไซต์พอร์ตโฟลิโอหรือ SaaS ยุคใหม่]:
1. Button Hover, Active, Loading, Success States
2. Card Hover Lift & Glow Effect
3. Modal Dialog Enter & Exit Transition
4. Toast Notification Slide-in & Dismiss
5. Page Transition ระหว่างเปลี่ยนหน้า
กรุณาระบุ Easing Curve (เช่น `cubic-bezier(0.16, 1, 0.3, 1)`), Duration (ms), และตัวอย่างโค้ดด้วย Framer Motion หรือ Pure CSS Keyframes
```

### 16. วางระบบ Onboarding และ First-Time User Experience (FTUX)
```markdown
คุณคือ Product Growth & UX Researcher
จงออกแบบขั้นตอน Onboarding สำหรับผู้ใช้ใหม่ของเว็บแอพพลิเคชัน [ระบุ เช่น เครื่องมือจัดการโปรเจกต์สไตล์ Trello/Notion]:
เป้าหมาย: นำพาผู้ใช้ไปสู่ "Aha! Moment" (สร้างบอร์ดแรกสำเร็จ) ภายในเวลาไม่เกิน 2 นาที
1. ขั้นตอนทีละสเต็ป (Step 1 ถึง Step 4) แบบ Progressive Disclosure
2. ทางเลือกระหว่าง Interactive Product Tour vs Template Preset
3. การจัดการ Empty State เพื่อกระตุ้นให้กดเริ่มต้นใช้งาน
4. Gamification เบาๆ (เช่น Progress Checklist บันทึกความสำเร็จ)
5. สคริปต์ข้อความ Microcopy บน Tooltips ที่กระชับและไม่น่ารำคาญ
```

### 17. วางระบบ Dark Mode / Light Mode Theming Architecture
```markdown
คุณคือ Design System Frontend Engineer
จงออกแบบระบบ Theming สลับ Light / Dark Mode สำหรับเว็บ [ระบุ Framework เช่น Next.js / Tailwind CSS / Vanilla CSS]:
1. การกำหนด CSS Custom Properties (Variables) สำหรับ Background, Surface, Border, Text Primary, Text Muted
2. การจัดการปัญหา Flash of Unstyled Theme (FOUT / FOIT) ขณะโหลดหน้าแรก
3. ระบบตรวจจับ System Preferences (`prefers-color-scheme`) ร่วมกับ LocalStorage
4. ความเปรียบต่างของสีใน Dark Mode ที่ไม่ใช้สีดำสนิท (#000000) เพื่อลดอาการเมื่อยล้าสายตา
5. โค้ดตัวอย่าง ThemeProvider หรือ Script ป้องกันหน้าขาวแวบ
```

### 18. ออกแบบ Form UX และ Error Validation Handling
```markdown
คุณคือ Lead Form UX Specialist
จงออกแบบประสบการณ์การกรอกฟอร์มที่ซับซ้อน [ระบุฟอร์ม เช่น ฟอร์มสมัครขอสินเชื่อ หรือ สมัครงานที่มีการอัปโหลดไฟล์และข้อมูลหลายส่วน]:
1. หลักการจัดกลุ่มข้อมูล (Logical Chunking) แบบ Accordion หรือ Stepper
2. จังหวะเวลาการแสดง Error (On Blur vs On Submit vs Real-time)
3. การเขียน Error Message ที่สร้างสรรค์ ช่วยแก้ปัญหา (Actionable Feedback)
4. การจัดการ Autofill, Input Masks (เบอร์โทร, วันเกิด, บัตรประชาชน)
5. การคงสถานะข้อมูลเมื่อผู้ใช้เผลอกดปิดหน้าต่างหรืออินเทอร์เน็ตหลุด (Draft Auto-save)
```

### 19. ออกแบบ Empty States และ Loading Skeletons
```markdown
คุณคือ Senior Product Designer
จงออกแบบ Empty State และ Loading Skeleton สำหรับหน้า [ระบุ เช่น หน้ารายการออเดอร์ใน E-commerce Dashboard]:
1. ข้อความ ภาพประกอบ และ Action Button สำหรับ 3 กรณี:
   - กรณีที่ 1: ผู้ใช้ใหม่ ยังไม่เคยมีออเดอร์เลย
   - กรณีที่ 2: ผู้ใช้ค้นหาข้อมูลด้วยคำค้นแล้วไม่พบผลลัพธ์
   - กรณีที่ 3: ระบบเกิดข้อผิดพลาดในการโหลดข้อมูล (Network Error)
2. ข้อกำหนดทางเทคนิคของ Loading Skeleton (ขนาด, ความโค้งมน, จังหวะ Pulse Shimmer Animation)
3. การรักษาสัดส่วน Layout Shift (CLS = 0) ระหว่างการสลับจาก Skeleton เป็นข้อมูลจริง
```

### 20. จัดทำแบบทดสอบ Usability Testing Script
```markdown
คุณคือ Senior UX Researcher
จงร่างแบบแผนการทดสอบการใช้งาน (Usability Testing Plan & Script) สำหรับหน้า [ระบุ เช่น ระบบการชำระเงินและ Checkout ของเว็บขายสินค้า]:
1. ประเด็นสมมติฐานที่ต้องการทดสอบ (Research Hypotheses)
2. เกณฑ์การคัดเลือกผู้ทดสอบ (Screener Criteria 5 ท่าน)
3. สคริปต์คำพูดผู้สัมภาษณ์ตั้งแต่ Warm-up, Think-Aloud Protocol, จนถึงการสั่งงาน (Tasks Scenario)
4. Task Scenarios 3 ข้อ (ระบุสถานการณ์และเป้าหมายที่ผู้ใช้ต้องทำ)
5. เกณฑ์การให้คะแนนและการวัดผล (Single Ease Question - SEQ, System Usability Scale - SUS, Time on Task)
```

---

## หมวดที่ 3: การพัฒนาส่วนหน้า (Frontend Development)

### 21. สร้าง Landing Page Hero Section ด้วย Tailwind CSS
```markdown
คุณคือ Senior Frontend Developer
จงเขียนโค้ดสำหรับ Hero Section ของเว็บไซต์ [ระบุ เช่น แพลตฟอร์มคลาวด์สำหรับนักพัฒนา AI]:
ข้อกำหนด:
- ใช้ Semantic HTML5 และ Tailwind CSS ล่าสุด
- มี Badge ข่าวสารล่าสุดด้านบน (Pill badge พร้อมเอฟเฟกต์ pulse)
- Headline ตัวใหญ่สะดุดตา พร้อม Gradient Text ไล่เฉดสี
- Subtitle ที่อ่านง่ายบนทุกอุปกรณ์
- กลุ่มปุ่ม Call to Action (Primary Button สไตล์ Glow + Secondary Button พร้อมไอคอน)
- มี Mockup ภาพแสดงแดชบอร์ดลอยอยู่ พร้อมกรอบเงา (Glow backdrop blur)
- Fully Responsive (Mobile-first, Tablet, Desktop)
- Clean Code, จัด Indent สวยงาม พร้อมคำอธิบายจุดสำคัญ
```

### 22. สร้าง Reusable Component ด้วย React, TypeScript & CVA
```markdown
คุณคือ Principal Frontend Engineer
จงเขียน Reusable Button และ Card Component ด้วย React 19, TypeScript และ `class-variance-authority` (cva) ร่วมกับ Tailwind CSS:
1. รองรับ Variants (primary, secondary, outline, ghost, destructive)
2. รองรับ Sizes (sm, md, lg, icon)
3. รองรับ Loading State (แสดง Spinner ปิดการกด disabled อัตโนมัติ)
4. รองรับ Left Icon และ Right Icon อย่างยืดหยุ่น
5. การ Forward Ref อย่างถูกต้องตามมาตรฐาน HTMLButtonElement
6. ตัวอย่างการเรียกใช้งานพร้อม Type Safety ครบถ้วน
```

### 23. สร้าง Data Table พร้อม Sort, Filter และ Pagination
```markdown
คุณคือ Senior Frontend Architect
จงสร้าง Component Data Table สำหรับแสดงรายการข้อมูล [ระบุ เช่น รายชื่อผู้ใช้งานและสถานะบัญชี] โดยใช้ [React / TanStack Table / Tailwind CSS]:
ฟังก์ชันที่ต้องมี:
1. การเรียงลำดับคอลัมน์ (Sorting Ascending/Descending) เมื่อกดที่หัวตาราง
2. ช่องค้นหาแบบ Real-time พร้อม Filter สถานะ (Active, Pending, Suspended)
3. Pagination แบบควบคุมหน้า (Previous, Next, ตัวเลขหน้า, และตัวเลือก Rows per page)
4. แสดง Loading Skeleton เมื่อกำลังโหลด และ Empty State เมื่อไม่มีข้อมูล
5. การคำนวณคอลัมน์ที่ยืดหยุ่นและการจัดรูปแบบตัวเลข/วันที่
```

### 24. สร้าง Multi-Step Form พร้อม Validation (React Hook Form + Zod)
```markdown
คุณคือ Senior React Developer
จงเขียนโค้ดระบบ Multi-step Wizard Form (3 ขั้นตอน) สำหรับ [ระบุ เช่น การลงทะเบียนองค์กร]:
- Step 1: ข้อมูลส่วนตัว (ชื่อ, อีเมล, เบอร์โทร)
- Step 2: ข้อมูลบริษัท (ชื่อบริษัท, เลขผู้เสียภาษี, ขนาดองค์กร)
- Step 3: เลือกแพ็กเกจบริการและการยืนยัน
ข้อกำหนด:
1. ใช้ `react-hook-form` ร่วมกับ `zod` สำหรับ Schema Validation
2. ผู้ใช้ไม่สามารถกด "ถัดไป" ได้ถ้าฟอร์มในสเต็ปปัจจุบันยังไม่ผ่านเกณฑ์
3. มี Progress Indicator แสดงเปอร์เซ็นต์หรือขั้นตอนด้านบน
4. สามารถกด "ย้อนกลับ" โดยข้อมูลเดิมที่กรอกไว้ไม่สูญหาย
5. รองรับการแสดงผล Error ข้อความสีแดงใต้แต่ละ Input Field
```

### 25. สร้าง Interactive Dashboard Analytics Component
```markdown
คุณคือ Senior Frontend Data Visualization Engineer
จงสร้าง Dashboard Overview Section โดยใช้ React และ [Recharts / Chart.js]:
ส่วนประกอบ:
1. 4 Metric KPI Cards (ยอดขายรวม, ผู้ใช้ใหม่, Conversion Rate, อัตราตีกลับ) พร้อมตัวเลข % เติบโตเมื่อเทียบกับเดือนก่อน
2. กราฟ Area/Line Chart แสดงสถิติย้อนหลัง 30 วัน พร้อม Custom Tooltip เมื่อนำเมาส์ไปชี้
3. Dropdown ตัวกรองช่วงเวลา (7 วัน, 30 วัน, 1 ปี)
4. การออกแบบที่เน้นความโมเดิร์น โทนสีมินิมอล Responsive บนมือถือและจอคอมพิวเตอร์
```

### 26. ทำ Virtualized List สำหรับข้อมูลขนาดใหญ่ (TanStack Virtual)
```markdown
คุณคือ Performance-Driven Frontend Engineer
ฉันมีรายการข้อมูล [ระบุ เช่น ล็อกการทำงานของเซิร์ฟเวอร์ หรือ รายการสินค้า] จำนวน 20,000 แถว หาก Render ลง DOM ปกติจะทำให้เบราว์เซอร์ค้าง
จงเขียนโค้ด Virtualized List Component ด้วย `@tanstack/react-virtual`:
1. Render เฉพาะแถวที่มองเห็นในหน้าต่าง Viewport เท่านั้น
2. รองรับขนาดแถวแบบคงที่ (Fixed Height) และแบบปรับตามเนื้อหา (Dynamic Height)
3. มีฟังก์ชัน Scroll to index เมื่อต้องการกระโดดไปแถวที่ระบุ
4. แสดงจำนวนแถวทั้งหมดและหน่วยความจำที่ประหยัดได้
```

### 27. สร้าง Accessible Modal Dialog & Slide-over Drawer
```markdown
คุณคือ Frontend UI Specialist
จงเขียนโค้ดสำหรับ Accessible Modal และ Slide-over Drawer Component (ไม่ใช้ไลบรารีสำเร็จรูปภายนอก หรือใช้ Radix Primitives):
คุณสมบัติที่ต้องมี:
1. สั่งเปิด-ปิดด้วย State และมีปุ่มกากบาทปิด
2. ปิดได้เมื่อกดปุ่ม ESC หรือกดที่พื้นที่ Backdrop ภายนอก
3. Focus Trapping: เมื่อเปิด Modal การกด Tab จะต้องวนอยู่เฉพาะข้างใน Modal เท่านั้น
4. ป้องกันการเลื่อนของหน้าเว็บด้านหลัง (`overflow: hidden` บน body)
5. ARIA Roles ครบถ้วน (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`)
```

### 28. สร้าง Search Bar with Debounce & Highlight
```markdown
คุณคือ Frontend JavaScript Expert
จงเขียน Component Search Input พร้อมระบบค้นหาแบบทันที (Instant Search):
1. มีฟังก์ชัน Debounce 300ms เพื่อไม่ให้ Trigger ฟังก์ชันค้นหาถี่เกินไป
2. รองรับไอคอนแว่นขยาย, ปุ่มล้างข้อความ (Clear button), และ Spinner ขณะกำลังค้นหา
3. ผลการค้นหา Dropdown แสดงด้านล่าง
4. ทำ Syntax Highlighting ตัวอักษรที่ตรงกับคำค้นหาในผลลัพธ์
5. รองรับการใช้แป้นพิมพ์ลูกศรขึ้น-ลงเพื่อเลือกรายการ และกด Enter เพื่อเข้าสู่หน้านั้น
```

### 29. เขียน Custom Hook สำหรับ Data Fetching & Caching
```markdown
คุณคือ Senior React Architect
จงเขียน Custom Hook ชื่อ `useFetchWithCache<T>` ในภาษา TypeScript สำหรับเรียก API:
ความสามารถ:
1. รับ URL, Fetch Options, และ Cache TTL (เช่น แคชไว้ 5 นาที)
2. เก็บ Cache ไว้ใน In-memory หรือ SessionStorage
3. รองรับสถานะ `data`, `isLoading`, `isError`, `error`
4. มีฟังก์ชัน `refetch()` สำหรับบังคับดึงข้อมูลใหม่
5. ป้องกัน Race Condition กรณีที่ผู้ใช้เปลี่ยนพารามิเตอร์อย่างรวดเร็ว (ใช้ AbortController)
```

### 30. ติดตั้งและจัดการระบบหลายภาษา (i18n & RTL)
```markdown
คุณคือ Internationalization (i18n) Specialist
จงวางโค้ดและโครงสร้างการทำเว็บรองรับหลายภาษา (ไทย, อังกฤษ, อาหรับ - RTL) ใน [Next.js App Router / React]:
1. โครงสร้างไฟล์ Translation JSON (`th.json`, `en.json`, `ar.json`)
2. Component สำหรับสลับภาษา (Language Switcher Dropdown)
3. การสลับทิศทางหน้าเว็บอัตโนมัติ (`dir="rtl"` หรือ `dir="ltr"`) พร้อมการปรับแต่ง CSS
4. การจัดการคำที่มีตัวแปร (Interpolation) และการจัดการคำพหูพจน์ (Pluralization)
5. การคงสถานะภาษาที่เลือกไว้ใน Cookie หรือ LocalStorage
```

---

## หมวดที่ 4: การพัฒนาส่วนหลังและ API (Backend & API Engineering)

### 31. ระบบ Authentication (JWT, Refresh Token & HTTP-Only Cookie)
```markdown
คุณคือ Senior Backend Security Engineer
จงเขียนโค้ดระบบ Authentication แบบสมบูรณ์ด้วย [Node.js Express / NestJS / Python FastAPI]:
Endpoints:
1. `POST /api/auth/register` (แฮชรหัสผ่านด้วย Argon2 หรือ bcrypt)
2. `POST /api/auth/login` (ตรวจสอบรหัสผ่าน, สร้าง Access Token อายุ 15 นาที และ Refresh Token อายุ 7 วัน)
3. `POST /api/auth/refresh` (ออก Access Token ใหม่โดยส่ง Refresh Token มาทาง HTTP-Only, Secure, SameSite Cookie)
4. `POST /api/auth/logout` (ล้าง Cookie และทำ Revocation Blacklist)
5. Middleware สำหรับตรวจสอบ Bearer Token ใน Protected Routes
```

### 32. CRUD API Boilerplate พร้อม Validation (Clean Architecture)
```markdown
คุณคือ Lead Backend Software Engineer
จงเขียนโครงสร้าง CRUD API สำหรับทรัพยากร [ระบุ เช่น Products สินค้า]:
รูปแบบสถาปัตยกรรม: Clean Architecture (Controller -> Service -> Repository)
ภาษาและเครื่องมือ: [เช่น TypeScript, Express/NestJS, Zod]
ข้อกำหนด:
1. Endpoints: สร้าง (Create), อ่านทั้งหมดพร้อมแบ่งหน้า (List), อ่านรายตัว (Get By ID), แก้ไข (Update), ลบ (Delete)
2. ใช้ Zod ตรวจสอบ Request Body และ Query Params อย่างเข้มงวด
3. Global Error Handling Middleware จับกรณี 400 Validation Error, 404 Not Found, 500 Internal Error
4. โค้ดมีการแยก Layer ชัดเจน Type Safe ทุกจุด
```

### 33. ระบบสิทธิ์การใช้งาน Role-Based Access Control (RBAC)
```markdown
คุณคือ Backend Security Architect
จงออกแบบและเขียน Middleware ระบบตรวจสอบสิทธิ์ (RBAC) สำหรับเว็บแอพพลิเคชันระดับองค์กร:
มีบทบาท (Roles): `SUPER_ADMIN`, `ORG_ADMIN`, `EDITOR`, `VIEWER`
มีสิทธิ์ (Permissions): `users:create`, `users:read`, `users:delete`, `reports:export`
1. โครงสร้าง Database Schema สำหรับจัดเก็บ Roles, Permissions และการผูกกับ User
2. Middleware หรือ Decorator ใน [Node.js / Python] เช่น `@RequirePermissions('users:delete')`
3. การตรวจสอบสิทธิ์แบบ Dynamic ตามบทบาทและตามการเป็นเจ้าของข้อมูล (Resource Ownership Check)
4. การตอบกลับ Error 403 Forbidden ที่ชัดเจนเมื่อสิทธิ์ไม่เพียงพอ
```

### 34. ระบบรับ Webhook พร้อมตรวจสอบลายเซ็น (HMAC Verification)
```markdown
คุณคือ Senior Integration Engineer
จงเขียน Webhook Endpoint สำหรับรับข้อมูลเหตุการณ์จาก [ระบุ เช่น Stripe, GitHub หรือ 2C2P]:
ข้อกำหนด:
1. ตรวจสอบลายเซ็นดิจิทัล (HMAC-SHA256 Signature Verification) จาก Request Header กับ Raw Request Body
2. ป้องกัน Replay Attack โดยตรวจสอบ Timestamp ของ Webhook
3. Idempotency Handling: ตรวจสอบ Event ID ไม่ให้ประมวลผลงานซ้ำซ้อน
4. ตอบกลับ HTTP 200 อย่างรวดเร็ว และผลักงานหนักไปทำเบื้องหลัง
5. การจัดการ Error Logging หากลายเซ็นไม่ถูกต้อง
```

### 35. ระบบ Background Job Queue (Redis + BullMQ)
```markdown
คุณคือ Backend Distributed Systems Engineer
จงเขียนโค้ดจัดการคิวงานเบื้องหลัง (Background Worker) ด้วย Node.js, TypeScript และ BullMQ ร่วมกับ Redis:
ประเภทงาน: [ระบุ เช่น ส่งอีเมลแจ้งเตือนใบเสร็จ และแปลงไฟล์ PDF รายงานประจำเดือน]
1. การสร้าง Queue Producer เพื่อสั่งเพิ่มงานเข้าคิว
2. การสร้าง Worker Consumer เพื่อดึงงานไปประมวลผล พร้อมจัดการ Concurrency (เช่น ทำพร้อมกัน 5 งาน)
3. ระบบ Automatic Retry with Exponential Backoff เมื่อเกิดข้อผิดพลาด
4. การจัดการ Dead Letter Queue (DLQ) หรืองานที่ล้มเหลวเกินโควตา
5. Event Listeners (completed, failed, progress) สำหรับบันทึก Log
```

### 36. ระบบอัปโหลดไฟล์ตรงผ่าน S3 Presigned URL
```markdown
คุณคือ Cloud Backend Engineer
จงเขียนระบบอัปโหลดไฟล์ขนาดใหญ่ (รูปภาพ/วิดีโอ) ตรงไปยัง AWS S3 หรือ Cloudflare R2 โดยไม่ต้องผ่านแบนด์วิดท์ของ Web Server:
1. Backend Endpoint: รับชื่อไฟล์, ขนาดไฟล์, และ MIME Type แล้วส่ง S3 Presigned PUT URL กลับไป (หมดอายุใน 5 นาที)
2. การตรวจสอบชนิดไฟล์ (File Whitelist) และจำกัดขนาดไม่เกิน [ระบุ เช่น 10MB]
3. ฝั่ง Frontend: โค้ด JavaScript ในการทำ Direct Upload ไปยัง S3 พร้อมแถบแสดง Progress Bar (0-100%)
4. Webhook / S3 Event Notification เพื่อสั่งปรับขนาดรูปภาพอัตโนมัติหลังอัปโหลดเสร็จ
```

### 37. ระบบ Real-Time WebSockets สำหรับการแจ้งเตือนสด
```markdown
คุณคือ Real-Time Systems Specialist
จงเขียน WebSocket Server ด้วย [Socket.io หรือ Native ws] บน Node.js:
เป้าหมาย: ระบบแจ้งเตือนสด (Live Notifications) สำหรับผู้ใช้งานเว็บ
1. การ Authentication ผู้ใช้ผ่าน Token ในจังหวะ Handshake
2. การจัดกลุ่มผู้ใช้ตาม User ID และ Room (`socket.join(userId)`)
3. ฟังก์ชันสั่งส่งแจ้งเตือนจากส่วนอื่นๆ ของระบบ (เช่น เมื่อมีคอมเมนต์ใหม่ หรือยอดเงินเข้า)
4. การจัดการ Connection Lifecycle (Disconnect, Reconnect, Heartbeat/Ping-Pong)
5. การสเกลระบบข้ามหลายเซิร์ฟเวอร์ด้วย Redis Adapter
```

### 38. ระบบ Rate Limiting & Throttling (Redis Token Bucket)
```markdown
คุณคือ Web Security & Reliability Engineer
จงเขียน Middleware ป้องกัน API โดนยิงสแปม (Rate Limiting) ด้วย Redis:
เงื่อนไข:
- ผู้ใช้ทั่วไป (Anonymous IP): จำกัด 60 requests ต่อนาที
- ผู้ใช้ที่ล็อกอินแล้ว (User ID): จำกัด 300 requests ต่อนาที
- Endpoint พิเศษ (`/api/auth/login`): จำกัด 5 ครั้งต่อ 15 นาที
1. การเขียนอัลกอริทึม Sliding Window หรือ Token Bucket
2. การส่ง Headers มาตรฐานกลับไป (`RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`)
3. การตอบกลับ Error 429 Too Many Requests พร้อมข้อความบอกเวลาที่ปลดบล็อก
```

### 39. เชื่อมต่อ Payment Gateway (Stripe Checkout)
```markdown
คุณคือ Fintech Integration Engineer
จงเขียนระบบรับชำระเงินออนไลน์ด้วย Stripe Checkout ใน [Node.js / Next.js]:
1. Endpoint `POST /api/checkout/create-session`: สร้าง Stripe Checkout Session รองรับบัตรเครดิตและ PromptPay
2. การส่ง Metadata (Order ID, Customer ID) เข้าไปใน Session
3. Endpoint รับ Webhook `POST /api/webhooks/stripe`: ดักจับ Event `checkout.session.completed`
4. การอัปเดตสถานะออเดอร์ในฐานข้อมูลเป็น `PAID` ภายใน Database Transaction
5. การจัดการกรณียกเลิกการชำระเงินและ Redirect ผู้ใช้กลับหน้าผลลัพธ์
```

### 40. ออกแบบ GraphQL Schema และแก้ปัญหา N+1 ด้วย DataLoader
```markdown
คุณคือ GraphQL Specialist
จงออกแบบ GraphQL Schema สำหรับระบบ [ระบุ เช่น บล็อกบทความที่มี ผู้เขียน (Author), บทความ (Post), และความคิดเห็น (Comment)]:
1. GraphQL Type Definitions (Query, Mutation, Types)
2. Resolver Functions สำหรับดึงข้อมูล
3. อธิบายปัญหา N+1 Query ที่เกิดขึ้นเมื่อดึงรายการบทความพร้อมผู้เขียน
4. เขียนโค้ดแก้ไขด้วย `DataLoader` เพื่อทำ Batching และ In-memory Caching
5. การตั้งค่า Query Complexity & Depth Limit เพื่อป้องกัน DoS Attack
```

---

## หมวดที่ 5: ฐานข้อมูลและการจัดการ Data

### 41. ออกแบบ PostgreSQL Schema & Indexing Strategy
```markdown
คุณคือ Principal PostgreSQL DBA
จงออกแบบ Schema และกลยุทธ์ Indexing สำหรับระบบ [ระบุ เช่น แพลตฟอร์มอีคอมเมิร์ซที่มีตาราง Users, Products, Orders, OrderItems]:
1. DDL คำสั่ง `CREATE TABLE` พร้อม Foreign Keys, Checks, และ Constraints ครบถ้วน
2. การเลือกใช้ Data Types ที่เหมาะสมที่สุด (เช่น `UUIDv7`, `TIMESTAMPTZ`, `DECIMAL(12,2)`)
3. การวิเคราะห์และสร้าง Indexes (B-Tree, GIN สำหรับ JSONB/Full-text, Composite Index)
4. อธิบายเหตุผลที่ไม่ควรสร้าง Index มากเกินไป
5. การตั้งค่า Partitioning สำหรับตาราง Order หรือ Logs ที่มีข้อมูลเกิน 10 ล้านแถว
```

### 42. ออกแบบ Prisma / Drizzle ORM Schema
```markdown
คุณคือ Modern ORM Specialist
จงเขียนไฟล์ Schema สำหรับ [Prisma หรือ Drizzle ORM] ในโปรเจกต์เว็บ [ระบุประเภทธุรกิจ เช่น ระบบจัดการคลินิกสัตว์เลี้ยง]:
1. กำหนด Models และ Relations (One-to-One, One-to-Many, Many-to-Many with Explicit Join Table)
2. การใช้ Enums สำหรับสถานะต่างๆ
3. การตั้งค่า Cascade On Delete และ On Update อย่างปลอดภัย
4. คำสั่ง Migration และการตั้งค่า Client Generator
5. โค้ดตัวอย่างการ Query ข้อมูลแบบ Nested Include / Eager Loading
```

### 43. เขียน Complex SQL Query สำหรับ Dashboard รายงาน
```markdown
คุณคือ Senior SQL & Business Intelligence Specialist
ฉันมีฐานข้อมูล PostgreSQL สำหรับร้านค้าออนไลน์
จงเขียนคำสั่ง SQL ขั้นสูงเพื่อดึงรายงานวิเคราะห์ยอดขายรายเดือนย้อนหลัง 12 เดือน:
เงื่อนไขการคำนวณ:
1. ยอดขายรวมสุทธิ (หลังหักส่วนลดและยอดคืนสินค้า)
2. อัตราการเติบโตเมื่อเทียบกับเดือนก่อนหน้า (Month-over-Month Growth %)
3. ลูกค้าที่มียอดซื้อสูงสุด 3 อันดับแรกของแต่ละเดือน (ใช้ Window Function `DENSE_RANK()`)
4. ใช้ Common Table Expressions (CTE) เพื่อให้อ่านง่ายและทำงานเร็ว
5. ใช้ `EXPLAIN ANALYZE` อธิบายจุดที่อาจเกิด Performance Bottleneck
```

### 44. กลยุทธ์ In-Memory Caching ด้วย Redis (Cache-Aside)
```markdown
คุณคือ Database Performance Engineer
จงเขียนฟังก์ชันการดึงข้อมูลและกลยุทธ์ Caching แบบ Cache-Aside Pattern ด้วย Node.js และ Redis:
สำหรับข้อมูล: [ระบุ เช่น หน้ารายละเอียดสินค้าที่มีคนดูซ้ำๆ นาทีละหลายหมื่นครั้ง]
1. ตรวจสอบข้อมูลใน Redis Cache ก่อน ถ้ามีให้ Return ทันที (Cache Hit)
2. ถ้าไม่มีให้ Query จากฐานข้อมูลหลัก บันทึกลง Redis พร้อมตั้งค่า TTL (เช่น 10 นาที) แล้ว Return (Cache Miss)
3. ป้องกันปัญหา Cache Stampede / Thundering Herd ด้วย Mutex Lock หรือ Probabilistic Early Expiration
4. กลยุทธ์ Cache Invalidation เมื่อสินค้าถูกอัปเดตสต็อกหรือราคา
```

### 45. ติดตั้งระบบ Full-Text Search ภาษาไทย/อังกฤษ
```markdown
คุณคือ Search Engine Specialist
ฉันต้องการสร้างระบบค้นหาสำหรับเว็บไซต์ [ระบุ เช่น ค้นหาบทความความรู้ หรือ ค้นหาสินค้า]:
จงแนะนำและเขียนโค้ดการทำ Full-Text Search โดยเลือกจาก [PostgreSQL tsvector หรือ Meilisearch]:
1. การตัดคำ (Tokenization) รองรับภาษาไทยและภาษาอังกฤษ
2. การรับมือคำสะกดผิดเบื้องต้น (Typo Tolerance / Fuzzy Search)
3. การคิดคะแนนความเกี่ยวข้อง (Relevance Ranking & Scoring)
4. การทำ Faceted Search (กรองตามหมวดหมู่, ช่วงราคา, คะแนนรีวิว)
5. ตัวอย่าง Query ค้นหาที่มีความเร็วตอบสนองต่ำกว่า 50ms
```

### 46. จัดการ Database Connection Pooling (PgBouncer / Serverless)
```markdown
คุณคือ Infrastructure & Database Architect
ฉันกำลังรันเว็บแอพพลิเคชันบนสถาปัตยกรรม Serverless (เช่น Vercel / AWS Lambda) ซึ่งทำให้เกิดปัญหา Connection ของฐานข้อมูล PostgreSQL เต็มอย่างรวดเร็ว (Error: remaining connection slots are reserved for non-replication superuser connections)
จงอธิบายแนวทางแก้ไขอย่างเป็นระบบ:
1. การตั้งค่า Connection Pooling (เช่น PgBouncer หรือ Supabase Pooler)
2. ความแตกต่างระหว่าง Session Pooling vs Transaction Pooling
3. การปรับแต่งขนาด Pool Size และ Timeout ที่เหมาะสม
4. การจัดการ Prisma Data Proxy หรือ Driver Adapters สำหรับ Edge Runtime
```

### 47. ออกแบบ MongoDB Schema (Embedding vs Referencing)
```markdown
คุณคือ Senior NoSQL Architect
จงออกแบบ MongoDB Schema สำหรับระบบ [ระบุ เช่น ระบบเว็บบอร์ดหรือ Social Feed ที่มี User, Posts, Comments, Likes]:
1. เปรียบเทียบและตัดสินใจเลือกระหว่าง Embedding (ฝังข้อมูล) vs Referencing (อ้างอิง ID) ในแต่ละความสัมพันธ์
2. การรับมือปัญหา Document Size เกินขีดจำกัด 16MB (เช่น โพสต์ที่มีคนคอมเมนต์หลักแสนคน)
3. การเขียน Aggregation Pipeline สำหรับดึงโพสต์พร้อม 5 คอมเมนต์ล่าสุดและจำนวนไลก์
4. การสร้าง Indexes ที่จำเป็นสำหรับ Query Performance
```

### 48. ระบบ Soft Delete และ Audit Trail Logging
```markdown
คุณคือ Database Compliance & Integrity Specialist
ระบบเว็บของฉันจำเป็นต้องผ่านมาตรฐานความปลอดภัย ไม่สามารถลบข้อมูลผู้ใช้ออกจริงทันที และต้องบันทึกประวัติการเปลี่ยนแปลงทุกครั้ง
จงออกแบบระบบ Soft Delete และ Audit Trail ใน [PostgreSQL / Prisma / TypeORM]:
1. การเพิ่มฟิลด์ `deleted_at`, `deleted_by` และการทำ Filter อัตโนมัติในทุก Query
2. ออกแบบตาราง `audit_logs` บันทึก: ใครแก้ไข (user_id), ทำอะไร (action), เมื่อไหร่ (timestamp), ข้อมูลเดิม (old_data JSONB), ข้อมูลใหม่ (new_data JSONB)
3. การใช้ Database Triggers หรือ ORM Interceptors ในการดักจับอัตโนมัติ
4. การกู้คืนข้อมูล (Restore Soft Deleted Record) อย่างปลอดภัย
```

### 49. แผนสำรองข้อมูลและกู้คืน (Backup & Disaster Recovery)
```markdown
คุณคือ Cloud Database Reliability Engineer
จงร่างแผน Disaster Recovery (DR) สำหรับฐานข้อมูลหลักของเว็บไซต์:
กำหนดเป้าหมาย: Recovery Time Objective (RTO) < 1 ชั่วโมง, Recovery Point Objective (RPO) < 5 นาที
1. กลยุทธ์การทำ Automated Daily Snapshot และ Continuous WAL Archiving (Point-in-Time Recovery - PITR)
2. การสำรองข้อมูลข้าม Region (Cross-Region Backup) เพื่อป้องกันกรณี Cloud Data Center ล่ม
3. สคริปต์ขั้นตอนจำลองการกู้คืนข้อมูล (Drill Run Script) จากไฟล์ Backup สู่ Staging Server
4. แผนการตรวจสอบความสมบูรณ์ของไฟล์สำรอง (Backup Integrity Test)
```

### 50. สร้างสคริปต์ Mock Data / Seed Database (Faker.js)
```markdown
คุณคือ Quality & Testing Automation Engineer
จงเขียนสคริปต์สร้างข้อมูลจำลอง (Database Seeder) ด้วย TypeScript และ `@faker-js/faker`:
สำหรับระบบ [ระบุ เช่น เว็บโรงพยาบาลหรือคลินิก]:
1. สร้างข้อมูล Users (หมอ, พยาบาล, คนไข้) จำนวน 100 คน
2. สร้างข้อมูล ประวัติการนัดหมาย (Appointments) จำนวน 500 รายการ โดยผูกความสัมพันธ์กับ User อย่างสมเหตุสมผล
3. ข้อมูลตัวเลขและวันที่ต้องมีความสมจริง (เช่น วันนัดหมายต้องไม่เป็นอดีต, เบอร์โทรศัพท์ขึ้นต้นถูกต้อง)
4. ความเร็วในการ Insert ข้อมูลจำนวนมาก (ใช้ Batch Insert / `createMany`)
```

---

## หมวดที่ 6: ความปลอดภัยและการปกป้องระบบเว็บ

### 51. ตรวจสอบความปลอดภัยตามเกณฑ์ OWASP Top 10
```markdown
คุณคือ Certified Web Application Security Auditor (OSCP/CISSP)
จงทำการ Audit โค้ดเบสเว็บ [ระบุภาษาและเฟรมเวิร์ก เช่น Node.js Express / Next.js] เพื่อค้นหาช่องโหว่ตามเกณฑ์ OWASP Top 10 ล่าสุด:
1. Broken Access Control (การเข้าถึงข้อมูลข้าม User ID)
2. Cryptographic Failures (การเก็บรหัสผ่านหรือ Token ที่ไม่ปลอดภัย)
3. Injection (SQL, NoSQL, Command Injection)
4. Insecure Design & Security Misconfiguration
5. Vulnerable and Outdated Components
กรุณายกตัวอย่างจุดบกพร่องที่พบบ่อย พร้อมโค้ดตัวอย่างก่อนแก้ (Vulnerable) และหลังแก้ (Secure)
```

### 52. ตั้งค่า Content Security Policy (CSP) & HTTP Security Headers
```markdown
คุณคือ Web Security Specialist
จงเขียน Configuration สำหรับตั้งค่า HTTP Security Headers บน [Nginx / Next.js `next.config.js` / Express Helmet]:
1. Content-Security-Policy (CSP) ที่เข้มงวด: ป้องกันการโหลดสคริปต์เถื่อน แต่ยังยอมรับ Google Analytics, Stripe, และ Google Fonts (แนะนำการใช้ Nonce)
2. Strict-Transport-Security (HSTS) พร้อม preload
3. X-Content-Type-Options: nosniff
4. X-Frame-Options: DENY (ป้องกัน Clickjacking)
5. Referrer-Policy: strict-origin-when-cross-origin
6. Permissions-Policy: ปิดการเข้าถึง Camera, Microphone, Geolocation หากไม่จำเป็น
```

### 53. ป้องกันช่องโหว่ XSS และ Sanitization เชิงลึก
```markdown
คุณคือ Application Security Engineer
เว็บไซต์ของฉันมีฟังก์ชัน [ระบุ เช่น ช่องแสดงความคิดเห็น หรือ โปรไฟล์ผู้ใช้ที่ยอมรับข้อความ Rich Text / HTML]:
จงแนะนำแนวทางการป้องกัน Cross-Site Scripting (XSS) ทุกมิติ (Stored, Reflected, DOM-based):
1. การเลือกใช้ Sanitization Library (เช่น `DOMPurify` ฝั่ง Client และ `sanitize-html` ฝั่ง Server)
2. กฎการ Whitelist HTML Tags และ Attributes ที่อนุญาตอย่างปลอดภัย
3. ข้อควรระวังในการใช้ `dangerouslySetInnerHTML` ใน React
4. การ Encode ข้อมูลก่อนนำไปแสดงผลใน Context ต่างๆ (HTML Body, Attribute, JavaScript String)
```

### 54. ตั้งค่า CORS Policy และการป้องกัน CSRF
```markdown
คุณคือ Web Security Architect
จงอธิบายและเขียนโค้ดตั้งค่า Cross-Origin Resource Sharing (CORS) และการป้องกัน CSRF สำหรับระบบ API และ Web Frontend:
1. การกำหนด Origin Whitelist แบบชัดเจน (ไม่ใช้ `Access-Control-Allow-Origin: *` เมื่อมี Credentials)
2. การตั้งค่า Preflight Caching (`Access-Control-Max-Age`)
3. การตั้งค่า Cookie Attributes (`SameSite=Lax/Strict`, `Secure`, `HttpOnly`) เพื่อหยุดยั้ง CSRF
4. กรณีที่จำเป็นต้องใช้ CSRF Token (เช่น Double Submit Cookie Pattern) และโค้ดตัวอย่าง
```

### 55. ปฏิบัติตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล (PDPA / GDPR)
```markdown
คุณคือ Data Privacy & Web Compliance Engineer
จงออกแบบสถาปัตยกรรมและฟังก์ชันทางเทคนิคเพื่อให้เว็บไซต์สอดคล้องกับกฎหมาย PDPA / GDPR:
1. ระบบบันทึกความยินยอมคุกกี้ (Cookie Consent Banner) ที่แยกระหว่าง Strictly Necessary, Analytics, Marketing
2. ฟังก์ชัน "Right to Access" (ดาวน์โหลดข้อมูลส่วนบุคคลเป็น JSON/CSV)
3. ฟังก์ชัน "Right to be Forgotten" (การลบข้อมูลถาวรหรือทำ Data Anonymization ไม่ให้ระบุตัวตนได้)
4. การเข้ารหัสข้อมูลอ่อนไหว (PII) ระดับฐานข้อมูล (Encryption at Rest ด้วย AES-256)
```

### 56. ตรวจสอบความปลอดภัย API และป้องกัน Secret Leakage
```markdown
คุณคือ DevSecOps Engineer
จงให้แนวทางและคำสั่งตรวจสอบโค้ดเพื่อป้องกัน API Key, Database Password, และ Private Key หลุดสู่สาธารณะ:
1. การติดตั้ง Pre-commit Hook เพื่อสแกน Secrets (เช่น `git-secrets`, `trufflehog`)
2. กฎการเขียน `.gitignore` สำหรับเว็บโปรเจกต์
3. การจัดการ Secrets บน Production ผ่านบริการคลาวด์ (AWS Secrets Manager, Doppler, Vault)
4. ขั้นตอนฉุกเฉิน (Incident Playbook) เมื่อพบว่า Secret Key หลุดขึ้น GitHub Public Repository
```

### 57. ระบบป้องกัน Brute Force และ 2FA (TOTP)
```markdown
คุณคือ Cybersecurity Specialist
จงเขียนโค้ดระบบความปลอดภัยสำหรับหน้าล็อกอิน:
1. การตรวจสอบ Brute Force Attack: ล็อกบัญชีชั่วคราว 15 นาที เมื่อกรอกรหัสผ่านผิดเกิน 5 ครั้ง
2. ระบบ Two-Factor Authentication (2FA) โดยใช้มาตรฐาน RFC 6238 (TOTP):
   - ฟังก์ชันสร้าง Secret Key และแสดงผลเป็น QR Code สำหรับ Google Authenticator
   - ฟังก์ชันตรวจสอบรหัส 6 หลัก (Verify Token)
   - การสร้าง Backup Recovery Codes 8 ชุด สำหรับกรณีผู้ใช้ทำโทรศัพท์หาย
```

### 58. ระบบตรวจสอบความปลอดภัยของไฟล์อัปโหลด
```markdown
คุณคือ Web Application Firewall & Security Specialist
จงเขียนฟังก์ชันตรวจสอบไฟล์ที่ผู้ใช้อัปโหลดขึ้นเว็บ [ระบุ เช่น ไฟล์รูปโปรไฟล์ หรือ เอกสาร PDF]:
1. การตรวจสอบ Magic Numbers / File Signatures ในระดับไบนารี ไม่เชื่อถือเฉพาะ Extension หรือ `Content-Type` Header
2. การเปลี่ยนชื่อไฟล์ใหม่ทั้งหมด (UUIDv4) และตัด Path Traversal (`../`) ทิ้ง
3. การถอด EXIF Metadata (เช่น ตำแหน่ง GPS, ชื่ออุปกรณ์) ออกจากภาพเพื่อความเป็นส่วนตัว
4. การจำกัดขนาดไฟล์และโควตาต่อผู้ใช้
5. การแยก Storage ไปไว้บนโดเมนเฉพาะ (Isolated Static Domain)
```

### 59. Checklist การทดสอบเจาะระบบก่อนเปิดตัว (Penetration Test)
```markdown
คุณคือ Lead Penetration Tester
จงจัดทำ Pre-launch Web Security Penetration Testing Checklist ครบวงจร:
1. Authentication & Session Management Tests (Session fixation, Token entropy, Password reset flow)
2. Business Logic Flaws (การแก้ราคาสินค้าใน Request, การสั่งซื้อจำนวนติดลบ)
3. File & Resource Access (IDOR - Insecure Direct Object References)
4. Server Misconfiguration (Directory listing, Debug mode ค้างบน Production, Default credentials)
5. Denial of Service (DoS) Resistance ที่ระดับ Application
```

### 60. แผนตอบสนองเมื่อระบบถูกแฮก (Security Incident Response)
```markdown
คุณคือ Cyber Incident Response Commander
เว็บไซต์เกิดเหตุฉุกเฉิน: มีการตรวจพบว่าฐานข้อมูลผู้ใช้รั่วไหลออกสู่ภายนอก
จงร่าง Security Incident Response Playbook 6 ขั้นตอนตามมาตรฐาน NIST:
1. Preparation & Detection: วิธีการยืนยันช่องโหว่และขอบเขตความเสียหาย
2. Containment (การควบคุมสถานการณ์): ขั้นตอนตัดการเชื่อมต่อ, การเปลี่ยน Credentials ทั้งระบบ
3. Eradication (การกำจัดต้นตอ): อุดช่องโหว่และล้าง Backdoor
4. Recovery (การฟื้นฟู): ตรวจสอบความถูกต้องของข้อมูลก่อนเปิดระบบกลับมา
5. Post-Incident Review: การทำ Root Cause Analysis (RCA) และการแถลงข่าวต่อผู้ใช้งานตามข้อกำหนดกฎหมาย
```

---

## หมวดที่ 7: การทดสอบและการประกันคุณภาพ (Testing & QA)

### 61. เขียน Unit Tests สำหรับ Business Logic (Vitest / Jest)
```markdown
คุณคือ Test-Driven Development (TDD) Specialist
จงเขียน Unit Test ด้วย [Vitest / Jest] สำหรับฟังก์ชันคำนวณ [ระบุ เช่น การคำนวณส่วนลดโปรโมชั่น, แต้มสะสม และภาษีมูลค่าเพิ่ม]:
ข้อกำหนด:
1. ครอบคลุม Happy Path (การทำงานปกติ)
2. ครอบคลุม Edge Cases (ยอดซื้อเป็นศูนย์, ยอดซื้อติดลบ, โค้ดส่วนลดหมดอายุ, ซื้อข้ามระดับ Tier)
3. การทดสอบประเภทข้อมูลผิดพลาด (Invalid Input Types)
4. โค้ดสะอาด เข้าใจง่าย ตามโครงสร้าง Arrange-Act-Assert (AAA)
5. เป้าหมาย Code Coverage 100% สำหรับโมดูลนี้
```

### 62. เขียน Component Testing ด้วย React Testing Library
```markdown
คุณคือ Senior Frontend Quality Engineer
จงเขียน Test Suite ด้วย React Testing Library และ `@testing-library/user-event` สำหรับ Component [ระบุ เช่น ฟอร์มค้นหาพร้อม Dropdown ผลลัพธ์]:
1. ทดสอบว่า Component Render ถูกต้องในค่าเริ่มต้น
2. ทดสอบจำลองการพิมพ์ของผู้ใช้ และการแสดง Loading State
3. ทดสอบการกดเลือกผลลัพธ์และการเรียก Callback Function พร้อมค่าที่ถูกต้อง
4. ทดสอบกรณีค้นหาไม่พบข้อมูล (Empty State Text)
5. ยึดหลัก Testing Implementation Details: ค้นหา Element ผ่าน Accessibility Role (`getByRole`) แทนการใช้ `className` หรือ `data-testid`
```

### 63. เขียน End-to-End (E2E) Test ด้วย Playwright
```markdown
คุณคือ Lead QA Automation Engineer
จงเขียนสคริปต์ Automated E2E Test ด้วย Playwright (TypeScript) สำหรับทดสอบ Core User Flow ของเว็บ:
Flow: สมัครสมาชิกใหม่ -> ยืนยันอีเมลจำลอง -> ล็อกอินเข้าสู่ระบบ -> เพิ่มสินค้าลงตะกร้า -> สั่งซื้อสำเร็จ
ข้อกำหนด:
1. มีการใช้ Page Object Model (POM) เพื่อให้โค้ดบำรุงรักษาง่าย
2. การจัดการ Wait State และ Dynamic Elements อย่างเสถียร (ไม่มี Flaky Tests)
3. การบันทึก Screenshot และ Video อัตโนมัติเมื่อ Test ล้มเหลว
4. การรันแบบ Headless และรันข้ามหลายเบราว์เซอร์ (Chromium, Firefox, WebKit)
```

### 64. เขียน API Integration Tests ด้วย Supertest
```markdown
คุณคือ Backend QA Engineer
จงเขียน Integration Test Suite สำหรับ REST API ด้วย [Supertest / Jest] บน Node.js:
เป้าหมาย: ตรวจสอบ API เส้น `/api/orders`
1. ทดสอบการสร้าง Order เมื่อแนบ Valid Bearer Token (คาดหวัง 201 Created พร้อม Response Schema ที่ตรงสเปก)
2. ทดสอบกรณีไม่แนบ Token หรือ Token หมดอายุ (คาดหวัง 401 Unauthorized)
3. ทดสอบกรณีสั่งซื้อสินค้าที่สต็อกหมด (คาดหวัง 422 Unprocessable Entity)
4. การทำ Database Setup & Teardown ก่อนและหลังรันแต่ละ Test Case
```

### 65. ติดตั้ง Mock Service Worker (MSW) สำหรับจำลอง API
```markdown
คุณคือ Frontend Developer & Testing Specialist
จงเขียนการตั้งค่า Mock Service Worker (MSW) เพื่อดักจับ Network Request ทั้งในการพัฒนา Local และการรัน Unit Tests:
1. การสร้าง Request Handlers สำหรับ Endpoints: `GET /api/user/profile` และ `POST /api/login`
2. การจำลอง Network Delay (Latency 500ms) และจำลอง Error 500
3. การผูก Worker เข้ากับเบราว์เซอร์ในโหมด Development
4. การผูก Server เข้ากับ Vitest/Jest ในโหมด Testing
```

### 66. สร้าง Matrix ทดสอบ Boundary Values และ Edge Cases
```markdown
คุณคือ Senior QA Test Analyst
จงจัดทำ Test Case Matrix ครอบคลุมการทดสอบค่าขอบเขต (Boundary Value Analysis) และกรณีวิกฤต (Edge Cases) สำหรับฟอร์ม [ระบุ เช่น ฟอร์มโอนเงิน หรือ ฟอร์มสมัครงาน]:
ตารางประกอบด้วย:
1. Test Case ID & Description
2. Input Field & Test Data (ค่าต่ำสุด, ค่าสูงสุด, ค่าติดลบ, สัญลักษณ์พิเศษ, Unicode, SQL Injection string)
3. Expected Behavior (การตอบสนองที่ถูกต้องของระบบ)
4. Severity Level (Critical, High, Medium, Low)
```

### 67. เขียนสคริปต์โหลดเทส (Load & Stress Testing) ด้วย k6
```markdown
คุณคือ Performance & Site Reliability Engineer
จงเขียนสคริปต์ทดสอบประสิทธิภาพระบบด้วย Grafana k6 (JavaScript):
เป้าหมาย: ทดสอบ Endpoint [ระบุ URL เช่น `POST /api/checkout`]
สถานการณ์จำลอง (Load Profile):
- Ramp-up: ไต่ระดับจาก 0 ถึง 500 Virtual Users (VUs) ใน 2 นาที
- Stay: คงที่ที่ 500 VUs เป็นเวลา 5 นาที
- Stress-test: ดันขึ้นไปที่ 1,500 VUs เป็นเวลา 1 นาทีเพื่อหาจุดล่ม
ข้อกำหนด:
1. กำหนดเกณฑ์ Thresholds: p95 response time ต้องน้อยกว่า 800ms, Error rate ต้องน้อยกว่า 1%
2. มีการสุ่มข้อมูล Request Payload ให้สมจริง
```

### 68. วางแผนการทดสอบถดถอย (Regression Testing Plan)
```markdown
คุณคือ QA Lead Manager
ทีมพัฒนากำลังจะปล่อยอัปเดตระบบใหญ่ (Major Release) สำหรับเว็บแอพพลิเคชัน
จงจัดทำ Regression Testing Plan เพื่อให้มั่นใจว่าฟีเจอร์เดิมจะไม่พัง:
1. การคัดแยกและจัดลำดับความสำคัญของ Test Cases (Tier 1 Smoke Tests, Tier 2 Critical Paths, Tier 3 Edge Cases)
2. แผนการแบ่งงานระหว่าง Automated Regression และ Manual Exploratory Testing
3. Release Checklist & Sign-off Criteria (เงื่อนไขที่ยอมรับให้ Deploy ขึ้น Production ได้)
```

### 69. Cross-Browser & Multi-Device Compatibility Test Matrix
```markdown
คุณคือ Cross-Platform QA Specialist
จงออกแบบ Test Matrix สำหรับตรวจสอบความเข้ากันได้ของเว็บไซต์:
1. รายชื่อเบราว์เซอร์และเวอร์ชันหลัก (Chrome, Safari, Edge, Firefox, Samsung Internet)
2. รายชื่อระบบปฏิบัติการและขนาดหน้าจอ (iOS บน iPhone หลากรุ่น, Android หลากแบรนด์, Windows, macOS)
3. ประเด็นที่มักพบปัญหาเฉพาะแพลตฟอร์ม (เช่น Safari 100vh bug, Date picker บนมือถือ, Font rendering)
4. วิธีการบันทึกและติดตามข้อผิดพลาดข้ามแพลตฟอร์ม
```

### 70. ติดตั้ง Automated Accessibility Testing (Axe-core)
```markdown
คุณคือ Accessibility QA Engineer
จงเขียนสคริปต์รวมการทดสอบ Accessibility อัตโนมัติด้วย `@axe-core/playwright` ใน CI/CD Pipeline:
1. สแกนหน้าเว็บหลักและรายงานข้อผิดพลาดที่ขัดต่อเกณฑ์ WCAG 2.1 AA
2. กรองเฉพาะข้อผิดพลาดระดับ `critical` และ `serious` เพื่อสั่งให้ Build Fail ทันที
3. สร้างรายงาน HTML หรือ JSON สรุปจุดที่ต้องแก้ไข (รวมถึง CSS Selector ที่มีปัญหา)
```

---

## หมวดที่ 8: ประสิทธิภาพ ความเร็ว และ Core Web Vitals

### 71. วิเคราะห์และปรับปรุง Core Web Vitals (LCP, INP, CLS)
```markdown
คุณคือ Google Web Vitals Optimization Specialist
เว็บไซต์ของฉันมีปัญหาคะแนน PageSpeed ต่ำ โดยมีค่าชี้วัดดังนี้:
- Largest Contentful Paint (LCP): 4.2s (ช้าเกินไป เกณฑ์ควร < 2.5s)
- Interaction to Next Paint (INP): 350ms (หน่วง เกณฑ์ควร < 200ms)
- Cumulative Layout Shift (CLS): 0.28 (กระตุก เกณฑ์ควร < 0.1)

จงวิเคราะห์สาเหตุที่เป็นไปได้และเขียน Action Plan ทีละขั้นตอนเพื่อปรับปรุงทั้ง 3 ค่าให้เป็นสีเขียวทั้งหมด
```

### 72. กลยุทธ์การปรับแต่งรูปภาพ (Next-Gen Formats & Lazy Loading)
```markdown
คุณคือ Frontend Asset Optimization Specialist
หน้าแรกของเว็บมีรูปภาพสินค้าและแบนเนอร์จำนวนมาก ทำให้หน้าเว็บโหลดช้า
จงวางแนวทางแก้ไขเชิงเทคนิคอย่างละเอียด:
1. การแปลงไฟล์เป็น WebP และ AVIF พร้อม Fallback สำหรับเบราว์เซอร์รุ่นเก่า
2. การใช้ `<picture>` tag ร่วมกับ `srcset` และ `sizes` ตาม Viewport
3. การตั้งค่า `loading="lazy"` สำหรับภาพด้านล่าง และ `priority` / `fetchpriority="high"` สำหรับภาพ LCP ตัวแรก
4. การใช้ Low-Quality Image Placeholders (LQIP / BlurHash)
5. การป้องกัน Layout Shift ด้วยการระบุ `width`, `height` หรือ CSS `aspect-ratio` อย่างเคร่งครัด
```

### 73. การทำ Code Splitting และ Dynamic Imports
```markdown
คุณคือ Webpack / Vite / Turbopack Performance Engineer
ไฟล์ JavaScript Bundle เริ่มต้นของเว็บมีขนาดใหญ่ถึง 1.8MB ทำให้ First Load ช้ามาก
จงเขียนแนวทางการลด Bundle Size:
1. การทำ Route-based Code Splitting ด้วย `React.lazy()` และ `Suspense`
2. การทำ Component-level Dynamic Import สำหรับส่วนที่ยังไม่เห็นทันที (เช่น Modal, Heavy Chart, Rich Text Editor)
3. การตัด Tree-shaking Dead Code และการแทนที่ไลบรารีขนาดใหญ่ (เช่น เปลี่ยนจาก Moment.js เป็น Day.js)
4. การตั้งค่า SplitChunks ใน Build Tool เพื่อแยก Vendor Chunk และ App Code
```

### 74. เลือกและตั้งค่า Rendering Strategy (SSR, SSG, ISR)
```markdown
คุณคือ Next.js & Full-Stack Architect
จงช่วยประเมินและเลือกกลยุทธ์การเรนเดอร์ที่เหมาะสมที่สุดสำหรับแต่ละหน้าในระบบ E-commerce:
- หน้าแรก (Home): เปลี่ยนแปลงวันละครั้ง มีภาพเยอะ
- หน้าแสดงสินค้า (Product Detail): มีสินค้า 50,000 ชิ้น ราคาและสต็อกอัปเดตทุก 10 นาที
- หน้าค้นหา (Search & Filter): ผู้ใช้พิมพ์คำค้นสดตลอดเวลา
- หน้าตะกร้าและเช็กเอาต์ (Checkout): ข้อมูลเฉพาะบุคคล ห้ามแคช
- หน้าบทความบล็อก (Blog): ข้อมูลนานๆ อัปเดตที เน้น SEO สูงสุด

กรุณาเลือกว่าหน้าใดควรใช้ Static Site Generation (SSG), Incremental Static Regeneration (ISR), Server-Side Rendering (SSR), หรือ Client-Side Rendering (CSR) พร้อมตัวอย่างโค้ด Next.js App Router
```

### 75. กำหนด CDN Caching และ Browser Cache-Control Headers
```markdown
คุณคือ CDN & Edge Network Architect
จงวางกลยุทธ์การตั้งค่า HTTP Cache-Control สำหรับเว็บไซต์บน Cloudflare / AWS CloudFront:
1. Static Assets ที่มี Hash ในชื่อไฟล์ (เช่น `main.a8f9c.js`, `logo.b3d1.png`): กำหนด `max-age=31536000, immutable`
2. หน้า HTML ที่มีข้อมูลเปลี่ยนแปลง: กำหนด `s-maxage`, `stale-while-revalidate`
3. API Endpoints ที่เป็นข้อมูลส่วนบุคคล: กำหนด `no-store, private`
4. การทำ Cache Invalidation ผ่าน API เมื่อมีการ Deploy โค้ดเวอร์ชันใหม่
```

### 76. ปรับแต่ง Font และ Critical CSS Loading
```markdown
คุณคือ Web Performance Specialist
เว็บไซต์เกิดปัญหา Flash of Invisible Text (FOIT) และมี Render-blocking Resources จาก CSS และ Web Fonts
จงเขียนแนวทางการแก้ปัญหา:
1. การใช้ Font Display `font-display: swap` เพื่อให้อ่านข้อความได้ทันที
2. การ Self-host ฟอนต์แทนการดึงจากภายนอก พร้อมแปลงไฟล์เป็น WOFF2
3. การทำ `preload` เฉพาะฟอนต์ตัวที่ใช้ในส่วนหัว (Above-the-fold)
4. การสกัดและทำ Inlining Critical CSS ไว้ใน `<style>` แท็กบน `<head>` และโหลด CSS ที่เหลือแบบ Asynchronous
```

### 77. สร้าง Technical SEO Template และ Meta Tags
```markdown
คุณคือ Technical SEO Specialist
จงเขียน Template สำหรับ `<head>` ที่สมบูรณ์แบบที่สุดสำหรับหน้า [ระบุ เช่น หน้ารายละเอียดบทความ หรือ หน้ารายละเอียดสินค้า]:
1. Primary Meta Tags (Title ที่มีความยาวเหมาะสม, Description, Canonical URL, Robots)
2. Open Graph Tags สำหรับ Facebook และ LINE
3. Twitter Card Tags (Summary Large Image)
4. Alternate Hreflang สำหรับเว็บหลายภาษา
5. Favicon และ Web App Manifest Links สำหรับทุกอุปกรณ์
```

### 78. สร้าง JSON-LD Structured Data (Schema.org)
```markdown
คุณคือ Search Engine Structured Data Expert
จงสร้างโค้ด JSON-LD Schema.org ที่ถูกต้องตามเกณฑ์ของ Google Search Console สำหรับ [ระบุ เช่น สินค้าอีคอมเมิร์ซ (Product) หรือ บทความให้ความรู้ (Article)]:
1. Schema หลักพร้อม Attributes: ชื่อ, คำอธิบาย, รูปภาพ, ผู้เขียน/แบรนด์, วันที่เผยแพร่
2. ข้อมูลราคา สกุลเงิน ความพร้อมจำหน่าย (InStock) และคะแนนรีวิวเฉลี่ย (AggregateRating)
3. BreadcrumbList Schema เพื่อให้แสดงผลแถบนำทางบนหน้าผลการค้นหา
4. โค้ดตัวอย่างการฝังลงในหน้าเว็บ [HTML / Next.js Metadata]
```

### 79. สร้าง Dynamic Sitemap.xml และ Robots.txt
```markdown
คุณคือ Technical SEO Engineer
จงเขียนสคริปต์สร้างไฟล์ `robots.txt` และ Dynamic `sitemap.xml` ใน [Next.js / Express]:
1. `robots.txt`: อนุญาตให้ Search Engine ท่องเว็บได้ แต่ห้ามเข้าโฟลเดอร์ `/admin`, `/api/`, `/checkout/` และระบุลิงก์ Sitemap
2. `sitemap.xml`: ดึงรายชื่อหน้า Static และดึง Dynamic Slugs จากฐานข้อมูลมารวมกัน
3. การระบุ `<lastmod>`, `<changefreq>`, และ `<priority>` อย่างถูกต้อง
4. การจัดการกรณีมีหน้าเกิน 50,000 URLs (การทำ Sitemap Index)
```

### 80. วิเคราะห์ Bundle และตัด Dependencies ส่วนเกิน (Bundle Analyzer)
```markdown
คุณคือ Frontend Build Optimization Specialist
จงให้คำแนะนำและขั้นตอนการวิเคราะห์ Bundle ด้วย `@next/bundle-analyzer` หรือ `rollup-plugin-visualizer`:
1. วิธีติดตั้งและเปิดรายงานกราฟิกแสดงขนาดแต่ละโมดูล
2. การระบุแพ็กเกจที่มีขนาดใหญ่เกินจำเป็น (เช่น `lodash`, `moment`, `lucide-react`)
3. วิธีการนำเข้าเฉพาะส่วน (Named Import / Path-based Import) เพื่อให้ Tree-shaking ทำงานได้จริง
4. การตั้งค่า Performance Budgets ใน Build Pipeline เพื่อเตือนเมื่อขนาดไฟล์เกินกำหนด
```

---

## หมวดที่ 9: DevOps, CI/CD และการ Deploy

### 81. เขียน Multi-Stage Dockerfile ที่ปลอดภัยและขนาดเล็ก
```markdown
คุณคือ Docker & Container Security Specialist
จงเขียน `Dockerfile` แบบ Multi-stage Build คุณภาพระดับ Production สำหรับเว็บแอพพลิเคชัน [ระบุ เช่น Next.js หรือ Node.js TypeScript]:
ข้อกำหนด:
1. Stage 1 (Dependencies): ติดตั้งเฉพาะแพ็กเกจที่จำเป็น
2. Stage 2 (Builder): คอมไพล์โค้ด
3. Stage 3 (Runner): ใช้ Base Image ขนาดเล็ก (เช่น `node:alpine` หรือ `distroless`)
4. สร้างและใช้งาน Non-root User (`USER nextjs` หรือ `USER node`) เพื่อความปลอดภัย
5. ขนาด Image สุดท้ายต้องไม่เกิน 150MB และไม่มี Source Code หรือ DevDependencies ส่วนเกิน
```

### 82. เขียน Docker Compose สำหรับ Full-Stack Development
```markdown
คุณคือ DevOps Automation Engineer
จงเขียนไฟล์ `docker-compose.yml` สำหรับรันสภาพแวดล้อม Local Development ของเว็บโปรเจกต์:
บริการที่ต้องมี:
1. Frontend (Next.js) รองรับ Hot-reload (Volume Mount)
2. Backend (Node.js API) รองรับ Nodemon
3. Database (PostgreSQL 16) พร้อม Persistent Volume สำหรับข้อมูล
4. In-Memory Cache (Redis)
5. Mail Simulator (Mailpit หรือ Mailhog) สำหรับดักดูอีเมลในเครื่อง
ข้อกำหนด: กำหนด Environment Variables, Networks, และ Healthcheck dependencies (`depends_on: condition: service_healthy`)
```

### 83. ตั้งค่า GitHub Actions CI/CD Pipeline
```markdown
คุณคือ Lead DevSecOps Engineer
จงเขียนไฟล์ Workflow `.github/workflows/ci-cd.yml` สำหรับเว็บโปรเจกต์:
Trigger: ทำงานเมื่อมี Pull Request เข้า Main และเมื่อ Push เข้า Main
ขั้นตอนใน Pipeline:
1. Checkout Code และตั้งค่า Node.js พร้อม Caching สำหรับ `pnpm` หรือ `npm`
2. รัน Linter (`eslint`) และ Typecheck (`tsc --noEmit`)
3. รัน Automated Unit/Integration Tests
4. Build Web Application เพื่อทดสอบว่าผ่านฉลุย
5. หากเป็น Branch Main: สั่ง Deploy อัตโนมัติไปยัง [ระบุ เช่น Vercel / AWS / VPS ผ่าน SSH] พร้อมส่งแจ้งเตือนเข้า Discord/Slack เมื่อเสร็จสิ้น
```

### 84. ตั้งค่า Nginx Reverse Proxy พร้อม SSL (Let's Encrypt)
```markdown
คุณคือ Linux System & Network Administrator
จงเขียนไฟล์การตั้งค่า `nginx.conf` สำหรับทำ Reverse Proxy ให้กับเว็บแอพพลิเคชันที่รันอยู่บนพอร์ต 3000:
1. การตั้งค่า Virtual Host รับโดเมน `example.com` และ `www.example.com`
2. บังคับ Redirect จาก HTTP (พอร์ต 80) ไปยัง HTTPS (พอร์ต 443)
3. การเปิดใช้งาน SSL/TLS พร้อมระบุตำแหน่ง Certificate ของ Let's Encrypt / Certbot
4. การเปิดใช้งาน Gzip / Brotli Compression
5. การตั้งค่า Proxy Headers (`X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto`, WebSocket support)
```

### 85. ตั้งค่า Deployment บน Cloud (AWS ECS / GCP Cloud Run)
```markdown
คุณคือ Cloud DevOps Specialist
จงเขียนคำแนะนำและ Configuration สำหรับ Deploy คอนเทนเนอร์เว็บขึ้น [AWS ECS Fargate หรือ GCP Cloud Run]:
1. การตั้งค่า Resource Allocation (CPU, Memory, Concurrency per container)
2. การจัดการ Environment Variables และ Secret Injection จาก Cloud Secret Manager
3. การตั้งค่า Auto-scaling (Scale from 1 to 10 instances ตาม CPU / Request Count)
4. การเชื่อมต่อกับ Custom Domain และการขอ Managed SSL Certificate
```

### 86. จัดการ Environment Variables ในทีมอย่างปลอดภัย
```markdown
คุณคือ DevSecOps Consultant
ทีมของฉันมีนักพัฒนา 10 คน และมักเจอปัญหาไฟล์ `.env` หลุด หาย หรือไม่อัปเดตตรงกัน
จงวางระบบการจัดการ Environment Variables ที่ปลอดภัยและมีประสิทธิภาพ:
1. เปรียบเทียบเครื่องมือจัดการ Secret (เช่น Doppler, Infisical, AWS Parameter Store)
2. การแบ่งสภาพแวดล้อม (Development, Staging, Production)
3. วิธีการตรวจสอบและยืนยัน Environment Variables ก่อนเริ่มแอปพลิเคชัน (Runtime Environment Validation ด้วย Zod/T3 Env)
4. กฎเหล็กในการป้องกันไม่ให้ Secret รั่วไหลใน Logs หรือ Client-side Bundle
```

### 87. ระบบ Zero-Downtime Deployment & Health Checks
```markdown
คุณคือ Site Reliability Engineer (SRE)
ฉันต้องการ Deploy อัปเดตเว็บไซต์ขึ้น Production โดยที่ผู้ใช้งานไม่เจอปัญหาหน้าเว็บค้างหรือ Error 502 แม้แต่วินาทีเดียว
จงวางแผนและเขียนโค้ด Zero-Downtime Deployment:
1. การสร้าง Health Check Endpoint (`/api/healthz`) ที่ตรวจสอบทั้ง Web Server, การเชื่อมต่อ Database และ Redis
2. กลยุทธ์ Rolling Update หรือ Blue-Green Deployment
3. การจัดการ Graceful Shutdown (ดักจับสัญญาณ `SIGTERM` ปิดการรับคำขอใหม่ รอคำขอเดิมทำงานเสร็จ แล้วค่อยปิด Database Connection)
```

### 88. ติดตั้ง Error Tracking และ Performance Monitoring (Sentry)
```markdown
คุณคือ Observability Engineer
จงเขียนขั้นตอนการติดตั้งและปรับแต่ง Sentry สำหรับ Full-Stack Web Application [Next.js / Node.js]:
1. การติดตั้ง SDK ฝั่ง Client และ Server
2. การอัปโหลด Source Maps อย่างปลอดภัยในขั้นตอน CI/CD เพื่อให้เห็นบรรทัดโค้ดจริง
3. การกรองข้อมูลอ่อนไหว (PII Scrubbing: บัตรเครดิต, รหัสผ่าน) ออกจาก Error Payload
4. การตั้งค่า Performance Monitoring (Tracing Sample Rate) และ Session Replay สำหรับ Debug ปัญหาจากผู้ใช้
```

### 89. ตั้งค่า Server Monitoring & Alerting (Prometheus & Grafana)
```markdown
คุณคือ Senior Cloud Infrastructure Engineer
จงเขียนแนวทางการตั้งค่าระบบ Monitoring สภาพเครื่องเซิร์ฟเวอร์และเว็บแอพ:
1. การเก็บ Metrics พื้นฐาน (CPU, Memory, Disk I/O, Network Traffic)
2. การเก็บ Application Metrics (HTTP Request Count, Status Codes 2xx/4xx/5xx, Response Duration P99)
3. การเขียน PromQL สำหรับตรวจจับความผิดปกติ (เช่น Error 5xx สูงเกิน 2% ติดต่อกัน 3 นาที)
4. การตั้งค่าแจ้งเตือน (Alertmanager) ส่งตรงเข้า Telegram หรือ Slack พร้อมลิงก์ Dashboard
```

### 90. แผนการ Rollback ระบบแบบอัตโนมัติเมื่อเกิดข้อผิดพลาด
```markdown
คุณคือ Reliability & Deployment Lead
เมื่อเกิดเหตุการณ์ Deploy โค้ดเวอร์ชันใหม่ขึ้น Production แล้วพบว่ามี Error พุ่งสูงผิดปกติ
จงเขียนสคริปต์และขั้นตอน Automated Rollback:
1. การตรวจจับสัญญาณวิกฤต (Health Check ล้มเหลว 3 ครั้งติด หรือ Sentry Error Spikes)
2. คำสั่งสั่งถอยกลับไปยัง Container Image หรือ Git Commit ล่าสุดที่เสถียร
3. การจัดการ Database Migration ที่รันไปแล้ว (Backward-Compatible Migrations)
4. การแจ้งเตือนทีมวิศวกรพร้อมสรุปรายงานความล้มเหลว
```

---

## หมวดที่ 10: คอนเทนต์ การตลาด และการเพิ่ม Conversion (CRO)

### 91. เขียนพาดหัว (Headline) & Value Proposition หน้าแรก
```markdown
คุณคือ World-Class Conversion Copywriter
จงเขียนชุดพาดหัว (Headline), พาดหัวรอง (Sub-headline), และข้อความสั้น 3 รูปแบบ สำหรับหน้าแรกของเว็บไซต์ [ระบุสินค้า/บริการ เช่น ซอฟต์แวร์จัดตารางเวรแพทย์อัตโนมัติ]:
กลุ่มเป้าหมาย: [ระบุ เช่น ผู้อำนวยการโรงพยาบาล หรือ หัวหน้าแผนก]
ปัญหาหลัก: [ระบุ เช่น เสียเวลาจัดเวรด้วยมือ เกิดข้อผิดพลาด หมอบ่นว่าไม่ยุติธรรม]
ผลลัพธ์ที่ต้องการ: [ระบุ เช่น จัดเสร็จใน 5 นาที ยุติธรรม ไร้ข้อพิพาท]
เขียน 3 สไตล์:
- สไตล์ A: ชัดเจน ตรงไปตรงมา (Clear & Direct)
- สไตล์ B: เน้นแก้ปัญหาเจ็บปวด (Pain-Point & Relief)
- สไตล์ C: เน้นผลลัพธ์ที่จับต้องได้ (Benefit & Numbers Driven)
```

### 92. เขียนคำอธิบายฟีเจอร์แบบ Feature-to-Benefit (PAS Framework)
```markdown
คุณคือ Direct-Response Marketing Specialist
จงแปลงรายการสเปกทางเทคนิคของเว็บแอพพลิเคชัน [ระบุ เช่น มีระบบ AI กรองสแปมอีเมล และ Dashboard กราฟิก] ให้เป็นข้อความขายของบนหน้าเว็บ โดยใช้สูตร PAS (Problem - Agitation - Solution):
1. ระบุปัญหาที่ลูกค้ากำลังเผชิญในชีวิตประจำวัน (Problem)
2. ขยี้ความรู้สึกและผลเสียหากปล่อยทิ้งไว้ (Agitation)
3. นำเสนอฟีเจอร์ของระบบเป็นทางออกที่ง่ายและทรงพลัง (Solution)
4. สรุปเป็นหัวข้อย่อยแบบ "คุณลักษณะ (Feature) -> คุณประโยชน์ (Benefit)" สั้นกระชับ 3 หัวข้อ
```

### 93. ออกแบบ Call to Action (CTA) และทางเลือกสำหรับ A/B Testing
```markdown
คุณคือ Conversion Rate Optimization (CRO) Specialist
ฉันต้องการเพิ่มอัตราการคลิกปุ่มหลักบนหน้า Landing Page ของผลิตภัณฑ์ [ระบุ เช่น คอร์สเรียนพัฒนาเว็บออนไลน์]:
จงออกแบบข้อความบนปุ่ม (CTA Copy) และ Microcopy ใต้ปุ่ม จำนวน 4 รูปแบบสำหรับการทำ A/B Testing:
- Variant A: Low Friction / Free Value (เช่น "ทดลองใช้งานฟรี 14 วัน (ไม่ต้องใส่บัตร)")
- Variant B: Outcome Oriented (เช่น "เริ่มสร้างเว็บแรกของคุณวันนี้")
- Variant C: Urgency / Scarcity (เน้นความเร่งด่วนหรือสิทธิพิเศษ)
- Variant D: Community / Social Proof (เน้นความมั่นใจ)
พร้อมระบุตัวแปรที่จะใช้วัดผลและสมมติฐานเบื้องหลังแต่ละแบบ
```

### 94. ออกแบบตารางราคาและแพ็กเกจ (Pricing Page Copy)
```markdown
คุณคือ SaaS Pricing Strategy & Copywriting Expert
จงออกแบบเนื้อหาสำหรับหน้าตารางราคา (Pricing Table) 3 ระดับ (Starter, Pro - Most Popular, Enterprise) สำหรับผลิตภัณฑ์ [ระบุประเภท]:
1. การตั้งชื่อแพ็กเกจ และคำนิยามสั้นๆ ว่าเหมาะกับใคร
2. การระบุราคา (รายเดือน vs รายปี พร้อมข้อความแสดงส่วนลด เช่น "ประหยัด 20%")
3. รายการฟีเจอร์เด่น 5-7 ข้อต่อแพ็กเกจ (ใช้ภาษาที่อ่านแล้วเข้าใจคุณค่าทันที)
4. การวาง Badge "Most Popular" และการเลือกเน้นปุ่ม CTA ให้โดดเด่น
5. คำถาม-คำตอบ คลายข้อกังขาเรื่องการยกเลิกสัญญา หรือการอัปเกรด
```

### 95. สร้างคำถามที่พบบ่อย (FAQ) สลายข้อกังวลของลูกค้า
```markdown
คุณคือ Customer Psychology & Objection Handling Specialist
จงร่างรายการคำถามที่พบบ่อย (FAQ) 8 ข้อ สำหรับเว็บไซต์ [ระบุธุรกิจ เช่น เว็บไซต์รับทำเว็บไซต์และระบบเว็บแอปพลิเคชัน]:
โดยครอบคลุมข้อกังวลที่พบบ่อยที่สุดของลูกค้า:
1. ความกังวลเรื่องราคาและความคุ้มค่า
2. ความกังวลเรื่องระยะเวลาส่งมอบงาน
3. ความกังวลเรื่องความปลอดภัยและความเป็นส่วนตัวของข้อมูล
4. ความกังวลเรื่องบริการหลังการขายและการดูแลรักษาระบบ
5. ข้อสงสัยว่าหากไม่มีความรู้ด้านไอทีจะใช้งานระบบได้หรือไม่
เขียนคำตอบที่สุภาพ จริงใจ มืออาชีพ และปิดท้ายด้วยการชวนติดต่อสอบถามเพิ่มเติม
```

### 96. จัดรูปแบบคำนิยม (Testimonials) และ Social Proof
```markdown
คุณคือ Social Proof & Trust-Building Copywriter
จงออกแบบโครงสร้างและข้อความตัวอย่างสำหรับส่วนรีวิวลูกค้า (Customer Testimonials & Case Studies) บนหน้าเว็บ:
1. การวางองค์ประกอบของ Testimonial Card (ภาพจริง, ชื่อจริง, ตำแหน่ง, โลโก้บริษัท, คะแนนดาว)
2. โครงสร้างคำรีวิวแบบ "ก่อนใช้ vs หลังใช้" (Before & After Story) ที่มีตัวเลขวัดผลชัดเจน
3. การเขียนสถิติสรุปความสำเร็จ (Stats Bar) เช่น "ประหยัดเวลาลง 40%", "ลูกค้าไว้วางใจกว่า 5,000 องค์กร"
4. การจัดวางโลโก้ลูกค้าเด่นๆ (Client Logos Grid) อย่างน่าเชื่อถือ
```

### 97. ออกแบบหน้า 404 Error Page ที่ดึงผู้ใช้กลับสู่ระบบ
```markdown
คุณคือ Creative UX Copywriter
จงออกแบบหน้าตาและข้อความสำหรับหน้า "404 Page Not Found" ของเว็บไซต์ [ระบุแนวของเว็บ เช่น เว็บอ่านนิยายออนไลน์ หรือ เว็บเครื่องมือเทคโนโลยี]:
1. พาดหัวหลักที่มีอารมณ์ขัน เข้ากับธีมของเว็บ และทำให้ผู้ใช้ไม่รู้สึกหงุดหงิด
2. ข้อความสั้นๆ อธิบายว่าหน้าที่หาอาจถูกย้าย ลบ หรือพิมพ์ URL ผิด
3. ปุ่มและลิงก์นำทางที่ช่วยพาผู้ใช้ไปต่อ (ปุ่มกลับหน้าแรก, ลิงก์หน้ายอดนิยม, หรือช่องค้นหา)
4. ไอเดียภาพประกอบ (Illustration / Mascot) เพื่อผ่อนคลายบรรยากาศ
```

### 98. วางแผน Event Tracking สำหรับ Google Analytics 4 (GA4)
```markdown
คุณคือ Web Analytics & Tracking Architect
จงวางแผนโครงสร้าง DataLayer และ Event Tracking สำหรับ Google Analytics 4 (GA4) ร่วมกับ Google Tag Manager (GTM):
สำหรับเว็บไซต์: [ระบุ เช่น เว็บไซต์ขายสินค้าออนไลน์ E-commerce หรือ บริการจองสัมมนา]
1. รายชื่อ Custom Events ที่ต้องวัดผล (เช่น `view_item`, `add_to_cart`, `begin_checkout`, `purchase`, `lead_form_submit`)
2. Parameters ที่ต้องแนบไปกับแต่ละ Event (เช่น `value`, `currency`, `item_id`, `item_name`, `category`)
3. การตั้งค่า User Properties สำหรับแยกลูกค้าเก่าและลูกค้าใหม่
4. โค้ดตัวอย่าง JavaScript `window.dataLayer.push()` สำหรับส่งข้อมูลจาก Frontend
```

### 99. Checklist การตรวจสอบและเพิ่มอัตรา Conversion (CRO Audit)
```markdown
คุณคือ Senior CRO Specialist
จงจัดทำ Checklist สำหรับการตรวจสอบหน้าเว็บไซต์ (Conversion Audit) เพื่อหาจุดรั่วไหลที่ทำให้ผู้ใช้กดปิดเว็บหนี:
1. Page Speed & First Impression (ความเร็วโหลด, Visual Hierarchy, Clarity of Headline)
2. Trust & Credibility Signals (SSL, นโยบายการคืนเงิน, ช่องทางติดต่อที่ชัดเจน)
3. Friction Reduction (ความยาวฟอร์ม, ความจำเป็นในการกรอกข้อมูล, ความง่ายในการชำระเงิน)
4. Mobile Experience (ปุ่มกดยากหรือไม่, ป๊อปอัปบังจอหรือไม่)
5. Clear Call to Action (ปุ่มเด่นพอไหม, ลิงก์เสียหรือไม่)
```

### 100. แบบฟอร์มสมัครสมาชิก/จดหมายข่าวพร้อม Lead Magnet
```markdown
คุณคือ Lead Generation & Email Marketing Specialist
จงเขียนข้อความสำหรับกล่องสมัครรับข่าวสาร (Newsletter / Lead Magnet Opt-in Box) บนเว็บไซต์:
ของแจกฟรี (Lead Magnet): [ระบุ เช่น E-book สรุปเทคนิคทำเว็บให้ติดหน้าแรก Google, หรือ Template Figma ฟรี]
1. พาดหัวที่กระตุ้นความสนใจและบอกคุณค่าของของแจกทันที
2. Bullet Points 3 ข้อ บอกสิ่งที่จะได้เรียนรู้หรือประโยชน์ข้างใน
3. ข้อความบนปุ่มกด (เช่น "ดาวน์โหลดคู่มือฟรีทันที")
4. Microcopy รับประกันความปลอดภัย (เช่น "เราเกลียดสแปมเช่นเดียวกับคุณ ยกเลิกรับข่าวสารได้ทุกเมื่อในคลิกเดียว")
```

---
*Created for Web Application Engineering & Operations*

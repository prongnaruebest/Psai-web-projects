# โปรเจกต์ YumYum Toddler (สำหรับส่งต่อให้ AI / GPT)

## รายละเอียดโปรเจกต์
- **ชื่อ:** YumYum Toddler: ไอเดียเมนูหนูน้อย 1.8 ขวบ (20 เดือน)
- **Framework:** Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Lucide React
- **ที่ตั้งไฟล์หลัก:**
  - `src/app/page.tsx`: หน้าหลัก รองรับทั้ง Meal Idea Generator และ Weekly Meal Planner
  - `src/components/`: คอมโพเนนต์ต่างๆ (MealPlanner, RecipeCard, IngredientSelector, FilterBar, SafetyBanner, RandomModal, NutritionGuideModal, AIPromptModal)
  - `src/data/recipes.ts`: ฐานข้อมูลเมนูอาหารเด็กวัย 20 เดือนกว่า 20+ เมนู พร้อมข้อมูลโภชนาการและคำแนะนำเนื้อสัมผัส (Texture Note)
  - `src/types/recipe.ts`: Type definitions ทั้งหมด

## สิ่งที่ต้องการให้ GPT ช่วย:
1. ช่วยแนะนำวิธีการ Deploy โปรเจกต์นี้ขึ้นไปที่ **Vercel** ให้เชื่อมต่อกับโปรเจกต์ `yumyum-toddler-vercel-app`
2. หรือช่วยแก้ไขไฟล์การตั้งค่าเพื่อให้สามารถ Build และรันบนโฮสติ้งอื่นๆ ได้อย่างราบรื่น

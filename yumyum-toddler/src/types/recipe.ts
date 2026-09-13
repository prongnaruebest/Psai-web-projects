export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type Situation = 'picky_eater' | 'quick_15min' | 'finger_food' | 'teething_soft';

export type Allergen = 'dairy' | 'egg' | 'nuts' | 'gluten' | 'seafood';

export type NutritionBenefit = 
  | 'iron_rich'       // ธาตุเหล็กสูง
  | 'brain_boost'     // บำรุงสมอง & DHA
  | 'calcium_teeth'   // แคลเซียม & ฟันแข็งแรง
  | 'immune_boost'    // เสริมภูมิคุ้มกัน
  | 'fiber_digest'    // ไฟเบอร์ & ขับถ่ายคล่อง
  | 'high_protein';   // เสริมสร้างกล้ามเนื้อ

export interface Recipe {
  id: string;
  title: string;
  emoji: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  difficulty: 'ง่ายมาก' | 'ง่าย' | 'ปานกลาง';
  mealTypes: MealType[];
  situations: Situation[];
  allergens: Allergen[];
  nutritionBenefits: NutritionBenefit[];
  ingredients: {
    name: string;
    amount: string;
    isPrimary?: boolean;
  }[];
  ingredientTags: string[];
  textureNote: {
    cutting: string;
    softness: string;
    safetyTip: string;
  };
  steps: string[];
  parentTip: string;
}

export interface AllergenInfo {
  id: Allergen;
  label: string;
  emoji: string;
}

export interface SituationInfo {
  id: Situation;
  label: string;
  emoji: string;
  description: string;
}

export interface MealTypeInfo {
  id: MealType;
  label: string;
  emoji: string;
}

export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface DayInfo {
  id: DayOfWeek;
  label: string;
  shortLabel: string;
  color: string;
  bgColor: string;
}

export type DailyMeals = Partial<Record<MealSlot, string>>;

export type WeeklyPlan = Record<DayOfWeek, DailyMeals>;

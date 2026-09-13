'use strict';
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '../components/Navbar';
import { SafetyBanner } from '../components/SafetyBanner';
import { IngredientSelector } from '../components/IngredientSelector';
import { FilterBar } from '../components/FilterBar';
import { RecipeCard } from '../components/RecipeCard';
import { RandomModal } from '../components/RandomModal';
import { NutritionGuideModal } from '../components/NutritionGuideModal';
import { AIPromptModal } from '../components/AIPromptModal';
import { MealPlanner } from '../components/MealPlanner';
import { RECIPES_DATA } from '../data/recipes';
import { Allergen, MealType, Situation, WeeklyPlan } from '../types/recipe';
import { Heart, Sparkles, Utensils, RotateCcw } from 'lucide-react';

const DEFAULT_WEEKLY_PLAN: WeeklyPlan = {
  mon: { breakfast: 'r1', lunch: 'r3', dinner: 'r4', snack: 'r2' },
  tue: { breakfast: 'r10', lunch: 'r5', dinner: 'r8', snack: 'r12' },
  wed: { breakfast: 'r17', lunch: 'r6', dinner: 'r15', snack: 'r7' },
  thu: { breakfast: 'r1', lunch: 'r9', dinner: 'r14', snack: 'r2' },
  fri: { breakfast: 'r10', lunch: 'r19', dinner: 'r20', snack: 'r13' },
  sat: { breakfast: 'r17', lunch: 'r16', dinner: 'r11', snack: 'r18' },
  sun: { breakfast: 'r2', lunch: 'r3', dinner: 'r4', snack: 'r12' },
};

export default function HomePage() {
  // Navigation Tab
  const [activeTab, setActiveTab] = useState<'ideas' | 'planner'>('ideas');

  // Filters State
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [filterByIngredient, setFilterByIngredient] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMealType, setSelectedMealType] = useState<MealType | 'all'>('all');
  const [selectedSituation, setSelectedSituation] = useState<Situation | 'all'>('all');
  const [excludedAllergens, setExcludedAllergens] = useState<Allergen[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);

  // Modals
  const [isRandomModalOpen, setIsRandomModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);

  // Favorites (LocalStorage)
  const [favorites, setFavorites] = useState<string[]>([]);

  // Weekly Plan (LocalStorage)
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(DEFAULT_WEEKLY_PLAN);

  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem('yumyum_favorites');
      if (savedFavs) {
        setFavorites(JSON.parse(savedFavs));
      }

      const savedPlan = localStorage.getItem('yumyum_weekly_plan');
      if (savedPlan) {
        setWeeklyPlan(JSON.parse(savedPlan));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('yumyum_favorites', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleUpdateWeeklyPlan = (plan: WeeklyPlan) => {
    setWeeklyPlan(plan);
    try {
      localStorage.setItem('yumyum_weekly_plan', JSON.stringify(plan));
    } catch {
      // ignore
    }
  };

  const handleToggleIngredient = (item: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleClearIngredients = () => {
    setSelectedIngredients([]);
  };

  const handleToggleAllergen = (allergen: Allergen) => {
    setExcludedAllergens((prev) =>
      prev.includes(allergen) ? prev.filter((a) => a !== allergen) : [...prev, allergen]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedMealType('all');
    setSelectedSituation('all');
    setExcludedAllergens([]);
    setShowFavoritesOnly(false);
    setSelectedIngredients([]);
  };

  const hasActiveFilters = 
    Boolean(searchQuery) ||
    selectedMealType !== 'all' ||
    selectedSituation !== 'all' ||
    excludedAllergens.length > 0 ||
    showFavoritesOnly ||
    selectedIngredients.length > 0;

  // Filtered & Ranked Recipes
  const filteredRecipes = useMemo(() => {
    return RECIPES_DATA.filter((recipe) => {
      // 1. Favorites check
      if (showFavoritesOnly && !favorites.includes(recipe.id)) {
        return false;
      }

      // 2. Allergen exclusions
      if (
        excludedAllergens.length > 0 &&
        recipe.allergens.some((alg) => excludedAllergens.includes(alg))
      ) {
        return false;
      }

      // 3. Meal type filter
      if (selectedMealType !== 'all' && !recipe.mealTypes.includes(selectedMealType)) {
        return false;
      }

      // 4. Situation filter
      if (selectedSituation !== 'all' && !recipe.situations.includes(selectedSituation)) {
        return false;
      }

      // 5. Search text query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = recipe.title.toLowerCase().includes(query);
        const matchesDesc = recipe.description.toLowerCase().includes(query);
        const matchesTags = recipe.ingredientTags.some((t) => t.toLowerCase().includes(query));
        const matchesIng = recipe.ingredients.some((i) => i.name.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesTags && !matchesIng) {
          return false;
        }
      }

      // 6. Ingredients match
      if (selectedIngredients.length > 0 && filterByIngredient) {
        const matchCount = recipe.ingredientTags.filter((tag) =>
          selectedIngredients.some((sel) => sel.toLowerCase() === tag.toLowerCase())
        ).length;
        if (matchCount === 0) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (selectedIngredients.length > 0) {
        const matchA = a.ingredientTags.filter((tag) =>
          selectedIngredients.some((sel) => sel.toLowerCase() === tag.toLowerCase())
        ).length;
        const matchB = b.ingredientTags.filter((tag) =>
          selectedIngredients.some((sel) => sel.toLowerCase() === tag.toLowerCase())
        ).length;
        return matchB - matchA;
      }
      return 0;
    });
  }, [
    showFavoritesOnly,
    favorites,
    excludedAllergens,
    selectedMealType,
    selectedSituation,
    searchQuery,
    selectedIngredients,
    filterByIngredient,
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9] text-[#33261D]">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        favoriteCount={favorites.length}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavoritesOnly={() => {
          setActiveTab('ideas');
          setShowFavoritesOnly(!showFavoritesOnly);
        }}
        onOpenRandomModal={() => setIsRandomModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        onOpenPromptModal={() => setIsPromptModalOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 py-4 sm:py-6 flex-1 w-full space-y-4 sm:space-y-6">
        {/* Safety Alert Banner */}
        <SafetyBanner />

        {activeTab === 'ideas' ? (
          <>
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-amber-100/70 via-orange-100/60 to-rose-50/70 rounded-3xl p-4 sm:p-6 border border-orange-200/70 shadow-xs relative overflow-hidden">
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-orange-200 text-orange-700 text-xs font-bold mb-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>คิดเมนูไม่ออก ให้เราช่วยคิด! สำหรับวัย 1.8 ขวบ (20 เดือน)</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight leading-snug">
                  มื้อนี้ทำอะไรให้เจ้าตัวเล็กกินดีนะ? 👶🍲
                </h1>
                <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed">
                  รวมเมนูเด็กวัย 20 เดือนที่ฟันกรามเริ่มขึ้น ฝึกเคี้ยวชิ้นนุ่ม หยิบกินเอง (BLW) งดปรุงรสจัด และปลอดภัยจากอาหารติดคอ
                </p>
              </div>
              <div className="absolute -right-6 -bottom-8 text-8xl sm:text-9xl opacity-15 pointer-events-none select-none">
                🥣
              </div>
            </section>

            {/* Fridge Ingredient Selector */}
            <IngredientSelector
              selectedIngredients={selectedIngredients}
              onToggleIngredient={handleToggleIngredient}
              onClearIngredients={handleClearIngredients}
              filterByIngredient={filterByIngredient}
              onToggleFilterByIngredient={() => setFilterByIngredient(!filterByIngredient)}
              matchedCount={filteredRecipes.length}
            />

            {/* Filter & Search Bar */}
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedMealType={selectedMealType}
              onSelectMealType={setSelectedMealType}
              selectedSituation={selectedSituation}
              onSelectSituation={setSelectedSituation}
              excludedAllergens={excludedAllergens}
              onToggleAllergen={handleToggleAllergen}
              onResetFilters={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
            />

            {/* Results Header */}
            <div className="flex items-center justify-between gap-2 pt-2">
              <div className="flex items-center gap-2">
                <h2 className="font-black text-stone-900 text-lg sm:text-xl flex items-center gap-1.5">
                  {showFavoritesOnly ? '❤️ เมนูโปรดของคุณ' : '🍽️ ไอเดียเมนูที่แนะนำ'}
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                  {filteredRecipes.length} เมนู
                </span>
              </div>

              {showFavoritesOnly && (
                <button
                  onClick={() => setShowFavoritesOnly(false)}
                  className="text-xs text-stone-500 hover:text-stone-800 font-semibold underline cursor-pointer"
                >
                  ดูเมนูทั้งหมด
                </button>
              )}
            </div>

            {/* Recipe Cards Grid */}
            {filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isFavorite={favorites.includes(recipe.id)}
                    onToggleFavorite={handleToggleFavorite}
                    selectedIngredients={selectedIngredients}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4 bg-white rounded-3xl border border-dashed border-stone-200">
                <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-3 text-3xl">
                  🔍
                </div>
                <h3 className="font-bold text-stone-800 text-base sm:text-lg">
                  ไม่พบเมนูที่ตรงกับเงื่อนไข
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-sm mx-auto">
                  ลองลดตัวกรองสารก่อภูมิแพ้ หรือกดล้างการเลือกวัตถุดิบเพื่อให้ระบบแนะนำเมนูอื่น
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-orange-500 text-white font-bold text-xs sm:text-sm shadow-xs hover:bg-orange-600 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>รีเซ็ตตัวกรองทั้งหมด</span>
                </button>
              </div>
            )}
          </>
        ) : (
          /* Weekly Planner Tab */
          <MealPlanner
            weeklyPlan={weeklyPlan}
            onUpdateWeeklyPlan={handleUpdateWeeklyPlan}
            recipes={RECIPES_DATA}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-stone-150 py-6 text-center text-xs text-stone-500 print:hidden">
        <div className="max-w-5xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-stone-700">
            YumYum Toddler • คู่มือและไอเดียอาหารสำหรับเด็กวัย 1.8 ขวบ (20 เดือน)
          </p>
          <p className="text-[11px] text-stone-400">
            สูตรอาหารออกแบบตามแนวทางกุมารแพทย์ ปลอดภัย ไม่ปรุงรสจัด และระวังการสำลักทุกเมนู
          </p>
        </div>
      </footer>

      {/* Modals */}
      <RandomModal
        isOpen={isRandomModalOpen}
        onClose={() => setIsRandomModalOpen(false)}
        recipes={filteredRecipes.length > 0 ? filteredRecipes : RECIPES_DATA}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />

      <NutritionGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      <AIPromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        selectedIngredients={selectedIngredients}
        selectedMealType={selectedMealType}
        selectedSituation={selectedSituation}
        excludedAllergens={excludedAllergens}
      />
    </div>
  );
}

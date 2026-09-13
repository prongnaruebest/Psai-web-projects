'use strict';
'use client';

import React from 'react';
import { Sparkles, Heart, BookOpen, Utensils, Dices, Calendar, LayoutGrid } from 'lucide-react';

interface NavbarProps {
  activeTab: 'ideas' | 'planner';
  onSelectTab: (tab: 'ideas' | 'planner') => void;
  favoriteCount: number;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  onOpenRandomModal: () => void;
  onOpenGuideModal: () => void;
  onOpenPromptModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  favoriteCount,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  onOpenRandomModal,
  onOpenGuideModal,
  onOpenPromptModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-xs transition-all">
      <div className="max-w-5xl mx-auto px-4 py-2.5 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Top bar on mobile: Logo + Actions */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          {/* Logo */}
          <div 
            onClick={() => {
              onSelectTab('ideas');
              if (showFavoritesOnly) onToggleFavoritesOnly();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-rose-400 flex items-center justify-center text-white shadow-md shadow-orange-200 group-hover:scale-105 transition-transform">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg sm:text-xl tracking-tight text-stone-800">
                  YumYum<span className="text-orange-500">Toddler</span>
                </span>
                <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  1.8 ขวบ
                </span>
              </div>
            </div>
          </div>

          {/* Quick random & favorite button for mobile header */}
          <div className="flex sm:hidden items-center gap-1.5">
            <button
              onClick={onOpenRandomModal}
              className="p-2 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-xs"
              title="สุ่มเมนู"
            >
              <Dices className="w-4 h-4" />
            </button>
            <button
              onClick={onToggleFavoritesOnly}
              className={`p-2 rounded-xl border text-xs ${
                showFavoritesOnly ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-white' : 'fill-rose-500'}`} />
            </button>
          </div>
        </div>

        {/* Center / Navigation Tabs */}
        <div className="flex items-center justify-center gap-1 bg-stone-100/90 p-1 rounded-2xl">
          <button
            onClick={() => onSelectTab('ideas')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'ideas'
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>ไอเดียเมนู</span>
          </button>

          <button
            onClick={() => onSelectTab('planner')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'planner'
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>ตาราง 7 วัน</span>
            <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-full font-extrabold">
              ใหม่
            </span>
          </button>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
          {/* Quick Random Button */}
          <button
            onClick={onOpenRandomModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-orange-400 to-amber-400 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-200 hover:from-orange-500 hover:to-amber-500 active:scale-95 transition-all cursor-pointer"
            title="สุ่มเมนูมื้อนี้ทันที"
          >
            <Dices className="w-4 h-4" />
            <span>สุ่มเมนู</span>
          </button>

          {/* AI Prompt Button */}
          <button
            onClick={onOpenPromptModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200 font-semibold text-xs hover:bg-purple-100 active:scale-95 transition-all cursor-pointer"
            title="สร้าง Prompt ถาม AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span>AI Prompt</span>
          </button>

          {/* Nutrition Guide Button */}
          <button
            onClick={onOpenGuideModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-xs hover:bg-emerald-100 active:scale-95 transition-all cursor-pointer"
            title="คู่มือโภชนาการวัย 1.8 ขวบ"
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>คู่มือ 1.8 ขวบ</span>
          </button>

          {/* Favorites Button */}
          <button
            onClick={onToggleFavoritesOnly}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl font-bold text-xs border transition-all cursor-pointer active:scale-95 ${
              showFavoritesOnly
                ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-200'
                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-white text-white' : 'fill-rose-500 text-rose-500'}`} />
            <span>เมนูโปรด</span>
            {favoriteCount > 0 && (
              <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                showFavoritesOnly ? 'bg-white text-rose-600' : 'bg-rose-500 text-white'
              }`}>
                {favoriteCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { 
  BookOpen, Search, Flame, Award, Globe, Moon, Sun, 
  Menu, X, Sparkles, CheckCircle2, Bookmark, AlertCircle 
} from 'lucide-react';
import { dataManager } from '../../utils/dataManager';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  language, 
  setLanguage, 
  darkMode, 
  setDarkMode, 
  onOpenSearch, 
  userStats,
  mobileMenuOpen,
  setMobileMenuOpen
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                  ENGLISH <span className="text-brand-600 dark:text-brand-500">MASTER</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full border border-emerald-300 dark:border-emerald-800">
                  SBI • IBPS • RRB
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Personal Banking English Tutor & Exam Platform
              </p>
            </div>
          </div>

          {/* Center Search Bar Trigger */}
          <button 
            onClick={onOpenSearch}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition text-sm border border-slate-200 dark:border-slate-700 w-64 lg:w-80"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span className="text-xs">Search rules, words, PYQs...</span>
            <kbd className="ml-auto text-[10px] px-1.5 py-0.5 bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-700 text-slate-400">
              Ctrl+K
            </kbd>
          </button>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            
            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 rounded-lg text-xs font-semibold border border-amber-200 dark:border-amber-800/50" title="Active Daily Practice Streak">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{userStats?.streak || 1}d</span>
            </div>

            {/* XP Level */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400 rounded-lg text-xs font-semibold border border-brand-200 dark:border-brand-800/50" title="Student Experience & Level">
              <Award className="w-4 h-4 text-brand-600" />
              <span>Lvl {userStats?.level || 1} ({userStats?.xp || 0} XP)</span>
            </div>

            {/* Language Toggle (EN / HI) */}
            <button
              onClick={() => {
                const nextLang = language === 'en' ? 'hi' : 'en';
                setLanguage(nextLang);
                const settings = dataManager.getSettings();
                dataManager.saveSettings({ ...settings, language: nextLang });
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
              title="Toggle Bilingual Hindi/English explanations"
            >
              <Globe className="w-3.5 h-3.5 text-brand-600" />
              <span>{language === 'en' ? 'EN' : 'हिंदी'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => {
                const nextDark = !darkMode;
                setDarkMode(nextDark);
                const settings = dataManager.getSettings();
                dataManager.saveSettings({ ...settings, theme: nextDark ? 'dark' : 'light' });
              }}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition"
              title="Toggle Dark / Light Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

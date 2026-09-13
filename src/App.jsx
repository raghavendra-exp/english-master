import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Search, Flame, Award, Globe, Moon, Sun, 
  Menu, X, Sparkles, CheckCircle2, Bookmark, AlertCircle,
  LayoutDashboard, Layers, Zap, Compass, Move, FileText,
  BarChart2, ShieldCheck, MapPin, Database, HelpCircle
} from 'lucide-react';

import Header from './components/common/Header';
import GlobalSearchModal from './components/common/GlobalSearchModal';
import Dashboard from './components/dashboard/Dashboard';
import GrammarHub from './components/grammar/GrammarHub';
import VocabMaster from './components/vocabulary/VocabMaster';
import PracticeArena from './components/practice/PracticeArena';
import ErrorDetectionScanner from './components/practice/ErrorDetectionScanner';
import ClozeTestLab from './components/practice/ClozeTestLab';
import RcSpeedTrainer from './components/practice/RcSpeedTrainer';
import ParaJumbleLab from './components/practice/ParaJumbleLab';
import WordSwapLab from './components/practice/WordSwapLab';
import SpeedLab from './components/practice/SpeedLab';
import FlashcardDeck from './components/practice/FlashcardDeck';
import ExamSimulator from './components/mock/ExamSimulator';
import ScorecardAnalytics from './components/mock/ScorecardAnalytics';
import PyqAnalytics from './components/analytics/PyqAnalytics';
import MistakesNotebook from './components/tools/MistakesNotebook';
import StudyRoadmaps from './components/tools/StudyRoadmaps';
import BookmarksNotes from './components/tools/BookmarksNotes';
import BackupSync from './components/tools/BackupSync';

import { dataManager } from './utils/dataManager';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeNavParams, setActiveNavParams] = useState({});
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Settings
  const [settings, setSettings] = useState(() => dataManager.getSettings());
  const [language, setLanguage] = useState(settings.language || 'en');
  const [darkMode, setDarkMode] = useState(settings.theme === 'dark');
  const [userStats, setUserStats] = useState(() => dataManager.getUserStats());

  // Mock Test State
  const [activeMockResult, setActiveMockResult] = useState(null);

  // Loaded JSON Datasets
  const [allData, setAllData] = useState({
    grammarRules: [],
    questions: [],
    editorialWords: [],
    rootWords: [],
    confusingWords: { confusingPairs: [], collocations: [] },
    idioms: [],
    phrasalVerbs: [],
    readingComprehension: [],
    clozeTests: [],
    paraJumbles: [],
    pyqTrends: { topicWiseAnalysis: [] },
    examPatterns: {},
    mockPresets: [],
    studyPlans: {},
    shortcuts: []
  });

  // Dark Mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load all JSON datasets
  useEffect(() => {
    async function loadData() {
      try {
        const basePath = './data';
        const [
          gRules, qList, eWords, rWords, cWords,
          iList, pvList, rcList, clzList, pjList,
          pyqList, epList, mpList, spList, scList
        ] = await Promise.all([
          fetch(`${basePath}/grammar-rules.json`).then(r => r.json()).catch(() => []),
          fetch(`${basePath}/questions.json`).then(r => r.json()).catch(() => []),
          fetch(`${basePath}/editorial-words.json`).then(r => r.json()).catch(() => []),
          fetch(`${basePath}/etymology-roots.json`).then(r => r.json()).catch(() => []),
          fetch(`${basePath}/collocations-confusing.json`).then(r => r.json()).catch(() => ({ confusingPairs: [], collocations: [] })),
          fetch(`${basePath}/idioms-phrases.json`).then(r => r.json()).catch(() => []),
          fetch(`${basePath}/phrasal-verbs.json`).then(r => r.json()).catch(() => []),
          fetch(`${basePath}/reading-comprehension.json`).then(r => r.json()).catch(() => []),
          fetch(`${basePath}/cloze-tests.json`).then(r => r.json()).catch(() => []),
          fetch(`${basePath}/para-jumbles.json`).then(r => r.json()).catch(() => []),
          fetch(`${basePath}/pyq-trends.json`).then(r => r.json()).catch(() => ({ topicWiseAnalysis: [] })),
          fetch(`${basePath}/exam-patterns.json`).then(r => r.json()).catch(() => ({})),
          fetch(`${basePath}/mock-presets.json`).then(r => r.json()).catch(() => []),
          fetch(`${basePath}/study-plans.json`).then(r => r.json()).catch(() => ({})),
          fetch(`${basePath}/shortcuts-traps.json`).then(r => r.json()).catch(() => [])
        ]);

        setAllData({
          grammarRules: gRules,
          questions: qList,
          editorialWords: eWords,
          rootWords: rWords,
          confusingWords: cWords,
          idioms: iList,
          phrasalVerbs: pvList,
          readingComprehension: rcList,
          clozeTests: clzList,
          paraJumbles: pjList,
          pyqTrends: pyqList,
          examPatterns: epList,
          mockPresets: mpList,
          studyPlans: spList,
          shortcuts: scList
        });
      } catch (err) {
        console.error("Failed to load application data", err);
      }
    }
    loadData();
  }, []);

  const handleNavigate = (tab, params = {}) => {
    setActiveTab(tab);
    setActiveNavParams(params);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'grammar', label: '24 Grammar Chapters', icon: BookOpen },
    { id: 'vocabulary', label: 'Vocabulary & Lexicon', icon: Sparkles },
    { id: 'practice', label: 'Practice Arena', icon: Award },
    { id: 'error-scanner', label: 'Error Scanner', icon: Search },
    { id: 'cloze-lab', label: 'Cloze Test Lab', icon: FileText },
    { id: 'rc-speed', label: 'RC Speed & WPM', icon: Compass },
    { id: 'para-jumbles', label: 'Para Jumbles', icon: Move },
    { id: 'word-swap', label: 'Word Swap', icon: Layers },
    { id: 'speed-lab', label: 'Speed Lab (20s)', icon: Zap },
    { id: 'flashcards', label: 'Flashcard Deck', icon: Layers },
    { id: 'mock', label: 'Mock Test Simulator', icon: Award },
    { id: 'analytics', label: 'PYQ Trends', icon: BarChart2 },
    { id: 'error-book', label: 'My Error Book', icon: AlertCircle },
    { id: 'roadmaps', label: 'Study Plans', icon: MapPin },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'backup', label: 'Backup & Sync', icon: Database }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        language={language}
        setLanguage={setLanguage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenSearch={() => setIsSearchOpen(true)}
        userStats={userStats}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
        allData={allData}
      />

      {/* Body Layout: Desktop Sidebar Nav + Content */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex-1 flex gap-6 pt-6">
        
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:block w-60 shrink-0 space-y-1 self-start sticky top-24 pb-8 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Learning Modules
          </div>
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="px-3 pt-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Specialized Labs
          </div>
          {navItems.slice(4, 11).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="px-3 pt-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Testing & Diagnostics
          </div>
          {navItems.slice(11).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-slate-900/60 backdrop-blur-sm flex">
            <div className="bg-white dark:bg-slate-900 w-72 max-w-[80vw] h-full p-5 flex flex-col justify-between overflow-y-auto shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-extrabold text-sm text-brand-600">
                    ENGLISH MASTER
                  </span>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-lg text-slate-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigate(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                          activeTab === item.id ? 'bg-brand-600 text-white' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Main Content View Switcher */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && (
            <Dashboard
              onNavigate={handleNavigate}
              userStats={userStats}
              language={language}
              allData={allData}
            />
          )}

          {activeTab === 'grammar' && (
            <GrammarHub
              allData={allData}
              language={language}
              onPracticeTopic={(topicId) => handleNavigate('practice', { topicId })}
            />
          )}

          {activeTab === 'vocabulary' && (
            <VocabMaster
              allData={allData}
              initialTab={activeNavParams?.tab || 'daily'}
              onNavigate={handleNavigate}
              language={language}
            />
          )}

          {activeTab === 'practice' && (
            <PracticeArena
              allQuestions={allData.questions}
              initialTopicId={activeNavParams?.topicId || 'all'}
              language={language}
              onBack={() => handleNavigate('dashboard')}
            />
          )}

          {activeTab === 'error-scanner' && (
            <ErrorDetectionScanner
              allQuestions={allData.questions}
              onNavigate={handleNavigate}
              language={language}
            />
          )}

          {activeTab === 'cloze-lab' && (
            <ClozeTestLab
              allData={allData}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'rc-speed' && (
            <RcSpeedTrainer
              allData={allData}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'para-jumbles' && (
            <ParaJumbleLab
              allData={allData}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'word-swap' && (
            <WordSwapLab
              allQuestions={allData.questions}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'speed-lab' && (
            <SpeedLab
              allQuestions={allData.questions}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'flashcards' && (
            <FlashcardDeck
              allData={allData}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'mock' && (
            activeMockResult ? (
              <ScorecardAnalytics
                mockResult={activeMockResult}
                onRetake={() => setActiveMockResult(null)}
                onExitDashboard={() => {
                  setActiveMockResult(null);
                  handleNavigate('dashboard');
                }}
              />
            ) : (
              <ExamSimulator
                preset={allData.mockPresets[0]}
                allQuestions={allData.questions}
                onFinishMock={(result) => setActiveMockResult(result)}
                onExit={() => handleNavigate('dashboard')}
                language={language}
              />
            )
          )}

          {activeTab === 'analytics' && (
            <PyqAnalytics
              allData={allData}
              onPracticeTopic={(topicId) => handleNavigate('practice', { topicId })}
            />
          )}

          {activeTab === 'error-book' && (
            <MistakesNotebook
              allQuestions={allData.questions}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'roadmaps' && (
            <StudyRoadmaps
              allData={allData}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'bookmarks' && (
            <BookmarksNotes
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'backup' && (
            <BackupSync />
          )}
        </main>

      </div>

    </div>
  );
}

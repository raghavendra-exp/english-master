import React, { useState, useEffect } from 'react';
import { 
  Award, TrendingUp, Target, Zap, BookOpen, Search, 
  FileText, Move, CheckCircle2, AlertTriangle, Clock, 
  ArrowRight, Sparkles, Layers, ShieldCheck, HelpCircle, Compass
} from 'lucide-react';
import { readinessCalculator } from '../../utils/readinessCalculator';
import { dataManager } from '../../utils/dataManager';

export default function Dashboard({ 
  onNavigate, 
  userStats, 
  language = 'en', 
  allData = {} 
}) {
  const [readiness, setReadiness] = useState(null);
  const [studyDuration, setStudyDuration] = useState(30);
  const [studyPlan, setStudyPlan] = useState([]);
  const [diagnosis, setDiagnosis] = useState(null);

  useEffect(() => {
    const r = readinessCalculator.calculateScore();
    setReadiness(r);
    const diag = readinessCalculator.getTopicDiagnosis();
    setDiagnosis(diag);
    setStudyPlan(readinessCalculator.generateStudyPlan(studyDuration));
  }, [studyDuration, userStats]);

  const handleDurationChange = (dur) => {
    setStudyDuration(dur);
    setStudyPlan(readinessCalculator.generateStudyPlan(dur));
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Hero Banner: Target Exam & Readiness Score */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-navy-900 to-brand-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          
          {/* Welcome & Exam Target */}
          <div className="lg:col-span-2 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Banking English Roadmap</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Master Banking English for <span className="text-brand-400">SBI Clerk • IBPS Clerk • RRB</span>
            </h1>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              Transform from fundamental grammar rules to 25+ marks in Prelims and Mains through 10 interactive visual labs, 508+ verified PYQ questions, and real TCS-style mock tests.
            </p>

            {/* Quick Action Badges */}
            <div className="pt-2 flex flex-wrap gap-2">
              <button 
                onClick={() => onNavigate('mock')} 
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-600/30 transition flex items-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                Take Full 30Q Mock
              </button>
              <button 
                onClick={() => onNavigate('error-scanner')} 
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
              >
                <Search className="w-4 h-4 text-brand-400" />
                Error Detection Scanner
              </button>
              <button 
                onClick={() => onNavigate('speed-lab')} 
                className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold rounded-xl border border-amber-500/30 transition flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                20s Speed Lab
              </button>
            </div>
          </div>

          {/* English Readiness Score Ring Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-semibold tracking-wider text-slate-300 uppercase mb-1">
              English Readiness Score
            </span>
            
            <div className="relative w-28 h-28 my-2 flex items-center justify-center">
              {/* Circular Graphic */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" className="text-slate-800" fill="transparent" />
                <circle 
                  cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" 
                  className="text-brand-400 transition-all duration-1000 ease-out" 
                  fill="transparent"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * (readiness?.score || 10)) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black">{readiness?.score || 10}</span>
                <span className="text-[10px] text-slate-300 uppercase tracking-wider">/ 100</span>
              </div>
            </div>

            <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${readiness?.tier.badgeColor}`}>
              {readiness?.tier.label || 'Beginner'}
            </span>
            <p className="text-[11px] text-slate-300 mt-2 line-clamp-2">
              {readiness?.tier.advice}
            </p>
          </div>

        </div>
      </div>

      {/* Smart Study Recommender: "What Should I Study Today?" */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-brand-600" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Smart Study Recommender: <span className="text-brand-600">What Should I Study Today?</span>
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select your available study time; the tutor dynamically constructs a tailored drill based on your weakest topic.
            </p>
          </div>

          {/* Time Picker Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[15, 30, 45, 60, 90].map((mins) => (
              <button
                key={mins}
                onClick={() => handleDurationChange(mins)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  studyDuration === mins 
                    ? 'bg-brand-600 text-white shadow-sm' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {mins} mins
              </button>
            ))}
          </div>
        </div>

        {/* Actionable Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {studyPlan.map((step, idx) => (
            <div 
              key={idx} 
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3 hover:border-brand-300 dark:hover:border-brand-700 transition"
            >
              <div className="w-7 h-7 rounded-lg bg-brand-100 dark:bg-brand-950/70 text-brand-700 dark:text-brand-400 flex items-center justify-center shrink-0 font-bold text-xs">
                {idx + 1}
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {step.time}
                </span>
                <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  {step.activity}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Diagnostic Weakness Alert (If applicable) */}
      {diagnosis?.weakest && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 rounded-xl shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Diagnostic Weakness Identified: <span className="capitalize">{diagnosis.weakest.topicId.replace('-', ' ')}</span> ({diagnosis.weakest.accuracy}% Accuracy)
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                Your performance data indicates this topic is dragging down your overall Readiness Score. Strengthen it now with targeted drills.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('practice', { topicId: diagnosis.weakest.topicId })}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shrink-0 transition"
          >
            Practice Weak Topic
          </button>
        </div>
      )}

      {/* 10 Specialized Interactive Labs Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Specialized Interactive Learning Labs
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hands-on interactive environments targeting specific banking exam question types.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          
          {/* Lab 1: Error Detection Scanner */}
          <div 
            onClick={() => onNavigate('error-scanner')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-md cursor-pointer transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
              Error Detection Scanner
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Clickable sentence segments (A, B, C, D, E) showing instant rule, correction, and memory trick.
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-brand-600 font-semibold">
              <span>Interactive Scanner</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Lab 2: Interactive Cloze Test Lab */}
          <div 
            onClick={() => onNavigate('cloze-lab')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-md cursor-pointer transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
              Interactive Cloze Lab
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Solve multi-blank passages with instant rationale on why correct fits and other options fail.
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-brand-600 font-semibold">
              <span>Blank-by-Blank Engine</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Lab 3: RC Speed Trainer */}
          <div 
            onClick={() => onNavigate('rc-speed')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-md cursor-pointer transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
              RC Speed Trainer & WPM
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Words-per-minute speedometer, 1/2/3/5-min challenge modes, tone analysis & inference tricks.
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-brand-600 font-semibold">
              <span>WPM & Tone Lab</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Lab 4: Para Jumbles Drag & Drop */}
          <div 
            onClick={() => onNavigate('para-jumbles')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-md cursor-pointer transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
              <Move className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
              Para Jumbles Drag & Drop
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Drag-and-drop 4, 5, and 6-sentence rearrangement cards with structural clue revelations.
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-brand-600 font-semibold">
              <span>Sentence Sequencer</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Lab 5: Word Swap Sandbox */}
          <div 
            onClick={() => onNavigate('word-swap')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-md cursor-pointer transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
              Word Swap Sandbox
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Interactive banking sentence word replacement verifying contextual grammar and collocation.
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-brand-600 font-semibold">
              <span>Pair Swap Engine</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Lab 6: Fillers Master (Single/Double) */}
          <div 
            onClick={() => onNavigate('fillers')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-md cursor-pointer transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
              Fillers & Collocations
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Master double and triple fillers using the grammar-first, tone-second, context-third method.
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-brand-600 font-semibold">
              <span>Contextual Fillers</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Lab 7: Root Words & Etymology */}
          <div 
            onClick={() => onNavigate('vocabulary', { tab: 'etymology' })}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-md cursor-pointer transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
              Etymology & Root Words
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Greek & Latin prefixes/roots (bene-, mal-, chron-, greg-) with interactive word family trees.
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-brand-600 font-semibold">
              <span>Root Word Trees</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Lab 8: 24 Grammar Chapters */}
          <div 
            onClick={() => onNavigate('grammar')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-md cursor-pointer transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-950/60 text-brand-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
              24 Grammar Chapters
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Subject-Verb, Tenses, Modals, Conditionals with "Explain like I'm a beginner" easy mode.
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-brand-600 font-semibold">
              <span>Syllabus & Rules</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
            </div>
          </div>

        </div>
      </div>

      {/* Progress & Quick Stats Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-2xl font-black text-brand-600 dark:text-brand-400">
            {userStats?.totalQuestionsAttempted || 0}
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Questions Solved</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
            {userStats?.totalQuestionsAttempted > 0 
              ? Math.round(((userStats?.totalCorrect || 0) / userStats.totalQuestionsAttempted) * 100) 
              : 0}%
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Overall Accuracy</p>
        </div>
        <div 
          onClick={() => onNavigate('error-book')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center cursor-pointer hover:border-rose-300 transition"
        >
          <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
            {dataManager.getMistakes().length}
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">In My Error Book</p>
        </div>
        <div 
          onClick={() => onNavigate('bookmarks')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center cursor-pointer hover:border-amber-300 transition"
        >
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {dataManager.getBookmarks().length}
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Saved Bookmarks</p>
        </div>
      </div>

    </div>
  );
}

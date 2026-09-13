import React, { useState, useEffect } from 'react';
import { 
  BookOpen, CheckCircle, XCircle, AlertTriangle, Zap, 
  Search, ArrowRight, Sparkles, HelpCircle, ShieldAlert, Award
} from 'lucide-react';

export default function GrammarHub({ allData = {}, onPracticeTopic, language = 'en' }) {
  const grammarTopics = allData.grammarRules || [];
  const [selectedTopicId, setSelectedTopicId] = useState(grammarTopics[0]?.id || 'subject-verb-agreement');
  const [searchQuery, setSearchQuery] = useState('');
  const [beginnerMode, setBeginnerMode] = useState(false);

  const selectedTopic = grammarTopics.find(t => t.id === selectedTopicId) || grammarTopics[0];

  const filteredTopics = grammarTopics.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.hindiTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              Grammar Foundation
            </span>
            <span className="text-xs text-slate-400">• 24 Chapters</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            Bank Exam Grammar & Syntax Master
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Every rule dissected: Concept ➔ Beginner Easy Mode ➔ Right vs Wrong ➔ Exam Shortcut ➔ Bank Trap.
          </p>
        </div>

        {/* Beginner Mode Switcher */}
        <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
          <Sparkles className={`w-4 h-4 ${beginnerMode ? 'text-amber-500 animate-spin' : 'text-slate-400'}`} />
          <div className="text-left">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Explain Like I'm a Beginner
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {beginnerMode ? 'Simple plain-English active' : 'Formal grammar definitions'}
            </p>
          </div>
          <button
            onClick={() => setBeginnerMode(!beginnerMode)}
            className={`w-11 h-6 rounded-full p-1 transition-colors ${
              beginnerMode ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
              beginnerMode ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Sidebar Topics & Right Rule Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Topics Selector */}
        <div className="lg:col-span-4 space-y-3">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Filter grammar topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 rounded-xl text-xs border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none focus:border-brand-500"
            />
          </div>

          <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredTopics.map((top) => (
              <button
                key={top.id}
                onClick={() => setSelectedTopicId(top.id)}
                className={`w-full text-left p-3 rounded-xl transition flex items-center justify-between gap-2 border ${
                  selectedTopicId === top.id
                    ? 'bg-brand-50 dark:bg-brand-950/40 border-brand-300 dark:border-brand-800 text-brand-950 dark:text-brand-200 font-bold shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold">{top.title}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-normal">
                    {top.hindiTitle} • {top.rules?.length || 0} rules
                  </span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                  {top.examWeightage.includes('Critical') ? '🔥 Critical' : 'High'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Active Topic Rules & Examples */}
        <div className="lg:col-span-8 space-y-6">
          {selectedTopic ? (
            <div className="space-y-6">
              
              {/* Topic Overview Card */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                      {selectedTopic.category}
                    </span>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      {selectedTopic.title}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedTopic.hindiTitle}
                    </p>
                  </div>

                  <button
                    onClick={() => onPracticeTopic(selectedTopic.id)}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-brand-600/20 shrink-0"
                  >
                    <Award className="w-4 h-4" />
                    Practice Topic Questions
                  </button>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  {selectedTopic.overview}
                </p>

                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-slate-700 dark:text-slate-200">Exam Frequency:</span>
                  <span>{selectedTopic.pyqFrequency}</span>
                </div>
              </div>

              {/* Rules List */}
              <div className="space-y-4">
                {(selectedTopic.rules || []).map((r, rIdx) => (
                  <div
                    key={r.ruleId || rIdx}
                    className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition"
                  >
                    {/* Rule Header */}
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-black flex items-center justify-center">
                            {rIdx + 1}
                          </span>
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                            {r.ruleTitle}
                          </h3>
                        </div>
                        <span className="text-xs text-slate-400 ml-8 block">
                          {r.ruleHindiTitle}
                        </span>
                      </div>

                      {r.pyqReference && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded border border-emerald-200 dark:border-emerald-800 shrink-0">
                          {r.pyqReference}
                        </span>
                      )}
                    </div>

                    {/* Rule Text: Easy Mode vs Formal Rule */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs leading-relaxed">
                      {beginnerMode ? (
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" /> Easy Beginner Explanation:
                          </span>
                          <p className="font-medium text-slate-800 dark:text-slate-200">
                            {r.easyExplanation}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wide">
                            Formal Syntax Rule:
                          </span>
                          <p className="text-slate-800 dark:text-slate-200">
                            {r.formalRule}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right vs Wrong Comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                          <CheckCircle className="w-4 h-4 shrink-0" />
                          <span>Correct Sentence:</span>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 font-medium">
                          "{r.correctExample}"
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-400">
                          <XCircle className="w-4 h-4 shrink-0" />
                          <span>Wrong Example (Exam Error):</span>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 line-through opacity-80">
                          "{r.wrongExample}"
                        </p>
                      </div>
                    </div>

                    {/* Why is it wrong? */}
                    <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-100/70 dark:bg-slate-800/70 p-2.5 rounded-lg">
                      <strong className="text-slate-800 dark:text-slate-200">Why Wrong: </strong>
                      {r.whyWrong}
                    </div>

                    {/* Shortcuts & Traps Footer */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-900/40">
                        <Zap className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block text-[11px]">Bank Exam Shortcut:</span>
                          <span className="text-[11px]">{r.examShortcut}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-900/40">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block text-[11px]">Common Trap:</span>
                          <span className="text-[11px]">{r.commonTrap}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          ) : (
            <div className="py-20 text-center text-slate-400">
              <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-40" />
              <p>Select a grammar chapter from the sidebar</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

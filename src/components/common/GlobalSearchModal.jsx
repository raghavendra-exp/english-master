import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Book, Sparkles, HelpCircle, ArrowRight, Zap, AlertTriangle } from 'lucide-react';

export default function GlobalSearchModal({ isOpen, onClose, onNavigate, allData = {} }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Handle ESC key and keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(false); // trigger open
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const hits = [];

    // 1. Search Grammar Rules
    (allData.grammarRules || []).forEach(topic => {
      (topic.rules || []).forEach(r => {
        if (
          r.ruleTitle.toLowerCase().includes(q) ||
          r.formalRule.toLowerCase().includes(q) ||
          r.easyExplanation.toLowerCase().includes(q) ||
          r.examShortcut.toLowerCase().includes(q)
        ) {
          hits.push({
            type: 'Grammar Rule',
            icon: 'Book',
            title: r.ruleTitle,
            subtitle: topic.title,
            snippet: r.easyExplanation,
            action: () => {
              onNavigate('grammar', { topicId: topic.id, ruleId: r.ruleId });
              onClose();
            }
          });
        }
      });
    });

    // 2. Search Vocabulary & Editorial Words
    (allData.editorialWords || []).forEach(w => {
      if (
        w.word.toLowerCase().includes(q) ||
        w.meaningEn.toLowerCase().includes(q) ||
        (w.meaningHi && w.meaningHi.includes(q)) ||
        (w.synonyms && w.synonyms.some(s => s.toLowerCase().includes(q)))
      ) {
        hits.push({
          type: 'Vocabulary',
          icon: 'Sparkles',
          title: `${w.word} (${w.pos})`,
          subtitle: w.meaningHi || w.category,
          snippet: w.meaningEn,
          action: () => {
            onNavigate('vocabulary', { word: w.word });
            onClose();
          }
        });
      }
    });

    // 3. Search Idioms & Phrasal Verbs
    (allData.idioms || []).forEach(i => {
      if (i.idiom.toLowerCase().includes(q) || i.meaning.toLowerCase().includes(q)) {
        hits.push({
          type: 'Idiom',
          icon: 'Zap',
          title: i.idiom,
          subtitle: i.hindi,
          snippet: i.meaning,
          action: () => {
            onNavigate('vocabulary', { tab: 'idioms' });
            onClose();
          }
        });
      }
    });

    (allData.phrasalVerbs || []).forEach(pv => {
      if (pv.verb.toLowerCase().includes(q) || pv.meaning.toLowerCase().includes(q)) {
        hits.push({
          type: 'Phrasal Verb',
          icon: 'Zap',
          title: pv.verb,
          subtitle: pv.hindi,
          snippet: pv.meaning,
          action: () => {
            onNavigate('vocabulary', { tab: 'phrasal-verbs' });
            onClose();
          }
        });
      }
    });

    // 4. Search Shortcuts & Traps
    (allData.shortcuts || []).forEach(sc => {
      if (sc.questionType.toLowerCase().includes(q) || sc.fastMethod.toLowerCase().includes(q) || sc.commonTrap.toLowerCase().includes(q)) {
        hits.push({
          type: 'Exam Shortcut',
          icon: 'AlertTriangle',
          title: sc.questionType,
          subtitle: 'Shortcut & Trap Alert',
          snippet: sc.fastMethod,
          action: () => {
            onNavigate('tools', { tab: 'shortcuts' });
            onClose();
          }
        });
      }
    });

    setResults(hits.slice(0, 15));
  }, [query, allData, onNavigate, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search 24 grammar rules, words, idioms, exam shortcuts (e.g. 'despite', 'subject-verb', 'cope with')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder-slate-400 text-sm sm:text-base"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/50">
          {query.trim().length > 1 && results.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <HelpCircle className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No direct matches found for "{query}"</p>
              <p className="text-xs text-slate-500 mt-1">Try searching by topic like 'tenses', 'preposition', 'resilience'</p>
            </div>
          )}

          {results.map((hit, idx) => (
            <div
              key={idx}
              onClick={hit.action}
              className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition flex items-start justify-between gap-3 group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    hit.type === 'Grammar Rule' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' :
                    hit.type === 'Vocabulary' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                    hit.type === 'Idiom' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {hit.type}
                  </span>
                  <span className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
                    {hit.title}
                  </span>
                  {hit.subtitle && (
                    <span className="text-xs text-slate-400">
                      • {hit.subtitle}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  {hit.snippet}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-brand-600 dark:group-hover:text-brand-400 shrink-0 self-center transition transform group-hover:translate-x-1" />
            </div>
          ))}

          {!query && (
            <div className="p-4 text-xs text-slate-500 dark:text-slate-400 space-y-2">
              <p className="font-semibold uppercase tracking-wider text-[10px] text-slate-400">Quick Searches:</p>
              <div className="flex flex-wrap gap-1.5">
                {['Subject-Verb Agreement', 'Adhere to', 'No sooner... than', 'Ameliorate', 'Neither nor', 'Cope with', 'Affect vs Effect'].map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(s)}
                    className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

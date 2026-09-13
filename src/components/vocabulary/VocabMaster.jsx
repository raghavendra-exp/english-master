import React, { useState } from 'react';
import { 
  Sparkles, BookOpen, Layers, Zap, Bookmark, 
  CheckCircle, Search, Volume2, ArrowRight, HelpCircle 
} from 'lucide-react';
import { dataManager } from '../../utils/dataManager';

export default function VocabMaster({ allData = {}, initialTab = 'daily', onNavigate, language = 'en' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedWords, setSavedWords] = useState(dataManager.getBookmarks().map(b => b.id));

  const editorialWords = allData.editorialWords || [];
  const rootWords = allData.rootWords || [];
  const confusingData = allData.confusingWords || { confusingPairs: [], collocations: [] };
  const idioms = allData.idioms || [];
  const phrasalVerbs = allData.phrasalVerbs || [];

  const toggleSaveWord = (item) => {
    const isNowBookmarked = dataManager.toggleBookmark({
      id: item.id || item.word || item.pair,
      type: 'Vocabulary',
      title: item.word || item.pair || item.idiom || item.verb,
      snippet: item.meaningEn || item.meaning || item.word1?.meaning
    });
    setSavedWords(dataManager.getBookmarks().map(b => b.id));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Lexical Mastery
            </span>
            <span className="text-xs text-slate-400">• 5,000+ Words Architecture</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            Vocabulary, Etymology & Collocation Lab
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Word Power Daily, Editorial Vocab, Greek/Latin Root Trees, Confusing Pairs, Idioms & Phrasal Verbs.
          </p>
        </div>

        <button
          onClick={() => onNavigate('flashcards')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20 shrink-0"
        >
          <Layers className="w-4 h-4" />
          Leitner Flashcard Deck
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'daily', label: 'Daily Word Power (10 Words)', icon: Sparkles },
          { id: 'editorial', label: 'Editorial Vocabulary', icon: BookOpen },
          { id: 'etymology', label: 'Etymology & Root Words', icon: Zap },
          { id: 'confusing', label: 'Confusing Words & Collocations', icon: Layers },
          { id: 'idioms', label: 'Idioms & Phrasal Verbs', icon: Bookmark }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Daily Word Power (10 Words System) */}
      {activeTab === 'daily' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                  Today's 10 High-Yield Bank Exam Words
                </h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  Carefully selected for frequency in SBI Clerk & IBPS Mains reading comprehensions.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 px-2.5 py-1 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200 dark:border-emerald-800">
              10 / 10 New Words
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editorialWords.map((item) => (
              <div 
                key={item.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 hover:border-emerald-300 dark:hover:border-emerald-700 transition"
              >
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-white capitalize">
                        {item.word}
                      </h3>
                      <span className="text-xs font-mono text-slate-400">
                        {item.ipa}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {item.pos}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {item.meaningHi}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleSaveWord(item)}
                    className={`p-1.5 rounded-lg border transition ${
                      savedWords.includes(item.id)
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-600 dark:bg-emerald-950 dark:border-emerald-800'
                        : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {item.meaningEn}
                </p>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800 italic">
                  "{item.editorialContext}"
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">Synonyms:</span>
                    <span className="text-slate-600 dark:text-slate-300">{item.synonyms?.join(', ')}</span>
                  </div>
                  <div>
                    <span className="font-bold text-rose-700 dark:text-rose-400 block mb-0.5">Antonyms:</span>
                    <span className="text-slate-600 dark:text-slate-300">{item.antonyms?.join(', ')}</span>
                  </div>
                </div>

                {item.pyqOccurrence && (
                  <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span>Repeated in: {item.pyqOccurrence}</span>
                    <span className="font-bold text-emerald-600">High Exam Yield</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Editorial Words */}
      {activeTab === 'editorial' && (
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            Editorial word power teaches words in real economic contexts (trade policy, banking regulation, inflation, fiscal deficit) without infringing on copyrighted columns.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editorialWords.map((item) => (
              <div key={item.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white capitalize">{item.word}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded-full">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">{item.meaningEn}</p>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs text-slate-700 dark:text-slate-200">
                  <span className="font-bold block text-slate-500 text-[10px] uppercase">Banking Usage:</span>
                  "{item.editorialContext}"
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(item.collocations || []).map((col, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Etymology & Root Words */}
      {activeTab === 'etymology' && (
        <div className="space-y-6">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-800/60 text-xs text-indigo-900 dark:text-indigo-200">
            <strong>The Power of Etymology:</strong> By learning 1 root word, you unlock the intuitive meaning of 15 to 20 derivative words instantly!
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rootWords.map((rootItem, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {rootItem.origin} Root
                    </span>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      {rootItem.root} = "{rootItem.meaning}"
                    </h3>
                  </div>
                  <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    <Zap className="w-5 h-5" />
                  </div>
                </div>

                <div className="text-xs bg-indigo-50/50 dark:bg-indigo-950/20 p-3 rounded-xl text-indigo-900 dark:text-indigo-300 font-medium">
                  💡 Memory Trick: {rootItem.memoryTrick}
                </div>

                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                    Derivative Word Family:
                  </span>
                  {(rootItem.words || []).map((w, wIdx) => (
                    <div key={wIdx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {w.word} <span className="text-[10px] text-slate-400 font-normal">({w.pos})</span>
                        </span>
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          {w.hindi}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{w.meaning}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">"{w.example}"</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Confusing Words & Collocations */}
      {activeTab === 'confusing' && (
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              High-Frequency Confusing Word Pairs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(confusingData.confusingPairs || []).map((pairItem, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {pairItem.pair}
                    </h3>
                    <span className="text-xs text-slate-400 font-semibold">{pairItem.hindiTitle}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 space-y-1">
                      <span className="font-bold text-brand-600 capitalize block">{pairItem.word1?.word} ({pairItem.word1?.pos})</span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">{pairItem.word1?.meaning}</p>
                      <p className="text-[10px] text-slate-400 italic">"{pairItem.word1?.example}"</p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 space-y-1">
                      <span className="font-bold text-blue-600 capitalize block">{pairItem.word2?.word} ({pairItem.word2?.pos})</span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">{pairItem.word2?.meaning}</p>
                      <p className="text-[10px] text-slate-400 italic">"{pairItem.word2?.example}"</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 text-xs font-medium border border-amber-200 dark:border-amber-900/40">
                    💡 {pairItem.examTrap}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Natural Banking Collocations vs Common Unnatural Blunders
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(confusingData.collocations || []).map((col, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{col.natural}</span>
                    </div>
                    <div className="text-[11px] text-rose-500 line-through opacity-70">
                      ✗ {col.unnatural}
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0">
                    {col.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Idioms & Phrasal Verbs */}
      {activeTab === 'idioms' && (
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              High-Yield Banking Idioms & Phrases
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {idioms.map((item) => (
                <div key={item.id} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">"{item.idiom}"</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                      {item.pyqTag || 'Exam Favorite'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{item.meaning}</p>
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{item.hindi}</p>
                  <p className="text-[11px] text-slate-500 italic">"{item.example}"</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Essential Phrasal Verbs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {phrasalVerbs.map((pv) => (
                <div key={pv.id} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white capitalize">{pv.verb}</h3>
                    <span className="text-xs text-emerald-600 font-semibold">{pv.hindi}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{pv.meaning}</p>
                  <p className="text-[11px] text-slate-500 italic">"{pv.example}"</p>
                  {pv.trap && (
                    <div className="text-[11px] p-2 bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 rounded border border-rose-200 dark:border-rose-900/40">
                      ⚠️ {pv.trap}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

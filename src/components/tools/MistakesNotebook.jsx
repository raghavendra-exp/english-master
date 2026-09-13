import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, CheckCircle, Trash2, RotateCcw, 
  HelpCircle, Sparkles, Filter, Award, BookOpen 
} from 'lucide-react';
import { dataManager } from '../../utils/dataManager';

export default function MistakesNotebook({ allQuestions = [], onNavigate }) {
  const [mistakes, setMistakes] = useState([]);
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    setMistakes(dataManager.getMistakes());
  }, []);

  const handleMarkRevised = (qId) => {
    dataManager.markMistakeRevised(qId);
    setMistakes(dataManager.getMistakes());
  };

  const handleRemove = (qId) => {
    dataManager.removeMistake(qId);
    setMistakes(dataManager.getMistakes());
  };

  const filteredMistakes = mistakes.filter(m => {
    if (filterCategory === 'all') return true;
    return m.mistakeCategory === filterCategory;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              Diagnostic Notebook
            </span>
            <span className="text-xs text-slate-400">• {mistakes.length} Recorded Errors</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            My Error Book (Mistakes Notebook)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Classify and systematically resolve wrong answers. Never make the same error twice.
          </p>
        </div>

        {/* Filter Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {[
            { id: 'all', label: 'All' },
            { id: 'Concept Error', label: 'Concept' },
            { id: 'Careless Error', label: 'Careless' },
            { id: 'Vocabulary Error', label: 'Vocab' },
            { id: 'Time-pressure Error', label: 'Time Pressure' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                filterCategory === cat.id
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mistakes List */}
      {filteredMistakes.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-3">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto opacity-70" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Your Error Book is completely clean!
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No mistakes recorded under this category. Practice questions in the arena or take a mock test to identify blind spots.
          </p>
          <button
            onClick={() => onNavigate('practice')}
            className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition shadow"
          >
            Go to Practice Arena
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMistakes.map((item, idx) => {
            const q = allQuestions.find(qItem => qItem.id === item.questionId);
            if (!q) return null;

            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition shadow-sm space-y-3 ${
                  item.revised 
                    ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/20' 
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                      {item.mistakeCategory}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {q.topicName}
                    </span>
                    {item.repeatCount > 1 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                        Missed {item.repeatCount} times!
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleMarkRevised(item.questionId)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                        item.revised
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {item.revised ? '✓ Revised' : 'Mark Revised'}
                    </button>
                    <button
                      onClick={() => handleRemove(item.questionId)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition"
                      title="Remove from notebook"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                  {q.question?.en}
                </p>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <span>Correct Answer: Option ({String.fromCharCode(65 + q.correctAnswer)})</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">{q.explanation?.en}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

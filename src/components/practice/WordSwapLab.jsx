import React, { useState } from 'react';
import { 
  Layers, CheckCircle, XCircle, RotateCcw, 
  ArrowRight, Sparkles, HelpCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { dataManager } from '../../utils/dataManager';

export default function WordSwapLab({ allQuestions = [], onNavigate }) {
  const swapQuestions = allQuestions.filter(q => q.topicId === 'word-swap');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSwap, setSelectedSwap] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const currentQ = swapQuestions[currentIndex] || swapQuestions[0];

  const handleSelectOption = (optIdx) => {
    if (submitted) return;
    setSelectedSwap(optIdx);
    setSubmitted(true);

    const isCorrect = optIdx === currentQ.correctAnswer;
    dataManager.recordAttempt(
      currentQ.id,
      'word-swap',
      isCorrect,
      20,
      'Fairly sure'
    );
    dataManager.addXP(isCorrect ? 15 : 5);

    if (isCorrect) {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
    }
  };

  const handleNext = () => {
    setSelectedSwap(null);
    setSubmitted(false);
    if (currentIndex < swapQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  if (!currentQ) return null;

  const isCorrect = selectedSwap === currentQ.correctAnswer;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              Interactive Lab
            </span>
            <span className="text-xs text-slate-400">• Puzzle {currentIndex + 1} of {swapQuestions.length}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            Word Swap Sandbox
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Identify which pair of bold words must be swapped to restore grammatical and contextual meaning.
          </p>
        </div>

        <button
          onClick={handleNext}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Next Sentence
        </button>
      </div>

      {/* Word Swap Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wide">
            Word Swap Challenge
          </span>
          <span className="text-xs text-slate-400 font-semibold">{currentQ.pyqInfo}</span>
        </div>

        {/* Sentence Text */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-sm sm:text-base leading-relaxed text-slate-900 dark:text-white font-medium">
          {currentQ.question.en.replace(/In the following sentence.*?:\n\n/, '')}
        </div>

        {/* Options List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQ.options.en.map((opt, optIdx) => {
            const isSelected = selectedSwap === optIdx;
            const isActualAnswer = optIdx === currentQ.correctAnswer;

            let btnStyle = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-teal-400 text-slate-800 dark:text-slate-200";

            if (isSelected) {
              btnStyle = "bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-950 dark:text-teal-100 font-bold";
            }

            if (submitted) {
              if (isActualAnswer) {
                btnStyle = "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-bold";
              } else if (isSelected && !isActualAnswer) {
                btnStyle = "bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-950 dark:text-rose-100 line-through";
              }
            }

            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                disabled={submitted}
                className={`p-3.5 rounded-2xl border transition flex items-center justify-between text-xs sm:text-sm ${btnStyle}`}
              >
                <span>{opt}</span>
                {submitted && isActualAnswer && <CheckCircle className="w-4 h-4 text-emerald-600" />}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {submitted && (
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-fade-in text-xs sm:text-sm">
            <div className={`p-4 rounded-2xl border flex items-center justify-between ${
              isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
            }`}>
              <span className="font-bold">
                {isCorrect ? 'Correct Swap Identified!' : `Incorrect! Correct option was ${currentQ.options.en[currentQ.correctAnswer]}`}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs">
              <span className="font-bold text-slate-400 block mb-1 text-[10px] uppercase">Why this swap works:</span>
              <p className="text-slate-800 dark:text-slate-200">{currentQ.explanation.en}</p>
            </div>

            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
            >
              Next Swap Question <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

    </div>
  );
}

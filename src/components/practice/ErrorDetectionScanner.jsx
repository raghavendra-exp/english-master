import React, { useState } from 'react';
import { 
  Search, CheckCircle, XCircle, AlertTriangle, 
  Sparkles, ArrowRight, RotateCcw, Award, Bookmark 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { dataManager } from '../../utils/dataManager';

export default function ErrorDetectionScanner({ allQuestions = [], onNavigate, language = 'en' }) {
  const errorQuestions = allQuestions.filter(q => q.topicId === 'error-detection');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPart, setSelectedPart] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const currentQ = errorQuestions[currentIndex] || errorQuestions[0];

  // Parse sentence into parts (A), (B), (C), (D)
  const parseSentence = (rawText) => {
    if (!rawText) return [];
    // Matches patterns like "... (A)/ ... (B)/ ... (C)/ ... (D)/ No error (E)"
    const rawClean = rawText.replace(/"/g, '').replace(/In the following sentence.*?:\n\n/, '');
    const segments = rawClean.split(/\s*\([A-E]\)\/?\s*/).filter(s => s.trim().length > 0);
    
    return [
      { letter: 'A', text: segments[0] || 'Part A' },
      { letter: 'B', text: segments[1] || 'Part B' },
      { letter: 'C', text: segments[2] || 'Part C' },
      { letter: 'D', text: segments[3] || 'Part D' },
      { letter: 'E', text: 'No Error' }
    ];
  };

  const parts = parseSentence(currentQ?.question?.en || "");

  const handlePartClick = (partIndex) => {
    if (submitted) return;
    setSelectedPart(partIndex);
    setSubmitted(true);

    const isCorrect = partIndex === currentQ.correctAnswer;
    dataManager.recordAttempt(
      currentQ.id,
      'error-detection',
      isCorrect,
      15,
      'Fairly sure',
      isCorrect ? null : 'Concept Error'
    );
    dataManager.addXP(isCorrect ? 20 : 5);

    if (isCorrect) {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    }
  };

  const handleNext = () => {
    setSelectedPart(null);
    setSubmitted(false);
    if (currentIndex < errorQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  if (!currentQ) return null;

  const isCorrect = selectedPart === currentQ.correctAnswer;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              Interactive Lab
            </span>
            <span className="text-xs text-slate-400">• Error {currentIndex + 1} of {errorQuestions.length}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            Error Detection Scanner
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Click directly on the segment containing the grammatical error (or click No Error E).
          </p>
        </div>

        <button
          onClick={handleNext}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Next Sentence
        </button>
      </div>

      {/* Interactive Sentence Scanner Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Click the erroneous fragment below:
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-400">
            {currentQ.pyqInfo || 'Bank Exam PYQ'}
          </span>
        </div>

        {/* Clickable Sentence Blocks */}
        <div className="grid grid-cols-1 gap-3">
          {parts.map((part, idx) => {
            const isSelected = selectedPart === idx;
            const isActualError = idx === currentQ.correctAnswer;

            let cardStyle = "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 hover:border-brand-500 hover:bg-slate-100/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200";

            if (submitted) {
              if (isActualError) {
                cardStyle = "bg-rose-50 dark:bg-rose-950/40 border-rose-500 dark:border-rose-500 text-rose-950 dark:text-rose-100 font-bold shadow-sm";
              } else if (isSelected && !isActualError) {
                cardStyle = "bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-400 text-amber-900 dark:text-amber-100";
              } else {
                cardStyle = "opacity-40 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400";
              }
            }

            return (
              <div
                key={idx}
                onClick={() => handlePartClick(idx)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-4 text-xs sm:text-sm ${cardStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                    submitted && isActualError
                      ? 'bg-rose-600 text-white'
                      : isSelected 
                      ? 'bg-brand-600 text-white' 
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}>
                    {part.letter}
                  </span>
                  <span className="leading-relaxed font-medium">
                    {part.text}
                  </span>
                </div>

                {submitted && isActualError && (
                  <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded-md shrink-0">
                    ERROR LOCATED
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Interactive Forensic Diagnosis */}
        {submitted && (
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-fade-in">
            
            {/* Verdict */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between ${
              isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {isCorrect ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-rose-600" />}
                <span>{isCorrect ? 'Target Identified! Accurate Diagnosis.' : `Missed! The error was in Part (${String.fromCharCode(65 + currentQ.correctAnswer)})`}</span>
              </div>
              <span className="text-xs font-semibold">
                Tested: {currentQ.ruleTested || 'Grammar Rule'}
              </span>
            </div>

            {/* Rule & Explanation */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs sm:text-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Rule Violation & Correction:
              </span>
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {language === 'hi' ? currentQ.explanation.hi : currentQ.explanation.en}
              </p>
            </div>

            {/* Exam Tip & Memory Trick */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {currentQ.examTip && (
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-900/40">
                  <span className="font-bold block text-[11px]">💡 Forensic Scanner Tip:</span>
                  <span>{currentQ.examTip.en}</span>
                </div>
              )}
              {currentQ.trapAlert && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-900/40">
                  <span className="font-bold block text-[11px]">⚠️ Common Exam Trap:</span>
                  <span>{currentQ.trapAlert.en}</span>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => onNavigate('practice', { topicId: 'error-detection' })}
                className="text-xs text-brand-600 font-semibold hover:underline"
              >
                View in Standard Practice Arena →
              </button>
              <button
                onClick={handleNext}
                className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                Scan Next Sentence <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

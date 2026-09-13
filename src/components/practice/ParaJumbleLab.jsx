import React, { useState } from 'react';
import { 
  Move, CheckCircle, XCircle, ArrowUp, ArrowDown, 
  RotateCcw, Sparkles, HelpCircle, Check, Award 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { dataManager } from '../../utils/dataManager';

export default function ParaJumbleLab({ allData = {}, onNavigate }) {
  const jumbles = allData.paraJumbles || [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const activeJumble = jumbles[currentIdx] || jumbles[0];

  // Current order of sentence IDs: e.g. ['A', 'B', 'C', 'D', 'E']
  const [order, setOrder] = useState(activeJumble ? activeJumble.sentences.map(s => s.id) : []);
  const [submitted, setSubmitted] = useState(false);

  const moveItem = (fromIdx, toIdx) => {
    if (submitted || toIdx < 0 || toIdx >= order.length) return;
    const updated = [...order];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setOrder(updated);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const isCorrect = JSON.stringify(order) === JSON.stringify(activeJumble.correctSequence);
    
    dataManager.recordAttempt(
      activeJumble.id,
      'para-jumbles',
      isCorrect,
      90,
      'Fairly sure'
    );
    dataManager.addXP(isCorrect ? 30 : 10);

    if (isCorrect) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  const handleReset = () => {
    setOrder(activeJumble.sentences.map(s => s.id));
    setSubmitted(false);
  };

  const handleNext = () => {
    const nextIdx = (currentIdx + 1) % jumbles.length;
    setCurrentIdx(nextIdx);
    setOrder(jumbles[nextIdx].sentences.map(s => s.id));
    setSubmitted(false);
  };

  if (!activeJumble) return null;

  const isCorrect = JSON.stringify(order) === JSON.stringify(activeJumble.correctSequence);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              Interactive Lab
            </span>
            <span className="text-xs text-slate-400">• Puzzle {currentIdx + 1} of {jumbles.length}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            Para Jumbles Drag & Reorder Lab
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Use the arrows to rearrange the sentences into a logical, cohesive banking narrative.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Shuffle
          </button>
          <button
            onClick={handleNext}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 rounded-xl text-xs font-semibold"
          >
            Next Jumble
          </button>
        </div>
      </div>

      {/* Reorder Workstation Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              {activeJumble.title}
            </h2>
            <span className="text-xs text-slate-400 font-semibold">{activeJumble.pyqTag}</span>
          </div>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800/40">
            Target Sequence: {activeJumble.sentences.length} Sentences
          </span>
        </div>

        {/* Reorderable Items List */}
        <div className="space-y-3">
          {order.map((sentenceId, idx) => {
            const sentenceObj = activeJumble.sentences.find(s => s.id === sentenceId);
            const isCorrectSlot = submitted && activeJumble.correctSequence[idx] === sentenceId;
            const isWrongSlot = submitted && activeJumble.correctSequence[idx] !== sentenceId;

            let borderStyle = "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40";
            if (submitted) {
              borderStyle = isCorrectSlot 
                ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-100 font-medium" 
                : "border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 text-rose-950 dark:text-rose-100";
            }

            return (
              <div
                key={sentenceId}
                className={`p-4 rounded-2xl border transition flex items-center justify-between gap-4 text-xs sm:text-sm ${borderStyle}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center justify-center shrink-0">
                    <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center justify-center mb-1">
                      {idx + 1}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      ({sentenceId})
                    </span>
                  </div>

                  <p className="leading-relaxed text-slate-800 dark:text-slate-200 pt-0.5">
                    {sentenceObj?.text}
                  </p>
                </div>

                {/* Move Controls */}
                {!submitted ? (
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => moveItem(idx, idx - 1)}
                      disabled={idx === 0}
                      className="p-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 disabled:opacity-20 transition"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                    </button>
                    <button
                      onClick={() => moveItem(idx, idx + 1)}
                      disabled={idx === order.length - 1}
                      className="p-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 disabled:opacity-20 transition"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                    </button>
                  </div>
                ) : (
                  <div className="shrink-0">
                    {isCorrectSlot ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Bar */}
        {!submitted ? (
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Current Arrangement: {order.join(' ➔ ')}
            </span>
            <button
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              Check Sequence Order
            </button>
          </div>
        ) : (
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-fade-in">
            <div className={`p-4 rounded-2xl border flex items-center justify-between ${
              isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
            }`}>
              <span className="font-bold text-sm">
                {isCorrect ? 'Outstanding! Perfect sequence solved.' : `Sequence Incorrect. Correct Order: ${activeJumble.correctSequence.join(' ➔ ')}`}
              </span>
            </div>

            {/* Clue Walkthrough Breakdown */}
            {activeJumble.clues && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block">
                  How an Exam Expert Solves This Jumble:
                </span>
                <p><strong>1. Opening Clue:</strong> {activeJumble.clues.openingClue}</p>
                <p><strong>2. Connecting Clue:</strong> {activeJumble.clues.connectingClue}</p>
                {activeJumble.clues.pronounClue && <p><strong>3. Pronoun Clue:</strong> {activeJumble.clues.pronounClue}</p>}
                {activeJumble.clues.conclusionClue && <p><strong>4. Conclusion Clue:</strong> {activeJumble.clues.conclusionClue}</p>}
              </div>
            )}

            <button
              onClick={handleNext}
              className="px-6 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
            >
              Try Next Para Jumble ➔
            </button>
          </div>
        )}

      </div>

    </div>
  );
}

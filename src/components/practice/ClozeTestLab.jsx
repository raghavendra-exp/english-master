import React, { useState } from 'react';
import { 
  FileText, CheckCircle, XCircle, ArrowRight, RotateCcw, 
  Sparkles, Award, HelpCircle, Check, AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { dataManager } from '../../utils/dataManager';

export default function ClozeTestLab({ allData = {}, onNavigate }) {
  const clozePassages = allData.clozeTests || [];
  const [currentPassageIdx, setCurrentPassageIdx] = useState(0);
  const [activeBlankIdx, setActiveBlankIdx] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({}); // { 1: 0, 2: 1, ... }
  const [submitted, setSubmitted] = useState(false);

  const activePassage = clozePassages[currentPassageIdx] || clozePassages[0];

  const handleSelectOption = (blankIndex, optionIdx) => {
    if (submitted) return;
    setSelectedOptions(prev => ({ ...prev, [blankIndex]: optionIdx }));
    // Move to next blank if available
    if (blankIndex < (activePassage?.blanks?.length || 5)) {
      setActiveBlankIdx(blankIndex + 1);
    }
  };

  const handleSubmitAll = () => {
    setSubmitted(true);
    let correctCount = 0;
    activePassage.blanks.forEach(b => {
      if (selectedOptions[b.blankIndex] === b.correctAnswer) {
        correctCount++;
      }
    });

    dataManager.recordAttempt(
      activePassage.id,
      'cloze-test',
      correctCount >= 3,
      120,
      'Fairly sure'
    );
    dataManager.addXP(correctCount * 15);

    if (correctCount >= 4) {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleReset = () => {
    setSelectedOptions({});
    setSubmitted(false);
    setActiveBlankIdx(1);
  };

  if (!activePassage) return null;

  const currentBlankObj = activePassage.blanks.find(b => b.blankIndex === activeBlankIdx) || activePassage.blanks[0];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Interactive Lab
            </span>
            <span className="text-xs text-slate-400">• Passage {currentPassageIdx + 1} of {clozePassages.length}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            Interactive Cloze Test Engine
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Solve one blank at a time in full context; observe how words integrate seamlessly into the passage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* Main Cloze Workbench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Full Passage with Clickable Blank Indicators */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              {activePassage.title}
            </h2>
            <span className="text-xs text-slate-400 font-semibold">
              {activePassage.pyqTag}
            </span>
          </div>

          {/* Interactive Passage Flow */}
          <div className="text-sm leading-relaxed text-slate-800 dark:text-slate-200 space-y-3 font-serif">
            <p>
              {/* Parse passage string and inject interactive chips for __(n)__ */}
              {activePassage.passage.split(/__\((\d)\)__/).map((chunk, i) => {
                const blankNum = parseInt(chunk);
                if (!isNaN(blankNum)) {
                  const isSelected = selectedOptions[blankNum] !== undefined;
                  const blankData = activePassage.blanks.find(b => b.blankIndex === blankNum);
                  const chosenOptionText = isSelected ? blankData?.options[selectedOptions[blankNum]]?.text : null;
                  const isCorrect = isSelected && selectedOptions[blankNum] === blankData?.correctAnswer;

                  let chipStyle = "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
                  if (activeBlankIdx === blankNum) {
                    chipStyle = "bg-blue-600 text-white border-blue-600 ring-2 ring-blue-400/40";
                  } else if (submitted) {
                    chipStyle = isCorrect ? "bg-emerald-600 text-white border-emerald-600" : "bg-rose-600 text-white border-rose-600";
                  } else if (isSelected) {
                    chipStyle = "bg-brand-100 text-brand-800 border-brand-300 dark:bg-brand-950 dark:text-brand-300";
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => setActiveBlankIdx(blankNum)}
                      className={`inline-flex items-center gap-1 mx-1 px-2.5 py-0.5 rounded-lg border text-xs font-sans font-bold transition shadow-sm ${chipStyle}`}
                    >
                      <span>({blankNum})</span>
                      <span>{chosenOptionText || `____`}</span>
                    </button>
                  );
                }
                return <span key={i}>{chunk}</span>;
              })}
            </p>
          </div>

          {/* Passage Footer Actions */}
          {!submitted ? (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                {Object.keys(selectedOptions).length} of {activePassage.blanks.length} Blanks Answered
              </span>
              <button
                onClick={handleSubmitAll}
                disabled={Object.keys(selectedOptions).length < activePassage.blanks.length}
                className="px-5 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-md transition"
              >
                Submit & Check All Blanks
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600">
              <span>Passage Completed! Review blank explanations on the right.</span>
            </div>
          )}
        </div>

        {/* Right Column: Blank Options & Distractor Rejection */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Blank Header Card */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                Options for Blank ({activeBlankIdx})
              </span>
              <div className="flex items-center gap-1">
                {activePassage.blanks.map(b => (
                  <button
                    key={b.blankIndex}
                    onClick={() => setActiveBlankIdx(b.blankIndex)}
                    className={`w-6 h-6 rounded-lg text-[11px] font-bold transition ${
                      activeBlankIdx === b.blankIndex
                        ? 'bg-blue-600 text-white'
                        : selectedOptions[b.blankIndex] !== undefined
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {b.blankIndex}
                  </button>
                ))}
              </div>
            </div>

            {/* Options List */}
            <div className="space-y-2">
              {(currentBlankObj?.options || []).map((opt, optIdx) => {
                const isSelected = selectedOptions[activeBlankIdx] === optIdx;
                const isAnswer = optIdx === currentBlankObj.correctAnswer;

                let optClass = "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-blue-400 text-slate-800 dark:text-slate-200";

                if (isSelected) {
                  optClass = "bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-900 dark:text-blue-100 font-bold";
                }

                if (submitted) {
                  if (isAnswer) {
                    optClass = "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-bold";
                  } else if (isSelected && !isAnswer) {
                    optClass = "bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-950 dark:text-rose-100 line-through";
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(activeBlankIdx, optIdx)}
                    disabled={submitted}
                    className={`w-full text-left p-3 rounded-2xl border transition flex items-center justify-between text-xs sm:text-sm ${optClass}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {opt.letter}
                      </span>
                      <span>{opt.text}</span>
                    </div>

                    {submitted && isAnswer && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation Box when submitted */}
            {submitted && (
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs animate-fade-in">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 rounded-xl border border-emerald-200 dark:border-emerald-800/60">
                  <span className="font-bold block mb-0.5">Why Correct Option Fits:</span>
                  {currentBlankObj.explanation}
                </div>

                {currentBlankObj.whyDistractorsFail && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 rounded-xl border border-slate-200/80 dark:border-slate-800">
                    <span className="font-bold block mb-0.5 text-slate-800 dark:text-slate-200">Why Distractors Fail:</span>
                    {currentBlankObj.whyDistractorsFail}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

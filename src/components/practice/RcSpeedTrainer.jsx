import React, { useState, useEffect } from 'react';
import { 
  Compass, Clock, Award, CheckCircle, XCircle, 
  ArrowRight, RotateCcw, Zap, AlertTriangle, BookOpen, Eye 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { dataManager } from '../../utils/dataManager';

export default function RcSpeedTrainer({ allData = {}, onNavigate }) {
  const rcPassages = allData.readingComprehension || [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [readingPhase, setReadingPhase] = useState('reading'); // 'reading' or 'answering'
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [activeParagraph, setActiveParagraph] = useState(null);

  // Question State
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submittedAnswers, setSubmittedAnswers] = useState({}); // { qId: optIdx }
  const [score, setScore] = useState(0);

  const activePassage = rcPassages[currentIdx] || rcPassages[0];

  // Timer loop for WPM
  useEffect(() => {
    let interval = null;
    if (timerActive && readingPhase === 'reading') {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, readingPhase]);

  const currentWpm = secondsElapsed > 0 
    ? Math.round(((activePassage?.wordCount || 400) / secondsElapsed) * 60)
    : 0;

  const handleFinishReading = () => {
    setTimerActive(false);
    setReadingPhase('answering');
    setQuestionIdx(0);
  };

  const handleSelectOption = (optIdx) => {
    if (submittedAnswers[questionIdx] !== undefined) return;
    setSelectedOption(optIdx);
  };

  const handleAnswerQuestion = () => {
    if (selectedOption === null) return;
    const currentQ = activePassage.questions[questionIdx];
    const isCorrect = selectedOption === currentQ.correctAnswer;
    
    setSubmittedAnswers(prev => ({ ...prev, [questionIdx]: selectedOption }));
    if (isCorrect) setScore(prev => prev + 1);

    dataManager.recordAttempt(
      currentQ.id,
      'reading-comprehension',
      isCorrect,
      Math.round(secondsElapsed / activePassage.questions.length),
      'Fairly sure'
    );
    dataManager.addXP(isCorrect ? 20 : 5);

    if (isCorrect) {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    }
  };

  const handleReset = () => {
    setReadingPhase('reading');
    setSecondsElapsed(0);
    setTimerActive(true);
    setSelectedOption(null);
    setSubmittedAnswers({});
    setScore(0);
    setQuestionIdx(0);
  };

  if (!activePassage) return null;

  const currentQ = activePassage.questions[questionIdx];
  const isQuestionAnswered = submittedAnswers[questionIdx] !== undefined;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              Reading Lab
            </span>
            <span className="text-xs text-slate-400">• {activePassage.genre}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            RC Speed Trainer & WPM Calculator
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Train your reading speed without sacrificing comprehension accuracy. Benchmark your Words Per Minute (WPM).
          </p>
        </div>

        {/* WPM Speedometer Display */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700">
          <Clock className="w-5 h-5 text-purple-600 animate-spin" style={{ animationDuration: '4s' }} />
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-900 dark:text-white">{currentWpm}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">WPM</span>
            </div>
            <span className="text-[10px] text-slate-400">Time: {secondsElapsed}s</span>
          </div>
        </div>
      </div>

      {/* Main RC Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Passage Display */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                {activePassage.wordCount} Words • {activePassage.difficulty}
              </span>
              <h2 className="font-black text-base text-slate-900 dark:text-white">
                {activePassage.title}
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-semibold shrink-0">
              {activePassage.pyqTag}
            </span>
          </div>

          {/* Paragraphs with Paragraph Mapping */}
          <div className="space-y-4 font-serif text-sm leading-relaxed text-slate-800 dark:text-slate-200">
            {activePassage.paragraphs.map((p, pIdx) => (
              <p 
                key={pIdx}
                onMouseEnter={() => setActiveParagraph(pIdx)}
                className={`p-3 rounded-xl transition cursor-text ${
                  activeParagraph === pIdx 
                    ? 'bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-800/40' 
                    : ''
                }`}
              >
                <span className="font-sans font-bold text-[10px] text-slate-400 uppercase mr-2 select-none">
                  [Para {pIdx + 1}]
                </span>
                {p}
              </p>
            ))}
          </div>

          {/* Reading Phase Finish Button */}
          {readingPhase === 'reading' && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Aim for 200 - 250 WPM for Bank Clerk Exams
              </span>
              <button
                onClick={handleFinishReading}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition flex items-center gap-1.5"
              >
                Finished Reading ➔ Solve Questions <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Comprehension Question Arena */}
        <div className="lg:col-span-5 space-y-4">
          
          {readingPhase === 'reading' ? (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center py-16 space-y-3">
              <BookOpen className="w-12 h-12 text-purple-400 mx-auto opacity-60 animate-pulse" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Reading Mode in Progress
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Read the article on the left attentively. Click "Finished Reading" when done to unlock the {activePassage.questions.length} comprehension questions.
              </p>
              <button
                onClick={handleFinishReading}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl transition"
              >
                Skip Directly to Questions
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 animate-fade-in">
              
              {/* Question Index Bar */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                    {currentQ.type}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Question {questionIdx + 1} of {activePassage.questions.length}
                  </span>
                </div>

                <span className="text-xs font-bold text-emerald-600">
                  Score: {score} / {Object.keys(submittedAnswers).length}
                </span>
              </div>

              {/* Question Text */}
              <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                {currentQ.question}
              </p>

              {/* Options */}
              <div className="space-y-2">
                {currentQ.options.map((opt, oIdx) => {
                  const letter = String.fromCharCode(65 + oIdx);
                  const isSelected = selectedOption === oIdx;
                  const isSubmitted = isQuestionAnswered;
                  const chosenOpt = submittedAnswers[questionIdx];
                  const isCorrectAnswer = oIdx === currentQ.correctAnswer;

                  let optClass = "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-purple-400 text-slate-800 dark:text-slate-200";

                  if (isSelected && !isSubmitted) {
                    optClass = "bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-900 dark:text-purple-100 font-semibold";
                  }

                  if (isSubmitted) {
                    if (isCorrectAnswer) {
                      optClass = "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-bold";
                    } else if (chosenOpt === oIdx && !isCorrectAnswer) {
                      optClass = "bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-950 dark:text-rose-100 line-through";
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(oIdx)}
                      disabled={isSubmitted}
                      className={`w-full text-left p-3 rounded-2xl border transition flex items-center justify-between text-xs sm:text-sm ${optClass}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {letter}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isSubmitted && isCorrectAnswer && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Submit or Next Controls */}
              {!isQuestionAnswered ? (
                <button
                  onClick={handleAnswerQuestion}
                  disabled={selectedOption === null}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white rounded-xl font-bold text-xs shadow-md transition"
                >
                  Confirm Answer
                </button>
              ) : (
                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs animate-fade-in">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                    <span className="font-bold block text-slate-400 text-[10px] uppercase">Rationale:</span>
                    <p className="text-slate-800 dark:text-slate-200">{currentQ.explanation}</p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => {
                        if (questionIdx > 0) {
                          setQuestionIdx(questionIdx - 1);
                          setSelectedOption(submittedAnswers[questionIdx - 1] ?? null);
                        }
                      }}
                      disabled={questionIdx === 0}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold disabled:opacity-40"
                    >
                      Previous
                    </button>

                    {questionIdx < activePassage.questions.length - 1 ? (
                      <button
                        onClick={() => {
                          setQuestionIdx(questionIdx + 1);
                          setSelectedOption(submittedAnswers[questionIdx + 1] ?? null);
                        }}
                        className="px-4 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold"
                      >
                        Next Question ➔
                      </button>
                    ) : (
                      <button
                        onClick={handleReset}
                        className="px-4 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-bold flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" /> Retest Passage
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

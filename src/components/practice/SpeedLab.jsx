import React, { useState, useEffect } from 'react';
import { 
  Zap, Clock, Award, CheckCircle, XCircle, 
  RotateCcw, Sparkles, Flame, ArrowRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { dataManager } from '../../utils/dataManager';

export default function SpeedLab({ allQuestions = [], onNavigate }) {
  const [drillDuration, setDrillDuration] = useState(20); // 10, 15, 20, 30
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(drillDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'correct', 'wrong', 'timeout'

  // Pick a random question
  const pickRandomQuestion = () => {
    if (!allQuestions.length) return null;
    const randomIdx = Math.floor(Math.random() * allQuestions.length);
    return allQuestions[randomIdx];
  };

  const startDrill = () => {
    setIsRunning(true);
    setScore(0);
    setTotalAttempted(0);
    setStreak(0);
    setFeedback(null);
    setSelectedOption(null);
    setTimeLeft(drillDuration);
    setActiveQuestion(pickRandomQuestion());
  };

  // Timer countdown
  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0 && !feedback) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0 && !feedback) {
      handleTimeout();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, feedback]);

  const handleTimeout = () => {
    setFeedback('timeout');
    setStreak(0);
    setTotalAttempted(prev => prev + 1);
    dataManager.recordAttempt(activeQuestion.id, activeQuestion.topicId, false, drillDuration, 'Guessing', 'Time-pressure Error');
    setTimeout(nextQuestion, 1500);
  };

  const handleSelectOption = (optIdx) => {
    if (!isRunning || feedback) return;
    setSelectedOption(optIdx);
    const isCorrect = optIdx === activeQuestion.correctAnswer;
    setTotalAttempted(prev => prev + 1);

    if (isCorrect) {
      setScore(prev => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setFeedback('correct');
      dataManager.addXP(10 * (newStreak > 3 ? 2 : 1));
      if (newStreak % 5 === 0) {
        confetti({ particleCount: 30, spread: 60 });
      }
    } else {
      setStreak(0);
      setFeedback('wrong');
      dataManager.recordMistake(activeQuestion.id, activeQuestion.topicId, 'Time-pressure Error');
    }

    dataManager.recordAttempt(
      activeQuestion.id,
      activeQuestion.topicId,
      isCorrect,
      drillDuration - timeLeft,
      'Fairly sure'
    );

    setTimeout(nextQuestion, 1200);
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setFeedback(null);
    setTimeLeft(drillDuration);
    setActiveQuestion(pickRandomQuestion());
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              High Intensity
            </span>
            <span className="text-xs text-slate-400">• Speed Lab</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            Rapid Speed Lab & Reflex Drills
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Train your split-second recognition reflexes under rigorous countdown constraints.
          </p>
        </div>

        {/* Timer Duration Mode Selector */}
        {!isRunning && (
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
            {[10, 15, 20, 30].map((sec) => (
              <button
                key={sec}
                onClick={() => setDrillDuration(sec)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  drillDuration === sec 
                    ? 'bg-amber-500 text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Speed Arena Card */}
      {!isRunning ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-md text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <Zap className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Ready for the {drillDuration}-Second Speed Blitz?
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Questions appear in rapid succession. You have exactly {drillDuration} seconds per question. Build combo multipliers and test your banking English instincts!
            </p>
          </div>

          <button
            onClick={startDrill}
            className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-amber-500/30 transition transform hover:scale-105"
          >
            Start Speed Blitz Now ⚡
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6 animate-fade-in">
          
          {/* Status Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            {/* Countdown Clock */}
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-black ${
                timeLeft <= 5 ? 'text-rose-600 animate-ping' : 'text-amber-500'
              }`}>
                {timeLeft}s
              </span>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Remaining</span>
            </div>

            {/* Streak Multiplier */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 rounded-xl border border-amber-200 dark:border-amber-800/40 text-xs font-bold">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
              <span>{streak}x Combo Streak</span>
            </div>

            {/* Score */}
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Score: <span className="text-brand-600 dark:text-brand-400 font-extrabold">{score}</span> / {totalAttempted}
            </div>
          </div>

          {/* Question Stem */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
            {activeQuestion?.question?.en?.replace(/In the following sentence.*?:\n\n/, '')}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {activeQuestion?.options?.en?.map((opt, optIdx) => {
              const letter = String.fromCharCode(65 + optIdx);
              const isSelected = selectedOption === optIdx;
              const isCorrectAnswer = optIdx === activeQuestion.correctAnswer;

              let btnStyle = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-amber-400 text-slate-800 dark:text-slate-200";

              if (feedback) {
                if (isCorrectAnswer) {
                  btnStyle = "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-950 dark:text-emerald-100 font-bold";
                } else if (isSelected && !isCorrectAnswer) {
                  btnStyle = "bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-950 dark:text-rose-100 line-through";
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={feedback !== null}
                  className={`p-3.5 rounded-2xl border transition text-left flex items-center justify-between text-xs sm:text-sm ${btnStyle}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs shrink-0">
                      {letter}
                    </span>
                    <span>{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback Flash */}
          {feedback && (
            <div className={`p-3 rounded-xl text-center text-xs font-bold animate-fade-in ${
              feedback === 'correct' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
              feedback === 'timeout' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
              'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            }`}>
              {feedback === 'correct' ? '⚡ Lightning Fast! Correct!' :
               feedback === 'timeout' ? '⏰ Time Expired! Keep moving!' :
               '❌ Incorrect! Moving to next...'}
            </div>
          )}

          {/* End Drill Button */}
          <div className="pt-2 text-center">
            <button
              onClick={() => setIsRunning(false)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline"
            >
              Exit Speed Lab
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

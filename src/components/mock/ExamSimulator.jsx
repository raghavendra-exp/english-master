import React, { useState, useEffect } from 'react';
import { 
  Clock, CheckCircle, HelpCircle, AlertCircle, 
  ChevronRight, ChevronLeft, Flag, RotateCcw, X 
} from 'lucide-react';
import { dataManager } from '../../utils/dataManager';

export default function ExamSimulator({ 
  preset = null, 
  allQuestions = [], 
  onFinishMock, 
  onExit, 
  language = 'en' 
}) {
  const durationSeconds = (preset?.durationMinutes || 20) * 60;
  const questionsCount = preset?.questionsCount || 30;

  // Prepare questions pool based on preset filters or random slice
  const [examQuestions, setExamQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationSeconds);

  // Status mapping for question palette:
  // 'not-visited', 'not-answered', 'answered', 'marked-for-review', 'answered-and-marked'
  const [answers, setAnswers] = useState({}); // { qIndex: optIndex }
  const [statuses, setStatuses] = useState({}); // { qIndex: status }
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  useEffect(() => {
    // Select questions
    let pool = [...allQuestions];
    if (preset?.filter?.topics?.length) {
      pool = pool.filter(q => preset.filter.topics.includes(q.topicId));
    }
    if (pool.length < questionsCount) {
      pool = [...allQuestions]; // fallback to all if filtered pool is too small
    }
    // Shuffle and pick
    const shuffled = pool.sort(() => 0.5 - Math.random()).slice(0, questionsCount);
    setExamQuestions(shuffled);

    // Initialize statuses
    const initialStatuses = {};
    shuffled.forEach((_, i) => {
      initialStatuses[i] = i === 0 ? 'not-answered' : 'not-visited';
    });
    setStatuses(initialStatuses);
  }, [preset, allQuestions, questionsCount]);

  // Exam Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitExam();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const currentQ = examQuestions[currentIdx];

  const formatTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optIdx) => {
    setAnswers(prev => ({ ...prev, [currentIdx]: optIdx }));
  };

  const handleClearResponse = () => {
    setAnswers(prev => {
      const copy = { ...prev };
      delete copy[currentIdx];
      return copy;
    });
    setStatuses(prev => ({ ...prev, [currentIdx]: 'not-answered' }));
  };

  const handleSaveAndNext = () => {
    const hasAnswer = answers[currentIdx] !== undefined;
    setStatuses(prev => ({
      ...prev,
      [currentIdx]: hasAnswer ? 'answered' : 'not-answered'
    }));

    if (currentIdx < examQuestions.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      if (statuses[nextIdx] === 'not-visited') {
        setStatuses(prev => ({ ...prev, [nextIdx]: 'not-answered' }));
      }
    }
  };

  const handleMarkForReviewAndNext = () => {
    const hasAnswer = answers[currentIdx] !== undefined;
    setStatuses(prev => ({
      ...prev,
      [currentIdx]: hasAnswer ? 'answered-and-marked' : 'marked-for-review'
    }));

    if (currentIdx < examQuestions.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      if (statuses[nextIdx] === 'not-visited') {
        setStatuses(prev => ({ ...prev, [nextIdx]: 'not-answered' }));
      }
    }
  };

  const jumpToQuestion = (idx) => {
    if (statuses[currentIdx] === 'not-visited') {
      setStatuses(prev => ({ ...prev, [currentIdx]: 'not-answered' }));
    }
    setCurrentIdx(idx);
    if (statuses[idx] === 'not-visited') {
      setStatuses(prev => ({ ...prev, [idx]: 'not-answered' }));
    }
  };

  const handleSubmitExam = () => {
    // Calculate final scores
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    const questionResults = examQuestions.map((q, i) => {
      const chosenOpt = answers[i];
      const isAttempted = chosenOpt !== undefined;
      const isCorrect = isAttempted && chosenOpt === q.correctAnswer;
      
      if (!isAttempted) unattempted++;
      else if (isCorrect) correct++;
      else incorrect++;

      return {
        question: q,
        chosenOption: chosenOpt,
        isCorrect,
        isAttempted
      };
    });

    const netScore = +(correct * 1.0 - incorrect * 0.25).toFixed(2);
    const totalMax = examQuestions.length * 1.0;
    const percentage = Math.round((Math.max(0, netScore) / totalMax) * 100);

    const mockResult = {
      id: `mock_${Date.now()}`,
      title: preset?.title || 'Bank English Sectional Mock',
      totalQuestions: examQuestions.length,
      correct,
      incorrect,
      unattempted,
      netScore,
      percentage,
      timeTakenSeconds: durationSeconds - timeLeft,
      questionResults
    };

    dataManager.saveMockResult(mockResult);
    dataManager.addXP(correct * 10);

    onFinishMock(mockResult);
  };

  if (!currentQ) return null;

  // Counts for palette
  const answeredCount = Object.values(statuses).filter(s => s === 'answered').length;
  const notAnsweredCount = Object.values(statuses).filter(s => s === 'not-answered').length;
  const notVisitedCount = Object.values(statuses).filter(s => s === 'not-visited').length;
  const markedReviewCount = Object.values(statuses).filter(s => s === 'marked-for-review' || s === 'answered-and-marked').length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 dark:bg-slate-950 flex flex-col overflow-hidden animate-fade-in">
      
      {/* Top Bar: Exam Title & Countdown Timer */}
      <header className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 shrink-0">
        <div>
          <h1 className="font-extrabold text-sm sm:text-base tracking-tight">
            {preset?.title || 'IBPS / SBI Clerk English Exam Simulator'}
          </h1>
          <span className="text-[11px] text-slate-400">
            Section: English Language • Negative Marking: 0.25
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <Clock className={`w-4 h-4 ${timeLeft < 180 ? 'text-rose-500 animate-pulse' : 'text-brand-400'}`} />
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-bold leading-none">Time Left</span>
              <span className={`text-base font-black font-mono leading-tight ${timeLeft < 180 ? 'text-rose-400' : 'text-white'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition"
          >
            Submit Test
          </button>
        </div>
      </header>

      {/* Main Examination Layout: Question Area (Left) + TCS Palette (Right) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Area: Active Question */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-8 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
          
          <div className="max-w-3xl w-full mx-auto flex-1 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              {/* Question Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  Question No. {currentIdx + 1}
                </span>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-emerald-600 font-bold">+1.00</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-rose-600 font-bold">-0.25</span>
                </div>
              </div>

              {/* Question Text */}
              <div className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                {language === 'hi' ? currentQ.question.hi : currentQ.question.en}
              </div>

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {(currentQ.options[language] || currentQ.options.en).map((opt, optIdx) => {
                  const letter = String.fromCharCode(65 + optIdx);
                  const isSelected = answers[currentIdx] === optIdx;

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition flex items-center gap-3 text-xs sm:text-sm ${
                        isSelected
                          ? 'bg-brand-50 dark:bg-brand-950/40 border-brand-500 text-brand-950 dark:text-brand-100 font-bold'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {letter}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Button Action Bar */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearResponse}
                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 rounded-xl text-xs font-semibold"
                >
                  Clear Response
                </button>
                <button
                  onClick={handleMarkForReviewAndNext}
                  className="px-3.5 py-2 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 rounded-xl text-xs font-semibold border border-purple-200 dark:border-purple-800"
                >
                  Mark for Review & Next
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveAndNext}
                  className="px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1"
                >
                  Save & Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Right Area: TCS iON Question Palette */}
        <div className="w-full lg:w-80 bg-slate-50 dark:bg-slate-950 p-4 border-t lg:border-t-0 border-slate-200 dark:border-slate-800 flex flex-col justify-between overflow-y-auto shrink-0">
          
          <div className="space-y-4">
            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">{answeredCount}</span>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-rose-600 text-white flex items-center justify-center font-bold text-[10px]">{notAnsweredCount}</span>
                <span>Not Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-purple-600 text-white flex items-center justify-center font-bold text-[10px]">{markedReviewCount}</span>
                <span>Marked for Review</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-[10px]">{notVisitedCount}</span>
                <span>Not Visited</span>
              </div>
            </div>

            {/* Question Numbers Grid */}
            <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
                Question Palette:
              </span>
              <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto pr-1">
                {examQuestions.map((_, i) => {
                  const status = statuses[i] || 'not-visited';
                  const isCurrent = currentIdx === i;

                  let badgeClass = "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300";
                  if (status === 'answered') badgeClass = "bg-emerald-600 text-white";
                  else if (status === 'not-answered') badgeClass = "bg-rose-600 text-white";
                  else if (status === 'marked-for-review' || status === 'answered-and-marked') badgeClass = "bg-purple-600 text-white";

                  return (
                    <button
                      key={i}
                      onClick={() => jumpToQuestion(i)}
                      className={`h-9 rounded-xl font-bold text-xs transition flex items-center justify-center relative ${badgeClass} ${
                        isCurrent ? 'ring-2 ring-brand-500 scale-105' : ''
                      }`}
                    >
                      {i + 1}
                      {status === 'answered-and-marked' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute bottom-1 right-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-xl shadow transition"
            >
              Submit Examination
            </button>
          </div>

        </div>

      </div>

      {/* Confirmation Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-fade-in">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Confirm Final Submission
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center text-xs py-2">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl">
                <span className="font-black text-emerald-600 text-base block">{answeredCount}</span>
                <span className="text-slate-500 text-[10px]">Answered</span>
              </div>
              <div className="p-2 bg-rose-50 dark:bg-rose-950/40 rounded-xl">
                <span className="font-black text-rose-600 text-base block">{notAnsweredCount + notVisitedCount}</span>
                <span className="text-slate-500 text-[10px]">Unanswered</span>
              </div>
              <div className="p-2 bg-purple-50 dark:bg-purple-950/40 rounded-xl">
                <span className="font-black text-purple-600 text-base block">{markedReviewCount}</span>
                <span className="text-slate-500 text-[10px]">Review</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Are you sure you want to submit your examination? Once submitted, you cannot change your responses.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
              >
                Return to Exam
              </button>
              <button
                onClick={handleSubmitExam}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
              >
                Yes, Submit Test
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState } from 'react';
import { 
  Award, TrendingUp, CheckCircle, XCircle, Clock, 
  RotateCcw, BookOpen, Bookmark, ArrowRight, ShieldCheck, AlertCircle 
} from 'lucide-react';
import { dataManager } from '../../utils/dataManager';

export default function ScorecardAnalytics({ mockResult, onRetake, onExitDashboard }) {
  const [filterType, setFilterType] = useState('all'); // 'all', 'correct', 'incorrect', 'unattempted'
  const [addedToErrorBook, setAddedToErrorBook] = useState(false);

  if (!mockResult) return null;

  const {
    title,
    totalQuestions,
    correct,
    incorrect,
    unattempted,
    netScore,
    percentage,
    timeTakenSeconds,
    questionResults = []
  } = mockResult;

  const avgTimePerQuestion = totalQuestions > 0 ? Math.round(timeTakenSeconds / totalQuestions) : 0;

  // Filtered review list
  const filteredList = questionResults.filter(item => {
    if (filterType === 'correct') return item.isCorrect;
    if (filterType === 'incorrect') return item.isAttempted && !item.isCorrect;
    if (filterType === 'unattempted') return !item.isAttempted;
    return true;
  });

  const handleAddAllMistakes = () => {
    questionResults.forEach(item => {
      if (item.isAttempted && !item.isCorrect) {
        dataManager.recordMistake(
          item.question.id,
          item.question.topicId,
          'Mock Test Error',
          `Mistake recorded from ${title}`
        );
      }
    });
    setAddedToErrorBook(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Scorecard Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-navy-900 to-brand-950 p-6 sm:p-8 rounded-3xl text-white border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">
              Mock Examination Scorecard
            </span>
            <h1 className="text-xl sm:text-2xl font-black mt-1">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRetake}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake Mock
            </button>
            <button
              onClick={onExitDashboard}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition"
            >
              Return to Dashboard
            </button>
          </div>
        </div>

        {/* Core Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <span className="text-2xl sm:text-3xl font-black text-brand-400">{netScore}</span>
            <span className="text-[10px] text-slate-300 block uppercase font-bold mt-1">Net Score</span>
            <span className="text-[9px] text-slate-400">Max: {totalQuestions}.00</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <span className="text-2xl sm:text-3xl font-black text-blue-400">{percentage}%</span>
            <span className="text-[10px] text-slate-300 block uppercase font-bold mt-1">Accuracy</span>
            <span className="text-[9px] text-slate-400">{correct} of {correct + incorrect} attempted</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <span className="text-2xl sm:text-3xl font-black text-amber-400">{avgTimePerQuestion}s</span>
            <span className="text-[10px] text-slate-300 block uppercase font-bold mt-1">Avg Time / Q</span>
            <span className="text-[9px] text-slate-400">Benchmark: 40s</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <span className="text-2xl sm:text-3xl font-black text-purple-400">
              {percentage >= 75 ? '94th' : percentage >= 55 ? '78th' : '52nd'}
            </span>
            <span className="text-[10px] text-slate-300 block uppercase font-bold mt-1">Est. Percentile</span>
            <span className="text-[9px] text-slate-400">State Ranking Band</span>
          </div>
        </div>
      </div>

      {/* Action Strip: Add to Error Book */}
      {incorrect > 0 && (
        <div className="bg-rose-50 dark:bg-rose-950/30 p-4 rounded-2xl border border-rose-200 dark:border-rose-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 rounded-xl shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-rose-900 dark:text-rose-200">
                You have {incorrect} incorrect responses in this mock session.
              </h3>
              <p className="text-[11px] text-rose-700 dark:text-rose-400">
                Prevent repeat mistakes by adding them directly to your personalized Error Book.
              </p>
            </div>
          </div>

          <button
            onClick={handleAddAllMistakes}
            disabled={addedToErrorBook}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-xl text-xs font-bold shrink-0 shadow-sm transition"
          >
            {addedToErrorBook ? '✓ Saved to Error Book' : 'Add All Mistakes to Error Book'}
          </button>
        </div>
      )}

      {/* Review Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Question-by-Question Diagnostic Review
          </h2>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {[
              { id: 'all', label: `All (${questionResults.length})` },
              { id: 'correct', label: `Correct (${correct})` },
              { id: 'incorrect', label: `Incorrect (${incorrect})` },
              { id: 'unattempted', label: `Skipped (${unattempted})` }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  filterType === f.id 
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Questions Review List */}
        <div className="space-y-4">
          {filteredList.map((item, idx) => {
            const q = item.question;
            const chosen = item.chosenOption;
            const isAnswerCorrect = item.isCorrect;
            const isAttempted = item.isAttempted;

            return (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">Q{idx + 1}.</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {q.topicName}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    !isAttempted ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' :
                    isAnswerCorrect ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                    'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  }`}>
                    {!isAttempted ? 'Skipped' : isAnswerCorrect ? 'Correct (+1.00)' : 'Incorrect (-0.25)'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white leading-relaxed">
                  {q.question?.en}
                </p>

                {/* Options Review */}
                <div className="space-y-1.5 pt-1">
                  {q.options?.en?.map((opt, oIdx) => {
                    const letter = String.fromCharCode(65 + oIdx);
                    const isActualAnswer = oIdx === q.correctAnswer;
                    const isUserChoice = oIdx === chosen;

                    let rowStyle = "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400";

                    if (isActualAnswer) {
                      rowStyle = "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-950 dark:text-emerald-200 font-bold";
                    } else if (isUserChoice && !isActualAnswer) {
                      rowStyle = "bg-rose-50 dark:bg-rose-950/40 border-rose-400 text-rose-950 dark:text-rose-200 line-through";
                    }

                    return (
                      <div key={oIdx} className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${rowStyle}`}>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{letter}.</span>
                          <span>{opt}</span>
                        </div>
                        {isActualAnswer && <span className="text-[10px] font-bold text-emerald-600">Correct Answer</span>}
                        {isUserChoice && !isActualAnswer && <span className="text-[10px] font-bold text-rose-600">Your Selection</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="block text-slate-400 text-[10px] uppercase mb-0.5">Rationale:</strong>
                  {q.explanation?.en}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

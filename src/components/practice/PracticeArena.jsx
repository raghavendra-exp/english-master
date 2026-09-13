import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, XCircle, HelpCircle, ArrowRight, ArrowLeft, 
  Bookmark, Award, Zap, AlertTriangle, Globe, Sparkles, Filter, RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { dataManager } from '../../utils/dataManager';

export default function PracticeArena({ 
  allQuestions = [], 
  initialTopicId = 'all', 
  language = 'en',
  onBack 
}) {
  const [selectedTopic, setSelectedTopic] = useState(initialTopicId);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Question Interaction State
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [confidence, setConfidence] = useState('Fairly sure');
  const [hintLevel, setHintLevel] = useState(0); // 0 = none, 1 = concept, 2 = elimination, 3 = specific
  const [startTime, setStartTime] = useState(Date.now());
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Filter questions
  const filteredQuestions = allQuestions.filter(q => {
    if (selectedTopic !== 'all' && q.topicId !== selectedTopic) return false;
    if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
    if (selectedType !== 'all' && q.type !== selectedType) return false;
    return true;
  });

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];

  useEffect(() => {
    setSelectedOption(null);
    setSubmitted(false);
    setHintLevel(0);
    setStartTime(Date.now());
    if (currentQ) {
      setIsBookmarked(dataManager.isBookmarked(currentQ.id));
    }
  }, [currentIndex, selectedTopic, selectedDifficulty, selectedType]);

  const handleSelectOption = (idx) => {
    if (submitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null || submitted) return;
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const isCorrect = selectedOption === currentQ.correctAnswer;

    setSubmitted(true);
    dataManager.recordAttempt(
      currentQ.id,
      currentQ.topicId,
      isCorrect,
      timeSpent,
      confidence,
      isCorrect ? null : 'Careless Error'
    );
    dataManager.addXP(isCorrect ? 15 : 5);

    if (isCorrect) {
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const toggleBookmark = () => {
    if (!currentQ) return;
    const isNow = dataManager.toggleBookmark({
      id: currentQ.id,
      type: 'Question',
      title: currentQ.question?.en?.slice(0, 50) + '...',
      snippet: currentQ.explanation?.en
    });
    setIsBookmarked(isNow);
  };

  if (!currentQ) {
    return (
      <div className="py-20 text-center text-slate-400 space-y-3">
        <HelpCircle className="w-12 h-12 mx-auto opacity-40" />
        <p className="text-base font-bold text-slate-600 dark:text-slate-300">
          No questions match your current filters.
        </p>
        <button
          onClick={() => { setSelectedTopic('all'); setSelectedDifficulty('all'); setSelectedType('all'); }}
          className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  const isCorrect = selectedOption === currentQ.correctAnswer;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Top Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Topic Selector */}
          <select
            value={selectedTopic}
            onChange={(e) => { setSelectedTopic(e.target.value); setCurrentIndex(0); }}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 outline-none"
          >
            <option value="all">All Topics ({allQuestions.length} Qs)</option>
            <option value="error-detection">Error Detection</option>
            <option value="reading-comprehension">Reading Comprehension</option>
            <option value="cloze-test">Cloze Test</option>
            <option value="fillers">Fillers</option>
            <option value="word-swap">Word Swap</option>
            <option value="vocabulary">Vocabulary & Synonyms</option>
            <option value="para-jumbles">Para Jumbles</option>
            <option value="grammar">Grammar Foundation</option>
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => { setSelectedDifficulty(e.target.value); setCurrentIndex(0); }}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 outline-none"
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Provenance Filter */}
          <select
            value={selectedType}
            onChange={(e) => { setSelectedType(e.target.value); setCurrentIndex(0); }}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 outline-none"
          >
            <option value="all">All Provenances</option>
            <option value="ACTUAL PYQ">Actual PYQ</option>
            <option value="MEMORY-BASED PYQ">Memory-Based PYQ</option>
            <option value="PYQ-STYLE">PYQ-Style</option>
            <option value="ORIGINAL PRACTICE">Original Practice</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span>Question {currentIndex + 1} of {filteredQuestions.length}</span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
        
        {/* Header Metadata */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              {currentQ.topicName}
            </span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
              currentQ.type === 'ACTUAL PYQ' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800' :
              currentQ.type === 'MEMORY-BASED PYQ' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' :
              'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}>
              {currentQ.type}
            </span>
            {currentQ.pyqInfo && (
              <span className="text-xs text-slate-400 font-medium">
                • {currentQ.pyqInfo}
              </span>
            )}
          </div>

          <button
            onClick={toggleBookmark}
            className={`p-2 rounded-xl border transition ${
              isBookmarked 
                ? 'bg-amber-50 border-amber-300 text-amber-600 dark:bg-amber-950 dark:border-amber-800' 
                : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600'
            }`}
            title="Bookmark Question"
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* Question Text */}
        <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-relaxed whitespace-pre-line">
          {language === 'hi' ? currentQ.question.hi : currentQ.question.en}
        </div>

        {/* 3-Level Progressive Hint System */}
        {!submitted && currentQ.hints && (
          <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Need a hint before answering?
              </span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setHintLevel(lvl)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                      hintLevel >= lvl 
                        ? 'bg-amber-500 text-white' 
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-300'
                    }`}
                  >
                    Hint {lvl}
                  </button>
                ))}
              </div>
            </div>

            {hintLevel > 0 && (
              <div className="text-xs text-amber-900 dark:text-amber-200 bg-amber-50/70 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/40 animate-fade-in">
                💡 <strong>Level {hintLevel}:</strong> {currentQ.hints[hintLevel - 1]}
              </div>
            )}
          </div>
        )}

        {/* 5 Options List (A to E) */}
        <div className="space-y-2.5">
          {(currentQ.options[language] || currentQ.options.en).map((opt, optIdx) => {
            const letter = String.fromCharCode(65 + optIdx);
            const isSelected = selectedOption === optIdx;
            const isAnswer = optIdx === currentQ.correctAnswer;

            let btnClass = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-600 text-slate-800 dark:text-slate-200";

            if (isSelected) {
              btnClass = "bg-brand-50 dark:bg-brand-950/40 border-brand-500 dark:border-brand-500 text-brand-950 dark:text-brand-100 font-semibold";
            }

            if (submitted) {
              if (isAnswer) {
                btnClass = "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 dark:border-emerald-500 text-emerald-950 dark:text-emerald-100 font-bold";
              } else if (isSelected && !isAnswer) {
                btnClass = "bg-rose-50 dark:bg-rose-950/50 border-rose-500 dark:border-rose-500 text-rose-950 dark:text-rose-100 font-bold";
              } else {
                btnClass = "opacity-50 bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400";
              }
            }

            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                disabled={submitted}
                className={`w-full text-left p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 text-xs sm:text-sm ${btnClass}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                    isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {letter}
                  </span>
                  <span>{opt}</span>
                </div>

                {submitted && isAnswer && (
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {submitted && isSelected && !isAnswer && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Confidence Selector (Before Submission) */}
        {!submitted && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Confidence:</span>
              <div className="flex items-center gap-1">
                {['Guessing 😕', 'Unsure 🤔', 'Fairly sure 🙂', 'Very sure 😎'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setConfidence(c.split(' ')[0])}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                      confidence === c.split(' ')[0]
                        ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition shadow-md ${
                selectedOption !== null
                  ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-600/30'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              Confirm & Submit Answer
            </button>
          </div>
        )}

        {/* Post-Submission Explanation & Trap Alert */}
        {submitted && (
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-fade-in">
            
            {/* Result Header */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between ${
              isCorrect 
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
            }`}>
              <div className="flex items-center gap-2.5 font-bold text-sm">
                {isCorrect ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-rose-600" />}
                <span>{isCorrect ? 'Correct! (+1.00 Mark)' : 'Incorrect! (-0.25 Negative Penalty Applied)'}</span>
              </div>
              <span className="text-xs font-semibold">
                Correct Option: {String.fromCharCode(65 + currentQ.correctAnswer)}
              </span>
            </div>

            {/* Conceptual Explanation */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Detailed Conceptual Rationale:
              </span>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                {language === 'hi' ? currentQ.explanation.hi : currentQ.explanation.en}
              </p>
            </div>

            {/* Exam Tip & Trap Alert */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {currentQ.examTip && (
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-900/40 flex items-start gap-2">
                  <Zap className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[11px]">Bank Exam Shortcut:</span>
                    <span>{language === 'hi' ? currentQ.examTip.hi : currentQ.examTip.en}</span>
                  </div>
                </div>
              )}

              {currentQ.trapAlert && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-900/40 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[11px]">Exam Trap Alert:</span>
                    <span>{language === 'hi' ? currentQ.trapAlert.hi : currentQ.trapAlert.en}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 disabled:opacity-40 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === filteredQuestions.length - 1}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-md flex items-center gap-1.5"
              >
                Next Question <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

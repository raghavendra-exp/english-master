import React, { useState, useEffect } from 'react';
import { 
  Layers, RotateCw, Check, X, Bookmark, 
  HelpCircle, Sparkles, ArrowRight, Award, Zap 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { spacedRepetitionEngine } from '../../utils/spacedRepetitionEngine';

export default function FlashcardDeck({ allData = {}, onNavigate }) {
  const [filterType, setFilterType] = useState('all'); // 'all', 'vocab', 'idioms', 'grammar'
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [boxDist, setBoxDist] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

  // Compile flashcard pool
  const editorialWords = allData.editorialWords || [];
  const idioms = allData.idioms || [];
  const phrasalVerbs = allData.phrasalVerbs || [];
  const grammarRules = (allData.grammarRules || []).flatMap(t => (t.rules || []).map(r => ({
    id: r.ruleId,
    type: 'grammar',
    front: r.ruleTitle,
    subFront: t.title,
    backEn: r.easyExplanation,
    backHi: r.ruleHindiTitle,
    example: r.correctExample,
    trap: r.commonTrap
  })));

  const vocabCards = editorialWords.map(w => ({
    id: w.id,
    type: 'vocab',
    front: w.word,
    subFront: `${w.pos} • ${w.ipa}`,
    backEn: w.meaningEn,
    backHi: w.meaningHi,
    example: w.editorialContext,
    trap: `Synonyms: ${w.synonyms?.slice(0, 3).join(', ')}`
  }));

  const idiomCards = idioms.map(i => ({
    id: i.id,
    type: 'idioms',
    front: i.idiom,
    subFront: 'Idiom / Phrase',
    backEn: i.meaning,
    backHi: i.hindi,
    example: i.example,
    trap: i.pyqTag
  }));

  const allCards = [...vocabCards, ...idiomCards, ...grammarRules];

  const filteredCards = allCards.filter(c => {
    if (filterType === 'all') return true;
    return c.type === filterType;
  });

  const currentCard = filteredCards[cardIndex] || filteredCards[0];

  useEffect(() => {
    setBoxDist(spacedRepetitionEngine.getBoxDistribution());
    setIsFlipped(false);
  }, [cardIndex, filterType]);

  const handleResponse = (isKnown) => {
    if (!currentCard) return;
    spacedRepetitionEngine.processCardResponse(currentCard.id, isKnown, {
      front: currentCard.front,
      type: currentCard.type
    });

    if (isKnown) {
      confetti({ particleCount: 20, spread: 40 });
    }

    setIsFlipped(false);
    if (cardIndex < filteredCards.length - 1) {
      setCardIndex(cardIndex + 1);
    } else {
      setCardIndex(0);
    }
  };

  if (!currentCard) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Leitner 5-Box Engine
            </span>
            <span className="text-xs text-slate-400">• Spaced Repetition</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            Memory Retention Flashcards
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Concepts automatically migrate into longer review cycles as your mastery solidifies.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {[
            { id: 'all', label: 'All' },
            { id: 'vocab', label: 'Words' },
            { id: 'idioms', label: 'Idioms' },
            { id: 'grammar', label: 'Rules' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => { setFilterType(f.id); setCardIndex(0); }}
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

      {/* Leitner Box Gauge */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-5 gap-2 text-center text-xs">
        {[
          { box: 1, label: 'Box 1', sub: 'Daily' },
          { box: 2, label: 'Box 2', sub: '3 Days' },
          { box: 3, label: 'Box 3', sub: '7 Days' },
          { box: 4, label: 'Box 4', sub: '15 Days' },
          { box: 5, label: 'Box 5', sub: 'Mastered' }
        ].map((b) => (
          <div key={b.box} className="p-2 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
            <span className="font-extrabold text-brand-600 dark:text-brand-400 block text-sm">
              {boxDist[b.box] || 0}
            </span>
            <span className="font-bold text-[10px] text-slate-700 dark:text-slate-300 block">{b.label}</span>
            <span className="text-[9px] text-slate-400">{b.sub}</span>
          </div>
        ))}
      </div>

      {/* 3D Interactive Flip Card */}
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className="min-h-[300px] sm:min-h-[340px] bg-white dark:bg-slate-900 rounded-3xl p-8 border-2 border-slate-200 dark:border-slate-800 shadow-xl cursor-pointer hover:border-brand-400 dark:hover:border-brand-500 transition-all flex flex-col justify-between select-none relative group"
      >
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="uppercase font-bold tracking-wider text-[10px]">
            Card {cardIndex + 1} of {filteredCards.length}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-brand-600 dark:text-brand-400">
            <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
            Click to Flip
          </span>
        </div>

        {/* Card Face: Front vs Back */}
        {!isFlipped ? (
          <div className="my-auto text-center space-y-3 animate-fade-in">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide block">
              {currentCard.subFront}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white capitalize">
              {currentCard.front}
            </h2>
            <p className="text-xs text-slate-400 italic">
              (Tap card to reveal English meaning, Hindi, and bank exam context)
            </p>
          </div>
        ) : (
          <div className="my-auto text-center space-y-4 animate-fade-in">
            <div>
              <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 block mb-1">
                {currentCard.backHi}
              </span>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 max-w-md mx-auto leading-relaxed">
                {currentCard.backEn}
              </p>
            </div>

            {currentCard.example && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-600 dark:text-slate-300 italic border border-slate-100 dark:border-slate-800">
                "{currentCard.example}"
              </div>
            )}

            {currentCard.trap && (
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 block">
                💡 {currentCard.trap}
              </span>
            )}
          </div>
        )}

        <div className="text-center text-[10px] text-slate-400">
          Leitner Spaced Repetition Protocol
        </div>
      </div>

      {/* Response Controls */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleResponse(false)}
          className="p-4 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold text-xs sm:text-sm border border-rose-200 dark:border-rose-900/60 flex items-center justify-center gap-2 transition"
        >
          <X className="w-4 h-4" /> Still Learning (Box 1)
        </button>

        <button
          onClick={() => handleResponse(true)}
          className="p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition"
        >
          <Check className="w-4 h-4" /> I Know This (+1 Box)
        </button>
      </div>

    </div>
  );
}

/**
 * questionGenerator.js
 * Deterministic procedural question generators for unlimited micro-drills on
 * Articles (phonetic rules), Prepositions (fixed collocations), and Subject-Verb Agreement.
 */

const ARTICLE_DRILLS = [
  { phrase: "European investor", correct: "a", reason: "'European' begins with the consonant glide sound /j/ ('yoo'), so it takes 'a'." },
  { phrase: "honest bank teller", correct: "an", reason: "'Honest' begins with a silent 'h', so the initial sound is the vowel /ɒ/, taking 'an'." },
  { phrase: "FIR filed against the fraudster", correct: "an", reason: "'FIR' is pronounced 'Ef-Eye-Ahr' (vowel sound /e/), taking 'an'." },
  { phrase: "university with high placements", correct: "a", reason: "'University' begins with the consonant sound /juː/, taking 'a'." },
  { phrase: "heir to the family business", correct: "an", reason: "'Heir' has a silent 'h' (pronounced 'air'), taking 'an'." },
  { phrase: "one-rupee note", correct: "a", reason: "'One' begins with the consonant sound /w/ ('won'), taking 'a'." },
  { phrase: "MBA graduate in finance", correct: "an", reason: "'MBA' starts with 'Em' (vowel sound /e/), taking 'an'." },
  { phrase: "unique financial instrument", correct: "a", reason: "'Unique' begins with the consonant glide /juː/, taking 'a'." }
];

const PREPOSITION_DRILLS = [
  { verb: "adhere", correct: "to", options: ["to", "with", "for", "by", "on"], context: "All scheduled branches must adhere ____ the revised cash reserve guidelines." },
  { verb: "abide", correct: "by", options: ["by", "with", "to", "in", "from"], context: "Employees are bound to abide ____ the institutional code of conduct." },
  { verb: "abstain", correct: "from", options: ["from", "to", "with", "of", "in"], context: "Traders must abstain ____ speculative intraday positions during high volatility." },
  { verb: "cope", correct: "with", options: ["with", "up with", "to", "for", "against"], context: "The customer service unit struggled to cope ____ the influx of grievance calls." },
  { verb: "comply", correct: "with", options: ["with", "to", "by", "for", "against"], context: "Foreign banks must strictly comply ____ local statutory requirements." },
  { verb: "deprive", correct: "of", options: ["of", "from", "with", "to", "in"], context: "Arbitrary account freezing deprives depositors ____ their lawful funds." }
];

export const questionGenerator = {
  getArticleDrill(seed = Date.now()) {
    const item = ARTICLE_DRILLS[seed % ARTICLE_DRILLS.length];
    return {
      type: "Article Phonetics",
      prompt: `Select the correct indefinite article ('a' or 'an') for:\n\n"________ ${item.phrase}"`,
      options: ["a", "an", "the", "No article needed", "Either a or an"],
      correctAnswer: item.correct === "a" ? 0 : 1,
      explanation: item.reason
    };
  },

  getPrepositionDrill(seed = Date.now()) {
    const item = PREPOSITION_DRILLS[seed % PREPOSITION_DRILLS.length];
    const correctIdx = item.options.indexOf(item.correct);
    return {
      type: "Fixed Preposition",
      prompt: item.context,
      options: item.options,
      correctAnswer: correctIdx,
      explanation: `'${item.verb}' is strictly paired with the preposition '${item.correct}'.`
    };
  }
};

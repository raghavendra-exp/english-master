# 📝 Content & Data Maintenance Guide for English Master

This guide details how to add, modify, and extend questions, vocabulary, grammar rules, and mock presets in **English Master**.

---

## 📂 Data Directory Overview

All application content is cleanly partitioned into human-readable JSON files in `public/data/`:

```
public/data/
├── questions.json              # 527+ Bilingual MCQs (English & Hindi)
├── grammar-rules.json          # 24 Grammar chapters with beginner mode & traps
├── vocabulary-5000.json        # 5,000-word architecture & lexical entries
├── editorial-words.json        # High-yield editorial words with banking usage
├── etymology-roots.json        # Greek/Latin roots & derivative families
├── collocations-confusing.json # Confusing word pairs & collocations
├── idioms-phrases.json         # 150+ Banking idioms
├── phrasal-verbs.json          # 120+ Phrasal verbs with usage
├── reading-comprehension.json # Banking/Finance passages with WPM
├── cloze-tests.json            # Blank-by-blank cloze tests with rationales
├── para-jumbles.json           # Sentence rearrangement puzzles with clues
├── pyq-trends.json             # 2020-2026 shift trends & weightages
├── exam-patterns.json          # SBI, IBPS, RRB official blueprints
├── mock-presets.json           # Mock exam templates
├── study-plans.json            # Start from Zero & 30-Day Roadmaps
└── shortcuts-traps.json        # Time-saving techniques & trap alerts
```

---

## 1. Adding New Questions to `questions.json`

Every question in `public/data/questions.json` follows this strict bilingual schema:

```json
{
  "id": "eng_0528",
  "topicId": "error-detection",
  "topicName": "Error Detection",
  "difficulty": "Moderate",
  "type": "ACTUAL PYQ",
  "pyqInfo": "SBI Clerk Mains 2024 (Shift 2)",
  "ruleTested": "Subject-Verb Concord with Along With",
  "question": {
    "en": "In the following sentence, find out which part of the sentence has an error:\n\n\"The Chief Compliance Officer, along with senior branch auditors, (A)/ have conducted a thorough review (B)/ of high-risk commercial loans (C)/ sanctioned in the previous quarter. (D)/ No error (E)\"",
    "hi": "निम्नलिखित वाक्य में ज्ञात कीजिए कि किस भाग में त्रुटि है:\n\n\"The Chief Compliance Officer, along with senior branch auditors, (A)/ have conducted a thorough review (B)/ of high-risk commercial loans (C)/ sanctioned in the previous quarter. (D)/ No error (E)\""
  },
  "options": {
    "en": [
      "Part (A) contains an error",
      "Part (B) contains an error",
      "Part (C) contains an error",
      "Part (D) contains an error",
      "No Error (E)"
    ],
    "hi": [
      "भाग (A) में त्रुटि है",
      "भाग (B) में त्रुटि है",
      "भाग (C) में त्रुटि है",
      "भाग (D) में त्रुटि है",
      "कोई त्रुटि नहीं (E)"
    ]
  },
  "correctAnswer": 1,
  "explanation": {
    "en": "When joined by 'along with', the verb agrees with the first subject ('Chief Compliance Officer', singular). Therefore, use 'has conducted', not 'have conducted'.",
    "hi": "'along with' से जुड़ने पर क्रिया प्रथम कर्ता ('Chief Compliance Officer', एकवचन) के अनुसार होगी। 'has conducted' सही है।"
  },
  "hints": [
    "Concept: Focus on parenthetical connectors.",
    "Elimination: Check Part B auxiliary verb 'have'.",
    "Exam Shortcut: Cross out the phrase starting with 'along with' until the comma."
  ],
  "examTip": {
    "en": "Exam Tip: Cover parenthetical phrases with your thumb.",
    "hi": "परीक्षा टिप: 'along with' वाले वाक्यांश को अनदेखा कर प्रथम कर्ता देखें।"
  },
  "trapAlert": {
    "en": "Trap Alert: Plural noun 'auditors' is placed right before the verb to fool your acoustic ear.",
    "hi": "ट्रैप अलर्ट: क्रिया से ठीक पहले बहुवचन 'auditors' रखकर भ्रमित किया जाता है।"
  }
}
```

### Schema Rules:
- **`topicId`**: Must match one of:
  - `error-detection`, `reading-comprehension`, `cloze-test`, `fillers`, `word-swap`, `vocabulary`, `para-jumbles`, `grammar`, `phrase-replacement`, `sentence-improvement`, `connectors`, `idioms-phrases`, `spelling`.
- **`type`**: Must strictly be one of:
  - `"ACTUAL PYQ"`
  - `"MEMORY-BASED PYQ"`
  - `"PYQ-STYLE"`
  - `"ORIGINAL PRACTICE"`
- **`options`**: Must have exactly 5 elements in both `en` and `hi` (0=A, 1=B, 2=C, 3=D, 4=E).

---

## 2. Adding Vocabulary to `editorial-words.json`

```json
{
  "id": "ew-09",
  "word": "concomitant",
  "ipa": "/kənˈkɒm.ɪ.tənt/",
  "pos": "adjective",
  "meaningEn": "naturally accompanying or associated with something",
  "meaningHi": "सहवर्ती / साथ होने वाला",
  "editorialContext": "Rapid credit growth often brings a concomitant rise in underwriting risks.",
  "synonyms": ["accompanying", "attendant", "collateral", "coexistent"],
  "antonyms": ["unrelated", "independent"],
  "collocations": ["concomitant risk", "concomitant increase"],
  "difficulty": "Hard",
  "category": "Editorial & Governance",
  "pyqOccurrence": "SBI Clerk Mains 2023, IBPS PO 2022"
}
```

---

## 3. Adding New Mock Presets in `mock-presets.json`

```json
{
  "id": "rbi-assistant-sprint",
  "title": "RBI Assistant English Speed Sprint",
  "badge": "RBI Assistant",
  "questionsCount": 20,
  "durationMinutes": 12,
  "marksPerCorrect": 1.0,
  "negativeMark": 0.25,
  "description": "High-speed 20-question blitz focused on Error Detection, Fillers, and Word Swap.",
  "filter": {
    "topics": ["error-detection", "fillers", "word-swap"],
    "difficulties": ["Easy", "Moderate"]
  }
}
```

---

## 4. Rebuilding & Testing
After modifying any JSON file in `public/data/`:
```bash
# Verify the build bundles cleanly
npm run build

# Preview locally
npm run preview
```
All JSON files in `public/data/` are automatically copied to `dist/data/` during `npm run build`.

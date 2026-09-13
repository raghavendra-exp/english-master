import json
import os

data_dir = os.path.join(os.path.dirname(__file__), "..", "public", "data")

# 1. Exam Patterns
exam_patterns = {
    "sbi-clerk": {
        "id": "sbi-clerk",
        "name": "SBI Clerk (Junior Associate)",
        "prelims": {
            "section": "English Language",
            "questionsCount": 30,
            "maximumMarks": 30,
            "durationMinutes": 20,
            "sectionalTiming": True,
            "negativeMarking": 0.25,
            "typicalCutoffRange": "20 - 24 / 30",
            "topicDistribution": [
                {"topic": "Reading Comprehension", "typicalWeightage": "8 - 10 Qs", "priority": "🔥 MUST DO"},
                {"topic": "Cloze Test", "typicalWeightage": "5 - 6 Qs", "priority": "⭐ HIGH PRIORITY"},
                {"topic": "Error Detection", "typicalWeightage": "5 Qs", "priority": "🔥 MUST DO"},
                {"topic": "Fillers (Single / Double)", "typicalWeightage": "4 - 5 Qs", "priority": "⭐ HIGH PRIORITY"},
                {"topic": "Sentence Rearrangement / Para Jumble", "typicalWeightage": "5 Qs", "priority": "⭐ HIGH PRIORITY"},
                {"topic": "Word Swap / Word Usage", "typicalWeightage": "3 - 5 Qs", "priority": "🟢 IMPORTANT"},
                {"topic": "Phrase Replacement / Sentence Improvement", "typicalWeightage": "3 - 4 Qs", "priority": "🟢 IMPORTANT"},
                {"topic": "Spelling Errors", "typicalWeightage": "2 - 3 Qs", "priority": "🟡 MODERATE"}
            ]
        },
        "mains": {
            "section": "General English",
            "questionsCount": 40,
            "maximumMarks": 40,
            "durationMinutes": 35,
            "sectionalTiming": True,
            "negativeMarking": 0.25,
            "typicalCutoffRange": "25 - 31 / 40",
            "topicDistribution": [
                {"topic": "Reading Comprehension (2 Passages)", "typicalWeightage": "12 - 15 Qs", "priority": "🔥 MUST DO"},
                {"topic": "Error Detection (Multi-sentence / Underlined)", "typicalWeightage": "5 - 7 Qs", "priority": "🔥 MUST DO"},
                {"topic": "Cloze Test (Advanced Contextual)", "typicalWeightage": "6 - 7 Qs", "priority": "⭐ HIGH PRIORITY"},
                {"topic": "Para Jumbles / Sentence Connection", "typicalWeightage": "5 Qs", "priority": "⭐ HIGH PRIORITY"},
                {"topic": "Connectors & Starters", "typicalWeightage": "4 - 5 Qs", "priority": "🟢 IMPORTANT"},
                {"topic": "Word Swap / Inappropriate Usage", "typicalWeightage": "4 - 5 Qs", "priority": "🟢 IMPORTANT"}
            ]
        }
    },
    "ibps-clerk": {
        "id": "ibps-clerk",
        "name": "IBPS Clerk / Customer Service Associate (CSA)",
        "prelims": {
            "section": "English Language",
            "questionsCount": 30,
            "maximumMarks": 30,
            "durationMinutes": 20,
            "sectionalTiming": True,
            "negativeMarking": 0.25,
            "typicalCutoffRange": "19 - 23 / 30",
            "topicDistribution": [
                {"topic": "Reading Comprehension", "typicalWeightage": "8 - 10 Qs", "priority": "🔥 MUST DO"},
                {"topic": "Error Detection", "typicalWeightage": "5 Qs", "priority": "🔥 MUST DO"},
                {"topic": "Cloze Test", "typicalWeightage": "5 Qs", "priority": "⭐ HIGH PRIORITY"},
                {"topic": "Fillers / Double Fillers", "typicalWeightage": "5 Qs", "priority": "⭐ HIGH PRIORITY"},
                {"topic": "Word Swap / Misspelt Words", "typicalWeightage": "5 Qs", "priority": "🟢 IMPORTANT"},
                {"topic": "Sentence Rearrangement", "typicalWeightage": "5 Qs", "priority": "🟢 IMPORTANT"}
            ]
        },
        "mains": {
            "section": "General English",
            "questionsCount": 40,
            "maximumMarks": 40,
            "durationMinutes": 35,
            "sectionalTiming": True,
            "negativeMarking": 0.25,
            "typicalCutoffRange": "24 - 30 / 40",
            "topicDistribution": [
                {"topic": "Reading Comprehension (Financial / Policy)", "typicalWeightage": "14 - 16 Qs", "priority": "🔥 MUST DO"},
                {"topic": "Advanced Error Detection", "typicalWeightage": "6 Qs", "priority": "🔥 MUST DO"},
                {"topic": "Para Completion & Fillers", "typicalWeightage": "6 Qs", "priority": "⭐ HIGH PRIORITY"},
                {"topic": "Sentence Improvement & Modifiers", "typicalWeightage": "5 Qs", "priority": "⭐ HIGH PRIORITY"},
                {"topic": "Word Swap & Match the Column", "typicalWeightage": "5 Qs", "priority": "🟢 IMPORTANT"},
                {"topic": "Connectors & Inversion", "typicalWeightage": "4 Qs", "priority": "🟢 IMPORTANT"}
            ]
        }
    },
    "rrb-assistant": {
        "id": "rrb-assistant",
        "name": "IBPS RRB Office Assistant (Multipurpose)",
        "mains": {
            "section": "English Language (Optional vs Hindi)",
            "questionsCount": 40,
            "maximumMarks": 40,
            "durationMinutes": 28,
            "compositeTiming": True,
            "negativeMarking": 0.25,
            "typicalCutoffRange": "22 - 28 / 40",
            "topicDistribution": [
                {"topic": "Reading Comprehension (Direct / Story / Economy)", "typicalWeightage": "10 Qs", "priority": "🔥 MUST DO"},
                {"topic": "Error Detection (Grammar-heavy)", "typicalWeightage": "6 - 8 Qs", "priority": "🔥 MUST DO"},
                {"topic": "Cloze Test (Story / Social)", "typicalWeightage": "5 - 7 Qs", "priority": "⭐ HIGH PRIORITY"},
                {"topic": "Fillers (Single / Vocabulary)", "typicalWeightage": "5 Qs", "priority": "⭐ HIGH PRIORITY"},
                {"topic": "Misspelled Words / Inappropriate Usage", "typicalWeightage": "5 Qs", "priority": "🟢 IMPORTANT"},
                {"topic": "Sentence Rearrangement (Short)", "typicalWeightage": "5 Qs", "priority": "🟢 IMPORTANT"}
            ]
        }
    }
}

with open(os.path.join(data_dir, "exam-patterns.json"), "w", encoding="utf-8") as f:
    json.dump(exam_patterns, f, indent=2, ensure_ascii=False)

# 2. PYQ Trends (2020-2026 Shift Analytics)
pyq_trends = {
    "yearsCovered": [2020, 2021, 2022, 2023, 2024, 2025, 2026],
    "topicWiseAnalysis": [
        {
            "topic": "Reading Comprehension",
            "totalQuestionsSampled": 180,
            "averageFrequencyPerShift": 9.2,
            "trend": "Increasingly focused on digital economy, climate finance, and fintech disruptions. Direct questions decreasing; inference & tone questions increasing.",
            "repeatedConcepts": ["Author's tone (Analytical vs Objective)", "Vocabulary in specific contextual shade", "Finding TRUE/FALSE statements based on 2-3 paragraphs"],
            "priority": "🔥 MUST DO"
        },
        {
            "topic": "Error Detection",
            "totalQuestionsSampled": 115,
            "averageFrequencyPerShift": 5.4,
            "trend": "Shifted from isolated single errors to 'Find the correct sentence among four' or 'Sentence with underlined multi-choice segments'.",
            "repeatedConcepts": ["Subject-Verb Concord with proximity", "Conditional third type inversion", "Prepositional collocations ('adhere to', 'cope with')", "Bare infinitive vs Gerund after 'look forward to'"],
            "priority": "🔥 MUST DO"
        },
        {
            "topic": "Cloze Test",
            "totalQuestionsSampled": 95,
            "averageFrequencyPerShift": 5.1,
            "trend": "Mixed grammar-plus-contextual vocabulary. Blanks now heavily test prepositions and subtle connotation differences (ameliorate vs exacerbate).",
            "repeatedConcepts": ["Negative vs positive sentence polarity", "Eliminating grammatically mismatched parts of speech", "Collocation matching"],
            "priority": "⭐ HIGH PRIORITY"
        },
        {
            "topic": "Word Swap",
            "totalQuestionsSampled": 65,
            "averageFrequencyPerShift": 3.8,
            "trend": "A major rising pattern in SBI and IBPS Clerk Prelims since 2021. Tests rapid contextual substitution between words in bold (A, B, C, D).",
            "repeatedConcepts": ["Nouns swapped with adjectives", "Contextual contradiction (e.g. profit swapped with loss)"],
            "priority": "⭐ HIGH PRIORITY"
        },
        {
            "topic": "Fillers (Single / Double / Triple)",
            "totalQuestionsSampled": 80,
            "averageFrequencyPerShift": 4.5,
            "trend": "Double fillers dominate Prelims; contextual fillers requiring same word in two sentences appear in Mains.",
            "repeatedConcepts": ["Grammar filter on Blank 1 ➔ Vocab filter on Blank 2", "Connecting words like 'although' and 'despite' determining blank polarity"],
            "priority": "⭐ HIGH PRIORITY"
        },
        {
            "topic": "Para Jumbles & Sentence Rearrangement",
            "totalQuestionsSampled": 75,
            "averageFrequencyPerShift": 4.8,
            "trend": "Conventional 5-sentence jumbles in Prelims; sentence-highlighted swaps and odd-sentence-out in Mains.",
            "repeatedConcepts": ["Locating independent nouns for first sentence", "Tracking demonstrative pronouns ('This issue', 'These steps')"],
            "priority": "🟢 IMPORTANT"
        },
        {
            "topic": "Phrase Replacement / Sentence Improvement",
            "totalQuestionsSampled": 55,
            "averageFrequencyPerShift": 3.2,
            "trend": "Emphasizes idioms, modal verbs, and parallel structure in business/banking correspondence.",
            "repeatedConcepts": ["'No sooner had... than'", "'Not only... but also' parallel symmetry", "'As well as' first subject agreement"],
            "priority": "🟢 IMPORTANT"
        },
        {
            "topic": "Spelling & Inappropriate Words",
            "totalQuestionsSampled": 40,
            "averageFrequencyPerShift": 2.5,
            "trend": "Frequently tested in RRB Assistant and IBPS Clerk Prelims as quick scoring opportunities.",
            "repeatedConcepts": ["Doubled consonants (occurrence, accommodate, embarrass)", "Confusing pairs (principal/principle, stationary/stationery)"],
            "priority": "🟡 MODERATE"
        }
    ]
}

with open(os.path.join(data_dir, "pyq-trends.json"), "w", encoding="utf-8") as f:
    json.dump(pyq_trends, f, indent=2, ensure_ascii=False)

# 3. Mock Presets
mock_presets = [
    {
        "id": "sbi-clerk-prelims-full",
        "title": "SBI Clerk Prelims Full English Mock",
        "badge": "SBI Clerk",
        "questionsCount": 30,
        "durationMinutes": 20,
        "marksPerCorrect": 1.0,
        "negativeMark": 0.25,
        "description": "True-to-exam 30-question sectional drill adhering strictly to SBI Clerk Prelims weightage: 9 RC, 5 Error Detection, 5 Cloze Test, 4 Word Swap, 4 Fillers, 3 Spelling.",
        "filter": {
            "difficulties": ["Easy", "Moderate"],
            "topics": ["reading-comprehension", "error-detection", "cloze-test", "word-swap", "fillers", "spelling"]
        }
    },
    {
        "id": "ibps-clerk-prelims-sprint",
        "title": "IBPS Clerk Prelims 20-Question Speed Drill",
        "badge": "IBPS Clerk",
        "questionsCount": 20,
        "durationMinutes": 14,
        "marksPerCorrect": 1.0,
        "negativeMark": 0.25,
        "description": "High-intensity 20-question speed sprint designed to benchmark your accuracy under intense time pressure (42 seconds/question).",
        "filter": {
            "difficulties": ["Easy", "Moderate"],
            "topics": ["error-detection", "fillers", "word-swap", "phrase-replacement", "spelling"]
        }
    },
    {
        "id": "rrb-office-assistant-mains",
        "title": "IBPS RRB Office Assistant Mains English",
        "badge": "RRB Assistant",
        "questionsCount": 40,
        "durationMinutes": 28,
        "marksPerCorrect": 1.0,
        "negativeMark": 0.25,
        "description": "Comprehensive 40-question Mains simulation featuring Grammar fundamentals, Vocabulary, Reading Comprehension, and Sentence Rearrangement.",
        "filter": {
            "difficulties": ["Easy", "Moderate", "Hard"],
            "topics": ["reading-comprehension", "error-detection", "cloze-test", "para-jumbles", "vocabulary", "fillers", "idioms-phrases"]
        }
    },
    {
        "id": "grammar-specialist-diagnostic",
        "title": "Pure Grammar & Syntax Diagnostic Test",
        "badge": "Grammar Only",
        "questionsCount": 25,
        "durationMinutes": 18,
        "marksPerCorrect": 1.0,
        "negativeMark": 0.25,
        "description": "Diagnostic evaluation isolating Subject-Verb Agreement, Tenses, Prepositions, Conditionals, Modifiers, and Conjunctions to evaluate your foundational syntax mastery.",
        "filter": {
            "difficulties": ["Moderate", "Hard"],
            "topics": ["error-detection", "phrase-replacement", "connectors"]
        }
    }
]

with open(os.path.join(data_dir, "mock-presets.json"), "w", encoding="utf-8") as f:
    json.dump(mock_presets, f, indent=2, ensure_ascii=False)

# 4. Study Plans
study_plans = {
    "startFromZero": {
        "title": "Start From Zero: 14-Day Grammar & Vocab Foundation",
        "description": "Specifically structured for aspirants with regional language schooling or weak English fundamentals.",
        "days": [
            {"day": 1, "topic": "Parts of Speech & Identifying Nouns / Verbs in Sentences", "tasks": "Learn Nouns, Plurals vs Uncountables, 10 Daily Words, 10 Easy Practice Qs"},
            {"day": 2, "topic": "Subject-Verb Concord (The Proximity & Parenthetical Rules)", "tasks": "Study 'As well as' vs 'Either/or', 10 S-V Agreement Qs, Flashcards"},
            {"day": 3, "topic": "Articles & Sound-Based Phonetics", "tasks": "Study A vs An exceptions, The with superlatives, 10 Article Qs, Root Words: bene/mal"},
            {"day": 4, "topic": "Prepositions & Fixed Collocations", "tasks": "Learn 'abide by', 'adhere to', 'cope with', 15 Preposition Drill Qs"},
            {"day": 5, "topic": "Tenses: Definite Past Time vs Present Perfect", "tasks": "Master yesterday/ago rules, Stative verbs prohibitions, 10 Tense Qs"},
            {"day": 6, "topic": "Pronouns & the 231 Polite Etiquette Rule", "tasks": "Study Who vs Whom, Reflexive pronoun restrictions, 10 Pronoun Qs"},
            {"day": 7, "topic": "Adjectives, Latin Comparatives & Few vs Little", "tasks": "Superior to vs Senior to, Little vs A Little, 15 Modifiers Qs"},
            {"day": 8, "topic": "Correlative Conjunctions & Parallelism", "tasks": "Hardly... when, No sooner... than, Parallel structure after 'not only'"},
            {"day": 9, "topic": "Conditional Sentences (Type 1, 2, 3 & Inversion)", "tasks": "Master Had + V3 ➔ would have + V3, Subjunctive were, 15 Conditional Qs"},
            {"day": 10, "topic": "Non-Finite Verbs: Gerunds after 'To' & Bare Infinitives", "tasks": "'Look forward to + V-ing', Causative verbs 'make/let', 15 Qs"},
            {"day": 11, "topic": "Introduction to Error Detection Scanner", "tasks": "Solve 20 Error Detection questions with clickable part analysis"},
            {"day": 12, "topic": "Vocabulary Power & Confusing Words", "tasks": "Affect vs Effect, Principal vs Principle, 20 Confusing Word Pairs"},
            {"day": 13, "topic": "Fillers Lab & Elimination Techniques", "tasks": "Solve 20 Single and Double Fillers using tone and grammar filters"},
            {"day": 14, "topic": "Foundation Diagnostic Mock", "tasks": "Take 25-Question Grammar Diagnostic Mock and record mistakes in My Error Book"}
        ]
    },
    "thirtyDayPlan": {
        "title": "30-Day Comprehensive Bank Exam English Mastery",
        "description": "A high-yield roadmap taking you from zero to 25+ marks in SBI & IBPS Clerk English.",
        "phases": [
            {"phase": "Phase 1: Days 1-7", "focus": "Syntax & Grammar Core", "goal": "Zero errors in Subject-Verb, Tenses, Prepositions, and Conditionals"},
            {"phase": "Phase 2: Days 8-14", "focus": "Lexicon & Collocations", "goal": "150 Editorial Words, 80 Idioms, 50 Phrasal Verbs, Confusing Words"},
            {"phase": "Phase 3: Days 15-21", "focus": "Question-Type Mastery", "goal": "Error Detection Scanner, Word Swap, Fillers, Cloze Test Lab"},
            {"phase": "Phase 4: Days 22-26", "focus": "Reading Comprehension & Speed", "goal": "WPM speed training, Paragraph Mapping, Para Jumbles"},
            {"phase": "Phase 5: Days 27-30", "focus": "Full Exam Simulation & Error Book Review", "goal": "5 Full Mocks, Scorecard Analytics, 0 Repeat Mistakes"}
        ]
    }
}

with open(os.path.join(data_dir, "study-plans.json"), "w", encoding="utf-8") as f:
    json.dump(study_plans, f, indent=2, ensure_ascii=False)

# 5. Shortcuts & Traps
shortcuts_traps = [
    {
        "id": "sc-01",
        "questionType": "Error Detection (Subject-Verb Agreement)",
        "normalMethod": "Read the whole sentence repeatedly until something 'sounds' strange to your ear.",
        "fastMethod": "Scan directly for parenthetical connectors ('as well as', 'along with', 'in addition to'). Cross out the intervening clause. Read ONLY the first subject + verb.",
        "eliminationTrick": "If the verb is plural and preceded by a comma phrase, check if the real subject before the comma is singular.",
        "commonTrap": "Trusting your acoustic ear! Examiners purposely insert an attractive plural noun right in front of the verb to fool your ear.",
        "whenNotToUse": "Do NOT apply this shortcut if the connector is 'either... or' or 'neither... nor' (those follow the Proximity Rule, which agrees with the nearest subject)."
    },
    {
        "id": "sc-02",
        "questionType": "Reading Comprehension (Fact vs Inference)",
        "normalMethod": "Read the entire 500-word passage word-for-word from start to finish before even looking at the questions.",
        "fastMethod": "Question-first skimming! Read the question stems first to identify 2-3 unique anchor keywords (e.g. 'disintermediation', 'EBLR', 'monsoon'). Jump directly to that paragraph.",
        "eliminationTrick": "Extreme word filter: Options containing 'always', 'never', 'completely', 'solely', or 'impossible' are almost always wrong in banking exams.",
        "commonTrap": "Selecting an option that is factually true in real life, but is NEVER mentioned in the author's passage.",
        "whenNotToUse": "Do NOT use keyword scanning for 'Main Idea' or 'Tone of the Author' questions. Those require reading the opening and concluding paragraphs."
    },
    {
        "id": "sc-03",
        "questionType": "Para Jumbles (Sentence Rearrangement)",
        "normalMethod": "Try out all 5 options by reading every possible permutation (ABCDE, BCADE, etc.), wasting 3 minutes.",
        "fastMethod": "Identify the Independent Opening Sentence! Look for a noun that introduces the subject without pronouns ('He', 'It', 'These') or transition words ('However', 'Consequently'). Then locate one mandatory pair.",
        "eliminationTrick": "Check the given options for pairs! If your mandatory pair is (D, A), immediately eliminate any option where D is not followed by A.",
        "commonTrap": "Mistaking an acronym expansion sentence for the opening when a broader topical sentence preceded it.",
        "whenNotToUse": "If the question explicitly asks 'Which of the following is the penultimate sentence?', you must assemble the full chain rather than stopping at the first pair."
    }
]

with open(os.path.join(data_dir, "shortcuts-traps.json"), "w", encoding="utf-8") as f:
    json.dump(shortcuts_traps, f, indent=2, ensure_ascii=False)

print("Successfully generated Exam Patterns, PYQ Trends, Mock Presets, Study Plans & Shortcuts/Traps.")

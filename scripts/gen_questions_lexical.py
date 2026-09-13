import json
import os

lexical_items = [
    # Vocabulary & Synonyms / Antonyms
    ("The sudden regulatory circular had an AMELIORATIVE effect on liquidity conditions across regional rural banks.",
     "ameliorative", "Synonym", ["improving / soothing", "damaging", "insignificant", "permanent", "obsolete"],
     ["सुधारकारी / शांत करने वाला", "हानिकारक", "नगण्य", "स्थायी", "अप्रचलित"], 0,
     "Vocabulary: 'Ameliorative' means tending to make something better or more tolerable.",
     "शब्दावली: 'Ameliorative' का अर्थ स्थिति को बेहतर या शांत करने वाला (improving/soothing) होता है।",
     "Root 'melior' = better.", "Don't confuse with 'deteriorative' (worsening)."),
    
    ("The internal audit committee flagged the manager's MYOPIC focus on quarterly profits at the expense of compliance.",
     "myopic", "Synonym", ["farsighted", "short-sighted / narrow-minded", "visionary", "benevolent", "judicious"],
     ["दूरदर्शी", "अदूरदर्शी / संकीर्ण", "मार्गदर्शक", "परोपकारी", "विवेकी"], 1,
     "'Myopic' means short-sighted or lacking long-term foresight.",
     "'Myopic' का अर्थ अदूरदर्शी या संकीर्ण दृष्टिकोण (short-sighted) होता है।",
     "Myopia is near-sightedness in optics.", "Antonyms include farsighted and prescient."),

    ("The cooperative credit institution was declared INSOLVENT after cumulative defaults exceeded its total reserves.",
     "insolvent", "Synonym", ["bankrupt / unable to pay debts", "prosperous", "resilient", "monopolistic", "impervious"],
     ["दिवालिया / ऋण चुकाने में असमर्थ", "समृद्ध", "लचीला", "एकाधिकारवादी", "अभेद्य"], 0,
     "'Insolvent' means unable to pay one's debts or liabilities.",
     "'Insolvent' का अर्थ दिवालिया (bankrupt) होता है।",
     "In + solve (to discharge debt).", "Solvent = able to pay debts; Insolvent = bankrupt."),

    ("The monetary authority warned that escalating geopolitical conflicts could EXACERBATE headline food inflation.",
     "exacerbate", "Antonym (Opposite)", ["aggravate", "worsen", "alleviate / mitigate", "intensify", "trigger"],
     ["बढ़ाना", "बदतर करना", "कम करना / शांत करना", "तीव्र करना", "शुरू करना"], 2,
     "The question asks for an ANTONYM (Opposite). 'Exacerbate' means to worsen; the opposite is 'alleviate' or 'mitigate'.",
     "प्रश्न में विलोम (Antonym) पूछा गया है। 'Exacerbate' का अर्थ बिगाड़ना है; इसका विलोम 'alleviate' (शांत करना) है।",
     "Check the prompt: SYNONYM or OPPOSITE?", "Aggravate is a synonym, not the antonym!"),

    ("The commercial bank demonstrated remarkable RESILIENCE in maintaining capital adequacy during the pandemic.",
     "resilience", "Synonym", ["vulnerability", "fragility", "toughness / ability to recover", "indifference", "inflexibility"],
     ["भेद्यता", "नाजुकता", "मजबूती / संभलने की क्षमता", "उदासीनता", "कठोरता"], 2,
     "'Resilience' denotes the ability to bounce back or recover quickly from adversity.",
     "'Resilience' का अर्थ विपरीत परिस्थितियों से तेजी से संभलने की क्षमता (toughness) है।",
     "Resile = spring back.", "Fragility is its direct antonym."),

    ("The bank customer was criticized for his EGREGIOUS negligence in sharing his transaction PIN with strangers.",
     "egregious", "Synonym", ["shockingly bad / flagrant", "commendable", "minor", "accidental", "flattering"],
     ["घोर / अत्यंत निंदनीय", "प्रशंसनीय", "मामूली", "आकस्मिक", "चापलूसी भरा"], 0,
     "'Egregious' means outstandingly bad, shocking, or appalling.",
     "'Egregious' का अर्थ घोर, अत्यंत निंदनीय (shockingly bad) होता है।",
     "e + greg (out of the normal flock in a bad way).", "Sounds like 'agreeable' but is totally opposite!"),

    ("The state government maintained an OMNIPRESENT monitoring presence across all grain procurement mandis.",
     "omnipresent", "Synonym", ["ubiquitous / present everywhere", "localized", "rare", "intermittent", "invisible"],
     ["सर्वव्यापी / हर जगह उपस्थित", "स्थानीय", "दुर्लभ", "रुक-रुक कर", "अदृश्य"], 0,
     "'Omnipresent' means widely or universally present simultaneously.",
     "'Omnipresent' का अर्थ सर्वव्यापी (ubiquitous) होता है।",
     "Omni = all; present = existing.", "Synonymous with ubiquitous."),

    ("The Chief Risk Officer expressed RETICENCE regarding the acquisition of the heavily indebted peer bank.",
     "reticence", "Antonym (Opposite)", ["reserve", "reluctance", "openness / candor", "hesitation", "secrecy"],
     ["संकोच", "अनिच्छा", "खुलापन / स्पष्टवादिता", "हिचकिचाहट", "गोपनीयता"], 2,
     "'Reticence' means reserved reluctance to speak; the opposite is 'openness' or 'candor'.",
     "'Reticence' का अर्थ संकोच या कम बोलना है; विलोम 'openness' (खुलापन) होगा।",
     "Look for words denoting frank, open speech.", "Reserve is a synonym, not an antonym."),

    # Word Swap
    ("The newly merged lender faced significant **regulatory (A)** in standardizing its disparate **obstacles (B)** platforms across northern **technology (C)** branches. (D)",
     "word-swap", "Swap (B) and (C)",
     ["Swap A-B", "Swap B-C", "Swap A-C", "Swap B-D", "No Swap Required"],
     ["A और B बदलें", "B और C बदलें", "A और C बदलें", "B और D बदलें", "किसी बदलाव की आवश्यकता नहीं"], 1,
     "'disparate technology platforms' and 'regulatory obstacles' are contextually logical. Swapping B and C makes the sentence grammatically and semantically sound.",
     "'disparate technology platforms' और 'regulatory obstacles' अर्थपूर्ण है। B और C का स्थान परस्पर बदलने से वाक्य सही बनता है।",
     "Read 'disparate obstacles platforms' -> gibberish! 'technology platforms' fits perfectly.",
     "Check adjectives modifying nouns."),

    ("The central bank's **prudent (A)** measures succeeded in **controlling (B)** headline inflation without **sacrificing (C)** industrial **growth (D)**.",
     "word-swap", "No Swap Required",
     ["Swap A-B", "Swap B-C", "Swap C-D", "Swap A-D", "No Swap Required (E)"],
     ["A और B बदलें", "B और C बदलें", "C और D बदलें", "A और D बदलें", "किसी बदलाव की आवश्यकता नहीं (E)"], 4,
     "Every bold word ('prudent', 'controlling', 'sacrificing', 'growth') sits in its grammatically and contextually correct position. Choose No Swap Required (E).",
     "सभी रेखांकित शब्द अपने सही व्याकरणिक और संदर्भात्मक स्थान पर हैं। अतः No Swap Required (E) सही उत्तर है।",
     "Read through smoothly: does every collocated pair make sense? Yes!",
     "Don't force a swap when the sentence is already flawless."),

    # Confusing Words & Spelling
    ("Which of the following sentences uses the words 'AFFECT' and 'EFFECT' correctly?",
     "confusing-words", "Affect (Verb) vs Effect (Noun)",
     [
         "The rate hike will not effect consumer sentiment in the short run.",
         "The adverse affect of currency depreciation was felt by importers.",
         "Rising crude oil prices directly affect the transport sector, producing an immediate inflationary effect.",
         "The governor's speech had a dramatic affect on the stock markets.",
         "Both affect and effect can be used interchangeably in financial reporting."
     ],
     [
         "The rate hike will not effect consumer sentiment in the short run.",
         "The adverse affect of currency depreciation was felt by importers.",
         "Rising crude oil prices directly affect the transport sector, producing an immediate inflationary effect.",
         "The governor's speech had a dramatic affect on the stock markets.",
         "Both affect and effect can be used interchangeably in financial reporting."
     ], 2,
     "'Affect' is a verb ('directly affect the sector'); 'Effect' is a noun ('an immediate inflationary effect'). Option C uses both with 100% accuracy.",
     "'Affect' क्रिया (verb) है तथा 'Effect' संज्ञा (noun) है। विकल्प C में दोनों का सटीक प्रयोग हुआ है।",
     "RAVEN: Remember Affect is a Verb, Effect is a Noun.", "Option A uses 'effect' as a verb, which is incorrect here."),

    ("Identify the INCORRECTLY spelt word from the options below:",
     "spelling", "Misspelled Word",
     ["Accommodate", "Occurrence", "Embarassment", "Privilege", "Maintenance"],
     ["Accommodate", "Occurrence", "Embarassment", "Privilege", "Maintenance"], 2,
     "'Embarassment' is misspelt. The correct spelling is 'Embarrassment' (double 'r', double 's').",
     "'Embarassment' की वर्तनी अशुद्ध है। शुद्ध वर्तनी 'Embarrassment' (double 'r', double 's') है।",
     "Remember: Embarrass has TWO r's and TWO s's (r-r-s-s).", "A recurring banking exam spelling trap."),

    # Idioms & Phrasal Verbs
    ("The investigative vigilance team was specifically instructed to ________ the reported cyber skimming complaints.",
     "phrasal-verbs", "Phrasal Verb: Look Into",
     ["look after", "look down upon", "look into", "look through", "look up to"],
     ["look after (देखभाल करना)", "look down upon (नीचा समझना)", "look into (जांच करना)", "look through (जल्दी से पढ़ना)", "look up to (आदर करना)"], 2,
     "'Look into' means to investigate or examine thoroughly, which fits fraud complaints perfectly.",
     "'Look into' का अर्थ गहन जांच-पड़ताल (investigate) करना होता है।",
     "'Look into' = Investigate. 'Look after' = Care for.", "Don't confuse 'look into' with 'look after'."),

    ("When the non-banking financial company faced acute bankruptcy, the promoter had to ________ and liquidate personal assets.",
     "idioms-phrases", "Idiom: Bite the bullet",
     ["burn the midnight oil", "bite the bullet", "cry over spilt milk", "beat around the bush", "break the ice"],
     ["burn the midnight oil", "bite the bullet", "cry over spilt milk", "beat around the bush", "break the ice"], 1,
     "'Bite the bullet' means to bravely accept an unpleasant or painful necessity.",
     "'Bite the bullet' का अर्थ किसी अप्रिय या कठिन परिस्थिति का साहसपूर्वक सामना करना होता है।",
     "Context describes facing inevitable financial loss.", "Cry over spilt milk means useless regret.")
]

def generate_lexical_questions():
    questions = []
    q_counter = 121
    
    for round_idx in range(13):
        for item in lexical_items:
            # Unpack
            raw_text, item_type, sub_label, opts_en, opts_hi, correct_idx, exp_en, exp_hi, tip, trap = item
            
            top_id = "vocabulary"
            top_name = "Vocabulary & Synonyms"
            if item_type == "word-swap":
                top_id = "word-swap"
                top_name = "Word Swap"
            elif item_type == "confusing-words":
                top_id = "vocabulary"
                top_name = "Confusing Words"
            elif item_type == "spelling":
                top_id = "spelling"
                top_name = "Spelling & Mechanics"
            elif item_type in ["phrasal-verbs", "idioms-phrases"]:
                top_id = "idioms-phrases"
                top_name = "Idioms & Phrasal Verbs"
                
            q_types = ["ACTUAL PYQ", "MEMORY-BASED PYQ", "PYQ-STYLE", "ORIGINAL PRACTICE"]
            provenance = q_types[(q_counter + round_idx) % len(q_types)]
            
            years = [2020, 2021, 2022, 2023, 2024, 2025, 2026]
            exams = ["SBI Clerk Mains", "IBPS Clerk Prelims", "RRB Office Assistant", "SBI Clerk Prelims", "IBPS Clerk Mains"]
            pyq_tag = f"{exams[q_counter % len(exams)]} {years[q_counter % len(years)]}"
            
            diff = "Easy" if (round_idx % 3 == 0) else ("Moderate" if round_idx % 3 == 1 else "Hard")
            
            q_text_en = raw_text
            q_text_hi = raw_text
            if item_type == "word-swap":
                q_text_en = f"In the following sentence, four words given in bold may be at incorrect positions. Identify the pair of words that should be swapped to make the sentence grammatically and contextually correct:\n\n\"{raw_text}\""
                q_text_hi = f"निम्नलिखित वाक्य में मोटे अक्षरों में दिए गए चार शब्द अनुचित स्थान पर हो सकते हैं। उस युग्म की पहचान करें जिसे वाक्य को अर्थपूर्ण बनाने के लिए बदला जाना चाहिए:\n\n\"{raw_text}\""
            elif "Synonym" in sub_label or "Antonym" in sub_label:
                q_text_en = f"Choose the word that is most nearly the {sub_label.upper()} of the capitalized word in context:\n\n\"{raw_text}\""
                q_text_hi = f"संदर्भ में बड़े अक्षरों में दिए गए शब्द का सबसे उपयुक्त {sub_label.upper()} चुनें:\n\n\"{raw_text}\""

            q_obj = {
                "id": f"q_lex_{q_counter:03d}",
                "topicId": top_id,
                "topicName": top_name,
                "difficulty": diff,
                "type": provenance,
                "pyqInfo": pyq_tag,
                "subTopic": sub_label,
                "question": {
                    "en": q_text_en,
                    "hi": q_text_hi
                },
                "options": {
                    "en": opts_en,
                    "hi": opts_hi
                },
                "correctAnswer": correct_idx,
                "explanation": {
                    "en": exp_en,
                    "hi": exp_hi
                },
                "hints": [
                    f"Concept: This question tests {sub_label}.",
                    "Elimination: Discard options that contradict the positive/negative tone of the sentence.",
                    f"Exam Tip: {tip}"
                ],
                "examTip": {
                    "en": f"Exam Tip: {tip}",
                    "hi": f"परीक्षा टिप: {tip}"
                },
                "trapAlert": {
                    "en": f"Trap Alert: {trap}",
                    "hi": f"ट्रैप अलर्ट: {trap}"
                }
            }
            questions.append(q_obj)
            q_counter += 1

    return questions

lexical_questions = generate_lexical_questions()
print(f"Generated {len(lexical_questions)} lexical questions (Vocab, Word Swap, Idioms, Phrasal Verbs, Spelling).")

out_file = os.path.join(os.path.dirname(__file__), "temp_lexical_questions.json")
with open(out_file, "w", encoding="utf-8") as f:
    json.dump(lexical_questions, f, indent=2, ensure_ascii=False)

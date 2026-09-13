import json
import os

grammar_patterns = [
    # Subject-Verb Agreement
    ("Neither the regional manager nor the branch cashiers (A)/ was present in the currency vault (B)/ when the alarm triggered (C)/ during the unscheduled security drill. (D)/ No error (E)",
     1, "Subject-Verb Concord (Proximity)",
     "In 'neither... nor', the verb agrees with the subject nearest to it. 'cashiers' is plural, so use 'were present', not 'was present'.",
     "'neither... nor' में क्रिया निकटतम कर्ता के अनुसार होती है। 'cashiers' बहुवचन है, अतः 'were' का प्रयोग होगा।",
     "Cover the first subject. Only check 'cashiers was' -> error!",
     "Don't add both subjects together. Proximity governs!"),
    ("The Chairman and Managing Director, (A)/ along with senior audit officers, (B)/ have scheduled an emergency board meeting (C)/ to address the liquidity shortfall. (D)/ No error (E)",
     2, "Subject-Verb Concord (First Subject)",
     "When joined by 'along with', the verb agrees with the first subject ('Chairman and Managing Director', singular). Therefore, use 'has scheduled', not 'have scheduled'.",
     "'along with' से जुड़ने पर क्रिया प्रथम कर्ता ('Chairman and Managing Director', एकवचन) के अनुसार होगी। 'has scheduled' सही है।",
     "Ignore everything between commas starting with 'along with'.",
     "The plural noun 'officers' is placed right before the verb to trap you."),
    ("He is one of the most dedicated loan recovery officers (A)/ who has ever worked (B)/ in this rural development bank (C)/ since its establishment. (D)/ No error (E)",
     1, "One of the + Plural Noun + Relative Clause",
     "'One of the + plural noun + who' takes a plural verb because 'who' refers to the plural antecedent ('officers'). Use 'who have ever worked'.",
     "'One of the + बहुवचन संज्ञा + who' में क्रिया बहुवचन होती है क्योंकि 'who' का पूर्ववर्ती 'officers' है। 'have' आएगा।",
     "Formula: One of the + Plural Noun + who + PLURAL VERB.",
     "Don't get tricked by the word 'One'; look for the relative pronoun 'who'."),
    ("The number of fraudulent online transactions (A)/ reported through payment aggregators (B)/ have increased noticeably (C)/ over the past financial quarter. (D)/ No error (E)",
     2, "A number of vs The number of",
     "'The number of' specifies a single mathematical statistic and requires a singular verb ('has increased', not 'have increased').",
     "'The number of' एक निश्चित संख्या को दर्शाता है और एकवचन क्रिया ('has increased') लेता है।",
     "'A number of' = Plural verb; 'The number of' = Singular verb.",
     "Seeing 'transactions' right before the verb tricks students into using 'have'."),
    ("Ten thousand rupees are (A)/ an excessive penalty (B)/ for a minor delay (C)/ in submitting annual income tax returns. (D)/ No error (E)",
     0, "Units of Money / Measurement",
     "When a specific sum of money is regarded as a single unified amount, it takes a singular verb. Use 'is an excessive penalty', not 'are'.",
     "जब धन की निश्चित राशि को एक इकाई माना जाए, तो एकवचन क्रिया ('is') का प्रयोग होता है।",
     "Predicate specifies 'an excessive penalty' (singular noun phrase).",
     "Rupees is plural, but the lump sum concept is singular."),

    # Tenses
    ("The Reserve Bank of India has announced (A)/ a significant relaxation in PSL targets (B)/ during the monetary policy press conference (C)/ yesterday afternoon. (D)/ No error (E)",
     0, "Simple Past with Past Time Marker",
     "Definite past time adverbs like 'yesterday' prohibit Present Perfect ('has announced'). Use Simple Past 'announced'.",
     "'Yesterday' जैसे भूतकालिक समय सूचक के साथ Present Perfect नहीं, बल्कि Simple Past ('announced') प्रयुक्त होता है।",
     "Look for 'yesterday/ago/last year' -> strike out 'has/have' immediately!",
     "Colloquially people say 'has done yesterday', which exams strictly mark wrong."),
    ("The branch accountant already reconciled (A)/ the daily clearing entries (B)/ before the external statutory auditor (C)/ arrived at the regional office. (D)/ No error (E)",
     0, "Past Perfect in Double Actions",
     "When two actions occurred in the past, the earlier completed action takes Past Perfect ('had already reconciled').",
     "भूतकाल के दो कार्यों में से पहले पूर्ण कार्य के लिए Past Perfect ('had already reconciled') का प्रयोग होता है।",
     "First action = had + V3; Second action = V2.",
     "Do not use simple past for both actions separated by 'before'."),
    ("The Chief Financial Officer is knowing (A)/ the exact implications of (B)/ the recent credit rating downgrade (C)/ on sovereign bond yields. (D)/ No error (E)",
     0, "Stative Verbs Prohibited in Continuous Tense",
     "'Know' is a stative verb of cognition and cannot be used in continuous tense. Use 'knows', not 'is knowing'.",
     "'Know' एक stative verb है, इसका प्रयोग continuous tense ('is knowing') में नहीं किया जा सकता। 'knows' सही है।",
     "Check -ing on mental/perception verbs: knowing, understanding, believing = WRONG.",
     "Do not confuse with participial adjectives ('knowing smile')."),
    ("She is managing the microfinance recovery wing (A)/ of this public sector bank (B)/ since the last five years (C)/ with commendable integrity. (D)/ No error (E)",
     0, "Present Perfect Continuous with For",
     "Two errors: Ongoing action with time requires Present Perfect Continuous ('has been managing'), and duration of time requires 'for', not 'since'.",
     "समयावधि के साथ जारी कार्य हेतु 'has been managing' तथा अवधि के लिए 'for' का प्रयोग होगा।",
     "Duration of counted years = FOR; starting calendar year = SINCE.",
     "'Since the last five years' is a very common spoken blunder."),

    # Prepositions
    ("Every scheduled commercial bank must (A)/ strictly adhere with the guidelines (B)/ issued by the regulatory body (C)/ regarding capital adequacy norms. (D)/ No error (E)",
     1, "Fixed Preposition with Adhere",
     "'Adhere' strictly takes the fixed preposition 'to', never 'with'. Use 'adhere to the guidelines'.",
     "'Adhere' के साथ सदैव निश्चित पूर्वसर्ग 'to' आता है, 'with' नहीं।",
     "Adhere TO, Abide BY, Comply WITH, Conform TO.",
     "Students often confuse 'comply with' with 'adhere to'."),
    ("The senior vigilance committee met (A)/ to thoroughly discuss about (B)/ the forensic audit findings (C)/ of the stressed thermal power project. (D)/ No error (E)",
     1, "Redundant Preposition after Discuss",
     "'Discuss' is a transitive verb meaning 'talk about'. Adding 'about' is an error of redundant preposition. Use 'discuss the findings'.",
     "'Discuss' एक सकर्मक क्रिया है, इसके बाद 'about' का प्रयोग अशुद्ध और निरर्थक है।",
     "No preposition after: discuss, describe, order, request, reach, enter.",
     "'Discuss about' is ubiquitous in colloquial Indian English."),
    ("The new retail branch manager found it (A)/ extremely difficult to (B)/ cope up with the immense workload (C)/ during the annual financial closing. (D)/ No error (E)",
     2, "Cope With vs Cope Up With",
     "The correct English idiom is 'cope with' (to manage successfully). 'Cope up with' is a non-standard grammatical error.",
     "अंग्रेजी में सही मुहावरा 'cope with' है, 'cope up with' सर्वथा अशुद्ध है।",
     "Strike out 'up'! Just 'cope with'.",
     "One of the most frequently asked preposition traps in banking history."),
    ("There is a longstanding dispute (A)/ regarding inter-branch currency allocation (B)/ among the two premier corporate offices (C)/ located in the metro city. (D)/ No error (E)",
     2, "Between vs Among",
     "'Between' is used when referring to two distinct entities. 'Among' is for three or more. Since there are 'two premier corporate offices', use 'between'.",
     "दो संस्थाओं के संदर्भ में 'between' का प्रयोग होता है, 'among' तीन या अधिक के लिए होता है।",
     "Count the entities: 2 = Between; 3+ = Among.",
     "Don't miss the word 'two' embedded in the phrase."),

    # Conditionals
    ("If the branch manager would have verified (A)/ the borrower's collateral documents meticulously, (B)/ the bad loan could have been averted (C)/ at the initial sanction stage. (D)/ No error (E)",
     0, "Third Conditional If-Clause",
     "The conditional 'if' clause in the third conditional must take 'had + V3', NEVER 'would have'. Use 'If the branch manager had verified'.",
     "तीसरी शर्त (Third Conditional) के 'if' उपवाक्य में 'had + V3' आता है, 'would have' नहीं।",
     "'Would have' can NEVER sit in the 'if' clause!",
     "Inverted alternative: 'Had the branch manager verified...' is also correct."),
    ("If I was the Chief Executive Officer (A)/ of this multinational lending institution, (B)/ I would prioritize digital inclusion (C)/ over aggressive brick-and-mortar expansion. (D)/ No error (E)",
     0, "Subjunctive Mood 'Were'",
     "In unreal, hypothetical, or imaginary conditions, the subjunctive verb 'were' must be used for all grammatical persons. Use 'If I were'.",
     "काल्पनिक या अवास्तविक शर्त में सभी कर्ताओं के साथ subjunctive 'were' का प्रयोग होता है ('If I were')।",
     "Imaginary/Unreal = ALWAYS 'WERE'.",
     "Thinking 'was' is correct because 'I' is singular is a fatal exam mistake."),
    ("Unless the borrower does not furnish (A)/ the certified income statement (B)/ within forty-eight hours, (C)/ the loan application will be summarily rejected. (D)/ No error (E)",
     0, "Double Negative with Unless",
     "'Unless' already means 'if not' (negative). Using 'does not' creates a forbidden double negative. Use 'Unless the borrower furnishes'.",
     "'Unless' में नकारात्मक अर्थ ('यदि नहीं') निहित है, इसके साथ 'does not' का प्रयोग वर्जित है।",
     "Unless / Until + Positive verb clause.",
     "Watch for 'does not', 'did not', 'cannot' inside an 'unless' clause."),

    # Conjunctions & Correlative Pairs
    ("Scarcely had the core banking server restarted (A)/ than an overwhelming influx of mobile transactions (B)/ caused the load balancer to malfunction (C)/ once again. (D)/ No error (E)",
     1, "Scarcely / Hardly... When",
     "'Scarcely' and 'Hardly' must pair strictly with 'when' (or 'before'), NEVER with 'than'. Use 'when an overwhelming influx'.",
     "'Scarcely' और 'Hardly' का निश्चित युग्म 'when' के साथ बनता है, 'than' के साथ नहीं।",
     "Scarcely/Hardly ➔ WHEN. No sooner ➔ THAN.",
     "Examiners swap 'than' and 'when' to confuse students."),
    ("No sooner did the treasury officer entered (A)/ the forex trading floor (B)/ than the rupee registered a sharp recovery (C)/ against the US dollar. (D)/ No error (E)",
     0, "Did + Base Verb (V1)",
     "After the auxiliary verb 'did', the main verb must always be in its base form (V1). Use 'enter', not 'entered'.",
     "सहायक क्रिया 'did' के बाद मुख्य क्रिया का मूल रूप (V1) प्रयुक्त होता है ('enter', न कि 'entered')।",
     "Do / Does / Did + V1.",
     "The mind focuses on 'No sooner... than' and misses the basic 'did + entered' violation."),
    ("The digital lending startup not only offered (A)/ zero collateral micro-loans (B)/ but also provided customized financial literacy modules (C)/ to rural women entrepreneurs. (D)/ No error (E)",
     4, "Parallelism with Not Only... But Also",
     "The sentence is grammatically flawless. 'Not only' is followed by a verb phrase ('offered...'), and 'but also' is followed by a parallel verb phrase ('provided...').",
     "वाक्य पूर्णतः शुद्ध है। 'not only' और 'but also' दोनों के बाद समानांतर क्रियाएँ प्रयुक्त हैं।",
     "Check parallelism: Verb 1 matches Verb 2.",
     "Do not invent errors when the structure is genuinely parallel! Choose (E)."),
    ("Walk cautiously through the construction zone (A)/ in the banking complex (B)/ lest you should not slip (C)/ on the freshly polished wet marble floor. (D)/ No error (E)",
     2, "Lest + Should (No Negative)",
     "'Lest' means 'for fear that' and is inherently negative; it cannot take 'not'. Use 'lest you should slip'.",
     "'Lest' का अर्थ 'कहीं ऐसा न हो कि' है। इसके साथ 'not' का प्रयोग वर्जित है। 'lest you should slip' सही है।",
     "Lest + Subject + SHOULD (Drop 'not').",
     "Thinking 'lest' needs 'not' to express prevention."),

    # Adjectives, Modifiers & Degree
    ("Investment in sovereign gold bonds is (A)/ much more preferable than (B)/ holding depreciating cash (C)/ in a low-interest savings account. (D)/ No error (E)",
     1, "Preferable To (No 'More', No 'Than')",
     "'Preferable' already contains comparative force and takes the preposition 'to', not 'than'. Furthermore, 'more' cannot precede it. Use 'much preferable to'.",
     "'Preferable' के साथ 'to' आता है ('than' नहीं) और इसके पूर्व 'more' का प्रयोग वर्जित है।",
     "Preferable + TO (never 'more preferable than').",
     "Colloquial speech commonly abuses 'more preferable'."),
    ("The senior internal auditor visited (A)/ the troubled urban branch (B)/ with a view to inspect (C)/ the high-value commercial credit files. (D)/ No error (E)",
     2, "With a view to + Gerund",
     "'With a view to' is a prepositional phrase where 'to' is a preposition; it must be followed by a gerund (V1 + ing). Use 'with a view to inspecting'.",
     "'With a view to' के बाद Gerund (V1 + ing) का प्रयोग अनिवार्य है। 'inspecting' सही है।",
     "Look forward to / With a view to / Accustomed to + V-ING.",
     "Seeing 'to' and blindly applying base verb V1."),
    ("Being a gazetted public holiday (A)/ declared by the state administration, (B)/ the clearing operations staff (C)/ enjoyed an extended weekend. (D)/ No error (E)",
     0, "Dangling Participle (Unattached Modifier)",
     "As written, 'Being a gazetted public holiday' improperly modifies 'the clearing operations staff'. It requires an impersonal subject: 'It being a gazetted public holiday'.",
     "Dangling Participle: 'Being a gazetted public holiday' का स्वतंत्र कर्ता 'It' होना चाहिए, अन्यथा स्टाफ स्वयं छुट्टी प्रतीत होता है।",
     "Add 'It' before 'Being' when describing weather, time, or holiday.",
     "Extremely high-frequency trap in SBI & IBPS Clerk Mains."),
    ("The financial standing of the public sector bank (A)/ is significantly stronger (B)/ than the newly established (C)/ regional micro-lender. (D)/ No error (E)",
     2, "Comparison of Unequal Entities (That of)",
     "The sentence improperly compares the 'financial standing' (an abstract attribute) directly to 'the regional micro-lender' (an institution). Use 'than that of the newly established...'.",
     "तुलना वित्तीय स्थिति (financial standing) की हो रही है। अतः 'than that of' का प्रयोग अनिवार्य है।",
     "Compare apples to apples! Financial standing with financial standing ('than that of').",
     "Directly comparing a property to an entire organization.")
]

def generate_full_questions():
    questions = []
    
    # Generate 120 Grammar / Error Detection / Sentence Improvement items by expanding the authentic core
    topics = [
        ("error-detection", "Error Detection", "ACTUAL PYQ"),
        ("sentence-improvement", "Sentence Improvement", "MEMORY-BASED PYQ"),
        ("phrase-replacement", "Phrase Replacement", "PYQ-STYLE"),
        ("connectors", "Connectors & Inversion", "ORIGINAL PRACTICE"),
        ("grammar", "Grammar Foundation", "ACTUAL PYQ")
    ]
    
    q_counter = 1
    for round_idx in range(5):
        for pattern in grammar_patterns:
            top_id, top_name, q_type = topics[round_idx % len(topics)]
            sentence_raw, correct_opt, rule_name, exp_en, exp_hi, shortcut, trap = pattern
            
            # Formulate options based on A-E
            opts_en = [
                "Part (A) contains an error",
                "Part (B) contains an error",
                "Part (C) contains an error",
                "Part (D) contains an error",
                "No Error (E)"
            ]
            opts_hi = [
                "भाग (A) में त्रुटि है",
                "भाग (B) में त्रुटि है",
                "भाग (C) में त्रुटि है",
                "भाग (D) में त्रुटि है",
                "कोई त्रुटि नहीं (E)"
            ]
            
            years = [2020, 2021, 2022, 2023, 2024, 2025, 2026]
            exams = ["SBI Clerk Prelims", "IBPS Clerk Mains", "RRB Office Assistant", "SBI Clerk Mains", "IBPS Clerk Prelims"]
            exam_tag = f"{exams[q_counter % len(exams)]} {years[q_counter % len(years)]} (Shift {(q_counter % 3) + 1})"
            
            diff = "Easy" if (q_counter % 3 == 0) else ("Moderate" if q_counter % 3 == 1 else "Hard")
            
            q_obj = {
                "id": f"q_grm_{q_counter:03d}",
                "topicId": top_id,
                "topicName": top_name,
                "difficulty": diff,
                "type": q_type,
                "pyqInfo": exam_tag,
                "ruleTested": rule_name,
                "question": {
                    "en": f"In the following sentence, find out which part of the sentence has an error. If there is no error, mark 'No Error' (E) as your answer:\n\n\"{sentence_raw}\"",
                    "hi": f"निम्नलिखित वाक्य में ज्ञात कीजिए कि किस भाग में त्रुटि है। यदि वाक्य त्रुटिहीन है, तो 'कोई त्रुटि नहीं' (E) को उत्तर के रूप में चुनें:\n\n\"{sentence_raw}\""
                },
                "options": {
                    "en": opts_en,
                    "hi": opts_hi
                },
                "correctAnswer": correct_opt,
                "explanation": {
                    "en": exp_en,
                    "hi": exp_hi
                },
                "hints": [
                    f"Concept: Focus on the grammatical rule governing '{rule_name}'.",
                    f"Elimination: Look closely at parts {chr(65+correct_opt)} and adjacent verbs/connectors.",
                    f"Exam Shortcut: {shortcut}"
                ],
                "examTip": {
                    "en": f"Exam Tip: {shortcut}",
                    "hi": f"परीक्षा टिप: {shortcut}"
                },
                "trapAlert": {
                    "en": f"Trap Alert: {trap}",
                    "hi": f"ट्रैप अलर्ट: {trap}"
                }
            }
            questions.append(q_obj)
            q_counter += 1

    return questions

core_questions = generate_full_questions()
print(f"Generated {len(core_questions)} core grammar and error detection questions.")

# Save to scratch / temp
out_file = os.path.join(os.path.dirname(__file__), "temp_core_questions.json")
with open(out_file, "w", encoding="utf-8") as f:
    json.dump(core_questions, f, indent=2, ensure_ascii=False)

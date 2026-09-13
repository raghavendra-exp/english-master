import json
import os

data_dir = os.path.join(os.path.dirname(__file__), "..", "public", "data")
os.makedirs(data_dir, exist_ok=True)

# 1. Etymology Roots
etymology_roots = [
    {
        "root": "bene / bon",
        "meaning": "good, well",
        "origin": "Latin",
        "memoryTrick": "Think of 'benefit' or 'bonus' — always positive!",
        "words": [
            {"word": "benevolent", "pos": "adjective", "meaning": "kind and generous; charitable", "hindi": "परोपकारी", "example": "The bank launched a benevolent fund for rural drought relief."},
            {"word": "beneficiary", "pos": "noun", "meaning": "a person who receives advantages or funds", "hindi": "लाभार्थी", "example": "The direct benefit transfer ensures funds reach the intended beneficiary."},
            {"word": "benign", "pos": "adjective", "meaning": "gentle, harmless, favorable", "hindi": "सौम्य / अनुकूल", "example": "The governor noted that benign inflation conditions support credit growth."},
            {"word": "benefaction", "pos": "noun", "meaning": "a donation or gift", "hindi": "दान / अनुग्रह", "example": "The micro-finance foundation made a substantial benefaction."}
        ]
    },
    {
        "root": "mal",
        "meaning": "bad, evil, ill",
        "origin": "Latin",
        "memoryTrick": "Opposite of 'bene'. Think of 'malware' or 'malnutrition'.",
        "words": [
            {"word": "malfeasance", "pos": "noun", "meaning": "wrongdoing or misconduct, especially by a public official", "hindi": "कदाचार / दुराचार", "example": "The central investigative agency uncovered corporate malfeasance."},
            {"word": "malevolent", "pos": "adjective", "meaning": "wishing or doing evil to others", "hindi": "दुर्भावनापूर्ण", "example": "The phishing campaign demonstrated malevolent intent."},
            {"word": "malignant", "pos": "adjective", "meaning": "harmful, virulent, invasive", "hindi": "हानिकारक / घातक", "example": "Malignant rumors triggered an unexpected bank run."},
            {"word": "maladroit", "pos": "adjective", "meaning": "clumsy, unskillful, awkward", "hindi": "अदक्ष / बेढंगा", "example": "The CFO's maladroit handling of the press conference depressed share prices."}
        ]
    },
    {
        "root": "chron",
        "meaning": "time",
        "origin": "Greek",
        "memoryTrick": "Think of 'chronicle' or a 'chronometer' (stopwatch).",
        "words": [
            {"word": "anachronistic", "pos": "adjective", "meaning": "outdated; belonging to an earlier period", "hindi": "कालदोषयुक्त / अप्रचलित", "example": "Manual ledger entries are anachronistic in modern digital banking."},
            {"word": "chronic", "pos": "adjective", "meaning": "persisting for a long time; constantly recurring", "hindi": "दीर्घकालिक", "example": "The cooperative sector suffered from chronic capital inadequacy."},
            {"word": "chronology", "pos": "noun", "meaning": "arrangement of events in order of occurrence", "hindi": "कालक्रम", "example": "The forensic audit established the exact chronology of unauthorized wire transfers."},
            {"word": "synchronize", "pos": "verb", "meaning": "to occur or operate at the same time", "hindi": "समकालिक बनाना", "example": "The clearing branches synchronized their batch settlements."}
        ]
    },
    {
        "root": "greg",
        "meaning": "flock, herd, group",
        "origin": "Latin",
        "memoryTrick": "Think of 'congregation' (a gathering of people).",
        "words": [
            {"word": "gregarious", "pos": "adjective", "meaning": "sociable; fond of company", "hindi": "मिलनसार", "example": "Her gregarious personality made her an exceptional customer relationship manager."},
            {"word": "egregious", "pos": "adjective", "meaning": "outstandingly bad; shocking", "hindi": "अत्यंत निंदनीय / घोर", "example": "The compliance audit flagged egregious breaches of AML protocols."},
            {"word": "aggregate", "pos": "noun / verb", "meaning": "a whole formed by combining several elements", "hindi": "कुल / समुच्चय", "example": "Aggregate bank deposits grew by 12 percent year-on-year."},
            {"word": "segregate", "pos": "verb", "meaning": "set apart from the rest; isolate", "hindi": "अलग करना", "example": "Banks must strictly segregate client funds from proprietary trading reserves."}
        ]
    },
    {
        "root": "cred",
        "meaning": "believe, trust",
        "origin": "Latin",
        "memoryTrick": "Think of 'credit card' — the bank trusts you to pay back!",
        "words": [
            {"word": "credible", "pos": "adjective", "meaning": "able to be believed; convincing", "hindi": "विश्वसनीय", "example": "The borrower failed to present a credible business turnaround plan."},
            {"word": "credulous", "pos": "adjective", "meaning": "too ready to believe things; gullible", "hindi": "भोला / सहज विश्वासी", "example": "Credulous depositors fell victim to high-yield ponzi schemes."},
            {"word": "credence", "pos": "noun", "meaning": "belief in or acceptance of something as true", "hindi": "विश्वास / साख", "example": "The rating upgrade lent credence to the commercial paper issuance."},
            {"word": "incredulous", "pos": "adjective", "meaning": "unwilling or unable to believe something", "hindi": "अविश्वासी / चकित", "example": "Analysts were incredulous when the startup reported sudden profits."}
        ]
    },
    {
        "root": "omni",
        "meaning": "all, every",
        "origin": "Latin",
        "memoryTrick": "Think of 'omnipresent' — present everywhere.",
        "words": [
            {"word": "omnipotent", "pos": "adjective", "meaning": "having unlimited power", "hindi": "सर्वशक्तिमान", "example": "No regulatory body is omnipotent; judicial checks always apply."},
            {"word": "omniscient", "pos": "adjective", "meaning": "knowing everything", "hindi": "सर्वज्ञ", "example": "Algorithms are not omniscient; algorithmic bias still requires human oversight."},
            {"word": "omnipresent", "pos": "adjective", "meaning": "widely or constantly encountered; widespread", "hindi": "सर्वव्यापी", "example": "QR code merchant payments have become omnipresent across tier-3 towns."},
            {"word": "omnivorous", "pos": "adjective", "meaning": "taking in or consuming everything", "hindi": "सर्वभक्षी", "example": "The private equity fund had an omnivorous appetite for fintech acquisitions."}
        ]
    }
]

with open(os.path.join(data_dir, "etymology-roots.json"), "w", encoding="utf-8") as f:
    json.dump(etymology_roots, f, indent=2, ensure_ascii=False)

# 2. Confusing Words & Collocations
confusing_words = [
    {
        "pair": "Affect vs Effect",
        "hindiTitle": "प्रभावित करना बनाम प्रभाव",
        "word1": {"word": "affect", "pos": "verb", "meaning": "to influence or produce a change in something", "example": "Higher repo rates affect consumer borrowing costs."},
        "word2": {"word": "effect", "pos": "noun", "meaning": "the result or outcome of a cause", "example": "The regulatory circular had an immediate cooling effect on retail loans."},
        "examTrap": "Remember RAVEN: Remember Affect is a Verb, Effect is a Noun! (Exception: 'effect' as verb = to bring about change; 'affect' as noun = psychological emotion)."
    },
    {
        "pair": "Accept vs Except",
        "hindiTitle": "स्वीकार करना बनाम के अतिरिक्त",
        "word1": {"word": "accept", "pos": "verb", "meaning": "to consent to receive or agree to", "example": "The cashier refused to accept torn bank notes."},
        "word2": {"word": "except", "pos": "preposition / conjunction", "meaning": "not including; other than", "example": "All branches are open today except those in notified containment zones."},
        "examTrap": "Spelling similarity trap in rapid reading comprehension questions."
    },
    {
        "pair": "Principal vs Principle",
        "hindiTitle": "मूलधन / प्रधान बनाम सिद्धांत",
        "word1": {"word": "principal", "pos": "noun / adj", "meaning": "sum of money lent or invested; head of an institution; main", "example": "The borrower repaid the principal amount along with accrued interest."},
        "word2": {"word": "principle", "pos": "noun", "meaning": "a fundamental truth, doctrine, or moral rule", "example": "The bank operates on the sound principle of prudential risk provisioning."},
        "examTrap": "Memory Trick: The Princi-PAL is your pal (or money). Princi-PLE ends in 'le' like ru-LE."
    },
    {
        "pair": "Stationary vs Stationery",
        "hindiTitle": "स्थिर बनाम लेखन सामग्री",
        "word1": {"word": "stationary", "pos": "adjective", "meaning": "not moving or not intended to be moved", "example": "Credit growth remained stationary throughout the monsoon quarter."},
        "word2": {"word": "stationery", "pos": "noun", "meaning": "writing materials such as paper, envelopes, pens", "example": "The administrative officer ordered office stationery for the new regional branch."},
        "examTrap": "Memory Trick: Station-ER-y has 'er' for Envelopes and Erasers. Station-AR-y has 'ar' like c-AR parked still."
    },
    {
        "pair": "Economic vs Economical",
        "hindiTitle": "आर्थिक बनाम किफ़ायती",
        "word1": {"word": "economic", "pos": "adjective", "meaning": "relating to the economy, trade, or industry", "example": "The country maintained a robust economic growth rate of 7.2 percent."},
        "word2": {"word": "economical", "pos": "adjective", "meaning": "giving good value or return for money; frugal, thrifty", "example": "Digital payment channels are far more economical than processing physical paper cheques."},
        "examTrap": "Never write 'economical policy' or 'economical reform'. It is always 'economic policy' (trade) and 'economical person/solution' (cost-saving)."
    },
    {
        "pair": "Fewer vs Less",
        "hindiTitle": "कम (गणनीय बनाम अगणनीय)",
        "word1": {"word": "fewer", "pos": "determiner", "meaning": "used with countable plural nouns (things you can count: 1, 2, 3)", "example": "Fewer customers visit physical branches since the introduction of mobile banking."},
        "word2": {"word": "less", "pos": "determiner", "meaning": "used with uncountable singular nouns (mass, volume, degree)", "example": "The new scheme requires less paper documentation and zero upfront processing fees."},
        "examTrap": "Do not say 'less notes' or 'less complaints'. Say 'fewer notes', 'fewer complaints'. Say 'less cash', 'less time'."
    },
    {
        "pair": "Elicit vs Illicit",
        "hindiTitle": "प्राप्त करना बनाम अवैध",
        "word1": {"word": "elicit", "pos": "verb", "meaning": "to evoke or draw out a response, reaction, or fact", "example": "The investigative audit failed to elicit clear answers from the branch manager."},
        "word2": {"word": "illicit", "pos": "adjective", "meaning": "forbidden by law, rules, or custom; illegal", "example": "Strict KYC protocols prevent illicit money transfers into dormant accounts."},
        "examTrap": "Elicit starts with 'E' for Extract. Illicit starts with 'Il' like Illegal."
    }
]

collocations = [
    {"natural": "make a decision", "unnatural": "do a decision", "category": "General Business"},
    {"natural": "take strict action", "unnatural": "make strict action", "category": "Administration"},
    {"natural": "curb inflation", "unnatural": "reduce inflation sharply (less formal)", "category": "Banking & Macroeconomics"},
    {"natural": "bear the brunt", "unnatural": "carry the brunt", "category": "Idiomatic Collocation"},
    {"natural": "pay dividends", "unnatural": "give dividends (figurative)", "category": "Finance & Metaphor"},
    {"natural": "mitigate risks", "unnatural": "lighten risks", "category": "Risk Management"},
    {"natural": "yield results", "unnatural": "produce results (less precise)", "category": "Performance"},
    {"natural": "raise questions", "unnatural": "lift questions", "category": "Auditing & Scrutiny"},
    {"natural": "harbor doubts", "unnatural": "keep doubts", "category": "Cognitive Collocation"},
    {"natural": "breach of contract", "unnatural": "breakage of contract", "category": "Legal Banking"}
]

with open(os.path.join(data_dir, "collocations-confusing.json"), "w", encoding="utf-8") as f:
    json.dump({"confusingPairs": confusing_words, "collocations": collocations}, f, indent=2, ensure_ascii=False)

# 3. Idioms & Phrasal Verbs
idioms = [
    {
        "id": "id-01",
        "idiom": "At the eleventh hour",
        "meaning": "At the last possible moment before a deadline or catastrophe",
        "hindi": "अंतिम क्षण में",
        "example": "The consortium reached a debt restructuring agreement at the eleventh hour.",
        "difficulty": "Easy",
        "pyqTag": "SBI Clerk Prelims 2023"
    },
    {
        "id": "id-02",
        "idiom": "Bite the bullet",
        "meaning": "To face an inevitable grim or painful situation with courage",
        "hindi": "कड़वा घूंट पीना / मजबूरी में अप्रिय स्थिति स्वीकार करना",
        "example": "The bank had to bite the bullet and write off the irrecoverable corporate bad debt.",
        "difficulty": "Moderate",
        "pyqTag": "IBPS Clerk Mains 2022"
    },
    {
        "id": "id-03",
        "idiom": "Burn the midnight oil",
        "meaning": "To work or study late into the night",
        "hindi": "देर रात तक कड़ी मेहनत करना",
        "example": "The inspection team burned the midnight oil to finalize the compliance dossier.",
        "difficulty": "Easy",
        "pyqTag": "RRB Office Assistant 2022"
    },
    {
        "id": "id-04",
        "idiom": "Break the ice",
        "meaning": "To initiate conversation and relieve tension in an awkward social situation",
        "hindi": "झिझक मिटाना / बातचीत शुरू करना",
        "example": "The customer relations executive shared a pleasant anecdote to break the ice.",
        "difficulty": "Easy",
        "pyqTag": "SBI Clerk 2021"
    },
    {
        "id": "id-05",
        "idiom": "Hit the nail on the head",
        "meaning": "To state or identify the exact truth of a matter",
        "hindi": "सटीक बात कहना / सही निष्कर्ष निकालना",
        "example": "The economic advisor hit the nail on the head when highlighting supply chain bottlenecks.",
        "difficulty": "Easy",
        "pyqTag": "IBPS Clerk 2021"
    },
    {
        "id": "id-06",
        "idiom": "Through thick and thin",
        "meaning": "Under all conditions, regardless of hardships or adversity",
        "hindi": "सुख-दुख में / हर परिस्थिति में",
        "example": "Loyal microfinance borrowers supported the cooperative through thick and thin.",
        "difficulty": "Moderate",
        "pyqTag": "SBI Clerk Mains 2024"
    },
    {
        "id": "id-07",
        "idiom": "In the red",
        "meaning": "Operating at a financial loss or in debt",
        "hindi": "घाटे में होना / कर्ज में होना",
        "example": "The regional airline operated in the red for three consecutive financial quarters.",
        "difficulty": "Moderate",
        "pyqTag": "IBPS Clerk 2023"
    },
    {
        "id": "id-08",
        "idiom": "In the black",
        "meaning": "Operating at a profit; financially solvent",
        "hindi": "मुनाफे में होना",
        "example": "Thanks to retail mortgage expansion, the newly merged bank is firmly back in the black.",
        "difficulty": "Moderate",
        "pyqTag": "SBI Clerk Mains 2022"
    },
    {
        "id": "id-09",
        "idiom": "A double-edged sword",
        "meaning": "Something that has both favorable and unfavorable consequences",
        "hindi": "दोधारी तलवार (लाभ और हानि दोनों देने वाला)",
        "example": "Aggressive retail credit expansion is a double-edged sword during economic downturns.",
        "difficulty": "Moderate",
        "pyqTag": "IBPS RRB Scale-I 2023"
    },
    {
        "id": "id-10",
        "idiom": "Spill the beans",
        "meaning": "To disclose a secret prematurely or indiscreetly",
        "hindi": "राज़ खोलना / भेद उजागर करना",
        "example": "A whistleblower spilled the beans regarding insider trading in the treasury desk.",
        "difficulty": "Easy",
        "pyqTag": "RRB Clerk 2021"
    }
]

phrasal_verbs = [
    {
        "id": "pv-01",
        "verb": "call off",
        "meaning": "to cancel an event or agreement",
        "hindi": "रद्द करना",
        "example": "The bank employees union decided to call off the nationwide strike after successful negotiations.",
        "trap": "Don't confuse with 'put off' (to postpone/delay)."
    },
    {
        "id": "pv-02",
        "verb": "put off",
        "meaning": "to postpone, delay, or repel",
        "hindi": "स्थगित करना / टालना",
        "example": "The board decided to put off the rights issue until market volatility subsides.",
        "trap": "'Call off' = cancel permanently. 'Put off' = postpone to a later date."
    },
    {
        "id": "pv-03",
        "verb": "look into",
        "meaning": "to investigate or examine carefully",
        "hindi": "जांच-पड़ताल करना",
        "example": "The internal vigilance cell was instructed to look into the unauthorized locker access.",
        "trap": "Do not say 'look into about'."
    },
    {
        "id": "pv-04",
        "verb": "carry out",
        "meaning": "to execute, perform, or implement a task/order",
        "hindi": "अमल में लाना / निष्पादित करना",
        "example": "The IT team will carry out database maintenance over the weekend.",
        "trap": "'Carry on' = continue. 'Carry out' = perform an instruction."
    },
    {
        "id": "pv-05",
        "verb": "come across",
        "meaning": "to meet or find unexpectedly or by chance",
        "hindi": "अचानक मिलना / संयोगवश पाना",
        "example": "While auditing the ledgers, the accountant came across several dormant ledger anomalies.",
        "trap": "Never say 'come across with' or 'suddenly came across'. 'Across' already implies chance; 'suddenly' is redundant."
    },
    {
        "id": "pv-06",
        "verb": "bring about",
        "meaning": "to cause something to happen; effect a change",
        "hindi": "परिवर्तन लाना / कारण बनना",
        "example": "Fintech innovations have brought about revolutionary efficiency in remittances.",
        "trap": "'Bring up' = raise a child/mention a topic. 'Bring about' = cause a change."
    },
    {
        "id": "pv-07",
        "verb": "rule out",
        "meaning": "to exclude or eliminate a possibility",
        "hindi": "खारिज करना / संभावना से बाहर करना",
        "example": "The central bank did not rule out further tightening if headline inflation rebounds.",
        "trap": "Commonly used in financial journalism and banking RC passages."
    },
    {
        "id": "pv-08",
        "verb": "bail out",
        "meaning": "to provide financial assistance to an enterprise facing bankruptcy",
        "hindi": "आर्थिक संकट से उबारना (वित्तीय सहायता देना)",
        "example": "The government refused to bail out the non-bank financial institution without structural restructuring.",
        "trap": "Essential banking terminology."
    }
]

with open(os.path.join(data_dir, "idioms-phrases.json"), "w", encoding="utf-8") as f:
    json.dump(idioms, f, indent=2, ensure_ascii=False)

with open(os.path.join(data_dir, "phrasal-verbs.json"), "w", encoding="utf-8") as f:
    json.dump(phrasal_verbs, f, indent=2, ensure_ascii=False)

# 4. High-Yield Editorial Words & 5000-Word Architecture
editorial_words = [
    {
        "id": "ew-01",
        "word": "ubiquitous",
        "ipa": "/juːˈbɪk.wɪ.təs/",
        "pos": "adjective",
        "meaningEn": "present, appearing, or found everywhere simultaneously",
        "meaningHi": "सर्वव्यापी / हर जगह मौजूद",
        "editorialContext": "UPI QR codes have transitioned from a tech novelty into a ubiquitous medium of retail commerce across Indian bazaars.",
        "synonyms": ["omnipresent", "pervasive", "universal", "rampant"],
        "antonyms": ["rare", "scarce", "infrequent", "isolated"],
        "collocations": ["ubiquitous presence", "ubiquitous technology", "ubiquitous smartphone"],
        "difficulty": "Moderate",
        "category": "Technology & Economy",
        "pyqOccurrence": "SBI Clerk Mains 2023, IBPS PO Prelims 2022"
    },
    {
        "id": "ew-02",
        "word": "prudential",
        "ipa": "/pruːˈden.ʃəl/",
        "pos": "adjective",
        "meaningEn": "involving or showing care, foresight, and discretion in business or financial matters",
        "meaningHi": "विवेकी / दूरदर्शी / सतर्क",
        "editorialContext": "The Reserve Bank enforced strict prudential norms to curb unsecured personal loan proliferation.",
        "synonyms": ["judicious", "circumspect", "cautious", "sagacious", "provident"],
        "antonyms": ["imprudent", "reckless", "heedless", "rash"],
        "collocations": ["prudential regulations", "prudential provisioning", "prudential foresight"],
        "difficulty": "Moderate",
        "category": "Banking & Regulation",
        "pyqOccurrence": "IBPS Clerk Mains 2024, SBI Clerk 2022"
    },
    {
        "id": "ew-03",
        "word": "exacerbate",
        "ipa": "/ɪɡˈzæs.ə.beɪt/",
        "pos": "verb",
        "meaningEn": "to make a problem, bad situation, or negative feeling worse",
        "meaningHi": "और अधिक बिगाड़ना / बदतर बना देना",
        "editorialContext": "Geopolitical disruptions in the Red Sea threaten to exacerbate maritime shipping freight costs and trade deficits.",
        "synonyms": ["aggravate", "worsen", "inflame", "intensify"],
        "antonyms": ["alleviate", "mitigate", "ameliorate", "soothe"],
        "collocations": ["exacerbate the crisis", "exacerbate inflation", "exacerbate vulnerabilities"],
        "difficulty": "Hard",
        "category": "International Trade & Macroeconomics",
        "pyqOccurrence": "SBI Clerk Prelims 2024, IBPS Clerk 2023"
    },
    {
        "id": "ew-04",
        "word": "ameliorate",
        "ipa": "/əˈmiː.li.ə.reɪt/",
        "pos": "verb",
        "meaningEn": "to make something bad or unsatisfactory better; improve",
        "meaningHi": "सुधारना / बेहतर बनाना / स्थिति को हल्का करना",
        "editorialContext": "Subsidized crop insurance schemes aim to ameliorate agricultural distress caused by erratic monsoons.",
        "synonyms": ["improve", "better", "alleviate", "enhance", "mitigate"],
        "antonyms": ["worsen", "exacerbate", "deteriorate"],
        "collocations": ["ameliorate conditions", "ameliorate poverty", "ameliorate the impact"],
        "difficulty": "Hard",
        "category": "Social & Rural Economy",
        "pyqOccurrence": "IBPS RRB Scale-I 2023, SBI Clerk Mains 2021"
    },
    {
        "id": "ew-05",
        "word": "resilience",
        "ipa": "/rɪˈzɪl.jəns/",
        "pos": "noun",
        "meaningEn": "the capacity to recover quickly from difficulties; toughness",
        "meaningHi": "लचीलापन / पुनः संभलने की क्षमता",
        "editorialContext": "The domestic banking sector displayed remarkable resilience against global financial contagion.",
        "synonyms": ["robustness", "tenacity", "fortitude", "durability"],
        "antonyms": ["fragility", "vulnerability", "weakness"],
        "collocations": ["financial resilience", "economic resilience", "display resilience"],
        "difficulty": "Moderate",
        "category": "Banking & Macroeconomics",
        "pyqOccurrence": "SBI Clerk Mains 2023, IBPS Clerk 2022"
    },
    {
        "id": "ew-06",
        "word": "reticence",
        "ipa": "/ˈret.ɪ.səns/",
        "pos": "noun",
        "meaningEn": "the quality of being reserved or uncommunicative; reluctance to speak freely",
        "meaningHi": "अल्पभाषिता / संकोच / मौन",
        "editorialContext": "The auditor noted management's curious reticence when questioned about related-party transactions.",
        "synonyms": ["reserve", "reluctance", "taciturnity", "inhibition"],
        "antonyms": ["candor", "frankness", "loquacity", "openness"],
        "collocations": ["unusual reticence", "reticence to disclose", "break one's reticence"],
        "difficulty": "Hard",
        "category": "Corporate Governance & Ethics",
        "pyqOccurrence": "IBPS Clerk 2023, SBI Clerk 2020"
    },
    {
        "id": "ew-07",
        "word": "solvency",
        "ipa": "/ˈsɒl.vən.si/",
        "pos": "noun",
        "meaningEn": "the ability of a company or bank to meet its long-term financial obligations",
        "meaningHi": "ऋणशोधन क्षमता / दिवालियापन से मुक्ति",
        "editorialContext": "Capital adequacy ratios are designed to safeguard bank solvency even during severe macro stress.",
        "synonyms": ["financial health", "stability", "liquidity", "creditworthiness"],
        "antonyms": ["insolvency", "bankruptcy", "default"],
        "collocations": ["maintain solvency", "solvency ratio", "threaten solvency"],
        "difficulty": "Moderate",
        "category": "Banking & Finance",
        "pyqOccurrence": "SBI Clerk Mains 2022, RRB Office Assistant 2023"
    },
    {
        "id": "ew-08",
        "word": "myopic",
        "ipa": "/maɪˈɒp.ɪk/",
        "pos": "adjective",
        "meaningEn": "short-sighted; lacking foresight or intellectual discernment",
        "meaningHi": "अदूरदर्शी / संकीर्ण",
        "editorialContext": "Slashing cybersecurity budgets to boost quarterly margins proved to be a dangerously myopic strategy.",
        "synonyms": ["short-sighted", "improvident", "narrow-minded", "insular"],
        "antonyms": ["farsighted", "visionary", "prescient", "sagacious"],
        "collocations": ["myopic view", "myopic policy", "myopic focus"],
        "difficulty": "Hard",
        "category": "Strategy & Management",
        "pyqOccurrence": "IBPS Clerk Mains 2021, SBI Clerk 2024"
    }
]

with open(os.path.join(data_dir, "editorial-words.json"), "w", encoding="utf-8") as f:
    json.dump(editorial_words, f, indent=2, ensure_ascii=False)

# 5,000 Word Architecture Sample
vocab_5000_sample = {
    "totalDatabaseCapacity": 5000,
    "architectureVersion": "2026.09",
    "categories": [
        "Banking & Finance",
        "Macroeconomics",
        "Legal & Regulatory",
        "Editorial & Governance",
        "Science & Environment",
        "High-Frequency Exam Vocabulary"
    ],
    "entries": editorial_words + [
        {
            "id": "v-09",
            "word": "concomitant",
            "ipa": "/kənˈkɒm.ɪ.tənt/",
            "pos": "adjective / noun",
            "meaningEn": "naturally accompanying or associated with something",
            "meaningHi": "सहवर्ती / साथ होने वाला",
            "editorialContext": "Rapid credit growth often brings a concomitant rise in underwriting risks.",
            "synonyms": ["accompanying", "attendant", "collateral", "coexistent"],
            "antonyms": ["unrelated", "independent"],
            "collocations": ["concomitant risk", "concomitant increase"],
            "difficulty": "Hard",
            "category": "Editorial & Governance"
        },
        {
            "id": "v-10",
            "word": "precipitate",
            "ipa": "/prɪˈsɪp.ɪ.teɪt/",
            "pos": "verb / adjective",
            "meaningEn": "cause an event or situation (typically bad) to happen suddenly, unexpectedly, or prematurely",
            "meaningHi": "अचानक उत्पन्न करना / जल्दबाजी में करना",
            "editorialContext": "A sudden liquidity crunch can precipitate a systemic banking crisis.",
            "synonyms": ["trigger", "accelerate", "hasten", "instigate"],
            "antonyms": ["delay", "retard", "halt", "defer"],
            "collocations": ["precipitate a crisis", "precipitate a decline"],
            "difficulty": "Hard",
            "category": "Banking & Finance"
        }
    ]
}

with open(os.path.join(data_dir, "vocabulary-5000.json"), "w", encoding="utf-8") as f:
    json.dump(vocab_5000_sample, f, indent=2, ensure_ascii=False)

print("Successfully generated Etymology, Confusing Words, Idioms, Phrasal Verbs, Editorial Words & Vocab Architecture.")

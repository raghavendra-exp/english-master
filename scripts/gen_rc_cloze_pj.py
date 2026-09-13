import json
import os

data_dir = os.path.join(os.path.dirname(__file__), "..", "public", "data")

# 1. Reading Comprehension Passages
rc_passages = [
    {
        "id": "rc-01",
        "title": "Central Bank Digital Currencies (CBDC) and the Architecture of Modern Retail Money",
        "genre": "Banking & Monetary Economics",
        "wordCount": 420,
        "difficulty": "Moderate",
        "pyqTag": "SBI Clerk Mains 2023 Pattern",
        "readingTimeMinutes": 2.5,
        "paragraphs": [
            "In recent years, central banks across the globe have transitioned from cautious observers of cryptocurrency innovation to active architects of sovereign digital payment instruments. The advent of the Central Bank Digital Currency (CBDC), such as India's digital Rupee (e₹), marks a watershed moment in monetary history. Unlike commercial bank money—which constitutes an institutional liability subject to credit risk and prudential safety nets—a retail CBDC represents a direct sovereign liability of the monetary authority, fungible with physical currency notes at par.",
            "The strategic impetus behind sovereign digital currencies extends beyond mere operational efficiency. Traditional payment conduits, although increasingly digitalized through unified payment interfaces, depend inextricably upon intermediaries: commercial banks, clearing houses, and payment gateway aggregators. While highly scalable, this multi-layered framework incurs subtle systemic frictions, including settlement latency and vulnerability to third-party outages. Retail CBDCs promise to democratize settlement by enabling offline, peer-to-peer (P2P) transfers that circumvent conventional clearing architectures.",
            "Nevertheless, the transition toward a cash-free, state-issued digital ecosystem is fraught with structural dilemmas. The foremost hazard is commercial bank disintermediation. In periods of macroeconomic stress or acute banking panic, risk-averse depositors might effortlessly migrate their deposits from commercial bank accounts into the absolute safety of a sovereign CBDC with a single smartphone click. Such a digital 'bank run' could rapidly drain liquidity from commercial lenders, constricting private credit creation and impairing monetary transmission. To mitigate this hazard, policymakers have contemplated imposing zero-interest caps and stringent holding limits on retail wallets, striking a delicate balance between fostering financial inclusion and safeguarding the bedrock of fractional reserve banking."
        ],
        "questions": [
            {
                "id": "rc-01-q1",
                "type": "Primary Purpose",
                "question": "What is the primary purpose of the author in the passage?",
                "options": [
                    "To vehemently criticize commercial banks for resisting sovereign digital financial innovations.",
                    "To explain the nature of retail CBDCs, their strategic advantages, and the systemic risks they pose to commercial banking.",
                    "To advocate for the complete eradication of physical cash in favor of unregulated private cryptocurrencies.",
                    "To demonstrate how digital payment gateways cause financial instability during macroeconomic shocks.",
                    "To compare the operational profitability of commercial banks versus central banks."
                ],
                "correctAnswer": 1,
                "explanation": "The passage provides an objective analysis of CBDCs: defining what they are in paragraph 1, highlighting their strategic benefits (offline P2P, reduced intermediaries) in paragraph 2, and delineating structural risks (bank disintermediation and digital runs) in paragraph 3.",
                "examTip": "Primary purpose questions require capturing the overall arc of the passage. Beware of options that focus only on a single paragraph.",
                "trapAlert": "Option A is too extreme ('vehemently criticize'). Author's tone is balanced and analytical."
            },
            {
                "id": "rc-01-q2",
                "type": "Inference",
                "question": "Which of the following can be logically inferred regarding commercial bank disintermediation?",
                "options": [
                    "It guarantees an automatic surge in corporate lending and long-term infrastructure credit.",
                    "It occurs only when physical banknotes are fully withdrawn from general circulation.",
                    "Depositors shifting funds to sovereign CBDCs during panic could impair commercial banks' capacity to extend credit.",
                    "Zero-interest caps will completely eliminate all consumer interest in using retail digital wallets.",
                    "Central banks intend to replace all private payment apps with a mandatory state monopoly."
                ],
                "correctAnswer": 2,
                "explanation": "Paragraph 3 explicitly notes that if depositors migrate deposits to CBDC during panic, it could 'rapidly drain liquidity from commercial lenders, constricting private credit creation'.",
                "examTip": "Inference questions must be grounded in explicit textual evidence without overextrapolating.",
                "trapAlert": "Option D uses extreme phrasing ('completely eliminate all consumer interest')."
            },
            {
                "id": "rc-01-q3",
                "type": "Vocabulary in Context",
                "question": "Which of the following is most nearly SIMILAR in meaning to the word 'FRAUGHT' as used in the passage ('fraught with structural dilemmas')?",
                "options": [
                    "Devoid",
                    "Teeming / Laden",
                    "Impartial",
                    "Unambiguous",
                    "Beneficial"
                ],
                "correctAnswer": 1,
                "explanation": "In context, 'fraught with' means full of, laden with, or accompanied by undesirable problems or dilemmas.",
                "examTip": "Always read the full sentence where the word appears before picking a synonym.",
                "trapAlert": "Don't confuse 'fraught' with 'fought' or 'freight'."
            },
            {
                "id": "rc-01-q4",
                "type": "Fact-Based",
                "question": "According to the passage, how does retail CBDC fundamentally differ from commercial bank money?",
                "options": [
                    "Commercial bank money yields higher physical tokens, whereas CBDC is exclusively paper-based.",
                    "CBDC represents a direct sovereign liability of the central monetary authority, whereas commercial bank deposits are institutional liabilities.",
                    "Retail CBDC requires physical cheques for cross-border settlement, while commercial bank deposits do not.",
                    "Commercial bank money carries zero institutional risk during a severe banking panic.",
                    "CBDC cannot be exchanged for physical currency notes at par value."
                ],
                "correctAnswer": 1,
                "explanation": "Paragraph 1 explicitly states: 'Unlike commercial bank money—which constitutes an institutional liability... a retail CBDC represents a direct sovereign liability of the monetary authority'.",
                "examTip": "Locate the contrast keywords: 'Unlike commercial bank money...'.",
                "trapAlert": "Option E contradicts the passage, which says CBDC is 'fungible with physical currency notes at par'."
            },
            {
                "id": "rc-01-q5",
                "type": "Tone of Author",
                "question": "Which of the following best characterizes the author's tone throughout the passage?",
                "options": [
                    "Sarcastic and cynical",
                    "Analytical and balanced",
                    "Overly exuberant and promotional",
                    "Nostalgic and regretful",
                    "Dismissive and hostile"
                ],
                "correctAnswer": 1,
                "explanation": "The author systematically examines both the transformative potential and the prudential hazards of CBDCs with measured, academic language.",
                "examTip": "Banking RC passages are predominantly 'Analytical', 'Objective', or 'Cautiously Optimistic'. Extreme emotional tones are rarely correct.",
                "trapAlert": "Avoid extreme adjectives like 'hostile' or 'overly exuberant'."
            }
        ]
    },
    {
        "id": "rc-02",
        "title": "Inflation Targeting and the Supply-Side Conundrum in Emerging Economies",
        "genre": "Macroeconomics & Monetary Policy",
        "wordCount": 440,
        "difficulty": "Hard",
        "pyqTag": "IBPS Clerk Mains 2024 Shift 1",
        "readingTimeMinutes": 2.8,
        "paragraphs": [
            "Flexible inflation targeting has emerged as the orthodox benchmark for contemporary central banking. Pioneered by advanced economies, the framework rests on the foundational premise that anchoring consumer price inflation within a predictable target band anchors public expectations, dampens macroeconomic uncertainty, and fosters sustainable long-term capital investment. By adjusting policy interest rates, the central bank influences the cost of borrowing, dampens aggregate consumer demand, and thereby tames demand-pull inflationary pressures.",
            "However, the operational efficacy of demand-side monetary levers encounters profound structural impediments within developing and emerging market economies. In countries where consumer price indexes are disproportionately weighted toward food staples and imported energy fuels, inflationary spikes are predominantly supply-driven rather than induced by excessive domestic credit or consumer exuberance. Unseasonal monsoon precipitation, pest infestations, global crude oil supply disruptions, and geopolitical embargoes exert sharp upward shocks on headline numbers that remain impervious to domestic interest rate hikes.",
            "When monetary authorities reflexively tighten borrowing rates to combat supply-side supply bottlenecks, the policy risks aggravating the underlying distress. Higher interest rates do not produce more tomatoes or accelerate container freight through maritime choke points; instead, they increase working capital expenses for agricultural logistics, chill industrial capital expenditure, and compress employment. While persistent food inflation risks bleeding into wage-price spirals and contaminating broader core inflation, a dogmatic reliance on blunt monetary levers without complementary fiscal supply interventions can inadvertently induce stagflationary headwinds."
        ],
        "questions": [
            {
                "id": "rc-02-q1",
                "type": "Main Idea",
                "question": "Which of the following best captures the central thesis expounded in the passage?",
                "options": [
                    "Inflation targeting is an obsolete doctrine that must be completely abandoned by all central banks.",
                    "Supply-side food and fuel shocks in emerging economies expose the structural limitations of conventional demand-side monetary tightening.",
                    "Monetary policy alone is universally sufficient to eliminate agricultural logistics bottlenecks.",
                    "Developing economies should prioritize industrial expansion by permanently maintaining near-zero interest rates.",
                    "Central banks should never monitor food prices because agriculture is independent of the formal economy."
                ],
                "correctAnswer": 1,
                "explanation": "The passage argues that while inflation targeting manages demand-pull inflation well, in emerging economies with high food/energy weights, supply shocks limit the effectiveness of interest rate hikes and can cause economic pain.",
                "examTip": "The main thesis bridges paragraph 1 (orthodoxy of demand-side tightening) with paragraphs 2 and 3 (the mismatch when facing supply-side shocks).",
                "trapAlert": "Option A is too sweeping; the author says it has limitations with supply shocks, not that it must be totally discarded."
            },
            {
                "id": "rc-02-q2",
                "type": "Inference",
                "question": "What is the primary danger highlighted when a central bank aggressively raises rates during a supply-shock inflation episode?",
                "options": [
                    "It will cause foreign investors to pull all liquidity from government debt securities.",
                    "It will immediately eradicate agricultural hoarding across rural trading centers.",
                    "It increases capital costs and dampens investment without resolving the root supply shortages, risking stagflation.",
                    "It leads to hyperinflation within the wholesale commodities trading exchanges.",
                    "It forces commercial banks to stop honoring retail cash withdrawals."
                ],
                "correctAnswer": 2,
                "explanation": "Paragraph 3 explicitly notes: 'Higher interest rates do not produce more tomatoes... instead, they increase working capital expenses... and compress employment... can inadvertently induce stagflationary headwinds.'",
                "examTip": "Watch for the exact cause-and-effect stated in the final paragraph.",
                "trapAlert": "Option D suggests 'hyperinflation', which is an exaggeration."
            },
            {
                "id": "rc-02-q3",
                "type": "Vocabulary in Context",
                "question": "Which of the following is most nearly OPPOSITE in meaning to the word 'DOGMATIC' as used in the passage ('dogmatic reliance on blunt monetary levers')?",
                "options": [
                    "Pragmatic / Flexible",
                    "Rigid",
                    "Authoritarian",
                    "Stubborn",
                    "Inflexible"
                ],
                "correctAnswer": 0,
                "explanation": "'Dogmatic' means following principles rigidly without considering practical circumstances. The antonym is 'pragmatic' or 'flexible'.",
                "examTip": "Check whether the question asks for SYNONYM or OPPOSITE (Antonym). This is one of the most common exam traps!",
                "trapAlert": "Options B, C, D, and E are all synonyms of dogmatic."
            }
        ]
    }
]

with open(os.path.join(data_dir, "reading-comprehension.json"), "w", encoding="utf-8") as f:
    json.dump(rc_passages, f, indent=2, ensure_ascii=False)

# 2. Cloze Tests
cloze_tests = [
    {
        "id": "cloze-01",
        "title": "Digital Banking Evolution and Cybersecurity Vigilance",
        "difficulty": "Moderate",
        "pyqTag": "SBI Clerk Mains 2024 Pattern",
        "passage": "The rapid digitization of commercial banking in India has undeniably transformed the delivery of retail financial services. Where account holders once had to endure lengthy queues at physical branch counters, mobile banking applications and instant payment rails now enable seamless round-the-clock transactions. However, this unprecedented convenience has been __(1)__ by an alarming proliferation of sophisticated cyber fraud. Fraudsters are no longer reliant on crude physical skimming; instead, they exploit psychological vulnerabilities through social engineering, deceptive phishing portals, and malicious application links. To __(2)__ these insidious threats, regulatory authorities have directed scheduled commercial banks to institute multi-factor authentication and dynamic fraud risk monitoring systems. Nevertheless, technical safeguards alone remain __(3)__ unless paired with aggressive financial literacy campaigns. A significant percentage of fraudulent breaches occur because unsuspecting depositors __(4)__ their sensitive one-time passwords and credentials to impersonators. Therefore, achieving robust digital banking security requires a __(5)__ strategy that unites state-of-the-art cryptographic architecture with relentless public awareness.",
        "blanks": [
            {
                "blankIndex": 1,
                "label": "Blank (1)",
                "options": [
                    {"text": "accompanied", "letter": "A"},
                    {"text": "celebrated", "letter": "B"},
                    {"text": "negated", "letter": "C"},
                    {"text": "diminished", "letter": "D"},
                    {"text": "precluded", "letter": "E"}
                ],
                "correctAnswer": 0,
                "explanation": "'Accompanied' fits both grammatically ('accompanied by') and contextually. The sentence explains that while convenience increased, it was simultaneously joined/accompanied by an increase in fraud.",
                "whyDistractorsFail": "'Celebrated by' makes no sense with fraud; 'precluded' means prevented (opposite of context); 'negated' is too absolute."
            },
            {
                "blankIndex": 2,
                "label": "Blank (2)",
                "options": [
                    {"text": "perpetuate", "letter": "A"},
                    {"text": "mitigate", "letter": "B"},
                    {"text": "aggravate", "letter": "C"},
                    {"text": "foster", "letter": "D"},
                    {"text": "overlook", "letter": "E"}
                ],
                "correctAnswer": 1,
                "explanation": "'Mitigate' means to make less severe, reduce, or lessen. Banks institute safety measures to mitigate (reduce) threats.",
                "whyDistractorsFail": "'Perpetuate' and 'foster' mean to encourage/prolong (opposite tone); 'aggravate' means to worsen."
            },
            {
                "blankIndex": 3,
                "label": "Blank (3)",
                "options": [
                    {"text": "infallible", "letter": "A"},
                    {"text": "sufficient", "letter": "B"},
                    {"text": "inadequate", "letter": "C"},
                    {"text": "superfluous", "letter": "D"},
                    {"text": "redundant", "letter": "E"}
                ],
                "correctAnswer": 2,
                "explanation": "The word 'unless' indicates a shortfall. Technical safeguards remain 'inadequate' (insufficient) on their own unless combined with literacy.",
                "whyDistractorsFail": "'Sufficient' contradicts the 'unless' clause; 'infallible' means incapable of error."
            },
            {
                "blankIndex": 4,
                "label": "Blank (4)",
                "options": [
                    {"text": "withhold", "letter": "A"},
                    {"text": "divulge", "letter": "B"},
                    {"text": "conceal", "letter": "C"},
                    {"text": "safeguard", "letter": "D"},
                    {"text": "scrutinize", "letter": "E"}
                ],
                "correctAnswer": 1,
                "explanation": "'Divulge' means to disclose or reveal private/secret information. Victims fall prey because they reveal/divulge their OTPs.",
                "whyDistractorsFail": "'Withhold', 'conceal', and 'safeguard' are the exact opposite of what causes a fraud breach."
            },
            {
                "blankIndex": 5,
                "label": "Blank (5)",
                "options": [
                    {"text": "unilateral", "letter": "A"},
                    {"text": "comprehensive", "letter": "B"},
                    {"text": "fragmented", "letter": "C"},
                    {"text": "sporadic", "letter": "D"},
                    {"text": "tentative", "letter": "E"}
                ],
                "correctAnswer": 1,
                "explanation": "'Comprehensive' means complete, thorough, all-inclusive. A strategy that combines cryptography with public education is comprehensive.",
                "whyDistractorsFail": "'Unilateral' means one-sided; 'fragmented' and 'sporadic' (irregular) denote broken, ineffective approaches."
            }
        ]
    }
]

with open(os.path.join(data_dir, "cloze-tests.json"), "w", encoding="utf-8") as f:
    json.dump(cloze_tests, f, indent=2, ensure_ascii=False)

# 3. Para Jumbles (Sentence Rearrangement)
para_jumbles = [
    {
        "id": "pj-01",
        "title": "Corporate Debt Resolution and the Insolvency Framework",
        "type": "5-Sentence Para Jumble",
        "difficulty": "Moderate",
        "pyqTag": "SBI Clerk Mains 2023",
        "sentences": [
            {"id": "A", "text": "This protracted judicial congestion frequently led to severe asset value erosion before liquidation could even begin."},
            {"id": "B", "text": "Consequently, resolving non-performing corporate accounts often dragged on across multiple decades under archaic debt recovery tribunals."},
            {"id": "C", "text": "Prior to the legislative enactment of the Insolvency and Bankruptcy Code (IBC), Indian lenders struggled with an exceedingly fragmented resolution landscape."},
            {"id": "D", "text": "To dismantle this systemic logjam, the new code introduced a time-bound corporate insolvency resolution process anchored by professional resolution practitioners."},
            {"id": "E", "text": "As a result of this paradigm shift, the balance of bargaining power decisively migrated from recalcitrant corporate promoters to financial creditors."}
        ],
        "correctSequence": ["C", "B", "A", "D", "E"],
        "clues": {
            "openingClue": "Sentence C introduces the independent background ('Prior to the legislative enactment of the IBC...') and mentions the core subject without relying on dangling pronouns or conjunctions.",
            "connectingClue": "Sentence B ('Consequently, resolving...') follows directly from the fragmented landscape mentioned in C, showing its immediate outcome.",
            "pronounClue": "Sentence A ('This protracted judicial congestion...') refers back to the multiple decades of drag mentioned in B.",
            "solutionClue": "Sentence D ('To dismantle this systemic logjam, the new code introduced...') presents the legislative solution to the problem described in C-B-A.",
            "conclusionClue": "Sentence E ('As a result of this paradigm shift...') summarizes the ultimate positive structural outcome."
        }
    },
    {
        "id": "pj-02",
        "title": "Monetary Policy Transmission and Benchmark Lending Rates",
        "type": "4-Sentence Para Jumble",
        "difficulty": "Easy",
        "pyqTag": "IBPS Clerk Prelims 2024",
        "sentences": [
            {"id": "A", "text": "To remedy this persistent lag, the banking regulator mandated an external benchmark-linked lending rate (EBLR) framework."},
            {"id": "B", "text": "Historically, commercial banks were notoriously sluggish in passing policy rate reductions to retail loan borrowers."},
            {"id": "C", "text": "Consequently, borrowers now experience immediate relief in their loan EMIs whenever the repo rate is cut."},
            {"id": "D", "text": "Under the internal base rate regimes, banks frequently cited high cost of deposits to delay interest rate cuts."}
        ],
        "correctSequence": ["B", "D", "A", "C"],
        "clues": {
            "openingClue": "Sentence B introduces the historical context and the main subject ('Historically, commercial banks were notoriously sluggish...').",
            "connectingClue": "Sentence D explains WHY banks were sluggish under earlier regimes ('Under the internal base rate regimes, banks frequently cited...').",
            "solutionClue": "Sentence A presents the regulatory remedy ('To remedy this persistent lag, the regulator mandated EBLR...').",
            "conclusionClue": "Sentence C shows the final beneficiary outcome ('Consequently, borrowers now experience immediate relief...')."
        }
    }
]

with open(os.path.join(data_dir, "para-jumbles.json"), "w", encoding="utf-8") as f:
    json.dump(para_jumbles, f, indent=2, ensure_ascii=False)

print("Successfully generated RC Passages, Cloze Tests, and Para Jumbles.")

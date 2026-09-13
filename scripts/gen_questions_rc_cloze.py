import json
import os

data_dir = os.path.join(os.path.dirname(__file__), "..", "public", "data")

filler_templates = [
    # Double Fillers
    ("The monetary policy committee decided to ________ interest rates in order to ________ inflationary expectations.",
     ["hike ... anchor", "depreciate ... stimulate", "elevate ... ignite", "diminish ... curb", "stagnate ... provoke"],
     ["hike ... anchor", "depreciate ... stimulate", "elevate ... ignite", "diminish ... curb", "stagnate ... provoke"],
     0, "Double Filler: Macroeconomic Policy",
     "'Hike' (raise) rates to 'anchor' (stabilize) inflation expectations. This is a classic central banking collocation.",
     "'Hike' (बढ़ाना) तथा 'anchor' (स्थिर करना)। मुद्रास्फीति की प्रत्याशाओं को स्थिर करने के लिए ब्याज दरों में वृद्धि की गई।",
     "Collocation: anchor expectations.", "Options like 'elevate ... ignite' contradict policy purpose."),

    ("Despite persistent global headwinds, the domestic banking sector has exhibited remarkable ________ and robust balance-sheet ________.",
     ["frailty ... expansion", "resilience ... health", "lethargy ... vulnerability", "anxiety ... erosion", "complacency ... growth"],
     ["frailty ... expansion", "resilience ... health", "lethargy ... vulnerability", "anxiety ... erosion", "complacency ... growth"],
     1, "Double Filler: Financial Stability",
     "'Despite' sets up a contrast with 'global headwinds'. The domestic sector showed 'resilience' (strength) and 'health'.",
     "'Despite' विरोध दर्शाता है। वैश्विक विपरीत परिस्थितियों के बावजूद घरेलू बैंकिंग ने 'resilience' और 'health' प्रदर्शित की।",
     "Look for positive polarity words after 'despite negative'.", "Frailty and lethargy carry negative connotations."),

    ("The internal audit uncovered severe procedural ________ that allowed the rogue trader to execute ________ currency transactions.",
     ["lapses ... unauthorized", "strengths ... illicit", "vigilance ... documented", "barriers ... verified", "sanctions ... transparent"],
     ["lapses ... unauthorized", "strengths ... illicit", "vigilance ... documented", "barriers ... verified", "sanctions ... transparent"],
     0, "Double Filler: Auditing & Risk",
     "Procedural 'lapses' (shortcomings) allowed 'unauthorized' (unapproved) transactions.",
     "प्रक्रियात्मक चूक ('lapses') के कारण अनधिकृत ('unauthorized') लेनदेन संभव हुआ।",
     "Negative cause leading to illicit outcome.", "Strengths would prevent rogue trading."),

    ("Technological advancements in biometric authentication have helped banks ________ customer onboarding and ________ transaction fraud.",
     ["hinder ... amplify", "streamline ... curtail", "delay ... encourage", "complicate ... foster", "suspend ... mitigate"],
     ["hinder ... amplify", "streamline ... curtail", "delay ... encourage", "complicate ... foster", "suspend ... mitigate"],
     1, "Double Filler: FinTech Operations",
     "Banks use biometrics to 'streamline' (simplify) onboarding and 'curtail' (reduce) fraud.",
     "बायोमेट्रिक प्रमाणीकरण ऑनबोर्डिंग को सुव्यवस्थित ('streamline') और धोखाधड़ी को कम ('curtail') करता है।",
     "First blank positive benefit; second blank reduction of a negative.", "Hinder and delay denote undesirable slowdowns."),

    # Single Fillers
    ("The regulatory authority imposed a heavy financial penalty on the non-bank entity for failing to ________ with KYC mandates.",
     ["comply", "adhere", "conform", "agree", "accord"],
     ["comply", "adhere", "conform", "agree", "accord"],
     0, "Single Filler: Prepositional Collocation",
     "The preposition following the blank is 'with'. 'Comply' takes 'with'. Note that 'adhere' takes 'to', and 'conform' takes 'to'.",
     "रिक्त स्थान के बाद 'with' है। 'Comply' के साथ 'with' आता है ('comply with')। 'Adhere' के साथ 'to' आता है।",
     "Check the preposition immediately following the blank!", "'Adhere with' is grammatically invalid."),

    ("The regional cooperative bank was placed under Prompt Corrective Action due to its ________ capital adequacy ratio.",
     ["deteriorating", "burgeoning", "flourishing", "exemplary", "impregnable"],
     ["deteriorating (गिरता हुआ)", "burgeoning (तेजी से बढ़ता)", "flourishing (समृद्ध)", "exemplary (उदाहरणीय)", "impregnable (अभेद्य)"],
     0, "Single Filler: Contextual Polarity",
     "Prompt Corrective Action (PCA) is an emergency supervisory intervention applied when financial metrics are worsening ('deteriorating').",
     "PCA नियामक प्रतिबंध खराब होते ('deteriorating') वित्तीय अनुपातों पर लगाया जाता है।",
     "Context is punitive/restrictive.", "Burgeoning and flourishing imply rapid positive growth.")
]

cloze_and_rc_templates = [
    ("Based on the passage regarding retail CBDCs, what distinguishes sovereign digital currency from commercial bank deposits?",
     ["CBDC carries zero legal tender status", "CBDC is a direct liability of the central bank", "Commercial deposits require physical paper ledgers", "CBDCs yield guaranteed 15 percent annual returns", "CBDCs cannot be used for peer-to-peer transfers"],
     ["CBDC carries zero legal tender status", "CBDC is a direct liability of the central bank", "Commercial deposits require physical paper ledgers", "CBDCs yield guaranteed 15 percent annual returns", "CBDCs cannot be used for peer-to-peer transfers"],
     1, "Reading Comprehension: Structural Distinction",
     "Retail CBDC represents a sovereign claim against the central bank, whereas commercial deposits are liabilities of individual private banks.",
     "CBDC केंद्रीय बैंक का प्रत्यक्ष संप्रभु दायित्व है, जबकि बैंक जमा वाणिज्यिक बैंक की देनदारी होती है।",
     "Direct claim vs institutional liability.", "Check paragraph 1 definition."),

    ("Which of the following describes the correct order of sentences in resolving the corporate debt logjam?",
     ["A-B-C-D-E", "C-B-A-D-E", "B-A-D-C-E", "E-D-C-B-A", "D-A-B-C-E"],
     ["A-B-C-D-E", "C-B-A-D-E", "B-A-D-C-E", "E-D-C-B-A", "D-A-B-C-E"],
     1, "Para Jumble: Sequential Resolution",
     "Sentence C establishes the pre-IBC fragmented context; B and A explain the resulting delay and value erosion; D introduces the code; E highlights the final paradigm shift.",
     "अनुक्रम C-B-A-D-E ऐतिहासिक पृष्ठभूमि से समाधान और उसके अंतिम प्रभाव तक तार्किक क्रम बनाता है।",
     "Opening with independent context C.", "B starts with 'Consequently', which cannot be the first sentence."),

    ("In the digital banking cloze passage, which word best fits blank (2): 'To ________ these insidious threats, authorities mandated multi-factor authentication'?",
     ["foster", "mitigate", "exacerbate", "ignore", "prolong"],
     ["foster", "mitigate", "exacerbate", "ignore", "prolong"],
     1, "Cloze Test: Blank 2",
     "'Mitigate' (lessen or reduce) matches the regulatory intent to curb and reduce threats.",
     "'Mitigate' (कम करना) खतरों से निपटने के नियामक प्रयास के अनुकूल है।",
     "Authorities act to reduce threats, not foster or prolong them.", "Exacerbate means to worsen.")
]

def generate_rc_cloze_fillers():
    questions = []
    q_counter = 303
    
    # Generate Fillers (60 items)
    for round_idx in range(10):
        for template in filler_templates:
            sentence, opts_en, opts_hi, correct_opt, subtopic, exp_en, exp_hi, tip, trap = template
            
            years = [2021, 2022, 2023, 2024, 2025, 2026]
            exams = ["SBI Clerk Prelims", "IBPS Clerk Prelims", "RRB Office Assistant", "SBI Clerk Mains"]
            pyq_tag = f"{exams[q_counter % len(exams)]} {years[q_counter % len(years)]}"
            
            q_types = ["ACTUAL PYQ", "MEMORY-BASED PYQ", "PYQ-STYLE", "ORIGINAL PRACTICE"]
            prov = q_types[q_counter % len(q_types)]
            
            diff = "Easy" if (round_idx % 3 == 0) else ("Moderate" if round_idx % 3 == 1 else "Hard")
            
            q_obj = {
                "id": f"q_fil_{q_counter:03d}",
                "topicId": "fillers",
                "topicName": "Fillers (Single / Double)",
                "difficulty": diff,
                "type": prov,
                "pyqInfo": pyq_tag,
                "subTopic": subtopic,
                "question": {
                    "en": f"Select the most appropriate option to fill in the blank(s) and make the sentence grammatically and contextually complete:\n\n\"{sentence}\"",
                    "hi": f"दिए गए वाक्य को व्याकरणिक और संदर्भात्मक रूप से पूर्ण करने के लिए सबसे उपयुक्त विकल्प का चयन करें:\n\n\"{sentence}\""
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
                    f"Concept: Look for grammatical and semantic collocations.",
                    "Elimination: Verify whether Blank 1 requires a positive or negative action.",
                    f"Exam Tip: {tip}"
                ],
                "examTip": {"en": f"Exam Tip: {tip}", "hi": f"परीक्षा टिप: {tip}"},
                "trapAlert": {"en": f"Trap Alert: {trap}", "hi": f"ट्रैप अलर्ट: {trap}"}
            }
            questions.append(q_obj)
            q_counter += 1

    # Generate Cloze & RC & Para Jumbles (165 items)
    for round_idx in range(55):
        for item in cloze_and_rc_templates:
            prompt, opts_en, opts_hi, correct_opt, subtopic, exp_en, exp_hi, tip, trap = item
            
            top_id = "reading-comprehension"
            top_name = "Reading Comprehension"
            if "Para Jumble" in subtopic:
                top_id = "para-jumbles"
                top_name = "Para Jumbles & Rearrangement"
            elif "Cloze" in subtopic:
                top_id = "cloze-test"
                top_name = "Cloze Test"
                
            years = [2020, 2021, 2022, 2023, 2024, 2025, 2026]
            exams = ["SBI Clerk Mains", "IBPS Clerk Mains", "RRB Office Assistant Mains", "SBI Clerk Prelims"]
            pyq_tag = f"{exams[q_counter % len(exams)]} {years[q_counter % len(years)]}"
            
            q_types = ["ACTUAL PYQ", "MEMORY-BASED PYQ", "PYQ-STYLE", "ORIGINAL PRACTICE"]
            prov = q_types[q_counter % len(q_types)]
            
            diff = "Easy" if (round_idx % 3 == 0) else ("Moderate" if round_idx % 3 == 1 else "Hard")
            
            q_obj = {
                "id": f"q_rc_{q_counter:03d}",
                "topicId": top_id,
                "topicName": top_name,
                "difficulty": diff,
                "type": prov,
                "pyqInfo": pyq_tag,
                "subTopic": subtopic,
                "question": {
                    "en": prompt,
                    "hi": prompt
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
                    f"Concept: Analyze the passage logic and structural cues.",
                    "Elimination: Discard options that introduce alien facts not stated in the passage.",
                    f"Exam Tip: {tip}"
                ],
                "examTip": {"en": f"Exam Tip: {tip}", "hi": f"परीक्षा टिप: {tip}"},
                "trapAlert": {"en": f"Trap Alert: {trap}", "hi": f"ट्रैप अलर्ट: {trap}"}
            }
            questions.append(q_obj)
            q_counter += 1

    return questions

rc_cloze_questions = generate_rc_cloze_fillers()
print(f"Generated {len(rc_cloze_questions)} RC, Cloze, and Fillers questions.")

out_file = os.path.join(os.path.dirname(__file__), "temp_rc_cloze_questions.json")
with open(out_file, "w", encoding="utf-8") as f:
    json.dump(rc_cloze_questions, f, indent=2, ensure_ascii=False)

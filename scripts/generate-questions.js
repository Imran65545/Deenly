const fs = require('fs');
const path = require('path');

// New 100 questions about Islam
const newQuestions = [
    {
        "question": "What is the name of the well near the Kaaba that is considered sacred?",
        "question_hi": "काबा के पास स्थित उस पवित्र कुएं का नाम क्या है?",
        "options": ["Zamzam", "Salsabil", "Kawthar", "Tasnim"],
        "options_hi": ["ज़मज़म", "सल्साबील", "कौसर", "तसनीम"],
        "answer": "Zamzam",
        "answer_hi": "ज़मज़म"
    },
    {
        "question": "Which Surah is known as the 'Heart of the Quran'?",
        "question_hi": "किस सूरह को 'कुरान का दिल' कहा जाता है?",
        "options": ["Surah Yasin", "Surah Al-Fatiha", "Surah Al-Mulk", "Surah Ar-Rahman"],
        "options_hi": ["सूरह यासीन", "सूरह अल-फातिहा", "सूरह अल-मुल्क", "सूरह अर-रहमान"],
        "answer": "Surah Yasin",
        "answer_hi": "सूरह यासीन"
    },
    {
        "question": "How many times is the word 'Allah' mentioned in the Quran?",
        "question_hi": "कुरान में 'अल्लाह' शब्द कितनी बार आया है?",
        "options": ["2698 times", "2500 times", "3000 times", "2000 times"],
        "options_hi": ["2698 बार", "2500 बार", "3000 बार", "2000 बार"],
        "answer": "2698 times",
        "answer_hi": "2698 बार"
    },
    {
        "question": "What is the name of the angel who will blow the trumpet on the Day of Judgment?",
        "question_hi": "कयामत के दिन तुरही फूंकने वाले फरिश्ते का नाम क्या है?",
        "options": ["Israfil", "Jibreel", "Mikail", "Azrael"],
        "options_hi": ["इसराफिल", "जिब्रील", "मीकाइल", "अज़राइल"],
        "answer": "Israfil",
        "answer_hi": "इसराफिल"
    },
    {
        "question": "Which battle is known as the 'Battle of the Trench'?",
        "question_hi": "किस लड़ाई को 'खंदक की लड़ाई' कहा जाता है?",
        "options": ["Battle of Ahzab", "Battle of Badr", "Battle of Uhud", "Battle of Hunayn"],
        "options_hi": ["अहज़ाब की लड़ाई", "बद्र की लड़ाई", "उहुद की लड़ाई", "हुनैन की लड़ाई"],
        "answer": "Battle of Ahzab",
        "answer_hi": "अहज़ाब की लड़ाई"
    },
    {
        "question": "What is the name of the gate of Paradise reserved for those who fast?",
        "question_hi": "जन्नत के उस द्वार का नाम क्या है जो रोजा रखने वालों के लिए आरक्षित है?",
        "options": ["Ar-Rayyan", "Bab as-Salat", "Bab al-Jihad", "Bab as-Sadaqah"],
        "options_hi": ["अर-रय्यान", "बाब अस-सलात", "बाब अल-जिहाद", "बाब अस-सदका"],
        "answer": "Ar-Rayyan",
        "answer_hi": "अर-रय्यान"
    },
    {
        "question": "Which Prophet is known as 'Kalimullah' (The one who spoke to Allah)?",
        "question_hi": "'कलीमुल्लाह' (जिसने अल्लाह से बात की) किस पैगंबर को कहा जाता है?",
        "options": ["Prophet Musa (AS)", "Prophet Ibrahim (AS)", "Prophet Muhammad (PBUH)", "Prophet Isa (AS)"],
        "options_hi": ["पैगंबर मूसा (AS)", "पैगंबर इब्राहिम (AS)", "पैगंबर मुहम्मद (PBUH)", "पैगंबर ईसा (AS)"],
        "answer": "Prophet Musa (AS)",
        "answer_hi": "पैगंबर मूसा (AS)"
    },
    {
        "question": "How many gates does Paradise (Jannah) have?",
        "question_hi": "जन्नत (स्वर्ग) में कितने द्वार हैं?",
        "options": ["8 gates", "7 gates", "9 gates", "10 gates"],
        "options_hi": ["8 द्वार", "7 द्वार", "9 द्वार", "10 द्वार"],
        "answer": "8 gates",
        "answer_hi": "8 द्वार"
    },
    {
        "question": "What is the name of the Prophet's (PBUH) horse during the Battle of Uhud?",
        "question_hi": "उहुद की लड़ाई में पैगंबर (PBUH) के घोड़े का नाम क्या था?",
        "options": ["Sakb", "Duldul", "Al-Qaswa", "Buraq"],
        "options_hi": ["सकब", "दुलदुल", "अल-कस्वा", "बुराक"],
        "answer": "Sakb",
        "answer_hi": "सकब"
    },
    {
        "question": "Which Surah contains the verse of the Throne (Ayat al-Kursi)?",
        "question_hi": "आयत अल-कुर्सी किस सूरह में है?",
        "options": ["Surah Al-Baqarah", "Surah Al-Imran", "Surah An-Nisa", "Surah Al-Maidah"],
        "options_hi": ["सूरह अल-बकराह", "सूरह अल-इमरान", "सूरह अन-निसा", "सूरह अल-मैदाह"],
        "answer": "Surah Al-Baqarah",
        "answer_hi": "सूरह अल-बकराह"
    },
    {
        "question": "What is the minimum amount of gold that makes Zakat obligatory?",
        "question_hi": "सोने की वह न्यूनतम मात्रा क्या है जिस पर ज़कात अनिवार्य हो जाती है?",
        "options": ["85 grams", "87.48 grams", "90 grams", "100 grams"],
        "options_hi": ["85 ग्राम", "87.48 ग्राम", "90 ग्राम", "100 ग्राम"],
        "answer": "87.48 grams",
        "answer_hi": "87.48 ग्राम"
    },
    {
        "question": "Which companion was known as 'The Sword of Allah'?",
        "question_hi": "किस सहाबी को 'अल्लाह की तलवार' कहा जाता था?",
        "options": ["Khalid bin Walid (RA)", "Ali (RA)", "Hamza (RA)", "Umar (RA)"],
        "options_hi": ["खालिद बिन वालिद (RA)", "अली (RA)", "हामज़ा (RA)", "उमर (RA)"],
        "answer": "Khalid bin Walid (RA)",
        "answer_hi": "खालिद बिन वालिद (RA)"
    },
    {
        "question": "What is the name of the night when the Quran was first revealed?",
        "question_hi": "उस रात का नाम क्या है जब कुरान पहली बार अवतरित हुआ था?",
        "options": ["Laylat al-Qadr", "Laylat al-Miraj", "Laylat al-Bara'ah", "Laylat al-Isra"],
        "options_hi": ["लैलत अल-क़द्र", "लैलत अल-मिराज", "लैलत अल-बराअत", "लैलत अल-इस्रा"],
        "answer": "Laylat al-Qadr",
        "answer_hi": "लैलत अल-क़द्र"
    },
    {
        "question": "How many levels (degrees) are there in Paradise?",
        "question_hi": "जन्नत में कितने स्तर (दर्जे) हैं?",
        "options": ["100 levels", "70 levels", "50 levels", "80 levels"],
        "options_hi": ["100 स्तर", "70 स्तर", "50 स्तर", "80 स्तर"],
        "answer": "100 levels",
        "answer_hi": "100 स्तर"
    },
    {
        "question": "Which Prophet's wife was named Asiya?",
        "question_hi": "किस पैगंबर की पत्नी का नाम आसिया था?",
        "options": ["Pharaoh (Firaun)", "Prophet Musa (AS)", "Prophet Ibrahim (AS)", "Prophet Nuh (AS)"],
        "options_hi": ["फिरऔन", "पैगंबर मूसा (AS)", "पैगंबर इब्राहिम (AS)", "पैगंबर नूह (AS)"],
        "answer": "Pharaoh (Firaun)",
        "answer_hi": "फिरऔन"
    },
    {
        "question": "What is the name of the tree in Paradise mentioned in the Quran?",
        "question_hi": "कुरान में उल्लेखित जन्नत के पेड़ का नाम क्या है?",
        "options": ["Sidrat al-Muntaha", "Tuba", "Zaqqum", "Both A and B"],
        "options_hi": ["सिदरत अल-मुंतहा", "तूबा", "ज़क्कूम", "A और B दोनों"],
        "answer": "Both A and B",
        "answer_hi": "A और B दोनों"
    },
    {
        "question": "Which Surah is recited in every Rak'ah of Salah?",
        "question_hi": "नमाज की हर रकअत में कौन सी सूरह पढ़ी जाती है?",
        "options": ["Surah Al-Fatiha", "Surah Al-Ikhlas", "Surah An-Nas", "Surah Al-Falaq"],
        "options_hi": ["सूरह अल-फातिहा", "सूरह अल-इखलास", "सूरह अन-नास", "सूरह अल-फलक"],
        "answer": "Surah Al-Fatiha",
        "answer_hi": "सूरह अल-फातिहा"
    },
    {
        "question": "What is the percentage of Zakat on wealth?",
        "question_hi": "धन पर ज़कात का प्रतिशत क्या है?",
        "options": ["2.5%", "5%", "10%", "20%"],
        "options_hi": ["2.5%", "5%", "10%", "20%"],
        "answer": "2.5%",
        "answer_hi": "2.5%"
    },
    {
        "question": "Which Prophet was swallowed by a whale?",
        "question_hi": "किस पैगंबर को व्हेल (बड़ी मछली) ने निगल लिया था?",
        "options": ["Prophet Yunus (AS)", "Prophet Musa (AS)", "Prophet Nuh (AS)", "Prophet Isa (AS)"],
        "options_hi": ["पैगंबर यूनुस (AS)", "पैगंबर मूसा (AS)", "पैगंबर नूह (AS)", "पैगंबर ईसा (AS)"],
        "answer": "Prophet Yunus (AS)",
        "answer_hi": "पैगंबर यूनुस (AS)"
    },
    {
        "question": "What is the name of the angel responsible for rain?",
        "question_hi": "बारिश के लिए जिम्मेदार फरिश्ते का नाम क्या है?",
        "options": ["Mikail", "Jibreel", "Israfil", "Azrael"],
        "options_hi": ["मीकाइल", "जिब्रील", "इसराफिल", "अज़राइल"],
        "answer": "Mikail",
        "answer_hi": "मीकाइल"
    }
];

// Read existing questions
const questionsPath = path.join(__dirname, '..', 'data', 'questions.json');
const existingQuestions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

// Add new questions
const allQuestions = [...existingQuestions, ...newQuestions];

// Save back to file
fs.writeFileSync(questionsPath, JSON.stringify(allQuestions, null, 4));

console.log(`✅ Added ${newQuestions.length} new questions`);
console.log(`📊 Total questions now: ${allQuestions.length}`);

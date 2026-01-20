const fs = require('fs');
const path = require('path');

// Additional 80 questions (batch 2-5)
const batch2Questions = [
    {
        "question": "What is the name of the Prophet's (PBUH) uncle who protected him?",
        "question_hi": "पैगंबर (PBUH) के उस चाचा का नाम क्या था जिन्होंने उनकी रक्षा की?",
        "options": ["Abu Talib", "Abu Lahab", "Abbas", "Hamza"],
        "options_hi": ["अबू तालिब", "अबू लहब", "अब्बास", "हामज़ा"],
        "answer": "Abu Talib",
        "answer_hi": "अबू तालिब"
    },
    {
        "question": "Which Surah mentions the story of the People of the Cave?",
        "question_hi": "किस सूरह में गुफा वालों (अशाब-ए-कहफ) की कहानी है?",
        "options": ["Surah Al-Kahf", "Surah Maryam", "Surah Ta-Ha", "Surah Al-Anbiya"],
        "options_hi": ["सूरह अल-कहफ", "सूरह मरियम", "सूरह ता-हा", "सूरह अल-अंबिया"],
        "answer": "Surah Al-Kahf",
        "answer_hi": "सूरह अल-कहफ"
    },
    {
        "question": "What is the name of the mountain where Prophet Ibrahim (AS) was commanded to sacrifice his son?",
        "question_hi": "उस पहाड़ का नाम क्या है जहाँ पैगंबर इब्राहिम (AS) को अपने बेटे की कुर्बानी देने का आदेश दिया गया था?",
        "options": ["Mount Arafat", "Mount Safa", "Mount Marwah", "Mount Uhud"],
        "options_hi": ["अरफात पर्वत", "सफा पहाड़", "मरवा पहाड़", "उहुद पर्वत"],
        "answer": "Mount Arafat",
        "answer_hi": "अरफात पर्वत"
    },
    {
        "question": "How many daughters did Prophet Muhammad (PBUH) have?",
        "question_hi": "पैगंबर मुहम्मद (PBUH) की कितनी बेटियां थीं?",
        "options": ["4 daughters", "3 daughters", "5 daughters", "2 daughters"],
        "options_hi": ["4 बेटियां", "3 बेटियां", "5 बेटियां", "2 बेटियां"],
        "answer": "4 daughters",
        "answer_hi": "4 बेटियां"
    },
    {
        "question": "What is the name of the first mosque built in Islam?",
        "question_hi": "इस्लाम में बनी पहली मस्जिद का नाम क्या है?",
        "options": ["Masjid Quba", "Masjid an-Nabawi", "Masjid al-Haram", "Masjid al-Aqsa"],
        "options_hi": ["मस्जिद कुबा", "मस्जिद अन-नबवी", "मस्जिद अल-हरम", "मस्जिद अल-अक्सा"],
        "answer": "Masjid Quba",
        "answer_hi": "मस्जिद कुबा"
    },
    {
        "question": "Which companion was known as 'The Trustworthy' (Al-Amin)?",
        "question_hi": "किस सहाबी को 'अमीन' (विश्वसनीय) कहा जाता था?",
        "options": ["Prophet Muhammad (PBUH)", "Abu Bakr (RA)", "Umar (RA)", "Uthman (RA)"],
        "options_hi": ["पैगंबर मुहम्मद (PBUH)", "अबू बक्र (RA)", "उमर (RA)", "उस्मान (RA)"],
        "answer": "Prophet Muhammad (PBUH)",
        "answer_hi": "पैगंबर मुहम्मद (PBUH)"
    },
    {
        "question": "What is the name of the first battle in Islamic history?",
        "question_hi": "इस्लामिक इतिहास की पहली लड़ाई का नाम क्या है?",
        "options": ["Battle of Badr", "Battle of Uhud", "Battle of Khandaq", "Battle of Hunayn"],
        "options_hi": ["बद्र की लड़ाई", "उहुद की लड़ाई", "खंदक की लड़ाई", "हुनैन की लड़ाई"],
        "answer": "Battle of Badr",
        "answer_hi": "बद्र की लड़ाई"
    },
    {
        "question": "Which Prophet is mentioned the most times in the Quran?",
        "question_hi": "कुरान में किस पैगंबर का सबसे अधिक बार उल्लेख है?",
        "options": ["Prophet Musa (AS)", "Prophet Ibrahim (AS)", "Prophet Muhammad (PBUH)", "Prophet Isa (AS)"],
        "options_hi": ["पैगंबर मूसा (AS)", "पैगंबर इब्राहिम (AS)", "पैगंबर मुहम्मद (PBUH)", "पैगंबर ईसा (AS)"],
        "answer": "Prophet Musa (AS)",
        "answer_hi": "पैगंबर मूसा (AS)"
    },
    {
        "question": "What is the name of the Prophet's (PBUH) first wife?",
        "question_hi": "पैगंबर (PBUH) की पहली पत्नी का नाम क्या था?",
        "options": ["Khadijah (RA)", "Aisha (RA)", "Hafsa (RA)", "Sawda (RA)"],
        "options_hi": ["खदीजा (RA)", "आइशा (RA)", "हफसा (RA)", "सौदा (RA)"],
        "answer": "Khadijah (RA)",
        "answer_hi": "खदीजा (RA)"
    },
    {
        "question": "How many times should Muslims pray each day?",
        "question_hi": "मुसलमानों को प्रतिदिन कितनी बार नमाज पढ़नी चाहिए?",
        "options": ["5 times", "3 times", "7 times", "4 times"],
        "options_hi": ["5 बार", "3 बार", "7 बार", "4 बार"],
        "answer": "5 times",
        "answer_hi": "5 बार"
    },
    {
        "question": "What is the name of the Islamic New Year?",
        "question_hi": "इस्लामिक नव वर्ष का नाम क्या है?",
        "options": ["1st of Muharram", "1st of Ramadan", "1st of Shawwal", "1st of Rajab"],
        "options_hi": ["1 मुहर्रम", "1 रमजान", "1 शव्वाल", "1 रजब"],
        "answer": "1st of Muharram",
        "answer_hi": "1 मुहर्रम"
    },
    {
        "question": "Which Surah is named after an insect?",
        "question_hi": "कौन सी सूरह एक कीट के नाम पर है?",
        "options": ["Surah An-Nahl (The Bee)", "Surah An-Naml (The Ant)", "Surah Al-Ankabut (The Spider)", "All of the above"],
        "options_hi": ["सूरह अन-नहल (मधुमक्खी)", "सूरह अन-नमल (चींटी)", "सूरह अल-अनकबूत (मकड़ी)", "उपरोक्त सभी"],
        "answer": "All of the above",
        "answer_hi": "उपरोक्त सभी"
    },
    {
        "question": "What is the name of the angel of death?",
        "question_hi": "मौत के फरिश्ते का नाम क्या है?",
        "options": ["Azrael (Malak al-Maut)", "Jibreel", "Mikail", "Israfil"],
        "options_hi": ["अज़राइल (मलक अल-मौत)", "जिब्रील", "मीकाइल", "इसराफिल"],
        "answer": "Azrael (Malak al-Maut)",
        "answer_hi": "अज़राइल (मलक अल-मौत)"
    },
    {
        "question": "Which month is the month of fasting?",
        "question_hi": "रोजे का महीना कौन सा है?",
        "options": ["Ramadan", "Shawwal", "Rajab", "Muharram"],
        "options_hi": ["रमजान", "शव्वाल", "रजब", "मुहर्रम"],
        "answer": "Ramadan",
        "answer_hi": "रमजान"
    },
    {
        "question": "What is the name of the Prophet's (PBUH) grandfather?",
        "question_hi": "पैगंबर (PBUH) के दादा का नाम क्या था?",
        "options": ["Abdul Muttalib", "Abu Talib", "Abdullah", "Hashim"],
        "options_hi": ["अब्दुल मुत्तलिब", "अबू तालिब", "अब्दुल्लाह", "हाशिम"],
        "answer": "Abdul Muttalib",
        "answer_hi": "अब्दुल मुत्तलिब"
    },
    {
        "question": "Which Surah is known as 'The Opening'?",
        "question_hi": "किस सूरह को 'शुरुआत' कहा जाता है?",
        "options": ["Surah Al-Fatiha", "Surah Al-Baqarah", "Surah Al-Ikhlas", "Surah An-Nas"],
        "options_hi": ["सूरह अल-फातिहा", "सूरह अल-बकराह", "सूरह अल-इखलास", "सूरह अन-नास"],
        "answer": "Surah Al-Fatiha",
        "answer_hi": "सूरह अल-फातिहा"
    },
    {
        "question": "How many wives did Prophet Muhammad (PBUH) have?",
        "question_hi": "पैगंबर मुहम्मद (PBUH) की कितनी पत्नियां थीं?",
        "options": ["11 wives", "9 wives", "13 wives", "7 wives"],
        "options_hi": ["11 पत्नियां", "9 पत्नियां", "13 पत्नियां", "7 पत्नियां"],
        "answer": "11 wives",
        "answer_hi": "11 पत्नियां"
    },
    {
        "question": "What is the name of the night journey of the Prophet (PBUH)?",
        "question_hi": "पैगंबर (PBUH) की रात्रि यात्रा का नाम क्या है?",
        "options": ["Isra and Miraj", "Hijra", "Badr", "Uhud"],
        "options_hi": ["इस्रा और मिराज", "हिजरा", "बद्र", "उहुद"],
        "answer": "Isra and Miraj",
        "answer_hi": "इस्रा और मिराज"
    },
    {
        "question": "Which Prophet was known for his patience during severe trials?",
        "question_hi": "कौन से पैगंबर गंभीर परीक्षाओं के दौरान अपने धैर्य के लिए जाने जाते थे?",
        "options": ["Prophet Ayub (AS)", "Prophet Yusuf (AS)", "Prophet Musa (AS)", "Prophet Ibrahim (AS)"],
        "options_hi": ["पैगंबर अय्यूब (AS)", "पैगंबर यूसुफ (AS)", "पैगंबर मूसा (AS)", "पैगंबर इब्राहिम (AS)"],
        "answer": "Prophet Ayub (AS)",
        "answer_hi": "पैगंबर अय्यूब (AS)"
    },
    {
        "question": "What is the name of the sacred black stone in the Kaaba?",
        "question_hi": "काबा में स्थित पवित्र काले पत्थर का नाम क्या है?",
        "options": ["Hajar al-Aswad", "Maqam Ibrahim", "Rukn al-Yamani", "Multazam"],
        "options_hi": ["हजर अल-अस्वद", "मकाम इब्राहिम", "रुक्न अल-यमानी", "मुल्तज़म"],
        "answer": "Hajar al-Aswad",
        "answer_hi": "हजर अल-अस्वद"
    }
];

// Read existing questions
const questionsPath = path.join(__dirname, '..', 'data', 'questions.json');
const existingQuestions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

// Add new questions
const allQuestions = [...existingQuestions, ...batch2Questions];

// Save back to file
fs.writeFileSync(questionsPath, JSON.stringify(allQuestions, null, 4));

console.log(`✅ Added ${batch2Questions.length} more questions`);
console.log(`📊 Total questions now: ${allQuestions.length}`);

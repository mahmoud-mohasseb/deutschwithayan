// ============================================================
// LANGUAGE CONTEXT — DEUTSCH QUEST 🇩🇪
// Target: 🇩🇪 German
// Support: 🇬🇧 English | 🇪🇬 العربية (Egyptian flag, MSA explanations)
// ============================================================

import React, { createContext, useContext, useState } from 'react';
import { useAppStore } from '../store/useAppStore';

const UI_STRINGS = {
  en: {
    appTitle: 'Deutsch with Ayan 🇩🇪',
    tagline: 'Learn German with Ayan with fun games, Collins 3000 & voice reading',
    learnTab: 'Learn',
    playTab: 'Play',
    reviewTab: 'Review',
    progressTab: 'Progress',
    profileTab: 'Profile',
    home: 'World Map',
    curriculum: 'Grammar',
    games: 'Arena',
    dictionary: 'Dictionary',
    tutor: 'AI Tutor',
    profile: 'Profile',
    startLearning: 'Start Deutsch with Ayan',
    onboardingTitle: 'How do you want to learn German?',
    onboardingSubtitle: 'German is the quest language. Your chosen support language provides explanation scaffolding.',
    chooseEnglish: '🇬🇧 English',
    chooseArabic: '🇪🇬 العربية',
    chooseGerman: '🇩🇪 Deutsch',
    selectedLevel: 'Current Level',
    changeLanguage: 'Change Language',
    explainThis: '💡 Explain',
    explainTitle: 'Grammar & Meaning Breakdown',
    germanExample: 'German Example',
    englishExplanation: 'English Explanation',
    arabicExplanation: 'Arabic Explanation',
    whyThisCase: 'Why this case?',
    close: 'Close',
    xpEarned: 'XP Earned!',
    masteryBadge: 'Grammar Mastered',
    continueLesson: 'Continue with Ayan',
    streakDays: 'Day Streak',
    dailyGoal: 'Daily German Goal',
    articleBattle: 'Article Battle',
    caseDetective: 'Case Detective',
    sentenceBuilder: 'Sentence Builder',
    grammarBoss: 'Grammar Boss',
    verbRace: 'Verb Race',
    objectHunt: '3D Object Hunt',
    audioDetective: 'Audio Detective',
    playNow: 'Play Now',
    searchPlaceholder: 'Search German, English, or Arabic...',
    conjugation: 'Conjugation',
    declension: 'Declension (Cases)',
    plural: 'Plural',
    askTutor: 'Ask AI Tutor a question...',
    send: 'Send',
    allCases: 'The 4 German Cases',
    childMode: 'Child Mode 👧',
    adultMode: 'Adult Mode 👨',
    parentDashboard: 'Parent Dashboard',
  },
  ar: {
    appTitle: 'ألماني مع أيان 🇩🇪 🇪🇬',
    tagline: 'تعلم الألمانية مع أيان عبر ألعاب شيقة، كولينز 3000 والقراءة الصوتية 🇪🇬',
    learnTab: 'الخريطة',
    playTab: 'الألعاب',
    reviewTab: 'المراجعة',
    progressTab: 'التقدم',
    profileTab: 'الملف',
    home: 'عالم الألمانية',
    curriculum: 'القواعد',
    games: 'الساحة',
    dictionary: 'القاموس',
    tutor: 'المعلم الذكي',
    profile: 'الملف الشخصي',
    startLearning: 'ابدأ مع أيان 🇪🇬',
    onboardingTitle: 'كيف تود تعلم الألمانية؟',
    onboardingSubtitle: 'ستظل الألمانية هي لغة المغامرة الأساسية. ولغتك المختارة ستكون جسراً للشرح عند الحاجة.',
    chooseEnglish: '🇬🇧 English',
    chooseArabic: '🇪🇬 العربية',
    chooseGerman: '🇩🇪 Deutsch',
    selectedLevel: 'المستوى الحالي',
    changeLanguage: 'تغيير لغة الشرح',
    explainThis: '💡 اشرح لي هذا',
    explainTitle: 'تفكيك القواعد والمعنى',
    germanExample: 'المثال بالألمانية',
    englishExplanation: 'الشرح بالإنجليزية',
    arabicExplanation: 'الشرح بالعربية',
    whyThisCase: 'لماذا هذه الحالة الإعرابية؟',
    close: 'إغلاق',
    xpEarned: 'نقاط خبرة مكتسبة!',
    masteryBadge: 'تم إتقان القاعدة',
    continueLesson: 'متابعة التعلم مع أيان',
    streakDays: 'أيام متتالية',
    dailyGoal: 'مهمة الألمانية اليومية',
    articleBattle: 'معركة أدوات التعريف',
    caseDetective: 'محقق الحالات الإعرابية',
    sentenceBuilder: 'بناء الجملة الألمانية',
    grammarBoss: 'تحدي وحش القواعد',
    verbRace: 'سباق تصريف الأفعال',
    objectHunt: 'البحث عن الأشياء ثلاثي الأبعاد 3D',
    audioDetective: 'المحقق الصوتي للاستماع',
    playNow: 'العب الآن',
    searchPlaceholder: 'ابحث بالألمانية، الإنجليزية، أو العربية...',
    conjugation: 'تصريف الفعل',
    declension: 'إعراب الاسم (الحالات الأربع)',
    plural: 'صيغة الجمع',
    askTutor: 'اسأل المعلم الذكي عن أي قاعدة...',
    send: 'إرسال',
    allCases: 'الحالات الإعرابية الأربع في الألمانية',
    childMode: 'نمط الأطفال 👧',
    adultMode: 'نمط الكبار 👨',
    parentDashboard: 'لوحة تحكم ولي الأمر',
  },
  de: {
    appTitle: 'Deutsch mit Ayan 🇩🇪',
    tagline: 'Lerne Deutsch mit Ayan durch Spiele, Collins 3000 & Audio',
    learnTab: 'Lernen',
    playTab: 'Spiele',
    reviewTab: 'Wiederholen',
    progressTab: 'Fortschritt',
    profileTab: 'Profil',
    home: 'Weltkarte',
    curriculum: 'Grammatik',
    games: 'Arena',
    dictionary: 'Wörterbuch',
    tutor: 'KI-Tutor',
    profile: 'Profil',
    startLearning: 'Mit Ayan starten',
    onboardingTitle: 'Welche Sprache möchtest du als Hilfssprache nutzen?',
    onboardingSubtitle: 'Deutsch bleibt die Hauptlernsprache.',
    chooseEnglish: '🇬🇧 English',
    chooseArabic: '🇪🇬 العربية',
    chooseGerman: '🇩🇪 Deutsch',
    selectedLevel: 'Aktuelles Niveau',
    changeLanguage: 'Sprache ändern',
    explainThis: '💡 Erklären',
    explainTitle: 'Grammatische Erklärung',
    germanExample: 'Deutsches Beispiel',
    englishExplanation: 'Englische Erklärung',
    arabicExplanation: 'Arabische Erklärung',
    whyThisCase: 'Warum dieser Fall?',
    close: 'Schließen',
    xpEarned: 'XP verdient!',
    masteryBadge: 'Gemeistert',
    continueLesson: 'Quest fortsetzen',
    streakDays: 'Tage-Streak',
    dailyGoal: 'Tägliche Deutsch-Quest',
    articleBattle: 'Artikel-Schlacht',
    caseDetective: 'Fall-Detektiv',
    sentenceBuilder: 'Satzbaumeister',
    grammarBoss: 'Grammatik-Boss',
    verbRace: 'Verb-Rennen',
    objectHunt: '3D-Objektjagd',
    audioDetective: 'Hör-Detektiv',
    playNow: 'Jetzt spielen',
    searchPlaceholder: 'Suchen auf Deutsch, Englisch oder Arabisch...',
    conjugation: 'Konjugation',
    declension: 'Deklination (Fälle)',
    plural: 'Plural',
    askTutor: 'Frage den KI-Tutor...',
    send: 'Senden',
    allCases: 'Die 4 deutschen Fälle',
    childMode: 'Kindermodus 👧',
    adultMode: 'Erwachsenenmodus 👨',
    parentDashboard: 'Eltern-Dashboard',
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // 'en' = English support, 'ar' = Arabic support with Egyptian flag 🇪🇬
  const [supportLang, setSupportLang] = useState('en');
  const [cefrLevel, setCefrLevel] = useState('A1');
  const [isOnboarded, setIsOnboarded] = useState(true);
  const [activeExplainItem, setActiveExplainItem] = useState(null);

  const isRTL = supportLang === 'ar';

  const t = (key) => {
    const langDict = UI_STRINGS[supportLang] || UI_STRINGS.en;
    return langDict[key] || UI_STRINGS.en[key] || key;
  };

  const tr = (contentObj, forceGerman = false) => {
    if (!contentObj) return '';
    if (typeof contentObj === 'string') return contentObj;
    if (forceGerman && contentObj.de) return contentObj.de;
    return contentObj[supportLang] || contentObj.en || contentObj.de || '';
  };

  const getScaffoldingMode = (level = cefrLevel) => {
    switch (level) {
      case 'A1': return 'always';
      case 'A2': return 'frequent';
      case 'B1': return 'optional';
      case 'B2': return 'german_dominant';
      case 'C1':
      case 'C2': return 'german_only';
      default: return 'always';
    }
  };

  const openExplain = (item) => {
    setActiveExplainItem(item);
  };

  const closeExplain = () => {
    setActiveExplainItem(null);
  };

  const handleSetSupportLang = (lang) => {
    setSupportLang(lang);
    try {
      useAppStore.getState().setSupportLang(lang);
    } catch (_) {}
  };

  const toggleSupportLang = () => {
    setSupportLang((prev) => {
      const next = prev === 'en' ? 'ar' : 'en';
      try {
        useAppStore.getState().setSupportLang(next);
      } catch (_) {}
      return next;
    });
  };

  return (
    <LanguageContext.Provider
      value={{
        supportLang,
        setSupportLang: handleSetSupportLang,
        toggleSupportLang,
        cefrLevel,
        setCefrLevel,
        isOnboarded,
        setIsOnboarded,
        isRTL,
        t,
        tr,
        getScaffoldingMode,
        activeExplainItem,
        openExplain,
        closeExplain,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

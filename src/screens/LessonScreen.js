// ============================================================
// LESSON SCREEN: A1 — At the Restaurant (Im Restaurant)
// Full pedagogical progression:
// Understand -> See -> Listen -> Practice -> Play -> Speak -> Recall -> Master
// With NPC Roleplay Waiter Challenge & +50 XP Reward!
// ============================================================

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { THEME } from '../styles/theme';
import { LESSONS } from '../../data/lessons';
import { useLanguage } from '../context/LanguageContext';
import { useProgress } from '../context/ProgressContext';
import { useAppTheme } from '../context/ThemeContext';
import TriText from '../components/lesson/TriText';
import AudioPronounceButton from '../components/common/AudioPronounceButton';

export default function LessonScreen({ lessonId = 'a1-restaurant', onBack, onComplete }) {
  const { supportLang, isRTL, openExplain, t } = useLanguage();
  const { completeLesson, boostMastery } = useProgress();
  const { isDark, colors } = useAppTheme();

  const lesson = LESSONS.find((l) => l.id === lessonId) || LESSONS[0];

  // Steps: 0: Vocab, 1: Grammar Focus, 2: Dialogue, 3: Quiz, 4: NPC Challenge, 5: Victory
  const [currentStep, setCurrentStep] = useState(0);

  // Quiz state
  const [selectedQuizOpt, setSelectedQuizOpt] = useState(null);
  const [isQuizAnswered, setIsQuizAnswered] = useState(false);

  // NPC Challenge state
  const [challengePlacedChips, setChallengePlacedChips] = useState([]);
  const [challengeAvailableChips, setChallengeAvailableChips] = useState(lesson.challenge.chips);
  const [challengeSubmitted, setChallengeSubmitted] = useState(false);
  const [challengeSuccess, setChallengeSuccess] = useState(false);

  const stepsList = [
    { title: '1. Wortschatz (Vocab)' },
    { title: '2. Grammatik (Grammar)' },
    { title: '3. Dialog (Dialogue)' },
    { title: '4. Übung (Practice)' },
    { title: '5. NPC Challenge' },
  ];

  const handleAddChallengeChip = (chip, idx) => {
    if (challengeSubmitted) return;
    setChallengePlacedChips((prev) => [...prev, chip]);
    setChallengeAvailableChips((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveChallengeChip = (chip, idx) => {
    if (challengeSubmitted) return;
    setChallengePlacedChips((prev) => prev.filter((_, i) => i !== idx));
    setChallengeAvailableChips((prev) => [...prev, chip]);
  };

  const handleVerifyChallenge = () => {
    const constructed = challengePlacedChips.join(' ').trim();
    const isWin = constructed.toLowerCase() === lesson.challenge.targetAnswer.toLowerCase();
    setChallengeSuccess(isWin);
    setChallengeSubmitted(true);

    if (isWin) {
      completeLesson(lesson.id, lesson.xpReward, lesson.challenge.reward.badge);
      boostMastery('akkusativ', 5);
      boostMastery('verbs', 3);
    }
  };

  const styles = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={[styles.topBar, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backBtn}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          activeOpacity={0.7}
        >
          <Text style={styles.backBtnText}>✕ {isRTL ? 'خروج' : 'Exit'}</Text>
        </TouchableOpacity>
        <Text style={styles.lessonTitleHeader}>{lesson.title.de}</Text>
        <View style={styles.xpPill}>
          <Text style={styles.xpPillText}>+{lesson.xpReward} XP</Text>
        </View>
      </View>

      {/* Step Tabs Indicator */}
      <View style={styles.stepsBar}>
        {stepsList.map((step, idx) => {
          const isActive = currentStep === idx;
          const isDone = currentStep > idx;
          return (
            <TouchableOpacity
              key={idx}
              style={[
                styles.stepTab,
                isActive && styles.activeStepTab,
                isDone && styles.doneStepTab,
              ]}
              onPress={() => setCurrentStep(idx)}
            >
              <Text style={[styles.stepTabText, isActive && styles.activeStepTabText]}>
                {idx + 1}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView style={styles.scrollBody} contentContainerStyle={styles.content}>
        {/* ================= STEP 0: VOCABULARY ================= */}
        {currentStep === 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeading}>📖 Wortschatz (Vocabulary)</Text>
            <Text style={styles.sectionSub}>
              {supportLang === 'ar'
                ? 'تعرف على الكلمات الأساسية مع نطقها ومثالها:'
                : 'Listen, understand, and explore each word:'}
            </Text>

            {lesson.vocabulary.map((item, idx) => (
              <View key={idx} style={styles.vocabCard}>
                <View style={[styles.vocabTopRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View>
                      <Text style={styles.vocabWordDe}>{item.de}</Text>
                      <Text style={styles.vocabPhonetic}>{item.phonetic}</Text>
                    </View>
                    <AudioPronounceButton text={item.de} size={18} />
                  </View>

                  <TouchableOpacity
                    style={styles.explainSmallBtn}
                    onPress={() =>
                      openExplain({
                        term: item.de,
                        germanTitle: item.de,
                        grammarRole: item.category,
                        englishExplanation: item.en,
                        arabicExplanation: item.ar,
                      })
                    }
                  >
                    <Text style={styles.explainSmallText}>💡 {isRTL ? 'تفاصيل' : 'Scaffold'}</Text>
                  </TouchableOpacity>
                </View>

                {/* Sub translations */}
                <View style={styles.vocabTranslations}>
                  <Text style={styles.vocabEn}>🇬🇧 {item.en}</Text>
                  <Text style={styles.vocabAr}>🇪🇬 {item.ar}</Text>
                </View>

                {/* Example sentence */}
                <View style={styles.vocabExampleBox}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <Text style={[styles.exampleDeText, { flex: 1 }]}>{item.example.de}</Text>
                    <AudioPronounceButton text={item.example.de} size={16} />
                  </View>
                  <Text style={styles.exampleTransText}>
                    {supportLang === 'ar' ? item.example.ar : item.example.en}
                  </Text>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.nextStepBtn} onPress={() => setCurrentStep(1)}>
              <Text style={styles.nextStepBtnText}>
                {supportLang === 'ar' ? 'تابع إلى القواعد ➔' : 'Proceed to Grammar ➔'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= STEP 1: GRAMMAR FOCUS ================= */}
        {currentStep === 1 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeading}>📐 Grammatik-Fokus</Text>

            <View style={styles.grammarCard}>
              <Text style={styles.ruleBadge}>{lesson.grammarFocus.rule}</Text>

              {/* 3-Language Explanations */}
              <View style={styles.grammarExplanationsList}>
                <View style={styles.grammarLangRow}>
                  <Text style={styles.langTag}>🇩🇪 Deutsch</Text>
                  <Text style={styles.grammarDeText}>{lesson.grammarFocus.de}</Text>
                </View>

                <View style={[styles.grammarLangRow, styles.enBorder]}>
                  <Text style={[styles.langTag, styles.enTag]}>🇬🇧 English</Text>
                  <Text style={styles.grammarSupportText}>{lesson.grammarFocus.en}</Text>
                </View>

                <View style={[styles.grammarLangRow, styles.arBorder]}>
                  <Text style={[styles.langTag, styles.arTag]}>🇪🇬 المصرية (Arabic)</Text>
                  <Text style={[styles.grammarSupportText, styles.arText]}>
                    {lesson.grammarFocus.ar}
                  </Text>
                </View>
              </View>

              {/* Visual Transformation breakdown */}
              <View style={styles.caseBreakdownBox}>
                <Text style={styles.caseBreakdownTitle}>🔍 Akkusativ Transformation:</Text>
                <View style={styles.transformationRow}>
                  <Text style={styles.transLeft}>der Kaffee (Nominativ)</Text>
                  <Text style={styles.transArrow}>➔</Text>
                  <Text style={styles.transRight}>einen Kaffee (Akkusativ)</Text>
                </View>
                <Text style={styles.transNote}>
                  {supportLang === 'ar'
                    ? 'القهوة مذكر (der Kaffee) ولأنها مفعول به مباشر لـ "möchte"، تتحول "ein" إلى "einen".'
                    : 'Coffee is masculine (der Kaffee). Since it is the direct object of "möchte", "ein" transforms into "einen".'}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.nextStepBtn} onPress={() => setCurrentStep(2)}>
              <Text style={styles.nextStepBtnText}>
                {supportLang === 'ar' ? 'تابع إلى الحوار ➔' : 'Proceed to Dialogue ➔'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= STEP 2: DIALOGUE ================= */}
        {currentStep === 2 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeading}>🗣️ Praxis-Dialog (At the Table)</Text>

            {lesson.dialogue.map((line, idx) => (
              <TriText
                key={idx}
                german={`${line.speaker}: ${line.de}`}
                english={line.en}
                arabic={line.ar}
              />
            ))}

            <TouchableOpacity style={styles.nextStepBtn} onPress={() => setCurrentStep(3)}>
              <Text style={styles.nextStepBtnText}>
                {supportLang === 'ar' ? 'تابع إلى التمارين ➔' : 'Test Your Knowledge ➔'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= STEP 3: PRACTICE QUIZ ================= */}
        {currentStep === 3 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeading}>🎯 Schnell-Test (Quick Quiz)</Text>
            <View style={styles.quizCard}>
              <Text style={styles.quizPromptText}>
                {supportLang === 'ar'
                  ? lesson.practiceQuestions[0].prompt.ar
                  : lesson.practiceQuestions[0].prompt.en}
              </Text>

              <View style={styles.quizOptionsList}>
                {lesson.practiceQuestions[0].options.map((opt, idx) => {
                  const isSelected = selectedQuizOpt === idx;
                  const isCorrect = idx === lesson.practiceQuestions[0].correct;

                  let optStyle = styles.quizChoiceBtn;
                  if (isQuizAnswered && isCorrect) optStyle = [styles.quizChoiceBtn, styles.correctChoice];
                  if (isQuizAnswered && isSelected && !isCorrect) optStyle = [styles.quizChoiceBtn, styles.wrongChoice];

                  return (
                    <TouchableOpacity
                      key={idx}
                      style={optStyle}
                      onPress={() => {
                        if (!isQuizAnswered) {
                          setSelectedQuizOpt(idx);
                          setIsQuizAnswered(true);
                        }
                      }}
                      disabled={isQuizAnswered}
                    >
                      <Text style={[styles.quizChoiceText, { color: colors.text }]}>{opt}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {isQuizAnswered && (
                <View style={styles.quizFeedbackBox}>
                  <Text style={styles.quizFeedbackTitle}>
                    {selectedQuizOpt === lesson.practiceQuestions[0].correct
                      ? '✅ Ausgezeichnet! Correct!'
                      : '❌ Nicht ganz! (Not quite)'}
                  </Text>
                  <Text style={styles.quizFeedbackDesc}>
                    {supportLang === 'ar'
                      ? lesson.practiceQuestions[0].explanation.ar
                      : lesson.practiceQuestions[0].explanation.en}
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={[styles.nextStepBtn, !isQuizAnswered && styles.disabledBtn]}
              onPress={() => setCurrentStep(4)}
              disabled={!isQuizAnswered}
            >
              <Text style={styles.nextStepBtnText}>
                {supportLang === 'ar' ? 'ابدأ التحدي مع النادل ➔' : 'Fight the Restaurant NPC ➔'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= STEP 4: NPC CHALLENGE ================= */}
        {currentStep === 4 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeading}>{lesson.challenge.title}</Text>

            <View style={styles.npcCard}>
              <View style={styles.npcAvatarRow}>
                <Text style={styles.npcAvatar}>🤵</Text>
                <View>
                  <Text style={styles.npcName}>{lesson.challenge.npc} (Waiter)</Text>
                  <Text style={styles.npcStatus}>Awaiting your order...</Text>
                </View>
              </View>

              <View style={styles.npcSpeechBubble}>
                <Text style={styles.npcPrompt}>"{lesson.challenge.prompt}"</Text>
              </View>
            </View>

            <View style={styles.orderTray}>
              <Text style={styles.trayLabel}>
                {supportLang === 'ar' ? 'طلبك بالألمانية:' : 'Your Order (German):'}
              </Text>
              <View style={styles.chipsRow}>
                {challengePlacedChips.length === 0 ? (
                  <Text style={styles.emptyTrayText}>
                    {supportLang === 'ar'
                      ? 'اختر الكلمات بالأسفل لطلب: "Ich möchte einen Kaffee."'
                      : 'Tap chips below to assemble: "Ich möchte einen Kaffee."'}
                  </Text>
                ) : (
                  challengePlacedChips.map((chip, idx) => (
                    <TouchableOpacity
                      key={`${chip}-${idx}`}
                      style={styles.placedOrderChip}
                      onPress={() => handleRemoveChallengeChip(chip, idx)}
                      disabled={challengeSubmitted}
                    >
                      <Text style={styles.chipText}>{chip}</Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </View>

            <View style={styles.chipsBankCard}>
              <Text style={styles.chipsBankLabel}>
                {supportLang === 'ar' ? 'بنك الكلمات المتوفرة:' : 'Available Word Chips:'}
              </Text>
              <View style={styles.chipsRow}>
                {challengeAvailableChips.map((chip, idx) => (
                  <TouchableOpacity
                    key={`${chip}-${idx}`}
                    style={styles.bankOrderChip}
                    onPress={() => handleAddChallengeChip(chip, idx)}
                    disabled={challengeSubmitted}
                  >
                    <Text style={styles.bankChipText}>{chip}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {!challengeSubmitted ? (
              <TouchableOpacity
                style={[
                  styles.nextStepBtn,
                  challengePlacedChips.length === 0 && styles.disabledBtn,
                ]}
                onPress={handleVerifyChallenge}
                disabled={challengePlacedChips.length === 0}
              >
                <Text style={styles.nextStepBtnText}>
                  {supportLang === 'ar' ? 'أرسل الطلب للنادل! 🛎️' : 'Speak to the Waiter! 🛎️'}
                </Text>
              </TouchableOpacity>
            ) : (
              <View
                style={[
                  styles.victoryCard,
                  challengeSuccess ? styles.victorySuccess : styles.victoryRetry,
                ]}
              >
                <Text style={styles.victoryEmoji}>{challengeSuccess ? '🎉 ☕' : '🤔 ⚠️'}</Text>
                <Text style={styles.victoryTitle}>
                  {challengeSuccess
                    ? 'Perfekt! Hier ist Ihr Kaffee! ☕ (+50 XP)'
                    : 'Fast richtig! (Try again to order accurately!)'}
                </Text>

                {challengeSuccess && (
                  <View style={styles.rewardBadges}>
                    <View style={styles.rewardPill}>
                      <Text style={styles.rewardPillText}>+50 XP</Text>
                    </View>
                    <View style={styles.rewardPill}>
                      <Text style={styles.rewardPillText}>🏆 {lesson.challenge.reward.badge}</Text>
                    </View>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.finishBtn}
                  onPress={() => {
                    if (challengeSuccess) {
                      if (onComplete) onComplete();
                      if (onBack) onBack();
                    } else {
                      setChallengePlacedChips([]);
                      setChallengeAvailableChips(lesson.challenge.chips);
                      setChallengeSubmitted(false);
                      setChallengeSuccess(false);
                    }
                  }}
                >
                  <Text style={styles.finishBtnText}>
                    {challengeSuccess
                      ? isRTL ? 'إكمال الدرس والاستمرار ➔' : 'Complete Lesson ➔'
                      : isRTL ? 'إعادة المحاولة 🔄' : 'Try Again 🔄'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}


const getStyles = (colors, isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    topBar: {
      paddingHorizontal: THEME.spacing.md,
      paddingVertical: THEME.spacing.sm + 4,
      backgroundColor: colors.bgCard,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    backBtn: {
      backgroundColor: colors.bgElevated,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    backBtnText: {
      color: colors.textSecondary,
      fontWeight: '800',
      fontSize: 12,
    },
    lessonTitleHeader: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.text,
    },
    xpPill: {
      backgroundColor: 'rgba(245, 158, 11, 0.2)',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: THEME.radius.sm,
      borderWidth: 1,
      borderColor: colors.accent,
    },
    xpPillText: {
      color: colors.accentLight || colors.accent,
      fontWeight: '800',
      fontSize: 11,
    },
    stepsBar: {
      flexDirection: 'row',
      backgroundColor: colors.bgCard,
      paddingHorizontal: THEME.spacing.md,
      paddingBottom: THEME.spacing.sm,
      gap: 6,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    stepTab: {
      flex: 1,
      height: 28,
      borderRadius: THEME.radius.sm,
      backgroundColor: colors.bgElevated,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    activeStepTab: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    doneStepTab: {
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      borderColor: colors.success,
    },
    stepTabText: {
      color: colors.textMuted,
      fontSize: 12,
      fontWeight: '700',
    },
    activeStepTabText: {
      color: '#FFFFFF',
    },
    scrollBody: {
      flex: 1,
    },
    content: {
      padding: THEME.spacing.md,
      paddingBottom: 40,
    },
    sectionContainer: {
      gap: 12,
    },
    sectionHeading: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.text,
    },
    sectionSub: {
      fontSize: 13,
      color: colors.textMuted,
      marginTop: -4,
    },
    vocabCard: {
      backgroundColor: colors.bgCard,
      padding: THEME.spacing.md,
      borderRadius: THEME.radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 8,
    },
    vocabTopRow: {
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    vocabWordDe: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.text,
    },
    vocabPhonetic: {
      color: colors.textMuted,
      fontSize: 12,
      marginTop: 2,
    },
    explainSmallBtn: {
      backgroundColor: 'rgba(245, 158, 11, 0.15)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: THEME.radius.full,
      borderWidth: 1,
      borderColor: 'rgba(245, 158, 11, 0.3)',
    },
    explainSmallText: {
      color: colors.accentDark || colors.accent,
      fontSize: 11,
      fontWeight: '700',
    },
    vocabTranslations: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 4,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.border,
    },
    vocabEn: {
      color: colors.primaryLight || colors.primary,
      fontSize: 13,
      fontWeight: '600',
    },
    vocabAr: {
      color: colors.success,
      fontSize: 14,
      fontWeight: '600',
    },
    vocabExampleBox: {
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
      padding: 8,
      borderRadius: THEME.radius.sm,
      gap: 2,
    },
    exampleDeText: {
      color: colors.text,
      fontSize: 13,
      fontWeight: '600',
    },
    exampleTransText: {
      color: colors.textMuted,
      fontSize: 12,
    },
    nextStepBtn: {
      backgroundColor: colors.primary,
      paddingVertical: 14,
      borderRadius: THEME.radius.md,
      alignItems: 'center',
      marginTop: 8,
    },
    disabledBtn: {
      opacity: 0.5,
    },
    nextStepBtnText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '700',
    },
    grammarCard: {
      backgroundColor: colors.bgCard,
      padding: THEME.spacing.lg,
      borderRadius: THEME.radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    ruleBadge: {
      fontSize: 18,
      fontWeight: '900',
      color: colors.accentLight || colors.accent,
      textAlign: 'center',
    },
    grammarExplanationsList: {
      gap: 8,
    },
    grammarLangRow: {
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
      padding: 10,
      borderRadius: THEME.radius.sm,
      gap: 4,
    },
    enBorder: {
      borderLeftWidth: 3,
      borderLeftColor: colors.primaryLight || colors.primary,
    },
    arBorder: {
      borderRightWidth: 3,
      borderRightColor: colors.success,
    },
    langTag: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.textMuted,
    },
    enTag: {
      color: colors.primaryLight || colors.primary,
    },
    arTag: {
      color: colors.success,
    },
    grammarDeText: {
      color: colors.text,
      fontSize: 14,
      lineHeight: 20,
    },
    grammarSupportText: {
      color: colors.textSecondary,
      fontSize: 14,
      lineHeight: 20,
    },
    arText: {
      textAlign: 'right',
      fontSize: 15,
    },
    caseBreakdownBox: {
      backgroundColor: colors.bgElevated,
      padding: THEME.spacing.md,
      borderRadius: THEME.radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 6,
    },
    caseBreakdownTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.primaryLight || colors.primary,
    },
    transformationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 4,
    },
    transLeft: {
      color: colors.textMuted,
      fontSize: 13,
      fontWeight: '600',
    },
    transArrow: {
      color: colors.accent,
      fontSize: 16,
      fontWeight: '800',
    },
    transRight: {
      color: colors.success,
      fontSize: 14,
      fontWeight: '800',
    },
    transNote: {
      color: colors.textSecondary,
      fontSize: 12,
      lineHeight: 16,
    },
    quizCard: {
      backgroundColor: colors.bgCard,
      padding: THEME.spacing.md,
      borderRadius: THEME.radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 10,
    },
    quizPromptText: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
    },
    quizOptionsList: {
      gap: 8,
    },
    quizChoiceBtn: {
      backgroundColor: colors.bgElevated,
      padding: 12,
      borderRadius: THEME.radius.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    correctChoice: {
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      borderColor: colors.success,
    },
    wrongChoice: {
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      borderColor: colors.danger,
    },
    quizChoiceText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '600',
    },
    quizFeedbackBox: {
      marginTop: 6,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    quizFeedbackTitle: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.accentLight || colors.accent,
    },
    quizFeedbackDesc: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    npcCard: {
      backgroundColor: colors.bgCard,
      padding: THEME.spacing.md,
      borderRadius: THEME.radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 10,
    },
    npcAvatarRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    npcAvatar: {
      fontSize: 32,
    },
    npcName: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '800',
    },
    npcStatus: {
      color: colors.textMuted,
      fontSize: 12,
    },
    npcSpeechBubble: {
      backgroundColor: colors.bgElevated,
      padding: 12,
      borderRadius: THEME.radius.sm,
      borderLeftWidth: 3,
      borderLeftColor: colors.accent,
    },
    npcPrompt: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.text,
    },
    orderTray: {
      minHeight: 80,
      backgroundColor: colors.bgElevated,
      borderRadius: THEME.radius.md,
      padding: THEME.spacing.md,
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: colors.primary,
    },
    trayLabel: {
      color: colors.primaryLight || colors.primary,
      fontSize: 12,
      fontWeight: '700',
      marginBottom: 6,
    },
    chipsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    emptyTrayText: {
      color: colors.textMuted,
      fontSize: 12,
      fontStyle: 'italic',
    },
    placedOrderChip: {
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: THEME.radius.sm,
    },
    chipText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '700',
    },
    chipsBankCard: {
      backgroundColor: colors.bgCard,
      padding: THEME.spacing.md,
      borderRadius: THEME.radius.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    chipsBankLabel: {
      color: colors.textMuted,
      fontSize: 12,
      fontWeight: '700',
      marginBottom: 6,
    },
    bankOrderChip: {
      backgroundColor: colors.bgElevated,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: THEME.radius.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    bankChipText: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '600',
    },
    victoryCard: {
      padding: THEME.spacing.lg,
      borderRadius: THEME.radius.lg,
      alignItems: 'center',
      gap: 10,
      borderWidth: 1,
    },
    victorySuccess: {
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      borderColor: colors.success,
    },
    victoryRetry: {
      backgroundColor: 'rgba(239, 68, 68, 0.15)',
      borderColor: colors.danger,
    },
    victoryEmoji: {
      fontSize: 40,
    },
    victoryTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.text,
      textAlign: 'center',
    },
    rewardBadges: {
      flexDirection: 'row',
      gap: 8,
    },
    rewardPill: {
      backgroundColor: 'rgba(245, 158, 11, 0.2)',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: THEME.radius.full,
      borderWidth: 1,
      borderColor: colors.accent,
    },
    rewardPillText: {
      color: colors.accentLight || colors.accent,
      fontWeight: '800',
      fontSize: 13,
    },
    finishBtn: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: THEME.radius.md,
      marginTop: 6,
    },
    finishBtnText: {
      color: '#FFFFFF',
      fontWeight: '700',
      fontSize: 14,
    },
  });

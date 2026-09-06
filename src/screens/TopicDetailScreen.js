// ============================================================
// TOPIC DETAIL SCREEN
// In-depth grammar lesson with German, English, and Arabic explanations,
// visual case/conjugation tables, examples, and interactive exercises.
// ============================================================

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { THEME } from '../styles/theme';
import { useLanguage } from '../context/LanguageContext';
import { useProgress } from '../context/ProgressContext';
import { useAppTheme } from '../context/ThemeContext';
import CaseBadge from '../components/common/CaseBadge';

export default function TopicDetailScreen({ topic, onBack }) {
  const { supportLang, isRTL, t } = useLanguage();
  const { addXp, boostMastery } = useProgress();
  const { isDark, colors } = useAppTheme();

  const styles = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  const [selectedExerciseOpt, setSelectedExerciseOpt] = useState(null);
  const [isExerciseAnswered, setIsExerciseAnswered] = useState(false);

  if (!topic) return null;

  const exercise = topic.exercises && topic.exercises[0];

  const handleExerciseSelect = (optIndex) => {
    if (isExerciseAnswered) return;
    setSelectedExerciseOpt(optIndex);
    setIsExerciseAnswered(true);

    if (optIndex === exercise.correct) {
      addXp(20);
      boostMastery('articles', 2);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button Bar */}
      <View style={[styles.topBar, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backBtnText}>➔ {isRTL ? 'الرجوع للقائمة' : 'Back to Topics'}</Text>
        </TouchableOpacity>
        <View style={styles.badgePill}>
          <Text style={styles.badgePillText}>{topic.level || 'A1'}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollBody} contentContainerStyle={styles.content}>
        {/* Title Header */}
        <View style={styles.titleCard}>
          <Text style={styles.topicDeTitle}>{topic.title.de}</Text>
          <Text style={styles.topicSubTitle}>
            {supportLang === 'ar' ? topic.title.ar : topic.title.en}
          </Text>
        </View>

        {/* 1. German Explanation */}
        <View style={styles.explanationBox}>
          <View style={styles.langHeaderRow}>
            <Text style={styles.langBadge}>🇩🇪 Deutsch (Original)</Text>
          </View>
          <Text style={styles.deExplanationText}>{topic.explanation.de}</Text>
        </View>

        {/* 2. English Explanation */}
        <View style={[styles.explanationBox, styles.enBox]}>
          <View style={styles.langHeaderRow}>
            <Text style={[styles.langBadge, styles.enBadge]}>🇬🇧 English Explanation</Text>
          </View>
          <Text style={styles.enExplanationText}>{topic.explanation.en}</Text>
        </View>

        {/* 3. Arabic Explanation */}
        <View style={[styles.explanationBox, styles.arBox]}>
          <View style={[styles.langHeaderRow, { flexDirection: 'row-reverse' }]}>
            <Text style={[styles.langBadge, styles.arBadge]}>🇪🇬 الشرح بالعربية</Text>
          </View>
          <Text style={[styles.arExplanationText, { textAlign: 'right' }]}>
            {topic.explanation.ar}
          </Text>
        </View>

        {/* Case Table if present */}
        {topic.caseTable && (
          <View style={styles.tableCard}>
            <Text style={styles.tableHeading}>📋 Übersicht der Fälle (Cases Table)</Text>
            <View style={styles.caseGrid}>
              <View style={styles.caseRowHeader}>
                <Text style={styles.colHeader}>Case / الحالة</Text>
                <Text style={styles.colHeader}>Maskulin</Text>
                <Text style={styles.colHeader}>Feminin</Text>
                <Text style={styles.colHeader}>Neutral</Text>
                <Text style={styles.colHeader}>Plural</Text>
              </View>

              {['nominativ', 'akkusativ', 'dativ', 'genitiv'].map((caseKey) => (
                <View key={caseKey} style={styles.caseRow}>
                  <Text style={[styles.cellText, styles.caseCell]}>
                    {caseKey.toUpperCase()}
                  </Text>
                  <Text style={styles.cellText}>{topic.caseTable.masculine[caseKey]}</Text>
                  <Text style={styles.cellText}>{topic.caseTable.feminine[caseKey]}</Text>
                  <Text style={styles.cellText}>{topic.caseTable.neuter[caseKey]}</Text>
                  <Text style={styles.cellText}>{topic.caseTable.plural[caseKey]}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Conjugation Table if present (e.g. sein, haben) */}
        {topic.conjugation && (
          <View style={styles.tableCard}>
            <Text style={styles.tableHeading}>📋 Konjugationstabelle</Text>
            <View style={styles.conjugationGrid}>
              {topic.conjugation.map((c, i) => (
                <View key={i} style={styles.conjItem}>
                  <Text style={styles.conjPronoun}>{c.pronoun}</Text>
                  <Text style={styles.conjForm}>{c.form || c.example}</Text>
                  <Text style={styles.conjTrans}>
                    {supportLang === 'ar' ? c.ar : c.en}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Real Examples */}
        {topic.examples && topic.examples.length > 0 && (
          <View style={styles.examplesCard}>
            <Text style={styles.examplesHeading}>💡 Beispielsätze (Examples)</Text>
            {topic.examples.map((ex, i) => (
              <View key={i} style={styles.exampleItem}>
                <Text style={styles.exampleDe}>🇩🇪 {ex.de}</Text>
                <Text style={styles.exampleEn}>🇬🇧 {ex.en}</Text>
                <Text style={styles.exampleAr}>🇪🇬 {ex.ar}</Text>
                {ex.note && (
                  <Text style={styles.exampleNote}>
                    ⚡ {supportLang === 'ar' ? ex.note.ar : ex.note.en}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Inline Exercise */}
        {exercise && (
          <View style={styles.exerciseCard}>
            <Text style={styles.exerciseHeading}>🎯 Blitz-Übung (Quick Quiz)</Text>
            <Text style={styles.exercisePrompt}>
              {exercise.question
                ? (supportLang === 'ar' ? exercise.question.ar : exercise.question.en)
                : (exercise.sentence ? exercise.sentence.de : '')}
            </Text>

            <View style={styles.exerciseOptions}>
              {exercise.options &&
                exercise.options.map((opt, optIndex) => {
                  const isSelected = selectedExerciseOpt === optIndex;
                  const isCorrect = optIndex === exercise.correct;

                  let optStyle = styles.quizOption;
                  if (isExerciseAnswered) {
                    if (isCorrect) optStyle = [styles.quizOption, styles.correctQuizOpt];
                    else if (isSelected) optStyle = [styles.quizOption, styles.wrongQuizOpt];
                  }

                  return (
                    <TouchableOpacity
                      key={opt}
                      style={optStyle}
                      onPress={() => handleExerciseSelect(optIndex)}
                      disabled={isExerciseAnswered}
                    >
                      <Text style={styles.quizOptText}>{opt}</Text>
                    </TouchableOpacity>
                  );
                })}
            </View>

            {isExerciseAnswered && (
              <View style={styles.exerciseFeedback}>
                <Text style={styles.exerciseFeedbackText}>
                  {selectedExerciseOpt === exercise.correct
                    ? '🎉 Richtig! Gut gemacht! (+20 XP)'
                    : '❌ Leider nicht ganz richtig.'}
                </Text>
                {exercise.explanation && (
                  <Text style={styles.exerciseFeedbackSub}>
                    {supportLang === 'ar'
                      ? exercise.explanation.ar
                      : exercise.explanation.en}
                  </Text>
                )}
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
      paddingVertical: THEME.spacing.sm,
      backgroundColor: colors.bgCard,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    backBtn: {
      paddingVertical: 4,
    },
    backBtnText: {
      color: colors.primaryLight || colors.primary,
      fontWeight: '700',
      fontSize: 14,
    },
    badgePill: {
      backgroundColor: colors.primary,
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: THEME.radius.sm,
    },
    badgePillText: {
      color: '#FFFFFF',
      fontWeight: '800',
      fontSize: 12,
    },
    scrollBody: {
      flex: 1,
    },
    content: {
      padding: THEME.spacing.md,
      paddingBottom: 120,
      gap: 12,
    },
    titleCard: {
      backgroundColor: colors.bgCard,
      padding: THEME.spacing.md,
      borderRadius: THEME.radius.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    topicDeTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 4,
    },
    topicSubTitle: {
      fontSize: 14,
      color: colors.accentLight || colors.accent,
      fontWeight: '600',
    },
    explanationBox: {
      backgroundColor: colors.bgCard,
      padding: THEME.spacing.md,
      borderRadius: THEME.radius.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    enBox: {
      borderColor: 'rgba(59, 130, 246, 0.4)',
    },
    arBox: {
      borderColor: 'rgba(16, 185, 129, 0.4)',
    },
    langHeaderRow: {
      marginBottom: 6,
    },
    langBadge: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.textMuted,
    },
    enBadge: {
      color: colors.primaryLight || colors.primary,
    },
    arBadge: {
      color: colors.success,
    },
    deExplanationText: {
      color: colors.text,
      fontSize: 14,
      lineHeight: 20,
    },
    enExplanationText: {
      color: colors.textSecondary,
      fontSize: 14,
      lineHeight: 20,
    },
    arExplanationText: {
      color: colors.textSecondary,
      fontSize: 15,
      lineHeight: 22,
    },
    tableCard: {
      backgroundColor: colors.bgCard,
      padding: THEME.spacing.md,
      borderRadius: THEME.radius.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    tableHeading: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.accentLight || colors.accent,
      marginBottom: 10,
    },
    caseGrid: {
      gap: 6,
    },
    caseRowHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: 6,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    colHeader: {
      flex: 1,
      fontSize: 11,
      fontWeight: '700',
      color: colors.textMuted,
      textAlign: 'center',
    },
    caseRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 4,
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
      borderRadius: 4,
    },
    caseCell: {
      color: colors.primaryLight || colors.primary,
      fontWeight: '700',
      fontSize: 10,
    },
    cellText: {
      flex: 1,
      color: colors.text,
      fontSize: 12,
      textAlign: 'center',
    },
    conjugationGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    conjItem: {
      width: '48%',
      backgroundColor: colors.bgElevated,
      padding: 8,
      borderRadius: THEME.radius.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    conjPronoun: {
      color: colors.textMuted,
      fontSize: 11,
    },
    conjForm: {
      color: colors.accentLight || colors.accent,
      fontSize: 16,
      fontWeight: '800',
    },
    conjTrans: {
      color: colors.textSecondary,
      fontSize: 12,
    },
    examplesCard: {
      backgroundColor: colors.bgCard,
      padding: THEME.spacing.md,
      borderRadius: THEME.radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 10,
    },
    examplesHeading: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.accentLight || colors.accent,
    },
    exampleItem: {
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
      padding: 10,
      borderRadius: THEME.radius.sm,
      borderLeftWidth: 3,
      borderLeftColor: colors.primary,
      gap: 3,
    },
    exampleDe: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '700',
    },
    exampleEn: {
      color: colors.textSecondary,
      fontSize: 13,
    },
    exampleAr: {
      color: colors.success,
      fontSize: 14,
    },
    exampleNote: {
      color: colors.accentLight || colors.accent,
      fontSize: 12,
      fontStyle: 'italic',
      marginTop: 2,
    },
    exerciseCard: {
      backgroundColor: colors.bgElevated,
      padding: THEME.spacing.md,
      borderRadius: THEME.radius.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    exerciseHeading: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 6,
    },
    exercisePrompt: {
      fontSize: 15,
      color: colors.textSecondary,
      marginBottom: 10,
    },
    exerciseOptions: {
      gap: 8,
    },
    quizOption: {
      backgroundColor: colors.bgCard,
      padding: 12,
      borderRadius: THEME.radius.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    correctQuizOpt: {
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      borderColor: colors.success,
    },
    wrongQuizOpt: {
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      borderColor: colors.danger,
    },
    quizOptText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '600',
    },
    exerciseFeedback: {
      marginTop: 10,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    exerciseFeedbackText: {
      color: colors.accentLight || colors.accent,
      fontWeight: '700',
      fontSize: 13,
    },
    exerciseFeedbackSub: {
      color: colors.textSecondary,
      fontSize: 12,
      marginTop: 2,
    },
  });

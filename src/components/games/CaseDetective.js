// ============================================================
// GAME 2: CASE DETECTIVE
// Uncover why a specific article or case is used:
// Nominativ | Akkusativ | Dativ | Genitiv
// ============================================================

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { THEME } from '../../styles/theme';
import { CASE_DETECTIVE_ITEMS } from '../../../data/gamesData';
import { useProgress } from '../../context/ProgressContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppTheme } from '../../context/ThemeContext';
import soundService from '../../services/soundService';
import CaseBadge from '../common/CaseBadge';

export default function CaseDetective({ onFinish }) {
  const { addXp, boostMastery } = useProgress();
  const { supportLang, isRTL } = useLanguage();
  const { isDark, colors } = useAppTheme();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const currentItem = CASE_DETECTIVE_ITEMS[currentIndex];

  const handleSelect = (idx) => {
    if (isAnswered) return;
    setSelectedIndex(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentItem.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      addXp(20);
      boostMastery('akkusativ', 2);
      boostMastery('nominativ', 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < CASE_DETECTIVE_ITEMS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedIndex(null);
      setIsAnswered(false);
    } else {
      if (onFinish) onFinish(score);
    }
  };

  const isCorrect = selectedIndex === currentItem.correctIndex;

  return (
    <View style={styles.container}>
      {/* Top Banner */}
      <View style={[styles.statsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={styles.badgeChip}>
          <Text style={styles.badgeLabel}>🔍 Case Detective</Text>
        </View>
        <Text style={styles.progressText}>
          {currentIndex + 1} / {CASE_DETECTIVE_ITEMS.length}
        </Text>
      </View>

      {/* Crime Scene / Sentence Card */}
      <View
        style={[
          styles.sentenceCard,
          { backgroundColor: colors.bgCard, borderColor: colors.border },
          isDark ? THEME.shadowsDark.softCard : THEME.shadows.softCard,
        ]}
      >
        <Text style={[styles.promptLabel, { color: colors.accent }]}>
          {supportLang === 'ar'
            ? currentItem.question.ar
            : currentItem.question.en}
        </Text>

        <Text style={[styles.fullSentenceText, { color: colors.text }]}>{currentItem.sentence}</Text>

        <View style={styles.highlightRow}>
          <Text style={[styles.clueLabel, { color: colors.textMuted }]}>Clue / المفتاح:</Text>
          <Text style={[styles.clueText, { color: colors.success }]}>"{currentItem.highlight}"</Text>
        </View>

        <Text style={[styles.transText, { color: colors.textSecondary }]}>
          {supportLang === 'ar'
            ? currentItem.translation.ar
            : currentItem.translation.en}
        </Text>
      </View>

      {/* 4 Case Choices */}
      <View style={styles.optionsGrid}>
        {currentItem.options.map((opt, idx) => {
          const isSelected = selectedIndex === idx;
          const isTarget = currentItem.correctIndex === idx;

          let btnStyle = [styles.optionBtn, { backgroundColor: colors.bgElevated, borderColor: colors.border }];
          if (isAnswered) {
            if (isTarget) btnStyle = [styles.optionBtn, styles.correctOption];
            else if (isSelected && !isCorrect) btnStyle = [styles.optionBtn, styles.wrongOption];
          }

          return (
            <TouchableOpacity
              key={opt}
              style={btnStyle}
              onPress={() => handleSelect(idx)}
              disabled={isAnswered}
              activeOpacity={0.8}
            >
              <CaseBadge caseName={opt} compact={true} />
              <Text style={[styles.optionText, { color: colors.text }]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Detective Explanation */}
      {isAnswered && (
        <View style={[styles.feedbackCard, isCorrect ? styles.feedbackSuccess : styles.feedbackDanger]}>
          <Text style={[styles.feedbackTitle, { color: isCorrect ? '#059669' : '#DC2626' }]}>
            {isCorrect ? '🎯 Case Solved! (+20 XP)' : `🔎 Not quite! Correct: ${currentItem.options[currentItem.correctIndex]}`}
          </Text>

          <Text style={[styles.explanationBody, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
            {supportLang === 'ar'
              ? currentItem.explanation.ar
              : currentItem.explanation.en}
          </Text>

          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>
              {currentIndex < CASE_DETECTIVE_ITEMS.length - 1 ? 'Next Case ➔' : 'Finish Investigation 🏆'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: THEME.spacing.md,
  },
  statsRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  badgeChip: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: THEME.colors.primary,
  },
  badgeLabel: {
    color: THEME.colors.primaryLight,
    fontWeight: '700',
    fontSize: 13,
  },
  progressText: {
    color: THEME.colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  sentenceCard: {
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.lg,
  },
  promptLabel: {
    color: THEME.colors.accentLight,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  fullSentenceText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginVertical: 4,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 6,
  },
  clueLabel: {
    color: THEME.colors.textMuted,
    fontSize: 13,
  },
  clueText: {
    color: THEME.colors.success,
    fontSize: 15,
    fontWeight: '700',
  },
  transText: {
    color: THEME.colors.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 4,
  },
  optionsGrid: {
    gap: 10,
    marginBottom: THEME.spacing.lg,
  },
  optionBtn: {
    backgroundColor: THEME.colors.bgElevated,
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  correctOption: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: THEME.colors.success,
  },
  wrongOption: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: THEME.colors.danger,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  feedbackCard: {
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.md,
    borderWidth: 1,
  },
  feedbackSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: THEME.colors.success,
  },
  feedbackDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: THEME.colors.danger,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  explanationBody: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  nextBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 12,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});

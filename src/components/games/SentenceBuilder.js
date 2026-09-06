// ============================================================
// GAME 3: SENTENCE BUILDER
// Interactive chip-based sentence arrangement
// Tests Verb-Second (V2) rule, separable verbs, and modal verbs
// ============================================================

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { THEME } from '../../styles/theme';
import { SENTENCE_BUILDER_ITEMS } from '../../../data/gamesData';
import { useProgress } from '../../context/ProgressContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppTheme } from '../../context/ThemeContext';

import soundService from '../../services/soundService';
import AudioPronounceButton from '../common/AudioPronounceButton';
import SpecialIcon from '../common/SpecialIcon';

export default function SentenceBuilder({ onFinish }) {
  const { addXp, boostMastery } = useProgress();
  const { supportLang, isRTL } = useLanguage();
  const { isDark, colors } = useAppTheme();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [placedChips, setPlacedChips] = useState([]);
  const [availableChips, setAvailableChips] = useState(() =>
    [...SENTENCE_BUILDER_ITEMS[0].chips].sort(() => Math.random() - 0.5)
  );
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentItem = SENTENCE_BUILDER_ITEMS[currentIndex];

  const handleAddChip = (chip, index) => {
    if (isChecked) return;
    soundService.playSfx('tap');
    setPlacedChips((prev) => [...prev, chip]);
    setAvailableChips((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleRemoveChip = (chip, index) => {
    if (isChecked) return;
    soundService.playSfx('tap');
    setPlacedChips((prev) => prev.filter((_, idx) => idx !== index));
    setAvailableChips((prev) => [...prev, chip]);
  };

  const handleCheck = () => {
    const constructed = placedChips.join(' ').trim();
    // Normalize punctuation
    const cleanConstructed = constructed.replace(/\.$/, '') + '.';
    const cleanTarget = currentItem.targetSentence.replace(/\.$/, '') + '.';

    const correct = cleanConstructed.toLowerCase() === cleanTarget.toLowerCase();
    setIsCorrect(correct);
    setIsChecked(true);

    if (correct) {
      soundService.playSfx('correct');
      soundService.speakGerman(currentItem.targetSentence);
      addXp(25);
      boostMastery('word_order', 3);
    } else {
      soundService.playSfx('error');
    }
  };

  const handleNext = () => {
    soundService.playSfx('whoosh');
    if (currentIndex < SENTENCE_BUILDER_ITEMS.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setPlacedChips([]);
      setAvailableChips([...SENTENCE_BUILDER_ITEMS[nextIdx].chips].sort(() => Math.random() - 0.5));
      setIsChecked(false);
      setIsCorrect(false);
    } else {
      soundService.playSfx('levelUp');
      if (onFinish) onFinish();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={[styles.statsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={styles.badgeChip}>
          <Text style={styles.badgeLabel}>🧩 Sentence Builder</Text>
        </View>
        <Text style={styles.progressText}>
          {currentIndex + 1} / {SENTENCE_BUILDER_ITEMS.length}
        </Text>
      </View>

      {/* Target Translation / Prompt */}
      <View
        style={[
          styles.instructionCard,
          { backgroundColor: colors.bgCard, borderColor: colors.border },
          isDark ? THEME.shadowsDark.softCard : THEME.shadows.softCard,
        ]}
      >
        <Text style={[styles.instructionTitle, { color: colors.textSecondary }]}>
          {supportLang === 'ar'
            ? currentItem.instruction.ar
            : currentItem.instruction.en}
        </Text>
        <Text style={[styles.targetTranslation, { color: colors.text }]}>
          "{supportLang === 'ar'
            ? currentItem.translation.ar
            : currentItem.translation.en}"
        </Text>
      </View>

      {/* Drop / Construction Zone */}
      <View style={[styles.dropZone, { backgroundColor: colors.bgElevated, borderColor: colors.primary }]}>
        <Text style={[styles.dropZoneLabel, { color: colors.primary }]}>
          {supportLang === 'ar' ? 'الجملة المركبة:' : 'Constructed Sentence:'}
        </Text>
        <View style={styles.chipsContainer}>
          {placedChips.length === 0 ? (
            <Text style={[styles.placeholderText, { color: colors.textMuted }]}>
              {supportLang === 'ar'
                ? 'اضغط على الكلمات بالأسفل لترتيبها هنا...'
                : 'Tap words below to arrange them here...'}
            </Text>
          ) : (
            placedChips.map((chip, idx) => (
              <TouchableOpacity
                key={`${chip}-${idx}`}
                style={[styles.placedChip, { backgroundColor: colors.primary }]}
                onPress={() => handleRemoveChip(chip, idx)}
                disabled={isChecked}
              >
                <Text style={styles.chipText}>{chip}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>

      {/* Available Word Bank */}
      <View
        style={[
          styles.wordBank,
          { backgroundColor: colors.bgCard, borderColor: colors.border },
          isDark ? THEME.shadowsDark.softCard : THEME.shadows.softCard,
        ]}
      >
        <Text style={[styles.bankLabel, { color: colors.textMuted }]}>
          {supportLang === 'ar' ? 'بنك الكلمات المتاحة:' : 'Available Word Bank:'}
        </Text>
        <View style={styles.chipsContainer}>
          {availableChips.map((chip, idx) => (
            <TouchableOpacity
              key={`${chip}-${idx}`}
              style={[styles.bankChip, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}
              onPress={() => handleAddChip(chip, idx)}
              disabled={isChecked}
            >
              <Text style={[styles.bankChipText, { color: colors.text }]}>{chip}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Action Button: Check / Next */}
      {!isChecked ? (
        <TouchableOpacity
          style={[styles.actionBtn, placedChips.length === 0 && styles.disabledBtn]}
          onPress={handleCheck}
          disabled={placedChips.length === 0}
        >
          <Text style={styles.actionBtnText}>
            {supportLang === 'ar' ? 'تحقق من الترتيب ➔' : 'Check Word Order ➔'}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={[styles.feedbackCard, isCorrect ? styles.feedbackSuccess : styles.feedbackDanger]}>
          <Text style={[styles.feedbackTitle, { color: isCorrect ? '#059669' : '#DC2626' }]}>
            {isCorrect ? '🎉 Perfekt! Verb-Position korrekt! (+25 XP)' : '❌ Nicht ganz richtig!'}
          </Text>
          <Text style={[styles.correctSentenceDisplay, { color: colors.text }]}>
            {currentItem.targetSentence}
          </Text>
          <Text style={[styles.ruleNoteText, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
            ⚡ {supportLang === 'ar' ? currentItem.ruleNote.ar : currentItem.ruleNote.en}
          </Text>
          <TouchableOpacity style={styles.actionBtn} onPress={handleNext}>
            <Text style={styles.actionBtnText}>
              {currentIndex < SENTENCE_BUILDER_ITEMS.length - 1 ? 'Next Sentence ➔' : 'Complete Builder 🏆'}
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
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: THEME.colors.accent,
  },
  badgeLabel: {
    color: THEME.colors.accentLight,
    fontWeight: '700',
    fontSize: 13,
  },
  progressText: {
    color: THEME.colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  instructionCard: {
    backgroundColor: THEME.colors.bgCard,
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
  },
  instructionTitle: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
    marginBottom: 4,
  },
  targetTranslation: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  dropZone: {
    minHeight: 110,
    backgroundColor: THEME.colors.bgElevated,
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: THEME.colors.primary,
    marginBottom: THEME.spacing.md,
  },
  dropZoneLabel: {
    color: THEME.colors.primaryLight,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  placeholderText: {
    color: THEME.colors.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
  },
  placedChip: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: THEME.radius.sm,
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  wordBank: {
    backgroundColor: THEME.colors.bgCard,
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.lg,
  },
  bankLabel: {
    color: THEME.colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  bankChip: {
    backgroundColor: THEME.colors.bgElevated,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    borderColor: THEME.colors.borderLight,
  },
  bankChipText: {
    color: THEME.colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  actionBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
  },
  disabledBtn: {
    opacity: 0.5,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  feedbackCard: {
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    gap: 8,
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
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  correctSentenceDisplay: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.colors.accentLight,
  },
  ruleNoteText: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
  },
});

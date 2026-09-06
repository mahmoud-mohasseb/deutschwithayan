// ============================================================
// GAME 5: VERB CONJUGATION RACE
// Fast-paced speed challenge to conjugate German verbs correctly
// ============================================================

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { THEME } from '../../styles/theme';
import { VERB_RACE_ITEMS } from '../../../data/gamesData';
import { useProgress } from '../../context/ProgressContext';
import { useLanguage } from '../../context/LanguageContext';
import { useGameMode } from '../../context/GameModeContext';
import { useAppTheme } from '../../context/ThemeContext';

export default function VerbRace({ onFinish }) {
  const { addXp, boostMastery } = useProgress();
  const { earnCoins } = useGameMode();
  const { supportLang, isRTL } = useLanguage();
  const { isDark, colors } = useAppTheme();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const currentItem = VERB_RACE_ITEMS[currentIndex];

  useEffect(() => {
    if (isAnswered) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSelect('TIMEOUT');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex, isAnswered]);

  const handleSelect = (choice) => {
    if (isAnswered) return;
    setSelectedOpt(choice);
    setIsAnswered(true);

    const isCorrect = choice === currentItem.correct;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      addXp(20);
      earnCoins(5);
      boostMastery('verbs', 3);
    }
  };

  const handleNext = () => {
    if (currentIndex < VERB_RACE_ITEMS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
      setTimeLeft(15);
    } else {
      if (onFinish) onFinish(score);
    }
  };

  const isCorrect = selectedOpt === currentItem.correct;

  return (
    <View style={styles.container}>
      {/* Race Timer & Score */}
      <View style={[styles.raceHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={styles.timerPill}>
          <Text style={styles.timerIcon}>⏱️</Text>
          <Text style={[styles.timerText, timeLeft <= 5 && styles.timerAlert]}>
            {timeLeft}s
          </Text>
        </View>

        <Text style={styles.counterText}>
          {currentIndex + 1} / {VERB_RACE_ITEMS.length}
        </Text>
      </View>

      {/* Target Verb & Pronoun */}
      <View
        style={[
          styles.verbCard,
          { backgroundColor: colors.bgCard, borderColor: colors.border },
          isDark ? THEME.shadowsDark.softCard : THEME.shadows.softCard,
        ]}
      >
        <Text style={[styles.verbInfinitive, { color: colors.accent }]}>{currentItem.verbInfinitive}</Text>
        <Text style={[styles.verbTranslation, { color: colors.textSecondary }]}>
          {supportLang === 'ar' ? currentItem.translation.ar : currentItem.translation.en}
        </Text>

        <View style={styles.promptRow}>
          <Text style={[styles.pronounHighlight, { color: colors.primary }]}>{currentItem.pronoun}</Text>
          <Text style={[styles.blankLine, { color: colors.text, borderBottomColor: colors.accent }]}>
            {isAnswered ? selectedOpt : '______?'}
          </Text>
        </View>
      </View>

      {/* Conjugation Options */}
      <View style={styles.optionsGrid}>
        {currentItem.options.map((opt) => {
          const isSelected = selectedOpt === opt;
          const isTarget = currentItem.correct === opt;

          let btnStyle = [styles.choiceBtn, { backgroundColor: colors.bgElevated, borderColor: colors.border }];
          if (isAnswered) {
            if (isTarget) btnStyle = [styles.choiceBtn, styles.correctChoice];
            else if (isSelected) btnStyle = [styles.choiceBtn, styles.wrongChoice];
          }

          return (
            <TouchableOpacity
              key={opt}
              style={btnStyle}
              onPress={() => handleSelect(opt)}
              disabled={isAnswered}
            >
              <Text style={[styles.choiceText, { color: colors.text }]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Answer Feedback */}
      {isAnswered && (
        <View style={[styles.feedbackCard, isCorrect ? styles.feedbackSuccess : styles.feedbackDanger]}>
          <Text style={[styles.feedbackTitle, { color: isCorrect ? '#059669' : '#DC2626' }]}>
            {isCorrect ? '🏎️ Vollgas! Richtig konjugiert! (+20 XP)' : `❌ Zu langsam! Richtig ist: ${currentItem.correct}`}
          </Text>

          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>
              {currentIndex < VERB_RACE_ITEMS.length - 1 ? 'Nächste Runde ➔' : 'Rennen beenden 🏆'}
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
  raceHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.bgElevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    gap: 6,
  },
  timerIcon: {
    fontSize: 14,
  },
  timerText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  timerAlert: {
    color: THEME.colors.danger,
  },
  counterText: {
    color: THEME.colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  verbCard: {
    backgroundColor: THEME.colors.bgCard,
    padding: THEME.spacing.xl,
    borderRadius: THEME.radius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.lg,
    gap: 8,
  },
  verbInfinitive: {
    fontSize: 22,
    fontWeight: '900',
    color: THEME.colors.accentLight,
  },
  verbTranslation: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    marginBottom: 8,
  },
  promptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pronounHighlight: {
    fontSize: 28,
    fontWeight: '900',
    color: THEME.colors.primaryLight,
  },
  blankLine: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    borderBottomWidth: 3,
    borderBottomColor: THEME.colors.accent,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: THEME.spacing.lg,
  },
  choiceBtn: {
    width: '48%',
    backgroundColor: THEME.colors.bgElevated,
    paddingVertical: 16,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  correctChoice: {
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    borderColor: THEME.colors.success,
  },
  wrongChoice: {
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    borderColor: THEME.colors.danger,
  },
  choiceText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  feedbackCard: {
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    gap: 8,
  },
  feedbackSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: THEME.colors.success,
  },
  feedbackDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: THEME.colors.danger,
  },
  feedbackTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
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

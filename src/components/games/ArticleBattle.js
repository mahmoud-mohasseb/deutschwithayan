// ============================================================
// GAME 1: ARTICLE BATTLE (der / die / das)
// Fast-paced article selection with instant XP and grammar rules
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { THEME } from '../../styles/theme';
import { ARTICLE_BATTLE_ITEMS, getArticleBattleByLevel } from '../../../data/gamesData';
import { useProgress } from '../../context/ProgressContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppTheme } from '../../context/ThemeContext';
import soundService from '../../services/soundService';
import AudioPronounceButton from '../common/AudioPronounceButton';
import SpecialIcon from '../common/SpecialIcon';

export default function ArticleBattle({ onFinish, selectedLevel = 'ALL' }) {
  const { addXp, boostMastery } = useProgress();
  const { supportLang, isRTL, openExplain } = useLanguage();
  const { isDark, colors } = useAppTheme();

  const questionsPool = useMemo(() => {
    const raw = getArticleBattleByLevel(selectedLevel);
    return [...raw].sort(() => 0.5 - Math.random()).slice(0, 15);
  }, [selectedLevel]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const currentItem = questionsPool[currentIndex] || questionsPool[0] || ARTICLE_BATTLE_ITEMS[0];

  const handleSelect = (article) => {
    if (isAnswered) return;
    setSelectedArticle(article);
    setIsAnswered(true);

    const isCorrect = article === currentItem.correct;
    if (isCorrect) {
      soundService.playSfx(streak >= 2 ? 'streak' : 'correct');
      // Speak the German noun with correct article
      soundService.speakGerman(`${currentItem.correct} ${currentItem.word}`);
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      addXp(15);
      boostMastery('articles', 2);
    } else {
      soundService.playSfx('error');
      setStreak(0);
    }
  };

  const handleNext = () => {
    soundService.playSfx('whoosh');
    if (currentIndex < questionsPool.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedArticle(null);
      setIsAnswered(false);
    } else {
      soundService.playSfx('levelUp');
      if (onFinish) onFinish(score);
    }
  };

  const isCorrect = selectedArticle === currentItem.correct;

  return (
    <View style={styles.container}>
      {/* Top Banner */}
      <View style={[styles.statsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={styles.badgeChip}>
          <Text style={styles.badgeLabel}>⚡ Streak: {streak}</Text>
        </View>
        <Text style={styles.progressText}>
          {currentIndex + 1} / {questionsPool.length}
        </Text>
      </View>

      {/* Target Word Card */}
      <View
        style={[
          styles.wordCard,
          { backgroundColor: colors.bgCard, borderColor: colors.border },
          isDark ? THEME.shadowsDark.softCard : THEME.shadows.softCard,
        ]}
      >
        <Text style={[styles.subtextPrompt, { color: colors.textMuted }]}>
          {supportLang === 'ar' ? 'اختر المقالة الصحيحة للاسم:' : 'Choose the correct article for:'}
        </Text>

        <View style={styles.battleWordRow}>
          <Text style={styles.blankPlaceholder}>
            {isAnswered ? selectedArticle.toUpperCase() : '___'}
          </Text>
          <Text style={[styles.wordText, { color: colors.text }]}>{currentItem.word}</Text>
          <AudioPronounceButton text={currentItem.word} size={20} />
        </View>

        <Text style={[styles.translationText, { color: colors.textSecondary }]}>
          {supportLang === 'ar'
            ? currentItem.translation.ar
            : currentItem.translation.en}
        </Text>
      </View>

      {/* Choice Buttons: DER | DIE | DAS */}
      <View style={styles.choicesGrid}>
        {['der', 'die', 'das'].map((art) => {
          const isSelected = selectedArticle === art;
          const isTarget = currentItem.correct === art;

          let btnStyle = [styles.choiceBtn, { backgroundColor: colors.bgElevated }];
          let btnColor = colors.gender[art];

          if (isAnswered) {
            if (isTarget) {
              btnStyle = [styles.choiceBtn, styles.correctBtn];
            } else if (isSelected && !isCorrect) {
              btnStyle = [styles.choiceBtn, styles.wrongBtn];
            }
          }

          return (
            <TouchableOpacity
              key={art}
              style={[btnStyle, { borderColor: btnColor }]}
              onPress={() => handleSelect(art)}
              disabled={isAnswered}
              activeOpacity={0.8}
            >
              <Text style={[styles.choiceText, { color: btnColor }]}>
                {art.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Feedback & Rule Explanation */}
      {isAnswered && (
        <View style={[styles.feedbackCard, isCorrect ? styles.feedbackSuccess : styles.feedbackDanger]}>
          <Text style={[styles.feedbackTitle, { color: isCorrect ? '#059669' : '#DC2626' }]}>
            {isCorrect ? '🎉 Richtig! (+15 XP)' : `❌ Falsch! Es heißt: ${currentItem.correct.toUpperCase()}`}
          </Text>

          <Text style={[styles.ruleText, { color: colors.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
            {supportLang === 'ar' ? currentItem.rule.ar : currentItem.rule.en}
          </Text>

          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>
              {currentIndex < ARTICLE_BATTLE_ITEMS.length - 1 ? 'Weiter / Next ➔' : 'Fertig / Finish 🏆'}
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
  wordCard: {
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.lg,
  },
  subtextPrompt: {
    color: THEME.colors.textMuted,
    fontSize: 13,
    marginBottom: 8,
  },
  battleWordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 10,
  },
  blankPlaceholder: {
    fontSize: 28,
    fontWeight: '900',
    color: THEME.colors.accentLight,
  },
  wordText: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  translationText: {
    color: THEME.colors.textSecondary,
    fontSize: 16,
    marginTop: 4,
  },
  choicesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: THEME.spacing.lg,
  },
  choiceBtn: {
    flex: 1,
    backgroundColor: THEME.colors.bgElevated,
    paddingVertical: 18,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    borderWidth: 2,
  },
  correctBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    borderColor: THEME.colors.success,
  },
  wrongBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    borderColor: THEME.colors.danger,
  },
  choiceText: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
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
  ruleText: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
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

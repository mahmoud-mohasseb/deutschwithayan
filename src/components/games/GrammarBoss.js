// ============================================================
// GAME 4: GRAMMAR BOSS BATTLE
// Boss taunts player with incorrect German sentences.
// Correct the grammar errors to deal massive damage and defeat the boss!
// ============================================================

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { THEME } from '../../styles/theme';
import { GRAMMAR_BOSS_ENCOUNTERS } from '../../../data/gamesData';
import { useProgress } from '../../context/ProgressContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppTheme } from '../../context/ThemeContext';
import ProgressBar from '../common/ProgressBar';

export default function GrammarBoss({ onFinish }) {
  const { addXp, boostMastery } = useProgress();
  const { supportLang, isRTL } = useLanguage();
  const { isDark, colors } = useAppTheme();

  const boss = GRAMMAR_BOSS_ENCOUNTERS[0];
  const [bossHp, setBossHp] = useState(boss.hp);
  const [roundIdx, setRoundIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isRoundAnswered, setIsRoundAnswered] = useState(false);
  const [playerVictory, setPlayerVictory] = useState(false);

  const currentRound = boss.rounds[roundIdx];

  const handleSelect = (idx) => {
    if (isRoundAnswered) return;
    setSelectedOpt(idx);
    setIsRoundAnswered(true);

    const isCorrect = idx === currentRound.correctIndex;
    if (isCorrect) {
      const nextHp = Math.max(0, bossHp - currentRound.damage);
      setBossHp(nextHp);
      addXp(30);
      boostMastery('verbs', 2);
      boostMastery('akkusativ', 2);

      if (nextHp <= 0 || roundIdx >= boss.rounds.length - 1) {
        setPlayerVictory(true);
      }
    }
  };

  const handleNextRound = () => {
    if (roundIdx < boss.rounds.length - 1 && bossHp > 0) {
      setRoundIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setIsRoundAnswered(false);
    } else {
      if (onFinish) onFinish();
    }
  };

  const isCorrect = selectedOpt === currentRound.correctIndex;

  return (
    <View style={styles.container}>
      {/* Boss Health Bar & Avatar */}
      <View
        style={[
          styles.bossArenaCard,
          { backgroundColor: colors.bgCard, borderColor: colors.border },
          isDark ? THEME.shadowsDark.softCard : THEME.shadows.softCard,
        ]}
      >
        <View style={styles.bossAvatarRow}>
          <Text style={styles.bossEmoji}>{boss.avatar}</Text>
          <View style={styles.bossInfo}>
            <Text style={[styles.bossName, { color: colors.text }]}>{boss.bossName}</Text>
            <ProgressBar
              progress={(bossHp / boss.hp) * 100}
              color={bossHp < 30 ? colors.danger : colors.purple}
              height={10}
              showLabel={true}
              label={`Boss HP: ${bossHp} / ${boss.hp}`}
            />
          </View>
        </View>

        {/* Boss Taunt / Mistake Bubble */}
        <View style={[styles.bossSpeechBubble, { backgroundColor: colors.bgElevated }]}>
          <Text style={[styles.bubbleLabel, { color: colors.textMuted }]}>👹 Boss shouts a broken sentence:</Text>
          <Text style={[styles.bossMistakeText, { color: colors.coral }]}>"{currentRound.bossMistake}"</Text>
        </View>
      </View>

      {/* Player's Shield & Weapon: Choose Correction */}
      <View style={styles.actionContainer}>
        <Text style={[styles.promptHeader, { color: colors.accent }]}>
          {supportLang === 'ar'
            ? '⚔️ اختر التصحيح القواعدي المناسب لضرب الوحش:'
            : '⚔️ Cast the correct grammatical strike:'}
        </Text>

        <View style={styles.optionsList}>
          {currentRound.correctionOptions.map((option, idx) => {
            const isSelected = selectedOpt === idx;
            const isTarget = currentRound.correctIndex === idx;

            let btnStyle = [styles.optionCard, { backgroundColor: colors.bgElevated, borderColor: colors.border }];
            if (isRoundAnswered) {
              if (isTarget) btnStyle = [styles.optionCard, styles.correctCard];
              else if (isSelected && !isCorrect) btnStyle = [styles.optionCard, styles.wrongCard];
            }

            return (
              <TouchableOpacity
                key={option}
                style={btnStyle}
                onPress={() => handleSelect(idx)}
                disabled={isRoundAnswered}
                activeOpacity={0.8}
              >
                <Text style={[styles.optionIndex, { color: colors.primary }]}>#{idx + 1}</Text>
                <Text style={[styles.optionText, { color: colors.text }]}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Feedback & Rule Breakdown */}
      {isRoundAnswered && (
        <View style={[styles.feedbackCard, isCorrect ? styles.feedbackSuccess : styles.feedbackDanger]}>
          <Text style={[styles.feedbackTitle, { color: isCorrect ? '#059669' : '#DC2626' }]}>
            {isCorrect
              ? `💥 CRITICAL HIT! -${currentRound.damage} HP (+30 XP)`
              : '🛡️ The Boss blocked your attack!'}
          </Text>

          {/* Tri-Lingual Scaffolding as requested in prompt */}
          <View style={styles.scaffoldRow}>
            <Text style={styles.scaffoldEn}>🇬🇧 {currentRound.english}</Text>
            <Text style={[styles.scaffoldAr, { textAlign: isRTL ? 'right' : 'left' }]}>
              🇪🇬 {currentRound.arabic}
            </Text>
          </View>

          <Text style={[styles.explanationText, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
            {supportLang === 'ar'
              ? currentRound.explanation.ar
              : currentRound.explanation.en}
          </Text>

          <TouchableOpacity style={styles.nextBtn} onPress={handleNextRound}>
            <Text style={styles.nextBtnText}>
              {playerVictory || roundIdx >= boss.rounds.length - 1
                ? '🏆 Claim Boss Victory (+50 XP)'
                : 'Next Round ➔'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function currentItemExplanation(text) {
  return text || '';
}

const styles = StyleSheet.create({
  container: {
    padding: THEME.spacing.md,
  },
  bossArenaCard: {
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.4)',
    marginBottom: THEME.spacing.md,
  },
  bossAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  bossEmoji: {
    fontSize: 44,
  },
  bossInfo: {
    flex: 1,
  },
  bossName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  bossSpeechBubble: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: THEME.colors.danger,
  },
  bubbleLabel: {
    color: THEME.colors.danger,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  bossMistakeText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    textDecorationLine: 'line-through',
  },
  actionContainer: {
    marginBottom: THEME.spacing.md,
  },
  promptHeader: {
    color: THEME.colors.accentLight,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  optionsList: {
    gap: 8,
  },
  optionCard: {
    backgroundColor: THEME.colors.bgElevated,
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    gap: 12,
  },
  correctCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: THEME.colors.success,
  },
  wrongCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: THEME.colors.danger,
  },
  optionIndex: {
    color: THEME.colors.primaryLight,
    fontWeight: '800',
    fontSize: 14,
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  feedbackCard: {
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.md,
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
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scaffoldRow: {
    gap: 4,
    paddingVertical: 4,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: THEME.colors.border,
  },
  scaffoldEn: {
    color: THEME.colors.primaryLight,
    fontSize: 13,
    fontWeight: '600',
  },
  scaffoldAr: {
    color: THEME.colors.success,
    fontSize: 14,
    fontWeight: '600',
  },
  explanationText: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  nextBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 12,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    marginTop: 6,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});

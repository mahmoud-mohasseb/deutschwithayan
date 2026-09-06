// ============================================================
// GAME 6: AUDIO DETECTIVE (Listening Comprehension)
// Interactive German listening engine with normal/slow speed,
// audio waveform simulation, transcript, and comprehension challenges.
// ============================================================

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { THEME } from '../../styles/theme';
import { AUDIO_DETECTIVE_ITEMS } from '../../../data/gamesData';
import { useProgress } from '../../context/ProgressContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppTheme } from '../../context/ThemeContext';
import soundService from '../../services/soundService';

export default function AudioDetective({ onFinish }) {
  const { addXp } = useProgress();
  const { supportLang, isRTL } = useLanguage();
  const { isDark, colors } = useAppTheme();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSlowSpeed, setIsSlowSpeed] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentItem = AUDIO_DETECTIVE_ITEMS[currentIndex];

  useEffect(() => {
    if (currentItem?.audioTranscript) {
      handlePlayAudio(false);
    }
  }, [currentIndex]);

  const handlePlayAudio = async (slow = false) => {
    if (!currentItem?.audioTranscript) return;
    setIsSlowSpeed(slow);
    setIsPlaying(true);
    soundService.playSfx('tap');

    await soundService.speakGerman(currentItem.audioTranscript, {
      slow,
      onDone: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });
  };

  const handleSelect = (idx) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    if (idx === currentItem.correct) {
      soundService.playSfx('correct');
      addXp(25);
    } else {
      soundService.playSfx('error');
    }
  };

  const handleNext = () => {
    soundService.playSfx('whoosh');
    if (currentIndex < AUDIO_DETECTIVE_ITEMS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      soundService.playSfx('levelUp');
      if (onFinish) onFinish();
    }
  };

  const isCorrect = selectedOpt === currentItem.correct;

  return (
    <View style={styles.container}>
      {/* Speaker Bar */}
      <View style={[styles.headerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={[styles.badgeChip, { backgroundColor: colors.coralBg }]}>
          <Text style={[styles.badgeLabel, { color: colors.coral }]}>🎧 Hör-Detektiv (Listening)</Text>
        </View>
        <Text style={[styles.speakerTag, { color: colors.textMuted }]}>🗣️ {currentItem.speaker}</Text>
      </View>

      {/* Audio Playback Player Station */}
      <View
        style={[
          styles.playerCard,
          { backgroundColor: colors.bgCard, borderColor: colors.border },
          isDark ? THEME.shadowsDark.softCard : THEME.shadows.softCard,
        ]}
      >
        <View style={styles.waveformContainer}>
          {[14, 28, 45, 32, 18, 50, 60, 42, 25, 48, 30, 16].map((h, idx) => (
            <View
              key={idx}
              style={[
                styles.waveformBar,
                { height: isPlaying ? h : 10, backgroundColor: isPlaying ? colors.primary : colors.border },
              ]}
            />
          ))}
        </View>

        {/* Audio Control Buttons: Play Normal | Play Slow */}
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[
              styles.audioBtn,
              { backgroundColor: colors.bgElevated, borderColor: colors.border },
              isPlaying && !isSlowSpeed && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => handlePlayAudio(false)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.audioBtnText,
                { color: isPlaying && !isSlowSpeed ? '#FFFFFF' : colors.text },
              ]}
            >
              ▶️ {isPlaying && !isSlowSpeed ? 'Spielt...' : 'Audio abspielen'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.audioBtn,
              { backgroundColor: colors.bgElevated, borderColor: colors.border },
              isSlowSpeed && isPlaying && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => handlePlayAudio(true)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.audioBtnText,
                { color: isSlowSpeed && isPlaying ? '#FFFFFF' : colors.text },
              ]}
            >
              🐢 Langsam (Slow)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Subtitles & Phonetic Breakdown */}
        {isAnswered && (
          <View style={[styles.transcriptBox, { borderTopColor: colors.border }]}>
            <Text style={[styles.transcriptText, { color: colors.text }]}>"{currentItem.audioTranscript}"</Text>
            <Text style={[styles.phoneticText, { color: colors.accent }]}>🗣️ /{currentItem.phonetic}/</Text>
          </View>
        )}
      </View>

      {/* Question Prompt */}
      <View
        style={[
          styles.questionCard,
          { backgroundColor: colors.bgCard, borderColor: colors.border },
          isDark ? THEME.shadowsDark.softCard : THEME.shadows.softCard,
        ]}
      >
        <Text style={[styles.questionText, { color: colors.text }]}>
          {supportLang === 'ar' ? currentItem.question.ar : currentItem.question.en}
        </Text>

        <View style={styles.optionsList}>
          {currentItem.options.map((opt, idx) => {
            const isSelected = selectedOpt === idx;
            const isTarget = currentItem.correct === idx;

            let cardBg = colors.bgElevated;
            let cardBorder = colors.border;
            if (isAnswered) {
              if (isTarget) {
                cardBg = isDark ? 'rgba(16, 185, 129, 0.2)' : '#DCFCE7';
                cardBorder = '#10B981';
              } else if (isSelected) {
                cardBg = isDark ? 'rgba(239, 68, 68, 0.2)' : '#FEE2E2';
                cardBorder = '#EF4444';
              }
            }

            return (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.optionCard,
                  { backgroundColor: cardBg, borderColor: cardBorder },
                ]}
                onPress={() => handleSelect(idx)}
                disabled={isAnswered}
              >
                <Text style={[styles.optionNumber, { color: colors.primary }]}>{idx + 1}.</Text>
                <Text style={[styles.optionLabel, { color: colors.text }]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Feedback Card */}
      {isAnswered && (
        <View
          style={[
            styles.feedbackCard,
            isCorrect ? styles.feedbackSuccess : styles.feedbackDanger,
          ]}
        >
          <Text style={[styles.feedbackTitle, { color: isCorrect ? '#059669' : '#DC2626' }]}>
            {isCorrect
              ? supportLang === 'ar' ? '🎉 ممتاز! إجابة دقيقة' : '🎉 Ausgezeichnet! Richtig!'
              : supportLang === 'ar' ? '💡 انتبه للشرح' : '💡 Nicht ganz richtig!'}
          </Text>
          <Text style={[styles.feedbackDesc, { color: colors.textSecondary }]}>
            {supportLang === 'ar' ? currentItem.explanation.ar : currentItem.explanation.en}
          </Text>

          <TouchableOpacity style={[styles.nextBtn, { backgroundColor: colors.primary }]} onPress={handleNext}>
            <Text style={styles.nextBtnText}>
              {supportLang === 'ar' ? 'التالي ➔' : 'Nächste Aufgabe ➔'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    gap: 14,
  },
  headerRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeLabel: {
    fontWeight: '800',
    fontSize: 12,
  },
  speakerTag: {
    fontSize: 12,
    fontWeight: '700',
  },
  playerCard: {
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    gap: 14,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 60,
  },
  waveformBar: {
    width: 6,
    borderRadius: 3,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  audioBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
  },
  audioBtnText: {
    fontWeight: '800',
    fontSize: 13,
  },
  transcriptBox: {
    padding: 10,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    borderTopWidth: 1,
    width: '100%',
  },
  transcriptText: {
    fontSize: 15,
    fontWeight: '800',
  },
  phoneticText: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '700',
  },
  questionCard: {
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    gap: 12,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '800',
  },
  optionsList: {
    gap: 8,
  },
  optionCard: {
    padding: 12,
    borderRadius: THEME.radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    gap: 10,
  },
  optionNumber: {
    fontWeight: '900',
  },
  optionLabel: {
    fontSize: 14,
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
    borderColor: '#10B981',
  },
  feedbackDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#EF4444',
  },
  feedbackTitle: {
    fontSize: 15,
    fontWeight: '900',
  },
  feedbackDesc: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  nextBtn: {
    paddingVertical: 12,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    marginTop: 4,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },
});

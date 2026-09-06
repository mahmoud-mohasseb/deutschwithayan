// ============================================================
// GAME: KIDS ANIMAL, COLOR & FAMILY ADVENTURE
// Cheerful, colorful, lightweight interactive game for kids.
// Powered 100% by data/gamesData.json (KIDS_FUN_ITEMS)
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../styles/theme';
import { KIDS_FUN_ITEMS } from '../../../data/gamesData';
import { useProgress } from '../../context/ProgressContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppTheme } from '../../context/ThemeContext';
import soundService from '../../services/soundService';

const { width } = Dimensions.get('window');

export default function KidsAdventureGame({ onFinish }) {
  const { addXp, boostMastery } = useProgress();
  const { supportLang, isRTL } = useLanguage();
  const { isDark, colors } = useAppTheme();

  const [gameMode, setGameMode] = useState('explore'); // 'explore' | 'quiz'
  const [selectedCard, setSelectedCard] = useState(KIDS_FUN_ITEMS[0]);
  const [quizTarget, setQuizTarget] = useState(null);
  const [quizOptions, setQuizOptions] = useState([]);
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState(null);

  // Setup new quiz question
  const nextQuizQuestion = () => {
    soundService.playSfx('whoosh');
    setFeedback(null);
    const target = KIDS_FUN_ITEMS[Math.floor(Math.random() * KIDS_FUN_ITEMS.length)];
    setQuizTarget(target);

    // Pick 3 distractors
    const distractors = KIDS_FUN_ITEMS.filter((i) => i.id !== target.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const options = [target, ...distractors].sort(() => Math.random() - 0.5);
    setQuizOptions(options);

    // Prompt child in German
    soundService.speakGerman(`Wo ist ${target.german}?`);
  };

  useEffect(() => {
    if (gameMode === 'quiz') {
      nextQuizQuestion();
    }
  }, [gameMode]);

  const handleExploreCard = (item) => {
    setSelectedCard(item);
    soundService.playSfx('tap');
    soundService.speakGerman(item.german);
    addXp(5);
  };

  const handleQuizAnswer = (item) => {
    if (!quizTarget || feedback) return;

    if (item.id === quizTarget.id) {
      soundService.playSfx('streak');
      soundService.speakGerman(`Super! Das ist ${item.german}!`);
      setFeedback('correct');
      setStars((s) => s + 1);
      addXp(15);
      boostMastery('kids', 2);

      setTimeout(() => {
        nextQuizQuestion();
      }, 1500);
    } else {
      soundService.playSfx('error');
      setFeedback('tryAgain');
      soundService.speakGerman('Probier es noch einmal!');
      setTimeout(() => {
        setFeedback(null);
      }, 1200);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Top Header & Mode Switcher */}
      <View style={[styles.headerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={styles.modeTabs}>
          <TouchableOpacity
            style={[
              styles.modeTabBtn,
              gameMode === 'explore'
                ? { backgroundColor: '#F59E0B' }
                : { backgroundColor: colors.bgElevated, borderColor: colors.border, borderWidth: 1 },
            ]}
            onPress={() => {
              soundService.playSfx('tap');
              setGameMode('explore');
            }}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.modeTabText,
                { color: gameMode === 'explore' ? '#FFFFFF' : colors.text },
              ]}
            >
              🧭 {supportLang === 'ar' ? 'اكتشف وتعلم' : 'Explore'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeTabBtn,
              gameMode === 'quiz'
                ? { backgroundColor: '#10B981' }
                : { backgroundColor: colors.bgElevated, borderColor: colors.border, borderWidth: 1 },
            ]}
            onPress={() => {
              soundService.playSfx('tap');
              setGameMode('quiz');
            }}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.modeTabText,
                { color: gameMode === 'quiz' ? '#FFFFFF' : colors.text },
              ]}
            >
              ⭐ {supportLang === 'ar' ? `النجوم (${stars})` : `Quiz (${stars} ⭐)`}
            </Text>
          </TouchableOpacity>
        </View>

        {onFinish && (
          <TouchableOpacity
            style={[styles.exitBtn, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}
            onPress={() => onFinish(stars * 15)}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={18} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>

      {/* MODE 1: EXPLORE MODE */}
      {gameMode === 'explore' && (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Big Featured Hero Card */}
          {selectedCard && (
            <View
              style={[
                styles.heroCard,
                { backgroundColor: colors.bgCard, borderColor: colors.border },
                isDark ? THEME.shadowsDark.softCard : THEME.shadows.softCard,
              ]}
            >
              <Text style={styles.heroEmoji}>{selectedCard.emoji}</Text>
              <Text style={[styles.heroGerman, { color: colors.text }]}>
                {selectedCard.german}
              </Text>
              <Text style={[styles.heroArabic, { color: colors.primary }]}>
                {supportLang === 'ar' ? selectedCard.arabic : selectedCard.english}
              </Text>

              {/* Sound Effect Bubble */}
              <View style={[styles.soundBubble, { backgroundColor: colors.bgElevated }]}>
                <Text style={styles.soundText}>🔊 {selectedCard.sound}</Text>
              </View>

              {/* Cheerful Fact */}
              <Text style={[styles.factText, { color: colors.textSecondary }]}>
                💡 {selectedCard.funFact}
              </Text>

              {/* Pronounce Again Button */}
              <TouchableOpacity
                style={[styles.speakBtn, { backgroundColor: colors.primary }]}
                onPress={() => soundService.speakGerman(selectedCard.german)}
                activeOpacity={0.8}
              >
                <Ionicons name="volume-high" size={20} color="#FFFFFF" />
                <Text style={styles.speakBtnText}>
                  {supportLang === 'ar' ? 'استمع لنطق الكلمة 🇩🇪' : 'Listen Pronunciation 🇩🇪'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Grid of All Kids Cards */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {supportLang === 'ar' ? 'اضغط على أي كارت للاستماع:' : 'Tap any card to hear its sound:'}
          </Text>

          <View style={styles.cardsGrid}>
            {KIDS_FUN_ITEMS.map((item) => {
              const isSelected = selectedCard?.id === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.miniCard,
                    {
                      backgroundColor: isSelected ? colors.coralBg : colors.bgCard,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                    isDark ? THEME.shadowsDark.softCard : THEME.shadows.softCard,
                  ]}
                  onPress={() => handleExploreCard(item)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.miniCardEmoji}>{item.emoji}</Text>
                  <Text
                    style={[
                      styles.miniCardText,
                      { color: isSelected ? colors.primary : colors.text },
                    ]}
                    numberOfLines={1}
                  >
                    {item.german}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* MODE 2: KIDS QUIZ MODE */}
      {gameMode === 'quiz' && quizTarget && (
        <View style={styles.quizContainer}>
          <View
            style={[
              styles.quizCard,
              { backgroundColor: colors.bgCard, borderColor: colors.border },
              isDark ? THEME.shadowsDark.softCard : THEME.shadows.softCard,
            ]}
          >
            <Text style={styles.quizPromptTitle}>
              {supportLang === 'ar'
                ? `أين هو: "${quizTarget.arabic}"؟`
                : `Where is "${quizTarget.german}"?`}
            </Text>

            <TouchableOpacity
              style={[styles.listenPromptBtn, { backgroundColor: colors.bgElevated }]}
              onPress={() => soundService.speakGerman(`Wo ist ${quizTarget.german}?`)}
              activeOpacity={0.8}
            >
              <Ionicons name="volume-high" size={22} color={colors.primary} />
              <Text style={[styles.listenPromptText, { color: colors.text }]}>
                {quizTarget.german}
              </Text>
            </TouchableOpacity>

            {/* Feedback message */}
            {feedback === 'correct' && (
              <View style={styles.feedbackBannerCorrect}>
                <Text style={styles.feedbackText}>🎉 Richtig! أحسنت! (+15 XP)</Text>
              </View>
            )}
            {feedback === 'tryAgain' && (
              <View style={styles.feedbackBannerWrong}>
                <Text style={styles.feedbackText}>❌ حاول مرة ثانية! Try again!</Text>
              </View>
            )}

            {/* 4 Big Choices */}
            <View style={styles.quizOptionsRow}>
              {quizOptions.map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.quizOptionBtn,
                    { backgroundColor: colors.bgElevated, borderColor: colors.border },
                    feedback === 'correct' && opt.id === quizTarget.id && {
                      backgroundColor: '#DCFCE7',
                      borderColor: '#10B981',
                    },
                  ]}
                  onPress={() => handleQuizAnswer(opt)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.quizOptionEmoji}>{opt.emoji}</Text>
                  <Text style={[styles.quizOptionLabel, { color: colors.text }]} numberOfLines={1}>
                    {opt.german}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
  },
  headerRow: {
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modeTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  modeTabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  modeTabText: {
    fontSize: 13,
    fontWeight: '800',
  },
  exitBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heroCard: {
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 20,
  },
  heroEmoji: {
    fontSize: 64,
    marginBottom: 8,
  },
  heroGerman: {
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
  },
  heroArabic: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
    textAlign: 'center',
  },
  soundBubble: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    marginVertical: 10,
  },
  soundText: {
    fontSize: 14,
    fontWeight: '700',
  },
  factText: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  speakBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
  },
  speakBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 12,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  miniCard: {
    width: (width - 60) / 3,
    height: 90,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    borderWidth: 1.5,
  },
  miniCardEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  miniCardText: {
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },
  quizContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  quizCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
  },
  quizPromptTitle: {
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 14,
  },
  listenPromptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 16,
  },
  listenPromptText: {
    fontSize: 18,
    fontWeight: '800',
  },
  feedbackBannerCorrect: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
  },
  feedbackBannerWrong: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
  },
  feedbackText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#047857',
  },
  quizOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    width: '100%',
    marginTop: 8,
  },
  quizOptionBtn: {
    width: '46%',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    gap: 6,
  },
  quizOptionEmoji: {
    fontSize: 40,
  },
  quizOptionLabel: {
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
});

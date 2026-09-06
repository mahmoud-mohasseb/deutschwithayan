// ============================================================
// GAME: MEMORY SPIEL (Pairs Matching Game)
// Fun, snappy, lightweight 2D card flipping game for kids & grown-ups.
// Powered 100% by data/gamesData.json (MEMORY_PAIRS_ITEMS)
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../styles/theme';
import { MEMORY_PAIRS_ITEMS, getMemoryPairsByLevel } from '../../../data/gamesData';
import { useProgress } from '../../context/ProgressContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppTheme } from '../../context/ThemeContext';
import soundService from '../../services/soundService';

const { width } = Dimensions.get('window');
const CARD_SIZE = Math.min((width - 64) / 3, 100);

export default function MemoryPairsGame({ onFinish, selectedLevel = 'ALL' }) {
  const { addXp, boostMastery } = useProgress();
  const { supportLang, isRTL } = useLanguage();
  const { isDark, colors } = useAppTheme();

  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Initialize 6 pairs (12 cards) randomly chosen from pool
  const initGame = () => {
    soundService.playSfx('whoosh');
    const pool = getMemoryPairsByLevel(selectedLevel);
    const shuffledItems = [...pool].sort(() => Math.random() - 0.5).slice(0, 6);
    
    let deck = [];
    shuffledItems.forEach((item) => {
      // German Card
      deck.push({
        uid: `${item.id}_de`,
        pairId: item.id,
        type: 'de',
        text: item.german,
        emoji: item.emoji,
        sub: '',
      });
      // Translation Card
      deck.push({
        uid: `${item.id}_trans`,
        pairId: item.id,
        type: 'trans',
        text: supportLang === 'ar' ? item.arabic : item.english,
        emoji: item.emoji,
        sub: item.category,
      });
    });

    // Shuffle deck
    deck.sort(() => Math.random() - 0.5);
    setCards(deck);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setStreak(0);
    setIsGameOver(false);
  };

  useEffect(() => {
    initGame();
  }, [supportLang, selectedLevel]);

  const handleCardPress = (index) => {
    if (flippedCards.length >= 2) return;
    if (flippedCards.includes(index)) return;
    const card = cards[index];
    if (matchedPairs.includes(card.pairId)) return;

    soundService.playSfx('tap');

    // If tapping a German card, speak German word immediately
    if (card.type === 'de') {
      soundService.speakGerman(card.text);
    }

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const firstCard = cards[newFlipped[0]];
      const secondCard = cards[newFlipped[1]];

      if (firstCard.pairId === secondCard.pairId) {
        // MATCH!
        setTimeout(() => {
          soundService.playSfx('correct');
          const nextMatched = [...matchedPairs, firstCard.pairId];
          setMatchedPairs(nextMatched);
          setFlippedCards([]);
          setStreak((s) => s + 1);
          addXp(20);
          boostMastery('vocabulary', 2);

          if (nextMatched.length === 6) {
            // Victory!
            setTimeout(() => {
              soundService.playSfx('levelUp');
              setIsGameOver(true);
            }, 400);
          }
        }, 450);
      } else {
        // MISMATCH
        setTimeout(() => {
          soundService.playSfx('error');
          setFlippedCards([]);
          setStreak(0);
        }, 900);
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header Bar */}
      <View style={[styles.headerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={[styles.badgePill, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}>
          <Text style={[styles.badgeText, { color: colors.textMuted }]}>
            {supportLang === 'ar' ? `الحركات: ${moves}` : `Moves: ${moves}`}
          </Text>
        </View>

        <View style={[styles.badgePill, { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' }]}>
          <Text style={[styles.badgeText, { color: '#B45309', fontWeight: '800' }]}>
            🔥 {streak} Streak
          </Text>
        </View>

        <View style={[styles.badgePill, { backgroundColor: '#DCFCE7', borderColor: '#10B981' }]}>
          <Text style={[styles.badgeText, { color: '#047857', fontWeight: '800' }]}>
            ✨ {matchedPairs.length} / 6
          </Text>
        </View>
      </View>

      {/* Subtitle prompt */}
      <Text style={[styles.gameSubtitle, { color: colors.textSecondary }]}>
        {supportLang === 'ar'
          ? 'اقلب الكروت واجمع كل كلمة ألمانية مع معناها العربي 🇪🇬'
          : 'Flip cards and match German words with their translations!'}
      </Text>

      {/* 3x4 Responsive Grid */}
      <ScrollView
        contentContainerStyle={styles.gridScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardsGrid}>
          {cards.map((card, index) => {
            const isFlipped = flippedCards.includes(index);
            const isMatched = matchedPairs.includes(card.pairId);

            return (
              <TouchableOpacity
                key={card.uid}
                style={[
                  styles.card,
                  {
                    width: CARD_SIZE,
                    height: CARD_SIZE * 1.15,
                    backgroundColor: isMatched
                      ? '#DCFCE7'
                      : isFlipped
                      ? colors.bgCard
                      : colors.primary,
                    borderColor: isMatched
                      ? '#10B981'
                      : isFlipped
                      ? colors.accent
                      : 'transparent',
                  },
                  isDark ? THEME.shadowsDark.softCard : THEME.shadows.softCard,
                ]}
                onPress={() => handleCardPress(index)}
                activeOpacity={0.8}
                disabled={isMatched || isFlipped}
              >
                {isFlipped || isMatched ? (
                  <View style={styles.cardInner}>
                    <Text style={styles.cardEmoji}>{card.emoji}</Text>
                    <Text
                      style={[
                        styles.cardWordText,
                        { color: isMatched ? '#047857' : colors.text },
                      ]}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {card.text}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.cardBackCover}>
                    <Text style={styles.cardBackIcon}>🇩🇪</Text>
                    <Text style={styles.cardBackQuestion}>?</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Action Buttons Row */}
        <View style={[styles.bottomActionsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity
            style={[styles.resetBtn, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}
            onPress={initGame}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh" size={16} color={colors.text} />
            <Text style={[styles.resetBtnText, { color: colors.text }]}>
              {supportLang === 'ar' ? 'إعادة الخلط' : 'Shuffle'}
            </Text>
          </TouchableOpacity>

          {onFinish && (
            <TouchableOpacity
              style={[styles.finishBtn, { backgroundColor: colors.primary }]}
              onPress={() => onFinish(matchedPairs.length * 10)}
              activeOpacity={0.8}
            >
              <Text style={styles.finishBtnText}>
                {supportLang === 'ar' ? 'إنهاء الجولة' : 'Finish Round'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Game Over Victory Modal Overlay */}
      {isGameOver && (
        <View style={styles.victoryOverlay}>
          <View
            style={[
              styles.victoryCard,
              { backgroundColor: colors.bgCard, borderColor: colors.border },
              isDark ? THEME.shadowsDark.softCard : THEME.shadows.softCard,
            ]}
          >
            <Text style={styles.victoryTrophy}>🏆</Text>
            <Text style={[styles.victoryTitle, { color: colors.text }]}>
              {supportLang === 'ar' ? 'أحسنت يا بطل! 🇩🇪' : 'Wunderbar! Fantastic!'}
            </Text>
            <Text style={[styles.victorySub, { color: colors.textSecondary }]}>
              {supportLang === 'ar'
                ? `أنهيت المطابقة في ${moves} حركة وحصلت على +120 نقطة خبرة!`
                : `Matched all pairs in ${moves} moves and earned +120 XP!`}
            </Text>

            <TouchableOpacity
              style={[styles.playAgainBtn, { backgroundColor: colors.primary }]}
              onPress={initGame}
              activeOpacity={0.85}
            >
              <Text style={styles.playAgainText}>
                {supportLang === 'ar' ? 'العب جولة جديدة 🔄' : 'Play Again 🔄'}
              </Text>
            </TouchableOpacity>

            {onFinish && (
              <TouchableOpacity
                style={styles.closeVictoryBtn}
                onPress={() => onFinish(120)}
                activeOpacity={0.7}
              >
                <Text style={[styles.closeVictoryText, { color: colors.textMuted }]}>
                  {supportLang === 'ar' ? 'العودة لمركز الألعاب' : 'Back to Arena'}
                </Text>
              </TouchableOpacity>
            )}
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
    marginBottom: 8,
  },
  badgePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  gameSubtitle: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 24,
    marginBottom: 14,
  },
  gridScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    maxWidth: 360,
  },
  card: {
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    borderWidth: 2,
  },
  cardInner: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  cardEmoji: {
    fontSize: 26,
    marginBottom: 4,
  },
  cardWordText: {
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  cardBackCover: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  cardBackIcon: {
    fontSize: 20,
  },
  cardBackQuestion: {
    fontSize: 18,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  bottomActionsRow: {
    marginTop: 20,
    gap: 12,
    alignItems: 'center',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  finishBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
  },
  finishBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  victoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 100,
  },
  victoryCard: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
  },
  victoryTrophy: {
    fontSize: 48,
    marginBottom: 8,
  },
  victoryTitle: {
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  victorySub: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginVertical: 12,
  },
  playAgainBtn: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 6,
  },
  playAgainText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  closeVictoryBtn: {
    marginTop: 12,
    paddingVertical: 8,
  },
  closeVictoryText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

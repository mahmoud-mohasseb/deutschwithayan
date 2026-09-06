// ============================================================
// KIDS DASHBOARD VIEW — DEUTSCH QUEST 🇩🇪
// Restructured Junior/Kids Layout built with Gluestack UI Primitives:
// - Friendly 3D Falko Eagle Mascot with Speech Bubble
// - Large Tactile Audio Flashcards ("Tippe & Höre")
// - Big Chunky Colorful Cards for Little Hands
// - Cheerful Star & Coin Rewards with Sound Effects
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppStore } from '../../store/useAppStore';
import { useLanguage } from '../../context/LanguageContext';
import { useAppTheme } from '../../context/ThemeContext';
import { KIDS_MODULES } from '../../../data/kidsCurriculum';
import GluestackAnimatedCard from '../common/GluestackAnimatedCard';
import soundService from '../../services/soundService';

const { width } = Dimensions.get('window');

function KidGridWordCard({ item, activeColor, isSelected, onPress, isDark, colors, supportLang }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.94,
      friction: 6,
      tension: 120,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 80,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.gridCardWrapper, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={[
          styles.kidCard,
          {
            backgroundColor: isDark
              ? (isSelected ? '#1E293B' : '#0F172A')
              : (isSelected ? '#FEF2F2' : '#FFFFFF'),
            borderColor: isSelected ? activeColor : (isDark ? 'rgba(51, 65, 85, 0.7)' : 'rgba(226, 232, 240, 0.9)'),
            borderWidth: isSelected ? 2.5 : 1.5,
          },
          isSelected && {
            shadowColor: activeColor,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.35,
            shadowRadius: 10,
            elevation: 8,
          },
        ]}
      >
        {/* Top Mini Accent Badge */}
        <View style={[styles.topMiniBadge, { backgroundColor: isSelected ? activeColor : activeColor + '18' }]}>
          <Text style={[styles.topMiniBadgeText, { color: isSelected ? '#FFFFFF' : activeColor }]}>
            {isSelected ? '🔊 SPIELT' : '🇩🇪 DE'}
          </Text>
        </View>

        {/* Big Animated Emoji Avatar Circle */}
        <View
          style={[
            styles.emojiCircle,
            {
              backgroundColor: isSelected ? activeColor + '25' : (isDark ? 'rgba(30, 41, 59, 0.8)' : activeColor + '12'),
              borderColor: isSelected ? activeColor : 'transparent',
            },
          ]}
        >
          <Text style={styles.wordEmoji}>{item.emoji}</Text>
        </View>

        {/* German Word */}
        <Text style={[styles.wordGerman, { color: colors.text }]} numberOfLines={1} adjustsFontSizeToFit>
          {item.de}
        </Text>

        {/* Dual English & Egyptian Arabic reading text */}
        <Text style={[styles.wordTrans, { color: colors.textMuted }]} numberOfLines={1}>
          🇬🇧 {item.en} • 🇪🇬 {item.ar}
        </Text>

        {/* Example phrase snippet if available */}
        {item.example ? (
          <Text style={[styles.exampleSnippet, { color: isDark ? '#94A3B8' : '#64748B' }]} numberOfLines={1}>
            "{item.example}"
          </Text>
        ) : null}

        {/* Trilingual Reading Voice Action Buttons (🇩🇪 German, 🇬🇧 English, 🇪🇬 Arabic) */}
        <View style={styles.voiceActionsRow}>
          <TouchableOpacity
            style={[styles.smallVoiceBtn, { backgroundColor: activeColor + '20', borderColor: activeColor }]}
            onPress={(e) => {
              e.stopPropagation();
              soundService.stopAudio();
              soundService.speakGerman(item.de);
            }}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Text style={styles.voiceBtnText}>🇩🇪 Hören</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.smallVoiceBtn, { backgroundColor: '#3B82F620', borderColor: '#3B82F6' }]}
            onPress={(e) => {
              e.stopPropagation();
              soundService.stopAudio();
              soundService.speakEnglish(item.en);
            }}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Text style={styles.voiceBtnText}>🇬🇧 EN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.smallVoiceBtn, { backgroundColor: '#10B98120', borderColor: '#10B981' }]}
            onPress={(e) => {
              e.stopPropagation();
              soundService.stopAudio();
              soundService.speakArabic(item.ar);
            }}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Text style={styles.voiceBtnText}>🇪🇬 AR</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function KidsDashboardView({ onNavigate }) {
  const { supportLang, isRTL } = useLanguage();
  const stars = useAppStore((s) => s.stars);
  const addStars = useAppStore((s) => s.addStars);
  const addCoins = useAppStore((s) => s.addCoins);
  const addXp = useAppStore((s) => s.addXp);
  const speechRate = useAppStore((s) => s.speechRate);
  const { isDark, colors } = useAppTheme();

  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState(null);
  const [challengeAnswer, setChallengeAnswer] = useState(null);
  const [challengeSolved, setChallengeSolved] = useState(false);

  useEffect(() => {
    return () => {
      soundService.stopAudio();
      soundService.stopSpeech();
    };
  }, []);

  const activeModule = KIDS_MODULES[activeModuleIndex];

  // Keep selectedWord in sync with soundService state
  useEffect(() => {
    const unsubscribe = soundService.subscribe((state) => {
      if (!state.isSpeaking) {
        setSelectedWord(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleSpeak = (text) => {
    soundService.playSfx('tap');
    if (selectedWord === text && soundService.isAudioPlaying()) {
      soundService.stopAudio();
      setSelectedWord(null);
      return;
    }
    setSelectedWord(text);
    soundService.speakGerman(text, {
      slow: speechRate < 0.85,
      onDone: () => setSelectedWord(null),
      onError: () => setSelectedWord(null),
    });
  };

  const handleSelectChallenge = (optionIdx) => {
    if (challengeSolved) return;
    setChallengeAnswer(optionIdx);
    if (optionIdx === activeModule.funChallenge.correct) {
      soundService.playSfx('correct');
      setChallengeSolved(true);
      addStars(3);
      addCoins(20);
      addXp(30);
    } else {
      soundService.playSfx('wrong');
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bg }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Mascot Welcoming Hero Banner */}
      <View style={[styles.mascotHero, isDark ? styles.heroDark : styles.heroLight]}>
        <LinearGradient
          colors={isDark ? ['#1e1b4b', '#312e81'] : ['#FEF3C7', '#FDE68A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <View style={[styles.heroRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            {/* Mascot Avatar Logo */}
            <Image
              source={require('../../../assets/ayan_logo.png')}
              style={styles.mascotLogo}
              resizeMode="cover"
            />

            {/* Cheerful Speech Bubble */}
            <View style={[styles.speechBubble, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
              <View style={styles.bubbleHeaderRow}>
                <Text style={styles.mascotName}>{supportLang === 'ar' ? 'أيان 👦🇩🇪' : 'Ayan 👦🇩🇪'}</Text>
                <View style={styles.starPill}>
                  <Text style={styles.starText}>⭐ {stars}</Text>
                </View>
              </View>
              <Text style={[styles.speechText, { color: colors.text }]}>
                {supportLang === 'ar' ? activeModule.mascotTipAr : activeModule.mascotTip}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* 2. Kid-Friendly Category Tabs (Bouncy Horizontal Selector) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesRow}
      >
        {KIDS_MODULES.map((mod, idx) => {
          const isActive = idx === activeModuleIndex;
          return (
            <TouchableOpacity
              key={mod.id}
              style={[
                styles.categoryTab,
                { backgroundColor: isActive ? mod.color : colors.bgCard, borderColor: colors.border },
              ]}
              onPress={() => {
                soundService.playSfx('tap');
                setActiveModuleIndex(idx);
                setSelectedWord(null);
                setChallengeAnswer(null);
                setChallengeSolved(false);
              }}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name={mod.icon}
                size={22}
                color={isActive ? '#FFFFFF' : mod.color}
              />
              <Text
                style={[
                  styles.categoryLabel,
                  { color: isActive ? '#FFFFFF' : colors.text },
                ]}
              >
                {supportLang === 'ar' ? mod.titleAr : mod.titleDe}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 3. Big Interactive "Tippe & Höre" Word Grid */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {supportLang === 'ar' ? 'اضغط واسمع الكلمة 🎧' : 'Tippe & Höre! 🎧'}
        </Text>
        <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>
          {supportLang === 'ar'
            ? 'اضغط على البطاقة لسماع النطق الألماني الصحيح'
            : 'Tap any card to hear native German pronunciation'}
        </Text>
      </View>

      <View style={styles.wordsGrid}>
        {activeModule.vocab.map((item, vIdx) => {
          const isCardSelected = selectedWord === item.de;
          return (
            <KidGridWordCard
              key={vIdx}
              item={item}
              activeColor={activeModule.color}
              isSelected={isCardSelected}
              onPress={() => handleSpeak(item.de)}
              isDark={isDark}
              colors={colors}
              supportLang={supportLang}
            />
          );
        })}
      </View>

      {/* 4. Daily Mini Fun Challenge Card */}
      <GluestackAnimatedCard
        style={{ marginTop: 16 }}
        badge="⭐ MINI-MISSION"
        badgeColor="#F59E0B"
      >
        <LinearGradient
          colors={isDark ? ['#1e293b', '#0f172a'] : ['#F0FDF4', '#DCFCE7']}
          style={[styles.challengeGradient, { borderRadius: 16 }]}
        >
          <View style={styles.challengeTopRow}>
            <View style={styles.challengeBadge}>
              <Text style={styles.challengeBadgeText}>⭐ MINI-MISSION</Text>
            </View>
            <Text style={styles.rewardText}>+3 ⭐ +20 🪙</Text>
          </View>

          <Text style={[styles.challengeQuestion, { color: colors.text }]}>
            {supportLang === 'ar'
              ? activeModule.funChallenge.questionAr
              : activeModule.funChallenge.questionDe}
          </Text>

          {/* Option Buttons */}
          <View style={styles.optionsCol}>
            {activeModule.funChallenge.options.map((opt, optIdx) => {
              const isPicked = challengeAnswer === optIdx;
              const isCorrect = optIdx === activeModule.funChallenge.correct;

              let btnBg = colors.bgCard;
              let borderCol = colors.border;
              let textCol = colors.text;

              if (challengeSolved) {
                if (isCorrect) {
                  btnBg = '#10B981';
                  borderCol = '#059669';
                  textCol = '#FFFFFF';
                }
              } else if (isPicked) {
                btnBg = '#EF4444';
                borderCol = '#DC2626';
                textCol = '#FFFFFF';
              }

              return (
                <TouchableOpacity
                  key={optIdx}
                  style={[styles.challengeOptionBtn, { backgroundColor: btnBg, borderColor: borderCol }]}
                  onPress={() => handleSelectChallenge(optIdx)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.optionText, { color: textCol }]}>{opt}</Text>
                  {challengeSolved && isCorrect && (
                    <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {challengeSolved && (
            <View style={styles.victoryFeedback}>
              <Text style={styles.victoryText}>🎉 Super gemacht! Richtig! 🌟</Text>
              <Text style={styles.victorySub}>
                {supportLang === 'ar'
                  ? activeModule.funChallenge.explanationAr
                  : activeModule.funChallenge.explanation}
              </Text>
            </View>
          )}
        </LinearGradient>
      </GluestackAnimatedCard>

      {/* 5. Quick World Map Adventure Button */}
      <TouchableOpacity
        style={styles.mapBannerBtn}
        onPress={() => {
          console.log('[KidsDashboardView] mapBannerBtn pressed! onNavigate:', typeof onNavigate);
          soundService.playSfx('tap');
          if (onNavigate) onNavigate('learn');
        }}
        activeOpacity={0.88}
      >
        <LinearGradient
          colors={['#8B5CF6', '#6D28D9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.mapBannerGradient}
        >
          <View style={styles.mapBannerRow}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.mapBannerBadge}>🗺️ DER ABENTEUERPFAD</Text>
              <Text style={styles.mapBannerTitle}>
                {supportLang === 'ar' ? 'خريطة المغامرة التفاعلية' : 'Zur Abenteuer-Weltkarte'}
              </Text>
              <Text style={styles.mapBannerSub}>
                {supportLang === 'ar'
                  ? 'اكتشف الغابة السحرية والمدينة وافتح صناديق الجوائز 🎁'
                  : 'Explore magical biomes, step stones & mystery chests 🎁'}
              </Text>
            </View>
            <Text style={{ fontSize: 36 }}>🧭</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 120,
    gap: 16,
  },
  mascotHero: {
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  heroLight: {},
  heroDark: {},
  heroGradient: {
    padding: 16,
    borderRadius: 24,
  },
  heroRow: {
    alignItems: 'center',
    gap: 14,
  },
  mascotLogo: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  speechBubble: {
    flex: 1,
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
    gap: 4,
  },
  bubbleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mascotName: {
    fontSize: 14,
    fontWeight: '900',
    color: '#D97706',
  },
  starPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  starText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  speechText: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  categoriesRow: {
    gap: 10,
    paddingVertical: 2,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    gap: 8,
    borderWidth: 1,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '800',
  },
  sectionHeader: {
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  wordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  gridCardWrapper: {
    width: (width - 44) / 2,
    marginBottom: 12,
  },
  kidCard: {
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  topMiniBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 7,
  },
  topMiniBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  emojiCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 6,
  },
  wordEmoji: {
    fontSize: 34,
  },
  wordGerman: {
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  wordTrans: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 2,
  },
  exampleSnippet: {
    fontSize: 10,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 3,
    paddingHorizontal: 2,
  },
  voiceActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 8,
  },
  smallVoiceBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceBtnText: {
    fontSize: 10,
    fontWeight: '800',
  },
  speakerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 5,
    marginTop: 8,
  },
  speakerText: {
    fontSize: 11,
    fontWeight: '800',
  },
  challengeCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
  },
  challengeGradient: {
    padding: 18,
  },
  challengeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  challengeBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  challengeBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#D97706',
  },
  rewardText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#10B981',
  },
  challengeQuestion: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 12,
    lineHeight: 22,
  },
  optionsCol: {
    gap: 10,
  },
  challengeOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '800',
  },
  victoryFeedback: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    padding: 12,
    borderRadius: 14,
    marginTop: 12,
    alignItems: 'center',
  },
  victoryText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#059669',
  },
  victorySub: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
    marginTop: 2,
  },
  mapBannerBtn: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  mapBannerGradient: {
    padding: 18,
    borderRadius: 24,
  },
  mapBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mapBannerBadge: {
    fontSize: 11,
    fontWeight: '900',
    color: '#DDD6FE',
    letterSpacing: 0.5,
  },
  mapBannerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  mapBannerSub: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 16,
  },
});

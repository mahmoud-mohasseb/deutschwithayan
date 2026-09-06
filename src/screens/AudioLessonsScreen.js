// ============================================================
// LESSONS & AUDIO SCREEN — DEUTSCH WITH AYAN 🇩🇪
// Features:
// 1. All 3,000+ Collins Words for EVERY Level (A1, A2, B1, B2)
// 2. Structured Examples (German, English, Egyptian Arabic) with Audio
// 3. Situational Audio Dialogue Tracks (A1 to C2)
// 4. Trilingual Reading (🇩🇪 DE, 🇬🇧 EN, 🇪🇬 AR) with Zero Voice Overlap
// 5. High-Performance Pagination, Search, and Category Filtering
// ============================================================

import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../styles/theme';
import { useLanguage } from '../context/LanguageContext';
import { useAppTheme } from '../context/ThemeContext';
import soundService from '../services/soundService';
import SpecialIcon from '../components/common/SpecialIcon';
import AudioPronounceButton from '../components/common/AudioPronounceButton';
import GluestackAnimatedCard from '../components/common/GluestackAnimatedCard';
import {
  COLLINS_A1,
  COLLINS_A2,
  COLLINS_B1,
  COLLINS_B2,
} from '../../data/collins/index';

const PAGE_SIZE = 35;

export default function AudioLessonsScreen({ onNavigate, onOpenMenu }) {
  const { supportLang, toggleSupportLang, cefrLevel, isRTL, t } = useLanguage();
  const { isDark, toggleTheme, colors } = useAppTheme();

  // Active level tab: 'A1' | 'A2' | 'B1' | 'B2' | 'DIALOGUES'
  const [activeLevel, setActiveLevel] = useState(cefrLevel && ['A1', 'A2', 'B1', 'B2'].includes(cefrLevel) ? cefrLevel : 'A1');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);

  // Audio tracks for situational dialogues
  const audioTracks = [
    {
      id: 1,
      level: 'A1',
      category: 'Design & Colors',
      germanTitle: 'Farben, Formen & Design',
      enTitle: 'Colors, Shapes & Visual Design',
      arTitle: 'الألوان والأشكال والتصميم البصري 🇪🇬',
      duration: '04:15',
      progress: 0.8,
      color: '#FF6B6B',
      speechText: 'Guten Tag! Willkommen zum Thema Farben und Formen auf Deutsch. Der Tisch ist blau, das Haus ist rot.',
    },
    {
      id: 2,
      level: 'A1',
      category: 'Daily Living',
      germanTitle: 'Im Supermarkt • Einkaufen & Bezahlen',
      enTitle: 'At the Supermarket • Shopping & Paying',
      arTitle: 'في السوبرماركت • التسوق والدفع 🇪🇬',
      duration: '05:30',
      progress: 0.65,
      color: '#10B981',
      speechText: 'Wie viel kostet ein Kilo Äpfel? Das macht zusammen vier Euro und fünfzig Cent, bitte.',
    },
    {
      id: 3,
      level: 'A2',
      category: 'Public Transit',
      germanTitle: 'Reisen am Hauptbahnhof Berlin',
      enTitle: 'Traveling at Berlin Central Station',
      arTitle: 'السفر في محطة برلين المركزية 🇪🇬',
      duration: '06:20',
      progress: 0.4,
      color: '#3B82F6',
      speechText: 'Achtung an Gleis 4: Der ICE nach München Hauptbahnhof fährt jetzt ein. Bitte Vorsicht an der Bahnsteigkante.',
    },
    {
      id: 4,
      level: 'A2',
      category: 'Doctor & Health',
      germanTitle: 'Beim Arzt • Symptome beschreiben',
      enTitle: 'At the Doctor • Describing Symptoms',
      arTitle: 'عند الطبيب • وصف الأعراض 🇪🇬',
      duration: '07:10',
      progress: 0.25,
      color: '#EC4899',
      speechText: 'Guten Morgen, Herr Doktor. Ich habe seit zwei Tagen starke Kopfschmerzen und Husten.',
    },
    {
      id: 5,
      level: 'B1',
      category: 'Job Interview',
      germanTitle: 'Bewerbungsgespräch & Karriere',
      enTitle: 'Job Interview & Career Planning',
      arTitle: 'مقابلة العمل والتخطيط الوظيفي 🇪🇬',
      duration: '08:45',
      progress: 0.7,
      color: '#F59E0B',
      speechText: 'Können Sie uns Ihre Stärken und Ihre bisherigen Erfahrungen im Projektmanagement schildern?',
    },
    {
      id: 6,
      level: 'B2',
      category: 'Technology & AI',
      germanTitle: 'Künstliche Intelligenz im Alltag',
      enTitle: 'Artificial Intelligence in Everyday Life',
      arTitle: 'الذكاء الاصطناعي في الحياة اليومية 🇪🇬',
      duration: '09:15',
      progress: 0.5,
      color: '#8B5CF6',
      speechText: 'Algorithmen verändern die Art und Weise, wie wir Sprachen lernen und Daten analysieren nachhaltig.',
    },
    {
      id: 7,
      level: 'C1',
      category: 'Academic Research',
      germanTitle: 'Wissenschaftliche Methodik & Analyse',
      enTitle: 'Scientific Methodology & Critical Analysis',
      arTitle: 'المنهجية العلمية والتحليل الأكاديمي 🇪🇬',
      duration: '11:20',
      progress: 0.3,
      color: '#6366F1',
      speechText: 'In Anbetracht der vorliegenden empirischen Befunde lässt sich eine signifikante Korrelation feststellen.',
    },
    {
      id: 8,
      level: 'C2',
      category: 'Rhetoric & Idioms',
      germanTitle: 'Rhetorik, Nuancen & Redewendungen',
      enTitle: 'High Register Rhetoric & Subtle Idioms',
      arTitle: 'البلاغة الرفيعة والتعبيرات الاصطلاحية 🇪🇬',
      duration: '12:50',
      progress: 0.15,
      color: '#D97706',
      speechText: 'Den Nagel auf den Kopf treffen und mit spitzer Feder argumentieren kennzeichnen meisterhafte Beredsamkeit.',
    },
  ];

  // Stop audio on unmount
  useEffect(() => {
    const unsubscribe = soundService.subscribe((state) => {
      setCurrentlyPlayingId(state.currentTrackId);
    });
    return () => {
      unsubscribe();
      soundService.stopAudio();
      soundService.stopSpeech();
    };
  }, []);

  // Reset pagination when level, category, or search changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeLevel, selectedCategory, searchQuery]);

  const levelTabs = [
    { id: 'A1', label: 'A1', count: COLLINS_A1.length },
    { id: 'A2', label: 'A2', count: COLLINS_A2.length },
    { id: 'B1', label: 'B1', count: COLLINS_B1.length },
    { id: 'B2', label: 'B2', count: COLLINS_B2.length },
    { id: 'DIALOGUES', label: supportLang === 'ar' ? '🎧 حوارات' : '🎧 Dialogues', count: audioTracks.length },
  ];

  // Get active pool of words
  const wordsPool = useMemo(() => {
    switch (activeLevel) {
      case 'A1': return COLLINS_A1;
      case 'A2': return COLLINS_A2;
      case 'B1': return COLLINS_B1;
      case 'B2': return COLLINS_B2;
      default: return [];
    }
  }, [activeLevel]);

  // Extract categories for active level
  const availableCategories = useMemo(() => {
    if (activeLevel === 'DIALOGUES') return [];
    const set = new Set();
    wordsPool.forEach((w) => {
      if (w.category) set.add(w.category);
    });
    return ['ALL', ...Array.from(set).sort()];
  }, [wordsPool, activeLevel]);

  // Filtered words
  const filteredWords = useMemo(() => {
    if (activeLevel === 'DIALOGUES') return [];
    const q = searchQuery.trim().toLowerCase();

    return wordsPool.filter((item) => {
      const matchCat = selectedCategory === 'ALL' || item.category === selectedCategory;
      if (!matchCat) return false;

      if (!q) return true;

      const matchGerman = (item.german || '').toLowerCase().includes(q);
      const matchBase = (item.base || '').toLowerCase().includes(q);
      const matchEnglish = (item.english || '').toLowerCase().includes(q);
      const matchArabic = (item.arabic || '').includes(q);
      const matchExDe = (item.example?.de || '').toLowerCase().includes(q);
      const matchExEn = (item.example?.en || '').toLowerCase().includes(q);
      const matchExAr = (item.example?.ar || '').includes(q);

      return matchGerman || matchBase || matchEnglish || matchArabic || matchExDe || matchExEn || matchExAr;
    });
  }, [wordsPool, activeLevel, selectedCategory, searchQuery]);

  const displayedWords = useMemo(() => {
    return filteredWords.slice(0, visibleCount);
  }, [filteredWords, visibleCount]);

  const handlePlayTrack = async (track) => {
    soundService.playSfx('tap');
    const result = await soundService.toggleTrackAudio(track.id, track.speechText, {
      onDone: () => setCurrentlyPlayingId(null),
      onError: () => setCurrentlyPlayingId(null),
    });
    setCurrentlyPlayingId(result.trackId);
  };

  const handleLoadMore = () => {
    soundService.playSfx('tap');
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  const getBadgeColor = (article, type) => {
    if (article === 'der') return '#3B82F6';
    if (article === 'die') return '#EC4899';
    if (article === 'das') return '#10B981';
    if (type === 'verb') return '#8B5CF6';
    if (type === 'phrase') return '#F59E0B';
    return '#6B7280';
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bg }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Header Row */}
      <View style={[styles.headerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text style={[styles.screenHeading, { color: colors.text }]} numberOfLines={1}>
            {supportLang === 'ar' ? 'الدروس والشروحات 🇪🇬' : 'Lessons & Practice'}
          </Text>

          {/* Language & Level Selector Dropdown */}
          <TouchableOpacity
            style={[styles.langDropdownPill, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            onPress={() => {
              soundService.playSfx('tap');
              toggleSupportLang();
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.langFlag}>🇩🇪</Text>
            <Text style={[styles.langDropdownText, { color: colors.text }]}>
              Deutsch <Text style={styles.dropdownChevron}>▾</Text>
            </Text>
            <Text
              style={[styles.langLevelSubtitle, { color: colors.textMuted }]}
              numberOfLines={1}
            >
              {activeLevel === 'DIALOGUES'
                ? (supportLang === 'ar' ? '8 تسجيلات حوارية' : '8 Dialogue Tracks')
                : (supportLang === 'ar' ? `${wordsPool.length} كلمة ومثال` : `${wordsPool.length} Words & Examples`)}
            </Text>
            <View style={[styles.supportChip, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}>
              <Text style={[styles.supportChipText, { color: colors.text }]}>
                {supportLang === 'ar' ? '🇪🇬 AR' : '🇬🇧 EN'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Header Action Buttons: Theme Toggle & Menu */}
        <View style={styles.headerActionBtns}>
          <TouchableOpacity
            style={[
              styles.iconCircleBtn,
              { backgroundColor: colors.bgCard, borderColor: colors.border },
              isDark ? THEME.shadowsDark.softPill : THEME.shadows.softPill,
            ]}
            onPress={() => {
              soundService.playSfx('tap');
              toggleTheme();
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.themeToggleIcon}>{isDark ? '🌙' : '☀️'}</Text>
          </TouchableOpacity>

          {onOpenMenu && (
            <TouchableOpacity
              style={[
                styles.iconCircleBtn,
                { backgroundColor: colors.bgCard, borderColor: colors.border },
                isDark ? THEME.shadowsDark.softPill : THEME.shadows.softPill,
              ]}
              onPress={() => {
                soundService.playSfx('tap');
                onOpenMenu();
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="grid-outline" size={18} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Level Selection Tabs (A1, A2, B1, B2, Dialogues) */}
      <View style={styles.levelTabsRow}>
        {levelTabs.map((tab) => {
          const isActive = activeLevel === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.levelTabPill,
                {
                  backgroundColor: isActive ? colors.primary : colors.bgCard,
                  borderColor: isActive ? colors.primary : colors.border,
                },
                isActive && (isDark ? THEME.shadowsDark.softPill : THEME.shadows.softPill),
              ]}
              onPress={() => {
                soundService.playSfx('tap');
                soundService.stopAudio();
                soundService.stopSpeech();
                setActiveLevel(tab.id);
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              activeOpacity={0.75}
            >
              <Text style={[styles.levelTabLabel, { color: isActive ? '#FFFFFF' : colors.text }]}>
                {tab.label}
              </Text>
              <View style={[styles.levelTabBadge, { backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : colors.bgElevated }]}>
                <Text style={[styles.levelTabBadgeText, { color: isActive ? '#FFFFFF' : colors.textMuted }]}>
                  {tab.count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Vocabulary Mode (A1 - B2) */}
      {activeLevel !== 'DIALOGUES' ? (
        <>
          {/* Search Box */}
          <View
            style={[
              styles.searchBar,
              {
                backgroundColor: colors.bgCard,
                borderColor: colors.border,
                flexDirection: isRTL ? 'row-reverse' : 'row',
              },
            ]}
          >
            <Ionicons name="search" size={18} color={colors.textMuted} style={styles.searchIcon} />
            <TextInput
              style={[
                styles.searchInput,
                { color: colors.text, textAlign: isRTL ? 'right' : 'left' },
              ]}
              placeholder={
                supportLang === 'ar'
                  ? 'ابحث في الكلمات، الأمثلة، أو المعاني بالعربي والألماني...'
                  : 'Search German words, English, Arabic, or examples...'
              }
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Category Filter Horizontal Ribbon */}
          {availableCategories.length > 1 && (
            <View style={styles.filterRibbonContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[styles.filterRibbonContent, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
              >
                {availableCategories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.catPill,
                        {
                          backgroundColor: isActive ? colors.primary : colors.bgElevated,
                          borderColor: isActive ? colors.primary : colors.border,
                        },
                      ]}
                      onPress={() => {
                        soundService.playSfx('tap');
                        setSelectedCategory(cat);
                      }}
                      activeOpacity={0.75}
                    >
                      <Text style={[styles.catPillText, { color: isActive ? '#FFFFFF' : colors.text }]}>
                        {cat === 'ALL'
                          ? (supportLang === 'ar' ? `الكل (${wordsPool.length})` : `All (${wordsPool.length})`)
                          : cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Filter Status Summary */}
          <View style={[styles.summaryRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.summaryText, { color: colors.textMuted }]}>
              {supportLang === 'ar'
                ? `عرض ${displayedWords.length} من أصل ${filteredWords.length} درس في ${activeLevel}`
                : `Showing ${displayedWords.length} of ${filteredWords.length} lessons in Level ${activeLevel}`}
            </Text>
          </View>

          {/* 3,000 Words Structured Lesson Cards List */}
          <View style={styles.cardsList}>
            {displayedWords.map((item) => {
              const badgeColor = getBadgeColor(item.article, item.type);

              return (
                <View
                  key={item.id}
                  style={[
                    styles.lessonCard,
                    { backgroundColor: colors.bgCard, borderColor: colors.border },
                    isDark ? THEME.shadowsDark.softCard : THEME.shadows.softCard,
                  ]}
                >
                  {/* Card Header Row: Badges & Trilingual Pronunciation Buttons */}
                  <View style={[styles.cardHeaderRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <View style={[styles.articleBadge, { backgroundColor: badgeColor }]}>
                        <Text style={styles.articleBadgeText}>
                          {item.article || item.type || 'word'}
                        </Text>
                      </View>
                      <View style={[styles.typeBadge, { borderColor: colors.border, backgroundColor: colors.bgElevated }]}>
                        <Text style={[styles.typeBadgeText, { color: colors.textMuted }]}>
                          {item.type || 'vocab'}
                        </Text>
                      </View>
                      {item.category && (
                        <View style={[styles.categoryPill, { backgroundColor: colors.bgElevated }]}>
                          <Text style={[styles.categoryPillText, { color: colors.textMuted }]} numberOfLines={1}>
                            {item.category}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Word Trilingual Reading Pronunciation (🇩🇪 🇬🇧 🇪🇬) */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <AudioPronounceButton text={item.german} lang="de" flag="🇩🇪" size={15} />
                      <AudioPronounceButton text={item.english} lang="en" flag="🇬🇧" size={15} />
                      <AudioPronounceButton text={item.arabic} lang="ar" flag="🇪🇬" size={15} />
                    </View>
                  </View>

                  {/* Main Word & Bilingual Translations */}
                  <View style={styles.wordMainBox}>
                    <Text style={[styles.germanWordText, { color: colors.text }]}>{item.german}</Text>
                    <View style={[styles.transRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                      <Text style={[styles.englishTransText, { color: colors.textSecondary }]}>
                        🇬🇧 {item.english}
                      </Text>
                      <Text style={[styles.arabicTransText, { color: colors.coral }]}>
                        🇪🇬 {item.arabic}
                      </Text>
                    </View>
                  </View>

                  {/* Structured Example Box with Same Structure (🇩🇪 🇬🇧 🇪🇬) */}
                  {item.example && (
                    <View
                      style={[
                        styles.exampleBox,
                        { backgroundColor: colors.bgElevated, borderColor: colors.border },
                      ]}
                    >
                      <View style={[styles.exampleHeaderRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <Text style={[styles.exampleHeading, { color: colors.textMuted }]}>
                          💬 {supportLang === 'ar' ? 'مثال تطبيقي مع النطق' : 'Real-Life Context Example'}
                        </Text>
                      </View>

                      {/* German Example Sentence */}
                      <View style={[styles.exampleSentenceRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <Text style={[styles.exampleDeText, { color: colors.text, flex: 1 }]}>
                          🇩🇪 {item.example.de}
                        </Text>
                        <AudioPronounceButton text={item.example.de} lang="de" flag="🇩🇪" size={14} />
                      </View>

                      {/* English Example Translation */}
                      {item.example.en && (
                        <View style={[styles.exampleSentenceRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                          <Text style={[styles.exampleEnText, { color: colors.textSecondary, flex: 1 }]}>
                            🇬🇧 {item.example.en}
                          </Text>
                          <AudioPronounceButton text={item.example.en} lang="en" flag="🇬🇧" size={14} />
                        </View>
                      )}

                      {/* Egyptian Arabic Example Translation */}
                      {item.example.ar && (
                        <View style={[styles.exampleSentenceRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                          <Text style={[styles.exampleArText, { color: colors.mint, flex: 1 }]}>
                            🇪🇬 {item.example.ar}
                          </Text>
                          <AudioPronounceButton text={item.example.ar} lang="ar" flag="🇪🇬" size={14} />
                        </View>
                      )}
                    </View>
                  )}

                  {/* Grammar Note & Colloquial Explanation Box */}
                  {(item.grammarTip || item.explanation) && (
                    <View style={[styles.grammarNoteBox, { backgroundColor: isDark ? '#1E293B' : '#FEF3C7', borderColor: isDark ? '#334155' : '#FDE68A' }]}>
                      {item.grammarTip && (
                        <Text style={[styles.grammarTipText, { color: isDark ? '#FBBF24' : '#B45309' }]}>
                          💡 {item.grammarTip}
                        </Text>
                      )}
                      {item.explanation && (
                        <Text style={[styles.explanationNoteText, { color: isDark ? '#94A3B8' : '#78350F' }]}>
                          {supportLang === 'ar' ? (item.explanation.ar || item.explanation.en) : item.explanation.en}
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* Load More Button for High Performance */}
          {visibleCount < filteredWords.length && (
            <TouchableOpacity
              style={[styles.loadMoreBtn, { backgroundColor: colors.primary }]}
              onPress={handleLoadMore}
              activeOpacity={0.8}
            >
              <Text style={styles.loadMoreBtnText}>
                {supportLang === 'ar'
                  ? `تحميل المزيد من الكلمات (+${Math.min(PAGE_SIZE, filteredWords.length - visibleCount)} كلمة)`
                  : `Load More Words (+${Math.min(PAGE_SIZE, filteredWords.length - visibleCount)} remaining)`}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </>
      ) : (
        /* Dialogue Audio Tracks List */
        <View style={styles.cardsList}>
          {audioTracks.map((track) => {
            const isPlaying = currentlyPlayingId === track.id;

            return (
              <GluestackAnimatedCard
                key={track.id}
                title={track.germanTitle}
                subtitle={`🇬🇧 ${track.enTitle}`}
                arabicSubtitle={track.arTitle}
                levelBadge={track.level}
                badge={track.duration}
                badgeColor={isPlaying ? '#10B981' : undefined}
                active={isPlaying}
                onPress={() => handlePlayTrack(track)}
                leftIcon={
                  <View
                    style={[
                      styles.playCircleBtn,
                      {
                        backgroundColor: isPlaying ? '#10B981' : `${track.color}20`,
                        borderColor: track.color,
                      },
                    ]}
                  >
                    <Ionicons
                      name={isPlaying ? 'pause' : 'play'}
                      size={20}
                      color={isPlaying ? '#FFFFFF' : track.color}
                    />
                  </View>
                }
              >
                {/* Audio progress & wave preview */}
                <View style={styles.wavePreviewRow}>
                  <View style={[styles.progressTrackBar, { backgroundColor: isDark ? '#334155' : '#E2E8F0' }]}>
                    <View
                      style={[
                        styles.progressFillBar,
                        {
                          width: isPlaying ? '90%' : `${Math.round(track.progress * 100)}%`,
                          backgroundColor: track.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.categoryTag, { color: track.color }]}>{track.category}</Text>
                </View>
              </GluestackAnimatedCard>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120,
    gap: 14,
  },
  headerRow: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  screenHeading: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  langDropdownPill: {
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  langFlag: {
    fontSize: 18,
  },
  langDropdownText: {
    fontSize: 14,
    fontWeight: '800',
  },
  dropdownChevron: {
    fontSize: 12,
  },
  langLevelSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  supportChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 6,
    borderWidth: 1,
  },
  supportChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  headerActionBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  iconCircleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  themeToggleIcon: {
    fontSize: 18,
  },
  levelTabsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  levelTabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  levelTabLabel: {
    fontSize: 13,
    fontWeight: '800',
  },
  levelTabBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  levelTabBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchIcon: {
    marginRight: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  filterRibbonContainer: {
    marginHorizontal: -16,
  },
  filterRibbonContent: {
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 2,
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  catPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  summaryRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  summaryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardsList: {
    gap: 12,
  },
  lessonCard: {
    borderRadius: THEME.radius.lg,
    padding: 14,
    borderWidth: 1,
    gap: 10,
  },
  cardHeaderRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  articleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  articleBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  typeBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'lowercase',
  },
  categoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    maxWidth: 140,
  },
  categoryPillText: {
    fontSize: 10,
    fontWeight: '600',
  },
  wordMainBox: {
    gap: 4,
  },
  germanWordText: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  transRow: {
    gap: 12,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  englishTransText: {
    fontSize: 14,
    fontWeight: '700',
  },
  arabicTransText: {
    fontSize: 14,
    fontWeight: '700',
  },
  exampleBox: {
    borderRadius: THEME.radius.md,
    padding: 10,
    borderWidth: 1,
    gap: 8,
  },
  exampleHeaderRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exampleHeading: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  exampleSentenceRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  exampleDeText: {
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
  },
  exampleEnText: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  exampleArText: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  grammarNoteBox: {
    borderRadius: THEME.radius.sm,
    padding: 8,
    borderWidth: 1,
    gap: 4,
  },
  grammarTipText: {
    fontSize: 12,
    fontWeight: '800',
  },
  explanationNoteText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  loadMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: THEME.radius.md,
    gap: 8,
    marginTop: 4,
  },
  loadMoreBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  playCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wavePreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 6,
  },
  progressTrackBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFillBar: {
    height: '100%',
    borderRadius: 3,
  },
  categoryTag: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});

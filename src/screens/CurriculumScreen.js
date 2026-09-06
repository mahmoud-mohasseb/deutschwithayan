// ============================================================
// CURRICULUM SCREEN (A1 to C2 Grammar Tracks & Collins 3000 Corpus)
// 1. Structured Grammar Tracks (A1-C2 CEFR outlines)
// 2. Collins 3000 Vocabulary & Phrases (A1, A2, B1, B2)
//    with Egyptian Arabic 🇪🇬, Audio, Grammar Explanations & Examples
// ============================================================

import React, { useState, useMemo } from 'react';
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
import { GRAMMAR_TOPICS, CEFR_LEVELS } from '../../data/curriculum';
import {
  COLLINS_A1,
  COLLINS_A2,
  COLLINS_B1,
  COLLINS_B2,
  COLLINS_CATEGORIES,
} from '../../data/collins/index';
import { useLanguage } from '../context/LanguageContext';
import { useAppTheme } from '../context/ThemeContext';
import soundService from '../services/soundService';

const COLLINS_LEVELS = ['A1', 'A2', 'B1', 'B2'];

export default function CurriculumScreen({ onSelectTopic, onBack, initialTab = 'COLLINS' }) {
  const { supportLang, cefrLevel, setCefrLevel, isRTL, t } = useLanguage();
  const { isDark, colors } = useAppTheme();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeLevel, setActiveLevel] = useState(cefrLevel || 'A1');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [expandedCardId, setExpandedCardId] = useState(null);

  const styles = useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  React.useEffect(() => {
    return () => {
      soundService.stopAudio();
      soundService.stopSpeech();
    };
  }, []);

  // Grammar topics for selected level
  const grammarTopics = GRAMMAR_TOPICS[activeLevel] || [];

  // Collins words for selected level
  const collinsPool = useMemo(() => {
    switch (activeLevel) {
      case 'A1': return COLLINS_A1 || [];
      case 'A2': return COLLINS_A2 || [];
      case 'B1': return COLLINS_B1 || [];
      case 'B2': return COLLINS_B2 || [];
      default: return COLLINS_A1 || [];
    }
  }, [activeLevel]);

  // Filter Collins words by search query and category
  const filteredCollinsWords = useMemo(() => {
    return collinsPool.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.german.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.arabic && item.arabic.includes(searchQuery));

      const matchesCategory =
        selectedCategory === 'ALL' || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [collinsPool, searchQuery, selectedCategory]);

  const toggleExpand = (id) => {
    soundService.playSfx('tap');
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  const getArticleColor = (article, type) => {
    if (article === 'der') return '#3b82f6'; // Blue
    if (article === 'die') return '#ec4899'; // Red / Pink
    if (article === 'das') return '#10b981'; // Green
    if (type === 'verb') return '#8b5cf6'; // Purple
    if (type === 'phrase') return '#f59e0b'; // Amber
    return '#6b7280';
  };

  return (
    <View style={styles.container}>
      {/* Optional Back Navigation Header */}
      {onBack && (
        <View style={[styles.topBar, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity
            style={[styles.backButton, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            onPress={() => {
              soundService.playSfx('tap');
              soundService.stopAudio();
              soundService.stopSpeech();
              onBack();
            }}
            activeOpacity={0.7}
          >
            <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={20} color={colors.text} />
            <Text style={[styles.backButtonText, { color: colors.text }]}>
              {supportLang === 'ar' ? 'الرجوع للكورسات 🇪🇬' : 'Back to Courses'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Mode Switcher: Grammar vs Collins 3000 */}
      <View style={styles.modeSwitcherContainer}>
        <View style={styles.modeSwitcher}>
          <TouchableOpacity
            style={[styles.modeBtn, activeTab === 'COLLINS' && styles.activeModeBtn]}
            onPress={() => setActiveTab('COLLINS')}
            activeOpacity={0.8}
          >
            <Text style={[styles.modeBtnText, activeTab === 'COLLINS' && styles.activeModeBtnText]}>
              📖 {supportLang === 'ar' ? 'كلمات كولينز 3000 🇪🇬' : 'Collins 3000 Words'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeBtn, activeTab === 'GRAMMAR' && styles.activeModeBtn]}
            onPress={() => setActiveTab('GRAMMAR')}
            activeOpacity={0.8}
          >
            <Text style={[styles.modeBtnText, activeTab === 'GRAMMAR' && styles.activeModeBtnText]}>
              📚 {supportLang === 'ar' ? 'مسار القواعد' : 'Grammar Tracks'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CEFR Level Selector Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
          {(activeTab === 'COLLINS' ? COLLINS_LEVELS : CEFR_LEVELS).map((level) => {
            const isActive = activeLevel === level;
            return (
              <TouchableOpacity
                key={level}
                style={[styles.levelTab, isActive && styles.activeLevelTab]}
                onPress={() => {
                  setActiveLevel(level);
                  setCefrLevel(level);
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                }}
              >
                <Text style={[styles.levelTabText, isActive && styles.activeLevelTabText]}>
                  {level}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {activeTab === 'COLLINS' ? (
        <ScrollView style={styles.scrollList} contentContainerStyle={styles.listContent}>
          {/* Header Banner */}
          <View style={[styles.headerBanner, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={styles.bannerEmoji}>📖</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>
                {activeLevel} {supportLang === 'ar' ? 'كلمات وتعبيرات كولينز 3000' : 'Collins 3000 Vocabulary & Phrases'}
              </Text>
              <Text style={styles.bannerSub}>
                {filteredCollinsWords.length}{' '}
                {supportLang === 'ar' ? 'كلمة وتعبير بأمثلة وشرح مصري 🇪🇬' : 'words & phrases with audio, examples & grammar'}
              </Text>
            </View>
          </View>

          {/* Search Input Bar */}
          <View style={[styles.searchBar, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Ionicons name="search-outline" size={18} color={colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { textAlign: isRTL ? 'right' : 'left' }]}
              placeholder={supportLang === 'ar' ? 'ابحث بالألماني أو الإنجليزي أو العربي 🇪🇬...' : 'Search in German, English, or Arabic...'}
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Category Chips Scroll */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryChipsContainer}>
            <TouchableOpacity
              style={[styles.categoryChip, selectedCategory === 'ALL' && styles.activeCategoryChip]}
              onPress={() => setSelectedCategory('ALL')}
            >
              <Text style={[styles.categoryChipText, selectedCategory === 'ALL' && styles.activeCategoryChipText]}>
                🌟 {supportLang === 'ar' ? 'كل المواضيع' : 'All Topics'}
              </Text>
            </TouchableOpacity>
            {COLLINS_CATEGORIES.map((cat) => {
              const isCatActive = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <TouchableOpacity
                  key={cat.name}
                  style={[styles.categoryChip, isCatActive && styles.activeCategoryChip]}
                  onPress={() => setSelectedCategory(cat.name)}
                >
                  <Text style={[styles.categoryChipText, isCatActive && styles.activeCategoryChipText]}>
                    {cat.emoji} {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Words List */}
          {filteredCollinsWords.slice(0, 100).map((item, idx) => {
            const isExpanded = expandedCardId === item.id;
            const badgeColor = getArticleColor(item.article, item.type);
            const badgeLabel = item.article ? item.article.toUpperCase() : item.type ? item.type.toUpperCase() : 'WORT';

            return (
              <TouchableOpacity
                key={item.id || idx}
                style={[styles.wordCard, isExpanded && styles.wordCardExpanded]}
                onPress={() => toggleExpand(item.id)}
                activeOpacity={0.85}
              >
                {/* Main Row */}
                <View style={[styles.wordCardRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  {/* Article/Type Badge */}
                  <View style={[styles.articleBadge, { backgroundColor: `${badgeColor}18`, borderColor: badgeColor }]}>
                    <Text style={[styles.articleBadgeText, { color: badgeColor }]}>{badgeLabel}</Text>
                  </View>

                  {/* German & Translations */}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.germanTerm} numberOfLines={1}>
                      {item.german}
                    </Text>
                    <Text style={[styles.translationRow, { textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>
                      {item.arabic} • <Text style={{ color: colors.textMuted }}>{item.english}</Text>
                    </Text>
                  </View>

                  {/* Audio Speaker Action Buttons (🇩🇪 German • 🇬🇧 English • 🇪🇬 Arabic) */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <TouchableOpacity
                      style={styles.speakerBtn}
                      onPress={() => soundService.speakGerman(item.german)}
                      hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                    >
                      <Text style={{ fontSize: 11 }}>🇩🇪</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.speakerBtn, { backgroundColor: 'rgba(59, 130, 246, 0.12)' }]}
                      onPress={() => soundService.speakEnglish(item.english)}
                      hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                    >
                      <Text style={{ fontSize: 11 }}>🇬🇧</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.speakerBtn, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}
                      onPress={() => soundService.speakArabic(item.arabic)}
                      hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                    >
                      <Text style={{ fontSize: 11 }}>🇪🇬</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Expand Chevron */}
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={colors.textMuted}
                  />
                </View>

                {/* Expanded Detailed Grammar & Example Panel */}
                {isExpanded && (
                  <View style={styles.detailContainer}>
                    {/* Grammar Explanation Box */}
                    <View style={styles.explanationBox}>
                      <View style={[styles.boxHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <Ionicons name="bulb-outline" size={16} color="#f59e0b" />
                        <Text style={styles.boxTitle}>
                          {supportLang === 'ar' ? 'الشرح النحوي (مصري 🇪🇬)' : 'Grammar & Usage Note'}
                        </Text>
                        <TouchableOpacity
                          style={[styles.exampleSpeaker, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}
                          onPress={() => {
                            const expText = supportLang === 'ar' ? item.explanation?.ar : item.explanation?.en;
                            if (supportLang === 'ar') {
                              soundService.speakArabic(expText);
                            } else {
                              soundService.speakEnglish(expText);
                            }
                          }}
                          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                        >
                          <Ionicons name="volume-medium" size={14} color="#d97706" />
                        </TouchableOpacity>
                      </View>
                      <Text style={[styles.explanationText, { textAlign: isRTL ? 'right' : 'left' }]}>
                        {supportLang === 'ar' ? item.explanation?.ar : item.explanation?.en}
                      </Text>
                      {item.explanation?.grammarTip && (
                        <View style={styles.grammarTipPill}>
                          <Text style={styles.grammarTipText}>💡 {item.explanation.grammarTip}</Text>
                        </View>
                      )}
                    </View>

                    {/* Example Sentence Box */}
                    {item.example && (
                      <View style={styles.exampleBox}>
                        <View style={[styles.boxHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                            <Ionicons name="chatbubble-ellipses-outline" size={16} color="#3b82f6" />
                            <Text style={styles.boxTitle}>
                              {supportLang === 'ar' ? 'مثال واقعي في جملة' : 'Real-Life Example'}
                            </Text>
                          </View>

                          {/* Trilingual Example Voice Reading Buttons */}
                          <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                            <TouchableOpacity
                              style={[styles.exampleSpeaker, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}
                              onPress={() => soundService.speakGerman(item.example.de)}
                              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                            >
                              <Text style={{ fontSize: 10, fontWeight: '800', color: '#4338ca' }}>🇩🇪 DE</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={[styles.exampleSpeaker, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}
                              onPress={() => soundService.speakEnglish(item.example.en)}
                              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                            >
                              <Text style={{ fontSize: 10, fontWeight: '800', color: '#1d4ed8' }}>🇬🇧 EN</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={[styles.exampleSpeaker, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}
                              onPress={() => soundService.speakArabic(item.example.ar)}
                              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                            >
                              <Text style={{ fontSize: 10, fontWeight: '800', color: '#047857' }}>🇪🇬 AR</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        <Text style={styles.exampleDe}>{item.example.de}</Text>
                        <Text style={[styles.exampleAr, { textAlign: isRTL ? 'right' : 'left' }]}>
                          🇪🇬 {item.example.ar}
                        </Text>
                        <Text style={styles.exampleEn}>🇬🇧 {item.example.en}</Text>
                      </View>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}

          {filteredCollinsWords.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyTitle}>
                {supportLang === 'ar' ? 'لا توجد كلمات مطابقة' : 'No matching vocabulary'}
              </Text>
              <Text style={styles.emptySub}>
                {supportLang === 'ar' ? 'جرب البحث بكلمة أخرى أو اختر موضوعاً مختلفاً' : 'Try searching for another word or change the category.'}
              </Text>
            </View>
          )}
        </ScrollView>
      ) : (
        /* Grammar Syllabus Track */
        <ScrollView style={styles.scrollList} contentContainerStyle={styles.listContent}>
          <View style={[styles.headerBanner, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Text style={styles.bannerEmoji}>📚</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>
                {activeLevel} {supportLang === 'ar' ? 'منهاج القواعد' : 'Grammar Curriculum'}
              </Text>
              <Text style={styles.bannerSub}>
                {grammarTopics.length} {supportLang === 'ar' ? 'موضوعاً تعليمياً' : 'topics available'}
              </Text>
            </View>
          </View>

          {grammarTopics.map((topic, index) => {
            const titleText = topic.title?.de || topic.title;
            const subText = supportLang === 'ar' ? topic.title?.ar : topic.title?.en;

            let masteryBadge = 'Not Started';
            let badgeColor = THEME.colors.textDim;
            if (index === 0 || index === 1) {
              masteryBadge = 'Mastered';
              badgeColor = THEME.colors.primary;
            } else if (index === 2 || index === 3) {
              masteryBadge = 'Strong';
              badgeColor = THEME.colors.success;
            } else if (index === 4 || index === 5) {
              masteryBadge = 'Practicing';
              badgeColor = THEME.colors.accent;
            } else if (index < 9) {
              masteryBadge = 'Learning';
              badgeColor = THEME.colors.purple;
            }

            return (
              <TouchableOpacity
                key={topic.id || index}
                style={styles.topicCard}
                onPress={() => onSelectTopic && onSelectTopic(topic)}
                activeOpacity={0.7}
              >
                <View style={[styles.topicRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <View style={styles.indexCircle}>
                    <Text style={styles.indexText}>{index + 1}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.topicTitleDe}>{titleText}</Text>
                    <Text style={[styles.topicTitleSub, { textAlign: isRTL ? 'right' : 'left' }]}>
                      {subText}
                    </Text>
                  </View>

                  <View style={[styles.statusPill, { borderColor: badgeColor, backgroundColor: `${badgeColor}15` }]}>
                    <Text style={[styles.statusText, { color: badgeColor }]}>{masteryBadge}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const getStyles = (colors, isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    topBar: {
      paddingHorizontal: 12,
      paddingTop: 8,
      paddingBottom: 4,
      backgroundColor: colors.bgCard,
    },
    backButton: {
      alignItems: 'center',
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 10,
      backgroundColor: colors.bgElevated,
      borderWidth: 1,
      borderColor: colors.border,
      alignSelf: 'flex-start',
    },
    backButtonText: {
      fontSize: 13,
      fontWeight: '700',
    },
    modeSwitcherContainer: {
      paddingHorizontal: 12,
      paddingTop: 8,
      paddingBottom: 4,
      backgroundColor: colors.bgCard,
    },
    modeSwitcher: {
      flexDirection: 'row',
      backgroundColor: colors.bgElevated,
      borderRadius: 12,
      padding: 3,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modeBtn: {
      flex: 1,
      paddingVertical: 8,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 9,
    },
    activeModeBtn: {
      backgroundColor: colors.primary,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 2,
    },
    modeBtnText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.textMuted,
    },
    activeModeBtnText: {
      color: '#FFFFFF',
      fontWeight: '800',
    },
    tabsContainer: {
      backgroundColor: colors.bgCard,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tabsContent: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      gap: 6,
    },
    levelTab: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: colors.bgElevated,
      borderWidth: 1,
      borderColor: colors.border,
    },
    activeLevelTab: {
      backgroundColor: colors.primary,
      borderColor: colors.primaryLight || colors.primary,
    },
    levelTabText: {
      color: colors.textMuted,
      fontSize: 12,
      fontWeight: '700',
    },
    activeLevelTabText: {
      color: '#FFFFFF',
    },
    scrollList: {
      flex: 1,
    },
    listContent: {
      padding: 12,
      paddingBottom: 110,
      gap: 8,
    },
    headerBanner: {
      backgroundColor: colors.bgCard,
      padding: 12,
      borderRadius: 12,
      alignItems: 'center',
      gap: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    bannerEmoji: {
      fontSize: 24,
    },
    bannerTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.text,
    },
    bannerSub: {
      fontSize: 12,
      color: colors.textMuted,
    },
    searchBar: {
      backgroundColor: colors.bgCard,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 10,
      paddingVertical: 7,
      alignItems: 'center',
      gap: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 13,
      color: colors.text,
      padding: 0,
    },
    categoryChipsContainer: {
      paddingVertical: 4,
      gap: 6,
    },
    categoryChip: {
      backgroundColor: colors.bgCard,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    activeCategoryChip: {
      backgroundColor: `${colors.primary}20`,
      borderColor: colors.primary,
    },
    categoryChipText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textMuted,
    },
    activeCategoryChipText: {
      color: colors.primary,
      fontWeight: '700',
    },
    wordCard: {
      backgroundColor: colors.bgCard,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    wordCardExpanded: {
      borderColor: `${colors.primary}60`,
      backgroundColor: colors.bgElevated,
    },
    wordCardRow: {
      alignItems: 'center',
      gap: 10,
    },
    articleBadge: {
      paddingHorizontal: 7,
      paddingVertical: 3,
      borderRadius: 6,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 36,
    },
    articleBadgeText: {
      fontSize: 10,
      fontWeight: '800',
    },
    germanTerm: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 2,
    },
    translationRow: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    speakerBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: `${colors.primary}12`,
      alignItems: 'center',
      justifyContent: 'center',
    },
    detailContainer: {
      marginTop: 10,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      gap: 8,
    },
    explanationBox: {
      backgroundColor: isDark ? 'rgba(245, 158, 11, 0.08)' : 'rgba(245, 158, 11, 0.06)',
      padding: 10,
      borderRadius: 8,
      borderLeftWidth: 3,
      borderLeftColor: '#f59e0b',
      gap: 4,
    },
    boxHeader: {
      alignItems: 'center',
      gap: 6,
    },
    boxTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.text,
    },
    explanationText: {
      fontSize: 12,
      color: colors.textSecondary,
      lineHeight: 17,
    },
    grammarTipPill: {
      marginTop: 4,
      backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      alignSelf: 'flex-start',
    },
    grammarTipText: {
      fontSize: 11,
      fontWeight: '700',
      color: isDark ? '#fbbf24' : '#b45309',
    },
    exampleBox: {
      backgroundColor: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(59, 130, 246, 0.06)',
      padding: 10,
      borderRadius: 8,
      borderLeftWidth: 3,
      borderLeftColor: '#3b82f6',
      gap: 4,
    },
    exampleSpeaker: {
      marginLeft: 'auto',
      padding: 2,
    },
    exampleDe: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.text,
    },
    exampleAr: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    exampleEn: {
      fontSize: 11,
      color: colors.textMuted,
      fontStyle: 'italic',
    },
    emptyState: {
      padding: 30,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    emptyEmoji: {
      fontSize: 32,
    },
    emptyTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.text,
    },
    emptySub: {
      fontSize: 12,
      color: colors.textMuted,
      textAlign: 'center',
    },
    topicCard: {
      backgroundColor: colors.bgCard,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    topicRow: {
      alignItems: 'center',
      gap: 10,
    },
    indexCircle: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.bgElevated,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    indexText: {
      color: colors.accentLight || colors.accent,
      fontWeight: '800',
      fontSize: 12,
    },
    topicTitleDe: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '700',
      marginBottom: 2,
    },
    topicTitleSub: {
      color: colors.textSecondary,
      fontSize: 12,
    },
    statusPill: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 12,
      borderWidth: 1,
    },
    statusText: {
      fontSize: 10,
      fontWeight: '700',
    },
  });

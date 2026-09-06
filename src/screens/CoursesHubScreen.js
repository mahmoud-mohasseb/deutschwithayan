// ============================================================
// COURSES HUB SCREEN — DEUTSCH QUEST 🇩🇪
// Inspired by Clean Claymorphic Reference Design (Screen 2):
// - Asymmetric Candy Grid:
//   * Coral block: Grammar (300+ words)
//   * Yellow block: Lessons (300+ words)
//   * Mint block: Tests & Games (300+ words)
// - Learning Package banner (English to German / Arabic to German)
// - 1-Tap Dark/Light Switcher & Trilingual Scaffolding
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../styles/theme';
import { useLanguage } from '../context/LanguageContext';
import { useAppTheme } from '../context/ThemeContext';
import SpecialIcon from '../components/common/SpecialIcon';
import GluestackAnimatedCard from '../components/common/GluestackAnimatedCard';
import soundService from '../services/soundService';
import { Ionicons } from '@expo/vector-icons';
import { MASTER_APP_DATA, getFullGrammarRules } from '../../data/curriculum';

export default function CoursesHubScreen({ onNavigate, onOpenMenu }) {
  const { supportLang, toggleSupportLang, cefrLevel, isRTL, t } = useLanguage();
  const { isDark, toggleTheme, colors } = useAppTheme();
  const [selectedLevelFilter, setSelectedLevelFilter] = useState('ALL');

  const allGrammarRules = getFullGrammarRules();
  const vocabCatalog = MASTER_APP_DATA?.vocabularyCatalog || [];

  const handleBlockPress = (target, params = {}) => {
    soundService.playSfx('tap');
    if (onNavigate) onNavigate(target, params);
  };

  const cefrLevels = ['ALL', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const filteredRules = selectedLevelFilter === 'ALL'
    ? allGrammarRules
    : allGrammarRules.filter((r) => r.level === selectedLevelFilter);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bg }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Header Row */}
      <View style={[styles.headerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text style={[styles.screenHeading, { color: colors.text }]}>{t('curriculum') || 'Courses'}</Text>
          {/* Language Selector Dropdown */}
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
              ellipsizeMode="tail"
            >
              {supportLang === 'ar' ? `مستواك: ${cefrLevel} • 12 محوراً` : `Level: ${cefrLevel} • 12 Modules`}
            </Text>
            <View style={[styles.supportChip, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}>
              <Text style={[styles.supportChipText, { color: colors.text }]}>
                {supportLang === 'ar' ? '🇪🇬 AR' : '🇬🇧 EN'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Theme Toggle & Search Action Buttons */}
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

          <TouchableOpacity
            style={[
              styles.iconCircleBtn,
              { backgroundColor: colors.bgCard, borderColor: colors.border },
              isDark ? THEME.shadowsDark.softPill : THEME.shadows.softPill,
            ]}
            onPress={() => handleBlockPress('dictionary')}
            activeOpacity={0.7}
          >
            <SpecialIcon name="object_search" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.iconCircleBtn,
              { backgroundColor: colors.bgCard, borderColor: colors.border },
              isDark ? THEME.shadowsDark.softPill : THEME.shadows.softPill,
            ]}
            onPress={() => {
              soundService.playSfx('tap');
              if (onOpenMenu) onOpenMenu();
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="menu" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Collins 3000 Words & Phrases Hero Banner */}
      <TouchableOpacity
        style={[styles.collinsHeroWrapper, isDark ? THEME.shadowsDark.softCard : THEME.shadows.softCard]}
        onPress={() => handleBlockPress('curriculum', { initialTab: 'COLLINS' })}
        activeOpacity={0.88}
      >
        <LinearGradient
          colors={isDark ? ['#1E1B4B', '#312E81', '#4338CA'] : ['#4F46E5', '#6366F1', '#818CF8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.collinsHeroCard}
        >
          <View style={[styles.collinsHeroRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={{ flex: 1, gap: 4 }}>
              <View style={[styles.collinsBadgeRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <View style={styles.collinsHeroBadge}>
                  <Text style={styles.collinsHeroBadgeText}>📖 COLLINS 3000</Text>
                </View>
                <View style={[styles.collinsHeroBadge, { backgroundColor: 'rgba(16, 185, 129, 0.3)' }]}>
                  <Text style={styles.collinsHeroBadgeText}>A1 • A2 • B1 • B2</Text>
                </View>
              </View>
              <Text style={[styles.collinsHeroTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                {supportLang === 'ar'
                  ? 'معجم كولينز الشامل: 3,159 كلمة وتعبير 🇪🇬'
                  : 'Collins 3,000 Words & Phrases Corpus'}
              </Text>
              <Text style={[styles.collinsHeroSub, { textAlign: isRTL ? 'right' : 'left' }]}>
                {supportLang === 'ar'
                  ? 'شرح قواعدي، أمثلة ونطق صوتي مصري، مع دمج كامل بالألعاب 🎮'
                  : 'Grammar tips, audio examples & Egyptian Arabic translations linked to games!'}
              </Text>
            </View>

            <View style={styles.collinsHeroIconBox}>
              <Text style={{ fontSize: 30 }}>🇩🇪</Text>
              <Text style={{ fontSize: 16 }}>📚</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Asymmetric Candy Grid (Grammar, Lessons, Tests) */}
      <View style={[styles.candyGridRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        {/* Left Column: Tall Coral Grammar Card */}
        <TouchableOpacity
          style={[styles.tallCoralWrapper, isDark ? THEME.shadowsDark.softCard : THEME.shadows.btnCoral]}
          onPress={() => handleBlockPress('curriculum', { initialTab: 'GRAMMAR' })}
          activeOpacity={0.88}
        >
          <LinearGradient
            colors={isDark ? ['#FF7B65', '#E04832'] : THEME.gradients.coral}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={styles.tallCoralCard}
          >
            <View style={styles.cardIconBoxWhite}>
              <SpecialIcon name="dictionary" size={24} color="#FF5238" />
            </View>
            <Text style={styles.coralCardTitle}>
              {supportLang === 'ar' ? 'القواعد (A1-C2)' : 'Grammar (A1-C2)'}
            </Text>
            <Text style={styles.cardWordCountText}>12 Comprehensive Modules</Text>

            {/* Book Stack Graphic */}
            <View style={styles.bookStackArt}>
              <Text style={{ fontSize: 38 }}>📚</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Right Column: 2 Stacked Blocks (Yellow Lessons + Mint Tests) */}
        <View style={styles.rightBlocksCol}>
          {/* Top Yellow Block: Lessons */}
          <TouchableOpacity
            style={[styles.smallCandyWrapper, isDark ? THEME.shadowsDark.softCard : THEME.shadows.btnYellow]}
            onPress={() => handleBlockPress('lessons')}
            activeOpacity={0.88}
          >
            <LinearGradient
              colors={isDark ? ['#FBBF24', '#D97706'] : THEME.gradients.yellow}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.smallCandyCard, styles.yellowBlock]}
            >
              <View style={styles.cardIconBoxWhite}>
                <SpecialIcon name="wave_sound" size={20} color="#D97706" />
              </View>
              <Text style={styles.smallCardTitle}>
                {supportLang === 'ar' ? 'الدروس' : 'Lessons'}
              </Text>
              <Text style={styles.cardWordCountText}>300+ Core Words</Text>
              <View style={styles.miniStackGraphic}>
                <Text style={{ fontSize: 24 }}>📖</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Bottom Mint Block: Tests & Games */}
          <TouchableOpacity
            style={[styles.smallCandyWrapper, isDark ? THEME.shadowsDark.softCard : THEME.shadows.btnMint]}
            onPress={() => handleBlockPress('tests')}
            activeOpacity={0.88}
          >
            <LinearGradient
              colors={isDark ? ['#34D399', '#059669'] : THEME.gradients.mint}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.smallCandyCard, styles.mintBlock]}
            >
              <View style={styles.cardIconBoxWhite}>
                <SpecialIcon name="arena" size={20} color="#059669" />
              </View>
              <Text style={styles.smallCardTitle}>
                {supportLang === 'ar' ? 'التحديات' : 'Tests'}
              </Text>
              <Text style={styles.cardWordCountText}>6 CEFR Levels</Text>
              <View style={styles.miniStackGraphic}>
                <Text style={{ fontSize: 24 }}>🎮</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* CEFR Level Filter Pills */}
      <View style={styles.filterSection}>
        <Text style={[styles.sectionTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
          {supportLang === 'ar' ? 'المسارات التعليمية الرسمية (CEFR) 🇪🇬' : 'Official CEFR Language Tracks'}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.levelFilterRow}>
          {cefrLevels.map((lvl) => {
            const isSelected = selectedLevelFilter === lvl;
            return (
              <TouchableOpacity
                key={lvl}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: isSelected
                      ? THEME.colors.primary.coral
                      : isDark
                      ? 'rgba(30, 41, 59, 0.7)'
                      : '#FFFFFF',
                    borderColor: isSelected
                      ? THEME.colors.primary.coral
                      : isDark
                      ? 'rgba(51, 65, 85, 0.6)'
                      : 'rgba(226, 232, 240, 0.9)',
                  },
                ]}
                onPress={() => {
                  soundService.playTap();
                  setSelectedLevelFilter(lvl);
                }}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    { color: isSelected ? '#FFFFFF' : isDark ? '#E2E8F0' : '#475569' },
                  ]}
                >
                  {lvl === 'ALL' ? (supportLang === 'ar' ? 'الكل 🌟' : 'All Levels 🌟') : `Level ${lvl}`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Animated CEFR Curriculum Cards */}
      <View style={styles.cardsContainer}>
        {filteredRules.map((module) => (
          <GluestackAnimatedCard
            key={module.id}
            levelBadge={module.level}
            title={module.topic}
            subtitle={module.summaryEn}
            arabicSubtitle={module.titleAr}
            badge={`${module.rules?.length || 2} Rules`}
            onPress={() => handleBlockPress('review', { initialTopic: module.id })}
            leftIcon={
              <View
                style={[
                  styles.moduleIconCircle,
                  { backgroundColor: `${module.color || '#3B82F6'}20` },
                ]}
              >
                <Ionicons
                  name={module.icon || 'book-outline'}
                  size={20}
                  color={module.color || '#3B82F6'}
                />
              </View>
            }
          />
        ))}
      </View>

      {/* Vocabulary Catalog Section */}
      <View style={styles.vocabHeaderRow}>
        <Text style={[styles.sectionTitle, { color: colors.text, textAlign: isRTL ? 'right' : 'left' }]}>
          {supportLang === 'ar' ? 'معجم الكلمات المصنف 🇪🇬' : 'Thematic Vocabulary Catalog'}
        </Text>
      </View>

      {vocabCatalog.map((cat, idx) => (
        <GluestackAnimatedCard
          key={`vocab-${idx}`}
          title={cat.category}
          subtitle={`${cat.items?.length || 0} essential German words with audio & examples`}
          arabicSubtitle={cat.categoryAr}
          badge="A1-B2"
          badgeColor="#8B5CF6"
          onPress={() => handleBlockPress('dictionary')}
          leftIcon={
            <View style={[styles.moduleIconCircle, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
              <Text style={{ fontSize: 18 }}>🗂️</Text>
            </View>
          }
        />
      ))}

      {/* Lavender Learning Package Banner Card */}
      <TouchableOpacity
        style={[styles.lavenderBannerWrapper, isDark ? THEME.shadowsDark.softCard : THEME.shadows.btnLavender]}
        onPress={() => handleBlockPress('lessons')}
        activeOpacity={0.88}
      >
        <LinearGradient
          colors={isDark ? ['#6366F1', '#4338CA'] : THEME.gradients.lavender}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.lavenderBannerCard}
        >
          <View style={[styles.lavenderContentRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={[styles.lavenderTextCol, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
              <Text style={styles.lavenderHeading}>
                {supportLang === 'ar' ? 'العربية إلى الألمانية 🇪🇬 ➔ 🇩🇪' : 'English to German 🇬🇧 ➔ 🇩🇪'}
              </Text>
              <Text style={styles.lavenderSub}>
                {supportLang === 'ar' ? 'أكثر من 500+ كلمة وقاعدة مع الأمثلة الصوتية' : 'More than 500+ words & grammar rules'}
              </Text>

              {/* Author / Guide Pill */}
              <View style={[styles.authorPill, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <View style={styles.authorAvatar}>
                  <Text style={{ fontSize: 13 }}>🤖</Text>
                </View>
                <Text style={styles.authorName}>Fritz KI Tutor</Text>
                <Text style={styles.authorRole}>• A1-C2 Mastery</Text>
              </View>
            </View>

            {/* Graphic Stack */}
            <View style={styles.bannerGraphicBox}>
              <Text style={{ fontSize: 44 }}>🎓</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Secondary Package: Conversation & Dialect */}
      <TouchableOpacity
        style={[
          styles.card,
          styles.secondaryPackageCard,
          {
            backgroundColor: colors.bgCard,
            borderColor: colors.border,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
          isDark ? THEME.shadowsDark.softCard : THEME.shadows.softCard,
        ]}
        onPress={() => handleBlockPress('tutor')}
        activeOpacity={0.88}
      >
        <View style={[styles.secondaryIconBox, { backgroundColor: colors.coralBg }]}>
          <SpecialIcon name="tutor_bot" size={24} color={colors.primary} />
        </View>
        <View style={[styles.secondaryInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <Text style={[styles.secondaryTitle, { color: colors.text }]}>
            {supportLang === 'ar' ? 'المحادثة الحية مع الذكاء الاصطناعي 🇪🇬' : 'AI Conversation & Practice'}
          </Text>
          <Text style={[styles.secondaryDesc, { color: colors.textSecondary }]}>
            {supportLang === 'ar'
              ? 'تحدث واطرح أي سؤال باللغتين العربية والإنجليزية مع تصحيح النطق'
              : 'Interactive dialogue with instant German audio pronunciation'}
          </Text>
        </View>
        <Text style={[styles.chevronArrow, { color: colors.textMuted }]}>{isRTL ? '❮' : '❯'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120,
    gap: 16,
  },
  headerRow: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  screenHeading: {
    fontSize: 26,
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
    alignItems: 'center',
    gap: 6,
  },
  iconCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  themeToggleIcon: {
    fontSize: 18,
  },
  collinsHeroWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  collinsHeroCard: {
    borderRadius: 20,
    padding: 16,
  },
  collinsHeroRow: {
    alignItems: 'center',
    gap: 12,
  },
  collinsBadgeRow: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  collinsHeroBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  collinsHeroBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  collinsHeroTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 22,
  },
  collinsHeroSub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  collinsHeroIconBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  candyGridRow: {
    gap: 14,
  },
  tallCoralWrapper: {
    flex: 1,
    borderRadius: 24,
  },
  tallCoralCard: {
    borderRadius: 24,
    padding: 16,
    minHeight: 220,
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
  },
  cardIconBoxWhite: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  coralCardTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 18,
  },
  cardWordCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  bookStackArt: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  rightBlocksCol: {
    flex: 1,
    gap: 14,
  },
  smallCandyWrapper: {
    borderRadius: 20,
  },
  smallCandyCard: {
    borderRadius: 20,
    padding: 14,
    minHeight: 102,
    justifyContent: 'space-between',
    overflow: 'hidden',
    position: 'relative',
  },
  yellowBlock: {},
  mintBlock: {},
  smallCardTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 8,
  },
  miniStackGraphic: {
    position: 'absolute',
    right: 12,
    bottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
    marginTop: 6,
  },
  lavenderBannerWrapper: {
    borderRadius: 24,
  },
  lavenderBannerCard: {
    borderRadius: 24,
    padding: 18,
    overflow: 'hidden',
  },
  lavenderContentRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lavenderTextCol: {
    flex: 1,
    gap: 4,
  },
  lavenderHeading: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  lavenderSub: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.88)',
    fontWeight: '600',
  },
  authorPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 14,
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
  },
  authorAvatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  authorRole: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  bannerGraphicBox: {
    marginLeft: 12,
  },
  card: {
    borderRadius: THEME.radius.lg,
    padding: 16,
    borderWidth: 1,
  },
  secondaryPackageCard: {
    alignItems: 'center',
    gap: 14,
  },
  secondaryIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryInfo: {
    flex: 1,
  },
  secondaryTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryDesc: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  chevronArrow: {
    fontSize: 15,
    fontWeight: '900',
  },
  filterSection: {
    marginTop: 10,
    marginBottom: 4,
  },
  levelFilterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '700',
  },
  cardsContainer: {
    marginVertical: 4,
  },
  moduleIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vocabHeaderRow: {
    marginTop: 16,
    marginBottom: 4,
  },
});


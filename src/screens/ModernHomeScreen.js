// ============================================================
// MODERN HOME SCREEN — DEUTSCH QUEST 🇩🇪
// Inspired by Clean Claymorphic Reference Design (Screen 1):
// - Daily task card with circular progress doughnut (85%)
// - XP Earned card with 7-day vertical pill bar chart (584 XP)
// - Full-Screen 3D Three.js Quest Gateway Card
// - Course progress card (18/29 lessons)
// - Word level progress row (2% Beginner)
// - 1-Tap Dark/Light Mode Switcher & Trilingual Scaffolding
// ============================================================

import React from 'react';
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
import { useProgress } from '../context/ProgressContext';
import { useGameMode } from '../context/GameModeContext';
import { useAppTheme } from '../context/ThemeContext';
import { useAppStore } from '../store/useAppStore';
import KidsDashboardView from '../components/kids/KidsDashboardView';
import SpecialIcon from '../components/common/SpecialIcon';
import soundService from '../services/soundService';
import { Ionicons } from '@expo/vector-icons';
import GluestackAnimatedCard from '../components/common/GluestackAnimatedCard';

export default function ModernHomeScreen({ onNavigate, onOpenMenu }) {
  const { supportLang, toggleSupportLang, cefrLevel, isRTL, t } = useLanguage();
  const { xp, streakDays } = useProgress();
  const { coins, hearts } = useGameMode();
  const { isDark, toggleTheme, colors } = useAppTheme();

  const audienceMode = useAppStore((s) => s.audienceMode);
  const toggleAudienceMode = useAppStore((s) => s.toggleAudienceMode);

  // 7-day XP data for the vertical bar chart
  const weeklyXp = [
    { day: 'M', height: 42, active: true },
    { day: 'D', height: 68, active: true },
    { day: 'M', height: 50, active: true },
    { day: 'D', height: 85, active: true },
    { day: 'F', height: 74, active: true },
    { day: 'S', height: 95, active: true },
    { day: 'S', height: 60, active: true },
  ];

  const handleCardPress = (tab, params = {}) => {
    soundService.playSfx('tap');
    if (onNavigate) onNavigate(tab, params);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Top Header Row */}
      <View style={[styles.headerOuter, { backgroundColor: colors.bg }]}>
        <View style={[styles.headerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8 }}>
              <Text style={[styles.screenHeading, { color: colors.text }]}>{t('home') || 'Home'}</Text>

              {/* Kids / Adult Mode Switcher Pill */}
              <TouchableOpacity
                style={[
                  styles.audiencePill,
                  {
                    backgroundColor: audienceMode === 'kids' ? '#FEF3C7' : colors.bgElevated,
                    borderColor: audienceMode === 'kids' ? '#F59E0B' : colors.border,
                  },
                ]}
                onPress={() => {
                  console.log('[ModernHomeScreen] audience pill pressed! Current:', audienceMode);
                  soundService.playSfx('tap');
                  toggleAudienceMode();
                }}
                activeOpacity={0.75}
              >
                <Text style={[styles.audienceText, { color: audienceMode === 'kids' ? '#B45309' : colors.text }]}>
                  {audienceMode === 'kids' ? '👧 Kids 🎈' : '👨 Adult 🎓'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Language / Level Selector Dropdown */}
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
                {supportLang === 'ar' ? `مستواك: ${cefrLevel} • 13/45` : `Level: ${cefrLevel} • 13/45`}
              </Text>
              <View style={[styles.supportChip, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}>
                <Text style={[styles.supportChipText, { color: colors.text }]}>
                  {supportLang === 'ar' ? '🇪🇬 AR' : '🇬🇧 EN'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Header Icons: Theme Toggle & Streak Flame */}
          <View style={styles.headerIconsRow}>
            {/* Dark / Light Mode Switcher */}
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

            {/* Streak Flame */}
            <TouchableOpacity
              style={[
                styles.iconCircleBtn,
                { backgroundColor: colors.bgCard, borderColor: colors.border },
                isDark ? THEME.shadowsDark.softPill : THEME.shadows.softPill,
              ]}
              onPress={() => soundService.playSfx('tap')}
              activeOpacity={0.7}
            >
              <Text style={styles.themeToggleIcon}>🔥</Text>
              <View style={[styles.bellBadge, { backgroundColor: colors.accent }]}>
                <Text style={styles.bellBadgeText}>{streakDays ?? 12}</Text>
              </View>
            </TouchableOpacity>

            {/* Professional Hamburger Menu Drawer Icon */}
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
      </View>

      {/* Modern Claymorphic Dashboard Content */}
      {audienceMode === 'kids' ? (
        <KidsDashboardView onNavigate={onNavigate} />
      ) : (
        <ScrollView
          style={[styles.container, { backgroundColor: colors.bg }]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Mini-Game Arena Gateway Banner (Kids & Grown-ups) */}
          <TouchableOpacity
            style={[
              styles.card,
              styles.threeDGatewayCard,
              isDark ? THEME.shadowsDark.softCard : THEME.shadows.softCard,
            ]}
            onPress={() => handleCardPress('arena')}
            activeOpacity={0.88}
          >
            <LinearGradient
              colors={isDark ? ['#1E1B4B', '#312E81'] : ['#818CF8', '#6366F1']}
              style={styles.threeDGradient}
            >
              <View style={[styles.threeDContentRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <View style={{ flex: 1, gap: 4 }}>
                  <View style={styles.threeDBadge}>
                    <Text style={styles.threeDBadgeText}>🎮 MINI-GAMES ARENA</Text>
                  </View>
                  <Text style={styles.threeDTitle}>
                    {supportLang === 'ar' ? 'حلبة الألعاب التعليمية الخفيفة' : 'Fun Mini-Games Arena'}
                  </Text>
                  <Text style={styles.threeDSubtitle}>
                    {supportLang === 'ar'
                      ? 'ألعاب سريعة وخفيفة للأطفال والكبار: الذاكرة، أدوات التعريف، بناء الجمل والسباق 🇪🇬'
                      : 'Lightweight games for kids & adults: Memory Match, Article Sorter, Kids World & Syntax!'}
                  </Text>
                </View>

                <View style={styles.threeDIconCircle}>
                  <Text style={styles.threeDIconEmoji}>🎯</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

      {/* 2. Interactive Offline World Map Adventure Banner */}
      <TouchableOpacity
        style={[
          styles.card,
          styles.threeDGatewayCard,
          isDark ? THEME.shadowsDark.softCard : THEME.shadows.softCard,
        ]}
        onPress={() => handleCardPress('learn')}
        activeOpacity={0.88}
      >
        <LinearGradient
          colors={isDark ? ['#3B0764', '#1E1B4B'] : ['#8B5CF6', '#6D28D9']}
          style={styles.threeDGradient}
        >
          <View style={[styles.threeDContentRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={{ flex: 1, gap: 4 }}>
              <View style={[styles.threeDBadge, { backgroundColor: 'rgba(16, 185, 129, 0.35)' }]}>
                <Text style={styles.threeDBadgeText}>📶 100% OFFLINE WORLD MAP</Text>
              </View>
              <Text style={styles.threeDTitle}>
                {supportLang === 'ar' ? '🗺️ طريق المغامرة: الخريطة التفاعلية' : '🗺️ Der Abenteuerpfad'}
              </Text>
              <Text style={styles.threeDSubtitle}>
                {supportLang === 'ar'
                  ? 'استكشف 6 بيئات سحرية، أحجار خطو وصناديق مكافآت للمستويات A1-C2'
                  : '6 magical biomes, stepping stones & milestone chests across A1-C2'}
              </Text>
            </View>

            <View style={styles.threeDIconCircle}>
              <Text style={styles.threeDIconEmoji}>🧭</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* 3. Daily Task Card with Circular Progress Widget */}
      <TouchableOpacity
        style={[
          styles.card,
          styles.dailyTaskCard,
          {
            backgroundColor: colors.bgCard,
            borderColor: colors.border,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
          isDark ? THEME.shadowsDark.softCard : THEME.shadows.softCard,
        ]}
        onPress={() => handleCardPress('lessons')}
        activeOpacity={0.88}
      >
        {/* Doughnut Progress Ring */}
        <View style={[styles.circleProgressRing, { borderColor: colors.coral, backgroundColor: colors.coralBg }]}>
          <View style={[styles.circleInnerCutout, { backgroundColor: colors.bgCard }]}>
            <Text style={[styles.circlePercentageText, { color: colors.coral }]}>85%</Text>
          </View>
        </View>

        {/* Task Details */}
        <View style={[styles.dailyTaskInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <Text style={[styles.dailyTaskTitle, { color: colors.textMuted }]}>
            {supportLang === 'ar' ? 'المهمة اليومية:' : 'Daily task:'}
          </Text>
          <Text style={[styles.dailyTaskGoal, { color: colors.text }]}>
            {supportLang === 'ar' ? 'إتمام 50 درساً' : 'Complete 50 lessons'}
          </Text>
          <Text style={[styles.dailyTaskSub, { color: colors.textSecondary }]}>
            {supportLang === 'ar' ? 'أتممت 12 درساً اليوم' : 'You completed 12 lessons today'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* 3. XP Earned Card with Vertical Bar Chart */}
      <View
        style={[
          styles.card,
          styles.xpEarnedCard,
          { backgroundColor: colors.bgCard, borderColor: colors.border },
          isDark ? THEME.shadowsDark.softCard : THEME.shadows.softCard,
        ]}
      >
        <View style={[styles.cardHeaderRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={[styles.cardHeaderTitle, { color: colors.text }]}>
            {supportLang === 'ar' ? 'نقاط الخبرة XP' : 'XP Earned'}
          </Text>
          <View style={[styles.xpPillBadge, { backgroundColor: colors.coralBg }]}>
            <Text style={[styles.xpPillText, { color: colors.coral }]}>
              {supportLang === 'ar' ? 'XP مكتسبة' : 'XP Earned'}
            </Text>
          </View>
        </View>

        <View style={[styles.chartBodyRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {/* 7 Vertical Rounded Pill Bars */}
          <View style={styles.barsContainer}>
            {weeklyXp.map((item, idx) => (
              <View key={idx} style={styles.barColumn}>
                <View style={[styles.barTrack, { backgroundColor: isDark ? '#152136' : '#F0F4F8' }]}>
                  <View
                    style={[
                      styles.barFill,
                      { height: item.height, backgroundColor: colors.coralLight },
                      idx === 5 && { backgroundColor: colors.coral },
                    ]}
                  />
                </View>
                <Text style={[styles.barLabel, { color: colors.textMuted }]}>{item.day}</Text>
              </View>
            ))}
          </View>

          {/* Right Stat Counter */}
          <View style={[styles.xpSummaryColumn, { alignItems: isRTL ? 'flex-start' : 'flex-end' }]}>
            <Text style={[styles.xpNumberText, { color: colors.text }]}>{xp || 584} XP</Text>
            <Text style={[styles.xpTimeframeText, { color: colors.textMuted }]}>
              {supportLang === 'ar' ? 'آخر 7 أيام' : 'Last 7 days'}
            </Text>
          </View>
        </View>
      </View>

      {/* 4. Course Progress Card (German) */}
      <GluestackAnimatedCard
        title={supportLang === 'ar' ? 'إتقان اللغة الألمانية 🇩🇪' : 'German Language Mastery 🇩🇪'}
        subtitle="18 of 29 core modules completed • Keep up the momentum!"
        arabicSubtitle="تم إنجاز 18 من 29 درساً • واصل التقدم اليومي 🇪🇬"
        levelBadge={cefrLevel || 'A1'}
        badge="18/29 Lessons"
        badgeColor="#10B981"
        onPress={() => handleCardPress('courses')}
        leftIcon={
          <View style={[styles.courseFlagBox, { backgroundColor: colors.yellowBg, borderColor: colors.accent }]}>
            <Text style={styles.courseFlagEmoji}>🇩🇪</Text>
          </View>
        }
      />

      {/* 5. CEFR Grammar Guide Shortcut */}
      <GluestackAnimatedCard
        title={supportLang === 'ar' ? 'دليل القواعد الشامل (A1-C2) 🇪🇬' : 'Comprehensive Grammar Guide (A1-C2)'}
        subtitle="Articles, Cases, Konjunktiv, Passiv & Participles"
        arabicSubtitle="الحالات الإعرابية الأربع، المبني للمجهول، وحروف الجر المشتركة 🇪🇬"
        levelBadge="A1-C2"
        badge="12 Modules"
        badgeColor="#3B82F6"
        onPress={() => handleCardPress('review')}
        leftIcon={
          <View style={[styles.courseFlagBox, { backgroundColor: 'rgba(59, 130, 246, 0.15)', borderColor: '#3B82F6' }]}>
            <Text style={{ fontSize: 22 }}>📚</Text>
          </View>
        }
      />

      {/* 6. AI Interactive Tutor Shortcut */}
      <GluestackAnimatedCard
        title={supportLang === 'ar' ? 'المحادثة الذكية مع فريتز 🤖' : 'AI Dialogue with Fritz 🤖'}
        subtitle="Instant native pronunciation, feedback & trilingual explanations"
        arabicSubtitle="تحدث واطرح أي سؤال ألماني مع ترجمة عربية فورية 🇪🇬"
        badge="Live 🎙️"
        badgeColor="#FF6B6B"
        onPress={() => handleCardPress('tutor')}
        leftIcon={
          <View style={[styles.courseFlagBox, { backgroundColor: 'rgba(255, 107, 107, 0.15)', borderColor: '#FF6B6B' }]}>
            <Text style={{ fontSize: 22 }}>🎙️</Text>
          </View>
        }
      />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerOuter: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  audiencePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  audienceText: {
    fontSize: 11,
    fontWeight: '900',
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
  headerIconsRow: {
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
    position: 'relative',
  },
  themeToggleIcon: {
    fontSize: 18,
  },
  bellBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  bellBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  card: {
    borderRadius: THEME.radius.lg,
    padding: 18,
    borderWidth: 1,
  },
  threeDGatewayCard: {
    padding: 0,
    overflow: 'hidden',
    borderWidth: 0,
  },
  threeDGradient: {
    padding: 18,
    borderRadius: THEME.radius.lg,
  },
  threeDContentRow: {
    alignItems: 'center',
    gap: 12,
  },
  threeDBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  threeDBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  threeDTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  threeDSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 16,
    fontWeight: '600',
  },
  threeDIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  threeDIconEmoji: {
    fontSize: 26,
  },
  dailyTaskCard: {
    alignItems: 'center',
    gap: 16,
  },
  circleProgressRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleInnerCutout: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circlePercentageText: {
    fontSize: 15,
    fontWeight: '900',
  },
  dailyTaskInfo: {
    flex: 1,
  },
  dailyTaskTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dailyTaskGoal: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  dailyTaskSub: {
    fontSize: 13,
    marginTop: 4,
  },
  xpEarnedCard: {
    gap: 12,
  },
  cardHeaderRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  xpPillBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.full,
  },
  xpPillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  chartBodyRow: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 8,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    flex: 1,
  },
  barColumn: {
    alignItems: 'center',
    gap: 6,
  },
  barTrack: {
    height: 70,
    width: 10,
    borderRadius: 5,
    justifyContent: 'flex-end',
  },
  barFill: {
    width: 10,
    borderRadius: 5,
  },
  barLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  xpSummaryColumn: {
    justifyContent: 'center',
    paddingBottom: 8,
  },
  xpNumberText: {
    fontSize: 22,
    fontWeight: '900',
  },
  xpTimeframeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  courseCard: {
    alignItems: 'center',
    gap: 14,
  },
  courseFlagBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  courseFlagEmoji: {
    fontSize: 32,
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '800',
  },
  courseLessonsCount: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  courseDesc: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  wordLevelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  wordLevelLeft: {
    alignItems: 'center',
    gap: 12,
  },
  levelBadgeCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelBadgeNumber: {
    fontSize: 13,
    fontWeight: '900',
  },
  wordLevelText: {
    fontSize: 14,
    fontWeight: '700',
  },
  chevronRight: {
    fontSize: 14,
    fontWeight: '900',
  },
});

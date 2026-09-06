// ============================================================
// HOME / DASHBOARD SCREEN
// Daily streak, current lesson spotlight (Im Restaurant),
// grammar mastery snapshot, and game launchers.
// ============================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { THEME } from '../styles/theme';
import { useLanguage } from '../context/LanguageContext';
import { useProgress } from '../context/ProgressContext';
import ProgressBar from '../components/common/ProgressBar';

export default function HomeScreen({ onNavigate }) {
  const { supportLang, cefrLevel, isRTL, t } = useLanguage();
  const { xp, streakDays, masteryList } = useProgress();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Daily Motivation & CEFR Status Banner */}
      <View style={[styles.welcomeBanner, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.welcomeSubtitle}>
            {supportLang === 'ar' ? 'أهلاً بك مجدداً!' : 'Willkommen zurück!'}
          </Text>
          <Text style={styles.welcomeTitle}>
            {supportLang === 'ar' ? 'تابع إتقان القواعد الألمانية' : 'Master German Grammar'}
          </Text>
        </View>
        <View style={styles.levelBadgeLarge}>
          <Text style={styles.levelBadgeText}>{cefrLevel}</Text>
        </View>
      </View>

      {/* Featured Lesson Spotlight: A1 "Im Restaurant" */}
      <View style={styles.spotlightCard}>
        <View style={styles.spotlightHeader}>
          <View style={styles.spotlightTag}>
            <Text style={styles.spotlightTagText}>⭐ FEATURED A1 LESSON</Text>
          </View>
          <Text style={styles.xpRewardTag}>+50 XP</Text>
        </View>

        <Text style={styles.spotlightTitle}>Im Restaurant (At the Restaurant)</Text>
        <Text style={styles.spotlightDesc}>
          {supportLang === 'ar'
            ? 'تعلم طلب الطعام والحساب وقاعدة: Ich möchte ... + Akkusativ'
            : 'Learn how to order food, pay, and master: Ich möchte ... + Akkusativ'}
        </Text>

        <View style={styles.spotlightVocabPreview}>
          <Text style={styles.vocabPreviewChip}>das Restaurant</Text>
          <Text style={styles.vocabPreviewChip}>die Speisekarte</Text>
          <Text style={styles.vocabPreviewChip}>das Wasser</Text>
          <Text style={styles.vocabPreviewChip}>bestellen</Text>
        </View>

        <TouchableOpacity
          style={styles.startLessonBtn}
          onPress={() => onNavigate('lesson', { lessonId: 'a1-restaurant' })}
          activeOpacity={0.8}
        >
          <Text style={styles.startLessonBtnText}>
            {supportLang === 'ar' ? 'ابدأ الدرس الآن ➔' : 'Start Lesson Now ➔'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 4 Grammar Game Hub Launchers */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {supportLang === 'ar' ? '🎮 ألعاب القواعد التفاعلية' : '🎮 Grammar Game Arena'}
        </Text>
        <TouchableOpacity onPress={() => onNavigate('games')}>
          <Text style={styles.seeAllLink}>{supportLang === 'ar' ? 'عرض الكل' : 'View All'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gamesGrid}>
        {/* Game 1: Article Battle */}
        <TouchableOpacity
          style={[styles.gameCard, { borderColor: THEME.colors.primary }]}
          onPress={() => onNavigate('games', { initialGame: 'battle' })}
          activeOpacity={0.8}
        >
          <Text style={styles.gameEmoji}>🛡️</Text>
          <Text style={styles.gameTitle}>{t('articleBattle')}</Text>
          <Text style={styles.gameSub}>der • die • das speed quiz</Text>
        </TouchableOpacity>

        {/* Game 2: Case Detective */}
        <TouchableOpacity
          style={[styles.gameCard, { borderColor: THEME.colors.success }]}
          onPress={() => onNavigate('games', { initialGame: 'detective' })}
          activeOpacity={0.8}
        >
          <Text style={styles.gameEmoji}>🔍</Text>
          <Text style={styles.gameTitle}>{t('caseDetective')}</Text>
          <Text style={styles.gameSub}>Nominativ vs Akkusativ</Text>
        </TouchableOpacity>

        {/* Game 3: Sentence Builder */}
        <TouchableOpacity
          style={[styles.gameCard, { borderColor: THEME.colors.accent }]}
          onPress={() => onNavigate('games', { initialGame: 'builder' })}
          activeOpacity={0.8}
        >
          <Text style={styles.gameEmoji}>🧩</Text>
          <Text style={styles.gameTitle}>{t('sentenceBuilder')}</Text>
          <Text style={styles.gameSub}>Verb-Second (V2) rule</Text>
        </TouchableOpacity>

        {/* Game 4: Grammar Boss */}
        <TouchableOpacity
          style={[styles.gameCard, { borderColor: THEME.colors.purple }]}
          onPress={() => onNavigate('games', { initialGame: 'boss' })}
          activeOpacity={0.8}
        >
          <Text style={styles.gameEmoji}>⚔️</Text>
          <Text style={styles.gameTitle}>{t('grammarBoss')}</Text>
          <Text style={styles.gameSub}>Fix errors to defeat boss</Text>
        </TouchableOpacity>
      </View>

      {/* Grammar Mastery Snapshot */}
      <View style={styles.masterySection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {supportLang === 'ar' ? '📊 مؤشر إتقان القواعد' : '📊 Grammar Mastery Track'}
          </Text>
          <TouchableOpacity onPress={() => onNavigate('profile')}>
            <Text style={styles.seeAllLink}>{supportLang === 'ar' ? 'التفاصيل' : 'Details'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.masteryCard}>
          {masteryList.slice(0, 3).map((item) => (
            <View key={item.id} style={styles.masteryItem}>
              <ProgressBar
                progress={item.percent}
                color={item.color}
                height={7}
                showLabel={true}
                label={`${item.title} (${item.status})`}
              />
            </View>
          ))}
        </View>
      </View>

      {/* AI Tutor Card Prompt */}
      <TouchableOpacity
        style={styles.tutorBanner}
        onPress={() => onNavigate('tutor')}
        activeOpacity={0.8}
      >
        <Text style={styles.tutorEmoji}>🤖</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.tutorHeading}>
            {supportLang === 'ar' ? 'هل لديك سؤال حول قاعدة ألمانية؟' : 'Confused about a German grammar rule?'}
          </Text>
          <Text style={styles.tutorSubtext}>
            {supportLang === 'ar'
              ? 'اسأل المعلم الذكي: "لماذا نقول einen وليس ein؟"'
              : 'Ask AI Tutor: "Why is it einen and not ein?"'}
          </Text>
        </View>
        <Text style={styles.arrowIcon}>➔</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.bg,
  },
  content: {
    padding: THEME.spacing.md,
    paddingBottom: 40,
  },
  welcomeBanner: {
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.lg,
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  welcomeSubtitle: {
    color: THEME.colors.accentLight,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  welcomeTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  levelBadgeLarge: {
    backgroundColor: THEME.colors.primaryDark,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.primaryLight,
  },
  levelBadgeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  spotlightCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)',
    marginBottom: THEME.spacing.lg,
  },
  spotlightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  spotlightTag: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.sm,
  },
  spotlightTagText: {
    color: THEME.colors.primaryLight,
    fontSize: 10,
    fontWeight: '800',
  },
  xpRewardTag: {
    color: THEME.colors.accentLight,
    fontSize: 12,
    fontWeight: '800',
  },
  spotlightTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  spotlightDesc: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  spotlightVocabPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  vocabPreviewChip: {
    backgroundColor: THEME.colors.bgElevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.sm,
    color: THEME.colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  startLessonBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 12,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
  },
  startLessonBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  seeAllLink: {
    color: THEME.colors.primaryLight,
    fontSize: 13,
    fontWeight: '600',
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: THEME.spacing.lg,
  },
  gameCard: {
    width: '48%',
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.md,
    borderWidth: 1,
  },
  gameEmoji: {
    fontSize: 26,
    marginBottom: 6,
  },
  gameTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  gameSub: {
    fontSize: 11,
    color: THEME.colors.textMuted,
  },
  masterySection: {
    marginBottom: THEME.spacing.lg,
  },
  masteryCard: {
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    gap: 8,
  },
  masteryItem: {
    marginVertical: 2,
  },
  tutorBanner: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tutorEmoji: {
    fontSize: 30,
  },
  tutorHeading: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  tutorSubtext: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
  },
  arrowIcon: {
    color: THEME.colors.purple,
    fontSize: 18,
    fontWeight: '800',
  },
});

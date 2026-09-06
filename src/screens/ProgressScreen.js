// ============================================================
// PROGRESS SCREEN (📊 Skills Radar & CEFR Mastery)
// Detailed skills breakdown:
// Vocabulary, Grammar, Listening, Speaking, Reading, Writing
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { THEME } from '../styles/theme';
import { useLanguage } from '../context/LanguageContext';
import { useProgress } from '../context/ProgressContext';
import { useAppTheme } from '../context/ThemeContext';
import ProgressBar from '../components/common/ProgressBar';

export default function ProgressScreen() {
  const { supportLang, cefrLevel, isRTL } = useLanguage();
  const { xp, streakDays, skills, masteryList, unlockedBadges } = useProgress();
  const { isDark, colors } = useAppTheme();

  const styles = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  const skillBars = [
    { key: 'vocabulary', label: supportLang === 'ar' ? 'المفردات (Vocabulary)' : 'Vocabulary', score: skills.vocabulary, color: '#3B82F6' },
    { key: 'grammar', label: supportLang === 'ar' ? 'القواعد (Grammar)' : 'Grammar', score: skills.grammar, color: '#10B981' },
    { key: 'listening', label: supportLang === 'ar' ? 'الاستماع (Listening)' : 'Listening', score: skills.listening, color: '#8B5CF6' },
    { key: 'speaking', label: supportLang === 'ar' ? 'التحدث (Speaking)' : 'Speaking', score: skills.speaking, color: '#F59E0B' },
    { key: 'reading', label: supportLang === 'ar' ? 'القراءة (Reading)' : 'Reading', score: skills.reading, color: '#EC4899' },
    { key: 'writing', label: supportLang === 'ar' ? 'الكتابة (Writing)' : 'Writing', score: skills.writing, color: '#0EA5E9' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* CEFR Trajectory Card */}
      <View style={styles.cefrCard}>
        <View style={[styles.cefrHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View>
            <Text style={styles.cefrTag}>CEFR LEVEL PROGRESSION</Text>
            <Text style={styles.cefrCurrentTitle}>Aktuelles Niveau: {cefrLevel}</Text>
          </View>
          <View style={styles.badgePill}>
            <Text style={styles.badgePillText}>{cefrLevel} • 72%</Text>
          </View>
        </View>

        <ProgressBar progress={72} color={colors.primary} height={10} />

        <View style={styles.cefrStepsRow}>
          {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => {
            const isPassed = lvl === 'A1';
            const isCurrent = lvl === cefrLevel;
            return (
              <View key={lvl} style={styles.stepCol}>
                <View
                  style={[
                    styles.stepDot,
                    isPassed && styles.passedDot,
                    isCurrent && styles.currentDot,
                  ]}
                />
                <Text
                  style={[
                    styles.stepLabel,
                    isCurrent && styles.currentStepLabel,
                  ]}
                >
                  {lvl}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* 6 Language Skills Breakdown */}
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionTitle}>
          {supportLang === 'ar' ? '🎯 المهارات اللغوية الستة' : '🎯 6 Core Language Skills'}
        </Text>

        <View style={styles.skillsCard}>
          {skillBars.map((skill) => (
            <View key={skill.key} style={styles.skillItem}>
              <ProgressBar
                progress={skill.score}
                color={skill.color}
                height={8}
                showLabel={true}
                label={skill.label}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Dedicated Grammar Mastery System */}
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionTitle}>
          {supportLang === 'ar' ? '⚡ إتقان القواعد الألمانية' : '⚡ German Grammar Mastery'}
        </Text>

        <View style={styles.masteryCard}>
          {masteryList.map((item) => (
            <View key={item.id} style={styles.masteryItem}>
              <View style={[styles.masteryHeaderRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={styles.masteryTitleText}>{item.title}</Text>
                <View style={[styles.statusTag, { borderColor: item.color, backgroundColor: `${item.color}15` }]}>
                  <Text style={[styles.statusTagText, { color: item.color }]}>{item.status}</Text>
                </View>
              </View>

              <ProgressBar progress={item.percent} color={item.color} height={8} />
            </View>
          ))}
        </View>
      </View>

      {/* Stats Summary */}
      <View style={styles.summaryGrid}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryNum}>{xp} XP</Text>
          <Text style={styles.summaryLabel}>Total Quest XP</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryNum}>{streakDays} 🔥</Text>
          <Text style={styles.summaryLabel}>Streak Days</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryNum}>{unlockedBadges.length} 🏆</Text>
          <Text style={styles.summaryLabel}>Badges Earned</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const getStyles = (colors, isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    content: {
      padding: THEME.spacing.md,
      paddingBottom: 40,
      gap: 16,
    },
    cefrCard: {
      backgroundColor: colors.bgCard,
      borderRadius: THEME.radius.lg,
      padding: THEME.spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    cefrHeader: {
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cefrTag: {
      color: colors.accentLight || colors.accent,
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 0.5,
    },
    cefrCurrentTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '900',
    },
    badgePill: {
      backgroundColor: colors.primary,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: THEME.radius.sm,
    },
    badgePillText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '800',
    },
    cefrStepsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 8,
    },
    stepCol: {
      alignItems: 'center',
      gap: 4,
    },
    stepDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.border,
    },
    passedDot: {
      backgroundColor: colors.success,
    },
    currentDot: {
      backgroundColor: colors.primary,
      borderWidth: 2,
      borderColor: colors.text,
    },
    stepLabel: {
      color: colors.textMuted,
      fontSize: 11,
      fontWeight: '700',
    },
    currentStepLabel: {
      color: colors.text,
      fontWeight: '900',
    },
    sectionBlock: {
      gap: 8,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.text,
    },
    skillsCard: {
      backgroundColor: colors.bgCard,
      borderRadius: THEME.radius.lg,
      padding: THEME.spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 10,
    },
    skillItem: {
      marginVertical: 2,
    },
    masteryCard: {
      backgroundColor: colors.bgCard,
      borderRadius: THEME.radius.lg,
      padding: THEME.spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    masteryItem: {
      gap: 4,
    },
    masteryHeaderRow: {
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    masteryTitleText: {
      color: colors.text,
      fontSize: 13,
      fontWeight: '700',
    },
    statusTag: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: THEME.radius.full,
      borderWidth: 1,
    },
    statusTagText: {
      fontSize: 10,
      fontWeight: '800',
    },
    summaryGrid: {
      flexDirection: 'row',
      gap: 8,
    },
    summaryBox: {
      flex: 1,
      backgroundColor: colors.bgCard,
      padding: 12,
      borderRadius: THEME.radius.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    summaryNum: {
      fontSize: 16,
      fontWeight: '900',
      color: colors.text,
    },
    summaryLabel: {
      fontSize: 11,
      color: colors.textMuted,
      marginTop: 2,
    },
  });

// ============================================================
// REVIEW SCREEN (📖 Adaptive Spaced Repetition & Daily Quest)
// Focuses on user weaknesses, forgotten words, and repeated grammar errors
// ============================================================

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { THEME } from '../styles/theme';
import { useLanguage } from '../context/LanguageContext';
import { useProgress } from '../context/ProgressContext';
import { useAppTheme } from '../context/ThemeContext';

export default function ReviewScreen({ onNavigate }) {
  const { supportLang, isRTL, openExplain } = useLanguage();
  const { weakItems, resolveWeakItem, streakDays, xp } = useProgress();
  const { isDark, colors } = useAppTheme();

  const [dailyQuestCompleted, setDailyQuestCompleted] = useState(false);

  const handlePracticeWeakItem = (item) => {
    openExplain({
      term: item.term,
      germanTitle: item.term,
      grammarRole: item.rule,
      englishExplanation: `Review item: ${item.rule}. Practice frequently to move to Mastered.`,
      arabicExplanation: `مراجعة تكرارية متباعدة: ${item.rule}. التدرب على هذا العنصر ينقله إلى مرحلة الإتقان التام.`,
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bg }]} contentContainerStyle={styles.content}>
      {/* Daily Quest Header Card */}
      <View
        style={[
          styles.dailyQuestCard,
          { backgroundColor: colors.bgCard, borderColor: colors.border },
          isDark ? THEME.shadowsDark.softCard : THEME.shadows.softCard,
        ]}
      >
        <View style={[styles.questHeaderRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View>
            <Text style={[styles.questTag, { color: colors.coral }]}>⚡ DAILY GERMAN QUEST</Text>
            <Text style={[styles.questTitle, { color: colors.text }]}>
              {supportLang === 'ar' ? 'تحدي اليوم: تدريب شامل' : "Today's Quest: Adaptive Mix"}
            </Text>
          </View>
          <View style={[styles.streakBadge, { backgroundColor: colors.yellowBg, borderColor: colors.accent }]}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={[styles.streakCount, { color: colors.text }]}>{streakDays}</Text>
          </View>
        </View>

        {/* Daily Tasks List */}
        <View style={styles.taskList}>
          <View style={styles.taskItem}>
            <Text style={styles.taskCheck}>☑</Text>
            <Text style={[styles.taskText, { color: colors.textSecondary }]}>5 Vokabeln (Vocabulary)</Text>
          </View>
          <View style={styles.taskItem}>
            <Text style={styles.taskCheck}>☑</Text>
            <Text style={[styles.taskText, { color: colors.textSecondary }]}>3 Grammatik-Punkte (Grammar)</Text>
          </View>
          <View style={styles.taskItem}>
            <Text style={styles.taskCheck}>☐</Text>
            <Text style={[styles.taskText, { color: colors.textSecondary }]}>1 Hör-Mission (Listening Detective)</Text>
          </View>
          <View style={styles.taskItem}>
            <Text style={styles.taskCheck}>☐</Text>
            <Text style={[styles.taskText, { color: colors.textSecondary }]}>1 Satzbau (Sentence Builder)</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.claimQuestBtn, dailyQuestCompleted && styles.claimedBtn]}
          onPress={() => {
            setDailyQuestCompleted(true);
            onNavigate('games', { initialGame: 'builder' });
          }}
        >
          <Text style={styles.claimQuestText}>
            {dailyQuestCompleted
              ? '🎉 Daily Quest Abgeschlossen (+250 XP)'
              : 'Daily Quest starten (+250 XP) ➔'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Adaptive SRS: Weak Items & Mistakes Hub */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {supportLang === 'ar' ? '🧠 قائمة النقاط التي تحتاج تقوية (SRS)' : '🧠 Weak Points Review Queue'}
          </Text>
          <Text style={[styles.itemCountText, { color: colors.textMuted }]}>{weakItems.length} items</Text>
        </View>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
          {supportLang === 'ar'
            ? 'النظام الذكي يجمع الأخطاء المتكررة ليعيد جدولتها تلقائياً حتى تتقنها تماماً.'
            : 'Adaptive spaced repetition schedules repeated mistakes until you master them.'}
        </Text>

        <View style={styles.weakList}>
          {weakItems.map((item) => (
            <View
              key={item.id}
              style={[
                styles.weakCard,
                { backgroundColor: colors.bgCard, borderColor: colors.border },
                isDark ? THEME.shadowsDark.softCard : THEME.shadows.softCard,
              ]}
            >
              <View style={[styles.weakCardTop, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.weakTermText, { color: colors.text }]}>{item.term}</Text>
                  <Text style={[styles.weakRuleText, { color: colors.coral }]}>⚡ {item.rule}</Text>
                </View>
                <View style={[styles.errorCountBadge, { backgroundColor: colors.coralBg }]}>
                  <Text style={[styles.errorCountText, { color: colors.coral }]}>{item.errorCount} Fehler</Text>
                </View>
              </View>

              <View style={[styles.weakActionRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <TouchableOpacity
                  style={[styles.explainActionBtn, { backgroundColor: colors.bgElevated }]}
                  onPress={() => handlePracticeWeakItem(item)}
                >
                  <Text style={[styles.explainActionText, { color: colors.text }]}>💡 Erklärung ansehen</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.resolveActionBtn, { backgroundColor: colors.mintBg }]}
                  onPress={() => resolveWeakItem(item.id)}
                >
                  <Text style={[styles.resolveActionText, { color: colors.mint }]}>✓ Als gelernt markieren</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: THEME.spacing.md,
    paddingBottom: 120,
    gap: 16,
  },
  dailyQuestCard: {
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    gap: 12,
  },
  questHeaderRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questTag: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  questTitle: {
    fontSize: 17,
    fontWeight: '900',
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
  },
  streakEmoji: {
    fontSize: 14,
  },
  streakCount: {
    fontSize: 12,
    fontWeight: '900',
  },
  taskList: {
    gap: 6,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskCheck: {
    fontSize: 14,
    color: '#34D399',
    fontWeight: '900',
  },
  taskText: {
    fontSize: 13,
    fontWeight: '600',
  },
  claimQuestBtn: {
    backgroundColor: '#FF6B55',
    paddingVertical: 12,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    marginTop: 4,
  },
  claimedBtn: {
    backgroundColor: '#10B981',
  },
  claimQuestText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  sectionBlock: {
    gap: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
  },
  itemCountText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  weakList: {
    gap: 10,
    marginTop: 4,
  },
  weakCard: {
    borderRadius: THEME.radius.md,
    padding: 14,
    borderWidth: 1,
    gap: 10,
  },
  weakCardTop: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  weakTermText: {
    fontSize: 16,
    fontWeight: '900',
  },
  weakRuleText: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  errorCountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  errorCountText: {
    fontSize: 11,
    fontWeight: '800',
  },
  weakActionRow: {
    gap: 8,
  },
  explainActionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: THEME.radius.sm,
    alignItems: 'center',
  },
  explainActionText: {
    fontSize: 11,
    fontWeight: '800',
  },
  resolveActionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: THEME.radius.sm,
    alignItems: 'center',
  },
  resolveActionText: {
    fontSize: 11,
    fontWeight: '800',
  },
});

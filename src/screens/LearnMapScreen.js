// ============================================================
// LEARN SCREEN (🗺️ Deutsch Welt World Map)
// Core adventure hub where player journeys across 12 locations
// from A1 Zuhause to C2 Schloss!
// ============================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { THEME } from '../styles/theme';
import { useLanguage } from '../context/LanguageContext';
import { useProgress } from '../context/ProgressContext';
import { useAppTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import soundService from '../services/soundService';
import WorldMap from '../components/world/WorldMap';

export default function LearnMapScreen({ onNavigate }) {
  const { supportLang, cefrLevel, isRTL } = useLanguage();
  const { streakDays, xp } = useProgress();
  const { isDark, colors } = useAppTheme();

  const handleSelectQuest = (quest, location) => {
    soundService.playSfx('tap');
    if (quest.type === 'boss' || quest.type === 'grammar') {
      onNavigate('arena', { initialGame: 'boss' });
    } else if (quest.type === '3d_hunt') {
      onNavigate('arena', { initialGame: '3d_hunt' });
    } else if (quest.type === 'article_battle') {
      onNavigate('arena', { initialGame: 'battle' });
    } else if (quest.type === 'listen') {
      onNavigate('arena', { initialGame: 'listen' });
    } else {
      // Default to full pedagogical lesson player
      onNavigate('lesson', { lessonId: 'a1-restaurant' });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Top Header Row with Back Button */}
      <View
        style={[
          styles.headerBar,
          {
            backgroundColor: colors.bgCard,
            borderBottomColor: colors.border,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}
          onPress={() => {
            soundService.playSfx('tap');
            if (onNavigate) onNavigate('home');
          }}
          activeOpacity={0.7}
        >
          <Ionicons name={isRTL ? 'chevron-forward' : 'chevron-back'} size={22} color={colors.text} />
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {supportLang === 'ar' ? '🗺️ خريطة العالم التفاعلية' : '🗺️ Der Abenteuerpfad'}
          </Text>
          <Text style={[styles.headerSub, { color: colors.textMuted }]}>
            {supportLang === 'ar' ? 'رحلة المستويات A1 - C2 دون اتصال' : 'A1 - C2 Offline Quest Map'}
          </Text>
        </View>

        <View style={styles.offlinePill}>
          <Text style={styles.offlinePillText}>📶 OFFLINE</Text>
        </View>
      </View>

      {/* 2.5D World Map Component */}
      <WorldMap onSelectQuest={handleSelectQuest} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  offlinePill: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  offlinePillText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  bannerOuter: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
    backgroundColor: THEME.colors.bg,
  },
  topBanner: {
    backgroundColor: THEME.colors.bgCard,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 4,
    borderBottomColor: '#0F172A',
  },
  tagRow: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  streakBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  bannerTag: {
    color: THEME.colors.accentLight,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  levelBadge: {
    backgroundColor: THEME.colors.primaryDark,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  levelBadgeText: {
    color: '#93C5FD',
    fontSize: 10,
    fontWeight: '900',
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 6,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: THEME.colors.bgElevated,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: THEME.colors.success,
    borderRadius: 3,
  },
  progressLabel: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  playNowBtn: {
    backgroundColor: THEME.colors.success,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderBottomWidth: 4,
    borderBottomColor: THEME.colors.successShadow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playNowBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});

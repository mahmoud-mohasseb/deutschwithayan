// ============================================================
// GAME HUD (Top Header) — DEUTSCH QUEST 🇩🇪
// Clean, tactile floating status bar:
// - Left: Avatar + Companion Pet + CEFR Level
// - Right: Glowing Hearts ❤️, Streak 🔥, Coins 🪙, Theme ☀️/🌙 & Language 🇪🇬/🇬🇧
// ============================================================

import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { THEME } from '../../styles/theme';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import { useGameMode } from '../../context/GameModeContext';
import { useAppTheme } from '../../context/ThemeContext';
import SpecialIcon from './SpecialIcon';
import soundService from '../../services/soundService';

export default function Header({ onOpenLanguageSelect, onOpenProfile }) {
  const { supportLang, cefrLevel, isRTL } = useLanguage();
  const { streakDays } = useProgress();
  const { coins, hearts, avatar } = useGameMode();
  const { isDark, toggleTheme, colors } = useAppTheme();

  // Subtle pulsing animation for streak flame & heart
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  const handleProfilePress = () => {
    soundService.playSfx('tap');
    if (onOpenProfile) onOpenProfile();
  };

  const handleLangPress = () => {
    soundService.playSfx('tap');
    if (onOpenLanguageSelect) onOpenLanguageSelect();
  };

  return (
    <View
      style={[
        styles.headerContainer,
        {
          backgroundColor: colors.bgCard,
          borderBottomColor: colors.border,
          flexDirection: isRTL ? 'row-reverse' : 'row',
        },
      ]}
    >
      {/* Left: Avatar Profile & Level Capsule */}
      <TouchableOpacity
        style={[
          styles.profilePill,
          {
            backgroundColor: colors.bgElevated,
            borderColor: colors.border,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
        onPress={handleProfilePress}
        activeOpacity={0.8}
      >
        <View style={[styles.avatarOrb, { backgroundColor: colors.coralBg }]}>
          <Text style={styles.avatarEmoji}>{avatar?.characterEmoji || '🤖'}</Text>
          {avatar?.petEmoji && (
            <View style={[styles.petMiniOrb, { backgroundColor: colors.bgCard }]}>
              <Text style={styles.petMiniEmoji}>{avatar.petEmoji}</Text>
            </View>
          )}
        </View>

        <View style={[styles.levelCapsule, { backgroundColor: colors.coral }]}>
          <SpecialIcon name="star_gem" size={11} color="#FFFFFF" style={{ marginRight: 3 }} />
          <Text style={styles.levelTagText}>{cefrLevel || 'A1'}</Text>
        </View>
      </TouchableOpacity>

      {/* Right: Gamified Resource Meter (Hearts, Streak, Coins, Theme, Lang) */}
      <View style={[styles.resourceBar, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        {/* Hearts Vitality */}
        <View style={[styles.chip, { backgroundColor: colors.coralBg, borderColor: colors.coral }]}>
          <Animated.View style={{ transform: [{ scale: hearts < 3 ? pulseAnim : 1 }] }}>
            <SpecialIcon name="heart_shield" size={14} color="#EF4444" />
          </Animated.View>
          <Text style={[styles.chipText, { color: colors.text }]}>{hearts ?? 5}</Text>
        </View>

        {/* Fire Streak */}
        <View style={[styles.chip, { backgroundColor: colors.yellowBg, borderColor: colors.accent }]}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <SpecialIcon name="streak_fire" size={14} color="#F59E0B" />
          </Animated.View>
          <Text style={[styles.chipText, { color: colors.text }]}>{streakDays ?? 1}</Text>
        </View>

        {/* Gold Coins */}
        <View style={[styles.chip, { backgroundColor: colors.yellowBg, borderColor: colors.accent }]}>
          <SpecialIcon name="coin_vault" size={14} color="#FBBF24" />
          <Text style={[styles.chipText, { color: '#F59E0B' }]}>{coins ?? 0}</Text>
        </View>

        {/* Dark/Light Mode Switcher Pill */}
        <TouchableOpacity
          style={[styles.themePill, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}
          onPress={() => {
            soundService.playSfx('tap');
            toggleTheme();
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.themeIcon}>{isDark ? '🌙' : '☀️'}</Text>
        </TouchableOpacity>

        {/* Language Switcher Pill (Strictly 🇪🇬 for Arabic) */}
        <TouchableOpacity
          style={[styles.langPill, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}
          onPress={handleLangPress}
          activeOpacity={0.7}
          hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
        >
          <Text style={styles.langFlag}>{supportLang === 'ar' ? '🇪🇬' : '🇬🇧'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  profilePill: {
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
    gap: 5,
  },
  avatarOrb: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarEmoji: {
    fontSize: 18,
  },
  petMiniOrb: {
    position: 'absolute',
    bottom: -3,
    right: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  petMiniEmoji: {
    fontSize: 8,
  },
  levelCapsule: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  levelTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  resourceBar: {
    alignItems: 'center',
    gap: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    gap: 3,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '800',
  },
  themePill: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeIcon: {
    fontSize: 13,
  },
  langPill: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langFlag: {
    fontSize: 14,
  },
});

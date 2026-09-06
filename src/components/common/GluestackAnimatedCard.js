// ============================================================
// GLUESTACK UI ANIMATED CARD
// Ultra-smooth interactive card built with @gluestack-ui/themed
// featuring spring press animations, dynamic CEFR badge accents,
// and high-contrast dark/light mode aesthetics.
// ============================================================

import React, { useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Box, HStack, VStack, Pressable, Text } from '@gluestack-ui/themed';
import soundService from '../../services/soundService';
import { useAppTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { THEME } from '../../styles/theme';

export default function GluestackAnimatedCard({
  title,
  subtitle,
  arabicSubtitle,
  badge,
  badgeColor,
  levelBadge,
  leftIcon,
  rightElement,
  onPress,
  children,
  style,
  contentStyle,
  gradientBorderColor,
  active = false,
  disabled = false,
}) {
  const { isDark, colors } = useAppTheme();
  const { isRTL } = useLanguage();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.965,
        friction: 6,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.92,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    if (disabled || !onPress) return;
    try {
      soundService.playTap();
    } catch (e) {}
    onPress();
  };

  // Level color palette mapping
  const getLevelBadgeColors = (lvl) => {
    if (!lvl) return { bg: 'rgba(59, 130, 246, 0.15)', text: '#3B82F6', border: '#3B82F6' };
    const l = lvl.toUpperCase();
    if (l.includes('A1')) return { bg: 'rgba(16, 185, 129, 0.15)', text: '#10B981', border: '#10B981' };
    if (l.includes('A2')) return { bg: 'rgba(59, 130, 246, 0.15)', text: '#3B82F6', border: '#3B82F6' };
    if (l.includes('B1')) return { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B', border: '#F59E0B' };
    if (l.includes('B2')) return { bg: 'rgba(239, 68, 68, 0.15)', text: '#EF4444', border: '#EF4444' };
    if (l.includes('C1')) return { bg: 'rgba(168, 85, 247, 0.15)', text: '#A855F7', border: '#A855F7' };
    return { bg: 'rgba(236, 72, 153, 0.15)', text: '#EC4899', border: '#EC4899' };
  };

  const levelColor = levelBadge ? getLevelBadgeColors(levelBadge) : null;
  const borderColor = active
    ? THEME.colors.primary.coral
    : gradientBorderColor || (isDark ? 'rgba(71, 85, 105, 0.45)' : 'rgba(226, 232, 240, 0.9)');

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
        style,
      ]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled || !onPress}
        style={styles.pressable}
      >
        <Box
          style={[
            styles.cardContainer,
            {
              backgroundColor: isDark ? 'rgba(30, 41, 59, 0.85)' : '#FFFFFF',
              borderColor: borderColor,
              borderWidth: active ? 2 : 1.2,
            },
            isDark ? THEME.shadowsDark.card : THEME.shadows.card,
            contentStyle,
          ]}
        >
          {/* Header Row if title or badges exist */}
          {(title || badge || levelBadge || leftIcon) && (
            <HStack
              justifyContent="space-between"
              alignItems="flex-start"
              style={[
                styles.headerRow,
                { flexDirection: isRTL ? 'row-reverse' : 'row' },
              ]}
            >
              <HStack
                alignItems="center"
                space="sm"
                style={{ flex: 1, flexDirection: isRTL ? 'row-reverse' : 'row' }}
              >
                {leftIcon && <Box style={styles.iconWrapper}>{leftIcon}</Box>}
                <VStack style={{ flex: 1 }}>
                  {title && (
                    <Text
                      style={[
                        styles.titleText,
                        { color: isDark ? '#F8FAFC' : '#0F172A', textAlign: isRTL ? 'right' : 'left' },
                      ]}
                      numberOfLines={2}
                    >
                      {title}
                    </Text>
                  )}
                  {subtitle && (
                    <Text
                      style={[
                        styles.subtitleText,
                        { color: isDark ? '#94A3B8' : '#64748B', textAlign: isRTL ? 'right' : 'left' },
                      ]}
                      numberOfLines={2}
                    >
                      {subtitle}
                    </Text>
                  )}
                  {arabicSubtitle && (
                    <Text
                      style={[
                        styles.arabicSubtitleText,
                        { color: isDark ? '#38BDF8' : '#0284C7', textAlign: isRTL ? 'right' : 'left' },
                      ]}
                      numberOfLines={2}
                    >
                      {arabicSubtitle}
                    </Text>
                  )}
                </VStack>
              </HStack>

              {/* Badges / Right Element */}
              <HStack alignItems="center" space="xs">
                {levelBadge && (
                  <Box
                    style={[
                      styles.levelBadge,
                      {
                        backgroundColor: levelColor.bg,
                        borderColor: levelColor.border,
                      },
                    ]}
                  >
                    <Text style={[styles.levelBadgeText, { color: levelColor.text }]}>
                      {levelBadge}
                    </Text>
                  </Box>
                )}

                {badge && (
                  <Box
                    style={[
                      styles.badgeBox,
                      {
                        backgroundColor: badgeColor || (isDark ? 'rgba(255, 107, 107, 0.2)' : 'rgba(255, 107, 107, 0.12)'),
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        { color: badgeColor ? '#FFFFFF' : THEME.colors.primary.coral },
                      ]}
                    >
                      {badge}
                    </Text>
                  </Box>
                )}

                {rightElement && <Box style={styles.rightElementBox}>{rightElement}</Box>}
              </HStack>
            </HStack>
          )}

          {/* Card Body */}
          {children && <Box style={styles.childrenBox}>{children}</Box>}
        </Box>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 6,
    marginHorizontal: 4,
  },
  pressable: {
    borderRadius: 20,
  },
  cardContainer: {
    borderRadius: 20,
    padding: 16,
    overflow: 'hidden',
  },
  headerRow: {
    width: '100%',
  },
  iconWrapper: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  subtitleText: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
    lineHeight: 18,
  },
  arabicSubtitleText: {
    fontSize: 12.5,
    fontWeight: '600',
    marginTop: 3,
    lineHeight: 18,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  badgeBox: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  rightElementBox: {
    marginLeft: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  childrenBox: {
    marginTop: 10,
  },
});

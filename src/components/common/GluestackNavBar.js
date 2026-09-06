// ============================================================
// GLUESTACK UI MODERN BOTTOM NAVBAR
// Clean, standard docked bottom navigation bar
// Flush to the bottom, full width, native look & feel
// Built with @gluestack-ui/themed (Box, HStack, Pressable, Text)
// ============================================================

import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, Animated, Platform, TouchableOpacity, View, Text, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SpecialIcon from './SpecialIcon';
import soundService from '../../services/soundService';
import { useAppTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export default function GluestackNavBar({ tabs, currentTab, onTabPress }) {
  const { isDark, colors } = useAppTheme();
  const { isRTL } = useLanguage();
  const insets = useSafeAreaInsets();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, () => setIsKeyboardOpen(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setIsKeyboardOpen(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (isKeyboardOpen) return null;

  const bottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 24 : 10);

  return (
    <View
      style={[
        styles.navContainer,
        {
          backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
          borderTopColor: isDark ? 'rgba(51, 65, 85, 0.7)' : 'rgba(226, 232, 240, 0.9)',
          paddingBottom: bottomPadding,
        },
      ]}
    >
      <View
        style={[styles.tabsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
      >
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <NavTabItem
              key={tab.id}
              tab={tab}
              isActive={isActive}
              onPress={() => {
                soundService.playSfx('tap');
                onTabPress(tab.id);
              }}
              isDark={isDark}
              colors={colors}
            />
          );
        })}
      </View>
    </View>
  );
}

function NavTabItem({ tab, isActive, onPress, isDark, colors }) {
  const scaleAnim = useRef(new Animated.Value(isActive ? 1.05 : 1)).current;
  const indicatorAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isActive ? 1.06 : 1,
        friction: 7,
        tension: 120,
        useNativeDriver: true,
      }),
      Animated.timing(indicatorAnim, {
        toValue: isActive ? 1 : 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isActive]);

  const activeColor = tab.tint || colors.coral;
  const inactiveColor = isDark ? '#94A3B8' : '#64748B';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
      style={styles.tabPressable}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={tab.label}
    >
      {/* Subtle top indicator bar */}
      <Animated.View
        style={[
          styles.topIndicator,
          {
            backgroundColor: activeColor,
            opacity: indicatorAnim,
            transform: [{ scaleX: indicatorAnim }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.tabContent,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View
          style={[
            styles.iconWrapper,
            isActive && {
              backgroundColor: isDark
                ? 'rgba(255, 107, 85, 0.14)'
                : 'rgba(255, 107, 85, 0.10)',
            },
          ]}
        >
          <SpecialIcon
            name={tab.iconName}
            size={21}
            color={isActive ? activeColor : inactiveColor}
          />
        </View>

        <Text
          numberOfLines={1}
          style={[
            styles.tabText,
            {
              color: isActive ? activeColor : inactiveColor,
              fontWeight: isActive ? '700' : '500',
            },
          ]}
        >
          {tab.label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    borderTopWidth: 1,
    paddingTop: 6,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    zIndex: 1000,
    elevation: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  tabsRow: {
    width: '100%',
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabPressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  topIndicator: {
    position: 'absolute',
    top: -6,
    width: 28,
    height: 3,
    borderRadius: 2,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  iconWrapper: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  tabText: {
    fontSize: 11,
    letterSpacing: 0.2,
    textAlign: 'center',
    marginTop: 1,
  },
});

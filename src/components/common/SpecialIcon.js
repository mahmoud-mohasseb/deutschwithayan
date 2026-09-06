import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Feather, Ionicons, FontAwesome6 } from '@expo/vector-icons';
import { colors } from '../../styles/theme';

/**
 * Curated specialized icons with distinct RPG/gaming aesthetic
 * Avoids generic stock icons and replaces plain emojis with styled vector emblems.
 */
export const SPECIAL_ICON_MAP = {
  // Navigation & Core Hubs
  quest_map: { family: 'MaterialCommunityIcons', name: 'compass-rose' },
  arena: { family: 'MaterialCommunityIcons', name: 'sword-cross' },
  tutor_bot: { family: 'MaterialCommunityIcons', name: 'robot-outline' },
  review_brain: { family: 'MaterialCommunityIcons', name: 'brain' },
  profile_shield: { family: 'MaterialCommunityIcons', name: 'shield-account-outline' },
  dictionary: { family: 'MaterialCommunityIcons', name: 'book-open-page-variant-outline' },

  // Stats & Resources
  streak_fire: { family: 'MaterialCommunityIcons', name: 'fire-circle' },
  heart_shield: { family: 'MaterialCommunityIcons', name: 'heart-pulse' },
  coin_vault: { family: 'MaterialCommunityIcons', name: 'circle-multiple-outline' },
  star_gem: { family: 'MaterialCommunityIcons', name: 'creation' },
  trophy_cup: { family: 'FontAwesome6', name: 'trophy' },

  // Audio & Pronunciation
  speaker_loud: { family: 'MaterialCommunityIcons', name: 'volume-high' },
  speaker_slow: { family: 'MaterialCommunityIcons', name: 'snail' },
  wave_sound: { family: 'MaterialCommunityIcons', name: 'waveform' },
  ear_listen: { family: 'MaterialCommunityIcons', name: 'ear-hearing' },

  // Games & Actions
  speed_bolt: { family: 'MaterialCommunityIcons', name: 'lightning-bolt-circle' },
  sorter_filter: { family: 'MaterialCommunityIcons', name: 'sort-variant' },
  syntax_blocks: { family: 'MaterialCommunityIcons', name: 'toy-brick-outline' },
  boss_skull: { family: 'MaterialCommunityIcons', name: 'skull-outline' },
  object_search: { family: 'MaterialCommunityIcons', name: 'radar' },
  check_double: { family: 'MaterialCommunityIcons', name: 'check-decagram' },
  hint_bulb: { family: 'MaterialCommunityIcons', name: 'lightbulb-on-outline' },
  chest_box: { family: 'MaterialCommunityIcons', name: 'treasure-chest' },

  // Level Badges & Settings
  level_a1: { family: 'MaterialCommunityIcons', name: 'seed-outline' },
  level_a2: { family: 'MaterialCommunityIcons', name: 'sprout-outline' },
  level_b1: { family: 'MaterialCommunityIcons', name: 'tree-outline' },
  level_b2: { family: 'MaterialCommunityIcons', name: 'feather' },
  level_c1: { family: 'MaterialCommunityIcons', name: 'crown-outline' },
  gear_settings: { family: 'Feather', name: 'sliders' },
};

export default function SpecialIcon({
  name,
  size = 24,
  color = colors.text,
  variant = 'plain', // 'plain' | 'badge' | 'glow' | 'pill'
  bgColor,
  glowColor,
  style,
}) {
  const meta = SPECIAL_ICON_MAP[name] || { family: 'MaterialCommunityIcons', name: 'sparkles' };

  let IconComponent;
  switch (meta.family) {
    case 'Feather':
      IconComponent = Feather;
      break;
    case 'Ionicons':
      IconComponent = Ionicons;
      break;
    case 'FontAwesome6':
      IconComponent = FontAwesome6;
      break;
    case 'MaterialCommunityIcons':
    default:
      IconComponent = MaterialCommunityIcons;
      break;
  }

  const iconElement = (
    <IconComponent name={meta.name} size={size} color={color} />
  );

  if (variant === 'badge') {
    return (
      <View
        style={[
          styles.badgeContainer,
          {
            backgroundColor: bgColor || 'rgba(59, 130, 246, 0.15)',
            borderColor: glowColor || 'rgba(96, 165, 250, 0.3)',
            width: size * 1.8,
            height: size * 1.8,
            borderRadius: (size * 1.8) / 2,
          },
          style,
        ]}
      >
        {iconElement}
      </View>
    );
  }

  if (variant === 'glow') {
    return (
      <View
        style={[
          styles.glowContainer,
          {
            shadowColor: glowColor || color,
          },
          style,
        ]}
      >
        {iconElement}
      </View>
    );
  }

  return <View style={style}>{iconElement}</View>;
}

const styles = StyleSheet.create({
  badgeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  glowContainer: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

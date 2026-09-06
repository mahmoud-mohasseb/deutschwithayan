// ============================================================
// AVATAR CUSTOMIZER COMPONENT
// Character selection, outfits, and companion pets
// Unlocked through gameplay with in-game coins 🪙
// ============================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { THEME } from '../../styles/theme';
import { useGameMode, AVATAR_OPTIONS } from '../../context/GameModeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAppTheme } from '../../context/ThemeContext';

export default function AvatarCustomizer() {
  const { avatar, updateAvatar, coins } = useGameMode();
  const { supportLang, isRTL } = useLanguage();
  const { isDark, colors } = useAppTheme();

  return (
    <View style={styles.container}>
      {/* Live Avatar Preview Card */}
      <View style={[styles.previewCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <View style={[styles.avatarCircle, { backgroundColor: colors.bgElevated, borderColor: avatar.outfitColor }]}>
          <Text style={styles.avatarLargeEmoji}>{avatar.characterEmoji}</Text>
          <View style={[styles.petBadge, { backgroundColor: colors.bgCard }]}>
            <Text style={styles.petBadgeEmoji}>{avatar.petEmoji}</Text>
          </View>
        </View>

        <Text style={[styles.characterTitleText, { color: colors.text }]}>{avatar.characterName}</Text>
        <Text style={[styles.perkText, { color: colors.textSecondary }]}>
          {supportLang === 'ar' ? 'الرفيق المرافق يمنحك مكافآت خبرة إضافية' : 'Companion Pet grants XP boost'}
        </Text>

        <View style={styles.coinsPill}>
          <Text style={styles.coinsText}>🪙 {coins} Coins</Text>
        </View>
      </View>

      {/* 1. Character Selection */}
      <View style={styles.sectionBlock}>
        <Text style={[styles.sectionHeading, { color: colors.text }]}>
          {supportLang === 'ar' ? 'اختر الشخصية الأساسية:' : 'Choose Character:'}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {AVATAR_OPTIONS.characters.map((char) => {
            const isSelected = avatar.characterId === char.id;
            return (
              <TouchableOpacity
                key={char.id}
                style={[
                  styles.charCard,
                  { backgroundColor: colors.bgCard, borderColor: colors.border },
                  isSelected && styles.selectedCharCard,
                ]}
                onPress={() =>
                  updateAvatar({
                    characterId: char.id,
                    characterName: char.name,
                    characterEmoji: char.emoji,
                  })
                }
              >
                <Text style={styles.charCardEmoji}>{char.emoji}</Text>
                <Text style={[styles.charCardName, { color: isSelected ? THEME.colors.primary : colors.text }]}>
                  {char.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 2. Outfits */}
      <View style={styles.sectionBlock}>
        <Text style={[styles.sectionHeading, { color: colors.text }]}>
          {supportLang === 'ar' ? 'الزي والمظهر:' : 'Outfits:'}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {AVATAR_OPTIONS.outfits.map((outfit) => {
            const isSelected = avatar.outfitId === outfit.id;
            return (
              <TouchableOpacity
                key={outfit.id}
                style={[
                  styles.outfitCard,
                  { backgroundColor: colors.bgCard, borderColor: colors.border },
                  isSelected && { borderColor: outfit.color, backgroundColor: `${outfit.color}25` },
                ]}
                onPress={() =>
                  updateAvatar({
                    outfitId: outfit.id,
                    outfitColor: outfit.color,
                  })
                }
              >
                <Text style={styles.outfitIcon}>{outfit.icon}</Text>
                <Text style={[styles.outfitName, { color: colors.text }]}>{outfit.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. Companion Pets */}
      <View style={styles.sectionBlock}>
        <Text style={[styles.sectionHeading, { color: colors.text }]}>
          {supportLang === 'ar' ? 'الحيوان المرافق (Companion Pet):' : 'Companion Pets:'}
        </Text>
        <View style={styles.petsGrid}>
          {AVATAR_OPTIONS.pets.map((pet) => {
            const isSelected = avatar.petId === pet.id;
            return (
              <TouchableOpacity
                key={pet.id}
                style={[
                  styles.petItemCard,
                  { backgroundColor: colors.bgCard, borderColor: colors.border },
                  isSelected && styles.selectedPetCard,
                ]}
                onPress={() =>
                  updateAvatar({
                    petId: pet.id,
                    petEmoji: pet.emoji,
                  })
                }
              >
                <Text style={styles.petItemEmoji}>{pet.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.petItemName, { color: colors.text }]}>{pet.name}</Text>
                  <Text style={[styles.petItemPerk, { color: colors.textSecondary }]}>{pet.perk}</Text>
                </View>
                {isSelected && <Text style={styles.activePetCheck}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  previewCard: {
    backgroundColor: THEME.colors.bgCard,
    padding: THEME.spacing.lg,
    borderRadius: THEME.radius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: THEME.colors.bgElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    marginBottom: 10,
    position: 'relative',
  },
  avatarLargeEmoji: {
    fontSize: 44,
  },
  petBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: THEME.colors.bgCard,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: THEME.colors.accent,
  },
  petBadgeEmoji: {
    fontSize: 16,
  },
  characterTitleText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  perkText: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    marginTop: 2,
    marginBottom: 8,
  },
  coinsPill: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: THEME.colors.accent,
  },
  coinsText: {
    color: THEME.colors.accentLight,
    fontWeight: '800',
    fontSize: 13,
  },
  sectionBlock: {
    gap: 8,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.colors.textSecondary,
  },
  chipsRow: {
    gap: 10,
  },
  charCard: {
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.md,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    minWidth: 80,
  },
  selectedCharCard: {
    borderColor: THEME.colors.primary,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  charCardEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  charCardName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  outfitCard: {
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.md,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    minWidth: 95,
  },
  outfitIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  outfitName: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  petsGrid: {
    gap: 8,
  },
  petItemCard: {
    backgroundColor: THEME.colors.bgCard,
    padding: 10,
    borderRadius: THEME.radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  selectedPetCard: {
    borderColor: THEME.colors.accent,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
  },
  petItemEmoji: {
    fontSize: 26,
  },
  petItemName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  petItemPerk: {
    color: THEME.colors.accentLight,
    fontSize: 11,
  },
  activePetCheck: {
    color: THEME.colors.accent,
    fontSize: 16,
    fontWeight: '900',
  },
});

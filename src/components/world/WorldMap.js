// ============================================================
// 2.5D INTERACTIVE QUEST PATH ("Der Abenteuerpfad")
// Curving, winding adventure trail with tactile 3D nodes,
// stepping stones, milestone biome gates, and mystery chests!
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import { THEME } from '../../styles/theme';
import { WORLD_LOCATIONS } from '../../../data/worldLocations';
import { useLanguage } from '../../context/LanguageContext';
import { useAppTheme } from '../../context/ThemeContext';
import { useAppStore } from '../../store/useAppStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BIOME_HEADINGS = {
  0: { badge: 'KAPITEL 1 • A1', de: 'Das Kinderzimmer & Zuhause 🏡', ar: 'غرفة الأطفال والبيت 🇪🇬', sub: 'Wortschatz & Grundlagen' },
  2: { badge: 'KAPITEL 2 • A1', de: 'Der Zauberwald & Tiere 🌲🐾', ar: 'الغابة السحرية والحيوانات 🇪🇬', sub: 'Akkusativ & Tiere' },
  4: { badge: 'KAPITEL 3 • A2', de: 'Die Spielplatzstadt 🏙️🎡', ar: 'مدينة الألعاب والملاهي 🇪🇬', sub: 'Dativ & Orte' },
  6: { badge: 'KAPITEL 4 • A2', de: 'Der Vergnügungspark 🎪🎢', ar: 'منتزه المغامرات 🇪🇬', sub: 'Wechselpräpositionen' },
  8: { badge: 'KAPITEL 5 • B1', de: 'Die Bergwelt der Alpen 🏔️🚡', ar: 'جبال الألب الشاهقة 🇪🇬', sub: 'Passiv & Nebensätze' },
  10: { badge: 'KAPITEL 6 • B2-C2', de: 'Das Zauberschloss Neuschwanstein 🏰👑', ar: 'قلعة الملوك والأساطير 🇪🇬', sub: 'Meisterschaft & Rhetorik' },
};

export default function WorldMap({ onSelectQuest }) {
  const { supportLang, isRTL } = useLanguage();
  const { isDark, colors } = useAppTheme();
  const avatar = useAppStore((s) => s.avatar);
  const completedLocations = useAppStore((s) => s.completedLocations);
  const unlockedLocations = useAppStore((s) => s.unlockedLocations);
  const openedChests = useAppStore((s) => s.openedChests);
  const openChest = useAppStore((s) => s.openChest);

  const [selectedLocation, setSelectedLocation] = useState(null);

  // Horizontal offsets for the winding zig-zag curve
  const horizontalPositions = ['50%', '76%', '50%', '24%'];

  const handleOpenChest = (chestId) => {
    openChest(chestId, { coins: 50, hearts: 1, stars: 3 });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollCanvas}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 100% Offline Ready Status Pill */}
        <View style={styles.offlineStatusRow}>
          <View style={styles.offlineDot} />
          <Text style={styles.offlineText}>
            {supportLang === 'ar' ? '📶 متاح 100% بدون إنترنت (أوفلاين) 🇪🇬' : '📶 100% Offline Ready (Kein Internet nötig)'}
          </Text>
        </View>

        {/* The Curving Quest Path with 6 Biomes */}
        <View style={styles.pathCanvas}>
          {WORLD_LOCATIONS.map((loc, idx) => {
            const isCompleted = completedLocations.includes(loc.id) || idx === 0;
            const isUnlocked = unlockedLocations.includes(loc.id) || idx <= 1;
            const isCurrent = !isCompleted && isUnlocked;
            const isLocked = !isUnlocked;

            const xPos = horizontalPositions[idx % horizontalPositions.length];
            const biome = BIOME_HEADINGS[idx];

            const showChestAfter = idx === 1 || idx === 3 || idx === 5;
            const chestId = `chest-${idx}`;
            const isChestOpen = openedChests.includes(chestId);

            return (
              <React.Fragment key={loc.id}>
                {/* Biome Chapter Banner */}
                {biome && (
                  <View style={styles.chapterBanner}>
                    <View style={styles.chapterBadge}>
                      <Text style={styles.chapterBadgeText}>{biome.badge}</Text>
                    </View>
                    <Text style={styles.chapterTitle}>
                      {supportLang === 'ar' ? biome.ar : biome.de}
                    </Text>
                    <Text style={styles.chapterSub}>{biome.sub}</Text>
                  </View>
                )}

                {/* Node Container */}
                <View style={[styles.nodeWrapper, { alignSelf: idx % 2 === 0 ? (idx % 4 === 0 ? 'center' : 'center') : (idx % 4 === 1 ? 'flex-end' : 'flex-start'), paddingHorizontal: 30 }]}>
                  {/* Floating Avatar Beacon on Active Stage */}
                  {isCurrent && (
                    <View style={styles.playerBeacon}>
                      <View style={styles.beaconBubble}>
                        <Text style={styles.beaconText}>
                          {supportLang === 'ar' ? 'مهمتك هنا!' : 'Hier gehts weiter!'}
                        </Text>
                      </View>
                      <View style={styles.beaconArrow} />
                      <Text style={styles.beaconAvatar}>{avatar?.characterEmoji || '🦅'}</Text>
                    </View>
                  )}

                  {/* 3D Circular Stage Node */}
                  <TouchableOpacity
                    style={[
                      styles.stageNode,
                      isCompleted && styles.nodeCompleted,
                      isCurrent && styles.nodeActive,
                      isLocked && styles.nodeLocked,
                    ]}
                    onPress={() => setSelectedLocation(loc)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.nodeInnerSurface}>
                      <Text style={styles.stageEmoji}>{loc.icon}</Text>
                    </View>

                    {/* Completion Checkmark or Lock Badge */}
                    {isCompleted && (
                      <View style={styles.statusBadgeCompleted}>
                        <Text style={styles.statusBadgeText}>✓</Text>
                      </View>
                    )}
                    {isLocked && (
                      <View style={styles.statusBadgeLocked}>
                        <Text style={styles.statusBadgeText}>🔒</Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* Stage Name & Level Tag */}
                  <View style={styles.stageLabelContainer}>
                    <Text style={[styles.stageName, isCurrent && styles.stageNameActive]}>
                      {loc.name.de}
                    </Text>
                    {isCompleted ? (
                      <Text style={styles.starRating}>⭐⭐⭐</Text>
                    ) : (
                      <View style={[styles.cefrPill, { backgroundColor: isLocked ? '#334155' : THEME.colors.primaryDark }]}>
                        <Text style={styles.cefrPillText}>{loc.level}</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Cobblestone Paver Stepping Stones connecting to next node */}
                {idx < WORLD_LOCATIONS.length - 1 && (
                  <View style={styles.steppingStonesRow}>
                    <View style={[styles.stoneDot, isCompleted ? styles.stoneLit : styles.stoneUnlit]} />
                    <View style={[styles.stoneDot, isCompleted ? styles.stoneLit : styles.stoneUnlit]} />
                    <View style={[styles.stoneDot, isCompleted ? styles.stoneLit : styles.stoneUnlit]} />
                  </View>
                )}

                {/* Optional Bonus Mystery Chest */}
                {showChestAfter && (
                  <View style={styles.chestContainer}>
                    <TouchableOpacity
                      style={[styles.chestBox, isChestOpen && styles.chestBoxOpened]}
                      onPress={() => handleOpenChest(chestId)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.chestIcon}>{isChestOpen ? '📭' : '🎁'}</Text>
                      <Text style={styles.chestLabel}>
                        {isChestOpen
                          ? (supportLang === 'ar' ? 'تم الفتح! (+50 🪙)' : 'Eingelöst! (+50 🪙)')
                          : (supportLang === 'ar' ? 'صندوق مكافأة! اضغط للفتح' : 'Bonus-Kiste! Tippen')}
                      </Text>
                      {isChestOpen && (
                        <Text style={styles.rewardText}>+50 🪙  +1 ❤️  +3 ⭐</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </React.Fragment>
            );
          })}
        </View>

        {/* Bottom Padding */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Quest Details Bottom Sheet Modal */}
      {selectedLocation && (
        <Modal
          visible={!!selectedLocation}
          transparent
          animationType="slide"
          onRequestClose={() => setSelectedLocation(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalSheet, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
              {/* Modal Drag Handle */}
              <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />

              {/* Location Landmark Header */}
              <View style={styles.modalHeader}>
                <View style={[styles.modalIconBox, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}>
                  <Text style={styles.modalIcon}>{selectedLocation.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.modalTitleRow}>
                    <Text style={[styles.modalTitle, { color: colors.text }]}>{selectedLocation.name.de}</Text>
                    <View style={[styles.cefrPill, { backgroundColor: colors.primary }]}>
                      <Text style={styles.cefrPillText}>{selectedLocation.level}</Text>
                    </View>
                  </View>
                  <Text style={[styles.modalSubtitle, { color: colors.textMuted }]}>
                    {supportLang === 'ar' ? selectedLocation.name.ar : selectedLocation.name.en}
                  </Text>
                </View>
              </View>

              {/* Description */}
              <Text style={[styles.modalDesc, { color: colors.textMuted }]}>
                {supportLang === 'ar' ? selectedLocation.description.ar : selectedLocation.description.en}
              </Text>

              {/* Quests in this Location */}
              <Text style={[styles.questsHeading, { color: colors.text }]}>
                {supportLang === 'ar' ? '🎯 مهام هذا الموقع:' : '🎯 Verfügbare Quests:'}
              </Text>

              {selectedLocation.quests?.map((quest) => (
                <TouchableOpacity
                  key={quest.id}
                  style={[styles.questCard, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}
                  onPress={() => {
                    const loc = selectedLocation;
                    setSelectedLocation(null);
                    onSelectQuest(quest, loc);
                  }}
                  activeOpacity={0.8}
                >
                  <View style={styles.questCardLeft}>
                    <Text style={styles.questCardIcon}>
                      {quest.type === 'boss' ? '🏰' : quest.type === '3d_hunt' ? '🎮' : '⭐'}
                    </Text>
                    <View>
                      <Text style={[styles.questCardTitle, { color: colors.text }]}>{quest.title}</Text>
                      <Text style={[styles.questCardSub, { color: colors.textMuted }]}>
                        {supportLang === 'ar' ? quest.title : quest.title}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.questRewardBadge}>
                    <Text style={styles.questRewardText}>+{quest.xp || 50} XP</Text>
                  </View>
                </TouchableOpacity>
              ))}

              {/* Start Adventure Big 3D Push Button */}
              <TouchableOpacity
                style={styles.startQuestBtn}
                onPress={() => {
                  const defaultQuest = selectedLocation.quests?.[0] || { type: 'lesson' };
                  const loc = selectedLocation;
                  setSelectedLocation(null);
                  onSelectQuest(defaultQuest, loc);
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.startQuestBtnText}>
                  {supportLang === 'ar' ? '🚀 ابدأ المغامرة الآن' : '🚀 QUEST STARTEN'}
                </Text>
              </TouchableOpacity>

              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeSheetBtn}
                onPress={() => setSelectedLocation(null)}
              >
                <Text style={styles.closeSheetBtnText}>
                  {supportLang === 'ar' ? 'إغلاق' : 'Schließen'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.bg,
  },
  offlineStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  offlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  offlineText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  scrollCanvas: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
  },

  // Chapter Header Banner
  chapterBanner: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: THEME.colors.bgCard,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: THEME.colors.border,
    alignItems: 'center',
  },
  chapterBadge: {
    backgroundColor: THEME.colors.primaryDark,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 6,
  },
  chapterBadgeText: {
    color: '#93C5FD',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  chapterTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4,
    textAlign: 'center',
  },
  chapterSub: {
    color: THEME.colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
  },

  // Path Canvas
  pathCanvas: {
    position: 'relative',
    paddingVertical: 10,
  },
  nodeWrapper: {
    alignItems: 'center',
    marginVertical: 10,
  },

  // Floating Player Beacon
  playerBeacon: {
    alignItems: 'center',
    marginBottom: 8,
  },
  beaconBubble: {
    backgroundColor: THEME.colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  beaconText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '900',
  },
  beaconArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: THEME.colors.accent,
  },
  beaconAvatar: {
    fontSize: 22,
    marginTop: 2,
  },

  // 3D Circular Stage Node
  stageNode: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: THEME.colors.bgElevated,
    borderWidth: 3,
    borderColor: THEME.colors.borderLight,
    borderBottomWidth: 6,
    borderBottomColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  nodeInnerSurface: {
    width: '100%',
    height: '100%',
    borderRadius: 37,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageEmoji: {
    fontSize: 32,
  },

  // Node States
  nodeCompleted: {
    backgroundColor: '#059669',
    borderColor: '#34D399',
    borderBottomColor: '#047857',
  },
  nodeActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: '#93C5FD',
    borderBottomColor: '#1E40AF',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  nodeLocked: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderBottomColor: '#0F172A',
    opacity: 0.65,
  },

  // Status Badges
  statusBadgeCompleted: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadgeLocked: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#334155',
    borderWidth: 1.5,
    borderColor: '#64748B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },

  // Stage Label
  stageLabelContainer: {
    alignItems: 'center',
    marginTop: 6,
  },
  stageName: {
    color: THEME.colors.textMuted,
    fontSize: 13,
    fontWeight: '800',
  },
  stageNameActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  starRating: {
    fontSize: 11,
    marginTop: 2,
  },
  cefrPill: {
    marginTop: 3,
    paddingHorizontal: 7,
    paddingVertical: 1.5,
    borderRadius: 8,
  },
  cefrPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },

  // Stepping Stones
  steppingStonesRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
    gap: 6,
  },
  stoneDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stoneLit: {
    backgroundColor: '#34D399',
    opacity: 0.8,
  },
  stoneUnlit: {
    backgroundColor: THEME.colors.border,
    opacity: 0.6,
  },

  // Mystery Bonus Chest
  chestContainer: {
    alignItems: 'center',
    marginVertical: 14,
  },
  chestBox: {
    backgroundColor: THEME.colors.bgCard,
    borderWidth: 2,
    borderColor: THEME.colors.accent,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 4,
    borderBottomWidth: 5,
    borderBottomColor: THEME.colors.accentShadow,
  },
  chestBoxOpened: {
    borderColor: THEME.colors.border,
    borderBottomColor: '#0F172A',
    opacity: 0.7,
  },
  chestIcon: {
    fontSize: 28,
  },
  chestLabel: {
    color: THEME.colors.accentLight,
    fontSize: 12,
    fontWeight: '800',
  },
  rewardText: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '900',
  },

  // Modal Bottom Sheet
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: THEME.colors.bgCard,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: THEME.colors.borderLight,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  modalIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: THEME.colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: THEME.colors.borderLight,
  },
  modalIcon: {
    fontSize: 28,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  modalSubtitle: {
    color: THEME.colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  modalDesc: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 16,
  },
  questsHeading: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },
  questCard: {
    backgroundColor: THEME.colors.bgElevated,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  questCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  questCardIcon: {
    fontSize: 20,
  },
  questCardTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  questCardSub: {
    color: THEME.colors.textMuted,
    fontSize: 11,
  },
  questRewardBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  questRewardText: {
    color: THEME.colors.accentLight,
    fontSize: 11,
    fontWeight: '900',
  },
  startQuestBtn: {
    backgroundColor: THEME.colors.primary,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 14,
    borderBottomWidth: 5,
    borderBottomColor: THEME.colors.primaryShadow,
  },
  startQuestBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  closeSheetBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  closeSheetBtnText: {
    color: THEME.colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
});

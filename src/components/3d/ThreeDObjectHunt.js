// ============================================================
// 3D / 2.5D OBJECT HUNT MINI-GAME
// Interactive visual room exploration (Restaurant Theme)
// Player spots and identifies German objects:
// das Glas, der Kaffee, die Speisekarte, das Wasser, die Pizza
// ============================================================

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { THEME } from '../../styles/theme';
import { OBJECT_HUNT_ITEMS } from '../../../data/gamesData';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import { useGameMode } from '../../context/GameModeContext';
import { useAppTheme } from '../../context/ThemeContext';

export default function ThreeDObjectHunt({ onFinish }) {
  const { supportLang, isRTL } = useLanguage();
  const { addXp } = useProgress();
  const { earnCoins } = useGameMode();
  const { isDark, colors } = useAppTheme();

  const [targetIndex, setTargetIndex] = useState(0);
  const [selectedObjectId, setSelectedObjectId] = useState(null);
  const [foundIds, setFoundIds] = useState([]);
  const [rotationAngle, setRotationAngle] = useState(0); // 3D turntable rotation

  const targetItem = OBJECT_HUNT_ITEMS[targetIndex] || OBJECT_HUNT_ITEMS[0];

  const handleObjectTap = (item) => {
    setSelectedObjectId(item.id);
    const isTarget = item.id === targetItem.id;

    if (isTarget) {
      if (!foundIds.includes(item.id)) {
        setFoundIds((prev) => [...prev, item.id]);
        addXp(20);
        earnCoins(10);
      }
    }
  };

  const handleNextTarget = () => {
    setSelectedObjectId(null);
    if (targetIndex < OBJECT_HUNT_ITEMS.length - 1) {
      setTargetIndex((prev) => prev + 1);
    } else {
      if (onFinish) onFinish();
    }
  };

  const rotateLeft = () => setRotationAngle((prev) => prev - 30);
  const rotateRight = () => setRotationAngle((prev) => prev + 30);

  const isTargetFound = selectedObjectId === targetItem.id;

  return (
    <View style={[styles.container, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
      {/* Target Mission Header */}
      <View style={[styles.missionBar, { borderBottomColor: colors.border }]}>
        <View style={styles.missionRow}>
          <Text style={[styles.missionTargetLabel, { color: colors.accent }]}>
            {supportLang === 'ar' ? '🔍 ابحث عن الشيء التالي في الغرفة:' : '🔍 Mission: Find the target object:'}
          </Text>
          <Text style={[styles.targetWordDe, { color: colors.text }]}>{targetItem.name}</Text>
          <Text style={[styles.targetTranslation, { color: colors.textSecondary }]}>
            {supportLang === 'ar' ? targetItem.arabic : targetItem.english}
          </Text>
        </View>

        <View style={[styles.progressCounter, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}>
          <Text style={[styles.counterText, { color: colors.primary }]}>
            {foundIds.length} / {OBJECT_HUNT_ITEMS.length}
          </Text>
        </View>
      </View>

      {/* 3D / 2.5D Room Viewport */}
      <View style={styles.viewport}>
        <View style={styles.viewportSkyline}>
          <Text style={styles.roomTag}>🏠 3D Restaurant Table • Perspective View</Text>
          {/* Turntable Rotation Controls */}
          <View style={styles.turnControls}>
            <TouchableOpacity style={styles.turnBtn} onPress={rotateLeft}>
              <Text style={styles.turnBtnText}>⟲ -30°</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.turnBtn} onPress={rotateRight}>
              <Text style={styles.turnBtnText}>+30° ⟳</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3D Table Surface */}
        <View style={styles.tableSurface}>
          {/* Projected 3D objects distributed around the table */}
          {OBJECT_HUNT_ITEMS.map((item, idx) => {
            const isSelected = selectedObjectId === item.id;
            const isAlreadyFound = foundIds.includes(item.id);

            // Compute pseudo-3D offset modified by rotation angle
            const rad = ((rotationAngle + idx * 72) * Math.PI) / 180;
            const posX = Math.cos(rad) * 110;
            const posY = Math.sin(rad) * 45;

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.object3DNode,
                  {
                    transform: [{ translateX: posX }, { translateY: posY }],
                    borderColor: item.color,
                    backgroundColor: isSelected ? item.color : 'rgba(30, 41, 59, 0.9)',
                  },
                ]}
                onPress={() => handleObjectTap(item)}
                activeOpacity={0.8}
              >
                <View style={[styles.objectShape, { backgroundColor: item.color }]}>
                  <Text style={styles.shapeIcon}>
                    {item.id === 'obj-glas' && '🥛'}
                    {item.id === 'obj-kaffee' && '☕'}
                    {item.id === 'obj-speisekarte' && '📋'}
                    {item.id === 'obj-wasser' && '💧'}
                    {item.id === 'obj-pizza' && '🍕'}
                  </Text>
                </View>

                <Text style={[styles.objectLabelText, isSelected && { color: '#000000' }]}>
                  {item.name}
                </Text>

                {isAlreadyFound && (
                  <View style={styles.checkBadge}>
                    <Text style={styles.checkBadgeText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Inspection & Feedback Tray */}
      {selectedObjectId && (
        <View style={[styles.inspectCard, isTargetFound ? styles.cardSuccess : styles.cardHint]}>
          <View style={[styles.inspectHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View>
              <Text style={[styles.inspectTitle, { color: isTargetFound ? '#059669' : colors.text }]}>
                {isTargetFound
                  ? '🎉 Richtig gefunden! (+20 XP, +10 🪙)'
                  : 'Das ist ein anderes Objekt!'}
              </Text>
              <Text style={[styles.inspectHint, { color: colors.textSecondary }]}>
                {targetItem.hint}
              </Text>
            </View>

            {isTargetFound && (
              <TouchableOpacity style={styles.nextTargetBtn} onPress={handleNextTarget}>
                <Text style={styles.nextTargetBtnText}>
                  {targetIndex < OBJECT_HUNT_ITEMS.length - 1 ? 'Nächstes Objekt ➔' : 'Mission beenden 🏆'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    margin: THEME.spacing.md,
  },
  missionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  missionRow: {
    flex: 1,
  },
  missionTargetLabel: {
    color: THEME.colors.accentLight,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  targetWordDe: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  targetTranslation: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
  },
  progressCounter: {
    backgroundColor: THEME.colors.bgElevated,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  counterText: {
    color: THEME.colors.primaryLight,
    fontWeight: '800',
    fontSize: 12,
  },
  viewport: {
    height: 240,
    backgroundColor: '#070B14',
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewportSkyline: {
    position: 'absolute',
    top: 8,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  roomTag: {
    color: THEME.colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  turnControls: {
    flexDirection: 'row',
    gap: 6,
  },
  turnBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  turnBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  tableSurface: {
    width: 220,
    height: 120,
    borderRadius: 110,
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderWidth: 2,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  object3DNode: {
    position: 'absolute',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: THEME.radius.md,
    borderWidth: 1.5,
    minWidth: 70,
  },
  objectShape: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  shapeIcon: {
    fontSize: 16,
  },
  objectLabelText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  checkBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: THEME.colors.success,
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  inspectCard: {
    marginTop: 12,
    padding: 12,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
  },
  cardSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: THEME.colors.success,
  },
  cardHint: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: THEME.colors.accent,
  },
  inspectHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  inspectTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  inspectHint: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
  },
  nextTargetBtn: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: THEME.radius.sm,
  },
  nextTargetBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});

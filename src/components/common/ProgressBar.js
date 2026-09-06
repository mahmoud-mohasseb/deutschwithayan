// ============================================================
// PROGRESS BAR COMPONENT
// Renders percentage bars with customizable colors
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../../styles/theme';

export default function ProgressBar({
  progress = 0,
  color = THEME.colors.primary,
  height = 8,
  showLabel = false,
  label = '',
}) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelRow}>
          <Text style={styles.labelText}>{label}</Text>
          <Text style={[styles.percentText, { color }]}>{clampedProgress}%</Text>
        </View>
      )}
      <View style={[styles.track, { height }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${clampedProgress}%`,
              backgroundColor: color,
              height,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 4,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  labelText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
  },
  percentText: {
    fontSize: 13,
    fontWeight: '700',
  },
  track: {
    width: '100%',
    backgroundColor: THEME.colors.border,
    borderRadius: THEME.radius.full,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: THEME.radius.full,
  },
});

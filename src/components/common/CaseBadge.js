// ============================================================
// CASE BADGE COMPONENT
// Color-coded indicator for German cases with tri-lingual labels
// Modernized with @gluestack-ui/themed primitives (Badge, BadgeText, HStack, Text)
// ============================================================

import React from 'react';
import { StyleSheet } from 'react-native';
import { Badge, BadgeText, HStack, Text } from '@gluestack-ui/themed';
import { THEME } from '../../styles/theme';
import { useLanguage } from '../../context/LanguageContext';
import { GRAMMAR_TERM_TRIPLETS } from '../../utils/bidi';

export default function CaseBadge({ caseName, compact = false }) {
  const { supportLang, isRTL } = useLanguage();
  const caseKey = caseName?.charAt(0).toUpperCase() + caseName?.slice(1).toLowerCase();
  const triplet = GRAMMAR_TERM_TRIPLETS[caseKey] || {
    de: caseName,
    en: caseName,
    ar: caseName,
  };

  const color = THEME.colors.cases[caseKey?.toLowerCase()] || THEME.colors.primary;

  return (
    <Badge
      style={[
        styles.badge,
        {
          borderColor: color,
          backgroundColor: `${color}18`,
          flexDirection: isRTL ? 'row-reverse' : 'row',
        },
      ]}
    >
      <HStack space="xs" alignItems="center">
        <BadgeText style={[styles.deText, { color }]}>
          {triplet.de}
        </BadgeText>
        {!compact && (
          <Text style={styles.subText}>
            • {supportLang === 'ar' ? triplet.ar : triplet.en}
          </Text>
        )}
      </HStack>
    </Badge>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1.2,
    alignSelf: 'flex-start',
  },
  deText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  subText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.colors.textMuted,
  },
});


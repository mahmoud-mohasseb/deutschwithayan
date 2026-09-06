// ============================================================
// TRI-TEXT COMPONENT
// Renders German primary text, with gradual scaffolding:
// 🇩🇪 German (always primary)
// 🇬🇧 English explanation
// 🇪🇬 Arabic explanation
// With interactive "💡 Explain" button
// ============================================================

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { THEME } from '../../styles/theme';
import { useLanguage } from '../../context/LanguageContext';
import { useAppTheme } from '../../context/ThemeContext';

import AudioPronounceButton from '../common/AudioPronounceButton';

export default function TriText({
  german,
  english,
  arabic,
  grammarNote,
  explainPayload,
  forceShow = false,
}) {
  const { supportLang, cefrLevel, isRTL, openExplain, t } = useLanguage();
  const { isDark, colors } = useAppTheme();
  const [manualReveal, setManualReveal] = useState(false);

  // Scaffolding visibility logic:
  // A1: always visible
  // A2: always visible
  // B1: optional toggle (starts collapsed unless manually revealed)
  // B2+: hidden by default, reveal on demand
  const isHighLevel = ['B1', 'B2', 'C1', 'C2'].includes(cefrLevel);
  const showScaffolding = forceShow || !isHighLevel || manualReveal;

  const handleExplain = () => {
    if (explainPayload) {
      openExplain(explainPayload);
    } else {
      openExplain({
        term: german,
        englishExplanation: english,
        arabicExplanation: arabic,
        germanNote: grammarNote,
        exampleSentence: { de: german, en: english, ar: arabic },
      });
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
      {/* Target Language: German (Always Primary & Prominent) */}
      <View style={[styles.topRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={styles.germanContainer}>
          <Text style={styles.germanFlag}>🇩🇪</Text>
          <Text style={[styles.germanText, { color: colors.text }]}>{german}</Text>
          <AudioPronounceButton text={german} size={18} />
        </View>

        {/* Explain This Button */}
        <TouchableOpacity style={styles.explainBtn} onPress={handleExplain} activeOpacity={0.7}>
          <Text style={styles.explainBtnText}>💡 {t('explainThis')}</Text>
        </TouchableOpacity>
      </View>

      {/* Grammar note if present */}
      {grammarNote && (
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>⚡ {grammarNote}</Text>
        </View>
      )}

      {/* Scaffolding toggle for higher levels */}
      {isHighLevel && !manualReveal && (
        <TouchableOpacity
          style={[styles.revealBtn, { backgroundColor: colors.bgElevated }]}
          onPress={() => setManualReveal(true)}
          activeOpacity={0.7}
        >
          <Text style={[styles.revealBtnText, { color: colors.textMuted }]}>
            👁️ {supportLang === 'ar' ? 'عرض الترجمة المساعدة' : 'Show support translation'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Tri-Lingual Scaffolding */}
      {showScaffolding && (
        <View style={[styles.scaffoldContainer, { borderTopColor: colors.border }]}>
          {/* English Scaffolding */}
          <View style={[styles.langItem, styles.enItem, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)' }]}>
            <Text style={[styles.langBadge, { color: colors.textMuted }]}>🇬🇧 EN</Text>
            <Text style={[styles.supportText, { color: colors.textSecondary }]}>{english}</Text>
          </View>

          {/* Arabic Scaffolding */}
          <View style={[styles.langItem, styles.arItem, { flexDirection: 'row-reverse', backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)' }]}>
            <Text style={[styles.langBadge, { color: colors.textMuted }]}>🇪🇬 AR</Text>
            <Text style={[styles.supportText, styles.arText, { color: colors.textSecondary }]}>{arabic}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.md,
    marginVertical: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  topRow: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.spacing.sm,
    gap: 8,
  },
  germanContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    flex: 1,
  },
  germanFlag: {
    fontSize: 20,
    marginTop: 1,
  },
  germanText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
    flex: 1,
    flexWrap: 'wrap',
  },
  explainBtn: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  explainBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.colors.accentLight,
  },
  noteBox: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: THEME.radius.sm,
    marginVertical: 6,
    borderLeftWidth: 3,
    borderLeftColor: THEME.colors.primary,
  },
  noteText: {
    color: THEME.colors.primaryLight,
    fontSize: 12,
    fontWeight: '600',
  },
  revealBtn: {
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: THEME.colors.bgElevated,
    borderRadius: THEME.radius.sm,
    marginTop: 6,
  },
  revealBtnText: {
    color: THEME.colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  scaffoldContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    paddingTop: 8,
    gap: 6,
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    padding: 7,
    borderRadius: THEME.radius.sm,
  },
  enItem: {
    borderLeftWidth: 2,
    borderLeftColor: THEME.colors.primaryLight,
  },
  arItem: {
    borderRightWidth: 2,
    borderRightColor: THEME.colors.success,
  },
  langBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textMuted,
  },
  supportText: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    flex: 1,
  },
  arText: {
    textAlign: 'right',
    fontSize: 15,
  },
});

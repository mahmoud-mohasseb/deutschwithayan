// ============================================================
// "EXPLAIN THIS" (💡) MODAL
// Tri-lingual breakdown of any grammar point or word:
// 🇩🇪 German | 🇬🇧 English | 🇪🇬 العربية
// Dynamic Dark / Light Mode Support & Crisp Contrast
// ============================================================

import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { THEME } from '../../styles/theme';
import { useLanguage } from '../../context/LanguageContext';
import { useAppTheme } from '../../context/ThemeContext';
import soundService from '../../services/soundService';
import AudioPronounceButton from './AudioPronounceButton';

export default function ExplainModal() {
  const { activeExplainItem, closeExplain, isRTL, t } = useLanguage();
  const { isDark, colors } = useAppTheme();

  if (!activeExplainItem) return null;

  const handleClose = () => {
    soundService.stopSpeech();
    closeExplain();
  };

  const {
    term,
    germanTitle,
    germanNote,
    englishExplanation,
    arabicExplanation,
    exampleSentence,
    grammarRole,
  } = activeExplainItem;

  const germanSentenceText = exampleSentence ? (exampleSentence.de || exampleSentence) : '';
  const englishText = englishExplanation || (exampleSentence && exampleSentence.en);
  const arabicText = arabicExplanation || (exampleSentence && exampleSentence.ar);

  return (
    <Modal
      transparent
      animationType="fade"
      visible={!!activeExplainItem}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalCard,
            { backgroundColor: colors.bgCard, borderColor: colors.border },
            isDark ? THEME.shadowsDark.softCard : THEME.shadows.softCard,
          ]}
        >
          {/* Header */}
          <View
            style={[
              styles.headerRow,
              { borderBottomColor: colors.border, flexDirection: isRTL ? 'row-reverse' : 'row' },
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.bulbIcon}>💡</Text>
              <Text style={[styles.modalHeading, { color: colors.text }]}>{t('explainTitle')}</Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Text style={[styles.closeBtnText, { color: colors.textMuted }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
            {/* Focal Word / Structure */}
            <View
              style={[
                styles.termCard,
                { backgroundColor: colors.bgElevated, borderColor: colors.border },
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                <Text style={[styles.termGerman, { color: colors.text }]}>{term || germanTitle}</Text>
                <AudioPronounceButton text={term || germanTitle} lang="de" flag="🇩🇪" size={18} />
              </View>
              {grammarRole && (
                <View style={[styles.roleBadge, { backgroundColor: colors.coralBg, borderColor: colors.coral }]}>
                  <Text style={[styles.roleBadgeText, { color: colors.coral }]}>{grammarRole}</Text>
                </View>
              )}
            </View>

            {/* Example in German */}
            {exampleSentence && (
              <View style={[styles.sectionBox, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}>
                <View style={styles.langTagRow}>
                  <Text style={[styles.langTag, { color: colors.textMuted }]}>🇩🇪 Deutsch</Text>
                  <AudioPronounceButton text={germanSentenceText} lang="de" flag="🇩🇪" size={14} />
                </View>
                <Text style={[styles.germanSentence, { color: colors.text }]}>
                  {germanSentenceText}
                </Text>
                {germanNote && (
                  <Text style={[styles.germanNoteText, { color: colors.yellow }]}>{germanNote}</Text>
                )}
              </View>
            )}

            {/* English Explanation */}
            {englishText && (
              <View
                style={[
                  styles.sectionBox,
                  styles.enBox,
                  { backgroundColor: colors.bgElevated, borderColor: 'rgba(96, 165, 250, 0.4)' },
                ]}
              >
                <View style={styles.langTagRow}>
                  <Text style={[styles.langTag, styles.enTag]}>🇬🇧 English</Text>
                  <AudioPronounceButton text={englishText} lang="en" flag="🇬🇧" size={14} />
                </View>
                <Text style={[styles.explanationText, { color: colors.text }]}>
                  {englishText}
                </Text>
              </View>
            )}

            {/* Arabic Explanation */}
            {arabicText && (
              <View
                style={[
                  styles.sectionBox,
                  styles.arBox,
                  { backgroundColor: colors.bgElevated, borderColor: 'rgba(52, 211, 153, 0.4)' },
                ]}
              >
                <View style={[styles.langTagRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <Text style={[styles.langTag, styles.arTag]}>🇪🇬 العربية</Text>
                  <AudioPronounceButton text={arabicText} lang="ar" flag="🇪🇬" size={14} />
                </View>
                <Text style={[styles.explanationText, styles.arText, { color: colors.text }]}>
                  {arabicText}
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Bottom Action Button */}
          <TouchableOpacity
            style={[styles.doneButton, { backgroundColor: colors.primary }]}
            onPress={handleClose}
          >
            <Text style={styles.doneButtonText}>{t('close')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 10, 20, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.md,
  },
  modalCard: {
    width: '100%',
    maxWidth: 460,
    maxHeight: '85%',
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    padding: THEME.spacing.lg,
  },
  headerRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
    paddingBottom: THEME.spacing.xs,
    borderBottomWidth: 1,
  },
  bulbIcon: {
    fontSize: 20,
  },
  modalHeading: {
    fontSize: 16,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 6,
  },
  closeBtnText: {
    fontSize: 16,
    fontWeight: '800',
  },
  scrollBody: {
    marginBottom: THEME.spacing.md,
  },
  termCard: {
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
    borderWidth: 1,
  },
  termGerman: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  roleBadge: {
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sectionBox: {
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.md,
    marginBottom: THEME.spacing.sm + 4,
    borderWidth: 1,
  },
  enBox: {},
  arBox: {},
  langTagRow: {
    marginBottom: 6,
  },
  langTag: {
    fontSize: 11,
    fontWeight: '800',
  },
  enTag: {
    color: '#38BDF8',
  },
  arTag: {
    color: '#34D399',
  },
  germanSentence: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  germanNoteText: {
    fontSize: 13,
    fontStyle: 'italic',
    fontWeight: '700',
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  arText: {
    textAlign: 'right',
    fontSize: 15,
    lineHeight: 22,
  },
  doneButton: {
    paddingVertical: 12,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});

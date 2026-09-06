// ============================================================
// IN-APP GERMAN DICTIONARY SCREEN
// Searchable in German, English, or Arabic.
// Nouns show: der/die/das, plural, full case declension (Nom/Akk/Dat/Gen).
// Verbs show: conjugation tables (ich, du, er, etc.) and auxiliary verb.
// ============================================================

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { THEME } from '../styles/theme';
import { DICTIONARY } from '../../data/dictionary';
import { useLanguage } from '../context/LanguageContext';
import { useAppTheme } from '../context/ThemeContext';
import AudioPronounceButton from '../components/common/AudioPronounceButton';
import SpecialIcon from '../components/common/SpecialIcon';
import soundService from '../services/soundService';

export default function DictionaryScreen() {
  const { supportLang, isRTL, t } = useLanguage();
  const { isDark, colors } = useAppTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWord, setSelectedWord] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'noun' | 'verb' | 'conjunction'

  const filteredWords = DICTIONARY.filter((item) => {
    const matchesFilter = filterType === 'all' || item.type === filterType;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesFilter;

    const matchesSearch =
      item.german.toLowerCase().includes(q) ||
      item.english.toLowerCase().includes(q) ||
      item.arabic.includes(q);

    return matchesFilter && matchesSearch;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Search Bar */}
      <View style={[styles.searchBox, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
        <SpecialIcon name="object_search" size={18} color={colors.primaryLight || colors.coral} />
        <TextInput
          style={[styles.searchInput, { textAlign: isRTL ? 'right' : 'left', color: colors.text }]}
          placeholder={t('searchPlaceholder')}
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={[styles.clearText, { color: colors.textMuted }]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {['all', 'noun', 'verb', 'conjunction'].map((type) => {
          const isActive = filterType === type;
          const labelMap = {
            all: supportLang === 'ar' ? 'الكل' : 'All',
            noun: supportLang === 'ar' ? 'الأسماء' : 'Nouns',
            verb: supportLang === 'ar' ? 'الأفعال' : 'Verbs',
            conjunction: supportLang === 'ar' ? 'حروف العطف' : 'Conjunctions',
          };
          return (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterChip,
                { backgroundColor: colors.bgElevated, borderColor: colors.border },
                isActive && { backgroundColor: colors.coral, borderColor: colors.coral },
              ]}
              onPress={() => {
                soundService.playSfx('tap');
                setFilterType(type);
              }}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: colors.textMuted },
                  isActive && { color: '#FFFFFF' },
                ]}
              >
                {labelMap[type]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Word List and Detailed Card */}
      <ScrollView style={styles.scrollList} contentContainerStyle={styles.listContent}>
        {/* If a word is selected, show its full declension / conjugation view */}
        {selectedWord ? (
          <View style={[styles.detailCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
            <TouchableOpacity
              style={styles.backToListBtn}
              onPress={() => {
                soundService.playSfx('tap');
                setSelectedWord(null);
              }}
            >
              <Text style={[styles.backToListText, { color: colors.coral }]}>➔ {supportLang === 'ar' ? 'العودة للقائمة' : 'Back to Dictionary'}</Text>
            </TouchableOpacity>

            <View style={styles.detailHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Text style={[styles.detailGerman, { color: colors.text }]}>{selectedWord.german}</Text>
                <AudioPronounceButton text={selectedWord.german} size={22} />
              </View>
              <Text style={[styles.detailPhonetic, { color: colors.textMuted }]}>🗣️ /{selectedWord.phonetic}/</Text>
              <View style={[styles.typeBadge, { backgroundColor: colors.coralBg }]}>
                <Text style={[styles.typeBadgeText, { color: colors.coral }]}>
                  {selectedWord.type.toUpperCase()} {selectedWord.gender ? `• ${selectedWord.gender}` : ''}
                </Text>
              </View>
            </View>

            {/* Translations */}
            <View style={[styles.translationRow, { backgroundColor: colors.bgElevated }]}>
              <Text style={[styles.transEn, { color: colors.skyBlue || '#3B82F6' }]}>🇬🇧 {selectedWord.english}</Text>
              <Text style={[styles.transAr, { textAlign: isRTL ? 'right' : 'left', color: colors.mint || '#10B981' }]}>
                🇪🇬 {selectedWord.arabic}
              </Text>
            </View>

            {/* Noun Declension Table (Cases) */}
            {selectedWord.type === 'noun' && selectedWord.declension && (
              <View style={[styles.tableBox, { backgroundColor: colors.bgElevated }]}>
                <Text style={[styles.tableTitle, { color: colors.text }]}>📋 {t('declension')}</Text>
                <View style={styles.tableGrid}>
                  <View style={styles.declRow}>
                    <Text style={[styles.caseTag, { color: colors.textMuted }]}>Nominativ (رفع):</Text>
                    <Text style={[styles.caseValue, { color: colors.text }]}>{selectedWord.declension.nominativ}</Text>
                    <AudioPronounceButton text={selectedWord.declension.nominativ} size={14} />
                  </View>
                  <View style={styles.declRow}>
                    <Text style={[styles.caseTag, { color: colors.mint || '#10B981' }]}>Akkusativ (نصب):</Text>
                    <Text style={[styles.caseValue, { color: colors.text }]}>{selectedWord.declension.akkusativ}</Text>
                    <AudioPronounceButton text={selectedWord.declension.akkusativ} size={14} />
                  </View>
                  <View style={styles.declRow}>
                    <Text style={[styles.caseTag, { color: colors.lavender || '#8B5CF6' }]}>Dativ (جر):</Text>
                    <Text style={[styles.caseValue, { color: colors.text }]}>{selectedWord.declension.dativ}</Text>
                    <AudioPronounceButton text={selectedWord.declension.dativ} size={14} />
                  </View>
                  <View style={styles.declRow}>
                    <Text style={[styles.caseTag, { color: colors.yellow || '#F59E0B' }]}>Genitiv (إضافة):</Text>
                    <Text style={[styles.caseValue, { color: colors.text }]}>{selectedWord.declension.genitiv}</Text>
                    <AudioPronounceButton text={selectedWord.declension.genitiv} size={14} />
                  </View>
                  <View style={[styles.declRow, { borderTopWidth: 1, borderColor: colors.border }]}>
                    <Text style={[styles.caseTag, { color: colors.textMuted }]}>Plural (جمع):</Text>
                    <Text style={[styles.caseValue, { color: colors.text }]}>{selectedWord.plural}</Text>
                    <AudioPronounceButton text={selectedWord.plural} size={14} />
                  </View>
                </View>
              </View>
            )}

            {/* Verb Conjugation Table */}
            {selectedWord.type === 'verb' && selectedWord.conjugation && (
              <View style={[styles.tableBox, { backgroundColor: colors.bgElevated }]}>
                <Text style={[styles.tableTitle, { color: colors.text }]}>📋 {t('conjugation')} (Präsens)</Text>
                <View style={styles.conjugationList}>
                  {Object.entries(selectedWord.conjugation).map(([pronoun, form]) => {
                    const cleanPronoun = pronoun.replace('_', '/');
                    return (
                      <View key={pronoun} style={styles.conjRow}>
                        <Text style={[styles.conjPronoun, { color: colors.textMuted }]}>{cleanPronoun}:</Text>
                        <Text style={[styles.conjForm, { color: colors.text }]}>{form}</Text>
                        <AudioPronounceButton text={`${cleanPronoun} ${form}`} size={14} />
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Example sentence */}
            {selectedWord.example && (
              <View style={[styles.exampleCard, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={[styles.exampleTitle, { color: colors.yellow || '#F59E0B' }]}>💡 Beispiel (Example):</Text>
                  <AudioPronounceButton text={selectedWord.example.de} size={18} />
                </View>
                <Text style={[styles.exampleDe, { color: colors.text }]}>🇩🇪 {selectedWord.example.de}</Text>
                <Text style={[styles.exampleEn, { color: colors.textSecondary }]}>🇬🇧 {selectedWord.example.en}</Text>
                <Text style={[styles.exampleAr, { textAlign: isRTL ? 'right' : 'left', color: colors.mint || '#10B981' }]}>
                  🇪🇬 {selectedWord.example.ar}
                </Text>
              </View>
            )}
          </View>
        ) : (
          /* List of entries */
          filteredWords.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.entryCard, { backgroundColor: colors.bgCard, borderColor: colors.border }]}
              onPress={() => {
                soundService.playSfx('tap');
                setSelectedWord(item);
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.entryTopRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                  <View>
                    <Text style={[styles.entryGerman, { color: colors.text }]}>{item.german}</Text>
                    <Text style={[styles.entryPhonetic, { color: colors.textMuted }]}>/{item.phonetic}/</Text>
                  </View>
                  <AudioPronounceButton text={item.german} size={16} />
                </View>
                <View style={[styles.entryTypePill, { backgroundColor: colors.bgElevated }]}>
                  <Text style={[styles.entryTypePillText, { color: colors.textSecondary }]}>{item.type}</Text>
                </View>
              </View>

              <View style={styles.entryTransRow}>
                <Text style={[styles.entryEn, { color: colors.skyBlue || '#3B82F6' }]}>🇬🇧 {item.english}</Text>
                <Text style={[styles.entryAr, { textAlign: isRTL ? 'right' : 'left', color: colors.mint || '#10B981' }]}>
                  🇪🇬 {item.arabic}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.bg,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.bgCard,
    margin: THEME.spacing.md,
    paddingHorizontal: 12,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    gap: 8,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: '#FFFFFF',
    fontSize: 14,
  },
  clearText: {
    color: THEME.colors.textMuted,
    fontSize: 14,
    padding: 6,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: THEME.radius.sm,
    backgroundColor: THEME.colors.bgElevated,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  filterChipActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primaryLight,
  },
  filterChipText: {
    color: THEME.colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  scrollList: {
    flex: 1,
  },
  listContent: {
    padding: THEME.spacing.md,
    paddingBottom: 110,
    gap: 10,
  },
  entryCard: {
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  entryTopRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  entryGerman: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  entryPhonetic: {
    fontSize: 11,
    color: THEME.colors.textDim,
  },
  entryTypePill: {
    backgroundColor: THEME.colors.bgElevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: THEME.radius.sm,
  },
  entryTypePillText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    fontWeight: '700',
  },
  entryTransRow: {
    gap: 2,
    marginTop: 4,
  },
  entryEn: {
    fontSize: 13,
    color: THEME.colors.primaryLight,
  },
  entryAr: {
    fontSize: 14,
    color: THEME.colors.success,
  },
  detailCard: {
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    gap: 14,
  },
  backToListBtn: {
    paddingVertical: 4,
  },
  backToListText: {
    color: THEME.colors.primaryLight,
    fontWeight: '700',
    fontSize: 13,
  },
  detailHeader: {
    alignItems: 'center',
    gap: 4,
  },
  detailGerman: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  detailPhonetic: {
    color: THEME.colors.accentLight,
    fontSize: 13,
  },
  typeBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: THEME.radius.full,
    marginTop: 4,
  },
  typeBadgeText: {
    color: THEME.colors.primaryLight,
    fontSize: 11,
    fontWeight: '700',
  },
  translationRow: {
    backgroundColor: THEME.colors.bgElevated,
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    gap: 6,
  },
  transEn: {
    fontSize: 15,
    color: THEME.colors.primaryLight,
    fontWeight: '600',
  },
  transAr: {
    fontSize: 16,
    color: THEME.colors.success,
    fontWeight: '600',
  },
  tableBox: {
    backgroundColor: THEME.colors.bgElevated,
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    gap: 8,
  },
  tableTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  tableGrid: {
    gap: 6,
  },
  declRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  caseTag: {
    color: THEME.colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  caseValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  conjugationList: {
    gap: 6,
  },
  conjRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  conjPronoun: {
    color: THEME.colors.textMuted,
    fontSize: 13,
  },
  conjForm: {
    color: THEME.colors.accentLight,
    fontSize: 15,
    fontWeight: '800',
  },
  exampleCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    borderLeftWidth: 3,
    borderLeftColor: THEME.colors.accent,
    gap: 4,
  },
  exampleTitle: {
    color: THEME.colors.accentLight,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  exampleDe: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  exampleEn: {
    color: THEME.colors.textSecondary,
    fontSize: 13,
  },
  exampleAr: {
    color: THEME.colors.success,
    fontSize: 14,
  },
});

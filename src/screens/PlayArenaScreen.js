// ============================================================
// PLAY ARENA SCREEN — 100% LIGHTWEIGHT 2D MINI-GAME HUB 🎮
// Designed for Kids 👧 and Grown-Ups 👨.
// Zero WebGL / Three.js overhead — loads instantaneously at 60fps!
// Driven 100% by pure JSON data.
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Modal,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '../styles/theme';
import { useLanguage } from '../context/LanguageContext';
import { useAppTheme } from '../context/ThemeContext';
import soundService from '../services/soundService';

// All 8 Fast, Snappy 2D Mini-Game Components
import MemoryPairsGame from '../components/games/MemoryPairsGame';
import KidsAdventureGame from '../components/games/KidsAdventureGame';
import ArticleBattle from '../components/games/ArticleBattle';
import SentenceBuilder from '../components/games/SentenceBuilder';
import VerbRace from '../components/games/VerbRace';
import CaseDetective from '../components/games/CaseDetective';
import GrammarBoss from '../components/games/GrammarBoss';
import AudioDetective from '../components/games/AudioDetective';

const { width } = Dimensions.get('window');

export default function PlayArenaScreen({ initialGame = null, onOpenMenu }) {
  const insets = useSafeAreaInsets();
  const { supportLang, toggleSupportLang, cefrLevel, isRTL, t } = useLanguage();
  const { isDark, toggleTheme, colors } = useAppTheme();

  const [activeModalGame, setActiveModalGame] = useState(initialGame);
  const [selectedFilter, setSelectedFilter] = useState('ALL'); // 'ALL' | 'KIDS' | 'ADULT'
  const [selectedLevel, setSelectedLevel] = useState('ALL'); // 'ALL' | 'A1' | 'A2' | 'B1' | 'B2'

  const arenaGames = [
    {
      id: 'memory',
      target: 'kids_and_adults',
      titleEn: 'Memory Spiel (Pairs Match)',
      titleAr: 'لعبة الذاكرة ومطابقة الكلمات 🇪🇬',
      subtitleEn: 'Match German Words, Emojis & Translations',
      subtitleAr: 'اقلب الكروت وطابق الكلمات الألمانية مع معناها 🇪🇬',
      level: 'A1 - B1',
      tag: 'KIDS & ALL',
      icon: 'cards-outline',
      color1: '#4f46e5',
      color2: '#7c3aed',
      accent: '#a78bfa',
    },
    {
      id: 'kids_adventure',
      target: 'kids',
      titleEn: 'Kids Animal & Color World',
      titleAr: 'عالم الحيوانات والألوان للأطفال 🇪🇬',
      subtitleEn: 'Interactive Animal Sounds, Colors & Fun Quiz',
      subtitleAr: 'أصوات حيوانات وألوان مبهجة وأسئلة تفاعلية 🇪🇬',
      level: 'KIDS',
      tag: 'KIDS SPECIAL',
      icon: 'teddy-bear',
      color1: '#f59e0b',
      color2: '#d97706',
      accent: '#fde68a',
    },
    {
      id: 'battle',
      target: 'adult',
      titleEn: 'Article Sorter Blitz (der/die/das)',
      titleAr: 'فرز وتحدي أدوات التعريف 🇪🇬',
      subtitleEn: 'Fast-Paced Noun Gender Sorting with Instant Rules',
      subtitleAr: 'فرز سريع لأدوات der / die / das مع القواعد 🇪🇬',
      level: 'A1 - A2',
      tag: 'ARTICLES',
      icon: 'shield-sword',
      color1: '#ea580c',
      color2: '#e11d48',
      accent: '#fb923c',
    },
    {
      id: 'builder',
      target: 'adult',
      titleEn: 'Sentence Builder (V2 Word Order)',
      titleAr: 'بناء الجمل وموقع الفعل V2 🇪🇬',
      subtitleEn: 'Snap Word Chips in Correct German Word Order',
      subtitleAr: 'رتب الكلمات لتكوين جمل صحيحة وقاعدة المقعد الثاني 🇪🇬',
      level: 'A2 - B1',
      tag: 'SYNTAX',
      icon: 'cube-unfolded',
      color1: '#0284c7',
      color2: '#0891b2',
      accent: '#38bdf8',
    },
    {
      id: 'verb_race',
      target: 'adult',
      titleEn: 'Verb Conjugation Speed Sprint',
      titleAr: 'سباق تصريف الأفعال الشاذة 🇪🇬',
      subtitleEn: 'High-Speed Pronoun Conjugation Against the Clock',
      subtitleAr: 'تحدي السرعة لتصريف الأفعال مع الضمائر المختلفة 🇪🇬',
      level: 'A1 - B2',
      tag: 'SPEED SPRINT',
      icon: 'car-sports',
      color1: '#c2410c',
      color2: '#dc2626',
      accent: '#fca5a5',
    },
    {
      id: 'detective',
      target: 'adult',
      titleEn: 'Case Detective Lab (4 Cases)',
      titleAr: 'مختبر محقق حالات الإعراب الأربعة 🇪🇬',
      subtitleEn: 'Nominativ, Akkusativ, Dativ & Genitiv Solver',
      subtitleAr: 'حل ألغاز الرفع والنصب والجر والإضافة مع الشرح 🇪🇬',
      level: 'A2 - B2',
      tag: '4 CASES',
      icon: 'microscope',
      color1: '#059669',
      color2: '#0d9488',
      accent: '#34d399',
    },
    {
      id: 'boss',
      target: 'adult',
      titleEn: 'Grammar Boss Battle',
      titleAr: 'مواجهة وحش القواعد والأخطاء 🇪🇬',
      subtitleEn: 'Correct Sentence Errors to Deal Massive Damage',
      subtitleAr: 'صحح أخطاء الجمل لتهزم الوحش وتربح نقاط الخبرة 🇪🇬',
      level: 'B1 - C1',
      tag: 'BOSS BATTLE',
      icon: 'sword-cross',
      color1: '#be123c',
      color2: '#881337',
      accent: '#fb7185',
    },
    {
      id: 'listen',
      target: 'adult',
      titleEn: 'Audio Detective (Listening)',
      titleAr: 'محقق الاستماع والأصوات الطبيعية 🇪🇬',
      subtitleEn: 'Native German Audio with Normal & Slow Speeds',
      subtitleAr: 'استمع لحوارات واقعية بسرعة طبيعية وبطيئة 🇪🇬',
      level: 'A1 - C1',
      tag: 'LISTENING',
      icon: 'waveform',
      color1: '#0f766e',
      color2: '#115e59',
      accent: '#5eead4',
    },
  ];

  const filteredGames = arenaGames.filter((g) => {
    if (selectedFilter === 'KIDS') return g.target === 'kids' || g.target === 'kids_and_adults';
    if (selectedFilter === 'ADULT') return g.target === 'adult' || g.target === 'kids_and_adults';
    return true;
  });

  const handleOpenGame = (gameId) => {
    soundService.playSfx('whoosh');
    setActiveModalGame(gameId);
  };

  const handleCloseModal = () => {
    soundService.playSfx('tap');
    setActiveModalGame(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Top Header Row (Optimized for all mobile screens 360px - tablets) */}
      <View style={[styles.headerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={styles.titleColumn}>
          <Text
            style={[styles.screenHeading, { color: colors.text }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {t('games') || 'Mini-Game Arena'}
          </Text>

          {/* Language & Level Selector Dropdown */}
          <TouchableOpacity
            style={[styles.langDropdownPill, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            onPress={() => {
              soundService.playSfx('tap');
              toggleSupportLang();
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.langFlag}>🇩🇪</Text>
            <Text style={[styles.langDropdownText, { color: colors.text }]}>
              Deutsch <Text style={styles.dropdownChevron}>▾</Text>
            </Text>
            <Text
              style={[styles.langLevelSubtitle, { color: colors.textMuted }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {supportLang === 'ar' ? 'ألعاب خفيفة' : 'Fast 2D Games'}
            </Text>
            <View style={[styles.supportChip, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}>
              <Text style={[styles.supportChipText, { color: colors.text }]}>
                {supportLang === 'ar' ? '🇪🇬 AR' : '🇬🇧 EN'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Action Buttons: Theme Toggle & Menu Drawer */}
        <View style={styles.headerActionBtns}>
          <TouchableOpacity
            style={[
              styles.iconCircleBtn,
              { backgroundColor: colors.bgCard, borderColor: colors.border },
              isDark ? THEME.shadowsDark.softPill : THEME.shadows.softPill,
            ]}
            onPress={() => {
              soundService.playSfx('tap');
              toggleTheme();
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.themeToggleIcon}>{isDark ? '🌙' : '☀️'}</Text>
          </TouchableOpacity>

          {onOpenMenu && (
            <TouchableOpacity
              style={[
                styles.iconCircleBtn,
                { backgroundColor: colors.bgCard, borderColor: colors.border },
                isDark ? THEME.shadowsDark.softPill : THEME.shadows.softPill,
              ]}
              onPress={() => {
                soundService.playSfx('tap');
                onOpenMenu();
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="grid-outline" size={18} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Target Audience Filters: ALL | KIDS 👧 | ADULT / GRAMMAR 👨 */}
      <View style={[styles.filterBar, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        {[
          { id: 'ALL', labelEn: 'All Games', labelAr: 'الكل (8)' },
          { id: 'KIDS', labelEn: '👧 Kids Fun', labelAr: '👧 للأطفال' },
          { id: 'ADULT', labelEn: '👨 Grown-Ups & Grammar', labelAr: '👨 للكبار والقواعد' },
        ].map((f) => {
          const isActive = selectedFilter === f.id;
          return (
            <TouchableOpacity
              key={f.id}
              style={[
                styles.filterPill,
                isActive
                  ? { backgroundColor: colors.primary, borderColor: colors.primary }
                  : { backgroundColor: colors.bgElevated, borderColor: colors.border },
              ]}
              onPress={() => {
                soundService.playSfx('tap');
                setSelectedFilter(f.id);
              }}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.filterPillText,
                  { color: isActive ? '#FFFFFF' : colors.textMuted },
                  isActive && { fontWeight: '800' },
                ]}
                numberOfLines={1}
              >
                {supportLang === 'ar' ? f.labelAr : f.labelEn}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Collins 3000 Level Selector: ALL | A1 | A2 | B1 | B2 */}
      <View style={[styles.levelFilterBar, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Text style={[styles.levelFilterLabel, { color: colors.textMuted }]}>
          {supportLang === 'ar' ? 'مستوى كولينز 3000:' : 'Collins Level:'}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.levelFilterScroll}>
          {['ALL', 'A1', 'A2', 'B1', 'B2'].map((lvl) => {
            const isLvlActive = selectedLevel === lvl;
            return (
              <TouchableOpacity
                key={lvl}
                style={[
                  styles.levelChipPill,
                  isLvlActive
                    ? { backgroundColor: `${colors.primary}25`, borderColor: colors.primary }
                    : { backgroundColor: colors.bgElevated, borderColor: colors.border },
                ]}
                onPress={() => {
                  soundService.playSfx('tap');
                  setSelectedLevel(lvl);
                }}
              >
                <Text
                  style={[
                    styles.levelChipText,
                    { color: isLvlActive ? colors.primary : colors.textMuted },
                    isLvlActive && { fontWeight: '800' },
                  ]}
                >
                  {lvl === 'ALL' ? (supportLang === 'ar' ? 'الكل 🌟' : 'All 🌟') : lvl}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Games List ScrollView */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gameCardsList}>
          {filteredGames.map((game) => (
            <TouchableOpacity
              key={game.id}
              style={[
                styles.gameCard,
                { backgroundColor: colors.bgCard, borderColor: colors.border },
                isDark ? THEME.shadowsDark.softCard : THEME.shadows.softCard,
              ]}
              onPress={() => handleOpenGame(game.id)}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[game.color1, game.color2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradientBanner}
              >
                <View style={[styles.cardHeaderRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <View style={styles.cardTagChip}>
                    <Text style={styles.cardTagText}>{game.tag}</Text>
                  </View>
                  <View style={styles.cardLevelChip}>
                    <Text style={styles.cardLevelText}>{game.level}</Text>
                  </View>
                </View>

                <View style={[styles.cardMainRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <View style={styles.cardIconCircle}>
                    <MaterialCommunityIcons name={game.icon} size={28} color="#FFFFFF" />
                  </View>
                  <View style={styles.cardTitlesColumn}>
                    <Text
                      style={[styles.cardGameTitle, { textAlign: isRTL ? 'right' : 'left' }]}
                      numberOfLines={1}
                    >
                      {supportLang === 'ar' ? game.titleAr : game.titleEn}
                    </Text>
                    <Text
                      style={[styles.cardGameSub, { textAlign: isRTL ? 'right' : 'left' }]}
                      numberOfLines={2}
                    >
                      {supportLang === 'ar' ? game.subtitleAr : game.subtitleEn}
                    </Text>
                  </View>
                </View>

                {/* Instant Play Action Button */}
                <View style={[styles.cardBottomRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <Text style={styles.instantPlayHint}>⚡ 100% JSON • Instant Play</Text>
                  <View style={styles.playNowPill}>
                    <Text style={styles.playNowText}>
                      {supportLang === 'ar' ? 'العب الآن ▶' : 'Play Now ▶'}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* FULL-SCREEN MINI-GAME MODAL */}
      <Modal
        visible={activeModalGame !== null}
        animationType="slide"
        transparent={false}
        onRequestClose={handleCloseModal}
      >
        <SafeAreaView style={[styles.modalSafeArea, { backgroundColor: colors.bg }]}>
          {/* Top Modal Header */}
          <View
            style={[
              styles.modalTopBar,
              {
                backgroundColor: colors.bgCard,
                borderBottomColor: colors.border,
                flexDirection: isRTL ? 'row-reverse' : 'row',
              },
            ]}
          >
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8, flex: 1 }}>
              <View style={[styles.modalIconBox, { backgroundColor: colors.coralBg }]}>
                <Ionicons name="game-controller" size={20} color={colors.primary} />
              </View>
              <Text
                style={[styles.modalHeading, { color: colors.text }]}
                numberOfLines={1}
              >
                {arenaGames.find((g) => g.id === activeModalGame)?.titleEn || 'Mini-Game'}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.closeModalCircle, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}
              onPress={handleCloseModal}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Embedded Game Component */}
          <View style={styles.modalContentBody}>
            {activeModalGame === 'memory' && (
              <MemoryPairsGame selectedLevel={selectedLevel} onFinish={handleCloseModal} />
            )}
            {activeModalGame === 'kids_adventure' && (
              <KidsAdventureGame onFinish={handleCloseModal} />
            )}
            {activeModalGame === 'battle' && (
              <ArticleBattle selectedLevel={selectedLevel} onFinish={handleCloseModal} />
            )}
            {activeModalGame === 'builder' && (
              <SentenceBuilder onFinish={handleCloseModal} />
            )}
            {activeModalGame === 'verb_race' && (
              <VerbRace onFinish={handleCloseModal} />
            )}
            {activeModalGame === 'detective' && (
              <CaseDetective onFinish={handleCloseModal} />
            )}
            {activeModalGame === 'boss' && (
              <GrammarBoss onFinish={handleCloseModal} />
            )}
            {activeModalGame === 'listen' && (
              <AudioDetective onFinish={handleCloseModal} />
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleColumn: {
    flex: 1,
    paddingRight: 8,
  },
  screenHeading: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  langDropdownPill: {
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    flexWrap: 'nowrap',
  },
  langFlag: {
    fontSize: 16,
  },
  langDropdownText: {
    fontSize: 13,
    fontWeight: '800',
  },
  dropdownChevron: {
    fontSize: 11,
  },
  langLevelSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 1,
  },
  supportChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  supportChipText: {
    fontSize: 10,
    fontWeight: '800',
  },
  headerActionBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  themeToggleIcon: {
    fontSize: 18,
  },
  filterBar: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  levelFilterBar: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    alignItems: 'center',
    gap: 8,
  },
  levelFilterLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  levelFilterScroll: {
    gap: 6,
    paddingVertical: 2,
  },
  levelChipPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  levelChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 110,
  },
  gameCardsList: {
    gap: 14,
  },
  gameCard: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
  },
  cardGradientBanner: {
    padding: 16,
    borderRadius: 22,
  },
  cardHeaderRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTagChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  cardTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cardLevelChip: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  cardLevelText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  cardMainRow: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  cardIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitlesColumn: {
    flex: 1,
  },
  cardGameTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  cardGameSub: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
    lineHeight: 16,
  },
  cardBottomRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    paddingTop: 10,
  },
  instantPlayHint: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontWeight: '600',
  },
  playNowPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  playNowText: {
    color: '#1E293B',
    fontSize: 12,
    fontWeight: '900',
  },
  modalSafeArea: {
    flex: 1,
  },
  modalTopBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeading: {
    fontSize: 17,
    fontWeight: '900',
  },
  closeModalCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  modalContentBody: {
    flex: 1,
  },
});

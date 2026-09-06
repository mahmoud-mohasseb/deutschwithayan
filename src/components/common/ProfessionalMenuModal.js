// ============================================================
// PROFESSIONAL MENU MODAL NAVIGATION — DEUTSCH QUEST 🇩🇪
// Enterprise-Grade Drawer Menu with Complete Category Navigation:
// - Comprehensive Learning (A1 - C2 Curriculum, Tests, Grammar)
// - 3D Three.js Game Arena (Quick Launch to all 8 Games)
// - Smart AI Tutor & Trilingual Dictionary
// - Instant Dark/Light Switcher & Language Switcher (🇬🇧 / 🇪🇬)
// ============================================================

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../../context/LanguageContext';
import { useAppTheme } from '../../context/ThemeContext';
import { useProgress } from '../../context/ProgressContext';
import { useGameMode } from '../../context/GameModeContext';
import soundService from '../../services/soundService';

const { width, height } = Dimensions.get('window');

export default function ProfessionalMenuModal({ visible, onClose, onNavigate }) {
  const { supportLang, setSupportLang, isRTL, cefrLevel } = useLanguage();
  const { isDark, toggleTheme, colors } = useAppTheme();
  const { xp, streakDays } = useProgress();
  const { hearts, coins } = useGameMode();

  const handleClose = () => {
    soundService.stopSpeech();
    onClose();
  };

  const handleItemPress = (destination, params = {}) => {
    soundService.playSfx('tap');
    handleClose();
    if (onNavigate) {
      onNavigate(destination, params);
    }
  };

  const navSections = [
    {
      titleEn: 'LEARNING & CERTIFICATION',
      titleAr: 'التعلم والشهادات 🇪🇬',
      items: [
        {
          id: 'home',
          titleEn: 'Home Dashboard',
          titleAr: 'لوحة التحكم الرئيسية 🇪🇬',
          icon: 'view-dashboard-outline',
          iconColor: '#3b82f6',
          badge: 'OVERVIEW',
        },
        {
          id: 'courses',
          titleEn: 'A1 - C2 Full Curriculum',
          titleAr: 'المنهج الكامل A1 - C2 🇪🇬',
          icon: 'book-open-page-variant-outline',
          iconColor: '#f59e0b',
          badge: 'ALL LEVELS',
        },
        {
          id: 'tests',
          titleEn: 'Diagnostic Exams & Certifications',
          titleAr: 'اختبارات تحديد المستوى والشهادات 🇪🇬',
          icon: 'clipboard-check-outline',
          iconColor: '#10b981',
          badge: 'OFFICIAL',
        },
        {
          id: 'learn',
          titleEn: 'World Map Quest',
          titleAr: 'خريطة رحلة الاستكشاف 🇪🇬',
          icon: 'map-marker-path',
          iconColor: '#8b5cf6',
          badge: 'STORY',
        },
        {
          id: 'review',
          titleEn: 'Master Grammar Handbook',
          titleAr: 'دليل القواعد الشامل 🇪🇬',
          icon: 'notebook-outline',
          iconColor: '#ec4899',
          badge: 'RULES',
        },
      ],
    },
    {
      titleEn: 'FUN MINI-GAMES (KIDS & GROWN-UPS)',
      titleAr: 'ألعاب تعليمية ممتعة للأطفال والكبار 🇪🇬',
      items: [
        {
          id: 'arena',
          params: { initialGame: null },
          titleEn: 'Mini-Game Arena Hub',
          titleAr: 'مركز حلبة الألعاب التعليمية 🇪🇬',
          icon: 'gamepad-variant-outline',
          iconColor: '#06b6d4',
          badge: '8 GAMES',
        },
        {
          id: 'arena',
          params: { initialGame: 'memory' },
          titleEn: 'Memory Spiel (Pairs Match)',
          titleAr: 'لعبة الذاكرة ومطابقة البطاقات 🇪🇬',
          icon: 'cards-outline',
          iconColor: '#7c3aed',
          badge: 'KIDS & ALL',
        },
        {
          id: 'arena',
          params: { initialGame: 'kids_adventure' },
          titleEn: 'Kids Animal & Color World',
          titleAr: 'عالم الحيوانات والألوان للأطفال 🇪🇬',
          icon: 'teddy-bear',
          iconColor: '#f59e0b',
          badge: 'KIDS FAVORITE',
        },
        {
          id: 'arena',
          params: { initialGame: 'battle' },
          titleEn: 'Article Sorter Blitz (der/die/das)',
          titleAr: 'فرز وتحدي أدوات التعريف 🇪🇬',
          icon: 'shield-sword',
          iconColor: '#ea580c',
          badge: 'ARTICLES',
        },
        {
          id: 'arena',
          params: { initialGame: 'builder' },
          titleEn: 'Sentence Builder (V2 Order)',
          titleAr: 'بناء الجمل وموقع الفعل V2 🇪🇬',
          icon: 'cube-unfolded',
          iconColor: '#d97706',
          badge: 'SYNTAX',
        },
        {
          id: 'arena',
          params: { initialGame: 'verb_race' },
          titleEn: 'Verb Conjugation Speed Sprint',
          titleAr: 'سباق تصريف الأفعال السريع 🇪🇬',
          icon: 'car-sports',
          iconColor: '#c2410c',
          badge: 'SPEED',
        },
        {
          id: 'arena',
          params: { initialGame: 'detective' },
          titleEn: 'Case Detective Lab',
          titleAr: 'مختبر محقق حالات الإعراب 🇪🇬',
          icon: 'microscope',
          iconColor: '#059669',
          badge: '4 CASES',
        },
        {
          id: 'arena',
          params: { initialGame: 'boss' },
          titleEn: 'Grammar Boss Battle',
          titleAr: 'مواجهة زعيم الأخطاء القواعدية 🇪🇬',
          icon: 'sword-cross',
          iconColor: '#e11d48',
          badge: 'BOSS',
        },
        {
          id: 'arena',
          params: { initialGame: 'listen' },
          titleEn: 'Audio Detective (Listening)',
          titleAr: 'محقق الاستماع والأصوات 🇪🇬',
          icon: 'waveform',
          iconColor: '#0f766e',
          badge: 'LISTENING',
        },
      ],
    },
    {
      titleEn: 'AI & SMART TOOLS',
      titleAr: 'الأدوات الذكية والذكاء الاصطناعي 🇪🇬',
      items: [
        {
          id: 'tutor',
          titleEn: 'Smart AI German Tutor',
          titleAr: 'المعلم الذكي للألمانية 🇪🇬',
          icon: 'robot-outline',
          iconColor: '#8b5cf6',
          badge: 'AI ACTIVE',
        },
        {
          id: 'dictionary',
          titleEn: 'Trilingual Audio Dictionary',
          titleAr: 'القاموس الصوتي ثلاثي اللغات 🇪🇬',
          icon: 'book-alphabet',
          iconColor: '#10b981',
          badge: 'DE/EN/AR',
        },
        {
          id: 'progress',
          titleEn: 'Analytics & Mastery Stats',
          titleAr: 'الإحصائيات ونسب التمكن 🇪🇬',
          icon: 'chart-line',
          iconColor: '#f97316',
          badge: 'STATS',
        },
      ],
    },
  ];

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={handleClose}>
      <View style={[styles.backdrop, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={[styles.menuDrawer, { backgroundColor: colors.bg, borderColor: colors.border }]}>
          <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
            {/* Drawer Top Profile Banner */}
            <LinearGradient
              colors={isDark ? ['#1e1b4b', '#0f172a'] : ['#4f46e5', '#3730a3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.profileHeader}
            >
            <View style={styles.profileTopRow}>
              <View style={styles.avatarBox}>
                <Image
                  source={require('../../../assets/ayan_logo.png')}
                  style={{ width: 44, height: 44, borderRadius: 22 }}
                  resizeMode="cover"
                />
              </View>
              <TouchableOpacity style={styles.closeIconBtn} onPress={handleClose}>
                <Ionicons name="close" size={22} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.userName}>
              {supportLang === 'ar' ? 'ألماني مع أيان 🇩🇪' : 'Deutsch with Ayan'}
            </Text>
            <Text style={styles.userSubtitle}>
              {supportLang === 'ar' ? `المستوى الحالي: ${cefrLevel}` : `Current Level: ${cefrLevel}`}
            </Text>

            {/* Quick Stats Pill Row */}
            <View style={styles.statsRow}>
              <View style={styles.statPill}>
                <Text style={styles.statLabel}>⭐ {xp} XP</Text>
              </View>
              <View style={styles.statPill}>
                <Text style={styles.statLabel}>🔥 {streakDays}d</Text>
              </View>
              <View style={styles.statPill}>
                <Text style={styles.statLabel}>❤️ {hearts}</Text>
              </View>
              <View style={styles.statPill}>
                <Text style={styles.statLabel}>🪙 {coins}</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Quick Controls Bar: Language & Theme */}
          <View style={[styles.quickControls, { backgroundColor: colors.bgCard, borderBottomColor: colors.border }]}>
            <TouchableOpacity
              style={[styles.quickBtn, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}
              onPress={() => {
                soundService.playSfx('tap');
                setSupportLang(supportLang === 'en' ? 'ar' : 'en');
              }}
            >
              <Text style={[styles.quickBtnText, { color: colors.text }]}>
                {supportLang === 'ar' ? '🇪🇬 العربية' : '🇬🇧 English'}
              </Text>
              <Ionicons name="swap-horizontal" size={16} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickBtn, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}
              onPress={() => {
                soundService.playSfx('tap');
                toggleTheme();
              }}
            >
              <Text style={[styles.quickBtnText, { color: colors.text }]}>
                {isDark ? '🌙 Dark' : '☀️ Light'}
              </Text>
              <Ionicons name={isDark ? 'moon' : 'sunny'} size={16} color="#f59e0b" />
            </TouchableOpacity>
          </View>

          {/* Nav Categories List */}
          <ScrollView
            style={styles.menuScroll}
            contentContainerStyle={styles.menuScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {navSections.map((sec, secIdx) => (
              <View key={secIdx} style={styles.sectionContainer}>
                <Text style={[styles.sectionHeading, { color: colors.textMuted }]}>
                  {supportLang === 'ar' ? sec.titleAr : sec.titleEn}
                </Text>

                <View style={[styles.itemsGroup, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                  {sec.items.map((item, itemIdx) => (
                    <TouchableOpacity
                      key={itemIdx}
                      style={[
                        styles.navItemRow,
                        itemIdx > 0 && { borderTopWidth: 1, borderTopColor: colors.border },
                      ]}
                      onPress={() => handleItemPress(item.id, item.params)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.itemIconCircle, { backgroundColor: item.iconColor + '20' }]}>
                        <MaterialCommunityIcons name={item.icon} size={20} color={item.iconColor} />
                      </View>

                      <View style={styles.itemTitleCol}>
                        <Text style={[styles.itemTitle, { color: colors.text }]}>
                          {supportLang === 'ar' ? item.titleAr : item.titleEn}
                        </Text>
                      </View>

                      {item.badge && (
                        <View style={[styles.itemBadge, { backgroundColor: colors.bgElevated }]}>
                          <Text style={[styles.itemBadgeText, { color: colors.textSecondary }]}>
                            {item.badge}
                          </Text>
                        </View>
                      )}

                      <Ionicons
                        name={isRTL ? 'chevron-back' : 'chevron-forward'}
                        size={16}
                        color={colors.textMuted}
                        style={{ marginLeft: 6 }}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
          </SafeAreaView>
        </View>

        {/* Outer dismiss area for tapping outside the drawer */}
        <TouchableOpacity
          style={styles.backdropDismissArea}
          activeOpacity={1}
          onPress={handleClose}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    flexDirection: 'row',
  },
  backdropDismissArea: {
    flex: 1,
  },
  menuDrawer: {
    width: Math.min(width * 0.88, 380),
    height: '100%',
    borderRightWidth: 1,
  },
  profileHeader: {
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 12 : 14,
    paddingBottom: 18,
  },
  profileTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  userSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  statPill: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statLabel: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  quickControls: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: 1,
  },
  quickBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  quickBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  menuScroll: {
    flex: 1,
  },
  menuScrollContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 40,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginBottom: 8,
    paddingLeft: 4,
  },
  itemsGroup: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  navItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  itemIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  itemTitleCol: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  itemBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  itemBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

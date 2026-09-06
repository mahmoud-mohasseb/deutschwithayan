// ============================================================
// PROFILE & AVATAR SCREEN
// Avatar customization, Child Mode 👧 vs Adult Mode 👨 toggle,
// Dark 🌙 vs Light ☀️ Mode switcher, Parent Dashboard, and Language
// ============================================================

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { THEME } from '../styles/theme';
import { useLanguage } from '../context/LanguageContext';
import { useProgress } from '../context/ProgressContext';
import { useGameMode } from '../context/GameModeContext';
import { useAppTheme } from '../context/ThemeContext';
import AvatarCustomizer from '../components/avatar/AvatarCustomizer';
import GluestackAnimatedCard from '../components/common/GluestackAnimatedCard';
import soundService from '../services/soundService';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { supportLang, setSupportLang, cefrLevel, setCefrLevel, isRTL, t, setIsOnboarded } = useLanguage();
  const { xp, streakDays } = useProgress();
  const { audienceMode, setAudienceMode, coins, hearts } = useGameMode();
  const { isDark, setThemeMode, themeMode, colors } = useAppTheme();

  const [activeTab, setActiveTab] = useState('avatar'); // 'avatar' | 'settings' | 'parent'

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bg }]}
      contentContainerStyle={styles.content}
    >
      {/* Sub-Tabs: Avatar | Settings | Parent Mode */}
      <View
        style={[
          styles.tabSelector,
          {
            backgroundColor: colors.bgCard,
            borderColor: colors.border,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
      >
        {[
          { id: 'avatar', label: '👤 Avatar & Begleiter' },
          { id: 'settings', label: '⚙️ Einstellungen' },
          { id: 'parent', label: '👨‍👩‍👧 Eltern-Modus' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabBtn, isActive && { backgroundColor: colors.primary }]}
              onPress={() => {
                soundService.playSfx('tap');
                setActiveTab(tab.id);
              }}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  { color: isActive ? '#FFFFFF' : colors.textMuted },
                  isActive && { fontWeight: '900' },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 1. Avatar Tab */}
      {activeTab === 'avatar' && <AvatarCustomizer />}

      {/* 2. Settings Tab */}
      {activeTab === 'settings' && (
        <View style={styles.sectionBlock}>
          {/* Theme Mode Switcher: Dark 🌙 vs Light ☀️ */}
          <GluestackAnimatedCard
            title="🎨 Design & Appearance"
            subtitle="Choose sleek Dark Mode or claymorphic Light Mode for your study comfort."
            arabicSubtitle="اختر النمط الداكن أو الفاتح حسب تفضيلك لراحة عينيك أثناء التعلم 🇪🇬"
            style={{ marginBottom: 12 }}
          >
            <View style={[styles.modeRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <TouchableOpacity
                style={[
                  styles.modeBtn,
                  { backgroundColor: colors.bgElevated, borderColor: colors.border },
                  themeMode === 'light' && { borderColor: colors.coral, backgroundColor: colors.coralBg },
                ]}
                onPress={() => {
                  soundService.playSfx('tap');
                  setThemeMode('light');
                }}
              >
                <Text style={styles.modeEmoji}>☀️</Text>
                <Text style={[styles.modeTitle, { color: colors.text }]}>Light Mode</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modeBtn,
                  { backgroundColor: colors.bgElevated, borderColor: colors.border },
                  themeMode === 'dark' && { borderColor: colors.coral, backgroundColor: colors.coralBg },
                ]}
                onPress={() => {
                  soundService.playSfx('tap');
                  setThemeMode('dark');
                }}
              >
                <Text style={styles.modeEmoji}>🌙</Text>
                <Text style={[styles.modeTitle, { color: colors.text }]}>Dark Mode</Text>
              </TouchableOpacity>
            </View>
          </GluestackAnimatedCard>

          {/* Audience Mode Switcher: Child vs Adult */}
          <GluestackAnimatedCard
            title="🎮 Spielmodus (App Experience)"
            subtitle={supportLang === 'ar'
              ? 'نمط الأطفال يمنحك أزراراً أكبر، شخصيات مرحة وشروحات مبسطة. نمط الكبار يقدم مواقف مهنية وسياقات متقدمة.'
              : 'Child Mode provides larger buttons, colorful characters, and simpler tips. Adult Mode provides professional scenarios.'}
            arabicSubtitle="التبديل بين واجهة الأطفال الكرتونية المبهجة وواجهة الكبار الاحترافية 🇪🇬"
            badge={audienceMode === 'child' ? '👧 Kids' : '👨 Adult'}
            badgeColor={colors.coral}
            style={{ marginBottom: 12 }}
          >
            <View style={[styles.modeRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <TouchableOpacity
                style={[
                  styles.modeBtn,
                  { backgroundColor: colors.bgElevated, borderColor: colors.border },
                  audienceMode === 'child' && { borderColor: colors.coral, backgroundColor: colors.coralBg },
                ]}
                onPress={() => {
                  soundService.playSfx('tap');
                  setAudienceMode('child');
                }}
              >
                <Text style={styles.modeEmoji}>👧</Text>
                <Text style={[styles.modeTitle, { color: colors.text }]}>{t('childMode')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modeBtn,
                  { backgroundColor: colors.bgElevated, borderColor: colors.border },
                  audienceMode === 'adult' && { borderColor: colors.coral, backgroundColor: colors.coralBg },
                ]}
                onPress={() => {
                  soundService.playSfx('tap');
                  setAudienceMode('adult');
                }}
              >
                <Text style={styles.modeEmoji}>👨</Text>
                <Text style={[styles.modeTitle, { color: colors.text }]}>{t('adultMode')}</Text>
              </TouchableOpacity>
            </View>
          </GluestackAnimatedCard>

          {/* Language Switcher: 🇬🇧 vs 🇪🇬 */}
          <GluestackAnimatedCard
            title={`🌐 ${t('changeLanguage')}`}
            subtitle={supportLang === 'ar'
              ? 'عند اختيار العربية 🇪🇬، تتغير واجهة التطبيق بالكامل إلى نمط RTL (من اليمين لليسار).'
              : 'Choosing Arabic 🇪🇬 switches the entire UI to native Right-to-Left (RTL) alignment.'}
            arabicSubtitle="دعم كامل للغة العربية باللهجة المصرية مع اتجاه الكتابة من اليمين لليسار 🇪🇬"
            badge={supportLang === 'ar' ? '🇪🇬 العربية' : '🇬🇧 English'}
            badgeColor={colors.accent}
            style={{ marginBottom: 12 }}
          >
            <View style={[styles.langRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <TouchableOpacity
                style={[
                  styles.langChoice,
                  { backgroundColor: colors.bgElevated, borderColor: colors.border },
                  supportLang === 'en' && { borderColor: colors.coral, backgroundColor: colors.coralBg },
                ]}
                onPress={() => {
                  soundService.playSfx('tap');
                  setSupportLang('en');
                }}
              >
                <Text style={styles.langFlag}>🇬🇧</Text>
                <Text style={[styles.langName, { color: colors.text }]}>English</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.langChoice,
                  { backgroundColor: colors.bgElevated, borderColor: colors.border },
                  supportLang === 'ar' && { borderColor: colors.coral, backgroundColor: colors.coralBg },
                ]}
                onPress={() => {
                  soundService.playSfx('tap');
                  setSupportLang('ar');
                }}
              >
                <Text style={styles.langFlag}>🇪🇬</Text>
                <Text style={[styles.langName, { color: colors.text }]}>العربية (RTL)</Text>
              </TouchableOpacity>
            </View>
          </GluestackAnimatedCard>

          {/* Level Switcher */}
          <GluestackAnimatedCard
            title={`🎯 ${t('selectedLevel')}`}
            subtitle="Select your target CEFR proficiency framework track"
            arabicSubtitle="اختر المستوى الأوروبي المرجعي المستهدف من A1 إلى C2 🇪🇬"
            levelBadge={cefrLevel}
            style={{ marginBottom: 12 }}
          >
            <View style={styles.levelsRow}>
              {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => {
                const isActive = cefrLevel === lvl;
                return (
                  <TouchableOpacity
                    key={lvl}
                    style={[
                      styles.lvlBtn,
                      { backgroundColor: colors.bgElevated, borderColor: colors.border },
                      isActive && { backgroundColor: colors.primary, borderColor: colors.primary },
                    ]}
                    onPress={() => {
                      soundService.playSfx('tap');
                      setCefrLevel(lvl);
                    }}
                  >
                    <Text
                      style={[
                        styles.lvlText,
                        { color: isActive ? '#FFFFFF' : colors.text },
                        isActive && styles.activeLvlText,
                      ]}
                    >
                      {lvl}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </GluestackAnimatedCard>

          {/* Replay Onboarding Setup Tour */}
          <GluestackAnimatedCard
            title={supportLang === 'ar' ? 'إعادة جولة التهيئة والإعداد 🇪🇬' : 'Replay Onboarding Tour'}
            subtitle={supportLang === 'ar' ? 'تخصيص الفئة العمرية واللغة والهدية الترحيبية' : 'Change age group, language & claim welcome starter gift'}
            arabicSubtitle="إعادة ضبط المعايير وتجربة معالج الترحيب من جديد 🇪🇬"
            badge="TOUR"
            badgeColor={colors.coral}
            onPress={() => {
              soundService.playSfx('tap');
              if (setIsOnboarded) setIsOnboarded(false);
            }}
            rightElement={
              <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={20} color={colors.coral} />
            }
          />
        </View>
      )}

      {/* 3. Parent Dashboard Tab */}
      {activeTab === 'parent' && (
        <View style={styles.sectionBlock}>
          <GluestackAnimatedCard
            title={`👨‍👩‍👧 ${t('parentDashboard')}`}
            subtitle={supportLang === 'ar'
              ? 'تقرير تعلم الطفل ومتابعة الوقت المستغرق ونقاط القوة والضعف.'
              : 'Monitor your child’s learning time, completed missions, and CEFR progress.'}
            arabicSubtitle="لوحة تحكم ولي الأمر لمتابعة تقدم الطفل وحمايته 🇪🇬"
            badge="PARENT"
            badgeColor={colors.mint}
            style={{ marginBottom: 12 }}
          >
            <View style={styles.parentStatsGrid}>
              <View style={[styles.parentStatBox, { backgroundColor: colors.bgElevated }]}>
                <Text style={[styles.parentStatNum, { color: colors.coral }]}>42 Min</Text>
                <Text style={[styles.parentStatLabel, { color: colors.textMuted }]}>Lernzeit heute</Text>
              </View>
              <View style={[styles.parentStatBox, { backgroundColor: colors.bgElevated }]}>
                <Text style={[styles.parentStatNum, { color: colors.yellow }]}>48 Wörter</Text>
                <Text style={[styles.parentStatLabel, { color: colors.textMuted }]}>Gelernte Vokabeln</Text>
              </View>
              <View style={[styles.parentStatBox, { backgroundColor: colors.bgElevated }]}>
                <Text style={[styles.parentStatNum, { color: colors.mint }]}>3 Quests</Text>
                <Text style={[styles.parentStatLabel, { color: colors.textMuted }]}>Abgeschlossen</Text>
              </View>
              <View style={[styles.parentStatBox, { backgroundColor: colors.bgElevated }]}>
                <Text style={[styles.parentStatNum, { color: colors.lavender }]}>94%</Text>
                <Text style={[styles.parentStatLabel, { color: colors.textMuted }]}>Genauigkeit</Text>
              </View>
            </View>

            <View style={[styles.safetyCard, { backgroundColor: colors.bgElevated, borderColor: colors.border, marginTop: 12 }]}>
              <Text style={[styles.safetyTitle, { color: colors.text }]}>🛡️ Kindersicher & Werbefrei</Text>
              <Text style={[styles.safetyText, { color: colors.textSecondary }]}>
                Deutsch with Ayan enthält keine unpassenden Inhalte, keine manipulativen Käufe und schützt die Privatsphäre.
              </Text>
            </View>
          </GluestackAnimatedCard>
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: THEME.spacing.md,
    paddingBottom: 120,
    gap: 14,
  },
  tabSelector: {
    borderRadius: THEME.radius.md,
    padding: 4,
    borderWidth: 1,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: THEME.radius.sm,
  },
  tabBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sectionBlock: {
    gap: 12,
  },
  card: {
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    gap: 10,
  },
  cardHeading: {
    fontSize: 16,
    fontWeight: '800',
  },
  cardSub: {
    fontSize: 13,
    lineHeight: 18,
  },
  modeRow: {
    gap: 10,
    marginTop: 4,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    borderWidth: 2,
    gap: 4,
  },
  modeEmoji: {
    fontSize: 28,
  },
  modeTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  langRow: {
    gap: 10,
    marginTop: 4,
  },
  langChoice: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    borderWidth: 2,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  langFlag: {
    fontSize: 20,
  },
  langName: {
    fontSize: 13,
    fontWeight: '800',
  },
  levelsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  lvlBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
  },
  lvlText: {
    fontSize: 13,
    fontWeight: '700',
  },
  activeLvlText: {
    fontWeight: '900',
  },
  parentStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  parentStatBox: {
    width: '48%',
    padding: 14,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
    gap: 4,
  },
  parentStatNum: {
    fontSize: 20,
    fontWeight: '900',
  },
  parentStatLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  safetyCard: {
    padding: 12,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    gap: 4,
    marginTop: 6,
  },
  safetyTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  safetyText: {
    fontSize: 11,
    lineHeight: 16,
  },
});

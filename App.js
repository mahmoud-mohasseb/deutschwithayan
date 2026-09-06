// ============================================================
// MAIN APP COMPONENT — DEUTSCH QUEST 🇩🇪
// Expo React Native 2D / 2.5D / 3D German Learning Game
// Featuring 3-Language Scaffolding (🇩🇪, 🇬🇧, 🇪🇬),
// Child Mode 👧 vs Adult Mode 👨, Adaptive Spaced Repetition (SRS),
// 12-Location World Map, 7 Mini-Games & AI Tutor.
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
  LogBox,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GluestackUIProvider } from '@gluestack-ui/themed';

// Silence upstream third-party SafeAreaView deprecation notice from older nested packages
LogBox.ignoreLogs(['SafeAreaView has been deprecated']);
import { config } from '@gluestack-ui/config';
import { ThemeProvider, useAppTheme } from './src/context/ThemeContext';
import { LanguageProvider, useLanguage } from './src/context/LanguageContext';
import { ProgressProvider } from './src/context/ProgressContext';
import { GameModeProvider } from './src/context/GameModeContext';
import { THEME } from './src/styles/theme';

import Header from './src/components/common/Header';
import ExplainModal from './src/components/common/ExplainModal';

import OnboardingScreen from './src/screens/OnboardingScreen';
import LearnMapScreen from './src/screens/LearnMapScreen';
import PlayArenaScreen from './src/screens/PlayArenaScreen';
import ReviewScreen from './src/screens/ReviewScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import ProfileScreen from './src/screens/ProfileScreen';

import LessonScreen from './src/screens/LessonScreen';
import TopicDetailScreen from './src/screens/TopicDetailScreen';
import DictionaryScreen from './src/screens/DictionaryScreen';
import TutorScreen from './src/screens/TutorScreen';
import SpecialIcon from './src/components/common/SpecialIcon';
import soundService from './src/services/soundService';

import ModernHomeScreen from './src/screens/ModernHomeScreen';
import CoursesHubScreen from './src/screens/CoursesHubScreen';
import AudioLessonsScreen from './src/screens/AudioLessonsScreen';
import TestsHubScreen from './src/screens/TestsHubScreen';
import CurriculumScreen from './src/screens/CurriculumScreen';
import ProfessionalMenuModal from './src/components/common/ProfessionalMenuModal';
import GluestackNavBar from './src/components/common/GluestackNavBar';

function MainAppNavigator() {
  const { isOnboarded, setIsOnboarded, supportLang, setSupportLang, isRTL, t } = useLanguage();
  const { isDark, colors, theme } = useAppTheme();

  // 5 Main Tabs matching the clean reference design:
  // 'home' | 'courses' | 'lessons' | 'arena' | 'profile'
  // Sub-views: 'learn' | 'lesson' | 'topic-detail' | 'dictionary' | 'tutor' | 'review' | 'tests'
  const [currentTab, setCurrentTab] = useState('home');
  const [activeParams, setActiveParams] = useState({});
  const [showLangModal, setShowLangModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);

  const navigateTo = (tabName, params = {}) => {
    soundService.stopAudio();
    soundService.stopSpeech();
    console.log('[App.js] navigateTo called with tabName:', tabName, 'params:', params);
    setActiveParams(params);
    setCurrentTab(tabName);
  };

  React.useEffect(() => {
    soundService.stopAudio();
    soundService.stopSpeech();
  }, [currentTab]);

  // If user has not completed onboarding, show onboarding screen
  if (!isOnboarded) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.bg} />
        <OnboardingScreen onComplete={() => setIsOnboarded(true)} />
      </SafeAreaView>
    );
  }

  // 5 Main Tabs with Clean Claymorphic Aesthetic
  const navTabs = [
    { id: 'home', label: t('home') || 'Home', iconName: 'quest_map', tint: colors.coral },
    { id: 'courses', label: t('curriculum') || 'Courses', iconName: 'dictionary', tint: colors.yellow },
    { id: 'lessons', label: t('lessons') || 'Lessons', iconName: 'ear_listen', tint: colors.mint },
    { id: 'arena', label: t('games') || 'Arena', iconName: 'arena', tint: colors.lavender },
    { id: 'profile', label: t('profile') || 'Profile', iconName: 'profile_shield', tint: colors.coral },
  ];

  const handleTabPress = (tabId) => {
    soundService.playSfx('tap');
    navigateTo(tabId);
  };

  const showGlobalHeader = ['profile', 'review', 'learn'].includes(currentTab);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.bg} />

      {/* Global Game HUD Header for Profile, Review & Learn */}
      {showGlobalHeader && (
        <Header
          onOpenLanguageSelect={() => setShowLangModal(true)}
          onOpenProfile={() => navigateTo('profile')}
        />
      )}

      {/* Main Screen Router */}
      <View style={styles.mainContent}>
        {currentTab === 'home' && (
          <ModernHomeScreen
            onNavigate={navigateTo}
            onOpenMenu={() => setShowMenuModal(true)}
          />
        )}

        {currentTab === 'courses' && (
          <CoursesHubScreen
            onNavigate={navigateTo}
            onOpenMenu={() => setShowMenuModal(true)}
          />
        )}

        {currentTab === 'lessons' && (
          <AudioLessonsScreen
            onNavigate={navigateTo}
            onOpenMenu={() => setShowMenuModal(true)}
          />
        )}

        {currentTab === 'arena' && (
          <PlayArenaScreen
            initialGame={activeParams.initialGame || null}
            onOpenMenu={() => setShowMenuModal(true)}
          />
        )}

        {currentTab === 'learn' && <LearnMapScreen onNavigate={navigateTo} />}

        {currentTab === 'review' && <ReviewScreen onNavigate={navigateTo} />}

        {currentTab === 'progress' && <ProgressScreen />}

        {currentTab === 'profile' && <ProfileScreen />}

        {/* Sub-view: Tests & Certifications */}
        {currentTab === 'tests' && (
          <TestsHubScreen onBack={() => navigateTo('courses')} />
        )}

        {/* Sub-view: Lesson Player */}
        {currentTab === 'lesson' && (
          <LessonScreen
            lessonId={activeParams.lessonId || 'a1-restaurant'}
            onBack={() => navigateTo('home')}
            onComplete={() => navigateTo('home')}
          />
        )}

        {/* Sub-view: Topic Detail */}
        {currentTab === 'topic-detail' && (
          <TopicDetailScreen
            topic={activeParams.topic}
            onBack={() => navigateTo('courses')}
          />
        )}

        {/* Sub-view: Curriculum & Collins 3000 Vocabulary */}
        {currentTab === 'curriculum' && (
          <CurriculumScreen
            initialTab={activeParams.initialTab || 'COLLINS'}
            onSelectTopic={(topic) => navigateTo('topic-detail', { topic })}
            onBack={() => navigateTo('courses')}
          />
        )}

        {/* Sub-view: Dictionary */}
        {currentTab === 'dictionary' && <DictionaryScreen />}

        {/* Sub-view: AI Tutor */}
        {currentTab === 'tutor' && <TutorScreen />}
      </View>

      {/* Gluestack UI Floating Curved Dock */}
      {currentTab !== 'lesson' && (
        <GluestackNavBar
          tabs={navTabs}
          currentTab={
            (currentTab === 'topic-detail' && 'courses') ||
            (currentTab === 'curriculum' && 'courses') ||
            (currentTab === 'learn' && 'home') ||
            currentTab
          }
          onTabPress={handleTabPress}
        />
      )}

      {/* Global "Explain This" (💡) Modal */}
      <ExplainModal />

      {/* Quick Language Switcher Modal (Strictly 🇪🇬 for Arabic) */}
      <Modal
        visible={showLangModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLangModal(false)}
      >
        <TouchableOpacity
          style={[styles.modalBackdrop, { backgroundColor: isDark ? 'rgba(5, 10, 20, 0.75)' : 'rgba(15, 23, 42, 0.5)' }]}
          activeOpacity={1}
          onPress={() => setShowLangModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={[
              styles.modalDialog,
              { backgroundColor: colors.bgCard, borderColor: colors.border },
              isDark ? THEME.shadowsDark.softCard : THEME.shadows.softCard,
            ]}
          >
            <Text style={[styles.dialogHeading, { color: colors.text }]}>{t('changeLanguage')}</Text>

            <TouchableOpacity
              style={[
                styles.dialogBtn,
                { backgroundColor: colors.bgElevated, borderColor: colors.border },
                supportLang === 'en' && { backgroundColor: colors.coralBg, borderColor: colors.coral },
              ]}
              onPress={() => {
                setSupportLang('en');
                setShowLangModal(false);
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.dialogBtnText, { color: supportLang === 'en' ? colors.coral : colors.text }]}>
                🇬🇧 English (Left-to-Right)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.dialogBtn,
                { backgroundColor: colors.bgElevated, borderColor: colors.border },
                supportLang === 'ar' && { backgroundColor: colors.coralBg, borderColor: colors.coral },
              ]}
              onPress={() => {
                setSupportLang('ar');
                setShowLangModal(false);
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.dialogBtnText, { color: supportLang === 'ar' ? colors.coral : colors.text }]}>
                🇪🇬 العربية (Right-to-Left RTL)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dialogCancelBtn}
              onPress={() => setShowLangModal(false)}
              activeOpacity={0.7}
            >
              <Text style={[styles.dialogCancelText, { color: colors.textMuted }]}>{t('close')}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Professional Sliding Menu Navigation Drawer */}
      <ProfessionalMenuModal
        visible={showMenuModal}
        onClose={() => setShowMenuModal(false)}
        onNavigate={navigateTo}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <GluestackUIProvider config={config}>
        <ThemeProvider>
          <LanguageProvider>
            <ProgressProvider>
              <GameModeProvider>
                <MainAppNavigator />
              </GameModeProvider>
            </ProgressProvider>
          </LanguageProvider>
        </ThemeProvider>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.bg,
  },
  mainContent: {
    flex: 1,
  },
  floatingDictFab: {
    position: 'absolute',
    bottom: 90,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: THEME.colors.bgCard,
    borderWidth: 2,
    borderColor: THEME.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 99,
  },
  floatingDictEmoji: {
    fontSize: 22,
  },
  floatingDockContainer: {
    position: 'absolute',
    bottom: 12,
    left: 14,
    right: 14,
    alignItems: 'center',
    zIndex: 1000,
    elevation: 20,
  },
  floatingDock: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#E8EEF5',
    paddingVertical: 8,
    paddingHorizontal: 6,
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1001,
    elevation: 20,
    ...THEME.shadows.dockShadow,
  },
  dockTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 20,
    marginHorizontal: 2,
  },
  dockTabActive: {
    backgroundColor: THEME.colors.coralBg,
  },
  iconWrapper: {
    padding: 3,
    marginBottom: 2,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperActive: {
    transform: [{ scale: 1.12 }],
  },
  dockLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.colors.textMuted,
  },
  dockLabelActive: {
    color: THEME.colors.coral,
    fontWeight: '800',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.lg,
    zIndex: 9999,
    elevation: 9999,
  },
  modalDialog: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.softCard,
    gap: 12,
  },
  dialogHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: THEME.colors.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  dialogBtn: {
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
  },
  dialogBtnActive: {
    backgroundColor: THEME.colors.coralBg,
    borderColor: THEME.colors.coral,
  },
  dialogBtnText: {
    color: THEME.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  dialogCancelBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  dialogCancelText: {
    color: THEME.colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
});

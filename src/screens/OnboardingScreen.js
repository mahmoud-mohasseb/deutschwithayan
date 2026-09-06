// ============================================================
// ONBOARDING SCREEN — DEUTSCH QUEST 🇩🇪
// Full-Screen Immersive Multi-Step Welcome with Falko Mascot:
// - Step 1: Who is playing? (👧 Kids 7+ vs 🧑 Teen vs 👨 Adult)
// - Step 2: Language Selection (🇬🇧 English vs 🇪🇬 Egyptian Arabic)
// - Step 3: Mascot Gift Box (+100 Coins, 5 Hearts, 10 Stars)
// Edge-to-edge, responsive across all mobile screen sizes,
// supporting both Dark & Light themes with safe area docking.
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppStore } from '../store/useAppStore';
import { useAppTheme } from '../context/ThemeContext';
import soundService from '../services/soundService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function OnboardingScreen({ onComplete }) {
  const { isDark, colors } = useAppTheme();

  const setSupportLang = useAppStore((s) => s.setSupportLang);
  const setAudienceMode = useAppStore((s) => s.setAudienceMode);
  const setIsOnboarded = useAppStore((s) => s.setIsOnboarded);
  const addCoins = useAppStore((s) => s.addCoins);
  const addStars = useAppStore((s) => s.addStars);

  const [step, setStep] = useState(1);
  const [selectedAge, setSelectedAge] = useState('kids'); // 'kids' | 'teen' | 'adult'
  const [selectedLang, setSelectedLang] = useState('en');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Continuous subtle mascot breathing
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.04,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const triggerStepTransition = (nextStep) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -20,
        duration: 140,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setStep(nextStep);
      slideAnim.setValue(20);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNextStep = () => {
    soundService.playSfx('tap');
    if (step < 3) {
      triggerStepTransition(step + 1);
    } else {
      // Complete Onboarding
      soundService.playSfx('victory');
      setSupportLang(selectedLang);
      setAudienceMode(selectedAge === 'kids' ? 'kids' : 'adult');
      addCoins(100);
      addStars(10);
      setIsOnboarded(true);
      if (onComplete) onComplete();
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      soundService.playSfx('tap');
      triggerStepTransition(step - 1);
    }
  };

  const isRTL = selectedLang === 'ar';

  return (
    <View
      style={[
        styles.fullScreen,
        { backgroundColor: isDark ? '#080E1C' : '#F4F7FB' },
      ]}
    >
      {/* Immersive Edge-to-Edge Gradient Backdrop */}
      <LinearGradient
        colors={
          isDark
            ? ['#080E1C', '#0B1528', '#111E38']
            : ['#FFFFFF', '#F0F5FC', '#E2ECF9']
        }
        style={StyleSheet.absoluteFill}
      />

      {/* Top Header Progress Bar */}
      <View style={styles.topBar}>
        <View style={styles.stepProgressTrack}>
          <View
            style={[
              styles.stepProgressBar,
              {
                width: `${(step / 3) * 100}%`,
                backgroundColor: colors.coral,
              },
            ]}
          />
        </View>

        <View style={styles.stepCounterRow}>
          <Text
            style={[
              styles.stepCounterText,
              { color: isDark ? '#94A3B8' : '#64748B' },
            ]}
          >
            {isRTL
              ? `الخطوة ${step} من ٣`
              : `Step ${step} of 3`}
          </Text>

          {step > 1 && (
            <TouchableOpacity onPress={handleBackStep} style={styles.backPill}>
              <Ionicons
                name={isRTL ? 'arrow-forward' : 'arrow-back'}
                size={16}
                color={colors.textSecondary}
              />
              <Text
                style={[
                  styles.backPillText,
                  { color: colors.textSecondary },
                ]}
              >
                {isRTL ? 'رجوع' : 'Back'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Main Scrollable Content Area */}
      <ScrollView
        style={styles.scrollableContent}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Mascot Section */}
        <Animated.View
          style={[
            styles.heroSection,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.mascotGlowWrapper}>
            <LinearGradient
              colors={['#FF6B55', '#F9B845', '#36C5A0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.mascotBorderGradient}
            >
              <Image
                source={require('../../assets/ayan_logo.png')}
                style={styles.mascotLogo}
                resizeMode="cover"
              />
            </LinearGradient>
          </View>

          <Text
            style={[
              styles.heroTitle,
              { color: isDark ? '#FFFFFF' : '#0F172A' },
            ]}
          >
            {isRTL ? 'ألماني مع أيان 🇩🇪' : 'Deutsch with Ayan'}
          </Text>

          <Text
            style={[
              styles.heroTagline,
              { color: isDark ? '#94A3B8' : '#475569' },
            ]}
          >
            {isRTL
              ? 'تعلم الألمانية مع أيان عبر ألعاب شيقة، كولينز 3000 والقراءة الصوتية للأطفال والكبار 🇪🇬'
              : 'Learn German with Ayan with fun games, Collins 3000 & voice reading for Kids & Adults!'}
          </Text>
        </Animated.View>

        {/* Animated Step Cards Area */}
        <Animated.View
          style={[
            styles.stepBody,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* STEP 1: Audience Selection */}
          {step === 1 && (
            <View
              style={[
                styles.stepCard,
                {
                  backgroundColor: isDark
                    ? 'rgba(15, 23, 42, 0.85)'
                    : 'rgba(255, 255, 255, 0.96)',
                  borderColor: isDark ? '#334155' : '#E2E8F0',
                },
              ]}
            >
              <Text
                style={[
                  styles.stepHeader,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}
              >
                {isRTL ? '١. من الذي سيلعب ويتعلم؟ 🎮' : '1. Wer spielt mit? 🎮'}
              </Text>
              <Text
                style={[
                  styles.stepSub,
                  { color: isDark ? '#94A3B8' : '#64748B' },
                ]}
              >
                {isRTL
                  ? 'اختر النمط المناسب لتخصيص الدروس والألعاب 🇪🇬'
                  : 'Select your learning path for customized games & lessons'}
              </Text>

              <View style={styles.optionsList}>
                {[
                  {
                    id: 'kids',
                    title: 'Kinder (7+)',
                    titleAr: 'للأطفال والأبطال الصغار (٧+) 🎈',
                    sub: 'Große bunte Tasten, Audio-Karten & bunte Spiele',
                    subAr: 'أزرار ملونة كبيرة، نطق صوتي تفاعلي وألعاب سهلة ومسلية',
                    emoji: '👧',
                    color: '#FF6B55',
                  },
                  {
                    id: 'teen',
                    title: 'Jugendliche',
                    titleAr: 'للشباب واليافعين 🎒',
                    sub: 'Spannende Quests, schnelle Mini-Games & Abenteuer',
                    subAr: 'تحديات لغوية سريعة، مغامرات شيقة ومسابقات',
                    emoji: '🧑',
                    color: '#7D72FA',
                  },
                  {
                    id: 'adult',
                    title: 'Erwachsene',
                    titleAr: 'للكبار والشهادات الأكاديمية 🎓',
                    sub: 'Strukturierte Grammatik, CEFR A1–C2 & Examen',
                    subAr: 'قواعد شاملة، مستويات CEFR من A1 إلى C2 والتحضير للامتحانات',
                    emoji: '👨',
                    color: '#10B981',
                  },
                ].map((item) => {
                  const isSelected = selectedAge === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.optionCard,
                        {
                          backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                          borderColor: isSelected ? item.color : isDark ? '#334155' : '#E2E8F0',
                        },
                        isSelected && {
                          backgroundColor: item.color + '15',
                          borderWidth: 2,
                        },
                      ]}
                      onPress={() => {
                        soundService.playSfx('tap');
                        setSelectedAge(item.id);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.optionEmoji}>{item.emoji}</Text>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.optionTitle,
                            { color: isDark ? '#FFFFFF' : '#0F172A' },
                            isSelected && { color: item.color },
                          ]}
                        >
                          {isRTL ? item.titleAr : item.title}
                        </Text>
                        <Text
                          style={[
                            styles.optionSub,
                            { color: isDark ? '#94A3B8' : '#64748B' },
                          ]}
                        >
                          {isRTL ? item.subAr : item.sub}
                        </Text>
                      </View>
                      {isSelected && (
                        <Ionicons name="checkmark-circle" size={24} color={item.color} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 2: Language Selection */}
          {step === 2 && (
            <View
              style={[
                styles.stepCard,
                {
                  backgroundColor: isDark
                    ? 'rgba(15, 23, 42, 0.85)'
                    : 'rgba(255, 255, 255, 0.96)',
                  borderColor: isDark ? '#334155' : '#E2E8F0',
                },
              ]}
            >
              <Text
                style={[
                  styles.stepHeader,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}
              >
                {isRTL ? '٢. لغة الشرح والترجمة 🗣️' : '2. Deine Erklärungssprache 🗣️'}
              </Text>
              <Text
                style={[
                  styles.stepSub,
                  { color: isDark ? '#94A3B8' : '#64748B' },
                ]}
              >
                {isRTL
                  ? 'اختر لغة الشرح المفضلة لمساعدتك في فهم القواعد'
                  : 'Choose your preferred explanation language'}
              </Text>

              <View style={styles.optionsList}>
                {/* English */}
                <TouchableOpacity
                  style={[
                    styles.optionCard,
                    {
                      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                      borderColor: selectedLang === 'en' ? '#3B82F6' : isDark ? '#334155' : '#E2E8F0',
                    },
                    selectedLang === 'en' && {
                      backgroundColor: 'rgba(59, 130, 246, 0.12)',
                      borderWidth: 2,
                    },
                  ]}
                  onPress={() => {
                    soundService.playSfx('tap');
                    setSelectedLang('en');
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.optionEmoji}>🇬🇧</Text>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.optionTitle,
                        { color: isDark ? '#FFFFFF' : '#0F172A' },
                        selectedLang === 'en' && { color: '#3B82F6' },
                      ]}
                    >
                      English
                    </Text>
                    <Text
                      style={[
                        styles.optionSub,
                        { color: isDark ? '#94A3B8' : '#64748B' },
                      ]}
                    >
                      Grammar comparisons, clear scaffolding & audio
                    </Text>
                  </View>
                  {selectedLang === 'en' && (
                    <Ionicons name="checkmark-circle" size={24} color="#3B82F6" />
                  )}
                </TouchableOpacity>

                {/* Egyptian Arabic (Strictly 🇪🇬) */}
                <TouchableOpacity
                  style={[
                    styles.optionCard,
                    {
                      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
                      borderColor: selectedLang === 'ar' ? '#FF6B55' : isDark ? '#334155' : '#E2E8F0',
                    },
                    selectedLang === 'ar' && {
                      backgroundColor: 'rgba(255, 107, 85, 0.12)',
                      borderWidth: 2,
                    },
                  ]}
                  onPress={() => {
                    soundService.playSfx('tap');
                    setSelectedLang('ar');
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.optionEmoji}>🇪🇬</Text>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.optionTitle,
                        { color: isDark ? '#FFFFFF' : '#0F172A' },
                        selectedLang === 'ar' && { color: '#FF6B55' },
                      ]}
                    >
                      العربية (المصرية) 🇪🇬
                    </Text>
                    <Text
                      style={[
                        styles.optionSub,
                        { color: isDark ? '#94A3B8' : '#64748B' },
                      ]}
                    >
                      شرح مبسط وواضح بلهجة مصرية محببة وترجمة دقيقة
                    </Text>
                  </View>
                  {selectedLang === 'ar' && (
                    <Ionicons name="checkmark-circle" size={24} color="#FF6B55" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* STEP 3: Welcome Gift Celebration */}
          {step === 3 && (
            <View
              style={[
                styles.stepCard,
                {
                  backgroundColor: isDark
                    ? 'rgba(15, 23, 42, 0.85)'
                    : 'rgba(255, 255, 255, 0.96)',
                  borderColor: isDark ? '#334155' : '#E2E8F0',
                },
              ]}
            >
              <Text
                style={[
                  styles.stepHeader,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}
              >
                {isRTL ? '٣. هديتك الترحيبية من فالكو! 🎁' : '3. Dein Willkommensgeschenk! 🎁'}
              </Text>
              <Text
                style={[
                  styles.stepSub,
                  { color: isDark ? '#94A3B8' : '#64748B' },
                ]}
              >
                {isRTL
                  ? 'رصيدك الابتدائي لبدء المغامرة وفتح المستويات'
                  : 'Your starting bundle to launch your German journey'}
              </Text>

              <View style={styles.giftBox}>
                <LinearGradient
                  colors={['#FEF3C7', '#FDE68A', '#F59E0B']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.giftGradient}
                >
                  <Text style={styles.giftEmoji}>🏆</Text>
                  <Text style={styles.giftTitle}>STARTER PACK</Text>

                  <View style={styles.giftItemsRow}>
                    <View style={styles.giftPill}>
                      <Text style={styles.giftPillText}>🪙 100 Münzen</Text>
                    </View>
                    <View style={styles.giftPill}>
                      <Text style={styles.giftPillText}>❤️ 5 Herzen</Text>
                    </View>
                    <View style={styles.giftPill}>
                      <Text style={styles.giftPillText}>⭐ 10 Sterne</Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Pinned Bottom CTA Bar with Safe-Area Spacing */}
      <View
        style={[
          styles.bottomDock,
          {
            backgroundColor: isDark
              ? 'rgba(8, 14, 28, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            borderTopColor: isDark ? 'rgba(51, 65, 85, 0.6)' : 'rgba(226, 232, 240, 0.8)',
          },
        ]}
      >
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={handleNextStep}
          activeOpacity={0.88}
        >
          <LinearGradient
            colors={
              step === 3
                ? ['#10B981', '#059669']
                : ['#FF6B55', '#E0533E']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.actionGradient}
          >
            <Text style={styles.actionBtnText}>
              {step === 3
                ? (isRTL ? 'ابدأ المغامرة الآن! 🚀' : "Los geht's! Abenteuer starten! 🚀")
                : (isRTL ? 'التالي ➔' : 'Weiter ➔')}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 12 : 8,
    paddingBottom: 8,
  },
  stepProgressTrack: {
    height: 4,
    backgroundColor: 'rgba(148, 163, 184, 0.25)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  stepProgressBar: {
    height: '100%',
    borderRadius: 2,
  },
  stepCounterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  stepCounterText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  backPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  backPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scrollableContent: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 12,
    width: '100%',
  },
  mascotGlowWrapper: {
    marginBottom: 10,
    shadowColor: '#FF6B55',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  mascotBorderGradient: {
    width: 108,
    height: 108,
    borderRadius: 54,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotLogo: {
    width: 102,
    height: 102,
    borderRadius: 51,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  heroTagline: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 18,
  },
  stepBody: {
    width: '100%',
    maxWidth: 480,
    marginTop: 8,
  },
  stepCard: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  stepHeader: {
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 4,
  },
  stepSub: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 14,
    lineHeight: 16,
  },
  optionsList: {
    gap: 10,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    gap: 12,
  },
  optionEmoji: {
    fontSize: 30,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  optionSub: {
    fontSize: 11.5,
    fontWeight: '600',
    lineHeight: 15,
  },
  giftBox: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 6,
  },
  giftGradient: {
    padding: 22,
    alignItems: 'center',
    gap: 10,
  },
  giftEmoji: {
    fontSize: 48,
  },
  giftTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#B45309',
    letterSpacing: 1.2,
  },
  giftItemsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 4,
  },
  giftPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  giftPillText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  bottomDock: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 14,
    borderTopWidth: 1,
  },
  actionBtn: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#FF6B55',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  actionGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});

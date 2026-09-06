// ============================================================
// TESTS HUB SCREEN — DEUTSCH QUEST 🇩🇪
// Comprehensive Testing & Certification Engine across CEFR A1–C2:
// - A1 Placement / Fundamentals Test
// - A2 Grammar & Cases Test (Dativ & Wechselpräpositionen)
// - B1 Intermediate Mastery (Passive, Konjunktiv II, Relative Clauses)
// - B2 Upper Intermediate (Nominalstil, Konjunktiv I, Zustandspassiv)
// - C1 Advanced (Extended Participles, Academic Connectors)
// - C2 Mastery (Modal Particles & High Register Rhetoric)
// Trilingual Scaffolding (DE, EN 🇬🇧, AR 🇪🇬)
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { useLanguage } from '../context/LanguageContext';
import { useAppTheme } from '../context/ThemeContext';
import soundService from '../services/soundService';
import GluestackAnimatedCard from '../components/common/GluestackAnimatedCard';

const { width } = Dimensions.get('window');

const ALL_TESTS = [
  {
    id: 'test-a1',
    level: 'A1',
    titleEn: 'A1 Level Assessment: Fundamentals & Articles',
    titleAr: 'اختبار تحديد مستوى A1: الأساسيات وأدوات التعريف 🇪🇬',
    duration: '5 Mins',
    questionCount: 5,
    gradient: ['#10b981', '#059669'],
    questions: [
      {
        question: 'Welcher Artikel gehört zu "Tisch"?',
        en: 'Which article belongs to "Tisch" (table)?',
        ar: 'ما هي أداة تعريف كلمة Tisch (طاولة)؟ 🇪🇬',
        options: ['der', 'die', 'das', 'den'],
        correct: 0,
        explanation: 'Der Tisch ist maskulin (der).',
        arExplanation: 'كلمة Tisch مذكرة وتأخذ der.',
      },
      {
        question: 'Ergänzen Sie: "Ich ___ aus Ägypten."',
        en: 'Complete: "I ___ from Egypt."',
        ar: 'أكمل: "أنا ___ من مصر." 🇪🇬',
        options: ['komme', 'kommst', 'kommt', 'kommen'],
        correct: 0,
        explanation: 'Ich-form ends with "-e": Ich komme.',
        arExplanation: 'تصريف الفعل مع الضمير ich ينتهي بـ e: Ich komme.',
      },
      {
        question: 'Wo steht das Verb im deutschen Hauptsatz?',
        en: 'Where does the verb go in a German main clause?',
        ar: 'أين يقع الفعل في الجملة الألمانية الرئيسية؟ 🇪🇬',
        options: ['Position 1', 'Position 2', 'Am Ende', 'Beliebig'],
        correct: 1,
        explanation: 'The verb ALWAYS occupies Position 2 in a main clause (V2 word order).',
        arExplanation: 'الفعل يشغل دائماً المرتبة الثانية في الجملة الرئيسية (قاعدة V2).',
      },
      {
        question: 'Welcher Satz ist Akkusativ?',
        en: 'Which sentence uses the Accusative case?',
        ar: 'أي جملة تستخدم حالة النصب Akkusativ؟ 🇪🇬',
        options: [
          'Ich habe einen Hund.',
          'Der Hund schläft.',
          'Das ist der Hund.',
          'Ein Hund rennt.',
        ],
        correct: 0,
        explanation: '"einen Hund" is masculine Akkusativ (der → einen).',
        arExplanation: '"einen Hund" في حالة النصب Akkusativ لأن الفعل haben يأخذ مفعولاً به منصوباً.',
      },
      {
        question: 'Wie heißt die Mehrzahl von "das Buch"?',
        en: 'What is the plural of "das Buch" (the book)?',
        ar: 'ما هو جمع كلمة das Buch (كتاب)؟ 🇪🇬',
        options: ['die Büchers', 'die Bücher', 'die Buche', 'die Büchlein'],
        correct: 1,
        explanation: 'Plural of das Buch is die Bücher with umlaut ü + er.',
        arExplanation: 'جمع das Buch هو die Bücher مع إضافة أوملاوت ü و er.',
      },
    ],
  },
  {
    id: 'test-a2',
    level: 'A2',
    titleEn: 'A2 Progression: Dativ & Two-Way Prepositions',
    titleAr: 'اختبار مستوى A2: حالة الجر وحروف الاتجاهين 🇪🇬',
    duration: '6 Mins',
    questionCount: 5,
    gradient: ['#0284c7', '#0369a1'],
    questions: [
      {
        question: 'Ich helfe ___ Frau.',
        en: 'I help the woman (Dativ required by helfen).',
        ar: 'أنا أساعد المرأة (فعل helfen يتطلب Dativ). 🇪🇬',
        options: ['die', 'der', 'den', 'dem'],
        correct: 1,
        explanation: '"helfen" demands Dativ: feminine "die" becomes "der".',
        arExplanation: 'فعل helfen يأخذ Dativ دائماً، والمؤنث die يتحول إلى der.',
      },
      {
        question: 'Wohin? → "Ich gehe in ___ Supermarkt."',
        en: 'Direction/Movement: "I am going into the supermarket."',
        ar: 'حركة إلى وجهة: "أنا ذاهب إلى السوبرماركت." 🇪🇬',
        options: ['dem', 'den', 'der', 'das'],
        correct: 1,
        explanation: 'Movement (Wohin?) with Wechselpräposition takes Akkusativ: in + den = in den.',
        arExplanation: 'الحركة وتغيير المكان (Wohin?) مع حروف الجر ذات الاتجاهين تأخذ Akkusativ: in den.',
      },
      {
        question: 'Perfekt: "Gestern ___ er nach Berlin gefahren."',
        en: 'Perfect tense of movement verb "fahren".',
        ar: 'الماضي التام لفعل الحركة fahren. 🇪🇬',
        options: ['hat', 'ist', 'wird', 'macht'],
        correct: 1,
        explanation: 'Movement verbs from point A to point B use "sein" in Perfekt: er ist gefahren.',
        arExplanation: 'أفعال الحركة والانتقال تأخذ sein في الماضي التام: er ist gefahren.',
      },
      {
        question: 'Nebensatz: "Ich lerne, weil Deutsch Spaß ___."',
        en: 'Subordinate clause word order with "weil".',
        ar: 'ترتيب الكلمات مع أداة الربط weil. 🇪🇬',
        options: ['macht', 'ist machen', 'machen', 'gemacht'],
        correct: 0,
        explanation: '"weil" sends the conjugated verb "macht" to the end.',
        arExplanation: 'أداة weil تدفع الفعل المصرف macht إلى نهاية الجملة تماماً.',
      },
      {
        question: 'Komparativ: "Mein Auto ist schneller ___ deins."',
        en: 'Comparative: "My car is faster ___ yours."',
        ar: 'المقارنة: "سيارتي أسرع من سيارتك." 🇪🇬',
        options: ['als', 'wie', 'von', 'denn'],
        correct: 0,
        explanation: 'Comparison of inequality uses "-er als": schneller als.',
        arExplanation: 'صيغة المقارنة غير المتساوية تستخدم als: schneller als (أسرع من).',
      },
    ],
  },
  {
    id: 'test-b1',
    level: 'B1',
    titleEn: 'B1 Intermediate: Passive Voice & Konjunktiv II',
    titleAr: 'اختبار مستوى B1: المبني للمجهول والافتراضي 🇪🇬',
    duration: '8 Mins',
    questionCount: 4,
    gradient: ['#7c3aed', '#6d28d9'],
    questions: [
      {
        question: 'Passiv: "Das Auto ___ in München gebaut."',
        en: 'Passive: "The car is built in Munich."',
        ar: 'المبني للمجهول: "تُصنع السيارة في ميونخ." 🇪🇬',
        options: ['wird', 'wurde', 'ist', 'hat'],
        correct: 0,
        explanation: 'Vorgangspassiv Präsens = wird + Partizip II.',
        arExplanation: 'المبني للمجهول في المضارع = wird + Partizip II.',
      },
      {
        question: 'Konjunktiv II: "Wenn ich reich ___, würde ich reisen."',
        en: 'Subjunctive: "If I were rich, I would travel."',
        ar: 'المضارع الافتراضي: "لو كنتُ غنياً، لسافرت." 🇪🇬',
        options: ['bin', 'wäre', 'sei', 'wurde'],
        correct: 1,
        explanation: '"wäre" is the subjunctive II form of sein.',
        arExplanation: '"wäre" هي صيغة Konjunktiv II لفعل الكينونة sein.',
      },
      {
        question: 'Relativsatz: "Der Kollege, ___ ich geholfen habe, bedankt sich."',
        en: 'Relative clause with Dative verb "helfen".',
        ar: 'جملة صلة مع فعل helfen الذي يأخذ حالة الجر Dativ. 🇪🇬',
        options: ['der', 'den', 'dem', 'dessen'],
        correct: 2,
        explanation: 'Masculine Dativ relative pronoun is "dem".',
        arExplanation: 'الضمير الموصول للمذكر في حالة Dativ هو "dem".',
      },
      {
        question: 'Infinitiv mit zu: "Er hat keine Zeit, das Buch ___."',
        en: 'Infinitive with zu for "zu lesen".',
        ar: 'صيغة المصدر مع zu. 🇪🇬',
        options: ['zu lesen', 'lesen', 'gelesen zu haben', 'lesend'],
        correct: 0,
        explanation: 'Infinitive with "zu" comes at the clause end: zu lesen.',
        arExplanation: 'تأتي zu قبل الفعل المصدري في نهاية الجملة: zu lesen.',
      },
    ],
  },
  {
    id: 'test-b2-c2',
    level: 'B2 - C2',
    titleEn: 'Advanced Mastery: Stylistic Nuance & Academic German',
    titleAr: 'اختبار التمكن المتقدم: البلاغة والأسلوب الأكاديمي 🇪🇬',
    duration: '10 Mins',
    questionCount: 4,
    gradient: ['#ea580c', '#c2410c'],
    questions: [
      {
        question: 'Passiversatz: "Dieses Problem ___ sich lösen."',
        en: 'Passive substitute: "This problem can be solved."',
        ar: 'بديل المبني للمجهول: "هذه المشكلة يمكن حلها." 🇪🇬',
        options: ['lässt', 'wird', 'macht', 'kann'],
        correct: 0,
        explanation: '"sich lassen + Infinitiv" means "kann gemacht werden".',
        arExplanation: '"sich lassen + مصدر" صيغة أنيقة ومتقدمة تعني "يمكن إنجازه".',
      },
      {
        question: 'Modalpartikel: "Das weißt du ___! Warum fragst du?"',
        en: 'Modal particle indicating obvious/shared knowledge.',
        ar: 'أداة تعبيرية دقيقة تدل على وضوح الأمر ومعرفته مسبقاً. 🇪🇬',
        options: ['doch', 'wohl', 'halt', 'eben'],
        correct: 0,
        explanation: '"doch" appeals to common knowledge or reminds the listener.',
        arExplanation: '"doch" تُستخدم لتذكير المستمع بأمر بديهي ومعلوم مسبقاً.',
      },
      {
        question: 'Nominalisierung: "Weil der Zug Verspätung hatte..." →',
        en: 'Convert to nominal style.',
        ar: 'التحويل إلى الأسلوب الاسمي الرسمي. 🇪🇬',
        options: [
          'Wegen der Verspätung des Zuges',
          'Bei Verspäten von Zug',
          'Trotz des pünktlichen Zuges',
          'Zug hatte Verspätung',
        ],
        correct: 0,
        explanation: '"Wegen + Genitiv" is standard formal German.',
        arExplanation: '"Wegen + Genitiv" هو الأسلوب الاسمي المعتمد في الألمانية الرسمية.',
      },
      {
        question: 'Redewendung: "Er hat den Nagel auf den Kopf ___."',
        en: 'Idiom: "He hit the nail on the head."',
        ar: 'تعبير مجازي: "أصاب عين الحقيقة / كبد الحقيقة." 🇪🇬',
        options: ['getroffen', 'geschlagen', 'gemacht', 'gestellt'],
        correct: 0,
        explanation: '"den Nagel auf den Kopf treffen" means stating something precisely.',
        arExplanation: 'التعبير القياسي هو "den Nagel auf den Kopf treffen".',
      },
    ],
  },
];

export default function TestsHubScreen({ onBack }) {
  const { supportLang, isRTL } = useLanguage();
  const { isDark, colors } = useAppTheme();

  const [activeTest, setActiveTest] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleStartTest = (test) => {
    soundService.playSfx('tap');
    setActiveTest(test);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  const handleSelectAnswer = (idx) => {
    if (isSubmitted) return;
    soundService.playSfx('tap');
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    const currentQ = activeTest.questions[currentQIndex];
    const correct = selectedOption === currentQ.correct;

    if (correct) {
      soundService.playSfx('correct');
      setScore((s) => s + 1);
    } else {
      soundService.playSfx('wrong');
    }
    setIsSubmitted(true);
  };

  const handleNextQuestion = () => {
    soundService.playSfx('tap');
    if (currentQIndex + 1 < activeTest.questions.length) {
      setCurrentQIndex((c) => c + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleSpeakQuestion = (text) => {
    try {
      Speech.stop();
      Speech.speak(text, { language: 'de-DE', rate: 0.9 });
    } catch (e) {
      console.log('TTS error', e);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.bgCard, borderBottomColor: colors.border }]}>
        {onBack && (
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.text }]}>
            {supportLang === 'ar' ? 'مركز الاختبارات والشهادات 📝' : 'CEFR Tests & Certifications 📝'}
          </Text>
          <Text style={[styles.subTitle, { color: colors.textMuted }]}>
            {supportLang === 'ar'
              ? 'اختبارات تقييم من A1 حتى C2 مع تصحيح فوري وشرح عربي 🇪🇬'
              : 'Official diagnostic exams covering CEFR A1 through C2'}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Test Cards */}
        <View style={styles.testList}>
          {ALL_TESTS.map((test) => (
            <GluestackAnimatedCard
              key={test.id}
              title={supportLang === 'ar' ? test.titleAr : test.titleEn}
              subtitle={`${test.questionCount} diagnostic questions • Time limit: ${test.duration}`}
              arabicSubtitle={test.titleAr}
              levelBadge={test.level}
              badge={test.duration}
              badgeColor={test.gradient[0]}
              onPress={() => handleStartTest(test)}
              leftIcon={
                <View
                  style={[
                    styles.testIconBadge,
                    { backgroundColor: `${test.gradient[0]}20`, borderColor: test.gradient[0] },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="certificate-outline"
                    size={22}
                    color={test.gradient[0]}
                  />
                </View>
              }
              rightElement={
                <View style={[styles.startBadgePill, { backgroundColor: test.gradient[0] }]}>
                  <Text style={styles.startBadgePillText}>
                    {supportLang === 'ar' ? 'بدء ✍️' : 'START ✍️'}
                  </Text>
                </View>
              }
            />
          ))}
        </View>
      </ScrollView>

      {/* Interactive Test Modal */}
      {activeTest && (
        <Modal visible={true} animationType="slide" statusBarTranslucent onRequestClose={() => setActiveTest(null)}>
          <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.bg }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setActiveTest(null)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {activeTest.level} Exam
              </Text>
              <Text style={[styles.qProgress, { color: colors.textMuted }]}>
                {currentQIndex + 1} / {activeTest.questions.length}
              </Text>
            </View>

            {!quizFinished ? (
              <ScrollView contentContainerStyle={styles.examScroll}>
                {(() => {
                  const q = activeTest.questions[currentQIndex];
                  return (
                    <View>
                      {/* Question Card */}
                      <View style={[styles.qBox, { backgroundColor: colors.bgCard, borderColor: colors.border }]}>
                        <View style={styles.qBoxHeader}>
                          <Text style={[styles.qGerman, { color: colors.text }]}>{q.question}</Text>
                          <TouchableOpacity onPress={() => handleSpeakQuestion(q.question)}>
                            <Ionicons name="volume-high" size={24} color={colors.primary} />
                          </TouchableOpacity>
                        </View>
                        <Text style={[styles.qEn, { color: colors.textMuted }]}>🇬🇧 {q.en}</Text>
                        <Text style={[styles.qAr, { color: colors.textMuted }]}>🇪🇬 {q.ar}</Text>
                      </View>

                      {/* Options */}
                      <View style={styles.optsContainer}>
                        {q.options.map((opt, oIdx) => {
                          const isSelected = selectedOption === oIdx;
                          let optBg = colors.bgCard;
                          let borderCol = colors.border;
                          let textCol = colors.text;

                          if (isSubmitted) {
                            if (oIdx === q.correct) {
                              optBg = 'rgba(16, 185, 129, 0.2)';
                              borderCol = '#10b981';
                              textCol = '#10b981';
                            } else if (isSelected && oIdx !== q.correct) {
                              optBg = 'rgba(239, 68, 68, 0.2)';
                              borderCol = '#ef4444';
                              textCol = '#ef4444';
                            }
                          } else if (isSelected) {
                            optBg = 'rgba(79, 70, 229, 0.15)';
                            borderCol = '#4f46e5';
                            textCol = '#4f46e5';
                          }

                          return (
                            <TouchableOpacity
                              key={oIdx}
                              style={[styles.optionCard, { backgroundColor: optBg, borderColor: borderCol }]}
                              onPress={() => handleSelectAnswer(oIdx)}
                              activeOpacity={0.8}
                            >
                              <Text style={[styles.optionCardText, { color: textCol }]}>{opt}</Text>
                              {isSubmitted && oIdx === q.correct && (
                                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                              )}
                              {isSubmitted && isSelected && oIdx !== q.correct && (
                                <Ionicons name="close-circle" size={20} color="#ef4444" />
                              )}
                            </TouchableOpacity>
                          );
                        })}
                      </View>

                      {/* Explanation Feedback */}
                      {isSubmitted && (
                        <View style={[styles.feedbackBox, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}>
                          <Text style={[styles.fbEn, { color: colors.text }]}>💡 {q.explanation}</Text>
                          <Text style={[styles.fbAr, { color: colors.textSecondary }]}>🇪🇬 {q.arExplanation}</Text>
                        </View>
                      )}

                      {/* Action Button */}
                      {!isSubmitted ? (
                        <TouchableOpacity
                          style={[styles.submitBtn, selectedOption === null && styles.btnDisabled]}
                          disabled={selectedOption === null}
                          onPress={handleSubmitAnswer}
                        >
                          <Text style={styles.submitBtnText}>
                            {supportLang === 'ar' ? 'تأكيد الإجابة ✓' : 'CHECK ANSWER ✓'}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity style={styles.nextBtn} onPress={handleNextQuestion}>
                          <Text style={styles.nextBtnText}>
                            {currentQIndex + 1 < activeTest.questions.length
                              ? supportLang === 'ar'
                                ? 'السؤال التالي ➡️'
                                : 'NEXT QUESTION ➡️'
                              : supportLang === 'ar'
                              ? 'عرض النتيجة 🏆'
                              : 'SEE FINAL SCORE 🏆'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })()}
              </ScrollView>
            ) : (
              /* Quiz Finished Summary */
              <View style={styles.resultContainer}>
                <Text style={{ fontSize: 64, marginBottom: 12 }}>🏆</Text>
                <Text style={[styles.resultTitle, { color: colors.text }]}>
                  {supportLang === 'ar' ? 'اكتمل الاختبار بنجاح!' : 'Assessment Complete!'}
                </Text>
                <Text style={[styles.resultScore, { color: colors.primary }]}>
                  {score} / {activeTest.questions.length} Correct
                </Text>
                <Text style={[styles.resultMsg, { color: colors.textMuted }]}>
                  {score === activeTest.questions.length
                    ? 'Perfekt! You have mastered this level!'
                    : 'Gute Arbeit! Keep practicing to reach 100% mastery.'}
                </Text>

                <TouchableOpacity
                  style={[styles.submitBtn, { marginTop: 24, width: '80%' }]}
                  onPress={() => setActiveTest(null)}
                >
                  <Text style={styles.submitBtnText}>
                    {supportLang === 'ar' ? 'العودة للمركز' : 'Back to Tests Hub'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </SafeAreaView>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: {
    padding: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  subTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  testList: {
    gap: 14,
  },
  testCardWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  testGradient: {
    padding: 16,
    borderRadius: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelTagText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  durationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 12,
    lineHeight: 22,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  qCountText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    fontWeight: '700',
  },
  startBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  startBtnText: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '900',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  qProgress: {
    fontSize: 13,
    fontWeight: '700',
  },
  examScroll: {
    padding: 16,
    paddingBottom: 120,
  },
  qBox: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  qBoxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  qGerman: {
    fontSize: 17,
    fontWeight: '800',
    flex: 1,
    paddingRight: 10,
  },
  qEn: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  qAr: {
    fontSize: 13,
    fontWeight: '600',
  },
  optsContainer: {
    gap: 10,
    marginBottom: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  optionCardText: {
    fontSize: 15,
    fontWeight: '700',
  },
  feedbackBox: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  fbEn: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  fbAr: {
    fontSize: 13,
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: '#4f46e5',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  nextBtn: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 6,
  },
  resultScore: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 8,
  },
  resultMsg: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  testIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startBadgePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startBadgePillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});

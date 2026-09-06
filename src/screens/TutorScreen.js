// ============================================================
// AI GERMAN TUTOR SCREEN
// Answers grammar questions in English or Arabic, adapts to CEFR level (A1 simple vs C1 advanced),
// and provides contextual German examples.
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { THEME } from '../styles/theme';
import { useLanguage } from '../context/LanguageContext';
import { useAppTheme } from '../context/ThemeContext';
import soundService from '../services/soundService';
import AudioPronounceButton from '../components/common/AudioPronounceButton';
import SpecialIcon from '../components/common/SpecialIcon';

import dictionaryData from '../../data/dictionary.json';
import grammarGuideData from '../../data/grammarGuide.json';

export default function TutorScreen() {
  const { supportLang, cefrLevel, isRTL, t } = useLanguage();
  const { isDark, colors } = useAppTheme();
  const [inputQuery, setInputQuery] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const scrollViewRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'tutor',
      text: {
        en: `Hallo! I am your German AI Tutor. Type ANY German word, grammar question, or sentence to get instant translations, articles (der/die/das), cases (Akkusativ/Dativ), and spoken audio. Currently assisting you at ${cefrLevel} level!`,
        ar: `مرحباً! أنا معلمك الذكي للغة الألمانية. اكتب أي كلمة، قاعدة، أو جملة لمعرفة معناها وأداتها (der/die/das) وإعرابها (Akkusativ/Dativ) ونطقها الصوتي. أساعدك حالياً في مستوى ${cefrLevel}!`,
      },
      germanExample: 'Frag mich: "der Tisch" oder "Warum heißt es einen und nicht ein?"',
    },
  ]);

  // Handle keyboard show/hide to keep input visible and adapt bottom offset
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, () => {
      setIsKeyboardVisible(true);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const quickPrompts = [
    {
      en: 'Why is it "einen" and not "ein"?',
      ar: 'لماذا نقول einen وليس ein؟',
    },
    {
      en: 'What is the article for Tisch and Stuhl?',
      ar: 'ما هي أداة Tisch و Stuhl؟',
    },
    {
      en: 'Explain word order after "weil"',
      ar: 'اشرح لي ترتيب الكلمات بعد weil',
    },
    {
      en: 'When do I use "du" vs "Sie"?',
      ar: 'متى أستخدم du ومتى أستخدم Sie؟',
    },
    {
      en: 'How do separable verbs work?',
      ar: 'كيف تعمل الأفعال القابلة للفصل (Trennbare Verben)؟',
    },
  ];

  const handleSend = (queryText) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend) return;

    soundService.playSfx('tap');

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: { en: textToSend, ar: textToSend },
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 80);

    // Generate intelligent tutor answer tailored to user inquiry
    setTimeout(() => {
      soundService.playSfx('correct');
      const lower = textToSend.toLowerCase();
      let replyEn = '';
      let replyAr = '';
      let exampleDe = '';

      // 1. Search trilingual dictionary for exact or partial word lookup
      const dictMatch = Array.isArray(dictionaryData)
        ? dictionaryData.find((item) => {
            const deMatch = item.german?.toLowerCase().includes(lower) || item.base?.toLowerCase() === lower;
            const enMatch = item.english?.toLowerCase() === lower || item.english?.toLowerCase().includes(lower);
            const arMatch = item.arabic?.includes(textToSend);
            return deMatch || enMatch || arMatch;
          })
        : null;

      if (dictMatch) {
        replyEn = `You asked about "${textToSend}": In German, "${dictMatch.german}" (${dictMatch.english}) is a ${dictMatch.gender || 'noun'}.
• Article: ${dictMatch.article || 'N/A'}
• Plural: ${dictMatch.plural || 'N/A'}
• Nominativ: ${dictMatch.declension?.nominativ || dictMatch.german}
• Akkusativ: ${dictMatch.declension?.akkusativ || dictMatch.german}
• Dativ: ${dictMatch.declension?.dativ || dictMatch.german}
• Meaning in Arabic: ${dictMatch.arabic} 🇪🇬`;

        replyAr = `بخصوص ما كتبته "${textToSend}": في الألمانية، "${dictMatch.german}" تعني (${dictMatch.arabic} 🇪🇬):
• أداة التعريف: ${dictMatch.article || 'بدون'} (${dictMatch.gender === 'masculine' ? 'مذكر' : dictMatch.gender === 'feminine' ? 'مؤنث' : 'محايد'})
• صيغة الجمع: ${dictMatch.plural || 'غير محدد'}
• في حالة النصب (Akkusativ): ${dictMatch.declension?.akkusativ || dictMatch.german}
• في حالة الجر (Dativ): ${dictMatch.declension?.dativ || dictMatch.german}
• المعنى بالإنجليزية: ${dictMatch.english}`;

        exampleDe = dictMatch.example?.de || `${dictMatch.german} ist wichtig.`;
      }
      // 2. Articles & Cases (Akkusativ, Dativ, Genitiv, Nominativ)
      else if (lower.includes('einen') || lower.includes('ein') || lower.includes('artikel') || lower.includes('أداة') || lower.includes('نكرة')) {
        replyEn = `Regarding your query "${textToSend}": In German, masculine nouns (der Hund, der Tisch, der Kaffee) change from "ein" to "einen" in the Akkusativ (direct object) case. Feminine (eine) and neuter (ein) remain completely unchanged!`;
        replyAr = `بخصوص ما كتبته "${textToSend}": في الألمانية، أسماء المذكر (مثل der Hund, der Tisch) تتغير أداتها من "ein" إلى "einen" عند وقوعها مفعولاً به (حالة النصب Akkusativ). أما المؤنث (eine) والمحايد (ein) فلا يتغيران!`;
        exampleDe = 'Ich habe einen Hund und einen Tisch. (Maskulin Akkusativ: der -> den -> einen)';
      } else if (lower.includes('dativ') || lower.includes('جر') || lower.includes('مجرور') || lower.includes('mit') || lower.includes('nach') || lower.includes('zu')) {
        replyEn = `Regarding "${textToSend}": The Dativ case indicates the indirect object or follows Dativ prepositions (aus, bei, mit, nach, seit, von, zu). Articles change: der -> dem, die -> der, das -> dem, die (Pl.) -> den + n.`;
        replyAr = `بخصوص "${textToSend}": حالة الجر (Dativ) تأتي بعد أفعال معينة وحروف الجر (aus, bei, mit, nach, von, zu). تتغير الأدوات: der -> dem، die -> der، das -> dem، die (الجمع) -> den + n.`;
        exampleDe = 'Ich fahre mit dem Bus zur Arbeit. (mit + Dativ)';
      } else if (lower.includes('akkusativ') || lower.includes('نصب') || lower.includes('مفعول')) {
        replyEn = `Regarding "${textToSend}": The Akkusativ case marks the direct object receiving the action. ONLY masculine articles inflect: der -> den, ein -> einen. Feminine (die/eine), neuter (das/ein), and plural (die) stay identical to Nominativ!`;
        replyAr = `بخصوص "${textToSend}": حالة النصب (Akkusativ) تعبر عن المفعول به المباشر. المذكر فقط هو الذي يتغير: der -> den و ein -> einen. بينما المؤنث والمحايد والجمع يبقون كما هم!`;
        exampleDe = 'Der Mann trinkt den heißen Tee. (Akkusativ Maskulin)';
      } else if (lower.includes('genitiv') || lower.includes('مضاف') || lower.includes('إضافة') || lower.includes('des') || lower.includes('der')) {
        replyEn = `Regarding "${textToSend}": The Genitiv case indicates possession or follows prepositions like (wegen, während, trotz). Articles: des (+s/es) for masculine and neuter; der for feminine and plural.`;
        replyAr = `بخصوص "${textToSend}": حالة الإضافة (Genitiv) تدل على الملكية أو تأتي بعد حروف مثل (wegen, während, trotz). الأدوات: des (مع إضافة s/es للاسم المذكر والمحايد) و der للمؤنث والجمع.`;
        exampleDe = 'Das Auto des Vaters steht vor der Tür. (Genitiv Maskulin)';
      } else if (lower.includes('weil') || lower.includes('dass') || lower.includes('obwohl') || lower.includes('لأن') || lower.includes('أن')) {
        replyEn = `Regarding "${textToSend}": Subordinating conjunctions like "weil" (because) and "dass" (that) introduce a subordinate clause (Nebensatz). The conjugated verb MUST be placed at the very END of the clause!`;
        replyAr = `بخصوص "${textToSend}": أدوات الربط الفرعية مثل "weil" (لأن) و "dass" (أن) تدشن جملة فرعية (Nebensatz). القاعدة الإلزامية: الفعل المتصرف ينتقل إلى نهاية الجملة تماماً!`;
        exampleDe = 'Ich lerne Deutsch, weil es mir Spaß MACHT. (Verb am Ende)';
      } else if (lower.includes('du') || lower.includes('sie') || lower.includes('أنت') || lower.includes('حضرتك')) {
        replyEn = `Regarding "${textToSend}": "du" is informal (used for close friends, family, children). "Sie" (always capitalized) is formal (used for professionals, doctors, strangers, elders).`;
        replyAr = `بخصوص "${textToSend}": "du" هي صيغة غير رسمية للمقربين والأصدقاء والأطفال. أما "Sie" (بحرف كبير دائماً) فهي صيغة الاحترام والتعامل الرسمي مع الغرباء ورؤساء العمل.`;
        exampleDe = 'Wie heißt du? (Freunde) vs. Wie heißen Sie? (Formell)';
      } else if (lower.includes('trennbare') || lower.includes('verb') || lower.includes('فعل') || lower.includes('فصل')) {
        replyEn = `Regarding "${textToSend}": Separable verbs (trennbare Verben like aufstehen, einkaufen) split in present tense: the prefix goes to the very END of the main clause!`;
        replyAr = `بخصوص "${textToSend}": الأفعال المنفصلة (مثل aufstehen, anrufen) تنفصل في المضارع: يبقى أصل الفعل في المركز الثاني، وتذهب البادئة إلى نهاية الجملة!`;
        exampleDe = 'Ich stehe jeden Morgen um 7 Uhr AUF. (aufstehen)';
      } else if (lower.includes('danke') || lower.includes('شكرا') || lower.includes('thank')) {
        replyEn = `You wrote "${textToSend}": "Danke!" or "Vielen Dank!" means "Thank you very much!". To reply politely, say "Bitte sehr!" or "Gern geschehen!" (You're welcome!).`;
        replyAr = `كتبت "${textToSend}": كلمة "Danke!" أو "Vielen Dank!" تعني "شكراً جزيلاً!". والرد الرسمي المهذب عليها هو "Bitte sehr!" أو "Gern geschehen!" (عفواً / على الرحب والسعة!).`;
        exampleDe = 'Vielen Dank für Ihre Hilfe! — Bitte sehr, gern geschehen!';
      } else if (lower.includes('wie geht') || lower.includes('how are') || lower.includes('عامل ايه') || lower.includes('كيف حالك')) {
        replyEn = `You asked "${textToSend}": In German, ask "Wie geht es dir?" (informal) or "Wie geht es Ihnen?" (formal). You reply with "Mir geht es gut, danke!" (I'm doing well, thanks!).`;
        replyAr = `سألت "${textToSend}": للسؤال عن الحال بالألمانية، نقول "Wie geht es dir؟" (للأصدقاء) أو "Wie geht es Ihnen؟" (للرسميات). والرد: "Mir geht es gut, danke!" (أنا بخير، شكراً!).`;
        exampleDe = 'Wie geht es Ihnen? — Mir geht es sehr gut, danke!';
      } else if (lower.includes('hallo') || lower.includes('guten tag') || lower.includes('hi') || lower.includes('مرحبا') || lower.includes('أهلا') || lower.includes('سلام')) {
        replyEn = `Hallo! Schön, dass du da bist! I see what you wrote: "${textToSend}". How can I help you improve your German today? Feel free to type any vocabulary word, grammar question, or sentence!`;
        replyAr = `أهلاً بك! سررت بتواجدك هنا! قرأت رسالتك: "${textToSend}". كيف يمكنني مساعدتك اليوم في تحسين لغتك الألمانية؟ اكتب أي كلمة أو قاعدة أو جملة تريد شرحها!`;
        exampleDe = 'Guten Tag! Wie kann ich dir heute beim Deutschlernen helfen?';
      } else {
        replyEn = `I received what you wrote: "${textToSend}". In German (${cefrLevel} level), every sentence follows key structural rules:
1. The conjugated verb is always in position 2 in standard main clauses.
2. Nouns require gender articles (der = masculine, die = feminine, das = neuter).
3. The case (Nominativ, Akkusativ, Dativ, Genitiv) changes according to the verb or preposition.`;
        replyAr = `لقد استلمت وفهمت ما كتبته: "${textToSend}". في اللغة الألمانية لمستوى (${cefrLevel})، تذكر القواعد الأساسية التالية:
١. الفعل المتصرف يأتي دائماً في المركز الثاني في الجملة الرئيسية.
٢. كل اسم يحتاج أداة تعريف (der للمذكر، die للمؤنث، das للمحايد).
٣. الإعراب يتغير بحسب الفعل وحروف الجر (Nominativ, Akkusativ, Dativ).`;
        exampleDe = `Ich übe Deutsch mit "${textToSend}".`;
      }

      const tutorMsg = {
        id: Date.now() + 1,
        sender: 'tutor',
        text: { en: replyEn, ar: replyAr },
        germanExample: exampleDe,
      };

      setMessages((prev) => [...prev, tutorMsg]);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 500);
  };

  const styles = React.useMemo(() => getStyles(colors, isDark, isKeyboardVisible), [colors, isDark, isKeyboardVisible]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Messages Scroll Area */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatScroll}
        contentContainerStyle={styles.chatContent}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg) => {
          const isTutor = msg.sender === 'tutor';
          return (
            <View
              key={msg.id}
              style={[
                styles.bubbleWrapper,
                isTutor ? styles.tutorWrapper : styles.userWrapper,
                { flexDirection: isRTL ? 'row-reverse' : 'row' },
              ]}
            >
              {isTutor && <Text style={styles.tutorAvatar}>🤖</Text>}

              <View
                style={[
                  styles.messageBubble,
                  isTutor ? styles.tutorBubble : styles.userBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    isTutor ? styles.tutorText : styles.userText,
                    supportLang === 'ar' && isTutor && styles.arTextAlign,
                  ]}
                >
                  {supportLang === 'ar' ? msg.text.ar : msg.text.en}
                </Text>

                {msg.germanExample && (
                  <View style={styles.exampleSnippet}>
                    <Text style={styles.exampleSnippetText}>🇩🇪 {msg.germanExample}</Text>
                    <AudioPronounceButton text={msg.germanExample} size={16} />
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Suggested Quick Prompts */}
      <View style={styles.quickPromptsRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promptsContent}>
          {quickPrompts.map((p, idx) => {
            const promptText = supportLang === 'ar' ? p.ar : p.en;
            return (
              <TouchableOpacity
                key={idx}
                style={styles.quickPromptChip}
                onPress={() => handleSend(promptText)}
              >
                <Text style={styles.quickPromptText}>💡 {promptText}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Input Bar */}
      <View style={[styles.inputBar, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TextInput
          style={[
            styles.inputField,
            {
              textAlign: isRTL ? 'right' : 'left',
              color: colors.text,
              backgroundColor: colors.bgElevated,
              borderColor: colors.border,
            },
          ]}
          placeholder={t('askTutor')}
          placeholderTextColor={colors.textMuted}
          value={inputQuery}
          onChangeText={setInputQuery}
          onSubmitEditing={() => handleSend()}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.sendButton} onPress={() => handleSend()}>
          <Text style={styles.sendButtonText}>{t('send')}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const getStyles = (colors, isDark, isKeyboardVisible) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    chatScroll: {
      flex: 1,
    },
    chatContent: {
      padding: THEME.spacing.md,
      gap: 12,
      paddingBottom: 20,
    },
    bubbleWrapper: {
      alignItems: 'flex-start',
      gap: 8,
    },
    tutorWrapper: {
      justifyContent: 'flex-start',
    },
    userWrapper: {
      justifyContent: 'flex-end',
    },
    tutorAvatar: {
      fontSize: 24,
      marginTop: 4,
    },
    messageBubble: {
      maxWidth: '82%',
      padding: 12,
      borderRadius: THEME.radius.md,
      gap: 6,
    },
    tutorBubble: {
      backgroundColor: colors.bgCard,
      borderWidth: 1,
      borderColor: colors.border,
      borderTopLeftRadius: 2,
    },
    userBubble: {
      backgroundColor: colors.primary,
      borderTopRightRadius: 2,
    },
    messageText: {
      fontSize: 14,
      lineHeight: 20,
    },
    tutorText: {
      color: colors.text,
    },
    userText: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
    arTextAlign: {
      textAlign: 'right',
      fontSize: 15,
    },
    exampleSnippet: {
      backgroundColor: 'rgba(245, 158, 11, 0.12)',
      padding: 8,
      borderRadius: THEME.radius.sm,
      borderLeftWidth: 3,
      borderLeftColor: colors.accent,
    },
    exampleSnippetText: {
      color: colors.accentDark || colors.accent,
      fontSize: 13,
      fontWeight: '700',
    },
    quickPromptsRow: {
      backgroundColor: colors.bgCard,
      paddingVertical: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    promptsContent: {
      paddingHorizontal: THEME.spacing.md,
      gap: 8,
    },
    quickPromptChip: {
      backgroundColor: colors.bgElevated,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: THEME.radius.full,
      borderWidth: 1,
      borderColor: colors.border,
    },
    quickPromptText: {
      color: colors.primaryLight || colors.primary,
      fontSize: 12,
      fontWeight: '600',
    },
    inputBar: {
      backgroundColor: colors.bgCard,
      padding: THEME.spacing.md,
      paddingBottom: isKeyboardVisible ? 10 : 14,
      marginBottom: isKeyboardVisible ? 0 : 72,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      alignItems: 'center',
      gap: 8,
    },
    inputField: {
      flex: 1,
      backgroundColor: colors.bgElevated,
      borderRadius: THEME.radius.md,
      paddingHorizontal: 12,
      height: 44,
      color: colors.text,
      fontSize: 14,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sendButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      height: 44,
      borderRadius: THEME.radius.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonText: {
      color: '#FFFFFF',
      fontWeight: '700',
      fontSize: 14,
    },
  });

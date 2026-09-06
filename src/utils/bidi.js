// ============================================================
// BI-DIRECTIONAL (BiDi) & RTL TEXT HELPERS
// Ensures German LTR text inside Arabic RTL sentences
// is preserved without punctuation flips or word scrambling.
// ============================================================

/**
 * Wraps German text in Unicode Left-to-Right Isolate (LQI) characters.
 * \u2066 = LEFT-TO-RIGHT ISOLATE
 * \u2069 = POP DIRECTIONAL ISOLATE
 */
export function isolateGerman(text) {
  if (!text) return '';
  return `\u2066${text}\u2069`;
}

/**
 * Normalizes text for RTL rendering.
 */
export function bidiText(germanText, explanationText, isRTL) {
  if (!isRTL) return `${germanText} — ${explanationText}`;
  return `${explanationText} — ${isolateGerman(germanText)}`;
}

/**
 * Formats a grammatical term into a 3-language triplet.
 */
export const GRAMMAR_TERM_TRIPLETS = {
  Nominativ: {
    de: 'Nominativ',
    en: 'Nominative case',
    ar: 'حالة الرفع (الفاعل)',
    role: 'Subjekt / Subject / الفاعل',
  },
  Akkusativ: {
    de: 'Akkusativ',
    en: 'Accusative case',
    ar: 'حالة النصب (المفعول به المباشر)',
    role: 'Direktes Objekt / Direct Object / المفعول به المباشر',
  },
  Dativ: {
    de: 'Dativ',
    en: 'Dative case',
    ar: 'حالة الجر (المفعول به غير المباشر)',
    role: 'Indirektes Objekt / Indirect Object / المفعول به غير المباشر',
  },
  Genitiv: {
    de: 'Genitiv',
    en: 'Genitive case',
    ar: 'حالة الإضافة (الملكية)',
    role: 'Besitz / Possession / المضاف إليه',
  },
};

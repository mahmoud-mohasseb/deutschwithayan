// ============================================================
// DEUTSCH QUEST — GAME SYSTEM DATA (100% JSON-Driven)
// Powered by Curated Game Data + Enriched Collins 3000 Corpus
// 1. Memory Pairs (MemorySpiel)
// 2. Kids Adventure (Animal, Color & Family Explorer)
// 3. Article Battle (der / die / das Blitz)
// 4. Case Detective (Nominativ / Akkusativ / Dativ / Genitiv)
// 5. Sentence Builder (word order / V2 rule)
// 6. Verb Race (Speed Conjugation Sprint)
// 7. Grammar Boss Battle (Error Correction)
// 8. Audio Detective (Listening Comprehension)
// ============================================================

import gamesData from './gamesData.json';
import {
  COLLINS_A1,
  COLLINS_A2,
  COLLINS_B1,
  COLLINS_B2,
  ALL_COLLINS_WORDS,
  getWordsByLevel,
  getWordsByCategory,
  searchCollins,
} from './collins/index';

// Category icon map for Collins game entries
const CATEGORY_EMOJIS = {
  'the essentials': '🌟',
  'the basics': '📖',
  'family and friends': '👨‍👩‍👧‍👦',
  'work': '💼',
  'time': '⏰',
  'days, months, and seasons': '📅',
  'transport': '🚗',
  'car': '🚘',
  'driving': '🛣️',
  'bus': '🚌',
  'bicycle': '🚲',
  'rail travel': '🚆',
  'air travel': '✈️',
  'ferry and boat travel': '⛴️',
  'in the home': '🏡',
  'the entrance': '🚪',
  'the lounge': '🛋️',
  'the kitchen': '🍳',
  'the dining room': '🍽️',
  'the bedroom': '🛏️',
  'the bathroom': '🚿',
  'the garden': '🌻',
  'housework': '🧹',
  'at the shops': '🛍️',
  'market': '🛒',
  'fruit and vegetables': '🍎',
  'fishmonger’s': '🐟',
  'butcher’s': '🥩',
  'cheese': '🧀',
  'pharmacy': '💊',
  'clothing and footwear': '👗',
  'day-to-day': '☕',
  'eating out': '🍝',
  'fast food': '🍔',
  'education': '🎓',
  'the bank': '🏦',
  'leisure': '🏖️',
  'hotel': '🏨',
  'the beach': '🏄',
  'music': '🎵',
  'photography': '📷',
  'games': '🎲',
  'sport': '⚽',
  'football': '⚽',
  'basketball': '🏀',
  'winter sports': '⛷️',
  'athletics': '🏃',
  'health': '🩺',
  'the body': '🧍',
  'the skeleton': '🦴',
  'illness': '🤒',
  'the hospital': '🏥',
  'planet earth': '🌍',
  'domestic animals and birds': '🐶',
  'birds': '🦜',
  'flowers, plants, and trees': '🌲',
  'land, sea, and sky': '🌊',
  'celebrations and festivals': '🎉',
  'carnival': '🎭',
};

// Convert Collins nouns with articles to Article Battle items
export const COLLINS_ARTICLE_ITEMS = (ALL_COLLINS_WORDS || [])
  .filter(w => w.article && ['der', 'die', 'das'].includes(w.article) && w.base && w.base.length > 1)
  .map((w, idx) => ({
    id: `col-ab-${idx + 1}`,
    word: w.base,
    correct: w.article,
    emoji: CATEGORY_EMOJIS[w.category] || (w.article === 'der' ? '🔷' : w.article === 'die' ? '🔴' : '🟢'),
    translation: {
      en: w.english,
      ar: w.arabic,
    },
    rule: {
      de: w.explanation?.en || `Artikel ist ${w.article}.`,
      en: w.explanation?.en || `Article is ${w.article}.`,
      ar: w.explanation?.ar || `أداة التعريف هي ${w.article}.`,
    },
    level: w.level || 'A1',
  }));

// Combined Article Battle items
export const ARTICLE_BATTLE_ITEMS = [
  ...(gamesData.ARTICLE_BATTLE_ITEMS || []),
  ...COLLINS_ARTICLE_ITEMS,
];

// Convert Collins vocabulary to Memory items
export const COLLINS_MEMORY_ITEMS = (ALL_COLLINS_WORDS || [])
  .filter(w => w.german && w.arabic && !w.arabic.includes('(اسم)') && w.arabic.length < 30)
  .map((w, idx) => ({
    id: `col-m-${idx + 1}`,
    german: w.german,
    english: w.english,
    arabic: w.arabic,
    emoji: CATEGORY_EMOJIS[w.category] || '💡',
    category: w.category || 'general',
    level: w.level || 'A1',
  }));

// Combined Memory Pairs items
export const MEMORY_PAIRS_ITEMS = [
  ...(gamesData.MEMORY_PAIRS_ITEMS || []),
  ...COLLINS_MEMORY_ITEMS,
];

export const KIDS_FUN_ITEMS = gamesData.KIDS_FUN_ITEMS || [];
export const CASE_DETECTIVE_ITEMS = gamesData.CASE_DETECTIVE_ITEMS || [];
export const SENTENCE_BUILDER_ITEMS = gamesData.SENTENCE_BUILDER_ITEMS || [];
export const VERB_RACE_ITEMS = gamesData.VERB_RACE_ITEMS || [];
export const GRAMMAR_BOSS_ENCOUNTERS = gamesData.GRAMMAR_BOSS_ENCOUNTERS || [];
export const AUDIO_DETECTIVE_ITEMS = gamesData.AUDIO_DETECTIVE_ITEMS || [];
export const OBJECT_HUNT_ITEMS = gamesData.OBJECT_HUNT_ITEMS || [];

/**
 * Filter Article Battle items by CEFR level
 */
export function getArticleBattleByLevel(level = 'ALL') {
  if (!level || level === 'ALL') return ARTICLE_BATTLE_ITEMS;
  const target = level.toUpperCase();
  const filtered = ARTICLE_BATTLE_ITEMS.filter(item => (item.level || 'A1').toUpperCase() === target);
  return filtered.length > 0 ? filtered : ARTICLE_BATTLE_ITEMS;
}

/**
 * Filter Memory Pairs items by CEFR level
 */
export function getMemoryPairsByLevel(level = 'ALL') {
  if (!level || level === 'ALL') return MEMORY_PAIRS_ITEMS;
  const target = level.toUpperCase();
  const filtered = MEMORY_PAIRS_ITEMS.filter(item => (item.level || 'A1').toUpperCase() === target);
  return filtered.length >= 6 ? filtered : MEMORY_PAIRS_ITEMS;
}

export default {
  ...gamesData,
  ARTICLE_BATTLE_ITEMS,
  MEMORY_PAIRS_ITEMS,
  COLLINS_ARTICLE_ITEMS,
  COLLINS_MEMORY_ITEMS,
  getArticleBattleByLevel,
  getMemoryPairsByLevel,
};

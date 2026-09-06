// ============================================================
// Collins German 3000 Words and Phrases Index
// Extracted with 100% precision from Collins corpus
// ============================================================

import collinsA1 from './a1.json';
import collinsA2 from './a2.json';
import collinsB1 from './b1.json';
import collinsB2 from './b2.json';
import collinsCategories from './categories.json';

export const COLLINS_A1 = collinsA1;
export const COLLINS_A2 = collinsA2;
export const COLLINS_B1 = collinsB1;
export const COLLINS_B2 = collinsB2;
export const COLLINS_CATEGORIES = collinsCategories;

export const ALL_COLLINS_WORDS = [
  ...collinsA1,
  ...collinsA2,
  ...collinsB1,
  ...collinsB2,
];

export function getWordsByLevel(level = 'A1') {
  switch ((level || '').toUpperCase()) {
    case 'A1': return COLLINS_A1;
    case 'A2': return COLLINS_A2;
    case 'B1': return COLLINS_B1;
    case 'B2': return COLLINS_B2;
    default: return ALL_COLLINS_WORDS;
  }
}

export function getWordsByCategory(category) {
  if (!category) return ALL_COLLINS_WORDS;
  const target = category.toLowerCase().trim();
  return ALL_COLLINS_WORDS.filter(w => (w.category || '').toLowerCase() === target);
}

export function searchCollins(query) {
  if (!query) return [];
  const q = query.toLowerCase().trim();
  return ALL_COLLINS_WORDS.filter(w =>
    (w.german && w.german.toLowerCase().includes(q)) ||
    (w.english && w.english.toLowerCase().includes(q)) ||
    (w.arabic && w.arabic.toLowerCase().includes(q)) ||
    (w.base && w.base.toLowerCase().includes(q))
  );
}

export default {
  A1: COLLINS_A1,
  A2: COLLINS_A2,
  B1: COLLINS_B1,
  B2: COLLINS_B2,
  categories: COLLINS_CATEGORIES,
  all: ALL_COLLINS_WORDS,
  getWordsByLevel,
  getWordsByCategory,
  searchCollins,
};

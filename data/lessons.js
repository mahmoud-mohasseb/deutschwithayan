// ============================================================
// CURRICULUM LESSONS (Pedagogical progression)
// Understand -> See -> Listen -> Practice -> Play -> Speak -> Recall -> Master
// Re-exported from pure JSON definition
// ============================================================

import lessonsData from './lessons.json';
import collinsA1 from './collins/a1.json';
import collinsA2 from './collins/a2.json';
import collinsB1 from './collins/b1.json';
import collinsB2 from './collins/b2.json';
import collinsCategories from './collins/categories.json';

export const LESSONS = lessonsData;
export const COLLINS_A1_LESSONS = collinsA1;
export const COLLINS_A2_LESSONS = collinsA2;
export const COLLINS_B1_LESSONS = collinsB1;
export const COLLINS_B2_LESSONS = collinsB2;
export const COLLINS_CATEGORIES = collinsCategories;

export const ALL_LESSONS_WORDS = [
  ...collinsA1,
  ...collinsA2,
  ...collinsB1,
  ...collinsB2,
];

export function getLessonsWordsByLevel(level = 'A1') {
  switch ((level || '').toUpperCase()) {
    case 'A1': return collinsA1;
    case 'A2': return collinsA2;
    case 'B1': return collinsB1;
    case 'B2': return collinsB2;
    default: return ALL_LESSONS_WORDS;
  }
}

export default lessonsData;

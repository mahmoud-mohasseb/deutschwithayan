// ============================================================
// FULL A1 GRAMMAR CURRICULUM + A2-C2 OUTLINES
// Trilingual Scaffolding (DE / EN / AR 🇪🇬)
// Re-exported from pure JSON definition
// ============================================================

import curriculumData from './curriculum.json';
import masterData from './app_data.json';

export const CEFR_LEVELS = curriculumData.CEFR_LEVELS || ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
export const GRAMMAR_TOPICS = curriculumData.GRAMMAR_TOPICS || {};
export const MASTER_APP_DATA = masterData;

export function getAllCurriculumLevels() {
  return masterData.levels || [];
}

export function getCurriculumByLevel(levelKey) {
  if (!levelKey) return [];
  const upper = levelKey.toUpperCase();
  return GRAMMAR_TOPICS[upper] || (masterData.levels && masterData.levels.find(l => l.id.toUpperCase() === upper)?.modules) || [];
}

export function getFullVocabularyCatalog() {
  return masterData.vocabularyCatalog || [];
}

export function getFullGrammarRules() {
  return masterData.grammarCurriculum || [];
}

export function getMasterIrregularVerbs() {
  return masterData.irregularVerbsTable || [];
}

export function getMasterTwoWayPrepositions() {
  return masterData.twoWayPrepositionsMaster || {};
}

export function getMasterAdjectiveEndings() {
  return masterData.adjectiveEndingsTable || {};
}

export function getMasterNomenVerbVerbindungen() {
  return masterData.nomenVerbVerbindungen || [];
}

export function getMasterExamGuide() {
  return masterData.examMasteryGuide || {};
}

export default curriculumData;

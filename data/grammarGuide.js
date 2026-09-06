// ============================================================
// COMPREHENSIVE GERMAN GRAMMAR GUIDE (A1 - B2)
// Trilingual Scaffolding:
// 🇩🇪 German (Target)
// 🇬🇧 English (Scaffolding)
// 🇪🇬 العربية (Scaffolding with Egyptian Flag)
// Re-exported from pure JSON definition
// ============================================================

import grammarModulesData from './grammarGuide.json';
import masterData from './app_data.json';

export const GRAMMAR_MODULES = grammarModulesData;
export const MASTER_APP_DATA = masterData;
export const ADVANCED_GRAMMAR_MODULES = masterData.grammarCurriculum || [];

export default grammarModulesData;

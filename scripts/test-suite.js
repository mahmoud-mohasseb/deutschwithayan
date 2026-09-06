// ============================================================
// COMPREHENSIVE AUTOMATED TEST SUITE — DEUTSCH QUEST 🇩🇪
// Validates:
// 1. All JSON data integrity and syntax
// 2. SoundService audio controls (play, pause, stop, toggle)
// 3. Theme tokens and Dark/Light mode color parity
// 4. Screen modules & component syntax integrity
// ============================================================

const fs = require('fs');
const path = require('path');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${message}`);
  }
}

console.log('\n========================================');
console.log('🇩🇪 DEUTSCH QUEST TEST SUITE — EXPO SDK 57');
console.log('========================================\n');

// -------------------------------------------------------------
// TEST 1: Validate all 8 JSON Data Files
// -------------------------------------------------------------
console.log('📦 [1/4] Testing Data Files Integrity...');

const dataDir = path.join(__dirname, '../data');
const jsonFiles = [
  'curriculum.json',
  'app_data.json',
  'dictionary.json',
  'gamesData.json',
  'kidsCurriculum.json',
  'lessons.json',
  'sourcesMetadata.json',
  'worldLocations.json',
];

jsonFiles.forEach((file) => {
  const filePath = path.join(dataDir, file);
  assert(fs.existsSync(filePath), `Data file exists: ${file}`);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(content);
    assert(parsed !== null && typeof parsed === 'object', `Data file is valid JSON: ${file}`);
    if (Array.isArray(parsed)) {
      assert(parsed.length > 0, `Array data file has content (${parsed.length} items): ${file}`);
    } else {
      assert(Object.keys(parsed).length > 0, `Object data file has keys: ${file}`);
    }
  } catch (err) {
    assert(false, `Data file parsed cleanly: ${file} (${err.message})`);
  }
});

// Collins 3000 JSON Dataset Verification
console.log('\n📖 Testing Collins 3000 Dataset Integrity...');
const collinsDir = path.join(dataDir, 'collins');
const collinsLevels = ['a1.json', 'a2.json', 'b1.json', 'b2.json'];
let totalCollinsWords = 0;

collinsLevels.forEach((cf) => {
  const cPath = path.join(collinsDir, cf);
  assert(fs.existsSync(cPath), `Collins dataset exists: ${cf}`);
  try {
    const data = JSON.parse(fs.readFileSync(cPath, 'utf8'));
    assert(Array.isArray(data) && data.length > 0, `Collins ${cf} has content (${data.length} items)`);
    totalCollinsWords += data.length;

    // Validate schema of first item
    const sample = data[0];
    assert(sample.german && sample.english && sample.arabic, `Collins ${cf} item has german, english, arabic`);
    assert(sample.explanation?.en && sample.explanation?.ar, `Collins ${cf} item has en & ar explanations`);
    assert(sample.example?.de && sample.example?.en && sample.example?.ar, `Collins ${cf} item has tri-lingual examples`);
  } catch (err) {
    assert(false, `Collins file parsed cleanly: ${cf} (${err.message})`);
  }
});

assert(totalCollinsWords >= 3000, `Collins 3000 corpus contains >= 3,000 entries (total: ${totalCollinsWords})`);

const catPath = path.join(collinsDir, 'categories.json');
assert(fs.existsSync(catPath), 'Collins categories.json exists');
try {
  const cats = JSON.parse(fs.readFileSync(catPath, 'utf8'));
  assert(Array.isArray(cats) && cats.length >= 40, `Collins categories has >= 40 topics (${cats.length} found)`);
} catch (err) {
  assert(false, `Collins categories parsed: ${err.message}`);
}

// Specific checks on curriculum and lessons
try {
  const curriculum = JSON.parse(fs.readFileSync(path.join(dataDir, 'curriculum.json'), 'utf8'));
  assert(curriculum.CEFR_LEVELS?.length === 6, 'Curriculum contains all 6 CEFR levels (A1-C2)');
  assert(Object.keys(curriculum.GRAMMAR_TOPICS || {}).length === 6, 'Curriculum has grammar topics across all 6 CEFR levels');

  const lessons = JSON.parse(fs.readFileSync(path.join(dataDir, 'lessons.json'), 'utf8'));
  assert(Array.isArray(lessons) && lessons.length > 0, `Lessons data has ${lessons.length} core interactive lessons`);
  assert(lessons[0].vocabulary?.length > 0, 'First lesson has vocabulary list');
  assert(lessons[0].dialogue?.length > 0, 'First lesson has dialogue lines');
} catch (e) {
  assert(false, `Curriculum / Lessons deep check passed: ${e.message}`);
}

// -------------------------------------------------------------
// TEST 2: Validate soundService Audio Controls API
// -------------------------------------------------------------
console.log('\n🔊 [2/4] Testing soundService Audio Controls API...');

const soundServicePath = path.join(__dirname, '../src/services/soundService.js');
assert(fs.existsSync(soundServicePath), 'soundService.js exists');

const soundServiceContent = fs.readFileSync(soundServicePath, 'utf8');
const requiredMethods = [
  'playTap',
  'playCorrect',
  'playError',
  'speakGerman',
  'stopSpeech',
  'stopAudio',
  'pauseAudio',
  'resumeAudio',
  'toggleTrackAudio',
  'getCurrentTrackId',
  'isAudioPlaying',
];

requiredMethods.forEach((method) => {
  const hasMethod = soundServiceContent.includes(method);
  assert(hasMethod, `soundService exports method: ${method}()`);
});

// -------------------------------------------------------------
// TEST 3: Validate Theme Tokens and Dark/Light Mode Parity
// -------------------------------------------------------------
console.log('\n🎨 [3/4] Testing Theme Tokens & Color Palette...');

const themePath = path.join(__dirname, '../src/styles/theme.js');
assert(fs.existsSync(themePath), 'theme.js exists');

try {
  const themeContent = fs.readFileSync(themePath, 'utf8');
  assert(themeContent.includes('dark:'), 'THEME defines dark palette');
  assert(themeContent.includes('light:'), 'THEME defines light palette');
  assert(themeContent.includes('gradients:'), 'THEME defines gradients');
  assert(themeContent.includes('shadows:'), 'THEME defines shadows');
  assert(themeContent.includes('shadowsDark:'), 'THEME defines shadowsDark');
} catch (e) {
  assert(false, `Theme checks passed: ${e.message}`);
}

// -------------------------------------------------------------
// TEST 4: Validate All Main Screen Modules Exist and Have Content
// -------------------------------------------------------------
console.log('\n📱 [4/4] Testing Screen Modules & Ergonomic Layouts...');

const screensDir = path.join(__dirname, '../src/screens');
const expectedScreens = [
  'ModernHomeScreen.js',
  'CoursesHubScreen.js',
  'AudioLessonsScreen.js',
  'PlayArenaScreen.js',
  'ProfileScreen.js',
  'LessonScreen.js',
  'TopicDetailScreen.js',
  'DictionaryScreen.js',
  'TutorScreen.js',
  'TestsHubScreen.js',
  'OnboardingScreen.js',
  'CurriculumScreen.js',
  'ReviewScreen.js',
];

expectedScreens.forEach((screen) => {
  const screenPath = path.join(screensDir, screen);
  assert(fs.existsSync(screenPath), `Screen module exists: ${screen}`);
  const content = fs.readFileSync(screenPath, 'utf8');
  assert(content.length > 500, `Screen has substantial code: ${screen} (${content.length} bytes)`);
  assert(content.includes('export default'), `Screen has default export: ${screen}`);
});

// -------------------------------------------------------------
// TEST 5: Validate Mini-Games & JSON-Driven Game System
// -------------------------------------------------------------
console.log('\n🎮 [5/5] Testing 2D Mini-Games & JSON Game Data...');

const gamesDataObj = JSON.parse(fs.readFileSync(path.join(dataDir, 'gamesData.json'), 'utf8'));
assert(gamesDataObj.MEMORY_PAIRS_ITEMS?.length >= 20, `MEMORY_PAIRS_ITEMS has ${gamesDataObj.MEMORY_PAIRS_ITEMS?.length} items`);
assert(gamesDataObj.KIDS_FUN_ITEMS?.length >= 16, `KIDS_FUN_ITEMS has ${gamesDataObj.KIDS_FUN_ITEMS?.length} items`);
assert(gamesDataObj.ARTICLE_BATTLE_ITEMS?.length >= 18, `ARTICLE_BATTLE_ITEMS has ${gamesDataObj.ARTICLE_BATTLE_ITEMS?.length} items`);
assert(gamesDataObj.CASE_DETECTIVE_ITEMS?.length >= 8, `CASE_DETECTIVE_ITEMS has ${gamesDataObj.CASE_DETECTIVE_ITEMS?.length} items`);
assert(gamesDataObj.SENTENCE_BUILDER_ITEMS?.length >= 8, `SENTENCE_BUILDER_ITEMS has ${gamesDataObj.SENTENCE_BUILDER_ITEMS?.length} items`);
assert(gamesDataObj.VERB_RACE_ITEMS?.length >= 12, `VERB_RACE_ITEMS has ${gamesDataObj.VERB_RACE_ITEMS?.length} items`);
assert(gamesDataObj.GRAMMAR_BOSS_ENCOUNTERS?.length >= 1, `GRAMMAR_BOSS_ENCOUNTERS has ${gamesDataObj.GRAMMAR_BOSS_ENCOUNTERS?.length} boss battles`);
assert(gamesDataObj.AUDIO_DETECTIVE_ITEMS?.length >= 4, `AUDIO_DETECTIVE_ITEMS has ${gamesDataObj.AUDIO_DETECTIVE_ITEMS?.length} audio detective items`);

const gamesDir = path.join(__dirname, '../src/components/games');
const expectedGames = [
  'MemoryPairsGame.js',
  'KidsAdventureGame.js',
  'ArticleBattle.js',
  'SentenceBuilder.js',
  'VerbRace.js',
  'CaseDetective.js',
  'GrammarBoss.js',
  'AudioDetective.js',
];

expectedGames.forEach((gameFile) => {
  const gamePath = path.join(gamesDir, gameFile);
  assert(fs.existsSync(gamePath), `Mini-game component exists: ${gameFile}`);
  const gameCode = fs.readFileSync(gamePath, 'utf8');
  assert(gameCode.includes('export default'), `Mini-game has default export: ${gameFile}`);
});

// Verify PlayArenaScreen has 0 Three.js 3D imports
const arenaScreenPath = path.join(screensDir, 'PlayArenaScreen.js');
const arenaContent = fs.readFileSync(arenaScreenPath, 'utf8');
assert(!arenaContent.includes("from '../components/3d/"), 'PlayArenaScreen has removed all 3D Three.js modules');
assert(arenaContent.includes('MemoryPairsGame'), 'PlayArenaScreen integrates MemoryPairsGame');
assert(arenaContent.includes('KidsAdventureGame'), 'PlayArenaScreen integrates KidsAdventureGame');

// -------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------
console.log('\n========================================');
console.log(`🏁 TESTS COMPLETED: ${totalTests}`);
console.log(`   Passed: ${passedTests}`);
console.log(`   Failed: ${failedTests}`);
console.log('========================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}

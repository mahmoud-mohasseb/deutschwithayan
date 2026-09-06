// ============================================================
// CENTRAL ZUSTAND STORE — DEUTSCH QUEST 🇩🇪
// Enterprise-Grade State Management for React Native & Expo:
// - Audience Layout Mode (Kids 👧🎈 vs Adult 👨🎓)
// - Trilingual Scaffolding (🇩🇪 German, 🇬🇧 English, 🇪🇬 Arabic)
// - Real-time Reactive Theme Tokens (Dark / Light)
// - Offline World Map & Quest Progression
// - Game Economics (XP, Streak, Hearts, Coins, Stars)
// ============================================================

import { create } from 'zustand';

export const useAppStore = create((set, get) => ({
  // ------------------------------------------------------------
  // 1. Audience Layout Mode (Senior Architect Kids vs Adult)
  // ------------------------------------------------------------
  audienceMode: 'kids', // 'kids' | 'adult'
  setAudienceMode: (mode) => {
    console.log('[useAppStore] setAudienceMode:', mode);
    set({ audienceMode: mode });
  },
  toggleAudienceMode: () =>
    set((state) => {
      const nextMode = state.audienceMode === 'kids' ? 'adult' : 'kids';
      console.log('[useAppStore] toggleAudienceMode -> next:', nextMode);
      return { audienceMode: nextMode };
    }),

  // ------------------------------------------------------------
  // 2. Onboarding Status
  // ------------------------------------------------------------
  isOnboarded: true,
  setIsOnboarded: (val) => set({ isOnboarded: val }),

  // ------------------------------------------------------------
  // 3. Language & CEFR Level
  // ------------------------------------------------------------
  supportLang: 'en', // 'en' | 'ar'
  isRTL: false,
  cefrLevel: 'A1',
  learningGoal: 'fun_games',

  setSupportLang: (lang) =>
    set({
      supportLang: lang,
      isRTL: lang === 'ar',
    }),

  toggleSupportLang: () =>
    set((state) => {
      const nextLang = state.supportLang === 'en' ? 'ar' : 'en';
      return {
        supportLang: nextLang,
        isRTL: nextLang === 'ar',
      };
    }),

  setCefrLevel: (level) => set({ cefrLevel: level }),
  setLearningGoal: (goal) => set({ learningGoal: goal }),

  // ------------------------------------------------------------
  // 4. Dark / Light Theme Mode
  // ------------------------------------------------------------
  themeMode: 'dark', // 'light' | 'dark'
  setThemeMode: (mode) => set({ themeMode: mode }),
  toggleTheme: () =>
    set((state) => ({
      themeMode: state.themeMode === 'light' ? 'dark' : 'light',
    })),

  // ------------------------------------------------------------
  // 5. Progression & Game Economics
  // ------------------------------------------------------------
  xp: 12550,
  streakDays: 12,
  hearts: 5,
  maxHearts: 5,
  coins: 190,
  stars: 48,
  playerLevel: 4,

  avatar: {
    id: 'falko_eagle',
    name: 'Falko der Adler 🦅',
    hat: 'alpenhut',
    badge: 'Explorer',
  },

  addXp: (amount) =>
    set((state) => {
      const newXp = state.xp + amount;
      const newLevel = Math.floor(newXp / 1000) + 1;
      return { xp: newXp, playerLevel: newLevel };
    }),

  addCoins: (amount) =>
    set((state) => ({ coins: state.coins + amount })),

  addStars: (amount) =>
    set((state) => ({ stars: state.stars + amount })),

  loseHeart: () =>
    set((state) => ({
      hearts: Math.max(0, state.hearts - 1),
    })),

  restoreHearts: (amount = 5) =>
    set((state) => ({
      hearts: Math.min(state.maxHearts, state.hearts + amount),
    })),

  setAvatar: (avatarObj) =>
    set({ avatar: avatarObj }),

  // ------------------------------------------------------------
  // 6. Offline World Map & Quest Progression
  // ------------------------------------------------------------
  completedLocations: ['a1-zuhause', 'a1-forest'],
  unlockedLocations: ['a1-zuhause', 'a1-forest', 'a2-stadt', 'a2-park'],
  activeLocationId: 'a1-forest',
  openedChests: [],

  completeLocation: (locationId) =>
    set((state) => ({
      completedLocations: [...new Set([...state.completedLocations, locationId])],
    })),

  unlockLocation: (locationId) =>
    set((state) => ({
      unlockedLocations: [...new Set([...state.unlockedLocations, locationId])],
    })),

  setActiveLocationId: (locationId) =>
    set({ activeLocationId: locationId }),

  openChest: (chestId, reward = { coins: 50, stars: 3, hearts: 1 }) =>
    set((state) => {
      if (state.openedChests.includes(chestId)) return state;
      return {
        openedChests: [...state.openedChests, chestId],
        coins: state.coins + (reward.coins || 0),
        stars: state.stars + (reward.stars || 0),
        hearts: Math.min(state.maxHearts, state.hearts + (reward.hearts || 0)),
      };
    }),

  // ------------------------------------------------------------
  // 7. Sound & Audio Settings
  // ------------------------------------------------------------
  sfxEnabled: true,
  speechRate: 0.85, // Friendly pace for kids & learners
  toggleSfx: () => set((state) => ({ sfxEnabled: !state.sfxEnabled })),
  setSpeechRate: (rate) => set({ speechRate: rate }),
}));

export default useAppStore;

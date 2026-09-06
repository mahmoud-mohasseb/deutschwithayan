// ============================================================
// GAME MODE CONTEXT — DEUTSCH QUEST 🇩🇪
// Child Mode (7+) vs Adult Mode
// Connected to central Zustand store
// ============================================================

import React, { createContext, useContext, useState } from 'react';
import { useAppStore } from '../store/useAppStore';

const GameModeContext = createContext();

export const AVATAR_OPTIONS = {
  characters: [
    { id: 'falko', name: 'Falko der Adler', title: 'Fliegender Entdecker 🦅', emoji: '🦅' },
    { id: 'felix', name: 'Felix', title: 'Roboter-Assistent 🤖', emoji: '🤖' },
    { id: 'max', name: 'Max', title: 'Abenteurer 🎒', emoji: '🧑' },
    { id: 'lena', name: 'Lena', title: 'Sprach-Detektivin 🔍', emoji: '👧' },
    { id: 'anna', name: 'Frau Anna', title: 'Lehrerin 📚', emoji: '👩‍🏫' },
    { id: 'karl', name: 'Karl', title: 'Weltenbummler ✈️', emoji: '👨‍✈️' },
  ],
  outfits: [
    { id: 'classic', name: 'Klassisch Blau', color: '#3B82F6', icon: '👕' },
    { id: 'explorer', name: 'Forscher-Weste', color: '#10B981', icon: '🦺' },
    { id: 'royal', name: 'Schloss-Robe', color: '#8B5CF6', icon: '👑' },
    { id: 'business', name: 'Business-Anzug', color: '#D97706', icon: '👔' },
  ],
  pets: [
    { id: 'eagle', name: 'Falko Baby', emoji: '🦅', perk: '+15% Sternen-Bonus' },
    { id: 'owl', name: 'Eule Sophia', emoji: '🦉', perk: '+10% Grammatik-XP' },
    { id: 'dog', name: 'Hund Bello', emoji: '🐕', perk: 'Spürt Vokabeln auf' },
    { id: 'cat', name: 'Katze Mimi', emoji: '🐈', perk: 'Zusatz-Herz bei Fehlern' },
    { id: 'robot', name: 'Mini-Bot Sparky', emoji: '👾', perk: 'Schnelle V2-Tipps' },
  ],
};

export function GameModeProvider({ children }) {
  const audienceMode = useAppStore((s) => s.audienceMode);
  const setAudienceMode = useAppStore((s) => s.setAudienceMode);
  const coins = useAppStore((s) => s.coins);
  const addCoins = useAppStore((s) => s.addCoins);
  const hearts = useAppStore((s) => s.hearts);
  const loseHeart = useAppStore((s) => s.loseHeart);
  const restoreHearts = useAppStore((s) => s.restoreHearts);

  const [ageGroup, setAgeGroup] = useState('child');
  const [learningGoal, setLearningGoal] = useState('fun_games');

  // Avatar state
  const [avatar, setAvatar] = useState({
    characterId: 'falko',
    characterName: 'Falko der Adler',
    characterEmoji: '🦅',
    outfitId: 'explorer',
    outfitColor: '#10B981',
    petId: 'eagle',
    petEmoji: '🦅',
  });

  const [inventory, setInventory] = useState(['classic', 'explorer', 'eagle', 'owl']);

  const spendCoins = (cost) => {
    if (coins >= cost) {
      addCoins(-cost);
      return true;
    }
    return false;
  };

  const unlockItem = (itemId, cost) => {
    if (!inventory.includes(itemId)) {
      if (spendCoins(cost)) {
        setInventory((prev) => [...prev, itemId]);
        return { success: true, message: 'Freigeschaltet! 🎉' };
      }
      return { success: false, message: 'Nicht genug Münzen! 🪙' };
    }
    return { success: false, message: 'Bereits im Besitz! ✨' };
  };

  return (
    <GameModeContext.Provider
      value={{
        audienceMode,
        setAudienceMode,
        ageGroup,
        setAgeGroup,
        learningGoal,
        setLearningGoal,
        coins,
        earnCoins: addCoins,
        addCoins,
        spendCoins,
        hearts,
        loseHeart,
        restoreHearts,
        avatar,
        setAvatar,
        updateAvatar: (partial) => setAvatar((prev) => ({ ...prev, ...partial })),
        inventory,
        unlockItem,
      }}
    >
      {children}
    </GameModeContext.Provider>
  );
}

export function useGameMode() {
  const context = useContext(GameModeContext);
  if (!context) {
    throw new Error('useGameMode must be used within a GameModeProvider');
  }
  return context;
}

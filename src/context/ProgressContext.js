// ============================================================
// PROGRESS & ADAPTIVE SPACED REPETITION (SRS) CONTEXT
// Tracks XP, streaks, grammar mastery, and adaptive weaknesses:
// Vocabulary, Grammar, Listening, Speaking, Reading, Writing
// ============================================================

import React, { createContext, useContext, useState } from 'react';

const INITIAL_MASTERY = [
  { id: 'articles', title: 'Articles (der/die/das)', percent: 90, status: 'Strong', color: '#3B82F6' },
  { id: 'nominativ', title: 'Nominativ (Subject)', percent: 100, status: 'Mastered', color: '#3B82F6' },
  { id: 'akkusativ', title: 'Akkusativ (Direct Object)', percent: 80, status: 'Strong', color: '#10B981' },
  { id: 'dativ', title: 'Dativ (Indirect Object)', percent: 50, status: 'Practicing', color: '#8B5CF6' },
  { id: 'word_order', title: 'Word Order (V2 Rule)', percent: 70, status: 'Practicing', color: '#F59E0B' },
  { id: 'verbs', title: 'Verbs (Conjugation & Tenses)', percent: 85, status: 'Strong', color: '#EC4899' },
];

const INITIAL_SKILLS = {
  vocabulary: 86,
  grammar: 71,
  listening: 64,
  speaking: 53,
  reading: 79,
  writing: 61,
};

const INITIAL_WEAK_ITEMS = [
  { id: 'w-1', term: 'der Kaffee → einen Kaffee', type: 'grammar', rule: 'Akkusativ maskulin', mistakeCount: 3, lastReviewed: 'Gestern' },
  { id: 'w-2', term: 'die Speisekarte', type: 'vocab', rule: 'Feminin (die)', mistakeCount: 2, lastReviewed: 'Heute' },
  { id: 'w-3', term: 'weil ich krank bin', type: 'grammar', rule: 'Verb am Satzende (Nebensatz)', mistakeCount: 2, lastReviewed: 'Heute' },
  { id: 'w-4', term: 'dem Mann (Dativ)', type: 'grammar', rule: 'Indirektes Objekt', mistakeCount: 4, lastReviewed: 'Vor 2 Tagen' },
];

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [xp, setXp] = useState(12450);
  const [streakDays, setStreakDays] = useState(12);
  const [masteryList, setMasteryList] = useState(INITIAL_MASTERY);
  const [skills, setSkills] = useState(INITIAL_SKILLS);
  const [weakItems, setWeakItems] = useState(INITIAL_WEAK_ITEMS);
  const [completedLessons, setCompletedLessons] = useState(['a1-restaurant', 'a1-greetings']);
  const [unlockedBadges, setUnlockedBadges] = useState([
    '☕ Café Master',
    '👋 First Greeting',
    '🛡️ Article Champion',
    '🔥 10-Day Streak',
  ]);

  const addXp = (amount) => {
    setXp((prev) => prev + amount);
  };

  const completeLesson = (lessonId, xpReward = 50, badge = null) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons((prev) => [...prev, lessonId]);
    }
    addXp(xpReward);
    if (badge && !unlockedBadges.includes(badge)) {
      setUnlockedBadges((prev) => [...prev, badge]);
    }
  };

  const boostMastery = (topicId, points = 5) => {
    setMasteryList((prev) =>
      prev.map((item) => {
        if (item.id === topicId) {
          const nextPercent = Math.min(100, item.percent + points);
          let nextStatus = 'Learning';
          if (nextPercent >= 95) nextStatus = 'Mastered';
          else if (nextPercent >= 80) nextStatus = 'Strong';
          else if (nextPercent >= 50) nextStatus = 'Practicing';
          else if (nextPercent > 0) nextStatus = 'Learning';
          return { ...item, percent: nextPercent, status: nextStatus };
        }
        return item;
      })
    );
  };

  // Adaptive SRS: Report a mistake to add to the review queue
  const reportMistake = (term, type, rule) => {
    setWeakItems((prev) => {
      const existing = prev.find((item) => item.term === term);
      if (existing) {
        return prev.map((item) =>
          item.term === term ? { ...item, mistakeCount: item.mistakeCount + 1, lastReviewed: 'Gerade eben' } : item
        );
      }
      return [
        { id: `w-${Date.now()}`, term, type, rule, mistakeCount: 1, lastReviewed: 'Gerade eben' },
        ...prev,
      ];
    });
  };

  // Adaptive SRS: Clear an item from the weak queue when mastered
  const resolveWeakItem = (id) => {
    setWeakItems((prev) => prev.filter((item) => item.id !== id));
    addXp(25);
  };

  return (
    <ProgressContext.Provider
      value={{
        xp,
        streakDays,
        masteryList,
        skills,
        weakItems,
        completedLessons,
        unlockedBadges,
        addXp,
        completeLesson,
        boostMastery,
        reportMistake,
        resolveWeakItem,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}

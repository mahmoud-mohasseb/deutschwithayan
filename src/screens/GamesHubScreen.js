// ============================================================
// GAMES HUB SCREEN
// Hub for all 4 Grammar Games:
// 1. Article Battle (der / die / das)
// 2. Case Detective (Nominativ / Akkusativ / Dativ / Genitiv)
// 3. Sentence Builder (V2 rule)
// 4. Grammar Boss (Fight mistakes!)
// ============================================================

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { THEME } from '../styles/theme';
import { useLanguage } from '../context/LanguageContext';
import ArticleBattle from '../components/games/ArticleBattle';
import CaseDetective from '../components/games/CaseDetective';
import SentenceBuilder from '../components/games/SentenceBuilder';
import GrammarBoss from '../components/games/GrammarBoss';

export default function GamesHubScreen({ initialGame = 'battle', onBack }) {
  const { supportLang, isRTL, t } = useLanguage();
  const [activeGame, setActiveGame] = useState(initialGame);

  const gamesList = [
    { id: 'battle', title: t('articleBattle'), icon: '🛡️', color: THEME.colors.primary },
    { id: 'detective', title: t('caseDetective'), icon: '🔍', color: THEME.colors.success },
    { id: 'builder', title: t('sentenceBuilder'), icon: '🧩', color: THEME.colors.accent },
    { id: 'boss', title: t('grammarBoss'), icon: '⚔️', color: THEME.colors.purple },
  ];

  return (
    <View style={styles.container}>
      {/* Game Selector Bar */}
      <View style={styles.selectorBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
          {gamesList.map((g) => {
            const isActive = activeGame === g.id;
            return (
              <TouchableOpacity
                key={g.id}
                style={[
                  styles.tabBtn,
                  isActive && { backgroundColor: g.color, borderColor: g.color },
                ]}
                onPress={() => setActiveGame(g.id)}
              >
                <Text style={styles.tabIcon}>{g.icon}</Text>
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                  {g.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Active Game Canvas */}
      <ScrollView style={styles.gameCanvas} contentContainerStyle={styles.canvasContent}>
        {activeGame === 'battle' && <ArticleBattle onFinish={() => setActiveGame('detective')} />}
        {activeGame === 'detective' && <CaseDetective onFinish={() => setActiveGame('builder')} />}
        {activeGame === 'builder' && <SentenceBuilder onFinish={() => setActiveGame('boss')} />}
        {activeGame === 'boss' && <GrammarBoss onFinish={() => setActiveGame('battle')} />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.bg,
  },
  selectorBar: {
    backgroundColor: THEME.colors.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  tabsRow: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    gap: 8,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.bgElevated,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  tabIcon: {
    fontSize: 16,
  },
  tabText: {
    color: THEME.colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  gameCanvas: {
    flex: 1,
  },
  canvasContent: {
    paddingBottom: 40,
  },
});

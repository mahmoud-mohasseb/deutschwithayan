// ============================================================
// FULL-SCREEN ADVANCED 3D GERMAN WORLD — DEUTSCH QUEST 🇩🇪
// Powered by Three.js 3D Math Engine (three@0.154.0) & Hardware-Accelerated 3D
// 3D SCENE IS 100% DIRECTLY TIED TO GERMAN QUESTIONS & OBJECTS:
// 1. der Apfel -> 3D Crimson Apple with woody stem & emerald leaf
// 2. die Sonne -> 3D Radiant Sun with 8 orbiting solar corona flares
// 3. das Buch  -> 3D Magic Open Book with white pages & golden ribbon
// 4. der Hund  -> 3D Canine Mascot with floppy ears, snout & blue collar
// 5. die Blume -> 3D Blooming Flower with 6 rose petals, golden pistil & stem
// 6. das Haus  -> 3D Architecture House with pitched terracotta roof & chimney
// ============================================================

import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PanResponder,
  StatusBar,
  Modal,
  Platform,
} from 'react-native';
import Svg, {
  Polygon,
  Circle,
  Ellipse,
  Defs,
  LinearGradient as SvgGradient,
  RadialGradient,
  Stop,
  G,
  Rect,
} from 'react-native-svg';
import * as THREE from 'three';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { THEME } from '../../styles/theme';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import { useGameMode } from '../../context/GameModeContext';
import { useAppTheme } from '../../context/ThemeContext';
import soundService from '../../services/soundService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 3D German Quest Targets with bespoke 3D question links
const QUEST_3D_TARGETS = [
  {
    id: 'der_apfel',
    gender: 'der',
    german: 'der Apfel',
    plural: 'die Äpfel',
    english: 'the apple',
    arabic: 'التفاحة',
    questionDe: 'Welcher Artikel gehört zum Wort: "Apfel"?',
    questionEn: 'Which article belongs to the 3D Apple?',
    questionAr: 'ما هي أداة التعريف المناسبة لمجسم "Apfel" (التفاحة)؟ 🇪🇬',
    casePrompt: 'Nominativ: Das ist der Apfel (Maskulinum: der)',
    hintEn: 'Masculine food item (der)',
    hintAr: 'اسم مذكر في الطعام (der)',
    colorHex: '#38bdf8',
    objectType: 'apple',
  },
  {
    id: 'die_sonne',
    gender: 'die',
    german: 'die Sonne',
    plural: 'die Sonnen',
    english: 'the sun',
    arabic: 'الشمس',
    questionDe: 'Welcher Artikel gehört zum Wort: "Sonne"?',
    questionEn: 'Which article belongs to the 3D Radiant Sun?',
    questionAr: 'ما هي أداة التعريف المناسبة لمجسم "Sonne" (الشمس)؟ 🇪🇬',
    casePrompt: 'Akkusativ: Ich sehe die Sonne (Femininum: die)',
    hintEn: 'Feminine celestial body (die)',
    hintAr: 'اسم مؤنث - جرم سماوي (die)',
    colorHex: '#ff6b55',
    objectType: 'sun',
  },
  {
    id: 'das_buch',
    gender: 'das',
    german: 'das Buch',
    plural: 'die Bücher',
    english: 'the book',
    arabic: 'الكتاب',
    questionDe: 'Welcher Artikel gehört zum Wort: "Buch"?',
    questionEn: 'Which article belongs to the 3D Open Book?',
    questionAr: 'ما هي أداة التعريف المناسبة لمجسم "Buch" (الكتاب)؟ 🇪🇬',
    casePrompt: 'Dativ: Auf dem Buch liegt ein Stift (Neutrum: das)',
    hintEn: 'Neuter reading material (das)',
    hintAr: 'اسم محايد - كتاب (das)',
    colorHex: '#34d399',
    objectType: 'book',
  },
  {
    id: 'der_hund',
    gender: 'der',
    german: 'der Hund',
    plural: 'die Hunde',
    english: 'the dog',
    arabic: 'الكلب',
    questionDe: 'Welcher Artikel gehört zum Wort: "Hund"?',
    questionEn: 'Which article belongs to the 3D Dog Mascot?',
    questionAr: 'ما هي أداة التعريف المناسبة لمجسم "Hund" (الكلب)؟ 🇪🇬',
    casePrompt: 'Dativ: Ich spiele mit dem Hund (Maskulinum: der)',
    hintEn: 'Masculine companion animal (der)',
    hintAr: 'اسم مذكر - حيوان أليف (der)',
    colorHex: '#38bdf8',
    objectType: 'dog',
  },
  {
    id: 'die_blume',
    gender: 'die',
    german: 'die Blume',
    plural: 'die Blumen',
    english: 'the flower',
    arabic: 'الزهرة',
    questionDe: 'Welcher Artikel gehört zum Wort: "Blume"?',
    questionEn: 'Which article belongs to the 3D Blooming Flower?',
    questionAr: 'ما هي أداة التعريف المناسبة لمجسم "Blume" (الزهرة)؟ 🇪🇬',
    casePrompt: 'Akkusativ: Sie pflanzt die Blume (Femininum: die)',
    hintEn: 'Feminine garden plant (die)',
    hintAr: 'اسم مؤنث - زهرة (die)',
    colorHex: '#ff6b55',
    objectType: 'flower',
  },
  {
    id: 'das_haus',
    gender: 'das',
    german: 'das Haus',
    plural: 'die Häuser',
    english: 'the house',
    arabic: 'المنزل',
    questionDe: 'Welcher Artikel gehört zum Wort: "Haus"?',
    questionEn: 'Which article belongs to the 3D Architecture House?',
    questionAr: 'ما هي أداة التعريف المناسبة لمجسم "Haus" (المنزل)؟ 🇪🇬',
    casePrompt: 'Genitiv: Das Dach des Hauses ist rot (Neutrum: das)',
    hintEn: 'Neuter building (das)',
    hintAr: 'اسم محايد - مبنى (das)',
    colorHex: '#fbbf24',
    objectType: 'house',
  },
];

// --- BESPOKE 3D GEOMETRY BUILDER FOR ALL 6 QUESTIONS ---
function get3DModelParts(objectType, animTime) {
  const parts = [];

  switch (objectType) {
    // 1. 3D APPLE (der Apfel)
    case 'apple': {
      // Apple body (Red crimson with facet curvature)
      const numSegments = 8;
      const topApex = new THREE.Vector3(0, 0.95, 0);
      const bottomApex = new THREE.Vector3(0, -1.05, 0);
      const upperRing = [];
      const equatorRing = [];
      const lowerRing = [];

      for (let i = 0; i < numSegments; i++) {
        const theta = (i / numSegments) * Math.PI * 2;
        upperRing.push(new THREE.Vector3(Math.cos(theta) * 0.95, 0.85, Math.sin(theta) * 0.95));
        equatorRing.push(new THREE.Vector3(Math.cos(theta) * 1.25, 0.05, Math.sin(theta) * 1.25));
        lowerRing.push(new THREE.Vector3(Math.cos(theta) * 0.9, -0.75, Math.sin(theta) * 0.9));
      }

      const appleVerts = [topApex, bottomApex, ...upperRing, ...equatorRing, ...lowerRing];
      const appleFaces = [];
      const uOffset = 2;
      const eqOffset = 2 + numSegments;
      const lOffset = 2 + numSegments * 2;

      for (let i = 0; i < numSegments; i++) {
        const next = (i + 1) % numSegments;
        // Top cap to upper ring
        appleFaces.push([0, uOffset + next, uOffset + i]);
        // Upper to equator
        appleFaces.push([uOffset + i, uOffset + next, eqOffset + i]);
        appleFaces.push([uOffset + next, eqOffset + next, eqOffset + i]);
        // Equator to lower
        appleFaces.push([eqOffset + i, eqOffset + next, lOffset + i]);
        appleFaces.push([eqOffset + next, lOffset + next, lOffset + i]);
        // Lower to bottom cap
        appleFaces.push([1, lOffset + i, lOffset + next]);
      }

      parts.push({
        vertices: appleVerts,
        faces: appleFaces,
        color: '#dc2626', // Crimson Apple Red
      });

      // Apple Stem (Brown woody cylinder)
      parts.push({
        vertices: [
          new THREE.Vector3(-0.05, 0.95, 0),
          new THREE.Vector3(0.05, 0.95, 0),
          new THREE.Vector3(0.12, 1.55, 0.04),
          new THREE.Vector3(0.02, 1.55, 0.04),
        ],
        faces: [
          [0, 1, 2],
          [0, 2, 3],
        ],
        color: '#78350f',
      });

      // Apple Leaf (Emerald green)
      parts.push({
        vertices: [
          new THREE.Vector3(0.08, 1.35, 0.02),
          new THREE.Vector3(0.65, 1.55, 0.25),
          new THREE.Vector3(0.4, 1.15, 0.15),
        ],
        faces: [
          [0, 1, 2],
          [0, 2, 1], // Double sided
        ],
        color: '#22c55e',
      });
      break;
    }

    // 2. 3D RADIANT SUN (die Sonne)
    case 'sun': {
      // Golden Solar Core Sphere (Octahedral / Icosahedral Base)
      const coreVerts = [
        new THREE.Vector3(0, 1.15, 0),
        new THREE.Vector3(0.95, 0, 0),
        new THREE.Vector3(0, 0, 0.95),
        new THREE.Vector3(-0.95, 0, 0),
        new THREE.Vector3(0, 0, -0.95),
        new THREE.Vector3(0, -1.15, 0),
      ];
      const coreFaces = [
        [0, 1, 2], [0, 2, 3], [0, 3, 4], [0, 4, 1],
        [5, 2, 1], [5, 3, 2], [5, 4, 3], [5, 1, 4],
      ];
      parts.push({
        vertices: coreVerts,
        faces: coreFaces,
        color: '#fbbf24', // Sun Gold
      });

      // 8 Radiant Solar Corona Flares
      const flareVerts = [];
      const flareFaces = [];
      const numFlares = 8;
      const flarePulse = 1.75 + Math.sin(animTime * 3) * 0.15;

      for (let i = 0; i < numFlares; i++) {
        const a1 = (i / numFlares) * Math.PI * 2;
        const a2 = a1 + (Math.PI / numFlares) * 0.7;
        const aMid = (a1 + a2) / 2;

        const bIdx = flareVerts.length;
        flareVerts.push(new THREE.Vector3(Math.cos(a1) * 0.95, Math.sin(a1) * 0.95, 0));
        flareVerts.push(new THREE.Vector3(Math.cos(a2) * 0.95, Math.sin(a2) * 0.95, 0));
        flareVerts.push(new THREE.Vector3(Math.cos(aMid) * flarePulse, Math.sin(aMid) * flarePulse, 0));

        flareFaces.push([bIdx, bIdx + 2, bIdx + 1]);
        flareFaces.push([bIdx, bIdx + 1, bIdx + 2]); // Double-sided
      }
      parts.push({
        vertices: flareVerts,
        faces: flareFaces,
        color: '#f97316', // Orange Flame
      });
      break;
    }

    // 3. 3D OPEN MAGIC BOOK (das Buch)
    case 'book': {
      // Leather Cover (Blue / Emerald Book Cover wings open)
      const coverVerts = [
        // Left wing
        new THREE.Vector3(-1.35, 0.95, 0.35),
        new THREE.Vector3(-0.05, 0.95, 0),
        new THREE.Vector3(-0.05, -0.95, 0),
        new THREE.Vector3(-1.35, -0.95, 0.35),
        // Right wing
        new THREE.Vector3(0.05, 0.95, 0),
        new THREE.Vector3(1.35, 0.95, 0.35),
        new THREE.Vector3(1.35, -0.95, 0.35),
        new THREE.Vector3(0.05, -0.95, 0),
      ];
      const coverFaces = [
        [0, 1, 2], [0, 2, 3], // Left
        [4, 5, 6], [4, 6, 7], // Right
        [2, 1, 0], [3, 2, 0], // Double-sided
        [6, 5, 4], [7, 6, 4],
      ];
      parts.push({
        vertices: coverVerts,
        faces: coverFaces,
        color: '#1e3a8a', // Deep Royal Blue Leather
      });

      // White Pages Block inside the book
      const pagesVerts = [
        new THREE.Vector3(-1.25, 0.85, 0.28),
        new THREE.Vector3(-0.06, 0.85, 0.05),
        new THREE.Vector3(-0.06, -0.85, 0.05),
        new THREE.Vector3(-1.25, -0.85, 0.28),
        new THREE.Vector3(0.06, 0.85, 0.05),
        new THREE.Vector3(1.25, 0.85, 0.28),
        new THREE.Vector3(1.25, -0.85, 0.28),
        new THREE.Vector3(0.06, -0.85, 0.05),
      ];
      const pagesFaces = [
        [0, 1, 2], [0, 2, 3],
        [4, 5, 6], [4, 6, 7],
      ];
      parts.push({
        vertices: pagesVerts,
        faces: pagesFaces,
        color: '#f8fafc', // Crisp White Pages
      });

      // Golden Bookmark Ribbon dangling down
      parts.push({
        vertices: [
          new THREE.Vector3(0, 0.95, 0.06),
          new THREE.Vector3(0.12, 0.95, 0.06),
          new THREE.Vector3(0.25, -1.25, 0.35),
          new THREE.Vector3(0.15, -1.25, 0.35),
        ],
        faces: [
          [0, 1, 2], [0, 2, 3],
          [2, 1, 0], [3, 2, 0],
        ],
        color: '#fbbf24', // Gold Ribbon
      });
      break;
    }

    // 4. 3D DOG COMPANION (der Hund)
    case 'dog': {
      // Dog Head Box
      const headVerts = [
        new THREE.Vector3(-0.7, -0.6, -0.6),
        new THREE.Vector3(0.7, -0.6, -0.6),
        new THREE.Vector3(0.7, 0.8, -0.6),
        new THREE.Vector3(-0.7, 0.8, -0.6),
        new THREE.Vector3(-0.7, -0.6, 0.6),
        new THREE.Vector3(0.7, -0.6, 0.6),
        new THREE.Vector3(0.7, 0.8, 0.6),
        new THREE.Vector3(-0.7, 0.8, 0.6),
      ];
      const headFaces = [
        [0, 1, 2], [0, 2, 3], // back
        [5, 4, 7], [5, 7, 6], // front
        [4, 0, 3], [4, 3, 7], // left
        [1, 5, 6], [1, 6, 2], // right
        [3, 2, 6], [3, 6, 7], // top
        [4, 5, 1], [4, 1, 0], // bottom
      ];
      parts.push({
        vertices: headVerts,
        faces: headFaces,
        color: '#d97706', // Golden Tan Fur
      });

      // Dog Snout extending forward
      parts.push({
        vertices: [
          new THREE.Vector3(-0.35, -0.4, 0.6),
          new THREE.Vector3(0.35, -0.4, 0.6),
          new THREE.Vector3(0.35, 0.1, 0.6),
          new THREE.Vector3(-0.35, 0.1, 0.6),
          new THREE.Vector3(-0.25, -0.35, 1.15),
          new THREE.Vector3(0.25, -0.35, 1.15),
          new THREE.Vector3(0.25, 0.05, 1.15),
          new THREE.Vector3(-0.25, 0.05, 1.15),
        ],
        faces: [
          [5, 4, 7], [5, 7, 6], // nose front
          [4, 0, 3], [4, 3, 7],
          [1, 5, 6], [1, 6, 2],
          [3, 2, 6], [3, 6, 7],
        ],
        color: '#b45309', // Darker Tan Snout
      });

      // Black Nose Tip
      parts.push({
        vertices: [
          new THREE.Vector3(-0.12, -0.05, 1.16),
          new THREE.Vector3(0.12, -0.05, 1.16),
          new THREE.Vector3(0, 0.1, 1.16),
        ],
        faces: [[0, 1, 2]],
        color: '#0f172a',
      });

      // Floppy Ears
      parts.push({
        vertices: [
          new THREE.Vector3(-0.7, 0.75, 0.1),
          new THREE.Vector3(-1.15, 0.05, 0.35),
          new THREE.Vector3(-0.7, 0.1, 0.2),
          new THREE.Vector3(0.7, 0.75, 0.1),
          new THREE.Vector3(1.15, 0.05, 0.35),
          new THREE.Vector3(0.7, 0.1, 0.2),
        ],
        faces: [
          [0, 1, 2], [2, 1, 0], // Left ear
          [3, 4, 5], [5, 4, 3], // Right ear
        ],
        color: '#92400e', // Darker Ear Fur
      });
      break;
    }

    // 5. 3D BLOOMING FLOWER (die Blume)
    case 'flower': {
      // Golden Core Pistil
      const numPistil = 8;
      const pistilVerts = [new THREE.Vector3(0, 0, 0.15)];
      const pistilFaces = [];
      for (let i = 0; i < numPistil; i++) {
        const theta = (i / numPistil) * Math.PI * 2;
        pistilVerts.push(new THREE.Vector3(Math.cos(theta) * 0.45, Math.sin(theta) * 0.45, 0.1));
      }
      for (let i = 1; i <= numPistil; i++) {
        const next = i === numPistil ? 1 : i + 1;
        pistilFaces.push([0, i, next]);
      }
      parts.push({
        vertices: pistilVerts,
        faces: pistilFaces,
        color: '#fbbf24', // Golden Pistil
      });

      // 6 Radiant Blooming Rose Petals
      const petalVerts = [];
      const petalFaces = [];
      const numPetals = 6;
      for (let i = 0; i < numPetals; i++) {
        const aMid = (i / numPetals) * Math.PI * 2;
        const a1 = aMid - 0.38;
        const a2 = aMid + 0.38;
        const b = petalVerts.length;

        petalVerts.push(new THREE.Vector3(Math.cos(a1) * 0.45, Math.sin(a1) * 0.45, 0.05));
        petalVerts.push(new THREE.Vector3(Math.cos(a2) * 0.45, Math.sin(a2) * 0.45, 0.05));
        petalVerts.push(new THREE.Vector3(Math.cos(aMid) * 1.55, Math.sin(aMid) * 1.55, -0.2));

        petalFaces.push([b, b + 1, b + 2]);
        petalFaces.push([b, b + 2, b + 1]); // Double sided
      }
      parts.push({
        vertices: petalVerts,
        faces: petalFaces,
        color: '#ec4899', // Radiant Rose Petals
      });

      // Green Stem & Leaves below
      parts.push({
        vertices: [
          new THREE.Vector3(-0.06, -0.4, 0),
          new THREE.Vector3(0.06, -0.4, 0),
          new THREE.Vector3(0.06, -1.8, -0.2),
          new THREE.Vector3(-0.06, -1.8, -0.2),
        ],
        faces: [
          [0, 1, 2], [0, 2, 3],
          [2, 1, 0], [3, 2, 0],
        ],
        color: '#16a34a', // Green Stem
      });
      break;
    }

    // 6. 3D ARCHITECTURE HOUSE (das Haus)
    case 'house':
    default: {
      // Main House Walls Cuboid
      const wallVerts = [
        new THREE.Vector3(-0.95, -0.85, -0.85),
        new THREE.Vector3(0.95, -0.85, -0.85),
        new THREE.Vector3(0.95, 0.45, -0.85),
        new THREE.Vector3(-0.95, 0.45, -0.85),
        new THREE.Vector3(-0.95, -0.85, 0.85),
        new THREE.Vector3(0.95, -0.85, 0.85),
        new THREE.Vector3(0.95, 0.45, 0.85),
        new THREE.Vector3(-0.95, 0.45, 0.85),
      ];
      const wallFaces = [
        [0, 1, 2], [0, 2, 3], // back
        [5, 4, 7], [5, 7, 6], // front
        [4, 0, 3], [4, 3, 7], // left
        [1, 5, 6], [1, 6, 2], // right
        [4, 5, 1], [4, 1, 0], // bottom
      ];
      parts.push({
        vertices: wallVerts,
        faces: wallFaces,
        color: '#fbbf24', // Warm Sandstone Walls
      });

      // Pitched Gable Roof with Ridge
      const roofVerts = [
        new THREE.Vector3(-1.1, 0.45, -1.0),
        new THREE.Vector3(1.1, 0.45, -1.0),
        new THREE.Vector3(-1.1, 0.45, 1.0),
        new THREE.Vector3(1.1, 0.45, 1.0),
        new THREE.Vector3(0, 1.45, -1.0), // Back roof apex
        new THREE.Vector3(0, 1.45, 1.0),  // Front roof apex
      ];
      const roofFaces = [
        [0, 4, 1], // Back gable
        [2, 3, 5], // Front gable
        [0, 2, 5], [0, 5, 4], // Left slope
        [1, 4, 5], [1, 5, 3], // Right slope
      ];
      parts.push({
        vertices: roofVerts,
        faces: roofFaces,
        color: '#dc2626', // Terracotta Red Roof
      });

      // Chimney on Roof
      parts.push({
        vertices: [
          new THREE.Vector3(0.45, 1.0, -0.4),
          new THREE.Vector3(0.75, 1.0, -0.4),
          new THREE.Vector3(0.75, 1.7, -0.4),
          new THREE.Vector3(0.45, 1.7, -0.4),
          new THREE.Vector3(0.45, 1.0, -0.1),
          new THREE.Vector3(0.75, 1.0, -0.1),
          new THREE.Vector3(0.75, 1.7, -0.1),
          new THREE.Vector3(0.45, 1.7, -0.1),
        ],
        faces: [
          [5, 4, 7], [5, 7, 6],
          [1, 5, 6], [1, 6, 2],
          [3, 2, 6], [3, 6, 7],
        ],
        color: '#7f1d1d', // Dark Brick Chimney
      });

      // Front Door (Warm Wood)
      parts.push({
        vertices: [
          new THREE.Vector3(-0.25, -0.85, 0.86),
          new THREE.Vector3(0.25, -0.85, 0.86),
          new THREE.Vector3(0.25, 0.05, 0.86),
          new THREE.Vector3(-0.25, 0.05, 0.86),
        ],
        faces: [[0, 1, 2], [0, 2, 3]],
        color: '#78350f',
      });
      break;
    }
  }

  return parts;
}

// Fixed Starfield Particles in 3D Space
const NUM_PARTICLES = 36;
const STAR_PARTICLES = Array.from({ length: NUM_PARTICLES }, (_, i) => {
  const theta = (i / NUM_PARTICLES) * Math.PI * 2 + (i % 3) * 0.5;
  const radius = 2.4 + (i % 5) * 0.75;
  const y = ((i % 7) - 3) * 0.65;
  return {
    basePos: new THREE.Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius),
    size: 2.5 + (i % 3) * 1.5,
    speed: 0.006 + (i % 4) * 0.003,
    color: i % 2 === 0 ? '#fde047' : '#38bdf8',
  };
});

export default function Advanced3DGermanWorld({ onFinish, onExit, onClose }) {
  const insets = useSafeAreaInsets();
  const { supportLang, isRTL } = useLanguage();
  const { addXp } = useProgress();
  const { earnCoins } = useGameMode();
  const { isDark } = useAppTheme();

  const handleExit = onExit || onClose || onFinish;

  const safeBottom = insets && typeof insets.bottom === 'number' && !isNaN(insets.bottom) ? insets.bottom : 20;
  const safeTop = insets && typeof insets.top === 'number' && !isNaN(insets.top) ? insets.top : 24;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedGender, setSelectedGender] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  // 3D Engine State
  const rotY = useRef(0);
  const rotX = useRef(0.25);
  const touchStart = useRef({ x: 0, y: 0 });
  const startRot = useRef({ x: 0.25, y: 0 });
  const animTime = useRef(0);
  const [, setTick] = useState(0);

  const currentTarget = QUEST_3D_TARGETS[currentIndex] || QUEST_3D_TARGETS[0];

  // PanResponder to allow full 360-degree touch rotation without blocking button clicks
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 3 || Math.abs(gestureState.dy) > 3,
      onPanResponderGrant: (evt) => {
        touchStart.current = {
          x: evt.nativeEvent.pageX,
          y: evt.nativeEvent.pageY,
        };
        startRot.current = {
          x: rotX.current,
          y: rotY.current,
        };
      },
      onPanResponderMove: (evt) => {
        const dx = evt.nativeEvent.pageX - touchStart.current.x;
        const dy = evt.nativeEvent.pageY - touchStart.current.y;
        rotY.current = startRot.current.y + dx * 0.012;
        rotX.current = Math.max(-0.45, Math.min(0.7, startRot.current.x + dy * 0.009));
      },
    })
  ).current;

  // 60 FPS Render Tick
  useEffect(() => {
    let animationFrameId;
    const updateLoop = () => {
      animTime.current += 0.025;
      rotY.current += 0.005; // Smooth ambient idle spin
      setTick((t) => (t + 1) % 1000000);
      animationFrameId = requestAnimationFrame(updateLoop);
    };
    animationFrameId = requestAnimationFrame(updateLoop);
    return () => {
      cancelAnimationFrame(animationFrameId);
      soundService.stopSpeech();
    };
  }, []);

  const handlePronounce = () => {
    soundService.speakGerman(currentTarget.german);
  };

  const handleSelectGender = (gender) => {
    soundService.stopSpeech();
    setSelectedGender(gender);
    setShowResult(true);

    const isCorrect = gender === currentTarget.gender;
    if (isCorrect) {
      soundService.playSfx('correct');
      soundService.speakGerman(`Richtig! ${currentTarget.german}.`);
      setScore((s) => s + 25);
      addXp(25);
      earnCoins(15);
    } else {
      soundService.playSfx('error');
      soundService.speakGerman(`Nein, ${currentTarget.german}.`);
    }
  };

  const handleNextTarget = () => {
    soundService.stopSpeech();
    soundService.playSfx('tap');
    setSelectedGender(null);
    setShowResult(false);

    if (currentIndex < QUEST_3D_TARGETS.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      soundService.playSfx('levelUp');
      if (handleExit) handleExit();
    }
  };

  // --- THREE.JS 3D MATH PROJECTION ENGINE ---
  const centerX = SCREEN_WIDTH / 2;
  const centerY = SCREEN_HEIGHT * 0.28;
  const focalLength = SCREEN_WIDTH * 0.92;
  const cameraDistance = 5.2;

  // Camera Rotation Matrix from rotX and rotY
  const euler = new THREE.Euler(rotX.current, rotY.current, 0, 'YXZ');
  const rotMatrix = new THREE.Matrix4().makeRotationFromEuler(euler);

  // Directional Light Vector in Camera Space
  const lightVec = new THREE.Vector3(0.45, 0.75, 0.55).normalize();

  // Levitation bobbing & local object spin
  const levitationY = Math.sin(animTime.current * 1.6) * 0.18;
  const localSpinEuler = new THREE.Euler(0, animTime.current * 0.8, 0);
  const localSpinMatrix = new THREE.Matrix4().makeRotationFromEuler(localSpinEuler);

  // Retrieve 3D Model Parts tailored to the current German Question
  const modelParts = get3DModelParts(currentTarget.objectType, animTime.current);

  // Project all faces across all 3D parts
  const allRenderedFaces = [];

  modelParts.forEach((part, partIdx) => {
    const partColor = new THREE.Color(part.color);

    // Project Vertices
    const projectedVerts = part.vertices.map((v) => {
      const local = v.clone().applyMatrix4(localSpinMatrix);
      local.y += levitationY;
      const world = local.applyMatrix4(rotMatrix);
      const zDepth = world.z + cameraDistance;
      const scale = focalLength / Math.max(0.1, zDepth);
      const screenX = centerX + world.x * scale;
      const screenY = centerY - world.y * scale;
      return { x: screenX, y: screenY, z: world.z, worldVec: world };
    });

    // Compute Face Shading & Depth
    part.faces.forEach((faceIndices, faceSubIdx) => {
      const v0 = projectedVerts[faceIndices[0]];
      const v1 = projectedVerts[faceIndices[1]];
      const v2 = projectedVerts[faceIndices[2]];

      if (!v0 || !v1 || !v2) return;

      // Normal Vector using Cross Product: (v1 - v0) x (v2 - v0)
      const edge1 = new THREE.Vector3().subVectors(v1.worldVec, v0.worldVec);
      const edge2 = new THREE.Vector3().subVectors(v2.worldVec, v0.worldVec);
      const normal = new THREE.Vector3().crossVectors(edge1, edge2).normalize();

      // Backface Culling
      if (normal.z <= 0.02) return;

      // Shading calculation
      const dot = Math.max(0, normal.dot(lightVec));
      const intensity = 0.35 + dot * 0.65;
      const shadedColor = partColor.clone().multiplyScalar(intensity);
      const hex = `#${shadedColor.getHexString()}`;
      const avgZ = (v0.z + v1.z + v2.z) / 3;
      const points = `${v0.x.toFixed(1)},${v0.y.toFixed(1)} ${v1.x.toFixed(1)},${v1.y.toFixed(1)} ${v2.x.toFixed(1)},${v2.y.toFixed(1)}`;

      allRenderedFaces.push({
        points,
        avgZ,
        color: hex,
        key: `${partIdx}-${faceSubIdx}`,
      });
    });
  });

  // Sort faces back-to-front (Painter's algorithm)
  allRenderedFaces.sort((a, b) => a.avgZ - b.avgZ);

  // Project 3D Orbiting Star Particles
  const renderedStars = STAR_PARTICLES.map((star, idx) => {
    const orbitAngle = animTime.current * star.speed + idx;
    const orbX = Math.cos(orbitAngle) * star.basePos.x - Math.sin(orbitAngle) * star.basePos.z;
    const orbZ = Math.sin(orbitAngle) * star.basePos.x + Math.cos(orbitAngle) * star.basePos.z;
    const pos = new THREE.Vector3(orbX, star.basePos.y, orbZ).applyMatrix4(rotMatrix);
    const zDepth = pos.z + cameraDistance;
    const scale = focalLength / Math.max(0.1, zDepth);
    const px = centerX + pos.x * scale;
    const py = centerY - pos.y * scale;
    const size = Math.max(1.2, star.size * (scale / (focalLength / cameraDistance)));
    const opacity = Math.max(0.25, Math.min(1.0, (pos.z + 3) / 5));
    return { px, py, size, opacity, color: star.color, key: idx };
  });

  // Project 3D Floating Island Platform (Below Model)
  const islandY = -1.55;
  const islandCenter = new THREE.Vector3(0, islandY, 0).applyMatrix4(rotMatrix);
  const islandZDepth = islandCenter.z + cameraDistance;
  const islandScale = focalLength / Math.max(0.1, islandZDepth);
  const islandScreenX = centerX + islandCenter.x * islandScale;
  const islandScreenY = centerY - islandCenter.y * islandScale;

  // Island 3D Tilt Radii
  const rxOuter = 160 * (islandScale / 100);
  const ryOuter = Math.max(24, rxOuter * Math.max(0.2, Math.sin(rotX.current + 0.65)));
  const rxInner = rxOuter * 0.7;
  const ryInner = ryOuter * 0.7;

  const isCorrect = selectedGender === currentTarget.gender;

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleExit}
    >
      <View style={styles.fullScreenContainer} {...panResponder.panHandlers}>
        <StatusBar barStyle="light-content" backgroundColor="#050A14" />

        {/* 1. UNIVERSAL THREE.JS 3D CANVAS TAKING ENTIRE SCREEN */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT} style={StyleSheet.absoluteFill}>
            <Defs>
              <RadialGradient id="bgGlow" cx="50%" cy="40%" r="60%">
                <Stop offset="0%" stopColor={currentTarget.colorHex} stopOpacity="0.32" />
                <Stop offset="45%" stopColor="#0B132B" stopOpacity="0.85" />
                <Stop offset="100%" stopColor="#050A14" stopOpacity="1" />
              </RadialGradient>
              <SvgGradient id="islandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#334155" stopOpacity="0.95" />
                <Stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
              </SvgGradient>
              <SvgGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor={currentTarget.colorHex} stopOpacity="0.9" />
                <Stop offset="50%" stopColor="#fde047" stopOpacity="0.8" />
                <Stop offset="100%" stopColor={currentTarget.colorHex} stopOpacity="0.9" />
              </SvgGradient>
            </Defs>

            {/* Deep Space Atmosphere Solid Background & Radial Glow */}
            <Rect x={0} y={0} width={SCREEN_WIDTH} height={SCREEN_HEIGHT} fill="#050A14" />
            <Rect x={0} y={0} width={SCREEN_WIDTH} height={SCREEN_HEIGHT} fill="url(#bgGlow)" />

            {/* Background Orbiting 3D Stars */}
            {renderedStars.map((star) => (
              <Circle
                key={star.key}
                cx={star.px}
                cy={star.py}
                r={star.size}
                fill={star.color}
                opacity={star.opacity}
              />
            ))}

            {/* 3D Floating Island Platform Base */}
            <G>
              {/* Island Depth Shadow */}
              <Ellipse
                cx={islandScreenX}
                cy={islandScreenY + 16}
                rx={rxOuter * 0.95}
                ry={ryOuter * 0.95}
                fill="#020617"
                opacity="0.75"
              />
              {/* Outer Glowing Concentric Energy Ring */}
              <Ellipse
                cx={islandScreenX}
                cy={islandScreenY}
                rx={rxOuter * 1.14}
                ry={ryOuter * 1.14}
                fill="none"
                stroke="url(#ringGrad)"
                strokeWidth="2.5"
                opacity="0.85"
              />
              {/* Island Faceted Platform Disk */}
              <Ellipse
                cx={islandScreenX}
                cy={islandScreenY}
                rx={rxOuter}
                ry={ryOuter}
                fill="url(#islandGrad)"
                stroke={currentTarget.colorHex}
                strokeWidth="1.5"
              />
              {/* Inner Concentric Energy Ring */}
              <Ellipse
                cx={islandScreenX}
                cy={islandScreenY}
                rx={rxInner}
                ry={ryInner}
                fill="none"
                stroke={currentTarget.colorHex}
                strokeWidth="2"
                strokeDasharray="6, 4"
                opacity="0.9"
              />
              {/* Central Core Energy Beam */}
              <Ellipse
                cx={islandScreenX}
                cy={islandScreenY}
                rx={rxInner * 0.35}
                ry={ryInner * 0.35}
                fill={currentTarget.colorHex}
                opacity="0.4"
              />
            </G>

            {/* 3D Question-Specific German Object (Apple, Sun, Book, Dog, Flower, House) */}
            <G>
              {allRenderedFaces.map((face) => (
                <Polygon
                  key={face.key}
                  points={face.points}
                  fill={face.color}
                  stroke="#FFFFFF"
                  strokeWidth="0.5"
                  strokeOpacity="0.35"
                />
              ))}
            </G>
          </Svg>
        </View>

        {/* 2. FLOATING TOP HUD */}
        <View
          style={[
            styles.topHudContainer,
            {
              top: Math.max(safeTop, Platform.OS === 'ios' ? 50 : 24),
              flexDirection: isRTL ? 'row-reverse' : 'row',
            },
          ]}
        >
          {/* Back / Exit Button */}
          <TouchableOpacity
            style={styles.exitBtn}
            onPress={() => {
              soundService.playSfx('tap');
              if (handleExit) handleExit();
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.exitBtnText}>✕ Exit</Text>
          </TouchableOpacity>

          {/* 3D Quest Title & Level Pill */}
          <View style={styles.titlePill}>
            <Text style={styles.titleBadge}>🎮 3D GERMAN WORLD</Text>
            <Text style={styles.titleText}>
              {currentIndex + 1} / {QUEST_3D_TARGETS.length}
            </Text>
          </View>

          {/* Score & Sound Controls */}
          <View style={styles.topRightRow}>
            <View style={styles.scorePill}>
              <Text style={styles.scorePillText}>⭐ {score}</Text>
            </View>

            <TouchableOpacity
              style={styles.soundPill}
              onPress={handlePronounce}
              activeOpacity={0.8}
            >
              <Text style={styles.soundPillText}>🔊</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. FLOATING ROTATION HINT */}
        <View style={styles.orbitHintContainer} pointerEvents="none">
          <View style={styles.orbitHintPill}>
            <Text style={styles.orbitHintText}>🔄 Swipe anywhere to rotate 3D model (360°)</Text>
          </View>
        </View>

        {/* 4. FLOATING GLASSMORPHIC QUESTION & SCAFFOLDING CARD */}
        <View style={[styles.bottomCardWrapper, { bottom: Math.max(safeBottom + 14, 28) }]}>
          <View
            style={[
              styles.glassCard,
              {
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.94)' : 'rgba(255, 255, 255, 0.96)',
                borderColor: isDark ? '#334155' : '#CBD5E1',
              },
            ]}
          >
            {/* Direct German Question Prompt Banner */}
            <View style={styles.questionBanner}>
              <Text style={styles.questionBadge}>❓ DEUTSCH QUEST FRAGE</Text>
              <Text
                style={[
                  styles.questionText,
                  { color: isDark ? '#F1F5F9' : '#0F172A', textAlign: isRTL ? 'right' : 'left' },
                ]}
              >
                {supportLang === 'ar' ? currentTarget.questionAr : currentTarget.questionEn}
              </Text>
            </View>

            {/* Header row with German Word & Audio */}
            <View style={[styles.wordRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.targetGerman, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  {currentTarget.german}
                </Text>
                <Text style={[styles.targetPlural, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Plural: {currentTarget.plural}
                </Text>
              </View>

              <TouchableOpacity style={styles.audioBtn} onPress={handlePronounce} activeOpacity={0.8}>
                <Text style={styles.audioBtnIcon}>🔊</Text>
              </TouchableOpacity>
            </View>

            {/* Side-by-Side Dual Scaffolding: English & Arabic 🇪🇬 */}
            <View
              style={[
                styles.dualBox,
                {
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                  borderColor: isDark ? '#334155' : '#E2E8F0',
                },
              ]}
            >
              <View style={styles.langCol}>
                <Text style={[styles.flagLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  🇬🇧 English
                </Text>
                <Text style={[styles.langText, { color: isDark ? '#F8FAFC' : '#1E2638' }]}>
                  {currentTarget.english}
                </Text>
                <Text style={[styles.hintSub, { color: isDark ? '#64748B' : '#94A3B8' }]}>
                  {currentTarget.hintEn}
                </Text>
              </View>

              <View style={[styles.divider, { backgroundColor: isDark ? '#334155' : '#CBD5E1' }]} />

              <View style={styles.langCol}>
                <Text style={[styles.flagLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  🇪🇬 العربية
                </Text>
                <Text style={[styles.langText, { color: isDark ? '#F8FAFC' : '#1E2638' }]}>
                  {currentTarget.arabic}
                </Text>
                <Text style={[styles.hintSub, { color: isDark ? '#64748B' : '#94A3B8' }]}>
                  {currentTarget.hintAr}
                </Text>
              </View>
            </View>

            {/* Interactive Gender Selection (der / die / das) */}
            {!showResult ? (
              <View style={styles.genderRow}>
                <TouchableOpacity
                  style={[styles.genderBtn, styles.btnDer]}
                  onPress={() => handleSelectGender('der')}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.genderTitle, { color: isDark ? '#38BDF8' : '#0284C7' }]}>
                    der
                  </Text>
                  <Text style={[styles.genderSubtitle, { color: isDark ? '#CBD5E1' : '#475569' }]}>
                    Maskulin 🔵
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.genderBtn, styles.btnDie]}
                  onPress={() => handleSelectGender('die')}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.genderTitle, { color: isDark ? '#FF6B55' : '#DC2626' }]}>
                    die
                  </Text>
                  <Text style={[styles.genderSubtitle, { color: isDark ? '#CBD5E1' : '#475569' }]}>
                    Feminin 🔴
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.genderBtn, styles.btnDas]}
                  onPress={() => handleSelectGender('das')}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.genderTitle, { color: isDark ? '#34D399' : '#059669' }]}>
                    das
                  </Text>
                  <Text style={[styles.genderSubtitle, { color: isDark ? '#CBD5E1' : '#475569' }]}>
                    Neutrum 🟢
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={[
                  styles.resultCard,
                  isCorrect ? styles.resultSuccess : styles.resultError,
                ]}
              >
                <View style={styles.resultHeader}>
                  <Text style={styles.resultEmoji}>{isCorrect ? '🎉' : '💡'}</Text>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.resultTitle,
                        { color: isCorrect ? '#059669' : '#DC2626' },
                      ]}
                    >
                      {isCorrect
                        ? supportLang === 'ar' ? 'ممتاز! إجابة صحيحة' : 'Ausgezeichnet! Correct!'
                        : supportLang === 'ar' ? 'توضيح القاعدة:' : 'Grammar Note:'}
                    </Text>
                    <Text style={[styles.resultExplain, { color: isDark ? '#E2E8F0' : '#334155' }]}>
                      {currentTarget.casePrompt}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.continueBtn}
                  onPress={handleNextTarget}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={isCorrect ? ['#10B981', '#059669'] : ['#6366F1', '#4F46E5']}
                    style={styles.continueGradient}
                  >
                    <Text style={styles.continueText}>
                      {supportLang === 'ar' ? 'السؤال التالي ➔' : 'Next 3D Question ➔'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#050A14',
    zIndex: 9999,
  },
  topHudContainer: {
    position: 'absolute',
    left: 14,
    right: 14,
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
  },
  exitBtn: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  exitBtnText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '800',
  },
  titlePill: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  titleBadge: {
    fontSize: 10,
    fontWeight: '900',
    color: '#38BDF8',
    letterSpacing: 0.5,
  },
  titleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  topRightRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  scorePill: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(249, 184, 69, 0.4)',
  },
  scorePillText: {
    color: '#FBBF24',
    fontSize: 12,
    fontWeight: '900',
  },
  soundPill: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  soundPillText: {
    fontSize: 14,
  },
  orbitHintContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 104 : 74,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 90,
  },
  orbitHintPill: {
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  orbitHintText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '700',
  },
  bottomCardWrapper: {
    position: 'absolute',
    left: 14,
    right: 14,
    zIndex: 100,
  },
  glassCard: {
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
    gap: 10,
  },
  questionBanner: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#38BDF8',
    gap: 2,
  },
  questionBadge: {
    fontSize: 10,
    fontWeight: '900',
    color: '#38BDF8',
    letterSpacing: 0.5,
  },
  questionText: {
    fontSize: 13,
    fontWeight: '800',
  },
  wordRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  targetGerman: {
    fontSize: 22,
    fontWeight: '900',
  },
  targetPlural: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 1,
  },
  audioBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FF6B55',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B55',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  audioBtnIcon: {
    fontSize: 18,
  },
  dualBox: {
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  langCol: {
    flex: 1,
    gap: 1,
  },
  divider: {
    width: 1,
    marginHorizontal: 10,
  },
  flagLabel: {
    fontSize: 10,
    fontWeight: '800',
  },
  langText: {
    fontSize: 13,
    fontWeight: '900',
  },
  hintSub: {
    fontSize: 10,
    fontWeight: '600',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  genderBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 2,
  },
  btnDer: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: '#38BDF8',
  },
  btnDie: {
    backgroundColor: 'rgba(255, 107, 85, 0.15)',
    borderColor: '#FF6B55',
  },
  btnDas: {
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    borderColor: '#34D399',
  },
  genderTitle: {
    fontSize: 17,
    fontWeight: '900',
  },
  genderSubtitle: {
    fontSize: 10,
    fontWeight: '800',
  },
  resultCard: {
    borderRadius: 14,
    padding: 10,
    gap: 8,
  },
  resultSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  resultError: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resultEmoji: {
    fontSize: 20,
  },
  resultTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  resultExplain: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  continueBtn: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  continueGradient: {
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});

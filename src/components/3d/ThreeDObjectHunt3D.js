// ============================================================
// GAME 2: 3D RESTAURANT OBJECT HUNT (THREE.JS WEBGL)
// True 3D Room / Table environment with 360° Touch Orbit
// Interactive 3D German objects: das Glas, der Kaffee,
// die Speisekarte, das Wasser, die Pizza
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PanResponder,
  Modal,
} from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { LinearGradient } from 'expo-linear-gradient';

import { THEME } from '../../styles/theme';
import { OBJECT_HUNT_ITEMS } from '../../../data/gamesData';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import { useGameMode } from '../../context/GameModeContext';
import { useAppTheme } from '../../context/ThemeContext';
import soundService from '../../services/soundService';

export default function ThreeDObjectHunt3D({ visible = true, onClose, onFinish, onExit }) {
  const { supportLang, isRTL } = useLanguage();
  const { addXp } = useProgress();
  const { earnCoins } = useGameMode();
  const { isDark, colors } = useAppTheme();

  const handleExit = onClose || onExit || onFinish;

  const [targetIndex, setTargetIndex] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [foundIds, setFoundIds] = useState([]);
  const [score, setScore] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const targetItem = OBJECT_HUNT_ITEMS[targetIndex] || OBJECT_HUNT_ITEMS[0];
  const isFound = selectedItemId === targetItem.id;

  // Touch orbit gesture refs
  const touchRotation = useRef({ x: 0.35, y: 0 });
  const touchStart = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0.35, y: 0 });
  const animationFrameId = useRef(null);
  const objectsInScene = useRef([]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        touchStart.current = {
          x: evt.nativeEvent.pageX,
          y: evt.nativeEvent.pageY,
        };
      },
      onPanResponderMove: (evt) => {
        const deltaX = evt.nativeEvent.pageX - touchStart.current.x;
        const deltaY = evt.nativeEvent.pageY - touchStart.current.y;
        currentRotation.current = {
          x: Math.max(0.1, Math.min(0.8, touchRotation.current.x + deltaY * 0.003)),
          y: touchRotation.current.y + deltaX * 0.006,
        };
      },
      onPanResponderRelease: () => {
        touchRotation.current = { ...currentRotation.current };
      },
    })
  ).current;

  // Auto-pronounce German target on target switch
  useEffect(() => {
    if (!isAudioMuted && targetItem?.name) {
      soundService.speakGerman(targetItem.name);
    }
  }, [targetIndex, isAudioMuted]);

  // Handle WebGL Three.js Context
  const onContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark ? 0x070d1a : 0x0f172a);
    scene.fog = new THREE.FogExp2(isDark ? 0x070d1a : 0x0f172a, 0.04);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 3.8, 6.5);
    camera.lookAt(0, 0.5, 0);

    // 3. Renderer
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const warmLight = new THREE.PointLight(0xffa255, 1.8, 12);
    warmLight.position.set(2, 4, 3);
    scene.add(warmLight);

    const blueLight = new THREE.PointLight(0x38bdf8, 1.2, 12);
    blueLight.position.set(-3, 3, -2);
    scene.add(blueLight);

    // 5. 3D Restaurant Table (Polygonal Wood Cylinder)
    const tableTopGeo = new THREE.CylinderGeometry(2.4, 2.4, 0.15, 32);
    const tableTopMat = new THREE.MeshStandardMaterial({
      color: 0x3d2714,
      roughness: 0.4,
      metalness: 0.2,
    });
    const tableTop = new THREE.Mesh(tableTopGeo, tableTopMat);
    tableTop.position.y = 0.5;
    scene.add(tableTop);

    // Table Rim Glow Ring
    const rimGeo = new THREE.TorusGeometry(2.42, 0.03, 16, 64);
    const rimMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.52;
    scene.add(rim);

    // Table Leg
    const legGeo = new THREE.CylinderGeometry(0.25, 0.35, 2.0, 16);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1f140a, roughness: 0.7 });
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.y = -0.5;
    scene.add(leg);

    // Table Base
    const baseGeo = new THREE.CylinderGeometry(1.2, 1.3, 0.1, 24);
    const base = new THREE.Mesh(baseGeo, legMat);
    base.position.y = -1.5;
    scene.add(base);

    // 6. 3D Procedural Restaurant Objects
    const itemsGroup = new THREE.Group();
    scene.add(itemsGroup);
    objectsInScene.current = [];

    // Item 1: das Glas (Drinking Glass)
    const glassGeo = new THREE.CylinderGeometry(0.22, 0.16, 0.65, 18);
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x67e8f9,
      transparent: true,
      opacity: 0.65,
      roughness: 0.1,
      metalness: 0.1,
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.set(-1.1, 0.9, 0.4);
    itemsGroup.add(glassMesh);
    objectsInScene.current.push({ id: 'das_glas', mesh: glassMesh });

    // Item 2: der Kaffee (Coffee Mug)
    const cupGroup = new THREE.Group();
    const mugGeo = new THREE.CylinderGeometry(0.24, 0.2, 0.45, 18);
    const mugMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 });
    const mugMesh = new THREE.Mesh(mugGeo, mugMat);
    cupGroup.add(mugMesh);

    const handleGeo = new THREE.TorusGeometry(0.12, 0.04, 8, 16, Math.PI);
    const handle = new THREE.Mesh(handleGeo, mugMat);
    handle.position.set(0.24, 0, 0);
    handle.rotation.z = -Math.PI / 2;
    cupGroup.add(handle);

    cupGroup.position.set(0.9, 0.8, 0.6);
    itemsGroup.add(cupGroup);
    objectsInScene.current.push({ id: 'der_kaffee', mesh: cupGroup });

    // Item 3: die Pizza (Pizza Plate + Slice)
    const pizzaGroup = new THREE.Group();
    const plateGeo = new THREE.CylinderGeometry(0.5, 0.48, 0.04, 24);
    const plateMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    pizzaGroup.add(plate);

    const crustGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.03, 16);
    const crustMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.6 });
    const crust = new THREE.Mesh(crustGeo, crustMat);
    crust.position.y = 0.03;
    pizzaGroup.add(crust);

    // Pepperoni spots
    [-0.15, 0.15, 0].forEach((px, i) => {
      const pepGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.035, 10);
      const pepMat = new THREE.MeshStandardMaterial({ color: 0xdc2626 });
      const pep = new THREE.Mesh(pepGeo, pepMat);
      pep.position.set(px, 0.04, (i % 2 === 0 ? 0.12 : -0.12));
      pizzaGroup.add(pep);
    });

    pizzaGroup.position.set(0, 0.6, -1.0);
    itemsGroup.add(pizzaGroup);
    objectsInScene.current.push({ id: 'die_pizza', mesh: pizzaGroup });

    // Item 4: die Speisekarte (Menu Slab)
    const menuGeo = new THREE.BoxGeometry(0.45, 0.65, 0.04);
    const menuMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.4 });
    const menuMesh = new THREE.Mesh(menuGeo, menuMat);
    menuMesh.position.set(-0.9, 0.88, -0.6);
    menuMesh.rotation.y = 0.4;
    menuMesh.rotation.x = -0.2;
    itemsGroup.add(menuMesh);
    objectsInScene.current.push({ id: 'die_speisekarte', mesh: menuMesh });

    // Item 5: das Wasser (Water Bottle)
    const bottleGroup = new THREE.Group();
    const bodyGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.7, 16);
    const bottleMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.7,
      roughness: 0.1,
    });
    const bottleMesh = new THREE.Mesh(bodyGeo, bottleMat);
    bottleGroup.add(bottleMesh);

    const neckGeo = new THREE.CylinderGeometry(0.08, 0.14, 0.25, 16);
    const neck = new THREE.Mesh(neckGeo, bottleMat);
    neck.position.y = 0.45;
    bottleGroup.add(neck);

    const capGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.08, 12);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x2563eb });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 0.6;
    bottleGroup.add(cap);

    bottleGroup.position.set(1.0, 0.95, -0.5);
    itemsGroup.add(bottleGroup);
    objectsInScene.current.push({ id: 'das_wasser', mesh: bottleGroup });

    // 7. Ambient Floating Dust Motes
    const starCount = 80;
    const starGeo = new THREE.BufferGeometry();
    const starCoords = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starCoords[i] = (Math.random() - 0.5) * 10;
      starCoords[i + 1] = Math.random() * 5 - 1;
      starCoords[i + 2] = (Math.random() - 0.5) * 10;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starCoords, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.06,
      transparent: true,
      opacity: 0.7,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // 8. Animation Loop with smooth 360° touch rotation
    let clock = new THREE.Clock();
    const render = () => {
      animationFrameId.current = requestAnimationFrame(render);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Orbit Camera Calculation
      const targetCamY = 1.5 + currentRotation.current.x * 4.5;
      const targetRadius = 5.5;
      const targetCamX = Math.sin(currentRotation.current.y) * targetRadius;
      const targetCamZ = Math.cos(currentRotation.current.y) * targetRadius;

      camera.position.x += (targetCamX - camera.position.x) * 0.1;
      camera.position.y += (targetCamY - camera.position.y) * 0.1;
      camera.position.z += (targetCamZ - camera.position.z) * 0.1;
      camera.lookAt(0, 0.6, 0);

      // Idle bobbing for items
      itemsGroup.children.forEach((item, index) => {
        item.position.y += Math.sin(elapsedTime * 2 + index) * 0.0008;
      });

      // Ambient dust drift
      stars.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    render();
  };

  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const handleSelectObject = (item) => {
    setSelectedItemId(item.id);
    soundService.playSfx('tap');

    const isCorrect = item.id === targetItem.id;
    if (isCorrect) {
      soundService.playSfx('correct');
      soundService.speakGerman(item.name);
      if (!foundIds.includes(item.id)) {
        setFoundIds((prev) => [...prev, item.id]);
        setScore((prev) => prev + 25);
        addXp(25);
        earnCoins(10);
      }
    } else {
      soundService.playSfx('wrong');
    }
  };

  const handleNextTarget = () => {
    setSelectedItemId(null);
    if (targetIndex < OBJECT_HUNT_ITEMS.length - 1) {
      setTargetIndex((prev) => prev + 1);
    } else {
      soundService.playSfx('complete');
      if (onFinish) onFinish();
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade" statusBarTranslucent onRequestClose={handleExit}>
      <View style={styles.fullScreenContainer}>
        {/* Full-Screen WebGL Canvas with Touch Responder */}
        <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers}>
          <GLView style={StyleSheet.absoluteFill} onContextCreate={onContextCreate} />
        </View>

        {/* Top Floating Glass HUD */}
        <View style={[styles.topHud, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity
            style={styles.exitBtn}
            onPress={() => {
              soundService.playSfx('tap');
              if (handleExit) handleExit();
            }}
          >
            <Text style={styles.exitBtnText}>✕ Exit</Text>
          </TouchableOpacity>

          <View style={styles.modeBadge}>
            <Text style={styles.modeBadgeText}>
              🍽️ 3D ROOM HUNT {foundIds.length}/{OBJECT_HUNT_ITEMS.length}
            </Text>
          </View>

          <View style={styles.hudRightRow}>
            <View style={styles.xpPill}>
              <Text style={styles.xpPillText}>⭐ {score}</Text>
            </View>
            <TouchableOpacity
              style={styles.soundPill}
              onPress={() => setIsAudioMuted((prev) => !prev)}
            >
              <Text style={styles.soundEmoji}>{isAudioMuted ? '🔇' : '🔊'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Floating Instructions Pill */}
        <View style={styles.instructionFloatingPill}>
          <Text style={styles.instructionText}>
            🔄 Drag 360° to rotate room • Tap 3D items below
          </Text>
        </View>

        {/* Bottom Floating Mission Glass Card */}
        <View style={styles.bottomSheetWrapper}>
          <View
            style={[
              styles.glassCard,
              {
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.94)',
                borderColor: isDark ? '#334155' : '#E2E8F0',
              },
            ]}
          >
            {/* Target Header */}
            <View style={[styles.targetHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.missionTargetTag}>
                  {supportLang === 'ar' ? '🔍 ابحث عن هذا الشيء في المطعم:' : '🔍 Mission: Find this object:'}
                </Text>
                <Text style={[styles.targetGermanWord, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  {targetItem.name}
                </Text>
                <Text style={styles.targetTranslation}>
                  🇬🇧 {targetItem.english} • 🇪🇬 {targetItem.arabic}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.audioPlayBtn}
                onPress={() => soundService.speakGerman(targetItem.name)}
              >
                <Text style={styles.audioPlayIcon}>🔊</Text>
              </TouchableOpacity>
            </View>

            {/* 3D Item Identification Chips */}
            <View style={styles.itemsGrid}>
              {OBJECT_HUNT_ITEMS.map((item) => {
                const isSelected = selectedItemId === item.id;
                const isItemFound = foundIds.includes(item.id);

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.itemChip,
                      {
                        backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                        borderColor: isSelected
                          ? isFound ? '#10B981' : '#EF4444'
                          : isDark ? '#334155' : '#CBD5E1',
                      },
                      isSelected && (isFound ? styles.chipSuccess : styles.chipError),
                    ]}
                    onPress={() => handleSelectObject(item)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.chipEmoji}>{item.emoji || '🍽️'}</Text>
                    <Text
                      style={[
                        styles.chipLabel,
                        { color: isDark ? '#F8FAFC' : '#1E293B' },
                      ]}
                    >
                      {item.name}
                    </Text>
                    {isItemFound && <Text style={styles.checkMark}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Answer Result Banner */}
            {selectedItemId && (
              <View
                style={[
                  styles.resultBanner,
                  isFound ? styles.resultSuccess : styles.resultError,
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.resultTitle, { color: isFound ? '#059669' : '#DC2626' }]}>
                    {isFound
                      ? supportLang === 'ar' ? '🎉 ممتاز! وجدت العنصر الصحيح (+25 XP)' : '🎉 Correct! Object identified (+25 XP)'
                      : supportLang === 'ar' ? '❌ هذا عنصر آخر، جرب مرة أخرى!' : '❌ Not that one, look closer!'}
                  </Text>
                  <Text style={[styles.resultHint, { color: isDark ? '#CBD5E1' : '#475569' }]}>
                    {targetItem.hint}
                  </Text>
                </View>

                {isFound && (
                  <TouchableOpacity style={styles.nextTargetBtn} onPress={handleNextTarget}>
                    <Text style={styles.nextTargetBtnText}>Next ➔</Text>
                  </TouchableOpacity>
                )}
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#070D1A',
    zIndex: 9999,
  },
  topHud: {
    position: 'absolute',
    top: 16,
    left: 14,
    right: 14,
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
  },
  exitBtn: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  exitBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  modeBadge: {
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  modeBadgeText: {
    color: '#FBBF24',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  hudRightRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  xpPill: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  xpPillText: {
    color: '#FBBF24',
    fontWeight: '900',
    fontSize: 12,
  },
  soundPill: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  soundEmoji: {
    fontSize: 16,
  },
  instructionFloatingPill: {
    position: 'absolute',
    top: 72,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    zIndex: 100,
  },
  instructionText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  bottomSheetWrapper: {
    position: 'absolute',
    bottom: 16,
    left: 14,
    right: 14,
    zIndex: 100,
  },
  glassCard: {
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
    gap: 12,
  },
  targetHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  missionTargetTag: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F59E0B',
    marginBottom: 2,
  },
  targetGermanWord: {
    fontSize: 22,
    fontWeight: '900',
  },
  targetTranslation: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
  audioPlayBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF6B55',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B55',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  audioPlayIcon: {
    fontSize: 20,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  itemChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 6,
  },
  chipEmoji: {
    fontSize: 16,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '800',
  },
  checkMark: {
    color: '#10B981',
    fontWeight: '900',
    fontSize: 13,
  },
  chipSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10B981',
  },
  chipError: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderColor: '#EF4444',
  },
  resultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  resultSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10B981',
  },
  resultError: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#EF4444',
  },
  resultTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  resultHint: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  nextTargetBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  nextTargetBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
  },
});

// ============================================================
// GAME 5: 3D SENTENCE BUILDER TOWER BRIDGE (THREE.JS WEBGL)
// 3D Architectural Bridge with physical snap-in 3D Word Blocks
// Teaches German Verb-Second (V2) & Subordinate Clause Rules
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
  Modal,
} from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';

import { THEME } from '../../styles/theme';
import { SENTENCE_BUILDER_ITEMS } from '../../../data/gamesData';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import { useAppTheme } from '../../context/ThemeContext';
import soundService from '../../services/soundService';

export default function SentenceBuilder3D({ visible = true, onClose, onFinish, onExit }) {
  const { supportLang, isRTL } = useLanguage();
  const { addXp } = useProgress();
  const { isDark, colors } = useAppTheme();

  const handleExit = onClose || onExit || onFinish;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [placedChips, setPlacedChips] = useState([]);
  const [availableChips, setAvailableChips] = useState(() =>
    [...SENTENCE_BUILDER_ITEMS[0].chips].sort(() => Math.random() - 0.5)
  );
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const currentItem = SENTENCE_BUILDER_ITEMS[currentIndex] || SENTENCE_BUILDER_ITEMS[0];

  // Touch gesture refs
  const touchRotation = useRef({ x: 0.35, y: 0 });
  const touchStart = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0.35, y: 0 });
  const animationFrameId = useRef(null);
  const bridgeBlocksRef = useRef([]);
  const sceneRef = useRef(null);

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

  // Sync available chips when item changes
  useEffect(() => {
    setPlacedChips([]);
    setAvailableChips([...currentItem.chips].sort(() => Math.random() - 0.5));
    setIsChecked(false);
    setIsCorrect(false);
  }, [currentIndex]);

  // Handle WebGL Context
  const onContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark ? 0x060c18 : 0x0f172a);
    scene.fog = new THREE.FogExp2(isDark ? 0x060c18 : 0x0f172a, 0.035);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 4.2, 7.8);
    camera.lookAt(0, 0.8, 0);

    // 3. Renderer
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const goldLight = new THREE.PointLight(0xf59e0b, 1.8, 14);
    goldLight.position.set(-3, 5, 4);
    scene.add(goldLight);

    const blueLight = new THREE.PointLight(0x38bdf8, 1.8, 14);
    blueLight.position.set(3, 5, -3);
    scene.add(blueLight);

    // 5. 3D Architectural Bridge Structure (The German Sentence Grid)
    const bridgeGeo = new THREE.BoxGeometry(7.2, 0.3, 2.2);
    const bridgeMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.4,
      metalness: 0.5,
    });
    const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
    bridge.position.y = 0;
    scene.add(bridge);

    // Bridge Side Railings with Neon Lights
    [-1.0, 1.0].forEach((zPos) => {
      const railGeo = new THREE.BoxGeometry(7.2, 0.1, 0.06);
      const railMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const rail = new THREE.Mesh(railGeo, railMat);
      rail.position.set(0, 0.3, zPos);
      scene.add(rail);
    });

    // 6. 3D Modular Sentence Blocks (Slots along the bridge)
    const blocksGroup = new THREE.Group();
    scene.add(blocksGroup);
    bridgeBlocksRef.current = [];

    const slotCount = 6;
    for (let i = 0; i < slotCount; i++) {
      const xPos = (i - 2.5) * 1.1;
      const blockGeo = new THREE.BoxGeometry(0.9, 0.45, 0.9);
      const blockMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.3,
        metalness: 0.4,
        transparent: true,
        opacity: 0.5,
      });
      const blockMesh = new THREE.Mesh(blockGeo, blockMat);
      blockMesh.position.set(xPos, 0.35, 0);

      // Block outline ring
      const outlineGeo = new THREE.BoxGeometry(0.95, 0.05, 0.95);
      const outlineMat = new THREE.MeshBasicMaterial({ color: 0x64748b });
      const outline = new THREE.Mesh(outlineGeo, outlineMat);
      outline.position.y = 0.23;
      blockMesh.add(outline);

      blocksGroup.add(blockMesh);
      bridgeBlocksRef.current.push({ mesh: blockMesh, outline, active: false });
    }

    // 7. Ambient Energy Particles
    const partCount = 100;
    const partGeo = new THREE.BufferGeometry();
    const partCoords = new Float32Array(partCount * 3);
    for (let i = 0; i < partCount * 3; i += 3) {
      partCoords[i] = (Math.random() - 0.5) * 12;
      partCoords[i + 1] = Math.random() * 5 - 1;
      partCoords[i + 2] = (Math.random() - 0.5) * 12;
    }
    partGeo.setAttribute('position', new THREE.BufferAttribute(partCoords, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.06,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    // 8. Animation Loop
    let clock = new THREE.Clock();
    const render = () => {
      animationFrameId.current = requestAnimationFrame(render);
      const elapsedTime = clock.getElapsedTime();

      // Camera Orbit
      const targetCamY = 1.8 + currentRotation.current.x * 4.5;
      const targetRadius = 7.0;
      const targetCamX = Math.sin(currentRotation.current.y) * targetRadius;
      const targetCamZ = Math.cos(currentRotation.current.y) * targetRadius;

      camera.position.x += (targetCamX - camera.position.x) * 0.1;
      camera.position.y += (targetCamY - camera.position.y) * 0.1;
      camera.position.z += (targetCamZ - camera.position.z) * 0.1;
      camera.lookAt(0, 0.8, 0);

      // Pulse active placed blocks
      bridgeBlocksRef.current.forEach((b, idx) => {
        if (b.active) {
          b.mesh.position.y = 0.35 + Math.sin(elapsedTime * 3 + idx) * 0.05;
        } else {
          b.mesh.position.y = 0.35;
        }
      });

      // Drift particles
      particles.rotation.y = elapsedTime * 0.03;

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

  // Update 3D blocks when chips change
  useEffect(() => {
    bridgeBlocksRef.current.forEach((b, idx) => {
      if (idx < placedChips.length) {
        b.active = true;
        b.mesh.material.opacity = 0.95;
        b.mesh.material.color.set(isCorrect ? 0x10b981 : 0x38bdf8);
        b.outline.material.color.set(isCorrect ? 0x34d399 : 0x0284c7);
      } else {
        b.active = false;
        b.mesh.material.opacity = 0.4;
        b.mesh.material.color.set(0x0f172a);
        b.outline.material.color.set(0x64748b);
      }
    });
  }, [placedChips, isCorrect]);

  const handleAddChip = (chip, index) => {
    if (isChecked) return;
    soundService.playSfx('tap');
    setPlacedChips((prev) => [...prev, chip]);
    setAvailableChips((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleRemoveChip = (chip, index) => {
    if (isChecked) return;
    soundService.playSfx('tap');
    setPlacedChips((prev) => prev.filter((_, idx) => idx !== index));
    setAvailableChips((prev) => [...prev, chip]);
  };

  const handleCheckSentence = () => {
    if (isChecked || placedChips.length === 0) return;
    const userSentence = placedChips.join(' ');
    const correct =
      userSentence.toLowerCase().trim() ===
      currentItem.targetSentence.toLowerCase().replace('.', '').trim();

    setIsChecked(true);
    setIsCorrect(correct);

    if (correct) {
      soundService.playSfx('correct');
      soundService.speakGerman(currentItem.targetSentence);
      setScore((prev) => prev + 30);
      addXp(30);
    } else {
      soundService.playSfx('wrong');
    }
  };

  const handleNext = () => {
    if (currentIndex < SENTENCE_BUILDER_ITEMS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      soundService.playSfx('complete');
      if (onFinish) onFinish();
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade" statusBarTranslucent onRequestClose={handleExit}>
      <View style={styles.fullScreenContainer}>
        {/* Full-Screen WebGL Canvas */}
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
              🌉 3D TOWER BUILDER {currentIndex + 1}/{SENTENCE_BUILDER_ITEMS.length}
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

        {/* Floating Instruction */}
        <View style={styles.instructionPill}>
          <Text style={styles.instructionText}>
            🔄 Drag 360° to rotate bridge • Construct German sentence in 3D
          </Text>
        </View>

        {/* Bottom Floating Sentence Builder Workstation */}
        <View style={styles.bottomSheetWrapper}>
          <View
            style={[
              styles.glassCard,
              {
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.94)' : 'rgba(255, 255, 255, 0.95)',
                borderColor: isDark ? '#334155' : '#E2E8F0',
              },
            ]}
          >
            {/* Target Meaning Header */}
            <View style={[styles.meaningRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.promptTag}>
                  {supportLang === 'ar' ? '🇩🇪 رتّب الكلمات لتكوين جملة صحيحة:' : '🇩🇪 Assemble correct German word order:'}
                </Text>
                <Text style={[styles.translationText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  🇬🇧 {currentItem.translation?.en}
                </Text>
                <Text style={styles.arabicSub}>
                  🇪🇬 {currentItem.translation?.ar}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.audioBtn}
                onPress={() => soundService.speakGerman(currentItem.targetSentence)}
              >
                <Text style={styles.audioIcon}>🔊</Text>
              </TouchableOpacity>
            </View>

            {/* Assembled Sentence Slot Tray */}
            <View
              style={[
                styles.assembledTray,
                {
                  backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                  borderColor: isChecked
                    ? isCorrect ? '#10B981' : '#EF4444'
                    : isDark ? '#334155' : '#CBD5E1',
                },
              ]}
            >
              {placedChips.length === 0 ? (
                <Text style={styles.placeholderText}>
                  {supportLang === 'ar' ? 'انقر على الكلمات أدناه لوضعها على الجسر...' : 'Tap word blocks below to place on 3D bridge...'}
                </Text>
              ) : (
                <View style={styles.chipsRow}>
                  {placedChips.map((chip, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[styles.placedChip, isChecked && (isCorrect ? styles.chipSuccess : styles.chipError)]}
                      onPress={() => handleRemoveChip(chip, idx)}
                    >
                      <Text style={styles.placedChipText}>{chip}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Available Words Pool */}
            {!isChecked && (
              <View style={styles.availablePool}>
                {availableChips.map((chip, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.poolChip,
                      {
                        backgroundColor: isDark ? '#334155' : '#E2E8F0',
                        borderColor: isDark ? '#475569' : '#CBD5E1',
                      },
                    ]}
                    onPress={() => handleAddChip(chip, idx)}
                  >
                    <Text style={[styles.poolChipText, { color: isDark ? '#F8FAFC' : '#1E293B' }]}>
                      {chip}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Check / Next Action Button */}
            {!isChecked ? (
              <TouchableOpacity
                style={[
                  styles.checkBtn,
                  placedChips.length === 0 && { opacity: 0.5 },
                ]}
                onPress={handleCheckSentence}
                disabled={placedChips.length === 0}
              >
                <Text style={styles.checkBtnText}>
                  {supportLang === 'ar' ? 'تحقق من ترتيب الكلمات ➔' : 'Check Word Order (V2) ➔'}
                </Text>
              </TouchableOpacity>
            ) : (
              <View
                style={[
                  styles.feedbackCard,
                  isCorrect ? styles.feedbackSuccess : styles.feedbackDanger,
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.feedbackTitle, { color: isCorrect ? '#059669' : '#DC2626' }]}>
                    {isCorrect ? '🎉 Perfekt! Verb-Position korrekt! (+30 XP)' : '❌ Nicht ganz richtig!'}
                  </Text>
                  <Text style={[styles.targetDisplay, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                    {currentItem.targetSentence}
                  </Text>
                  <Text style={[styles.ruleNote, { color: isDark ? '#CBD5E1' : '#475569' }]}>
                    ⚡ {supportLang === 'ar' ? currentItem.ruleNote?.ar : currentItem.ruleNote?.en}
                  </Text>
                </View>

                <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                  <Text style={styles.nextBtnText}>Next ➔</Text>
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#060C18',
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
    borderColor: 'rgba(56, 189, 248, 0.4)',
  },
  modeBadgeText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  hudRightRow: {
    flexDirection: 'row',
    gap: 6,
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
  instructionPill: {
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
    gap: 10,
  },
  meaningRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promptTag: {
    fontSize: 12,
    fontWeight: '800',
    color: '#38BDF8',
    marginBottom: 2,
  },
  translationText: {
    fontSize: 16,
    fontWeight: '900',
  },
  arabicSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
  audioBtn: {
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
  audioIcon: {
    fontSize: 20,
  },
  assembledTray: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 8,
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#94A3B8',
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  placedChip: {
    backgroundColor: '#38BDF8',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  placedChipText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  chipSuccess: {
    backgroundColor: '#10B981',
  },
  chipError: {
    backgroundColor: '#EF4444',
  },
  availablePool: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  poolChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  poolChipText: {
    fontSize: 13,
    fontWeight: '800',
  },
  checkBtn: {
    backgroundColor: '#38BDF8',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
  },
  feedbackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  feedbackSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10B981',
  },
  feedbackDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#EF4444',
  },
  feedbackTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  targetDisplay: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  ruleNote: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  nextBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
  },
});

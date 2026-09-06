// ============================================================
// GAME 4: 3D CASE DETECTIVE HOLOGRAM LAB (THREE.JS WEBGL)
// 3D Cyber Noir Hologram Lab for German Cases:
// Nominativ (Gold), Akkusativ (Cyan), Dativ (Purple), Genitiv (Crimson)
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
import { CASE_DETECTIVE_ITEMS } from '../../../data/gamesData';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import { useAppTheme } from '../../context/ThemeContext';
import soundService from '../../services/soundService';

export default function CaseDetective3D({ visible = true, onClose, onFinish, onExit }) {
  const { supportLang, isRTL } = useLanguage();
  const { addXp } = useProgress();
  const { isDark, colors } = useAppTheme();

  const handleExit = onClose || onExit || onFinish;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const currentItem = CASE_DETECTIVE_ITEMS[currentIndex] || CASE_DETECTIVE_ITEMS[0];
  const isCorrect = selectedIndex === currentItem.correctIndex;

  // Touch orbit gesture refs
  const touchRotation = useRef({ x: 0.35, y: 0 });
  const touchStart = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0.35, y: 0 });
  const animationFrameId = useRef(null);
  const evidenceCubeRef = useRef(null);
  const scannerBeamRef = useRef(null);

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

  // Pronounce German sentence on change
  useEffect(() => {
    if (!isAudioMuted && currentItem?.sentence) {
      soundService.speakGerman(currentItem.sentence);
    }
  }, [currentIndex, isAudioMuted]);

  // Handle WebGL Context
  const onContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark ? 0x050811 : 0x0f172a);
    scene.fog = new THREE.FogExp2(isDark ? 0x050811 : 0x0f172a, 0.038);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 4.2, 7.5);
    camera.lookAt(0, 0.8, 0);

    // 3. Renderer
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 1.8, 12);
    cyanLight.position.set(-3, 4, 3);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0xa855f7, 1.8, 12);
    purpleLight.position.set(3, 4, -2);
    scene.add(purpleLight);

    // 5. 3D Detective Floor Grid
    const floorGeo = new THREE.CylinderGeometry(3.8, 4.2, 0.2, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0b1329,
      roughness: 0.3,
      metalness: 0.5,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.1;
    scene.add(floor);

    // Holographic Grid Rings
    [2.2, 3.2, 3.8].forEach((r, idx) => {
      const ringGeo = new THREE.TorusGeometry(r, 0.02, 16, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: idx === 0 ? 0x06b6d4 : idx === 1 ? 0xa855f7 : 0xf59e0b,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.02;
      scene.add(ring);
    });

    // 6. Central Holographic Evidence Cube / Clue Core
    const evidenceGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const evidenceMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.2,
      metalness: 0.7,
      wireframe: false,
    });
    const evidenceCube = new THREE.Mesh(evidenceGeo, evidenceMat);
    evidenceCube.position.set(0, 1.6, 0);
    scene.add(evidenceCube);
    evidenceCubeRef.current = evidenceCube;

    // Outer Wireframe Cage
    const cageGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
    const cage = new THREE.Mesh(cageGeo, cageMat);
    evidenceCube.add(cage);

    // Vertical Hologram Scanner Beam
    const scanGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.05, 24);
    const scanMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0,
    });
    const scanBeam = new THREE.Mesh(scanGeo, scanMat);
    scanBeam.position.set(0, 1.6, 0);
    scene.add(scanBeam);
    scannerBeamRef.current = scanBeam;

    // 7. Four Case Hologram Pedestals (Nominativ, Akkusativ, Dativ, Genitiv)
    const pedestalConfigs = [
      { name: 'NOM', color: 0xf59e0b, pos: [-2.2, 0.6, 1.2] },
      { name: 'AKK', color: 0x06b6d4, pos: [-1.2, 0.6, -2.2] },
      { name: 'DAT', color: 0xa855f7, pos: [1.2, 0.6, -2.2] },
      { name: 'GEN', color: 0xf43f5e, pos: [2.2, 0.6, 1.2] },
    ];

    pedestalConfigs.forEach((cfg) => {
      const pedGeo = new THREE.CylinderGeometry(0.35, 0.45, 1.2, 16);
      const pedMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.4,
      });
      const ped = new THREE.Mesh(pedGeo, pedMat);
      ped.position.set(...cfg.pos);
      scene.add(ped);

      const lightOrbGeo = new THREE.SphereGeometry(0.2, 16, 16);
      const lightOrbMat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.color,
        emissiveIntensity: 0.8,
      });
      const orb = new THREE.Mesh(lightOrbGeo, lightOrbMat);
      orb.position.set(cfg.pos[0], cfg.pos[1] + 0.8, cfg.pos[2]);
      scene.add(orb);
    });

    // 8. Cyber Dust Particles
    const dustCount = 100;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPos[i] = (Math.random() - 0.5) * 10;
      dustPos[i + 1] = Math.random() * 5;
      dustPos[i + 2] = (Math.random() - 0.5) * 10;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0x06b6d4,
      size: 0.06,
      transparent: true,
      opacity: 0.75,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // 9. Animation Loop
    let clock = new THREE.Clock();
    const render = () => {
      animationFrameId.current = requestAnimationFrame(render);
      const elapsedTime = clock.getElapsedTime();

      // Camera Orbit
      const targetCamY = 1.8 + currentRotation.current.x * 4.5;
      const targetRadius = 6.8;
      const targetCamX = Math.sin(currentRotation.current.y) * targetRadius;
      const targetCamZ = Math.cos(currentRotation.current.y) * targetRadius;

      camera.position.x += (targetCamX - camera.position.x) * 0.1;
      camera.position.y += (targetCamY - camera.position.y) * 0.1;
      camera.position.z += (targetCamZ - camera.position.z) * 0.1;
      camera.lookAt(0, 1.2, 0);

      // Rotate Evidence Cube
      if (evidenceCubeRef.current) {
        evidenceCubeRef.current.rotation.y = elapsedTime * 0.7;
        evidenceCubeRef.current.rotation.x = Math.sin(elapsedTime * 0.5) * 0.3;
        evidenceCubeRef.current.position.y = 1.6 + Math.sin(elapsedTime * 2) * 0.1;
      }

      // Scanner Beam Animation
      if (scannerBeamRef.current && scannerBeamRef.current.material.opacity > 0) {
        scannerBeamRef.current.position.y = 1.6 + Math.sin(elapsedTime * 8) * 0.6;
      }

      // Ambient Dust
      dust.rotation.y = elapsedTime * 0.025;

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

  const handleSelectCase = (idx) => {
    if (isAnswered) return;
    setSelectedIndex(idx);
    setIsAnswered(true);
    soundService.playSfx('tap');

    const correct = idx === currentItem.correctIndex;
    if (correct) {
      soundService.playSfx('correct');
      soundService.speakGerman(currentItem.sentence);
      setScore((prev) => prev + 25);
      addXp(25);

      // Trigger Holographic Laser Scanner
      if (scannerBeamRef.current) {
        scannerBeamRef.current.material.opacity = 0.85;
      }
    } else {
      soundService.playSfx('wrong');
    }
  };

  const handleNext = () => {
    setSelectedIndex(null);
    setIsAnswered(false);
    if (scannerBeamRef.current) {
      scannerBeamRef.current.material.opacity = 0;
    }

    if (currentIndex < CASE_DETECTIVE_ITEMS.length - 1) {
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
              🔎 3D CASE DETECTIVE {currentIndex + 1}/{CASE_DETECTIVE_ITEMS.length}
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

        {/* Floating Instructions */}
        <View style={styles.instructionPill}>
          <Text style={styles.instructionText}>
            🔄 Drag 360° to inspect clue • Identify the German Case
          </Text>
        </View>

        {/* Bottom Floating Question & Case Options */}
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
            {/* Clue Header */}
            <View style={[styles.clueRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.clueTag}>
                  {supportLang === 'ar' ? '🔍 ما هي الحالة الإعرابية للجزء المحدد؟' : '🔍 Identify the grammatical case:'}
                </Text>
                <Text style={[styles.germanSentence, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  {currentItem.sentence}
                </Text>
                <Text style={styles.clueSub}>
                  🎯 Target: <Text style={{ fontWeight: '900', color: '#06B6D4' }}>{currentItem.targetPhrase}</Text>
                </Text>
              </View>

              <TouchableOpacity
                style={styles.audioBtn}
                onPress={() => soundService.speakGerman(currentItem.sentence)}
              >
                <Text style={styles.audioIcon}>🔊</Text>
              </TouchableOpacity>
            </View>

            {/* Case Options (Grid of 4 Cases) */}
            <View style={styles.casesGrid}>
              {currentItem.options.map((opt, idx) => {
                const isSelected = selectedIndex === idx;
                const isThisCorrect = idx === currentItem.correctIndex;

                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.caseBtn,
                      {
                        backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                        borderColor: isSelected
                          ? isThisCorrect ? '#10B981' : '#EF4444'
                          : isDark ? '#334155' : '#CBD5E1',
                      },
                      isSelected && (isThisCorrect ? styles.caseBtnSuccess : styles.caseBtnWrong),
                    ]}
                    onPress={() => handleSelectCase(idx)}
                    disabled={isAnswered}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.caseBtnText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Detective Explanation Result Card */}
            {isAnswered && (
              <View
                style={[
                  styles.resultCard,
                  isCorrect ? styles.resultSuccess : styles.resultDanger,
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.resultHeading, { color: isCorrect ? '#059669' : '#DC2626' }]}>
                    {isCorrect
                      ? '🎯 Case Solved! (+25 XP)'
                      : `🔎 Clue Solved: ${currentItem.options[currentItem.correctIndex]}`}
                  </Text>
                  <Text style={[styles.resultExplain, { color: isDark ? '#CBD5E1' : '#475569' }]}>
                    {supportLang === 'ar' ? currentItem.explanation?.ar : currentItem.explanation?.en}
                  </Text>
                </View>

                <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                  <Text style={styles.nextBtnText}>Next Case ➔</Text>
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
    backgroundColor: '#050811',
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
    borderColor: 'rgba(6, 182, 212, 0.4)',
  },
  modeBadgeText: {
    color: '#22D3EE',
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
    borderColor: 'rgba(6, 182, 212, 0.3)',
    zIndex: 100,
  },
  instructionText: {
    color: '#22D3EE',
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
  clueRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clueTag: {
    fontSize: 12,
    fontWeight: '800',
    color: '#06B6D4',
    marginBottom: 2,
  },
  germanSentence: {
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 24,
  },
  clueSub: {
    fontSize: 12,
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
  casesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  caseBtn: {
    flexBasis: '48%',
    flexGrow: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  caseBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  caseBtnSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    borderColor: '#10B981',
  },
  caseBtnWrong: {
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    borderColor: '#EF4444',
  },
  resultCard: {
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
  resultDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#EF4444',
  },
  resultHeading: {
    fontSize: 13,
    fontWeight: '800',
  },
  resultExplain: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  nextBtn: {
    backgroundColor: '#06B6D4',
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

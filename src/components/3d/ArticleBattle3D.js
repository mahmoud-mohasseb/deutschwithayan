// ============================================================
// GAME 3: 3D ARTICLE COLOSSEUM BATTLE (THREE.JS WEBGL)
// 3D Elemental Portal Arena for der, die, and das
// Real-time elemental beam strike animations on correct answer
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
import { ARTICLE_BATTLE_ITEMS } from '../../../data/gamesData';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import { useAppTheme } from '../../context/ThemeContext';
import soundService from '../../services/soundService';

export default function ArticleBattle3D({ visible = true, onClose, onFinish, onExit }) {
  const { supportLang, isRTL } = useLanguage();
  const { addXp } = useProgress();
  const { isDark, colors } = useAppTheme();

  const handleExit = onClose || onExit || onFinish;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const currentItem = ARTICLE_BATTLE_ITEMS[currentIndex] || ARTICLE_BATTLE_ITEMS[0];
  const isCorrect = selectedArticle === currentItem.correct;

  // Touch gesture orbit refs
  const touchRotation = useRef({ x: 0.35, y: 0 });
  const touchStart = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0.35, y: 0 });
  const animationFrameId = useRef(null);
  const beamEffectRef = useRef(null);
  const targetSphereRef = useRef(null);
  const portalsRef = useRef({});

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

  // Pronounce German noun on item change
  useEffect(() => {
    if (!isAudioMuted && currentItem?.word) {
      soundService.speakGerman(currentItem.word);
    }
  }, [currentIndex, isAudioMuted]);

  // Handle WebGL Context
  const onContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark ? 0x050a14 : 0x0f172a);
    scene.fog = new THREE.FogExp2(isDark ? 0x050a14 : 0x0f172a, 0.035);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 4.0, 7.2);
    camera.lookAt(0, 0.8, 0);

    // 3. Renderer
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 8, 5);
    scene.add(dirLight);

    // 5. 3D Colosseum Arena Platform (Circular Stone Base)
    const arenaGeo = new THREE.CylinderGeometry(3.6, 4.0, 0.4, 32);
    const arenaMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.3,
    });
    const arena = new THREE.Mesh(arenaGeo, arenaMat);
    arena.position.y = -0.2;
    scene.add(arena);

    // Neon Arena Boundary Ring
    const borderRingGeo = new THREE.TorusGeometry(3.65, 0.05, 16, 64);
    const borderRingMat = new THREE.MeshBasicMaterial({ color: 0x6366f1 });
    const borderRing = new THREE.Mesh(borderRingGeo, borderRingMat);
    borderRing.rotation.x = Math.PI / 2;
    borderRing.position.y = 0.02;
    scene.add(borderRing);

    // 6. Central Floating Word Target Orb
    const targetGeo = new THREE.DodecahedronGeometry(0.85, 1);
    const targetMat = new THREE.MeshStandardMaterial({
      color: 0xffa255,
      emissive: 0x7c2d12,
      roughness: 0.2,
      metalness: 0.6,
    });
    const targetSphere = new THREE.Mesh(targetGeo, targetMat);
    targetSphere.position.set(0, 1.5, 0);
    scene.add(targetSphere);
    targetSphereRef.current = targetSphere;

    // Orbiting Golden Rings around target
    const targetRingGeo = new THREE.TorusGeometry(1.2, 0.025, 16, 48);
    const targetRingMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const targetRing = new THREE.Mesh(targetRingGeo, targetRingMat);
    targetRing.rotation.x = Math.PI / 3;
    targetSphere.add(targetRing);

    // 7. Three Elemental Portals / Obelisks (der, die, das)
    portalsRef.current = {};

    // DER: Blue Frost Portal (-2.2, 1.0, 1.0)
    const derGeo = new THREE.ConeGeometry(0.5, 1.8, 6);
    const derMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0369a1,
      roughness: 0.2,
    });
    const derMesh = new THREE.Mesh(derGeo, derMat);
    derMesh.position.set(-2.2, 0.9, 0.8);
    scene.add(derMesh);
    portalsRef.current.der = derMesh;

    // DIE: Red Flame Portal (2.2, 1.0, 1.0)
    const dieGeo = new THREE.ConeGeometry(0.5, 1.8, 6);
    const dieMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0x991b1b,
      roughness: 0.2,
    });
    const dieMesh = new THREE.Mesh(dieGeo, dieMat);
    dieMesh.position.set(2.2, 0.9, 0.8);
    scene.add(dieMesh);
    portalsRef.current.die = dieMesh;

    // DAS: Emerald Lightning Portal (0, 1.0, -2.4)
    const dasGeo = new THREE.ConeGeometry(0.5, 1.8, 6);
    const dasMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x065f46,
      roughness: 0.2,
    });
    const dasMesh = new THREE.Mesh(dasGeo, dasMat);
    dasMesh.position.set(0, 0.9, -2.4);
    scene.add(dasMesh);
    portalsRef.current.das = dasMesh;

    // 8. 3D Elemental Laser Beam
    const beamGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.8, 12);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
    });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    scene.add(beamMesh);
    beamEffectRef.current = beamMesh;

    // 9. Floating Colosseum Particles (120 particles)
    const partCount = 120;
    const partGeo = new THREE.BufferGeometry();
    const partPositions = new Float32Array(partCount * 3);
    for (let i = 0; i < partCount * 3; i += 3) {
      partPositions[i] = (Math.random() - 0.5) * 12;
      partPositions[i + 1] = Math.random() * 6 - 1;
      partPositions[i + 2] = (Math.random() - 0.5) * 12;
    }
    partGeo.setAttribute('position', new THREE.BufferAttribute(partPositions, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.07,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    // 10. Animation Loop
    let clock = new THREE.Clock();
    const render = () => {
      animationFrameId.current = requestAnimationFrame(render);
      const elapsedTime = clock.getElapsedTime();

      // Camera Orbit
      const targetCamY = 1.6 + currentRotation.current.x * 4.5;
      const targetRadius = 6.8;
      const targetCamX = Math.sin(currentRotation.current.y) * targetRadius;
      const targetCamZ = Math.cos(currentRotation.current.y) * targetRadius;

      camera.position.x += (targetCamX - camera.position.x) * 0.1;
      camera.position.y += (targetCamY - camera.position.y) * 0.1;
      camera.position.z += (targetCamZ - camera.position.z) * 0.1;
      camera.lookAt(0, 1.2, 0);

      // Target Orb Spin & Bob
      if (targetSphereRef.current) {
        targetSphereRef.current.rotation.y = elapsedTime * 0.8;
        targetSphereRef.current.rotation.x = Math.sin(elapsedTime) * 0.2;
        targetSphereRef.current.position.y = 1.5 + Math.sin(elapsedTime * 2) * 0.15;
      }

      // Portals Spin
      derMesh.rotation.y = elapsedTime * 1.2;
      dieMesh.rotation.y = -elapsedTime * 1.2;
      dasMesh.rotation.y = elapsedTime * 1.5;

      // Particle Drift
      particles.rotation.y = elapsedTime * 0.04;

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

  const handleSelectArticle = (article) => {
    if (isAnswered) return;
    setSelectedArticle(article);
    setIsAnswered(true);
    soundService.playSfx('tap');

    const correct = article === currentItem.correct;
    if (correct) {
      soundService.playSfx('correct');
      soundService.speakGerman(`${article} ${currentItem.word}`);
      setStreak((prev) => prev + 1);
      setScore((prev) => prev + 25);
      addXp(25);

      // Trigger 3D Elemental Beam Animation
      if (beamEffectRef.current && portalsRef.current[article]) {
        const portal = portalsRef.current[article];
        const beam = beamEffectRef.current;
        beam.material.opacity = 0.9;
        beam.material.color.set(
          article === 'der' ? 0x38bdf8 : article === 'die' ? 0xef4444 : 0x10b981
        );
        beam.position.copy(portal.position).lerp(targetSphereRef.current.position, 0.5);
        beam.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          targetSphereRef.current.position.clone().sub(portal.position).normalize()
        );
      }
    } else {
      soundService.playSfx('wrong');
      setStreak(0);
    }
  };

  const handleNext = () => {
    setSelectedArticle(null);
    setIsAnswered(false);
    if (beamEffectRef.current) {
      beamEffectRef.current.material.opacity = 0;
    }

    if (currentIndex < ARTICLE_BATTLE_ITEMS.length - 1) {
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
              ⚔️ 3D ARTICLE BATTLE {currentIndex + 1}/{ARTICLE_BATTLE_ITEMS.length}
            </Text>
          </View>

          <View style={styles.hudRightRow}>
            <View style={styles.streakPill}>
              <Text style={styles.streakPillText}>🔥 {streak}</Text>
            </View>
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
            🔄 Drag 360° to rotate arena • Cast elemental beam below
          </Text>
        </View>

        {/* Bottom Floating Question & Portal Selector */}
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
            {/* Word Header */}
            <View style={[styles.wordRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.promptTag}>
                  {supportLang === 'ar' ? 'اختر البوابة المناسبة للاسم:' : 'Select article portal for noun:'}
                </Text>
                <Text style={[styles.germanNoun, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  {currentItem.word}
                </Text>
                <Text style={styles.wordTranslation}>
                  🇬🇧 {currentItem.translation?.en} • 🇪🇬 {currentItem.translation?.ar}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.audioBtn}
                onPress={() => soundService.speakGerman(currentItem.word)}
              >
                <Text style={styles.audioIcon}>🔊</Text>
              </TouchableOpacity>
            </View>

            {/* 3D Portal Buttons (der, die, das) */}
            <View style={styles.portalsRow}>
              {/* DER: Blue Portal */}
              <TouchableOpacity
                style={[
                  styles.portalBtn,
                  styles.portalDer,
                  selectedArticle === 'der' && (isCorrect ? styles.portalSuccess : styles.portalWrong),
                ]}
                onPress={() => handleSelectArticle('der')}
                disabled={isAnswered}
                activeOpacity={0.85}
              >
                <Text style={styles.portalTitleDer}>der</Text>
                <Text style={styles.portalSub}>Ice Portal ❄️</Text>
              </TouchableOpacity>

              {/* DIE: Red Portal */}
              <TouchableOpacity
                style={[
                  styles.portalBtn,
                  styles.portalDie,
                  selectedArticle === 'die' && (isCorrect ? styles.portalSuccess : styles.portalWrong),
                ]}
                onPress={() => handleSelectArticle('die')}
                disabled={isAnswered}
                activeOpacity={0.85}
              >
                <Text style={styles.portalTitleDie}>die</Text>
                <Text style={styles.portalSub}>Fire Portal 🔥</Text>
              </TouchableOpacity>

              {/* DAS: Green Portal */}
              <TouchableOpacity
                style={[
                  styles.portalBtn,
                  styles.portalDas,
                  selectedArticle === 'das' && (isCorrect ? styles.portalSuccess : styles.portalWrong),
                ]}
                onPress={() => handleSelectArticle('das')}
                disabled={isAnswered}
                activeOpacity={0.85}
              >
                <Text style={styles.portalTitleDas}>das</Text>
                <Text style={styles.portalSub}>Lightning ⚡</Text>
              </TouchableOpacity>
            </View>

            {/* Answer Result & Rule Card */}
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
                      ? `🎉 Richtig! Es heißt: ${currentItem.correct.toUpperCase()} ${currentItem.word}`
                      : `❌ Falsch! Es heißt: ${currentItem.correct.toUpperCase()} ${currentItem.word}`}
                  </Text>
                  <Text style={[styles.ruleText, { color: isDark ? '#CBD5E1' : '#475569' }]}>
                    ⚡ {supportLang === 'ar' ? currentItem.rule?.ar : currentItem.rule?.en}
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
    backgroundColor: '#050A14',
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
    borderColor: 'rgba(99, 102, 241, 0.4)',
  },
  modeBadgeText: {
    color: '#818CF8',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  hudRightRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  streakPill: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  streakPillText: {
    color: '#EF4444',
    fontWeight: '900',
    fontSize: 11,
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
    borderColor: 'rgba(99, 102, 241, 0.3)',
    zIndex: 100,
  },
  instructionText: {
    color: '#818CF8',
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
  wordRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promptTag: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6366F1',
    marginBottom: 2,
  },
  germanNoun: {
    fontSize: 24,
    fontWeight: '900',
  },
  wordTranslation: {
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
  portalsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  portalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  portalDer: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: '#38BDF8',
  },
  portalDie: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#EF4444',
  },
  portalDas: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10B981',
  },
  portalTitleDer: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0284C7',
  },
  portalTitleDie: {
    fontSize: 18,
    fontWeight: '900',
    color: '#DC2626',
  },
  portalTitleDas: {
    fontSize: 18,
    fontWeight: '900',
    color: '#059669',
  },
  portalSub: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    marginTop: 2,
  },
  portalSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
    borderColor: '#10B981',
  },
  portalWrong: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
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
  ruleText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  nextBtn: {
    backgroundColor: '#6366F1',
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

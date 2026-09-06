// ============================================================
// GAME 6: 3D GRAMMAR TITAN BOSS BATTLE (THREE.JS WEBGL)
// 3D Animated Titan Boss with glowing core, floating armor,
// hit recoil animations, and real-time magic attack particle bursts
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
import { GRAMMAR_BOSS_ENCOUNTERS } from '../../../data/gamesData';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import { useAppTheme } from '../../context/ThemeContext';
import soundService from '../../services/soundService';

export default function GrammarBoss3D({ visible = true, onClose, onFinish, onExit }) {
  const { supportLang, isRTL } = useLanguage();
  const { addXp } = useProgress();
  const { isDark, colors } = useAppTheme();

  const handleExit = onClose || onExit || onFinish;
  const boss = GRAMMAR_BOSS_ENCOUNTERS[0] || {};
  const bossTitle = boss.name || boss.bossName || 'Der Grammatik-Troll';
  const [bossHp, setBossHp] = useState(boss.hp || 100);
  const [roundIdx, setRoundIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isRoundAnswered, setIsRoundAnswered] = useState(false);
  const [playerVictory, setPlayerVictory] = useState(false);
  const [score, setScore] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const rawRound = boss?.rounds?.[roundIdx] || boss?.rounds?.[0] || {};
  const currentRound = {
    ...rawRound,
    sentence: rawRound.sentence || rawRound.bossMistake || '',
    options: rawRound.options || rawRound.correctionOptions || [],
    prompt: rawRound.prompt || (supportLang === 'ar' ? 'صحح خطأ الزعيم:' : 'Fix the Boss Mistake:'),
    damage: rawRound.damage || 35,
    correctIndex: rawRound.correctIndex ?? 0,
    english: rawRound.english || '',
    arabic: rawRound.arabic || '',
    explanation: rawRound.explanation || {},
  };
  const isCorrect = selectedOpt === currentRound.correctIndex;

  // Touch gesture refs
  const touchRotation = useRef({ x: 0.35, y: 0 });
  const touchStart = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0.35, y: 0 });
  const animationFrameId = useRef(null);
  const bossGroupRef = useRef(null);
  const bossEyeRef = useRef(null);
  const sparkBurstRef = useRef(null);
  const isRecoiling = useRef(false);
  const recoilTimer = useRef(0);

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

  // Pronounce German challenge
  useEffect(() => {
    if (!isAudioMuted && currentRound?.sentence) {
      soundService.speakGerman(currentRound.sentence);
    }
  }, [roundIdx, isAudioMuted]);

  // Handle WebGL Context
  const onContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark ? 0x0a0512 : 0x180f2a);
    scene.fog = new THREE.FogExp2(isDark ? 0x0a0512 : 0x180f2a, 0.035);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 3.8, 7.6);
    camera.lookAt(0, 1.4, 0);

    // 3. Renderer
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const redBossLight = new THREE.PointLight(0xef4444, 2.5, 12);
    redBossLight.position.set(0, 3, 2);
    scene.add(redBossLight);

    const purpleAmbient = new THREE.PointLight(0xa855f7, 2.0, 15);
    purpleAmbient.position.set(-4, 4, -3);
    scene.add(purpleAmbient);

    // 5. 3D Volcano / Dark Citadel Stone Ground
    const groundGeo = new THREE.CylinderGeometry(4.2, 4.8, 0.4, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x170d24,
      roughness: 0.6,
      metalness: 0.3,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.2;
    scene.add(ground);

    // Lava Crack Ring
    const lavaRingGeo = new THREE.TorusGeometry(3.8, 0.06, 16, 64);
    const lavaRingMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const lavaRing = new THREE.Mesh(lavaRingGeo, lavaRingMat);
    lavaRing.rotation.x = Math.PI / 2;
    lavaRing.position.y = 0.02;
    scene.add(lavaRing);

    // 6. 3D Titan Boss Model (Hierarchical Group)
    const bossGroup = new THREE.Group();
    scene.add(bossGroup);
    bossGroupRef.current = bossGroup;

    // Boss Torso (Chiseled Dark Stone)
    const torsoGeo = new THREE.BoxGeometry(1.6, 1.8, 1.2);
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x2e1065,
      roughness: 0.4,
      metalness: 0.5,
    });
    const torso = new THREE.Mesh(torsoGeo, stoneMat);
    torso.position.y = 1.6;
    bossGroup.add(torso);

    // Glowing Core / Ruby Heart Eye
    const eyeGeo = new THREE.DodecahedronGeometry(0.35, 1);
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xff0033,
      emissiveIntensity: 1.2,
      roughness: 0.1,
    });
    const eye = new THREE.Mesh(eyeGeo, eyeMat);
    eye.position.set(0, 1.8, 0.65);
    bossGroup.add(eye);
    bossEyeRef.current = eye;

    // Titan Head / Crown
    const headGeo = new THREE.BoxGeometry(0.9, 0.9, 0.9);
    const head = new THREE.Mesh(headGeo, stoneMat);
    head.position.set(0, 2.9, 0);
    bossGroup.add(head);

    // Horns / Crown Spikes
    [-0.35, 0.35].forEach((hx) => {
      const hornGeo = new THREE.ConeGeometry(0.16, 0.7, 8);
      const hornMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.6 });
      const horn = new THREE.Mesh(hornGeo, hornMat);
      horn.position.set(hx, 3.5, 0);
      horn.rotation.z = hx > 0 ? -0.3 : 0.3;
      bossGroup.add(horn);
    });

    // Shoulder Pauldrons
    [-1.2, 1.2].forEach((sx) => {
      const shoulderGeo = new THREE.BoxGeometry(0.7, 0.8, 0.8);
      const shoulder = new THREE.Mesh(shoulderGeo, stoneMat);
      shoulder.position.set(sx, 2.3, 0);
      bossGroup.add(shoulder);

      // Floating Energy Shield Orb near shoulder
      const shieldOrbGeo = new THREE.SphereGeometry(0.2, 12, 12);
      const shieldOrbMat = new THREE.MeshBasicMaterial({ color: 0xec4899 });
      const orb = new THREE.Mesh(shieldOrbGeo, shieldOrbMat);
      orb.position.set(sx * 1.4, 2.5, 0);
      bossGroup.add(orb);
    });

    // 7. Spark Burst Particle System (Triggered on Critical Hit)
    const sparkCount = 80;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkCoords = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount * 3; i += 3) {
      sparkCoords[i] = (Math.random() - 0.5) * 4;
      sparkCoords[i + 1] = 1.6 + (Math.random() - 0.5) * 2;
      sparkCoords[i + 2] = 0.65 + (Math.random() - 0.5) * 4;
    }
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkCoords, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.08,
      transparent: true,
      opacity: 0,
    });
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparks);
    sparkBurstRef.current = sparks;

    // 8. Animation Loop
    let clock = new THREE.Clock();
    const render = () => {
      animationFrameId.current = requestAnimationFrame(render);
      const elapsedTime = clock.getElapsedTime();

      // Camera Orbit
      const targetCamY = 1.8 + currentRotation.current.x * 4.5;
      const targetRadius = 7.4;
      const targetCamX = Math.sin(currentRotation.current.y) * targetRadius;
      const targetCamZ = Math.cos(currentRotation.current.y) * targetRadius;

      camera.position.x += (targetCamX - camera.position.x) * 0.1;
      camera.position.y += (targetCamY - camera.position.y) * 0.1;
      camera.position.z += (targetCamZ - camera.position.z) * 0.1;
      camera.lookAt(0, 1.8, 0);

      // Boss Breathing Animation
      if (bossGroupRef.current) {
        if (isRecoiling.current) {
          recoilTimer.current += 0.05;
          bossGroupRef.current.position.z = -Math.sin(recoilTimer.current * Math.PI) * 0.4;
          bossGroupRef.current.rotation.x = -Math.sin(recoilTimer.current * Math.PI) * 0.2;
          if (recoilTimer.current >= 1) {
            isRecoiling.current = false;
            recoilTimer.current = 0;
            bossGroupRef.current.position.z = 0;
            bossGroupRef.current.rotation.x = 0;
          }
        } else {
          bossGroupRef.current.position.y = Math.sin(elapsedTime * 1.8) * 0.12;
          bossGroupRef.current.rotation.y = Math.sin(elapsedTime * 0.8) * 0.1;
        }
      }

      // Eye Pulsing
      if (bossEyeRef.current) {
        const scale = 1.0 + Math.sin(elapsedTime * 5) * 0.15;
        bossEyeRef.current.scale.set(scale, scale, scale);
      }

      // Spark Fade
      if (sparkBurstRef.current && sparkBurstRef.current.material.opacity > 0) {
        sparkBurstRef.current.material.opacity -= 0.02;
        sparkBurstRef.current.rotation.y += 0.05;
      }

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

  const handleSelectOption = (idx) => {
    if (isRoundAnswered) return;
    setSelectedOpt(idx);
    setIsRoundAnswered(true);
    soundService.playSfx('tap');

    const correct = idx === currentRound.correctIndex;
    if (correct) {
      soundService.playSfx('correct');
      soundService.speakGerman(currentRound.sentence);
      const newHp = Math.max(0, bossHp - currentRound.damage);
      setBossHp(newHp);
      setScore((prev) => prev + 35);
      addXp(35);

      // Trigger Boss Recoil & 3D Spark Burst
      isRecoiling.current = true;
      recoilTimer.current = 0;
      if (sparkBurstRef.current) {
        sparkBurstRef.current.material.opacity = 1.0;
      }

      if (newHp <= 0) {
        setPlayerVictory(true);
        soundService.playSfx('complete');
      }
    } else {
      soundService.playSfx('wrong');
    }
  };

  const handleNextRound = () => {
    if (playerVictory || roundIdx >= boss.rounds.length - 1) {
      soundService.playSfx('complete');
      if (onFinish) onFinish();
      return;
    }
    setRoundIdx((prev) => prev + 1);
    setSelectedOpt(null);
    setIsRoundAnswered(false);
  };

  const hpPercent = Math.round((bossHp / (boss.hp || 100)) * 100);

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
              👹 3D GRAMMAR TITAN {roundIdx + 1}/{boss.rounds ? boss.rounds.length : 3}
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

        {/* Floating Boss Health Bar */}
        <View style={styles.bossHpContainer}>
          <View style={styles.hpLabelRow}>
            <Text style={styles.bossNameText}>🔥 {bossTitle}</Text>
            <Text style={styles.hpPercentText}>{bossHp} / {boss.hp || 100} HP ({hpPercent}%)</Text>
          </View>
          <View style={styles.hpTrack}>
            <View
              style={[
                styles.hpFill,
                { width: `${hpPercent}%` },
                hpPercent < 30 && { backgroundColor: '#EF4444' },
              ]}
            />
          </View>
        </View>

        {/* Floating Instruction */}
        <View style={styles.instructionPill}>
          <Text style={styles.instructionText}>
            🔄 Drag 360° to rotate boss • Answer correctly to strike titan!
          </Text>
        </View>

        {/* Bottom Floating Combat Arena Card */}
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
            {/* Round Challenge Header */}
            <View style={[styles.roundHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.bossChallengeTag}>
                  ⚔️ {currentRound.prompt}
                </Text>
                <Text style={[styles.germanChallenge, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                  {currentRound.sentence}
                </Text>
                <Text style={styles.challengeTranslation}>
                  🇬🇧 {currentRound.english} • 🇪🇬 {currentRound.arabic}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.audioBtn}
                onPress={() => soundService.speakGerman(currentRound.sentence)}
              >
                <Text style={styles.audioIcon}>🔊</Text>
              </TouchableOpacity>
            </View>

            {/* Attack Options Grid */}
            <View style={styles.optionsGrid}>
              {currentRound.options.map((opt, idx) => {
                const isSelected = selectedOpt === idx;
                const isThisCorrect = idx === currentRound.correctIndex;

                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.optBtn,
                      {
                        backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                        borderColor: isSelected
                          ? isThisCorrect ? '#10B981' : '#EF4444'
                          : isDark ? '#334155' : '#CBD5E1',
                      },
                      isSelected && (isThisCorrect ? styles.optSuccess : styles.optWrong),
                    ]}
                    onPress={() => handleSelectOption(idx)}
                    disabled={isRoundAnswered}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.optText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Combat Feedback Card */}
            {isRoundAnswered && (
              <View
                style={[
                  styles.combatFeedback,
                  isCorrect ? styles.feedbackHit : styles.feedbackBlocked,
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.feedbackTitle, { color: isCorrect ? '#059669' : '#DC2626' }]}>
                    {isCorrect
                      ? `💥 CRITICAL HIT! -${currentRound.damage} HP (+35 XP)`
                      : '🛡️ The Titan blocked your attack!'}
                  </Text>
                  <Text style={[styles.explanationText, { color: isDark ? '#CBD5E1' : '#475569' }]}>
                    {supportLang === 'ar' ? currentRound.explanation?.ar : currentRound.explanation?.en}
                  </Text>
                </View>

                <TouchableOpacity style={styles.nextRoundBtn} onPress={handleNextRound}>
                  <Text style={styles.nextRoundBtnText}>
                    {playerVictory ? 'Victory 🏆' : 'Next ➔'}
                  </Text>
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
    backgroundColor: '#0A0512',
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
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  modeBadgeText: {
    color: '#F87171',
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
  bossHpContainer: {
    position: 'absolute',
    top: 68,
    left: 18,
    right: 18,
    zIndex: 100,
  },
  hpLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  bossNameText: {
    color: '#F87171',
    fontWeight: '900',
    fontSize: 13,
  },
  hpPercentText: {
    color: '#FBBF24',
    fontWeight: '800',
    fontSize: 12,
  },
  hpTrack: {
    height: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.5)',
    overflow: 'hidden',
  },
  hpFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 5,
  },
  instructionPill: {
    position: 'absolute',
    top: 96,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    zIndex: 100,
  },
  instructionText: {
    color: '#FCA5A5',
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
  roundHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bossChallengeTag: {
    fontSize: 12,
    fontWeight: '800',
    color: '#EF4444',
    marginBottom: 2,
  },
  germanChallenge: {
    fontSize: 18,
    fontWeight: '900',
  },
  challengeTranslation: {
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
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optBtn: {
    flexBasis: '48%',
    flexGrow: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  optText: {
    fontSize: 14,
    fontWeight: '800',
  },
  optSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    borderColor: '#10B981',
  },
  optWrong: {
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    borderColor: '#EF4444',
  },
  combatFeedback: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  feedbackHit: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#10B981',
  },
  feedbackBlocked: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#EF4444',
  },
  feedbackTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  explanationText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  nextRoundBtn: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  nextRoundBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
  },
});

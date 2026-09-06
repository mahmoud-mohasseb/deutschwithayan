// ============================================================
// GAME 7: 3D AUTOBAHN VERB RACER (THREE.JS WEBGL)
// High-speed 3D Neon Autobahn Racing Simulator
// Dynamic speed tunnels, road dash motion, 3D craft & Nitro boost
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
import { VERB_RACE_ITEMS } from '../../../data/gamesData';
import { useLanguage } from '../../context/LanguageContext';
import { useProgress } from '../../context/ProgressContext';
import { useGameMode } from '../../context/GameModeContext';
import { useAppTheme } from '../../context/ThemeContext';
import soundService from '../../services/soundService';

export default function VerbRace3D({ visible = true, onClose, onFinish, onExit }) {
  const { supportLang, isRTL } = useLanguage();
  const { addXp } = useProgress();
  const { earnCoins } = useGameMode();
  const { isDark, colors } = useAppTheme();

  const handleExit = onClose || onExit || onFinish;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const rawItem = VERB_RACE_ITEMS?.[currentIndex] || VERB_RACE_ITEMS?.[0] || {};
  const currentItem = {
    ...rawItem,
    options: rawItem.options || [],
    translation: rawItem.translation || {},
  };
  const isCorrect = selectedOpt === currentItem.correct;

  // Touch gesture refs
  const touchRotation = useRef({ x: 0.35, y: 0 });
  const touchStart = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0.35, y: 0 });
  const animationFrameId = useRef(null);
  const racerShipRef = useRef(null);
  const nitroTrailRef = useRef(null);
  const speedRef = useRef(1.0);
  const tunnelRingsRef = useRef([]);
  const roadDashesRef = useRef([]);

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

  // Timer countdown
  useEffect(() => {
    if (isAnswered) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isAnswered]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    soundService.playSfx('wrong');
  };

  // Pronounce German verb
  useEffect(() => {
    if (!isAudioMuted && currentItem?.verb) {
      soundService.speakGerman(`${currentItem.pronoun} ${currentItem.verb}`);
    }
  }, [currentIndex, isAudioMuted]);

  // Handle WebGL Three.js Context
  const onContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark ? 0x050512 : 0x0f172a);
    scene.fog = new THREE.FogExp2(isDark ? 0x050512 : 0x0f172a, 0.04);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 3.2, 6.2);
    camera.lookAt(0, 0.5, -4);

    // 3. Renderer
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 2.0, 20);
    cyanLight.position.set(-4, 5, 2);
    scene.add(cyanLight);

    const magentaLight = new THREE.PointLight(0xec4899, 2.0, 20);
    magentaLight.position.set(4, 5, -5);
    scene.add(magentaLight);

    // 5. 3D Autobahn Highway Strip
    const roadGeo = new THREE.BoxGeometry(4.2, 0.1, 40);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.4,
      metalness: 0.4,
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.position.set(0, -0.05, -12);
    scene.add(road);

    // Neon Road Guard Rails
    [-2.1, 2.1].forEach((rx) => {
      const railGeo = new THREE.BoxGeometry(0.1, 0.2, 40);
      const railMat = new THREE.MeshBasicMaterial({ color: 0xec4899 });
      const rail = new THREE.Mesh(railGeo, railMat);
      rail.position.set(rx, 0.1, -12);
      scene.add(rail);
    });

    // Moving Road Dashes
    roadDashesRef.current = [];
    for (let i = 0; i < 15; i++) {
      const dashGeo = new THREE.BoxGeometry(0.15, 0.05, 1.2);
      const dashMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
      const dash = new THREE.Mesh(dashGeo, dashMat);
      dash.position.set(0, 0.02, -i * 2.6);
      scene.add(dash);
      roadDashesRef.current.push(dash);
    }

    // 6. 3D Speed Tunnel Rings
    tunnelRingsRef.current = [];
    for (let i = 0; i < 8; i++) {
      const ringGeo = new THREE.TorusGeometry(2.6, 0.05, 16, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(0, 1.2, -i * 5 - 3);
      scene.add(ring);
      tunnelRingsRef.current.push(ring);
    }

    // 7. 3D Future Racing Ship
    const shipGroup = new THREE.Group();
    scene.add(shipGroup);
    racerShipRef.current = shipGroup;
    shipGroup.position.set(0, 0.45, 1.5);

    // Main Cockpit Body
    const bodyGeo = new THREE.ConeGeometry(0.45, 1.6, 6);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.2,
      metalness: 0.8,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.rotation.x = Math.PI / 2;
    shipGroup.add(body);

    // Aerodynamic Wings
    const wingGeo = new THREE.BoxGeometry(1.6, 0.05, 0.6);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.3,
      metalness: 0.6,
    });
    const wings = new THREE.Mesh(wingGeo, wingMat);
    wings.position.set(0, -0.05, 0.2);
    shipGroup.add(wings);

    // Glowing Engine Thruster
    const thrusterGeo = new THREE.CylinderGeometry(0.16, 0.12, 0.2, 12);
    const thrusterMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const thruster = new THREE.Mesh(thrusterGeo, thrusterMat);
    thruster.rotation.x = Math.PI / 2;
    thruster.position.set(0, 0, 0.85);
    shipGroup.add(thruster);

    // 8. Nitro Trail Particles
    const trailCount = 60;
    const trailGeo = new THREE.BufferGeometry();
    const trailCoords = new Float32Array(trailCount * 3);
    for (let i = 0; i < trailCount * 3; i += 3) {
      trailCoords[i] = (Math.random() - 0.5) * 0.3;
      trailCoords[i + 1] = (Math.random() - 0.5) * 0.3;
      trailCoords[i + 2] = 0.9 + Math.random() * 2.5;
    }
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailCoords, 3));
    const trailMat = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.09,
      transparent: true,
      opacity: 0.8,
    });
    const trail = new THREE.Points(trailGeo, trailMat);
    shipGroup.add(trail);
    nitroTrailRef.current = trail;

    // 9. Animation Loop (High-Velocity Track Motion)
    let clock = new THREE.Clock();
    const render = () => {
      animationFrameId.current = requestAnimationFrame(render);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Highway Motion Simulation
      const currentSpeed = speedRef.current;
      roadDashesRef.current.forEach((dash) => {
        dash.position.z += delta * 18 * currentSpeed;
        if (dash.position.z > 4) {
          dash.position.z = -35;
        }
      });

      // Tunnel Rings Motion
      tunnelRingsRef.current.forEach((ring) => {
        ring.position.z += delta * 18 * currentSpeed;
        if (ring.position.z > 4) {
          ring.position.z = -36;
        }
      });

      // Ship Hover & Bank
      if (racerShipRef.current) {
        racerShipRef.current.position.y = 0.45 + Math.sin(elapsedTime * 6) * 0.04;
        racerShipRef.current.rotation.z = Math.sin(elapsedTime * 3) * 0.08;
      }

      // Camera Orbit & Track Following
      const targetCamY = 2.4 + currentRotation.current.x * 3.0;
      const targetCamX = Math.sin(currentRotation.current.y) * 4.0;
      camera.position.x += (targetCamX - camera.position.x) * 0.1;
      camera.position.y += (targetCamY - camera.position.y) * 0.1;

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

  const handleSelectChoice = (opt) => {
    if (isAnswered) return;
    setSelectedOpt(opt);
    setIsAnswered(true);
    soundService.playSfx('tap');

    const correct = opt === currentItem.correct;
    if (correct) {
      soundService.playSfx('correct');
      soundService.speakGerman(`${currentItem.pronoun} ${opt}`);
      setScore((prev) => prev + 25);
      addXp(25);
      earnCoins(10);

      // Trigger 3D Nitro Turbo Boost
      speedRef.current = 2.4;
      if (nitroTrailRef.current) {
        nitroTrailRef.current.material.size = 0.16;
        nitroTrailRef.current.material.color.set(0x06b6d4);
      }
    } else {
      soundService.playSfx('wrong');
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setIsAnswered(false);
    setTimeLeft(15);
    speedRef.current = 1.0;
    if (nitroTrailRef.current) {
      nitroTrailRef.current.material.size = 0.09;
      nitroTrailRef.current.material.color.set(0xf59e0b);
    }

    if (currentIndex < VERB_RACE_ITEMS.length - 1) {
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
              🏎️ 3D AUTOBAHN RACER {currentIndex + 1}/{VERB_RACE_ITEMS.length}
            </Text>
          </View>

          <View style={styles.hudRightRow}>
            <View style={styles.timerPill}>
              <Text style={styles.timerText}>⏱️ {timeLeft}s</Text>
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

        {/* Floating Instruction */}
        <View style={styles.instructionPill}>
          <Text style={styles.instructionText}>
            🔄 Drag 360° to adjust camera • Conjugate fast for Nitro Boost!
          </Text>
        </View>

        {/* Bottom Floating Challenge Card */}
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
            {/* Verb Prompt Header */}
            <View style={[styles.verbHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.infinitiveTag}>
                  {currentItem.verbInfinitive || currentItem.verb || 'Verb'}
                </Text>
                <View style={styles.pronounRow}>
                  <Text style={styles.pronounText}>{currentItem.pronoun}</Text>
                  <Text style={[styles.blankSlot, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                    {selectedOpt ? selectedOpt : '_________'}
                  </Text>
                </View>
                <Text style={styles.englishHint}>
                  🇬🇧 {currentItem.translation?.en} • 🇪🇬 {currentItem.translation?.ar}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.audioBtn}
                onPress={() => soundService.speakGerman(`${currentItem.pronoun} ${currentItem.correct}`)}
              >
                <Text style={styles.audioIcon}>🔊</Text>
              </TouchableOpacity>
            </View>

            {/* Conjugation Choices Grid */}
            <View style={styles.choicesGrid}>
              {currentItem.options.map((opt, idx) => {
                const isSelected = selectedOpt === opt;
                const isThisCorrect = opt === currentItem.correct;

                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.choiceBtn,
                      {
                        backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                        borderColor: isSelected
                          ? isThisCorrect ? '#10B981' : '#EF4444'
                          : isDark ? '#334155' : '#CBD5E1',
                      },
                      isSelected && (isThisCorrect ? styles.choiceSuccess : styles.choiceWrong),
                    ]}
                    onPress={() => handleSelectChoice(opt)}
                    disabled={isAnswered}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.choiceText, { color: isDark ? '#F8FAFC' : '#0F172A' }]}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Result Feedback Banner */}
            {isAnswered && (
              <View
                style={[
                  styles.feedbackCard,
                  isCorrect ? styles.feedbackSuccess : styles.feedbackDanger,
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.feedbackTitle, { color: isCorrect ? '#059669' : '#DC2626' }]}>
                    {isCorrect ? '🏎️ Vollgas! Nitro Warp Activated! (+25 XP)' : `❌ Zu langsam! Richtig: ${currentItem.correct}`}
                  </Text>
                </View>

                <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                  <Text style={styles.nextBtnText}>Next Lap ➔</Text>
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
    backgroundColor: '#050512',
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
    gap: 6,
    alignItems: 'center',
  },
  timerPill: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  timerText: {
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
    borderColor: 'rgba(245, 158, 11, 0.3)',
    zIndex: 100,
  },
  instructionText: {
    color: '#FBBF24',
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
  verbHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infinitiveTag: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F59E0B',
    marginBottom: 2,
  },
  pronounRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pronounText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FF6B55',
  },
  blankSlot: {
    fontSize: 22,
    fontWeight: '900',
  },
  englishHint: {
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
  choicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  choiceBtn: {
    flexBasis: '48%',
    flexGrow: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  choiceText: {
    fontSize: 16,
    fontWeight: '800',
  },
  choiceSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    borderColor: '#10B981',
  },
  choiceWrong: {
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    borderColor: '#EF4444',
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
  nextBtn: {
    backgroundColor: '#F59E0B',
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

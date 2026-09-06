import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  PanResponder,
  SafeAreaView,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import * as Speech from 'expo-speech';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// 10 Challenging German Audio Detective Scenarios (Phonetics, Tricky Vowels, Listening Comprehension)
const AUDIO_SCENARIOS = [
  {
    id: 1,
    audioText: 'Küche oder Kirche?',
    spokenWord: 'Küche',
    slowSpeed: 0.75,
    enClue: 'Listen carefully: "ü" vs "i+r"',
    arClue: 'استمع بتركيز: الفرق بين ü و ir 🇪🇬',
    options: [
      { text: 'Küche (Kitchen)', isCorrect: true, ar: 'مطبخ' },
      { text: 'Kirche (Church)', isCorrect: false, ar: 'كنيسة' },
      { text: 'Kuchen (Cake)', isCorrect: false, ar: 'كعكة' },
    ],
    explanation: '"Küche" has the long rounded [yː] vowel, while "Kirche" has short [ɪ] followed by "r".',
    arExplanation: 'كلمة Küche تُنطق بحرف ü المشدد (مطبخ)، بينما Kirche تعني كنيسة.',
  },
  {
    id: 2,
    audioText: 'Fünfzehn oder Fünfzig?',
    spokenWord: 'fünfzehn',
    slowSpeed: 0.75,
    enClue: 'Number ending: "-zehn" (15) vs "-zig" (50)',
    arClue: 'نهاية الرقم: عشرة (-zehn) أم خمسين (-zig) 🇪🇬',
    options: [
      { text: '15 (fünfzehn)', isCorrect: true, ar: 'خمسة عشر' },
      { text: '50 (fünfzig)', isCorrect: false, ar: 'خمسون' },
      { text: '5 (fünf)', isCorrect: false, ar: 'خمسة' },
    ],
    explanation: '-zehn ends with a sharp [tseːn], whereas -zig ends with a soft [ç] sound in standard German.',
    arExplanation: 'الأرقام من 13 إلى 19 تنتهي بـ zehn، بينما العشرات مثل 50 تنتهي بـ zig.',
  },
  {
    id: 3,
    audioText: 'Ich möchte ein Glas Wasser, bitte.',
    spokenWord: 'Ich möchte ein Glas Wasser, bitte',
    slowSpeed: 0.8,
    enClue: 'Customer order in a café',
    arClue: 'طلب زبون في المقهى 🇪🇬',
    options: [
      { text: 'Ordering water', isCorrect: true, ar: 'طلب ماء' },
      { text: 'Ordering beer', isCorrect: false, ar: 'طلب بيرة' },
      { text: 'Asking for the bill', isCorrect: false, ar: 'طلب الحساب' },
    ],
    explanation: '"Wasser" = Water. "Ich möchte" = I would like.',
    arExplanation: '"Wasser" يعني ماء، و"Ich möchte" تعني أود أو أريد بأدب.',
  },
  {
    id: 4,
    audioText: 'Bären oder Beeren?',
    spokenWord: 'Bären',
    slowSpeed: 0.75,
    enClue: 'Umlaut "ä" vs double "ee"',
    arClue: 'دببة (Bären) أم توت (Beeren)؟ 🇪🇬',
    options: [
      { text: 'Bären (Bears 🐻)', isCorrect: true, ar: 'دببة' },
      { text: 'Beeren (Berries 🍓)', isCorrect: false, ar: 'توت' },
      { text: 'Birnen (Pears 🍐)', isCorrect: false, ar: 'كمثرى' },
    ],
    explanation: '"Bären" (bears) has an open [ɛː], often similar to "Beeren" [eː] but distinct in context.',
    arExplanation: 'كلمة Bären تعني دببة، بينما Beeren تعني حبات التوت.',
  },
  {
    id: 5,
    audioText: 'Der Zug fährt um Viertel nach acht ab.',
    spokenWord: 'Der Zug fährt um Viertel nach acht ab',
    slowSpeed: 0.8,
    enClue: 'Train departure time announcement',
    arClue: 'موعد إقلاع القطار 🇪🇬',
    options: [
      { text: '08:15 (Viertel nach acht)', isCorrect: true, ar: 'الثامنة والربع' },
      { text: '07:45 (Viertel vor acht)', isCorrect: false, ar: 'الثامنة إلا ربع' },
      { text: '08:30 (Halb neun)', isCorrect: false, ar: 'الثامنة والنصف' },
    ],
    explanation: '"Viertel nach acht" means quarter past eight (8:15).',
    arExplanation: 'Viertel nach acht تعني الثامنة والربع (8:15).',
  },
  {
    id: 6,
    audioText: 'Schwül oder schwul?',
    spokenWord: 'schwül',
    slowSpeed: 0.75,
    enClue: 'Weather vs orientation adjective',
    arClue: 'طقس رطب وخانق (schwül) 🇪🇬',
    options: [
      { text: 'Schwül (Humid / muggy weather)', isCorrect: true, ar: 'طقس خانق/رطب' },
      { text: 'Kühl (Chilly)', isCorrect: false, ar: 'بارد ولطيف' },
      { text: 'Warm (Warm)', isCorrect: false, ar: 'دافئ' },
    ],
    explanation: '"Schwül" with umlaut specifically means humid, muggy weather.',
    arExplanation: 'schwül بحرف الـ ü تعني الطقس الخانق أو الشديد الرطوبة.',
  },
  {
    id: 7,
    audioText: 'Wo ist der nächste Bahnhof?',
    spokenWord: 'Wo ist der nächste Bahnhof?',
    slowSpeed: 0.8,
    enClue: 'Asking for directions in the city',
    arClue: 'سؤال عن مكان محطة القطار 🇪🇬',
    options: [
      { text: 'Next train station', isCorrect: true, ar: 'أقرب محطة قطار' },
      { text: 'Next bus stop', isCorrect: false, ar: 'أقرب موقف باص' },
      { text: 'Next airport', isCorrect: false, ar: 'أقرب مطار' },
    ],
    explanation: 'Bahnhof = Train station. Haltestelle = Bus/tram stop. Flughafen = Airport.',
    arExplanation: 'Bahnhof هي محطة القطارات المركزية.',
  },
  {
    id: 8,
    audioText: 'Hören oder gehören?',
    spokenWord: 'gehören',
    slowSpeed: 0.75,
    enClue: 'Prefix "ge-" changes meaning to belong to',
    arClue: 'فعل ينتمي إلى (gehören) أم يسمع (hören) 🇪🇬',
    options: [
      { text: 'Gehören (To belong to)', isCorrect: true, ar: 'ينتمي إلى / يخص' },
      { text: 'Hören (To hear)', isCorrect: false, ar: 'يسمع' },
      { text: 'Aufhören (To stop)', isCorrect: false, ar: 'يتوقف' },
    ],
    explanation: '"gehören" + Dativ means to belong to someone ("Das gehört mir").',
    arExplanation: 'gehören تعني يخص أو ينتمي، وتأخذ دائماً حالة المجرور Dativ.',
  },
];

export default function AudioDetective3D({ visible = true, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [pulseWave, setPulseWave] = useState(1);

  // PanResponder for 360 touch orbit
  const rotX = useRef(0.2);
  const rotY = useRef(0);
  const lastTouch = useRef({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        lastTouch.current = { x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY };
      },
      onPanResponderMove: (evt) => {
        const dx = evt.nativeEvent.pageX - lastTouch.current.x;
        const dy = evt.nativeEvent.pageY - lastTouch.current.y;
        rotY.current += dx * 0.008;
        rotX.current = Math.max(-0.6, Math.min(0.8, rotX.current + dy * 0.006));
        lastTouch.current = { x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY };
      },
    })
  ).current;

  const currentScenario = AUDIO_SCENARIOS[currentIndex % AUDIO_SCENARIOS.length];

  // Auto-play audio on new question
  useEffect(() => {
    if (visible) {
      playAudio(1.0);
    }
    return () => {
      Speech.stop();
    };
  }, [currentIndex, visible]);

  const playAudio = async (speed = 1.0) => {
    try {
      Speech.stop();
      setIsPlayingAudio(true);
      setPulseWave(2.5);
      Speech.speak(currentScenario.spokenWord, {
        language: 'de-DE',
        pitch: 1.0,
        rate: speed,
        onDone: () => {
          setIsPlayingAudio(false);
          setPulseWave(1.0);
        },
        onError: () => {
          setIsPlayingAudio(false);
          setPulseWave(1.0);
        },
      });
    } catch (err) {
      console.log('Audio Detective Speech error:', err);
      setIsPlayingAudio(false);
    }
  };

  const handleSelectOption = (option) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);

    if (option.isCorrect) {
      setIsCorrect(true);
      setScore((s) => s + 100);
      setStreak((s) => s + 1);
      setFeedbackMsg('🎯 Ausgezeichnet! Sound Identified!');
      setPulseWave(3.5);
    } else {
      setIsCorrect(false);
      setStreak(0);
      setFeedbackMsg('❌ Falsch! Listen closer next time');
    }
  };

  const handleNext = () => {
    Speech.stop();
    setSelectedOption(null);
    setIsCorrect(null);
    setFeedbackMsg('');
    setCurrentIndex((c) => c + 1);
  };

  // 3D Scene WebGL Setup
  const onContextCreate = async (gl) => {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060919, 0.04);

    const camera = new THREE.PerspectiveCamera(60, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
    camera.position.set(0, 3, 9);

    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setClearColor(0x060919, 1);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x223355, 1.2);
    scene.add(ambientLight);

    const cyanPoint = new THREE.PointLight(0x00f3ff, 2.5, 25);
    cyanPoint.position.set(0, 4, 3);
    scene.add(cyanPoint);

    const purplePoint = new THREE.PointLight(0xa855f7, 2, 25);
    purplePoint.position.set(0, -3, -2);
    scene.add(purplePoint);

    // Central Glowing Acoustic Sphere (Sound Core)
    const coreGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00f3ff,
      emissive: 0x0066aa,
      roughness: 0.2,
      metalness: 0.9,
      wireframe: true,
    });
    const soundCore = new THREE.Mesh(coreGeo, coreMat);
    scene.add(soundCore);

    // Inner Glowing Core Orb
    const innerGeo = new THREE.SphereGeometry(1.1, 24, 24);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
    });
    const innerOrb = new THREE.Mesh(innerGeo, innerMat);
    soundCore.add(innerOrb);

    // 32 Circular Equalizer Audio Frequency Bars in a Halo Ring
    const numBars = 32;
    const barRadius = 4.2;
    const bars = [];
    const barGeo = new THREE.BoxGeometry(0.2, 1, 0.2);

    for (let i = 0; i < numBars; i++) {
      const angle = (i / numBars) * Math.PI * 2;
      const hue = i / numBars;
      const barColor = new THREE.Color().setHSL(hue * 0.4 + 0.5, 0.9, 0.6); // Cyan to Purple
      const barMat = new THREE.MeshStandardMaterial({
        color: barColor,
        emissive: barColor,
        emissiveIntensity: 0.5,
        roughness: 0.3,
      });

      const barMesh = new THREE.Mesh(barGeo, barMat);
      barMesh.position.x = Math.cos(angle) * barRadius;
      barMesh.position.z = Math.sin(angle) * barRadius;
      barMesh.position.y = -1;
      barMesh.rotation.y = -angle;
      scene.add(barMesh);
      bars.push(barMesh);
    }

    // Concentric Wave Rings
    const ringGeo1 = new THREE.RingGeometry(2.5, 2.55, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x00f3ff, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
    const waveRing1 = new THREE.Mesh(ringGeo1, ringMat1);
    waveRing1.rotation.x = Math.PI / 2;
    scene.add(waveRing1);

    const ringGeo2 = new THREE.RingGeometry(3.6, 3.65, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xa855f7, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
    const waveRing2 = new THREE.Mesh(ringGeo2, ringMat2);
    waveRing2.rotation.x = Math.PI / 2;
    scene.add(waveRing2);

    // Sound Particle Dust
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const particleCoords = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particleCoords[i] = (Math.random() - 0.5) * 14;
      particleCoords[i + 1] = (Math.random() - 0.5) * 10;
      particleCoords[i + 2] = (Math.random() - 0.5) * 14;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particleCoords, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x67e8f9,
      size: 0.09,
      transparent: true,
      opacity: 0.75,
    });
    const particleField = new THREE.Points(particleGeo, particleMat);
    scene.add(particleField);

    // Animation Loop
    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Camera Orbit
      const dist = 9;
      camera.position.x = dist * Math.sin(rotY.current) * Math.cos(rotX.current);
      camera.position.y = dist * Math.sin(rotX.current) + 1.2;
      camera.position.z = dist * Math.cos(rotY.current) * Math.cos(rotX.current);
      camera.lookAt(0, 0, 0);

      // Core rotation & sound vibration
      soundCore.rotation.y = time * 0.6;
      soundCore.rotation.x = Math.sin(time * 0.4) * 0.2;

      // Equalizer bars dynamic audio dance
      const activePulse = isPlayingAudio ? 2.8 : 0.8;
      bars.forEach((bar, idx) => {
        const freq = Math.sin(time * 6 + idx * 0.5) * 0.5 + 0.5;
        const h = 0.4 + freq * 2.2 * activePulse;
        bar.scale.set(1, h, 1);
        bar.position.y = -1 + h / 2;
      });

      // Sound rings expansion
      waveRing1.scale.setScalar(1 + (Math.sin(time * 3) * 0.15 * activePulse));
      waveRing2.scale.setScalar(1 + (Math.cos(time * 2.5) * 0.15 * activePulse));

      // Particle floating
      particleField.rotation.y = time * 0.05;

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      scene.clear();
      renderer.dispose();
    };
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.container} {...panResponder.panHandlers}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        {/* Real-Time Three.js WebGL Audio Chamber Canvas */}
        <GLView style={StyleSheet.absoluteFill} onContextCreate={onContextCreate} />

        <SafeAreaView style={styles.overlaySafe}>
          {/* Top Glass Header */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>

            <View style={styles.titlePill}>
              <MaterialCommunityIcons name="waveform" size={18} color="#00f3ff" style={{ marginRight: 6 }} />
              <Text style={styles.titleText}>AUDIO DETECTIVE 3D</Text>
            </View>

            <View style={styles.statsPill}>
              <Text style={styles.scoreText}>⭐ {score}</Text>
              <Text style={styles.streakText}>🔥 {streak}</Text>
            </View>
          </View>

          {/* 360 Orbit Helper Pill */}
          <View style={styles.orbitHint}>
            <MaterialCommunityIcons name="axis-z-rotate-clockwise" size={14} color="#94a3b8" />
            <Text style={styles.orbitHintText}>Drag 360° to Orbit Frequency Chamber</Text>
          </View>

          {/* Audio Speaker Core Card */}
          <View style={styles.audioCenterCard}>
            <Text style={styles.scenarioIndex}>MISSION #{currentIndex + 1} / {AUDIO_SCENARIOS.length}</Text>
            <Text style={styles.clueEn}>🇬🇧 {currentScenario.enClue}</Text>
            <Text style={styles.clueAr}>🇪🇬 {currentScenario.arClue}</Text>

            {/* Interactive Audio Controls */}
            <View style={styles.audioActionRow}>
              <TouchableOpacity
                style={[styles.audioPlayBtn, isPlayingAudio && styles.audioPlayBtnActive]}
                onPress={() => playAudio(1.0)}
                activeOpacity={0.8}
              >
                <Ionicons name={isPlayingAudio ? 'volume-high' : 'play'} size={28} color="#fff" />
                <Text style={styles.audioPlayText}>
                  {isPlayingAudio ? 'Playing...' : 'Play Native Audio'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.audioSlowBtn}
                onPress={() => playAudio(currentScenario.slowSpeed)}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="turtle" size={24} color="#38bdf8" />
                <Text style={styles.audioSlowText}>0.7x Slow</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Multiple Choice Options Floating HUD */}
          <View style={styles.optionsWrapper}>
            <Text style={styles.promptHeader}>What did you hear?</Text>
            <View style={styles.optionsGrid}>
              {currentScenario.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                let bgStyle = styles.optDefault;
                let borderColor = 'rgba(255,255,255,0.15)';

                if (isSelected) {
                  if (option.isCorrect) {
                    bgStyle = styles.optCorrect;
                    borderColor = '#10b981';
                  } else {
                    bgStyle = styles.optWrong;
                    borderColor = '#ef4444';
                  }
                } else if (selectedOption !== null && option.isCorrect) {
                  bgStyle = styles.optCorrect;
                  borderColor = '#10b981';
                }

                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.optionBtn, bgStyle, { borderColor }]}
                    onPress={() => handleSelectOption(option)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.optionText}>{option.text}</Text>
                    <Text style={styles.optionAr}>🇪🇬 {option.ar}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Explanation & Next Step Banner */}
            {selectedOption !== null && (
              <View style={[styles.feedbackBanner, isCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>
                <Text style={styles.feedbackTitle}>{feedbackMsg}</Text>
                <Text style={styles.explanationText}>🇬🇧 {currentScenario.explanation}</Text>
                <Text style={styles.explanationAr}>🇪🇬 {currentScenario.arExplanation}</Text>

                <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.85}>
                  <Text style={styles.nextBtnText}>NEXT SOUND CHALLENGE ➡️</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060919',
  },
  overlaySafe: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 6 : 8,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  titlePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 243, 255, 0.3)',
  },
  titleText: {
    color: '#00f3ff',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1,
  },
  statsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  scoreText: {
    color: '#fbbf24',
    fontWeight: '700',
    fontSize: 12,
  },
  streakText: {
    color: '#f97316',
    fontWeight: '700',
    fontSize: 12,
  },
  orbitHint: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
    marginTop: 4,
  },
  orbitHintText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '500',
  },
  audioCenterCard: {
    alignSelf: 'center',
    width: width * 0.92,
    backgroundColor: 'rgba(15, 23, 42, 0.82)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 243, 255, 0.25)',
    alignItems: 'center',
  },
  scenarioIndex: {
    color: '#00f3ff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  clueEn: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  clueAr: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  audioActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  audioPlayBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0284c7',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
    shadowColor: '#00f3ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  audioPlayBtnActive: {
    backgroundColor: '#06b6d4',
  },
  audioPlayText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  audioSlowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  audioSlowText: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: '700',
  },
  optionsWrapper: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'android' ? 20 : 12,
  },
  promptHeader: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  optionsGrid: {
    gap: 8,
  },
  optionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optDefault: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
  },
  optCorrect: {
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
  },
  optWrong: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
  },
  optionText: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '700',
  },
  optionAr: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600',
  },
  feedbackBanner: {
    marginTop: 10,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  feedbackCorrect: {
    backgroundColor: 'rgba(6, 78, 59, 0.88)',
    borderColor: '#10b981',
  },
  feedbackWrong: {
    backgroundColor: 'rgba(127, 29, 29, 0.88)',
    borderColor: '#ef4444',
  },
  feedbackTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  explanationText: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  explanationAr: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
    lineHeight: 16,
  },
  nextBtn: {
    backgroundColor: '#00f3ff',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  nextBtnText: {
    color: '#020617',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.5,
  },
});

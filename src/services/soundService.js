import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

class SoundService {
  constructor() {
    this.isMuted = false;
    this.speechRate = 0.9; // Optimal pace for language learners
    this.activeSpeechToken = 0;
    this.isSpeaking = false;
    this.isPaused = false;
    this.currentTrackId = null;
    this.currentText = '';
    this.currentOptions = {};
    this.listeners = new Set();
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (muted) {
      this.stopSpeech();
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(state) {
    this.isSpeaking = state;
    if (!state) {
      this.isPaused = false;
    }
    this.listeners.forEach((l) => {
      try {
        l({ isSpeaking: this.isSpeaking, isPaused: this.isPaused, currentTrackId: this.currentTrackId });
      } catch (e) {}
    });
  }

  /**
   * Speak German text with native speech synthesis, strictly preventing overlaps.
   * @param {string} text - German text to speak
   * @param {object} options - { slow: boolean, onStart: func, onDone: func }
   */
  async speakGerman(text, options = {}) {
    return this.speak(text, { ...options, language: 'de-DE' });
  }

  /**
   * Speak Arabic text with native speech synthesis, strictly preventing overlaps.
   * @param {string} text - Arabic text to speak
   * @param {object} options - { slow: boolean, onStart: func, onDone: func }
   */
  async speakArabic(text, options = {}) {
    return this.speak(text, { ...options, language: 'ar-SA' });
  }

  /**
   * Speak English text with native speech synthesis, strictly preventing overlaps.
   * @param {string} text - English text to speak
   * @param {object} options - { slow: boolean, onStart: func, onDone: func }
   */
  async speakEnglish(text, options = {}) {
    return this.speak(text, { ...options, language: 'en-US' });
  }

  /**
   * Speak text in German, English, or Arabic with overlap prevention
   * @param {string} text 
   * @param {object} options { language: 'de-DE'|'en-US'|'ar-SA', slow: boolean, onStart: func, onDone: func }
   */
  async speak(text, options = {}) {
    if (this.isMuted || !text) return;

    // Increment speech token to invalidate any previous utterances
    const currentToken = ++this.activeSpeechToken;

    try {
      // 1. Instantly stop any ongoing speech to avoid overlaps
      try {
        await Speech.stop();
      } catch (err) {
        // ignore
      }

      // If token changed while stopping, abort
      if (this.activeSpeechToken !== currentToken) return;

      // Clean text of emojis, markdown, and parentheticals
      const cleanText = text
        .replace(/\([^)]*\)/g, '')
        .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
        .replace(/[*_#`~]/g, '')
        .trim();

      if (!cleanText) {
        this.notify(false);
        return;
      }

      const lang = options.language || 'de-DE';
      const rate = options.slow ? 0.65 : 0.88;

      this.notify(true);
      if (options.onStart) options.onStart();

      Speech.speak(cleanText, {
        language: lang,
        pitch: 1.0,
        rate,
        onStart: () => {
          if (this.activeSpeechToken === currentToken) {
            this.notify(true);
          }
        },
        onDone: () => {
          if (this.activeSpeechToken === currentToken) {
            this.notify(false);
            if (options.onDone) options.onDone();
          }
        },
        onStopped: () => {
          if (this.activeSpeechToken === currentToken) {
            this.notify(false);
          }
        },
        onError: (err) => {
          if (this.activeSpeechToken === currentToken) {
            this.notify(false);
            if (options.onDone) options.onDone();
            if (options.onError) options.onError(err);
          }
        },
      });
    } catch (e) {
      console.warn('[SoundService] Speech synthesis error:', e);
      this.notify(false);
      if (options.onDone) options.onDone();
    }
  }

  /**
   * Stop any running speech or audio track immediately
   */
  async stopSpeech() {
    this.activeSpeechToken++;
    this.currentTrackId = null;
    this.isPaused = false;
    this.notify(false);
    try {
      await Speech.stop();
    } catch (e) {
      // ignore
    }
  }

  /**
   * Alias for stopSpeech to ensure full backward and cross-screen compatibility
   */
  async stopAudio() {
    return this.stopSpeech();
  }

  /**
   * Pause speech synthesis if supported, or gracefully stop while preserving resume state
   */
  async pauseAudio() {
    if (!this.isSpeaking) return;
    this.isPaused = true;
    this.isSpeaking = false;
    this.notify(false);
    try {
      if (Speech.pause) {
        await Speech.pause();
      } else {
        await Speech.stop();
      }
    } catch (e) {
      // fallback
    }
  }

  /**
   * Resume audio or replay the preserved text
   */
  async resumeAudio(options = {}) {
    if (!this.isPaused || !this.currentText) return;
    this.isPaused = false;
    this.isSpeaking = true;
    this.notify(true);
    try {
      if (Speech.resume) {
        await Speech.resume();
      } else {
        await this.speak(this.currentText, { ...this.currentOptions, ...options });
      }
    } catch (e) {
      await this.speak(this.currentText, { ...this.currentOptions, ...options });
    }
  }

  /**
   * Seamlessly play, pause, or switch audio tracks
   * @param {string|number} trackId
   * @param {string} text
   * @param {object} options
   */
  async toggleTrackAudio(trackId, text, options = {}) {
    if (this.currentTrackId === trackId) {
      // Currently active/playing track tapped -> Stop/Pause
      await this.stopAudio();
      return { status: 'stopped', trackId: null };
    }

    // New track or currently stopped -> Start playing
    await this.stopAudio();
    this.currentTrackId = trackId;
    this.currentText = text;
    this.currentOptions = options;

    await this.speakGerman(text, {
      ...options,
      onDone: () => {
        if (this.currentTrackId === trackId) {
          this.currentTrackId = null;
        }
        if (options.onDone) options.onDone();
      },
      onError: (err) => {
        if (this.currentTrackId === trackId) {
          this.currentTrackId = null;
        }
        if (options.onError) options.onError(err);
      },
    });

    return { status: 'playing', trackId };
  }

  getCurrentTrackId() {
    return this.currentTrackId;
  }

  isAudioPlaying() {
    return this.isSpeaking;
  }

  /**
   * Trigger physical haptic feedback
   * @param {'light'|'medium'|'heavy'|'success'|'warning'|'error'} type
   */
  async triggerHaptic(type = 'light') {
    if (Platform.OS === 'web') return;
    try {
      switch (type) {
        case 'light':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'success':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'warning':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'error':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        default:
          await Haptics.selectionAsync();
          break;
      }
    } catch (e) {
      // Haptics not supported on some simulators
    }
  }

  /**
   * Play dynamic sound effect with corresponding haptic sensation
   * @param {'tap'|'correct'|'error'|'coin'|'streak'|'levelUp'|'chest'|'whoosh'} type
   */
  async playSfx(type) {
    if (this.isMuted) return;

    switch (type) {
      case 'correct':
        this.triggerHaptic('success');
        break;
      case 'error':
        this.triggerHaptic('error');
        break;
      case 'coin':
      case 'streak':
        this.triggerHaptic('medium');
        break;
      case 'levelUp':
      case 'chest':
        this.triggerHaptic('heavy');
        break;
      case 'tap':
      case 'whoosh':
      default:
        this.triggerHaptic('light');
        break;
    }
  }

  playTap() {
    return this.playSfx('tap');
  }

  playCorrect() {
    return this.playSfx('correct');
  }

  playError() {
    return this.playSfx('error');
  }
}

export const soundService = new SoundService();
export default soundService;

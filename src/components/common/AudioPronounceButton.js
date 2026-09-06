import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Animated, View, Text } from 'react-native';
import soundService from '../../services/soundService';
import SpecialIcon from './SpecialIcon';
import { colors } from '../../styles/theme';

export default function AudioPronounceButton({
  text,
  lang = 'de',
  size = 20,
  color = colors.accent,
  slow = false,
  style,
  flag,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));

  React.useEffect(() => {
    return () => {
      pulseAnim.stopAnimation();
    };
  }, [pulseAnim]);

  const handlePlay = async () => {
    if (!text) return;

    if (isPlaying) {
      // Stop active playback immediately
      await soundService.stopAudio();
      setIsPlaying(false);
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
      return;
    }

    setIsPlaying(true);
    soundService.playSfx('tap');

    // Pulse animation while playing
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.25,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 350,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const langCode = lang === 'ar' ? 'ar-SA' : lang === 'en' ? 'en-US' : 'de-DE';

    await soundService.speak(text, {
      language: langCode,
      slow,
      onDone: () => {
        setIsPlaying(false);
        pulseAnim.stopAnimation();
        pulseAnim.setValue(1);
      },
      onError: () => {
        setIsPlaying(false);
        pulseAnim.stopAnimation();
        pulseAnim.setValue(1);
      },
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePlay}
      style={[
        styles.container,
        isPlaying && styles.containerActive,
        style,
      ]}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Animated.View style={[{ transform: [{ scale: pulseAnim }] }, styles.innerRow]}>
        {flag ? <Text style={styles.flagText}>{flag}</Text> : null}
        <SpecialIcon
          name={slow ? 'speaker_slow' : isPlaying ? 'wave_sound' : 'speaker_loud'}
          size={size}
          color={isPlaying ? colors.primary : color}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerActive: {
    backgroundColor: 'rgba(96, 165, 250, 0.3)',
    borderColor: colors.primary,
  },
  innerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  flagText: {
    fontSize: 12,
  },
});

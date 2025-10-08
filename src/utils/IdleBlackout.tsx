// IdleBlackout.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  AppState, StatusBar, StyleSheet, View, AppStateStatus, Platform, NativeModules,
  Animated,
  Easing,
} from 'react-native';
import DeviceBrightness from '@adrianso/react-native-device-brightness';

const Immersive = NativeModules?.ImmersiveMode; // optional native module below

const fadeMs = 450
const minBrightness = 0
const brightnessTweenMs = 800

export default function IdleBlackout({
  children,
  idleMs = 30_000,
}: { children: React.ReactNode; idleMs?: number }) {
  const [idle, setIdle] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prev = useRef<number | null>(null);

   // overlay opacity animation
   const opacity = useRef(new Animated.Value(0)).current;

  // brightness tween (requestAnimationFrame)
  const rafId = useRef<number | null>(null);
  const stopBrightnessTween = () => {
    if (rafId.current != null) cancelAnimationFrame(rafId.current);
    rafId.current = null;
  };
  const tweenBrightness = async (to: number, ms: number) => {
    // read current level (fallback to prev or mid)
    let from = prev.current ?? 0.5;
    try { from = await DeviceBrightness.getBrightnessLevel(); } catch {}
    const start = Date.now();
    const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

    stopBrightnessTween();
    const step = () => {
      const t = Math.min(1, (Date.now() - start) / ms);
      const eased = easeInOutQuad(t);
      const value = from + (to - from) * eased;
      // fire-and-forget; don’t await in the loop
      DeviceBrightness.setBrightnessLevel(value).catch(() => {});
      if (t < 1) {
        rafId.current = requestAnimationFrame(step);
      } else {
        rafId.current = null;
      }
    };
    rafId.current = requestAnimationFrame(step);
  };

  const armTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    setIdle(false);
    timer.current = setTimeout(() => setIdle(true), idleMs);
  };

  const onAppState = (s: AppStateStatus) => {
    if (s !== 'active') {
      if (timer.current) clearTimeout(timer.current);
      wake(false);
    } else {
      armTimer();
    }
  };

  const sleep = async () => {
    try {
      if (prev.current == null) {
        prev.current = await DeviceBrightness.getBrightnessLevel();
      }
    } catch { prev.current = prev.current ?? 0.5; }

    // hide system UI first to avoid flash
    StatusBar.setHidden(true, 'fade');
    if (Platform.OS === 'android') Immersive?.enter?.();

    // animate overlay in
    Animated.timing(opacity, {
      toValue: 1,
      duration: fadeMs,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // animate brightness down
    await tweenBrightness(minBrightness, brightnessTweenMs);
  };

  const wake = async (animate = true) => {
    // animate overlay out
    Animated.timing(opacity, {
      toValue: 0,
      duration: animate ? fadeMs : 0,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // animate brightness back to previous
    stopBrightnessTween();
    const target = prev.current ?? 0.5;
    await tweenBrightness(target, animate ? brightnessTweenMs : 0);
    prev.current = null;

    // restore system UI
    StatusBar.setHidden(false, 'fade');
    if (Platform.OS === 'android') Immersive?.exit?.();
    setIdle(false);
  };

  useEffect(() => {
    armTimer();
    const sub = AppState.addEventListener('change', onAppState);
    return () => {
      sub.remove();
      if (timer.current) clearTimeout(timer.current);
      stopBrightnessTween();
      wake(false);
    };
  }, [idleMs, fadeMs, brightnessTweenMs]);

  useEffect(() => {
    if (idle) sleep();
    // when idle resets from any touch, wake() is called via handlers below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idle]);

  // Capture any touch anywhere to wake + reset timer
  const handleAnyTouch = () => {
    if (idle) {
      // first tap: wake
      wake();
    }
    armTimer();
  };

  return (
    <View
      style={S.flex}
      onStartShouldSetResponder={() => true}
      onResponderGrant={handleAnyTouch}
      onTouchStart={handleAnyTouch}
    >
      {children}

      {/* Overlay stays mounted for smooth fade both ways */}
      <Animated.View
        pointerEvents={idle ? 'auto' : 'none'}
        style={[S.overlay, { opacity }]}
      />
    </View>
  );
}

const S = StyleSheet.create({
  flex: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'black' },
});
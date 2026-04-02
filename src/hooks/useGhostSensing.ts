"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface BumpEvent {
  timestamp: number;
  intensity: number;
  latitude: number;
  longitude: number;
}

interface GhostSensingState {
  isActive: boolean;
  isSupported: boolean;
  permissionGranted: boolean | null; // null = not asked yet
  bumpCount: number;
  lastIntensity: number;
  recentBumps: BumpEvent[];
  requestPermission: () => Promise<void>;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

const BUMP_THRESHOLD = 15; // m/s² — total acceleration spike
const COOLDOWN_MS = 1000;   // min gap between bumps

export function useGhostSensing(): GhostSensingState {
  const [isActive, setIsActive] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [bumpCount, setBumpCount] = useState(0);
  const [lastIntensity, setLastIntensity] = useState(0);
  const [recentBumps, setRecentBumps] = useState<BumpEvent[]>([]);

  const lastBumpAt = useRef<number>(0);
  const locationRef = useRef<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
  const activeRef = useRef(false);

  // Check support on mount
  useEffect(() => {
    setIsSupported(typeof window !== "undefined" && "DeviceMotionEvent" in window);
  }, []);

  // Track GPS continuously
  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        locationRef.current = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
      },
      undefined,
      { enableHighAccuracy: true, maximumAge: 5000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const handleMotion = useCallback((e: DeviceMotionEvent) => {
    if (!activeRef.current) return;

    const acc = e.accelerationIncludingGravity;
    if (!acc?.x || !acc?.y || !acc?.z) return;

    const magnitude = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
    // Gravity baseline ~9.8 m/s², spike = how far above that
    const spike = Math.abs(magnitude - 9.8);

    setLastIntensity(Math.round(spike * 10) / 10);

    if (spike >= BUMP_THRESHOLD) {
      const now = Date.now();
      if (now - lastBumpAt.current < COOLDOWN_MS) return;
      lastBumpAt.current = now;

      // Haptic feedback
      if ("vibrate" in navigator) {
        navigator.vibrate([80, 30, 80]);
      }

      const bump: BumpEvent = {
        timestamp: now,
        intensity: Math.round(spike * 10) / 10,
        latitude: locationRef.current.lat,
        longitude: locationRef.current.lng,
      };

      setBumpCount((c) => c + 1);
      setRecentBumps((prev) => [bump, ...prev].slice(0, 10));
    }
  }, []);

  // Request iOS 13+ permission
  const requestPermission = useCallback(async () => {
    // iOS requires explicit permission
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const DeviceMotionEventAny = DeviceMotionEvent as any;
    if (typeof DeviceMotionEventAny.requestPermission === "function") {
      try {
        const result = await DeviceMotionEventAny.requestPermission();
        setPermissionGranted(result === "granted");
      } catch {
        setPermissionGranted(false);
      }
    } else {
      // Android / desktop — no permission needed
      setPermissionGranted(true);
    }
  }, []);

  const start = useCallback(() => {
    activeRef.current = true;
    setIsActive(true);
    window.addEventListener("devicemotion", handleMotion);
  }, [handleMotion]);

  const stop = useCallback(() => {
    activeRef.current = false;
    setIsActive(false);
    window.removeEventListener("devicemotion", handleMotion);
  }, [handleMotion]);

  const reset = useCallback(() => {
    setBumpCount(0);
    setLastIntensity(0);
    setRecentBumps([]);
    lastBumpAt.current = 0;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      activeRef.current = false;
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, [handleMotion]);

  return {
    isActive,
    isSupported,
    permissionGranted,
    bumpCount,
    lastIntensity,
    recentBumps,
    requestPermission,
    start,
    stop,
    reset,
  };
}

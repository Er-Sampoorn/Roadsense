"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useGhostSensing } from "@/hooks/useGhostSensing";

export default function GhostPage() {
  const ghost = useGhostSensing();
  const [showInfo, setShowInfo] = useState(false);

  const handleToggle = async () => {
    if (ghost.isActive) {
      ghost.stop();
      return;
    }

    // Request permission first (needed on iOS)
    if (ghost.permissionGranted === null) {
      await ghost.requestPermission();
    }

    ghost.start();
  };

  const severityColor = ghost.lastIntensity >= 15
    ? "#EF4444"
    : ghost.lastIntensity >= 8
    ? "#F59E0B"
    : ghost.lastIntensity >= 3
    ? "#3B82F6"
    : "#22C55E";

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20 pb-12 min-h-screen">
        <div className="max-w-lg mx-auto px-4 sm:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1
              className="text-3xl sm:text-4xl font-bold text-white mb-3"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Ghost <span className="gradient-text">Sensing</span>
            </h1>
            <p className="text-[#94A3B8] max-w-md mx-auto text-sm sm:text-base">
              Uses your phone&apos;s accelerometer &amp; gyroscope to detect road
              bumps automatically while you drive.
            </p>
          </motion.div>

          {/* Sensor Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-3xl p-6 sm:p-8 mb-6"
          >
            {/* Support Check */}
            {!ghost.isSupported && (
              <div className="p-4 rounded-xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] mb-6">
                <div className="flex items-center gap-2 text-[#EF4444] font-semibold text-sm mb-1">
                  ⚠️ Sensor Not Available
                </div>
                <p className="text-xs text-[#94A3B8]">
                  Your device doesn&apos;t support motion sensors. Use a smartphone
                  to enable ghost sensing.
                </p>
              </div>
            )}

            {/* Permission needed (iOS) */}
            {ghost.isSupported && ghost.permissionGranted === false && (
              <div className="p-4 rounded-xl bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.3)] mb-6">
                <div className="flex items-center gap-2 text-[#F59E0B] font-semibold text-sm mb-1">
                  🔒 Permission Denied
                </div>
                <p className="text-xs text-[#94A3B8]">
                  Motion sensor access was denied. Go to your browser settings and
                  allow motion/orientation access for this site.
                </p>
              </div>
            )}

            {/* Big Toggle Button */}
            <div className="flex flex-col items-center gap-6">
              <button
                onClick={handleToggle}
                disabled={!ghost.isSupported || ghost.permissionGranted === false}
                className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-500"
              >
                {/* Outer glow ring */}
                <div
                  className={`absolute inset-0 rounded-full transition-all duration-700 ${
                    ghost.isActive
                      ? "animate-pulse-glow"
                      : ""
                  }`}
                  style={{
                    boxShadow: ghost.isActive
                      ? `0 0 40px ${severityColor}40, 0 0 80px ${severityColor}20`
                      : "0 0 20px rgba(59,130,246,0.1)",
                  }}
                />
                {/* Button face */}
                <div
                  className={`absolute inset-2 rounded-full flex flex-col items-center justify-center transition-all duration-500 border-2 ${
                    ghost.isActive
                      ? "bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-[rgba(59,130,246,0.4)]"
                      : "bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-[rgba(59,130,246,0.15)] hover:border-[rgba(59,130,246,0.3)]"
                  }`}
                >
                  <div className={`text-4xl sm:text-5xl mb-1 transition-transform duration-300 ${ghost.isActive ? "animate-float" : ""}`}>
                    {ghost.isActive ? "📡" : "🛡️"}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    {ghost.isActive ? "SCANNING" : "TAP TO START"}
                  </span>
                  {ghost.isActive && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                      <span className="text-[10px] text-[#22C55E]">LIVE</span>
                    </div>
                  )}
                </div>
              </button>

              {ghost.isActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <button
                    onClick={() => ghost.stop()}
                    className="px-5 py-2 rounded-xl bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.3)] text-[#EF4444] text-sm font-medium hover:bg-[rgba(239,68,68,0.25)] transition-colors"
                  >
                    ⏹ Stop Scanning
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Live Metrics */}
          <AnimatePresence>
            {ghost.isActive && (
              <motion.div
                initial={{ opacity: 0, y: 20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mb-6"
              >
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {/* Bump counter */}
                  <div className="glass rounded-2xl p-5 text-center">
                    <div className="text-xs text-[#64748B] uppercase tracking-wider mb-1">
                      Bumps Detected
                    </div>
                    <div
                      className="text-4xl sm:text-5xl font-bold"
                      style={{
                        fontFamily: "Space Grotesk, sans-serif",
                        color: ghost.bumpCount > 0 ? "#F59E0B" : "#3B82F6",
                      }}
                    >
                      {ghost.bumpCount}
                    </div>
                  </div>

                  {/* Live intensity */}
                  <div className="glass rounded-2xl p-5 text-center">
                    <div className="text-xs text-[#64748B] uppercase tracking-wider mb-1">
                      Vibration Level
                    </div>
                    <div
                      className="text-4xl sm:text-5xl font-bold transition-colors duration-200"
                      style={{
                        fontFamily: "Space Grotesk, sans-serif",
                        color: severityColor,
                      }}
                    >
                      {ghost.lastIntensity.toFixed(1)}
                    </div>
                    <div className="text-[10px] text-[#64748B] mt-0.5">
                      m/s²
                    </div>
                  </div>
                </div>

                {/* Intensity bar */}
                <div className="glass rounded-2xl p-4">
                  <div className="flex items-center justify-between text-xs text-[#64748B] mb-2">
                    <span>Sensor Intensity</span>
                    <span style={{ color: severityColor }}>
                      {ghost.lastIntensity >= 15
                        ? "🔴 BUMP!"
                        : ghost.lastIntensity >= 8
                        ? "🟡 Rough"
                        : ghost.lastIntensity >= 3
                        ? "🔵 Mild"
                        : "🟢 Smooth"}
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[rgba(15,23,42,0.8)] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      animate={{
                        width: `${Math.min((ghost.lastIntensity / 25) * 100, 100)}%`,
                        backgroundColor: severityColor,
                      }}
                      transition={{ duration: 0.15 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recent Bumps Log */}
          {ghost.recentBumps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-3xl p-6 mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-base font-semibold text-white"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  📋 Bump Log
                </h3>
                <button
                  onClick={ghost.reset}
                  className="text-xs text-[#64748B] hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
                {ghost.recentBumps.map((bump, i) => (
                  <motion.div
                    key={bump.timestamp}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-[rgba(30,41,59,0.5)] border border-[rgba(59,130,246,0.08)]"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            bump.intensity >= 20
                              ? "#EF4444"
                              : bump.intensity >= 15
                              ? "#F59E0B"
                              : "#3B82F6",
                        }}
                      />
                      <div>
                        <div className="text-xs font-medium text-white">
                          Bump — {bump.intensity} m/s²
                        </div>
                        <div className="text-[10px] text-[#64748B]">
                          {bump.latitude.toFixed(5)}, {bump.longitude.toFixed(5)}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#64748B]">
                      {new Date(bump.timestamp).toLocaleTimeString()}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="w-full glass rounded-2xl p-4 text-left flex items-center justify-between group hover:bg-[rgba(30,41,59,0.8)] transition-colors"
            >
              <span className="text-sm font-medium text-white">
                ℹ️ How Ghost Sensing Works
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`text-[#64748B] transition-transform duration-300 ${
                  showInfo ? "rotate-180" : ""
                }`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            <AnimatePresence>
              {showInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 mt-2 rounded-2xl bg-[rgba(30,41,59,0.4)] border border-[rgba(59,130,246,0.08)] space-y-3">
                    {[
                      {
                        icon: "📱",
                        title: "Accelerometer Sensor",
                        desc: "Reads your phone's motion sensor (DeviceMotionEvent) to measure acceleration forces in X, Y, Z axes.",
                      },
                      {
                        icon: "📊",
                        title: "Spike Detection",
                        desc: `When total acceleration exceeds ${15} m/s² beyond gravity (9.8 m/s²), it's flagged as a road bump.`,
                      },
                      {
                        icon: "📳",
                        title: "Haptic Feedback",
                        desc: "Your phone vibrates on each detected bump using navigator.vibrate() — a double pulse pattern.",
                      },
                      {
                        icon: "📍",
                        title: "GPS Tagging",
                        desc: "Each bump is tagged with GPS coordinates using the Geolocation API for mapping.",
                      },
                    ].map((item) => (
                      <div key={item.title} className="flex gap-3">
                        <span className="text-xl flex-shrink-0">{item.icon}</span>
                        <div>
                          <div className="text-xs font-semibold text-white mb-0.5">
                            {item.title}
                          </div>
                          <div className="text-xs text-[#94A3B8] leading-relaxed">
                            {item.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}

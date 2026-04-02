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
    if (ghost.isActive) { ghost.stop(); return; }
    if (ghost.permissionGranted === null) await ghost.requestPermission();
    ghost.start();
  };

  const severityColor = ghost.lastIntensity >= 15 ? "#FF5A5A" : ghost.lastIntensity >= 8 ? "#F5A623" : ghost.lastIntensity >= 3 ? "#4A9FF5" : "#34C77B";

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20 pb-12 min-h-screen">
        <div className="max-w-lg mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1A2332] mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Ghost <span className="gradient-text">Sensing</span>
            </h1>
            <p className="text-[#5A6B82] max-w-md mx-auto text-sm">
              Uses your phone&apos;s accelerometer &amp; gyroscope to detect road bumps while you drive.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card rounded-3xl p-6 sm:p-8 mb-6">
            {!ghost.isSupported && (
              <div className="p-4 rounded-xl bg-[#FF5A5A]/5 border border-[#FF5A5A]/15 mb-6">
                <div className="text-[#FF5A5A] font-semibold text-sm mb-1">⚠️ Sensor Not Available</div>
                <p className="text-xs text-[#5A6B82]">Use a smartphone to enable ghost sensing.</p>
              </div>
            )}

            <div className="flex flex-col items-center gap-6">
              <button onClick={handleToggle} disabled={!ghost.isSupported || ghost.permissionGranted === false}
                className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-500">
                <div className={`absolute inset-0 rounded-full transition-all duration-700 ${ghost.isActive ? "animate-pulse-glow" : ""}`}
                  style={{ boxShadow: ghost.isActive ? `0 0 40px ${severityColor}30` : "0 0 16px rgba(74,159,245,0.06)" }} />
                <div className={`absolute inset-2 rounded-full flex flex-col items-center justify-center transition-all duration-500 border-2 ${
                  ghost.isActive ? "bg-white border-[#4A9FF5]/25" : "bg-white border-[#E8F2FF] hover:border-[#4A9FF5]/20"}`}>
                  <div className={`text-4xl mb-1 transition-transform duration-300 ${ghost.isActive ? "animate-float" : ""}`}>{ghost.isActive ? "📡" : "🛡️"}</div>
                  <span className="text-xs font-semibold text-[#1A2332]">{ghost.isActive ? "SCANNING" : "TAP TO START"}</span>
                  {ghost.isActive && (
                    <div className="flex items-center gap-1 mt-1"><span className="w-1.5 h-1.5 rounded-full bg-[#34C77B] animate-pulse" /><span className="text-[10px] text-[#34C77B] font-medium">LIVE</span></div>
                  )}
                </div>
              </button>
              {ghost.isActive && (
                <button onClick={() => ghost.stop()} className="px-5 py-2 rounded-xl bg-[#FF5A5A]/8 border border-[#FF5A5A]/15 text-[#FF5A5A] text-sm font-medium hover:bg-[#FF5A5A]/12 transition-colors">
                  ⏹ Stop
                </button>
              )}
            </div>
          </motion.div>

          <AnimatePresence>
            {ghost.isActive && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mb-6">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="card rounded-2xl p-5 text-center">
                    <div className="text-[11px] text-[#8A9AB5] uppercase tracking-wider mb-1">Bumps</div>
                    <div className="text-4xl font-bold" style={{ fontFamily: "Space Grotesk", color: ghost.bumpCount > 0 ? "#F5A623" : "#4A9FF5" }}>{ghost.bumpCount}</div>
                  </div>
                  <div className="card rounded-2xl p-5 text-center">
                    <div className="text-[11px] text-[#8A9AB5] uppercase tracking-wider mb-1">Vibration</div>
                    <div className="text-4xl font-bold transition-colors" style={{ fontFamily: "Space Grotesk", color: severityColor }}>{ghost.lastIntensity.toFixed(1)}</div>
                    <div className="text-[10px] text-[#8A9AB5]">m/s²</div>
                  </div>
                </div>
                <div className="card rounded-2xl p-4">
                  <div className="flex items-center justify-between text-xs text-[#8A9AB5] mb-2">
                    <span>Intensity</span>
                    <span style={{ color: severityColor }}>{ghost.lastIntensity >= 15 ? "🔴 BUMP!" : ghost.lastIntensity >= 8 ? "🟡 Rough" : ghost.lastIntensity >= 3 ? "🔵 Mild" : "🟢 Smooth"}</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#F5F9FF] overflow-hidden">
                    <motion.div className="h-full rounded-full" animate={{ width: `${Math.min((ghost.lastIntensity / 25) * 100, 100)}%`, backgroundColor: severityColor }} transition={{ duration: 0.15 }} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {ghost.recentBumps.length > 0 && (
            <div className="card rounded-2xl p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[#1A2332]" style={{ fontFamily: "Space Grotesk" }}>📋 Bump Log</h3>
                <button onClick={ghost.reset} className="text-xs text-[#8A9AB5] hover:text-[#1A2332] transition-colors">Clear</button>
              </div>
              <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar">
                {ghost.recentBumps.map((bump, i) => (
                  <motion.div key={bump.timestamp} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#F5F9FF] border border-[#E8F2FF]">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: bump.intensity >= 20 ? "#FF5A5A" : bump.intensity >= 15 ? "#F5A623" : "#4A9FF5" }} />
                      <div>
                        <div className="text-xs font-medium text-[#1A2332]">Bump — {bump.intensity} m/s²</div>
                        <div className="text-[10px] text-[#8A9AB5]">{bump.latitude.toFixed(5)}, {bump.longitude.toFixed(5)}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#8A9AB5]">{new Date(bump.timestamp).toLocaleTimeString()}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <button onClick={() => setShowInfo(!showInfo)} className="w-full card rounded-xl p-4 text-left flex items-center justify-between">
            <span className="text-sm font-medium text-[#1A2332]">ℹ️ How It Works</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-[#8A9AB5] transition-transform ${showInfo ? "rotate-180" : ""}`}><path d="M6 9l6 6 6-6" /></svg>
          </button>
          <AnimatePresence>
            {showInfo && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="p-4 mt-2 rounded-xl bg-[#F5F9FF] border border-[#E8F2FF] space-y-3">
                  {[
                    { icon: "📱", title: "Accelerometer", desc: "Reads acceleration forces in X, Y, Z axes via DeviceMotionEvent." },
                    { icon: "📊", title: "Spike Detection", desc: "Flags bumps when acceleration exceeds 15 m/s² above gravity." },
                    { icon: "📳", title: "Haptic Feedback", desc: "Phone vibrates on each bump detection using navigator.vibrate()." },
                    { icon: "📍", title: "GPS Tagging", desc: "Each bump is tagged with GPS coordinates for mapping." },
                  ].map((it) => (
                    <div key={it.title} className="flex gap-3">
                      <span className="text-lg">{it.icon}</span>
                      <div><div className="text-xs font-semibold text-[#1A2332] mb-0.5">{it.title}</div><div className="text-xs text-[#5A6B82]">{it.desc}</div></div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}

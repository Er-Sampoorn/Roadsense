"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const stats = [
  { value: "12,847", label: "Reports Filed", icon: "📋" },
  { value: "8,234", label: "Issues Resolved", icon: "✅" },
  { value: "156", label: "Active Zones", icon: "📍" },
  { value: "94%", label: "AI Accuracy", icon: "🤖" },
];

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
    title: "AI Vision Analysis",
    description:
      "Gemini AI instantly analyzes road damage photos, classifying severity and recommending priority levels.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    title: "Real-Time Mapping",
    description:
      "Interactive heatmaps show road health across your city with live updates and smart clustering.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20V10" />
        <path d="M18 20V4" />
        <path d="M6 20v-4" />
      </svg>
    ),
    title: "Priority Scoring",
    description:
      "Smart formula scores every report by severity, traffic volume, and age to optimize repair schedules.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: "Multilingual Chatbot",
    description:
      "Report issues in Hindi, English, or any language. Our AI chatbot understands and acts on your words.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: "Ghost Sensing",
    description:
      "Passive accelerometer data from your phone detects road bumps automatically — no manual reporting needed.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    ),
    title: "Citizen Rewards",
    description:
      "Earn points for every verified report. Redeem for transit credits, local vouchers, and civic badges.",
  },
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function LandingHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#F59E0B]/8 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-[#3B82F6] mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            AI-Powered Civic Intelligence Platform
          </motion.div>

          {/* Heading */}
          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Smarter Roads.
            <br />
            <span className="gradient-text">Safer Cities.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-[#94A3B8] mb-10 leading-relaxed">
            Report road hazards with a photo. Our AI analyzes severity, maps
            danger zones, and helps municipalities fix what matters most — in
            real time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link
              href="/report"
              className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-semibold text-base transition-all duration-300 hover:scale-105 glow-primary"
            >
              <span className="relative z-10 flex items-center gap-2">
                Report an Issue
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="transition-transform group-hover:translate-x-1"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
            <Link
              href="/map"
              className="px-8 py-4 rounded-xl border border-[rgba(59,130,246,0.2)] text-[#94A3B8] font-semibold text-base transition-all duration-300 hover:bg-white/5 hover:text-white hover:border-[rgba(59,130,246,0.4)]"
            >
              View Road Map
            </Link>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="glass rounded-2xl p-6 sm:p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div
                  className="text-2xl sm:text-3xl font-bold text-white"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  {stat.value}
                </div>
                <div className="text-xs text-[#64748B] mt-1 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function LandingFeatures() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-dots" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Enterprise-Grade <span className="gradient-text">Features</span>
          </h2>
          <p className="text-[#94A3B8] max-w-2xl mx-auto text-lg">
            Built for scale. Designed for impact. Every feature works together
            to create the most comprehensive road safety platform.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group glass rounded-2xl p-6 transition-all duration-300 hover:bg-[rgba(30,41,59,0.8)] hover:border-[rgba(59,130,246,0.3)] cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-[rgba(59,130,246,0.1)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3
                className="text-lg font-semibold text-white mb-2"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {feature.title}
              </h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function LandingCTA() {
  return (
    <section className="relative py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass rounded-3xl p-10 sm:p-16 relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent" />
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Ready to Make Your
            <br />
            <span className="gradient-text-accent">Roads Safer?</span>
          </h2>
          <p className="text-[#94A3B8] max-w-xl mx-auto mb-8 text-lg">
            Join thousands of citizens who are already using RoadSense to
            improve their communities. It takes 30 seconds to report an issue.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/report"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black font-bold text-base transition-all duration-300 hover:scale-105 glow-accent"
            >
              Start Reporting →
            </Link>
            <Link
              href="/admin"
              className="px-8 py-4 rounded-xl border border-[rgba(245,158,11,0.3)] text-[#F59E0B] font-semibold text-base transition-all duration-300 hover:bg-[rgba(245,158,11,0.1)]"
            >
              Municipal Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

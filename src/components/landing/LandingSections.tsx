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
    icon: "🔍",
    title: "Smart Reporting",
    description:
      "AI-powered issue detection with precise location tracking",
  },
  {
    icon: "🗺️",
    title: "Live Road Map",
    description:
      "Interactive heatmaps show road health across your city in real time",
  },
  {
    icon: "📊",
    title: "Priority Scoring",
    description:
      "Smart formula scores every report by severity, traffic, and age",
  },
  {
    icon: "💬",
    title: "Multilingual Chatbot",
    description:
      "Report issues in Hindi, English, or any language. Our AI understands all",
  },
  {
    icon: "📡",
    title: "Ghost Sensing",
    description:
      "Passive accelerometer data detects road bumps automatically — no manual input",
  },
  {
    icon: "🏆",
    title: "Earn Rewards",
    description:
      "Get recognized for your civic contributions with tokens and badges",
  },
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export function LandingHero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Floating shapes */}
      <div className="floating-shape w-5 h-5 top-[20%] right-[15%] animate-float" style={{ animationDelay: "0s" }} />
      <div className="floating-shape w-3 h-3 top-[35%] right-[25%] animate-float" style={{ animationDelay: "1s" }} />
      <div className="floating-shape w-4 h-4 top-[50%] right-[10%] animate-float" style={{ animationDelay: "2s" }} />
      <div className="floating-shape w-6 h-6 top-[15%] right-[35%] animate-float" style={{ animationDelay: "0.5s" }} />
      <div className="floating-shape w-3 h-3 top-[60%] right-[30%] animate-float" style={{ animationDelay: "1.5s" }} />

      {/* Subtle gradient orbs */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[#4A9FF5]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#87CEEB]/8 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12 lg:gap-20">
          {/* Left side — Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex-1 max-w-2xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4A9FF5]/8 border border-[#4A9FF5]/12 text-xs font-medium text-[#4A9FF5] mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#34C77B] animate-pulse" />
              AI-Powered Civic Intelligence
            </motion.div>

            {/* Main heading */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-[#1A2332] mb-5"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Make Your City
              <br />
              <span className="gradient-text">Better Together</span>
            </h1>

            <p className="text-base sm:text-lg text-[#5A6B82] mb-8 leading-relaxed max-w-lg">
              Join thousands of citizens using AI-powered technology to create
              positive change in their communities.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-start gap-3 mb-12">
              <Link
                href="/report"
                className="btn-primary text-sm flex items-center gap-2"
              >
                Start Reporting
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/map" className="btn-outline text-sm">
                View Road Map
              </Link>
            </div>

            {/* Feature bullets */}
            <div className="space-y-4">
              {[
                {
                  icon: "📍",
                  title: "Smart Reporting",
                  desc: "AI-powered issue detection with precise location tracking",
                },
                {
                  icon: "👥",
                  title: "Community Impact",
                  desc: "Connect with 10,000+ active citizens making real change",
                },
                {
                  icon: "🏆",
                  title: "Earn Rewards",
                  desc: "Get recognized for your civic contributions with tokens",
                },
              ].map((f) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-lg mt-0.5">{f.icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-[#1A2332]">
                      {f.title}
                    </div>
                    <div className="text-sm text-[#5A6B82]">{f.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Trust bar */}
            <div className="flex items-center gap-5 mt-8 text-xs text-[#8A9AB5]">
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Secure & Private
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                4.9/5 Rating
              </span>
            </div>
          </motion.div>

          {/* Right side — Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-full lg:w-auto lg:min-w-[360px]"
          >
            <div className="card p-6 sm:p-8 rounded-2xl">
              <h3
                className="text-xl font-bold text-[#1A2332] mb-1 text-center"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Platform Stats
              </h3>
              <p className="text-sm text-[#8A9AB5] text-center mb-6">
                Real-time civic impact metrics
              </p>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="text-center p-4 rounded-xl bg-[#F5F9FF] border border-[#E8F2FF]"
                  >
                    <div className="text-xl mb-1">{stat.icon}</div>
                    <div
                      className="text-2xl font-bold text-[#1A2332]"
                      style={{ fontFamily: "Space Grotesk, sans-serif" }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-[11px] text-[#8A9AB5] mt-0.5 uppercase tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function LandingFeatures() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-dots" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center mb-14"
        >
          <h2
            className="text-3xl sm:text-4xl font-bold text-[#1A2332] mb-3"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Built for <span className="gradient-text">Impact</span>
          </h2>
          <p className="text-[#5A6B82] max-w-xl mx-auto text-base">
            Every feature works together to create the most comprehensive
            civic intelligence platform.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="card p-6 rounded-2xl cursor-default group"
            >
              <div className="w-11 h-11 rounded-xl bg-[#F5F9FF] border border-[#E8F2FF] flex items-center justify-center mb-4 text-xl group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3
                className="text-base font-semibold text-[#1A2332] mb-1.5"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {feature.title}
              </h3>
              <p className="text-sm text-[#5A6B82] leading-relaxed">
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
    <section className="relative py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="card rounded-3xl p-10 sm:p-16 relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#4A9FF5] to-transparent rounded-full" />
          <h2
            className="text-2xl sm:text-3xl font-bold text-[#1A2332] mb-3"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Ready to Make Your
            <br />
            <span className="gradient-text-accent">Roads Safer?</span>
          </h2>
          <p className="text-[#5A6B82] max-w-md mx-auto mb-8 text-base">
            Join thousands of citizens already using RoadSense. It takes 30
            seconds to report an issue.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/report"
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#FF8C42] to-[#F5A623] text-white font-semibold text-sm transition-all duration-200 hover:scale-[1.02] glow-accent"
            >
              Start Reporting →
            </Link>
            <Link
              href="/admin"
              className="btn-outline text-sm"
            >
              Municipal Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

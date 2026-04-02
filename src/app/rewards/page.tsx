"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatBot } from "@/components/chatbot/ChatBot";

const tiers = [
  {
    name: "Bronze Reporter",
    minPoints: 0,
    icon: "🥉",
    color: "#CD7F32",
    perks: ["Basic reporter badge", "Report tracking dashboard", "Community visibility"],
  },
  {
    name: "Silver Citizen",
    minPoints: 100,
    icon: "🥈",
    color: "#C0C0C0",
    perks: ["Priority support", "Monthly safety digest", "Special profile frame"],
  },
  {
    name: "Gold Guardian",
    minPoints: 500,
    icon: "🥇",
    color: "#FFD700",
    perks: ["Transit credits", "Early feature access", "Quarterly recognition"],
  },
  {
    name: "Platinum Sentinel",
    minPoints: 1000,
    icon: "💎",
    color: "#E5E4E2",
    perks: ["City council invite", "VIP civic events", "Annual award nomination"],
  },
];

const redeemOptions = [
  { name: "Bus Pass (1 Day)", points: 50, icon: "🚌" },
  { name: "Metro Card ₹100", points: 100, icon: "🚇" },
  { name: "Coffee Voucher", points: 30, icon: "☕" },
  { name: "Tree Planting", points: 200, icon: "🌳" },
  { name: "City Tour Ticket", points: 150, icon: "🏛️" },
  { name: "Grocery Coupon ₹250", points: 250, icon: "🛒" },
];

const recentActivity = [
  { action: "Report submitted: Pothole on MG Road", points: 30, date: "Today" },
  { action: "Report verified by municipal authority", points: 10, date: "Yesterday" },
  { action: "Report resolved: Crack on NH-44", points: 20, date: "2 days ago" },
  { action: "5 upvotes on your report", points: 5, date: "3 days ago" },
  { action: "Report submitted: Waterlogging", points: 50, date: "Last week" },
];

export default function RewardsPage() {
  const [demoPoints] = useState(285);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);

  const currentTier = tiers.reduce(
    (acc, tier) => (demoPoints >= tier.minPoints ? tier : acc),
    tiers[0]
  );
  const nextTier = tiers.find((t) => t.minPoints > demoPoints) || null;
  const progressToNext = nextTier
    ? ((demoPoints - currentTier.minPoints) /
        (nextTier.minPoints - currentTier.minPoints)) *
      100
    : 100;

  const handleRedeem = async (option: (typeof redeemOptions)[0]) => {
    setRedeemingId(option.name);
    // Simulate redemption
    await new Promise((resolve) => setTimeout(resolve, 1500));
    alert(`🎉 Redeemed: ${option.name}\nVoucher: RS-${Date.now().toString(36).toUpperCase()}`);
    setRedeemingId(null);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1
              className="text-3xl sm:text-4xl font-bold text-white mb-3"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Citizen <span className="gradient-text-accent">Rewards</span>
            </h1>
            <p className="text-[#94A3B8] max-w-xl mx-auto">
              Earn points for every verified report. Redeem for transit credits, local vouchers, and civic badges.
            </p>
          </motion.div>

          {/* Points Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-3xl p-8 mb-8"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Points Display */}
              <div className="text-center md:text-left flex-1">
                <div className="text-sm text-[#64748B] uppercase tracking-wider mb-1">
                  Your Balance
                </div>
                <div
                  className="text-5xl sm:text-6xl font-bold gradient-text-accent mb-2"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  {demoPoints}
                </div>
                <div className="text-[#94A3B8]">reward points</div>
              </div>

              {/* Current Tier */}
              <div className="text-center px-8 py-6 rounded-2xl bg-[rgba(15,23,42,0.6)] border border-[rgba(59,130,246,0.1)]">
                <div className="text-4xl mb-2">{currentTier.icon}</div>
                <div
                  className="text-lg font-bold"
                  style={{ color: currentTier.color }}
                >
                  {currentTier.name}
                </div>
                {nextTier && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
                      <span>{demoPoints} pts</span>
                      <span>{nextTier.minPoints} pts</span>
                    </div>
                    <div className="w-48 h-2 rounded-full bg-[rgba(30,41,59,0.8)]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] transition-all duration-500"
                        style={{ width: `${progressToNext}%` }}
                      />
                    </div>
                    <div className="text-xs text-[#64748B] mt-1">
                      {nextTier.minPoints - demoPoints} pts to{" "}
                      {nextTier.name}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tiers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <h3
                className="text-lg font-semibold text-white mb-4"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Reward Tiers
              </h3>
              <div className="space-y-3">
                {tiers.map((tier) => (
                  <div
                    key={tier.name}
                    className={`p-4 rounded-xl transition-all duration-300 ${
                      currentTier.name === tier.name
                        ? "glass border-[rgba(245,158,11,0.3)]"
                        : "bg-[rgba(30,41,59,0.3)] border border-[rgba(59,130,246,0.05)]"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl">{tier.icon}</span>
                      <div>
                        <div
                          className="font-semibold text-sm"
                          style={{ color: tier.color }}
                        >
                          {tier.name}
                        </div>
                        <div className="text-xs text-[#64748B]">
                          {tier.minPoints}+ points
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {tier.perks.map((perk) => (
                        <div
                          key={perk}
                          className="text-xs text-[#94A3B8] flex items-center gap-1.5"
                        >
                          <span className="text-[#22C55E]">✓</span>
                          {perk}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Redeem & Activity */}
            <div className="lg:col-span-2 space-y-8">
              {/* Redeem Options */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3
                  className="text-lg font-semibold text-white mb-4"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  Redeem Points
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {redeemOptions.map((option) => (
                    <div
                      key={option.name}
                      className="glass rounded-xl p-4 flex items-center justify-between hover:bg-[rgba(30,41,59,0.8)] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{option.icon}</span>
                        <div>
                          <div className="text-sm font-medium text-white">
                            {option.name}
                          </div>
                          <div className="text-xs text-[#F59E0B]">
                            {option.points} points
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRedeem(option)}
                        disabled={
                          demoPoints < option.points ||
                          redeemingId === option.name
                        }
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {redeemingId === option.name ? "..." : "Redeem"}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Activity Log */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3
                  className="text-lg font-semibold text-white mb-4"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  Recent Activity
                </h3>
                <div className="space-y-2">
                  {recentActivity.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl bg-[rgba(30,41,59,0.3)] border border-[rgba(59,130,246,0.05)]"
                    >
                      <div>
                        <div className="text-sm text-white">{item.action}</div>
                        <div className="text-xs text-[#64748B]">
                          {item.date}
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-[#22C55E]">
                        +{item.points}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <ChatBot />
      <Footer />
    </>
  );
}

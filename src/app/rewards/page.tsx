"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatBot } from "@/components/chatbot/ChatBot";

const tiers = [
  { name: "Bronze Reporter", minPoints: 0, icon: "🥉", color: "#CD7F32", perks: ["Basic reporter badge", "Report tracking", "Community visibility"] },
  { name: "Silver Citizen", minPoints: 100, icon: "🥈", color: "#8A9AB5", perks: ["Priority support", "Monthly digest", "Profile frame"] },
  { name: "Gold Guardian", minPoints: 500, icon: "🥇", color: "#F5A623", perks: ["Transit credits", "Early access", "Quarterly recognition"] },
  { name: "Platinum Sentinel", minPoints: 1000, icon: "💎", color: "#4A9FF5", perks: ["Council invite", "VIP events", "Annual award"] },
];

const redeemOptions = [
  { name: "Bus Pass (1 Day)", points: 50, icon: "🚌" },
  { name: "Metro Card ₹100", points: 100, icon: "🚇" },
  { name: "Coffee Voucher", points: 30, icon: "☕" },
  { name: "Tree Planting", points: 200, icon: "🌳" },
  { name: "City Tour Ticket", points: 150, icon: "🏛️" },
  { name: "Grocery ₹250", points: 250, icon: "🛒" },
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

  const currentTier = tiers.reduce((acc, tier) => (demoPoints >= tier.minPoints ? tier : acc), tiers[0]);
  const nextTier = tiers.find((t) => t.minPoints > demoPoints) || null;
  const progressToNext = nextTier ? ((demoPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100 : 100;

  const handleRedeem = async (option: (typeof redeemOptions)[0]) => {
    setRedeemingId(option.name);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    alert(`🎉 Redeemed: ${option.name}\nVoucher: RS-${Date.now().toString(36).toUpperCase()}`);
    setRedeemingId(null);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1A2332] mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Citizen <span className="gradient-text-accent">Rewards</span>
            </h1>
            <p className="text-[#5A6B82] max-w-lg mx-auto text-sm">
              Earn points for every verified report. Redeem for transit credits, vouchers, and badges.
            </p>
          </motion.div>

          {/* Points Overview */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card rounded-2xl p-6 sm:p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="text-center md:text-left flex-1">
                <div className="text-xs text-[#8A9AB5] uppercase tracking-wider mb-1">Your Balance</div>
                <div className="text-5xl sm:text-6xl font-bold gradient-text-accent" style={{ fontFamily: "Space Grotesk" }}>{demoPoints}</div>
                <div className="text-[#8A9AB5] text-sm">reward points</div>
              </div>
              <div className="text-center px-8 py-6 rounded-2xl bg-[#F5F9FF] border border-[#E8F2FF]">
                <div className="text-3xl mb-2">{currentTier.icon}</div>
                <div className="text-base font-bold" style={{ color: currentTier.color }}>{currentTier.name}</div>
                {nextTier && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-[#8A9AB5] mb-1">
                      <span>{demoPoints} pts</span><span>{nextTier.minPoints} pts</span>
                    </div>
                    <div className="w-44 h-2 rounded-full bg-[#E8F2FF]">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#FF8C42] to-[#F5A623] transition-all duration-500" style={{ width: `${progressToNext}%` }} />
                    </div>
                    <div className="text-xs text-[#8A9AB5] mt-1">{nextTier.minPoints - demoPoints} pts to {nextTier.name}</div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tiers */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1">
              <h3 className="text-base font-semibold text-[#1A2332] mb-4" style={{ fontFamily: "Space Grotesk" }}>Reward Tiers</h3>
              <div className="space-y-3">
                {tiers.map((tier) => (
                  <div key={tier.name} className={`p-4 rounded-xl transition-all ${currentTier.name === tier.name ? "card border-[#4A9FF5]/20" : "bg-[#F5F9FF] border border-[#E8F2FF]"}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl">{tier.icon}</span>
                      <div>
                        <div className="font-semibold text-sm" style={{ color: tier.color }}>{tier.name}</div>
                        <div className="text-xs text-[#8A9AB5]">{tier.minPoints}+ pts</div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {tier.perks.map((perk) => (
                        <div key={perk} className="text-xs text-[#5A6B82] flex items-center gap-1.5">
                          <span className="text-[#34C77B]">✓</span>{perk}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="lg:col-span-2 space-y-6">
              {/* Redeem */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h3 className="text-base font-semibold text-[#1A2332] mb-4" style={{ fontFamily: "Space Grotesk" }}>Redeem Points</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {redeemOptions.map((option) => (
                    <div key={option.name} className="card rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{option.icon}</span>
                        <div>
                          <div className="text-sm font-medium text-[#1A2332]">{option.name}</div>
                          <div className="text-xs text-[#FF8C42] font-medium">{option.points} pts</div>
                        </div>
                      </div>
                      <button onClick={() => handleRedeem(option)} disabled={demoPoints < option.points || redeemingId === option.name}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#FF8C42] to-[#F5A623] text-white hover:scale-105 transition-transform disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100">
                        {redeemingId === option.name ? "..." : "Redeem"}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Activity */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <h3 className="text-base font-semibold text-[#1A2332] mb-4" style={{ fontFamily: "Space Grotesk" }}>Recent Activity</h3>
                <div className="space-y-2">
                  {recentActivity.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#F5F9FF] border border-[#E8F2FF]">
                      <div>
                        <div className="text-sm text-[#1A2332]">{item.action}</div>
                        <div className="text-xs text-[#8A9AB5]">{item.date}</div>
                      </div>
                      <span className="text-sm font-semibold text-[#34C77B]">+{item.points}</span>
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

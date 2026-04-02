import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { userId, pointsToRedeem, rewardType } = await request.json();

    if (!userId || !pointsToRedeem || !rewardType) {
      return NextResponse.json(
        { error: "userId, pointsToRedeem, and rewardType are required" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Calculate current balance
    const { data: ledger } = await supabase
      .from("rewards_ledger")
      .select("points")
      .eq("user_id", userId);

    const balance = (ledger || []).reduce(
      (sum: number, e: { points: number }) => sum + e.points,
      0
    );

    if (balance < pointsToRedeem) {
      return NextResponse.json(
        { error: "Insufficient points", balance },
        { status: 400 }
      );
    }

    // Deduct points
    const { error } = await supabase.from("rewards_ledger").insert({
      user_id: userId,
      points: -pointsToRedeem,
      reason: `Redeemed: ${rewardType}`,
    });

    if (error) throw error;

    const voucherCode = `RS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      voucherCode,
      newBalance: balance - pointsToRedeem,
    });
  } catch (err) {
    console.error("Redeem API error:", err);
    return NextResponse.json(
      { error: "Failed to redeem rewards" },
      { status: 500 }
    );
  }
}

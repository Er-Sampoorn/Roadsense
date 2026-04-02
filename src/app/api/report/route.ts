import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { calculatePriorityScore, getRewardPoints } from "@/lib/scoring";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const description = formData.get("description") as string;
    const latitude = parseFloat(formData.get("latitude") as string);
    const longitude = parseFloat(formData.get("longitude") as string);
    const category = (formData.get("category") as string) || "other";
    const severity = parseInt(formData.get("severity") as string) || 5;
    const aiSummary = formData.get("ai_summary") as string;
    const imageUrl = formData.get("image_url") as string;
    const reporterName = formData.get("reporter_name") as string;
    const address = formData.get("address") as string;

    if (!description || !latitude || !longitude) {
      return NextResponse.json(
        { error: "Description, latitude, and longitude are required" },
        { status: 400 }
      );
    }

    const priorityScore = calculatePriorityScore(severity, 3, 0);
    const rewardPoints = getRewardPoints(severity);

    const supabase = createServiceClient();

    const { data: report, error } = await supabase
      .from("reports")
      .insert({
        description,
        latitude,
        longitude,
        category,
        severity_score: severity,
        priority_score: priorityScore,
        ai_summary: aiSummary || null,
        image_url: imageUrl || null,
        reporter_name: reporterName || "Anonymous",
        address: address || null,
        status: "pending",
        upvotes: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to create report" },
        { status: 500 }
      );
    }

    // Add reward points
    await supabase.from("rewards_ledger").insert({
      user_id: report.user_id || "anonymous",
      points: rewardPoints,
      reason: `Report submitted: ${category} (severity ${severity})`,
      report_id: report.id,
    });

    return NextResponse.json({ report, rewardPoints }, { status: 201 });
  } catch (err) {
    console.error("Report API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .order("priority_score", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (err) {
    console.error("Reports fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}

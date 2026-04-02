/**
 * Priority Score Formula: P = (S × V) + T
 * S = severity (1-10, from Gemini Vision)
 * V = traffic volume proxy (1-5, based on road tier)
 * T = days open (computed from created_at)
 */

export function calculatePriorityScore(
  severity: number,
  trafficVolume: number = 3,
  daysOpen: number = 0
): number {
  const S = Math.min(Math.max(severity, 1), 10);
  const V = Math.min(Math.max(trafficVolume, 1), 5);
  const T = Math.max(daysOpen, 0);
  return Math.round((S * V + T) * 10) / 10;
}

export function getPriorityLabel(score: number): {
  label: string;
  color: string;
} {
  if (score >= 40) return { label: "Critical", color: "#EF4444" };
  if (score >= 25) return { label: "High", color: "#F97316" };
  if (score >= 15) return { label: "Medium", color: "#EAB308" };
  return { label: "Low", color: "#22C55E" };
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "pending":
      return "#F59E0B";
    case "in_progress":
      return "#3B82F6";
    case "resolved":
      return "#22C55E";
    case "rejected":
      return "#EF4444";
    default:
      return "#6B7280";
  }
}

export function getRewardPoints(severity: number): number {
  if (severity >= 8) return 50;
  if (severity >= 5) return 30;
  return 10;
}

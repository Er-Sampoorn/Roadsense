export interface Report {
  id: string;
  user_id?: string;
  category: "pothole" | "crack" | "waterlogging" | "debris" | "signage" | "other";
  description: string;
  latitude: number;
  longitude: number;
  image_url?: string;
  severity_score: number;
  priority_score: number;
  status: "pending" | "in_progress" | "resolved" | "rejected";
  upvotes: number;
  ai_summary?: string;
  created_at: string;
  resolved_at?: string;
  reporter_name?: string;
  address?: string;
}

export interface RewardEntry {
  id: string;
  user_id: string;
  points: number;
  reason: string;
  report_id?: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface GhostVibrationLog {
  id: string;
  session_id: string;
  latitude: number;
  longitude: number;
  intensity: number;
  created_at: string;
}

export interface AIAnalysis {
  category: Report["category"];
  severity: number;
  description: string;
  estimated_size: string;
  urgency: "low" | "medium" | "high" | "critical";
}

export interface ReportFormData {
  description: string;
  latitude: number;
  longitude: number;
  image?: File;
  reporter_name?: string;
  address?: string;
}

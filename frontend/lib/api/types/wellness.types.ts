export interface DashboardSummary {
  latest_category: string | null;
  current_streak: number;
}

export interface InsightsSummary {
  total_assessments?: number;
  average_score?: number;
  trend?: string;
}


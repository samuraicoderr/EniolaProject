import { api } from "../ApiClient";
import BackendRoutes from "../BackendRoutes";

export interface VocabularyItem {
  id: string;
  english: string;
  yoruba: string;
  category: "animals" | "colors" | "numbers" | "objects";
  emoji: string;
  audio_url?: string;
}

export interface UserProgressItem {
  id: string;
  category: "animals" | "colors" | "numbers" | "objects";
  stars: number;
  completed: boolean;
  last_played: string;
}

export interface LeaderboardUser {
  username: string;
  first_name: string;
  last_name: string;
  stars: number;
  is_self: boolean;
  rank: number;
}

export interface ChatMessageItem {
  id: string;
  role: "user" | "assistant";
  text: string;
  audio_url?: string;
  timestamp: string;
}

export interface CoachStatusResponse {
  active: boolean;
  messages: ChatMessageItem[];
}

export interface AdminSettings {
  fal_api_key: string;
  llm_provider: "groq" | "openai" | "gemini" | "anthropic";
  llm_api_key: string;
  llm_model: string;
}

export interface AdminStats {
  totals: {
    users: number;
    stars: number;
    lessons_completed: number;
    chat_sessions: number;
  };
  signups: { date: string; signups: number }[];
  billing: {
    date: string;
    llm_cost: number;
    voice_cost: number;
    total_cost: number;
  }[];
}

export const YorubaService = {
  getVocabulary: async (category?: string): Promise<VocabularyItem[]> => {
    const response = await api.get<VocabularyItem[]>(
      BackendRoutes.yoruba.vocabulary,
      category ? { params: { category } } : undefined
    );
    return response.data;
  },

  getProgress: async (): Promise<UserProgressItem[]> => {
    const response = await api.get<UserProgressItem[]>(BackendRoutes.yoruba.progress);
    return response.data;
  },

  updateProgress: async (
    category: string,
    stars: number,
    completed: boolean
  ): Promise<UserProgressItem> => {
    const response = await api.post<UserProgressItem>(BackendRoutes.yoruba.updateProgress, {
      category,
      stars,
      completed,
    });
    return response.data;
  },

  getLeaderboard: async (): Promise<LeaderboardUser[]> => {
    const response = await api.get<LeaderboardUser[]>(BackendRoutes.yoruba.leaderboard);
    return response.data;
  },

  getCoachStatusAndHistory: async (): Promise<CoachStatusResponse> => {
    const response = await api.get<CoachStatusResponse>(BackendRoutes.yoruba.coachChat);
    return response.data;
  },

  sendCoachMessage: async (text: string): Promise<ChatMessageItem> => {
    const response = await api.post<ChatMessageItem>(BackendRoutes.yoruba.coachChat, { text });
    return response.data;
  },

  getAdminSettings: async (): Promise<AdminSettings> => {
    const response = await api.get<AdminSettings>(BackendRoutes.yoruba.adminSettings);
    return response.data;
  },

  updateAdminSettings: async (settings: Partial<AdminSettings>): Promise<AdminSettings> => {
    const response = await api.put<AdminSettings>(BackendRoutes.yoruba.adminSettings, settings);
    return response.data;
  },

  getAdminStats: async (): Promise<AdminStats> => {
    const response = await api.get<AdminStats>(BackendRoutes.yoruba.adminStats);
    return response.data;
  },
};

export default YorubaService;

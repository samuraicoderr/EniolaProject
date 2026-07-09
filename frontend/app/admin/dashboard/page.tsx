"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useRequiredAuth } from "@/lib/api/auth/authContext";
import YorubaService, { AdminSettings, AdminStats } from "@/lib/api/services/Yoruba.Service";

// Safe import for Recharts elements
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function AdminDashboardPage() {
  const auth = useRequiredAuth();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<AdminSettings>({
    fal_api_key: "",
    llm_provider: "groq",
    llm_api_key: "",
    llm_model: "llama-3.1-8b-instant",
  });
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Redirect if not staff
  useEffect(() => {
    if (!auth.isLoading && auth.user && !auth.user.is_staff) {
      router.replace("/");
    }
  }, [auth.isLoading, auth.user, router]);

  useEffect(() => {
    setMounted(true);
    if (auth.isAuthenticated && auth.user?.is_staff) {
      Promise.all([
        YorubaService.getAdminSettings(),
        YorubaService.getAdminStats(),
      ])
        .then(([settingsData, statsData]) => {
          setSettings(settingsData);
          setStats(statsData);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error loading admin data:", err);
          setErrorMsg("Failed to load administrative configurations.");
          setLoading(false);
        });
    }
  }, [auth.isAuthenticated, auth.user]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const updated = await YorubaService.updateAdminSettings(settings);
      setSettings(updated);
      setSuccessMsg("Settings updated successfully!");
      setSaving(false);
    } catch (err: any) {
      console.error("Error updating settings:", err);
      setErrorMsg(err.message || "Failed to update API settings.");
      setSaving(false);
    }
  };

  const getSuggestedModels = (provider: string) => {
    switch (provider) {
      case "groq":
        return ["llama-3.1-8b-instant", "llama-3.1-70b-versatile", "mixtral-8x7b-32768"];
      case "openai":
        return ["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"];
      case "gemini":
        return ["gemini-1.5-flash", "gemini-1.5-pro"];
      case "anthropic":
        return ["claude-3-5-sonnet-20240620", "claude-3-haiku-20240307"];
      default:
        return [];
    }
  };

  if (auth.isLoading || loading || !auth.user || !auth.user.is_staff) {
    return (
      <div className="min-h-screen bg-[#F2E1C0] flex items-center justify-center">
        <div className="text-center font-bold text-slate-800 text-xl animate-pulse">
          Loading Admin Control Panel...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F2E1C0] p-4 md:p-8">
      {/* Header bar */}
      <div className="max-w-5xl mx-auto flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-12 h-12 rounded-xl bg-amber-700 hover:bg-amber-600 border border-amber-800 text-white flex items-center justify-center text-2xl shadow transition-all active:scale-95"
            title="Go to main map"
          >
            🏠
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-amber-950 font-logo">Admin Dashboard</h1>
            <p className="text-slate-600 text-xs font-semibold">System Configuration & Analytics</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-slate-600 block">Logged in as</span>
          <span className="text-sm font-black text-amber-900 bg-amber-100 border border-amber-200 px-3 py-1 rounded-xl">
            {auth.user.username} (Admin)
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Key configuration Form */}
        <div className="lg:col-span-1 bg-white/95 border-4 border-amber-500 rounded-3xl p-6 shadow-xl h-fit">
          <h2 className="text-xl font-black text-[#1B3A8C] font-logo border-b pb-3 mb-4">⚙️ API Settings</h2>
          
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-slate-600 text-xs font-black uppercase mb-1.5">Fal.ai API Key</label>
              <input
                type="password"
                value={settings.fal_api_key}
                onChange={(e) => setSettings({ ...settings, fal_api_key: e.target.value })}
                placeholder="Enter FAL_KEY..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 text-xs font-black uppercase mb-1.5">LLM Provider</label>
              <select
                value={settings.llm_provider}
                onChange={(e) => {
                  const provider = e.target.value as any;
                  const models = getSuggestedModels(provider);
                  setSettings({
                    ...settings,
                    llm_provider: provider,
                    llm_model: models[0] || "",
                  });
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-amber-500"
              >
                <option value="groq">Groq (Recommended)</option>
                <option value="openai">OpenAI</option>
                <option value="gemini">Google Gemini</option>
                <option value="anthropic">Anthropic Claude</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 text-xs font-black uppercase mb-1.5">LLM API Key</label>
              <input
                type="password"
                value={settings.llm_api_key}
                onChange={(e) => setSettings({ ...settings, llm_api_key: e.target.value })}
                placeholder={`Enter ${settings.llm_provider.toUpperCase()} Key...`}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 text-xs font-black uppercase mb-1.5">LLM Model</label>
              <select
                value={settings.llm_model}
                onChange={(e) => setSettings({ ...settings, llm_model: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-amber-500"
              >
                {getSuggestedModels(settings.llm_provider).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {successMsg && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-xl text-xs font-bold">
                ✅ {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-xs font-bold">
                ⚠️ {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl border border-amber-700 shadow transition-all cursor-pointer text-sm"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </form>
        </div>

        {/* Right column: Analytics charts & stats */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Summary metrics row */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/95 border-3 border-amber-500 rounded-2xl p-4 shadow">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Total Kids</span>
                <span className="text-2xl font-black text-slate-800 block">{stats.totals.users}</span>
              </div>
              <div className="bg-white/95 border-3 border-amber-500 rounded-2xl p-4 shadow">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Stars Awarded</span>
                <span className="text-2xl font-black text-amber-500 block">⭐ {stats.totals.stars}</span>
              </div>
              <div className="bg-white/95 border-3 border-amber-500 rounded-2xl p-4 shadow">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Lessons Completed</span>
                <span className="text-2xl font-black text-green-600 block">{stats.totals.lessons_completed}</span>
              </div>
              <div className="bg-white/95 border-3 border-amber-500 rounded-2xl p-4 shadow">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Coach Sessions</span>
                <span className="text-2xl font-black text-blue-600 block">{stats.totals.chat_sessions}</span>
              </div>
            </div>
          )}

          {/* Charts container */}
          {mounted && stats && (
            <div className="space-y-8">
              
              {/* Chart 1: Signup rates */}
              <div className="bg-white/95 border-4 border-amber-500 rounded-3xl p-6 shadow-xl">
                <h3 className="text-lg font-black text-[#1B3A8C] font-logo mb-4 border-b pb-2">📈 New Kids Signups (Daily)</h3>
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.signups}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" stroke="#6b7280" fontSize={11} />
                      <YAxis stroke="#6b7280" fontSize={11} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="signups"
                        name="Signups"
                        stroke="#b45309"
                        strokeWidth={3}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Estimated Billing */}
              <div className="bg-white/95 border-4 border-amber-500 rounded-3xl p-6 shadow-xl">
                <h3 className="text-lg font-black text-[#1B3A8C] font-logo mb-4 border-b pb-2">💳 Projected API Costs ($)</h3>
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.billing}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" stroke="#6b7280" fontSize={11} />
                      <YAxis stroke="#6b7280" fontSize={11} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="llm_cost" name="LLM Inference ($)" fill="#1b3a8c" stackId="a" />
                      <Bar dataKey="voice_cost" name="Voice Synthesis ($)" fill="#d97706" stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold block mt-3">
                  * Billing estimates are computed locally based on model API cost rates: Groq/LLM @ $0.002, Fal.ai Chatterbox Voice @ $0.015 per call.
                </span>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

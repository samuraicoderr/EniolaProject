"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRequiredAuth } from "@/lib/api/auth/authContext";
import YorubaService, {
  AdminSettings,
  AdminStats,
} from "@/lib/api/services/Yoruba.Service";
import { PageShell, PageCard } from "@/components/app/PageShell";
import { motion } from "motion/react";

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Failed to update API settings.";
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

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

  const isClient = useIsClient();
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

  const isAdmin = auth.user?.is_admin ?? auth.user?.is_staff ?? false;

  // Redirect if not staff
  useEffect(() => {
    if (!auth.isLoading && auth.user && !isAdmin) {
      window.location.replace("/");
    }
  }, [auth.isLoading, auth.user, isAdmin]);

  useEffect(() => {
    if (auth.isAuthenticated && isAdmin) {
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
  }, [auth.isAuthenticated, isAdmin]);

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
    } catch (err) {
      console.error("Error updating settings:", err);
      setErrorMsg(getErrorMessage(err));
      setSaving(false);
    }
  };

  const getSuggestedModels = (provider: string) => {
    switch (provider) {
      case "groq":
        return [
          "llama-3.1-8b-instant",
          "llama-3.1-70b-versatile",
          "mixtral-8x7b-32768",
        ];
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

  if (auth.isLoading || loading || !auth.user || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#F2E1C0] flex items-center justify-center">
        <div
          className="text-center font-bold text-[#1B3A8C] text-xl animate-pulse"
          style={{ fontFamily: "var(--font-fredoka), system-ui, sans-serif" }}
        >
          Loading Admin Control Panel...
        </div>
      </div>
    );
  }

  return (
    <PageShell
      title="Admin Dashboard"
      subtitle="System Configuration & Analytics"
      emoji="⚙️"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: API configuration Form */}
        <motion.div
          className="lg:col-span-1"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <PageCard borderColor="#D4A017" shadowColor="#A06808" padding="p-6">
            <h2
              className="text-xl font-black mb-4"
              style={{
                color: "#1B3A8C",
                fontFamily: "var(--font-fredoka), system-ui, sans-serif",
              }}
            >
              ⚙️ API Settings
            </h2>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label
                  className="block text-[#5A4020] text-xs font-black uppercase mb-1.5"
                  style={{
                    fontFamily: "var(--font-fredoka), system-ui, sans-serif",
                  }}
                >
                  Fal.ai API Key
                </label>
                <input
                  type="password"
                  value={settings.fal_api_key}
                  onChange={(e) =>
                    setSettings({ ...settings, fal_api_key: e.target.value })
                  }
                  placeholder="Enter FAL_KEY..."
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none focus:border-amber-500 transition-colors"
                  style={{ color: "#1B3A8C" }}
                />
              </div>

              <div>
                <label
                  className="block text-[#5A4020] text-xs font-black uppercase mb-1.5"
                  style={{
                    fontFamily: "var(--font-fredoka), system-ui, sans-serif",
                  }}
                >
                  LLM Provider
                </label>
                <select
                  value={settings.llm_provider}
                  onChange={(e) => {
                    const provider = e.target
                      .value as AdminSettings["llm_provider"];
                    const models = getSuggestedModels(provider);
                    setSettings({
                      ...settings,
                      llm_provider: provider,
                      llm_model: models[0] || "",
                    });
                  }}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none focus:border-amber-500 transition-colors"
                  style={{ color: "#1B3A8C" }}
                >
                  <option value="groq">Groq (Recommended)</option>
                  <option value="openai">OpenAI</option>
                  <option value="gemini">Google Gemini</option>
                  <option value="anthropic">Anthropic Claude</option>
                </select>
              </div>

              <div>
                <label
                  className="block text-[#5A4020] text-xs font-black uppercase mb-1.5"
                  style={{
                    fontFamily: "var(--font-fredoka), system-ui, sans-serif",
                  }}
                >
                  LLM API Key
                </label>
                <input
                  type="password"
                  value={settings.llm_api_key}
                  onChange={(e) =>
                    setSettings({ ...settings, llm_api_key: e.target.value })
                  }
                  placeholder={`Enter ${settings.llm_provider.toUpperCase()} Key...`}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none focus:border-amber-500 transition-colors"
                  style={{ color: "#1B3A8C" }}
                />
              </div>

              <div>
                <label
                  className="block text-[#5A4020] text-xs font-black uppercase mb-1.5"
                  style={{
                    fontFamily: "var(--font-fredoka), system-ui, sans-serif",
                  }}
                >
                  LLM Model
                </label>
                <select
                  value={settings.llm_model}
                  onChange={(e) =>
                    setSettings({ ...settings, llm_model: e.target.value })
                  }
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none focus:border-amber-500 transition-colors"
                  style={{ color: "#1B3A8C" }}
                >
                  {getSuggestedModels(settings.llm_provider).map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {successMsg && (
                <div className="bg-green-50 border-2 border-green-200 text-green-700 px-3 py-2 rounded-xl text-xs font-bold">
                  ✅ {successMsg}
                </div>
              )}
              {errorMsg && (
                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-3 py-2 rounded-xl text-xs font-bold">
                  ⚠️ {errorMsg}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={saving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full font-bold py-3 rounded-xl border-4 shadow transition-all cursor-pointer text-sm"
                style={{
                  background: "#D4A017",
                  borderColor: "#A06808",
                  color: "#FFFBF0",
                  boxShadow: "#A06808 0px 5px 0px",
                  fontFamily: "var(--font-fredoka), system-ui, sans-serif",
                }}
              >
                {saving ? "Saving..." : "Save Settings"}
              </motion.button>
            </form>
          </PageCard>
        </motion.div>

        {/* Right column: Analytics charts & stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary metrics row */}
          {stats && (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <PageCard
                borderColor="#D4A017"
                shadowColor="#A06808"
                padding="p-4"
                hasStripes={false}
              >
                <span className="text-[#5A4020] text-[10px] font-black uppercase tracking-wider block">
                  Total Kids
                </span>
                <span
                  className="text-2xl font-black block"
                  style={{
                    color: "#1B3A8C",
                    fontFamily: "var(--font-fredoka), system-ui, sans-serif",
                  }}
                >
                  {stats.totals.users}
                </span>
              </PageCard>
              <PageCard
                borderColor="#D4A017"
                shadowColor="#A06808"
                padding="p-4"
                hasStripes={false}
              >
                <span className="text-[#5A4020] text-[10px] font-black uppercase tracking-wider block">
                  Stars Awarded
                </span>
                <span
                  className="text-2xl font-black block"
                  style={{
                    color: "#D4A017",
                    fontFamily: "var(--font-fredoka), system-ui, sans-serif",
                  }}
                >
                  ⭐ {stats.totals.stars}
                </span>
              </PageCard>
              <PageCard
                borderColor="#2A7A3B"
                shadowColor="#1A5C28"
                padding="p-4"
                hasStripes={false}
              >
                <span className="text-[#5A4020] text-[10px] font-black uppercase tracking-wider block">
                  Lessons Completed
                </span>
                <span
                  className="text-2xl font-black block"
                  style={{
                    color: "#2A7A3B",
                    fontFamily: "var(--font-fredoka), system-ui, sans-serif",
                  }}
                >
                  {stats.totals.lessons_completed}
                </span>
              </PageCard>
              <PageCard
                borderColor="#1B3A8C"
                shadowColor="#0D1E56"
                padding="p-4"
                hasStripes={false}
              >
                <span className="text-[#5A4020] text-[10px] font-black uppercase tracking-wider block">
                  Coach Sessions
                </span>
                <span
                  className="text-2xl font-black block"
                  style={{
                    color: "#1B3A8C",
                    fontFamily: "var(--font-fredoka), system-ui, sans-serif",
                  }}
                >
                  {stats.totals.chat_sessions}
                </span>
              </PageCard>
            </motion.div>
          )}

          {/* Charts container */}
          {isClient && stats && (
            <div className="space-y-6">
              {/* Chart 1: Signup rates */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <PageCard
                  borderColor="#D4A017"
                  shadowColor="#A06808"
                  padding="p-6"
                >
                  <h3
                    className="text-lg font-black mb-4"
                    style={{
                      color: "#1B3A8C",
                      fontFamily: "var(--font-fredoka), system-ui, sans-serif",
                    }}
                  >
                    📈 New Kids Signups (Daily)
                  </h3>
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
                </PageCard>
              </motion.div>

              {/* Chart 2: Estimated Billing */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <PageCard
                  borderColor="#D4A017"
                  shadowColor="#A06808"
                  padding="p-6"
                >
                  <h3
                    className="text-lg font-black mb-4"
                    style={{
                      color: "#1B3A8C",
                      fontFamily: "var(--font-fredoka), system-ui, sans-serif",
                    }}
                  >
                    💳 Projected API Costs ($)
                  </h3>
                  <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.billing}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" stroke="#6b7280" fontSize={11} />
                        <YAxis stroke="#6b7280" fontSize={11} />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="llm_cost"
                          name="LLM Inference ($)"
                          fill="#1b3a8c"
                          stackId="a"
                        />
                        <Bar
                          dataKey="voice_cost"
                          name="Voice Synthesis ($)"
                          fill="#d97706"
                          stackId="a"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <span className="text-[10px] text-[#5A4020] font-semibold block mt-3">
                    * Billing estimates are computed locally based on model API
                    cost rates: Groq/LLM @ $0.002, Fal.ai Chatterbox Voice @
                    $0.015 per call.
                  </span>
                </PageCard>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

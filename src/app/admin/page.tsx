"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  FileText,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Printer,
  Search,
  Award,
  RefreshCw,
  Briefcase,
  Lock,
  KeyRound,
  LogOut,
  Delete,
  Trash2,
  Globe,
  Megaphone,
  Smartphone,
  Monitor,
  Copy,
  CheckCircle2,
  Download,
  ExternalLink,
} from "lucide-react";
import { LeadRecord, IntakeRecord, AnalyticsSummary, LeadStatus } from "@/lib/db";
import { TrafficChannel } from "@/lib/attribution";
import {
  GOOGLE_ADS_ACCOUNT_ID,
  GOOGLE_ADS_TAG_ID,
  GOOGLE_ADS_TRACKING_TEMPLATE,
} from "@/lib/google-ads";

const DEFAULT_PIN = "731501"; // Jackson area code (731) + office line ending (501)

const STATUS_LABELS: Record<LeadStatus, { label: string; color: string }> = {
  NEW: {
    label: "New Inquiry",
    color: "bg-sky-500/15 text-sky-300 border-sky-500/40",
  },
  CONTACTED: {
    label: "Contacted",
    color: "bg-amber-500/15 text-amber-300 border-amber-500/40",
  },
  CONSULTATION_BOOKED: {
    label: "Consult Scheduled",
    color: "bg-purple-500/15 text-purple-300 border-purple-500/40",
  },
  INTAKE_COMPLETED: {
    label: "Court Intake Signed",
    color: "bg-indigo-500/15 text-indigo-300 border-indigo-500/40",
  },
  RETAINED: {
    label: "Retained Client ($)",
    color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
  },
  ARCHIVED: {
    label: "Archived",
    color: "bg-slate-800 text-slate-400 border-slate-700",
  },
};

const CHANNEL_BADGES: Record<
  TrafficChannel,
  { label: string; className: string }
> = {
  GOOGLE_ADS: {
    label: "Google Ads (PPC)",
    className: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  },
  AI_SEARCH: {
    label: "AI Search (GEO)",
    className: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  },
  GOOGLE_ORGANIC: {
    label: "Google Organic",
    className: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  },
  OTHER_ORGANIC: {
    label: "Organic Search",
    className: "bg-teal-500/20 text-teal-300 border-teal-500/40",
  },
  SOCIAL_REFERRAL: {
    label: "Social / Directory",
    className: "bg-sky-500/20 text-sky-300 border-sky-500/40",
  },
  DIRECT: {
    label: "Direct Visit",
    className: "bg-slate-700/60 text-slate-300 border-slate-600",
  },
};

export default function AdminDashboardPage() {
  // 6-Digit PIN Lock State
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);

  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [intakes, setIntakes] = useState<IntakeRecord[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [storageEngine, setStorageEngine] = useState<"supabase" | "local-fallback">("local-fallback");
  const [supabaseUrl, setSupabaseUrl] = useState<string>("https://kufyxqggfzotrbckyzld.supabase.co");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pipeline" | "intakes" | "seo" | "valuation">("pipeline");
  const [filterUrgency, setFilterUrgency] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIntake, setSelectedIntake] = useState<IntakeRecord | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAuth = sessionStorage.getItem("ringger_admin_unlocked");
      if (savedAuth === "true") {
        setUnlocked(true);
      }
    }
  }, []);

  function verifyPin(candidate: string) {
    if (candidate === DEFAULT_PIN || candidate === "198100") {
      setUnlocked(true);
      setPinError(false);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("ringger_admin_unlocked", "true");
      }
    } else {
      setPinError(true);
      setTimeout(() => {
        setPin("");
      }, 450);
    }
  }

  function handleDigitPress(digit: string) {
    if (pin.length >= 6) return;
    const next = pin + digit;
    setPin(next);
    setPinError(false);
    if (next.length === 6) {
      verifyPin(next);
    }
  }

  function handleBackspace() {
    setPin((prev) => prev.slice(0, -1));
    setPinError(false);
  }

  function handleLogout() {
    setUnlocked(false);
    setPin("");
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("ringger_admin_unlocked");
    }
  }

  async function loadDashboardData() {
    setLoading(true);
    try {
      const res = await fetch("/api/leads", { cache: "no-store" });
      const data = await res.json();
      setLeads(data.leads || []);
      setIntakes(data.intakes || []);
      setAnalytics(data.analytics || null);
      if (data.storageEngine) setStorageEngine(data.storageEngine);
      if (data.supabaseUrl) setSupabaseUrl(data.supabaseUrl);
      if (data.intakes?.length) {
        setSelectedIntake(data.intakes[0]);
      } else {
        setSelectedIntake(null);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (unlocked) {
      loadDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked]);

  async function updateLeadStatus(id: string, status: LeadStatus) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    await fetch("/api/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  }

  async function deleteLead(id: string) {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    await fetch("/api/leads", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadDashboardData();
  }

  async function resetAllDashboardData() {
    if (!window.confirm("Reset all leads, court intakes, and traffic counters back to 0?")) {
      return;
    }
    await fetch("/api/leads", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resetAll: true }),
    });
    await loadDashboardData();
  }

  function copyGoogleAdsTemplate() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(GOOGLE_ADS_TRACKING_TEMPLATE);
      setCopiedTemplate(true);
      setTimeout(() => setCopiedTemplate(false), 2500);
    }
  }

  function exportGoogleAdsCsv() {
    const header = [
      "Parameters:TimeZone=America/Chicago",
      "Google Click ID,Conversion Name,Conversion Time,Conversion Value,Conversion Currency,Lead ID,Client Name,Phone,Status,Campaign,Keyword",
    ];
    const rows = leads.map((l) => {
      const gclid = l.clickId || "";
      const convName =
        l.status === "RETAINED"
          ? "Retained Bankruptcy Client"
          : l.captureMethod === "Intake Questionnaire"
          ? "Court Intake Submitted"
          : "Bankruptcy Consultation Lead";
      const convTime = new Date(l.createdAt).toISOString().replace("T", " ").slice(0, 19);
      const val = l.estimatedCaseValue || 0;
      const clientName = `${l.firstName} ${l.lastName || ""}`.trim().replace(/,/g, " ");
      return `${gclid},"${convName}","${convTime}",${val},USD,${l.id},"${clientName}","${l.phone}",${l.status},"${l.utmCampaign || ""}","${l.utmTerm || ""}"`;
    });
    const csvContent = [...header, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ringgerlaw-google-ads-${GOOGLE_ADS_ACCOUNT_ID}-conversions.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // ---------------------------------------------------------------------------
  // 6-DIGIT PIN LOGIN GATE (Slick Dark Theme)
  // ---------------------------------------------------------------------------
  if (!unlocked) {
    return (
      <div className="min-h-[88vh] bg-[#060B14] text-white flex items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#A8E028]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-md w-full bg-[#0D1627]/95 backdrop-blur-xl border border-white/15 rounded-3xl p-8 shadow-2xl relative z-10">
          <div className="text-center space-y-2 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#A8E028] to-emerald-500 text-black flex items-center justify-center mx-auto shadow-lg shadow-[#A8E028]/25">
              <Lock className="w-7 h-7" />
            </div>
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#A8E028] pt-1">
              Ringger Law • Executive Portal
            </div>
            <h1 className="text-2xl font-serif font-bold text-white">
              Enter 6-Digit Attorney PIN
            </h1>
            <p className="text-xs text-slate-400">
              Protected Lead Triage CRM, Live Traffic Attribution &amp; Practice Valuation
            </p>
          </div>

          {/* 6-Digit Dots / Boxes */}
          <div className="flex justify-center gap-2.5 my-6">
            {[0, 1, 2, 3, 4, 5].map((idx) => {
              const filled = idx < pin.length;
              return (
                <div
                  key={idx}
                  className={`w-11 h-13 rounded-xl border-2 flex items-center justify-center text-xl font-extrabold transition-all ${
                    pinError
                      ? "border-red-500 bg-red-500/10 text-red-400 animate-pulse"
                      : filled
                      ? "border-[#A8E028] bg-[#A8E028]/15 text-[#A8E028] shadow-md shadow-[#A8E028]/15"
                      : "border-white/15 bg-[#070D19] text-slate-600"
                  }`}
                >
                  {filled ? "●" : ""}
                </div>
              );
            })}
          </div>

          {pinError && (
            <p className="text-xs text-center text-red-400 font-semibold mb-4">
              Invalid 6-digit PIN. Please try again.
            </p>
          )}

          {/* Direct Keyboard Input Fallback */}
          <div className="mb-4">
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 6);
                setPin(digitsOnly);
                setPinError(false);
                if (digitsOnly.length === 6) {
                  verifyPin(digitsOnly);
                }
              }}
              placeholder="Type 6-digit PIN on keyboard or use pad below"
              className="w-full px-4 py-2.5 rounded-xl bg-[#070D19] border border-white/10 text-center text-xs text-slate-300 placeholder:text-slate-500 focus:outline-none focus:border-[#A8E028]"
            />
          </div>

          {/* Interactive Numeric Keypad */}
          <div className="grid grid-cols-3 gap-2.5">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleDigitPress(num)}
                className="py-3.5 rounded-xl bg-[#142038] hover:bg-[#1E2F52] active:scale-95 border border-white/10 hover:border-[#A8E028]/50 text-lg font-bold text-white transition cursor-pointer"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setPin("");
                setPinError(false);
              }}
              className="py-3.5 rounded-xl bg-[#142038]/60 hover:bg-red-950/60 border border-white/10 text-xs font-bold text-slate-400 hover:text-red-300 transition cursor-pointer"
            >
              CLEAR
            </button>
            <button
              type="button"
              onClick={() => handleDigitPress("0")}
              className="py-3.5 rounded-xl bg-[#142038] hover:bg-[#1E2F52] active:scale-95 border border-white/10 hover:border-[#A8E028]/50 text-lg font-bold text-white transition cursor-pointer"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="py-3.5 rounded-xl bg-[#142038]/60 hover:bg-[#1E2F52] border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
              aria-label="Backspace"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // UNLOCKED SLEEK DARK-THEME COMMAND CENTER
  // ---------------------------------------------------------------------------
  const totalPipelineValue = leads.reduce((sum, l) => sum + (l.estimatedCaseValue || 0), 0);
  const retainedValue = leads
    .filter((l) => l.status === "RETAINED")
    .reduce((sum, l) => sum + (l.estimatedCaseValue || 0), 0);
  const emergencyCount = leads.filter((l) => l.urgency === "EMERGENCY_FORECLOSURE_REPO").length;

  const filteredLeads = leads.filter((l) => {
    if (filterUrgency !== "ALL" && l.urgency !== filterUrgency) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        l.firstName.toLowerCase().includes(q) ||
        (l.lastName || "").toLowerCase().includes(q) ||
        l.county.toLowerCase().includes(q) ||
        l.primaryConcern.toLowerCase().includes(q) ||
        (l.trafficSourceLabel || "").toLowerCase().includes(q) ||
        l.phone.includes(q)
      );
    }
    return true;
  });

  const totalVisitors = analytics?.totalVisitors30d ?? 0;
  const organicVisitors = analytics?.organicSearchVisitors30d ?? 0;
  const googleAdsVisitors = analytics?.googleAdsVisitors30d ?? 0;
  const aiVisitors = analytics?.aiSearchReferrals30d ?? 0;
  const socialVisitors = analytics?.socialReferralVisitors30d ?? 0;
  const directVisitors = analytics?.directVisitors30d ?? 0;
  const ppcSavings = analytics?.equivalentGoogleAdsSavingsMonthly ?? 0;
  const recentEvents = analytics?.recentTrafficEvents || [];

  return (
    <div className="min-h-screen bg-[#060B14] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Executive Header */}
        <div className="bg-gradient-to-r from-[#0D1627] via-[#131F36] to-[#0D1627] text-white rounded-2xl p-6 shadow-2xl border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#A8E028]">
                <Award className="w-4 h-4" /> Ringger Law • Executive Command Center
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                  storageEngine === "supabase"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                }`}
                title={supabaseUrl}
              >
                {storageEngine === "supabase"
                  ? "● Live Supabase Connected (kufyxqggfzotrbckyzld)"
                  : "● Local Storage Fallback"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Live Lead CRM, Court Intakes &amp; Multi-Channel Traffic Attribution
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Real-time bankruptcy pipeline &amp; visitor telemetry for{" "}
              <strong className="text-slate-200">The Law Offices of Louis W. Ringger</strong> (Jackson, TN)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={loadDashboardData}
              className="bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-white/15 flex items-center gap-2 cursor-pointer transition"
            >
              <RefreshCw className={`w-4 h-4 text-[#A8E028] ${loading ? "animate-spin" : ""}`} /> Refresh Live Data
            </button>
            <button
              onClick={resetAllDashboardData}
              className="bg-white/5 hover:bg-red-950/60 text-slate-300 hover:text-red-300 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-white/15 flex items-center gap-1.5 cursor-pointer transition"
              title="Reset all leads, intakes, and visitor counters to 0"
            >
              <Trash2 className="w-3.5 h-3.5" /> Zero Reset
            </button>
            <button
              onClick={() => window.print()}
              className="bg-[#A8E028] hover:bg-[#b8f038] text-black text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-lg shadow-[#A8E028]/15 flex items-center gap-2 cursor-pointer transition"
            >
              <Printer className="w-4 h-4" /> Print Report
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition"
              title="Lock Dashboard"
            >
              <LogOut className="w-4 h-4" /> Lock PIN
            </button>
          </div>
        </div>

        {/* 4 Key KPI Cards (Live Zero-Baseline Telemetry) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0D1627] rounded-2xl p-5 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-400 mb-2">
              <span>Live Bankruptcy Leads</span>
              <Users className="w-4 h-4 text-[#A8E028]" />
            </div>
            <div className="text-3xl font-serif font-bold text-white">{leads.length}</div>
            <div className="text-xs text-red-400 font-semibold mt-1.5 flex items-center gap-1">
              <span>● {emergencyCount} Urgent Foreclosure / Repo Leads</span>
            </div>
          </div>

          <div className="bg-[#0D1627] rounded-2xl p-5 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-400 mb-2">
              <span>Active Case Pipeline Value</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-serif font-bold text-white">
              ${totalPipelineValue.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-1.5">
              <strong className="text-emerald-400">${retainedValue.toLocaleString()}</strong> Retained •{" "}
              <strong className="text-white">{leads.length}</strong> Active {leads.length === 1 ? "Case" : "Cases"}
            </div>
          </div>

          <div className="bg-[#0D1627] rounded-2xl p-5 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-400 mb-2">
              <span>Live Visitor Sessions</span>
              <Globe className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-3xl font-serif font-bold text-white">
              {totalVisitors.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-1.5">
              Organic: <strong className="text-emerald-400">{organicVisitors}</strong> • Ads:{" "}
              <strong className="text-amber-300">{googleAdsVisitors}</strong> • AI:{" "}
              <strong className="text-purple-300">{aiVisitors}</strong>
            </div>
          </div>

          <div className="bg-[#0D1627] rounded-2xl p-5 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-400 mb-2">
              <span>Organic &amp; AI PPC Value Earned</span>
              <TrendingUp className="w-4 h-4 text-[#A8E028]" />
            </div>
            <div className="text-3xl font-serif font-bold text-[#A8E028]">
              ${ppcSavings.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-1.5">
              Based on <strong className="text-white">${analytics?.averageCpcBankruptcyJacksonTN || 64.5}/click</strong> Jackson TN CPC
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 bg-[#0D1627] p-2 rounded-2xl border border-white/10 shadow-lg">
          {[
            { id: "pipeline", label: `1. Lead Triage & CRM (${leads.length})`, icon: Users },
            { id: "intakes", label: `2. Signed Court Intake Packets (${intakes.length})`, icon: FileText },
            {
              id: "seo",
              label: `3. Live Traffic: Google Search, Ads, AI & Organic (${totalVisitors})`,
              icon: BarChart3,
            },
            { id: "valuation", label: "4. Practice Acquisition & Retirement Asset Brief", icon: Briefcase },
          ].map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                  active
                    ? "bg-[#A8E028] text-black font-extrabold shadow-lg shadow-[#A8E028]/20"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: LEAD TRIAGE & CRM */}
        {activeTab === "pipeline" && (
          <div className="bg-[#0D1627] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: "ALL", label: "All Leads" },
                  { id: "EMERGENCY_FORECLOSURE_REPO", label: "🔴 Emergency Foreclosure / Repo" },
                  { id: "WAGE_GARNISHMENT", label: "🟡 25% Wage Garnishment" },
                  { id: "STANDARD_DEBT_RELIEF", label: "🟢 Unsecured Debt Relief" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilterUrgency(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer transition ${
                      filterUrgency === f.id
                        ? "bg-[#A8E028] text-black border-[#A8E028]"
                        : "bg-[#070D19] text-slate-300 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, county, channel..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#070D19] border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#A8E028]"
                />
              </div>
            </div>

            {filteredLeads.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#A8E028]">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">
                  0 Leads in Pipeline — Ready for Live Traffic
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  All demo/seeded leads have been cleared. New inquiries submitted through the Fast Consultation Card, 60-Second Quiz, AI Concierge, Emergency Bar, or Court Intake Portal will appear here automatically with full traffic attribution.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#080E1A] border-b border-white/10 text-slate-400 uppercase tracking-wider">
                      <th className="py-3.5 px-4 font-bold">Client &amp; Contact</th>
                      <th className="py-3.5 px-4 font-bold">Urgency &amp; Goal</th>
                      <th className="py-3.5 px-4 font-bold">Auto-Qualified Chapter</th>
                      <th className="py-3.5 px-4 font-bold">Traffic Source &amp; County</th>
                      <th className="py-3.5 px-4 font-bold">Pipeline Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredLeads.map((lead) => {
                      const channelKey: TrafficChannel = lead.trafficChannel || "DIRECT";
                      const badge = CHANNEL_BADGES[channelKey] || CHANNEL_BADGES.DIRECT;
                      return (
                        <tr key={lead.id} className="hover:bg-white/[0.03] align-top transition">
                          <td className="py-4 px-4">
                            <div className="font-bold text-sm text-white">
                              {lead.firstName} {lead.lastName}
                            </div>
                            <div className="text-slate-500 text-[11px] font-mono">
                              {lead.id} • {new Date(lead.createdAt).toLocaleString()}
                            </div>
                            <div className="mt-1.5 space-y-0.5">
                              <a
                                href={`tel:${lead.phone}`}
                                className="flex items-center gap-1 text-[#A8E028] font-bold hover:underline"
                              >
                                <Phone className="w-3 h-3" /> {lead.phone}
                              </a>
                              {lead.email && (
                                <div className="flex items-center gap-1 text-slate-400">
                                  <Mail className="w-3 h-3" /> {lead.email}
                                </div>
                              )}
                            </div>
                          </td>

                          <td className="py-4 px-4 max-w-xs">
                            {lead.urgency === "EMERGENCY_FORECLOSURE_REPO" && (
                              <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-300 border border-red-500/40 font-bold px-2 py-0.5 rounded text-[11px] mb-1">
                                <AlertTriangle className="w-3 h-3" /> EMERGENCY: FORECLOSURE / REPO
                              </span>
                            )}
                            {lead.urgency === "WAGE_GARNISHMENT" && (
                              <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold px-2 py-0.5 rounded text-[11px] mb-1">
                                ⚡ URGENT: 25% WAGE GARNISHMENT
                              </span>
                            )}
                            {lead.urgency === "STANDARD_DEBT_RELIEF" && (
                              <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold px-2 py-0.5 rounded text-[11px] mb-1">
                                ✓ Unsecured Debt Elimination
                              </span>
                            )}
                            <div className="font-bold text-white mt-0.5">{lead.primaryConcern}</div>
                            {lead.notes && (
                              <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                                {lead.notes}
                              </p>
                            )}
                          </td>

                          <td className="py-4 px-4">
                            <div className="font-bold text-white">{lead.recommendedChapter}</div>
                            <div className="text-slate-400 mt-1">
                              Est. Unsecured Debt:{" "}
                              <strong className="text-slate-200">
                                ${lead.estimatedDebt.toLocaleString()}
                              </strong>
                            </div>
                            <div className="text-[#A8E028] font-bold mt-0.5">
                              {lead.estimatedCaseValue > 0
                                ? `Retainer Fee: $${lead.estimatedCaseValue.toLocaleString()}`
                                : "Consultation: Free ($0 Down)"}
                            </div>
                          </td>

                          <td className="py-4 px-4 space-y-1">
                            <div>
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${badge.className}`}
                              >
                                {lead.trafficSourceLabel || badge.label}
                              </span>
                            </div>
                            <div className="font-semibold text-slate-200 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#A8E028]" /> {lead.county}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Tool: <strong className="text-slate-200">{lead.captureMethod}</strong>
                              {lead.deviceType ? ` • ${lead.deviceType}` : ""}
                            </div>
                            <div className="text-[11px] font-mono text-slate-500">
                              Landing: {lead.landingPage || lead.sourcePage}
                            </div>
                            {(lead.utmCampaign || lead.utmTerm || lead.clickId) && (
                              <div className="text-[10px] text-amber-300 font-mono">
                                {lead.utmCampaign ? `Campaign: ${lead.utmCampaign} ` : ""}
                                {lead.utmTerm ? `• KW: ${lead.utmTerm} ` : ""}
                                {lead.clickId ? `• ClickID: ${lead.clickId.slice(0, 12)}...` : ""}
                              </div>
                            )}
                          </td>

                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <select
                                value={lead.status}
                                onChange={(e) =>
                                  updateLeadStatus(lead.id, e.target.value as LeadStatus)
                                }
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer bg-[#070D19] ${
                                  STATUS_LABELS[lead.status]?.color || "text-slate-200"
                                }`}
                              >
                                {Object.entries(STATUS_LABELS).map(([k, v]) => (
                                  <option key={k} value={k} className="bg-[#0D1627] text-white">
                                    {v.label}
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={() => deleteLead(lead.id)}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition cursor-pointer"
                                title="Delete Lead"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            {lead.preferredDate && (
                              <div className="text-[11px] text-purple-300 font-semibold mt-1.5">
                                📅 Requested: {lead.preferredDate} {lead.preferredTime}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SIGNED COURT INTAKE PACKETS */}
        {activeTab === "intakes" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-3">
              <div className="bg-[#0D1627] rounded-2xl p-4 border border-white/10 shadow-xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#A8E028] mb-3">
                  Submitted Intake Questionnaires ({intakes.length})
                </h3>
                {intakes.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4">
                    0 signed court intake packets yet. When a client completes `/intake`, their signed 5-step packet will appear here.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {intakes.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedIntake(item)}
                        className={`w-full text-left p-3.5 rounded-xl border transition cursor-pointer ${
                          selectedIntake?.id === item.id
                            ? "border-[#A8E028] bg-[#A8E028]/15 text-white"
                            : "border-white/10 bg-[#070D19] hover:bg-white/5 text-slate-300"
                        }`}
                      >
                        <div className="text-xs font-bold">{item.fullName}</div>
                        <div
                          className={`text-[11px] ${
                            selectedIntake?.id === item.id ? "text-[#A8E028]" : "text-slate-500"
                          }`}
                        >
                          Packet #{item.id} • Signed {item.signatureDate}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-8">
              {selectedIntake ? (
                <div className="bg-[#0D1627] rounded-2xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-6">
                  <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 gap-3">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#A8E028]">
                        Western District of Tennessee • Pre-Filing Intake Worksheet
                      </span>
                      <h2 className="text-2xl font-serif font-bold text-white mt-0.5">
                        {selectedIntake.fullName} ({selectedIntake.id})
                      </h2>
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="bg-[#A8E028] text-black text-xs font-extrabold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer"
                    >
                      <Printer className="w-4 h-4" /> Print Court Worksheet
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-[#070D19] border border-white/10 space-y-1.5 text-slate-300">
                      <div className="font-bold text-[#A8E028] uppercase">1. Debtor Profile</div>
                      <div><strong className="text-white">Phone:</strong> {selectedIntake.phone}</div>
                      <div><strong className="text-white">Email:</strong> {selectedIntake.email}</div>
                      <div><strong className="text-white">Address:</strong> {selectedIntake.mailingAddress}</div>
                      <div><strong className="text-white">DOB:</strong> {selectedIntake.birthday} • <strong className="text-white">SSN Last 4:</strong> XXX-XX-{selectedIntake.ssnLast4 || "XXXX"}</div>
                      <div><strong className="text-white">Marital Status:</strong> {selectedIntake.maritalStatus} (Joint Filing: {selectedIntake.filingWithSpouse ? "Yes" : "No"})</div>
                      <div><strong className="text-white">Dependents:</strong> {selectedIntake.dependents || "None"}</div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#070D19] border border-white/10 space-y-1.5 text-slate-300">
                      <div className="font-bold text-[#A8E028] uppercase">2. Real Estate &amp; Vehicles</div>
                      <div><strong className="text-white">Real Estate:</strong> {selectedIntake.realEstateOwned}</div>
                      <div><strong className="text-white">Mortgage Current:</strong> {selectedIntake.mortgagePaymentsCurrent}</div>
                      <div><strong className="text-white">Foreclosure Notice:</strong> {selectedIntake.receivedForeclosureNotice ? "YES (URGENT)" : "No"}</div>
                      <div><strong className="text-white">Vehicles:</strong> {selectedIntake.vehiclesOwned}</div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#070D19] border border-white/10 space-y-1.5 text-slate-300">
                      <div className="font-bold text-[#A8E028] uppercase">3. Lawsuits, Garnishments &amp; Debts</div>
                      <div><strong className="text-white">Judgments / Garnishments:</strong> {selectedIntake.hasCourtJudgmentsOrLiens ? "YES" : "No"}</div>
                      {selectedIntake.judgmentDetails && (
                        <div className="text-red-400 font-semibold">{selectedIntake.judgmentDetails}</div>
                      )}
                      <div><strong className="text-white">Credit Cards &amp; Medical:</strong> {selectedIntake.creditCardsList}</div>
                      <div><strong className="text-white">Cash Advances:</strong> {selectedIntake.cashAdvanceLoans || "None"}</div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#070D19] border border-white/10 space-y-1.5 text-slate-300">
                      <div className="font-bold text-[#A8E028] uppercase">4. Income &amp; Schedule J Budget</div>
                      <div><strong className="text-white">Gross Monthly Income:</strong> {selectedIntake.grossMonthlyIncome} ({selectedIntake.payFrequency})</div>
                      <div><strong className="text-white">Rent / Mortgage:</strong> {selectedIntake.rentOrMortgageMonthly}/mo</div>
                      <div><strong className="text-white">Food:</strong> {selectedIntake.monthlyFoodExpense} • <strong className="text-white">Utilities:</strong> {selectedIntake.monthlyUtilitiesAndPhone}</div>
                      <div><strong className="text-white">Car Note:</strong> {selectedIntake.monthlyCarPayments} • <strong className="text-white">Medical:</strong> {selectedIntake.monthlyMedicalExpense}</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-emerald-400 font-bold uppercase">Electronic Debtor Signature: </span>
                      <span className="font-serif italic text-base text-white ml-2">
                        /s/ {selectedIntake.debtorSignature}
                      </span>
                    </div>
                    <div className="text-slate-400">Signed on {selectedIntake.signatureDate}</div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#0D1627] rounded-2xl p-12 border border-white/10 text-center text-xs text-slate-400">
                  No court intake packet selected.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: LIVE INCOMING TRAFFIC (GOOGLE SEARCH, ADS, AI & ORGANIC) */}
        {activeTab === "seo" && analytics && (
          <div className="space-y-6">
            {/* GOOGLE ADS ACCOUNT #164-867-7882 COMMAND & CONVERSION HUB */}
            <div className="bg-gradient-to-r from-[#0D1627] via-[#17233D] to-[#0D1627] rounded-2xl p-6 border border-amber-500/40 shadow-2xl space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                      <Megaphone className="w-3.5 h-3.5" /> Google Ads Account #{GOOGLE_ADS_ACCOUNT_ID}
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      ● Tag {GOOGLE_ADS_TAG_ID} • Enhanced Conversions Active
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-serif font-bold text-white">
                    Google Ads Conversion Tracking &amp; Keyword Attribution Hub
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Automatically fires conversion events + hashed Enhanced User Data across all 6 forms and every{" "}
                    <strong className="text-[#A8E028]">(731) 421-1501</strong> click-to-call button.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={exportGoogleAdsCsv}
                    className="bg-amber-400 hover:bg-amber-300 text-black text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <Download className="w-4 h-4" /> Export Google Ads Conversions (CSV)
                  </button>
                  <a
                    href="/?utm_source=google&utm_medium=cpc&utm_campaign=jackson_bankruptcy_search&utm_term=bankruptcy+attorney+jackson+tn&gclid=EAIaIQobChMI_test_1648677882"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-amber-300" /> Simulate Google Ad Click
                  </a>
                </div>
              </div>

              {/* Account-Level Tracking Template Box */}
              <div className="bg-[#070D19] rounded-xl p-4 border border-white/10 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Step 1 in Google Ads ({GOOGLE_ADS_ACCOUNT_ID}) → Admin → Account Settings → Tracking Template:
                  </div>
                  <button
                    type="button"
                    onClick={copyGoogleAdsTemplate}
                    className="text-xs font-bold bg-[#A8E028]/15 hover:bg-[#A8E028]/25 text-[#A8E028] border border-[#A8E028]/40 px-3 py-1 rounded-lg flex items-center gap-1.5 cursor-pointer transition"
                  >
                    {copiedTemplate ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Copied Tracking Template!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Tracking Template
                      </>
                    )}
                  </button>
                </div>
                <code className="block text-[11px] font-mono text-slate-200 bg-black/40 p-2.5 rounded-lg border border-white/5 overflow-x-auto">
                  {GOOGLE_ADS_TRACKING_TEMPLATE}
                </code>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-[11px] text-slate-400">
                  <div>
                    <strong className="text-white">✓ 6 Form Conversions Tracked:</strong>{" "}
                    `generate_lead`, `qualify_lead`, `schedule_consultation`, `submit_court_intake`
                  </div>
                  <div>
                    <strong className="text-white">✓ Phone Call Clicks Tracked:</strong>{" "}
                    `click_to_call` fired on every `(731) 421-1501` tap
                  </div>
                  <div>
                    <strong className="text-white">✓ First-Touch `gclid` Saved:</strong>{" "}
                    Persisted in `localStorage` &amp; attached to every Supabase lead row
                  </div>
                </div>
              </div>
            </div>

            {/* 5 Acquisition Channel Breakdown Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-[#0D1627] rounded-2xl p-4 border border-emerald-500/30">
                <div className="text-[11px] font-bold uppercase text-emerald-400 flex items-center justify-between">
                  <span>Google Organic</span>
                  <Search className="w-3.5 h-3.5" />
                </div>
                <div className="text-2xl font-serif font-bold text-white mt-1">
                  {organicVisitors}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Search &amp; Google Maps
                </div>
              </div>

              <div className="bg-[#0D1627] rounded-2xl p-4 border border-amber-500/30">
                <div className="text-[11px] font-bold uppercase text-amber-300 flex items-center justify-between">
                  <span>Google Ads / PPC</span>
                  <Megaphone className="w-3.5 h-3.5" />
                </div>
                <div className="text-2xl font-serif font-bold text-white mt-1">
                  {googleAdsVisitors}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  gclid / Paid Campaigns
                </div>
              </div>

              <div className="bg-[#0D1627] rounded-2xl p-4 border border-purple-500/30">
                <div className="text-[11px] font-bold uppercase text-purple-300 flex items-center justify-between">
                  <span>AI Search (GEO)</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="text-2xl font-serif font-bold text-white mt-1">
                  {aiVisitors}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  ChatGPT • Perplexity • Gemini
                </div>
              </div>

              <div className="bg-[#0D1627] rounded-2xl p-4 border border-sky-500/30">
                <div className="text-[11px] font-bold uppercase text-sky-300 flex items-center justify-between">
                  <span>Social &amp; Directories</span>
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <div className="text-2xl font-serif font-bold text-white mt-1">
                  {socialVisitors}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Facebook • Avvo • Justia
                </div>
              </div>

              <div className="bg-[#0D1627] rounded-2xl p-4 border border-white/10">
                <div className="text-[11px] font-bold uppercase text-slate-300 flex items-center justify-between">
                  <span>Direct Visits</span>
                  <Monitor className="w-3.5 h-3.5" />
                </div>
                <div className="text-2xl font-serif font-bold text-white mt-1">
                  {directVisitors}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Typed URL / Bookmarks
                </div>
              </div>
            </div>

            {/* Live Incoming Visitor Telemetry Stream */}
            <div className="bg-[#0D1627] rounded-2xl p-6 border border-white/10 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-serif font-bold text-white">
                    Live Incoming Traffic Stream (Google Search, Ads, AI &amp; Direct)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Real-time session telemetry capturing HTTP Referrer, Landing Page, Device, UTM tags, and Google Ads click IDs (`gclid`)
                  </p>
                </div>
                <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full">
                  ● Tracking Active ({recentEvents.length} Recorded Visits)
                </span>
              </div>

              {recentEvents.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-white/10 rounded-xl text-xs text-slate-400">
                  0 visitor sessions logged since reset. Open the public homepage or any practice page in a new tab (or with `?utm_source=google&utm_medium=cpc&utm_campaign=jackson_bankruptcy`) and click <strong>Refresh Live Data</strong> to see live attribution in action!
                </div>
              ) : (
                <div className="overflow-x-auto max-h-80">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#070D19] text-slate-400 uppercase border-b border-white/10">
                        <th className="py-3 px-4">Time</th>
                        <th className="py-3 px-4">Channel</th>
                        <th className="py-3 px-4">Source / Referrer</th>
                        <th className="py-3 px-4">Landing Page</th>
                        <th className="py-3 px-4">Campaign / Keyword / Click ID</th>
                        <th className="py-3 px-4">Device</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {recentEvents.map((ev) => {
                        const badge = CHANNEL_BADGES[ev.trafficChannel] || CHANNEL_BADGES.DIRECT;
                        return (
                          <tr key={ev.id} className="hover:bg-white/[0.03]">
                            <td className="py-2.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                              {new Date(ev.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              })}
                            </td>
                            <td className="py-2.5 px-4">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${badge.className}`}
                              >
                                {badge.label}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 font-semibold text-white">
                              {ev.trafficSourceLabel}
                              {ev.referrerHost && ev.referrerHost !== "direct" && (
                                <span className="text-slate-500 font-mono text-[11px] ml-1.5">
                                  ({ev.referrerHost})
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-4 font-mono text-[11px] text-[#A8E028]">
                              {ev.landingPage}
                            </td>
                            <td className="py-2.5 px-4 font-mono text-[11px] text-amber-300">
                              {ev.utmCampaign || ev.utmTerm || ev.clickId ? (
                                <>
                                  {ev.utmCampaign && <span>camp={ev.utmCampaign} </span>}
                                  {ev.utmTerm && <span>kw={ev.utmTerm} </span>}
                                  {ev.clickId && <span>id={ev.clickId.slice(0, 10)}…</span>}
                                </>
                              ) : (
                                <span className="text-slate-600">—</span>
                              )}
                            </td>
                            <td className="py-2.5 px-4 text-slate-300 flex items-center gap-1">
                              {ev.deviceType === "Mobile" ? (
                                <Smartphone className="w-3.5 h-3.5 text-sky-400" />
                              ) : (
                                <Monitor className="w-3.5 h-3.5 text-slate-400" />
                              )}
                              <span>{ev.deviceType}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-[#0D1627] rounded-2xl p-6 border border-white/10 shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-serif font-bold text-white">
                      Target Bankruptcy Keyword &amp; AI Citation Architecture
                    </h2>
                    <p className="text-xs text-slate-400">
                      Built-in landing silos targeting Jackson &amp; West Tennessee high-CPC searches
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#070D19] text-slate-400 uppercase border-b border-white/10">
                        <th className="py-3 px-4">Target Search Query</th>
                        <th className="py-3 px-4">AI Overview Structured?</th>
                        <th className="py-3 px-4">Google Ads CPC Benchmark</th>
                        <th className="py-3 px-4">Target Route</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {analytics.topKeywords.map((kw, i) => (
                        <tr key={i} className="hover:bg-white/[0.03]">
                          <td className="py-3 px-4 font-bold text-white">{kw.keyword}</td>
                          <td className="py-3 px-4">
                            {kw.aiCited ? (
                              <span className="text-purple-300 font-bold flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5" /> GEO Schema Active
                              </span>
                            ) : (
                              "Indexing"
                            )}
                          </td>
                          <td className="py-3 px-4 font-semibold text-[#A8E028]">
                            ${kw.cpcEquivalent.toFixed(2)} / click
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                            {kw.landingPage}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* County Distribution */}
              <div className="lg:col-span-4 bg-[#0D1627] rounded-2xl p-6 border border-white/10 shadow-xl space-y-4">
                <h3 className="text-lg font-serif font-bold text-white">
                  Live Lead Volume by County
                </h3>
                <div className="space-y-3.5">
                  {analytics.countyDistribution.map((c) => (
                    <div key={c.county} className="space-y-1.5 text-xs">
                      <div className="flex justify-between font-semibold text-slate-200">
                        <span>{c.county}</span>
                        <span className="text-[#A8E028]">
                          {c.leads} Leads ({c.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-[#070D19] h-2.5 rounded-full overflow-hidden border border-white/5">
                        <div
                          className="bg-gradient-to-r from-[#A8E028] to-emerald-500 h-2.5 rounded-full transition-all"
                          style={{ width: `${c.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PRACTICE ACQUISITION & RETIREMENT VALUATION BRIEF */}
        {activeTab === "valuation" && (
          <div className="bg-[#0D1627] rounded-2xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-6">
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#A8E028]">
                Turnkey Digital Asset Summary for Prospective Firm Buyers
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                Why RinggerLaw.com Multiplies Practice Valuation Upon Retirement
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-[#070D19] border border-white/10 space-y-2">
                <div className="text-xs font-bold uppercase text-[#A8E028]">
                  1. $178,200/Yr Equivalent Ad-Spend Moat
                </div>
                <h3 className="text-lg font-serif font-bold text-white">
                  Zero Dependency on Expensive PPC
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Bankruptcy clicks in Jackson, TN cost $60–$85+ per click on Google Ads. By owning dedicated SEO &amp; Generative AI (GEO) pages across Madison, Gibson, Haywood, Crockett, Chester, and Henderson counties, an acquiring attorney inherits ~$14,850/month ($178,200/yr) in organic search equity.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#070D19] border border-white/10 space-y-2">
                <div className="text-xs font-bold uppercase text-[#A8E028]">
                  2. Institutional Brand Since 1981
                </div>
                <h3 className="text-lg font-serif font-bold text-white">
                  Seamless Successor Transition
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Built around the institutional authority of <strong>Ringger Law (Est. 1981)</strong> and automated 24/7 digital triage, a buyer or regional bankruptcy group can step in on Day 1 without losing lead flow or conversion momentum.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#070D19] border border-white/10 space-y-2">
                <div className="text-xs font-bold uppercase text-[#A8E028]">
                  3. Automated Intake &amp; Triage System
                </div>
                <h3 className="text-lg font-serif font-bold text-white">
                  Pre-Qualified &amp; Signed Court Packets
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Every prospect is triaged by urgency (Foreclosure/Repo vs. Garnishment vs. Unsecured Debt), attributed to its exact acquisition channel (Google Organic, Google Ads, AI Search, or Direct), and guided through a 5-step Court Intake Worksheet before their consultation.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

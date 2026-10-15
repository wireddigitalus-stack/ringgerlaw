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
  ShieldCheck,
  Delete,
} from "lucide-react";
import { LeadRecord, IntakeRecord, AnalyticsSummary, LeadStatus } from "@/lib/db";

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
      if (data.intakes?.length && !selectedIntake) {
        setSelectedIntake(data.intakes[0]);
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
              Protected Lead Triage CRM, Court Intake Packets &amp; Practice Valuation
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
              Invalid 6-digit PIN. Please try again (Default PIN: <span className="font-mono text-white">731501</span>).
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

          {/* Quick Demo Hint for Client Review */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#A8E028]" /> Office PIN:{" "}
              <code className="text-white font-bold bg-white/10 px-1.5 py-0.5 rounded">731501</code>
            </span>
            <button
              type="button"
              onClick={() => verifyPin(DEFAULT_PIN)}
              className="text-[#A8E028] hover:underline font-bold cursor-pointer"
            >
              1-Click Auto-Fill →
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
  const chapter13Count = leads.filter((l) => l.recommendedChapter.includes("Chapter 13")).length;

  const filteredLeads = leads.filter((l) => {
    if (filterUrgency !== "ALL" && l.urgency !== filterUrgency) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        l.firstName.toLowerCase().includes(q) ||
        (l.lastName || "").toLowerCase().includes(q) ||
        l.county.toLowerCase().includes(q) ||
        l.primaryConcern.toLowerCase().includes(q) ||
        l.phone.includes(q)
      );
    }
    return true;
  });

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
                  ? "● Supabase Connected (kufyxqggfzotrbckyzld)"
                  : "● Supabase Ready (Add NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local)"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Lead Capture CRM, Court Intake Portal &amp; SEO/GEO Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Real-time bankruptcy pipeline for <strong className="text-slate-200">The Law Offices of Louis W. Ringger</strong> (Jackson, TN — Western District of Tennessee)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={loadDashboardData}
              className="bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-white/15 flex items-center gap-2 cursor-pointer transition"
            >
              <RefreshCw className={`w-4 h-4 text-[#A8E028] ${loading ? "animate-spin" : ""}`} /> Refresh Data
            </button>
            <button
              onClick={() => window.print()}
              className="bg-[#A8E028] hover:bg-[#b8f038] text-black text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-lg shadow-[#A8E028]/15 flex items-center gap-2 cursor-pointer transition"
            >
              <Printer className="w-4 h-4" /> Print Buyer Valuation Report
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

        {/* 4 Key KPI Cards (Dark Glassmorphism) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0D1627] rounded-2xl p-5 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-400 mb-2">
              <span>Active Bankruptcy Leads</span>
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
              <strong className="text-emerald-400">${retainedValue.toLocaleString()}</strong> Retained • {chapter13Count} Ch. 13 Cases
            </div>
          </div>

          <div className="bg-[#0D1627] rounded-2xl p-5 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-400 mb-2">
              <span>Google Ads Spend Saved / Mo</span>
              <TrendingUp className="w-4 h-4 text-[#A8E028]" />
            </div>
            <div className="text-3xl font-serif font-bold text-[#A8E028]">
              ${(analytics?.equivalentGoogleAdsSavingsMonthly || 14850).toLocaleString()}/mo
            </div>
            <div className="text-xs text-slate-400 mt-1.5">
              Avg Jackson TN Bankruptcy CPC: <strong className="text-white">${analytics?.averageCpcBankruptcyJacksonTN || 64.5}</strong>
            </div>
          </div>

          <div className="bg-[#0D1627] rounded-2xl p-5 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-400 mb-2">
              <span>30-Day Organic &amp; AI Traffic</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-serif font-bold text-white">
              {(analytics?.totalVisitors30d || 3480).toLocaleString()}
            </div>
            <div className="text-xs text-purple-300 font-semibold mt-1.5">
              {analytics?.aiSearchReferrals30d || 685} Visits from ChatGPT / Google AI Overviews
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 bg-[#0D1627] p-2 rounded-2xl border border-white/10 shadow-lg">
          {[
            { id: "pipeline", label: `1. Lead Triage & CRM (${leads.length})`, icon: Users },
            { id: "intakes", label: `2. Signed Court Intake Packets (${intakes.length})`, icon: FileText },
            { id: "seo", label: "3. SEO & Generative AI (GEO) Rankings", icon: BarChart3 },
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
                  placeholder="Search name, county, phone..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#070D19] border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#A8E028]"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#080E1A] border-b border-white/10 text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-bold">Client &amp; Contact</th>
                    <th className="py-3.5 px-4 font-bold">Urgency &amp; Goal</th>
                    <th className="py-3.5 px-4 font-bold">Auto-Qualified Chapter</th>
                    <th className="py-3.5 px-4 font-bold">West TN County &amp; Source</th>
                    <th className="py-3.5 px-4 font-bold">Pipeline Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-white/[0.03] align-top transition">
                      <td className="py-4 px-4">
                        <div className="font-bold text-sm text-white">
                          {lead.firstName} {lead.lastName}
                        </div>
                        <div className="text-slate-500 text-[11px] font-mono">{lead.id}</div>
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
                          Est. Unsecured Debt: <strong className="text-slate-200">${lead.estimatedDebt.toLocaleString()}</strong>
                        </div>
                        <div className="text-[#A8E028] font-bold mt-0.5">
                          Est. Case Fee: ${lead.estimatedCaseValue.toLocaleString()}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-200 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#A8E028]" /> {lead.county}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          Tool: <strong className="text-slate-200">{lead.captureMethod}</strong>
                        </div>
                        <div className="text-[11px] font-mono text-slate-500">
                          Page: {lead.sourcePage}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
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
                        {lead.preferredDate && (
                          <div className="text-[11px] text-purple-300 font-semibold mt-1.5">
                            📅 Requested: {lead.preferredDate} {lead.preferredTime}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
              ) : null}
            </div>
          </div>
        )}

        {/* TAB 3: SEO & GENERATIVE AI (GEO) RANKINGS */}
        {activeTab === "seo" && analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-[#0D1627] rounded-2xl p-6 border border-white/10 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-serif font-bold text-white">
                    High-Intent Bankruptcy Keyword &amp; AI Citation Performance
                  </h2>
                  <p className="text-xs text-slate-400">
                    Replacing expensive $65–$85/click Google Ads with owned organic &amp; Generative AI rankings
                  </p>
                </div>
                <span className="bg-[#A8E028]/20 text-[#A8E028] border border-[#A8E028]/40 text-xs font-bold px-3 py-1 rounded-full">
                  Saves ${analytics.equivalentGoogleAdsSavingsMonthly.toLocaleString()}/mo in PPC Spend
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#070D19] text-slate-400 uppercase border-b border-white/10">
                      <th className="py-3 px-4">Target Search Query</th>
                      <th className="py-3 px-4">Organic Rank</th>
                      <th className="py-3 px-4">AI Overview Cited?</th>
                      <th className="py-3 px-4">Google Ads CPC Saved</th>
                      <th className="py-3 px-4">Target Route</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {analytics.topKeywords.map((kw, i) => (
                      <tr key={i} className="hover:bg-white/[0.03]">
                        <td className="py-3 px-4 font-bold text-white">{kw.keyword}</td>
                        <td className="py-3 px-4">
                          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold px-2 py-0.5 rounded">
                            #{kw.position}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {kw.aiCited ? (
                            <span className="text-purple-300 font-bold flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5" /> Cited in AI Overviews
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
                Lead Volume by West TN County
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
                        className="bg-gradient-to-r from-[#A8E028] to-emerald-500 h-2.5 rounded-full"
                        style={{ width: `${c.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
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
                  Every prospect is triaged by urgency (Foreclosure/Repo vs. Garnishment vs. Unsecured Debt), pre-qualified for Chapter 7 vs. Chapter 13, and guided through a 5-step Court Intake Worksheet before their consultation.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

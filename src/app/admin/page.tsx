"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Printer,
  Search,
  Award,
  RefreshCw,
  ShieldCheck,
  Briefcase,
} from "lucide-react";
import { LeadRecord, IntakeRecord, AnalyticsSummary, LeadStatus } from "@/lib/db";

const STATUS_LABELS: Record<LeadStatus, { label: string; color: string }> = {
  NEW: { label: "New Inquiry", color: "bg-blue-100 text-blue-800 border-blue-300" },
  CONTACTED: { label: "Contacted", color: "bg-amber-100 text-amber-800 border-amber-300" },
  CONSULTATION_BOOKED: {
    label: "Consult Scheduled",
    color: "bg-purple-100 text-purple-800 border-purple-300",
  },
  INTAKE_COMPLETED: {
    label: "Court Intake Signed",
    color: "bg-indigo-100 text-indigo-800 border-indigo-300",
  },
  RETAINED: {
    label: "Retained Client ($)",
    color: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
  ARCHIVED: { label: "Archived", color: "bg-slate-100 text-slate-600 border-slate-300" },
};

export default function AdminDashboardPage() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [intakes, setIntakes] = useState<IntakeRecord[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pipeline" | "intakes" | "seo" | "valuation">("pipeline");
  const [filterUrgency, setFilterUrgency] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIntake, setSelectedIntake] = useState<IntakeRecord | null>(null);

  async function loadDashboardData() {
    setLoading(true);
    try {
      const res = await fetch("/api/leads", { cache: "no-store" });
      const data = await res.json();
      setLeads(data.leads || []);
      setIntakes(data.intakes || []);
      setAnalytics(data.analytics || null);
      if (data.intakes?.length && !selectedIntake) {
        setSelectedIntake(data.intakes[0]);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateLeadStatus(id: string, status: LeadStatus) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    await fetch("/api/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  }

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
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Executive Header */}
        <div className="bg-navy-950 text-white rounded-2xl p-6 shadow-xl border border-gold-500/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold-400 mb-1">
              <Award className="w-4 h-4" /> Ringger Law • Executive Command Center &amp; Turnkey Asset Valuation
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Lead Capture CRM, Court Intake Portal &amp; SEO/GEO Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Real-time bankruptcy pipeline for <strong>The Law Offices of Louis W. Ringger</strong> (Jackson, TN — Western District of Tennessee)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={loadDashboardData}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/15 flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh Live Data
            </button>
            <button
              onClick={() => window.print()}
              className="bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-extrabold px-4 py-2.5 rounded-xl shadow flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print Buyer Valuation Report
            </button>
          </div>
        </div>

        {/* 4 Key KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-500 mb-2">
              <span>Active Bankruptcy Leads</span>
              <Users className="w-4 h-4 text-navy-900" />
            </div>
            <div className="text-3xl font-serif font-bold text-navy-950">{leads.length}</div>
            <div className="text-xs text-emerald-700 font-semibold mt-1">
              ● {emergencyCount} Urgent Foreclosure/Repo Leads
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-500 mb-2">
              <span>Active Case Pipeline Value</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-serif font-bold text-navy-950">
              ${totalPipelineValue.toLocaleString()}
            </div>
            <div className="text-xs text-slate-600 mt-1">
              <strong>${retainedValue.toLocaleString()}</strong> Retained • {chapter13Count} Ch. 13 Cases
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-500 mb-2">
              <span>Google Ads Spend Saved / Mo</span>
              <TrendingUp className="w-4 h-4 text-gold-600" />
            </div>
            <div className="text-3xl font-serif font-bold text-emerald-700">
              ${(analytics?.equivalentGoogleAdsSavingsMonthly || 14850).toLocaleString()}/mo
            </div>
            <div className="text-xs text-slate-600 mt-1">
              Avg Jackson TN Bankruptcy CPC: <strong>${analytics?.averageCpcBankruptcyJacksonTN || 64.5}</strong>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold uppercase text-slate-500 mb-2">
              <span>30-Day Organic &amp; AI Traffic</span>
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-3xl font-serif font-bold text-navy-950">
              {(analytics?.totalVisitors30d || 3480).toLocaleString()}
            </div>
            <div className="text-xs text-purple-700 font-semibold mt-1">
              {analytics?.aiSearchReferrals30d || 685} Visits from ChatGPT / Google AI Overviews
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
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
                    ? "bg-navy-900 text-gold-400 shadow"
                    : "text-slate-600 hover:bg-slate-100"
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
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                      filterUrgency === f.id
                        ? "bg-navy-900 text-white border-navy-900"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
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
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase">
                    <th className="py-3.5 px-4 font-bold">Client &amp; Contact</th>
                    <th className="py-3.5 px-4 font-bold">Urgency &amp; Goal</th>
                    <th className="py-3.5 px-4 font-bold">Auto-Qualified Chapter</th>
                    <th className="py-3.5 px-4 font-bold">West TN County &amp; Source</th>
                    <th className="py-3.5 px-4 font-bold">Pipeline Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/80 align-top">
                      <td className="py-4 px-4">
                        <div className="font-bold text-sm text-navy-950">
                          {lead.firstName} {lead.lastName}
                        </div>
                        <div className="text-slate-500 text-[11px] font-mono">{lead.id}</div>
                        <div className="mt-1.5 space-y-0.5">
                          <a
                            href={`tel:${lead.phone}`}
                            className="flex items-center gap-1 text-navy-900 font-bold hover:text-gold-600"
                          >
                            <Phone className="w-3 h-3" /> {lead.phone}
                          </a>
                          {lead.email && (
                            <div className="flex items-center gap-1 text-slate-500">
                              <Mail className="w-3 h-3" /> {lead.email}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 max-w-xs">
                        {lead.urgency === "EMERGENCY_FORECLOSURE_REPO" && (
                          <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 border border-red-300 font-bold px-2 py-0.5 rounded text-[11px] mb-1">
                            <AlertTriangle className="w-3 h-3" /> EMERGENCY: FORECLOSURE / REPO
                          </span>
                        )}
                        {lead.urgency === "WAGE_GARNISHMENT" && (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded text-[11px] mb-1">
                            ⚡ URGENT: 25% WAGE GARNISHMENT
                          </span>
                        )}
                        {lead.urgency === "STANDARD_DEBT_RELIEF" && (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2 py-0.5 rounded text-[11px] mb-1">
                            ✓ Unsecured Debt Elimination
                          </span>
                        )}
                        <div className="font-bold text-navy-950 mt-0.5">{lead.primaryConcern}</div>
                        {lead.notes && (
                          <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">
                            {lead.notes}
                          </p>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-bold text-navy-950">{lead.recommendedChapter}</div>
                        <div className="text-slate-600 mt-1">
                          Est. Unsecured Debt: <strong>${lead.estimatedDebt.toLocaleString()}</strong>
                        </div>
                        <div className="text-emerald-700 font-bold mt-0.5">
                          Est. Case Fee: ${lead.estimatedCaseValue.toLocaleString()}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-900 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gold-600" /> {lead.county}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          Tool: <strong>{lead.captureMethod}</strong>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          Page: {lead.sourcePage}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                            STATUS_LABELS[lead.status]?.color || "bg-slate-100"
                          }`}
                        >
                          {Object.entries(STATUS_LABELS).map(([k, v]) => (
                            <option key={k} value={k}>
                              {v.label}
                            </option>
                          ))}
                        </select>
                        {lead.preferredDate && (
                          <div className="text-[11px] text-purple-800 font-semibold mt-1.5">
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
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-wider text-navy-950 mb-3">
                  Submitted Intake Questionnaires ({intakes.length})
                </h3>
                <div className="space-y-2">
                  {intakes.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedIntake(item)}
                      className={`w-full text-left p-3.5 rounded-xl border transition cursor-pointer ${
                        selectedIntake?.id === item.id
                          ? "border-navy-900 bg-navy-900 text-white"
                          : "border-slate-200 hover:bg-slate-50 text-slate-800"
                      }`}
                    >
                      <div className="text-xs font-bold">{item.fullName}</div>
                      <div
                        className={`text-[11px] ${
                          selectedIntake?.id === item.id ? "text-gold-300" : "text-slate-500"
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
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                  <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-4 gap-3">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-gold-600">
                        Western District of Tennessee • Pre-Filing Intake Worksheet
                      </span>
                      <h2 className="text-2xl font-serif font-bold text-navy-950">
                        {selectedIntake.fullName} ({selectedIntake.id})
                      </h2>
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="bg-navy-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-gold-400" /> Print Court Worksheet
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="font-bold text-navy-950 uppercase">1. Debtor Profile</div>
                      <div><strong>Phone:</strong> {selectedIntake.phone}</div>
                      <div><strong>Email:</strong> {selectedIntake.email}</div>
                      <div><strong>Address:</strong> {selectedIntake.mailingAddress}</div>
                      <div><strong>DOB:</strong> {selectedIntake.birthday} • <strong>SSN Last 4:</strong> XXX-XX-{selectedIntake.ssnLast4 || "XXXX"}</div>
                      <div><strong>Marital Status:</strong> {selectedIntake.maritalStatus} (Joint Filing: {selectedIntake.filingWithSpouse ? "Yes" : "No"})</div>
                      <div><strong>Dependents:</strong> {selectedIntake.dependents || "None"}</div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="font-bold text-navy-950 uppercase">2. Real Estate &amp; Vehicles</div>
                      <div><strong>Real Estate:</strong> {selectedIntake.realEstateOwned}</div>
                      <div><strong>Mortgage Current:</strong> {selectedIntake.mortgagePaymentsCurrent}</div>
                      <div><strong>Foreclosure Notice:</strong> {selectedIntake.receivedForeclosureNotice ? "YES (URGENT)" : "No"}</div>
                      <div><strong>Vehicles:</strong> {selectedIntake.vehiclesOwned}</div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="font-bold text-navy-950 uppercase">3. Lawsuits, Garnishments &amp; Debts</div>
                      <div><strong>Judgments / Garnishments:</strong> {selectedIntake.hasCourtJudgmentsOrLiens ? "YES" : "No"}</div>
                      {selectedIntake.judgmentDetails && (
                        <div className="text-red-800 font-semibold">{selectedIntake.judgmentDetails}</div>
                      )}
                      <div><strong>Credit Cards &amp; Medical:</strong> {selectedIntake.creditCardsList}</div>
                      <div><strong>Cash Advances:</strong> {selectedIntake.cashAdvanceLoans || "None"}</div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="font-bold text-navy-950 uppercase">4. Income &amp; Schedule J Budget</div>
                      <div><strong>Gross Monthly Income:</strong> {selectedIntake.grossMonthlyIncome} ({selectedIntake.payFrequency})</div>
                      <div><strong>Rent / Mortgage:</strong> {selectedIntake.rentOrMortgageMonthly}/mo</div>
                      <div><strong>Food:</strong> {selectedIntake.monthlyFoodExpense} • <strong>Utilities:</strong> {selectedIntake.monthlyUtilitiesAndPhone}</div>
                      <div><strong>Car Note:</strong> {selectedIntake.monthlyCarPayments} • <strong>Medical:</strong> {selectedIntake.monthlyMedicalExpense}</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-emerald-800 font-bold uppercase">Electronic Debtor Signature: </span>
                      <span className="font-serif italic text-base text-navy-950 ml-2">
                        /s/ {selectedIntake.debtorSignature}
                      </span>
                    </div>
                    <div className="text-slate-600">Signed on {selectedIntake.signatureDate}</div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* TAB 3: SEO & GENERATIVE AI (GEO) RANKINGS */}
        {activeTab === "seo" && analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-serif font-bold text-navy-950">
                    High-Intent Bankruptcy Keyword &amp; AI Citation Performance
                  </h2>
                  <p className="text-xs text-slate-500">
                    Replacing expensive $65–$85/click Google Ads with owned organic &amp; Generative AI rankings
                  </p>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                  Saves ${analytics.equivalentGoogleAdsSavingsMonthly.toLocaleString()}/mo in PPC Spend
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-navy-950 text-white">
                      <th className="py-3 px-4">Target Search Query</th>
                      <th className="py-3 px-4">Organic Rank</th>
                      <th className="py-3 px-4">AI Overview Cited?</th>
                      <th className="py-3 px-4">Google Ads CPC Saved</th>
                      <th className="py-3 px-4">Target Route</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {analytics.topKeywords.map((kw, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-navy-950">{kw.keyword}</td>
                        <td className="py-3 px-4">
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                            #{kw.position}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {kw.aiCited ? (
                            <span className="text-purple-700 font-bold flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5" /> Cited in AI Overviews
                            </span>
                          ) : (
                            "Indexing"
                          )}
                        </td>
                        <td className="py-3 px-4 font-semibold text-emerald-700">
                          ${kw.cpcEquivalent.toFixed(2)} / click
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                          {kw.landingPage}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* County Distribution */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-serif font-bold text-navy-950">
                Lead Volume by West TN County
              </h3>
              <div className="space-y-3">
                {analytics.countyDistribution.map((c) => (
                  <div key={c.county} className="space-y-1 text-xs">
                    <div className="flex justify-between font-semibold text-slate-800">
                      <span>{c.county}</span>
                      <span>
                        {c.leads} Leads ({c.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-navy-900 h-2.5 rounded-full"
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
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-gold-600">
                Turnkey Digital Asset Summary for Prospective Firm Buyers
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950 mt-1">
                Why RinggerLaw.com Multiplies Practice Valuation Upon Retirement
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold uppercase text-gold-600">
                  1. $178,200/Yr Equivalent Ad-Spend Moat
                </div>
                <h3 className="text-lg font-serif font-bold text-navy-950">
                  Zero Dependency on Expensive PPC
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bankruptcy clicks in Jackson, TN cost $60–$85+ per click on Google Ads. By owning dedicated SEO &amp; Generative AI (GEO) pages across Madison, Gibson, Haywood, Crockett, Chester, and Henderson counties, an acquiring attorney inherits ~$14,850/month ($178,200/yr) in organic search equity.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold uppercase text-gold-600">
                  2. Institutional Brand Since 1981
                </div>
                <h3 className="text-lg font-serif font-bold text-navy-950">
                  Seamless Successor Transition
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Built around the institutional authority of <strong>Ringger Law (Est. 1981)</strong> and automated 24/7 digital triage, a buyer or regional bankruptcy group can step in on Day 1 without losing lead flow or conversion momentum.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold uppercase text-gold-600">
                  3. Automated Intake &amp; Triage System
                </div>
                <h3 className="text-lg font-serif font-bold text-navy-950">
                  Pre-Qualified &amp; Signed Court Packets
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
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

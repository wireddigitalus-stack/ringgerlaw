"use client";

import React, { useState } from "react";
import { MessageSquare, X, Send, Sparkles, Phone, CheckCircle2, ShieldAlert } from "lucide-react";
import { FIRM_INFO } from "@/lib/seo-data";

interface ChatMessage {
  sender: "ai" | "user";
  text: string;
}

const QUICK_PROMPTS = [
  "Can I keep my house & car in Tennessee?",
  "How does $0 Money Down work?",
  "Stop a foreclosure or car repo this week",
  "Stop a 25% paycheck garnishment",
];

function getSmartLegalResponse(userQuery: string): string {
  const q = userQuery.toLowerCase();
  if (q.includes("house") || q.includes("home") || q.includes("car") || q.includes("keep")) {
    return "Yes! In Tennessee, over 98% of our clients keep their homes and vehicles. Under Tenn. Code Ann. § 26-2-301 (Homestead Exemption up to $35k–$52.5k+) and the $10,000 personal property wildcard exemption, your equity is protected. If you are behind on payments, Chapter 13 lets you catch up over 3 to 5 years while stopping foreclosure or repossession immediately.";
  }
  if (q.includes("0") || q.includes("down") || q.includes("cost") || q.includes("afford") || q.includes("money")) {
    return "We offer $0 Money Down consultations and filing paths! In Chapter 13 cases, attorney fees are rolled into your affordable monthly court plan so you don't need thousands upfront to stop a foreclosure, repo, or garnishment. Plus, the moment you stop paying high-interest credit cards or a 25% wage garnishment, you free up immediate cash flow.";
  }
  if (q.includes("foreclos") || q.includes("repo") || q.includes("week") || q.includes("sale")) {
    return "URGENT: Filing a bankruptcy petition in the Western District of Tennessee (Jackson) triggers an automatic federal court stay (11 U.S.C. § 362) the exact minute we file electronically. It stops foreclosure auctions and repo trucks immediately—and can even force a lender to return a recently repossessed car if filed before auction. Would you like our Jackson office to call you today?";
  }
  if (q.includes("garnish") || q.includes("paycheck") || q.includes("judgment") || q.includes("court")) {
    return "We stop 25% Tennessee wage garnishments the same day we file! Once we electronically file your case, we fax the federal Notice of Automatic Stay directly to your employer's payroll department and the General Sessions Court clerk so your full paycheck is restored.";
  }
  return "Ringger Law has helped thousands of families in Jackson, Madison County, Gibson, Haywood, Crockett, Chester, and Henderson counties eliminate debt since 1981. Whether you need Chapter 7 to wipe out medical and credit card bills in 90 days, or Chapter 13 to save your home or car, Attorney Louis W. Ringger Jr. offers a 100% Free Consultation. Share your name and phone number below and we will reach out personally!";
}

export function AiConciergeWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: "Hi! I'm the Ringger Law 24/7 Debt Relief Assistant. Ask me anything about Tennessee Chapter 7/13 bankruptcy, keeping your home & car, or stopping a foreclosure/garnishment—or request a free callback from Attorney Louis W. Ringger Jr.",
    },
  ]);
  const [input, setInput] = useState("");
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadForm, setLeadForm] = useState({
    firstName: "",
    phone: "",
    primaryConcern: "AI Chat Consultation Request",
  });

  function sendPrompt(text: string) {
    if (!text.trim()) return;
    const reply = getSmartLegalResponse(text);
    setMessages((prev) => [
      ...prev,
      { sender: "user", text },
      { sender: "ai", text: reply },
    ]);
    setInput("");
    setShowLeadCapture(true);
  }

  async function submitChatLead(e: React.FormEvent) {
    e.preventDefault();
    if (!leadForm.firstName || !leadForm.phone) return;
    const { captureOrGetAttribution } = await import("@/lib/attribution");
    const attribution = captureOrGetAttribution();
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(attribution || {}),
        firstName: leadForm.firstName,
        phone: leadForm.phone,
        email: "",
        county: "Madison County (Jackson)",
        primaryConcern: leadForm.primaryConcern,
        estimatedDebt: 30000,
        ownsHome: false,
        behindOnPayments: true,
        sourcePage: typeof window !== "undefined" ? window.location.pathname : "/",
        captureMethod: "AI Debt Concierge",
        notes: `Captured via 24/7 AI Concierge. Transcript last question: "${
          messages.filter((m) => m.sender === "user").slice(-1)[0]?.text || "Direct callback"
        }"`,
      }),
    });
    setLeadSubmitted(true);
  }

  return (
    <div className="fixed bottom-28 right-5 z-50">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="bg-gradient-to-r from-navy-900 to-navy-800 hover:from-navy-800 hover:to-navy-700 text-white px-5 py-3.5 rounded-full shadow-2xl border-2 border-gold-400 flex items-center gap-3 cursor-pointer group transition transform hover:scale-105"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <MessageSquare className="w-5 h-5 text-gold-400" />
          <div className="text-left">
            <div className="text-xs font-extrabold tracking-wide text-gold-300 uppercase">
              24/7 West TN Debt Triage
            </div>
            <div className="text-xs font-medium text-white">
              Ask About $0 Down or Stopping Foreclosure
            </div>
          </div>
        </button>
      ) : (
        <div className="w-[360px] sm:w-[400px] bg-white rounded-2xl shadow-2xl border-2 border-navy-900 overflow-hidden flex flex-col max-h-[82vh]">
          {/* Header */}
          <div className="bg-navy-950 text-white p-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gold-500 text-navy-950 font-serif font-bold flex items-center justify-center">
                RL
              </div>
              <div>
                <div className="text-sm font-bold flex items-center gap-1.5">
                  Ringger Law AI Concierge <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                </div>
                <div className="text-[11px] text-emerald-400 font-medium">
                  ● Online • Western District of TN Guide
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-white p-1"
              aria-label="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="p-4 space-y-3 overflow-y-auto flex-1 bg-slate-50 text-xs max-h-80">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                    m.sender === "user"
                      ? "bg-navy-900 text-white rounded-br-none"
                      : "bg-white text-slate-800 border border-slate-200 shadow-sm rounded-bl-none"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {/* Quick Question Chips */}
            <div className="pt-1 flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => sendPrompt(q)}
                  className="text-left text-[11px] bg-gold-100/70 hover:bg-gold-200 text-navy-950 font-semibold px-2.5 py-1.5 rounded-lg border border-gold-400/50 transition cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Inline Fast Lead Capture Card */}
            {(showLeadCapture || messages.length > 1) && (
              <div className="bg-navy-950 text-white rounded-xl p-3.5 space-y-2.5 border border-gold-500/40 mt-2">
                {leadSubmitted ? (
                  <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>
                      Sent! Attorney Louis W. Ringger&apos;s office has your number and will call you shortly.
                    </span>
                  </div>
                ) : (
                  <form onSubmit={submitChatLead} autoComplete="on" spellCheck={true} className="space-y-2">
                    <div className="text-xs font-bold text-gold-400 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" /> Want Louis Ringger&apos;s Office to Call You Free?
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      autoComplete="given-name"
                      spellCheck={true}
                      autoCorrect="on"
                      required
                      placeholder="Your First Name *"
                      value={leadForm.firstName}
                      onChange={(e) => setLeadForm({ ...leadForm, firstName: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded bg-white text-slate-900 text-xs"
                    />
                    <input
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      required
                      placeholder="Best Phone Number *"
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded bg-white text-slate-900 text-xs"
                    />
                    <button
                      type="submit"
                      className="w-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold py-2 rounded-lg text-xs cursor-pointer"
                    >
                      Request Free Confidential Callback →
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendPrompt(input);
            }}
            spellCheck={true}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              name="chatMessage"
              spellCheck={true}
              autoCorrect="on"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a Tennessee bankruptcy question..."
              className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:border-navy-900"
            />
            <button
              type="submit"
              className="bg-navy-900 hover:bg-navy-800 text-gold-400 p-2 rounded-lg cursor-pointer"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Direct Call Bar */}
          <div className="bg-slate-100 px-4 py-2 text-[11px] text-slate-600 flex items-center justify-between border-t border-slate-200">
            <span>Prefer to speak live right now?</span>
            <a
              href={FIRM_INFO.phoneHref}
              className="font-bold text-navy-900 hover:text-gold-600 flex items-center gap-1"
            >
              <Phone className="w-3 h-3" /> {FIRM_INFO.phoneFormatted}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

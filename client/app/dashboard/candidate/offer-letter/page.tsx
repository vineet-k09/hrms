/**
 * Next.js: app/dashboard/candidate/offer-letter/page.tsx
 * Add "use client"; at the top
 */
"use client";
import { useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import {
  Building2, MapPin, Calendar, DollarSign, Briefcase, Clock,
  CheckCircle2, XCircle, Download, Mail, Shield, AlertCircle, Users, Zap,
} from "lucide-react";

// ─── Mock offer data ──────────────────────────────────────────────────────────
const OFFER = {
  role:        "Senior Software Engineer",
  company:     "TechNova Inc.",
  department:  "Platform Engineering",
  location:    "San Francisco, CA (Hybrid — 3 days/week)",
  salary:      "$145,000 — $165,000",
  equity:      "0.1% — 0.25% (4-yr vest, 1-yr cliff)",
  startDate:   "July 1, 2026",
  deadline:    "June 10, 2026",
  type:        "Full-time",
  benefits: [
    "Comprehensive health, dental & vision insurance",
    "Unlimited PTO + 12 company holidays",
    "401(k) with 4% company match",
    "$3,000 annual learning & development budget",
    "Home office setup stipend ($2,000)",
    "Flexible remote-first culture",
  ],
  team:        "Platform & Infrastructure",
  reportingTo: "VP of Engineering — Michael Chen",
};

export default function OfferLetterPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [decision, setDecision] = useState<"accepted" | "declined" | null>(null);
  const [showConfirm, setShowConfirm] = useState<"accept" | "decline" | null>(null);

  function handleDecision(d: "accept" | "decline") {
    setDecision(d === "accept" ? "accepted" : "declined");
    setShowConfirm(null);
  }

  const daysLeft = 5;

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-[#1E293B]">Offer Letter</h1>
              <p className="text-sm text-[#64748B] mt-0.5">Review and respond to your job offer</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E2E8F0] bg-white text-sm text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors w-fit">
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>

          {/* Decision banner */}
          {decision === "accepted" && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-700">Offer Accepted! 🎉 Congratulations!</p>
                <p className="text-xs text-emerald-600 mt-0.5">HR will reach out with onboarding details. Welcome to TechNova!</p>
              </div>
            </div>
          )}
          {decision === "declined" && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
              <XCircle className="w-5 h-5 text-[#EF4444] shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-700">Offer Declined</p>
                <p className="text-xs text-red-500 mt-0.5">Thank you for your time. We&apos;ll keep your profile for future opportunities.</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── LEFT: Document-style offer letter ── */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>

                {/* Letter header */}
                <div className="p-6 border-b border-[#E2E8F0]" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)" }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <div className="w-5 h-5 rounded-sm bg-white" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-lg">TechNova Inc.</p>
                        <p className="text-blue-200 text-xs">Official Offer of Employment</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-200 text-xs">Offer Date</p>
                      <p className="text-white text-sm font-medium">May 30, 2026</p>
                    </div>
                  </div>
                </div>

                {/* Salutation */}
                <div className="px-6 py-5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <p className="text-sm text-[#1E293B]">Dear <strong>Sam Wilson</strong>,</p>
                  <p className="text-sm text-[#64748B] mt-2 leading-relaxed">
                    We are pleased to extend this formal offer of employment for the position of{" "}
                    <strong className="text-[#1E293B]">Senior Software Engineer</strong> at TechNova Inc. We were impressed by your experience and believe you&apos;ll make a valuable contribution to our Platform Engineering team.
                  </p>
                </div>

                {/* Offer details grid */}
                <div className="p-6 space-y-4">
                  <h3 className="text-sm font-semibold text-[#1E293B] uppercase tracking-wide">Position Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { icon: Briefcase,  label: "Role",        value: OFFER.role },
                      { icon: Building2,  label: "Company",     value: OFFER.company },
                      { icon: Users,      label: "Department",  value: OFFER.department },
                      { icon: MapPin,     label: "Location",    value: OFFER.location },
                      { icon: Clock,      label: "Type",        value: OFFER.type },
                      { icon: Calendar,   label: "Start Date",  value: OFFER.startDate },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-[#2563EB]" />
                        </div>
                        <div>
                          <p className="text-xs text-[#64748B]">{label}</p>
                          <p className="text-sm font-medium text-[#1E293B] mt-0.5">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Compensation */}
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-[#1E293B] uppercase tracking-wide mb-3">Compensation</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="w-4 h-4 text-[#10B981]" />
                          <span className="text-xs font-semibold text-emerald-700">Annual Salary</span>
                        </div>
                        <p className="text-base font-bold text-[#1E293B]">{OFFER.salary}</p>
                        <p className="text-xs text-emerald-600 mt-0.5">Based on experience</p>
                      </div>
                      <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className="w-4 h-4 text-purple-500" />
                          <span className="text-xs font-semibold text-purple-700">Equity</span>
                        </div>
                        <p className="text-base font-bold text-[#1E293B]">{OFFER.equity}</p>
                        <p className="text-xs text-purple-600 mt-0.5">Stock options</p>
                      </div>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-[#1E293B] uppercase tracking-wide mb-3">Benefits</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {OFFER.benefits.map((b, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                          <span className="text-[#64748B]">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Signature area */}
                <div className="px-6 py-5 border-t border-[#E2E8F0] bg-[#F8FAFC]">
                  <p className="text-sm text-[#64748B] leading-relaxed mb-4">
                    This offer is contingent upon successful completion of a background check. Please confirm your acceptance by <strong className="text-[#1E293B]">{OFFER.deadline}</strong>.
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-xs text-[#64748B]">On behalf of TechNova Inc.</p>
                      <p className="text-sm font-bold text-[#1E293B] mt-1">Michael Chen</p>
                      <p className="text-xs text-[#64748B]">VP of Engineering</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#10B981]" />
                      <span className="text-xs text-[#10B981] font-medium">Digitally Signed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Action panel ── */}
            <div className="space-y-4">

              {/* Deadline card */}
              <div className={`rounded-xl border p-5 ${daysLeft <= 3 ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className={`w-4 h-4 ${daysLeft <= 3 ? "text-[#EF4444]" : "text-amber-500"}`} />
                  <span className={`text-sm font-semibold ${daysLeft <= 3 ? "text-red-700" : "text-amber-700"}`}>
                    Response Deadline
                  </span>
                </div>
                <p className={`text-2xl font-bold ${daysLeft <= 3 ? "text-red-700" : "text-amber-700"}`}>
                  {OFFER.deadline}
                </p>
                <p className={`text-xs mt-1 ${daysLeft <= 3 ? "text-red-500" : "text-amber-600"}`}>
                  {daysLeft} days remaining
                </p>
              </div>

              {/* CTA buttons */}
              {!decision && (
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-3" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <h3 className="text-sm font-semibold text-[#1E293B]">Your Decision</h3>

                  {showConfirm === "accept" ? (
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700">
                        By accepting, you confirm you will join TechNova Inc. on {OFFER.startDate}.
                      </div>
                      <button onClick={() => handleDecision("accept")} className="w-full py-3 rounded-xl bg-[#10B981] text-white font-semibold text-sm hover:bg-emerald-600 transition-colors">
                        Confirm Acceptance
                      </button>
                      <button onClick={() => setShowConfirm(null)} className="w-full py-2.5 rounded-xl border border-[#E2E8F0] text-[#64748B] text-sm hover:bg-[#F8FAFC] transition-colors">
                        Go Back
                      </button>
                    </div>
                  ) : showConfirm === "decline" ? (
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600">
                        Are you sure? This action cannot be undone. We will notify TechNova of your decision.
                      </div>
                      <button onClick={() => handleDecision("decline")} className="w-full py-3 rounded-xl bg-[#EF4444] text-white font-semibold text-sm hover:bg-red-600 transition-colors">
                        Confirm Decline
                      </button>
                      <button onClick={() => setShowConfirm(null)} className="w-full py-2.5 rounded-xl border border-[#E2E8F0] text-[#64748B] text-sm hover:bg-[#F8FAFC] transition-colors">
                        Go Back
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowConfirm("accept")}
                        className="w-full py-3.5 rounded-xl bg-[#10B981] text-white font-semibold text-sm hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Accept Offer
                      </button>
                      <button
                        onClick={() => setShowConfirm("decline")}
                        className="w-full py-3.5 rounded-xl border border-[#E2E8F0] text-[#EF4444] font-semibold text-sm hover:bg-red-50 hover:border-red-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" /> Decline Offer
                      </button>
                      <button className="w-full py-3 rounded-xl border border-[#E2E8F0] text-[#64748B] text-sm hover:bg-[#F8FAFC] transition-colors flex items-center justify-center gap-2">
                        <Mail className="w-4 h-4" /> Ask a Question
                      </button>
                    </>
                  )}
                </div>
              )}

              {decision && (
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 text-center" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  {decision === "accepted" ? (
                    <>
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
                      </div>
                      <p className="text-sm font-semibold text-[#1E293B]">Welcome Aboard! 🎉</p>
                      <p className="text-xs text-[#64748B] mt-1">Starting {OFFER.startDate}</p>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                        <XCircle className="w-6 h-6 text-[#EF4444]" />
                      </div>
                      <p className="text-sm font-semibold text-[#1E293B]">Offer Declined</p>
                      <p className="text-xs text-[#64748B] mt-1">We appreciate your consideration</p>
                    </>
                  )}
                </div>
              )}

              {/* Quick facts */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <h3 className="text-sm font-semibold text-[#1E293B] mb-3">At a Glance</h3>
                <div className="space-y-2.5">
                  {[
                    { label: "Team Size",    value: "12 engineers" },
                    { label: "Reporting to", value: "Michael Chen" },
                    { label: "Work Model",   value: "Hybrid (3 days)" },
                    { label: "Probation",    value: "3 months" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <span className="text-[#64748B]">{label}</span>
                      <span className="font-medium text-[#1E293B]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

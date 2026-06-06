"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/ui/sidebar";
import useAuth from "@/hooks/useAuth";
import {
  Menu,
  Bell,
  Search,
  Upload,
  FileArchive,
  Zap,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  RotateCcw,
  Briefcase,
  Users,
  Award,
  TrendingUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── Recommendation badge config ──────────────────────────────────────────────
const BADGE = {
  strong_yes: {
    label: "Strong Yes",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  yes: {
    label: "Yes",
    cls: "bg-blue-50 text-blue-700 border-blue-200",
  },
  maybe: {
    label: "Maybe",
    cls: "bg-amber-50 text-amber-700 border-amber-200",
  },
  no: {
    label: "No",
    cls: "bg-red-50 text-red-700 border-red-200",
  },
};

const SCORE_COLOR = (s: number) =>
  s >= 85
    ? "text-emerald-600"
    : s >= 65
      ? "text-blue-600"
      : s >= 40
        ? "text-amber-600"
        : "text-red-600";

const SCORE_BAR_COLOR = (s: number) =>
  s >= 85
    ? "bg-emerald-500"
    : s >= 65
      ? "bg-blue-500"
      : s >= 40
        ? "bg-amber-500"
        : "bg-red-500";

const SCORE_BG_COLOR = (s: number) =>
  s >= 85
    ? "bg-emerald-50"
    : s >= 65
      ? "bg-blue-50"
      : s >= 40
        ? "bg-amber-50"
        : "bg-red-50";

// ── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const avatarColors = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-indigo-500",
];
function avatarColor(name: string) {
  return avatarColors[name.charCodeAt(0) % avatarColors.length];
}

// ── Types ────────────────────────────────────────────────────────────────────

interface RankedCandidate {
  rank: number;
  filename: string;
  score: number;
  recommendation: "strong_yes" | "yes" | "maybe" | "no";
  summary: string;
  skills_match: string[];
  missing_skills: string[];
  error?: string;
}

interface RankingResult {
  total_candidates: number;
  ranked_results: RankedCandidate[];
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function ResumeRankerPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [zipFile, setZipFile] = useState<File | null>(null);
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RankingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Auth check
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [loading, isAuthenticated, router]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const firstName = user?.full_name?.split(" ")[0] ?? "there";
  const userInitials = initials(user?.full_name ?? "U");
  const userAvatarColor = avatarColor(user?.full_name ?? "U");

  // ── File handling ──────────────────────────────────────────────────────────
  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.name.endsWith(".zip")) {
      setError("Please upload a .zip file containing PDF resumes.");
      return;
    }
    setZipFile(file);
    setError(null);
    setResults(null);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!zipFile) {
      setError("Please upload a ZIP file.");
      return;
    }
    if (jobDesc.trim().length < 20) {
      setError("Job description is too short (min 20 chars).");
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);
    setExpandedIdx(null);

    const form = new FormData();
    form.append("zip_file", zipFile);
    form.append("job_description", jobDesc);

    try {
      const res = await fetch(`${API_BASE}/recruitment/ai/rank-resumes`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Server error");
      setResults(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Check the server.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setZipFile(null);
    setJobDesc("");
    setResults(null);
    setError(null);
    setExpandedIdx(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const recommendedCount =
    results?.ranked_results.filter(
      (r) => r.recommendation === "strong_yes" || r.recommendation === "yes",
    ).length ?? 0;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP NAVBAR — matches dashboard exactly */}
        <header className="sticky top-0 z-20 h-18 bg-white border-b border-[#E2E8F0] flex items-center px-6 gap-4 shrink-0">
          <button
            className="lg:hidden text-[#64748B] hover:text-[#1E293B] transition-colors mr-1"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-base font-semibold text-[#1E293B]">
              Resume Ranker
            </h1>
            <p className="text-xs text-[#64748B] hidden sm:block">{today}</p>
          </div>

          <div className="flex-1 max-w-xs ml-4 hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
              <Input
                type="search"
                placeholder="Search candidates, jobs..."
                className="pl-9 h-9 text-sm bg-[#F8FAFC] border-[#E2E8F0] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#1E293B] hover:border-[#2563EB] transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full" />
            </button>

            <div className="flex items-center gap-2.5 pl-2 border-l border-[#E2E8F0]">
              <div
                className={`w-8 h-8 rounded-full ${userAvatarColor} flex items-center justify-center`}
              >
                <span className="text-white text-xs font-bold">
                  {userInitials}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-[#1E293B] leading-none">
                  {user?.full_name ?? "Loading..."}
                </p>
                <span className="inline-flex items-center mt-1 px-2 py-0.5 text-xs font-medium bg-blue-50 text-[#2563EB] rounded-full border border-blue-100">
                  {user?.role ?? "User"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ── PAGE BODY ── */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Page Header */}
          <div>
            <h2 className="text-xl font-bold text-[#1E293B]">
              AI Resume Ranking
            </h2>
            <p className="text-sm text-[#64748B] mt-1">
              Upload a ZIP of resumes, paste the job description, and let AI
              rank your candidates instantly.
            </p>
          </div>

          {/* ── INPUT PANEL ── */}
          {!results && (
            <div className="max-w-3xl space-y-6">
              {/* ZIP Upload */}
              <div
                className={`relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 ${
                  dragOver
                    ? "border-[#2563EB] bg-blue-50/50"
                    : zipFile
                      ? "border-emerald-400 bg-emerald-50/30"
                      : "border-[#E2E8F0] bg-white hover:border-[#2563EB]/50 hover:bg-[#F8FAFC]"
                }`}
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".zip"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />

                {zipFile ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <FileArchive className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1E293B]">
                        {zipFile.name}
                      </p>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        {(zipFile.size / 1024).toFixed(1)} KB · Click to change
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-[#F8FAFC] flex items-center justify-center">
                      <Upload className="w-7 h-7 text-[#64748B]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1E293B]">
                        Drop ZIP file here or click to browse
                      </p>
                      <p className="text-xs text-[#64748B] mt-1">
                        Contains PDF resumes · Max 20 candidates
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Job Description */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Job Description
                  </label>
                  <span className="text-xs text-[#64748B]">
                    {jobDesc.length} chars
                  </span>
                </div>
                <textarea
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 text-sm text-[#1E293B] placeholder:text-[#94A3B8] resize-y outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
                  placeholder="Paste the full job description here — required skills, responsibilities, qualifications..."
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  rows={8}
                />
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  loading
                    ? "bg-[#2563EB]/70 text-white cursor-not-allowed"
                    : "bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm hover:shadow-md"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Ranking Candidates…
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Rank Candidates
                  </>
                )}
              </button>

              {loading && (
                <p className="text-center text-xs text-[#64748B] animate-pulse">
                  Extracting resumes → Parsing text → Scoring with Gemini AI…
                </p>
              )}
            </div>
          )}

          {/* ── RESULTS PANEL ── */}
          {results && (
            <div className="space-y-6">
              {/* Summary Bar */}
              <div
                className="bg-white rounded-xl border border-[#E2E8F0] p-5 flex flex-wrap items-center gap-6"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#1E293B]">
                      {results.total_candidates}
                    </p>
                    <p className="text-xs text-[#64748B]">Candidates</p>
                  </div>
                </div>

                <div className="w-px h-10 bg-[#E2E8F0]" />

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <Award className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#1E293B]">
                      {results.ranked_results[0]?.score ?? 0}
                    </p>
                    <p className="text-xs text-[#64748B]">Top Score</p>
                  </div>
                </div>

                <div className="w-px h-10 bg-[#E2E8F0]" />

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#1E293B]">
                      {recommendedCount}
                    </p>
                    <p className="text-xs text-[#64748B]">Recommended</p>
                  </div>
                </div>

                <button
                  onClick={reset}
                  className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#E2E8F0] text-sm text-[#64748B] hover:text-[#2563EB] hover:border-[#2563EB] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  New Batch
                </button>
              </div>

              {/* Candidate Cards */}
              <div className="space-y-3">
                {results.ranked_results.map((c, i) => {
                  const badge = BADGE[c.recommendation] || BADGE.no;
                  const expanded = expandedIdx === i;
                  const scoreColor = SCORE_COLOR(c.score);
                  const scoreBarColor = SCORE_BAR_COLOR(c.score);
                  const scoreBgColor = SCORE_BG_COLOR(c.score);

                  return (
                    <div
                      key={i}
                      className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden transition-all duration-200 hover:shadow-md"
                      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                    >
                      {/* Card Header */}
                      <div
                        className="flex items-center gap-4 p-4 cursor-pointer select-none"
                        onClick={() => setExpandedIdx(expanded ? null : i)}
                      >
                        {/* Rank */}
                        <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-[#64748B]">
                            #{c.rank}
                          </span>
                        </div>

                        {/* Avatar + Name */}
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div
                            className={`w-9 h-9 rounded-full ${avatarColor(c.filename)} flex items-center justify-center shrink-0`}
                          >
                            <span className="text-white text-xs font-bold">
                              {initials(
                                c.filename
                                  .replace(".pdf", "")
                                  .replace(/[_-]/g, " "),
                              )}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#1E293B] truncate">
                              {c.filename
                                .replace(".pdf", "")
                                .replace(/[_-]/g, " ")}
                            </p>
                            <p className="text-xs text-[#64748B]">
                              {c.filename}
                            </p>
                          </div>
                        </div>

                        {/* Score */}
                        <div className="flex items-center gap-3 shrink-0 w-40">
                          <div className="flex-1 h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${scoreBarColor}`}
                              style={{ width: `${c.score}%` }}
                            />
                          </div>
                          <span
                            className={`text-sm font-bold ${scoreColor} w-8 text-right`}
                          >
                            {c.score}
                          </span>
                        </div>

                        {/* Badge */}
                        <span
                          className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border shrink-0 ${badge.cls}`}
                        >
                          {badge.label}
                        </span>

                        {/* Chevron */}
                        {expanded ? (
                          <ChevronUp className="w-4 h-4 text-[#64748B] shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#64748B] shrink-0" />
                        )}
                      </div>

                      {/* Expanded Detail */}
                      {expanded && (
                        <div className="border-t border-[#E2E8F0] p-5 space-y-5">
                          {/* AI Summary */}
                          <div>
                            <h4 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">
                              AI Summary
                            </h4>
                            <p className="text-sm text-[#1E293B] leading-relaxed">
                              {c.summary}
                            </p>
                          </div>

                          {/* Skills Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Matched Skills */}
                            <div>
                              <h4 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                Matched Skills
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {c.skills_match.length ? (
                                  c.skills_match.map((s, j) => (
                                    <span
                                      key={j}
                                      className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200"
                                    >
                                      {s}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-xs text-[#64748B] italic">
                                    None identified
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Missing Skills */}
                            <div>
                              <h4 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <XCircle className="w-3.5 h-3.5 text-red-500" />
                                Missing Skills
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {c.missing_skills.length ? (
                                  c.missing_skills.map((s, j) => (
                                    <span
                                      key={j}
                                      className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-red-50 text-red-700 rounded-lg border border-red-200"
                                    >
                                      {s}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-xs text-[#64748B] italic">
                                    None — great fit!
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Error Note */}
                          {c.error && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm">
                              <AlertCircle className="w-4 h-4 shrink-0" />
                              {c.error}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

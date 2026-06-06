/**
 * ResumeRanker.jsx
 * Location: components/recruitment/ResumeRanker.jsx  (or pages/recruitment/rank.jsx)
 *
 * Hackathon-ready AI Resume Ranking UI
 * Upload ZIP → Enter JD → View ranked candidates with scores, badges, AI summaries
 */

import { useState, useRef, useCallback } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── Recommendation badge config ──────────────────────────────────────────────
const BADGE = {
  strong_yes: { label: "Strong Yes", bg: "#00FF87", color: "#0A0A0A" },
  yes:        { label: "Yes",         bg: "#7DF9C2", color: "#0A0A0A" },
  maybe:      { label: "Maybe",       bg: "#FFD166", color: "#0A0A0A" },
  no:         { label: "No",          bg: "#FF4D6D", color: "#FFFFFF" },
};

const SCORE_COLOR = (s) =>
  s >= 85 ? "#00FF87" : s >= 65 ? "#7DF9C2" : s >= 40 ? "#FFD166" : "#FF4D6D";

// ── Main Component ────────────────────────────────────────────────────────────
export default function ResumeRanker() {
  const [zipFile, setZipFile]           = useState(null);
  const [jobDesc, setJobDesc]           = useState("");
  const [loading, setLoading]           = useState(false);
  const [results, setResults]           = useState(null);
  const [error, setError]               = useState(null);
  const [dragOver, setDragOver]         = useState(false);
  const [expandedIdx, setExpandedIdx]   = useState(null);
  const fileRef                         = useRef();

  // ── File drop / select ─────────────────────────────────────────────────────
  const handleFile = (file) => {
    if (!file) return;
    if (!file.name.endsWith(".zip")) {
      setError("Please upload a .zip file containing PDF resumes.");
      return;
    }
    setZipFile(file);
    setError(null);
    setResults(null);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!zipFile)             return setError("Please upload a ZIP file.");
    if (jobDesc.trim().length < 20) return setError("Job description is too short.");

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
    } catch (err) {
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
    fileRef.current && (fileRef.current.value = "");
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={S.root}>
      {/* Background grid */}
      <div style={S.gridBg} />

      <div style={S.wrap}>
        {/* ── Header ── */}
        <div style={S.header}>
          <div style={S.tagline}>AI-POWERED SCREENING</div>
          <h1 style={S.title}>
            Resume<br />
            <span style={S.titleAccent}>Ranker</span>
          </h1>
          <p style={S.subtitle}>
            Upload candidate resumes · Enter job description · Get instant AI rankings
          </p>
        </div>

        {/* ── Input Panel ── */}
        {!results && (
          <div style={S.inputPanel}>
            {/* ZIP Upload */}
            <div style={S.section}>
              <label style={S.label}>01 — RESUME BATCH</label>
              <div
                style={{ ...S.dropZone, ...(dragOver ? S.dropZoneActive : {}), ...(zipFile ? S.dropZoneFilled : {}) }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".zip"
                  style={{ display: "none" }}
                  onChange={(e) => handleFile(e.target.files[0])}
                />
                {zipFile ? (
                  <div style={S.fileInfo}>
                    <span style={S.fileIcon}>📦</span>
                    <span style={S.fileName}>{zipFile.name}</span>
                    <span style={S.fileSize}>
                      {(zipFile.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                ) : (
                  <div style={S.dropHint}>
                    <span style={S.dropIcon}>⬆</span>
                    <span style={S.dropText}>Drop ZIP here or click to browse</span>
                    <span style={S.dropSub}>Contains PDF resumes · Max 20 candidates</span>
                  </div>
                )}
              </div>
            </div>

            {/* JD Textarea */}
            <div style={S.section}>
              <label style={S.label}>02 — JOB DESCRIPTION</label>
              <textarea
                style={S.textarea}
                placeholder="Paste the full job description here — required skills, responsibilities, qualifications..."
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                rows={8}
              />
              <div style={S.charCount}>{jobDesc.length} chars</div>
            </div>

            {/* Error */}
            {error && <div style={S.errorBox}>{error}</div>}

            {/* Submit */}
            <button
              style={{ ...S.btn, ...(loading ? S.btnDisabled : {}) }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <span style={S.btnContent}>
                  <span style={S.spinner} />
                  Ranking Candidates…
                </span>
              ) : (
                <span style={S.btnContent}>⚡ Rank Candidates</span>
              )}
            </button>

            {loading && (
              <div style={S.loadingNote}>
                Extracting resumes → Parsing text → Scoring with Gemini AI…
              </div>
            )}
          </div>
        )}

        {/* ── Results Panel ── */}
        {results && (
          <div style={S.resultsPanel}>
            {/* Summary bar */}
            <div style={S.summaryBar}>
              <div style={S.summaryItem}>
                <span style={S.summaryNum}>{results.total_candidates}</span>
                <span style={S.summaryLbl}>Candidates</span>
              </div>
              <div style={S.summaryDivider} />
              <div style={S.summaryItem}>
                <span style={S.summaryNum}>
                  {results.ranked_results[0]?.score ?? 0}
                </span>
                <span style={S.summaryLbl}>Top Score</span>
              </div>
              <div style={S.summaryDivider} />
              <div style={S.summaryItem}>
                <span style={S.summaryNum}>
                  {results.ranked_results.filter(
                    (r) => r.recommendation === "strong_yes" || r.recommendation === "yes"
                  ).length}
                </span>
                <span style={S.summaryLbl}>Recommended</span>
              </div>
              <button style={S.resetBtn} onClick={reset}>← New Batch</button>
            </div>

            {/* Candidate cards */}
            <div style={S.cardList}>
              {results.ranked_results.map((c, i) => {
                const badge = BADGE[c.recommendation] || BADGE.no;
                const expanded = expandedIdx === i;
                const scoreColor = SCORE_COLOR(c.score);

                return (
                  <div
                    key={i}
                    style={{ ...S.card, ...(expanded ? S.cardExpanded : {}), animationDelay: `${i * 60}ms` }}
                  >
                    {/* Card header row */}
                    <div
                      style={S.cardHeader}
                      onClick={() => setExpandedIdx(expanded ? null : i)}
                    >
                      {/* Rank */}
                      <div style={S.rank}>#{c.rank}</div>

                      {/* Filename */}
                      <div style={S.candidateInfo}>
                        <div style={S.candidateName}>{c.filename.replace(".pdf", "")}</div>
                        <div style={S.candidateFile}>{c.filename}</div>
                      </div>

                      {/* Score bar */}
                      <div style={S.scoreWrap}>
                        <div style={S.scoreBar}>
                          <div
                            style={{
                              ...S.scoreBarFill,
                              width: `${c.score}%`,
                              background: scoreColor,
                            }}
                          />
                        </div>
                        <div style={{ ...S.scoreNum, color: scoreColor }}>{c.score}</div>
                      </div>

                      {/* Badge */}
                      <div
                        style={{
                          ...S.badge,
                          background: badge.bg,
                          color: badge.color,
                        }}
                      >
                        {badge.label}
                      </div>

                      {/* Expand chevron */}
                      <div style={{ ...S.chevron, transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>
                        ▾
                      </div>
                    </div>

                    {/* Expanded detail */}
                    {expanded && (
                      <div style={S.cardDetail}>
                        {/* Summary */}
                        <div style={S.detailSection}>
                          <div style={S.detailLabel}>AI SUMMARY</div>
                          <p style={S.detailText}>{c.summary}</p>
                        </div>

                        {/* Skills */}
                        <div style={S.detailRow}>
                          <div style={S.detailHalf}>
                            <div style={S.detailLabel}>MATCHED SKILLS</div>
                            <div style={S.pillList}>
                              {c.skills_match.length
                                ? c.skills_match.map((s, j) => (
                                    <span key={j} style={S.pillGreen}>{s}</span>
                                  ))
                                : <span style={S.emptyNote}>None identified</span>}
                            </div>
                          </div>
                          <div style={S.detailHalf}>
                            <div style={S.detailLabel}>MISSING SKILLS</div>
                            <div style={S.pillList}>
                              {c.missing_skills.length
                                ? c.missing_skills.map((s, j) => (
                                    <span key={j} style={S.pillRed}>{s}</span>
                                  ))
                                : <span style={S.emptyNote}>None — great fit!</span>}
                            </div>
                          </div>
                        </div>

                        {/* Error note */}
                        {c.error && (
                          <div style={S.errorNote}>⚠ {c.error}</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{ opacity:1 } 50%{ opacity:.5 } }
      `}</style>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  root: {
    minHeight: "100vh",
    background: "#0A0A0A",
    fontFamily: "'Syne', sans-serif",
    color: "#F0EDE6",
    position: "relative",
    overflow: "hidden",
  },
  gridBg: {
    position: "fixed", inset: 0, zIndex: 0,
    backgroundImage: `
      linear-gradient(rgba(0,255,135,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,135,0.04) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px",
    pointerEvents: "none",
  },
  wrap: {
    position: "relative", zIndex: 1,
    maxWidth: 860, margin: "0 auto",
    padding: "60px 24px 80px",
  },

  // Header
  header:       { marginBottom: 56, textAlign: "center" },
  tagline: {
    fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "0.2em", color: "#00FF87",
    marginBottom: 20,
  },
  title: {
    fontSize: "clamp(56px, 10vw, 90px)",
    fontWeight: 800, lineHeight: 0.95,
    letterSpacing: "-3px",
  },
  titleAccent: { color: "#00FF87" },
  subtitle: {
    marginTop: 20, fontSize: 15,
    color: "#888", lineHeight: 1.6,
    fontWeight: 400,
  },

  // Input panel
  inputPanel: { display: "flex", flexDirection: "column", gap: 28 },
  section:    { display: "flex", flexDirection: "column", gap: 10 },
  label: {
    fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "0.15em", color: "#555",
  },

  // Drop zone
  dropZone: {
    border: "1.5px dashed #2A2A2A",
    borderRadius: 12, padding: "40px 32px",
    cursor: "pointer", transition: "all 0.2s",
    background: "#111",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  dropZoneActive: {
    border: "1.5px dashed #00FF87",
    background: "rgba(0,255,135,0.04)",
  },
  dropZoneFilled: {
    border: "1.5px solid #00FF87",
    background: "rgba(0,255,135,0.06)",
  },
  dropHint:  { display: "flex", flexDirection: "column", alignItems: "center", gap: 10 },
  dropIcon:  { fontSize: 28, opacity: 0.4 },
  dropText:  { fontSize: 15, color: "#888" },
  dropSub:   { fontSize: 12, color: "#444", fontFamily: "'JetBrains Mono', monospace" },
  fileInfo:  { display: "flex", alignItems: "center", gap: 14 },
  fileIcon:  { fontSize: 28 },
  fileName:  { fontSize: 15, fontWeight: 600 },
  fileSize:  { fontSize: 12, color: "#555", fontFamily: "'JetBrains Mono', monospace" },

  // Textarea
  textarea: {
    background: "#111", border: "1.5px solid #1E1E1E",
    borderRadius: 12, padding: "16px 18px",
    color: "#F0EDE6", fontSize: 14, lineHeight: 1.65,
    resize: "vertical", outline: "none",
    fontFamily: "'Syne', sans-serif",
    transition: "border 0.2s",
  },
  charCount: {
    fontSize: 11, color: "#333",
    fontFamily: "'JetBrains Mono', monospace",
    textAlign: "right",
  },

  // Button
  btn: {
    background: "#00FF87", color: "#0A0A0A",
    border: "none", borderRadius: 12,
    padding: "18px 36px", fontSize: 15,
    fontWeight: 700, fontFamily: "'Syne', sans-serif",
    cursor: "pointer", letterSpacing: "0.02em",
    transition: "all 0.15s",
  },
  btnDisabled: { opacity: 0.6, cursor: "not-allowed" },
  btnContent: { display: "flex", alignItems: "center", gap: 10, justifyContent: "center" },
  spinner: {
    width: 16, height: 16,
    border: "2px solid #0A0A0A",
    borderTopColor: "transparent",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
    display: "inline-block",
  },
  loadingNote: {
    textAlign: "center", fontSize: 12,
    color: "#444", fontFamily: "'JetBrains Mono', monospace",
    animation: "pulse 1.6s ease-in-out infinite",
  },

  // Error
  errorBox: {
    background: "rgba(255,77,109,0.1)",
    border: "1px solid rgba(255,77,109,0.3)",
    borderRadius: 8, padding: "12px 16px",
    color: "#FF4D6D", fontSize: 13,
  },

  // Results
  resultsPanel: { display: "flex", flexDirection: "column", gap: 20 },
  summaryBar: {
    display: "flex", alignItems: "center",
    background: "#111", border: "1.5px solid #1E1E1E",
    borderRadius: 14, padding: "20px 28px",
    gap: 28,
  },
  summaryItem:   { display: "flex", flexDirection: "column", gap: 4, alignItems: "center" },
  summaryNum:    { fontSize: 32, fontWeight: 800, color: "#00FF87" },
  summaryLbl:    { fontSize: 11, color: "#555", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em" },
  summaryDivider: { width: 1, height: 40, background: "#222" },
  resetBtn: {
    marginLeft: "auto", background: "transparent",
    border: "1.5px solid #333", borderRadius: 8,
    padding: "8px 16px", color: "#888",
    fontSize: 12, cursor: "pointer",
    fontFamily: "'JetBrains Mono', monospace",
    transition: "all 0.2s",
  },

  // Cards
  cardList: { display: "flex", flexDirection: "column", gap: 10 },
  card: {
    background: "#111", border: "1.5px solid #1E1E1E",
    borderRadius: 14, overflow: "hidden",
    animation: "fadeUp 0.4s ease both",
    transition: "border-color 0.2s",
  },
  cardExpanded: { borderColor: "#2A2A2A" },
  cardHeader: {
    display: "flex", alignItems: "center",
    padding: "18px 22px", gap: 18,
    cursor: "pointer",
  },
  rank: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13, color: "#444", minWidth: 28,
    fontWeight: 500,
  },
  candidateInfo: { flex: 1, minWidth: 0 },
  candidateName: {
    fontSize: 15, fontWeight: 700,
    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
  },
  candidateFile: {
    fontSize: 11, color: "#555",
    fontFamily: "'JetBrains Mono', monospace", marginTop: 2,
  },
  scoreWrap: { display: "flex", alignItems: "center", gap: 10, minWidth: 160 },
  scoreBar:  { flex: 1, height: 4, background: "#1E1E1E", borderRadius: 2, overflow: "hidden" },
  scoreBarFill: { height: "100%", borderRadius: 2, transition: "width 0.6s ease" },
  scoreNum: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 15, fontWeight: 500, minWidth: 28, textAlign: "right",
  },
  badge: {
    fontSize: 11, fontWeight: 700, borderRadius: 6,
    padding: "4px 10px", letterSpacing: "0.04em",
    whiteSpace: "nowrap",
  },
  chevron: {
    color: "#444", fontSize: 14,
    transition: "transform 0.2s",
    marginLeft: 4,
  },

  // Expanded detail
  cardDetail: {
    borderTop: "1px solid #1A1A1A",
    padding: "20px 22px", display: "flex",
    flexDirection: "column", gap: 18,
  },
  detailSection: { display: "flex", flexDirection: "column", gap: 8 },
  detailRow: { display: "flex", gap: 24, flexWrap: "wrap" },
  detailHalf: { flex: 1, minWidth: 200, display: "flex", flexDirection: "column", gap: 8 },
  detailLabel: {
    fontSize: 10, fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "0.15em", color: "#444",
  },
  detailText: { fontSize: 13, color: "#AAA", lineHeight: 1.65 },
  pillList:  { display: "flex", flexWrap: "wrap", gap: 6 },
  pillGreen: {
    fontSize: 12, background: "rgba(0,255,135,0.1)",
    color: "#00FF87", border: "1px solid rgba(0,255,135,0.2)",
    borderRadius: 6, padding: "3px 10px",
  },
  pillRed: {
    fontSize: 12, background: "rgba(255,77,109,0.1)",
    color: "#FF4D6D", border: "1px solid rgba(255,77,109,0.2)",
    borderRadius: 6, padding: "3px 10px",
  },
  emptyNote: { fontSize: 12, color: "#444", fontStyle: "italic" },
  errorNote: {
    fontSize: 12, color: "#FFD166",
    fontFamily: "'JetBrains Mono', monospace",
    background: "rgba(255,209,102,0.07)",
    borderRadius: 6, padding: "8px 12px",
  },
};

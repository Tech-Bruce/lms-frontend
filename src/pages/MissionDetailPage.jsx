import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Crosshair,
  ArrowLeft,
  Clock,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Send,
  FileText,
  Copy,
  Check,
  Award,
  Terminal,
  Shield,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import api from "../api";
import { toast } from "react-toastify";

// Helper for formatting markdown headers, bold, code, and lists in Incident Briefing
const renderInlineMarkdown = (text) => {
  if (!text) return "";
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-white font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono text-xs mx-0.5"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
};

const renderMarkdown = (text) => {
  if (!text) return null;
  const lines = text.split("\n");
  const elements = [];
  let currentList = [];
  let listType = null; // 'ol' or 'ul'

  const flushList = () => {
    if (currentList.length > 0) {
      if (listType === "ol") {
        elements.push(
          <ol key={`ol-${elements.length}`} className="space-y-2.5 my-3 pl-1">
            {currentList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-slate-300 text-xs sm:text-sm">
                <span className="flex-shrink-0 w-5 h-5 rounded-md bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 font-mono text-[11px] font-bold flex items-center justify-center mt-0.5">
                  {item.num || idx + 1}
                </span>
                <span className="flex-1 leading-relaxed">{renderInlineMarkdown(item.text)}</span>
              </li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`ul-${elements.length}`} className="space-y-2 my-3 pl-1">
            {currentList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-slate-300 text-xs sm:text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0 mt-2"></span>
                <span className="flex-1 leading-relaxed">{renderInlineMarkdown(item.text)}</span>
              </li>
            ))}
          </ul>
        );
      }
      currentList = [];
      listType = null;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // H3 Header (### Title)
    if (trimmed.startsWith("### ")) {
      flushList();
      elements.push(
        <h3
          key={`h3-${index}`}
          className="text-xs sm:text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2 pt-4 pb-1.5 border-b border-cyan-500/20 mb-2 font-mono"
        >
          <span className="w-2 h-2 rounded-sm bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
          {renderInlineMarkdown(trimmed.replace(/^###\s+/, ""))}
        </h3>
      );
      return;
    }

    // H2 Header (## Title)
    if (trimmed.startsWith("## ")) {
      flushList();
      elements.push(
        <h2
          key={`h2-${index}`}
          className="text-sm sm:text-base font-extrabold text-white pt-5 pb-1.5 border-b border-white/10 mb-2.5 flex items-center gap-2"
        >
          <Shield className="w-4 h-4 text-cyan-400" />
          {renderInlineMarkdown(trimmed.replace(/^##\s+/, ""))}
        </h2>
      );
      return;
    }

    // H1 Header (# Title)
    if (trimmed.startsWith("# ")) {
      flushList();
      elements.push(
        <h1
          key={`h1-${index}`}
          className="text-base sm:text-lg font-black text-white pt-5 pb-2 border-b border-white/10 mb-3"
        >
          {renderInlineMarkdown(trimmed.replace(/^#\s+/, ""))}
        </h1>
      );
      return;
    }

    // Numbered list item (e.g., 1. ...)
    const olMatch = trimmed.match(/^(\d+)[\.\)]\s+(.*)/);
    if (olMatch) {
      if (listType !== "ol") flushList();
      listType = "ol";
      currentList.push({ num: olMatch[1], text: olMatch[2] });
      return;
    }

    // Bullet item (e.g., - ... or * ...)
    const ulMatch = trimmed.match(/^[\-\*]\s+(.*)/);
    if (ulMatch) {
      if (listType !== "ul") flushList();
      listType = "ul";
      currentList.push({ text: ulMatch[1] });
      return;
    }

    // Empty lines
    if (!trimmed) {
      flushList();
      return;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={`p-${index}`} className="text-xs sm:text-sm text-slate-300 leading-relaxed my-2">
        {renderInlineMarkdown(trimmed)}
      </p>
    );
  });

  flushList();
  return elements;
};

const MissionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.lms_auth.user);

  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active artifact tab in Evidence Locker
  const [activeArtifactIndex, setActiveArtifactIndex] = useState(0);
  const [copiedArtifact, setCopiedArtifact] = useState(false);

  // Student progress on this mission
  const [completedTasks, setCompletedTasks] = useState([]);
  const [answers, setAnswers] = useState({}); // { [taskNumber]: answerInput }
  const [showHints, setShowHints] = useState({}); // { [taskNumber]: boolean }
  const [submittingTask, setSubmittingTask] = useState({}); // { [taskNumber]: boolean }
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
  const [earnedXpTotal, setEarnedXpTotal] = useState(0);

  const userId = user?._id || user?.id;

  // Fetch mission details & user progress
  useEffect(() => {
    const fetchMissionData = async () => {
      try {
        setLoading(true);
        setError(null);

        const missionRes = await api.get(`/missions/${id}`);
        setMission(missionRes.data);

        // Fetch user progress if logged in
        if (userId) {
          try {
            const progressRes = await api.get(`/missions/progress?userId=${userId}`);
            const missionProgress = progressRes.data?.[id];
            if (missionProgress) {
              setCompletedTasks(missionProgress.completedTasks || []);
              setEarnedXpTotal(missionProgress.earnedXp || 0);
              if (missionProgress.status === "completed") {
                // Already completed
              }
            }
          } catch (pErr) {
            console.error("Progress fetch error:", pErr);
          }
        }
      } catch (err) {
        console.error("Error loading mission:", err);
        setError("Failed to load investigation mission. Please verify the URL.");
      } finally {
        setLoading(false);
      }
    };

    fetchMissionData();
  }, [id, user?._id, user?.id]);

  // Copy artifact to clipboard
  const handleCopyArtifact = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedArtifact(true);
    setTimeout(() => setCopiedArtifact(false), 2000);
  };

  // Submit Answer for a task
  const handleSubmitAnswer = async (taskNumber) => {
    const userId = user?._id || user?.id;
    if (!userId) {
      toast.info("Please sign in to submit investigation flags and track your progress.");
      navigate("/login");
      return;
    }

    const currentAnswer = answers[taskNumber]?.trim();
    if (!currentAnswer) {
      toast.error("Please enter your answer / flag.");
      return;
    }

    try {
      setSubmittingTask((prev) => ({ ...prev, [taskNumber]: true }));
      const res = await api.post(`/missions/${id}/submit-task`, {
        userId,
        taskNumber,
        answer: currentAnswer,
      });

      if (res.data.isCorrect) {
        toast.success(res.data.msg || "Objective verified!");
        setCompletedTasks(res.data.completedTasks || []);

        if (res.data.isCompleted) {
          setEarnedXpTotal(res.data.earnedXp || mission.xpReward);
          setIsCompletedModalOpen(true);
        }
      } else {
        toast.error(res.data.msg || "Incorrect flag. Try again!");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Validation failed.");
    } finally {
      setSubmittingTask((prev) => ({ ...prev, [taskNumber]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 text-white pt-24">
        <div className="text-center space-y-4">
          <RefreshCw className="w-10 h-10 animate-spin text-cyan-400 mx-auto" />
          <p className="text-sm font-mono text-cyan-400 tracking-widest uppercase">
            Initializing Cyber Range & Evidence Locker...
          </p>
        </div>
      </div>
    );
  }

  if (error || !mission) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 text-white pt-24">
        <div className="bg-[#091022] border border-slate-800 rounded-3xl p-8 max-w-md text-center space-y-4 shadow-2xl">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h2 className="text-xl font-bold">Investigation Unavailable</h2>
          <p className="text-xs text-slate-400">{error || "Mission scenario not found."}</p>
          <Link
            to="/missions"
            className="inline-flex px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#030712] font-black text-xs"
          >
            Back to Missions Catalog
          </Link>
        </div>
      </div>
    );
  }

  const totalTasksCount = mission.tasks?.length || 1;
  const progressPercent = Math.round((completedTasks.length / totalTasksCount) * 100);
  const isMissionSolved = progressPercent >= 100;

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans flex flex-col pt-20">
      {/* Top Mission Header Bar (Sticky at top: 0 with clean cyber glassmorphism) */}
      <div className="bg-[#060b18]/95 border-b border-cyan-500/20 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-8 py-3.5 shadow-xl transition-all">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/missions"
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
              title="Return to Missions Catalog"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Missions</span>
            </Link>

            <div className="border-l border-white/10 pl-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/70 border border-cyan-500/30 px-2 py-0.5 rounded">
                  {mission.missionCode}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-300 font-medium">{mission.category}</span>
                {mission.mitreTechnique && (
                  <>
                    <span className="text-slate-600">•</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-[11px] text-cyan-300 font-mono">
                      {mission.mitreTechnique}
                    </span>
                  </>
                )}
              </div>
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight mt-0.5">
                {mission.title}
              </h1>
            </div>
          </div>

          {/* Stats & Progress Pill */}
          <div className="flex items-center gap-3.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-medium">{mission.estimatedDuration}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-amber-300 bg-amber-950/40 border border-amber-500/30 px-3 py-1 rounded-lg">
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>+{mission.xpReward} XP</span>
            </div>

            {/* Solved Progress Counter */}
            <div className="flex items-center gap-2.5 bg-slate-900/80 border border-white/10 px-3 py-1 rounded-xl">
              <div className="text-right">
                <span className="text-xs font-bold font-mono text-slate-200">
                  {completedTasks.length}/{totalTasksCount} Solved
                </span>
                <span className="text-[10px] text-cyan-400 block font-mono font-semibold">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-16 bg-[#080d1a] rounded-full h-2 overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Investigation Split Workspace */}
      <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Briefing & Evidence Locker (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Incident Briefing Section */}
          <div className="bg-[#091022] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
              <Shield className="w-5 h-5 text-cyan-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Incident Briefing & Threat Context
              </h2>
            </div>

            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3 font-sans">
              <p className="text-slate-300 italic bg-white/[0.03] border-l-2 border-cyan-400 p-3 rounded-r-lg">
                {mission.shortDescription}
              </p>

              {mission.incidentBriefing ? (
                <div className="font-sans text-slate-300 space-y-1">
                  {renderMarkdown(mission.incidentBriefing)}
                </div>
              ) : (
                <p className="text-slate-400">
                  Review the evidence artifacts in the telemetry locker to address the investigation objectives.
                </p>
              )}
            </div>
          </div>

          {/* Evidence Locker (Telemetry Artifacts) */}
          <div className="bg-[#091022] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 bg-[#050914] border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
                <Terminal className="w-4 h-4" />
                <span>Evidence Locker ({mission.evidenceArtifacts?.length || 0})</span>
              </div>

              {mission.evidenceArtifacts?.[activeArtifactIndex] && (
                <button
                  onClick={() =>
                    handleCopyArtifact(mission.evidenceArtifacts[activeArtifactIndex].content)
                  }
                  className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono transition-colors flex items-center gap-1.5"
                >
                  {copiedArtifact ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Log</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Artifact Tabs */}
            {mission.evidenceArtifacts?.length > 0 ? (
              <div>
                <div className="flex overflow-x-auto border-b border-slate-800 bg-[#060b18] scrollbar-thin px-2 pt-2 gap-1.5">
                  {mission.evidenceArtifacts.map((artifact, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveArtifactIndex(idx)}
                      className={`px-3.5 py-2 rounded-t-xl text-xs font-mono transition-all whitespace-nowrap flex items-center gap-2 ${
                        activeArtifactIndex === idx
                          ? "bg-[#050914] text-cyan-400 border-t-2 border-cyan-400 font-bold"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{artifact.name}</span>
                    </button>
                  ))}
                </div>

                {/* Artifact Content Viewer */}
                <div className="p-4 bg-[#050914] overflow-x-auto max-h-[360px] scrollbar-thin">
                  <pre className="text-xs font-mono text-cyan-300 leading-relaxed whitespace-pre-wrap select-all">
                    {mission.evidenceArtifacts[activeArtifactIndex]?.content || "Empty artifact."}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                No raw telemetry artifacts uploaded for this scenario.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Investigation Objectives & Flag Submission (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-cyan-400" />
              <span>Investigation Objectives</span>
            </h2>
            <span className="text-xs font-mono text-slate-400">
              {completedTasks.length} of {totalTasksCount} completed
            </span>
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            {mission.tasks?.map((task) => {
              const isSolved = completedTasks.includes(task.taskNumber);
              const isSubmitting = submittingTask[task.taskNumber] || false;
              const isHintRevealed = showHints[task.taskNumber] || false;

              return (
                <div
                  key={task.taskNumber}
                  className={`p-5 rounded-2xl border transition-all ${
                    isSolved
                      ? "bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                      : "bg-[#091022] border-slate-800 hover:border-cyan-500/30 shadow-lg"
                  }`}
                >
                  {/* Task Header */}
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400">
                        TASK {task.taskNumber}
                      </span>
                      {isSolved && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>SOLVED</span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono text-cyan-300 font-bold">
                      +{task.xp || 50} XP
                    </span>
                  </div>

                  {/* Question */}
                  <p className="text-xs sm:text-sm font-medium text-white mb-3.5 leading-snug">
                    {task.question}
                  </p>

                  {/* Solved State or Input Form */}
                  {isSolved ? (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Objective completed. Flag verified.</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter flag / investigation answer..."
                          value={answers[task.taskNumber] || ""}
                          onChange={(e) =>
                            setAnswers((prev) => ({
                              ...prev,
                              [task.taskNumber]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSubmitAnswer(task.taskNumber);
                          }}
                          className="flex-1 px-3.5 py-2 bg-[#050914] border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                        />
                        <button
                          onClick={() => handleSubmitAnswer(task.taskNumber)}
                          disabled={isSubmitting}
                          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-[#030712] font-black text-xs rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center gap-1.5 shrink-0"
                        >
                          {isSubmitting ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Send className="w-3.5 h-3.5" />
                          )}
                          <span>Submit</span>
                        </button>
                      </div>

                      {/* Hint Reveal Toggle */}
                      {task.hint && (
                        <div>
                          {isHintRevealed ? (
                            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs leading-relaxed flex items-start gap-2">
                              <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                              <span>{task.hint}</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                setShowHints((prev) => ({
                                  ...prev,
                                  [task.taskNumber]: true,
                                }))
                              }
                              className="text-[11px] text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1"
                            >
                              <HelpCircle className="w-3 h-3" />
                              <span>Need a hint?</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mission Completion Celebration Modal */}
      {isCompletedModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-[#091022] border border-emerald-500/40 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative space-y-5 animate-fadeIn">
            <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_25px_rgba(16,185,129,0.3)]">
              <Award className="w-10 h-10 animate-bounce" />
            </div>

            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                Mission Accomplished
              </span>
              <h3 className="text-2xl font-black text-white mt-1">
                Investigation Resolved!
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                You successfully verified all threat indicators and solved all incident response tasks for{" "}
                <strong className="text-white">{mission.title}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-mono text-sm font-bold flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 fill-emerald-400" />
              <span>+{earnedXpTotal} XP Awarded to Profile</span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsCompletedModalOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-700 hover:bg-white/5 text-slate-300 text-xs font-semibold"
              >
                Review Evidence
              </button>
              <Link
                to="/missions"
                className="flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#030712] font-black text-xs shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center gap-1.5"
              >
                <span>More Missions</span>
                <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionDetailPage;

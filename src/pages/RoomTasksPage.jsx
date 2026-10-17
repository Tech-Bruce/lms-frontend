import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";
import {
  Network,
  Shield,
  Server,
  Share2,
  Terminal,
  Lock,
  Users,
  Cpu,
  Database,
  Layers,
  FileText,
  CheckCircle,
  Clock,
  RotateCcw,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  BarChart2,
  Check,
  Award,
} from "lucide-react";

const iconMap = {
  Network: Network,
  Shield: Shield,
  Server: Server,
  Share2: Share2,
  Terminal: Terminal,
  Lock: Lock,
  Users: Users,
  Cpu: Cpu,
  Database: Database,
  Layers: Layers,
  Cable: Network,
};

const getIcon = (iconName) => {
  const Icon = iconMap[iconName] || Network;
  return <Icon className="w-6 h-6" />;
};

const RoomTasksPage = () => {
  const { courseId, chapterId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [completedTasks, setCompletedTasks] = useState({});
  const [userAnswers, setUserAnswers] = useState({});
  const [answerFeedback, setAnswerFeedback] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoomData();
  }, [courseId, chapterId]);

  const fetchRoomData = async () => {
    try {
      setLoading(true);
      const [courseRes, chapterRes] = await Promise.all([
        api.get(`/curriculum/courses/${courseId}`),
        api.get(`/curriculum/chapters/${chapterId}`),
      ]);
      setCourse(courseRes.data);
      setChapter(chapterRes.data);
      setTasks(chapterRes.data.tasks || []);

      // Load completed tasks from localStorage for persistence
      const savedCompleted = localStorage.getItem(`room_completed_${chapterId}`);
      if (savedCompleted) {
        try {
          setCompletedTasks(JSON.parse(savedCompleted));
        } catch (e) {
          console.error(e);
        }
      } else {
        setCompletedTasks({});
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load room details");
    } finally {
      setLoading(false);
    }
  };

  const handleResetProgress = () => {
    if (window.confirm("Reset your room progress to 0%?")) {
      setCompletedTasks({});
      setUserAnswers({});
      setAnswerFeedback({});
      localStorage.removeItem(`room_completed_${chapterId}`);
      toast.info("Progress reset");
    }
  };

  const currentTask = tasks[activeTaskIndex] || null;

  const markTaskCompleted = (taskId) => {
    const updated = { ...completedTasks, [taskId]: true };
    setCompletedTasks(updated);
    localStorage.setItem(`room_completed_${chapterId}`, JSON.stringify(updated));
    toast.success(`Task completed! +${currentTask?.xp || 20} XP earned 🎉`);

    // Next task
    if (activeTaskIndex < tasks.length - 1) {
      setActiveTaskIndex(activeTaskIndex + 1);
    }
  };

  const handleCheckAnswer = (qIndex, correctAnswer) => {
    const userVal = (userAnswers[`${currentTask?._id}_${qIndex}`] || "").trim().toLowerCase();
    const correctVal = (correctAnswer || "").trim().toLowerCase();

    if (!userVal) {
      toast.warn("Please enter an answer first");
      return;
    }

    if (userVal === correctVal || correctVal === "ready") {
      setAnswerFeedback((prev) => ({ ...prev, [`${currentTask?._id}_${qIndex}`]: "correct" }));
      toast.success("Correct answer! Great job! ✨");
    } else {
      setAnswerFeedback((prev) => ({ ...prev, [`${currentTask?._id}_${qIndex}`]: "incorrect" }));
      toast.error("Incorrect answer. Check the hint or task text!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center pt-20">
        <div className="w-10 h-10 border-2 border-primary-cyan/30 border-t-primary-cyan rounded-full animate-spin" />
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center pt-20 text-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Room Not Found</h2>
          <Link to={`/modules/${courseId}`} className="text-primary-cyan hover:underline text-sm font-semibold">
            &larr; Back to Module Chapters
          </Link>
        </div>
      </div>
    );
  }

  const completedCount = Object.keys(completedTasks).filter((id) =>
    tasks.some((t) => t._id === id)
  ).length;

  const completionPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#030712] text-text-main pt-24 pb-20 relative font-sans">
      
      {/* =========================================================================
          TOP BANNER / HEADER (Exact Image 3 Header)
      ========================================================================== */}
      <div className="bg-[#060D1E] border-b border-white/10 px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-blue/30 to-purple-600/30 border border-primary-blue/40 text-primary-cyan flex items-center justify-center shadow-lg flex-shrink-0">
              {getIcon(chapter.icon)}
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
                <Link to="/modules-page" className="hover:text-white transition-colors">
                  Modules
                </Link>
                <ChevronRight className="w-3 h-3" />
                <Link to={`/modules/${courseId}`} className="hover:text-white transition-colors">
                  {course?.title || "Course"}
                </Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-300">{chapter.roomNumber}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {chapter.title}
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
                {chapter.description}
              </p>

              {/* Meta tags badges (Exact Image 3) */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-300">
                  <BarChart2 className="w-3.5 h-3.5 mr-1.5 text-primary-cyan" />
                  Level: {chapter.level || "Easy"}
                </span>

                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-300">
                  <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                  Time: {chapter.estimatedTime || "45 minutes"}
                </span>

                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-300">
                  <FileText className="w-3.5 h-3.5 mr-1.5 text-purple-400" />
                  {tasks.length} Tasks
                </span>

                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Award className="w-3.5 h-3.5 mr-1.5" />
                  {chapter.xp || 100} XP
                </span>
              </div>
            </div>
          </div>

          <Link
            to={`/modules/${courseId}`}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 flex items-center transition-colors self-start md:self-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Back to Module
          </Link>
        </div>
      </div>

      {/* =========================================================================
          TWO-COLUMN MAIN CONTENT (Exact Image 3 Layout)
      ========================================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* =====================================================================
              LEFT SIDEBAR: TASKS LIST (Exact Image 3 Left Column)
          ====================================================================== */}
          <div className="lg:col-span-3 bg-[#0A1122] border border-white/10 rounded-2xl p-5 space-y-5 shadow-xl sticky top-28">
            {/* Header with Reset */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-primary-cyan" />
                <h3 className="font-bold text-white text-base">Tasks</h3>
              </div>

              <button
                onClick={handleResetProgress}
                className="flex items-center text-[11px] font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 transition-colors"
                title="Reset progress"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset
              </button>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-slate-400">
                <span>{completionPercent}% Complete</span>
                <span>{completedCount}/{tasks.length}</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                <div
                  className="bg-primary-cyan h-full rounded-full transition-all duration-300"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>

            {/* Vertical list of tasks (Exact Image 3 style) */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {tasks.map((task, idx) => {
                const isActive = activeTaskIndex === idx;
                const isCompleted = completedTasks[task._id];

                return (
                  <button
                    key={task._id}
                    onClick={() => setActiveTaskIndex(idx)}
                    className={`w-full p-3 rounded-xl border flex items-center space-x-3 transition-all text-left ${
                      isActive
                        ? "bg-primary-blue/20 border-primary-cyan text-white shadow-md shadow-primary-cyan/10"
                        : "bg-[#060D1E]/70 border-white/5 hover:border-white/15 text-slate-300 hover:text-white"
                    }`}
                  >
                    {/* Status Badge: Checkmark if completed, otherwise Task Number */}
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${
                        isCompleted
                          ? "bg-success text-[#07121D]"
                          : isActive
                          ? "bg-primary-cyan text-[#07121D]"
                          : "bg-white/10 text-slate-400"
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                    </div>

                    <span className="text-xs font-bold truncate">
                      {task.taskNumber || `Task ${idx + 1}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* =====================================================================
              RIGHT PANE: TASK CONTENT & QUESTIONS (Exact Image 3 Right Column)
          ====================================================================== */}
          <div className="lg:col-span-9 bg-[#0A1122] border border-white/10 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
            {currentTask ? (
              <div className="space-y-8">
                {/* Task Title Header (Exact Image 3) */}
                <div className="flex items-center justify-between pb-5 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-slate-300 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary-cyan" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                      {currentTask.title}
                    </h2>
                  </div>

                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
                    +{currentTask.xp || 20} XP
                  </span>
                </div>

                {/* Paragraph Content (Exact Image 3 Body Text) */}
                <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans">
                  {currentTask.content}
                </div>

                {/* Section: "What You'll Learn in This Room" (Exact Image 3) */}
                {currentTask.learningObjectives && currentTask.learningObjectives.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      What You'll Learn in This Room
                    </h3>
                    <ul className="space-y-2">
                      {currentTask.learningObjectives.map((obj, i) => (
                        <li key={i} className="flex items-start text-sm text-slate-300 leading-normal">
                          <span className="text-primary-cyan mr-3 font-bold">•</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Section: "Prerequisites" (Exact Image 3) */}
                {currentTask.prerequisites && currentTask.prerequisites.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      Prerequisites
                    </h3>
                    <ul className="space-y-2">
                      {currentTask.prerequisites.map((pre, i) => (
                        <li key={i} className="flex items-start text-sm text-slate-300 leading-normal">
                          <span className="text-slate-400 mr-3 font-bold">•</span>
                          <span>{pre}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Section: Interactive Question & Challenges */}
                {currentTask.questions && currentTask.questions.length > 0 && (
                  <div className="pt-6 border-t border-white/10 space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center">
                      <Terminal className="w-5 h-5 mr-2 text-primary-cyan" />
                      Questions & Task Submissions
                    </h3>

                    <div className="space-y-4">
                      {currentTask.questions.map((q, qIndex) => {
                        const qKey = `${currentTask._id}_${qIndex}`;
                        const feedback = answerFeedback[qKey];

                        return (
                          <div
                            key={qIndex}
                            className="bg-[#060D1E] border border-white/10 rounded-2xl p-5 space-y-3"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <h4 className="text-sm font-bold text-white leading-snug">
                                {q.questionText}
                              </h4>
                              <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                                +{q.xp || 10} XP
                              </span>
                            </div>

                            {q.hint && (
                              <p className="text-xs text-slate-400 italic">
                                Hint: {q.hint}
                              </p>
                            )}

                            {/* Answer submission row */}
                            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                              <input
                                type="text"
                                placeholder="Enter your answer / flag here..."
                                value={userAnswers[qKey] || ""}
                                onChange={(e) =>
                                  setUserAnswers({
                                    ...userAnswers,
                                    [qKey]: e.target.value,
                                  })
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleCheckAnswer(qIndex, q.correctAnswer);
                                  }
                                }}
                                className={`w-full bg-[#0A1122] border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors ${
                                  feedback === "correct"
                                    ? "border-success text-success"
                                    : feedback === "incorrect"
                                    ? "border-critical text-critical"
                                    : "border-white/10 focus:border-primary-cyan"
                                }`}
                              />

                              <button
                                onClick={() => handleCheckAnswer(qIndex, q.correctAnswer)}
                                className="w-full sm:w-auto bg-primary-blue hover:bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex-shrink-0"
                              >
                                Submit
                              </button>
                            </div>

                            {feedback === "correct" && (
                              <p className="text-xs font-semibold text-success flex items-center">
                                <Check className="w-3.5 h-3.5 mr-1" />
                                Correct answer!
                              </p>
                            )}
                            {feedback === "incorrect" && (
                              <p className="text-xs font-semibold text-critical">
                                Not quite right. Try again!
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Bottom Navigation & Complete Task Button */}
                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    {activeTaskIndex > 0 && (
                      <button
                        onClick={() => setActiveTaskIndex(activeTaskIndex - 1)}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 flex items-center transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                        Previous Task
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => markTaskCompleted(currentTask._id)}
                      className={`px-6 py-3 rounded-xl text-xs font-bold flex items-center shadow-lg transition-all ${
                        completedTasks[currentTask._id]
                          ? "bg-success/20 text-success border border-success/30 hover:bg-success/30"
                          : "bg-primary-cyan hover:bg-cyan-300 text-[#07121D] shadow-primary-cyan/20"
                      }`}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {completedTasks[currentTask._id]
                        ? "Completed • Next Task"
                        : "Complete Task & Next"}
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-slate-400 text-sm">Select a task from the left to start.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default RoomTasksPage;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
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
  Plus,
  Edit3,
  Trash2,
  Search,
  ArrowLeft,
  ArrowRight,
  Clock,
  Star,
  BookOpen,
  ChevronRight,
  ChevronDown,
  X,
  ExternalLink,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  HelpCircle,
  CheckSquare,
  ListTree,
  Eye,
  AlertTriangle,
  FolderOpen,
  Send,
  UploadCloud,
  FileCode,
  Copy,
  Info,
} from "lucide-react";

// Helper for dynamic icon rendering
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
  BookOpen: BookOpen,
};

const getIconComponent = (iconName, className = "w-5 h-5") => {
  const Component = iconMap[iconName] || Network;
  return <Component className={className} />;
};

// Color theme helper
const colorThemeMap = {
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    glow: "shadow-blue-500/20",
    badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  cyan: {
    bg: "bg-primary-cyan/10",
    border: "border-primary-cyan/30",
    text: "text-primary-cyan",
    glow: "shadow-primary-cyan/20",
    badge: "bg-primary-cyan/20 text-cyan-300 border-primary-cyan/30",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-400",
    glow: "shadow-purple-500/20",
    badge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    glow: "shadow-emerald-500/20",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    glow: "shadow-amber-500/20",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  rose: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    text: "text-rose-400",
    glow: "shadow-rose-500/20",
    badge: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  },
};

const getColorTheme = (colorKey = "blue") => {
  return colorThemeMap[colorKey] || colorThemeMap.blue;
};

// Initial template for overall curriculum upload form
const createInitialCurriculumForm = () => ({
  course: {
    title: "",
    track: "",
    description: "",
    icon: "Network",
    badgeColor: "cyan",
    level: "Beginner",
    status: "published",
  },
  chapters: [
    {
      roomNumber: "Room 01",
      title: "",
      description: "",
      level: "Easy",
      estimatedTime: "",
      xp: 100,
      icon: "Network",
      tasks: [
        {
          taskNumber: "Task 1",
          title: "",
          overview: "",
          content: "",
          learningObjectives: [""],
          prerequisites: [""],
          questions: [
            {
              questionText: "",
              hint: "",
              correctAnswer: "",
              xp: 15,
            },
          ],
          xp: 20,
        },
      ],
    },
  ],
});

const AdminTaskManagement = () => {
  // Navigation View Modes: 'overall_form' | 'explorer' | 'quick_task' | 'json_importer'
  const [activeTab, setActiveTab] = useState("overall_form");

  // Explorer Data States
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);

  // Explorer Tier: 'courses' | 'chapters' | 'tasks'
  const [explorerTier, setExplorerTier] = useState("courses");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrackFilter, setSelectedTrackFilter] = useState("all");

  // Overall Master Form State (The core feature requested by user)
  const [masterForm, setMasterForm] = useState(createInitialCurriculumForm);
  const [isSubmittingMaster, setIsSubmittingMaster] = useState(false);

  // Quick Task Upload Form State
  const [quickTaskCourseId, setQuickTaskCourseId] = useState("");
  const [quickTaskChapterId, setQuickTaskChapterId] = useState("");
  const [quickTaskAvailableChapters, setQuickTaskAvailableChapters] = useState([]);
  const [quickTaskForm, setQuickTaskForm] = useState({
    taskNumber: "Task 1",
    title: "",
    overview: "",
    content: "",
    learningObjectives: [""],
    prerequisites: [""],
    questions: [
      {
        questionText: "",
        hint: "",
        correctAnswer: "",
        xp: 15,
      },
    ],
    xp: 20,
  });
  const [isSubmittingQuickTask, setIsSubmittingQuickTask] = useState(false);

  // JSON Importer State
  const [jsonInput, setJsonInput] = useState("");
  const [isSubmittingJson, setIsSubmittingJson] = useState(false);

  // Modals for Single Edit / Delete in Explorer
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [chapterModalOpen, setChapterModalOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: "",
    id: null,
    title: "",
  });

  // Fetch courses on mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/curriculum/courses");
      setCourses(res.data);
      if (res.data.length > 0) {
        if (!selectedCourse) setSelectedCourse(res.data[0]);
        if (!quickTaskCourseId) setQuickTaskCourseId(res.data[0]._id);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load curriculum courses");
    } finally {
      setLoading(false);
    }
  };

  // When selected course in explorer changes, fetch chapters
  useEffect(() => {
    if (selectedCourse?._id) {
      fetchChapters(selectedCourse._id);
    } else {
      setChapters([]);
      setSelectedChapter(null);
    }
  }, [selectedCourse]);

  const fetchChapters = async (courseId) => {
    try {
      const res = await api.get(`/curriculum/chapters?courseId=${courseId}`);
      setChapters(res.data);
      if (res.data.length > 0) {
        setSelectedChapter(res.data[0]);
      } else {
        setSelectedChapter(null);
        setTasks([]);
        setSelectedTask(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load chapters for course");
    }
  };

  // When selected chapter in explorer changes, fetch tasks
  useEffect(() => {
    if (selectedChapter?._id) {
      fetchTasks(selectedChapter._id);
    } else {
      setTasks([]);
      setSelectedTask(null);
    }
  }, [selectedChapter]);

  const fetchTasks = async (chapterId) => {
    try {
      const res = await api.get(`/curriculum/tasks?chapterId=${chapterId}`);
      setTasks(res.data);
      if (res.data.length > 0) {
        setSelectedTask(res.data[0]);
      } else {
        setSelectedTask(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load tasks for chapter");
    }
  };

  // When quick task course changes, load its chapters
  useEffect(() => {
    if (quickTaskCourseId) {
      api.get(`/curriculum/chapters?courseId=${quickTaskCourseId}`).then((res) => {
        setQuickTaskAvailableChapters(res.data);
        if (res.data.length > 0) {
          setQuickTaskChapterId(res.data[0]._id);
        } else {
          setQuickTaskChapterId("");
        }
      });
    }
  }, [quickTaskCourseId]);

  // ==========================================
  // MASTER FORM HANDLERS (Overall Curriculum Upload)
  // ==========================================
  const handleCourseFieldChange = (field, value) => {
    setMasterForm((prev) => ({
      ...prev,
      course: {
        ...prev.course,
        [field]: value,
      },
    }));
  };

  // Add Chapter to Master Form
  const addChapterToMaster = () => {
    const nextRoomNum = `Room ${String(masterForm.chapters.length + 1).padStart(2, "0")}`;
    const newChapter = {
      roomNumber: nextRoomNum,
      title: "",
      description: "",
      level: "Easy",
      estimatedTime: "",
      xp: 100,
      icon: "Network",
      tasks: [
        {
          taskNumber: "Task 1",
          title: "",
          overview: "",
          content: "",
          learningObjectives: [""],
          prerequisites: [""],
          questions: [
            {
              questionText: "",
              hint: "",
              correctAnswer: "",
              xp: 15,
            },
          ],
          xp: 20,
        },
      ],
    };

    setMasterForm((prev) => ({
      ...prev,
      chapters: [...prev.chapters, newChapter],
    }));
  };

  const removeChapterFromMaster = (chIndex) => {
    if (masterForm.chapters.length <= 1) {
      toast.warn("Curriculum must have at least one chapter room");
      return;
    }
    const updated = masterForm.chapters.filter((_, i) => i !== chIndex);
    setMasterForm((prev) => ({ ...prev, chapters: updated }));
  };

  const handleChapterFieldChange = (chIndex, field, value) => {
    const updated = [...masterForm.chapters];
    updated[chIndex] = { ...updated[chIndex], [field]: value };
    setMasterForm((prev) => ({ ...prev, chapters: updated }));
  };

  // Add Task to a specific Chapter in Master Form
  const addTaskToChapterInMaster = (chIndex) => {
    const ch = masterForm.chapters[chIndex];
    const nextTaskNum = `Task ${ch.tasks.length + 1}`;
    const newTask = {
      taskNumber: nextTaskNum,
      title: "",
      overview: "",
      content: "",
      learningObjectives: [""],
      prerequisites: [""],
      questions: [
        {
          questionText: "",
          hint: "",
          correctAnswer: "",
          xp: 15,
        },
      ],
      xp: 20,
    };

    const updated = [...masterForm.chapters];
    updated[chIndex].tasks.push(newTask);
    setMasterForm((prev) => ({ ...prev, chapters: updated }));
  };

  const removeTaskFromChapterInMaster = (chIndex, tIndex) => {
    const ch = masterForm.chapters[chIndex];
    if (ch.tasks.length <= 1) {
      toast.warn("Chapter must have at least one task");
      return;
    }
    const updatedChapters = [...masterForm.chapters];
    updatedChapters[chIndex].tasks = updatedChapters[chIndex].tasks.filter((_, i) => i !== tIndex);
    setMasterForm((prev) => ({ ...prev, chapters: updatedChapters }));
  };

  const handleTaskFieldChange = (chIndex, tIndex, field, value) => {
    const updatedChapters = [...masterForm.chapters];
    updatedChapters[chIndex].tasks[tIndex][field] = value;
    setMasterForm((prev) => ({ ...prev, chapters: updatedChapters }));
  };

  // Dynamic Array Handlers for Task Objectives & Questions in Master Form
  const addObjectiveToTask = (chIndex, tIndex) => {
    const updated = [...masterForm.chapters];
    updated[chIndex].tasks[tIndex].learningObjectives.push("");
    setMasterForm((prev) => ({ ...prev, chapters: updated }));
  };

  const removeObjectiveFromTask = (chIndex, tIndex, oIndex) => {
    const updated = [...masterForm.chapters];
    updated[chIndex].tasks[tIndex].learningObjectives = updated[chIndex].tasks[
      tIndex
    ].learningObjectives.filter((_, i) => i !== oIndex);
    setMasterForm((prev) => ({ ...prev, chapters: updated }));
  };

  const updateObjectiveInTask = (chIndex, tIndex, oIndex, value) => {
    const updated = [...masterForm.chapters];
    updated[chIndex].tasks[tIndex].learningObjectives[oIndex] = value;
    setMasterForm((prev) => ({ ...prev, chapters: updated }));
  };

  const addQuestionToTask = (chIndex, tIndex) => {
    const updated = [...masterForm.chapters];
    updated[chIndex].tasks[tIndex].questions.push({
      questionText: "",
      hint: "",
      correctAnswer: "",
      xp: 15,
    });
    setMasterForm((prev) => ({ ...prev, chapters: updated }));
  };

  const removeQuestionFromTask = (chIndex, tIndex, qIndex) => {
    const updated = [...masterForm.chapters];
    updated[chIndex].tasks[tIndex].questions = updated[chIndex].tasks[tIndex].questions.filter(
      (_, i) => i !== qIndex
    );
    setMasterForm((prev) => ({ ...prev, chapters: updated }));
  };

  const updateQuestionInTask = (chIndex, tIndex, qIndex, field, value) => {
    const updated = [...masterForm.chapters];
    updated[chIndex].tasks[tIndex].questions[qIndex][field] = value;
    setMasterForm((prev) => ({ ...prev, chapters: updated }));
  };

  // Submit Master Overall Form
  const handleSubmitMasterForm = async (e) => {
    e.preventDefault();

    // Validate course
    if (!masterForm.course.title.trim()) {
      toast.error("Please provide a Course Title");
      return;
    }
    if (!masterForm.course.description.trim()) {
      toast.error("Please provide a Course Description");
      return;
    }

    // Validate chapters & tasks
    for (let i = 0; i < masterForm.chapters.length; i++) {
      const ch = masterForm.chapters[i];
      if (!ch.title.trim()) {
        toast.error(`Please provide a Title for Chapter ${ch.roomNumber || i + 1}`);
        return;
      }
      for (let j = 0; j < ch.tasks.length; j++) {
        const t = ch.tasks[j];
        if (!t.title.trim()) {
          toast.error(`Please provide a Title for Task ${j + 1} in ${ch.title}`);
          return;
        }
        if (!t.content.trim()) {
          toast.error(`Please enter Lesson Content for "${t.title}" in ${ch.title}`);
          return;
        }
      }
    }

    try {
      setIsSubmittingMaster(true);
      // Clean payload
      const cleanedChapters = masterForm.chapters.map((ch, idx) => ({
        ...ch,
        roomNumber: ch.roomNumber?.trim() || `Room ${String(idx + 1).padStart(2, "0")}`,
        tasks: ch.tasks.map((t, tIdx) => ({
          ...t,
          taskNumber: t.taskNumber?.trim() || `Task ${tIdx + 1}`,
          learningObjectives: t.learningObjectives.filter((obj) => obj.trim() !== ""),
          prerequisites: t.prerequisites.filter((pre) => pre.trim() !== ""),
          questions: t.questions.filter((q) => q.questionText.trim() !== ""),
        })),
      }));

      const payload = {
        course: masterForm.course,
        chapters: cleanedChapters,
      };

      const res = await api.post("/curriculum/bulk-upload", payload);
      toast.success(res.data.message || "Curriculum & tasks uploaded successfully! 🚀");

      // Reset form and reload explorer
      setMasterForm(createInitialCurriculumForm());
      const coursesRes = await api.get("/curriculum/courses");
      setCourses(coursesRes.data);

      const createdId = res.data.courseId || res.data.course?._id;
      const foundNewCourse = coursesRes.data.find((c) => c._id === createdId);
      if (foundNewCourse) {
        setSelectedCourse(foundNewCourse);
      } else if (coursesRes.data.length > 0) {
        setSelectedCourse(coursesRes.data[coursesRes.data.length - 1]);
      }

      setExplorerTier("courses");
      setActiveTab("explorer");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to upload curriculum");
    } finally {
      setIsSubmittingMaster(false);
    }
  };

  // ==========================================
  // QUICK INDIVIDUAL TASK UPLOADER
  // ==========================================
  const handleQuickTaskSubmit = async (e) => {
    e.preventDefault();
    if (!quickTaskCourseId || !quickTaskChapterId) {
      toast.error("Please select a Course and a Chapter Room");
      return;
    }
    if (!quickTaskForm.title.trim() || !quickTaskForm.content.trim()) {
      toast.error("Task Title and Content are required");
      return;
    }

    try {
      setIsSubmittingQuickTask(true);
      const payload = {
        courseId: quickTaskCourseId,
        chapterId: quickTaskChapterId,
        taskNumber: quickTaskForm.taskNumber,
        title: quickTaskForm.title,
        overview: quickTaskForm.overview,
        content: quickTaskForm.content,
        learningObjectives: quickTaskForm.learningObjectives.filter((o) => o.trim() !== ""),
        prerequisites: quickTaskForm.prerequisites.filter((p) => p.trim() !== ""),
        questions: quickTaskForm.questions.filter((q) => q.questionText.trim() !== ""),
        xp: quickTaskForm.xp,
      };

      await api.post("/curriculum/tasks", payload);
      toast.success("Task uploaded and published successfully! 🚀");

      // Reset form
      setQuickTaskForm({
        taskNumber: `Task ${parseInt(quickTaskForm.taskNumber.replace(/\D/g, "") || "1", 10) + 1}`,
        title: "",
        overview: "",
        content: "",
        learningObjectives: [""],
        prerequisites: [""],
        questions: [{ questionText: "", hint: "", correctAnswer: "", xp: 15 }],
        xp: 20,
      });

      await fetchCourses();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to upload task");
    } finally {
      setIsSubmittingQuickTask(false);
    }
  };

  // ==========================================
  // CLEAR ALL CURRICULUM DATA
  // ==========================================
  const handleClearAllData = async () => {
    if (
      !window.confirm(
        "⚠️ ARE YOU SURE? This will permanently delete ALL courses, chapter rooms, and tasks from the database so you can start 100% fresh."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await api.delete("/curriculum/clear-all");
      toast.info("All curriculum data cleared. Ready for your custom uploads!");
      setCourses([]);
      setSelectedCourse(null);
      setChapters([]);
      setSelectedChapter(null);
      setTasks([]);
      setSelectedTask(null);
      setActiveTab("overall_form");
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear data");
    } finally {
      setLoading(false);
    }
  };

  // Delete modal confirmation
  const triggerDelete = (type, id, title) => {
    setDeleteModal({ isOpen: true, type, id, title });
  };

  const confirmDelete = async () => {
    const { type, id } = deleteModal;
    try {
      if (type === "course") {
        await api.delete(`/curriculum/courses/${id}`);
        toast.success("Course deleted successfully");
        if (selectedCourse?._id === id) {
          setSelectedCourse(null);
          setSelectedChapter(null);
          setSelectedTask(null);
        }
        await fetchCourses();
      } else if (type === "chapter") {
        await api.delete(`/curriculum/chapters/${id}`);
        toast.success("Chapter deleted successfully");
        if (selectedCourse?._id) await fetchChapters(selectedCourse._id);
        if (selectedChapter?._id === id) {
          setSelectedChapter(null);
          setSelectedTask(null);
        }
      } else if (type === "task") {
        await api.delete(`/curriculum/tasks/${id}`);
        toast.success("Task deleted successfully");
        if (selectedChapter?._id) await fetchTasks(selectedChapter._id);
        if (selectedTask?._id === id) setSelectedTask(null);
      }
      setDeleteModal({ isOpen: false, type: "", id: null, title: "" });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || `Failed to delete ${type}`);
    }
  };

  const icons = ["Network", "Shield", "Server", "Share2", "Terminal", "Lock", "Users", "Cpu", "Database", "Layers"];
  const colors = ["blue", "cyan", "purple", "emerald", "amber", "rose"];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 pb-24 font-sans text-text-main">
      
      {/* =========================================================================
          PAGE HEADER SECTION
      ========================================================================== */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-white/10 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-cyan/10 border border-primary-cyan/30 text-primary-cyan">
              Live Curriculum Studio
            </span>
            <span className="text-xs text-text-muted">Dynamic Form Upload</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary-cyan via-blue-400 to-primary-blue">
            Upload Task & Curriculum Studio
          </h1>
          <p className="text-text-muted mt-1 text-sm font-medium">
            Upload course modules, chapter rooms, and interactive tasks directly without hardcoded data.
          </p>
        </div>

        {/* Global Toolbar Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleClearAllData}
            className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-critical/10 hover:bg-critical/20 text-critical border border-critical/30 flex items-center transition-all"
            title="Wipe database to upload completely fresh custom data"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Clear All Data
          </button>

          <Link
            to="/modules-page"
            target="_blank"
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-primary-blue hover:bg-blue-600 text-white shadow-md shadow-primary-blue/20 flex items-center transition-all"
          >
            <Eye className="w-4 h-4 mr-1.5" />
            View Student Pages
            <ExternalLink className="w-3.5 h-3.5 ml-1.5 opacity-80" />
          </Link>
        </div>
      </div>

      {/* =========================================================================
          PRIMARY WORKFLOW TABS
      ========================================================================== */}
      <div className="bg-surface rounded-2xl border border-white/10 p-2 sm:p-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab("overall_form")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center transition-all ${
              activeTab === "overall_form"
                ? "bg-primary-cyan text-[#07121D] shadow-lg shadow-primary-cyan/20 scale-[1.02]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <UploadCloud className="w-4 h-4 mr-2" />
            Overall Curriculum Upload Form
          </button>

          <button
            onClick={() => setActiveTab("quick_task")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center transition-all ${
              activeTab === "quick_task"
                ? "bg-primary-blue text-white shadow-lg shadow-primary-blue/20 scale-[1.02]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <CheckSquare className="w-4 h-4 mr-2" />
            Upload Individual Task
          </button>

          <button
            onClick={() => setActiveTab("explorer")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center transition-all ${
              activeTab === "explorer"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20 scale-[1.02]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Layers className="w-4 h-4 mr-2" />
            Curriculum Explorer & Editor ({courses.length})
          </button>
        </div>

        <div className="text-xs text-text-muted px-2 py-1 hidden lg:block">
          {courses.length} Courses • {courses.reduce((a, b) => a + (b.totalRooms || 0), 0)} Rooms •{" "}
          {courses.reduce((a, b) => a + (b.totalTasks || 0), 0)} Tasks Live
        </div>
      </div>

      {/* =========================================================================
          TAB 1: OVERALL CURRICULUM UPLOAD FORM (Unified Master Form requested by user)
      ========================================================================== */}
      {activeTab === "overall_form" && (
        <form onSubmit={handleSubmitMasterForm} className="space-y-8 animate-in fade-in duration-200">
          
          {/* Top Info Banner */}
          <div className="bg-[#0A1122] border border-primary-cyan/20 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
            <div className="space-y-1">
              <span className="text-xs font-bold text-primary-cyan uppercase tracking-wider">
                Full-Stack Curriculum Publisher
              </span>
              <h2 className="text-2xl font-black text-white">
                Master Curriculum & Tasks Upload Form
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Fill in the course details below, add one or more chapter rooms, and attach multiple tasks to each room. Everything is created and linked together in real-time.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                type="submit"
                disabled={isSubmittingMaster}
                className="bg-primary-cyan hover:bg-cyan-300 disabled:opacity-50 text-[#07121D] font-extrabold text-sm px-6 py-3 rounded-2xl shadow-xl shadow-primary-cyan/20 transition-all flex items-center"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmittingMaster ? "Uploading to Database..." : "Publish Full Curriculum"}
              </button>
            </div>
          </div>

          {/* SECTION A: COURSE SPECIFICATIONS */}
          <div className="bg-surface border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-primary-cyan/10 border border-primary-cyan/20 text-primary-cyan flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Course / Module Specifications</h3>
                  <p className="text-xs text-text-muted">Top-level curriculum module details (Image 1 level)</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Network Fundamentals 1 or Web Penetration Testing"
                  value={masterForm.course.title}
                  onChange={(e) => handleCourseFieldChange("title", e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-cyan"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Learning Track / Category *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Network Fundamentals, Defensive Security, Cloud Security"
                  value={masterForm.course.track}
                  onChange={(e) => handleCourseFieldChange("track", e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-cyan"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Course Description *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Master core networking concepts that power all cybersecurity. Learn TCP/IP, protocols, and basic network architecture..."
                value={masterForm.course.description}
                onChange={(e) => handleCourseFieldChange("description", e.target.value)}
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-cyan"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Difficulty Level
                </label>
                <select
                  value={masterForm.course.level}
                  onChange={(e) => handleCourseFieldChange("level", e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary-cyan [&>option]:bg-surface"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {icons.map((ic) => (
                    <button
                      type="button"
                      key={ic}
                      onClick={() => handleCourseFieldChange("icon", ic)}
                      className={`p-2 rounded-xl border flex items-center justify-center transition-all ${
                        masterForm.course.icon === ic
                          ? "bg-primary-cyan/20 border-primary-cyan text-primary-cyan"
                          : "bg-surface2/60 border-white/5 text-slate-400 hover:text-white"
                      }`}
                      title={ic}
                    >
                      {getIconComponent(ic, "w-4 h-4")}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Color Accent
                </label>
                <div className="flex items-center gap-2 pt-1">
                  {colors.map((clr) => (
                    <button
                      type="button"
                      key={clr}
                      onClick={() => handleCourseFieldChange("badgeColor", clr)}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        masterForm.course.badgeColor === clr ? "border-white scale-110" : "border-transparent"
                      } ${
                        clr === "blue"
                          ? "bg-blue-500"
                          : clr === "cyan"
                          ? "bg-cyan-400"
                          : clr === "purple"
                          ? "bg-purple-500"
                          : clr === "emerald"
                          ? "bg-emerald-500"
                          : clr === "amber"
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION B: CHAPTER ROOMS & TASKS BUILDER */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-primary-blue/10 border border-primary-blue/20 text-primary-blue flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Chapter Rooms & Tasks Hierarchy</h3>
                  <p className="text-xs text-text-muted">
                    Define the room progression (Image 2) and attach multiple interactive tasks to each room (Image 3)
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={addChapterToMaster}
                className="bg-primary-blue/20 hover:bg-primary-blue text-primary-cyan hover:text-white border border-primary-blue/40 px-4 py-2 rounded-xl text-xs font-bold flex items-center transition-all shadow-md"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Add Another Chapter Room
              </button>
            </div>

            {/* Render Each Chapter Room Card */}
            {masterForm.chapters.map((chapter, chIdx) => (
              <div
                key={chIdx}
                className="bg-surface border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative"
              >
                {/* Chapter Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 rounded-lg text-xs font-bold bg-primary-blue/20 text-primary-blue border border-primary-blue/30 uppercase tracking-wider">
                      {chapter.roomNumber || `Room ${chIdx + 1}`}
                    </span>
                    <h4 className="text-base font-extrabold text-white">
                      Chapter Room #{chIdx + 1}: {chapter.title || "Untitled Room"}
                    </h4>
                  </div>

                  {masterForm.chapters.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeChapterFromMaster(chIdx)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-critical hover:bg-critical/10 transition-colors"
                      title="Remove this chapter room"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Chapter Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Room Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Room 01"
                      value={chapter.roomNumber}
                      onChange={(e) => handleChapterFieldChange(chIdx, "roomNumber", e.target.value)}
                      className="w-full bg-background border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-medium focus:outline-none focus:border-primary-cyan"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Room Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Network Overview or Network Topologies"
                      value={chapter.title}
                      onChange={(e) => handleChapterFieldChange(chIdx, "title", e.target.value)}
                      className="w-full bg-background border border-white/10 rounded-xl px-4 py-2 text-white text-xs font-bold focus:outline-none focus:border-primary-cyan"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Room Overview / Description *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Begin your journey into networking by understanding the core concepts of connectivity..."
                    value={chapter.description}
                    onChange={(e) => handleChapterFieldChange(chIdx, "description", e.target.value)}
                    className="w-full bg-background border border-white/10 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-primary-cyan"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Difficulty Level
                    </label>
                    <select
                      value={chapter.level}
                      onChange={(e) => handleChapterFieldChange(chIdx, "level", e.target.value)}
                      className="w-full bg-background border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-medium focus:outline-none focus:border-primary-cyan [&>option]:bg-surface"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Estimated Duration
                    </label>
                    <input
                      type="text"
                      placeholder="45 minutes"
                      value={chapter.estimatedTime}
                      onChange={(e) => handleChapterFieldChange(chIdx, "estimatedTime", e.target.value)}
                      className="w-full bg-background border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-medium focus:outline-none focus:border-primary-cyan"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Room Completion XP
                    </label>
                    <input
                      type="number"
                      value={chapter.xp}
                      onChange={(e) => handleChapterFieldChange(chIdx, "xp", Number(e.target.value))}
                      className="w-full bg-background border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-medium focus:outline-none focus:border-primary-cyan"
                    />
                  </div>
                </div>

                {/* INNER NESTED SECTION: TASKS IN THIS ROOM */}
                <div className="pt-4 border-t border-white/10 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckSquare className="w-4 h-4 text-purple-400" />
                      <h5 className="text-sm font-black text-white">
                        Tasks in {chapter.roomNumber || `Room ${chIdx + 1}`} ({chapter.tasks.length})
                      </h5>
                    </div>

                    <button
                      type="button"
                      onClick={() => addTaskToChapterInMaster(chIdx)}
                      className="bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center transition-all"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Add Task to this Room
                    </button>
                  </div>

                  {/* Tasks Cards */}
                  <div className="space-y-4">
                    {chapter.tasks.map((task, tIdx) => (
                      <div
                        key={tIdx}
                        className="bg-[#060D1E] border border-white/10 rounded-2xl p-5 space-y-4 relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-primary-cyan">
                            Task #{tIdx + 1}
                          </span>

                          {chapter.tasks.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTaskFromChapterInMaster(chIdx, tIdx)}
                              className="text-xs text-slate-500 hover:text-critical"
                            >
                              Remove Task
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <div>
                            <input
                              type="text"
                              required
                              placeholder="Task 1"
                              value={task.taskNumber}
                              onChange={(e) =>
                                handleTaskFieldChange(chIdx, tIdx, "taskNumber", e.target.value)
                              }
                              className="w-full bg-[#0A1122] border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-primary-cyan"
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <input
                              type="text"
                              required
                              placeholder="Task Title: e.g. Task 1: Introduction or Network Devices Explained"
                              value={task.title}
                              onChange={(e) =>
                                handleTaskFieldChange(chIdx, tIdx, "title", e.target.value)
                              }
                              className="w-full bg-[#0A1122] border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-bold focus:outline-none focus:border-primary-cyan"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Lesson Content & Instructions (Markdown supported) *
                          </label>
                          <textarea
                            required
                            rows={4}
                            placeholder="Type the full explanatory lesson content here. Headings, paragraphs, code blocks, etc..."
                            value={task.content}
                            onChange={(e) =>
                              handleTaskFieldChange(chIdx, tIdx, "content", e.target.value)
                            }
                            className="w-full bg-[#0A1122] border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs font-mono leading-relaxed focus:outline-none focus:border-primary-cyan"
                          />
                        </div>

                        {/* Objectives bullets */}
                        <div className="p-3 bg-surface2/60 rounded-xl border border-white/5 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-primary-cyan flex items-center">
                              <CheckCircle className="w-3.5 h-3.5 mr-1" />
                              "What You'll Learn in This Room" Objectives
                            </span>
                            <button
                              type="button"
                              onClick={() => addObjectiveToTask(chIdx, tIdx)}
                              className="text-[11px] font-bold text-primary-cyan hover:underline"
                            >
                              + Add Bullet
                            </button>
                          </div>
                          {task.learningObjectives.map((obj, oIdx) => (
                            <div key={oIdx} className="flex items-center space-x-2">
                              <input
                                type="text"
                                placeholder="e.g. Understand what a network is and why we need them"
                                value={obj}
                                onChange={(e) =>
                                  updateObjectiveInTask(chIdx, tIdx, oIdx, e.target.value)
                                }
                                className="flex-1 bg-[#0A1122] border border-white/10 rounded-lg px-2.5 py-1 text-white text-xs focus:outline-none focus:border-primary-cyan"
                              />
                              {task.learningObjectives.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeObjectiveFromTask(chIdx, tIdx, oIdx)}
                                  className="text-slate-500 hover:text-critical p-1"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Challenge questions */}
                        <div className="p-3 bg-surface2/60 rounded-xl border border-white/5 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-primary-blue flex items-center">
                              <Terminal className="w-3.5 h-3.5 mr-1" />
                              Interactive Questions & Flag Submissions
                            </span>
                            <button
                              type="button"
                              onClick={() => addQuestionToTask(chIdx, tIdx)}
                              className="text-[11px] font-bold text-primary-blue hover:underline"
                            >
                              + Add Question
                            </button>
                          </div>

                          {task.questions.map((q, qIdx) => (
                            <div key={qIdx} className="p-2.5 bg-[#0A1122] rounded-lg border border-white/5 space-y-2">
                              <input
                                type="text"
                                placeholder="Question: e.g. What protocol operates on port 80?"
                                value={q.questionText}
                                onChange={(e) =>
                                  updateQuestionInTask(chIdx, tIdx, qIdx, "questionText", e.target.value)
                                }
                                className="w-full bg-background border border-white/10 rounded px-2.5 py-1 text-white text-xs focus:outline-none focus:border-primary-cyan"
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  placeholder="Hint (optional)"
                                  value={q.hint}
                                  onChange={(e) =>
                                    updateQuestionInTask(chIdx, tIdx, qIdx, "hint", e.target.value)
                                  }
                                  className="w-full bg-background border border-white/10 rounded px-2.5 py-1 text-white text-xs focus:outline-none focus:border-primary-cyan"
                                />
                                <input
                                  type="text"
                                  placeholder="Expected Answer / Flag"
                                  value={q.correctAnswer}
                                  onChange={(e) =>
                                    updateQuestionInTask(chIdx, tIdx, qIdx, "correctAnswer", e.target.value)
                                  }
                                  className="w-full bg-background border border-white/10 rounded px-2.5 py-1 text-primary-cyan font-mono font-bold text-xs focus:outline-none focus:border-primary-cyan"
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Bottom Submit Action Bar */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => setMasterForm(createInitialCurriculumForm())}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Reset Form
            </button>

            <button
              type="submit"
              disabled={isSubmittingMaster}
              className="bg-primary-cyan hover:bg-cyan-300 disabled:opacity-50 text-[#07121D] font-black text-sm px-8 py-3 rounded-2xl shadow-xl shadow-primary-cyan/20 transition-all flex items-center"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmittingMaster ? "Publishing Full Curriculum..." : "Publish Complete Curriculum"}
            </button>
          </div>
        </form>
      )}

      {/* =========================================================================
          TAB 2: UPLOAD INDIVIDUAL TASK FORM
      ========================================================================== */}
      {activeTab === "quick_task" && (
        <form onSubmit={handleQuickTaskSubmit} className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-[#0A1122] border border-primary-blue/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl max-w-4xl mx-auto">
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs font-bold text-primary-blue uppercase tracking-wider">
                Direct Task Uploader
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                Upload Task to an Existing Chapter Room
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Select your target course and chapter room, then input the task details, content, and interactive challenge questions.
              </p>
            </div>

            {/* Course & Chapter Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Select Course Module *
                </label>
                <select
                  required
                  value={quickTaskCourseId}
                  onChange={(e) => setQuickTaskCourseId(e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs font-semibold focus:outline-none focus:border-primary-cyan [&>option]:bg-surface"
                >
                  <option value="">Choose Course...</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title} ({c.track})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Select Chapter Room *
                </label>
                <select
                  required
                  value={quickTaskChapterId}
                  onChange={(e) => setQuickTaskChapterId(e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs font-semibold focus:outline-none focus:border-primary-cyan [&>option]:bg-surface"
                >
                  <option value="">Choose Chapter Room...</option>
                  {quickTaskAvailableChapters.map((ch) => (
                    <option key={ch._id} value={ch._id}>
                      {ch.roomNumber}: {ch.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Task Number and Title */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Task Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Task 1"
                  value={quickTaskForm.taskNumber}
                  onChange={(e) => setQuickTaskForm({ ...quickTaskForm, taskNumber: e.target.value })}
                  className="w-full bg-background border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-primary-cyan"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Task 1: Introduction or OSI Model Architecture"
                  value={quickTaskForm.title}
                  onChange={(e) => setQuickTaskForm({ ...quickTaskForm, title: e.target.value })}
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs font-bold focus:outline-none focus:border-primary-cyan"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Lesson Content & Instructions (Markdown supported) *
              </label>
              <textarea
                required
                rows={6}
                placeholder="Full lesson explanation, concepts, command line examples, or background notes..."
                value={quickTaskForm.content}
                onChange={(e) => setQuickTaskForm({ ...quickTaskForm, content: e.target.value })}
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-mono leading-relaxed focus:outline-none focus:border-primary-cyan"
              />
            </div>

            {/* Dynamic Objectives */}
            <div className="p-4 rounded-2xl bg-surface2/60 border border-white/5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-primary-cyan flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                  "What You'll Learn in This Room" Objectives
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuickTaskForm({
                      ...quickTaskForm,
                      learningObjectives: [...quickTaskForm.learningObjectives, ""],
                    })
                  }
                  className="text-primary-cyan hover:underline font-bold"
                >
                  + Add Objective
                </button>
              </div>

              {quickTaskForm.learningObjectives.map((obj, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="e.g. Understand what a network is and why we need them"
                    value={obj}
                    onChange={(e) => {
                      const updated = [...quickTaskForm.learningObjectives];
                      updated[i] = e.target.value;
                      setQuickTaskForm({ ...quickTaskForm, learningObjectives: updated });
                    }}
                    className="flex-1 bg-background border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-primary-cyan"
                  />
                  {quickTaskForm.learningObjectives.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = quickTaskForm.learningObjectives.filter((_, idx) => idx !== i);
                        setQuickTaskForm({ ...quickTaskForm, learningObjectives: updated });
                      }}
                      className="text-slate-500 hover:text-critical p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Dynamic Challenge Questions */}
            <div className="p-4 rounded-2xl bg-surface2/60 border border-white/5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-primary-blue flex items-center">
                  <Terminal className="w-3.5 h-3.5 mr-1.5" />
                  Interactive Questions & Flags
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuickTaskForm({
                      ...quickTaskForm,
                      questions: [
                        ...quickTaskForm.questions,
                        { questionText: "", hint: "", correctAnswer: "", xp: 15 },
                      ],
                    })
                  }
                  className="text-primary-blue hover:underline font-bold"
                >
                  + Add Question
                </button>
              </div>

              {quickTaskForm.questions.map((q, qIdx) => (
                <div key={qIdx} className="p-3 bg-background rounded-xl border border-white/10 space-y-2">
                  <input
                    type="text"
                    placeholder="Question prompt: e.g. What layer does IP operate at?"
                    value={q.questionText}
                    onChange={(e) => {
                      const updated = [...quickTaskForm.questions];
                      updated[qIdx].questionText = e.target.value;
                      setQuickTaskForm({ ...quickTaskForm, questions: updated });
                    }}
                    className="w-full bg-surface border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-primary-cyan"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Hint (optional)"
                      value={q.hint}
                      onChange={(e) => {
                        const updated = [...quickTaskForm.questions];
                        updated[qIdx].hint = e.target.value;
                        setQuickTaskForm({ ...quickTaskForm, questions: updated });
                      }}
                      className="w-full bg-surface border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-primary-cyan"
                    />
                    <input
                      type="text"
                      placeholder="Expected Answer"
                      value={q.correctAnswer}
                      onChange={(e) => {
                        const updated = [...quickTaskForm.questions];
                        updated[qIdx].correctAnswer = e.target.value;
                        setQuickTaskForm({ ...quickTaskForm, questions: updated });
                      }}
                      className="w-full bg-surface border border-white/10 rounded-lg px-3 py-1.5 text-primary-cyan font-mono font-bold text-xs focus:outline-none focus:border-primary-cyan"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
              <button
                type="submit"
                disabled={isSubmittingQuickTask}
                className="bg-primary-blue hover:bg-blue-600 disabled:opacity-50 text-white font-extrabold text-sm px-7 py-3 rounded-2xl shadow-xl shadow-primary-blue/20 transition-all flex items-center"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmittingQuickTask ? "Uploading Task..." : "Upload Task"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* =========================================================================
          TAB 3: CURRICULUM EXPLORER & EDITOR
      ========================================================================== */}
      {activeTab === "explorer" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Sub Navigation Bar for Explorer */}
          <div className="bg-surface rounded-2xl border border-white/10 p-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-xs">
              <button
                onClick={() => setExplorerTier("courses")}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center transition-all ${
                  explorerTier === "courses"
                    ? "bg-primary-cyan/20 text-primary-cyan border border-primary-cyan/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                1. Courses ({courses.length})
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <button
                onClick={() => {
                  if (selectedCourse) setExplorerTier("chapters");
                }}
                disabled={!selectedCourse}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center transition-all ${
                  explorerTier === "chapters"
                    ? "bg-primary-blue/20 text-primary-blue border border-primary-blue/30"
                    : "text-slate-400 hover:text-white disabled:opacity-40"
                }`}
              >
                2. Chapters {selectedCourse ? `(${selectedCourse.title})` : ""}
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <button
                onClick={() => {
                  if (selectedChapter) setExplorerTier("tasks");
                }}
                disabled={!selectedChapter}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center transition-all ${
                  explorerTier === "tasks"
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                    : "text-slate-400 hover:text-white disabled:opacity-40"
                }`}
              >
                3. Tasks Studio {selectedChapter ? `(${selectedChapter.roomNumber})` : ""}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("overall_form")}
                className="bg-primary-cyan hover:bg-cyan-300 text-[#07121D] font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center transition-all"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Upload Form
              </button>
            </div>
          </div>

          {/* Level 1: Courses Cards */}
          {explorerTier === "courses" && (
            <div className="space-y-6">
              {courses.length > 0 && (
                <div className="bg-surface border border-white/10 rounded-2xl p-3 flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search your uploaded courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                  {Array.from(new Set(courses.map((c) => c.track).filter(Boolean))).length > 0 && (
                    <select
                      value={selectedTrackFilter}
                      onChange={(e) => setSelectedTrackFilter(e.target.value)}
                      className="bg-background border border-white/10 text-xs text-slate-300 font-semibold rounded-xl px-3 py-2 focus:outline-none [&>option]:bg-surface w-full sm:w-auto"
                    >
                      <option value="all">All Tracks ({courses.length})</option>
                      {Array.from(new Set(courses.map((c) => c.track).filter(Boolean))).map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses
                  .filter((c) => {
                    const matchesSearch =
                      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      c.track?.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesTrack = selectedTrackFilter === "all" || c.track === selectedTrackFilter;
                    return matchesSearch && matchesTrack;
                  })
                  .map((c) => {
                    const theme = getColorTheme(c.badgeColor);
                    return (
                      <div
                        key={c._id}
                        className="bg-surface border border-white/10 hover:border-primary-cyan/40 rounded-2xl p-6 flex flex-col justify-between transition-all group"
                      >
                        <div>
                          <div className="flex items-start justify-between mb-4">
                            <div
                              className={`w-12 h-12 rounded-xl ${theme.bg} border ${theme.border} ${theme.text} flex items-center justify-center font-bold`}
                            >
                              {getIconComponent(c.icon, "w-6 h-6")}
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setEditingCourse(c);
                                  setCourseModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                                title="Edit Course"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => triggerDelete("course", c._id, c.title)}
                                className="p-1.5 rounded-lg bg-critical/10 hover:bg-critical/20 text-critical"
                                title="Delete Course"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <h3 className="text-lg font-bold text-white group-hover:text-primary-cyan transition-colors">
                            {c.title}
                          </h3>
                          <span className="text-[11px] text-slate-400 font-semibold block mb-3">
                            {c.track || "Module"}
                          </span>
                          <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 mb-6">
                            {c.description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                          <span className="text-xs text-text-muted">
                            {c.totalRooms || 0} rooms • {c.totalTasks || 0} tasks
                          </span>
                          <button
                            onClick={() => {
                              setSelectedCourse(c);
                              setExplorerTier("chapters");
                            }}
                            className="bg-primary-blue hover:bg-blue-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center"
                          >
                            Explore Rooms <ArrowRight className="w-3 h-3 ml-1" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                {courses.length === 0 && (
                  <div className="col-span-full py-16 text-center bg-surface border border-white/10 rounded-2xl p-8 space-y-3">
                    <h3 className="text-lg font-bold text-white">No courses uploaded yet</h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Only curriculum data submitted through the upload form will be listed here. No hardcoded or dummy courses are loaded.
                    </p>
                    <button
                      onClick={() => setActiveTab("overall_form")}
                      className="bg-primary-cyan text-[#07121D] font-bold text-xs px-4 py-2 rounded-xl mt-2"
                    >
                      Fill Curriculum Form
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Level 2: Chapters for Selected Course */}
          {explorerTier === "chapters" && selectedCourse && (
            <div className="space-y-6">
              <div className="bg-surface border border-white/10 rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <button
                    onClick={() => setExplorerTier("courses")}
                    className="text-xs text-slate-400 hover:text-white flex items-center mb-1"
                  >
                    <ArrowLeft className="w-3 h-3 mr-1" /> Back to Courses
                  </button>
                  <h3 className="text-2xl font-black text-white">{selectedCourse.title}</h3>
                  <p className="text-xs text-slate-400">{selectedCourse.description}</p>
                </div>

                <button
                  onClick={() => {
                    setEditingChapter(null);
                    setChapterModalOpen(true);
                  }}
                  className="bg-primary-blue text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Chapter Room
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chapters.map((ch) => (
                  <div
                    key={ch._id}
                    className="bg-surface border border-white/10 rounded-2xl p-6 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-primary-cyan uppercase">
                            {ch.roomNumber}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingChapter(ch);
                              setChapterModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => triggerDelete("chapter", ch._id, ch.title)}
                            className="p-1.5 rounded-lg bg-critical/10 text-critical hover:bg-critical/20"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-base font-extrabold text-white mb-2">{ch.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-3 mb-4">{ch.description}</p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs text-amber-400 font-bold">{ch.xp || 100} XP</span>
                      <button
                        onClick={() => {
                          setSelectedChapter(ch);
                          setExplorerTier("tasks");
                        }}
                        className="bg-primary-blue text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center"
                      >
                        Manage Tasks ({ch.totalTasks || 0})
                      </button>
                    </div>
                  </div>
                ))}

                {chapters.length === 0 && (
                  <div className="col-span-full text-center py-12 bg-surface border border-white/10 rounded-2xl p-6 space-y-2">
                    <h4 className="text-sm font-bold text-white">No chapter rooms in this course yet</h4>
                    <p className="text-xs text-slate-400">Add a chapter room or use the master upload form.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Level 3: Tasks Studio for Selected Room */}
          {explorerTier === "tasks" && selectedChapter && (
            <div className="space-y-6">
              <div className="bg-surface border border-white/10 rounded-2xl p-6 flex items-center justify-between">
                <div>
                  <button
                    onClick={() => setExplorerTier("chapters")}
                    className="text-xs text-slate-400 hover:text-white flex items-center mb-1"
                  >
                    <ArrowLeft className="w-3 h-3 mr-1" /> Back to Rooms
                  </button>
                  <h3 className="text-2xl font-black text-white">
                    {selectedChapter.roomNumber}: {selectedChapter.title} — Tasks
                  </h3>
                </div>

                <button
                  onClick={() => {
                    setEditingTask(null);
                    setTaskModalOpen(true);
                  }}
                  className="bg-primary-cyan text-[#07121D] font-bold text-xs px-4 py-2 rounded-xl flex items-center"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Task
                </button>
              </div>

              {/* Tasks List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks.map((t, idx) => (
                  <div
                    key={t._id}
                    className="bg-surface border border-white/10 rounded-2xl p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary-cyan">
                        {t.taskNumber || `Task ${idx + 1}`}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingTask(t);
                            setTaskModalOpen(true);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-white"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => triggerDelete("task", t._id, t.title)}
                          className="p-1 rounded text-critical hover:bg-critical/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-white">{t.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-3 font-mono">{t.content}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-text-muted">
                      <span>{t.questions?.length || 0} Questions</span>
                      <span className="text-amber-400 font-bold">+{t.xp || 20} XP</span>
                    </div>
                  </div>
                ))}

                {tasks.length === 0 && (
                  <div className="col-span-full text-center py-12 bg-surface border border-white/10 rounded-2xl p-6 space-y-2">
                    <h4 className="text-sm font-bold text-white">No tasks created in this room yet</h4>
                    <p className="text-xs text-slate-400">Click "Add Task" above to add interactive tasks.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          MODALS FOR SINGLE EDIT / DELETE
      ========================================================================== */}
      {courseModalOpen && (
        <CourseModal
          course={editingCourse}
          onClose={() => setCourseModalOpen(false)}
          onSuccess={async (saved) => {
            setCourseModalOpen(false);
            await fetchCourses();
          }}
        />
      )}

      {chapterModalOpen && (
        <ChapterModal
          chapter={editingChapter}
          courses={courses}
          defaultCourseId={selectedCourse?._id}
          onClose={() => setChapterModalOpen(false)}
          onSuccess={async (saved) => {
            setChapterModalOpen(false);
            if (selectedCourse?._id) await fetchChapters(selectedCourse._id);
          }}
        />
      )}

      {taskModalOpen && (
        <TaskModal
          task={editingTask}
          courses={courses}
          chapters={chapters}
          defaultCourseId={selectedCourse?._id}
          defaultChapterId={selectedChapter?._id}
          onClose={() => setTaskModalOpen(false)}
          onSuccess={async (saved) => {
            setTaskModalOpen(false);
            if (selectedChapter?._id) await fetchTasks(selectedChapter._id);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface border border-critical/30 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <div className="w-12 h-12 rounded-2xl bg-critical/10 border border-critical/30 flex items-center justify-center text-critical">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">
                Delete {deleteModal.type.toUpperCase()}?
              </h3>
              <p className="text-sm text-text-muted mt-2 leading-relaxed">
                Are you sure you want to delete <span className="text-white font-bold">"{deleteModal.title}"</span>?
                {deleteModal.type === "course" && (
                  <span className="block mt-1 text-critical font-medium">
                    ⚠️ This will permanently delete this course and all associated rooms and tasks.
                  </span>
                )}
                {deleteModal.type === "chapter" && (
                  <span className="block mt-1 text-critical font-medium">
                    ⚠️ This will delete this chapter room and all its tasks.
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setDeleteModal({ isOpen: false, type: "", id: null, title: "" })}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-critical hover:bg-red-600 text-white shadow-lg shadow-critical/20 transition-all"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// =========================================================================
// SUB-COMPONENT: COURSE MODAL (FOR SINGLE EDIT)
// =========================================================================
const CourseModal = ({ course, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: course?.title || "",
    track: course?.track || "Network Fundamentals",
    description: course?.description || "",
    icon: course?.icon || "Network",
    badgeColor: course?.badgeColor || "blue",
    level: course?.level || "Beginner",
    status: course?.status || "published",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      let res;
      if (course?._id) {
        res = await api.put(`/curriculum/courses/${course._id}`, formData);
      } else {
        res = await api.post("/curriculum/courses", formData);
      }
      toast.success("Course saved!");
      onSuccess(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save course");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-surface border border-white/10 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold text-white">{course ? "Edit Course" : "New Course"}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            required
            placeholder="Course Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs"
          />
          <input
            type="text"
            required
            placeholder="Track / Category"
            value={formData.track}
            onChange={(e) => setFormData({ ...formData, track: e.target.value })}
            className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs"
          />
          <textarea
            required
            rows={3}
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs"
          />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs text-slate-400">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary-cyan text-[#07121D] font-bold text-xs px-5 py-2.5 rounded-xl"
            >
              Save Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =========================================================================
// SUB-COMPONENT: CHAPTER MODAL (FOR SINGLE EDIT)
// =========================================================================
const ChapterModal = ({ chapter, courses, defaultCourseId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    courseId: chapter?.courseId?._id || chapter?.courseId || defaultCourseId || "",
    roomNumber: chapter?.roomNumber || "Room 01",
    title: chapter?.title || "",
    description: chapter?.description || "",
    level: chapter?.level || "Easy",
    estimatedTime: chapter?.estimatedTime || "45 minutes",
    xp: chapter?.xp || 100,
    icon: chapter?.icon || "Network",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      let res;
      if (chapter?._id) {
        res = await api.put(`/curriculum/chapters/${chapter._id}`, formData);
      } else {
        res = await api.post("/curriculum/chapters", formData);
      }
      toast.success("Chapter room saved!");
      onSuccess(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save chapter room");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-surface border border-white/10 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold text-white">{chapter ? "Edit Chapter" : "New Chapter Room"}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={formData.courseId}
            onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
            className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs [&>option]:bg-surface"
          >
            {courses.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              required
              placeholder="Room 01"
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              className="bg-background border border-white/10 rounded-xl px-3 py-2 text-white text-xs"
            />
            <input
              type="text"
              required
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-background border border-white/10 rounded-xl px-3 py-2 text-white text-xs"
            />
          </div>
          <textarea
            required
            rows={3}
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs"
          />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs text-slate-400">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary-blue text-white font-bold text-xs px-5 py-2.5 rounded-xl"
            >
              Save Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =========================================================================
// SUB-COMPONENT: TASK MODAL (FOR SINGLE EDIT)
// =========================================================================
const TaskModal = ({ task, courses, chapters, defaultCourseId, defaultChapterId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    courseId: task?.courseId?._id || task?.courseId || defaultCourseId || "",
    chapterId: task?.chapterId?._id || task?.chapterId || defaultChapterId || "",
    taskNumber: task?.taskNumber || "Task 1",
    title: task?.title || "",
    content: task?.content || "",
    xp: task?.xp || 20,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      let res;
      if (task?._id) {
        res = await api.put(`/curriculum/tasks/${task._id}`, formData);
      } else {
        res = await api.post("/curriculum/tasks", formData);
      }
      toast.success("Task saved!");
      onSuccess(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-surface border border-white/10 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold text-white">{task ? "Edit Task" : "New Task"}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              required
              placeholder="Task 1"
              value={formData.taskNumber}
              onChange={(e) => setFormData({ ...formData, taskNumber: e.target.value })}
              className="bg-background border border-white/10 rounded-xl px-3 py-2 text-white text-xs"
            />
            <input
              type="text"
              required
              placeholder="Task Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-background border border-white/10 rounded-xl px-3 py-2 text-white text-xs"
            />
          </div>
          <textarea
            required
            rows={6}
            placeholder="Content / Instructions"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full bg-background border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs font-mono"
          />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs text-slate-400">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary-cyan text-[#07121D] font-bold text-xs px-5 py-2.5 rounded-xl"
            >
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminTaskManagement;

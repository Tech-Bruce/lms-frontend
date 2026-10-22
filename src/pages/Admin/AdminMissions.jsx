import React, { useState, useEffect } from "react";
import {
  Crosshair,
  Plus,
  Search,
  Edit2,
  Trash2,
  RefreshCw,
  Clock,
  Zap,
  CheckCircle2,
  AlertCircle,
  X,
  FileCode,
  HelpCircle,
  Flag,
  Layers,
  Eye,
  Shield,
  Terminal,
} from "lucide-react";
import api from "../../api";
import { toast } from "react-toastify";

const AdminMissions = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMissionId, setCurrentMissionId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [modalTab, setModalTab] = useState("general"); // 'general', 'briefing', 'evidence', 'tasks'

  // Form State
  const initialFormState = {
    missionCode: "",
    title: "",
    category: "Endpoint Security",
    difficulty: "Intermediate",
    estimatedDuration: "45 min",
    xpReward: 150,
    status: "published",
    featured: false,
    shortDescription: "",
    incidentBriefing: "",
    mitreTechnique: "",
    evidenceArtifacts: [],
    tasks: [],
  };

  const [formData, setFormData] = useState(initialFormState);

  // Fetch all missions for admin
  const fetchMissions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/missions/admin/all");
      setMissions(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load missions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  // Open Create Modal
  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentMissionId(null);
    const count = missions.length + 1;
    setFormData({
      ...initialFormState,
      missionCode: `MIS-${String(count).padStart(3, "0")}`,
      evidenceArtifacts: [
        {
          name: "investigation_sample.log",
          artifactType: "Log",
          content: "Sample log event text...",
        },
      ],
      tasks: [
        {
          taskNumber: 1,
          question: "What is the primary indicator of compromise?",
          hint: "Check the timestamp and source IP.",
          answer: "192.168.1.50",
          xp: 50,
        },
      ],
    });
    setModalTab("general");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (mission) => {
    setIsEditing(true);
    setCurrentMissionId(mission._id);
    setFormData({
      missionCode: mission.missionCode || "",
      title: mission.title || "",
      category: mission.category || "Endpoint Security",
      difficulty: mission.difficulty || "Intermediate",
      estimatedDuration: mission.estimatedDuration || "45 min",
      xpReward: mission.xpReward || 100,
      status: mission.status || "published",
      featured: Boolean(mission.featured),
      shortDescription: mission.shortDescription || "",
      incidentBriefing: mission.incidentBriefing || "",
      mitreTechnique: mission.mitreTechnique || "",
      evidenceArtifacts: mission.evidenceArtifacts || [],
      tasks: mission.tasks || [],
    });
    setModalTab("general");
    setIsModalOpen(true);
  };

  // Save (Create or Update)
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter a mission title");
      return;
    }
    if (!formData.shortDescription.trim()) {
      toast.error("Please provide a short description");
      return;
    }

    try {
      setIsSaving(true);
      if (isEditing) {
        await api.put(`/missions/${currentMissionId}`, formData);
        toast.success("Mission scenario updated successfully!");
      } else {
        await api.post("/missions", formData);
        toast.success("New mission scenario published!");
      }
      setIsModalOpen(false);
      fetchMissions();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Failed to save mission.");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Mission
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.delete(`/missions/${id}`);
      toast.success("Mission deleted successfully");
      fetchMissions();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete mission");
    }
  };

  // Seed default scenarios
  const handleSeedDefaults = async () => {
    if (
      !window.confirm(
        "Reset and seed default realistic cyber investigation missions? This will reload the 6 standard scenarios."
      )
    )
      return;
    try {
      setLoading(true);
      await api.post("/missions/seed");
      toast.success("Default mission scenarios successfully seeded!");
      fetchMissions();
    } catch (err) {
      console.error(err);
      toast.error("Failed to seed default missions.");
      setLoading(false);
    }
  };

  // Evidence Artifact helpers
  const handleAddArtifact = () => {
    setFormData((prev) => ({
      ...prev,
      evidenceArtifacts: [
        ...prev.evidenceArtifacts,
        {
          name: `artifact_${prev.evidenceArtifacts.length + 1}.log`,
          artifactType: "Log",
          content: "",
        },
      ],
    }));
  };

  const handleUpdateArtifact = (index, field, value) => {
    const updated = [...formData.evidenceArtifacts];
    updated[index][field] = value;
    setFormData({ ...formData, evidenceArtifacts: updated });
  };

  const handleRemoveArtifact = (index) => {
    setFormData({
      ...formData,
      evidenceArtifacts: formData.evidenceArtifacts.filter((_, i) => i !== index),
    });
  };

  // Tasks helpers
  const handleAddTask = () => {
    const nextNum = formData.tasks.length + 1;
    setFormData((prev) => ({
      ...prev,
      tasks: [
        ...prev.tasks,
        {
          taskNumber: nextNum,
          question: "",
          hint: "",
          answer: "",
          xp: 50,
        },
      ],
    }));
  };

  const handleUpdateTask = (index, field, value) => {
    const updated = [...formData.tasks];
    updated[index][field] = value;
    setFormData({ ...formData, tasks: updated });
  };

  const handleRemoveTask = (index) => {
    const filtered = formData.tasks.filter((_, i) => i !== index);
    // Re-number tasks
    const renumbered = filtered.map((t, idx) => ({ ...t, taskNumber: idx + 1 }));
    setFormData({ ...formData, tasks: renumbered });
  };

  // Filtered Missions
  const filteredMissions = missions.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.missionCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty =
      selectedDifficulty === "All" || m.difficulty === selectedDifficulty;
    const matchesStatus =
      selectedStatus === "All" || m.status === selectedStatus;
    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  // Metrics
  const totalMissions = missions.length;
  const publishedCount = missions.filter((m) => m.status === "published").length;
  const draftCount = missions.filter((m) => m.status === "draft").length;
  const totalAvailableXp = missions.reduce((acc, curr) => acc + (curr.xpReward || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Crosshair className="w-8 h-8 text-cyan-400" />
            <span>Mission Management</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Author and manage live tactical cyber investigation scenarios and flag objectives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSeedDefaults}
            className="px-4 py-2.5 rounded-xl border border-slate-700 hover:border-cyan-500/50 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            <span>Seed Default Scenarios</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#030712] text-xs font-black transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Mission</span>
          </button>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#091022] border border-slate-800 p-5 rounded-2xl shadow-lg">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">
            Total Scenarios
          </span>
          <p className="text-3xl font-black text-white">{totalMissions}</p>
        </div>
        <div className="bg-[#091022] border border-slate-800 p-5 rounded-2xl shadow-lg">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">
            Published Active
          </span>
          <p className="text-3xl font-black text-emerald-400">{publishedCount}</p>
        </div>
        <div className="bg-[#091022] border border-slate-800 p-5 rounded-2xl shadow-lg">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">
            Drafts
          </span>
          <p className="text-3xl font-black text-amber-400">{draftCount}</p>
        </div>
        <div className="bg-[#091022] border border-slate-800 p-5 rounded-2xl shadow-lg">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">
            Total XP Available
          </span>
          <p className="text-3xl font-black text-cyan-400">{totalAvailableXp.toLocaleString()} XP</p>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-[#091022] border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by mission code, title, or vector..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#050914] border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 bg-[#050914] border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-[#050914] border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Missions Table */}
      <div className="bg-[#091022] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center text-slate-500">
            <RefreshCw className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-3" />
            <p className="text-xs">Loading operational scenarios...</p>
          </div>
        ) : filteredMissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#050914] border-b border-slate-800 text-slate-400 uppercase font-mono tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Code</th>
                  <th className="py-3.5 px-4">Mission Title</th>
                  <th className="py-3.5 px-4">Vector / Category</th>
                  <th className="py-3.5 px-4">Difficulty</th>
                  <th className="py-3.5 px-4">Duration</th>
                  <th className="py-3.5 px-4">XP Reward</th>
                  <th className="py-3.5 px-4">Objectives</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-medium">
                {filteredMissions.map((m) => (
                  <tr key={m._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-cyan-400">
                      {m.missionCode}
                    </td>
                    <td className="py-4 px-4 text-white font-bold">
                      {m.title}
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      {m.category}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          m.difficulty === "Beginner"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : m.difficulty === "Intermediate"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {m.difficulty}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      {m.estimatedDuration}
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-cyan-300">
                      {m.xpReward} XP
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      {m.tasks?.length || 0} Tasks
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          m.status === "published"
                            ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-cyan-500/20 hover:text-cyan-300 text-slate-300 transition-colors"
                          title="Edit Scenario"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(m._id, m.title)}
                          className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 transition-colors"
                          title="Delete Scenario"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-slate-500">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            <p className="text-sm">No missions found matching your filter criteria.</p>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MISSION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#091022] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl relative my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Crosshair className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {isEditing ? "Edit Mission Scenario" : "Create New Mission Scenario"}
                  </h3>
                  <p className="text-xs text-cyan-400 font-mono">
                    {formData.missionCode || "NEW-MISSION"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800/60 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs in Modal */}
            <div className="flex border-b border-slate-800 mt-4 gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setModalTab("general")}
                className={`px-4 py-2.5 rounded-t-xl transition-colors ${
                  modalTab === "general"
                    ? "bg-[#050914] text-cyan-400 border-t-2 border-cyan-400"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                1. General Metadata
              </button>
              <button
                type="button"
                onClick={() => setModalTab("briefing")}
                className={`px-4 py-2.5 rounded-t-xl transition-colors ${
                  modalTab === "briefing"
                    ? "bg-[#050914] text-cyan-400 border-t-2 border-cyan-400"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                2. Incident Briefing
              </button>
              <button
                type="button"
                onClick={() => setModalTab("evidence")}
                className={`px-4 py-2.5 rounded-t-xl transition-colors ${
                  modalTab === "evidence"
                    ? "bg-[#050914] text-cyan-400 border-t-2 border-cyan-400"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                3. Evidence Locker ({formData.evidenceArtifacts.length})
              </button>
              <button
                type="button"
                onClick={() => setModalTab("tasks")}
                className={`px-4 py-2.5 rounded-t-xl transition-colors ${
                  modalTab === "tasks"
                    ? "bg-[#050914] text-cyan-400 border-t-2 border-cyan-400"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                4. Flag Objectives ({formData.tasks.length})
              </button>
            </div>

            {/* Form Body with scrollable content */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-6 scrollbar-thin">
              {/* TAB 1: General Metadata */}
              {modalTab === "general" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Mission Code / ID *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.missionCode}
                        onChange={(e) => setFormData({ ...formData, missionCode: e.target.value })}
                        placeholder="e.g. MIS-001"
                        className="w-full px-3.5 py-2.5 bg-[#050914] border border-slate-800 rounded-xl text-white text-xs font-mono uppercase focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Mission Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Suspicious Sign-In Investigation"
                        className="w-full px-3.5 py-2.5 bg-[#050914] border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Category / Vector
                      </label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="e.g. Identity & Access"
                        className="w-full px-3.5 py-2.5 bg-[#050914] border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Difficulty Level
                      </label>
                      <select
                        value={formData.difficulty}
                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#050914] border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Estimated Duration
                      </label>
                      <input
                        type="text"
                        value={formData.estimatedDuration}
                        onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                        placeholder="e.g. 45 min"
                        className="w-full px-3.5 py-2.5 bg-[#050914] border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        XP Reward Points
                      </label>
                      <input
                        type="number"
                        min="10"
                        value={formData.xpReward}
                        onChange={(e) => setFormData({ ...formData, xpReward: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-[#050914] border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#050914] border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        MITRE ATT&CK Tag
                      </label>
                      <input
                        type="text"
                        value={formData.mitreTechnique}
                        onChange={(e) => setFormData({ ...formData, mitreTechnique: e.target.value })}
                        placeholder="e.g. T1078 - Valid Accounts"
                        className="w-full px-3.5 py-2.5 bg-[#050914] border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Short Description (Card Summary) *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      placeholder="Brief overview displayed on the catalog card..."
                      className="w-full px-3.5 py-2.5 bg-[#050914] border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* TAB 2: Incident Briefing */}
              {modalTab === "briefing" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Detailed Incident Briefing & Scenario Narrative (Markdown Supported)
                    </label>
                    <textarea
                      rows={12}
                      value={formData.incidentBriefing}
                      onChange={(e) => setFormData({ ...formData, incidentBriefing: e.target.value })}
                      placeholder="### Incident Summary&#10;At 03:14 UTC, a high-severity alert fired on host WS-04...&#10;&#10;### Your Objectives&#10;1. Determine root cause..."
                      className="w-full px-4 py-3 bg-[#050914] border border-slate-800 rounded-xl text-white text-xs font-mono leading-relaxed focus:outline-none focus:border-cyan-500"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* TAB 3: Evidence Locker (Artifacts) */}
              {modalTab === "evidence" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-slate-400">
                      Add telemetry logs, command history, sample emails, or network records for students to inspect.
                    </p>
                    <button
                      type="button"
                      onClick={handleAddArtifact}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold hover:bg-cyan-500/20 transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Artifact</span>
                    </button>
                  </div>

                  {formData.evidenceArtifacts.map((artifact, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#050914] border border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="grid grid-cols-2 gap-3 flex-1">
                          <input
                            type="text"
                            value={artifact.name}
                            onChange={(e) => handleUpdateArtifact(idx, "name", e.target.value)}
                            placeholder="Artifact Name (e.g. auth_audit.log)"
                            className="px-3 py-1.5 bg-[#091022] border border-slate-800 rounded-lg text-white text-xs font-mono"
                          />
                          <select
                            value={artifact.artifactType}
                            onChange={(e) => handleUpdateArtifact(idx, "artifactType", e.target.value)}
                            className="px-3 py-1.5 bg-[#091022] border border-slate-800 rounded-lg text-white text-xs"
                          >
                            <option value="Log">Log File</option>
                            <option value="Command">Command Line</option>
                            <option value="Hash">File Hash</option>
                            <option value="Network">Network PCAP / Flow</option>
                            <option value="Email">Email Header / EML</option>
                            <option value="Config">Configuration</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveArtifact(idx)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <textarea
                        rows={4}
                        value={artifact.content}
                        onChange={(e) => handleUpdateArtifact(idx, "content", e.target.value)}
                        placeholder="Paste raw log data, command strings, or telemetry payload here..."
                        className="w-full px-3 py-2 bg-[#091022] border border-slate-800 rounded-lg text-white text-xs font-mono leading-relaxed"
                      ></textarea>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: Investigation Tasks / Flags */}
              {modalTab === "tasks" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-slate-400">
                      Define the step-by-step investigation questions and expected answers (case-insensitive flag matching).
                    </p>
                    <button
                      type="button"
                      onClick={handleAddTask}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold hover:bg-cyan-500/20 transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Task</span>
                    </button>
                  </div>

                  {formData.tasks.map((task, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#050914] border border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-cyan-400">
                          TASK #{task.taskNumber}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <span>Points:</span>
                            <input
                              type="number"
                              value={task.xp}
                              onChange={(e) => handleUpdateTask(idx, "xp", Number(e.target.value))}
                              className="w-16 px-2 py-0.5 bg-[#091022] border border-slate-800 rounded text-cyan-400 font-mono text-center text-xs"
                            />
                            <span>XP</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveTask(idx)}
                            className="p-1 rounded text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Investigation Question *</label>
                        <input
                          type="text"
                          required
                          value={task.question}
                          onChange={(e) => handleUpdateTask(idx, "question", e.target.value)}
                          placeholder="e.g. What is the rogue IP address used by the attacker?"
                          className="w-full px-3 py-2 bg-[#091022] border border-slate-800 rounded-lg text-white text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-emerald-400 font-mono mb-1">
                            Expected Answer / Flag *
                          </label>
                          <input
                            type="text"
                            required
                            value={task.answer}
                            onChange={(e) => handleUpdateTask(idx, "answer", e.target.value)}
                            placeholder="e.g. 194.26.29.112"
                            className="w-full px-3 py-2 bg-[#091022] border border-emerald-500/30 rounded-lg text-emerald-300 font-mono text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">Helpful Hint (Optional)</label>
                          <input
                            type="text"
                            value={task.hint}
                            onChange={(e) => handleUpdateTask(idx, "hint", e.target.value)}
                            placeholder="e.g. Check the IP in the second log entry."
                            className="w-full px-3 py-2 bg-[#091022] border border-slate-800 rounded-lg text-slate-300 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <div className="text-xs text-slate-500">
                  {formData.tasks.length} tasks • {formData.evidenceArtifacts.length} artifacts
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-800 hover:bg-white/5 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#030712] text-xs font-black shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-2"
                  >
                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                    <span>{isEditing ? "Save Changes" : "Publish Scenario"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMissions;

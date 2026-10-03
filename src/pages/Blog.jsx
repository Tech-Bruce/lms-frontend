import React, { useEffect, useState } from "react";
import { 
  Calendar, 
  User, 
  ArrowRight, 
  X, 
  Search, 
  FileText, 
  Video, 
  Image, 
  BookOpen
} from "lucide-react";
import imgMidnight from "../assets/Midnight glass research network.png";

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [activePost, setActivePost] = useState(null); // For rich preview modal

  const API_URL = `${import.meta.env.VITE_API_URL}/blogs`;
  const BASE_URL = import.meta.env.VITE_API_UPLOAD_URL.replace('/uploads', ''); 

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setBlogPosts(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Filter posts
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || post.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 z-10 relative">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="flex flex-col rounded-3xl border border-white/[0.05] bg-white/[0.02] overflow-hidden animate-pulse"
        >
          <div className="w-full h-52 bg-white/[0.05]"></div>
          <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="h-4 bg-white/[0.05] rounded w-1/4"></div>
              <div className="h-6 bg-white/[0.05] rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-white/[0.05] rounded"></div>
                <div className="h-4 bg-white/[0.05] rounded w-5/6"></div>
              </div>
            </div>
            <div className="flex items-center space-x-3 pt-4 border-t border-white/[0.05]">
              <div className="h-10 w-10 rounded-full bg-white/[0.05]"></div>
              <div className="space-y-1.5 flex-grow">
                <div className="h-3 bg-white/[0.05] rounded w-20"></div>
                <div className="h-3 bg-white/[0.05] rounded w-12"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-16 relative overflow-hidden text-text-main">
      {/* Hero Section */}
      <div className="relative overflow-hidden h-screen flex items-center pt-28 md:pt-32 pb-16 border-b border-gray-900/80">
        <div className="absolute inset-0 z-0">
          <img 
            src={imgMidnight} 
            alt="Blog Background" 
            className="absolute inset-0 w-full h-full object-cover object-center" 
          />
          <div className="absolute inset-0 bg-gray-950/30"></div>
          {/* Glowing orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col text-left space-y-6 lg:space-y-8 lg:max-w-3xl mt-8 md:mt-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-cyan/20 bg-primary-cyan/[0.07] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-cyan w-max">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-cyan shadow-[0_0_12px_#25D9FF]" />
              Cyber Security Brigade
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Knowledge & <br className="hidden md:inline" />
              <span className="bg-gradient-to-r from-primary-cyan via-sky-400 to-primary-blue bg-clip-text text-transparent">Insights</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
              Explore professional guides, dynamic security reports, and training articles authored by our experts.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10 pt-16">

        {/* Filter Controls Panel */}
        <div className="bg-surface rounded-2xl border border-white/[0.09] p-4 sm:p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl backdrop-blur-md">
          {/* Search */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search publications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-background border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan transition-all duration-200 text-white placeholder-slate-500"
            />
          </div>

          {/* Chips Filter */}
          <div className="flex flex-wrap items-center gap-3 justify-center">
            {[
              { id: "all", label: "All Formats" },
              { id: "poster", label: "Posters", icon: Image },
              { id: "video", label: "Videos", icon: Video },
              { id: "document", label: "Documents", icon: FileText }
            ].map((type) => {
              const active = selectedType === type.id;
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border ${
                    active
                      ? "bg-primary-cyan/10 text-primary-cyan border-primary-cyan/30 shadow-[0_0_15px_rgba(37,217,255,0.1)]"
                      : "bg-white/5 text-slate-400 border-transparent hover:text-white hover:bg-white/10"
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content list */}
        {loading ? (
          <SkeletonLoader />
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-3xl border border-white/[0.09] shadow-sm space-y-4 backdrop-blur-md">
            <div className="inline-flex p-4 bg-primary-cyan/10 rounded-2xl border border-primary-cyan/20 text-primary-cyan mb-2">
              <BookOpen className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-semibold text-white">No matching publications</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto font-medium">
              We couldn't find any articles matching your filters. Try checking alternative search tags.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2">
            {filteredPosts.map((post) => {
              let TypeIcon = FileText;
              let badgeColor = "bg-primary-cyan/10 text-primary-cyan border-primary-cyan/20";
              if (post.type === "poster") {
                TypeIcon = Image;
                badgeColor = "bg-blue-400/10 text-blue-300 border-blue-400/20";
              }
              if (post.type === "video") {
                TypeIcon = Video;
                badgeColor = "bg-indigo-400/10 text-indigo-300 border-indigo-400/20";
              }

              return (
                <div
                  key={post._id}
                  className="flex flex-col bg-surface border border-white/[0.09] rounded-3xl overflow-hidden hover:border-primary-cyan/30 hover:bg-white/[0.035] hover:-translate-y-1.5 transition-all duration-300 group shadow-lg"
                >
                  {/* Media Content Area */}
                  {post.type === "poster" && post.fileUrl && (
                    <div className="relative overflow-hidden h-52 bg-[#050810]">
                      <img
                        src={`${BASE_URL}${post.fileUrl}`}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {post.type === "video" && post.fileUrl && (
                    <div className="relative h-52 bg-black flex items-center justify-center">
                      <video
                        controls
                        className="w-full h-full object-cover"
                        poster={`${BASE_URL}${post.thumbnailUrl || ''}`}
                      >
                        <source src={`${BASE_URL}${post.fileUrl}`} type="video/mp4" />
                        <source src={`${BASE_URL}${post.fileUrl}`} type="video/webm" />
                      </video>
                    </div>
                  )}

                  {post.type === "document" && post.fileUrl && (
                    <a
                      href={`${BASE_URL}${post.fileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full h-52 flex flex-col items-center justify-center bg-background border-b border-white/[0.05] text-primary-cyan font-semibold hover:bg-white/[0.03] transition-colors duration-200 space-y-3 group"
                    >
                      <div className="p-4 bg-primary-cyan/10 rounded-2xl text-primary-cyan group-hover:scale-110 transition-transform duration-200 border border-primary-cyan/20">
                        <FileText className="w-8 h-8" />
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Document Attachment</span>
                    </a>
                  )}

                  {/* Body details */}
                  <div className="flex-1 p-8 flex flex-col justify-between space-y-5">
                    <div className="space-y-4 flex-grow">
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-1 inline-flex items-center text-[10px] font-bold uppercase tracking-widest rounded border ${badgeColor}`}>
                          <TypeIcon className="w-3 h-3 mr-1.5" />
                          {post.type}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white line-clamp-2 leading-snug group-hover:text-primary-cyan transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-text-muted leading-relaxed font-medium line-clamp-3">
                        {post.description}
                      </p>
                    </div>

                    <div className="pt-5 border-t border-white/[0.07] flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-xl bg-primary-cyan/10 border border-primary-cyan/20 flex items-center justify-center text-primary-cyan font-bold text-sm">
                          {post.createdBy ? post.createdBy.charAt(0).toUpperCase() : "A"}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-200">
                            {post.createdBy || "Security Editor"}
                          </p>
                          <p className="text-[11px] text-slate-500 font-medium flex items-center mt-0.5">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      {post.content && (
                        <button
                          onClick={() => setActivePost(post)}
                          className="inline-flex items-center justify-center p-2.5 rounded-xl bg-white/5 hover:bg-primary-cyan hover:text-background border border-white/10 text-slate-300 transition-all duration-300"
                          title="Read Full Post"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Rich Preview Modal */}
      {activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/90 backdrop-blur-sm transition-opacity duration-200">
          <div className="bg-surface2 rounded-3xl border border-white/[0.09] shadow-[0_35px_100px_rgba(0,0,0,0.8)] max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden relative transition-transform duration-200">
            {/* Modal Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary-cyan/15 blur-[80px] pointer-events-none" />

            {/* Modal Header */}
            <div className="p-8 border-b border-white/10 flex justify-between items-start relative z-10">
              <div className="space-y-3 pr-8">
                <span className="px-2.5 py-1 inline-flex items-center text-[10px] font-bold uppercase tracking-wider rounded bg-primary-cyan/10 text-primary-cyan border border-primary-cyan/20">
                  {activePost.type}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {activePost.title}
                </h2>
                <div className="flex items-center space-x-4 text-xs text-slate-400 font-medium pt-2">
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1.5" />
                    {activePost.createdBy}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    {new Date(activePost.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => setActivePost(null)}
                className="p-2.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors flex-shrink-0 bg-white/5 border border-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Scrollable Area */}
            <div className="p-8 overflow-y-auto flex-grow prose prose-invert prose-slate max-w-none prose-sm sm:prose-base focus:outline-none relative z-10 scrollbar-thin scrollbar-thumb-white/10">
              {activePost.description && (
                <div className="italic text-slate-400 border-l-4 border-cyan-500/50 pl-4 mb-8 text-lg">
                  {activePost.description}
                </div>
              )}
              {/* Rich-Text content compiled from editor */}
              <div 
                dangerouslySetInnerHTML={{ __html: activePost.content }}
                className="tiptap-content-renderer"
              />
            </div>

            {/* Inline stylesheet mimicking the Tiptap output structure for Dark Mode */}
            <style>{`
              .tiptap-content-renderer h1 { font-size: 1.8em; font-weight: 800; margin: 1em 0 0.5em; line-height: 1.25; color: #ffffff; }
              .tiptap-content-renderer h2 { font-size: 1.4em; font-weight: 700; margin: 1em 0 0.5em; line-height: 1.3; color: #f8fafc; }
              .tiptap-content-renderer h3 { font-size: 1.2em; font-weight: 600; margin: 1em 0 0.5em; line-height: 1.4; color: #e2e8f0; }
              .tiptap-content-renderer p { margin: 0.8em 0; line-height: 1.7; color: #cbd5e1; }
              .tiptap-content-renderer ul { list-style-type: disc; padding-left: 1.5em; margin: 0.8em 0; color: #cbd5e1; }
              .tiptap-content-renderer ol { list-style-type: decimal; padding-left: 1.5em; margin: 0.8em 0; color: #cbd5e1; }
              .tiptap-content-renderer li { margin: 0.3em 0; color: #cbd5e1; }
              .tiptap-content-renderer blockquote { border-left: 4px solid #334155; margin: 1em 0; padding-left: 1.2em; color: #94a3b8; font-style: italic; background: rgba(255,255,255,0.02); padding-top: 0.5em; padding-bottom: 0.5em; border-radius: 0 8px 8px 0; }
              .tiptap-content-renderer pre { background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 1.2em; margin: 1em 0; overflow-x: auto; font-family: monospace; font-size: 0.9em; color: #38bdf8; }
              .tiptap-content-renderer img { max-width: 100%; height: auto; border-radius: 12px; margin: 1.5em 0; border: 1px solid rgba(255,255,255,0.1); }
              .tiptap-content-renderer a { color: #22d3ee; text-decoration: underline; text-underline-offset: 2px; }
              .tiptap-content-renderer a:hover { color: #67e8f9; }
            `}</style>
          </div>
        </div>
      )}

    </div>
  );
};

export default Blog;
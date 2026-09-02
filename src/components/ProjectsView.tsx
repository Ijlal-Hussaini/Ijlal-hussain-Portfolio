import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Filter,
  Github,
  ExternalLink,
  X,
  ListTodo,
  ShieldAlert,
  Cpu,
  Search,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Project, ProjectImage, projectsData } from "../data";

export default function ProjectsView() {
  const [activeFilter, setActiveFilter] = useState<"All" | "AI/ML" | "Web" | "Mobile">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  // Lock body scroll when modal or lightbox is active
  useEffect(() => {
    if (selectedProject || activeImageIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProject, activeImageIndex]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeImageIndex === null || !selectedProject) return;

      if (e.key === "ArrowLeft") {
        setActiveImageIndex((prev) =>
          prev !== null ? (prev > 0 ? prev - 1 : selectedProject.images.length - 1) : 0
        );
      } else if (e.key === "ArrowRight") {
        setActiveImageIndex((prev) =>
          prev !== null ? (prev < selectedProject.images.length - 1 ? prev + 1 : 0) : 0
        );
      } else if (e.key === "Escape") {
        setActiveImageIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageIndex, selectedProject]);

  const filterCategories: ("All" | "AI/ML" | "Web" | "Mobile")[] = ["All", "AI/ML", "Web", "Mobile"];

  const filteredProjects = projectsData.filter((p) => {
    const matchesCategory = activeFilter === "All" || p.category === activeFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.tech.some((t) => t.toLowerCase().includes(query)) ||
      p.features.some((f) => f.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "AI/ML":
        return <Cpu className="w-4 h-4 text-cyan-bright" />;
      case "Mobile":
        return <ShieldAlert className="w-4 h-4 text-green-accent" />;
      default:
        return <ListTodo className="w-4 h-4 text-purple-bright" />;
    }
  };

  return (
    <div id="projects-view-container" className="space-y-12 pb-12">
      {/* HEADER SECTION */}
      <section id="projects-header" className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="text-left space-y-2">
          <span className="font-mono text-xs text-cyan-bright uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Engineering Projects &amp; Software Craftsmanship
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-main">
            Project Showcase &amp; Mobile UI Gallery
          </h1>
          <p className="font-sans text-xs sm:text-sm text-text-muted max-w-xl">
            Explore complete architectural writeups, native Android applications, AI agent graphs, and sequential UI screenshot galleries. Click any card to inspect full details.
          </p>
        </div>

        {/* Controls: Search and Categories filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          {/* Live Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tech, title, feature..."
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-text-main placeholder:text-text-muted focus:outline-none focus:border-cyan-bright/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Categories filters */}
          <div className="flex flex-wrap gap-1.5 self-start sm:self-auto border-b border-white/5 pb-2 sm:pb-0">
            {filterCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-3.5 py-2.5 rounded-xl font-sans text-xs font-semibold tracking-wide cursor-pointer transition-all ${
                  activeFilter === cat
                    ? "bg-gradient-to-r from-cyan-bright to-purple-bright text-slate-950 shadow-md shadow-purple-glow/10 font-bold"
                    : "bg-white/5 text-text-sub hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS GRID */}
      {filteredProjects.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center space-y-4 max-w-md mx-auto my-8 border border-white/10">
          <Search className="w-8 h-8 text-text-muted mx-auto" />
          <div className="space-y-1">
            <h3 className="font-display font-semibold text-text-main text-base">No matching projects found</h3>
            <p className="font-sans text-xs text-text-muted">
              Try adjusting your search terms or filter selection.
            </p>
          </div>
          <button
            onClick={() => {
              setActiveFilter("All");
              setSearchQuery("");
            }}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-text-main font-sans font-semibold text-xs transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <section id="projects-grid" className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="group cursor-pointer bg-card border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-glow/40 transition-all duration-300 flex flex-col justify-between shadow-xl relative"
              >
                {/* Ambient glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-glow/5 to-purple-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* COVER IMAGE THUMBNAIL PLACEHOLDER */}
                <div className="relative w-full h-52 sm:h-60 bg-slate-900/80 overflow-hidden border-b border-white/10">
                  <img
                    src={project.coverImage || `/assets/projects/${project.id}/cover.png`}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Inline SVG fallback for project cover
                      const svg = `<svg width="800" height="450" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#090D16"/><rect x="20" y="20" width="760" height="410" rx="16" fill="#131B2E" stroke="#38BDF8" stroke-width="2"/><text x="400" y="235" text-anchor="middle" fill="#38BDF8" font-size="24" font-family="sans-serif" font-weight="bold">${project.title}</text></svg>`;
                      (e.target as HTMLImageElement).src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Top Overlay Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10">
                      {getCategoryIcon(project.category)}
                      <span className="font-mono text-[10px] text-white font-bold uppercase tracking-wider">
                        {project.category}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-bright/90 text-slate-950 text-[10px] font-mono font-bold shadow-lg">
                      <Layers className="w-3 h-3" />
                      <span>{project.images.length} UI Screens (1-{project.images.length})</span>
                    </div>
                  </div>

                  {/* Bottom Hover Action Banner */}
                  <div className="absolute bottom-3 right-3 flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-950/90 text-cyan-bright text-xs font-sans font-semibold border border-cyan-bright/30 backdrop-blur-md group-hover:bg-cyan-bright group-hover:text-slate-950 transition-all shadow-lg">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>View Full Details &amp; Screenshots</span>
                  </div>
                </div>

                {/* CARD BODY CONTENT */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between text-left">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-display font-bold text-xl text-text-main group-hover:text-cyan-bright transition-colors">
                        {project.title}
                      </h3>
                    </div>

                    <p className="font-sans text-xs text-text-muted leading-relaxed line-clamp-3 text-justify">
                      {project.description}
                    </p>
                  </div>

                  {/* TECH STACK & FOOTER BUTTONS */}
                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-md bg-white/5 text-[10px] font-mono text-text-sub border border-white/5"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between gap-2 pt-2">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-main hover:text-cyan-bright font-sans font-semibold text-[11px] border border-white/10 transition-all cursor-pointer"
                        title="View Source Code on GitHub"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>View on GitHub</span>
                      </a>

                      {project.demo ? (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-bright/10 hover:bg-cyan-bright text-cyan-bright hover:text-slate-950 font-sans font-semibold text-[11px] border border-cyan-bright/30 shadow-sm transition-all hover:shadow-cyan-glow/20 cursor-pointer"
                          title="Open Live Website in New Tab"
                        >
                          <span>Live Project</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedProject(project)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-text-muted hover:text-cyan-bright font-sans font-medium text-[11px] transition-colors cursor-pointer"
                          title="Inspect Project Screenshots & Write-up"
                        >
                          <span>Screenshots</span>
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </section>
      )}

      {/* PROJECT FULL DETAILS & SEQUENTIAL GALLERY MODAL */}
      {createPortal(
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md"
              style={{ zIndex: 99999 }}
              onClick={() => setSelectedProject(null)}
              role="dialog"
              aria-modal="true"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                className="w-full max-w-4xl max-h-[90vh] bg-card rounded-3xl p-6 sm:p-8 space-y-8 overflow-y-auto border border-white/10 shadow-2xl relative text-left"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Trigger */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/5 text-text-sub hover:text-text-main hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* MODAL HEADER */}
                <div className="space-y-3 pr-8">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-glow/10 text-cyan-bright text-xs font-mono font-bold uppercase tracking-wider">
                    {getCategoryIcon(selectedProject.category)}
                    <span>{selectedProject.category} Project</span>
                  </div>
                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-text-main">
                    {selectedProject.title}
                  </h2>
                  <p className="font-sans text-xs sm:text-sm text-text-sub leading-relaxed border-l-2 border-cyan-bright pl-4 py-1 bg-white/[0.02] text-justify">
                    {selectedProject.description}
                  </p>
                </div>

                {/* SEQUENTIAL IMAGE GALLERY SECTION (1, 2, 3...) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-bold text-base text-text-main flex items-center gap-2">
                        <Layers className="w-4 h-4 text-cyan-bright" />
                        Project UI Screenshots Sequence (1 to {selectedProject.images.length})
                      </h3>
                      <p className="font-sans text-xs text-text-muted">
                        Click any screenshot below to open full interactive lightbox mode.
                      </p>
                    </div>

                    <span className="text-xs font-mono text-cyan-bright bg-cyan-bright/10 px-2.5 py-1 rounded-full border border-cyan-bright/20">
                      {selectedProject.images.length} Total Screens
                    </span>
                  </div>

                  {/* Screenshots Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {selectedProject.images.map((img, idx) => (
                      <div
                        key={img.seq}
                        onClick={() => setActiveImageIndex(idx)}
                        className="group relative cursor-pointer bg-slate-900 rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-bright transition-all duration-300 shadow-md flex flex-col justify-between"
                      >
                        {/* Sequence Number Badge */}
                        <div className="absolute top-2 left-2 z-10 px-2.5 py-0.5 rounded-full bg-slate-950/90 text-cyan-bright font-mono text-[11px] font-bold border border-cyan-bright/30 backdrop-blur-md">
                          #{img.seq}
                        </div>

                        {/* Image Thumbnail */}
                        <div className={`relative w-full ${selectedProject.category === 'Mobile' ? 'aspect-[9/16]' : 'aspect-[16/10]'} bg-slate-950 overflow-hidden`}>
                          <img
                            src={img.url}
                            alt={img.title}
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const isMobile = selectedProject.category === 'Mobile';
                              const width = isMobile ? 450 : 800;
                              const height = isMobile ? 800 : 450;
                              const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#090D16"/><rect x="20" y="20" width="${width - 40}" height="${height - 40}" rx="16" fill="#131B2E" stroke="#38BDF8" stroke-width="2"/><text x="${width / 2}" y="${height / 2}" text-anchor="middle" fill="#38BDF8" font-size="20" font-family="sans-serif" font-weight="bold">${img.title}</text></svg>`;
                              (e.target as HTMLImageElement).src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
                            }}
                          />
                          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Maximize2 className="w-6 h-6 text-white drop-shadow-md" />
                          </div>
                        </div>

                        {/* Caption snippet */}
                        <div className="p-2.5 bg-slate-950/90 text-left border-t border-white/5">
                          <div className="font-sans text-[11px] font-bold text-text-main truncate">
                            {img.title}
                          </div>
                          <div className="font-sans text-[10px] text-text-muted line-clamp-1">
                            {img.caption}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FEATURE SPECIFICATIONS */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h3 className="font-display font-bold text-sm text-text-main uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-bright" />
                    Key Architectural &amp; Functional Highlights
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedProject.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start space-x-2 text-xs font-sans text-text-sub bg-white/5 p-3 rounded-xl border border-white/5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-bright mt-1.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* TECH STACK & LINKS */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h3 className="font-display font-bold text-xs text-text-main uppercase tracking-wider">
                    Technologies &amp; Libraries Implemented:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-lg bg-white/5 text-xs font-mono text-purple-bright border border-white/10 font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4">
                    {selectedProject.demo && (
                      <a
                        href={selectedProject.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-bright to-purple-bright text-slate-950 font-sans font-bold text-xs uppercase tracking-wider btn-glow-cyan shadow-md shadow-cyan-glow/10 transition-all hover:opacity-95"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Launch Live Website</span>
                      </a>
                    )}
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-text-main font-sans font-semibold text-xs transition-colors border border-white/10"
                    >
                      <Github className="w-4 h-4" />
                      <span>View GitHub Repository</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* LIGHTBOX FULLSCREEN IMAGE CAROUSEL MODAL (Sequences 1, 2, 3...) */}
      {createPortal(
        <AnimatePresence>
          {activeImageIndex !== null && selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6"
              style={{ zIndex: 100000 }}
              onClick={() => setActiveImageIndex(null)}
            >
              {/* Lightbox Header */}
              <div
                className="flex items-center justify-between text-white z-10 pb-4 border-b border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 rounded-full bg-cyan-bright text-slate-950 font-mono text-xs font-bold">
                    Sequence #{selectedProject.images[activeImageIndex].seq}
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-sm sm:text-base text-white">
                      {selectedProject.images[activeImageIndex].title}
                    </h3>
                    <p className="font-mono text-xs text-text-muted">
                      {selectedProject.title} • Image {activeImageIndex + 1} of {selectedProject.images.length}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveImageIndex(null)}
                  className="p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
                  title="Close Lightbox (Esc)"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Main Image View with Carousel Controls */}
              <div
                className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Prev Button */}
                <button
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      prev !== null ? (prev > 0 ? prev - 1 : selectedProject.images.length - 1) : 0
                    )
                  }
                  className="absolute left-2 sm:left-6 z-20 p-3 rounded-full bg-slate-950/80 text-white border border-white/20 hover:bg-cyan-bright hover:text-slate-950 transition-all shadow-xl cursor-pointer"
                  title="Previous Image (Left Arrow)"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Active Screenshot Display */}
                <motion.div
                  key={activeImageIndex}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="max-w-full max-h-full flex items-center justify-center p-2"
                >
                  <img
                    src={selectedProject.images[activeImageIndex].url}
                    alt={selectedProject.images[activeImageIndex].title}
                    referrerPolicy="no-referrer"
                    className="max-h-[72vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl border border-white/10"
                    onError={(e) => {
                      const imgObj = selectedProject.images[activeImageIndex];
                      const svg = `<svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#090D16"/><rect x="30" y="30" width="1220" height="660" rx="20" fill="#131B2E" stroke="#38BDF8" stroke-width="3"/><text x="640" y="360" text-anchor="middle" fill="#38BDF8" font-size="32" font-family="sans-serif" font-weight="bold">${imgObj.title}</text></svg>`;
                      (e.target as HTMLImageElement).src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
                    }}
                  />
                </motion.div>

                {/* Next Button */}
                <button
                  onClick={() =>
                    setActiveImageIndex((prev) =>
                      prev !== null ? (prev < selectedProject.images.length - 1 ? prev + 1 : 0) : 0
                    )
                  }
                  className="absolute right-2 sm:right-6 z-20 p-3 rounded-full bg-slate-950/80 text-white border border-white/20 hover:bg-cyan-bright hover:text-slate-950 transition-all shadow-xl cursor-pointer"
                  title="Next Image (Right Arrow)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Lightbox Footer: Sequence Jump Buttons & Caption */}
              <div
                className="space-y-3 max-w-3xl mx-auto w-full text-center z-10 pt-3 border-t border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="font-sans text-xs sm:text-sm text-text-sub max-w-xl mx-auto">
                  {selectedProject.images[activeImageIndex].caption}
                </p>

                {/* Numbered Sequence Buttons (1, 2, 3...) */}
                <div className="flex items-center justify-center flex-wrap gap-2">
                  {selectedProject.images.map((img, idx) => (
                    <button
                      key={img.seq}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-9 h-9 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? "bg-cyan-bright text-slate-950 scale-110 shadow-lg shadow-cyan-bright/20"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                      title={`Jump to image ${img.seq}: ${img.title}`}
                    >
                      {img.seq}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

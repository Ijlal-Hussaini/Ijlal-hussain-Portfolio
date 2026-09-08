import { useState, useEffect, memo, useRef } from "react";
import { ArrowRight, Code, Cpu, BrainCircuit, ExternalLink, Download, Github } from "lucide-react";
import { motion, useInView } from "motion/react";
import { personalInfo, projectsData } from "../data";

interface HomeViewProps {
  onNavigate: (tab: string) => void;
}

// 1. Isolated Typewriter Component to prevent re-rendering HomeView tree on every keyframe
const TypewriterHero = memo(function TypewriterHero({ roles }: { roles: string[] }) {
  const [currentText, setCurrentText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fullText = roles[roleIndex];

    if (!isDeleting) {
      if (currentText === fullText) {
        timer = setTimeout(() => setIsDeleting(true), 2200);
      } else {
        const typingDelay = 70 + Math.random() * 40;
        timer = setTimeout(() => {
          setCurrentText(fullText.substring(0, currentText.length + 1));
        }, typingDelay);
      }
    } else {
      if (currentText === "") {
        timer = setTimeout(() => {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }, 400);
      } else {
        timer = setTimeout(() => {
          setCurrentText(currentText.substring(0, currentText.length - 1));
        }, 35);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, roleIndex, roles]);

  return (
    <div className="h-8 flex items-center">
      <span className="font-mono text-sm sm:text-base md:text-lg text-cyan-bright font-medium">
        {currentText}
      </span>
      <span className="w-1.5 h-5 bg-purple-bright ml-1 animate-pulse" />
    </div>
  );
});

// 2. Animated Counter Component (Smoothly counts from 0 every time scrolled into view)
const StatCounter = memo(function StatCounter({
  target,
  decimals = 0,
  suffix = "",
}: {
  target: number;
  decimals?: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { amount: 0.3, margin: "0px 0px -40px 0px" });

  useEffect(() => {
    if (!isInView) {
      setCount(0);
      return;
    }

    let animationFrameId: number;
    const duration = decimals > 0 ? 1200 : 900;
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      if (decimals > 0) {
        // Smooth linear progression for decimals (0.00 -> 3.96)
        const currentVal = progress * target;
        setCount(currentVal);
      } else {
        // Clear integer steps from 0 up to target (0, 1, 2, 3, 4...)
        const currentVal = Math.floor(progress * (target + 0.99));
        setCount(Math.min(currentVal, target));
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCounter);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, target, decimals]);

  return (
    <span ref={ref}>
      {decimals > 0 ? count.toFixed(decimals) : count}
      {suffix}
    </span>
  );
});

export default function HomeView({ onNavigate }: HomeViewProps) {
  const [imageError, setImageError] = useState(false);

  // Filter top projects (first 2 for preview)
  const previewProjects = projectsData.slice(0, 2);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] as const },
    },
  };

  return (
    <div id="home-view-container" className="space-y-20 sm:space-y-24 pb-12">
      
      {/* SECTION 1: HERO CONTAINER */}
      <motion.section
        id="hero-section"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative pt-6 sm:pt-10 pb-6 flex flex-col lg:flex-row items-center justify-between gap-12"
      >
        {/* Ambient colored background lights (GPU optimized with radial gradient) */}
        <div 
          className="absolute top-10 left-10 w-[300px] h-[300px] rounded-full pointer-events-none" 
          style={{ background: "radial-gradient(circle, rgba(0, 212, 255, 0.12) 0%, transparent 70%)" }}
        />
        <div 
          className="absolute bottom-10 right-10 w-[300px] h-[300px] rounded-full pointer-events-none" 
          style={{ background: "radial-gradient(circle, rgba(155, 89, 245, 0.12) 0%, transparent 70%)" }}
        />

        {/* Text Area */}
        <div className="flex-1 space-y-6 text-left relative z-10">
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-green-accent animate-pulse-subtle" />
            <span className="font-mono text-[11px] text-text-sub tracking-wider uppercase">
              Ready for AI &amp; Full-Stack Innovation
            </span>
          </motion.div>

          <div className="space-y-3">
            <motion.h1 variants={itemVariants} className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-text-main leading-tight tracking-tight">
              Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-bright to-purple-bright">{personalInfo.name}</span>
            </motion.h1>
            
            {/* Isolated typewriter component */}
            <motion.div variants={itemVariants}>
              <TypewriterHero roles={personalInfo.titles} />
            </motion.div>
          </div>

          <motion.p variants={itemVariants} className="font-sans text-xs sm:text-sm text-text-sub leading-relaxed max-w-xl text-justify">
            {personalInfo.bio}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-2">
            <button
              id="hero-projects-cta"
              onClick={() => onNavigate("Projects")}
              className="group flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-bright to-purple-bright text-slate-950 font-sans font-bold text-sm btn-glow-cyan shadow-lg shadow-cyan-glow/15 cursor-pointer transition-all duration-300"
            >
              <span>Explore My Work</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              id="hero-contact-cta"
              onClick={() => onNavigate("Contact")}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-text-main font-sans font-semibold text-sm transition-all duration-300 cursor-pointer"
            >
              <span>Let's Connect</span>
            </button>
          </motion.div>
        </div>

        {/* Dynamic Holographic Portrait Mockup */}
        <motion.div variants={itemVariants} className="flex-1 flex justify-center relative z-10">
          <div className="relative w-72 h-72 sm:w-85 sm:h-85 aspect-square">
            {/* Rotating Outer Tech Circles */}
            <div className="absolute inset-0 rounded-full border border-dashed border-cyan-glow/20 animate-spin-slow pointer-events-none" />
            <div className="absolute -inset-4 rounded-full border border-dashed border-purple-glow/15 animate-reverse-spin pointer-events-none" style={{ animationDuration: '25s' }} />

            {/* Subtle premium ambient background glow */}
            <div 
              className="absolute inset-4 rounded-full pointer-events-none" 
              style={{ background: "radial-gradient(circle, rgba(0, 212, 255, 0.15) 0%, rgba(155, 89, 245, 0.12) 40%, transparent 70%)" }}
            />

            {/* Profile Avatar Container: Premium Minimalist Circular Frame */}
            <div className="absolute inset-4 rounded-full overflow-hidden bg-gradient-to-b from-white/10 to-white/5 border border-white/10 shadow-2xl p-1 group">
              <div className="relative w-full h-full rounded-full overflow-hidden bg-card flex flex-col items-center justify-center">
                {personalInfo.photoUrl && !imageError ? (
                  <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                    {/* Real Profile Image */}
                    <picture className="w-full h-full">
                      <source srcSet="/assets/images/profile_photo.webp" type="image/webp" />
                      <img
                        src={personalInfo.photoUrl || "/assets/images/profile_photo.png"}
                        alt={personalInfo.name}
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                        onError={() => setImageError(true)}
                        className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </picture>

                    {/* Scanner horizontal line animation */}
                    <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-bright to-transparent animate-scanner opacity-70 pointer-events-none" />

                    {/* Minimalist Premium Dark Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-60 pointer-events-none" />

                    {/* Clean Minimal Floating Tag */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-bg/85 backdrop-blur-md border border-white/10 z-10 text-center shadow-xl whitespace-nowrap pointer-events-none">
                      <span className="block font-display font-bold text-text-main text-[11px] sm:text-xs tracking-wider uppercase">
                        {personalInfo.name}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex flex-col items-center justify-center space-y-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-bright to-purple-bright p-[1.5px] shadow-lg shadow-purple-glow/20 animate-float">
                      <div className="w-full h-full bg-card rounded-full flex items-center justify-center overflow-hidden">
                        <span className="font-display font-extrabold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-bright to-purple-bright">
                          IH
                        </span>
                      </div>
                    </div>

                    <div className="text-center z-10 space-y-1">
                      <span className="block font-display font-semibold text-text-main text-sm">
                        {personalInfo.name}
                      </span>
                      <span className="block font-mono text-[10px] text-cyan-bright">
                        SYSTEMS ARCHITECT
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* SECTION 2: STATS SUMMARY GRID (Smooth Reveal on First Open & Every Return) */}
      <section
        id="stats-section"
        className="relative z-10"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* CGPA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.3, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.25, 1, 0.5, 1] }}
            className="glass rounded-2xl p-6 text-center space-y-2 relative overflow-hidden group hover:border-cyan-glow/30 hover:-translate-y-1.5 transition-all duration-300"
          >
            <div 
              className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none" 
              style={{ background: "radial-gradient(circle, rgba(0, 212, 255, 0.15) 0%, transparent 70%)" }}
            />
            <div className="inline-flex p-3 rounded-xl bg-cyan-glow/10 text-cyan-bright mb-1">
              <Code className="w-5 h-5" />
            </div>
            <span className="block font-display font-bold text-4xl text-text-main text-glow-cyan">
              <StatCounter target={3.96} decimals={2} />
            </span>
            <span className="block font-sans text-xs text-text-sub font-semibold">
              NUML University CGPA
            </span>
            <span className="block font-mono text-[10px] text-text-muted">
              First Class Honors (Academic Limit 4.0)
            </span>
          </motion.div>

          {/* PROJECTS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.3, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 1, 0.5, 1] }}
            className="glass rounded-2xl p-6 text-center space-y-2 relative overflow-hidden group hover:border-purple-glow/30 hover:-translate-y-1.5 transition-all duration-300"
          >
            <div 
              className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none" 
              style={{ background: "radial-gradient(circle, rgba(155, 89, 245, 0.15) 0%, transparent 70%)" }}
            />
            <div className="inline-flex p-3 rounded-xl bg-purple-glow/10 text-purple-bright mb-1">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <span className="block font-display font-bold text-4xl text-text-main text-glow-purple">
              <StatCounter target={4} suffix="+" />
            </span>
            <span className="block font-sans text-xs text-text-sub font-semibold">
              Engineered Applications
            </span>
            <span className="block font-mono text-[10px] text-text-muted">
              Autonomous AI, Mobile &amp; Web
            </span>
          </motion.div>

          {/* CERTIFICATIONS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.3, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.5, delay: 0.25, ease: [0.25, 1, 0.5, 1] }}
            className="glass rounded-2xl p-6 text-center space-y-2 relative overflow-hidden group hover:border-green-accent/30 hover:-translate-y-1.5 transition-all duration-300"
          >
            <div 
              className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none" 
              style={{ background: "radial-gradient(circle, rgba(0, 214, 143, 0.15) 0%, transparent 70%)" }}
            />
            <div className="inline-flex p-3 rounded-xl bg-green-accent/10 text-green-accent mb-1">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="block font-display font-bold text-4xl text-text-main" style={{ textShadow: "0 0 10px rgba(0, 214, 143, 0.4)" }}>
              <StatCounter target={6} />
            </span>
            <span className="block font-sans text-xs text-text-sub font-semibold">
              Verified Industry Certifications
            </span>
            <span className="block font-mono text-[10px] text-text-muted">
              DeepLearning.AI, Stanford, Google, Meta
            </span>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: CORE CAPABILITIES OVERVIEW (Staggered Scroll Entrance) */}
      <section
        id="capabilities-section"
        className="space-y-8 relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.25, margin: "0px 0px -40px 0px" }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2 max-w-xl mx-auto"
        >
          <span className="font-mono text-xs text-cyan-bright uppercase tracking-wider">
            Specialized Horizons
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-text-main">
            Leading Engineering Niches
          </h2>
          <p className="font-sans text-xs sm:text-sm text-text-muted leading-relaxed">
            Targeting the intersection of intelligence, fluid mobile native systems, and durable backends.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.25, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.25, 1, 0.5, 1] }}
            className="glass glass-hover rounded-2xl p-6 space-y-4 hover:-translate-y-1.5 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-glow/10 flex items-center justify-center text-cyan-bright">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="font-display font-semibold text-base text-text-main">
              Generative AI &amp; Agentic Systems
            </h3>
            <p className="font-sans text-xs text-text-sub leading-relaxed text-justify">
              Constructing autonomous AI workflows using <strong className="text-text-main font-semibold">LangChain</strong> and <strong className="text-text-main font-semibold">LangGraph</strong>, designing RAG pipelines, LLM fine-tuning schemas, and prompt orchestration templates.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.25, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.5, delay: 0.18, ease: [0.25, 1, 0.5, 1] }}
            className="glass glass-hover rounded-2xl p-6 space-y-4 hover:-translate-y-1.5 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-glow/10 flex items-center justify-center text-purple-bright">
              <Code className="w-6 h-6" />
            </div>
            <h3 className="font-display font-semibold text-base text-text-main">
              MERN Stack Architectures
            </h3>
            <p className="font-sans text-xs text-text-sub leading-relaxed text-justify">
              Writing scalable web backends with <strong className="text-text-main font-semibold">Node.js</strong> and <strong className="text-text-main font-semibold">Express.js</strong>, modeling flexible unstructured schemas in <strong className="text-text-main font-semibold">MongoDB</strong>, and developing smooth responsive React UI interfaces.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.25, margin: "0px 0px -40px 0px" }}
            transition={{ duration: 0.5, delay: 0.28, ease: [0.25, 1, 0.5, 1] }}
            className="glass glass-hover rounded-2xl p-6 space-y-4 hover:-translate-y-1.5 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-green-accent/10 flex items-center justify-center text-green-accent">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-display font-semibold text-base text-text-main">
              Native Android Development
            </h3>
            <p className="font-sans text-xs text-text-sub leading-relaxed text-justify">
              Developing highly integrated Android client apps in <strong className="text-text-main font-semibold">Java</strong> and <strong className="text-text-main font-semibold">Flutter</strong> utilizing modern UI principles, background service tracking, and offline persistence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: QUICK WORK SHOWCASE (Staggered Project Cards) */}
      <section
        id="showcase-section"
        className="space-y-8 relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.25, margin: "0px 0px -40px 0px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div className="text-left space-y-2">
            <span className="font-mono text-xs text-purple-bright uppercase tracking-wider">
              Selected Showcase
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-text-main">
              Autonomous Code Deployments
            </h2>
          </div>
          <button
            onClick={() => onNavigate("Projects")}
            className="inline-flex items-center space-x-2 text-xs font-mono font-semibold text-cyan-bright hover:text-cyan-bright/80 group cursor-pointer"
          >
            <span>See All Project Specifications</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {previewProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.25, margin: "0px 0px -40px 0px" }}
              transition={{ duration: 0.5, delay: idx * 0.15, ease: [0.25, 1, 0.5, 1] }}
              className="glass rounded-2xl p-6 flex flex-col justify-between space-y-6 hover:border-cyan-bright/30 hover:-translate-y-1.5 transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-white/5 text-purple-bright">
                    {project.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    {project.apkUrl || project.category === "Mobile" ? (
                      <a
                        href={project.apkUrl || project.demo}
                        download="SafeZone.apk"
                        className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                        title="Download Android APK"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    ) : project.demo ? (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-cyan-bright hover:bg-cyan-bright/10 transition-colors"
                        title="Open Live Website Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : null}
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-text-muted hover:text-cyan-bright hover:bg-white/5 transition-colors"
                      title="View Source on GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-display font-bold text-lg text-text-main group-hover:text-cyan-bright transition-colors">
                    {project.title}
                  </h3>
                  <p className="font-sans text-xs text-text-muted leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5">
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-mono text-text-sub"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 5: CRAFT QUOTE BANNER (Smooth Scale & Fade) */}
      <section
        id="quote-section"
        className="relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ amount: 0.25, margin: "0px 0px -40px 0px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="glass rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-6 relative overflow-hidden border border-white/10 shadow-xl bg-gradient-to-br from-bg2 to-bg3"
        >
          <div 
            className="absolute top-0 left-0 w-32 h-32 rounded-full pointer-events-none" 
            style={{ background: "radial-gradient(circle, rgba(0, 212, 255, 0.12) 0%, transparent 70%)" }}
          />
          <div 
            className="absolute bottom-0 right-0 w-32 h-32 rounded-full pointer-events-none" 
            style={{ background: "radial-gradient(circle, rgba(155, 89, 245, 0.12) 0%, transparent 70%)" }}
          />

          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-cyan-bright text-2xl font-serif">
            “
          </div>

          <blockquote className="font-display font-medium text-base sm:text-lg lg:text-xl text-text-sub italic leading-relaxed">
            "Great software engineering isn't just about outputting syntactically clean script loops. 
            It resides in a disciplined alignment with user pain-points, architecting secure structural databases, 
            and crafting intuitive workflows that perform flawlessly."
          </blockquote>

          <div className="space-y-1 font-mono text-[10px]">
            <span className="block text-text-main font-semibold">Ijlal Hussain</span>
            <span className="block text-text-muted">Software Engineer · NUML Graduate</span>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

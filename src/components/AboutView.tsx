import { useState } from "react";
import { Download, Briefcase, GraduationCap, Award, Compass, Heart, Languages, Coffee } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { personalInfo, skillsData, experienceData, educationData } from "../data";

export default function AboutView() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const getSkillProficiency = (level: string) => {
    switch (level.toLowerCase()) {
      case "expert":
        return { percent: 95, color: "from-cyan-bright to-blue-500", label: "95%" };
      case "advanced":
        return { percent: 80, color: "from-purple-bright to-indigo-500", label: "80%" };
      case "intermediate":
        return { percent: 60, color: "from-amber-400 to-orange-500", label: "60%" };
      case "independent / professional":
        return { percent: 85, color: "from-purple-bright to-cyan-bright", label: "Professional" };
      case "native":
        return { percent: 100, color: "from-cyan-bright to-green-accent", label: "Native" };
      case "mother tongue":
        return { percent: 100, color: "from-cyan-bright to-green-accent", label: "Mother Tongue" };
      default:
        return { percent: 75, color: "from-cyan-bright to-purple-bright", label: "75%" };
    }
  };

  const categories = ["All", ...skillsData.map((s) => s.category)];

  const filteredSkills = selectedCategory === "All"
    ? skillsData
    : skillsData.filter((s) => s.category === selectedCategory);

  const funFacts = [
    {
      icon: <Compass className="w-5 h-5 text-cyan-bright" />,
      title: "Gilgit Native",
      text: "Born and raised amidst the majestic Karakoram mountain ranges of Gilgit-Baltistan."
    },
    {
      icon: <Award className="w-5 h-5 text-purple-bright" />,
      title: "Gold Medal Pace",
      text: "Maintained a near-perfect academic track with an exceptional 3.96 / 4.0 CGPA at NUML."
    },
    {
      icon: <Languages className="w-5 h-5 text-green-accent" />,
      title: "Trilingual",
      text: "Speak Brushaski (mother tongue), Urdu (native), and English (professional)."
    },
    {
      icon: <Coffee className="w-5 h-5 text-gold-accent" />,
      title: "Agent Builder",
      text: "Fascinated by graph theory and agent-based LLM architectures that think step-by-step."
    }
  ];

  return (
    <div id="about-view-container" className="space-y-16 pb-12">
      
      {/* SECTION 1: BIO & CV CTA */}
      <motion.section
        id="about-hero"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative flex flex-col md:flex-row items-start justify-between gap-10"
      >
        <div className="flex-1 space-y-6 text-left">
          <div className="space-y-2">
            <span className="font-mono text-xs text-cyan-bright uppercase tracking-wider">
              About the Developer
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-main">
              Unifying Code & Cognitive Science
            </h1>
          </div>

          <p className="font-sans text-sm text-text-sub leading-relaxed">
            I'm a meticulous Software Engineer based in Pakistan. From a young age, I was fascinated 
            by the power of computers to transform ideas into tangible realities. At NUML Islamabad, 
            I channeled this interest into software development, focusing heavily on modern full-stack web architectures, 
            machine learning interfaces, and responsive mobile native application suites.
          </p>

          <p className="font-sans text-sm text-text-sub leading-relaxed">
            I specialize in orchestrating advanced Generative AI architectures, including Multi-Agent systems 
            using <strong className="text-text-main font-semibold">LangGraph</strong> and RAG-based search engines. My core development process centers on clean code architecture, 
            strict state-control, and continuous testing to build systems that scale gracefully.
          </p>

          {/* CV Button */}
          <a
            id="download-cv-about"
            href={personalInfo.resumeUrl || "/Ijlal_Hussain_CV.pdf"}
            download="Ijlal_Hussain_CV.pdf"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-bright to-purple-bright text-slate-950 font-sans font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-glow/10 hover:opacity-90 transition-all btn-glow-purple cursor-pointer decoration-none"
          >
            <Download className="w-4 h-4" />
            <span>Download Professional CV</span>
          </a>
        </div>

        {/* Quick contact card */}
        <div className="w-full md:w-80 glass rounded-2xl p-6 space-y-6 border border-white/10">
          <h3 className="font-display font-semibold text-sm text-text-main uppercase tracking-wider border-b border-white/5 pb-2">
            Professional Profile
          </h3>
          <ul className="space-y-4 font-mono text-xs">
            <li className="flex justify-between">
              <span className="text-text-muted">University:</span>
              <span className="text-text-main text-right">{personalInfo.university}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-text-muted">Academic CGPA:</span>
              <span className="text-cyan-bright font-bold">{personalInfo.cgpa} / 4.0</span>
            </li>
            <li className="flex justify-between">
              <span className="text-text-muted">Core Scope:</span>
              <span className="text-text-main text-right">Generative AI, MERN, Java</span>
            </li>
            <li className="flex justify-between">
              <span className="text-text-muted">Origin:</span>
              <span className="text-text-main text-right">Gilgit, Pakistan</span>
            </li>
            <li className="flex justify-between">
              <span className="text-text-muted">Primary Language:</span>
              <span className="text-text-main text-right">Urdu & English</span>
            </li>
          </ul>
        </div>
      </motion.section>

      {/* SECTION 2: EXPERIENCE TIMELINE */}
      <motion.section
        id="experience-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <div className="text-left space-y-2">
          <span className="font-mono text-xs text-purple-bright uppercase tracking-wider">
            Employment Records
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-text-main">
            Professional Experience
          </h2>
        </div>

        <div className="relative border-l border-white/5 pl-6 sm:pl-8 space-y-12">
          {experienceData.map((exp, index) => (
            <div key={index} className="relative group">
              {/* Timeline marker icon */}
              <span className="absolute -left-10 sm:-left-12 top-1.5 w-8 h-8 rounded-full bg-card border border-white/10 flex items-center justify-center text-cyan-bright group-hover:border-cyan-glow/50 transition-all shadow-md">
                <Briefcase className="w-4 h-4" />
              </span>

              {/* Experience Node */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="font-display font-bold text-base sm:text-lg text-text-main group-hover:text-cyan-bright transition-colors">
                    {exp.role}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-cyan-glow/5 text-cyan-bright border border-cyan-glow/10 self-start sm:self-center">
                    {exp.period}
                  </span>
                </div>
                <div className="flex items-center space-x-2 font-sans text-xs text-purple-bright">
                  <span>{exp.company}</span>
                  <span className="text-text-muted">•</span>
                  <span className="text-text-muted">{exp.location}</span>
                </div>
                
                <ul className="list-disc list-inside space-y-1.5 font-sans text-xs text-text-sub leading-relaxed max-w-4xl">
                  {exp.highlights.map((h, i) => (
                    <li key={i} className="pl-1">
                      <span className="text-text-sub">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* SECTION 3: EDUCATION TIMELINE */}
      <motion.section
        id="education-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <div className="text-left space-y-2">
          <span className="font-mono text-xs text-green-accent uppercase tracking-wider">
            Academic Ascent
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-text-main">
            Education History
          </h2>
        </div>

        <div className="relative border-l border-white/5 pl-6 sm:pl-8 space-y-12">
          {educationData.map((edu, index) => (
            <div key={index} className="relative group">
              {/* Timeline marker icon */}
              <span className="absolute -left-10 sm:-left-12 top-1.5 w-8 h-8 rounded-full bg-card border border-white/10 flex items-center justify-center text-purple-bright group-hover:border-purple-glow/50 transition-all shadow-md">
                <GraduationCap className="w-4 h-4" />
              </span>

              {/* Education Node */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="font-display font-bold text-base sm:text-lg text-text-main group-hover:text-purple-bright transition-colors">
                    {edu.degree}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-purple-glow/5 text-purple-bright border border-purple-glow/10 self-start sm:self-center">
                    {edu.period}
                  </span>
                </div>
                <div className="flex items-center justify-between font-sans text-xs text-text-sub">
                  <span>{edu.institution}</span>
                  <span className="font-mono text-xs text-green-accent font-semibold">{edu.grade}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* SECTION 4: DETAILED SKILLS GRID WITH CATEGORY FILTRATION */}
      <motion.section
        id="skills-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="text-left space-y-2">
            <span className="font-mono text-xs text-cyan-bright uppercase tracking-wider">
              Engineered Toolbox
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-text-main">
              Technical Skillsets
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 self-start sm:self-auto max-w-full overflow-x-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full font-sans text-[11px] font-semibold tracking-wide cursor-pointer transition-all ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-cyan-bright to-purple-bright text-slate-950 shadow-sm shadow-purple-glow/10"
                    : "bg-white/5 text-text-sub hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[300px]">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((cat, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35 }}
                key={cat.category}
                className="glass rounded-2xl p-6 space-y-4 border border-white/5 hover:border-white/15 transition-all"
              >
                <h3 className="font-display font-bold text-sm text-cyan-bright uppercase tracking-wider border-b border-white/5 pb-2">
                  {cat.category}
                </h3>
                <div className="space-y-3.5 w-full">
                  {cat.skills.map((skill, sIdx) => {
                    const prof = getSkillProficiency(skill.level || "");
                    return (
                      <div
                        key={sIdx}
                        className="flex flex-col w-full p-3 rounded-xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.05] hover:border-white/10 transition-all space-y-2"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-sans text-xs text-text-main font-semibold group-hover:text-cyan-bright transition-colors">
                            {skill.name}
                          </span>
                          <span className="font-mono text-[9px] text-text-muted">
                            {prof.label}
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${prof.percent}%` }}
                            viewport={{ once: false }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: sIdx * 0.05 }}
                            className={`h-full rounded-full bg-gradient-to-r ${prof.color}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* SECTION 5: BENTO GRID FUN FACTS */}
      <motion.section
        id="funfacts-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="font-mono text-xs text-gold-accent uppercase tracking-wider">
            Personal Spectrum
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-text-main">
            Interests & Characteristics
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {funFacts.map((fact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className="glass rounded-2xl p-6 space-y-4 border border-white/5 text-left hover:border-white/10 transition-all flex flex-col justify-between"
            >
              <div className="p-3 rounded-xl bg-white/5 self-start">
                {fact.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-sm text-text-main">
                  {fact.title}
                </h3>
                <p className="font-sans text-xs text-text-muted leading-relaxed">
                  {fact.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}

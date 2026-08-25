import { useState, useEffect } from "react";
import { Menu, X, Github, Linkedin, Mail, FileText, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { personalInfo } from "../data";
import WhatsAppIcon from "./WhatsAppIcon";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: string[];
}

export default function Header({ activeTab, setActiveTab, tabs }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      return saved === "light";
    }
    return false;
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isLightTheme) {
      root.classList.add("light");
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }, [isLightTheme]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleTheme = () => {
    setIsLightTheme((prev) => !prev);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3 glass shadow-lg border-b border-white/5" : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo Brand */}
          <div className="flex-shrink-0">
            <button
              id="logo-btn"
              onClick={() => handleTabClick("Home")}
              className="flex items-center space-x-2 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-bright to-purple-bright p-[1px] shadow-md group-hover:scale-105 transition-all duration-300 overflow-hidden">
                <img
                  src={personalInfo.photoUrl || "/assets/images/profile_photo.png"}
                  alt={personalInfo.name}
                  className="w-full h-full object-cover object-top rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="font-display font-bold text-sm tracking-tight text-text-main group-hover:text-cyan-bright transition-colors">
                    {personalInfo.name}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-bright animate-pulse-subtle" />
                </div>
                <span className="font-mono text-[10px] text-text-muted">
                  Software Engineer &amp; AI
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation links */}
          <nav className="hidden md:flex items-center space-x-1 glass px-4 py-1.5 rounded-full border border-white/10 shadow-inner">
            {tabs.map((tab) => (
              <button
                key={tab}
                id={`nav-${tab.toLowerCase()}`}
                onClick={() => handleTabClick(tab)}
                className={`relative px-4 py-1.5 rounded-full font-sans text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                  activeTab === tab
                    ? "text-slate-950 font-bold"
                    : "text-text-sub hover:text-text-main hover:bg-white/5"
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-bright via-cyan-glow to-purple-bright rounded-full -z-10 shadow-lg shadow-cyan-glow/20"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </nav>

          {/* Right Action Icons (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              id="theme-toggle-header"
              className={`p-2 rounded-xl transition-all duration-300 cursor-pointer border ${
                isLightTheme
                  ? "bg-black/5 hover:bg-black/10 text-purple-bright border-black/10"
                  : "bg-white/5 hover:bg-white/10 text-cyan-bright border-white/10"
              }`}
              title={isLightTheme ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {isLightTheme ? (
                <Moon className="w-4 h-4 text-purple-bright" />
              ) : (
                <Sun className="w-4 h-4 text-yellow-400" />
              )}
            </button>

            {/* Social Links */}
            <div className="flex items-center space-x-1.5">
              <a
                id="header-github"
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-text-sub hover:text-cyan-bright hover:bg-white/5 transition-all duration-200"
                title="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                id="header-linkedin"
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-text-sub hover:text-purple-bright hover:bg-white/5 transition-all duration-200"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                id="header-whatsapp"
                href={`https://wa.me/${personalInfo.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-text-sub hover:text-emerald-400 hover:bg-white/5 transition-all duration-200"
                title="WhatsApp Direct"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </a>

              {/* Resume Button */}
              <a
                id="resume-btn-header"
                href={personalInfo.resumeUrl || "/Ijlal_Hussain_CV.pdf"}
                download="Ijlal_Hussain_CV.pdf"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-bright to-purple-bright text-slate-950 font-sans font-semibold text-xs tracking-wide uppercase transition-all duration-300 hover:opacity-90 btn-glow-cyan shadow-lg shadow-cyan-glow/10"
              >
                <FileText className="w-4 h-4" />
                <span>Resume</span>
              </a>
            </div>
          </div>

          {/* Mobile hamburger & action button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              id="theme-toggle-mobile"
              className={`p-2 rounded-lg transition-all duration-300 cursor-pointer ${
                isLightTheme
                  ? "text-purple-bright bg-black/5 hover:bg-black/10"
                  : "text-cyan-bright bg-white/5 hover:bg-white/10"
              }`}
              title={isLightTheme ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {isLightTheme ? <Moon className="w-5 h-5 text-purple-bright" /> : <Sun className="w-5 h-5 text-yellow-400" />}
            </button>
            <a
              id="resume-btn-mobile-head"
              href={personalInfo.resumeUrl || "/Ijlal_Hussain_CV.pdf"}
              download="Ijlal_Hussain_CV.pdf"
              className="p-2 rounded-lg bg-white/5 text-cyan-bright hover:bg-white/10 transition-colors"
              title="Download Resume"
            >
              <FileText className="w-5 h-5" />
            </a>
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-text-sub hover:text-text-main hover:bg-white/5 focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Side Drawer Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
            />

            {/* Side Slide-out Panel */}
            <motion.div
              id="mobile-nav-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="md:hidden fixed top-0 right-0 bottom-0 w-72 max-w-[85vw] bg-card border-l border-white/10 z-50 flex flex-col justify-between p-6 shadow-2xl overflow-y-auto"
            >
              <div className="space-y-6">
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-cyan-bright/40 shadow-sm">
                      <img
                        src={personalInfo.photoUrl || "/assets/images/profile_photo.png"}
                        alt={personalInfo.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-display font-bold text-sm text-text-main">
                        {personalInfo.name}
                      </span>
                      <span className="font-mono text-[9px] text-cyan-bright">
                        Portfolio Navigation
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-text-sub hover:text-text-main transition-colors cursor-pointer"
                    aria-label="Close navigation menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Nav Links */}
                <div className="flex flex-col space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      id={`mobile-nav-${tab.toLowerCase()}`}
                      onClick={() => handleTabClick(tab)}
                      className={`w-full text-left px-4 py-3 rounded-xl font-sans text-sm font-semibold transition-all duration-200 cursor-pointer ${
                        activeTab === tab
                          ? "bg-gradient-to-r from-cyan-glow/20 to-purple-glow/20 text-cyan-bright border-l-4 border-cyan-bright shadow-md shadow-cyan-glow/10"
                          : "text-text-sub hover:text-text-main hover:bg-white/5"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* CV Button in Drawer */}
                <div className="pt-2">
                  <a
                    id="resume-btn-drawer"
                    href={personalInfo.resumeUrl || "/Ijlal_Hussain_CV.pdf"}
                    download="Ijlal_Hussain_CV.pdf"
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-bright to-purple-bright text-slate-950 font-sans font-bold text-xs uppercase tracking-wide transition-all duration-300 shadow-md shadow-cyan-glow/15"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Download CV (PDF)</span>
                  </a>
                </div>
              </div>

              {/* Drawer Footer Socials */}
              <div className="pt-6 border-t border-white/10">
                <span className="block font-mono text-[9px] text-text-muted uppercase tracking-wider mb-3 text-center">
                  Social Channels
                </span>
                <div className="flex items-center justify-center space-x-3">
                  <a
                    id="mobile-github-link"
                    href={personalInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-text-sub hover:text-cyan-bright transition-colors"
                    title="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    id="mobile-linkedin-link"
                    href={personalInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-text-sub hover:text-purple-bright transition-colors"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    id="mobile-mail-link"
                    href={`mailto:${personalInfo.email}`}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-text-sub hover:text-cyan-bright transition-colors"
                    title="Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                  <a
                    id="mobile-whatsapp-link"
                    href={`https://wa.me/${personalInfo.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-text-sub hover:text-emerald-400 transition-colors"
                    title="WhatsApp"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

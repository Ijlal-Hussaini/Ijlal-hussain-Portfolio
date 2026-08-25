import { useState, useEffect } from "react";
import { Menu, X, Github, Linkedin, Mail, FileText, Sun, Moon } from "lucide-react";
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
              className="flex items-center space-x-2 text-left group"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-bright to-purple-bright p-[1px] shadow-md group-hover:scale-105 transition-all duration-300 overflow-hidden">
                <div className="w-full h-full bg-[#05050a] rounded-full flex items-center justify-center overflow-hidden">
                  <img
                    src="/assets/images/profile_photo.png"
                    alt="Ijlal Hussain"
                    className="w-full h-full object-cover object-[center_12%] rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="block font-display font-bold text-text-main text-sm tracking-tight group-hover:text-cyan-bright transition-colors duration-200">
                  {personalInfo.name}
                </span>
                <span className="block font-mono text-[10px] text-text-muted leading-none">
                  Generative AI & MERN
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav id="desktop-nav" className="hidden md:flex items-center space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                id={`nav-${tab.toLowerCase()}`}
                onClick={() => handleTabClick(tab)}
                className={`relative px-4 py-2 rounded-full font-sans text-sm font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? "text-cyan-bright"
                    : "text-text-sub hover:text-text-main hover:bg-white/5"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-cyan-bright rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Socials & Resume CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              id="theme-toggle-desktop"
              className={`p-2.5 rounded-lg transition-all duration-300 cursor-pointer ${
                isLightTheme
                  ? "text-purple-bright bg-black/5 hover:bg-black/10"
                  : "text-cyan-bright bg-white/5 hover:bg-white/10"
              }`}
              title={isLightTheme ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {isLightTheme ? <Moon className="w-5 h-5 text-purple-bright" /> : <Sun className="w-5 h-5 text-yellow-400" />}
            </button>

            <div className="hidden lg:flex items-center space-x-4">
              <a
                id="social-github-header"
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-text-sub hover:text-cyan-bright hover:bg-white/5 transition-all duration-200"
                title="GitHub Profile"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                id="social-linkedin-header"
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-text-sub hover:text-purple-bright hover:bg-white/5 transition-all duration-200"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                id="social-email-header"
                href={`mailto:${personalInfo.email}`}
                className="p-2 rounded-lg text-text-sub hover:text-cyan-bright hover:bg-white/5 transition-all duration-200"
                title="Send Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                id="social-whatsapp-header"
                href={`https://wa.me/${personalInfo.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-text-sub hover:text-emerald-400 hover:bg-white/5 transition-all duration-200"
                title="WhatsApp Chat"
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

          {/* Mobile hamburger menu button */}
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
              className="p-2 rounded-lg text-text-sub hover:text-text-main hover:bg-white/5 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sliding Navigation Menu */}
      {isOpen && (
        <div id="mobile-nav-panel" className="md:hidden absolute top-full left-0 right-0 py-4 px-6 glass border-b border-white/5 animate-fade-in">
          <div className="flex flex-col space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                id={`mobile-nav-${tab.toLowerCase()}`}
                onClick={() => handleTabClick(tab)}
                className={`w-full text-left px-4 py-3 rounded-xl font-sans text-base font-semibold transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-cyan-glow/20 to-purple-glow/20 text-cyan-bright border-l-2 border-cyan-bright"
                    : "text-text-sub hover:text-text-main hover:bg-white/5"
                }`}
              >
                {tab}
              </button>
            ))}
            <div className="pt-4 border-t border-white/5 flex items-center justify-around">
              <a
                id="mobile-github-link"
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/5 text-text-sub hover:text-cyan-bright"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                id="mobile-linkedin-link"
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/5 text-text-sub hover:text-purple-bright"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                id="mobile-mail-link"
                href={`mailto:${personalInfo.email}`}
                className="p-3 rounded-full bg-white/5 text-text-sub hover:text-cyan-bright"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                id="mobile-whatsapp-link"
                href={`https://wa.me/${personalInfo.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/5 text-text-sub hover:text-emerald-400"
                title="WhatsApp Chat"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

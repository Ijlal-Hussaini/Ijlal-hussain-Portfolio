import { useState, useRef, useEffect, memo } from "react";
import {
  Bot,
  Sparkles,
  Send,
  RotateCcw,
  ArrowUpRight,
  Minimize2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  personalInfo,
  skillsData,
  experienceData,
  educationData,
  projectsData,
  certificationsData
} from "../data";

interface AIChatBotProps {
  onNavigate: (tab: string) => void;
  isScrollTopVisible?: boolean;
}

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  actionLink?: { label: string; tab?: string; url?: string };
  timestamp: string;
}

/**
 * Fast Levenshtein distance for fuzzy typo-tolerant keyword matching
 */
function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Check if any token matches the target word fuzzily (with max edit distance threshold)
 */
function hasFuzzyWord(tokens: string[], target: string, maxDist = 2): boolean {
  const targetLower = target.toLowerCase();
  return tokens.some((token) => {
    const t = token.toLowerCase();
    if (t === targetLower) return true;
    // Only allow substring matching if both lengths >= 4
    if (t.length >= 4 && targetLower.length >= 4 && (t.includes(targetLower) || targetLower.includes(t))) {
      return true;
    }
    // For short words (<= 3 chars), require exact match
    if (targetLower.length <= 3) {
      return t === targetLower;
    }
    if (Math.abs(t.length - targetLower.length) > maxDist) return false;
    return editDistance(t, targetLower) <= maxDist;
  });
}

/**
 * High-performance Memoized Markdown & Rich-Text parser
 * Converts **bold**, *italic*, `code`, and [label](url) into clean React elements
 * without leaking raw asterisks, stars, or brackets.
 */
const FormattedMessage = memo(function FormattedMessage({ text }: { text: string }) {
  const renderInline = (content: string) => {
    // Regex matching: links, inline code, bold, italic
    const regex = /(\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
    const parts = content.split(regex);

    return parts.map((part, index) => {
      if (!part) return null;

      // Link: [text](url)
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        return (
          <a
            key={index}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-bright hover:underline font-semibold"
          >
            {linkMatch[1]}
          </a>
        );
      }

      // Code: `code`
      const codeMatch = part.match(/^`([^`]+)`$/);
      if (codeMatch) {
        return (
          <code
            key={index}
            className="px-1.5 py-0.5 rounded bg-cyan-bright/10 text-cyan-bright font-mono text-[11px] border border-cyan-bright/20"
          >
            {codeMatch[1]}
          </code>
        );
      }

      // Bold: **text**
      const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
      if (boldMatch) {
        return (
          <strong key={index} className="text-text-main font-bold">
            {boldMatch[1]}
          </strong>
        );
      }

      // Italic: *text*
      const italicMatch = part.match(/^\*([^*]+)\*$/);
      if (italicMatch) {
        return (
          <span key={index} className="text-text-sub font-medium italic">
            {italicMatch[1]}
          </span>
        );
      }

      // Cleanup any accidental stray asterisks from raw text
      const cleaned = part.replace(/\*/g, "");
      return <span key={index}>{cleaned}</span>;
    });
  };

  const lines = text.split("\n");

  return (
    <div className="space-y-1.5 leading-relaxed text-xs">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Bullet points: •, -, or *
        if (/^[•\-\*]\s+/.test(trimmed)) {
          const itemText = trimmed.replace(/^[•\-\*]\s+/, "");
          return (
            <div key={idx} className="flex items-start gap-2 pl-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-bright mt-1.5 flex-shrink-0 shadow-sm shadow-cyan-glow/30" />
              <div className="flex-1">{renderInline(itemText)}</div>
            </div>
          );
        }

        // Numbered list: "1. ", "2. "
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-0.5">
              <span className="font-mono text-[10px] text-cyan-bright font-bold mt-0.5 flex-shrink-0">
                {numMatch[1]}.
              </span>
              <div className="flex-1">{renderInline(numMatch[2])}</div>
            </div>
          );
        }

        return (
          <div key={idx}>
            {renderInline(line)}
          </div>
        );
      })}
    </div>
  );
});

export default function AIChatBot({ onNavigate, isScrollTopVisible = false }: AIChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnreadPulse, setHasUnreadPulse] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: `Hello! 👋 I'm Ijlal's AI Assistant. Ask me anything about his ${projectsData.length} projects (ResumeIQ, Blog Factory, SafeZone), ${certificationsData.length} certifications, 3.96 CGPA at NUML, or tech stack!`,
      timestamp: "Just now"
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnreadPulse(false);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, messages]);

  // Automatically close chatbot if user opens mobile navigation drawer
  useEffect(() => {
    const handleMobileMenu = (e: Event) => {
      const customEvent = e as CustomEvent<{ isOpen: boolean }>;
      if (customEvent.detail?.isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("mobile-menu-toggle", handleMobileMenu);
    return () => window.removeEventListener("mobile-menu-toggle", handleMobileMenu);
  }, []);

  const quickChips = [
    { label: `📊 All Projects (${projectsData.length})`, query: "How many projects has he built?" },
    { label: "🎓 CGPA & Education", query: "What is Ijlal's CGPA and degree?" },
    { label: `📜 Certifications (${certificationsData.length})`, query: "How many certifications does he have?" },
    { label: "🤖 ResumeIQ Project", query: "Tell me about ResumeIQ project" },
    { label: "⚡ LangGraph & AI", query: "What experience does Ijlal have with LangGraph and AI?" },
    { label: "📍 Where is he from?", query: "Where is Ijlal from?" },
    { label: "📬 Contact & Hire", query: "How can I contact or hire Ijlal?" }
  ];

  // Helper: Get Current Pakistan Standard Time (PKT)
  const getPKTTime = (): string => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Karachi",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        weekday: "short"
      }).format(new Date());
    } catch {
      return "UTC+5 (Pakistan Standard Time)";
    }
  };

  /**
   * 100% Grounded, Typo-Tolerant Natural Language Intent Engine
   * Deeply trained across all portfolio data (data.ts) with strict out-of-bounds guardrails.
   */
  const generateGroundedResponse = (rawQuery: string): { text: string; actionLink?: { label: string; tab?: string; url?: string } } => {
    const q = rawQuery.toLowerCase().trim();
    // Normalize common typos and noise characters
    const cleanWords = q
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const tokens = cleanWords.split(/\s+/).filter(Boolean);

    // Helpers to check for subphrase or typo-tolerant token
    const hasWord = (target: string, maxDist = 2) => hasFuzzyWord(tokens, target, maxDist);
    const contains = (phrase: string) => cleanWords.includes(phrase.toLowerCase());

    // -------------------------------------------------------------
    // 1. OUT-OF-BOUNDS / EXTERNAL CODING / OFF-TOPIC GUARDRAIL
    // -------------------------------------------------------------
    const isGeneralCodingTask = (
      (contains("write a") || contains("write code") || contains("generate code") || contains("write script") || contains("solve this") || contains("calculate") || contains("fix my code")) &&
      (hasWord("python") || hasWord("javascript") || hasWord("java") || hasWord("cpp") || hasWord("function") || hasWord("algorithm") || hasWord("code") || hasWord("script") || hasWord("program")) &&
      !hasWord("ijlal") && !hasWord("portfolio") && !hasWord("project") && !hasWord("safezone") && !hasWord("resumeiq") && !hasWord("blogfactory")
    );

    const isGeneralTrivia = (
      contains("capital of") ||
      contains("who is the president") ||
      contains("weather in") ||
      contains("tell me a story about") ||
      contains("what is photosynthesis") ||
      contains("bitcoin price") ||
      contains("crypto") ||
      contains("meaning of life") ||
      contains("recipe for") ||
      contains("write an essay") ||
      contains("write a poem about")
    );

    if (isGeneralCodingTask || isGeneralTrivia) {
      return {
        text: `🛡️ **Ijlal's AI Portfolio Assistant:**\nI am specially trained exclusively on **Ijlal Hussain's software engineering portfolio, projects, skills, and career history**.\n\nI don't generate generic external scripts or answer general trivia, but I would love to tell you all about how Ijlal built **ResumeIQ** (7-node LangGraph RAG), **Technical Blog Factory** (Multi-Agent studio), **Safe Zone** (Parental Control Android App), or his **3.96 CGPA** at NUML!\n\nWhat would you like to explore?`,
        actionLink: { label: "Explore Ijlal's Projects", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 2. RESUME / CV DOWNLOAD
    // -------------------------------------------------------------
    if (
      hasWord("resume", 1) ||
      hasWord("cv", 0) ||
      contains("download cv") ||
      contains("download resume") ||
      contains("get cv") ||
      contains("get resume") ||
      contains("view cv") ||
      contains("view resume")
    ) {
      return {
        text: `📄 **Ijlal Hussain's Official CV / Resume:**\nYou can review or download Ijlal's official software engineering CV directly:\n\n• **Format**: Verified PDF (ATS-optimized)\n• **Degree**: BS Software Engineering (NUML Islamabad)\n• **Academic Standing**: 3.96 / 4.0 CGPA\n• **Core Specializations**: Generative AI, LangGraph, Native Android, Full-Stack Web\n\nClick below to download or view the PDF document!`,
        actionLink: { label: "Download Official CV (PDF)", url: personalInfo.resumeUrl }
      };
    }

    // -------------------------------------------------------------
    // 3. PROJECT NAMES ONLY / LISTING
    // -------------------------------------------------------------
    if (
      (contains("name") || contains("names") || contains("only") || contains("just") || contains("enlist") || contains("title") || contains("titles")) &&
      (hasWord("project") || hasWord("prokjec") || hasWord("prjec") || hasWord("work") || hasWord("app") || contains("project") || contains("prokjec"))
    ) {
      return {
        text: `📋 **Featured Project Names (${projectsData.length} Total):**\n\n1. 🤖 **ResumeIQ** (AI Career Intelligence & ATS Auditor)\n2. 📝 **Technical Blog Post Factory** (Multi-Agent AI Studio)\n3. 📱 **Safe Zone** (Parental Control Android App — FYP Lead)\n4. 🌐 **Developer Portfolio** (React 19 & Tailwind Web App)\n\nClick below to inspect full writeups and UI galleries!`,
        actionLink: { label: "Explore All Projects", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 4. AI & GENERATIVE AI PROJECTS SPECIFIC
    // -------------------------------------------------------------
    if (
      (hasWord("ai", 0) || hasWord("ml", 0) || hasWord("genai", 1) || hasWord("generative", 2) || contains("machine learning") || contains("artificial intelligence")) &&
      (hasWord("project") || hasWord("prokjec") || hasWord("prjec") || hasWord("built") || hasWord("developed") || hasWord("many") || contains("how many"))
    ) {
      const aiProjects = projectsData.filter((p) => p.category === "AI/ML");
      return {
        text: `🤖 **AI & Generative AI Projects (${aiProjects.length} Total):**\n\n1. **ResumeIQ** — 7-node LangGraph cyclic state machine with local sentence-transformers RAG retrieval, ATS score auditing, Google XYZ bullet rewrites, and Groq/Gemini dual LLM failover.\n2. **Technical Blog Factory** — Autonomous 3-agent writing studio built with LangGraph 0.3+, live Tavily web search fact-checking, and syntax-verified code generation.\n\nBoth demonstrate production-grade multi-agent architectures and RAG pipelines!`,
        actionLink: { label: "Inspect AI Projects", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 5. ANDROID & MOBILE PROJECTS SPECIFIC
    // -------------------------------------------------------------
    if (
      (hasWord("android", 2) || hasWord("andriod", 2) || hasWord("mobile", 1) || hasWord("app", 0) || hasWord("apk", 0)) &&
      (hasWord("project") || hasWord("prokjec") || hasWord("prjec") || hasWord("built") || hasWord("many") || hasWord("developed") || contains("how many") || contains("tell me about"))
    ) {
      return {
        text: `📱 **Android & Mobile Projects (1 Featured App):**\n\n• **Safe Zone — Parental Control App (NUML FYP Lead)**\nHigh-fidelity native Android application built in Java with Firebase Realtime Database & Auth. Features real-time GPS geofencing, remote screen lock, category-based web filtering, and 15 verified sequential UI screens in the gallery. Downloadable APK is available!`,
        actionLink: { label: "Inspect SafeZone Android App", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 6. WEB & FULL-STACK PROJECTS SPECIFIC
    // -------------------------------------------------------------
    if (
      (hasWord("web", 0) || hasWord("website", 2) || hasWord("fullstack", 2) || hasWord("frontend", 2) || hasWord("react", 1)) &&
      (hasWord("project") || hasWord("prokjec") || hasWord("prjec") || hasWord("built") || hasWord("many") || contains("how many"))
    ) {
      return {
        text: `🌐 **Web & Full-Stack Projects (1 Featured Web App):**\n\n• **Developer Portfolio Platform**\nEngineered with React 19, TypeScript, Vite 6, Tailwind CSS v4, Motion, and Web3Forms with sub-second page loads, zero render-blocking CSS, and persistent URL routing.`,
        actionLink: { label: "Explore Portfolio Specifications", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 7. DEEP DIVE: RESUMEIQ
    // -------------------------------------------------------------
    if (hasWord("resumeiq", 2) || (hasWord("resume", 1) && hasWord("iq", 0)) || hasWord("ats", 0) || contains("career intelligence")) {
      const proj = projectsData.find((p) => p.id === "resumeiq");
      return {
        text: `🤖 **ResumeIQ — AI Career Intelligence Platform:**\n${proj?.description || "Production-grade career intelligence engine."}\n\n**Key Architectural Highlights:**\n• **7-Node Cyclic LangGraph**: Structured extraction, data validation, JD decomposition, RAG matching, gap analysis, ATS audit, and XYZ synthesis\n• **Local RAG Retrieval**: Sentence-transformers vector embeddings with grounded section citations\n• **Dual LLM Orchestration**: Groq Cloud AI paired with Google Gemini 2.5 failover\n• **ATS Readability Engine**: Contact header audit, action verb rating, keyword density, and Google XYZ bullet rewrites\n• **Modern Frontend**: Next.js 16 Liquid Glass UI with real-time execution telemetry`,
        actionLink: { label: "Inspect ResumeIQ Project", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 8. DEEP DIVE: TECHNICAL BLOG POST FACTORY
    // -------------------------------------------------------------
    if (hasWord("factory", 2) || (hasWord("blog", 1) && (hasWord("post", 1) || hasWord("writer", 1) || hasWord("creator", 1))) || hasWord("tavily", 1)) {
      const proj = projectsData.find((p) => p.id === "blogfactory");
      return {
        text: `📝 **Technical Blog Post Factory — Multi-Agent AI Studio:**\n${proj?.description || "Multi-agent autonomous publishing studio."}\n\n**Key Architectural Highlights:**\n• **3-Agent LangGraph Workflow**: Content Writer, Technical Reviewer, and Code Generator\n• **Live Tavily Web Fact-Checking**: Automatically cross-references claims against live official documentation\n• **Iterative Peer Review**: Strict critique and revision passes (1 to 3 cycles)\n• **Code Snippet Generator**: Injects syntax-verified, runnable code for programming topics\n• **Export Capabilities**: 1-click vector PDF generation via jsPDF and raw Markdown copy`,
        actionLink: { label: "Inspect Technical Blog Factory", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 9. DEEP DIVE: SAFEZONE PARENTAL CONTROL APP (FYP)
    // -------------------------------------------------------------
    if (hasWord("safezone", 2) || (hasWord("safe", 1) && hasWord("zone", 1)) || hasWord("parental", 2) || hasWord("geofence", 2) || hasWord("fyp", 0) || contains("parental control")) {
      const proj = projectsData.find((p) => p.id === "safezone");
      return {
        text: `📱 **Safe Zone — Parental Control Android App (FYP Lead):**\n${proj?.description || "High-fidelity Android parental control system."}\n\n**Key Architectural Highlights:**\n• **Team Lead**: Led end-to-end architecture and development at NUML Islamabad\n• **Core Tech**: Native Android in Java with **Firebase Realtime Database & Auth**\n• **Live GPS Geofencing**: Google Maps tracking with instant boundary breach notifications\n• **Screen Time Enforcer**: Daily limit schedules and remote emergency device locks\n• **Web & App Blocking**: Accessibility background service for category-based filtering\n• **Quick Pairing**: Seamless onboarding using unique QR code scanner linking`,
        actionLink: { label: "Inspect SafeZone Android App", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 10. DEEP DIVE: DEVELOPER PORTFOLIO
    // -------------------------------------------------------------
    if (contains("portfolio website") || contains("this portfolio") || contains("how was this portfolio built") || (hasWord("portfolio") && hasWord("tech"))) {
      const proj = projectsData.find((p) => p.id === "portfolio");
      return {
        text: `🌐 **Developer Portfolio — High-Performance Web Platform:**\n${proj?.description || "Production-grade portfolio web platform."}\n\n**Key Architectural Highlights:**\n• **Core Stack**: React 19, TypeScript, Vite 6, Tailwind CSS v4, Motion\n• **Sub-Second Performance**: Preloaded WebP assets, GPU-accelerated motion, zero render-blocking CSS\n• **Routing & Theming**: Persistent URL hash routing (#about, #projects, #certifications, #contact) with adaptive Cosmic Dark & Crisp Light themes\n• **Verified Credentials Ledger**: Instant signed PDF inspections and 1-click downloads\n• **Client-Side Assistant**: 100% zero-API in-browser grounded RAG chatbot`,
        actionLink: { label: "View Portfolio Specifications", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 11. UNIVERSITY / GRADUATION / DEGREE / EDUCATION
    // -------------------------------------------------------------
    if (
      hasWord("university", 2) ||
      hasWord("univerty", 2) ||
      hasWord("unversity", 2) ||
      hasWord("graduated", 2) ||
      hasWord("graduate", 2) ||
      hasWord("graduation", 2) ||
      hasWord("numl", 1) ||
      hasWord("degree", 1) ||
      hasWord("college", 2) ||
      hasWord("school", 2) ||
      hasWord("education", 2) ||
      hasWord("academic", 2) ||
      contains("where did he study") ||
      contains("which university") ||
      contains("where he graduated") ||
      contains("where is he graduated")
    ) {
      return {
        text: `🎓 **Academic Ascent & Education History:**\nIjlal graduated from the **National University of Modern Languages (NUML), Islamabad** with an outstanding **${personalInfo.cgpa} CGPA**.\n\n• **BS Software Engineering** — NUML Islamabad (${educationData[0].period}) | **${educationData[0].grade} (First Class Honors)**\n• **Intermediate (Computer Science)** — Govt Boys Degree College, Danyore Gilgit (${educationData[1].period}) | **${educationData[1].grade}**\n• **Matriculation (General Science)** — Vision Higher Secondary School, Danyore Gilgit (${educationData[2].period}) | **${educationData[2].grade}**`,
        actionLink: { label: "View Academic Timeline", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 12. CGPA / GPA / MARKS / ACADEMIC STANDING
    // -------------------------------------------------------------
    if (hasWord("cgpa", 1) || hasWord("gpa", 0) || hasWord("marks", 1) || hasWord("grade", 1) || hasWord("grades", 1)) {
      return {
        text: `🎓 **Academic Record & CGPA:**\n• **BS Software Engineering** (NUML Islamabad): **${personalInfo.cgpa}** (Academic Limit 4.0)\n• **Graduation Status**: Graduated with First Class Honors\n• **Intermediate**: ${educationData[1].grade} (${educationData[1].institution})\n• **Matriculation**: ${educationData[2].grade} (${educationData[2].institution})`,
        actionLink: { label: "View Academic Timeline", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 13. WORK EXPERIENCE / INTERNSHIPS (KARTOA, ALBERUNI, FYP)
    // -------------------------------------------------------------
    if (
      hasWord("experience", 2) ||
      hasWord("internship", 2) ||
      hasWord("internships", 2) ||
      hasWord("kartoa", 1) ||
      hasWord("alberuni", 2) ||
      hasWord("company", 2) ||
      contains("work experience") ||
      contains("professional experience")
    ) {
      const expList = experienceData.map((exp, i) => {
        return `${i + 1}. **${exp.role}**\n   *${exp.company}* (${exp.period})\n   • ${exp.highlights[0]}\n   • ${exp.highlights[1]}`;
      }).join("\n\n");

      return {
        text: `💼 **Professional Work Experience & Internships:**\n\n${expList}`,
        actionLink: { label: "View Full Experience Timeline", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 14. SPECIFIC INTERNSHIP: KARTOA TECHNOLOGIES
    // -------------------------------------------------------------
    if (hasWord("kartoa", 1)) {
      const exp = experienceData.find((e) => e.company.toLowerCase().includes("kartoa"));
      return {
        text: `🏢 **AI Development Intern @ Kartoa Technologies:**\n• **Period**: ${exp?.period || "Jan 2026 – Mar 2026"} (Islamabad, Hybrid)\n• **Core Work**: Developed advanced AI solutions using Python, Machine Learning, and Generative AI\n• **RAG & LangGraph**: Built production RAG pipelines and multi-agent state machines\n• **Optimization**: Collaborated heavily on model context length optimization, token limit debugging, and agent loop reliability.`,
        actionLink: { label: "View Experience Details", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 15. SPECIFIC INTERNSHIP: ALBERUNI TECH / REQUIREMENTS ENGINEERING
    // -------------------------------------------------------------
    if (hasWord("alberuni", 2) || contains("requirement engineering") || contains("srs") || contains("brd")) {
      const exp = experienceData.find((e) => e.company.toLowerCase().includes("alberuni"));
      return {
        text: `📑 **Requirement Engineering Intern @ NUML × Alberuni Tech:**\n• **Period**: ${exp?.period || "Aug 2025 – Oct 2025"}\n• **Key Deliverables**: Authored standardized Software Requirements Specifications (SRS), Business Requirements Documents (BRD), and Use Case models\n• **Stakeholder Alignment**: Elicited commercial project requirements and resolved technical ambiguities with senior developers.`,
        actionLink: { label: "View Experience Details", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 16. ALL CERTIFICATIONS & CREDENTIALS
    // -------------------------------------------------------------
    if (
      hasWord("certificate", 2) ||
      hasWord("certification", 2) ||
      hasWord("cerfiticate", 2) ||
      hasWord("certifcate", 2) ||
      hasWord("credential", 2) ||
      hasWord("credentials", 2) ||
      hasWord("license", 2) ||
      hasWord("navttc", 1) ||
      hasWord("cisco", 1) ||
      hasWord("digiskill", 2) ||
      hasWord("digiskills", 2) ||
      contains("python essential") ||
      contains("graphic design") ||
      contains("freelanc")
    ) {
      const certList = certificationsData.map((c, i) => {
        const idStr = c.credentialId ? ` (ID: ${c.credentialId})` : "";
        return `${i + 1}. **${c.title}** — ${c.organization} [${c.period}]${idStr}`;
      }).join("\n");

      return {
        text: `📜 **Verified Institutional Certifications (${certificationsData.length} Total):**\nIjlal holds **${certificationsData.length} verified credentials**:\n\n${certList}\n\nEvery certificate features an interactive 1-click signed PDF viewer and download trigger in his ledger!`,
        actionLink: { label: "Inspect All Verified Certificates", tab: "Certifications" }
      };
    }

    // -------------------------------------------------------------
    // 17. TECHNICAL SKILLS BREAKDOWN
    // -------------------------------------------------------------
    if (
      hasWord("skill", 2) ||
      hasWord("skills", 2) ||
      hasWord("stack", 1) ||
      hasWord("technology", 2) ||
      hasWord("technologies", 2) ||
      hasWord("tool", 1) ||
      hasWord("tools", 1) ||
      hasWord("framework", 2) ||
      hasWord("frameworks", 2) ||
      contains("tech stack") ||
      contains("what does he know")
    ) {
      return {
        text: `🛠️ **Ijlal Hussain's Technical Skillsets:**\n\n• **Generative AI & ML**: Python (88%), LangGraph (86%), LangChain & RAG (84%), Prompt Engineering (85%), Vector Embeddings (80%), FastAPI (82%)\n• **Mobile & Android**: Java & Android SDK (88%), Android Studio (85%), Firebase Realtime DB & Auth (84%), Material Design (80%), Flutter (55%)\n• **Web & Full-Stack**: React 19 & TypeScript (80%), JavaScript ES6+ (84%), Node.js & Express (74%), MongoDB MERN (76%), Tailwind CSS (86%), REST APIs\n• **Software Engineering**: Requirements Engineering (SRS/BRD) (88%), UML & Use Cases (82%), System Design (76%), QA Testing (74%)\n• **Tools**: Git & GitHub (86%), VS Code (88%), Postman (78%), Figma (72%), Vercel, Render`,
        actionLink: { label: "View Complete Skills Matrix", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 18. SPECIFIC LANGUAGE: PYTHON
    // -------------------------------------------------------------
    if (hasWord("python", 1) && !contains("python essential")) {
      return {
        text: `🐍 **Python & AI Stack:**\n• **Proficiency**: 88%\n• **Applications**: Generative AI multi-agent state machines (LangGraph), RAG pipelines (LangChain), AI microservices (FastAPI), sentence-transformers vector embeddings, Pydantic v2 schemas\n• **Certification**: Verified Cisco Networking Academy & OpenEDG Python Essentials 1 certification`,
        actionLink: { label: "View AI Projects", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 19. SPECIFIC LANGUAGE: JAVA & ANDROID
    // -------------------------------------------------------------
    if (hasWord("java", 1) || (hasWord("android") && hasWord("sdk"))) {
      return {
        text: `☕ **Java & Android Development Stack:**\n• **Proficiency**: 88%\n• **Core Capabilities**: Native Android architecture, Android Studio, XML UI design, background accessibility & tracking services, Firebase Realtime Database & Auth\n• **Flagship Project**: Led the Safe Zone Parental Control Android system as FYP Lead at NUML`,
        actionLink: { label: "Inspect SafeZone App", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 20. SPECIFIC TECH: REACT, NEXT.JS & TYPESCRIPT
    // -------------------------------------------------------------
    if (hasWord("react", 1) || hasWord("nextjs", 2) || hasWord("typescript", 2) || hasWord("tailwind", 2)) {
      return {
        text: `⚛️ **Modern Frontend & React Stack:**\n• **React 19 & Next.js 16**: Modern component lifecycles, Server Components, client-side state\n• **TypeScript & ES6+**: Strict type safety, clean asynchronous pipelines, modular architectures\n• **Tailwind CSS v4 & Motion**: Liquid Glass styling, responsive mobile drawers, GPU-accelerated micro-animations`,
        actionLink: { label: "Explore Web Projects", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 21. SPECIFIC TECH: NODE.JS, EXPRESS & MONGODB (MERN)
    // -------------------------------------------------------------
    if (hasWord("node", 1) || hasWord("nodejs", 1) || hasWord("express", 1) || hasWord("mongodb", 2) || hasWord("mern", 1) || hasWord("backend", 2) || hasWord("database", 2)) {
      return {
        text: `🟢 **Backend & Database Architectures:**\n• **Node.js & Express.js**: Scalable RESTful API development, middleware pipelines, authentication\n• **Databases**: MongoDB (flexible unstructured schema modeling), Firebase Realtime Database, Vector Store indices\n• **FastAPI**: Asynchronous Python microservices for streaming AI agent outputs`,
        actionLink: { label: "View Skills Breakdown", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 22. WHY HIRE IJLAL / STRENGTHS / CANDIDATE VALUE
    // -------------------------------------------------------------
    if (
      (hasWord("why") && (hasWord("hire", 1) || hasWord("choose", 1) || hasWord("select", 1))) ||
      hasWord("strength", 2) ||
      hasWord("strengths", 2) ||
      hasWord("unique", 2) ||
      contains("why hire") ||
      contains("why should we hire")
    ) {
      return {
        text: `🌟 **Why Hire Ijlal Hussain?**\n• **Top Academic Standing**: Graduated with an exceptional **3.96 / 4.0 CGPA** (First Class Honors) at NUML Islamabad\n• **Production AI Expertise**: Proven LangGraph cyclic state machines, multi-agent graphs, and RAG pipelines\n• **Proven Leadership**: Led the SafeZone Android FYP as team lead and completed AI & Requirements internships\n• **6 Verified Credentials**: NAVTTC AI/ML, Cisco Python, DigiSkills, and industry recommendation letters\n• **Full-Cycle Agility**: Delivers clean, production-grade, well-documented code spanning Mobile, Web, and AI`,
        actionLink: { label: "Open Contact Form", tab: "Contact" }
      };
    }

    // -------------------------------------------------------------
    // 23. LOCATION & ROOTS
    // -------------------------------------------------------------
    if (
      ((hasWord("where", 1) || hasWord("wher", 1)) && (hasWord("from", 1) || hasWord("form", 1) || hasWord("live", 1) || hasWord("located", 2) || hasWord("he", 0) || hasWord("ijlal", 1))) ||
      hasWord("location", 2) ||
      hasWord("city", 1) ||
      hasWord("country", 2) ||
      hasWord("hometown", 2) ||
      hasWord("origin", 2) ||
      hasWord("gilgit", 1) ||
      hasWord("pakistan", 2) ||
      contains("wher is he") ||
      contains("where is he")
    ) {
      return {
        text: `📍 **Location & Geographic Flexibility:**\n• **Origin**: Originally from **Gilgit, Pakistan** 🏔️\n• **Education & Base**: Studied Software Engineering at **NUML in Islamabad**\n• **Work Modes**: Actively open to **remote global opportunities worldwide** as well as on-site positions in Islamabad/Pakistan!`,
        actionLink: { label: "Contact Ijlal", tab: "Contact" }
      };
    }

    // -------------------------------------------------------------
    // 24. WORK AVAILABILITY / REMOTE WORK / RELOCATION
    // -------------------------------------------------------------
    if (
      hasWord("relocate", 2) ||
      hasWord("relocation", 2) ||
      hasWord("remote", 1) ||
      (hasWord("available", 2) && (hasWord("work", 1) || hasWord("job", 1))) ||
      contains("full time") ||
      contains("start date")
    ) {
      return {
        text: `💼 **Work Availability & Relocation:**\n• **Remote**: Actively available for remote software engineering and AI roles globally\n• **On-Site / Hybrid**: Fully open to on-site and hybrid positions in **Islamabad** and nationwide\n• **Start Date**: Available immediately for full-time roles, contracts, and engineering opportunities!`,
        actionLink: { label: "Send a Message", tab: "Contact" }
      };
    }

    // -------------------------------------------------------------
    // 25. AGE & CAREER STAGE
    // -------------------------------------------------------------
    if (
      hasWord("age", 0) ||
      contains("how old") ||
      contains("his age") ||
      hasWord("born", 1) ||
      hasWord("birth", 1) ||
      hasWord("dob", 0)
    ) {
      return {
        text: `🎂 **Age & Profile:**\nIjlal is an ambitious software engineer in his **early 20s** (graduated with his BS in Software Engineering in early 2026).\n\nHe brings high energy, academic excellence (3.96 CGPA), and up-to-date expertise in 2026 Generative AI systems, multi-agents, and modern application development!`,
        actionLink: { label: "View Full Profile", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 26. SPOKEN LANGUAGES
    // -------------------------------------------------------------
    if (hasWord("language", 2) || hasWord("languages", 2) || hasWord("speak", 1) || hasWord("urdu", 0) || hasWord("english", 2) || hasWord("brushaski", 2)) {
      return {
        text: `🗣️ **Languages & Communication:**\n• **Urdu**: Native\n• **Brushaski**: Mother Tongue\n• **English**: Professional Working Proficiency (Technical Documentation, Client Communication)`,
        actionLink: { label: "View Skills Matrix", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 27. CURRENT TIME & TIMEZONE
    // -------------------------------------------------------------
    if (hasWord("time", 1) || hasWord("clock", 1) || hasWord("timezone", 2) || hasWord("pkt", 0)) {
      const pkt = getPKTTime();
      return {
        text: `🕒 **Current Local Time:**\nIt is currently **${pkt} PKT (UTC+5)** in Pakistan where Ijlal is located.\n\nYou can message him anytime via email or WhatsApp for a fast response!`,
        actionLink: { label: "Send a Message", tab: "Contact" }
      };
    }

    // -------------------------------------------------------------
    // 28. CONTACT DETAILS & SOCIAL CHANNELS
    // -------------------------------------------------------------
    if (hasWord("contact", 2) || hasWord("hire", 1) || hasWord("email", 1) || hasWord("phone", 1) || hasWord("whatsapp", 2) || hasWord("linkedin", 2) || hasWord("github", 2)) {
      return {
        text: `📬 **Let's Connect with Ijlal Hussain!**\n\n• **Email**: ${personalInfo.email}\n• **WhatsApp**: ${personalInfo.phone}\n• **LinkedIn**: [linkedin.com/in/ijlal-hussain786](${personalInfo.linkedin})\n• **GitHub**: [github.com/Ijlal-Hussaini](${personalInfo.github})\n• **Location**: ${personalInfo.location}\n\nIjlal responds promptly to prospective employers, collaborators, and clients!`,
        actionLink: { label: "Open Contact Form", tab: "Contact" }
      };
    }

    // -------------------------------------------------------------
    // 29. JOKE & EASTER EGGS
    // -------------------------------------------------------------
    if (hasWord("joke", 1) || contains("make me laugh") || contains("funny")) {
      return {
        text: `😄 **AI Developer Joke:**\nWhy did the LangGraph agent break up with the simple prompt?\n\n*Because it wanted stateful cyclical feedback loops, but the prompt just kept talking in one direction!* 🤖✨`,
        actionLink: { label: "Inspect LangGraph Projects", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 30. CONVERSATIONAL ACKNOWLEDGMENTS
    // -------------------------------------------------------------
    if (/^(ok|okay|k|kk|alright|sure|cool|nice|got it|fine|perfect|yes|yep|yeah|no|nah|nope|sounds good|understood|noted)$/i.test(cleanWords)) {
      return {
        text: `Got it! 👍 Feel free to ask anything else about **Ijlal's ${projectsData.length} projects**, **${certificationsData.length} verified certifications**, **3.96 CGPA at NUML**, or technical stack!`,
        actionLink: { label: "Explore Projects", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 31. GREETINGS & SALUTATIONS
    // -------------------------------------------------------------
    if (/^(hi|hello|hey|salam|assalam|aoa|hy|hola|greetings|good\s*(morning|afternoon|evening|day|night))(\s|$)/i.test(cleanWords) || hasWord("hello", 1) || hasWord("salam", 1) || hasWord("greetings", 2)) {
      return {
        text: `Hello! 👋 Glad to connect with you!\n\nI can give you instant grounded answers about **Ijlal Hussain's**:\n• **${projectsData.length} Featured Projects** (ResumeIQ, Technical Blog Factory, SafeZone, Portfolio)\n• **Academic Distinction** (${personalInfo.cgpa} CGPA at NUML Islamabad)\n• **${certificationsData.length} Verified Certifications** (NAVTTC AI/ML, Cisco Python, DigiSkills, Kartoa Letter)\n• **Generative AI & LangGraph** multi-agent systems\n• **Native Android** & **Full-Stack Web** engineering\n\nWhat would you like to know?`,
        actionLink: { label: "View About & Skills", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 32. BOT IDENTITY
    // -------------------------------------------------------------
    if (
      hasWord("who are you") ||
      contains("how are you") ||
      contains("who made you") ||
      contains("what is your name") ||
      contains("what do you do") ||
      contains("introduce yourself") ||
      contains("how r u") ||
      hasWord("hru", 0)
    ) {
      return {
        text: `I'm doing great, thank you! 😊\n\nI am **Ijlal's AI Portfolio Assistant**, running 100% client-side in your browser. I have full grounded knowledge of Ijlal's software engineering background, projects, academic honors, verified certifications, and skills.`,
        actionLink: { label: "Explore Projects", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 33. GRATITUDE & CLOSING
    // -------------------------------------------------------------
    if (/^(thank|thanks|thank\s+you|appreciate|awesome|great|cool|goodbye|bye)(\s|$)/i.test(cleanWords) || hasWord("thanks", 1)) {
      return {
        text: `You're very welcome! 😊 If you have any more questions or would like to get in touch with Ijlal, feel free to reach out directly through the contact section!`,
        actionLink: { label: "Open Contact Form", tab: "Contact" }
      };
    }

    // -------------------------------------------------------------
    // 34. GIBBERISH FILTER
    // -------------------------------------------------------------
    const isPureDigits = /^\d+$/.test(cleanWords);
    const isTooShortNoise = cleanWords.length <= 4 && !/^(hi|hey|gpa|ai|fyp|numl|job|cv|web|app|java|help)$/.test(cleanWords);
    const lacksVowels = cleanWords.length > 5 && !/[aeiouy]/.test(cleanWords);
    const hasLongRandomSequence = /[bcdfghjklmnpqrstvwxyz]{6,}/i.test(cleanWords);

    if (isPureDigits || isTooShortNoise || lacksVowels || hasLongRandomSequence) {
      return {
        text: `I couldn't quite understand that. 🤔 I'm specialized in answering questions about Ijlal's engineering career, projects, and skills.\n\nTry asking:\n• List project names\n• From which university is he graduated?\n• How many AI projects has he built?\n• How does ResumeIQ work?\n• Where is he from?`,
        actionLink: { label: "Explore All Projects", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 35. GENERAL GROUNDED FALLBACK
    // -------------------------------------------------------------
    return {
      text: `I'm here to help you learn all about **Ijlal Hussain**! 🌟\n\nYou can ask me specific questions like:\n• What projects has Ijlal built?\n• Tell me about his LangGraph AI experience\n• What did he do during his Kartoa internship?\n• What is his CGPA at NUML?\n• How can I download his CV or contact him?`,
      actionLink: { label: "View All Projects", tab: "Projects" }
    };
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: Message = {
      id: "user-" + Date.now(),
      sender: "user",
      text,
      timestamp: "Just now"
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate realistic intelligent streaming delay
    setTimeout(() => {
      const response = generateGroundedResponse(text);
      const botMsg: Message = {
        id: "bot-" + Date.now(),
        sender: "bot",
        text: response.text,
        actionLink: response.actionLink,
        timestamp: "Just now"
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 400);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "welcome-" + Date.now(),
        sender: "bot",
        text: `Chat reset! Ask me anything about Ijlal's technical projects, AI engineering stack, academic distinctions, or work experience! 🚀`,
        timestamp: "Just now"
      }
    ]);
  };

  const handleActionClick = (action: { label: string; tab?: string; url?: string }) => {
    if (action.tab) {
      onNavigate(action.tab);
      setIsOpen(false);
    } else if (action.url) {
      window.open(action.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      {/* 1. FLOATING ACTION LAUNCH BUBBLE */}
      <div
        className={`fixed z-40 transition-all duration-300 ${
          isScrollTopVisible ? "bottom-22 right-4 sm:right-6" : "bottom-4 sm:bottom-6 right-4 sm:right-6"
        }`}
      >
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              {/* Pulsing glow ring */}
              <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-bright via-purple-bright to-cyan-bright opacity-75 blur-md group-hover:opacity-100 transition-opacity animate-pulse" />

              <button
                onClick={() => setIsOpen(true)}
                className="relative flex items-center space-x-2.5 px-4 py-3 rounded-full bg-card text-text-main border border-cyan-bright/40 shadow-2xl shadow-cyan-glow/20 cursor-pointer focus:outline-none"
                title="Chat with Ijlal's AI Resume Assistant"
                aria-label="Open AI Resume Chat"
              >
                {/* Avatar with status indicator */}
                <div className="relative">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-bright to-purple-bright p-0.5 flex items-center justify-center">
                    <img
                      src="/assets/images/favicon_circular.png"
                      alt="Ijlal AI"
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                  {/* Green online pulse dot */}
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-accent border-2 border-card animate-ping" />
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-accent border-2 border-card" />
                </div>

                <div className="text-left pr-1 hidden sm:block">
                  <span className="block font-display font-bold text-xs text-text-main leading-tight">
                    Ask My AI
                  </span>
                  <span className="block font-mono text-[9px] text-cyan-bright leading-none">
                    Grounded RAG Bot
                  </span>
                </div>

                <Sparkles className="w-4 h-4 text-cyan-bright group-hover:rotate-12 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. CHAT MODAL WINDOW */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ willChange: "transform, opacity" }}
            className="fixed bottom-3 sm:bottom-6 right-3 sm:right-6 z-[90] w-[calc(100vw-1.5rem)] sm:w-[420px] h-[520px] max-h-[80vh] sm:h-[580px] sm:max-h-[85vh] rounded-2xl sm:rounded-3xl bg-card border border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden text-left text-text-main [isolation:isolate]"
          >
            {/* MODAL HEADER */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-card2/50">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-bright to-purple-bright p-0.5">
                    <img
                      src="/assets/images/favicon_circular.png"
                      alt="Ijlal AI"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-accent border-2 border-card" />
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-display font-bold text-sm text-text-main">
                      Ijlal's AI Assistant
                    </h3>
                    <span className="px-1.5 py-0.5 rounded bg-cyan-bright/10 text-cyan-bright font-mono text-[9px] font-bold border border-cyan-bright/20">
                      RAG
                    </span>
                  </div>
                  <p className="font-mono text-[10px] text-green-accent flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-accent animate-pulse" />
                    Online • 100% Client-Side
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={handleResetChat}
                  className="p-1.5 rounded-lg text-text-muted hover:text-cyan-bright hover:bg-card2 transition-colors cursor-pointer"
                  title="Reset conversation"
                  aria-label="Reset chat"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-text-main hover:bg-card2 transition-colors cursor-pointer"
                  title="Minimize chat"
                  aria-label="Close chat"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* MESSAGES SCROLL AREA (Hardware Accelerated, Smooth 60/120fps Scrolling) */}
            <div
              className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 custom-scrollbar overscroll-contain [touch-action:pan-y] [-webkit-overflow-scrolling:touch] [contain:content] [transform:translateZ(0)]"
              style={{ willChange: "scroll-position" }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-7 h-7 rounded-full bg-cyan-bright/10 border border-cyan-bright/30 flex items-center justify-center flex-shrink-0 text-cyan-bright mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 space-y-2.5 text-xs font-sans leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-tr-none shadow-md shadow-purple-glow/20"
                        : "bg-card2 text-text-main border border-white/10 rounded-tl-none shadow-sm"
                    }`}
                  >
                    <FormattedMessage text={msg.text} />

                    {msg.actionLink && (
                      <button
                        onClick={() => handleActionClick(msg.actionLink!)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-bright/10 hover:bg-cyan-bright text-cyan-bright hover:text-slate-950 font-mono font-semibold text-[11px] border border-cyan-bright/30 transition-all cursor-pointer shadow-sm group"
                      >
                        <span>{msg.actionLink.label}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center space-x-2 text-text-muted text-xs font-mono p-2">
                  <div className="w-6 h-6 rounded-full bg-cyan-bright/10 flex items-center justify-center text-cyan-bright">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="flex space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-bright animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-bright animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-green-accent animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-[10px] text-text-muted">Searching resume knowledge...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* QUICK SUGGESTION CHIPS */}
            <div className="px-4 py-2 border-t border-white/5 bg-card2/30">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar overscroll-contain [touch-action:pan-x] [-webkit-overflow-scrolling:touch]">
                {quickChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(chip.query)}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-card hover:bg-cyan-bright/15 text-text-sub hover:text-cyan-bright border border-white/10 hover:border-cyan-bright/30 font-sans text-[10px] font-medium transition-colors cursor-pointer flex-shrink-0"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* INPUT FOOTER */}
            <div className="p-3 border-t border-white/10 bg-card2/50">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about university, project names, AI projects, Android app, age, location..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-card border border-white/15 text-text-main placeholder-text-muted font-sans text-xs focus:outline-none focus:border-cyan-bright focus:ring-1 focus:ring-cyan-bright/50 transition-all"
                />

                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-bright to-purple-bright text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all cursor-pointer font-bold flex-shrink-0 shadow-sm"
                  title="Send question"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <div className="flex items-center justify-between text-[9px] font-mono text-text-muted mt-2 px-1">
                <span>⚡ Zero-Latency Mini-RAG</span>
                <span>Press Enter ↵</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import { useState, useRef, useEffect } from "react";
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
 * Bulletproof Markdown & Rich-Text parser
 * Converts **bold**, *italic*, `code`, and [label](url) into clean React elements
 * without leaking raw asterisks, stars, or brackets.
 */
function FormattedMessage({ text }: { text: string }) {
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
            className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-bright font-mono text-[11px] border border-white/10"
          >
            {codeMatch[1]}
          </code>
        );
      }

      // Bold: **text**
      const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
      if (boldMatch) {
        return (
          <strong key={index} className="text-white font-bold">
            {boldMatch[1]}
          </strong>
        );
      }

      // Italic: *text*
      const italicMatch = part.match(/^\*([^*]+)\*$/);
      if (italicMatch) {
        return (
          <span key={index} className="text-text-main font-medium italic">
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
}

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
   * 100% Grounded Natural Language Intent & QA Engine
   * Strictly synchronized with all portfolio data in data.ts
   */
  const generateGroundedResponse = (rawQuery: string): { text: string; actionLink?: { label: string; tab?: string; url?: string } } => {
    const q = rawQuery.toLowerCase().trim();
    const cleanWords = q.replace(/[^a-z0-9\s]/g, " ").trim();

    // 1. SIMPLE CONVERSATIONAL ACKNOWLEDGMENTS ("ok", "okay", "k", "alright", "sure", "cool", "nice", "got it", "fine", "perfect", "yes", "yep", "no", "nah", "sounds good")
    if (/^(ok|okay|k|kk|alright|sure|cool|nice|got it|fine|perfect|yes|yep|yeah|no|nah|nope|sounds good|understood|noted)$/i.test(cleanWords)) {
      return {
        text: `Got it! 👍 Feel free to ask anything else about **Ijlal's ${projectsData.length} projects**, **${certificationsData.length} verified certifications**, **3.96 CGPA at NUML**, or engineering stack!`,
        actionLink: { label: "Explore Projects", tab: "Projects" }
      };
    }

    // 2. GREETINGS & SALUTATIONS ("hello", "hi", "hey", "salam", "assalam", "aoa", "good morning", "good afternoon", "good evening", "hey there")
    if (/^(hi|hello|hey|salam|assalam|aoa|hy|hola|greetings|good\s*(morning|afternoon|evening|day|night))(\s|$)/i.test(cleanWords)) {
      return {
        text: `Hello! 👋 Glad to connect with you!\n\nI can give you instant grounded answers about **Ijlal Hussain's**:\n• **${projectsData.length} Featured Projects** (ResumeIQ, Technical Blog Factory, SafeZone, Portfolio)\n• **Academic Distinction** (${personalInfo.cgpa} CGPA at NUML Islamabad)\n• **${certificationsData.length} Verified Certifications** (NAVTTC AI/ML, Cisco Python, DigiSkills, Kartoa Letter)\n• **Generative AI & LangGraph** agentic systems\n• **Native Android** & **Full-Stack Web** engineering\n\nWhat would you like to know?`,
        actionLink: { label: "View About & Skills", tab: "About" }
      };
    }

    // 3. BOT IDENTITY / HOW ARE YOU / CREATOR ("how are you", "who are you", "who made you", "what is your name", "what do you do")
    if (/how\s+are\s+you|who\s+are\s+you|who\s+made\s+you|what\s+is\s+your\s+name|who\s+created\s+you|what\s+do\s+you\s+do|introduce\s+yourself/i.test(cleanWords)) {
      return {
        text: `I'm doing great, thank you! 😊\n\nI am **Ijlal's AI Portfolio Assistant**, running 100% client-side in your browser. I have full knowledge of Ijlal's software engineering background, projects, academic honors, verified certifications, and skills.`,
        actionLink: { label: "Explore Projects", tab: "Projects" }
      };
    }

    // 4. GRATITUDE & CLOSING ("thanks", "thank you", "great", "awesome", "bye", "goodbye")
    if (/^(thank|thanks|thank\s+you|appreciate|awesome|great|cool|goodbye|bye)(\s|$)/i.test(cleanWords)) {
      return {
        text: `You're very welcome! 😊 If you have any more questions or would like to collaborate with Ijlal, feel free to reach out directly through the contact section!`,
        actionLink: { label: "Open Contact Form", tab: "Contact" }
      };
    }

    // 5. INTRODUCE IJLAL / WHO IS IJLAL / BIO / SUMMARY
    if (/who\s+is\s+ijlal|about\s+ijlal|tell\s+me\s+about\s+ijlal|introduce\s+ijlal|summary|overview|bio|background/i.test(cleanWords)) {
      return {
        text: `👨‍💻 **About Ijlal Hussain:**\n${personalInfo.bio}\n\n**Core Pillars:**\n• **Education**: BS Software Engineering at NUML Islamabad (**${personalInfo.cgpa} CGPA**)\n• **Specialization**: Generative AI (LangGraph, RAG), Native Android (Java, Firebase), and MERN/React Web Development\n• **Experience**: AI Intern @ Kartoa Technologies, RE Intern @ Alberuni Tech, and FYP Lead @ NUML\n• **Accreditation**: ${certificationsData.length} verified institutional certifications`,
        actionLink: { label: "Read Full Bio & Timeline", tab: "About" }
      };
    }

    // 6. ALL CERTIFICATIONS & CERTIFICATE COUNTS ("how many certif", "how many certificate", "list certificates", "all certificates", "what certificates", "credentials", "navttc", "cisco", "digiskills")
    if (/certif|licens|credential|navttc|digiskill|cisco|python\s+essential|graphic\s+design|freelanc|adan|internship\s+letter/i.test(cleanWords)) {
      const certList = certificationsData.map((c, i) => {
        const idStr = c.credentialId ? ` (ID: ${c.credentialId})` : "";
        return `${i + 1}. **${c.title}** — ${c.organization} [${c.period}]${idStr}`;
      }).join("\n");

      return {
        text: `📜 **Verified Institutional Certifications (${certificationsData.length} Total):**\nIjlal holds **${certificationsData.length} verified certifications & credentials**:\n\n${certList}\n\nAll ${certificationsData.length} certificates feature interactive 1-click signed PDF viewers and downloadable credentials in his ledger!`,
        actionLink: { label: "Inspect All Verified Certificates", tab: "Certifications" }
      };
    }

    // 7. ALL PROJECTS & PROJECT COUNTS ("how many projects", "how many project di he", "list projects", "projects count", "what projects", "show projects")
    if (/how\s+many\s+project|project.*count|number\s+of\s+project|total\s+project|list.*project|all\s+project|show.*project|what\s+project|portfolio.*project/i.test(cleanWords)) {
      const projList = projectsData.map((p, i) => {
        return `${i + 1}. **${p.title}** (${p.category})\n   • Tech: ${p.tech.slice(0, 4).join(", ")}`;
      }).join("\n\n");

      return {
        text: `📊 **Project Portfolio (${projectsData.length} Featured Projects):**\nIjlal has engineered **${projectsData.length} production-grade projects**:\n\n${projList}\n\nClick below to view full writeups, live URLs, GitHub repositories, and interactive UI screenshot lightboxes!`,
        actionLink: { label: `Explore All ${projectsData.length} Projects`, tab: "Projects" }
      };
    }

    // 8. RESUMEIQ (Deep Dive)
    if (/resumeiq|resume\s*iq|ats|cv\s*parser|career\s*intelligence/i.test(cleanWords)) {
      const proj = projectsData.find((p) => p.id === "resumeiq");
      return {
        text: `🤖 **ResumeIQ — AI Career Intelligence Platform:**\n${proj?.description || "Production-grade career intelligence engine."}\n\n**Key Highlights:**\n• 7-node cyclic **LangGraph** state machine\n• Grounded local RAG retrieval with sentence-transformers\n• Groq Cloud AI + Gemini dual-core failover\n• ATS parseability auditing & Google XYZ bullet rewrites\n• Modern Next.js 16 Liquid Glass frontend`,
        actionLink: { label: "Inspect ResumeIQ Project", tab: "Projects" }
      };
    }

    // 9. TECHNICAL BLOG FACTORY (Deep Dive)
    if (/blog|factory|post\s*factory|technical\s*blog|writer\s*agent|peer\s*review|tavily/i.test(cleanWords)) {
      const proj = projectsData.find((p) => p.id === "blogfactory");
      return {
        text: `📝 **Technical Blog Post Factory:**\n${proj?.description || "Multi-agent autonomous publishing studio."}\n\n**Key Highlights:**\n• Autonomous 3-agent **LangGraph 0.3+** cyclic workflow\n• Live web fact-checking via **Tavily AI Search API**\n• Strict iterative peer review loops (1–3 cycles)\n• Automatic syntax-verified runnable code generator\n• 1-click vector PDF generation with jsPDF`,
        actionLink: { label: "Inspect Technical Blog Factory", tab: "Projects" }
      };
    }

    // 10. SAFEZONE ANDROID APP (Deep Dive)
    if (/safe\s*zone|safezone|parent|child|android\s*app|fyp|geofenc|monitoring|control/i.test(cleanWords)) {
      const proj = projectsData.find((p) => p.id === "safezone");
      return {
        text: `📱 **SafeZone — Parental Control Android App (FYP):**\n${proj?.description || "High-fidelity Android parental control system."}\n\n**Key Highlights:**\n• Developed as NUML Final Year Project (FYP) team lead\n• Native Android (Java) with **Firebase Realtime Database & Auth**\n• Real-time GPS geofencing & live location tracking\n• Remote lock & app usage screen time schedulers\n• 11 sequential verified UI screens in gallery`,
        actionLink: { label: "Inspect SafeZone Android App", tab: "Projects" }
      };
    }

    // 11. PORTFOLIO WEBSITE ARCHITECTURE
    if (/portfolio\s*web|tech\s*stack\s*portfolio|how\s*built|react\s*19|vite|pwa|tailwind/i.test(cleanWords)) {
      return {
        text: `⚡ **Developer Portfolio Architecture:**\nEngineered with **React 19**, **TypeScript**, **Vite 6**, and **Tailwind CSS v4**.\n\n• Sub-second page loads with zero render-blocking CSS & WebP compression\n• Persistent Hash routing (\`#projects\`, \`#about\`, \`#certifications\`, \`#contact\`)\n• Installable Progressive Web App (PWA)\n• Web3Forms live email gateway with local PKT time ticker\n• Interactive credentials ledger with signed PDF viewer`,
        actionLink: { label: "Explore Portfolio Specifications", tab: "Projects" }
      };
    }

    // 12. CGPA / EDUCATION / UNIVERSITY / DEGREE / SCHOOL / COLLEGE
    if (/cgpa|gpa|marks|grade|numl|university|graduat|degree|academic|education|islamabad|bachelor|study|school|college|matric|intermediate|fsc/i.test(cleanWords)) {
      const eduList = educationData.map((e) => {
        return `• **${e.degree}** — ${e.institution} (${e.period}) [${e.grade}]`;
      }).join("\n");

      return {
        text: `🎓 **Academic Distinction & Educational Background:**\n\n${eduList}\n\nIjlal graduated with an exceptional **${personalInfo.cgpa} CGPA** from NUML Islamabad, maintaining top-tier academic rigor with strong foundations in Algorithms, Software Architecture, Machine Learning, and Distributed Systems.`,
        actionLink: { label: "View Education Details", tab: "About" }
      };
    }

    // 13. WORK EXPERIENCE / INTERNSHIPS / CAREER
    if (/experience|intern|kartoa|alberuni|work|job|employment|history|career|companies/i.test(cleanWords)) {
      const expList = experienceData.map((exp) => {
        return `• **${exp.role} @ ${exp.company}** (${exp.period})\n  ${exp.highlights[0]}`;
      }).join("\n\n");

      return {
        text: `💼 **Professional Experience:**\n\n${expList}`,
        actionLink: { label: "View Experience Timeline", tab: "About" }
      };
    }

    // 14. LANGGRAPH / GENERATIVE AI / RAG / LLM
    if (/langgraph|langchain|rag|agent|generative\s*ai|genai|llm|deepseek|groq|gemini|prompt|model/i.test(cleanWords)) {
      return {
        text: `⚡ **Generative AI & Agentic Systems Expertise:**\nIjlal has hands-on experience developing advanced AI agent architectures:\n\n• **LangGraph Multi-Agent Workflows**: State graphs, cyclic loops, Human-in-the-Loop checkpointing, and conditional routing\n• **RAG Pipelines**: Dense vector embeddings, sentence-transformers, cosine similarity retrieval, and grounded section citations\n• **Model Orchestration**: Groq Cloud (Llama 3.3, DeepSeek-R1), Google Gemini 2.5 Flash, and OpenAI APIs\n• **AI Microservices**: FastAPI with streaming responses and Pydantic validation filters`,
        actionLink: { label: "View AI & ML Skillsets", tab: "About" }
      };
    }

    // 15. ANDROID / JAVA / MOBILE
    if (/android|java|mobile|studio|apk|geofence|flutter/i.test(cleanWords)) {
      return {
        text: `📱 **Android & Mobile Development:**\n• **Native Android**: Java SDK, Android Studio, Activities/Fragments, BroadcastReceivers, Foreground Services\n• **Firebase Suite**: Realtime Database, Cloud Firestore, Authentication, Cloud Messaging\n• **Architecture**: MVC/MVVM patterns, REST API integration, Material Design 3 UI`,
        actionLink: { label: "View Android Projects", tab: "Projects" }
      };
    }

    // 16. WEB & FULL-STACK
    if (/web|react|typescript|tailwind|node|javascript|frontend|backend|full\s*stack|mern/i.test(cleanWords)) {
      return {
        text: `🌐 **Web & Full-Stack Development:**\n• **Frontend**: React 19, TypeScript, Tailwind CSS v4, Next.js, Motion\n• **Backend**: Node.js, Express, FastAPI, MongoDB, RESTful APIs\n• **Tooling**: Vite, Git/GitHub, PWA, WebP asset compression`,
        actionLink: { label: "Explore Detailed Skills Matrix", tab: "About" }
      };
    }

    // 17. LANGUAGES (Urdu, English, Brushaski)
    if (/language|speak|fluent|urdu|english|brushaski|tongue/i.test(cleanWords)) {
      return {
        text: `🗣️ **Languages & Communication:**\n• **Urdu**: Native (${skillsData.find(s => s.category === "Languages")?.skills.find(k => k.name === "Urdu")?.level || "Native"})\n• **Brushaski**: Mother Tongue (${skillsData.find(s => s.category === "Languages")?.skills.find(k => k.name === "Brushaski")?.level || "Mother Tongue"})\n• **English**: Professional Working Proficiency (${skillsData.find(s => s.category === "Languages")?.skills.find(k => k.name === "English")?.level || "Professional"})`,
        actionLink: { label: "View Skills Matrix", tab: "About" }
      };
    }

    // 18. LOCATION / WHERE IS HE FROM / HOMETOWN
    if (/where.*(from|live|ijlal|he|located|based)|location|city|country|hometown|gilgit|pakistan/i.test(cleanWords)) {
      return {
        text: `📍 **Location & Background:**\nIjlal is originally from the picturesque region of **Gilgit, Pakistan** 🏔️.\n\nHe completed his Software Engineering degree at **NUML in Islamabad** and is actively open to **remote global roles** as well as on-site positions in Islamabad/Pakistan!`,
        actionLink: { label: "Contact Ijlal", tab: "Contact" }
      };
    }

    // 19. CURRENT TIME / TIMEZONE / PKT
    if (/time.*(is\s*it|there|now|zone|current)|timezone|pkt|pakistan\s*time/i.test(cleanWords)) {
      const pkt = getPKTTime();
      return {
        text: `🕒 **Current Local Time:**\nIt is currently **${pkt} PKT (UTC+5)** in Pakistan where Ijlal is located.\n\nYou can send him a message anytime via email or WhatsApp, and he will get back to you promptly!`,
        actionLink: { label: "Send a Message", tab: "Contact" }
      };
    }

    // 20. CONTACT / HIRE / RESUME DOWNLOAD
    if (/contact|hire|email|phone|whatsapp|linkedin|github|reach|call|message|cv|resume|download|available|start|job/i.test(cleanWords)) {
      return {
        text: `📬 **Let's Connect & Collaborate!**\n\n• **Email**: ${personalInfo.email}\n• **WhatsApp**: ${personalInfo.phone}\n• **LinkedIn**: [linkedin.com/in/ijlal-hussain786](${personalInfo.linkedin})\n• **GitHub**: [github.com/Ijlal-Hussaini](${personalInfo.github})\n• **Location**: ${personalInfo.location}\n\nIjlal is actively available for AI engineering roles, full-stack development, and internships!`,
        actionLink: { label: "Open Contact Form", tab: "Contact" }
      };
    }

    // 21. GENERAL SKILLS / TOOLBOX
    if (/skill|stack|technolog|tool|python|fastapi/i.test(cleanWords)) {
      return {
        text: `🛠️ **Ijlal's Core Engineering Toolbox:**\n\n• **Generative AI & ML**: Python (88%), LangGraph (86%), LangChain & RAG (84%), Prompt Engineering (85%), FastAPI (82%)\n• **Android**: Java SDK (88%), Android Studio (85%), Firebase (84%), Material Design (80%)\n• **Web & Full-Stack**: React 19 & TypeScript (80%), Tailwind CSS (86%), Node & Express (74%), MongoDB (76%)\n• **Software Engineering**: Requirements SRS/BRD (88%), System Design (76%), Git & GitHub (86%)`,
        actionLink: { label: "Explore Detailed Skills Matrix", tab: "About" }
      };
    }

    // 22. GIBBERISH / RANDOM CHARACTERS FILTER (e.g. "sada", "1123", "abc", "asdf", "sjifoasidjfosidfj")
    const isPureDigits = /^\d+$/.test(cleanWords);
    const isTooShortNoise = cleanWords.length <= 4 && !/^(hi|hey|gpa|ai|fyp|numl|job|cv|web|app|java|help)$/.test(cleanWords);
    const lacksVowels = cleanWords.length > 5 && !/[aeiouy]/.test(cleanWords);
    const hasLongRandomSequence = /[bcdfghjklmnpqrstvwxyz]{6,}/i.test(cleanWords);

    if (isPureDigits || isTooShortNoise || lacksVowels || hasLongRandomSequence) {
      return {
        text: `I couldn't quite understand that. 🤔 I'm specialized in answering questions about Ijlal's engineering career, projects, and skills.\n\nTry asking:\n• How many projects has he built?\n• How many certifications does he have?\n• What is his CGPA?\n• What is his LangGraph & AI experience?\n• Where is he from?`,
        actionLink: { label: "Explore All Projects", tab: "Projects" }
      };
    }

    // 23. DEFAULT CONCISE FALLBACK
    return {
      text: `I'm here to help you learn all about **Ijlal Hussain**! 🌟\n\nYou can ask me specific questions like:\n• How many projects has he built?\n• How many certifications does he have?\n• What is his CGPA and degree?\n• Tell me about ResumeIQ & LangGraph\n• What experience does he have with SafeZone?`,
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
                className="relative flex items-center space-x-2.5 px-4 py-3 rounded-full bg-slate-950 text-white border border-cyan-bright/40 shadow-2xl shadow-cyan-glow/20 cursor-pointer focus:outline-none"
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
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-accent border-2 border-slate-950 animate-ping" />
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-accent border-2 border-slate-950" />
                </div>

                <div className="text-left pr-1 hidden sm:block">
                  <span className="block font-display font-bold text-xs text-white leading-tight">
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
            className="fixed bottom-3 sm:bottom-6 right-3 sm:right-6 z-[90] w-[calc(100vw-1.5rem)] sm:w-[420px] h-[520px] max-h-[80vh] sm:h-[580px] sm:max-h-[85vh] rounded-2xl sm:rounded-3xl bg-slate-950/98 border border-white/15 shadow-2xl backdrop-blur-md flex flex-col justify-between overflow-hidden text-left"
          >
            {/* MODAL HEADER */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-bright to-purple-bright p-0.5">
                    <img
                      src="/assets/images/favicon_circular.png"
                      alt="Ijlal AI"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-accent border-2 border-slate-950" />
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
                  className="p-1.5 rounded-lg text-text-muted hover:text-cyan-bright hover:bg-white/5 transition-colors cursor-pointer"
                  title="Reset conversation"
                  aria-label="Reset chat"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-text-muted hover:text-text-main hover:bg-white/10 transition-colors cursor-pointer"
                  title="Minimize chat"
                  aria-label="Close chat"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* MESSAGES SCROLL AREA */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
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
                    className={`max-w-[85%] rounded-2xl p-3.5 space-y-2.5 text-xs font-sans leading-relaxed shadow-md ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-tr-none"
                        : "bg-white/[0.04] text-text-main border border-white/10 rounded-tl-none"
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
            <div className="px-4 py-2 border-t border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {quickChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(chip.query)}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white/5 hover:bg-cyan-bright/10 text-text-sub hover:text-cyan-bright border border-white/10 hover:border-cyan-bright/30 font-sans text-[10px] font-medium transition-colors cursor-pointer flex-shrink-0"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* INPUT FOOTER */}
            <div className="p-3 border-t border-white/10 bg-slate-950/80">
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
                  placeholder="Ask about CGPA, projects, certifications, LangGraph, where is he from..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-text-main placeholder-text-muted font-sans text-xs focus:outline-none focus:border-cyan-bright focus:ring-1 focus:ring-cyan-bright/50 transition-all"
                />

                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-bright to-purple-bright text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all cursor-pointer font-bold flex-shrink-0"
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

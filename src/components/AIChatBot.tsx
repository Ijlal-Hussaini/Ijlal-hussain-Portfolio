import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Sparkles,
  Send,
  X,
  RotateCcw,
  ArrowUpRight,
  User,
  GraduationCap,
  Briefcase,
  Award,
  Layers,
  PhoneCall,
  Minimize2,
  Maximize2
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

export default function AIChatBot({ onNavigate, isScrollTopVisible = false }: AIChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnreadPulse, setHasUnreadPulse] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: `Hello! 👋 I'm Ijlal's AI Assistant. Ask me anything about his AI/ML projects (ResumeIQ, Blog Factory), Android development (SafeZone), 3.96 CGPA at NUML, or work experience!`,
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

  const quickChips = [
    { label: "🎓 CGPA & Education", query: "What is Ijlal's CGPA and education?" },
    { label: "🤖 ResumeIQ Platform", query: "Tell me about ResumeIQ project" },
    { label: "📝 Blog Factory", query: "Tell me about Technical Blog Factory" },
    { label: "📱 SafeZone App", query: "Tell me about SafeZone parental control app" },
    { label: "⚡ LangGraph & AI Stack", query: "What experience does Ijlal have with LangGraph and AI?" },
    { label: "📜 Certifications", query: "What certifications does Ijlal hold?" },
    { label: "📬 How to Hire / Contact", query: "How can I contact or hire Ijlal?" }
  ];

  const generateGroundedResponse = (rawQuery: string): { text: string; actionLink?: { label: string; tab?: string; url?: string } } => {
    const q = rawQuery.toLowerCase().trim();

    // 1. Education / CGPA / University / Academic
    if (/cgpa|gpa|marks|grade|numl|university|graduat|degree|academic|education|islamabad/.test(q)) {
      return {
        text: `🎓 **Academic Distinction:**\nIjlal graduated from **NUML Islamabad** with a **BS in Software Engineering**, achieving an exceptional **${personalInfo.cgpa} CGPA**.\n\nHe maintained top-tier academic rigor with deep foundations in Algorithms, Software Architecture, and Machine Learning.`,
        actionLink: { label: "View Academic Timeline & Degree", tab: "About" }
      };
    }

    // 2. ResumeIQ
    if (/resumeiq|resume.*iq|cv.*parser|career.*intelligence|ats|grounded.*rag/.test(q)) {
      const proj = projectsData.find((p) => p.id === "resumeiq");
      return {
        text: `🤖 **ResumeIQ — AI Career Intelligence Platform:**\n${proj?.description || "Production-grade career intelligence engine."}\n\n**Key Highlights:**\n• 7-node cyclic **LangGraph** state machine\n• Grounded local RAG retrieval with sentence-transformers\n• Groq Cloud AI + Gemini dual-core failover\n• ATS parseability auditing & Google XYZ bullet rewrites\n• Modern Next.js 16 Liquid Glass frontend`,
        actionLink: { label: "Inspect ResumeIQ Project & Screens", tab: "Projects" }
      };
    }

    // 3. Technical Blog Factory
    if (/blog|factory|post.*factory|technical.*blog|writer.*agent|peer.*review|tavily/.test(q)) {
      const proj = projectsData.find((p) => p.id === "blogfactory");
      return {
        text: `📝 **Technical Blog Post Factory:**\n${proj?.description || "Multi-agent autonomous publishing studio."}\n\n**Key Highlights:**\n• Autonomous 3-agent **LangGraph 0.3+** cyclic workflow\n• Live web fact-checking via **Tavily AI Search API**\n• Strict iterative peer review loops (1–3 cycles)\n• Automatic syntax-verified runnable code generator\n• Phonotactic upfront topic guardrail engine\n• 1-click vector PDF generation with jsPDF`,
        actionLink: { label: "Inspect Technical Blog Factory", tab: "Projects" }
      };
    }

    // 4. SafeZone
    if (/safe.*zone|safezone|parent|child|android|fyp|java|firebase|geofenc|monitoring|control/.test(q)) {
      const proj = projectsData.find((p) => p.id === "safezone");
      return {
        text: `📱 **Safe Zone — Parental Control Android App (FYP):**\n${proj?.description || "High-fidelity Android parental control system."}\n\n**Key Highlights:**\n• Developed as NUML Final Year Project (FYP) team lead\n• Native Android (Java) with **Firebase Realtime Database & Auth**\n• Real-time GPS geofencing & live location tracking\n• Remote lock & app usage screen time schedulers\n• 11 sequential verified UI screens in gallery`,
        actionLink: { label: "Inspect SafeZone Android App", tab: "Projects" }
      };
    }

    // 5. Portfolio Website Specs
    if (/portfolio.*website|tech.*stack.*portfolio|how.*built|react 19|vite|pwa|styling/.test(q)) {
      return {
        text: `⚡ **Developer Portfolio Architecture:**\nEngineered with **React 19**, **TypeScript**, **Vite 6**, and **Tailwind CSS v4**.\n\n• Zero render-blocking CSS & WebP compression\n• Persistent Hash routing (\`#projects\`, \`#about\`, \`#certifications\`, \`#contact\`)\n• Installable Progressive Web App (PWA)\n• Web3Forms live email gateway with local PKT time ticker\n• Interactive credentials ledger with signed PDF viewer`,
        actionLink: { label: "Explore Portfolio Specifications", tab: "Projects" }
      };
    }

    // 6. LangGraph / Generative AI / Agentic / RAG
    if (/langgraph|langchain|rag|agent|generative ai|genai|llm|deepseek|groq|gemini|prompt/.test(q)) {
      return {
        text: `⚡ **Generative AI & Agentic Systems Expertise:**\nIjlal has deep hands-on expertise building production agentic systems:\n\n• **LangGraph Multi-Agent Workflows**: State graphs, cyclic loops, Human-in-the-Loop checkpointing, and conditional routing.\n• **RAG Pipelines**: Vector embeddings, sentence-transformers, cosine similarity lookup, and grounded section citations.\n• **Model Orchestration**: Groq Cloud (Llama 3.3, DeepSeek-R1), Google Gemini 2.5 Flash, and OpenAI APIs.\n• **Guardrails & Structured Outputs**: Pydantic v2 schemas and validation filters.`,
        actionLink: { label: "View AI & ML Skillsets", tab: "About" }
      };
    }

    // 7. Certifications & Credentials
    if (/certif|license|credential|navttc|kartoa.*letter|digiskills|adan/.test(q)) {
      return {
        text: `📜 **Verified Institutional Credentials:**\n1. **Generative AI & Machine Learning**: NAVTTC · Adan Institute (Credential ID: I-25-1082873) • Completed\n2. **AI Development Internship Letter**: Kartoa Technologies (Jan – Mar 2026)\n3. **Freelancing**: DigiSkills.pk (Credential ID: G7Y4E-29O2J)\n4. **Creative Writing**: DigiSkills.pk (Credential ID: J778U-1J35L)\n\nAll credentials feature 1-click signed PDF viewers and verification links!`,
        actionLink: { label: "Inspect Verified Credentials Ledger", tab: "Certifications" }
      };
    }

    // 8. Work Experience / Internships
    if (/experience|intern|kartoa|alberuni|work|job|employment|history|career/.test(q)) {
      return {
        text: `💼 **Professional Experience:**\n\n• **AI Development Intern @ Kartoa Technologies** (Jan 2026 – Mar 2026):\nBuilt production RAG systems, LangGraph agentic workflows, and model context optimization.\n\n• **Requirement Engineering Intern @ NUML × Alberuni Tech** (Aug 2025 – Oct 2025):\nAuthored client SRS/BRD technical documentation and structured Use Case diagrams.\n\n• **Android Developer FYP Lead @ NUML** (Mar 2025 – Dec 2025):\nLed development of SafeZone parental monitoring Android application.`,
        actionLink: { label: "View Experience Timeline", tab: "About" }
      };
    }

    // 9. Contact / Hire / Reach out
    if (/contact|hire|email|phone|whatsapp|linkedin|reach|call|message|location|gilgit/.test(q)) {
      return {
        text: `📬 **Let's Connect & Collaborate!**\n\n• **Email**: \`${personalInfo.email}\`\n• **WhatsApp**: \`${personalInfo.phone}\`\n• **LinkedIn**: [linkedin.com/in/ijlal-hussain786](${personalInfo.linkedin})\n• **GitHub**: [github.com/Ijlal-Hussaini](${personalInfo.github})\n• **Location**: ${personalInfo.location}\n\nIjlal is actively available for AI engineering roles, full-stack development, and internships!`,
        actionLink: { label: "Open Contact Form", tab: "Contact" }
      };
    }

    // 10. General Skills / Stack
    if (/skill|stack|technolog|tool|python|java|react|node|javascript|flutter/.test(q)) {
      return {
        text: `🛠️ **Ijlal's Core Engineering Toolbox:**\n\n• **Generative AI & ML**: Python (88%), LangGraph (86%), LangChain & RAG (84%), Prompt Engineering (85%), FastAPI (82%)\n• **Android**: Java SDK (88%), Android Studio (85%), Firebase (84%), Material Design (80%), Flutter (55%)\n• **Web & Full-Stack**: React 19 & TypeScript (80%), JS ES6+ (84%), Tailwind CSS (86%), Node & Express (74%), MongoDB (76%)\n• **Software Engineering**: Requirements SRS/BRD (88%), System Design (76%), Git & GitHub (86%)`,
        actionLink: { label: "Explore Detailed Skills Matrix", tab: "About" }
      };
    }

    // Default Fallback
    return {
      text: `I'm here to help you learn all about **Ijlal Hussain**! 🌟\n\nYou can ask me specific questions like:\n• *"What is his CGPA and degree?"*\n• *"Tell me about ResumeIQ & LangGraph"* \n• *"What did he build for Technical Blog Factory?"*\n• *"What is his Android experience with SafeZone?"*\n• *"What verified certifications does he hold?"*`,
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
    }, 450);
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
        className={`fixed z-50 transition-all duration-300 ${
          isScrollTopVisible ? "bottom-22 right-6" : "bottom-6 right-6"
        }`}
      >
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
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
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-[99999] w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[85vh] rounded-3xl glass bg-slate-950/95 border border-white/15 shadow-2xl backdrop-blur-2xl flex flex-col justify-between overflow-hidden text-left"
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
                    <div className="whitespace-pre-line prose-invert font-sans">
                      {msg.text}
                    </div>

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
                  placeholder="Ask about CGPA, ResumeIQ, LangGraph..."
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

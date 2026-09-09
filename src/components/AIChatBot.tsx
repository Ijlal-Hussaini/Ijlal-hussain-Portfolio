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

// Comprehensive known vocabulary used to detect random ungrounded keyboard mash
const KNOWN_VOCABULARY = new Set([
  "hi", "hello", "hey", "salam", "assalam", "aoa", "greetings", "good", "morning", "afternoon", "evening", "night",
  "welcome", "welcoming", "welcomed", "wlcm", "howdy", "hiya", "yo", "bonjour", "namaste", "salut", "cheers", "peace",
  "how", "are", "you", "doing", "is", "he", "what", "where", "why", "when", "who", "which", "can", "could", "would", "should",
  "tell", "show", "give", "list", "see", "view", "find", "get", "download", "talk", "chat", "contact", "call", "email", "mail",
  "phone", "whatsapp", "linkedin", "github", "hire", "work", "job", "available", "availability", "project", "projects",
  "skill", "skills", "tech", "stack", "education", "degree", "university", "school", "college", "cgpa", "gpa", "marks", "grades",
  "resume", "cv", "experience", "internship", "lead", "leadership", "cert", "certs", "certificate", "certificates", "certification", "certifications",
  "android", "java", "python", "ai", "ml", "genai", "generative", "langgraph", "langchain", "rag", "fastapi", "react", "nextjs", "typescript",
  "javascript", "tailwind", "node", "express", "mongo", "mongodb", "firebase", "flutter", "dart", "postman", "figma", "git",
  "english", "urdu", "brushaski", "language", "languages", "gilgit", "islamabad", "pakistan", "time", "timezone", "location", "city", "country",
  "age", "old", "born", "birthday", "salary", "rate", "rates", "budget", "pricing", "interview", "meeting", "pwa", "offline",
  "help", "menu", "options", "commands", "about", "profile", "bio", "background", "summary", "overview", "json", "jason", "data", "info", "information",
  "ok", "okay", "sure", "cool", "nice", "fine", "perfect", "yes", "no", "thanks", "thank", "bye", "goodbye", "weakness", "weaknesses",
  "strengths", "strength", "strong", "best", "great", "awesome", "smart", "clever", "bot", "assistant", "agent", "app", "apps", "website",
  "portfolio", "safezone", "resumeiq", "blogfactory", "factory", "tavily", "adan", "navttc", "cisco", "digiskills", "alberuni", "numl",
  "danyore", "vision", "intermediate", "matriculation", "matric", "fsc", "hssc", "ssc", "bachelor", "bachelors", "bs", "se", "software",
  "engineering", "engineer", "developer", "programmer", "coder", "code", "coding", "write", "generate", "create", "build", "built",
  "maker", "made", "creator", "owner", "author", "boss", "human", "person", "real", "model", "models", "llm", "llms", "groq", "gemini",
  "llama", "deepseek", "chatgpt", "openai", "claude", "free", "freelance", "contract", "fulltime", "parttime", "remote", "onsite",
  "relocate", "relocation", "notice", "period", "now", "today", "immediately", "immediate", "urgent", "start", "join", "joining",
  "details", "detail", "more", "everything", "all", "so", "much", "very", "too", "also", "just", "only", "please", "kindly",
  "me", "my", "i", "we", "our", "us", "it", "its", "this", "that", "these", "those", "there", "here", "their", "them", "they",
  "his", "him", "her", "she", "mr", "sir", "bro", "friend", "dude", "buddy", "man", "guy", "sup", "wassup", "up", "going",
  "well", "ready", "test", "testing", "check", "try", "stroke", "number", "numbers", "digit", "digits", "xyz", "ats", "score",
  "formula", "filter", "blocking", "block", "gps", "tracking", "review", "peer", "codeblock", "vector", "embed", "embeddings",
  "and", "or", "in", "of", "to", "for", "with", "on", "at", "by", "from", "as", "into", "like", "tool", "tools", "platform", "platforms",
  "framework", "frameworks", "library", "libraries", "system", "systems", "application", "applications", "things", "going", "been", "doing",
  "ijlal", "hussain", "hussaini", "ijla", "hussin", "husain", "itjal", "itjall", "ijall", "ejlal"
]);

function isRecognizedToken(token: string): boolean {
  const t = token.toLowerCase();
  if (KNOWN_VOCABULARY.has(t)) return true;
  for (const known of KNOWN_VOCABULARY) {
    const distLimit = known.length <= 4 ? 1 : 2;
    if (Math.abs(t.length - known.length) <= distLimit) {
      if (editDistance(t, known) <= distLimit) {
        return true;
      }
    }
  }
  return false;
}

function hasFuzzyWord(tokens: string[], target: string, maxDist = 2): boolean {
  const targetLower = target.toLowerCase();
  const effectiveMaxDist = targetLower.length <= 4 ? 0 : maxDist;
  return tokens.some((token) => {
    const t = token.toLowerCase();
    if (t === targetLower) return true;
    if (targetLower.length <= 4) {
      return t === targetLower;
    }
    if (Math.abs(t.length - targetLower.length) <= effectiveMaxDist) {
      return editDistance(t, targetLower) <= effectiveMaxDist;
    }
    return false;
  });
}

/**
 * High-performance Memoized Markdown & Rich-Text parser
 * Converts **bold**, *italic*, `code`, ```code blocks```, and [label](url) into clean React elements
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

  // Check if text has fenced code blocks ```...```
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const sections: { type: "text" | "code"; content: string; lang?: string }[] = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      sections.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    sections.push({ type: "code", lang: match[1] || "text", content: match[2].trim() });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    sections.push({ type: "text", content: text.slice(lastIndex) });
  }

  return (
    <div className="space-y-2 leading-relaxed text-xs">
      {sections.map((section, sIdx) => {
        if (section.type === "code") {
          return (
            <pre
              key={sIdx}
              className="p-2.5 rounded-lg bg-card/90 text-cyan-bright font-mono text-[10px] leading-snug overflow-x-auto border border-cyan-bright/20 shadow-inner"
            >
              <code>{section.content}</code>
            </pre>
          );
        }

        const lines = section.content.split("\n");
        return (
          <div key={sIdx} className="space-y-1.5">
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
    { label: "🎓 CGPA (3.96)", query: "What is Ijlal's CGPA?" },
    { label: "🤖 ResumeIQ (AI)", query: "Tell me about ResumeIQ project" },
    { label: "📱 Safe Zone (FYP)", query: "Tell me about Safe Zone Android app" },
    { label: "📝 Blog Factory (AI)", query: "Tell me about Technical Blog Factory" },
    { label: "⚡ LangGraph & RAG", query: "What is his LangGraph and RAG experience?" },
    { label: "🏢 Kartoa Internship", query: "What did he do at Kartoa Technologies?" },
    { label: `📜 Certifications (${certificationsData.length})`, query: "What verified certifications does he have?" },
    { label: "📍 Where is he from?", query: "Where is Ijlal from?" },
    { label: "💼 Available for Hire?", query: "Is Ijlal available for hire?" },
    { label: "📄 JSON Data", query: "Give all the data of portfolio in JSON" },
    { label: "📬 Contact & Resume", query: "How can I contact Ijlal or get his CV?" }
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
   * Deeply trained across all portfolio data (data.ts) with direct, concise answers and strict guardrails.
   */
  const generateGroundedResponse = (rawQuery: string): { text: string; actionLink?: { label: string; tab?: string; url?: string } } => {
    const q = rawQuery.toLowerCase().trim();
    // Normalize punctuation & noise characters
    const cleanWords = q
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const rawTokens = cleanWords.split(/\s+/).filter(Boolean);

    // Normalize common phonetic and typo variations
    const tokens = rawTokens.map((t) => {
      if (/^(itjall|itjal|ijall|ijlla|ijla|ijlall|ijhall|ijlaal|ijlas|ejlal|ejlaal|ijlal)$/.test(t)) return "ijlal";
      if (/^(hussani|hussaini|husain|hussan|hussin|husayn|husein|hussien|hossain|hossin|hussain)$/.test(t)) return "hussain";
      if (/^(cgoa|cgpaa|cgpa|cpa|gpaa|gpa|marks|grades)$/.test(t)) return "cgpa";
      if (/^(softwer|softwere|sofware)$/.test(t)) return "software";
      if (/^(enginerign|enginering|enginnering|enginer)$/.test(t)) return "engineering";
      if (/^(graduat|graduated|grad)$/.test(t)) return "graduate";
      if (/^(numal|noml)$/.test(t)) return "numl";
      if (/^(interess|intrest|intrested|interested)$/.test(t)) return "interest";
      if (/^(develoe|develoepr|developement|developer|dev)$/.test(t)) return "develop";
      if (/^(projekts|projkts|prjcts|projets)$/.test(t)) return "projects";
      if (/^(safezon|safzone|safez)$/.test(t)) return "safezone";
      if (/^(resumieq|resumiq|resumek)$/.test(t)) return "resumeiq";
      if (/^(kartva|kartoas)$/.test(t)) return "kartoa";
      if (/^(alberoni|alberuni|albaruni)$/.test(t)) return "alberuni";
      if (/^(cert|certs|certificate|certificates|certification|certifications)$/.test(t)) return "certification";
      if (/^(navtc|navttc)$/.test(t)) return "navttc";
      if (/^(langgrap|langraph)$/.test(t)) return "langgraph";
      if (/^(langchan|lanchain)$/.test(t)) return "langchain";
      if (/^(tavly|tavili)$/.test(t)) return "tavily";
      return t;
    });

    // Helpers to check for subphrase or typo-tolerant token
    const hasWord = (target: string, maxDist = 2) => hasFuzzyWord(tokens, target, maxDist) || hasFuzzyWord(rawTokens, target, maxDist);
    const contains = (phrase: string) => cleanWords.includes(phrase.toLowerCase()) || tokens.join(" ").includes(phrase.toLowerCase());

    // -------------------------------------------------------------
    // 1. JSON DATA EXPORT QUERY
    // -------------------------------------------------------------
    if (
      hasWord("json") ||
      contains("json") ||
      contains("jason")
    ) {
      const jsonOutput = {
        name: personalInfo.name,
        title: personalInfo.titles[0],
        education: {
          degree: educationData[0].degree,
          institution: educationData[0].institution,
          cgpa: personalInfo.cgpa,
          period: educationData[0].period
        },
        specialization: [
          "Generative AI (LangGraph & RAG)",
          "Native Android Development (Java/Firebase)",
          "Full-Stack Web (React 19/MERN)"
        ],
        projects: [
          "ResumeIQ (AI Career Platform & ATS Auditor)",
          "Technical Blog Post Factory (Multi-Agent AI Studio)",
          "Safe Zone (Parental Control Android App — FYP Lead)",
          "Developer Portfolio (React 19 Web Platform)"
        ],
        experience: [
          "AI Development Intern @ Kartoa Technologies",
          "Requirement Engineering Intern @ NUML × Alberuni Tech",
          "FYP Team Lead @ Safe Zone"
        ],
        certifications_count: certificationsData.length,
        contact: {
          email: personalInfo.email,
          phone: personalInfo.phone,
          location: personalInfo.location,
          linkedin: personalInfo.linkedin,
          github: personalInfo.github
        }
      };

      return {
        text: `\`\`\`json\n${JSON.stringify(jsonOutput, null, 2)}\n\`\`\``,
        actionLink: { label: "Explore Projects", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 2. GREETINGS & SALUTATIONS (Including "welcome", "hi", "salam", etc.)
    // -------------------------------------------------------------
    if (
      /^(hi|hello|hey|salam|assalam|aoa|hy|hola|greetings|welcome|welcome\s*here|howdy|hiya|yo|bonjour|namaste|good\s*(morning|afternoon|evening|day|night))(\s|$)/i.test(cleanWords) ||
      hasWord("hello", 1) ||
      hasWord("salam", 1) ||
      hasWord("welcome", 1) ||
      contains("welcome")
    ) {
      return {
        text: `Hello and welcome! 👋 I'm **Ijlal's AI Assistant**. How can I help you today? Ask me about his software engineering projects (ResumeIQ, SafeZone, Blog Factory), his **3.96 CGPA** at NUML, his Generative AI stack, or how to contact him!`,
        actionLink: { label: "View About & Skills", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 3. CONVERSATIONAL WELL-BEING & SMALL TALK
    // -------------------------------------------------------------
    if (
      contains("how are you") ||
      contains("how r u") ||
      contains("how are u") ||
      contains("how do you do") ||
      contains("how is it going") ||
      contains("hows it going") ||
      contains("how s it going") ||
      contains("are you good") ||
      contains("are you ok") ||
      contains("are you okay") ||
      contains("are you fine") ||
      contains("are you doing well") ||
      contains("how have you been") ||
      contains("what's up") ||
      contains("whats up") ||
      contains("wassup") ||
      contains("sup") ||
      (tokens.includes("how") && (tokens.includes("going") || tokens.includes("doing") || tokens.includes("you") || tokens.includes("things")))
    ) {
      return {
        text: `I'm doing great, thank you for asking! 😊 I'm ready to answer any questions about Ijlal's software engineering projects, skills, education, or career experience. How can I help you today?`,
        actionLink: { label: "Explore Projects", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 4. CONVERSATIONAL ACKNOWLEDGMENTS
    // -------------------------------------------------------------
    const ackWords = ["ok", "okay", "k", "kk", "alright", "sure", "cool", "nice", "fine", "perfect", "yes", "yep", "yeah", "no", "nah", "nope", "understood", "noted", "good", "got", "it", "sounds"];
    if (
      /^(ok|okay|k|kk|alright|sure|cool|nice|got it|fine|perfect|yes|yep|yeah|no|nah|nope|sounds good|understood|noted)$/i.test(cleanWords) ||
      (rawTokens.length <= 3 && rawTokens.every((t) => ackWords.includes(t.toLowerCase())))
    ) {
      return {
        text: `Got it! 👍 Feel free to ask anything else about Ijlal's background, projects, or skills!`,
        actionLink: { label: "Explore Projects", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 5. GRATITUDE & CLOSING
    // -------------------------------------------------------------
    if (/^(thank|thanks|thank\s+you|appreciate|awesome|great|cool|goodbye|bye)(\s|$)/i.test(cleanWords) || hasWord("thanks", 1)) {
      return {
        text: `You're very welcome! 😊 Feel free to reach out to Ijlal directly through the contact section if you'd like to collaborate or connect!`,
        actionLink: { label: "Open Contact Form", tab: "Contact" }
      };
    }

    // -------------------------------------------------------------
    // 6. BOT COMPLIMENTS & PRAISE
    // -------------------------------------------------------------
    if (
      contains("you are smart") ||
      contains("you are cool") ||
      contains("you are great") ||
      contains("you are awesome") ||
      contains("you are good") ||
      contains("you are amazing") ||
      contains("you are fast") ||
      contains("you are helpful") ||
      contains("you are clever") ||
      contains("you're smart") ||
      contains("you're cool") ||
      contains("you're great") ||
      contains("you're awesome") ||
      contains("you're good") ||
      contains("good bot") ||
      contains("nice bot") ||
      contains("smart bot") ||
      contains("cool bot") ||
      contains("great bot") ||
      contains("i love you") ||
      contains("love you")
    ) {
      return {
        text: `Thank you so much! 😊 I'm designed to represent Ijlal's software engineering background as accurately and smoothly as possible. Feel free to explore his projects or reach out directly!`,
        actionLink: { label: "Explore Projects", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 7. CREATOR & ORIGIN
    // -------------------------------------------------------------
    if (
      contains("who made you") ||
      contains("who created you") ||
      contains("who built you") ||
      contains("who developed you") ||
      contains("who programmed you") ||
      contains("who is your creator") ||
      contains("who is your maker") ||
      contains("who is your boss") ||
      contains("who is your owner") ||
      contains("who designed you")
    ) {
      return {
        text: `I was built and trained by **Ijlal Hussain** as part of his high-performance developer portfolio! 🚀 I run 100% in your browser with zero latency and zero external API dependencies.`,
        actionLink: { label: "View About & Skills", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 8. HUMAN VS AI / ARE YOU REAL
    // -------------------------------------------------------------
    if (
      contains("are you a human") ||
      contains("are you human") ||
      contains("are you a real person") ||
      contains("are you real") ||
      contains("are you a bot") ||
      contains("are you an ai") ||
      contains("is this a human") ||
      contains("is this an ai") ||
      contains("is this a bot") ||
      contains("am i talking to ijlal") ||
      contains("am i speaking with ijlal") ||
      contains("am i talking to a human")
    ) {
      return {
        text: `I am Ijlal's **AI Portfolio Assistant**, running 100% in your browser. If you'd like to speak with **Ijlal Hussain directly in person**, you can reach him via email at **${personalInfo.email}**, WhatsApp at **${personalInfo.phone}**, or LinkedIn! 📬`,
        actionLink: { label: "Open Contact Form", tab: "Contact" }
      };
    }

    // -------------------------------------------------------------
    // 9. BOT IDENTITY
    // -------------------------------------------------------------
    if (
      contains("who are you") ||
      contains("what are you") ||
      contains("what is your name") ||
      contains("what do you do") ||
      contains("tell me about yourself") ||
      contains("introduce yourself") ||
      contains("your purpose")
    ) {
      return {
        text: `I am **Ijlal's AI Portfolio Assistant**, running 100% in your browser. I can answer any questions about Ijlal's software engineering projects, academic honors, verified certifications, and skills! 😊`,
        actionLink: { label: "Explore Projects", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 10. HELP / BOT CAPABILITIES / MENU
    // -------------------------------------------------------------
    if (hasWord("help", 0) || contains("what can you do") || contains("menu") || contains("options") || contains("how to use")) {
      return {
        text: `💡 **Here's what you can ask me:**\n• **Academic**: *"What is Ijlal's CGPA?"*, *"Where did he study?"*\n• **Projects**: *"Tell me about ResumeIQ"*, *"SafeZone APK"*, *"Blog Factory"*\n• **AI Tech**: *"LangGraph & RAG experience"*, *"Dual LLM setup"*\n• **Experience**: *"Kartoa internship"*, *"Leadership role"*\n• **Certifications**: *"NAVTTC cert"*, *"Cisco Python cert"*\n• **Hiring & Contact**: *"Why hire Ijlal?"*, *"Is he available?"*, *"Email / WhatsApp"*\n• **Data Export**: *"Give portfolio data in JSON"*`,
        actionLink: { label: "Explore Projects", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 11. RANDOM KEYSTROKES / DIGITS / GIBBERISH (e.g. "134343", "stroke 134343", "asdfgh", "soaidgoasidg")
    // -------------------------------------------------------------
    const isPureDigits = /^\d+$/.test(cleanWords);
    const isNoiseOrStroke = contains("stroke") && /\d+/.test(cleanWords);
    const isShortNoise = cleanWords.length <= 4 && !KNOWN_VOCABULARY.has(cleanWords);
    const lacksVowels = cleanWords.length > 4 && !/[aeiouy]/.test(cleanWords);
    const hasLongRandomSequence = /[bcdfghjklmnpqrstvwxyz]{6,}/i.test(cleanWords);
    const hasNoRecognizedTokens = rawTokens.length > 0 && !rawTokens.some(isRecognizedToken);

    if (isPureDigits || isNoiseOrStroke || isShortNoise || lacksVowels || hasLongRandomSequence || hasNoRecognizedTokens) {
      return {
        text: `Oops! That looks like a random keystroke or number. 🤖\n\nHow can I help you today? You can ask me:\n• *"Who is Ijlal?"*\n• *"What is his CGPA?"*\n• *"What projects has he built?"*\n• *"What is his LangGraph experience?"*\n• *"How can I contact him?"*`,
        actionLink: { label: "Explore All Projects", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 3. OUT-OF-BOUNDS / EXTERNAL CODING / OFF-TOPIC GUARDRAIL
    // -------------------------------------------------------------
    const isGeneralCodingTask = (
      (contains("write a") || contains("write code") || contains("generate code") || contains("write script") || contains("solve this") || contains("calculate") || contains("fix my code") || contains("write python") || contains("write java") || contains("write c") || contains("create code") || contains("write me") || contains("write sql") || contains("write query") || contains("invert binary tree") || contains("quicksort")) &&
      (hasWord("code") || hasWord("script") || hasWord("python") || hasWord("javascript") || hasWord("java") || hasWord("function") || hasWord("algorithm") || hasWord("program") || hasWord("html") || hasWord("css") || hasWord("sql") || hasWord("tree")) &&
      !hasWord("ijlal") && !hasWord("portfolio") && !hasWord("safezone") && !hasWord("resumeiq") && !hasWord("blogfactory")
    );

    const isGeneralTrivia = (
      contains("capital of") ||
      contains("who is the president") ||
      contains("who is prime minister") ||
      contains("who won") ||
      contains("weather in") ||
      contains("tell me a story") ||
      contains("what is photosynthesis") ||
      contains("what is quantum") ||
      contains("bitcoin price") ||
      contains("crypto") ||
      contains("meaning of life") ||
      contains("recipe for") ||
      contains("write an essay") ||
      contains("write a poem") ||
      contains("tell a joke") ||
      contains("calculate") ||
      contains("math") ||
      /\b\d+\s*[\+\-\*\/x]\s*\d+\b/.test(rawQuery) ||
      /^\d+\s*[\+\-\*\/x]\s*\d+$/.test(rawQuery.trim()) ||
      contains("who was einstein")
    );

    if (isGeneralCodingTask || isGeneralTrivia) {
      return {
        text: `Sorry, that's outside my context! 😊 I am Ijlal's dedicated portfolio AI assistant, trained exclusively on his software engineering projects, skills, education, and career experience.\n\nFeel free to ask me anything about Ijlal's work, such as his **ResumeIQ** AI platform or **Safe Zone** Android app!`,
        actionLink: { label: "Explore Ijlal's Projects", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 4. EXACT CGPA / GPA SPECIFIC QUESTION
    // -------------------------------------------------------------
    if (
      hasWord("cgpa", 1) ||
      contains("cgoa") ||
      contains("cgpaa") ||
      contains("what is his cgpa") ||
      contains("what is cgpa") ||
      contains("cgpa of ijlal") ||
      contains("cgpa of hussain") ||
      contains("cgpa of ijlal hussain") ||
      contains("cgpa of ijla") ||
      contains("his gpa") ||
      contains("how much cgpa")
    ) {
      return {
        text: `Ijlal's CGPA is **${personalInfo.cgpa}** (First Class Honors) in BS Software Engineering from NUML Islamabad! 🎓`,
        actionLink: { label: "View Academic Timeline", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 5. WHO IS IJLAL / ABOUT IJLAL (Support first name, last name, full name, and all typos)
    // -------------------------------------------------------------
    if (
      contains("who is ijlal") ||
      contains("who is itjall") ||
      contains("who is ijall") ||
      contains("who is ijla") ||
      contains("who is hussain") ||
      contains("who is hussin") ||
      contains("who is husain") ||
      contains("who is ijlal hussain") ||
      contains("who is ijla hussain") ||
      contains("who is he") ||
      contains("about ijlal") ||
      contains("about hussain") ||
      contains("about ijlal hussain") ||
      contains("tell me about ijlal") ||
      contains("tell me about hussain") ||
      contains("tell me about him") ||
      contains("introduce ijlal") ||
      contains("introduce hussain") ||
      contains("profile of ijlal") ||
      contains("profile of hussain") ||
      contains("background of ijlal") ||
      contains("background of hussain") ||
      (hasWord("who") && (hasWord("ijlal") || hasWord("hussain") || hasWord("he"))) ||
      (hasWord("about") && (hasWord("ijlal") || hasWord("hussain") || hasWord("him")))
    ) {
      return {
        text: `**Ijlal Hussain** is a Software Engineering graduate from NUML Islamabad with an outstanding **3.96 / 4.0 CGPA** (First Class Honors). 🚀\n\nHe specializes in **Generative AI (LangGraph multi-agent systems & RAG)**, **Native Android Development (Java/Firebase)**, and **Full-Stack Web (React 19/MERN)**. He was the Team Lead for the Safe Zone Parental Control FYP and completed AI Engineering internships at Kartoa Technologies and Alberuni Tech.`,
        actionLink: { label: "View Full Profile", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 6. TIMEZONE & LOCAL TIME
    // -------------------------------------------------------------
    if (contains("time in pakistan") || contains("what time is it") || contains("local time") || contains("pkt time") || contains("pakistan time") || (contains("timezone") && !contains("work") && !contains("remote"))) {
      return {
        text: `⏰ **Local Timezone:**\nIjlal is based in Pakistan (**UTC+5 / PKT**). Current local time is **${getPKTTime()}**.`,
        actionLink: { label: "Open Contact Form", tab: "Contact" }
      };
    }

    // -------------------------------------------------------------
    // 7. DUAL LLM ORCHESTRATION (GROQ + GEMINI)
    // -------------------------------------------------------------
    if (hasWord("groq", 1) || hasWord("gemini", 1) || contains("dual llm") || contains("groq and gemini") || contains("llama 3") || contains("which llm") || contains("what models")) {
      return {
        text: `⚡ **Dual LLM Orchestration:**\nIjlal couples **Groq Cloud (Llama-3.3-70B-Versatile)** for ultra-low latency sub-second inference with automatic failover to **Google Gemini 2.5 Flash** for high availability and rich multimodal reasoning.`,
        actionLink: { label: "Inspect ResumeIQ Project", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 8. RESUMEIQ LIVE DEMO SPECIFIC
    // -------------------------------------------------------------
    if (hasWord("resumeiq", 1) && (contains("demo") || contains("live") || contains("url") || contains("try") || contains("link") || contains("launch"))) {
      return {
        text: `🤖 **ResumeIQ Live Platform:**\nResumeIQ is live on Vercel! Click the link below to test the 7-node LangGraph ATS parsing engine with your own resume or test benchmark profiles. 🚀`,
        actionLink: { label: "Launch ResumeIQ Live Demo", url: "https://resumeiq-cvparser.vercel.app/" }
      };
    }

    // -------------------------------------------------------------
    // 9. RESUMEIQ GOOGLE XYZ FORMULA SPECIFIC
    // -------------------------------------------------------------
    if (contains("xyz formula") || contains("google xyz") || contains("xyz bullet")) {
      return {
        text: `💡 **Google XYZ Bullet Formula in ResumeIQ:**\nResumeIQ optimizes resume experience bullets using Google's proven framework:\n*"Accomplished [X] as measured by [Y], by doing [Z]"*\n\nThis structures vague statements into high-impact, quantifiable achievements for hiring managers.`,
        actionLink: { label: "Inspect ResumeIQ Project", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 10. RESUMEIQ ATS AUDIT & SCORING SPECIFIC
    // -------------------------------------------------------------
    if (contains("ats score") || contains("how does ats work") || contains("ats audit") || contains("ats parser") || contains("ats compliance")) {
      return {
        text: `📊 **ResumeIQ ATS Compliance Auditor:**\nResumeIQ performs a comprehensive multi-criteria machine readability audit:\n• Standard heading detection (Experience, Education, Skills)\n• Action verb strength & active voice scoring\n• Missing critical keywords vs target Job Description\n• Clean contact header & degree format validation`,
        actionLink: { label: "Inspect ResumeIQ Project", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 11. RESUMEIQ PROJECT DEEP DIVE
    // -------------------------------------------------------------
    if (hasWord("resumeiq", 1) || contains("resume iq") || contains("cv parser") || contains("resume parser")) {
      return {
        text: `🤖 **ResumeIQ — AI Career Intelligence Platform:**\nAn enterprise-grade platform built with a **7-node cyclic LangGraph state machine**, local sentence-transformers RAG retrieval, ATS score compliance auditing, Google XYZ bullet optimization, and Groq/Gemini dual LLM orchestration.`,
        actionLink: { label: "Inspect ResumeIQ Project", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 12. SAFEZONE APK DOWNLOAD SPECIFIC
    // -------------------------------------------------------------
    if ((hasWord("safezone", 1) || contains("safe zone")) && (contains("apk") || contains("download") || contains("install") || contains("get app"))) {
      return {
        text: `📱 **Download SafeZone APK:**\nYou can download the compiled Safe Zone Android application APK directly using the button below!`,
        actionLink: { label: "Download SafeZone APK", url: "/downloads/SafeZone.apk" }
      };
    }

    // -------------------------------------------------------------
    // 13. SAFEZONE APP & WEB BLOCKING LOGIC SPECIFIC
    // -------------------------------------------------------------
    if ((hasWord("safezone", 1) || contains("safe zone")) && (contains("how does it block") || contains("accessibility") || contains("device admin") || contains("block apps") || contains("block website"))) {
      return {
        text: `🛡️ **Safe Zone App & Web Blocking Architecture:**\nSafe Zone utilizes low-level Android system APIs:\n• **AccessibilityService**: Intercepts foreground window state changes to prevent launching restricted apps\n• **DevicePolicyManager (Device Admin API)**: Enforces remote lockouts and prevents unauthorized app uninstallation\n• **UsageStatsManager**: Monitors exact screen-time durations\n• **Firebase Realtime DB**: Synchronizes parental rules in milliseconds`,
        actionLink: { label: "Inspect SafeZone App", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 14. FYP / SAFE ZONE PROJECT DEEP DIVE
    // -------------------------------------------------------------
    if (hasWord("fyp", 0) || contains("final year project") || contains("safe zone") || hasWord("safezone", 1) || contains("parental control")) {
      return {
        text: `📱 **Safe Zone — Parental Control Android App (FYP Lead):**\nIjlal served as the **Team Lead** for Safe Zone, a complete dual-app parental monitoring ecosystem built with **Java, Android SDK, and Firebase**. It features real-time GPS geofencing, remote screen-time scheduling, and category-based web content filtering.`,
        actionLink: { label: "Inspect SafeZone Android App", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 15. TECHNICAL BLOG FACTORY LIVE DEMO SPECIFIC
    // -------------------------------------------------------------
    if ((hasWord("factory", 2) || hasWord("blog", 1)) && (contains("demo") || contains("live") || contains("url") || contains("try") || contains("link") || contains("launch"))) {
      return {
        text: `📝 **Technical Blog Post Factory Live Demo:**\nBlog Factory is live on Render! Click the link below to launch the autonomous 3-agent publishing studio with live Tavily fact-checking. ⚡`,
        actionLink: { label: "Launch Blog Factory Demo", url: "https://technical-blog-factory.onrender.com/" }
      };
    }

    // -------------------------------------------------------------
    // 16. TECHNICAL BLOG FACTORY TAVILY & PROJECT DEEP DIVE
    // -------------------------------------------------------------
    if (hasWord("factory", 2) || (hasWord("blog", 1) && (hasWord("post", 1) || hasWord("writer", 1) || hasWord("creator", 1))) || hasWord("tavily", 1)) {
      return {
        text: `📝 **Technical Blog Post Factory:**\nAn autonomous **3-agent LangGraph** publishing studio featuring a Content Writer, Technical Reviewer with live **Tavily AI web search fact-checking**, and an automated syntax-verified runnable code generator with 1-click vector PDF export.`,
        actionLink: { label: "Inspect Technical Blog Factory", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 17. DEVELOPER PORTFOLIO PROJECT SPECIFIC
    // -------------------------------------------------------------
    if (
      hasWord("portfolio") &&
      (contains("built") || contains("how") || contains("stack") || contains("source") || contains("code") || contains("tech") || contains("website"))
    ) {
      return {
        text: `🌐 **Developer Portfolio:**\nIjlal's personal web platform built with **React 19, TypeScript, Vite 6, Tailwind CSS v4, Lucide Icons, and Motion**. It features a 100% client-side grounded AI Assistant, modern dark cosmic theme, persistent URL hash routing, and PWA capability.`,
        actionLink: { label: "View Portfolio Source on GitHub", url: "https://github.com/Ijlal-Hussaini/Ijlal-hussain-Portfolio" }
      };
    }

    // -------------------------------------------------------------
    // 18. ALL PROJECTS OVERVIEW / NAMES / LIST
    // -------------------------------------------------------------
    if (
      (hasWord("project") || hasWord("projects") || contains("portfolio items") || contains("apps built") || contains("what he built") || contains("all projects")) &&
      (hasWord("list") || hasWord("all") || hasWord("show") || hasWord("tell") || hasWord("name") || hasWord("names") || hasWord("how many") || hasWord("what") || contains("overview")) &&
      !hasWord("resumeiq", 1) && !hasWord("safezone", 1) && !hasWord("factory", 1)
    ) {
      return {
        text: `📋 **Ijlal's Featured Projects (${projectsData.length} Total):**\n\n1. 🤖 **ResumeIQ** (AI Career Intelligence & ATS Auditor)\n2. 📝 **Technical Blog Post Factory** (Multi-Agent AI Studio)\n3. 📱 **Safe Zone** (Parental Control Android App — FYP Lead)\n4. 🌐 **Developer Portfolio** (React 19 & Tailwind Web Platform)`,
        actionLink: { label: "Explore All Projects", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 19. RESUME / CV DOWNLOAD
    // -------------------------------------------------------------
    if (
      hasWord("cv", 0) ||
      hasWord("resume", 1) ||
      contains("download cv") ||
      contains("download resume") ||
      contains("get cv") ||
      contains("get resume") ||
      contains("his resume") ||
      contains("his cv")
    ) {
      return {
        text: `You can download or view Ijlal's official software engineering CV in verified PDF format by clicking the link below! 📄`,
        actionLink: { label: "Download Official CV (PDF)", url: personalInfo.resumeUrl }
      };
    }

    // -------------------------------------------------------------
    // 20. FULL EDUCATION VS UNIVERSITY / DEGREE
    // -------------------------------------------------------------
    const isFullEducation = (
      contains("full education") ||
      contains("all education") ||
      contains("education background") ||
      contains("academic background") ||
      contains("education history") ||
      (hasWord("education") && (contains("all") || contains("detail") || contains("full")))
    );

    if (isFullEducation) {
      return {
        text: `🎓 **Ijlal's Educational Background:**\n• **BS Software Engineering** (NUML Islamabad, ${educationData[0].period}) — **${educationData[0].grade}**\n• **Intermediate (Computer Science)** (Govt Boys Degree College, Danyore Gilgit, ${educationData[1].period}) — ${educationData[1].grade}\n• **Matriculation (General Science)** (Vision Higher Secondary School, Danyore Gilgit, ${educationData[2].period}) — ${educationData[2].grade}`,
        actionLink: { label: "View Academic Timeline", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 21. INTERMEDIATE COLLEGE SPECIFIC
    // -------------------------------------------------------------
    if (hasWord("intermediate", 1) || contains("danyore college") || contains("fsc") || contains("hssc")) {
      return {
        text: `🏫 **Intermediate (Computer Science):**\nIjlal completed his Intermediate in Computer Science at **Govt Boys Degree College, Danyore Gilgit** (${educationData[1].period}) with **${educationData[1].grade}**.`,
        actionLink: { label: "View Academic Timeline", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 22. MATRICULATION SCHOOL SPECIFIC
    // -------------------------------------------------------------
    if (hasWord("matriculation", 1) || hasWord("matric", 1) || contains("vision school") || contains("high school") || contains("ssc")) {
      return {
        text: `🏫 **Matriculation (General Science):**\nIjlal completed his Matriculation at **Vision Higher Secondary School, Danyore Gilgit** (${educationData[2].period}) with **${educationData[2].grade}**.`,
        actionLink: { label: "View Academic Timeline", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 23. UNIVERSITY DEGREE (NUML) SPECIFIC
    // -------------------------------------------------------------
    if (
      hasWord("university", 2) ||
      hasWord("graduated", 2) ||
      hasWord("numl", 1) ||
      hasWord("degree", 1) ||
      contains("where did he study") ||
      contains("which university") ||
      contains("where he graduated")
    ) {
      return {
        text: `Ijlal graduated with a **Bachelor of Science in Software Engineering (BS SE)** from the **National University of Modern Languages (NUML), Islamabad** (${educationData[0].period}) with a **${educationData[0].grade}**! 🎓`,
        actionLink: { label: "View Academic Timeline", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 24. LOCATION / WHERE IS HE FROM / WHERE DOES HE LIVE
    // -------------------------------------------------------------
    if (
      ((hasWord("where", 1) || hasWord("wher", 1)) && (hasWord("from", 1) || hasWord("live", 1) || hasWord("located", 2) || hasWord("he", 0) || hasWord("ijlal", 1))) ||
      hasWord("location", 2) ||
      hasWord("city", 1) ||
      hasWord("country", 2) ||
      hasWord("hometown", 2) ||
      hasWord("origin", 2) ||
      hasWord("gilgit", 1) ||
      (hasWord("pakistan", 2) && !contains("time"))
    ) {
      return {
        text: `Ijlal is originally from the beautiful valley of **Gilgit, Pakistan** 🏔️ and completed his software engineering degree in **Islamabad**. He is actively open to **remote roles globally** as well as on-site positions in Islamabad!`,
        actionLink: { label: "Contact Ijlal", tab: "Contact" }
      };
    }

    // -------------------------------------------------------------
    // 25. AGE / HOW OLD IS HE
    // -------------------------------------------------------------
    if (
      (tokens.includes("age") && !tokens.includes("language") && !tokens.includes("languages")) ||
      contains("how old") ||
      contains("his age") ||
      hasWord("born", 1) ||
      contains("birthday") ||
      contains("date of birth")
    ) {
      return {
        text: `Ijlal is in his **early 20s** and graduated with his BS in Software Engineering in early 2026. 🎂`,
        actionLink: { label: "View Full Profile", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 26. EMAIL SPECIFIC QUESTION
    // -------------------------------------------------------------
    if (hasWord("email", 1) || contains("mail address") || contains("how to email") || contains("send email")) {
      return {
        text: `Ijlal's official email address is **${personalInfo.email}**. Feel free to send him a direct message anytime! ✉️`,
        actionLink: { label: "Send Direct Email", url: `mailto:${personalInfo.email}` }
      };
    }

    // -------------------------------------------------------------
    // 27. PHONE / WHATSAPP SPECIFIC QUESTION
    // -------------------------------------------------------------
    if (hasWord("whatsapp", 2) || hasWord("phone", 1) || contains("call him") || contains("call me") || contains("contact number") || contains("mobile number")) {
      return {
        text: `You can reach Ijlal on WhatsApp or Phone at **${personalInfo.phone}**! 📱`,
        actionLink: { label: "Chat on WhatsApp", url: `https://wa.me/${personalInfo.phone.replace(/[^0-9]/g, "")}` }
      };
    }

    // -------------------------------------------------------------
    // 28. LINKEDIN PROFILE SPECIFIC
    // -------------------------------------------------------------
    if (hasWord("linkedin", 2) || contains("linked in")) {
      return {
        text: `Connect with Ijlal on LinkedIn: [linkedin.com/in/ijlal-hussain786](${personalInfo.linkedin}) 💼`,
        actionLink: { label: "Open LinkedIn Profile", url: personalInfo.linkedin }
      };
    }

    // -------------------------------------------------------------
    // 29. GITHUB & OPEN SOURCE REPOS SPECIFIC
    // -------------------------------------------------------------
    if (hasWord("github", 2) || contains("git hub") || contains("repositories") || contains("open source")) {
      return {
        text: `Explore Ijlal's open-source projects and code repositories on GitHub: [github.com/Ijlal-Hussaini](${personalInfo.github}) 🐙`,
        actionLink: { label: "Open GitHub Profile", url: personalInfo.github }
      };
    }

    // -------------------------------------------------------------
    // 30. WHY HIRE IJLAL / STRENGTHS
    // -------------------------------------------------------------
    if (
      (hasWord("why") && (hasWord("hire", 1) || hasWord("choose", 1) || hasWord("select", 1))) ||
      hasWord("strength", 2) ||
      hasWord("strengths", 2) ||
      contains("why hire") ||
      contains("why should i hire") ||
      contains("what makes him stand out")
    ) {
      return {
        text: `🌟 **Why Hire Ijlal Hussain?**\n• **Top Academic Standing**: **3.96 / 4.0 CGPA** at NUML Islamabad\n• **Production AI Expertise**: Built real-world LangGraph cyclic multi-agent graphs and RAG pipelines\n• **Proven Leadership**: Led the Safe Zone Android FYP team\n• **6 Verified Credentials**: Official NAVTTC, Cisco, and DigiSkills certifications\n• **Versatility**: Full-stack agility across AI, Mobile, and Web`,
        actionLink: { label: "Open Contact Form", tab: "Contact" }
      };
    }

    // -------------------------------------------------------------
    // 31. WEAKNESSES / LEARNING GOALS
    // -------------------------------------------------------------
    if (hasWord("weakness", 2) || hasWord("weaknesses", 2) || contains("areas of improvement") || contains("what is he learning")) {
      return {
        text: `🎯 **Continuous Growth & Learning Focus:**\nIjlal is constantly pushing his engineering boundaries. His current focus areas include:\n• Distributed LLM fine-tuning & quantization (LoRA/QLoRA)\n• High-scale Kubernetes & Docker container orchestration\n• Advanced Graph-RAG architectures for complex knowledge retrieval`,
        actionLink: { label: "View Skills", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 32. WORK AVAILABILITY / JOB SEARCH / NOTICE PERIOD
    // -------------------------------------------------------------
    if (
      hasWord("available", 2) ||
      contains("looking for a job") ||
      contains("open to work") ||
      contains("notice period") ||
      contains("when can he start") ||
      contains("full time") ||
      contains("part time") ||
      contains("contract") ||
      contains("freelance") ||
      contains("free to work") ||
      (hasWord("free") && hasWord("work"))
    ) {
      return {
        text: `💼 **Work Availability:**\nIjlal is actively open to **Full-time**, **Contract**, and **Freelance** engineering roles. His notice period is **Immediate (0 days)**!`,
        actionLink: { label: "Send Hire Message", tab: "Contact" }
      };
    }

    // -------------------------------------------------------------
    // 33. REMOTE WORK & TIMEZONES
    // -------------------------------------------------------------
    if (hasWord("remote", 1) || hasWord("relocate", 2) || contains("timezone") || contains("us time") || contains("uk time") || contains("work from home")) {
      return {
        text: `🌍 **Remote & Global Flexibility:**\nIjlal is available immediately for **remote roles worldwide** with flexible working overlap for **US (EST/PST)**, **UK/Europe (GMT/CET)**, and **Gulf/Asia (GST/PKT)** timezones!`,
        actionLink: { label: "Contact for Remote Work", tab: "Contact" }
      };
    }

    // -------------------------------------------------------------
    // 34. EXPECTED SALARY / COMPENSATION / RATES
    // -------------------------------------------------------------
    if (contains("salary") || contains("compensation") || contains("rate") || contains("rates") || contains("pricing") || contains("budget") || contains("how much does he charge")) {
      return {
        text: `💼 **Compensation & Rates:**\nIjlal's compensation is open to discussion based on role responsibilities, contract type (Full-Time vs Contract), and industry standards. Feel free to reach out directly to discuss offers!`,
        actionLink: { label: "Discuss Offer", tab: "Contact" }
      };
    }

    // -------------------------------------------------------------
    // 35. INTERVIEW SCHEDULING / MEETING
    // -------------------------------------------------------------
    if (contains("schedule interview") || contains("interview") || contains("book meeting") || contains("schedule a call") || contains("talk with him")) {
      return {
        text: `📅 **Schedule an Interview with Ijlal:**\nYou can easily book an introductory interview or technical discussion:\n• **Email**: ${personalInfo.email}\n• **WhatsApp**: ${personalInfo.phone}\n• **Contact Form**: Use the interactive contact section below!`,
        actionLink: { label: "Open Contact Form", tab: "Contact" }
      };
    }

    // -------------------------------------------------------------
    // 36. GENERAL CONTACT
    // -------------------------------------------------------------
    if (hasWord("contact", 2) || contains("how to contact") || contains("reach out") || contains("connect with him")) {
      return {
        text: `You can connect with Ijlal directly through:\n• **Email**: ${personalInfo.email}\n• **WhatsApp/Phone**: ${personalInfo.phone}\n• **LinkedIn**: [linkedin.com/in/ijlal-hussain786](${personalInfo.linkedin})\n• **GitHub**: [github.com/Ijlal-Hussaini](${personalInfo.github})`,
        actionLink: { label: "Open Contact Form", tab: "Contact" }
      };
    }

    // -------------------------------------------------------------
    // 37. KARTOA TECHNOLOGIES INTERNSHIP
    // -------------------------------------------------------------
    if (hasWord("kartoa", 1)) {
      return {
        text: `🏢 **AI Development Intern @ Kartoa Technologies (Jan – Mar 2026):**\nIjlal built production-grade **RAG pipelines** and **LangGraph multi-agent workflows**, while optimizing LLM token limits and context window accuracy.`,
        actionLink: { label: "View Experience Details", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 38. ALBERUNI TECH / REQUIREMENTS ENGINEERING INTERNSHIP
    // -------------------------------------------------------------
    if (hasWord("alberuni", 2) || contains("requirement engineering") || contains("srs") || contains("brd")) {
      return {
        text: `📑 **Requirement Engineering Intern @ NUML × Alberuni Tech (Aug – Oct 2025):**\nIjlal gathered commercial software requirements, authoring standardized **Software Requirements Specifications (SRS)**, **BRDs**, and **UML Use Case diagrams**.`,
        actionLink: { label: "View Experience Details", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 39. LEADERSHIP & TEAM MANAGEMENT
    // -------------------------------------------------------------
    if (hasWord("leadership", 2) || contains("lead a team") || contains("team lead") || contains("lead developer")) {
      return {
        text: `👑 **Leadership Experience:**\nAs the **FYP Team Lead for Safe Zone**, Ijlal led a 4-developer engineering team through architecture design, sprint planning, Figma UI prototyping, Java development, and final university defense.`,
        actionLink: { label: "Inspect SafeZone App", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 40. NAVTTC GENERATIVE AI CERTIFICATION
    // -------------------------------------------------------------
    if (hasWord("navttc", 1) || contains("adan institute") || contains("navttc certificate")) {
      return {
        text: `📜 **Generative AI & Machine Learning Certification:**\nIssued by **NAVTTC & Adan Institute of Technology** (Sep – Dec 2025, Credential ID: \`I-25-1082873\`). Covers Python, ML fundamentals, LLM prompting, and agentic systems.`,
        actionLink: { label: "Inspect NAVTTC Certificate", tab: "Certifications" }
      };
    }

    // -------------------------------------------------------------
    // 41. CISCO PYTHON CERTIFICATION
    // -------------------------------------------------------------
    if (hasWord("cisco", 1) || contains("python essentials")) {
      return {
        text: `📜 **Python Essentials 1 Certification:**\nIssued by **Cisco Networking Academy & OpenEDG** (Aug 2025), validating core Python data structures, algorithms, and OOP principles.`,
        actionLink: { label: "Inspect Cisco Certificate", tab: "Certifications" }
      };
    }

    // -------------------------------------------------------------
    // 42. DIGISKILL CERTIFICATIONS
    // -------------------------------------------------------------
    if (hasWord("digiskill", 2) || contains("digiskills") || contains("ministry of it") || contains("freelancing cert") || contains("graphic design cert")) {
      return {
        text: `📜 **DigiSkills Certifications (Ministry of IT Pakistan, Aug – Nov 2025):**\n• **Freelancing** (Credential ID: \`JGJ2JHXMK\`)\n• **Graphic Design** (Credential ID: \`AKNNZS4MK\`)`,
        actionLink: { label: "Inspect DigiSkills Certificates", tab: "Certifications" }
      };
    }

    // -------------------------------------------------------------
    // 43. ALL CERTIFICATIONS / VERIFIED CREDENTIALS
    // -------------------------------------------------------------
    if (
      hasWord("certificate", 2) ||
      hasWord("certification", 2) ||
      hasWord("credential", 2) ||
      hasWord("credentials", 2)
    ) {
      return {
        text: `📜 **Verified Institutional Certifications (${certificationsData.length} Total):**\n1. **Generative AI & Machine Learning** (NAVTTC · Adan Institute, Sep – Dec 2025)\n2. **AI Development Internship** (Kartoa Technologies, Jan – Mar 2026)\n3. **Python Essentials 1** (Cisco Networking Academy · OpenEDG, Jan 2026)\n4. **Freelancing** (DigiSkills · Ministry of IT, Aug – Nov 2025)\n5. **Graphic Design** (DigiSkills · Ministry of IT, Aug – Nov 2025)\n6. **Requirements Engineering** (NUML × Alberuni Tech, Aug – Oct 2025)`,
        actionLink: { label: "Inspect All Verified Certificates", tab: "Certifications" }
      };
    }

    // -------------------------------------------------------------
    // 44. LANGCHAIN VS LANGGRAPH COMPARISON
    // -------------------------------------------------------------
    if (contains("langchain vs langgraph") || contains("langgraph vs langchain") || contains("difference between langchain and langgraph")) {
      return {
        text: `⚖️ **LangChain vs LangGraph Architecture:**\n• **LangChain**: Best for linear DAG chains, prompt templates, and standard RAG retrieval.\n• **LangGraph**: Enables **cyclic, stateful multi-agent graphs** with conditional loops, persistence, human-in-the-loop, and autonomous self-correction (as built in ResumeIQ and Blog Factory).`,
        actionLink: { label: "Inspect AI Projects", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 45. RAG & VECTOR SEARCH ARCHITECTURE SPECIFIC
    // -------------------------------------------------------------
    if (contains("how does rag work") || contains("rag pipeline") || contains("vector search") || contains("sentence transformers") || (hasWord("rag", 0) && (contains("architecture") || contains("work") || contains("how")))) {
      return {
        text: `🔍 **Ijlal's RAG Architecture:**\n• **Local Embeddings**: Uses \`sentence-transformers\` (all-MiniLM-L6-v2) for instant sub-10ms vector representation without external API overhead\n• **Cosine Ranking**: Performs similarity search against indexed document chunks\n• **Grounded Citations**: Dynamically injects retrieved chunks into LLM system prompts, ensuring 100% zero-hallucination verification.`,
        actionLink: { label: "Inspect ResumeIQ Project", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 46. SPECIFIC SKILL: PYTHON
    // -------------------------------------------------------------
    if (hasWord("python", 1)) {
      return {
        text: `🐍 **Python (88% Proficiency):**\nIjlal uses Python for **Generative AI multi-agent state machines (LangGraph)**, **RAG pipelines (LangChain)**, and **FastAPI microservices**, backed by Cisco Python certification.`,
        actionLink: { label: "View Skills Breakdown", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 47. SPECIFIC SKILL: JAVA & ANDROID
    // -------------------------------------------------------------
    if (hasWord("java", 1) || (hasWord("android") && (hasWord("sdk") || hasWord("studio")))) {
      return {
        text: `☕ **Java & Android (88% Proficiency):**\nIjlal builds native Android apps using **Java, Android SDK, Android Studio, and Firebase Realtime Database**, demonstrated in his Safe Zone FYP.`,
        actionLink: { label: "Inspect SafeZone App", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 48. SPECIFIC SKILL: LANGGRAPH / RAG / GENERATIVE AI
    // -------------------------------------------------------------
    if (
      hasWord("langgraph", 2) ||
      hasWord("langchain", 2) ||
      hasWord("rag", 0) ||
      hasWord("agent", 1) ||
      contains("generative ai") ||
      contains("genai") ||
      contains("prompt engineering") ||
      contains("guardrail") ||
      contains("prompt")
    ) {
      return {
        text: `⚡ **LangGraph & Generative AI (86% Proficiency):**\nIjlal engineers **cyclic multi-agent workflows**, local RAG citation engines with sentence-transformers embeddings, and dual-LLM orchestration (Groq Cloud + Google Gemini 2.5).`,
        actionLink: { label: "Inspect AI Projects", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 49. SPECIFIC SKILL: REACT, NEXT.JS & WEB
    // -------------------------------------------------------------
    if (hasWord("react", 1) || hasWord("nextjs", 2) || hasWord("typescript", 2) || hasWord("frontend", 1) || (hasWord("web") && (hasWord("dev") || hasWord("development")))) {
      return {
        text: `⚛️ **Full-Stack Web Stack:**\nIjlal builds modern web platforms with **React 19, Next.js 16, TypeScript, Node.js, Express, MongoDB (MERN), and Tailwind CSS v4**.`,
        actionLink: { label: "View Skills Breakdown", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 50. SPECIFIC SKILL: FASTAPI & BACKEND
    // -------------------------------------------------------------
    if (hasWord("fastapi", 1) || (hasWord("backend") && hasWord("api")) || hasWord("pydantic", 1)) {
      return {
        text: `⚙️ **FastAPI & Backend Engineering (82% Proficiency):**\nIjlal builds asynchronous REST APIs and AI microservices using **FastAPI, Pydantic v2, and Node.js/Express**, integrating LLMs and vector search endpoints.`,
        actionLink: { label: "View Skills Breakdown", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 51. SPECIFIC SKILL: DATABASES & MERN
    // -------------------------------------------------------------
    if (hasWord("database", 2) || hasWord("databases", 2) || hasWord("mongodb", 2) || hasWord("firebase", 2) || (hasWord("sql", 0) && !hasWord("code"))) {
      return {
        text: `🗄️ **Database & Cloud Storage Stack:**\n• **Firebase Realtime Database (84%)**: Sub-second cloud state synchronization\n• **MongoDB (76%)**: Document storage for MERN web applications\n• **Vector Stores**: ChromaDB / FAISS semantic embeddings for RAG pipelines\n• **SQL**: Relational database modeling fundamentals`,
        actionLink: { label: "View Skills Breakdown", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 52. SPECIFIC SKILL: FLUTTER & DART
    // -------------------------------------------------------------
    if (hasWord("flutter", 1) || hasWord("dart", 1)) {
      return {
        text: `📱 **Flutter & Cross-Platform (55% Proficiency):**\nIjlal has foundational cross-platform mobile experience with **Flutter & Dart**, complementing his deep expertise in **Native Java Android**.`,
        actionLink: { label: "View Skills Breakdown", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 53. TOOLS: GIT, POSTMAN, FIGMA, VS CODE
    // -------------------------------------------------------------
    if (hasWord("figma", 1) || hasWord("postman", 1) || (hasWord("tool", 0) || hasWord("tools", 0))) {
      return {
        text: `🛠️ **Engineering Tools & Platforms:**\n• **Git & GitHub (86%)**: Version control & collaborative workflows\n• **VS Code (88%) & Android Studio (85%)**: Primary development IDEs\n• **Postman (78%)**: REST API automated testing\n• **Figma (72%)**: Wireframing & UI/UX prototyping`,
        actionLink: { label: "View Skills Breakdown", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 54. SPOKEN LANGUAGES
    // -------------------------------------------------------------
    if (contains("spoken language") || contains("what languages does he speak") || contains("languages") || contains("english") || contains("urdu") || contains("brushaski") || contains("mother tongue")) {
      return {
        text: `🗣️ **Spoken Languages:**\n• **English**: Professional Working Proficiency (70%)\n• **Urdu**: Native / Fluent (100%)\n• **Brushaski**: Mother Tongue (100%)`,
        actionLink: { label: "View Full Profile", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 55. GENERAL SKILLS / TECH STACK MATRIX
    // -------------------------------------------------------------
    if (hasWord("skill", 2) || hasWord("skills", 2) || hasWord("stack", 1) || contains("tech stack") || contains("technologies")) {
      return {
        text: `🛠️ **Core Technical Skills:**\n• **Generative AI**: LangGraph (86%), LangChain & RAG (84%), Python (88%), FastAPI (82%)\n• **Mobile Development**: Java & Android SDK (88%), Firebase (84%), Flutter (55%)\n• **Web Development**: React 19 & Next.js (80%), TypeScript, Node.js, MongoDB (76%)\n• **Engineering & Tools**: Requirements Engineering (88%), Git & GitHub (86%), Figma (72%)`,
        actionLink: { label: "View Complete Skills Matrix", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 56. PWA & OFFLINE CAPABILITY
    // -------------------------------------------------------------
    if (hasWord("pwa", 0) || contains("install app") || contains("offline")) {
      return {
        text: `📱 **Progressive Web App (PWA):**\nThis portfolio is an installable PWA! You can install it on your mobile home screen or desktop for fast app-like access with offline caching.`,
        actionLink: { label: "Explore Projects", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 66. CONCISE GENERAL GROUNDED FALLBACK
    // -------------------------------------------------------------
    return {
      text: `I'm here to answer questions about **Ijlal Hussain**! 🌟\n\nTry asking me:\n• *"Who is Ijlal?"*\n• *"What is his CGPA?"*\n• *"What projects has he built?"*\n• *"What did he do at Kartoa?"*\n• *"How can I contact him?"*`,
      actionLink: { label: "View All Projects", tab: "Projects" }
    };
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();

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
      try {
        const response = generateGroundedResponse(text);
        const botMsg: Message = {
          id: "bot-" + Date.now(),
          sender: "bot",
          text: response.text,
          actionLink: response.actionLink,
          timestamp: "Just now"
        };

        setMessages((prev) => [...prev, botMsg]);
      } catch (err) {
        console.error("AI ChatBot runtime error:", err);
        setMessages((prev) => [
          ...prev,
          {
            id: "bot-" + Date.now(),
            sender: "bot",
            text: `I'm here to answer questions about **Ijlal Hussain**! 🌟\n\nTry asking me:\n• *"Who is Ijlal?"*\n• *"What is his CGPA?"*\n• *"What projects has he built?"*`,
            actionLink: { label: "View All Projects", tab: "Projects" },
            timestamp: "Just now"
          }
        ]);
      } finally {
        setIsTyping(false);
      }
    }, 300);
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

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
 * Check if any token matches the target word fuzzily with typo tolerance
 */
function hasFuzzyWord(tokens: string[], target: string, maxDist = 2): boolean {
  const targetLower = target.toLowerCase();
  return tokens.some((token) => {
    const t = token.toLowerCase();
    if (t === targetLower) return true;
    // Substring match for tokens of length >= 3
    if (t.length >= 3 && targetLower.length >= 3 && (t.includes(targetLower) || targetLower.includes(t))) {
      return true;
    }
    // Allow edit distance of 1 for 3-letter words (e.g. gpa vs cpa / gpaa)
    if (targetLower.length === 3) {
      return editDistance(t, targetLower) <= 1;
    }
    if (targetLower.length <= 2) {
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
      if (/^(itjall|itjal|ijall|ijlla|ijla|ijlall|ijhall|ijlaal|ijlas)$/.test(t)) return "ijlal";
      if (/^(hussani|husain|hussan|hussin)$/.test(t)) return "hussain";
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
      return t;
    });

    // Helpers to check for subphrase or typo-tolerant token
    const hasWord = (target: string, maxDist = 2) => hasFuzzyWord(tokens, target, maxDist) || hasFuzzyWord(rawTokens, target, maxDist);
    const contains = (phrase: string) => cleanWords.includes(phrase.toLowerCase()) || tokens.join(" ").includes(phrase.toLowerCase());

    // -------------------------------------------------------------
    // 1. RANDOM KEYSTROKES / DIGITS / GIBBERISH (e.g. "134343", "stroke 134343", "asdfgh")
    // -------------------------------------------------------------
    const isPureDigits = /^\d+$/.test(cleanWords);
    const isNoiseOrStroke = contains("stroke") && /\d+/.test(cleanWords);
    const isShortNoise = cleanWords.length <= 4 && !/^(hi|hey|gpa|cpa|ai|fyp|numl|job|cv|web|app|java|help|who|name|age|city|read)$/.test(cleanWords);
    const lacksVowels = cleanWords.length > 4 && !/[aeiouy]/.test(cleanWords);
    const hasLongRandomSequence = /[bcdfghjklmnpqrstvwxyz]{6,}/i.test(cleanWords);

    if (isPureDigits || isNoiseOrStroke || isShortNoise || lacksVowels || hasLongRandomSequence) {
      return {
        text: `Oops! That looks like a random keystroke or number. 🤖\n\nHow can I help you today? You can ask me:\n• *"Who is Ijlal?"*\n• *"What is his CGPA?"*\n• *"What projects has he built?"*\n• *"Tell me about his LangGraph AI experience"*\n• *"How can I contact him?"*`,
        actionLink: { label: "Explore All Projects", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 2. OUT-OF-BOUNDS / EXTERNAL CODING / OFF-TOPIC GUARDRAIL
    // -------------------------------------------------------------
    const isGeneralCodingTask = (
      (contains("write a") || contains("write code") || contains("generate code") || contains("write script") || contains("solve this") || contains("calculate") || contains("fix my code") || contains("write python") || contains("write java") || contains("create code") || contains("write me")) &&
      (hasWord("code") || hasWord("script") || hasWord("python") || hasWord("javascript") || hasWord("java") || hasWord("function") || hasWord("algorithm") || hasWord("program") || hasWord("html") || hasWord("css") || hasWord("sql")) &&
      !hasWord("ijlal") && !hasWord("portfolio") && !hasWord("safezone") && !hasWord("resumeiq") && !hasWord("blogfactory")
    );

    const isGeneralTrivia = (
      contains("capital of") ||
      contains("who is the president") ||
      contains("who won") ||
      contains("weather in") ||
      contains("tell me a story") ||
      contains("what is photosynthesis") ||
      contains("bitcoin price") ||
      contains("crypto") ||
      contains("meaning of life") ||
      contains("recipe for") ||
      contains("write an essay") ||
      contains("write a poem") ||
      contains("tell a joke") ||
      contains("2 + 2") ||
      contains("math problem")
    );

    if (isGeneralCodingTask || isGeneralTrivia) {
      return {
        text: `Sorry, that's outside my context! 😊 I am Ijlal's dedicated portfolio AI assistant, trained exclusively on his software engineering projects, skills, education, and career experience.\n\nFeel free to ask me anything about Ijlal's work, such as his **ResumeIQ** AI platform or **Safe Zone** Android app!`,
        actionLink: { label: "Explore Ijlal's Projects", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 3. EXACT CGPA / GPA SPECIFIC QUESTION (e.g. "what is cgoa of ijall", "what is cgpa")
    // -------------------------------------------------------------
    if (
      hasWord("cgpa", 1) ||
      contains("cgoa") ||
      contains("cgpaa") ||
      contains("what is his cgpa") ||
      contains("what is cgpa") ||
      contains("cgpa of ijlal") ||
      contains("cgoa of ijall") ||
      contains("cgpaa of ijlla") ||
      contains("his gpa") ||
      contains("how much cgpa")
    ) {
      return {
        text: `Ijlal's CGPA is **${personalInfo.cgpa} / 4.0** (First Class Honors) in BS Software Engineering from NUML Islamabad! 🎓`,
        actionLink: { label: "View Academic Timeline", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 4. WHO IS IJLAL / ABOUT IJLAL (e.g. "who is itjall", "who is ijlal")
    // -------------------------------------------------------------
    if (
      contains("who is ijlal") ||
      contains("who is itjall") ||
      contains("who is ijall") ||
      contains("who is he") ||
      contains("about ijlal") ||
      contains("about itjall") ||
      contains("tell me about ijlal") ||
      contains("tell me about him") ||
      contains("introduce ijlal") ||
      contains("profile of ijlal") ||
      contains("background of ijlal") ||
      (hasWord("who") && (hasWord("ijlal") || hasWord("he")))
    ) {
      return {
        text: `**Ijlal Hussain** is a Software Engineering graduate from NUML Islamabad with an outstanding **3.96 / 4.0 CGPA** (First Class Honors). 🚀\n\nHe specializes in **Generative AI (LangGraph multi-agent systems & RAG)**, **Native Android Development (Java/Firebase)**, and **Full-Stack Web (React 19/MERN)**. He was the Team Lead for the Safe Zone Parental Control FYP and completed AI Engineering internships at Kartoa Technologies and Alberuni Tech.`,
        actionLink: { label: "View Full Profile", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 5. RESUME / CV DOWNLOAD
    // -------------------------------------------------------------
    if (
      hasWord("resume", 1) ||
      hasWord("cv", 0) ||
      contains("download cv") ||
      contains("download resume") ||
      contains("get cv") ||
      contains("get resume")
    ) {
      return {
        text: `You can download or view Ijlal's official software engineering CV in verified PDF format by clicking the link below! 📄`,
        actionLink: { label: "Download Official CV (PDF)", url: personalInfo.resumeUrl }
      };
    }

    // -------------------------------------------------------------
    // 6. FULL EDUCATION VS UNIVERSITY / DEGREE
    // -------------------------------------------------------------
    const isFullEducation = (
      contains("full education") ||
      contains("all education") ||
      contains("education background") ||
      contains("academic background") ||
      hasWord("intermediate") ||
      hasWord("matriculation") ||
      hasWord("school") ||
      hasWord("college")
    );

    if (isFullEducation) {
      return {
        text: `🎓 **Ijlal's Educational Background:**\n• **BS Software Engineering** (NUML Islamabad, ${educationData[0].period}) — **${educationData[0].grade}**\n• **Intermediate** (Govt Boys Degree College, Danyore Gilgit, ${educationData[1].period}) — ${educationData[1].grade}\n• **Matriculation** (Vision Higher Secondary School, Danyore Gilgit, ${educationData[2].period}) — ${educationData[2].grade}`,
        actionLink: { label: "View Academic Timeline", tab: "About" }
      };
    }

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
    // 7. LOCATION / WHERE IS HE FROM / WHERE DOES HE LIVE
    // -------------------------------------------------------------
    if (
      ((hasWord("where", 1) || hasWord("wher", 1)) && (hasWord("from", 1) || hasWord("live", 1) || hasWord("located", 2) || hasWord("he", 0) || hasWord("ijlal", 1))) ||
      hasWord("location", 2) ||
      hasWord("city", 1) ||
      hasWord("country", 2) ||
      hasWord("hometown", 2) ||
      hasWord("origin", 2) ||
      hasWord("gilgit", 1) ||
      hasWord("pakistan", 2)
    ) {
      return {
        text: `Ijlal is originally from the beautiful valley of **Gilgit, Pakistan** 🏔️ and completed his software engineering degree in **Islamabad**. He is actively open to **remote roles globally** as well as on-site positions in Islamabad!`,
        actionLink: { label: "Contact Ijlal", tab: "Contact" }
      };
    }

    // -------------------------------------------------------------
    // 8. AGE / HOW OLD IS HE
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
        text: `Ijlal is in his **early 20s** and graduated with his BS in Software Engineering in early 2026. 🎂`,
        actionLink: { label: "View Full Profile", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 9. EMAIL SPECIFIC QUESTION
    // -------------------------------------------------------------
    if (hasWord("email", 1) || contains("mail address") || contains("how to email")) {
      return {
        text: `Ijlal's official email address is **${personalInfo.email}**. Feel free to send him a direct message anytime! ✉️`,
        actionLink: { label: "Send Direct Email", url: `mailto:${personalInfo.email}` }
      };
    }

    // -------------------------------------------------------------
    // 10. PHONE / WHATSAPP SPECIFIC QUESTION
    // -------------------------------------------------------------
    if (hasWord("whatsapp", 2) || hasWord("phone", 1) || hasWord("call", 1) || hasWord("mobile") || contains("contact number")) {
      return {
        text: `You can reach Ijlal on WhatsApp or Phone at **${personalInfo.phone}**! 📱`,
        actionLink: { label: "Chat on WhatsApp", url: `https://wa.me/${personalInfo.phone.replace(/[^0-9]/g, "")}` }
      };
    }

    // -------------------------------------------------------------
    // 11. GENERAL CONTACT / HIRE
    // -------------------------------------------------------------
    if (hasWord("contact", 2) || hasWord("hire", 1) || hasWord("linkedin", 2) || hasWord("github", 2) || contains("how to contact")) {
      return {
        text: `You can connect with Ijlal directly through:\n• **Email**: ${personalInfo.email}\n• **WhatsApp/Phone**: ${personalInfo.phone}\n• **LinkedIn**: [linkedin.com/in/ijlal-hussain786](${personalInfo.linkedin})\n• **GitHub**: [github.com/Ijlal-Hussaini](${personalInfo.github})`,
        actionLink: { label: "Open Contact Form", tab: "Contact" }
      };
    }

    // -------------------------------------------------------------
    // 12. FYP / SAFE ZONE SPECIFIC
    // -------------------------------------------------------------
    if (hasWord("fyp", 0) || contains("final year project") || contains("safe zone") || hasWord("safezone", 1)) {
      return {
        text: `📱 **Safe Zone — Parental Control Android App (FYP Lead):**\nIjlal served as the **Team Lead** for Safe Zone, a complete dual-app parental monitoring ecosystem built with **Java, Android SDK, and Firebase**. It features real-time GPS geofencing, remote screen-time scheduling, and category-based web content filtering.`,
        actionLink: { label: "Inspect SafeZone Android App", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 13. RESUMEIQ PROJECT SPECIFIC
    // -------------------------------------------------------------
    if (hasWord("resumeiq", 1) || (hasWord("resume", 1) && hasWord("iq", 0)) || hasWord("ats", 0) || contains("cv parser")) {
      return {
        text: `🤖 **ResumeIQ — AI Career Intelligence Platform:**\nAn enterprise-grade platform built with a **7-node cyclic LangGraph state machine**, local sentence-transformers RAG retrieval, ATS score compliance auditing, Google XYZ bullet optimization, and Groq/Gemini dual LLM orchestration.`,
        actionLink: { label: "Inspect ResumeIQ Project", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 14. TECHNICAL BLOG FACTORY PROJECT SPECIFIC
    // -------------------------------------------------------------
    if (hasWord("factory", 2) || (hasWord("blog", 1) && (hasWord("post", 1) || hasWord("writer", 1) || hasWord("creator", 1))) || hasWord("tavily", 1)) {
      return {
        text: `📝 **Technical Blog Post Factory:**\nAn autonomous **3-agent LangGraph** publishing studio featuring a Content Writer, Technical Reviewer with live **Tavily AI web search fact-checking**, and an automated syntax-verified runnable code generator with 1-click vector PDF export.`,
        actionLink: { label: "Inspect Technical Blog Factory", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 15. PROJECT NAMES / PROJECT LIST
    // -------------------------------------------------------------
    if (
      (contains("name") || contains("names") || contains("only") || contains("just") || contains("enlist") || contains("title") || contains("titles") || contains("what projects") || contains("list projects") || contains("how many projects")) &&
      (hasWord("project") || hasWord("work") || hasWord("app"))
    ) {
      return {
        text: `📋 **Ijlal's Featured Projects (${projectsData.length} Total):**\n\n1. 🤖 **ResumeIQ** (AI Career Intelligence & ATS Auditor)\n2. 📝 **Technical Blog Post Factory** (Multi-Agent AI Studio)\n3. 📱 **Safe Zone** (Parental Control Android App — FYP Lead)\n4. 🌐 **Developer Portfolio** (React 19 & Tailwind Web Platform)`,
        actionLink: { label: "Explore All Projects", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 16. KARTOA TECHNOLOGIES INTERNSHIP
    // -------------------------------------------------------------
    if (hasWord("kartoa", 1)) {
      return {
        text: `🏢 **AI Development Intern @ Kartoa Technologies (Jan – Mar 2026):**\nIjlal built production-grade **RAG pipelines** and **LangGraph multi-agent workflows**, while optimizing LLM token limits and context window accuracy.`,
        actionLink: { label: "View Experience Details", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 17. ALBERUNI TECH / REQUIREMENTS ENGINEERING INTERNSHIP
    // -------------------------------------------------------------
    if (hasWord("alberuni", 2) || contains("requirement engineering") || contains("srs") || contains("brd")) {
      return {
        text: `📑 **Requirement Engineering Intern @ NUML × Alberuni Tech (Aug – Oct 2025):**\nIjlal gathered commercial software requirements, authoring standardized **Software Requirements Specifications (SRS)**, **BRDs**, and **UML Use Case diagrams**.`,
        actionLink: { label: "View Experience Details", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 18. CERTIFICATIONS / NAVTTC / CISCO / DIGISKILL
    // -------------------------------------------------------------
    if (
      hasWord("certificate", 2) ||
      hasWord("certification", 2) ||
      hasWord("credential", 2) ||
      hasWord("credentials", 2) ||
      hasWord("navttc", 1) ||
      hasWord("cisco", 1) ||
      hasWord("digiskill", 2)
    ) {
      return {
        text: `📜 **Verified Institutional Certifications (${certificationsData.length} Total):**\n1. **Generative AI & Machine Learning** (NAVTTC · Adan Institute, Sep – Dec 2025)\n2. **AI Development Internship** (Kartoa Technologies, Jan – Mar 2026)\n3. **Python Essentials 1** (Cisco Networking Academy · OpenEDG, Jan 2026)\n4. **Freelancing** (DigiSkills · Ministry of IT, Aug – Nov 2025)\n5. **Graphic Design** (DigiSkills · Ministry of IT, Aug – Nov 2025)\n6. **Requirements Engineering** (NUML × Alberuni Tech, Aug – Oct 2025)`,
        actionLink: { label: "Inspect All Verified Certificates", tab: "Certifications" }
      };
    }

    // -------------------------------------------------------------
    // 19. SPECIFIC SKILL: PYTHON
    // -------------------------------------------------------------
    if (hasWord("python", 1) && !contains("python essential")) {
      return {
        text: `🐍 **Python (88% Proficiency):**\nIjlal uses Python for **Generative AI multi-agent state machines (LangGraph)**, **RAG pipelines (LangChain)**, and **FastAPI microservices**, backed by Cisco Python certification.`,
        actionLink: { label: "View Skills Breakdown", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 20. SPECIFIC SKILL: JAVA & ANDROID
    // -------------------------------------------------------------
    if (hasWord("java", 1) || (hasWord("android") && (hasWord("sdk") || hasWord("studio")))) {
      return {
        text: `☕ **Java & Android (88% Proficiency):**\nIjlal builds native Android apps using **Java, Android SDK, Android Studio, and Firebase Realtime Database**, demonstrated in his Safe Zone FYP.`,
        actionLink: { label: "Inspect SafeZone App", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 21. SPECIFIC SKILL: LANGGRAPH / RAG / GENERATIVE AI
    // -------------------------------------------------------------
    if (hasWord("langgraph", 2) || hasWord("langchain", 2) || hasWord("rag", 0) || hasWord("agent", 1)) {
      return {
        text: `⚡ **LangGraph & Generative AI (86% Proficiency):**\nIjlal engineers **cyclic multi-agent workflows**, local RAG citation engines with sentence-transformers embeddings, and dual-LLM orchestration (Groq Cloud + Google Gemini 2.5).`,
        actionLink: { label: "Inspect AI Projects", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 22. SPECIFIC SKILL: REACT, NEXT.JS & WEB
    // -------------------------------------------------------------
    if (hasWord("react", 1) || hasWord("nextjs", 2) || hasWord("typescript", 2) || hasWord("mern", 1) || hasWord("node", 1) || hasWord("mongodb", 2)) {
      return {
        text: `⚛️ **Full-Stack Web Stack:**\nIjlal builds modern web platforms with **React 19, Next.js 16, TypeScript, Node.js, Express, MongoDB (MERN), and Tailwind CSS v4**.`,
        actionLink: { label: "View Skills Breakdown", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 23. GENERAL SKILLS / TECH STACK
    // -------------------------------------------------------------
    if (hasWord("skill", 2) || hasWord("skills", 2) || hasWord("stack", 1) || contains("tech stack")) {
      return {
        text: `🛠️ **Core Technical Skills:**\n• **Generative AI**: LangGraph (86%), LangChain & RAG (84%), Python (88%), FastAPI (82%)\n• **Mobile Development**: Java & Android SDK (88%), Firebase (84%), Flutter (55%)\n• **Web Development**: React 19 & Next.js (80%), TypeScript, Node.js, MongoDB (76%)\n• **Engineering & Tools**: Requirements Engineering (88%), Git & GitHub (86%), Figma (72%)`,
        actionLink: { label: "View Complete Skills Matrix", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 24. WHY HIRE IJLAL / STRENGTHS
    // -------------------------------------------------------------
    if (
      (hasWord("why") && (hasWord("hire", 1) || hasWord("choose", 1) || hasWord("select", 1))) ||
      hasWord("strength", 2) ||
      hasWord("strengths", 2) ||
      contains("why hire")
    ) {
      return {
        text: `🌟 **Why Hire Ijlal Hussain?**\n• **Top Academic Standing**: **3.96 / 4.0 CGPA** at NUML Islamabad\n• **Production AI Expertise**: Built real-world LangGraph cyclic multi-agent graphs and RAG pipelines\n• **Proven Leadership**: Led the Safe Zone Android FYP team\n• **6 Verified Credentials**: Official NAVTTC, Cisco, and DigiSkills certifications\n• **Versatility**: Full-stack agility across AI, Mobile, and Web`,
        actionLink: { label: "Open Contact Form", tab: "Contact" }
      };
    }

    // -------------------------------------------------------------
    // 25. WORK AVAILABILITY / REMOTE
    // -------------------------------------------------------------
    if (hasWord("remote", 1) || hasWord("relocate", 2) || (hasWord("available", 2) && hasWord("work", 1))) {
      return {
        text: `💼 **Work Availability:**\nIjlal is available immediately for **remote roles globally** as well as on-site and hybrid positions in **Islamabad** and nationwide!`,
        actionLink: { label: "Send a Message", tab: "Contact" }
      };
    }

    // -------------------------------------------------------------
    // 26. GREETINGS & SALUTATIONS
    // -------------------------------------------------------------
    if (/^(hi|hello|hey|salam|assalam|aoa|hy|hola|greetings|good\s*(morning|afternoon|evening|day|night))(\s|$)/i.test(cleanWords) || hasWord("hello", 1) || hasWord("salam", 1)) {
      return {
        text: `Hello! 👋 I'm Ijlal's AI Assistant. How can I help you today? Ask me about his projects, CGPA (3.96), LangGraph AI experience, or contact details!`,
        actionLink: { label: "View About & Skills", tab: "About" }
      };
    }

    // -------------------------------------------------------------
    // 27. CONVERSATIONAL ACKNOWLEDGMENTS
    // -------------------------------------------------------------
    if (/^(ok|okay|k|kk|alright|sure|cool|nice|got it|fine|perfect|yes|yep|yeah|no|nah|nope|sounds good|understood|noted)$/i.test(cleanWords)) {
      return {
        text: `Got it! 👍 Feel free to ask anything else about Ijlal's background, projects, or skills!`,
        actionLink: { label: "Explore Projects", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 28. BOT IDENTITY
    // -------------------------------------------------------------
    if (
      contains("who are you") ||
      contains("how are you") ||
      contains("who made you") ||
      contains("what is your name") ||
      contains("what do you do")
    ) {
      return {
        text: `I am **Ijlal's AI Portfolio Assistant**, running 100% in your browser. I can answer any questions about Ijlal's software engineering projects, academic honors, verified certifications, and skills! 😊`,
        actionLink: { label: "Explore Projects", tab: "Projects" }
      };
    }

    // -------------------------------------------------------------
    // 29. GRATITUDE & CLOSING
    // -------------------------------------------------------------
    if (/^(thank|thanks|thank\s+you|appreciate|awesome|great|cool|goodbye|bye)(\s|$)/i.test(cleanWords) || hasWord("thanks", 1)) {
      return {
        text: `You're very welcome! 😊 Feel free to reach out to Ijlal directly through the contact section if you'd like to collaborate or connect!`,
        actionLink: { label: "Open Contact Form", tab: "Contact" }
      };
    }

    // -------------------------------------------------------------
    // 30. CONCISE GENERAL GROUNDED FALLBACK
    // -------------------------------------------------------------
    return {
      text: `I'm here to answer questions about **Ijlal Hussain**! 🌟\n\nTry asking me:\n• *"Who is Ijlal?"*\n• *"What is his CGPA?"*\n• *"What projects has he built?"*\n• *"What did he do at Kartoa?"*\n• *"How can I contact him?"*`,
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

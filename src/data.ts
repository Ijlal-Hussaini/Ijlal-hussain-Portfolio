export interface PersonalInfo {
  name: string;
  titles: string[];
  bio: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  university: string;
  cgpa: string;
  photoUrl?: string;
  resumeUrl?: string;
}

export interface SkillCategory {
  category: string;
  skills: { name: string; level?: string; percent?: number }[];
}

export interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
  highlights: string[];
}

export interface ProjectImage {
  seq: number;
  title: string;
  url: string;
  caption: string;
}

export interface Project {
  id: string;
  title: string;
  category: "AI/ML" | "Web" | "Mobile" | "All";
  tech: string[];
  features: string[];
  github: string;
  demo?: string;
  apkUrl?: string;
  description: string;
  imageUrl?: string;
  coverImage: string;
  images: ProjectImage[];
}

export interface Certification {
  id: string;
  title: string;
  organization: string;
  period: string;
  credentialId?: string;
  status?: "Completed" | "Pending";
  pdfUrl?: string; // or simulated viewer fallback
  imageUrl?: string;
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  grade: string;
}

export const personalInfo: PersonalInfo = {
  name: "Ijlal Hussain",
  titles: [
    "Software Engineer",
    "Generative AI Developer",
    "MERN Stack Developer",
    "Native Android App Developer"
  ],
  bio: "I'm a Software Engineering graduate from NUML Islamabad, passionate about building impactful technology solutions. I specialize in Android development, Generative AI, and web development. My experience includes leading a parental control Android app as FYP team lead and completing an AI internship at Kartoa Technologies, where I built RAG pipelines and LangGraph agents. I believe great software comes from understanding user needs and delivering solutions with precision.",
  email: "ijlalhussain.eng@gmail.com",
  phone: "+92 311 867 2135",
  location: "Gilgit, Pakistan",
  linkedin: "https://linkedin.com/in/ijlal-hussain786",
  github: "https://github.com/Ijlal-Hussaini",
  university: "NUML Islamabad",
  cgpa: "3.96 / 4.0",
  photoUrl: "/assets/images/profile_photo.png",
  resumeUrl: "/Ijlal_Hussain_CV.pdf"
};

export const skillsData: SkillCategory[] = [
  {
    category: "Generative AI & ML",
    skills: [
      { name: "Python (AI & ML)", level: "88%", percent: 88 },
      { name: "LangGraph (State Graphs & Multi-Agents)", level: "86%", percent: 86 },
      { name: "LangChain & RAG Pipelines", level: "84%", percent: 84 },
      { name: "Prompt Engineering & Guardrails", level: "85%", percent: 85 },
      { name: "Vector Embeddings & Retrieval", level: "80%", percent: 80 },
      { name: "FastAPI (AI Microservices)", level: "82%", percent: 82 }
    ]
  },
  {
    category: "Android Development",
    skills: [
      { name: "Android SDK (Java)", level: "88%", percent: 88 },
      { name: "Android Studio & Architecture", level: "85%", percent: 85 },
      { name: "Firebase (Realtime DB & Auth)", level: "84%", percent: 84 },
      { name: "Material Design UI", level: "80%", percent: 80 },
      { name: "Flutter & Dart", level: "55%", percent: 55 }
    ]
  },
  {
    category: "Web Development",
    skills: [
      { name: "React 19 & TypeScript", level: "80%", percent: 80 },
      { name: "JavaScript (ES6+)", level: "84%", percent: 84 },
      { name: "HTML5 & Tailwind CSS", level: "86%", percent: 86 },
      { name: "Node.js & Express.js", level: "74%", percent: 74 },
      { name: "MongoDB & REST APIs", level: "76%", percent: 76 }
    ]
  },
  {
    category: "Software Engineering",
    skills: [
      { name: "Requirements Engineering (SRS / BRD)", level: "88%", percent: 88 },
      { name: "Use Case Modeling & UML", level: "82%", percent: 82 },
      { name: "System Design & Architecture", level: "76%", percent: 76 },
      { name: "Software QA & Testing", level: "74%", percent: 74 }
    ]
  },
  {
    category: "Tools & Platforms",
    skills: [
      { name: "Git & GitHub", level: "86%", percent: 86 },
      { name: "VS Code", level: "88%", percent: 88 },
      { name: "Postman (API Testing)", level: "78%", percent: 78 },
      { name: "Figma (UI/UX Prototyping)", level: "72%", percent: 72 }
    ]
  },
  {
    category: "Languages",
    skills: [
      { name: "English", level: "Professional", percent: 70 },
      { name: "Urdu", level: "Native", percent: 100 },
      { name: "Brushaski", level: "Mother Tongue", percent: 100 }
    ]
  }
];

export const experienceData: Experience[] = [
  {
    role: "AI Development Intern",
    company: "Kartoa Technologies, Islamabad",
    location: "Islamabad, Pakistan (Remote/Onsite hybrid)",
    period: "Jan 2026 - Mar 2026",
    highlights: [
      "Developed advanced AI solutions utilizing Python, Machine Learning, and Generative AI technologies.",
      "Built production-ready Retrieval-Augmented Generation (RAG) systems and sophisticated agentic workflows using LangChain and LangGraph.",
      "Collaborated heavily on optimizing model context lengths, improving accuracy of multi-agent state machines, and debugging token limits."
    ]
  },
  {
    role: "Requirement Engineering Intern",
    company: "NUML × Alberuni Tech, Islamabad",
    location: "Islamabad, Pakistan",
    period: "Aug 2025 - Oct 2025",
    highlights: [
      "Gathered and documented client requirements for multiple commercial and industrial software projects.",
      "Authored standardized Software Requirements Specification (SRS), Business Requirements Documents (BRD), and comprehensive Use Case diagrams matching strict industry standards.",
      "Collaborated seamlessly with senior developers, QA engineers, and project managers to resolve requirement ambiguities, ensuring 100% feasibility."
    ]
  },
  {
    role: "Android App Developer — Safe Zone FYP Lead",
    company: "NUML Islamabad (Academic FYP)",
    location: "Islamabad, Pakistan",
    period: "Mar 2025 - Dec 2025",
    highlights: [
      "Led the end-to-end development of \"Safe Zone\" parental control Android app as the FYP Team Lead.",
      "Designed clean UI/UX mockups in Figma and implemented interactive XML screens utilizing Android Material Design principles.",
      "Wrote core system logic in Java with robust Firebase integration for real-time tracking, content filtering, screen-time locks, and geo-fencing alerts."
    ]
  }
];

export const projectsData: Project[] = [
  {
    id: "safezone",
    title: "Safe Zone — Parental Control App",
    category: "Mobile",
    tech: ["Java", "Android SDK", "Firebase Realtime DB", "Figma", "Material Design"],
    features: [
      "Real-time children device monitoring & app usage tracking",
      "Dynamic web content filtering and safe browser enforcement",
      "Remote lock and screen time scheduler with hours & minutes caps",
      "Precision GPS geolocation tracking and customizable safe-zone Geofencing",
      "Instant emergency alert system & pairing via QR code",
      "Daily/Weekly internet activity reports with visual summaries",
      "System-level app blocking and installation prevention"
    ],
    github: "https://github.com/Ijlal-Hussaini/Safe-Zone-Kid-Friendly-Internet-and-App-Monitoring",
    apkUrl: "/downloads/SafeZone.apk",
    demo: "/downloads/SafeZone.apk",
    description: "Safe Zone is a complete high-fidelity parental control Android system designed to curate a safer digital space for children. Developed as my Final Year Project (FYP) at NUML, the system splits into a parent dashboard and a child monitor, synchronizing instantly using Firebase cloud endpoints.",
    imageUrl: "SafeZone",
    coverImage: "/assets/projects/SafeZone/01_Login_Signup.jpeg",
    images: [
      {
        seq: 1,
        title: "1. Authentication & Onboarding",
        url: "/assets/projects/SafeZone/01_Login_Signup.jpeg",
        caption: "Secure login and registration interface supporting Firebase Authentication, password recovery, and role selection."
      },
      {
        seq: 2,
        title: "2. Parent Multi-Child Dashboard",
        url: "/assets/projects/SafeZone/02_Parent_Dashboard.jpeg",
        caption: "Centralized parent hub showcasing linked children with real-time status, quick controls, and monitoring shortcuts."
      },
      {
        seq: 3,
        title: "3. Child Device Pairing & Setup",
        url: "/assets/projects/SafeZone/03_Adding_Child.jpeg",
        caption: "Seamless device pairing wizard utilizing unique QR codes and pairing PINs for instant child account linking."
      },
      {
        seq: 4,
        title: "4. Real-Time Child Monitoring Panel",
        url: "/assets/projects/SafeZone/04_Child_Monitoring.jpeg",
        caption: "Supervision console providing immediate access to Activity Logs, Screen Time Limits, Web Filtering, and Live Location."
      },
      {
        seq: 5,
        title: "5. Screen Time Limits & Rules",
        url: "/assets/projects/SafeZone/05_Screen_Time_Management.jpeg",
        caption: "Daily hour and minute limit scheduler with custom weekday/weekend allocations and app whitelist rules."
      },
      {
        seq: 6,
        title: "6. Request Extra Screen Time",
        url: "/assets/projects/SafeZone/06_Request_Extra_Time.jpeg",
        caption: "Interactive prompt allowing children to request additional screen time with real-time push approvals."
      },
      {
        seq: 7,
        title: "7. Web Content & App Filtering",
        url: "/assets/projects/SafeZone/07_Content_Filtering.jpeg",
        caption: "Parental control suite for category-based web filtering, custom domain blocking, and safe search enforcement."
      },
      {
        seq: 8,
        title: "8. App Usage & Activity Analytics",
        url: "/assets/projects/SafeZone/08_Activity_Logs.jpeg",
        caption: "Detailed application usage metrics showing exact durations, launch counts, and daily activity trends."
      },
      {
        seq: 9,
        title: "9. Live GPS Geolocation Tracking",
        url: "/assets/projects/SafeZone/09_Location_Tracking.jpeg",
        caption: "Real-time Google Maps GPS integration tracking child location with configurable safe-zone Geofencing alerts."
      },
      {
        seq: 10,
        title: "10. Real-Time Alerts & Security Logs",
        url: "/assets/projects/SafeZone/10_Alerts_Notifications.jpeg",
        caption: "Security event feed delivering instant notifications for restricted app access, curfew violations, and geofence breaches."
      },
      {
        seq: 11,
        title: "11. Child Mode Protected Dashboard",
        url: "/assets/projects/SafeZone/11_Child_Dashboard.jpeg",
        caption: "Kid-friendly home screen displaying remaining screen time quota, allowed apps, and parental lock status."
      },
      {
        seq: 12,
        title: "12. Child Permission & Access Requests",
        url: "/assets/projects/SafeZone/12_Child_Request_Access.jpeg",
        caption: "Child request dialog allowing children to ask permission for temporarily restricted apps or new installations."
      },
      {
        seq: 13,
        title: "13. Child Device Profile & Status",
        url: "/assets/projects/SafeZone/13_Child_Profile.jpeg",
        caption: "Child profile management detailing linked device information, battery level, and active protection policies."
      },
      {
        seq: 14,
        title: "14. Parent Account & Profile Settings",
        url: "/assets/projects/SafeZone/14_Parent_Profile.jpeg",
        caption: "Parent credentials management, security PIN configurations, and multi-factor authentication controls."
      },
      {
        seq: 15,
        title: "15. System Preferences & App Rules",
        url: "/assets/projects/SafeZone/15_Parent_Settings.jpeg",
        caption: "Global application configuration for background synchronization, notification thresholds, and emergency SOS contacts."
      }
    ]
  },
  {
    id: "blogfactory",
    title: "Technical Blog Post Factory — Multi-Agent AI Studio",
    category: "AI/ML",
    tech: ["Python", "FastAPI", "LangGraph", "LangChain", "Gemini 2.5 Flash", "Groq Cloud", "Tavily AI", "Pydantic v2"],
    features: [
      "Autonomous 3-agent LangGraph cyclic workflow orchestrating Content Writer, Technical Reviewer, and Code Generator",
      "Live web fact-checking powered by Tavily Search API cross-referencing claims against official technical documentation",
      "Strict peer review iterations (1 to 3 cycles) with dedicated critique passes and automated revision refinement",
      "Intelligent code detection and syntax-verified runnable snippet embedding for programming topics",
      "Upfront phonotactic topic guardrail engine blocking keyboard mash, pure numbers, and generic test placeholders",
      "One-click vector PDF generation with custom styling via jsPDF, Markdown copy, and real-time agent thought telemetry"
    ],
    github: "https://github.com/Ijlal-Hussaini/technical-blog-factory",
    demo: "https://technical-blog-factory.onrender.com/",
    description: "Enterprise-ready autonomous multi-agent technical blog publishing engine engineered with LangGraph, FastAPI, Google Gemini 2.5 Flash, and Groq Cloud fallback. Features live Tavily web fact-checking, strict iterative peer review loops, syntax-verified code generation, upfront topic guardrails, and one-click vector PDF exports.",
    imageUrl: "blogfactory",
    coverImage: "/assets/projects/blogfactory/Home.png",
    images: [
      {
        seq: 1,
        title: "1. Workspace & Topic Configuration",
        url: "/assets/projects/blogfactory/Home.png",
        caption: "Main studio workspace featuring target audience selection, review iteration controls (1-3 cycles), and persistent chat history."
      },
      {
        seq: 2,
        title: "2. Real-Time Multi-Agent Generation Workflow",
        url: "/assets/projects/blogfactory/Generating_Blog.png",
        caption: "Active LangGraph state machine tracking real-time node execution from topic ingestion through drafting passes."
      },
      {
        seq: 3,
        title: "3. Technical Reviewer & Live Fact-Checking",
        url: "/assets/projects/blogfactory/Peer_Reviewer.png",
        caption: "Technical Reviewer agent feedback logs cross-referencing technical claims against live official documentation via Tavily API."
      },
      {
        seq: 4,
        title: "4. Syntax-Verified Code Snippet Injection",
        url: "/assets/projects/blogfactory/Added_Code_Snippets.png",
        caption: "Intelligent code generator detecting coding keywords and embedding syntax-verified, runnable snippets with explanations."
      },
      {
        seq: 5,
        title: "5. Publication-Ready Formatted Content",
        url: "/assets/projects/blogfactory/Blog_Content.png",
        caption: "Rendered blog post showcasing clear typography, bold section headings, structured code blocks, and key takeaways."
      },
      {
        seq: 6,
        title: "6. Finalized Article & Multi-Format Export",
        url: "/assets/projects/blogfactory/Blog_Generated_Download.png",
        caption: "Complete blog post ready for one-click vector PDF download, raw Markdown copying, and chat history archival."
      }
    ]
  },
  {
    id: "resumeiq",
    title: "ResumeIQ — AI Career Intelligence Platform",
    category: "AI/ML",
    tech: ["LangGraph", "FastAPI", "Next.js 16", "Groq Cloud", "Gemini AI", "RAG", "Pydantic v2", "Tailwind CSS v4"],
    features: [
      "7-node cyclic LangGraph agentic workflow for structured resume decomposition and multi-step extraction",
      "Local RAG citation engine with sentence-transformer embeddings and grounded sub-10ms source lookups",
      "Dual LLM orchestration pairing ultra-low latency Groq Cloud AI with automatic Google Gemini failover",
      "Field-agnostic intelligence handling Tech, Healthcare, Marketing, and Engineering domain profiles",
      "Interactive Match Scoring gauge, ATS compliance auditor, and Google XYZ bullet point rewrites",
      "Full interactive RAG chat drawer enabling grounded natural language querying over parsed candidate data"
    ],
    github: "https://github.com/Ijlal-Hussaini/Resume_IQ",
    demo: "https://resumeiq-cvparser.vercel.app/",
    description: "Production-grade, field-agnostic career intelligence platform powered by a 7-node LangGraph state machine, local RAG retrieval with grounded citations, multi-provider LLM orchestration (Groq Cloud AI + Gemini failover), and a modern Liquid Glass Next.js 16 frontend.",
    imageUrl: "resumeiq",
    coverImage: "/assets/projects/resumeiq/Home.png",
    images: [
      {
        seq: 1,
        title: "1. Resume Ingestion & Target Criteria Workspace",
        url: "/assets/projects/resumeiq/Home.png",
        caption: "Main landing workspace featuring multi-format drag-and-drop ingestion (PDF, DOCX, TXT, OCR) and 1-click industry benchmark personas."
      },
      {
        seq: 2,
        title: "2. Multi-Dimension Match Score & Skill Gap Matrix",
        url: "/assets/projects/resumeiq/Match_Intelligence.png",
        caption: "Weighted match intelligence gauge (Skills, Seniority, Domain, Education) with verified qualifications versus critical missing requirements."
      },
      {
        seq: 3,
        title: "3. Comprehensive ATS Compliance & Machine Readability Audit",
        url: "/assets/projects/resumeiq/ATS_Audit.png",
        caption: "In-depth ATS parseability score (66/100) evaluating contact headers, active voice verbs, keyword gaps, standard headings, and degree formats."
      },
      {
        seq: 4,
        title: "4. Google XYZ Bullet Rewrites & Tailored Interview Prep",
        url: "/assets/projects/resumeiq/Update_Suggestions.png",
        caption: "High-impact before/after bullet optimization using Google XYZ formula (Accomplished [X], measured by [Y], by doing [Z]) with tailored mock questions."
      },
      {
        seq: 5,
        title: "5. Grounded RAG Chat with Direct Section Citations",
        url: "/assets/projects/resumeiq/RAG_Chat.png",
        caption: "Zero-hallucination conversational interface answering queries with direct source text snippets and cosine similarity confidence scores."
      },
      {
        seq: 6,
        title: "6. 7-Node LangGraph State Machine Execution Logs",
        url: "/assets/projects/resumeiq/Pipeline_Logs.png",
        caption: "Real-time node telemetry tracking Structured Extraction, Data Validation, JD Decomposition, RAG Matching, Gap Analysis, ATS Audit, and XYZ Synthesis."
      }
    ]
  },
  {
    id: "portfolio",
    title: "Developer Portfolio — High-Performance Engineering Platform",
    category: "Web",
    tech: ["React 19", "TypeScript", "Vite 6", "Tailwind CSS v4", "Motion", "Web3Forms"],
    features: [
      "Sub-second page loads with zero render-blocking CSS, preloaded WebP images, and high-performance bundle optimization",
      "Persistent URL Hash routing (#about, #projects, #certifications, #contact) with complete page reload state preservation",
      "Adaptive Cosmic Dark & Crisp Light themes with seamless real-time toggle and localized preference caching",
      "Interactive Verified Credentials Ledger with instant PDF document inspector and 1-click downloads",
      "Real-time client-side message dispatch powered by Web3Forms API with instant local PKT time ticker",
      "Responsive slide-out navigation drawer with body scroll locking and mobile-first touch ergonomics"
    ],
    github: "https://github.com/Ijlal-Hussaini/Ijlal-hussain-Portfolio",
    demo: "https://ijlalhussain.vercel.app/",
    description: "Production-grade personal digital portfolio engineered with React 19, TypeScript, Vite 6, and Tailwind CSS v4. Features high-density glassmorphism, responsive side-drawer navigation, hash-based URL routing, interactive credential verification, and sub-second asset delivery on Vercel Global Edge.",
    imageUrl: "portfolio",
    coverImage: "/assets/projects/portfolio/01_home_view.png",
    images: [
      {
        seq: 1,
        title: "1. Home & Hero Stage",
        url: "/assets/projects/portfolio/01_home_view.png",
        caption: "Glassmorphic hero section featuring dynamic typewriter titles, key architectural pillars, and quick work showcase."
      },
      {
        seq: 2,
        title: "2. About the Developer & Career Timeline",
        url: "/assets/projects/portfolio/02_about_view.png",
        caption: "Interactive career ascent timeline, verified education credentials (NUML 3.96 CGPA), and categorized skillset pills."
      },
      {
        seq: 3,
        title: "3. Project Showcase & Mobile UI Gallery",
        url: "/assets/projects/portfolio/03_projects_view.png",
        caption: "Multi-field search, category filtration, deep-dive modal inspections, and sequential screenshot lightboxes."
      },
      {
        seq: 4,
        title: "4. Verified Credentials Ledger",
        url: "/assets/projects/portfolio/04_certifications_view.png",
        caption: "Dynamic accreditation ledger with 1-click signed PDF certificate inspections and download triggers."
      },
      {
        seq: 5,
        title: "5. Direct Communications & Live Gateway",
        url: "/assets/projects/portfolio/05_contact_view.png",
        caption: "Real-time Web3Forms email pipeline, live local PKT time ticker, and direct WhatsApp contact link."
      }
    ]
  }
];

export const certificationsData: Certification[] = [
  {
    id: "cert1",
    title: "Generative AI & Machine Learning",
    organization: "NAVTTC · Adan Institute of Technology",
    period: "Sep – Dec 2025",
    credentialId: "I-25-1082873",
    status: "Completed",
    pdfUrl: "/assets/certifications/NAVTTC_Generative_AI_Machine_Learning_Certificate.pdf",
    imageUrl: "/assets/certifications/Generative_AI_Machine_Learning.png"
  },
  {
    id: "cert2",
    title: "AI Development Internship",
    organization: "Kartoa Technologies",
    period: "Jan – Mar 2026",
    status: "Completed",
    pdfUrl: "/assets/certifications/Ijlal_Hussain_AI_Internship_letter.pdf",
    imageUrl: "/assets/certifications/AI_Development_Internship.png"
  },
  {
    id: "cert3",
    title: "Python Essentials 1",
    organization: "Cisco Networking Academy · Adan Institute",
    period: "Aug 2025",
    status: "Completed",
    pdfUrl: "/assets/certifications/Ijlal_Hussain_Python_Essential_01_Certificate.pdf",
    imageUrl: "/assets/certifications/Python_Essentials_1.png"
  },
  {
    id: "cert4",
    title: "Freelancing",
    organization: "DigiSkills · Ministry of IT Pakistan",
    period: "Aug – Nov 2025",
    credentialId: "JGJ2JHXMK",
    status: "Completed",
    pdfUrl: "/assets/certifications/DigiSkill_Freelancing_Certificate.pdf",
    imageUrl: "/assets/certifications/Freelancing.png"
  },
  {
    id: "cert5",
    title: "Graphic Design",
    organization: "DigiSkills · Ministry of IT Pakistan",
    period: "Aug – Nov 2025",
    credentialId: "AKNNZS4MK",
    status: "Completed",
    pdfUrl: "/assets/certifications/DigiSkill_Graphics_Designing_Certificate.pdf",
    imageUrl: "/assets/certifications/Graphics_Designing.png"
  },
  {
    id: "cert6",
    title: "Requirements Engineering",
    organization: "NUML × Alberuni Tech",
    period: "Aug – Oct 2025",
    status: "Completed",
    pdfUrl: "/assets/certifications/Requirement_Engineering_NUML_x_Alberuni_Tech.pdf",
    imageUrl: "/assets/certifications/Requirement_Engineering.png"
  }
];

export const educationData: Education[] = [
  {
    degree: "BS Software Engineering",
    institution: "NUML Islamabad",
    period: "Mar 2022 – Mar 2026",
    grade: "CGPA: 3.96 / 4.0"
  },
  {
    degree: "Intermediate (Computer Science)",
    institution: "Government Boys Degree College, Danyore Gilgit",
    period: "Aug 2020 – Mar 2022",
    grade: "Grade B (62%)"
  },
  {
    degree: "Matriculation (General Science)",
    institution: "Vision Higher Secondary School, Danyore Gilgit",
    period: "Apr 2016 – Jun 2018",
    grade: "Grade A (78%)"
  }
];

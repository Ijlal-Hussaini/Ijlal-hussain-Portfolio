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
  skills: { name: string; level?: string }[];
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
  cgpa: "3.96/4.0",
  photoUrl: "/assets/images/profile_photo.png",
  resumeUrl: "/Ijlal_Hussain_CV.pdf"
};

export const skillsData: SkillCategory[] = [
  {
    category: "Generative AI & ML",
    skills: [
      { name: "Python", level: "Expert" },
      { name: "LangChain", level: "Advanced" },
      { name: "LangGraph", level: "Advanced" },
      { name: "RAG Development", level: "Advanced" },
      { name: "AI Agents", level: "Advanced" },
      { name: "LLMs", level: "Advanced" },
      { name: "Prompt Engineering", level: "Expert" },
      { name: "Tavily AI", level: "Intermediate" }
    ]
  },
  {
    category: "Web Development",
    skills: [
      { name: "React.js", level: "Advanced" },
      { name: "Node.js", level: "Advanced" },
      { name: "Express.js", level: "Advanced" },
      { name: "MongoDB", level: "Advanced" },
      { name: "HTML/CSS/JS", level: "Expert" },
      { name: "REST APIs", level: "Advanced" }
    ]
  },
  {
    category: "Android Development",
    skills: [
      { name: "Android (Java)", level: "Expert" },
      { name: "Flutter", level: "Intermediate" },
      { name: "Firebase", level: "Advanced" },
      { name: "Material Design", level: "Advanced" },
      { name: "Android Studio", level: "Expert" }
    ]
  },
  {
    category: "Software Engineering",
    skills: [
      { name: "Requirements Engineering", level: "Expert" },
      { name: "System Design", level: "Advanced" },
      { name: "SRS / BRD", level: "Expert" },
      { name: "Use Case Modeling", level: "Expert" },
      { name: "Software Testing", level: "Advanced" }
    ]
  },
  {
    category: "Tools & Platforms",
    skills: [
      { name: "Git & GitHub", level: "Expert" },
      { name: "VS Code", level: "Expert" },
      { name: "Figma", level: "Advanced" },
      { name: "Firebase Dashboard", level: "Advanced" },
      { name: "MS Office", level: "Expert" }
    ]
  },
  {
    category: "Languages",
    skills: [
      { name: "English", level: "Independent / Professional" },
      { name: "Urdu", level: "Native" },
      { name: "Brushaski", level: "Mother Tongue" }
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
    description: "Safe Zone is a complete high-fidelity parental control Android system designed to curate a safer digital space for children. Developed as my Final Year Project (FYP) at NUML, the system splits into a parent dashboard and a child monitor, synchronizing instantly using Firebase cloud endpoints.",
    imageUrl: "SafeZone",
    coverImage: "/assets/projects/SafeZone/screenshot2.jpeg",
    images: [
      {
        seq: 1,
        title: "1. Parent Authentication & Login",
        url: "/assets/projects/SafeZone/screenshot2.jpeg",
        caption: "Secure login interface supporting Firebase Auth, remember me session persistence, and password recovery."
      },
      {
        seq: 2,
        title: "2. Parent Multi-Device Dashboard",
        url: "/assets/projects/SafeZone/screenshot3.jpeg",
        caption: "Centralized parent hub showing linked children with real-time status indicators and child management controls."
      },
      {
        seq: 3,
        title: "3. Child Supervision & Monitoring Panel",
        url: "/assets/projects/SafeZone/screenshot4.jpeg",
        caption: "Parent supervision panel granting access to Activity Logs, Screen Time Limits, Content Filtering, and Live Location."
      },
      {
        seq: 4,
        title: "4. Screen Time Management & Rules",
        url: "/assets/projects/SafeZone/screenshot5.jpeg",
        caption: "Interactive configuration for daily hour and minute caps with exception list for whitelisted apps."
      },
      {
        seq: 5,
        title: "5. Detailed App Usage Activity Logs",
        url: "/assets/projects/SafeZone/screenshot6.jpeg",
        caption: "Comprehensive application usage breakdown detailing active durations for installed applications."
      },
      {
        seq: 6,
        title: "6. Content Filtering & Website Blocking",
        url: "/assets/projects/SafeZone/screenshot7.jpeg",
        caption: "Parent control for managing blocked domain list with instant cloud synchronization."
      },
      {
        seq: 7,
        title: "7. Live Geofencing & GPS Tracking",
        url: "/assets/projects/SafeZone/screenshot8.jpeg",
        caption: "Interactive map displaying live child GPS coordinates with high precision around defined safe zones."
      },
      {
        seq: 8,
        title: "8. Child Restricted Home Screen",
        url: "/assets/projects/SafeZone/screenshot9.jpeg",
        caption: "Child device dashboard showing remaining screen time quota and real-time blocked app/website enforcement."
      },
      {
        seq: 9,
        title: "9. Device Pairing via QR Code",
        url: "/assets/projects/SafeZone/screenshot10.jpeg",
        caption: "Step-by-step QR code generation and pairing key verification for instantly linking child devices."
      },
      {
        seq: 10,
        title: "10. Child Profile Settings & Parent Link",
        url: "/assets/projects/SafeZone/screenshot11.jpeg",
        caption: "Profile configuration for child account linked directly to the parent account."
      },
      {
        seq: 11,
        title: "11. Child Request Extra Time & System Controls",
        url: "/assets/projects/SafeZone/screenshot13.jpeg",
        caption: "Child overlay dialog allowing one-tap requests for extra screen time sent directly to the parent dashboard."
      }
    ]
  },
  {
    id: "blogfactory",
    title: "Blog Factory — AI Blog Generator",
    category: "AI/ML",
    tech: ["Python", "LangChain", "LangGraph", "Tavily AI", "LLMs"],
    features: [
      "Fully autonomous writing and research pipeline orchestrated by LangGraph",
      "Real-time web search and content verification with Tavily integration",
      "Multi-agent architecture with critique, revision, and refinement loops",
      "Dynamic code injection and Markdown formatting with syntactic correctness checks",
      "Flexible output structuring for modern static-site engines"
    ],
    github: "https://github.com/Ijlal-Hussaini/technical-blog-factory",
    description: "An advanced, fully autonomous technical blog publishing engine powered by modern LLMs. It uses a graph-based multi-agent architecture where specialist agents research, draft, cross-reference, and refine content to deliver production-ready, deeply informative articles with zero human intervention.",
    imageUrl: "blogfactory",
    coverImage: "/assets/projects/blogfactory/Home.png",
    images: [
      {
        seq: 1,
        title: "1. Technical Blog Factory Home Dashboard",
        url: "/assets/projects/blogfactory/Home.png",
        caption: "Main application workspace displaying saved technical posts, AI creation triggers, and article analytics."
      },
      {
        seq: 2,
        title: "2. Generating New Blog Post",
        url: "/assets/projects/blogfactory/Generating New Blog Post.png",
        caption: "Autonomous multi-agent LangGraph workflow running live research, web search synthesis, and section drafting."
      },
      {
        seq: 3,
        title: "3. Blog Post Generated",
        url: "/assets/projects/blogfactory/Blog Post Generated.png",
        caption: "Fully rendered blog article with Markdown formatting, structured headings, and technical breakdown."
      },
      {
        seq: 4,
        title: "4. Added Code Snippet",
        url: "/assets/projects/blogfactory/Added Code Snippet.png",
        caption: "Live code injection with syntax highlighting and verification integrated directly into technical tutorials."
      }
    ]
  },
  {
    id: "cvparser",
    title: "CV Parser — NLP Resume Analyzer",
    category: "AI/ML",
    tech: ["Python", "NLP", "spaCy", "JSON Schema"],
    features: [
      "Named Entity Recognition (NER) for high-accuracy contact, experience, and education extraction",
      "Custom skill taxonomy classification and semantic tagging",
      "Standardized, clean, structured JSON schema output",
      "Automated PDF & Word parsing engine with clean text preprocessing",
      "Candidate matching algorithms based on extracted skills profiles"
    ],
    github: "https://github.com/Ijlal-Hussaini",
    description: "An AI-powered document parser specializing in resume analysis. Built using python Natural Language Processing (NLP) toolkits, it converts unformatted PDF/DOCX resumes into highly structured data files ready for automated candidate tracking systems.",
    imageUrl: "cvparser",
    coverImage: "/assets/projects/cvparser/cover.png",
    images: [
      {
        seq: 1,
        title: "1. NLP Entity Extraction Architecture",
        url: "/assets/projects/cvparser/1.png",
        caption: "Visual breakdown showing raw text parsing converted to structured JSON schemas."
      },
      {
        seq: 2,
        title: "2. Skill Classification Matrix",
        url: "/assets/projects/cvparser/2.png",
        caption: "Semantic tagging engine identifying skills, educational history, and work experience."
      }
    ]
  },
  {
    id: "portfolio",
    title: "Portfolio — Modern Personal Website",
    category: "Web",
    tech: ["HTML5", "Tailwind CSS v4", "React 19", "Motion", "Lucide Icons"],
    features: [
      "Responsive fluid layouts tailored for high-density monitors and mobile browsers",
      "Glassmorphic aesthetic matching custom cosmic design system constraints",
      "Custom state-based micro-routing with smooth page transition animations",
      "Integrated dynamic PDF Viewer mockups",
      "Fully responsive navigation, contact verification, and localized performance"
    ],
    github: "https://github.com/Ijlal-Hussaini",
    description: "The premium personal digital home of software engineer Ijlal Hussain. This application features responsive glassmorphic cards, custom typewriter titles, dynamic project category filtration, and deep smooth transitions powered by modern React 19 and Tailwind CSS v4.",
    imageUrl: "portfolio",
    coverImage: "/assets/projects/portfolio/cover.png",
    images: [
      {
        seq: 1,
        title: "1. Desktop Portfolio Showcase",
        url: "/assets/projects/portfolio/1.png",
        caption: "Glassmorphic hero section and dynamic category filtration grid."
      },
      {
        seq: 2,
        title: "2. Responsive Component Architecture",
        url: "/assets/projects/portfolio/2.png",
        caption: "Mobile drawer navigation, interactive certifications, and verified contact widgets."
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
    degree: "Matriculation (Medical Sciences)",
    institution: "Vision Higher Secondary School, Danyore Gilgit",
    period: "Apr 2016 – Jun 2018",
    grade: "Grade A (78%)"
  }
];

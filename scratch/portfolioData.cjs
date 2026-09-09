const personalInfo = {
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

const skillsData = [
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

const experienceData = [
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

const projectsData = [
  {
    id: "safezone",
    title: "Safe Zone — Parental Control App",
    category: "Mobile",
    tech: ["Java", "Android SDK", "Firebase Realtime DB", "Figma", "Material Design"],
    description: "Safe Zone is a complete high-fidelity parental control Android system..."
  },
  {
    id: "blogfactory",
    title: "Technical Blog Post Factory — Multi-Agent AI Studio",
    category: "AI/ML",
    tech: ["Python", "FastAPI", "LangGraph", "LangChain", "Gemini 2.5 Flash", "Groq Cloud", "Tavily AI", "Pydantic v2"],
    description: "Enterprise-ready autonomous multi-agent technical blog publishing engine..."
  },
  {
    id: "resumeiq",
    title: "ResumeIQ — AI Career Intelligence Platform",
    category: "AI/ML",
    tech: ["LangGraph", "FastAPI", "Next.js 16", "Groq Cloud", "Gemini AI", "RAG", "Pydantic v2", "Tailwind CSS v4"],
    description: "Production-grade, field-agnostic career intelligence platform..."
  },
  {
    id: "portfolio",
    title: "Developer Portfolio — High-Performance Engineering Platform",
    category: "Web",
    tech: ["React 19", "TypeScript", "Vite 6", "Tailwind CSS v4", "Motion", "Web3Forms"],
    description: "Production-grade personal digital portfolio..."
  }
];

const certificationsData = [
  {
    id: "cert1",
    title: "Generative AI & Machine Learning",
    organization: "NAVTTC · Adan Institute of Technology",
    period: "Sep – Dec 2025",
    credentialId: "I-25-1082873"
  },
  {
    id: "cert2",
    title: "AI Development Internship",
    organization: "Kartoa Technologies",
    period: "Jan – Mar 2026"
  },
  {
    id: "cert3",
    title: "Python Essentials 1",
    organization: "Cisco Networking Academy · Adan Institute",
    period: "Aug 2025"
  },
  {
    id: "cert4",
    title: "Freelancing",
    organization: "DigiSkills · Ministry of IT Pakistan",
    period: "Aug – Nov 2025",
    credentialId: "JGJ2JHXMK"
  },
  {
    id: "cert5",
    title: "Graphic Design",
    organization: "DigiSkills · Ministry of IT Pakistan",
    period: "Aug – Nov 2025",
    credentialId: "AKNNZS4MK"
  },
  {
    id: "cert6",
    title: "Requirements Engineering",
    organization: "NUML × Alberuni Tech",
    period: "Aug – Oct 2025"
  }
];

const educationData = [
  {
    degree: "BS Software Engineering",
    institution: "NUML Islamabad",
    period: "Feb 2022 – Jan 2026",
    grade: "CGPA: 3.96 / 4.0"
  },
  {
    degree: "Intermediate (Computer Science)",
    institution: "Government Boys Degree College, Danyore Gilgit",
    period: "Sep 2019 – Sep 2021",
    grade: "Grade B (62%)"
  },
  {
    degree: "Matriculation (General Science)",
    institution: "Vision Higher Secondary School, Danyore Gilgit",
    period: "Apr 2016 – Jun 2018",
    grade: "Grade A (78%)"
  }
];

module.exports = {
  personalInfo,
  skillsData,
  experienceData,
  educationData,
  projectsData,
  certificationsData
};

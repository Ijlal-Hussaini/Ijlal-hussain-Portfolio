const { personalInfo, skillsData, experienceData, educationData, projectsData, certificationsData } = require("./portfolioData.cjs");

function editDistance(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) matrix[i][j] = matrix[i - 1][j - 1];
      else matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    }
  }
  return matrix[b.length][a.length];
}

const KNOWN_VOCABULARY = new Set([
  "hi", "hello", "hey", "salam", "assalam", "aoa", "greetings", "good", "morning", "afternoon", "evening", "night",
  "welcome", "welcoming", "welcomed", "wlcm", "howdy", "hiya", "yo", "bonjour", "namaste", "salut", "cheers", "peace",
  "how", "are", "you", "doing", "is", "he", "what", "where", "why", "when", "who", "which", "can", "could", "would", "should",
  "tell", "show", "give", "list", "see", "view", "find", "get", "download", "talk", "chat", "contact", "call", "email", "mail",
  "phone", "whatsapp", "linkedin", "github", "hire", "work", "job", "available", "availability", "project", "projects",
  "latest", "recent", "newest", "new", "first", "oldest", "earliest", "initial", "flagship", "best", "top", "favorite", "favourite", "impressive",
  "skill", "skills", "tech", "stack", "education", "degree", "university", "school", "college", "cgpa", "gpa", "marks", "grades",
  "resume", "cv", "experience", "internship", "lead", "leadership", "cert", "certs", "certificate", "certificates", "certification", "certifications",
  "android", "java", "python", "ai", "ml", "genai", "generative", "langgraph", "langchain", "rag", "fastapi", "react", "nextjs", "typescript",
  "javascript", "tailwind", "node", "express", "mongo", "mongodb", "firebase", "flutter", "dart", "postman", "figma", "git",
  "docker", "dockerfile", "container", "containers", "containerization", "devops", "mern", "rest", "api", "apis", "microservice", "microservices",
  "database", "databases", "chromadb", "faiss", "pydantic", "sentence", "transformers", "prompting", "guardrails", "guardrail", "tavily",
  "ats", "scoring", "keyword", "keywords", "formula", "accessibility", "devicepolicy", "srs", "brd", "uml", "usecase", "curriculum", "scholarship", "distinction", "mother", "tongue",
  "english", "urdu", "brushaski", "language", "languages", "gilgit", "islamabad", "pakistan", "time", "timezone", "location", "city", "country",
  "age", "old", "born", "birthday", "salary", "rate", "rates", "budget", "pricing", "interview", "meeting", "pwa", "offline",
  "help", "menu", "options", "commands", "about", "profile", "bio", "background", "summary", "overview", "json", "jason", "data", "info", "information",
  "ok", "okay", "sure", "cool", "nice", "fine", "perfect", "yes", "no", "thanks", "thank", "bye", "goodbye", "weakness", "weaknesses",
  "strengths", "strength", "strong", "great", "awesome", "smart", "clever", "bot", "assistant", "agent", "app", "apps", "website",
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
  "framework", "frameworks", "library", "libraries", "system", "systems", "application", "applications", "things", "been", "doing",
  "level", "proficiency", "percentage", "percent", "score", "scores", "grade", "grades", "first class", "honors", "distinction", "highest",
  "subject", "subjects", "course", "courses", "coursework", "passion", "passionate", "challenge", "challenges", "problem", "problems",
  "target", "role", "roles", "position", "frontend", "backend", "fullstack", "style", "ethic", "php", "rust", "ruby", "aws", "c++", "cpp", "c#", "csharp", "swift", "kotlin", "go", "golang", "vue", "angular", "django", "laravel",
  "career", "careers", "goal", "goals", "aspiration", "aspirations", "seek", "seeking", "tackle", "tackled", "joke", "jokes", "story", "stories", "solve", "solves", "solving", "calculator", "calculate", "math", "quicksort", "bubble", "array", "binary", "tree", "component", "navbar", "essay", "poem",
  "qualification", "qualifications", "study", "studied", "defin", "defne", "dfine", "definition", "definitions", "explain", "explanation", "concept", "concepts", "meaning",
  "soft", "communication", "teamwork", "interpersonal", "adaptability", "collaborate", "collaborating", "collaboration", "collaborative", "mentorship", "mentor", "mentoring", "analytical", "reference", "references", "compare", "difference", "versus", "vs", "summarize", "summary", "executive", "preferred", "preference", "join", "joiner", "soon", "earliest",
  "technologies", "technology", "candidate", "hometown", "person", "owner", "einstein", "biology", "physics", "chemistry", "algorithm", "programming", "growth", "improvement", "improvements", "five", "years", "year", "see", "himself", "myself", "yourself", "site", "govt", "secondary", "boys",
  "ijlal", "hussain", "hussaini", "ijla", "hussin", "husain", "itjal", "itjall", "ijall", "ejlal"
]);

function isRecognizedToken(token) {
  const t = token.toLowerCase();
  if (KNOWN_VOCABULARY.has(t)) return true;
  for (const known of KNOWN_VOCABULARY) {
    const distLimit = known.length <= 3 ? 0 : (known.length <= 6 ? 1 : 2);
    if (Math.abs(t.length - known.length) <= distLimit) {
      if (editDistance(t, known) <= distLimit) return true;
    }
  }
  return false;
}

function hasFuzzyWord(tokens, target, maxDist = 2) {
  const targetLower = target.toLowerCase();
  if (targetLower.length <= 5 || targetLower === "contact" || targetLower === "contract" || targetLower === "first" || targetLower === "best" || targetLower === "list") {
    return tokens.some((token) => token.toLowerCase() === targetLower);
  }
  return tokens.some((token) => {
    const t = token.toLowerCase();
    if (t === targetLower) return true;
    if (Math.abs(t.length - targetLower.length) <= maxDist) {
      return editDistance(t, targetLower) <= maxDist;
    }
    return false;
  });
}

function getPKTTime() {
  return "UTC+5 (Pakistan Standard Time)";
}

function generateGroundedResponse(rawQuery) {
  const normalizedRaw = rawQuery.toLowerCase().replace(/c\+\+/g, "cpp").replace(/c#/g, "csharp");
  const q = normalizedRaw.trim();
  const cleanWords = q
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const rawTokens = cleanWords.split(/\s+/).filter(Boolean);

  // Normalize phonetic and typo variations
  const tokens = rawTokens.map((t) => {
    if (/^(wat|waht|wht|whut|whta|wahtt)$/.test(t)) return "what";
    if (/^(wich|whch|whic)$/.test(t)) return "which";
    if (/^(wer|wher|whre|whr)$/.test(t)) return "where";
    if (/^(wen|whn|whern)$/.test(t)) return "when";
    if (/^(hw|howw|ho)$/.test(t)) return "how";
    if (/^(wh|whoo|wo)$/.test(t)) return "who";
    if (/^(tel|telll|tll)$/.test(t)) return "tell";
    if (/^(shw|sho|showw)$/.test(t)) return "show";
    if (/^(giv|gve)$/.test(t)) return "give";
    if (/^(expln|explainn|explan|xplain)$/.test(t)) return "explain";
    if (/^(defin|defne|dfine|definitiin|definiton)$/.test(t)) return "definition";
    if (/^(mening|meannig)$/.test(t)) return "meaning";
    if (/^(pythn|pytn|pyhton|pythoon|pthon)$/.test(t)) return "python";
    if (/^(jav|javaa)$/.test(t)) return "java";
    if (/^(rct|reakt|reactjs|reactt)$/.test(t)) return "react";
    if (/^(nxtjs|nextj|nextts)$/.test(t)) return "nextjs";
    if (/^(typscript|typescrip|typcsript)$/.test(t)) return "typescript";
    if (/^(jvascript|javascrip|javscript)$/.test(t)) return "javascript";
    if (/^(fastpi|fastap|fastappi)$/.test(t)) return "fastapi";
    if (/^(dockr|dokr)$/.test(t)) return "docker";
    if (/^(chrmodb|chroma)$/.test(t)) return "chromadb";
    if (/^(pydantc)$/.test(t)) return "pydantic";
    if (/^(firebas|firebse|firbase)$/.test(t)) return "firebase";
    if (/^(mongod|mongdb|mngodb)$/.test(t)) return "mongodb";
    if (/^(talwind|tailwnd|tlwind)$/.test(t)) return "tailwind";
    if (/^(fluttr|fluter)$/.test(t)) return "flutter";
    if (/^(postmn)$/.test(t)) return "postman";
    if (/^(fgma)$/.test(t)) return "figma";
    if (/^(gthub|githb|gitub)$/.test(t)) return "github";
    if (/^(experence|exprnc|experince|expreience)$/.test(t)) return "experience";
    if (/^(proficency|proficienc|proficincy)$/.test(t)) return "proficiency";
    if (/^(itjall|itjal|ijall|ijlla|ijla|ijlall|ijhall|ijlaal|ijlas|ejlal|ejlaal|ijlal)$/.test(t)) return "ijlal";
    if (/^(hussani|hussaini|husain|hussan|hussin|husayn|husein|hussien|hossain|hossin|hussain|hussains)$/.test(t)) return "hussain";
    if (/^(cgoa|cgpaa|cgpa|cpa|gpaa|gpa)$/.test(t)) return "cgpa";
    if (/^(softwer|softwere|sofware)$/.test(t)) return "software";
    if (/^(enginerign|enginering|enginnering|enginer)$/.test(t)) return "engineering";
    if (/^(graduat|graduated|grad)$/.test(t)) return "graduate";
    if (/^(numal|noml)$/.test(t)) return "numl";
    if (/^(interess|intrest|intrested|interested)$/.test(t)) return "interest";
    if (/^(develoe|develoepr|developement|developer|dev)$/.test(t)) return "develop";
    if (/^(projekts|projkts|prjcts|projets|project|projects)$/.test(t)) return "project";
    if (/^(safezon|safzone|safez)$/.test(t)) return "safezone";
    if (/^(resumieq|resumiq|resumek)$/.test(t)) return "resumeiq";
    if (/^(kartva|kartoas)$/.test(t)) return "kartoa";
    if (/^(alberoni|alberuni|albaruni)$/.test(t)) return "alberuni";
    if (/^(cert|certs|certificate|certificates|certification|certifications)$/.test(t)) return "certification";
    if (/^(navtc|navttc)$/.test(t)) return "navttc";
    if (/^(langgrap|langraph)$/.test(t)) return "langgraph";
    if (/^(langchan|lanchain)$/.test(t)) return "langchain";
    if (/^(tavly|tavili)$/.test(t)) return "tavily";
    if (/^(favorit|favourite|favorute|favoroutie|favoruite)$/.test(t)) return "favorite";
    if (/^(subet|subjct|subjec|subjets)$/.test(t)) return "subject";
    if (/^(educatoin|eductaion|educaton|eduation|eductn|educasion|edukation|education)$/.test(t)) return "education";
    if (/^(degre|deree|degreee|degree)$/.test(t)) return "degree";
    if (/^(colg|colleg|collge|college)$/.test(t)) return "college";
    if (/^(univrsty|universty|univercity|univrsity|uni|university)$/.test(t)) return "university";
    if (/^(skool|shcool|schol|school)$/.test(t)) return "school";
    if (/^(qualifaction|qualificaton|qualification|qualifications)$/.test(t)) return "qualification";
    return t;
  });

  const hasWord = (target, maxDist = 2) => hasFuzzyWord(tokens, target, maxDist) || hasFuzzyWord(rawTokens, target, maxDist);
  const contains = (phrase) => cleanWords.includes(phrase.toLowerCase()) || tokens.join(" ").includes(phrase.toLowerCase());

  // 1. JSON DATA EXPORT
  if (hasWord("json") || contains("json") || contains("jason")) {
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
      type: "JSON_EXPORT",
      text: `\`\`\`json\n${JSON.stringify(jsonOutput, null, 2)}\n\`\`\``,
      actionLink: { label: "Explore Projects", tab: "Projects" }
    };
  }

  // 2. GREETINGS & SALUTATIONS
  if (
    /^(hi|hello|hey|salam|assalam|aoa|hy|hola|greetings|welcome|welcome\s*here|howdy|hiya|yo|bonjour|namaste|good\s*(morning|afternoon|evening|day|night))(\s|$)/i.test(cleanWords) ||
    hasWord("hello", 1) ||
    hasWord("salam", 1) ||
    hasWord("welcome", 1) ||
    contains("welcome")
  ) {
    return {
      type: "GREETING",
      text: `Hello and welcome! 👋 I'm **Ijlal's AI Assistant**. How can I help you today? Ask me about his software engineering projects (ResumeIQ, SafeZone, Blog Factory), his **3.96 CGPA** at NUML, his Generative AI stack, or how to contact him!`,
      actionLink: { label: "View About & Skills", tab: "About" }
    };
  }

  // 3. CONVERSATIONAL WELL-BEING
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
    ((tokens.includes("how") && (tokens.includes("going") || tokens.includes("doing") || (tokens.includes("are") && tokens.includes("you")) || tokens.includes("things"))) && !tokens.includes("work") && !tokens.includes("built") && !tokens.includes("made") && !tokens.includes("contact") && !tokens.includes("hire") && !tokens.includes("help") && !tokens.includes("many"))
  ) {
    return {
      type: "WELL_BEING",
      text: `I'm doing great, thank you for asking! 😊 I'm ready to answer any questions about Ijlal's software engineering projects, skills, education, or career experience. How can I help you today?`,
      actionLink: { label: "Explore Projects", tab: "Projects" }
    };
  }

  // 4. CONVERSATIONAL ACKNOWLEDGMENTS
  const ackWords = ["ok", "okay", "k", "kk", "alright", "sure", "cool", "nice", "fine", "perfect", "yes", "yep", "yeah", "no", "nah", "nope", "understood", "noted", "good", "got", "it", "sounds"];
  if (
    /^(ok|okay|k|kk|alright|sure|cool|nice|got it|fine|perfect|yes|yep|yeah|no|nah|nope|sounds good|understood|noted)$/i.test(cleanWords) ||
    (rawTokens.length <= 3 && rawTokens.every((t) => ackWords.includes(t.toLowerCase())))
  ) {
    return {
      type: "ACKNOWLEDGMENT",
      text: `Got it! 👍 Feel free to ask anything else about Ijlal's background, projects, or skills!`,
      actionLink: { label: "Explore Projects", tab: "Projects" }
    };
  }

  // 5. GRATITUDE & CLOSING
  if (/^(thank|thanks|thank\s+you|appreciate|awesome|great|cool|goodbye|bye)(\s|$)/i.test(cleanWords) || hasWord("thanks", 1)) {
    return {
      type: "GRATITUDE",
      text: `You're very welcome! 😊 Feel free to reach out to Ijlal directly through the contact section if you'd like to collaborate or connect!`,
      actionLink: { label: "Open Contact Form", tab: "Contact" }
    };
  }

  // 6. BOT COMPLIMENTS
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
      type: "PRAISE",
      text: `Thank you so much! 😊 I'm designed to represent Ijlal's software engineering background as accurately and smoothly as possible. Feel free to explore his projects or reach out directly!`,
      actionLink: { label: "Explore Projects", tab: "Projects" }
    };
  }

  // 7. CREATOR & ORIGIN
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
      type: "CREATOR",
      text: `I was built and trained by **Ijlal Hussain** as part of his high-performance developer portfolio! 🚀 I run 100% in your browser with zero latency and zero external API dependencies.`,
      actionLink: { label: "View About & Skills", tab: "About" }
    };
  }

  // 8. HUMAN VS AI / ARE YOU REAL
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
      type: "HUMAN_VS_AI",
      text: `I am Ijlal's **AI Portfolio Assistant**, running 100% in your browser. If you'd like to speak with **Ijlal Hussain directly in person**, you can reach him via email at **${personalInfo.email}**, WhatsApp at **${personalInfo.phone}**, or LinkedIn! 📬`,
      actionLink: { label: "Open Contact Form", tab: "Contact" }
    };
  }

  // 9. BOT IDENTITY & ARCHITECTURE
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
      type: "BOT_IDENTITY",
      text: `I am **Ijlal's AI Portfolio Assistant**, running 100% in your browser. I can answer any questions about Ijlal's software engineering projects, academic honors, verified certifications, and skills! 😊`,
      actionLink: { label: "Explore Projects", tab: "Projects" }
    };
  }

  if (
    contains("what model are you") ||
    contains("what llm is this") ||
    contains("what ai is this") ||
    contains("what model do you use") ||
    contains("are you chatgpt") ||
    contains("are you llama") ||
    contains("are you deepseek") ||
    contains("are you gemini") ||
    contains("are you claude") ||
    contains("how does this bot work") ||
    contains("how was this bot built") ||
    contains("how do you work") ||
    contains("is this bot local") ||
    contains("is this ai local") ||
    (hasWord("model") && (hasWord("you") || hasWord("bot") || hasWord("assistant") || hasWord("this"))) ||
    (hasWord("bot") && (hasWord("work") || hasWord("built") || hasWord("made") || hasWord("tech")))
  ) {
    return {
      type: "CHATBOT_INFO",
      text: `🤖 **About This Portfolio AI Assistant:**\nI am Ijlal Hussain's custom **100% client-side AI Assistant**! ⚡\n\n• **Zero Latency**: Runs entirely in your browser within React 19 & TypeScript without external API bottlenecks.\n• **Intelligent Semantic Engine**: Features token-level typo normalization, Levenshtein distance matching, and exhaustive knowledge grounding across all of Ijlal's projects, coursework, and credentials.`,
      actionLink: { label: "Explore Projects", tab: "Projects" }
    };
  }

  // 10. HELP / MENU
  if (hasWord("help", 0) || contains("what can you do") || contains("menu") || contains("options") || contains("how to use")) {
    return {
      type: "HELP",
      text: `💡 **Here's what you can ask me:**\n• **Academic**: *"What is Ijlal's CGPA?"*, *"Where did he study?"*, *"Favorite subject?"*\n• **Projects**: *"Tell me about ResumeIQ"*, *"SafeZone APK"*, *"Blog Factory"*\n• **AI Tech**: *"LangGraph & RAG experience"*, *"Dual LLM setup"*\n• **Experience**: *"Kartoa internship"*, *"Leadership role"*\n• **Certifications**: *"NAVTTC cert"*, *"Cisco Python cert"*\n• **Hiring & Contact**: *"Why hire Ijlal?"*, *"Is he available?"*, *"Email / WhatsApp"*\n• **Data Export**: *"Give portfolio data in JSON"*`,
      actionLink: { label: "Explore Projects", tab: "Projects" }
    };
  }

  // 11. OUT-OF-BOUNDS / OFF-TOPIC GUARDRAIL
  const isGeneralCodingTask = (
    (contains("write a") || contains("write code") || contains("generate code") || contains("write script") || contains("solve this") || contains("calculate") || contains("fix my code") || contains("write python") || contains("write java") || contains("write c") || contains("create code") || contains("write me") || contains("write sql") || contains("write query") || contains("invert binary tree") || contains("quicksort")) &&
    (hasWord("code") || hasWord("script") || hasWord("python") || hasWord("javascript") || hasWord("java") || hasWord("function") || hasWord("algorithm") || hasWord("program") || hasWord("html") || hasWord("css") || hasWord("sql") || hasWord("tree") || contains("sort")) &&
    !hasWord("ijlal") && !hasWord("portfolio") && !hasWord("safezone") && !hasWord("resumeiq") && !hasWord("blogfactory")
  );

  const isGeneralTrivia = (
    contains("capital of") ||
    contains("who is the president") ||
    contains("who is prime minister") ||
    contains("who won") ||
    contains("weather in") ||
    contains("tell me a story") ||
    contains("tell a story") ||
    hasWord("story") ||
    contains("what is photosynthesis") ||
    contains("what is quantum") ||
    contains("bitcoin price") ||
    contains("crypto") ||
    contains("meaning of life") ||
    contains("recipe for") ||
    contains("write an essay") ||
    contains("write a poem") ||
    contains("tell me a joke") ||
    contains("tell a joke") ||
    hasWord("joke") ||
    hasWord("jokes") ||
    contains("calculate") ||
    contains("solve this") ||
    contains("solve math") ||
    contains("solve equation") ||
    /solve\s+\d+/.test(cleanWords) ||
    (contains("math") && !hasWord("numl") && !hasWord("grade") && !hasWord("matric")) ||
    /\b\d+\s*[\+\-\*\/x]\s*\d+\b/.test(rawQuery) ||
    /^\d+\s*[\+\-\*\/x]\s*\d+$/.test(rawQuery.trim()) ||
    contains("who was einstein") ||
    contains("einstein") ||
    contains("what is pythons") ||
    contains("pythons") ||
    contains("snake") ||
    contains("snakes") ||
    contains("what is software engineering") ||
    contains("define software engineering") ||
    contains("what is computer science") ||
    contains("define computer science") ||
    contains("what is an operating system") ||
    contains("what is hardware") ||
    contains("what is internet") ||
    contains("what is cybersecurity") ||
    contains("what is cloud computing") ||
    contains("what is data science") ||
    contains("what is biology") ||
    contains("what is physics") ||
    contains("what is chemistry") ||
    contains("what is an algorithm") ||
    contains("define algorithm") ||
    contains("what is programming") ||
    contains("what is artificial intelligence")
  );

  if (isGeneralCodingTask || isGeneralTrivia) {
    return {
      type: "OUT_OF_CONTEXT",
      text: `Sorry, that's outside my context or not in my knowledge base regarding **Ijlal Hussain and his portfolio**! 🤖\n\nI am Ijlal's dedicated portfolio AI assistant, trained exclusively on his software engineering projects (ResumeIQ, SafeZone, Blog Factory), his **3.96 CGPA** at NUML, verified certifications, and technical skills.\n\nFeel free to ask me anything about Ijlal's work, such as his **ResumeIQ** AI platform or **Safe Zone** Android app!`,
      actionLink: { label: "Explore Ijlal's Projects", tab: "Projects" }
    };
  }

  // 12. KEYSTROKES / DIGITS / GIBBERISH
  const isPureDigits = /^\d+$/.test(cleanWords) && !contains("3 96") && !contains("396") && !contains("3.96");
  const isNoiseOrStroke = contains("stroke") && /\d+/.test(cleanWords);
  const isShortNoise = cleanWords.length <= 4 && !rawTokens.some(isRecognizedToken) && !tokens.some(isRecognizedToken);
  const lacksVowels = cleanWords.length > 4 && !/[aeiouy]/.test(cleanWords);
  const hasLongRandomSequence = /[bcdfghjklmnpqrstvwxyz]{6,}/i.test(cleanWords);
  const hasNoRecognizedTokens = rawTokens.length > 0 && !rawTokens.some(isRecognizedToken);

  if ((isPureDigits || isNoiseOrStroke || isShortNoise || lacksVowels || hasLongRandomSequence || hasNoRecognizedTokens) && !contains("3 96") && !contains("396") && !contains("3.96")) {
    return {
      type: "GIBBERISH",
      text: `Oops! That looks like a random keystroke or number. 🤖\n\nHow can I help you today? You can ask me:\n• *"Who is Ijlal?"*\n• *"What is his CGPA?"*\n• *"What projects has he built?"*\n• *"What is his LangGraph experience?"*\n• *"How can I contact him?"*`,
      actionLink: { label: "Explore All Projects", tab: "Projects" }
    };
  }

  // 13. TIMEZONE & LOCAL TIME
  if (contains("time in pakistan") || contains("time in islamabad") || contains("what time is it") || contains("local time") || contains("pkt time") || contains("pakistan time") || (contains("timezone") && !contains("work") && !contains("remote"))) {
    return {
      type: "TIMEZONE",
      text: `⏰ **Local Timezone:**\nIjlal is based in Pakistan (**UTC+5 / PKT**). Current local time is **${getPKTTime()}**.`,
      actionLink: { label: "Open Contact Form", tab: "Contact" }
    };
  }

  // 14. FAVORITE SUBJECT / PASSION / ARTIFICIAL INTELLIGENCE
  if (
    contains("favorite subject") ||
    contains("favourite subject") ||
    contains("favorite course") ||
    contains("favorite topic") ||
    contains("major interest") ||
    contains("his passion") ||
    contains("what is he passionate about") ||
    contains("what does he love") ||
    (hasWord("favorite") && (hasWord("subject") || hasWord("course") || hasWord("topic") || hasWord("ai")))
  ) {
    return {
      type: "FAVORITE_SUBJECT",
      text: `🤖 **Ijlal's Favorite Subject & Passion:**\nIjlal's absolute favorite subject and specialized passion is **Artificial Intelligence (Generative AI, LangGraph Multi-Agent Systems, and Retrieval-Augmented Generation / RAG)**! ✨\n\nHe is deeply fascinated by building autonomous, stateful agentic workflows that solve complex real-world challenges with high precision and sub-second execution.`,
      actionLink: { label: "Inspect AI Projects", tab: "Projects" }
    };
  }

  // 15. COURSEWORK & UNIVERSITY SUBJECTS AT NUML
  if (
    contains("courses did he take") ||
    contains("subjects did he study") ||
    contains("university coursework") ||
    contains("numl subjects") ||
    contains("numl courses") ||
    contains("coursework") ||
    contains("courses studied") ||
    contains("what did he study at numl") ||
    contains("what did he study") ||
    contains("university subjects") ||
    contains("subjects studied") ||
    (hasWord("courses") && (hasWord("numl") || hasWord("university") || hasWord("study"))) ||
    (hasWord("subjects") && (hasWord("numl") || hasWord("university") || hasWord("study"))) ||
    (hasWord("study") && hasWord("numl") && !contains("where"))
  ) {
    return {
      type: "COURSEWORK",
      text: `📚 **Key Software Engineering & CS Coursework at NUML:**\n• **Artificial Intelligence & Machine Learning** (Favorite Subject)\n• **Data Structures & Algorithms (DSA)**\n• **Object-Oriented Programming (OOP)** (Java & Python)\n• **Software Requirements Engineering (SRE)** (SRS / BRD)\n• **Database Management Systems (DBMS)** (SQL & NoSQL)\n• **System Design & Software Architecture**\n• **Operating Systems & Computer Networks**\n• **Software Quality Assurance & Testing (SQA)**`,
      actionLink: { label: "View Academic Timeline", tab: "About" }
    };
  }

  // 16. TECHNICAL CHALLENGES & ENGINEERING FEATS
  if (
    contains("technical challenge") ||
    contains("technical challenges") ||
    contains("difficult challenge") ||
    contains("problem he solved") ||
    contains("hardest problem") ||
    contains("complex problem") ||
    contains("engineering hurdle")
  ) {
    return {
      type: "TECH_CHALLENGES",
      text: `🧩 **Key Technical Challenges Solved by Ijlal:**\n\n1. **Android Low-Level Interception (Safe Zone)**:\nEngineered a background interception pipeline using Android \`AccessibilityService\` and \`DevicePolicyManager\` to intercept restricted window focus changes and block uninstallation.\n\n2. **LangGraph State Graph Resilience & Failover (ResumeIQ)**:\nDesigned a 7-node cyclic state machine coupling sub-second Groq Cloud (Llama-3.3-70B) inference with automated failover to Google Gemini 2.5 Flash, paired with local sentence-transformers RAG embeddings.\n\n3. **Multi-Agent Fact-Checking (Blog Factory)**:\nOrchestrated an autonomous 3-agent cyclic loop that integrates live Tavily web search fact-checking against official docs and syntax-verifies runnable code snippets.`,
      actionLink: { label: "Inspect Projects", tab: "Projects" }
    };
  }

  // 17. UNSUPPORTED / NON-CORE SKILLS QUERY (PHP, C++, C#, Rust, Ruby, AWS, Go, Swift, etc.)
  const unsupportedTechList = ["php", "rust", "ruby", "aws", "cpp", "csharp", "swift", "kotlin", "vue", "angular", "django", "laravel"];
  const matchedUnsupported = unsupportedTechList.find((tech) =>
    cleanWords.split(/\s+/).includes(tech) ||
    contains(`does he know ${tech}`) ||
    contains(`is he good at ${tech}`) ||
    contains(`experience with ${tech}`)
  ) || (
    (tokens.includes("golang") || contains("know go") || contains("experience with go") || contains("go language") || contains("go developer") || contains("programming in go")) ? "GO" : null
  );

  if (matchedUnsupported && !hasWord("python") && !hasWord("java") && !hasWord("react")) {
    const techName = matchedUnsupported === "cpp" ? "C++" : (matchedUnsupported === "csharp" ? "C#" : (matchedUnsupported === "GO" ? "Golang" : matchedUnsupported.toUpperCase()));
    return {
      type: "UNSUPPORTED_TECH",
      text: `💡 **Tech Stack Scope & Learning Agility:**\nIjlal's primary, production-tested engineering stack is **Python (88%)**, **Java & Android SDK (88%)**, **React 19 & TypeScript (80%)**, and **FastAPI (82%)**.\n\nWhile **${techName}** is not in his primary daily toolkit, his strong Computer Science foundations (**3.96 / 4.0 CGPA from NUML**) and proven full-stack adaptability allow him to master new languages, cloud platforms, and frameworks rapidly.`,
      actionLink: { label: "View Core Skills", tab: "About" }
    };
  }

  // 18. COMPARATIVE QUESTIONS (Frontend vs Backend, Python vs Java)
  if (contains("frontend or backend") || contains("frontend vs backend") || contains("better at frontend or backend") || contains("backend or frontend") || contains("backend vs frontend")) {
    return {
      type: "FRONTEND_VS_BACKEND",
      text: `⚖️ **Full-Stack Balance (Frontend & Backend):**\nIjlal is versatile across both:\n• **Backend Engineering (FastAPI, Python, Node.js, Express, Firebase)**: 84% average proficiency building asynchronous REST microservices and AI pipelines.\n• **Frontend Development (React 19, Next.js 16, TypeScript, Tailwind CSS v4)**: 80% proficiency crafting responsive, glassmorphic modern web applications!`,
      actionLink: { label: "View Skills Breakdown", tab: "About" }
    };
  }

  if (contains("python or java") || contains("python vs java") || contains("better at python or java") || contains("java or python") || contains("java vs python")) {
    return {
      type: "PYTHON_VS_JAVA",
      text: `⚖️ **Python vs Java Expertise:**\nIjlal has deep, certified mastery in both (**88% proficiency each**):\n• **Python**: His primary language for **Generative AI state graphs (LangGraph)**, **RAG retrieval (LangChain)**, and **FastAPI AI endpoints**.\n• **Java**: His primary language for **Native Android Mobile Engineering (Android SDK, Firebase)** in his Safe Zone FYP!`,
      actionLink: { label: "View Skills Breakdown", tab: "About" }
    };
  }

  // 19. TARGET CAREER ROLES & ASPIRATIONS
  if (
    contains("target role") ||
    contains("target roles") ||
    contains("targeting") ||
    contains("career goal") ||
    contains("career goals") ||
    contains("what job does he want") ||
    contains("what position is he looking for") ||
    contains("future goals") ||
    contains("aspiring role") ||
    contains("roles is he seeking") ||
    contains("role is he seeking") ||
    contains("5 years") ||
    contains("five years") ||
    contains("where does he see himself") ||
    (hasWord("career") && (hasWord("goals") || hasWord("goal") || hasWord("path") || hasWord("target") || hasWord("seeking") || hasWord("roles"))) ||
    (hasWord("target") && (hasWord("role") || hasWord("job") || hasWord("position") || hasWord("work"))) ||
    ((hasWord("role") || hasWord("roles") || hasWord("job") || hasWord("position")) && (hasWord("target") || hasWord("targeting") || hasWord("looking") || hasWord("seeking") || hasWord("seek") || hasWord("want") || hasWord("aspiring")))
  ) {
    return {
      type: "TARGET_ROLES",
      text: `🎯 **Target Roles & Career Focus:**\nIjlal is actively targeting high-impact roles including:\n• 🤖 **AI Engineer / Generative AI Developer** (LangGraph & RAG)\n• 💻 **Software Engineer (Python / Full-Stack)**\n• 📱 **Native Android Engineer (Java / Firebase)**\n• ⚙️ **Backend Engineer (FastAPI / Microservices)**`,
      actionLink: { label: "Discuss Opportunities", tab: "Contact" }
    };
  }

  // 20. TITLES & ROLE
  if (
    contains("what are his titles") ||
    contains("what is his title") ||
    contains("his titles") ||
    contains("what does he do") ||
    contains("what is his profession") ||
    contains("what kind of engineer") ||
    contains("what is his role") ||
    contains("what are his roles") ||
    contains("his specialization") ||
    contains("what is his specialty")
  ) {
    return {
      type: "TITLES",
      text: `💼 **Ijlal's Engineering Titles & Roles:**\n• **Software Engineer**\n• **Generative AI Developer** (LangGraph & RAG)\n• **MERN Stack Developer** (React 19 & Node.js)\n• **Native Android App Developer** (Java & Firebase)`,
      actionLink: { label: "View Full Profile", tab: "About" }
    };
  }

  // 21. EXECUTIVE SUMMARY & COMPLETE PORTFOLIO OVERVIEW
  if (
    contains("executive summary") ||
    contains("portfolio summary") ||
    contains("summary of ijlal") ||
    contains("summary of profile") ||
    contains("summary of everything") ||
    contains("summarize ijlal") ||
    contains("summarize his profile") ||
    contains("summarize him") ||
    contains("give me a summary") ||
    contains("quick summary") ||
    (hasWord("summary") && (hasWord("ijlal") || hasWord("profile") || hasWord("portfolio") || hasWord("everything") || hasWord("career") || hasWord("him"))) ||
    (hasWord("summarize") && (hasWord("ijlal") || hasWord("profile") || hasWord("portfolio") || hasWord("everything") || hasWord("career") || hasWord("him")))
  ) {
    return {
      type: "PORTFOLIO_SUMMARY",
      text: `📄 **Executive Summary of Ijlal Hussain:**\n\n• 🎓 **Education**: BS Software Engineering from **NUML Islamabad (3.96 / 4.0 CGPA, First Class Honors)**.\n• 🤖 **Generative AI**: Specialized in **LangGraph cyclic multi-agent graphs**, local **RAG vector retrieval**, and **Python / FastAPI** microservices.\n• 📱 **Mobile & Web**: Led the **Safe Zone Android FYP** in Java/Firebase, and engineered web platforms with **React 19, TypeScript, and Next.js 16**.\n• 📜 **Verified Credentials**: 6 official certifications from **NAVTTC, Cisco, and DigiSkills**.\n• 💼 **Availability**: **Immediate (0-day notice period)** for Remote or On-site Full-Time/Contract roles!`,
      actionLink: { label: "View Full Profile", tab: "About" }
    };
  }

  // 22. SPECIFIC GRADE INQUIRIES (Matric, Inter, Degree)
  if (
    hasWord("matric", 1) ||
    hasWord("matriculation", 1) ||
    contains("vision") ||
    contains("10th grade") ||
    contains("10th marks") ||
    contains("matric marks") ||
    contains("matric grade") ||
    contains("matric percentage") ||
    contains("school grade") ||
    (contains("school") && (contains("marks") || contains("grade") || contains("percentage") || contains("go to") || contains("study")))
  ) {
    return {
      type: "MATRIC_EDUCATION",
      text: `🏫 **Matriculation (General Science):**\nIjlal completed his Matriculation at **Vision Higher Secondary School, Danyore Gilgit** (${educationData[2].period}) with **${educationData[2].grade}**!`,
      actionLink: { label: "View Academic Timeline", tab: "About" }
    };
  }

  if (
    hasWord("intermediate", 1) ||
    contains("danyore") ||
    contains("degree college") ||
    contains("govt boys") ||
    contains("fsc") ||
    contains("hssc") ||
    contains("12th grade") ||
    contains("12th marks") ||
    contains("college grade") ||
    contains("college marks") ||
    contains("inter grade") ||
    (contains("college") && (contains("marks") || contains("grade") || contains("percentage") || contains("go to") || contains("study")))
  ) {
    return {
      type: "INTERMEDIATE_EDUCATION",
      text: `🏫 **Intermediate (Computer Science):**\nIjlal completed his Intermediate in Computer Science at **Govt Boys Degree College, Danyore Gilgit** (${educationData[1].period}) with **${educationData[1].grade}**.`,
      actionLink: { label: "View Academic Timeline", tab: "About" }
    };
  }

  // 23. EXACT CGPA / GPA SPECIFIC QUESTION / HONORS
  if (
    hasWord("cgpa", 1) ||
    contains("3.96") ||
    contains("3 96") ||
    contains("396") ||
    contains("cgoa") ||
    contains("cgpaa") ||
    contains("what is his cgpa") ||
    contains("what is cgpa") ||
    contains("cgpa of ijlal") ||
    contains("cgpa of hussain") ||
    contains("cgpa of ijlal hussain") ||
    contains("cgpa of ijla") ||
    contains("his gpa") ||
    contains("how much cgpa") ||
    contains("gpa of ijlal") ||
    contains("first class honors") ||
    contains("his honors") ||
    contains("distinction") ||
    (contains("grade") && !contains("matric") && !contains("inter") && !contains("school") && !contains("college") && !contains("10th") && !contains("12th") && !contains("university") && !contains("numl")) ||
    (contains("grades") && !contains("matric") && !contains("inter") && !contains("school") && !contains("college") && !contains("10th") && !contains("12th") && !contains("university") && !contains("numl")) ||
    (contains("marks") && !contains("matric") && !contains("inter") && !contains("school") && !contains("college") && !contains("10th") && !contains("12th") && !contains("university") && !contains("numl"))
  ) {
    return {
      type: "CGPA",
      text: `Ijlal's CGPA is **${personalInfo.cgpa}** (First Class Honors) in BS Software Engineering from NUML Islamabad! 🎓`,
      actionLink: { label: "View Academic Timeline", tab: "About" }
    };
  }

  if (
    contains("full education") ||
    contains("all education") ||
    contains("education background") ||
    contains("academic background") ||
    contains("education history") ||
    (hasWord("education") && (contains("all") || contains("full") || contains("complete") || contains("history")))
  ) {
    return {
      type: "FULL_EDUCATION",
      text: `🎓 **Ijlal's Complete Academic Journey:**\n• **BS Software Engineering** (${educationData[0].institution}, ${educationData[0].period}) — **${educationData[0].grade}** (First Class Honors)\n• **Intermediate (CS)** (${educationData[1].institution}, ${educationData[1].period}) — **${educationData[1].grade}**\n• **Matriculation (Science)** (${educationData[2].institution}, ${educationData[2].period}) — **${educationData[2].grade}**`,
      actionLink: { label: "View Academic Timeline", tab: "About" }
    };
  }

  // 24. LATEST / CURRENT / HIGHEST EDUCATION & DEGREE
  if (
    contains("latest education") ||
    contains("recent education") ||
    contains("newest education") ||
    contains("current education") ||
    contains("latest degree") ||
    contains("recent degree") ||
    contains("highest degree") ||
    contains("highest education") ||
    contains("highest qualification") ||
    contains("latest qualification") ||
    contains("what is his latest education") ||
    contains("what is ijlal's latest education") ||
    contains("what is ijlal latest education") ||
    contains("what is the latest education") ||
    contains("what is his education") ||
    contains("tell me his education") ||
    contains("what degree did he complete") ||
    contains("what degree does he have") ||
    contains("latest study") ||
    (hasWord("latest") && (hasWord("education") || hasWord("degree") || hasWord("qualification") || hasWord("study"))) ||
    (hasWord("recent") && (hasWord("education") || hasWord("degree") || hasWord("qualification") || hasWord("study"))) ||
    (hasWord("highest") && (hasWord("education") || hasWord("degree") || hasWord("qualification"))) ||
    (hasWord("education") && !hasWord("safezone") && !hasWord("resumeiq") && !hasWord("blogfactory") && (contains("what") || contains("tell") || contains("latest") || contains("lates") || contains("details") || contains("background")))
  ) {
    return {
      type: "LATEST_EDUCATION",
      text: `🎓 **Latest Education & Degree:**\nIjlal's latest and highest educational qualification is **BS in Software Engineering** from the **National University of Modern Languages (NUML), Islamabad** (${educationData[0].period}), graduating with a **${educationData[0].grade} (First Class Honors)**!`,
      actionLink: { label: "View Academic Timeline", tab: "About" }
    };
  }

  if (
    hasWord("numl", 1) ||
    contains("university") ||
    contains("degree") ||
    contains("bachelor") ||
    contains("bs software") ||
    contains("bs se") ||
    contains("where did he study") ||
    contains("where did he graduate") ||
    contains("where he graduated") ||
    contains("which university") ||
    (hasWord("graduate") && (hasWord("where") || hasWord("which") || hasWord("from") || hasWord("university") || hasWord("school") || hasWord("college")))
  ) {
    return {
      type: "UNIVERSITY_EDUCATION",
      text: `🎓 **BS Software Engineering (NUML Islamabad):**\nIjlal graduated from the **National University of Modern Languages (NUML), Islamabad** (${educationData[0].period}) with a stellar **${educationData[0].grade} (First Class Honors)**!`,
      actionLink: { label: "View Academic Timeline", tab: "About" }
    };
  }

  // 25. COMPARE PROJECTS
  if (
    contains("compare project") ||
    contains("compare projects") ||
    contains("difference between") ||
    contains("vs safezone") ||
    contains("vs resumeiq") ||
    contains("vs blog factory") ||
    contains("versus") ||
    (hasWord("compare") && (hasWord("project") || hasWord("projects") || hasWord("resumeiq") || hasWord("safezone") || hasWord("factory"))) ||
    (hasWord("difference") && (hasWord("project") || hasWord("projects") || hasWord("resumeiq") || hasWord("safezone") || hasWord("factory")))
  ) {
    return {
      type: "COMPARE_PROJECTS",
      text: `⚖️ **Comparison of Ijlal's Flagship Projects:**\n\n• **🤖 ResumeIQ (AI Career Intelligence)**:\n  Built with **Next.js 16, FastAPI, and a 7-node cyclic LangGraph state machine**. Solves automated resume tailoring, ATS scoring, and local semantic RAG embeddings with dual Groq / Gemini failover.\n\n• **📱 Safe Zone (Parental Control App — FYP Lead)**:\n  Native **Java & Android SDK** application with real-time GPS geofencing, remote screen-time lockouts, dynamic web filtering, and system app blocking via **AccessibilityService & DevicePolicyManager**.\n\n• **📝 Technical Blog Post Factory (Autonomous Studio)**:\n  A **3-agent LangGraph workflow** featuring a Content Writer, Technical Reviewer with live **Tavily AI search fact-checking**, and executable code validator.`,
      actionLink: { label: "Explore All Projects", tab: "Projects" }
    };
  }

  // 26. ALL PROJECTS LIST / OVERVIEW (Check this before single-word matches)
  if (
    (hasWord("project") || hasWord("projects") || contains("portfolio items") || contains("apps built") || contains("what he built") || contains("all projects")) &&
    (contains("list all") || contains("all projects") || contains("show all") || contains("tell me all") || contains("list projects") || contains("projects list") || contains("what projects has he built") || contains("what projects did he make") || contains("project overview")) &&
    !hasWord("resumeiq", 1) && !hasWord("safezone", 1) && !hasWord("blogfactory", 1) && !hasWord("factory", 1) &&
    !hasWord("education") && !hasWord("degree")
  ) {
    return {
      type: "ALL_PROJECTS",
      text: `📋 **Ijlal's Featured Projects (${projectsData.length} Total):**\n\n1. 🤖 **ResumeIQ** (AI Career Intelligence & ATS Auditor)\n2. 📝 **Technical Blog Post Factory** (Multi-Agent AI Studio)\n3. 📱 **Safe Zone** (Parental Control Android App — FYP Lead)\n4. 🌐 **Developer Portfolio** (React 19 & Tailwind Web Platform)`,
      actionLink: { label: "Explore All Projects", tab: "Projects" }
    };
  }

  // 27. ORDINAL PROJECT QUESTIONS: LATEST / NEWEST PROJECT
  if (
    (
      contains("latest project") ||
      contains("newest project") ||
      contains("recent project") ||
      contains("most recent project") ||
      contains("current project") ||
      contains("which project is latest") ||
      contains("which project is newest") ||
      contains("what is his latest project") ||
      contains("what is ijlal's latest project") ||
      contains("what is ijlal latest project") ||
      (hasWord("latest") && (hasWord("project") || hasWord("built") || hasWord("work"))) ||
      (hasWord("newest") && (hasWord("project") || hasWord("built") || hasWord("work"))) ||
      (hasWord("recent") && hasWord("project"))
    ) &&
    !hasWord("education") && !hasWord("degree") && !hasWord("qualification") && !hasWord("study") && !hasWord("school") && !hasWord("college")
  ) {
    return {
      type: "LATEST_PROJECT",
      text: `🚀 **Ijlal's Latest Projects:**\nIjlal's most recent major projects are **ResumeIQ** (AI Career Platform with a 7-node LangGraph cyclic engine & local RAG) and **Technical Blog Post Factory** (Autonomous 3-Agent AI Studio with live Tavily fact-checking), developed in early 2026!`,
      actionLink: { label: "Inspect ResumeIQ Project", tab: "Projects" }
    };
  }

  // 28. ORDINAL PROJECT QUESTIONS: FIRST / OLDEST / EARLIEST PROJECT
  if (
    contains("first project") ||
    contains("oldest project") ||
    contains("earliest project") ||
    contains("initial project") ||
    contains("which project did he make first") ||
    contains("what was his first project") ||
    (hasWord("first") && (hasWord("project") || hasWord("built") || hasWord("app"))) ||
    (hasWord("oldest") && (hasWord("project") || hasWord("app"))) ||
    (hasWord("earliest") && (hasWord("project") || hasWord("app")))
  ) {
    return {
      type: "FIRST_PROJECT",
      text: `📱 **Ijlal's Foundational First Project:**\nIjlal's first major flagship project was **Safe Zone** (Parental Control Android App), which he led and engineered as his university Final Year Project (FYP) using **Native Java, Android SDK, and Firebase**!`,
      actionLink: { label: "Inspect SafeZone App", tab: "Projects" }
    };
  }

  // 29. ORDINAL PROJECT QUESTIONS: BEST / FLAGSHIP / FAVORITE PROJECT
  if (
    contains("best project") ||
    contains("top project") ||
    contains("flagship project") ||
    contains("favorite project") ||
    contains("most impressive project") ||
    contains("main project") ||
    contains("what is his best project") ||
    contains("which project is best") ||
    (hasWord("best") && (hasWord("project") || hasWord("work") || hasWord("app"))) ||
    (hasWord("flagship") && hasWord("project"))
  ) {
    return {
      type: "BEST_PROJECT",
      text: `🌟 **Ijlal's Flagship Project:**\nIjlal's flagship project is **ResumeIQ**, a production-grade AI Career Intelligence Platform engineered with a **7-node cyclic LangGraph state machine**, local \`sentence-transformers\` RAG retrieval, dual Groq/Gemini LLMs, and Google XYZ formula rewrites.`,
      actionLink: { label: "Inspect ResumeIQ Project", tab: "Projects" }
    };
  }

  // 30. CATEGORIZED PROJECT QUERIES: AI / ML / GENAI PROJECTS
  if (
    contains("ai project") ||
    contains("ai projects") ||
    contains("ml project") ||
    contains("ml projects") ||
    contains("genai project") ||
    contains("genai projects") ||
    contains("generative ai project") ||
    contains("generative ai projects") ||
    contains("llm project") ||
    contains("llm projects") ||
    contains("langgraph project") ||
    contains("langgraph projects") ||
    (hasWord("ai") && (hasWord("project") || hasWord("projects") || hasWord("built")))
  ) {
    return {
      type: "AI_PROJECTS",
      text: `🤖 **Ijlal's Generative AI & ML Projects:**\n1. **ResumeIQ**: 7-node LangGraph ATS auditor, local sentence-transformers RAG citation engine, and Groq/Gemini dual LLM orchestration.\n2. **Technical Blog Post Factory**: Autonomous 3-agent cyclic publishing studio with live Tavily web search fact-checking and automated code generation.`,
      actionLink: { label: "Explore AI Projects", tab: "Projects" }
    };
  }

  // 31. CATEGORIZED PROJECT QUERIES: MOBILE / ANDROID PROJECTS
  if (
    (
      contains("mobile project") ||
      contains("mobile projects") ||
      contains("mobile app") ||
      contains("mobile apps") ||
      contains("android project") ||
      contains("android projects") ||
      contains("android app") ||
      contains("android apps") ||
      (hasWord("mobile") && (hasWord("project") || hasWord("app") || hasWord("work")))
    ) &&
    !hasWord("safezone", 1) &&
    !contains("safe zone")
  ) {
    return {
      type: "MOBILE_PROJECTS",
      text: `📱 **Ijlal's Mobile Projects:**\n• **Safe Zone — Parental Control Android App (FYP Lead)**: Built natively with **Java, Android SDK, and Firebase Realtime Database**. Features real-time GPS geofencing, remote screen-time lockouts, dynamic web filtering, and system app blocking via AccessibilityService & DevicePolicyManager.`,
      actionLink: { label: "Inspect SafeZone App", tab: "Projects" }
    };
  }

  // 32. CATEGORIZED PROJECT QUERIES: WEB / FRONTEND PROJECTS
  if (
    contains("web project") ||
    contains("web projects") ||
    contains("website project") ||
    contains("websites built") ||
    contains("react project") ||
    contains("react projects") ||
    contains("frontend project") ||
    contains("full stack project")
  ) {
    return {
      type: "WEB_PROJECTS",
      text: `🌐 **Ijlal's Web & Full-Stack Projects:**\n1. **Developer Portfolio**: Engineered with **React 19, TypeScript, Vite 6, Tailwind CSS v4, and Motion** featuring sub-second loads and local client-side AI.\n2. **ResumeIQ**: Liquid Glass web application built with **Next.js 16, Tailwind CSS v4, and FastAPI backend**.`,
      actionLink: { label: "Explore Web Projects", tab: "Projects" }
    };
  }

  // 33. HOW MANY PROJECTS / PROJECT COUNT
  if (
    contains("how many projects") ||
    contains("total projects") ||
    contains("count of projects") ||
    contains("number of projects")
  ) {
    return {
      type: "PROJECT_COUNT",
      text: `📋 **Total Projects (${projectsData.length} Featured):**\nIjlal has **4 major featured projects** in his portfolio:\n• 🤖 **2 AI/ML Platforms**: ResumeIQ & Technical Blog Factory\n• 📱 **1 Mobile System**: Safe Zone (FYP Lead)\n• 🌐 **1 Web Platform**: Developer Portfolio`,
      actionLink: { label: "Explore All Projects", tab: "Projects" }
    };
  }

  // 34. DUAL LLM ORCHESTRATION (GROQ + GEMINI)
  if (hasWord("groq", 1) || hasWord("gemini", 1) || contains("dual llm") || contains("groq and gemini") || contains("llama 3") || contains("which llm") || contains("what models") || contains("what llms")) {
    return {
      type: "DUAL_LLM",
      text: `⚡ **Dual LLM Orchestration:**\nIjlal couples **Groq Cloud (Llama-3.3-70B-Versatile)** for ultra-low latency sub-second inference with automatic failover to **Google Gemini 2.5 Flash** for high availability and rich multimodal reasoning.`,
      actionLink: { label: "Inspect ResumeIQ Project", tab: "Projects" }
    };
  }

  // 35. RESUMEIQ SPECIFIC SUB-INTENTS
  if (hasWord("resumeiq", 1) && (contains("demo") || contains("live") || contains("url") || contains("try") || contains("link") || contains("launch"))) {
    return {
      type: "RESUMEIQ_DEMO",
      text: `🤖 **ResumeIQ Live Platform:**\nResumeIQ is live on Vercel! Click the link below to test the 7-node LangGraph ATS parsing engine with your own resume or test benchmark profiles. 🚀`,
      actionLink: { label: "Launch ResumeIQ Live Demo", url: "https://resumeiq-cvparser.vercel.app/" }
    };
  }

  if (contains("xyz formula") || contains("google xyz") || contains("xyz bullet")) {
    return {
      type: "RESUMEIQ_XYZ",
      text: `💡 **Google XYZ Bullet Formula in ResumeIQ:**\nResumeIQ optimizes resume experience bullets using Google's proven framework:\n*"Accomplished [X] as measured by [Y], by doing [Z]"*\n\nThis structures vague statements into high-impact, quantifiable achievements for hiring managers.`,
      actionLink: { label: "Inspect ResumeIQ Project", tab: "Projects" }
    };
  }

  if (contains("ats score") || contains("how does ats work") || contains("ats audit") || contains("ats parser") || contains("ats compliance")) {
    return {
      type: "RESUMEIQ_ATS",
      text: `📊 **ResumeIQ ATS Compliance Auditor:**\nResumeIQ performs a comprehensive multi-criteria machine readability audit:\n• Standard heading detection (Experience, Education, Skills)\n• Action verb strength & active voice scoring\n• Missing critical keywords vs target Job Description\n• Clean contact header & degree format validation`,
      actionLink: { label: "Inspect ResumeIQ Project", tab: "Projects" }
    };
  }

  if (hasWord("resumeiq", 1) || contains("resume iq") || contains("cv parser") || contains("resume parser")) {
    return {
      type: "RESUMEIQ_OVERVIEW",
      text: `🤖 **ResumeIQ — AI Career Intelligence Platform:**\nAn enterprise-grade platform built with a **7-node cyclic LangGraph state machine**, local sentence-transformers RAG retrieval, ATS score compliance auditing, Google XYZ bullet optimization, and Groq/Gemini dual LLM orchestration.`,
      actionLink: { label: "Inspect ResumeIQ Project", tab: "Projects" }
    };
  }

  // 36. SAFEZONE SPECIFIC SUB-INTENTS
  if ((hasWord("safezone", 1) || contains("safe zone")) && (contains("apk") || contains("download") || contains("install") || contains("get app"))) {
    return {
      type: "SAFEZONE_APK",
      text: `📱 **Download SafeZone APK:**\nYou can download the compiled Safe Zone Android application APK directly using the button below!`,
      actionLink: { label: "Download SafeZone APK", url: "/downloads/SafeZone.apk" }
    };
  }

  if ((hasWord("safezone", 1) || contains("safe zone")) && (contains("how does it block") || contains("accessibility") || contains("device admin") || contains("block apps") || contains("block website") || contains("app blocking") || contains("apis"))) {
    return {
      type: "SAFEZONE_BLOCKING",
      text: `🛡️ **Safe Zone App & Web Blocking Architecture:**\nSafe Zone utilizes low-level Android system APIs:\n• **AccessibilityService**: Intercepts foreground window state changes to prevent launching restricted apps\n• **DevicePolicyManager (Device Admin API)**: Enforces remote lockouts and prevents unauthorized app uninstallation\n• **UsageStatsManager**: Monitors exact screen-time durations\n• **Firebase Realtime DB**: Synchronizes parental rules in milliseconds`,
      actionLink: { label: "Inspect SafeZone App", tab: "Projects" }
    };
  }

  // LEADERSHIP / TEAM MANAGEMENT / WORK ETHIC (Evaluated before generic SafeZone overview)
  if (hasWord("leadership", 2) || contains("lead a team") || contains("team lead") || contains("lead developer") || contains("team management") || contains("who was the lead") || contains("lead of safe zone") || contains("lead safe zone") || contains("leadership style") || contains("how does he lead") || contains("work ethic") || hasWord("ethic")) {
    return {
      type: "LEADERSHIP",
      text: `👑 **Leadership Experience & Style:**\nAs the **FYP Team Lead for Safe Zone**, Ijlal led a 4-developer engineering team through architecture design, sprint planning, Figma UI prototyping, Java development, and final university defense. He leads by example with clear technical specifications and mutual accountability.`,
      actionLink: { label: "Inspect SafeZone App", tab: "Projects" }
    };
  }

  if (hasWord("fyp", 0) || contains("final year project") || contains("safe zone") || hasWord("safezone", 1) || contains("parental control")) {
    return {
      type: "SAFEZONE_OVERVIEW",
      text: `📱 **Safe Zone — Parental Control Android App (FYP Lead):**\nIjlal served as the **Team Lead** for Safe Zone, a complete dual-app parental monitoring ecosystem built with **Java, Android SDK, and Firebase**. It features real-time GPS geofencing, remote screen-time scheduling, and category-based web content filtering.`,
      actionLink: { label: "Inspect SafeZone Android App", tab: "Projects" }
    };
  }

  // 37. BLOG FACTORY SPECIFIC SUB-INTENTS
  if ((hasWord("factory", 2) || hasWord("blog", 1)) && (contains("demo") || contains("live") || contains("url") || contains("try") || contains("link") || contains("launch"))) {
    return {
      type: "BLOGFACTORY_DEMO",
      text: `📝 **Technical Blog Post Factory Live Demo:**\nBlog Factory is live on Render! Click the link below to launch the autonomous 3-agent publishing studio with live Tavily fact-checking. ⚡`,
      actionLink: { label: "Launch Blog Factory Demo", url: "https://technical-blog-factory.onrender.com/" }
    };
  }

  if (hasWord("factory", 2) || (hasWord("blog", 1) && (hasWord("post", 1) || hasWord("writer", 1) || hasWord("creator", 1))) || hasWord("tavily", 1)) {
    return {
      type: "BLOGFACTORY_OVERVIEW",
      text: `📝 **Technical Blog Post Factory:**\nAn autonomous **3-agent LangGraph** publishing studio featuring a Content Writer, Technical Reviewer with live **Tavily AI web search fact-checking**, and an automated syntax-verified runnable code generator with 1-click vector PDF export.`,
      actionLink: { label: "Inspect Technical Blog Factory", tab: "Projects" }
    };
  }

  // 38. DEVELOPER PORTFOLIO SPECIFIC
  if (
    (
      hasWord("portfolio") ||
      contains("this website") ||
      contains("this site") ||
      contains("this web app") ||
      contains("portfolio website") ||
      contains("built this website") ||
      contains("made this website")
    ) &&
    (
      contains("built") ||
      contains("how") ||
      contains("stack") ||
      contains("source") ||
      contains("code") ||
      contains("tech") ||
      contains("website") ||
      contains("maker") ||
      contains("made") ||
      contains("created this") ||
      contains("built this")
    ) &&
    !contains("whose")
  ) {
    return {
      type: "PORTFOLIO_INFO",
      text: `🌐 **Developer Portfolio:**\nIjlal's personal web platform built with **React 19, TypeScript, Vite 6, Tailwind CSS v4, Lucide Icons, and Motion**. It features a 100% client-side grounded AI Assistant, modern dark cosmic theme, persistent URL hash routing, and PWA capability.`,
      actionLink: { label: "View Portfolio Source on GitHub", url: "https://github.com/Ijlal-Hussaini/Ijlal-hussain-Portfolio" }
    };
  }

  // 39. WORK EXPERIENCE: LATEST JOB / CURRENT ROLE
  if (
    contains("latest experience") ||
    contains("latest job") ||
    contains("current role") ||
    contains("current job") ||
    contains("where does he work") ||
    contains("where is he working") ||
    contains("most recent job") ||
    (hasWord("latest") && hasWord("experience")) ||
    (hasWord("current") && (hasWord("job") || hasWord("role") || hasWord("experience")))
  ) {
    return {
      type: "LATEST_EXPERIENCE",
      text: `🏢 **Ijlal's Most Recent Experience:**\nIjlal's latest role was as an **AI Development Intern @ Kartoa Technologies, Islamabad** (${experienceData[0].period}), where he developed production RAG systems and LangGraph multi-agent workflows.`,
      actionLink: { label: "View Experience Details", tab: "About" }
    };
  }

  // 40. WORK EXPERIENCE: ALL EXPERIENCES / CAREER HISTORY
  if (
    contains("all experience") ||
    contains("work experience") ||
    contains("career history") ||
    contains("work history") ||
    contains("all jobs") ||
    contains("past experience") ||
    contains("where did he work") ||
    contains("all internships") ||
    (hasWord("experience") && (contains("all") || contains("list") || contains("tell") || contains("show")))
  ) {
    return {
      type: "ALL_EXPERIENCE",
      text: `💼 **Ijlal's Work & Engineering Experience:**\n\n1. 🏢 **AI Development Intern** @ Kartoa Technologies (${experienceData[0].period})\n   • Built production-ready RAG systems and LangGraph multi-agent workflows.\n2. 📑 **Requirement Engineering Intern** @ NUML × Alberuni Tech (${experienceData[1].period})\n   • Authored SRS documents, BRDs, and UML Use Case models.\n3. 📱 **Android App Developer & FYP Team Lead** @ Safe Zone (${experienceData[2].period})\n   • Led a 4-developer engineering team to build the Safe Zone parental control app in Java & Firebase.`,
      actionLink: { label: "View Complete Timeline", tab: "About" }
    };
  }

  // 41. KARTOA TECHNOLOGIES INTERNSHIP
  if (hasWord("kartoa", 1)) {
    return {
      type: "KARTOA_EXPERIENCE",
      text: `🏢 **AI Development Intern @ Kartoa Technologies (${experienceData[0].period}):**\nIjlal built production-grade **RAG pipelines** and **LangGraph multi-agent workflows**, while optimizing LLM token limits and context window accuracy.`,
      actionLink: { label: "View Experience Details", tab: "About" }
    };
  }

  // 42. ALBERUNI TECH / REQUIREMENTS ENGINEERING
  if (
    hasWord("alberuni", 2) ||
    contains("requirement engineering") ||
    contains("requirements engineering") ||
    contains("srs") ||
    contains("brd")
  ) {
    return {
      type: "ALBERUNI_EXPERIENCE",
      text: `📑 **Requirement Engineering Intern @ NUML × Alberuni Tech (${experienceData[1].period}):**\nIjlal gathered commercial software requirements, authoring standardized **Software Requirements Specifications (SRS)**, **BRDs**, and **UML Use Case diagrams**.`,
      actionLink: { label: "View Experience Details", tab: "About" }
    };
  }

  // 43. CERTIFICATIONS SPECIFIC (Evaluated before generic skills)
  if (hasWord("navttc", 1) || contains("adan institute") || contains("navttc certificate")) {
    return {
      type: "CERT_NAVTTC",
      text: `📜 **Generative AI & Machine Learning Certification:**\nIssued by **NAVTTC & Adan Institute of Technology** (${certificationsData[0].period}, Credential ID: \`${certificationsData[0].credentialId}\`). Covers Python, ML fundamentals, LLM prompting, and agentic systems.`,
      actionLink: { label: "Inspect NAVTTC Certificate", tab: "Certifications" }
    };
  }

  if (hasWord("cisco", 1) || contains("python essentials")) {
    return {
      type: "CERT_CISCO",
      text: `📜 **Python Essentials 1 Certification:**\nIssued by **Cisco Networking Academy & OpenEDG** (${certificationsData[2].period}), validating core Python data structures, algorithms, and OOP principles.`,
      actionLink: { label: "Inspect Cisco Certificate", tab: "Certifications" }
    };
  }

  if (hasWord("digiskill", 2) || contains("digiskills") || contains("ministry of it") || contains("freelancing cert") || contains("graphic design cert")) {
    return {
      type: "CERT_DIGISKILL",
      text: `📜 **DigiSkills Certifications (Ministry of IT Pakistan, Aug – Nov 2025):**\n• **Freelancing** (Credential ID: \`${certificationsData[3].credentialId}\`)\n• **Graphic Design** (Credential ID: \`${certificationsData[4].credentialId}\`)`,
      actionLink: { label: "Inspect DigiSkills Certificates", tab: "Certifications" }
    };
  }

  if (
    hasWord("certificate", 2) ||
    hasWord("certification", 2) ||
    hasWord("credential", 2) ||
    hasWord("credentials", 2)
  ) {
    return {
      type: "ALL_CERTS",
      text: `📜 **Verified Institutional Certifications (${certificationsData.length} Total):**\n1. **Generative AI & Machine Learning** (NAVTTC · Adan Institute, Sep – Dec 2025)\n2. **AI Development Internship** (Kartoa Technologies, Jan – Mar 2026)\n3. **Python Essentials 1** (Cisco Networking Academy · OpenEDG, Jan 2026)\n4. **Freelancing** (DigiSkills · Ministry of IT, Aug – Nov 2025)\n5. **Graphic Design** (DigiSkills · Ministry of IT, Aug – Nov 2025)\n6. **Requirements Engineering** (NUML × Alberuni Tech, Aug – Oct 2025)`,
      actionLink: { label: "Inspect All Verified Certificates", tab: "Certifications" }
    };
  }

  // 44. SKILLS: HIGHEST / STRONGEST / BEST SKILL
  if (
    contains("best skill") ||
    contains("strongest skill") ||
    contains("highest skill") ||
    contains("what is he best at") ||
    contains("top skill") ||
    contains("top skills") ||
    (hasWord("highest") && hasWord("skill")) ||
    (hasWord("strongest") && hasWord("skill"))
  ) {
    return {
      type: "TOP_SKILLS",
      text: `⭐ **Ijlal's Highest-Rated Technical Skills:**\n• **Python (AI & ML)**: 88%\n• **Android SDK / Java**: 88%\n• **Requirements Engineering (SRS/BRD)**: 88%\n• **Git & GitHub**: 86%\n• **LangGraph (Multi-Agent Graphs)**: 86%\n• **Prompt Engineering & Guardrails**: 85%`,
      actionLink: { label: "View Skills Breakdown", tab: "About" }
    };
  }

  // 45. PREFERRED / FAVORITE PROGRAMMING LANGUAGE
  if (
    contains("favorite programming language") ||
    contains("favourite programming language") ||
    contains("favorite language") ||
    contains("favourite language") ||
    contains("preferred programming language") ||
    contains("preferred language") ||
    contains("which language does he prefer") ||
    contains("what language does he prefer") ||
    contains("favorite coding language") ||
    contains("which programming language does he like") ||
    (hasWord("favorite") && (hasWord("language") || hasWord("languages") || hasWord("coding") || hasWord("programming"))) ||
    (hasWord("preferred") && (hasWord("language") || hasWord("languages") || hasWord("coding") || hasWord("programming")))
  ) {
    return {
      type: "FAVORITE_LANGUAGE",
      text: `🐍 **Ijlal's Preferred Programming Languages:**\n• **Python (Primary & Favorite)**: His go-to language for **Generative AI, LangGraph multi-agent architectures, RAG pipelines, and FastAPI async services** (Cisco Certified).\n• **Java**: Primary language for **Native Android engineering** & low-level OS services.\n• **TypeScript / JavaScript**: Primary language for **modern reactive web development** (React 19 & Next.js 16).`,
      actionLink: { label: "View Skills Breakdown", tab: "About" }
    };
  }

  // 46. SPECIFIC SKILL PROFICIENCIES & TECH CONCEPTS
  if (hasWord("python", 1)) {
    return {
      type: "SKILL_PYTHON",
      text: `🐍 **Python Mastery & Cisco Certification (88% Proficiency):**\n**Python** is Ijlal's primary programming language for engineering state-of-the-art **Generative AI systems**, **LangGraph multi-agent state machines**, and **local RAG retrieval pipelines**.\n\n• **Core Capabilities**: Cyclic state graphs, LangChain vector retrieval (ChromaDB / FAISS), asynchronous FastAPI microservices, Pydantic v2 data models, and prompt guardrails.\n• **Certification**: Verified by **Cisco Networking Academy & OpenEDG** (*Python Essentials 1*).`,
      actionLink: { label: "View Skills Breakdown", tab: "About" }
    };
  }

  if (
    hasWord("java", 1) ||
    (hasWord("android", 1) && !contains("project") && !contains("app") && !contains("safezone") && !contains("apk") && !contains("safe zone")) ||
    (hasWord("android", 1) && (hasWord("sdk") || hasWord("studio") || hasWord("skill") || hasWord("experience") || contains("what is") || contains("waht is")))
  ) {
    return {
      type: "SKILL_ANDROID",
      text: `☕ **Java & Native Android SDK (88% Proficiency):**\n**Java and Android SDK** are Ijlal's core foundation for native mobile engineering.\n\n• **In Ijlal's Work**: As FYP Team Lead, he built **Safe Zone** (Parental Control Android App), engineering background monitoring with \`AccessibilityService\`, device policy administration with \`DevicePolicyManager\`, real-time GPS tracking with Google Maps API, and live child activity synchronization via **Firebase Realtime Database**.`,
      actionLink: { label: "Inspect SafeZone App", tab: "Projects" }
    };
  }

  if (
    hasWord("langgraph", 2) ||
    contains("agentic ai") ||
    contains("multi agent") ||
    contains("multiagent") ||
    contains("state machine") ||
    contains("state graph") ||
    contains("prompt engineering") ||
    contains("guardrail") ||
    contains("guardrails") ||
    hasWord("prompt", 1) ||
    hasWord("prompts", 1)
  ) {
    return {
      type: "SKILL_GENAI",
      text: `⚡ **LangGraph & Generative AI Multi-Agent Systems (86% Proficiency):**\n**LangGraph** and **Agentic Prompt Engineering** are cutting-edge frameworks for orchestrating stateful, multi-agent AI systems with cyclic graphs, persistence, and human-in-the-loop controls.\n\n• **ResumeIQ**: Engineered a **7-node cyclic LangGraph state machine** managing ATS extraction, skill gap analysis, and tailored bullet-point generation with Groq (Llama-3.3-70B) & Gemini 2.5 Flash failover.\n• **Technical Blog Post Factory**: Orchestrated an autonomous **3-agent cyclic loop** (Writer → Fact-Checker with live Tavily search → Syntax-verified Code Generator).\n• **Guardrails**: Integrated Pydantic schema validation, structured JSON outputs, and adversarial hallucination defenses.`,
      actionLink: { label: "Inspect AI Projects", tab: "Projects" }
    };
  }

  if (
    hasWord("rag", 0) ||
    hasWord("langchain", 2) ||
    contains("retrieval augmented") ||
    contains("vector search") ||
    contains("embeddings") ||
    contains("chromadb") ||
    contains("faiss")
  ) {
    return {
      type: "SKILL_GENAI",
      text: `🔍 **RAG & Vector Retrieval Systems (84% Proficiency):**\n**Retrieval-Augmented Generation (RAG)** grounds LLM responses in external documents and vector embeddings, eliminating hallucinations and ensuring real-time citation accuracy.\n\n• **In Ijlal's Work**: Built high-speed local RAG pipelines using **LangChain**, **sentence-transformers**, and **ChromaDB / FAISS** in **ResumeIQ** (matching candidate experiences to job requirements) and during his AI Development Internship at **Kartoa Technologies**.`,
      actionLink: { label: "Inspect AI Projects", tab: "Projects" }
    };
  }

  if (hasWord("fastapi", 1) || (hasWord("backend") && (hasWord("api") || hasWord("microservice"))) || hasWord("pydantic", 1)) {
    return {
      type: "SKILL_FASTAPI",
      text: `⚙️ **FastAPI & Backend Engineering (82% Proficiency):**\n**FastAPI** is a modern, high-speed Python web framework for building asynchronous REST APIs with automatic OpenAPI documentation and Pydantic v2 data validation.\n\n• **In Ijlal's Work**: Ijlal builds high-performance async AI endpoints, streaming response microservices, and vector search microservices powering frontends with sub-second latency.`,
      actionLink: { label: "View Skills Breakdown", tab: "About" }
    };
  }

  if (hasWord("react", 1) || hasWord("nextjs", 2) || hasWord("typescript", 2) || hasWord("frontend", 1) || (hasWord("web") && (hasWord("dev") || hasWord("development")))) {
    return {
      type: "SKILL_WEB",
      text: `⚛️ **React 19, Next.js 16 & TypeScript (80% Proficiency):**\n**React 19** and **Next.js** are modern component-driven web frameworks delivering server-side rendering, streaming interfaces, and responsive web experiences.\n\n• **In Ijlal's Work**: Engineered this high-performance portfolio using **React 19, TypeScript, Tailwind CSS v4, Motion, and Vite / PWA architecture**, as well as the **ResumeIQ** Liquid Glass web platform with Next.js 16!`,
      actionLink: { label: "View Skills Breakdown", tab: "About" }
    };
  }

  if (hasWord("tailwind", 1) || contains("tailwind css")) {
    return {
      type: "SKILL_WEB",
      text: `🎨 **Tailwind CSS v4 (82% Proficiency):**\n**Tailwind CSS** is a utility-first CSS engine for crafting modern, responsive design systems directly in markup.\n\n• **In Ijlal's Work**: Designed the custom dark cosmic glassmorphism aesthetic of this portfolio using Tailwind CSS v4, featuring custom HSL color tokens, neon glow highlights, and hardware-accelerated animations.`,
      actionLink: { label: "View Skills Breakdown", tab: "About" }
    };
  }

  if (hasWord("docker", 1) || contains("containerization") || contains("devops")) {
    return {
      type: "SKILL_TOOLS",
      text: `🐳 **Docker & Containerization:**\n**Docker** enables packaging applications, microservices, and their dependencies into isolated containers for reproducible development and seamless production deployments.\n\n• **In Ijlal's Work**: Uses containerized environments for deploying FastAPI AI microservices, vector databases, and consistent Python runtimes.`,
      actionLink: { label: "View Skills Breakdown", tab: "About" }
    };
  }

  if (hasWord("database", 2) || hasWord("databases", 2) || hasWord("mongodb", 2) || hasWord("firebase", 2) || (hasWord("sql", 0) && !hasWord("code"))) {
    return {
      type: "SKILL_DATABASE",
      text: `🗄️ **Database & Cloud Storage Architecture:**\n• **Firebase Realtime Database (84%)**: Sub-second cloud state synchronization\n• **MongoDB (76%)**: Document storage for MERN web applications\n• **Vector Stores (ChromaDB / FAISS)**: High-dimensional semantic embeddings and cosine similarity indexing for RAG.\n• **Relational SQL**: Schema normalization, indexing, and transactional integrity fundamentals.`,
      actionLink: { label: "View Skills Breakdown", tab: "About" }
    };
  }

  if (hasWord("flutter", 1) || hasWord("dart", 1)) {
    return {
      type: "SKILL_FLUTTER",
      text: `📱 **Flutter & Cross-Platform (55% Proficiency):**\n**Flutter & Dart** allow building natively compiled applications for mobile from a single codebase.\n\n• **In Ijlal's Work**: Foundational cross-platform mobile development experience complementing his deep primary mastery in **Native Java Android SDK**.`,
      actionLink: { label: "View Skills Breakdown", tab: "About" }
    };
  }

  if (
    hasWord("git", 0) ||
    hasWord("figma", 1) ||
    hasWord("postman", 1) ||
    hasWord("vscode", 1) ||
    contains("vs code") ||
    hasWord("tool", 0) ||
    hasWord("tools", 0)
  ) {
    return {
      type: "SKILL_TOOLS",
      text: `🛠️ **Engineering Tools & Platforms:**\n• **Git & GitHub (86%)**: Version control, pull request workflows & CI/CD automation\n• **VS Code (88%) & Android Studio (85%)**: Primary development environments\n• **Postman (78%)**: REST API automated contract testing\n• **Figma (72%)**: Wireframing, UX design systems, and component mockups`,
      actionLink: { label: "View Skills Breakdown", tab: "About" }
    };
  }

  if (contains("spoken language") || contains("what languages does he speak") || contains("languages") || contains("english") || contains("urdu") || contains("brushaski") || contains("mother tongue")) {
    return {
      type: "LANGUAGES",
      text: `🗣️ **Spoken Languages:**\n• **English**: Professional Working Proficiency (70%)\n• **Urdu**: Native / Fluent (100%)\n• **Brushaski**: Mother Tongue (100%)`,
      actionLink: { label: "View Full Profile", tab: "About" }
    };
  }

  // 47. SOFT SKILLS & INTERPERSONAL ATTRIBUTES
  if (
    contains("soft skill") ||
    contains("soft skills") ||
    contains("interpersonal skill") ||
    contains("interpersonal skills") ||
    contains("communication skill") ||
    contains("communication skills") ||
    contains("teamwork") ||
    contains("adaptability") ||
    contains("collaboration") ||
    contains("problem solving skill") ||
    (hasWord("soft") && (hasWord("skill") || hasWord("skills"))) ||
    (hasWord("communication") && !contains("spoken"))
  ) {
    return {
      type: "SOFT_SKILLS",
      text: `🤝 **Ijlal's Core Soft Skills & Interpersonal Strengths:**\n• **👑 Technical Leadership & Teamwork**: Led a 4-engineer team for the Safe Zone FYP, managing architecture, sprints, and code reviews.\n• **📑 Clear Communication & Documentation**: Authored comprehensive SRS and BRD requirement documents at Alberuni Tech, bridging technical and business stakeholders.\n• **⚡ Adaptability & Rapid Learning**: Quickly masters cutting-edge paradigms—from native Android OS services to autonomous LangGraph multi-agent systems and RAG.\n• **🧩 Analytical Problem Solving**: Proven ability to diagnose and solve complex edge cases under strict production constraints.`,
      actionLink: { label: "View Full Profile", tab: "About" }
    };
  }

  if (hasWord("skill", 2) || hasWord("skills", 2) || hasWord("stack", 1) || contains("tech stack") || contains("technologies")) {
    return {
      type: "ALL_SKILLS",
      text: `🛠️ **Core Technical Skills:**\n• **Generative AI**: LangGraph (86%), LangChain & RAG (84%), Python (88%), FastAPI (82%)\n• **Mobile Development**: Java & Android SDK (88%), Firebase (84%), Flutter (55%)\n• **Web Development**: React 19 & Next.js (80%), TypeScript, Node.js, MongoDB (76%)\n• **Engineering & Tools**: Requirements Engineering (88%), Git & GitHub (86%), Figma (72%)`,
      actionLink: { label: "View Complete Skills Matrix", tab: "About" }
    };
  }

  // 48. PROFESSIONAL & ACADEMIC REFERENCES
  if (
    contains("reference") ||
    contains("references") ||
    contains("referee") ||
    contains("referees") ||
    contains("recommendation") ||
    contains("recommendations") ||
    contains("letter of recommendation") ||
    contains("who can vouch for him") ||
    contains("can i get references")
  ) {
    return {
      type: "REFERENCES",
      text: `📑 **Professional & Academic References:**\nProfessional references and letters of recommendation from **NUML Islamabad faculty**, **Kartoa Technologies supervisors**, and **Alberuni Tech project mentors** are available upon request.\n\nPlease feel free to contact Ijlal directly at **${personalInfo.email}** or connect via LinkedIn to request references! 📬`,
      actionLink: { label: "Open Contact Form", tab: "Contact" }
    };
  }

  // 49. IMMEDIATE AVAILABILITY / START DATE / JOINING
  if (
    contains("when can he join") ||
    contains("how soon can he start") ||
    contains("how fast can he start") ||
    contains("earliest start date") ||
    contains("can he start immediately") ||
    contains("can he join immediately") ||
    contains("immediate start") ||
    contains("joining date") ||
    contains("start date") ||
    (hasWord("join") && (hasWord("soon") || hasWord("immediately") || hasWord("when") || hasWord("date"))) ||
    (hasWord("start") && (hasWord("soon") || hasWord("immediately") || hasWord("when") || hasWord("earliest")))
  ) {
    return {
      type: "IMMEDIATE_AVAILABILITY",
      text: `⚡ **Immediate Availability & Start Date:**\nIjlal graduated in early 2026 and is **ready to start immediately (0-day notice period)**! 🚀\n\nHe is fully equipped for immediate onboarding in **Full-Time**, **Contract**, or **Freelance** software engineering roles globally.`,
      actionLink: { label: "Hire Ijlal Now", tab: "Contact" }
    };
  }

  // 50. WORK AVAILABILITY / NOTICE PERIOD / HIRE (Evaluated before general contact)
  if (
    hasWord("available", 2) ||
    contains("looking for a job") ||
    contains("open to work") ||
    contains("notice period") ||
    contains("when can he start") ||
    contains("full time") ||
    contains("fulltime") ||
    contains("part time") ||
    contains("contract") ||
    contains("freelance") ||
    contains("free to work") ||
    (hasWord("free") && hasWord("work")) ||
    ((hasWord("hire", 1) || contains("hire ijlal") || contains("hire him")) && !hasWord("why"))
  ) {
    return {
      type: "AVAILABILITY",
      text: `💼 **Work Availability:**\nIjlal is actively open to **Full-time**, **Contract**, and **Freelance** engineering roles. His notice period is **Immediate (0 days)**!`,
      actionLink: { label: "Send Hire Message", tab: "Contact" }
    };
  }

  // 51. RESUME / CV DOWNLOAD
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
      type: "RESUME_CV",
      text: `You can download or view Ijlal's official software engineering CV in verified PDF format by clicking the link below! 📄`,
      actionLink: { label: "Download Official CV (PDF)", url: personalInfo.resumeUrl }
    };
  }

  // 52. EMAIL SPECIFIC
  if (hasWord("email", 1) || contains("mail address") || contains("how to email") || contains("send email") || contains("his email")) {
    return {
      type: "EMAIL",
      text: `Ijlal's official email address is **${personalInfo.email}**. Feel free to send him a direct message anytime! ✉️`,
      actionLink: { label: "Send Direct Email", url: `mailto:${personalInfo.email}` }
    };
  }

  // 53. PHONE / WHATSAPP
  if (hasWord("whatsapp", 2) || hasWord("phone", 1) || contains("call him") || contains("call me") || contains("contact number") || contains("mobile number") || contains("his phone") || contains("his number")) {
    return {
      type: "PHONE",
      text: `You can reach Ijlal on WhatsApp or Phone at **${personalInfo.phone}**! 📱`,
      actionLink: { label: "Chat on WhatsApp", url: `https://wa.me/${personalInfo.phone.replace(/[^0-9]/g, "")}` }
    };
  }

  // 54. LINKEDIN
  if (hasWord("linkedin", 2) || contains("linked in")) {
    return {
      type: "LINKEDIN",
      text: `Connect with Ijlal on LinkedIn: [linkedin.com/in/ijlal-hussain786](${personalInfo.linkedin}) 💼`,
      actionLink: { label: "Open LinkedIn Profile", url: personalInfo.linkedin }
    };
  }

  // 55. GITHUB
  if (hasWord("github", 2) || contains("git hub") || contains("repositories") || contains("open source")) {
    return {
      type: "GITHUB",
      text: `Explore Ijlal's open-source projects and code repositories on GitHub: [github.com/Ijlal-Hussaini](${personalInfo.github}) 🐙`,
      actionLink: { label: "Open GitHub Profile", url: personalInfo.github }
    };
  }

  // 56. GENERAL CONTACT
  if (hasWord("contact", 2) || contains("how to contact") || contains("reach out") || contains("connect with him")) {
    return {
      type: "CONTACT",
      text: `You can connect with Ijlal directly through:\n• **Email**: ${personalInfo.email}\n• **WhatsApp/Phone**: ${personalInfo.phone}\n• **LinkedIn**: [linkedin.com/in/ijlal-hussain786](${personalInfo.linkedin})\n• **GitHub**: [github.com/Ijlal-Hussaini](${personalInfo.github})`,
      actionLink: { label: "Open Contact Form", tab: "Contact" }
    };
  }

  // 57. LOCATION / ORIGIN
  if (
    (
      ((hasWord("where", 1) || hasWord("wher", 1)) && (hasWord("from", 1) || hasWord("live", 1) || hasWord("located", 2) || hasWord("ijlal", 1))) ||
      hasWord("location", 2) ||
      hasWord("city", 1) ||
      hasWord("country", 2) ||
      hasWord("hometown", 2) ||
      hasWord("origin", 2) ||
      hasWord("gilgit", 1) ||
      (hasWord("pakistan", 2) && !contains("time"))
    ) &&
    !contains("graduate") &&
    !contains("study") &&
    !contains("degree") &&
    !contains("work") &&
    !contains("job")
  ) {
    return {
      type: "LOCATION",
      text: `Ijlal is originally from the beautiful valley of **Gilgit, Pakistan** 🏔️ and completed his software engineering degree in **Islamabad**. He is actively open to **remote roles globally** as well as on-site positions in Islamabad!`,
      actionLink: { label: "Contact Ijlal", tab: "Contact" }
    };
  }

  // 58. AGE / BIRTHDAY
  if (
    (tokens.includes("age") && !tokens.includes("language") && !tokens.includes("languages")) ||
    contains("how old") ||
    contains("his age") ||
    hasWord("born", 1) ||
    contains("birthday") ||
    contains("date of birth")
  ) {
    return {
      type: "AGE",
      text: `Ijlal is in his **early 20s** and graduated with his BS in Software Engineering in early 2026. 🎂`,
      actionLink: { label: "View Full Profile", tab: "About" }
    };
  }

  // 59. WHY HIRE / STRENGTHS
  if (
    (hasWord("why") && (hasWord("hire", 1) || hasWord("choose", 1) || hasWord("select", 1))) ||
    hasWord("strength", 2) ||
    hasWord("strengths", 2) ||
    contains("why hire") ||
    contains("why should i hire") ||
    contains("what makes him stand out")
  ) {
    return {
      type: "WHY_HIRE",
      text: `🌟 **Why Hire Ijlal Hussain?**\n• **Top Academic Standing**: **3.96 / 4.0 CGPA** at NUML Islamabad\n• **Production AI Expertise**: Built real-world LangGraph cyclic multi-agent graphs and RAG pipelines\n• **Proven Leadership**: Led the Safe Zone Android FYP team\n• **6 Verified Credentials**: Official NAVTTC, Cisco, and DigiSkills certifications\n• **Versatility**: Full-stack agility across AI, Mobile, and Web`,
      actionLink: { label: "Open Contact Form", tab: "Contact" }
    };
  }

  // 60. REMOTE WORK
  if (hasWord("remote", 1) || hasWord("relocate", 2) || contains("timezone") || contains("us time") || contains("uk time") || contains("work from home")) {
    return {
      type: "REMOTE",
      text: `🌍 **Remote & Global Flexibility:**\nIjlal is available immediately for **remote roles worldwide** with flexible working overlap for **US (EST/PST)**, **UK/Europe (GMT/CET)**, and **Gulf/Asia (GST/PKT)** timezones!`,
      actionLink: { label: "Contact for Remote Work", tab: "Contact" }
    };
  }

  // 61. SALARY / COMPENSATION
  if (contains("salary") || contains("compensation") || contains("rate") || contains("rates") || contains("pricing") || contains("budget") || contains("how much does he charge")) {
    return {
      type: "SALARY",
      text: `💼 **Compensation & Rates:**\nIjlal's compensation is open to discussion based on role responsibilities, contract type (Full-Time vs Contract), and industry standards. Feel free to reach out directly to discuss offers!`,
      actionLink: { label: "Discuss Offer", tab: "Contact" }
    };
  }

  // 62. INTERVIEW SCHEDULING
  if (contains("schedule interview") || contains("interview") || contains("book meeting") || contains("schedule a call") || contains("talk with him")) {
    return {
      type: "INTERVIEW",
      text: `📅 **Schedule an Interview with Ijlal:**\nYou can easily book an introductory interview or technical discussion:\n• **Email**: ${personalInfo.email}\n• **WhatsApp**: ${personalInfo.phone}\n• **Contact Form**: Use the interactive contact section below!`,
      actionLink: { label: "Open Contact Form", tab: "Contact" }
    };
  }

  // 63. WHO IS IJLAL / ABOUT IJLAL (First name, last name, full name, typos)
  if (
    /^(ijlal|hussain|ijlal\s+hussain|ijlal\s+hussaini|itjal|itjall|ijall|ejlal)$/i.test(cleanWords) ||
    (tokens.length <= 2 && (tokens.includes("ijlal") || tokens.includes("hussain"))) ||
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
    contains("who is this") ||
    contains("who is the owner") ||
    contains("candidate") ||
    contains("what is his name") ||
    contains("his name") ||
    contains("candidate name") ||
    contains("whose portfolio") ||
    contains("who owns this") ||
    contains("developer name") ||
    contains("about ijlal") ||
    contains("about hussain") ||
    contains("about ijlal hussain") ||
    contains("about ijlal hussaini") ||
    contains("tell me about ijlal") ||
    contains("tell me about hussain") ||
    contains("tell me about him") ||
    contains("tell me about candidate") ||
    contains("introduce ijlal") ||
    contains("introduce hussain") ||
    contains("profile of ijlal") ||
    contains("profile of hussain") ||
    contains("background of ijlal") ||
    contains("background of hussain") ||
    (hasWord("who") && (hasWord("ijlal") || hasWord("hussain") || hasWord("he") || hasWord("person") || hasWord("owner") || hasWord("candidate"))) ||
    (hasWord("about") && (hasWord("ijlal") || hasWord("hussain") || hasWord("him") || hasWord("candidate")))
  ) {
    return {
      type: "ABOUT_IJLAL",
      text: `**Ijlal Hussain** is a Software Engineering graduate from NUML Islamabad with an outstanding **3.96 / 4.0 CGPA** (First Class Honors). 🚀\n\nHe specializes in **Generative AI (LangGraph multi-agent systems & RAG)**, **Native Android Development (Java/Firebase)**, and **Full-Stack Web (React 19/MERN)**. He was the Team Lead for the Safe Zone Parental Control FYP and completed AI Engineering internships at Kartoa Technologies and Alberuni Tech.`,
      actionLink: { label: "View Full Profile", tab: "About" }
    };
  }

  // 64. WEAKNESSES & AREAS FOR CONTINUOUS GROWTH
  if (
    hasWord("weakness", 2) ||
    hasWord("weaknesses", 2) ||
    contains("area of improvement") ||
    contains("areas of improvement") ||
    contains("areas for improvement") ||
    contains("where can he improve") ||
    contains("what is his weakness") ||
    contains("what are his weaknesses")
  ) {
    return {
      type: "WEAKNESSES",
      text: `🌱 **Areas for Continuous Growth:**\nIjlal is an architecture perfectionist who takes great pride in clean code, comprehensive test suites, and strict prompt guardrails. At times, he dives deep into refining edge cases—which he actively balances by practicing agile sprint timeboxing and shipping high-value features iteratively!`,
      actionLink: { label: "View About & Skills", tab: "About" }
    };
  }

  // 65. PWA & OFFLINE
  if (hasWord("pwa", 0) || contains("install app") || contains("offline")) {
    return {
      type: "PWA",
      text: `📱 **Progressive Web App (PWA):**\nThis portfolio is an installable PWA! You can install it on your mobile home screen or desktop for fast app-like access with offline caching.`,
      actionLink: { label: "Explore Projects", tab: "Projects" }
    };
  }

  // 65. CONCISE GENERAL GROUNDED FALLBACK
  return {
    type: "FALLBACK",
    text: `Sorry, that's outside my context or not in my knowledge base regarding **Ijlal Hussain and his portfolio**! 🤖\n\nI am Ijlal's dedicated portfolio AI assistant, trained exclusively to answer questions about his software engineering projects (ResumeIQ, SafeZone, Blog Factory), his **3.96 CGPA** at NUML, verified certifications, and technical skills.\n\nTry asking me:\n• *"Who is Ijlal?"*\n• *"What is his CGPA?"*\n• *"What projects has he built?"*\n• *"What did he do at Kartoa?"*\n• *"How can I contact him?"*`,
    actionLink: { label: "Explore Projects", tab: "Projects" }
  };
}

// -------------------------------------------------------------
// COMPREHENSIVE TEST SUITE (360+ TESTS)
// -------------------------------------------------------------
const testCases = [
  // 1. Executive Summary & Profile Summaries
  { q: "executive summary", expected: "PORTFOLIO_SUMMARY" },
  { q: "portfolio summary", expected: "PORTFOLIO_SUMMARY" },
  { q: "summary of ijlal", expected: "PORTFOLIO_SUMMARY" },
  { q: "summary of profile", expected: "PORTFOLIO_SUMMARY" },
  { q: "summary of everything", expected: "PORTFOLIO_SUMMARY" },
  { q: "summarize ijlal", expected: "PORTFOLIO_SUMMARY" },
  { q: "summarize his profile", expected: "PORTFOLIO_SUMMARY" },
  { q: "summarize him", expected: "PORTFOLIO_SUMMARY" },
  { q: "give me a summary", expected: "PORTFOLIO_SUMMARY" },
  { q: "quick summary", expected: "PORTFOLIO_SUMMARY" },
  { q: "summary of his career", expected: "PORTFOLIO_SUMMARY" },

  // 2. Chatbot Info & Model Architecture
  { q: "what model are you", expected: "CHATBOT_INFO" },
  { q: "what llm is this", expected: "CHATBOT_INFO" },
  { q: "what ai is this", expected: "CHATBOT_INFO" },
  { q: "what model do you use", expected: "CHATBOT_INFO" },
  { q: "are you chatgpt", expected: "CHATBOT_INFO" },
  { q: "are you llama", expected: "CHATBOT_INFO" },
  { q: "are you deepseek", expected: "CHATBOT_INFO" },
  { q: "are you gemini", expected: "CHATBOT_INFO" },
  { q: "are you claude", expected: "CHATBOT_INFO" },
  { q: "how does this bot work", expected: "CHATBOT_INFO" },
  { q: "how was this bot built", expected: "CHATBOT_INFO" },
  { q: "how do you work", expected: "CHATBOT_INFO" },
  { q: "is this bot local", expected: "CHATBOT_INFO" },
  { q: "is this ai local", expected: "CHATBOT_INFO" },

  // 3. Project Comparisons
  { q: "difference between resumeiq and safezone", expected: "COMPARE_PROJECTS" },
  { q: "compare resumeiq and safezone", expected: "COMPARE_PROJECTS" },
  { q: "compare projects", expected: "COMPARE_PROJECTS" },
  { q: "compare project", expected: "COMPARE_PROJECTS" },
  { q: "resumeiq vs safezone", expected: "COMPARE_PROJECTS" },
  { q: "safezone vs resumeiq", expected: "COMPARE_PROJECTS" },
  { q: "resumeiq vs blog factory", expected: "COMPARE_PROJECTS" },
  { q: "difference between projects", expected: "COMPARE_PROJECTS" },
  { q: "difference between safezone and blog factory", expected: "COMPARE_PROJECTS" },

  // 4. Preferred & Favorite Programming Language
  { q: "what is his favorite programming language", expected: "FAVORITE_LANGUAGE" },
  { q: "what is his favourite programming language", expected: "FAVORITE_LANGUAGE" },
  { q: "favorite programming language", expected: "FAVORITE_LANGUAGE" },
  { q: "favourite programming language", expected: "FAVORITE_LANGUAGE" },
  { q: "favorite language", expected: "FAVORITE_LANGUAGE" },
  { q: "favourite language", expected: "FAVORITE_LANGUAGE" },
  { q: "preferred programming language", expected: "FAVORITE_LANGUAGE" },
  { q: "preferred language", expected: "FAVORITE_LANGUAGE" },
  { q: "which language does he prefer", expected: "FAVORITE_LANGUAGE" },
  { q: "what language does he prefer", expected: "FAVORITE_LANGUAGE" },
  { q: "favorite coding language", expected: "FAVORITE_LANGUAGE" },
  { q: "which programming language does he like", expected: "FAVORITE_LANGUAGE" },

  // 5. Soft Skills & Interpersonal Attributes
  { q: "what are his soft skills", expected: "SOFT_SKILLS" },
  { q: "soft skills", expected: "SOFT_SKILLS" },
  { q: "soft skill", expected: "SOFT_SKILLS" },
  { q: "interpersonal skills", expected: "SOFT_SKILLS" },
  { q: "communication skills", expected: "SOFT_SKILLS" },
  { q: "how is his teamwork", expected: "SOFT_SKILLS" },
  { q: "teamwork", expected: "SOFT_SKILLS" },
  { q: "adaptability", expected: "SOFT_SKILLS" },
  { q: "collaboration", expected: "SOFT_SKILLS" },
  { q: "problem solving skills", expected: "SOFT_SKILLS" },
  { q: "how is his communication", expected: "SOFT_SKILLS" },

  // 6. Professional References
  { q: "can i get references", expected: "REFERENCES" },
  { q: "does he have references", expected: "REFERENCES" },
  { q: "professional references", expected: "REFERENCES" },
  { q: "academic references", expected: "REFERENCES" },
  { q: "reference contact", expected: "REFERENCES" },
  { q: "who can vouch for him", expected: "REFERENCES" },
  { q: "letters of recommendation", expected: "REFERENCES" },
  { q: "recommendations for ijlal", expected: "REFERENCES" },

  // 7. Immediate Availability & Joining Dates
  { q: "when can he join", expected: "IMMEDIATE_AVAILABILITY" },
  { q: "how soon can he start", expected: "IMMEDIATE_AVAILABILITY" },
  { q: "how fast can he start", expected: "IMMEDIATE_AVAILABILITY" },
  { q: "earliest start date", expected: "IMMEDIATE_AVAILABILITY" },
  { q: "can he start immediately", expected: "IMMEDIATE_AVAILABILITY" },
  { q: "can he join immediately", expected: "IMMEDIATE_AVAILABILITY" },
  { q: "immediate start", expected: "IMMEDIATE_AVAILABILITY" },
  { q: "what is his start date", expected: "IMMEDIATE_AVAILABILITY" },
  { q: "joining date", expected: "IMMEDIATE_AVAILABILITY" },

  // 8. Favorite Subject & AI Passion
  { q: "what is his favorite subject", expected: "FAVORITE_SUBJECT" },
  { q: "what is ijlal's favorite subject", expected: "FAVORITE_SUBJECT" },
  { q: "what is his major interest", expected: "FAVORITE_SUBJECT" },
  { q: "what is his passion", expected: "FAVORITE_SUBJECT" },
  { q: "what is his favorite topic", expected: "FAVORITE_SUBJECT" },
  { q: "favourite subject of ijlal", expected: "FAVORITE_SUBJECT" },
  { q: "what is he passionate about", expected: "FAVORITE_SUBJECT" },
  { q: "what does he love to build", expected: "FAVORITE_SUBJECT" },
  { q: "what is his favorite course", expected: "FAVORITE_SUBJECT" },
  { q: "is artificial intelligence his favorite subject", expected: "FAVORITE_SUBJECT" },

  // 9. Coursework & University Subjects
  { q: "what courses did he take at numl", expected: "COURSEWORK" },
  { q: "what subjects did he study", expected: "COURSEWORK" },
  { q: "numl coursework", expected: "COURSEWORK" },
  { q: "coursework", expected: "COURSEWORK" },
  { q: "courses studied at university", expected: "COURSEWORK" },
  { q: "what did he study at numl", expected: "COURSEWORK" },
  { q: "university subjects", expected: "COURSEWORK" },
  { q: "university coursework", expected: "COURSEWORK" },
  { q: "numl subjects", expected: "COURSEWORK" },

  // 10. Technical Challenges
  { q: "tell me a technical challenge he solved", expected: "TECH_CHALLENGES" },
  { q: "what was the most difficult challenge he solved", expected: "TECH_CHALLENGES" },
  { q: "complex engineering problem he solved", expected: "TECH_CHALLENGES" },
  { q: "hardest problem he tackled", expected: "TECH_CHALLENGES" },
  { q: "engineering hurdle", expected: "TECH_CHALLENGES" },

  // 11. Unsupported Tech / Stack Scope & Agility
  { q: "does he know php", expected: "UNSUPPORTED_TECH" },
  { q: "does he know c++", expected: "UNSUPPORTED_TECH" },
  { q: "does he know c#", expected: "UNSUPPORTED_TECH" },
  { q: "does he know rust", expected: "UNSUPPORTED_TECH" },
  { q: "does he know ruby", expected: "UNSUPPORTED_TECH" },
  { q: "does he know aws", expected: "UNSUPPORTED_TECH" },
  { q: "does he know swift", expected: "UNSUPPORTED_TECH" },
  { q: "does he know kotlin", expected: "UNSUPPORTED_TECH" },
  { q: "does he know golang", expected: "UNSUPPORTED_TECH" },
  { q: "does he know vue", expected: "UNSUPPORTED_TECH" },
  { q: "does he know angular", expected: "UNSUPPORTED_TECH" },
  { q: "does he know django", expected: "UNSUPPORTED_TECH" },
  { q: "does he know laravel", expected: "UNSUPPORTED_TECH" },
  { q: "experience with aws", expected: "UNSUPPORTED_TECH" },
  { q: "is he good at rust", expected: "UNSUPPORTED_TECH" },

  // 12. Comparative Balance Queries
  { q: "is he better at frontend or backend", expected: "FRONTEND_VS_BACKEND" },
  { q: "frontend vs backend", expected: "FRONTEND_VS_BACKEND" },
  { q: "backend or frontend", expected: "FRONTEND_VS_BACKEND" },
  { q: "python vs java", expected: "PYTHON_VS_JAVA" },
  { q: "is he better at python or java", expected: "PYTHON_VS_JAVA" },
  { q: "java vs python", expected: "PYTHON_VS_JAVA" },

  // 13. Target Career Roles
  { q: "what roles is he targeting", expected: "TARGET_ROLES" },
  { q: "target roles", expected: "TARGET_ROLES" },
  { q: "what job does he want", expected: "TARGET_ROLES" },
  { q: "what position is he looking for", expected: "TARGET_ROLES" },
  { q: "what roles is he seeking", expected: "TARGET_ROLES" },
  { q: "career goals", expected: "TARGET_ROLES" },
  { q: "aspiring role", expected: "TARGET_ROLES" },

  // 14. Ordinal Project Queries
  { q: "which project is ijlal hussains latest", expected: "LATEST_PROJECT" },
  { q: "what is ijlal's latest project", expected: "LATEST_PROJECT" },
  { q: "what is his newest project", expected: "LATEST_PROJECT" },
  { q: "latest project", expected: "LATEST_PROJECT" },
  { q: "most recent project", expected: "LATEST_PROJECT" },
  { q: "current project of ijlal", expected: "LATEST_PROJECT" },
  { q: "what was his first project", expected: "FIRST_PROJECT" },
  { q: "first project", expected: "FIRST_PROJECT" },
  { q: "oldest project", expected: "FIRST_PROJECT" },
  { q: "earliest project", expected: "FIRST_PROJECT" },
  { q: "initial project", expected: "FIRST_PROJECT" },
  { q: "what is his best project", expected: "BEST_PROJECT" },
  { q: "best project", expected: "BEST_PROJECT" },
  { q: "flagship project", expected: "BEST_PROJECT" },
  { q: "top project", expected: "BEST_PROJECT" },
  { q: "most impressive project", expected: "BEST_PROJECT" },

  // 15. Categorized Project Queries
  { q: "what are his ai projects", expected: "AI_PROJECTS" },
  { q: "ai projects", expected: "AI_PROJECTS" },
  { q: "generative ai projects", expected: "AI_PROJECTS" },
  { q: "genai projects", expected: "AI_PROJECTS" },
  { q: "llm projects", expected: "AI_PROJECTS" },
  { q: "langgraph projects", expected: "AI_PROJECTS" },
  { q: "what are his mobile projects", expected: "MOBILE_PROJECTS" },
  { q: "android projects", expected: "MOBILE_PROJECTS" },
  { q: "mobile apps he built", expected: "MOBILE_PROJECTS" },
  { q: "mobile app", expected: "MOBILE_PROJECTS" },
  { q: "what are his web projects", expected: "WEB_PROJECTS" },
  { q: "websites built by ijlal", expected: "WEB_PROJECTS" },
  { q: "react projects", expected: "WEB_PROJECTS" },
  { q: "how many projects has he built", expected: "PROJECT_COUNT" },
  { q: "total projects", expected: "PROJECT_COUNT" },
  { q: "list all projects", expected: "ALL_PROJECTS" },
  { q: "what projects has he built", expected: "ALL_PROJECTS" },
  { q: "show all projects", expected: "ALL_PROJECTS" },

  // 16. Work Experience
  { q: "what is his latest job", expected: "LATEST_EXPERIENCE" },
  { q: "what is his current role", expected: "LATEST_EXPERIENCE" },
  { q: "where does he work", expected: "LATEST_EXPERIENCE" },
  { q: "where is he working", expected: "LATEST_EXPERIENCE" },
  { q: "tell me all his experience", expected: "ALL_EXPERIENCE" },
  { q: "work history", expected: "ALL_EXPERIENCE" },
  { q: "career history", expected: "ALL_EXPERIENCE" },
  { q: "all internships", expected: "ALL_EXPERIENCE" },
  { q: "what did he do at kartoa", expected: "KARTOA_EXPERIENCE" },
  { q: "kartoa internship", expected: "KARTOA_EXPERIENCE" },
  { q: "what did he do at alberuni", expected: "ALBERUNI_EXPERIENCE" },
  { q: "alberuni tech", expected: "ALBERUNI_EXPERIENCE" },
  { q: "leadership experience", expected: "LEADERSHIP" },
  { q: "did he lead a team", expected: "LEADERSHIP" },
  { q: "who was the lead of safe zone", expected: "LEADERSHIP" },
  { q: "what is his leadership style", expected: "LEADERSHIP" },
  { q: "work ethic", expected: "LEADERSHIP" },

  // 17. Latest Education & Degrees
  { q: "what is his latest education", expected: "LATEST_EDUCATION" },
  { q: "latest education", expected: "LATEST_EDUCATION" },
  { q: "what is the latest education", expected: "LATEST_EDUCATION" },
  { q: "what is ijlal latest education", expected: "LATEST_EDUCATION" },
  { q: "what is the latest project that ijals lates eductaion", expected: "LATEST_EDUCATION" },
  { q: "lates eductaion", expected: "LATEST_EDUCATION" },
  { q: "what is his latest degree", expected: "LATEST_EDUCATION" },
  { q: "latest degree", expected: "LATEST_EDUCATION" },
  { q: "highest qualification", expected: "LATEST_EDUCATION" },
  { q: "highest degree", expected: "LATEST_EDUCATION" },
  { q: "what degree did he complete", expected: "LATEST_EDUCATION" },
  { q: "what is his education", expected: "LATEST_EDUCATION" },
  { q: "tell me his education", expected: "LATEST_EDUCATION" },

  // 18. Education Stages & Timeline
  { q: "what is his matric grade", expected: "MATRIC_EDUCATION" },
  { q: "matric marks", expected: "MATRIC_EDUCATION" },
  { q: "matric percentage", expected: "MATRIC_EDUCATION" },
  { q: "vision school", expected: "MATRIC_EDUCATION" },
  { q: "what school did he go to", expected: "MATRIC_EDUCATION" },
  { q: "what is his intermediate grade", expected: "INTERMEDIATE_EDUCATION" },
  { q: "college grade", expected: "INTERMEDIATE_EDUCATION" },
  { q: "danyore college", expected: "INTERMEDIATE_EDUCATION" },
  { q: "what college did he go to", expected: "INTERMEDIATE_EDUCATION" },
  { q: "where did he do his intermediate", expected: "INTERMEDIATE_EDUCATION" },
  { q: "what is his university grade", expected: "UNIVERSITY_EDUCATION" },
  { q: "where did he study", expected: "UNIVERSITY_EDUCATION" },
  { q: "numl islamabad", expected: "UNIVERSITY_EDUCATION" },
  { q: "which university", expected: "UNIVERSITY_EDUCATION" },
  { q: "where he graduated", expected: "UNIVERSITY_EDUCATION" },
  { q: "tell me all his education", expected: "FULL_EDUCATION" },
  { q: "full education background", expected: "FULL_EDUCATION" },
  { q: "did he get first class honors", expected: "CGPA" },

  // 19. CGPA & Variations
  { q: "what is his cgpa", expected: "CGPA" },
  { q: "what is cgpa of ijlal", expected: "CGPA" },
  { q: "cgpa of ijla", expected: "CGPA" },
  { q: "cgoa of itjall", expected: "CGPA" },
  { q: "cgpaa of ijlla", expected: "CGPA" },
  { q: "what is the gpa of ijlal", expected: "CGPA" },
  { q: "how much cgpa", expected: "CGPA" },
  { q: "his gpa", expected: "CGPA" },

  // 20. Who is Ijlal / Identity / Names & Typos
  { q: "who is ijlal", expected: "ABOUT_IJLAL" },
  { q: "who is ijlal hussain", expected: "ABOUT_IJLAL" },
  { q: "who is ijlal hussaini", expected: "ABOUT_IJLAL" },
  { q: "who is ijla", expected: "ABOUT_IJLAL" },
  { q: "who is hussin", expected: "ABOUT_IJLAL" },
  { q: "who is husain", expected: "ABOUT_IJLAL" },
  { q: "who is itjall", expected: "ABOUT_IJLAL" },
  { q: "tell me about him", expected: "ABOUT_IJLAL" },
  { q: "tell me about ijlal hussaini", expected: "ABOUT_IJLAL" },
  { q: "who is he", expected: "ABOUT_IJLAL" },
  { q: "introduce ijlal", expected: "ABOUT_IJLAL" },
  { q: "profile of ijlal", expected: "ABOUT_IJLAL" },
  { q: "background of ijlal", expected: "ABOUT_IJLAL" },
  { q: "what does he do", expected: "TITLES" },
  { q: "what are his titles", expected: "TITLES" },
  { q: "what is his profession", expected: "TITLES" },
  { q: "what kind of engineer", expected: "TITLES" },

  // 21. Skills & Tech Concepts
  { q: "waht is python", expected: "SKILL_PYTHON" },
  { q: "what is python", expected: "SKILL_PYTHON" },
  { q: "tell me about python", expected: "SKILL_PYTHON" },
  { q: "does he know python", expected: "SKILL_PYTHON" },
  { q: "python skill", expected: "SKILL_PYTHON" },
  { q: "what is java", expected: "SKILL_ANDROID" },
  { q: "what is android", expected: "SKILL_ANDROID" },
  { q: "what is langgraph", expected: "SKILL_GENAI" },
  { q: "what is rag", expected: "SKILL_GENAI" },
  { q: "what is fastapi", expected: "SKILL_FASTAPI" },
  { q: "what is react", expected: "SKILL_WEB" },
  { q: "what is typescript", expected: "SKILL_WEB" },
  { q: "what is tailwind", expected: "SKILL_WEB" },
  { q: "what is docker", expected: "SKILL_TOOLS" },
  { q: "what is firebase", expected: "SKILL_DATABASE" },
  { q: "what is mongodb", expected: "SKILL_DATABASE" },
  { q: "what is git", expected: "SKILL_TOOLS" },
  { q: "what is flutter", expected: "SKILL_FLUTTER" },
  { q: "what is his best skill", expected: "TOP_SKILLS" },
  { q: "what is his highest skill", expected: "TOP_SKILLS" },
  { q: "what is his strongest skill", expected: "TOP_SKILLS" },
  { q: "how good is he at python", expected: "SKILL_PYTHON" },
  { q: "python proficiency", expected: "SKILL_PYTHON" },
  { q: "what is his level in python", expected: "SKILL_PYTHON" },
  { q: "java android", expected: "SKILL_ANDROID" },
  { q: "langgraph experience", expected: "SKILL_GENAI" },
  { q: "react stack", expected: "SKILL_WEB" },
  { q: "fastapi backend", expected: "SKILL_FASTAPI" },
  { q: "databases he knows", expected: "SKILL_DATABASE" },
  { q: "what languages does he speak", expected: "LANGUAGES" },
  { q: "spoken languages", expected: "LANGUAGES" },
  { q: "tech stack", expected: "ALL_SKILLS" },
  { q: "core skills", expected: "ALL_SKILLS" },

  // 22. Specific Projects & Deep Queries
  { q: "tell me about resumeiq", expected: "RESUMEIQ_OVERVIEW" },
  { q: "resumeiq demo", expected: "RESUMEIQ_DEMO" },
  { q: "how does ats work in resumeiq", expected: "RESUMEIQ_ATS" },
  { q: "google xyz formula", expected: "RESUMEIQ_XYZ" },
  { q: "groq and gemini", expected: "DUAL_LLM" },
  { q: "what llms does resumeiq use", expected: "DUAL_LLM" },
  { q: "tell me about safe zone", expected: "SAFEZONE_OVERVIEW" },
  { q: "what is his final year project", expected: "SAFEZONE_OVERVIEW" },
  { q: "safezone apk download", expected: "SAFEZONE_APK" },
  { q: "how does safezone block apps", expected: "SAFEZONE_BLOCKING" },
  { q: "what apis did safezone use", expected: "SAFEZONE_BLOCKING" },
  { q: "tell me about blog factory", expected: "BLOGFACTORY_OVERVIEW" },
  { q: "blog factory live demo", expected: "BLOGFACTORY_DEMO" },
  { q: "how was this portfolio built", expected: "PORTFOLIO_INFO" },

  // 23. Verified Certifications
  { q: "all certificates", expected: "ALL_CERTS" },
  { q: "how many certificates does he have", expected: "ALL_CERTS" },
  { q: "navttc certificate", expected: "CERT_NAVTTC" },
  { q: "cisco python", expected: "CERT_CISCO" },
  { q: "digiskills", expected: "CERT_DIGISKILL" },

  // 24. Contact & Hire Inquiries
  { q: "download cv", expected: "RESUME_CV" },
  { q: "what is his email", expected: "EMAIL" },
  { q: "what is his whatsapp number", expected: "PHONE" },
  { q: "what is his phone", expected: "PHONE" },
  { q: "linkedin profile", expected: "LINKEDIN" },
  { q: "github profile", expected: "GITHUB" },
  { q: "how can i contact him", expected: "CONTACT" },
  { q: "where is he from", expected: "LOCATION" },
  { q: "how old is he", expected: "AGE" },
  { q: "why should i hire ijlal", expected: "WHY_HIRE" },
  { q: "is he available for hire", expected: "AVAILABILITY" },
  { q: "what is his notice period", expected: "AVAILABILITY" },
  { q: "is he open to freelance", expected: "AVAILABILITY" },
  { q: "is he open to contract", expected: "AVAILABILITY" },
  { q: "is he open to fulltime", expected: "AVAILABILITY" },
  { q: "is he open to remote work", expected: "REMOTE" },
  { q: "can he relocate", expected: "REMOTE" },
  { q: "what is his expected salary", expected: "SALARY" },
  { q: "schedule an interview", expected: "INTERVIEW" },
  { q: "what time is it in pakistan", expected: "TIMEZONE" },
  { q: "what time is it in islamabad", expected: "TIMEZONE" },
  { q: "give all data in json", expected: "JSON_EXPORT" },

  // 25. Typo Normalizations & Spelling Edge-cases
  { q: "wht is python", expected: "SKILL_PYTHON" },
  { q: "wat is python", expected: "SKILL_PYTHON" },
  { q: "pythn programming", expected: "SKILL_PYTHON" },
  { q: "explain python", expected: "SKILL_PYTHON" },
  { q: "definition of python", expected: "SKILL_PYTHON" },
  { q: "what is numl", expected: "UNIVERSITY_EDUCATION" },
  { q: "what is numl university", expected: "UNIVERSITY_EDUCATION" },
  { q: "what is safezone", expected: "SAFEZONE_OVERVIEW" },
  { q: "what is resumeiq", expected: "RESUMEIQ_OVERVIEW" },
  { q: "what is technical blog factory", expected: "BLOGFACTORY_OVERVIEW" },
  { q: "what is kartoa", expected: "KARTOA_EXPERIENCE" },
  { q: "what is alberuni tech", expected: "ALBERUNI_EXPERIENCE" },
  { q: "what is cisco certification", expected: "CERT_CISCO" },
  { q: "what is navttc", expected: "CERT_NAVTTC" },
  { q: "what is digiskills", expected: "CERT_DIGISKILL" },
  { q: "what is prompt engineering", expected: "SKILL_GENAI" },
  { q: "what are guardrails", expected: "SKILL_GENAI" },
  { q: "what is ats auditor", expected: "RESUMEIQ_ATS" },
  { q: "what is google xyz formula", expected: "RESUMEIQ_XYZ" },

  // 26. Conversational / Well-being / Greetings / Praise / Identity
  { q: "hi", expected: "GREETING" },
  { q: "hello", expected: "GREETING" },
  { q: "hey there", expected: "GREETING" },
  { q: "assalam o alaikum", expected: "GREETING" },
  { q: "salam", expected: "GREETING" },
  { q: "good morning", expected: "GREETING" },
  { q: "good evening", expected: "GREETING" },
  { q: "welcome", expected: "GREETING" },
  { q: "how are you", expected: "WELL_BEING" },
  { q: "how are you doing", expected: "WELL_BEING" },
  { q: "hows it going", expected: "WELL_BEING" },
  { q: "ok", expected: "ACKNOWLEDGMENT" },
  { q: "okay", expected: "ACKNOWLEDGMENT" },
  { q: "sure", expected: "ACKNOWLEDGMENT" },
  { q: "sounds good", expected: "ACKNOWLEDGMENT" },
  { q: "thanks", expected: "GRATITUDE" },
  { q: "thank you very much", expected: "GRATITUDE" },
  { q: "you are smart", expected: "PRAISE" },
  { q: "you are awesome", expected: "PRAISE" },
  { q: "who made you", expected: "CREATOR" },
  { q: "who built you", expected: "CREATOR" },
  { q: "are you a human", expected: "HUMAN_VS_AI" },
  { q: "are you real", expected: "HUMAN_VS_AI" },
  { q: "am i talking to ijlal", expected: "HUMAN_VS_AI" },
  { q: "who are you", expected: "BOT_IDENTITY" },
  { q: "what can you do", expected: "HELP" },
  { q: "help", expected: "HELP" },
  { q: "stroke 134343", expected: "GIBBERISH" },
  { q: "134343", expected: "GIBBERISH" },
  { q: "987654321", expected: "GIBBERISH" },
  { q: "asdfghjkl", expected: "GIBBERISH" },
  { q: "write a python code to sort an array", expected: "OUT_OF_CONTEXT" },
  { q: "write a quicksort function in python", expected: "OUT_OF_CONTEXT" },
  { q: "what is the capital of france", expected: "OUT_OF_CONTEXT" },
  { q: "solve 25 * 4", expected: "OUT_OF_CONTEXT" },
  { q: "tell me a joke", expected: "OUT_OF_CONTEXT" },
  { q: "what is pythons", expected: "OUT_OF_CONTEXT" },
  { q: "pythons", expected: "OUT_OF_CONTEXT" },
  { q: "snakes", expected: "OUT_OF_CONTEXT" },
  { q: "what is software engineering", expected: "OUT_OF_CONTEXT" },
  { q: "define software engineering", expected: "OUT_OF_CONTEXT" },
  { q: "what is computer science", expected: "OUT_OF_CONTEXT" },
  { q: "define computer science", expected: "OUT_OF_CONTEXT" },
  { q: "what is an operating system", expected: "OUT_OF_CONTEXT" },
  { q: "what is hardware", expected: "OUT_OF_CONTEXT" },
  { q: "what is internet", expected: "OUT_OF_CONTEXT" },
  { q: "what is cybersecurity", expected: "OUT_OF_CONTEXT" },
  { q: "what is cloud computing", expected: "OUT_OF_CONTEXT" },
  { q: "what is data science", expected: "OUT_OF_CONTEXT" },
  { q: "what is biology", expected: "OUT_OF_CONTEXT" },
  { q: "what is physics", expected: "OUT_OF_CONTEXT" },
  { q: "what is chemistry", expected: "OUT_OF_CONTEXT" },
  { q: "what is an algorithm", expected: "OUT_OF_CONTEXT" },
  { q: "define algorithm", expected: "OUT_OF_CONTEXT" },
  { q: "what is programming", expected: "OUT_OF_CONTEXT" },
  { q: "what is artificial intelligence", expected: "OUT_OF_CONTEXT" },
  { q: "what is his name", expected: "ABOUT_IJLAL" },
  { q: "whose portfolio is this", expected: "ABOUT_IJLAL" },
  { q: "what is his weakness", expected: "WEAKNESSES" },
  { q: "areas of improvement", expected: "WEAKNESSES" },
  { q: "where does he see himself in 5 years", expected: "TARGET_ROLES" }
];

let passed = 0;
let failed = 0;

for (const test of testCases) {
  const result = generateGroundedResponse(test.q);
  if (result.type === test.expected) {
    passed++;
  } else {
    failed++;
    console.error(`FAILED: "${test.q}" -> Expected: ${test.expected}, Got: ${result.type}`);
  }
}

console.log(`\nResults: ${passed} Passed, ${failed} Failed out of ${testCases.length} total tests.`);
if (failed === 0) {
  console.log(`ALL ${testCases.length} TESTS PASSED WITH 100% ACCURACY! 🎉`);
} else {
  process.exit(1);
}

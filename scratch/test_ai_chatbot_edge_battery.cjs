const { personalInfo, skillsData, experienceData, educationData, projectsData, certificationsData } = require("./portfolioData.cjs");

// Import the engine from test_ai_chatbot
const fs = require("fs");
const testCode = fs.readFileSync(__dirname + "/test_ai_chatbot.cjs", "utf8");

// Extract generateGroundedResponse and helpers
eval(testCode.slice(0, testCode.indexOf("const testCases = [")));

const comprehensiveEdgeBattery = [
  // 1. Personal Info & Names
  { q: "Ijlal Hussain", expected: "ABOUT_IJLAL" },
  { q: "ijlal", expected: "ABOUT_IJLAL" },
  { q: "hussain", expected: "ABOUT_IJLAL" },
  { q: "hussaini", expected: "ABOUT_IJLAL" },
  { q: "itjal", expected: "ABOUT_IJLAL" },
  { q: "who is this person", expected: "ABOUT_IJLAL" },
  { q: "who is the owner", expected: "ABOUT_IJLAL" },
  { q: "what is his name", expected: "ABOUT_IJLAL" },
  { q: "candidate name", expected: "ABOUT_IJLAL" },
  { q: "tell me about candidate", expected: "ABOUT_IJLAL" },

  // 2. Education & CGPA
  { q: "CGPA", expected: "CGPA" },
  { q: "cgoa", expected: "CGPA" },
  { q: "cgpaa", expected: "CGPA" },
  { q: "3.96", expected: "CGPA" },
  { q: "grades", expected: "CGPA" },
  { q: "first class honors", expected: "CGPA" },
  { q: "NUML", expected: "UNIVERSITY_EDUCATION" },
  { q: "numal university", expected: "UNIVERSITY_EDUCATION" },
  { q: "which university", expected: "UNIVERSITY_EDUCATION" },
  { q: "where did he graduate from", expected: "UNIVERSITY_EDUCATION" },
  { q: "bachelor degree", expected: "UNIVERSITY_EDUCATION" },
  { q: "all education", expected: "FULL_EDUCATION" },
  { q: "matriculation marks", expected: "MATRIC_EDUCATION" },
  { q: "intermediate grade", expected: "INTERMEDIATE_EDUCATION" },
  { q: "fsc marks", expected: "INTERMEDIATE_EDUCATION" },
  { q: "vision school", expected: "MATRIC_EDUCATION" },
  { q: "danyore college", expected: "INTERMEDIATE_EDUCATION" },

  // 3. Coursework & Favorite Subject
  { q: "favorite subject", expected: "FAVORITE_SUBJECT" },
  { q: "favourite course", expected: "FAVORITE_SUBJECT" },
  { q: "his passion", expected: "FAVORITE_SUBJECT" },
  { q: "what subjects did he study at numl", expected: "COURSEWORK" },
  { q: "university coursework", expected: "COURSEWORK" },

  // 4. Projects (All, Ordinals, Categories, Specifics)
  { q: "list all projects", expected: "ALL_PROJECTS" },
  { q: "how many projects", expected: "PROJECT_COUNT" },
  { q: "latest project", expected: "LATEST_PROJECT" },
  { q: "newest project", expected: "LATEST_PROJECT" },
  { q: "first project", expected: "FIRST_PROJECT" },
  { q: "flagship project", expected: "BEST_PROJECT" },
  { q: "ai projects", expected: "AI_PROJECTS" },
  { q: "mobile projects", expected: "MOBILE_PROJECTS" },
  { q: "web projects", expected: "WEB_PROJECTS" },
  { q: "resumeiq", expected: "RESUMEIQ_OVERVIEW" },
  { q: "resumiq", expected: "RESUMEIQ_OVERVIEW" },
  { q: "tell me about resume iq", expected: "RESUMEIQ_OVERVIEW" },
  { q: "resumeiq demo url", expected: "RESUMEIQ_DEMO" },
  { q: "ats compliance in resumeiq", expected: "RESUMEIQ_ATS" },
  { q: "google xyz bullet", expected: "RESUMEIQ_XYZ" },
  { q: "safe zone android app", expected: "SAFEZONE_OVERVIEW" },
  { q: "safezone apk", expected: "SAFEZONE_APK" },
  { q: "download safezone", expected: "SAFEZONE_APK" },
  { q: "how does safe zone block apps", expected: "SAFEZONE_BLOCKING" },
  { q: "technical blog factory", expected: "BLOGFACTORY_OVERVIEW" },
  { q: "blog factory live demo", expected: "BLOGFACTORY_DEMO" },
  { q: "tavily search in blog factory", expected: "BLOGFACTORY_OVERVIEW" },
  { q: "developer portfolio source code", expected: "PORTFOLIO_INFO" },

  // 5. Work Experience & Internships
  { q: "all work experience", expected: "ALL_EXPERIENCE" },
  { q: "latest job", expected: "LATEST_EXPERIENCE" },
  { q: "kartoa technologies", expected: "KARTOA_EXPERIENCE" },
  { q: "kartoa internship", expected: "KARTOA_EXPERIENCE" },
  { q: "alberuni tech", expected: "ALBERUNI_EXPERIENCE" },
  { q: "requirements engineering intern", expected: "ALBERUNI_EXPERIENCE" },
  { q: "fyp team lead", expected: "LEADERSHIP" },
  { q: "leadership experience", expected: "LEADERSHIP" },

  // 6. Certifications
  { q: "all certifications", expected: "ALL_CERTS" },
  { q: "verified certificates", expected: "ALL_CERTS" },
  { q: "navttc genai", expected: "CERT_NAVTTC" },
  { q: "adan institute", expected: "CERT_NAVTTC" },
  { q: "cisco python certificate", expected: "CERT_CISCO" },
  { q: "digiskills freelancing", expected: "CERT_DIGISKILL" },
  { q: "digiskills graphic design", expected: "CERT_DIGISKILL" },

  // 7. Technical Skills & Tools
  { q: "python mastery", expected: "SKILL_PYTHON" },
  { q: "what is his python proficiency", expected: "SKILL_PYTHON" },
  { q: "java android sdk", expected: "SKILL_ANDROID" },
  { q: "langgraph state machine", expected: "SKILL_GENAI" },
  { q: "rag retrieval pipelines", expected: "SKILL_GENAI" },
  { q: "chromadb and faiss", expected: "SKILL_GENAI" },
  { q: "fastapi backend", expected: "SKILL_FASTAPI" },
  { q: "react 19 nextjs", expected: "SKILL_WEB" },
  { q: "tailwind css v4", expected: "SKILL_WEB" },
  { q: "docker containerization", expected: "SKILL_TOOLS" },
  { q: "firebase realtime database", expected: "SKILL_DATABASE" },
  { q: "mongodb nosql", expected: "SKILL_DATABASE" },
  { q: "git and github", expected: "SKILL_TOOLS" },
  { q: "figma prototyping", expected: "SKILL_TOOLS" },
  { q: "postman testing", expected: "SKILL_TOOLS" },
  { q: "preferred programming language", expected: "FAVORITE_LANGUAGE" },
  { q: "spoken languages", expected: "LANGUAGES" },
  { q: "soft skills", expected: "SOFT_SKILLS" },
  { q: "references", expected: "REFERENCES" },

  // 8. Availability, Contact, Salary & Career
  { q: "is he available for hire", expected: "AVAILABILITY" },
  { q: "immediate start", expected: "IMMEDIATE_AVAILABILITY" },
  { q: "when can he join", expected: "IMMEDIATE_AVAILABILITY" },
  { q: "notice period", expected: "AVAILABILITY" },
  { q: "remote work", expected: "REMOTE" },
  { q: "can he relocate", expected: "REMOTE" },
  { q: "salary expectation", expected: "SALARY" },
  { q: "schedule an interview", expected: "INTERVIEW" },
  { q: "download cv", expected: "RESUME_CV" },
  { q: "email address", expected: "EMAIL" },
  { q: "whatsapp number", expected: "PHONE" },
  { q: "linkedin profile", expected: "LINKEDIN" },
  { q: "github profile", expected: "GITHUB" },
  { q: "where is he from", expected: "LOCATION" },
  { q: "hometown", expected: "LOCATION" },
  { q: "how old is he", expected: "AGE" },
  { q: "why should i hire ijlal", expected: "WHY_HIRE" },
  { q: "what are his weaknesses", expected: "WEAKNESSES" },
  { q: "where does he see himself in 5 years", expected: "TARGET_ROLES" },
  { q: "what are his target roles", expected: "TARGET_ROLES" },
  { q: "what time is it in pakistan", expected: "TIMEZONE" },
  { q: "give all data in json", expected: "JSON_EXPORT" },
  { q: "pwa offline", expected: "PWA" },

  // 9. Additional Deep Edge Queries
  { q: "who built this website", expected: "PORTFOLIO_INFO" },
  { q: "how many certificates", expected: "ALL_CERTS" },
  { q: "vision higher secondary school", expected: "MATRIC_EDUCATION" },
  { q: "govt boys degree college", expected: "INTERMEDIATE_EDUCATION" },
  { q: "fsc computer science", expected: "INTERMEDIATE_EDUCATION" },
  { q: "what are his strengths", expected: "WHY_HIRE" },
  { q: "what are his areas of improvement", expected: "WEAKNESSES" },
  { q: "what is his favorite coding language", expected: "FAVORITE_LANGUAGE" },
  { q: "what did he do at kartoa technologies", expected: "KARTOA_EXPERIENCE" },
  { q: "what did he do at alberuni tech", expected: "ALBERUNI_EXPERIENCE" },
  { q: "what is his email address", expected: "EMAIL" },
  { q: "what is his phone number", expected: "PHONE" },
  { q: "what is his linkedin url", expected: "LINKEDIN" },
  { q: "what is his github repository", expected: "GITHUB" },
  { q: "how can i hire ijlal", expected: "AVAILABILITY" },
  { q: "when is his start date", expected: "IMMEDIATE_AVAILABILITY" },
  { q: "does he have references", expected: "REFERENCES" },

  // 10. Conversational & Out-of-bounds Guardrails
  { q: "hello", expected: "GREETING" },
  { q: "how are you", expected: "WELL_BEING" },
  { q: "ok", expected: "ACKNOWLEDGMENT" },
  { q: "thanks", expected: "GRATITUDE" },
  { q: "you are awesome", expected: "PRAISE" },
  { q: "who created you", expected: "CREATOR" },
  { q: "are you an ai", expected: "HUMAN_VS_AI" },
  { q: "who are you", expected: "BOT_IDENTITY" },
  { q: "what can you do", expected: "HELP" },
  { q: "123456", expected: "GIBBERISH" },
  { q: "stroke 9999", expected: "GIBBERISH" },
  { q: "what is pythons", expected: "OUT_OF_CONTEXT" },
  { q: "what is software engineering", expected: "OUT_OF_CONTEXT" },
  { q: "what is computer science", expected: "OUT_OF_CONTEXT" },
  { q: "what is an operating system", expected: "OUT_OF_CONTEXT" },
  { q: "what is artificial intelligence", expected: "OUT_OF_CONTEXT" },
  { q: "what is an algorithm", expected: "OUT_OF_CONTEXT" },
  { q: "write a python script to calculate fibonacci", expected: "OUT_OF_CONTEXT" },
  { q: "who was albert einstein", expected: "OUT_OF_CONTEXT" },
  { q: "what is the capital of pakistan", expected: "OUT_OF_CONTEXT" },
  { q: "tell me a joke", expected: "OUT_OF_CONTEXT" },
  { q: "solve 2+2", expected: "OUT_OF_CONTEXT" },
  { q: "what is the meaning of life", expected: "OUT_OF_CONTEXT" },
  { q: "can you write an essay about climate change", expected: "OUT_OF_CONTEXT" }
];

let passCount = 0;
let failCount = 0;

for (const test of comprehensiveEdgeBattery) {
  const res = generateGroundedResponse(test.q);
  if (res.type === test.expected) {
    passCount++;
  } else {
    failCount++;
    console.error(`FAILED: "${test.q}" -> Expected: ${test.expected}, Got: ${res.type}`);
  }
}

console.log(`\nEdge Battery: ${passCount} Passed, ${failCount} Failed out of ${comprehensiveEdgeBattery.length} tests.`);
if (failCount === 0) {
  console.log("100% PERFECT PASS ON ALL EDGE TESTS! 🚀");
} else {
  process.exit(1);
}

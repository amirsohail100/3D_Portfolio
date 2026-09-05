const categoryMeta = {
  ml: {
    label: "ML (Machine Learning)",
    folder: "ML",
    fileCount: 10,
    tech: ["Python", "Scikit-Learn", "XGBoost", "FastAPI", "TensorBoard", "Pandas"],
    names: ["Rainfall Prediction System", "Flipkart Product Sentiment & Rating Predictor", "New York City Airbnb ML Analytics Web App", "Telehealth AI", "Mental Health Signal", "Market & Economic Predictor App", "Stroke Prediction System", "Air Passengers Prediction System", "Credit Fraud Detection","Al Model Arena Rank Predictor"],
    stats: ["99.4% accuracy", "2.8x faster decisions", "Zero-downtime retraining", "94.7% uplift"],
  },
  dl: {
    label: "DL (Deep Learning)",
    folder: "DL",
    fileCount: 6,
    tech: ["PyTorch", "TensorFlow", "CUDA", "ONNX", "OpenCV", "NVIDIA"],
    names: ["AI Fake News Detector", "AI vs Human Text Detection", "EduRoute AI", "Depth Estimation Lab", "Bank Telemarketing Success Prediction", "SMS Spam Detection"],
    stats: ["60 FPS inference", "70 ms latency", "4K vision pipeline", "98.2% precision"],
  },
  "gen-ai": {
    label: "Gen AI (Generative AI)",
    folder: "Gen-AI",
    fileCount: 5,
    tech: ["LangChain", "OpenAI API", "RAG", "React", "Pinecone", "Python"],
    names: ["Tweetify AI", "PersonaChat VIP Studio", "LexiLearn AI", "DevSphere AI", "QuizGenie AI"],
    stats: ["2.1x creative output", "Adaptive prompt loops", "Multimodal synthesis", "Rapid ideation"],
  },
  web: {
    label: "web (Web Development)",
    folder: "WED",
    fileCount: 16,
    tech: ["Next.js", "Three.js", "React", "GSAP", "Tailwind CSS", "Framer Motion"],
    names: ["TIC TAC TOE", "Todo List App", "Immersive SaaS Dashboard", "ROCK PAPER SCISSORS", "Cinematic Brand Platform", "Experience Commerce Layer", "Realtime Product Storyboard", "Future Interface Studio", "Interactive Launch System", "Glassmorphism Command Center", "Virtual Product Showcase", "Design System Playground", "Immersive Leaderboard", "Storytelling Commerce Suite", "Interactive Journey Engine", "Next-Gen Product Launch"],
    stats: ["60 FPS UI", "Awwwards-ready", "Production UX", "Realtime performance"],
  },
};

const assetMap = {
  ml: Array.from({ length: 10 }, (_, i) => i + 1),
  dl: Array.from({ length: 6 }, (_, i) => i + 1),
  "gen-ai": Array.from({ length: 5 }, (_, i) => i + 1),
  web: Array.from({ length: 16 }, (_, i) => i + 1),
};

const buildImagePath = (folder, index, type) => {
  const safeFolder = folder === "Gen AI" ? "Gen%20AI" : folder;
  const fileSet = assetMap[type] || assetMap.web;
  const fileNumber = fileSet[index % fileSet.length];
  return `/assets/${safeFolder}/projects_${fileNumber}.png`;
};

const generateProjectsData = (count = 60) => {
  const orderedCategories = ["ml", "dl", "gen-ai", "web"];

  return Array.from({ length: count }, (_, index) => {
    const type = orderedCategories[index % orderedCategories.length];
    const meta = categoryMeta[type];
    const categoryName = meta.label;
    const titleBase = meta.names[index % meta.names.length];
    const offsetRotation = (index * 7) % meta.tech.length;
    const techStack = Array.from({ length: 5 }, (_, techIndex) => meta.tech[(techIndex + offsetRotation) % meta.tech.length]);
    const description = `${titleBase} delivers a polished ${categoryName.toLowerCase()} experience with rapid iteration, immersive interfaces, and measurable digital outcomes for modern product teams.`;

    return {
      id: `project-${index + 1}`,
      title: `Project ${index + 1}: ${titleBase}`,
      category: categoryName,
      type,
      description,
      image: buildImagePath(meta.folder, index, type),
      techStack,
      demoUrl: `https://${type.toLowerCase().replace(/\s+/g, "")}.example/project-${index + 1}`,
      githubUrl: `https://github.com/example/${titleBase.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index + 1}`,
      stats: meta.stats[index % meta.stats.length],
      featured: index % 3 === 0,
    };
  });
};

export const projectsData = generateProjectsData(60);

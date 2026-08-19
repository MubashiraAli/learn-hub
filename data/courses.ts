import type {
  Course,
  Lesson,
  LessonResource,
  Module,
  Quiz,
  QuizQuestion,
} from "@/types";
import { getInstructorById } from "./instructors";

const lessonTypeLabels: Record<Lesson["type"], string> = {
  video: "video lesson",
  article: "article",
  exercise: "hands-on exercise",
};

function lessonDescription(
  type: Lesson["type"],
  title: string,
  durationMinutes: number,
): string {
  return `This ${durationMinutes}-minute ${lessonTypeLabels[type]} covers "${title}". Follow the worked examples, then test your understanding with the checkpoint before moving on to the next lesson.`;
}

function lessonResources(lessonId: string, title: string): LessonResource[] {
  return [
    { id: `${lessonId}-slides`, title: "Lesson slides", url: "#", kind: "pdf" },
    {
      id: `${lessonId}-code`,
      title: `${title} — source code`,
      url: "#",
      kind: "code",
    },
    {
      id: `${lessonId}-discuss`,
      title: "Course discussion & Q&A",
      url: "#",
      kind: "link",
    },
  ];
}

function lesson(
  id: string,
  title: string,
  durationMinutes: number,
  type: Lesson["type"] = "video",
): Lesson {
  return {
    id,
    title,
    durationMinutes,
    type,
    description: lessonDescription(type, title, durationMinutes),
    resources: lessonResources(id, title),
  };
}

function module(id: string, title: string, lessons: Lesson[]): Module {
  return { id, title, lessons };
}

function question(
  id: string,
  question: string,
  options: string[],
  correctIndex: number,
): QuizQuestion {
  return { id, question, options, correctIndex };
}

function quiz(
  courseId: string,
  id: string,
  title: string,
  questions: QuizQuestion[],
  passScore = 70,
): Quiz {
  return { id, courseId, title, passScore, questions };
}

export const courses: Course[] = [
  {
    id: "nextjs-masterclass",
    title: "Next.js Masterclass: App Router & Server Components",
    description:
      "Go from routing basics to production-grade Next.js. Build server components, layouts, data fetching, and streaming UIs.",
    category: "web-development",
    level: "advanced",
    instructorId: "in-1",
    durationHours: 14,
    rating: 4.8,
    studentsCount: 12400,
    price: 129,
    originalPrice: 179,
    language: "English",
    tags: ["nextjs", "react", "server-components"],
    imageUrl: "/courses/nextjs-masterclass.svg",
    updatedAt: "2026-07-28",
    learningOutcomes: [
      "Build production-grade Next.js apps with the App Router",
      "Design layouts, route groups, and dynamic segments",
      "Implement data fetching, caching, and revalidation",
      "Stream server-rendered UI with Suspense",
      "Ship Server Actions and mutations safely",
      "Optimize metadata and SEO for every page",
    ],
    requirements: [
      "Solid understanding of JavaScript and React",
      "Comfortable with the terminal and package managers",
      "Basic familiarity with web fundamentals (HTTP, HTML)",
    ],
    modules: [
      module("m1", "App Router Foundations", [
        lesson("l1", "Pages, Layouts, and Navigation", 24),
        lesson("l2", "Dynamic Segments and Route Groups", 28),
        lesson("l3", "Linking, Prefetching, and Redirects", 21),
      ]),
      module("m2", "Rendering and Data Fetching", [
        lesson("l4", "Server vs. Client Components", 32),
        lesson("l5", "Data Fetching, Caching, and Revalidation", 35),
        lesson("l6", "Streaming and Suspense", 26),
      ]),
      module("m3", "Production Patterns", [
        lesson("l7", "Server Actions and Mutations", 30),
        lesson("l8", "Metadata and SEO", 22),
        lesson("l9", "Deploying and Monitoring", 27),
      ]),
    ],
    quiz: quiz("nextjs-masterclass", "quiz-nextjs", "Next.js Masterclass Quiz", [
      question(
        "q1",
        "Which file defines the shared UI that wraps every page?",
        ["page.tsx", "layout.tsx", "template.tsx", "root.tsx"],
        1,
      ),
      question(
        "q2",
        "What is the correct way to access dynamic route params?",
        ["await params", "useParams().params", "props.params directly", "getParams()"],
        0,
      ),
      question(
        "q3",
        "Server Components run…",
        ["only in the browser", "on the server", "in both places at once", "inside the bundler"],
        1,
      ),
      question(
        "q4",
        "Which directive opts a module into client rendering?",
        ["'use server'", "'use client'", "'use browser'", "'use app'"],
        1,
      ),
    ]),
  },
  {
    id: "fullstack-react-typescript",
    title: "Full-Stack React with TypeScript",
    description:
      "Design types, build components, and ship full-stack features with React 19, TypeScript, and modern APIs.",
    category: "web-development",
    level: "intermediate",
    instructorId: "in-1",
    durationHours: 11,
    rating: 4.7,
    studentsCount: 19300,
    price: 99,
    language: "English",
    tags: ["react", "typescript", "fullstack"],
    imageUrl: "/courses/fullstack-react-typescript.svg",
    updatedAt: "2026-06-14",
    learningOutcomes: [
      "Write type-safe React components and hooks",
      "Model application state with generics, unions, and narrowing",
      "Build full-stack features with data fetching and forms",
      "Extract reusable logic with custom hooks",
      "Test components with modern tooling",
    ],
    requirements: [
      "Experience writing JavaScript",
      "Familiarity with React basics (props, state, effects)",
    ],
    modules: [
      module("m1", "TypeScript for React", [
        lesson("l1", "Typing Props and Components", 23),
        lesson("l2", "Generics, Unions, and Type Narrowing", 31),
        lesson("l3", "Typing Events and DOM APIs", 19),
      ]),
      module("m2", "State and Side Effects", [
        lesson("l4", "useState and Reducers", 27),
        lesson("l5", "Custom Hooks and Effects", 33),
        lesson("l6", "Context and Composition", 24),
      ]),
      module("m3", "Full-Stack Patterns", [
        lesson("l7", "Data Fetching Layer", 29),
        lesson("l8", "Forms and Validation", 26),
        lesson("l9", "Testing Components", 30),
      ]),
    ],
    quiz: quiz("fullstack-react-typescript", "quiz-fullstack-ts", "Full-Stack React with TypeScript Quiz", [
      question(
        "q1",
        "What syntax prevents excessive re-renders from inline objects?",
        ["React.memo with useCallback", "useRef objects", "useEffect deps", "render props"],
        0,
      ),
      question(
        "q2",
        "How do you narrow a union of two object types?",
        ["Discriminated union with a literal field", "typeof on the object", "JSON.stringify compare", "Optional chaining"],
        0,
      ),
      question(
        "q3",
        "Which hook returns a memoized value?",
        ["useMemo", "useEffect", "useReducer", "useRef"],
        0,
      ),
      question(
        "q4",
        "A custom hook must start with…",
        ["the word 'use'", "an uppercase letter", "a dollar sign", "the word 'hook'"],
        0,
      ),
    ]),
  },
  {
    id: "generative-ai-fundamentals",
    title: "Generative AI Fundamentals",
    description:
      "Understand how LLMs, diffusion models, and agents work under the hood — no heavy math required.",
    category: "ai",
    level: "beginner",
    instructorId: "in-2",
    durationHours: 8,
    rating: 4.9,
    studentsCount: 28700,
    price: 79,
    originalPrice: 129,
    language: "English",
    tags: ["llm", "generative-ai", "machine-learning"],
    imageUrl: "/courses/generative-ai-fundamentals.svg",
    updatedAt: "2026-08-01",
    learningOutcomes: [
      "Explain how LLMs, transformers, and diffusion models work",
      "Understand tokens, context windows, and attention",
      "Apply prompting strategies to get reliable outputs",
      "Build simple applications with LLM APIs and RAG",
      "Identify hallucination risks and mitigation approaches",
    ],
    requirements: [
      "No prior machine learning knowledge required",
      "Basic programming experience is helpful but not required",
    ],
    modules: [
      module("m1", "Foundations of Generative AI", [
        lesson("l1", "What Generative Models Do", 18),
        lesson("l2", "The Transformer Architecture", 26),
        lesson("l3", "Training, Fine-Tuning, and Inference", 24),
      ]),
      module("m2", "Language Models in Practice", [
        lesson("l4", "Tokens, Context, and Attention", 22),
        lesson("l5", "Prompting and Capabilities", 25),
        lesson("l6", "Evaluation and Hallucination", 27),
      ]),
      module("m3", "Building with LLMs", [
        lesson("l7", "APIs, Embeddings, and RAG", 30),
        lesson("l8", "Agents and Tool Use", 28),
        lesson("l9", "Responsible AI and Safety", 21),
      ]),
    ],
    quiz: quiz("generative-ai-fundamentals", "quiz-genai", "Generative AI Fundamentals Quiz", [
      question(
        "q1",
        "Which architecture powers modern LLMs?",
        ["Transformers", "Convolutional nets", "Recurrent networks", "Random forests"],
        0,
      ),
      question(
        "q2",
        "RAG stands for…",
        ["Retrieval-Augmented Generation", "Random Adaptive Grading", "Recurrent Attention Grid", "Rapid Agent Grounding"],
        0,
      ),
      question(
        "q3",
        "Text is split into units called…",
        ["tokens", "bytes", "neurons", "prompts"],
        0,
      ),
      question(
        "q4",
        "Hallucinations are…",
        ["confident but incorrect outputs", "neural network crashes", "prompt injection attacks", "model version mismatches"],
        0,
      ),
    ]),
  },
  {
    id: "llm-prompt-engineering",
    title: "Prompt Engineering for LLM Applications",
    description:
      "Craft reliable prompts, structured outputs, and evaluation harnesses for production AI products.",
    category: "ai",
    level: "intermediate",
    instructorId: "in-2",
    durationHours: 10,
    rating: 4.8,
    studentsCount: 15400,
    price: 109,
    originalPrice: 159,
    language: "English",
    tags: ["prompting", "llm", "rag"],
    imageUrl: "/courses/llm-prompt-engineering.svg",
    updatedAt: "2026-07-10",
    learningOutcomes: [
      "Design reliable system, user, and assistant prompts",
      "Use few-shot and chain-of-thought techniques",
      "Enforce structured outputs with schemas and function calling",
      "Build evaluation sets to regression-test prompts",
      "Defend applications against prompt injection",
    ],
    requirements: [
      "Familiarity with LLM APIs (e.g. OpenAI, Claude)",
      "Basic Python or JavaScript for making API calls",
    ],
    modules: [
      module("m1", "Prompting Fundamentals", [
        lesson("l1", "System, User, and Assistant Roles", 20),
        lesson("l2", "Few-Shot and Chain-of-Thought", 27),
        lesson("l3", "Constraints and Formatting", 23),
      ]),
      module("m2", "Reliable Outputs", [
        lesson("l4", "Structured Output with Schemas", 29),
        lesson("l5", "Function Calling", 26),
        lesson("l6", "Error Handling and Retries", 22),
      ]),
      module("m3", "Evaluation and Hardening", [
        lesson("l7", "Building an Eval Set", 28),
        lesson("l8", "Regression Testing Prompts", 24),
        lesson("l9", "Prompt Injection Defenses", 30),
      ]),
    ],
    quiz: quiz("llm-prompt-engineering", "quiz-prompt-eng", "Prompt Engineering Quiz", [
      question(
        "q1",
        "Few-shot prompting means…",
        ["providing examples in the prompt", "limiting tokens per request", "sending multiple requests", "using a small model"],
        0,
      ),
      question(
        "q2",
        "Structured output is best requested via…",
        ["a JSON schema or function spec", "plain text bullets", "emojis", "shouting in caps"],
        0,
      ),
      question(
        "q3",
        "What weakens a prompt injection attack?",
        ["separating and validating untrusted input", "longer prompts", "higher temperature", "cached responses"],
        0,
      ),
      question(
        "q4",
        "Temperature closer to 0 produces…",
        ["more deterministic output", "more random output", "faster responses", "longer responses"],
        0,
      ),
    ]),
  },
  {
    id: "python-for-data-science",
    title: "Python for Data Science",
    description:
      "Learn the essential Python toolkit for data work: pandas, NumPy, visualization, and clean analysis workflows.",
    category: "data-science",
    level: "beginner",
    instructorId: "in-3",
    durationHours: 12,
    rating: 4.7,
    studentsCount: 41200,
    price: 89,
    language: "English",
    tags: ["python", "pandas", "numpy"],
    imageUrl: "/courses/python-for-data-science.svg",
    updatedAt: "2026-05-22",
    learningOutcomes: [
      "Write clean Python for data analysis",
      "Manipulate data with pandas DataFrames",
      "Compute vectorized operations with NumPy",
      "Clean, reshape, and aggregate messy datasets",
      "Communicate findings with effective visualizations",
    ],
    requirements: [
      "No prior Python experience required",
      "A computer with Python installed (setup walkthrough included)",
    ],
    modules: [
      module("m1", "Python Fundamentals", [
        lesson("l1", "Data Types and Control Flow", 26),
        lesson("l2", "Functions and Comprehensions", 24),
        lesson("l3", "Working with Files", 18),
      ]),
      module("m2", "Data Wrangling", [
        lesson("l4", "NumPy Arrays", 28),
        lesson("l5", "Pandas DataFrames", 35),
        lesson("l6", "Cleaning and Reshaping", 30),
      ]),
      module("m3", "Analysis and Visualization", [
        lesson("l7", "Exploratory Data Analysis", 29),
        lesson("l8", "Visualization with Matplotlib", 25),
        lesson("l9", "Storytelling with Data", 22),
      ]),
    ],
    quiz: quiz("python-for-data-science", "quiz-python-ds", "Python for Data Science Quiz", [
      question(
        "q1",
        "Which library provides labeled 2D data structures?",
        ["pandas", "matplotlib", "requests", "flask"],
        0,
      ),
      question(
        "q2",
        "NumPy arrays are faster than Python lists because…",
        ["they store typed data in contiguous memory", "they ignore garbage collection", "they use the GPU", "they are smaller objects"],
        0,
      ),
      question(
        "q3",
        "What does df.isnull().sum() do?",
        ["Counts missing values per column", "Removes null rows", "Fills null values", "Ranks missing data"],
        0,
      ),
      question(
        "q4",
        "Which plot best shows a distribution of a single variable?",
        ["histogram", "scatter", "box pair", "network graph"],
        0,
      ),
    ]),
  },
  {
    id: "machine-learning-in-production",
    title: "Machine Learning in Production",
    description:
      "Take models from notebook to deployment: pipelines, monitoring, drift detection, and MLOps best practices.",
    category: "data-science",
    level: "advanced",
    instructorId: "in-3",
    durationHours: 16,
    rating: 4.8,
    studentsCount: 9800,
    price: 149,
    language: "English",
    tags: ["mlops", "deployment", "monitoring"],
    imageUrl: "/courses/machine-learning-in-production.svg",
    updatedAt: "2026-06-30",
    learningOutcomes: [
      "Move models from notebooks to containerized services",
      "Build reproducible feature and training pipelines",
      "Automate CI/CD and experimentation for ML",
      "Monitor models for data and concept drift",
      "Operate model registries and rollback strategies",
    ],
    requirements: [
      "Experience training ML models (scikit-learn, PyTorch, or similar)",
      "Comfort with Docker and basic cloud concepts",
    ],
    modules: [
      module("m1", "From Notebook to Service", [
        lesson("l1", "Feature Pipelines", 32),
        lesson("l2", "Model Packaging and Serving", 34),
        lesson("l3", "Containerizing ML Services", 28),
      ]),
      module("m2", "Operational Excellence", [
        lesson("l4", "CI/CD for ML", 30),
        lesson("l5", "Experimentation and Tracking", 26),
        lesson("l6", "Model Registry and Versioning", 24),
      ]),
      module("m3", "Reliability at Scale", [
        lesson("l7", "Monitoring and Alerting", 31),
        lesson("l8", "Data and Concept Drift", 29),
        lesson("l9", "Rollback and Retraining", 27),
      ]),
    ],
    quiz: quiz("machine-learning-in-production", "quiz-ml-prod", "ML in Production Quiz", [
      question(
        "q1",
        "Concept drift means…",
        ["the data distribution changed over time", "the model was retrained", "the server restarted", "labels were corrected"],
        0,
      ),
      question(
        "q2",
        "Which tool is commonly used for experiment tracking?",
        ["MLflow", "Terraform", "Kibana", "Grafana"],
        0,
      ),
      question(
        "q3",
        "Shadow deployment lets you…",
        ["run a new model alongside the current one without serving its output", "delete the old model", "skip monitoring", "double the training data"],
        0,
      ),
      question(
        "q4",
        "A model registry primarily stores…",
        ["versioned model artifacts and metadata", "training source code", "raw datasets", "inference logs"],
        0,
      ),
    ]),
  },
  {
    id: "cybersecurity-essentials",
    title: "Cyber Security Essentials",
    description:
      "Learn core security concepts — threats, cryptography, access control, and network defense — for any technical role.",
    category: "cyber-security",
    level: "beginner",
    instructorId: "in-4",
    durationHours: 9,
    rating: 4.8,
    studentsCount: 21800,
    price: 69,
    language: "English",
    tags: ["security", "network", "cryptography"],
    imageUrl: "/courses/cybersecurity-essentials.svg",
    updatedAt: "2026-04-18",
    learningOutcomes: [
      "Describe common threats, attacks, and vulnerabilities",
      "Apply authentication and access control models",
      "Understand core cryptography concepts",
      "Harden networks with layered defense",
      "Respond to security incidents",
    ],
    requirements: [
      "No prior security experience required",
      "Basic networking knowledge is helpful",
    ],
    modules: [
      module("m1", "Threat Landscape", [
        lesson("l1", "Attacks, Threats, and Vulnerabilities", 22),
        lesson("l2", "Social Engineering", 19),
        lesson("l3", "Malware Types", 21),
      ]),
      module("m2", "Defense in Depth", [
        lesson("l4", "Authentication and Access Control", 26),
        lesson("l5", "Cryptography Fundamentals", 30),
        lesson("l6", "Network Security Controls", 27),
      ]),
      module("m3", "Security Operations", [
        lesson("l7", "Logging and Monitoring", 24),
        lesson("l8", "Incident Response", 28),
        lesson("l9", "Security Policies and Compliance", 23),
      ]),
    ],
    quiz: quiz("cybersecurity-essentials", "quiz-cyber-essentials", "Cyber Security Essentials Quiz", [
      question(
        "q1",
        "Phishing is a form of…",
        ["social engineering", "SQL injection", "man-in-the-middle attack", "zero-day exploit"],
        0,
      ),
      question(
        "q2",
        "Encryption protects…",
        ["confidentiality", "availability", "compliance", "uptime"],
        0,
      ),
      question(
        "q3",
        "Multi-factor authentication adds…",
        ["an additional verification factor", "stronger passwords", "faster logins", "encrypted storage"],
        0,
      ),
      question(
        "q4",
        "A firewall primarily filters…",
        ["network traffic by rules", "malware signatures", "user permissions", "encryption keys"],
        0,
      ),
    ]),
  },
  {
    id: "ethical-hacking-pentesting",
    title: "Ethical Hacking & Penetration Testing",
    description:
      "Learn to think like an attacker. Reconnaissance, scanning, exploitation, and reporting — inside legal test environments.",
    category: "cyber-security",
    level: "intermediate",
    instructorId: "in-4",
    durationHours: 13,
    rating: 4.9,
    studentsCount: 12600,
    price: 139,
    originalPrice: 189,
    language: "English",
    tags: ["pentest", "kali", "owasp"],
    imageUrl: "/courses/ethical-hacking-pentesting.svg",
    updatedAt: "2026-07-05",
    learningOutcomes: [
      "Run a full penetration testing lifecycle",
      "Perform passive and active reconnaissance",
      "Exploit common web vulnerabilities (OWASP)",
      "Escalate privileges and move laterally",
      "Write professional penetration testing reports",
    ],
    requirements: [
      "Working knowledge of networking and Linux",
      "Basic scripting in Python or Bash",
      "Authorization to practice in the provided lab environments",
    ],
    modules: [
      module("m1", "Methodology and Reconnaissance", [
        lesson("l1", "Penetration Testing Lifecycle", 25),
        lesson("l2", "Passive and Active Recon", 30),
        lesson("l3", "Scope and Rules of Engagement", 22),
      ]),
      module("m2", "Scanning and Exploitation", [
        lesson("l4", "Vulnerability Scanning", 28),
        lesson("l5", "Web Application Exploits (OWASP)", 34),
        lesson("l6", "Network Exploitation", 31),
      ]),
      module("m3", "Post-Exploitation and Reporting", [
        lesson("l7", "Privilege Escalation", 27),
        lesson("l8", "Lateral Movement", 24),
        lesson("l9", "Writing Penetration Reports", 26),
      ]),
    ],
    quiz: quiz("ethical-hacking-pentesting", "quiz-pentest", "Penetration Testing Quiz", [
      question(
        "q1",
        "The first phase of a pentest is…",
        ["reconnaissance", "exploitation", "privilege escalation", "reporting"],
        0,
      ),
      question(
        "q2",
        "OWASP focuses primarily on…",
        ["web application security", "network cabling", "hardware security", "social media"],
        0,
      ),
      question(
        "q3",
        "A zero-day vulnerability is…",
        ["unknown to the vendor when exploited", "older than a day", "patched automatically", "only found in browsers"],
        0,
      ),
      question(
        "q4",
        "Which is legal ground for penetration testing?",
        ["explicit written authorization", "a public IP address", "a paid subscription", "an anonymous VPN"],
        0,
      ),
    ]),
  },
  {
    id: "ux-research-design-thinking",
    title: "UX Research & Design Thinking",
    description:
      "Empathize with users, frame problems, and validate solutions using qualitative and quantitative research.",
    category: "ui-ux",
    level: "beginner",
    instructorId: "in-5",
    durationHours: 10,
    rating: 4.8,
    studentsCount: 30100,
    price: 79,
    language: "English",
    tags: ["ux", "research", "design-thinking"],
    imageUrl: "/courses/ux-research-design-thinking.svg",
    updatedAt: "2026-06-02",
    learningOutcomes: [
      "Apply the double-diamond design process",
      "Plan and run user interviews and surveys",
      "Moderate usability tests and analyze results",
      "Map user journeys and frame problems",
      "Turn research insights into validated designs",
    ],
    requirements: [
      "No design experience required",
      "Curiosity about how people use products",
    ],
    modules: [
      module("m1", "Design Thinking Mindset", [
        lesson("l1", "The Double Diamond", 20),
        lesson("l2", "Empathy and User Personas", 26),
        lesson("l3", "Problem Framing", 22),
      ]),
      module("m2", "Research Methods", [
        lesson("l4", "Interviews and Surveys", 29),
        lesson("l5", "Usability Testing", 31),
        lesson("l6", "Heuristic Evaluation", 24),
      ]),
      module("m3", "From Insight to Design", [
        lesson("l7", "Journey Mapping", 27),
        lesson("l8", "Ideation and Prioritization", 25),
        lesson("l9", "Prototyping and Validation", 30),
      ]),
    ],
    quiz: quiz("ux-research-design-thinking", "quiz-ux-research", "UX Research & Design Thinking Quiz", [
      question(
        "q1",
        "The Double Diamond describes…",
        ["diverging and converging phases of design", "a gem-cutting technique", "two-factor analysis", "a data model"],
        0,
      ),
      question(
        "q2",
        "Usability testing measures…",
        ["how easily users complete tasks", "how many clicks a page gets", "server response time", "marketing reach"],
        0,
      ),
      question(
        "q3",
        "A persona represents…",
        ["a composite user archetype", "an actual employee", "a demographic survey", "a brand mascot"],
        0,
      ),
      question(
        "q4",
        "Heuristic evaluation is performed by…",
        ["experts reviewing against known principles", "random users testing", "automated bots", "the marketing team"],
        0,
      ),
    ]),
  },
  {
    id: "design-systems-with-figma",
    title: "Design Systems with Figma",
    description:
      "Create tokens, components, and documentation that keep teams aligned and ship faster in Figma.",
    category: "ui-ux",
    level: "intermediate",
    instructorId: "in-5",
    durationHours: 12,
    rating: 4.9,
    studentsCount: 17300,
    price: 109,
    originalPrice: 159,
    language: "English",
    tags: ["figma", "design-systems", "tokens"],
    imageUrl: "/courses/design-systems-with-figma.svg",
    updatedAt: "2026-07-22",
    learningOutcomes: [
      "Create and theme design tokens in Figma",
      "Build scalable component libraries with variants",
      "Apply auto layout for responsive, consistent spacing",
      "Document components for team adoption",
      "Govern and version design systems over time",
    ],
    requirements: [
      "Basic Figma proficiency (frames, layers, and styles)",
      "Understanding of component concepts",
    ],
    modules: [
      module("m1", "Design Token Foundations", [
        lesson("l1", "Color, Type, and Spacing Tokens", 26),
        lesson("l2", "Token Naming and Theming", 24),
        lesson("l3", "Light and Dark Modes", 22),
      ]),
      module("m2", "Component Libraries", [
        lesson("l4", "Variants and Properties", 30),
        lesson("l5", "Auto Layout Patterns", 28),
        lesson("l6", "Accessibility in Components", 25),
      ]),
      module("m3", "Governance and Adoption", [
        lesson("l7", "Documentation and Handoff", 27),
        lesson("l8", "Versioning and Change Logs", 21),
        lesson("l9", "Measuring System Health", 23),
      ]),
    ],
    quiz: quiz("design-systems-with-figma", "quiz-figma-ds", "Design Systems with Figma Quiz", [
      question(
        "q1",
        "Design tokens are…",
        ["named, reusable design decisions", "temporary layers", "keyboard shortcuts", "export presets"],
        0,
      ),
      question(
        "q2",
        "Figma variants let you…",
        ["combine related component states", "duplicate frames", "animate transitions", "share styles"],
        0,
      ),
      question(
        "q3",
        "Auto Layout is best for…",
        ["responsive, consistent spacing", "freehand drawing", "image masking", "chart generation"],
        0,
      ),
      question(
        "q4",
        "Contrast ratios matter most for…",
        ["accessibility", "file size", "layer count", "animation"],
        0,
      ),
    ]),
  },
  {
    id: "aws-cloud-practitioner",
    title: "AWS Cloud Practitioner",
    description:
      "Master cloud fundamentals, core AWS services, pricing, and security — and prepare for the CLF-C02 exam.",
    category: "cloud",
    level: "beginner",
    instructorId: "in-6",
    durationHours: 15,
    rating: 4.6,
    studentsCount: 45200,
    price: 99,
    originalPrice: 149,
    language: "English",
    tags: ["aws", "cloud", "certification"],
    imageUrl: "/courses/aws-cloud-practitioner.svg",
    updatedAt: "2026-05-30",
    learningOutcomes: [
      "Explain cloud computing models and pricing",
      "Navigate regions, Availability Zones, and edge locations",
      "Describe core AWS compute, storage, and network services",
      "Understand the shared responsibility model",
      "Prepare for the CLF-C02 certification exam",
    ],
    requirements: [
      "No cloud experience required",
      "Basic IT familiarity is helpful",
    ],
    modules: [
      module("m1", "Cloud Concepts", [
        lesson("l1", "Cloud Computing Models", 24),
        lesson("l2", "Regions, AZs, and Edge Locations", 28),
        lesson("l3", "Shared Responsibility Model", 25),
      ]),
      module("m2", "Core Services", [
        lesson("l4", "Compute: EC2 and Lambda", 32),
        lesson("l5", "Storage: S3 and EBS", 30),
        lesson("l6", "Networking: VPC and Route 53", 29),
      ]),
      module("m3", "Operations and Exam Prep", [
        lesson("l7", "Pricing and Billing", 26),
        lesson("l8", "Security and IAM", 31),
        lesson("l9", "Practice Exam Walkthrough", 34),
      ]),
    ],
    quiz: quiz("aws-cloud-practitioner", "quiz-aws-cp", "AWS Cloud Practitioner Quiz", [
      question(
        "q1",
        "Which is a global service?",
        ["IAM", "EC2", "S3", "RDS"],
        0,
      ),
      question(
        "q2",
        "The shared responsibility model means…",
        ["AWS secures the cloud, customers secure their content in the cloud", "AWS secures everything", "customers secure everything", "security is optional"],
        0,
      ),
      question(
        "q3",
        "A Region is…",
        ["a cluster of Availability Zones", "a single data center", "an edge location", "a VPC"],
        0,
      ),
      question(
        "q4",
        "Which service provides object storage?",
        ["S3", "EC2", "Lambda", "Route 53"],
        0,
      ),
    ]),
  },
  {
    id: "docker-kubernetes-azure",
    title: "Docker, Kubernetes & Azure",
    description:
      "Containerize applications and orchestrate production workloads on Azure with Kubernetes — end to end.",
    category: "cloud",
    level: "advanced",
    instructorId: "in-6",
    durationHours: 17,
    rating: 4.7,
    studentsCount: 11900,
    price: 149,
    originalPrice: 199,
    language: "English",
    tags: ["docker", "kubernetes", "azure"],
    imageUrl: "/courses/docker-kubernetes-azure.svg",
    updatedAt: "2026-07-19",
    learningOutcomes: [
      "Containerize applications with Docker multi-stage builds",
      "Orchestrate workloads with Kubernetes",
      "Manage configs and secrets with ConfigMaps and Secrets",
      "Provision and scale AKS clusters on Azure",
      "Monitor workloads and control cloud costs",
    ],
    requirements: [
      "Experience with a programming language",
      "Familiarity with the command line",
      "Basics of cloud computing",
    ],
    modules: [
      module("m1", "Containerization", [
        lesson("l1", "Docker Images and Layers", 28),
        lesson("l2", "Multi-Stage Builds", 26),
        lesson("l3", "Networking and Volumes", 30),
      ]),
      module("m2", "Kubernetes Core", [
        lesson("l4", "Pods, Deployments, and Services", 34),
        lesson("l5", "ConfigMaps and Secrets", 25),
        lesson("l6", "Scaling and Autoscaling", 29),
      ]),
      module("m3", "Azure Operations", [
        lesson("l7", "AKS Provisioning", 31),
        lesson("l8", "Ingress and TLS", 27),
        lesson("l9", "Monitoring and Cost Control", 26),
      ]),
    ],
    quiz: quiz("docker-kubernetes-azure", "quiz-docker-aks", "Docker, Kubernetes & Azure Quiz", [
      question(
        "q1",
        "A Kubernetes Pod is…",
        ["the smallest deployable unit", "a cluster of VMs", "a storage volume", "a service account"],
        0,
      ),
      question(
        "q2",
        "Which object exposes a stable network identity?",
        ["Service", "ConfigMap", "Deployment", "Namespace"],
        0,
      ),
      question(
        "q3",
        "Multi-stage builds help by…",
        ["reducing image size", "increasing parallelism", "removing security patches", "caching DNS"],
        0,
      ),
      question(
        "q4",
        "AKS is Azure's…",
        ["managed Kubernetes service", "virtual machine offering", "database engine", "load balancer"],
        0,
      ),
    ]),
  },
  {
    id: "javascript-fundamentals",
    title: "JavaScript Fundamentals: Zero to One",
    description:
      "A free, hands-on introduction to the language of the web — variables, functions, and the DOM.",
    category: "web-development",
    level: "beginner",
    instructorId: "in-1",
    durationHours: 4,
    rating: 4.5,
    studentsCount: 8700,
    price: 0,
    language: "English",
    tags: ["javascript", "web", "beginner"],
    imageUrl: "/courses/javascript-fundamentals.svg",
    updatedAt: "2026-08-10",
    learningOutcomes: [
      "Write JavaScript with confidence — variables, types, and operators",
      "Build reusable functions and understand scope",
      "Manipulate the DOM and respond to events",
      "Work with forms and handle user input",
    ],
    requirements: [
      "No programming experience required",
      "A web browser and a code editor",
    ],
    modules: [
      module("m1", "Core Language", [
        lesson("l1", "Variables, Types, and Operators", 20),
        lesson("l2", "Functions and Scope", 22),
      ]),
      module("m2", "Working with the DOM", [
        lesson("l3", "Selecting and Manipulating Elements", 25),
        lesson("l4", "Events and Forms", 23),
      ]),
    ],
  },
];

export function getCourseById(id: string): Course | undefined {
  return courses.find((course) => course.id === id);
}

export function getQuizById(id: string): Quiz | undefined {
  for (const course of courses) {
    if (course.quiz?.id === id) return course.quiz;
  }
  return undefined;
}

export function getQuizByCourseId(courseId: string): Quiz | undefined {
  const course = courses.find((c) => c.id === courseId);
  return course?.quiz;
}

export function getCourseByQuizId(id: string): Course | undefined {
  return courses.find((course) => course.quiz?.id === id);
}

export function getCourseBySlugPlaceholder(): Course | undefined {
  return courses[0];
}

export function getCoursesByCategory(category: string): Course[] {
  if (!category) return courses;
  return courses.filter((course) => course.category === category);
}

export function searchCourses(query: string): Course[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return courses;
  return courses.filter((course) => {
    const instructor = getInstructorById(course.instructorId);
    return [
      course.title,
      course.description,
      instructor?.name ?? "",
      course.category,
      ...course.tags,
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalized);
  });
}

export function getTotalLessons(course: Course): number {
  return course.modules.reduce(
    (total, module) => total + module.lessons.length,
    0,
  );
}

export function getTotalDurationMinutes(course: Course): number {
  return course.modules.reduce(
    (total, module) =>
      total +
      module.lessons.reduce(
        (sum, lesson) => sum + lesson.durationMinutes,
        0,
      ),
    0,
  );
}

export function getCourseRating(course: Course): string {
  return course.rating.toFixed(1);
}

export function getRelatedCourses(course: Course, limit = 3): Course[] {
  const sameCategory = courses.filter(
    (item) => item.id !== course.id && item.category === course.category,
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  const others = courses
    .filter((item) => item.id !== course.id && item.category !== course.category)
    .sort((a, b) => b.rating - a.rating);

  return [...sameCategory, ...others].slice(0, limit);
}

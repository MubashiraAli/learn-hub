export type UserRole = "USER" | "ADMIN";

export type CourseLevel = "beginner" | "intermediate" | "advanced";

export type CourseCategory =
  | "web-development"
  | "ai"
  | "data-science"
  | "cyber-security"
  | "ui-ux"
  | "cloud";

export type LessonType = "video" | "article" | "exercise";

export type LessonResourceKind = "pdf" | "code" | "link";

export interface LessonResource {
  id: string;
  title: string;
  url: string;
  kind: LessonResourceKind;
}

export interface Instructor {
  id: string;
  name: string;
  title: string;
  bio: string;
  category: CourseCategory;
  rating: number;
  studentsCount: number;
  coursesCount: number;
}

export interface LessonContentBlock {
  type: "heading" | "paragraph" | "list" | "callout" | "diagram" | "table" | "quiz";
  text?: string;
  items?: string[];
  variant?: "info" | "tip" | "warning";
  diagramId?: string;
  columns?: string[];
  rows?: string[][];
  questions?: QuizQuestion[];
}

export type LessonContent = LessonContentBlock[];

export interface Lesson {
  id: string;
  title: string;
  durationMinutes: number;
  type: LessonType;
  description: string;
  resources: LessonResource[];
  content?: LessonContent;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  passScore: number;
  questions: QuizQuestion[];
}

export interface QuizResult {
  courseId: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  completedAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  level: CourseLevel;
  instructorId: string;
  durationHours: number;
  rating: number;
  studentsCount: number;
  price: number;
  originalPrice?: number;
  language: string;
  tags: string[];
  learningOutcomes: string[];
  requirements: string[];
  imageUrl?: string;
  updatedAt: string;
  modules: Module[];
  quiz?: Quiz;
}

export interface Review {
  id: string;
  courseId: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Enrollment {
  courseId: string;
  progress: number;
  startedAt: string;
  completedAt?: string;
}

export interface Certificate {
  id: string;
  courseId: string;
  issuedAt: string;
  score: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  enrolledCourseIds: string[];
  memberSince: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  bio?: string;
  skills?: string[];
  avatarUrl?: string;
  title?: string;
}

export type StoredUser = User & { password: string };

export type Profile = User;

export interface CourseProgress {
  courseId: string;
  completedLessonIds: string[];
  currentLessonId: string;
  progress: number;
  lastAccessedAt: string;
}

export interface LearningProgress {
  lastCourseId: string | null;
  courses: Record<string, CourseProgress>;
}

export interface UserCertificates {
  certificates: Certificate[];
}

/* ---------------------------------------------------------------
   Lesson video scripts
   A timed, scene-by-scene specification for a lesson video: narration,
   on-screen text, visual direction and diagram data. Authored as JSON so
   it can be rendered to MP4 by an external pipeline and read by the app.
   --------------------------------------------------------------- */

export interface SceneKeyTerm {
  term: string;
  definition: string;
}

export interface SceneOnScreen {
  heading?: string;
  subheading?: string;
  callout?: string;
  bullets?: string[];
  keyTerm?: SceneKeyTerm;
}

export interface ResponsibilityStackColumn {
  key: "onprem" | "iaas" | "paas" | "saas";
  label: string;
  headerColor: string;
  customerManaged: string[];
  providerManaged: string[];
  customerLayerCount?: number;
  customerFocus?: string;
}

export interface ResponsibilityStackDiagram {
  type: "responsibility-stack";
  activeColumns: string[];
  columns: ResponsibilityStackColumn[];
  layerOrderTopToBottom?: string[];
  note?: string;
}

export interface ComparisonTableRow {
  model: string;
  color: string;
  control: string;
  management: string;
}

export interface ComparisonTableDiagram {
  type: "comparison-table";
  columns: string[];
  rows: ComparisonTableRow[];
  note?: string;
}

export type SceneDiagram = ResponsibilityStackDiagram | ComparisonTableDiagram;

export type SceneQuizPhase = "read" | "think" | "reveal";

export interface SceneQuiz {
  questionId: string;
  phase: SceneQuizPhase;
  question?: string;
  options?: string[];
  correctIndex?: number;
  explanation?: string;
}

export interface VideoScene {
  id: string;
  startSeconds: number;
  durationSeconds: number;
  /** Voice-over for this scene. Empty string means a deliberate silent beat. */
  narration: string;
  onScreen: SceneOnScreen;
  visual: string;
  animation: string;
  diagram?: SceneDiagram;
  quiz?: SceneQuiz;
}

export interface VideoScriptSection {
  number: number;
  title: string;
  startSeconds: number;
  durationSeconds: number;
  scenes: VideoScene[];
  note?: string;
}

export interface VideoRenderSpec {
  resolution: string;
  fps: number;
  aspectRatio: string;
  safeAreaPaddingPx: number;
  backgroundMusic: string;
  theme: {
    name: string;
    colors: Record<string, string>;
    fonts: Record<string, string>;
    motion: Record<string, string>;
  };
  voiceOver: {
    style: string;
    pace: string;
    direction: string[];
    pronunciation: Record<string, string>;
  };
  captions: {
    required: boolean;
    format: string;
    source: string;
  };
}

export interface LessonVideoScript {
  id: string;
  courseId: string;
  moduleId: string;
  moduleTitle: string;
  lessonId: string;
  lessonTitle: string;
  subtitle: string;
  audience: string;
  totalDurationSeconds: number;
  renderSpec: VideoRenderSpec;
  sections: VideoScriptSection[];
}

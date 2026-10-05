// src/data/aboutData.ts
// Static data for the About page.

export interface Feature {
  id: string;
  emoji?: string;
  title: string;
  description: string;
}

export interface Technology {
  id: string;
  name: string;
  tag?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role?: string;
  email?: string;
}

export const PAGE_META = {
  title: "TriviaHub",
  subtitle: "Stage 2 Quiz Creation and Playing Platform",
};

export const FEATURES: Feature[] = [
  {
    id: "f1",
    emoji: "✍️",
    title: "Manage Quizzes and Questions",
    description:
      "Administrators can create, update, and delete quizzes and questions through the Admin Panel with backend persistence.",
  },
  {
    id: "f2",
    emoji: "▶️",
    title: "Play Quizzes",
    description:
      "Players can load quiz questions from the backend, use hints, and complete timed quiz sessions.",
  },
  {
    id: "f3",
    emoji: "📊",
    title: "View Results & Leaderboard",
    description:
      "Results are saved in the backend and appear on the global leaderboard and quiz-specific results pages.",
  },
];

export const TECHNOLOGIES: Technology[] = [
  { id: "t1", name: "React + TypeScript", tag: "Type-safe UI" },
  { id: "t2", name: "Spring Boot", tag: "REST Backend" },
  { id: "t3", name: "Java 25", tag: "Runtime" },
  { id: "t4", name: "ObjectOutputStream", tag: "Serialized persistence" },
  { id: "t5", name: "Vite", tag: "Fast dev & build" },
  { id: "t6", name: "Bootstrap 5", tag: "Responsive CSS" },
];

export const TEAM: TeamMember[] = [
  { id: "m1", name: "Nour Salah", role: "Full-Stack Developer", email: "noor@example.com" },
  { id: "m2", name: "Amer Abu Sair", role: "Full-Stack Developer", email: "amer@example.com" },
];

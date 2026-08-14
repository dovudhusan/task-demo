export type RoleId =
  | "frontend"
  | "backend"
  | "fullstack"
  | "devops"
  | "product";

export type Scores = Record<RoleId, number>;

export type AnswerOption = {
  id: string;
  label: string;
  scores: Partial<Scores>;
};

export type Question = {
  id: string;
  text: string;
  hint: string;
  options: AnswerOption[];
};

export type RoleResult = {
  id: RoleId;
  title: string;
  tagline: string;
  description: string;
  strengths: string[];
  nextSteps: string[];
  color: string;
};

export const ROLES: Record<RoleId, RoleResult> = {
  frontend: {
    id: "frontend",
    title: "Frontend Developer",
    tagline: "You turn ideas into interfaces people love.",
    description:
      "You care about polish, interaction, and how a product feels in someone's hands. Pixel-level details and smooth UX energize you more than raw infrastructure.",
    strengths: [
      "Visual taste and interaction design sense",
      "Comfort with UI state and component thinking",
      "Obsession with mobile and accessibility details",
    ],
    nextSteps: [
      "Ship a small design-system of reusable components",
      "Practice performance: lazy loading, Core Web Vitals",
      "Learn one animation library deeply (Motion / CSS)",
    ],
    color: "#1f4e79",
  },
  backend: {
    id: "backend",
    title: "Backend Developer",
    tagline: "You build the engines that make products reliable.",
    description:
      "You enjoy data models, APIs, and systems that stay correct under pressure. Clear contracts and solid business logic matter more to you than visual polish.",
    strengths: [
      "Structured problem-solving and data modeling",
      "Interest in APIs, auth, and persistence",
      "Comfort thinking about edge cases and reliability",
    ],
    nextSteps: [
      "Design a REST/GraphQL API with proper validation",
      "Add auth, rate limiting, and structured logging",
      "Learn one database deeply (indexes, transactions)",
    ],
    color: "#5c3d2e",
  },
  fullstack: {
    id: "fullstack",
    title: "Full-Stack Developer",
    tagline: "You connect the dots from button click to database.",
    description:
      "You like owning features end-to-end. Shipping something complete — UI, API, and storage — feels more satisfying than specializing in one layer.",
    strengths: [
      "End-to-end ownership mindset",
      "Balance between product feel and system design",
      "Fast at turning vague ideas into working flows",
    ],
    nextSteps: [
      "Build one vertical feature with tests on both sides",
      "Practice API contracts shared by UI and server",
      "Learn deployment and observability basics",
    ],
    color: "#2f5d50",
  },
  devops: {
    id: "devops",
    title: "DevOps / Cloud Engineer",
    tagline: "You make shipping safe, repeatable, and fast.",
    description:
      "You get energy from pipelines, environments, and reliability. Automating the boring parts so teams can ship with confidence is your kind of craft.",
    strengths: [
      "Systems thinking and automation instinct",
      "Care about reliability, monitoring, and recovery",
      "Comfort with tooling, scripts, and infrastructure",
    ],
    nextSteps: [
      "Write a CI pipeline that runs tests and deploys",
      "Containerize an app and deploy to a cloud provider",
      "Add health checks, alerts, and rollback strategy",
    ],
    color: "#c23b22",
  },
  product: {
    id: "product",
    title: "Product-Minded Engineer",
    tagline: "You build what users actually need — not just what was asked.",
    description:
      "You naturally ask why before how. You connect technical choices to user outcomes, and you enjoy shaping scope so the right thing ships.",
    strengths: [
      "User empathy and prioritization",
      "Clear communication of trade-offs",
      "Ability to simplify complex problems",
    ],
    nextSteps: [
      "Interview 3 users and rewrite a feature brief",
      "Ship an MVP with analytics on key actions",
      "Practice writing crisp PRDs / acceptance criteria",
    ],
    color: "#6b3fa0",
  },
};

export const QUESTIONS: Question[] = [
  {
    id: "energy",
    text: "What kind of work gives you energy at the end of the day?",
    hint: "Pick the option that feels most like you — not the “correct” one.",
    options: [
      {
        id: "ui",
        label: "Crafting a screen that feels smooth and intentional",
        scores: { frontend: 3, fullstack: 1, product: 1 },
      },
      {
        id: "api",
        label: "Designing a clean API and solid data model",
        scores: { backend: 3, fullstack: 1 },
      },
      {
        id: "ship",
        label: "Wiring UI + API + deploy so a feature actually ships",
        scores: { fullstack: 3, devops: 1, product: 1 },
      },
      {
        id: "automate",
        label: "Automating builds, deploys, and monitoring",
        scores: { devops: 3, backend: 1 },
      },
    ],
  },
  {
    id: "bug",
    text: "A production bug hits. Where do you naturally dig first?",
    hint: "Your first instinct says a lot about your strengths.",
    options: [
      {
        id: "browser",
        label: "Reproduce it in the browser and inspect the UI state",
        scores: { frontend: 3, fullstack: 1 },
      },
      {
        id: "logs",
        label: "Check server logs, status codes, and database rows",
        scores: { backend: 3, devops: 1 },
      },
      {
        id: "pipeline",
        label: "Look at recent deploys, configs, and environment diffs",
        scores: { devops: 3, backend: 1 },
      },
      {
        id: "user",
        label: "Talk to the user / support and clarify the real impact",
        scores: { product: 3, fullstack: 1 },
      },
    ],
  },
  {
    id: "weekend",
    text: "You have a free weekend project. What do you build?",
    hint: "No portfolio pressure — just curiosity.",
    options: [
      {
        id: "landing",
        label: "A beautiful interactive landing page or mini design system",
        scores: { frontend: 3, product: 1 },
      },
      {
        id: "service",
        label: "A small service with auth, validation, and a database",
        scores: { backend: 3, fullstack: 1 },
      },
      {
        id: "app",
        label: "A full mini-app: signup → dashboard → save data",
        scores: { fullstack: 3, product: 1 },
      },
      {
        id: "infra",
        label: "A CI/CD template that deploys any Node app in one click",
        scores: { devops: 3, fullstack: 1 },
      },
    ],
  },
  {
    id: "team",
    text: "On a team, which compliment would make you proudest?",
    hint: "Imagine a teammate saying this about your work.",
    options: [
      {
        id: "delight",
        label: "“People love how this interface feels.”",
        scores: { frontend: 3, product: 2 },
      },
      {
        id: "solid",
        label: "“The backend never surprises us — it’s rock solid.”",
        scores: { backend: 3, devops: 1 },
      },
      {
        id: "owner",
        label: "“You owned the whole feature and unblocked everyone.”",
        scores: { fullstack: 3, product: 1 },
      },
      {
        id: "reliable",
        label: "“Deploys are boring now — in a good way.”",
        scores: { devops: 3, backend: 1 },
      },
    ],
  },
  {
    id: "tradeoff",
    text: "You must cut scope. What do you protect first?",
    hint: "When time is short, what still has to be excellent?",
    options: [
      {
        id: "ux",
        label: "Core user flow clarity and mobile usability",
        scores: { frontend: 2, product: 3 },
      },
      {
        id: "correctness",
        label: "Data integrity, validation, and error handling",
        scores: { backend: 3, fullstack: 1 },
      },
      {
        id: "mvp",
        label: "A thin but complete path from UI to saved result",
        scores: { fullstack: 3, product: 2 },
      },
      {
        id: "rollback",
        label: "Safe deploy, monitoring, and an easy rollback",
        scores: { devops: 3, backend: 1 },
      },
    ],
  },
];

export function emptyScores(): Scores {
  return {
    frontend: 0,
    backend: 0,
    fullstack: 0,
    devops: 0,
    product: 0,
  };
}

export function scoreAnswers(answers: Record<string, string>): {
  scores: Scores;
  winner: RoleResult;
  ranking: Array<{ role: RoleResult; score: number; percent: number }>;
} {
  const scores = emptyScores();

  for (const question of QUESTIONS) {
    const answerId = answers[question.id];
    const option = question.options.find((o) => o.id === answerId);
    if (!option) continue;
    for (const [role, value] of Object.entries(option.scores) as Array<
      [RoleId, number]
    >) {
      scores[role] += value;
    }
  }

  const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const ranking = (Object.keys(scores) as RoleId[])
    .map((id) => ({
      role: ROLES[id],
      score: scores[id],
      percent: Math.round((scores[id] / total) * 100),
    }))
    .sort((a, b) => b.score - a.score);

  return {
    scores,
    winner: ranking[0].role,
    ranking,
  };
}

export function isCompleteAnswers(
  answers: Record<string, string>
): answers is Record<string, string> {
  return QUESTIONS.every((q) => typeof answers[q.id] === "string");
}

import { promises as fs } from "fs";
import path from "path";
import type { RoleId, Scores } from "./quiz";

export type Submission = {
  id: string;
  createdAt: string;
  answers: Record<string, string>;
  scores: Scores;
  resultRole: RoleId;
  resultTitle: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "submissions.json");
const TMP_FILE = path.join("/tmp", "rolefit-submissions.json");

function storagePath(): string {
  // On Vercel the project filesystem is read-only except /tmp
  return process.env.VERCEL ? TMP_FILE : DATA_FILE;
}

async function ensureFile(filePath: string): Promise<void> {
  try {
    await fs.access(filePath);
  } catch {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, "[]", "utf8");
  }
}

export async function readSubmissions(): Promise<Submission[]> {
  const filePath = storagePath();
  await ensureFile(filePath);
  const raw = await fs.readFile(filePath, "utf8");
  try {
    const parsed = JSON.parse(raw) as Submission[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveSubmission(
  input: Omit<Submission, "id" | "createdAt">
): Promise<Submission> {
  const filePath = storagePath();
  await ensureFile(filePath);
  const existing = await readSubmissions();
  const submission: Submission = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...input,
  };
  existing.unshift(submission);
  // Keep the file bounded for this demo app
  const trimmed = existing.slice(0, 200);
  await fs.writeFile(filePath, JSON.stringify(trimmed, null, 2), "utf8");
  return submission;
}

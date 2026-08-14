import { NextResponse } from "next/server";
import { z } from "zod";
import { QUESTIONS, ROLES, scoreAnswers, type RoleId } from "@/lib/quiz";
import { readSubmissions, saveSubmission } from "@/lib/store";

const bodySchema = z.object({
  answers: z.record(z.string(), z.string()),
});

export async function GET() {
  const submissions = await readSubmissions();
  return NextResponse.json({
    count: submissions.length,
    submissions: submissions.slice(0, 20),
  });
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { answers } = parsed.data;
  const missing = QUESTIONS.filter((q) => !answers[q.id]);
  if (missing.length > 0) {
    return NextResponse.json(
      { error: "Please answer all 5 questions", missing: missing.map((q) => q.id) },
      { status: 400 }
    );
  }

  const validIds = new Set(QUESTIONS.flatMap((q) => q.options.map((o) => o.id)));
  for (const question of QUESTIONS) {
    if (!validIds.has(answers[question.id])) {
      return NextResponse.json(
        { error: `Invalid answer for ${question.id}` },
        { status: 400 }
      );
    }
  }

  const { scores, winner } = scoreAnswers(answers);
  const submission = await saveSubmission({
    answers,
    scores,
    resultRole: winner.id as RoleId,
    resultTitle: winner.title,
  });

  return NextResponse.json({
    submission,
    winner: ROLES[winner.id],
    scores,
  });
}

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  QUESTIONS,
  scoreAnswers,
  type RoleResult,
  type Scores,
} from "@/lib/quiz";

type Phase = "intro" | "quiz" | "result";

type SavedLocal = {
  id: string;
  createdAt: string;
  resultRole: string;
  resultTitle: string;
};

const LOCAL_KEY = "rolefit-history";
const LETTERS = ["A", "B", "C", "D"] as const;

export function QuizApp() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [winner, setWinner] = useState<RoleResult | null>(null);
  const [scores, setScores] = useState<Scores | null>(null);
  const [history, setHistory] = useState<SavedLocal[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) setHistory(JSON.parse(raw) as SavedLocal[]);
    } catch {
      // ignore
    }
  }, []);

  const question = QUESTIONS[step];
  const progress = useMemo(
    () => Math.round((Object.keys(answers).length / QUESTIONS.length) * 100),
    [answers]
  );

  function selectOption(optionId: string) {
    if (!question) return;
    setAnswers((prev) => ({ ...prev, [question.id]: optionId }));
  }

  function goNext() {
    if (!question || !answers[question.id]) return;
    if (step < QUESTIONS.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    void submit();
  }

  function goBack() {
    if (step === 0) {
      setPhase("intro");
      return;
    }
    setStep((s) => s - 1);
  }

  async function submit() {
    setSaving(true);
    setError(null);
    const local = scoreAnswers(answers);
    setWinner(local.winner);
    setScores(local.scores);

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save");
      }

      const entry: SavedLocal = {
        id: data.submission.id,
        createdAt: data.submission.createdAt,
        resultRole: data.submission.resultRole,
        resultTitle: data.submission.resultTitle,
      };
      const nextHistory = [entry, ...history].slice(0, 10);
      setHistory(nextHistory);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(nextHistory));
      setPhase("result");
    } catch (e) {
      const entry: SavedLocal = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        resultRole: local.winner.id,
        resultTitle: local.winner.title,
      };
      const nextHistory = [entry, ...history].slice(0, 10);
      setHistory(nextHistory);
      try {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(nextHistory));
      } catch {
        // ignore
      }
      setError(
        e instanceof Error
          ? `${e.message} — result still scored locally and filed in this browser.`
          : "Filed locally in this browser."
      );
      setPhase("result");
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    setPhase("intro");
    setStep(0);
    setAnswers({});
    setWinner(null);
    setScores(null);
    setError(null);
  }

  if (phase === "intro") {
    return (
      <section className="space-y-8">
        <div className="anim-rise exam-sheet relative overflow-hidden p-6 sm:p-8">
          <div className="absolute right-4 top-4 stamp anim-stamp text-[11px] sm:text-xs">
            Unscored
          </div>

          <p
            className="anim-rise type-mono text-[11px] uppercase tracking-[0.2em] text-stamp"
            style={{ animationDelay: "60ms" }}
          >
            Vocational aptitude · 5 items
          </p>

          <h2
            className="anim-rise mt-4 max-w-[14ch] font-display text-[clamp(2.6rem,10vw,4.4rem)] font-extrabold uppercase leading-[0.9] tracking-tight text-ink"
            style={{ animationDelay: "120ms" }}
          >
            Which tech role fits you?
          </h2>

          <p
            className="anim-rise mt-5 max-w-prose text-[1.05rem] leading-relaxed text-ink-soft"
            style={{ animationDelay: "200ms" }}
          >
            Mark one answer per question. A written scoring key — not a model —
            tallies your marks into Frontend, Backend, Full-Stack, DevOps, or
            Product-minded engineering. Your sheet is filed when you finish.
          </p>

          <dl
            className="anim-rise mt-8 grid gap-4 border-t border-rule pt-5 type-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint sm:grid-cols-3"
            style={{ animationDelay: "280ms" }}
          >
            <div>
              <dt className="text-ink">Duration</dt>
              <dd className="mt-1 normal-case tracking-normal text-ink-soft">
                ~2 minutes
              </dd>
            </div>
            <div>
              <dt className="text-ink">Method</dt>
              <dd className="mt-1 normal-case tracking-normal text-ink-soft">
                Point rules
              </dd>
            </div>
            <div>
              <dt className="text-ink">Retention</dt>
              <dd className="mt-1 normal-case tracking-normal text-ink-soft">
                API + browser
              </dd>
            </div>
          </dl>
        </div>

        <button
          type="button"
          onClick={() => setPhase("quiz")}
          className="anim-rise w-full bg-ink px-5 py-4 font-display text-xl font-bold uppercase tracking-wide text-paper transition hover:bg-stamp"
          style={{ animationDelay: "360ms" }}
        >
          Begin examination
        </button>

        {history.length > 0 && (
          <div className="anim-rise border-t border-dashed border-rule pt-5" style={{ animationDelay: "420ms" }}>
            <p className="type-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
              Prior filings on this device
            </p>
            <ul className="mt-3 space-y-2">
              {history.slice(0, 3).map((item) => (
                <li
                  key={item.id}
                  className="flex items-baseline justify-between gap-3 border-b border-rule/60 pb-2 text-sm text-ink-soft"
                >
                  <span className="font-medium text-ink">{item.resultTitle}</span>
                  <span className="shrink-0 type-mono text-[11px] text-ink-faint">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    );
  }

  if (phase === "result" && winner && scores) {
    const ranking = scoreAnswers(answers).ranking;
    return (
      <section className="space-y-6">
        <div className="exam-sheet relative p-6 sm:p-8">
          <div className="stamp anim-stamp absolute right-3 top-5 text-[10px] sm:right-5 sm:text-xs">
            Classified
          </div>

          <p className="anim-rise type-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
            Result sheet · RF-05
          </p>

          <h2
            className="anim-rise mt-3 max-w-[16ch] font-display text-[clamp(2.4rem,9vw,3.8rem)] font-extrabold uppercase leading-[0.92] tracking-tight"
            style={{ color: winner.color, animationDelay: "80ms" }}
          >
            {winner.title}
          </h2>

          <p
            className="anim-rise mt-4 text-lg italic leading-snug text-ink-soft"
            style={{ animationDelay: "140ms" }}
          >
            {winner.tagline}
          </p>

          <p
            className="anim-rise mt-4 max-w-prose leading-relaxed text-ink-soft"
            style={{ animationDelay: "200ms" }}
          >
            {winner.description}
          </p>
        </div>

        <div className="anim-rise exam-sheet p-5 sm:p-6" style={{ animationDelay: "240ms" }}>
          <p className="type-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
            Score ledger
          </p>
          <div className="mt-4 space-y-4">
            {ranking.map(({ role, percent, score }, i) => (
              <div key={role.id}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-medium text-ink">{role.title}</span>
                  <span className="type-mono text-[11px] text-ink-faint">
                    {score} pts · {percent}%
                  </span>
                </div>
                <div className="h-[6px] bg-paper-deep">
                  <div
                    className="anim-bar h-full"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: role.color,
                      animationDelay: `${280 + i * 70}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="anim-rise border border-rule bg-paper-deep/40 p-5" style={{ animationDelay: "320ms" }}>
            <p className="type-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
              Observed strengths
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-soft">
              {winner.strengths.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mark" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="anim-rise border border-rule bg-paper-deep/40 p-5" style={{ animationDelay: "380ms" }}>
            <p className="type-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
              Recommended drills
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-soft">
              {winner.nextSteps.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-stamp" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {error ? (
          <p className="border border-stamp/40 bg-[#c23b22]/08 px-4 py-3 text-sm text-stamp-ink">
            {error}
          </p>
        ) : (
          <p className="type-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
            Sheet filed via API · copy retained on device
          </p>
        )}

        <button
          type="button"
          onClick={reset}
          className="w-full border-2 border-ink bg-transparent px-5 py-3.5 font-display text-lg font-bold uppercase tracking-wide text-ink transition hover:bg-ink hover:text-paper sm:w-auto"
        >
          Retake form
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4 border-b border-rule pb-3">
        <div>
          <p className="type-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
            Item {String(step + 1).padStart(2, "0")} / {String(QUESTIONS.length).padStart(2, "0")}
          </p>
          <div className="mt-2 h-1 w-40 max-w-full bg-paper-deep">
            <div
              className="h-full bg-stamp transition-[width] duration-300"
              style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>
        <p className="type-mono text-[11px] text-ink-faint">
          {progress}% marked
        </p>
      </div>

      <div key={question.id} className="anim-rise exam-sheet p-5 sm:p-7">
        <h2 className="font-display text-[clamp(1.7rem,5.5vw,2.35rem)] font-bold uppercase leading-[1.05] tracking-tight text-ink">
          {question.text}
        </h2>
        <p className="mt-3 text-sm italic text-ink-faint">{question.hint}</p>

        <div className="mt-6 space-y-2.5" role="radiogroup" aria-label={question.text}>
          {question.options.map((option, index) => {
            const selected = answers[question.id] === option.id;
            const letter = LETTERS[index] ?? "?";
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => selectOption(option.id)}
                className={`flex w-full items-start gap-3 border px-3 py-3.5 text-left transition sm:gap-4 sm:px-4 ${
                  selected
                    ? "border-ink bg-ink text-paper"
                    : "border-rule bg-transparent text-ink-soft hover:border-ink/40 hover:bg-paper-deep/50"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border type-mono text-xs font-medium ${
                    selected
                      ? "border-paper text-paper"
                      : "border-ink/30 text-ink"
                  }`}
                >
                  {letter}
                </span>
                <span className="pt-0.5 text-[0.98rem] leading-snug">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={goBack}
          className="border border-rule px-5 py-3 type-mono text-xs uppercase tracking-[0.16em] text-ink-soft transition hover:border-ink hover:text-ink"
        >
          Back
        </button>
        <button
          type="button"
          disabled={!answers[question.id] || saving}
          onClick={goNext}
          className="bg-stamp px-5 py-3.5 font-display text-lg font-bold uppercase tracking-wide text-paper transition hover:bg-stamp-ink disabled:cursor-not-allowed disabled:opacity-35"
        >
          {saving
            ? "Filing…"
            : step === QUESTIONS.length - 1
              ? "Submit sheet"
              : "Next item"}
        </button>
      </div>
    </section>
  );
}

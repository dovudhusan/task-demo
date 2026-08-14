import { QuizApp } from "@/components/QuizApp";

export default function Home() {
  return (
    <div className="exam-shell">
      <div className="mx-auto flex min-h-dvh w-full max-w-[720px] flex-col px-4 py-6 sm:px-6 sm:py-10">
        <header className="anim-rise mb-8 flex items-end justify-between gap-4 border-b-2 border-ink pb-3">
          <div>
            <p className="type-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
              Form RF-05 · Series B
            </p>
            <h1 className="mt-1 font-display text-3xl font-extrabold uppercase leading-none tracking-tight text-ink sm:text-4xl">
              RoleFit
            </h1>
          </div>
          <p className="max-w-[9rem] text-right type-mono text-[10px] leading-snug uppercase tracking-wider text-ink-faint">
            Keep within the lines. One mark per item.
          </p>
        </header>

        <QuizApp />

        <footer className="mt-auto border-t border-rule pt-6 text-center type-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
          Scored by written rules · answers retained
        </footer>
      </div>
    </div>
  );
}

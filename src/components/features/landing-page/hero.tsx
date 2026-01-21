export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          
          {/* TEXT */}
          <div>
            <span className="inline-flex items-center rounded-full bg-sky-400/10 px-4 py-1 text-sm font-medium text-sky-400">
              Task & Project Management
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                One workspace to manage
                <span className="block text-sky-400">
                    projects, tasks & teams
                </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-slate-300">
              <strong>TaskMan</strong> helps teams plan, organize, and track their work
              with clarity. Manage projects, tasks, subtasks, and collaboration
              in one unified workspace.
            </p>

            {/* CTA */}
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="/login"
                className="rounded-lg bg-sky-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-sky-400"
              >
                Get Started
              </a>
            </div>
          </div>

          {/* VISUAL / PREVIEW */}
          <div className="relative">
            <div className="rounded-2xl border border-slate-700 bg-slate-800/70 p-6 shadow-2xl backdrop-blur">
              <div className="space-y-4">
                <div className="h-4 w-1/3 rounded bg-slate-600" />
                <div className="h-3 w-full rounded bg-slate-700" />
                <div className="h-3 w-5/6 rounded bg-slate-700" />
                <div className="h-3 w-2/3 rounded bg-slate-700" />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-sky-500/20 p-4 text-sm">
                  ✔ Tasks & Subtasks
                </div>
                <div className="rounded-lg bg-sky-500/20 p-4 text-sm">
                  👥 Team Roles
                </div>
                <div className="rounded-lg bg-sky-500/20 p-4 text-sm">
                  💬 Comments
                </div>
                <div className="rounded-lg bg-sky-500/20 p-4 text-sm">
                  📊 Progress Tracking
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default function HowItWorks() {
  return (
    <section className="bg-slate-200 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-3xl font-bold text-slate-900">
          How TaskMan works
        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[
            "Create projects",
            "Define tasks",
            "Assign roles",
            "Track progress",
          ].map((title, i) => (
            <div
              key={i}
              className="rounded-xl bg-white p-6 border border-slate-200 shadow-sm"
            >
              <span className="text-sky-600 text-sm font-semibold">
                Step {i + 1}
              </span>
              <h3 className="mt-3 font-semibold text-slate-900">
                {title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Structured workflows keep your team aligned and productive.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

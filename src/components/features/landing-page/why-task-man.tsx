export default function WhyTaskMan() {
  return (
    <section className="bg-slate-800 py-24 text-white">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h2 className="text-3xl font-bold">
          Why teams choose TaskMan
        </h2>

        <p className="mt-6 max-w-2xl mx-auto text-slate-300">
          TaskMan is designed for small to medium-sized teams that need structure,
          visibility, and seamless collaboration without unnecessary complexity.
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="rounded-xl bg-slate-900 p-6 border border-slate-700">
            🔍 <h3 className="mt-4 font-semibold">Full visibility</h3>
            <p className="mt-2 text-sm text-slate-400">
              Track every task from creation to completion.
            </p>
          </div>

          <div className="rounded-xl bg-slate-900 p-6 border border-slate-700">
            ⚙️ <h3 className="mt-4 font-semibold">Structured workflows</h3>
            <p className="mt-2 text-sm text-slate-400">
              Clear roles and permissions keep teams aligned.
            </p>
          </div>

          <div className="rounded-xl bg-slate-900 p-6 border border-slate-700">
            🚀 <h3 className="mt-4 font-semibold">Higher productivity</h3>
            <p className="mt-2 text-sm text-slate-400">
              Focus on work, not on managing tools.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

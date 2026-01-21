export default function Roles() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-3xl font-bold text-slate-900">
          Designed for every role
        </h2>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          {[
            {
              title: "Project Managers",
              items: [
                "Create and structure projects",
                "Assign responsibilities",
                "Control permissions",
                "Monitor progress",
              ],
            },
            {
              title: "Project Members",
              items: [
                "Focus on assigned tasks",
                "Update progress",
                "Collaborate through comments",
                "Stay aligned with goals",
              ],
            },
          ].map((role) => (
            <div
              key={role.title}
              className="rounded-xl bg-slate-200 p-8 border border-slate-300"
            >
              <h3 className="text-xl font-semibold text-sky-600 ">
                {role.title}
              </h3>
              <ul className="mt-6 space-y-2 text-slate-600 text-sm">
                {role.items.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

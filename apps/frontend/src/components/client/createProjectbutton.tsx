import Link from "next/link";
export default function CreateProjectSection() {
  return (
    <section className="w-full max-w-6xl mx-auto flex items-center justify-between gap-6 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 px-8 py-10 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-white">Start something new</h2>
        <p className="mt-1 text-sm text-emerald-50/90">
          Set up a project and invite your team.
        </p>
      </div>

      <Link
        href="/client/newProject"
        type="button"
        className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-emerald-700 shadow-sm transition hover:bg-emerald-50 active:scale-95"
      >
        Create project
      </Link>
    </section>
  );
}
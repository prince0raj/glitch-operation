import { Award, FileSearch, Target } from "lucide-react";

const proposals = [
  {
    title: "Document the Breach",
    description:
      "Share the vulnerable flow, impact, and reproduction steps in a well-structured narrative so others can follow along.",
    icon: FileSearch,
  },
  {
    title: "Provide Real References",
    description:
      "Attach proof-of-concept links, screenshots, or repos. Verified contributors earn a public shout-out alongside their proposal.",
    icon: Target,
  },
  {
    title: "Launch the Challenge",
    description:
      "We convert the scenario into a live challenge, crediting you as the owner when it ships to our community.",
    icon: Award,
  },
];

export default function BreachProposal() {
  return (
    <section
      id="breach-proposal"
      className="relative py-20 bg-[#05060a] text-white overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#0a1324_0%,rgba(5,6,10,0)_55%)] opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(0,212,146,0.18)_0%,rgba(0,212,146,0)_45%,rgba(0,212,146,0.18)_100%)] opacity-40 mix-blend-screen" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#00d492]/40 bg-[#00d492]/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-[#00d492]">
            Breach Proposal
          </span>
          <h2 className="mt-6 text-4xl md:text-5xl font-bold text-white">
            Pitch a Breach Scenario the Community Can Tackle
          </h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg">
            Submit a security breach concept with context, impact, and
            references. We will polish the documentation, shout you out, and
            transform it into a real-world challenge for hunters to solve.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {proposals.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-[#00d492]/20 bg-black/40 p-8 backdrop-blur"
            >
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00d492]/20 to-transparent" />
              </div>

              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-[#00d492]/40 bg-[#00d492]/10 text-[#00d492] shadow-[0_0_25px_#00d492]/40">
                <Icon className="h-6 w-6" />
              </div>

              <h3 className="mt-6 text-xl font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">
                {description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 text-center md:flex-row md:justify-center md:text-left">
          <div>
            <h3 className="text-2xl font-semibold text-white">
              Ready to pitch your next breach scenario?
            </h3>
            <p className="mt-2 text-gray-400">
              Outline the problem, drop your references, and we will ship it as
              a challenge with your name on the shout-out board.
            </p>
          </div>
          <a
            href="/ui/dashboard/breach-proposal"
            className="inline-flex items-center justify-center rounded-xl border border-[#00d492] px-6 py-3 font-semibold text-[#00d492] transition hover:bg-[#00d492]/10"
          >
            Build a Proposal
          </a>
        </div>
      </div>
    </section>
  );
}

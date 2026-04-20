import { Shield, TrendingUp, Users, Award } from "lucide-react";

const reasons = [
  {
    icon: TrendingUp,
    title: "Top-Tier Compensation",
    description:
      "Our contractors pay what your skills are actually worth — whether you're an apprentice or a master journeyman. No lowball offers, no empty promises.",
  },
  {
    icon: Shield,
    title: "World-Class Benefits",
    description:
      "Comprehensive health, dental, and vision coverage that actually covers your family. Plus pension and 401(k) contributions funded for you.",
  },
  {
    icon: Users,
    title: "Elite Contractor Network",
    description:
      "We partner with the most respected plumbing contractors across the Chicagoland area. You'll work with the best in the business.",
  },
  {
    icon: Award,
    title: "Your Craft, Respected",
    description:
      "No more being treated like a number. Our contractors value skilled plumbers at every level and invest in long-term careers, not short-term labor.",
  },
];

export function WhySection() {
  return (
    <section id="why" className="bg-navy py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Why Plumbers Choose{" "}
            <span className="text-brand">Plumbers 911</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-400">
            We&apos;re not a job board. We&apos;re the bridge between
            Chicago&apos;s top plumbers and the contractors who pay what
            they&apos;re worth.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="group rounded-xl border border-white/5 bg-navy-light/50 p-6 transition-all hover:border-brand/30 hover:bg-navy-lighter/50"
            >
              <div className="mb-4 inline-flex rounded-lg bg-brand/10 p-3">
                <reason.icon className="h-6 w-6 text-brand" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {reason.title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

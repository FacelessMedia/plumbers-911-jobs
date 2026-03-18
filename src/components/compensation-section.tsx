import { DollarSign, PiggyBank, Clock, TrendingUp } from "lucide-react";

const compensationItems = [
  {
    icon: DollarSign,
    title: "Base Earnings",
    value: "$125,000",
    description: "Strong base compensation for experienced service plumbers",
  },
  {
    icon: TrendingUp,
    title: "Total Potential",
    value: "$200,000+",
    description: "Based on hours worked — the more you work, the more you earn",
  },
  {
    icon: PiggyBank,
    title: "Retirement Funded",
    value: "Pension + 401(k)",
    description:
      "Generous employer contributions to both pension and 401(k) plans",
  },
  {
    icon: Clock,
    title: "Hours-Based Pay",
    value: "You Control It",
    description:
      "Your earning potential is directly tied to the hours you put in",
  },
];

export function CompensationSection() {
  return (
    <section id="compensation" className="bg-black py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Compensation That{" "}
            <span className="text-red-500">Matches Your Skills</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-400">
            Stop leaving money on the table. Our contractors pay top dollar for
            experienced plumbers — and your retirement is funded on top of it.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {compensationItems.map((item) => (
            <div
              key={item.title}
              className="relative overflow-hidden rounded-xl border border-white/5 bg-gradient-to-b from-zinc-800/80 to-zinc-900/80 p-6"
            >
              <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-red-600/5" />
              <item.icon className="mb-4 h-8 w-8 text-red-500" />
              <p className="text-sm font-medium uppercase tracking-wider text-zinc-500">
                {item.title}
              </p>
              <p className="mt-1 text-2xl font-bold text-white">{item.value}</p>
              <p className="mt-2 text-sm text-zinc-400">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-xl border border-red-600/20 bg-red-600/5 p-8 text-center">
          <p className="text-lg font-semibold text-white">
            That&apos;s tens of thousands of dollars per year going toward your
            retirement —{" "}
            <span className="text-red-400">funded for you, not by you.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

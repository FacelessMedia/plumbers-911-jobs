import {
  Heart,
  Eye,
  Smile,
  Landmark,
  Wallet,
  CalendarCheck,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

const benefits = [
  {
    icon: Heart,
    title: "Health Insurance",
    description: "World-class medical coverage for you and your family",
  },
  {
    icon: Smile,
    title: "Dental Coverage",
    description: "Comprehensive dental plan — no cutting corners",
  },
  {
    icon: Eye,
    title: "Vision Coverage",
    description: "Full vision benefits included in your package",
  },
  {
    icon: Landmark,
    title: "Pension Plan",
    description: "Build real, long-term retirement security",
  },
  {
    icon: Wallet,
    title: "401(k)",
    description: "Employer-contributed 401(k) on top of your pension",
  },
  {
    icon: CalendarCheck,
    title: "Paid Time Off",
    description: "Paid vacation and holidays — because you've earned it",
  },
  {
    icon: GraduationCap,
    title: "Training & Development",
    description: "Ongoing career development and training opportunities",
  },
  {
    icon: ShieldCheck,
    title: "Insurance Coverage",
    description: "Comprehensive insurance protection for peace of mind",
  },
];

export function BenefitsSection() {
  return (
    <section id="benefits" className="bg-navy py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5">
            <span className="text-sm font-medium text-brand-light">
              World-Class Benefits Package
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Benefits That Actually{" "}
            <span className="text-brand">Protect Your Family</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-400">
            This isn&apos;t a bare-bones benefits package with a fancy name.
            This is world-class coverage designed to protect you and your family
            while you build a career that lasts.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="flex items-start gap-4 rounded-xl border border-white/5 bg-navy-light/30 p-5 transition-all hover:border-brand/20 hover:bg-navy-light/50"
            >
              <div className="flex-shrink-0 rounded-lg bg-brand/10 p-2.5">
                <benefit.icon className="h-5 w-5 text-brand" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{benefit.title}</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

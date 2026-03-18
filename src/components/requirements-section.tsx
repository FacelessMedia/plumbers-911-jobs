import { BadgeCheck, Clock, Award, Car, Wrench, MessageCircle } from "lucide-react";

const requirements = [
  {
    icon: Clock,
    text: "5+ years of residential plumbing experience",
    required: true,
  },
  {
    icon: Award,
    text: "Journeyman Plumbing License",
    required: true,
  },
  {
    icon: Wrench,
    text: "Strong troubleshooting and diagnostic abilities",
    required: true,
  },
  {
    icon: MessageCircle,
    text: "Professional communication skills with customers",
    required: true,
  },
  {
    icon: Car,
    text: "Valid driver's license with an insurable driving record",
    required: true,
  },
  {
    icon: BadgeCheck,
    text: "A plumber who takes pride in their craft and wants to be compensated accordingly",
    required: false,
  },
];

export function RequirementsSection() {
  return (
    <section id="requirements" className="bg-navy py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="rounded-2xl border border-white/10 bg-navy-light/50 p-8">
              <h3 className="mb-6 text-xl font-bold text-white">
                Quick Qualification Check
              </h3>
              <div className="space-y-4">
                {requirements.map((req, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex-shrink-0 rounded-full p-1 ${
                        req.required
                          ? "bg-brand/20 text-brand"
                          : "bg-navy-lighter text-zinc-400"
                      }`}
                    >
                      <req.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-zinc-300">{req.text}</p>
                      {req.required && (
                        <span className="text-xs font-medium uppercase tracking-wider text-brand">
                          Required
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-lg bg-brand/10 p-4">
                <p className="text-sm text-zinc-300">
                  <span className="font-semibold text-brand-light">
                    Meet these qualifications?
                  </span>{" "}
                  You&apos;re exactly who we&apos;re looking for. Scroll down
                  and apply — positions are filling fast.
                </p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Who We&apos;re{" "}
              <span className="text-brand">Looking For</span>
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              We work with experienced plumbers who are serious about their
              careers. If you have the license, the skills, and the drive — we
              have the position.
            </p>
            <p className="mt-4 text-lg text-zinc-400">
              This isn&apos;t for everyone. We&apos;re selective because our
              contractors expect the best — and they pay accordingly.
            </p>

            <div className="mt-8">
              <a
                href="#apply"
                className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                I Qualify — Take Me to the Application
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

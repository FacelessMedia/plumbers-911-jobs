import { Wrench, MessageSquare, Star, Home, CheckCircle } from "lucide-react";

const responsibilities = [
  {
    icon: Wrench,
    text: "Diagnose, repair, and service residential/commercial plumbing systems across the Chicagoland area",
  },
  {
    icon: CheckCircle,
    text: "Perform high-quality plumbing repairs, installations, and maintenance",
  },
  {
    icon: MessageSquare,
    text: "Communicate clearly with customers — explain issues and solutions professionally",
  },
  {
    icon: Home,
    text: "Deliver top-tier, customer-focused service on every call",
  },
  {
    icon: Star,
    text: "Represent the Plumbers 911 standard of excellence in every home",
  },
];

export function WhatYouDoSection() {
  return (
    <section id="role" className="bg-navy-dark py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              What You&apos;ll Do{" "}
              <span className="text-brand">Every Day</span>
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              You&apos;ll be placed with top residential and commercial service
              contractors across the Chicagoland area — doing the work you
              already know, but with compensation and respect that matches
              your skills.
            </p>

            <div className="mt-10 space-y-6">
              {responsibilities.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 rounded-lg bg-brand/10 p-2.5">
                    <item.icon className="h-5 w-5 text-brand" />
                  </div>
                  <p className="text-zinc-300">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-navy-light to-navy p-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-brand/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-brand">1</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Apply Online</p>
                    <p className="text-sm text-zinc-400">
                      Fill out the quick application form below
                    </p>
                  </div>
                </div>
                <div className="ml-6 h-8 w-px bg-navy-lighter" />
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-brand/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-brand">2</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      We Review & Connect
                    </p>
                    <p className="text-sm text-zinc-400">
                      We match your experience with the right contractor
                    </p>
                  </div>
                </div>
                <div className="ml-6 h-8 w-px bg-navy-lighter" />
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-brand/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-brand">3</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Start Earning</p>
                    <p className="text-sm text-zinc-400">
                      Begin your career with top pay and world-class benefits
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { AlertTriangle, Users, Clock, MapPin } from "lucide-react";

export function UrgencySection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-dark/40 via-navy-dark to-navy-dark py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand/20 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/15 px-5 py-2">
            <AlertTriangle className="h-4 w-4 text-brand" />
            <span className="text-sm font-semibold text-brand-light">
              Positions Filling Fast
            </span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Don&apos;t Miss This Opportunity
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-400">
            We only work with a select number of plumbers at a time to ensure
            quality placements. Once these spots are filled, we close
            applications until the next opening.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          <div className="rounded-xl border border-brand/20 bg-brand/5 p-6 text-center">
            <Users className="mx-auto mb-3 h-8 w-8 text-brand" />
            <p className="text-2xl font-bold text-white">4 Openings</p>
            <p className="mt-1 text-sm text-zinc-400">
              Positions Available Now
            </p>
          </div>
          <div className="rounded-xl border border-brand/20 bg-brand/5 p-6 text-center">
            <MapPin className="mx-auto mb-3 h-8 w-8 text-brand" />
            <p className="text-2xl font-bold text-white">Chicagoland</p>
            <p className="mt-1 text-sm text-zinc-400">
              City + Surrounding Suburbs
            </p>
          </div>
          <div className="rounded-xl border border-brand/20 bg-brand/5 p-6 text-center">
            <Clock className="mx-auto mb-3 h-8 w-8 text-brand" />
            <p className="text-2xl font-bold text-white">Apply Today</p>
            <p className="mt-1 text-sm text-zinc-400">
              Applications Reviewed Within 48 Hours
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a
            href="#apply"
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-10 py-4 text-lg font-bold text-white shadow-lg shadow-brand/25 transition-all hover:bg-brand-dark hover:shadow-brand/40"
          >
            Secure Your Spot — Apply Now
          </a>
        </div>
      </div>
    </section>
  );
}

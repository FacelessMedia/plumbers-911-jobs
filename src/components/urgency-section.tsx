"use client";

import { AlertTriangle, Users, Clock, MapPin } from "lucide-react";

export function UrgencySection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-red-950/40 via-black to-black py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-600/40 bg-red-600/15 px-5 py-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm font-semibold text-red-400">
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
          <div className="rounded-xl border border-red-600/20 bg-red-600/5 p-6 text-center">
            <Users className="mx-auto mb-3 h-8 w-8 text-red-500" />
            <p className="text-2xl font-bold text-white">Limited</p>
            <p className="mt-1 text-sm text-zinc-400">
              Positions Available Now
            </p>
          </div>
          <div className="rounded-xl border border-red-600/20 bg-red-600/5 p-6 text-center">
            <MapPin className="mx-auto mb-3 h-8 w-8 text-red-500" />
            <p className="text-2xl font-bold text-white">Chicago Metro</p>
            <p className="mt-1 text-sm text-zinc-400">
              City + Surrounding Suburbs
            </p>
          </div>
          <div className="rounded-xl border border-red-600/20 bg-red-600/5 p-6 text-center">
            <Clock className="mx-auto mb-3 h-8 w-8 text-red-500" />
            <p className="text-2xl font-bold text-white">Apply Today</p>
            <p className="mt-1 text-sm text-zinc-400">
              Applications Reviewed Within 48 Hours
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a
            href="#apply"
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-10 py-4 text-lg font-bold text-white shadow-lg shadow-red-600/25 transition-all hover:bg-red-700 hover:shadow-red-600/40"
          >
            Secure Your Spot — Apply Now
          </a>
        </div>
      </div>
    </section>
  );
}

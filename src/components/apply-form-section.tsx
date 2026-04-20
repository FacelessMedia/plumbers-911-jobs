"use client";

import { useState, type FormEvent } from "react";
import { Send, CheckCircle, Loader2 } from "lucide-react";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  yearsExperience: string;
  hasLicense: string;
  currentEmployer: string;
  availability: string;
  message: string;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  yearsExperience: "",
  hasLicense: "",
  currentEmployer: "",
  availability: "",
  message: "",
};

export function ApplyFormSection() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData(initialFormData);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <section id="apply" className="bg-navy py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-green-600/30 bg-green-600/10 p-12">
            <CheckCircle className="mx-auto mb-6 h-16 w-16 text-green-500" />
            <h2 className="text-3xl font-bold text-white">
              Application Received!
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              Thank you for your interest. Our team will review your application
              and contact you within 48 hours. Keep an eye on your phone and
              email.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-8 inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-medium text-zinc-300 transition-all hover:border-white/40 hover:text-white"
            >
              Submit Another Application
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="apply" className="bg-navy py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-brand" />
            <span className="text-sm font-medium text-brand-light">
              Now Accepting Applications
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Earn What You&apos;re{" "}
            <span className="text-brand">Worth?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-400">
            Fill out the form below and our team will reach out within 48 hours
            to discuss available positions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-12 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-navy-light px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                placeholder="John"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-navy-light px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                placeholder="Smith"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-navy-light px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                placeholder="john@email.com"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-navy-light px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                placeholder="(312) 555-0123"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="yearsExperience"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Years of Experience *
              </label>
              <select
                id="yearsExperience"
                name="yearsExperience"
                required
                value={formData.yearsExperience}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-navy-light px-4 py-3 text-white transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="">Select experience</option>
                <option value="2-5">2–5 years</option>
                <option value="5-10">5–10 years</option>
                <option value="10-15">10–15 years</option>
                <option value="15-20">15–20 years</option>
                <option value="20+">20+ years</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="hasLicense"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Plumbing License? *
              </label>
              <select
                id="hasLicense"
                name="hasLicense"
                required
                value={formData.hasLicense}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-navy-light px-4 py-3 text-white transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="">Select</option>
                <option value="yes">Yes — I have a Journeyman License</option>
                <option value="in-progress">In progress / Apprentice</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="currentEmployer"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Current Employer (Optional)
              </label>
              <input
                type="text"
                id="currentEmployer"
                name="currentEmployer"
                value={formData.currentEmployer}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-navy-light px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                placeholder="Current company name"
              />
            </div>
            <div>
              <label
                htmlFor="availability"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Availability *
              </label>
              <select
                id="availability"
                name="availability"
                required
                value={formData.availability}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-navy-light px-4 py-3 text-white transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="">When can you start?</option>
                <option value="immediately">Immediately</option>
                <option value="2-weeks">Within 2 weeks</option>
                <option value="1-month">Within 1 month</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="message"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              Anything else we should know? (Optional)
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="w-full rounded-lg border border-white/10 bg-navy-light px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              placeholder="Tell us about your experience, specialties, or any questions..."
            />
          </div>

          {status === "error" && (
            <div className="rounded-lg border border-brand/30 bg-brand/10 p-4 text-center">
              <p className="text-sm text-brand-light">
                Something went wrong. Please try again or email us directly at{" "}
                <a
                  href="mailto:Apply@Plumbers911Chicago.com"
                  className="font-semibold underline"
                >
                  Apply@Plumbers911Chicago.com
                </a>
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-8 py-4 text-lg font-bold text-white shadow-lg shadow-brand/25 transition-all hover:bg-brand-dark hover:shadow-brand/40 disabled:opacity-50"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Submit Application
              </>
            )}
          </button>

          <p className="text-center text-xs text-zinc-500">
            Your information is kept confidential and will only be used to
            connect you with available positions.
          </p>
        </form>
      </div>
    </section>
  );
}

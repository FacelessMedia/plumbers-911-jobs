"use client";

import { useRef, useState, type FormEvent } from "react";
import { Send, CheckCircle, Loader2, Upload, X, FileText } from "lucide-react";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  yearsExperience: string;
  hasLicense: string;
  apprenticeLicenseDate: string;
  currentEmployer: string;
  availability: string;
  message: string;
}

const initialFormState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  yearsExperience: "",
  hasLicense: "",
  apprenticeLicenseDate: "",
  currentEmployer: "",
  availability: "",
  message: "",
};

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_FILES = 5;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ApplyFormSection() {
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files ?? []);
    setFileError(null);

    const accepted: File[] = [];
    let firstRejection: string | null = null;

    for (const file of incoming) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        firstRejection = firstRejection ?? `${file.name}: file type not allowed (PDF, DOC/DOCX, or image only)`;
        continue;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        firstRejection = firstRejection ?? `${file.name}: too large (max 10 MB)`;
        continue;
      }
      accepted.push(file);
    }

    setFiles((prev) => {
      const combined = [...prev, ...accepted];
      if (combined.length > MAX_FILES) {
        firstRejection = firstRejection ?? `Only ${MAX_FILES} files max — extras were dropped.`;
        return combined.slice(0, MAX_FILES);
      }
      return combined;
    });

    if (firstRejection) setFileError(firstRejection);

    // Reset native input so the same file can be picked again after removal.
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setFileError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        fd.append(key, value);
      });
      files.forEach((file) => fd.append("files", file, file.name));

      const response = await fetch("/api/apply", {
        method: "POST",
        body: fd,
      });

      if (response.ok) {
        setStatus("success");
        setFormData(initialFormState);
        setFiles([]);
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
                <option value="2-3">2–3 years</option>
                <option value="3-5">3–5 years</option>
                <option value="5-10">5–10 years</option>
                <option value="10+">10+ years</option>
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
                <option value="None">None</option>
                <option value="Apprentice">Apprentice License</option>
                <option value="Chicago License">City of Chicago License</option>
                <option value="Illinois License">Illinois State License</option>
              </select>
            </div>
          </div>

          {formData.hasLicense === "Apprentice" && (
            <div>
              <label
                htmlFor="apprenticeLicenseDate"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Apprentice License Start Date *
              </label>
              <input
                type="date"
                id="apprenticeLicenseDate"
                name="apprenticeLicenseDate"
                required
                value={formData.apprenticeLicenseDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-navy-light px-4 py-3 text-white transition-colors focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
              <p className="mt-1 text-xs text-zinc-500">
                Date shown on your apprentice license.
              </p>
            </div>
          )}

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
                <option value="Immediately">Immediately</option>
                <option value="2 weeks">Within 2 weeks</option>
                <option value="1 month">Within 1 month</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="resume"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              Resume / Supporting Documents (Optional)
            </label>
            <div className="rounded-lg border border-dashed border-white/15 bg-navy-light/50 p-4">
              <input
                ref={fileInputRef}
                type="file"
                id="resume"
                name="resume"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,image/gif"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="resume"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 py-4 text-center"
              >
                <Upload className="h-6 w-6 text-zinc-400" />
                <span className="text-sm font-medium text-zinc-300">
                  Click to upload or drag &amp; drop
                </span>
                <span className="text-xs text-zinc-500">
                  PDF, DOC/DOCX, or images (JPG, PNG, GIF) — up to {MAX_FILES} files, 10 MB each
                </span>
              </label>

              {files.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {files.map((file, idx) => (
                    <li
                      key={`${file.name}-${idx}`}
                      className="flex items-center justify-between gap-3 rounded-md border border-white/5 bg-navy-light px-3 py-2"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <FileText className="h-4 w-4 flex-shrink-0 text-brand-light" />
                        <span className="truncate text-sm text-zinc-200">
                          {file.name}
                        </span>
                        <span className="flex-shrink-0 text-xs text-zinc-500">
                          {formatBytes(file.size)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="flex-shrink-0 rounded p-1 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                        aria-label={`Remove ${file.name}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {fileError && (
                <p className="mt-2 text-xs text-brand-light">{fileError}</p>
              )}
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
                  href="mailto:apply@plumbers911jobs.com"
                  className="font-semibold underline"
                >
                  apply@plumbers911jobs.com
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

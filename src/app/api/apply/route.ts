import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

// --- Env -----------------------------------------------------------------
const GHL_WEBHOOK_URL = process.env.GHL_WEBHOOK_URL;
const GHL_WEBHOOK_SECRET = process.env.GHL_WEBHOOK_SECRET;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_API_BASE = "https://services.leadconnectorhq.com";

// Custom field IDs created in GHL — set after the team creates the fields.
const GHL_CF_YEARS_EXPERIENCE = process.env.GHL_CF_YEARS_EXPERIENCE;
const GHL_CF_LICENSE = process.env.GHL_CF_LICENSE;
const GHL_CF_APPRENTICE_DATE = process.env.GHL_CF_APPRENTICE_DATE;
const GHL_CF_CURRENT_EMPLOYER = process.env.GHL_CF_CURRENT_EMPLOYER;
const GHL_CF_AVAILABILITY = process.env.GHL_CF_AVAILABILITY;
const GHL_CF_MESSAGE = process.env.GHL_CF_MESSAGE;
const GHL_CF_RESUME_URLS = process.env.GHL_CF_RESUME_URLS;

// --- File upload constraints --------------------------------------------
const ALLOWED_FILE_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/heic",
  "image/heif",
  "image/webp",
]);
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_FILES = 5;

// Size route response payloads
export const maxDuration = 60;
export const runtime = "nodejs";

// --- Types --------------------------------------------------------------
interface ApplicationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  yearsExperience: string;
  hasLicense: string;
  apprenticeLicenseDate: string | null;
  currentEmployer: string | null;
  availability: string;
  message: string | null;
  resumeUrls: string[];
}

type ForwardResult =
  | { method: "webhook"; ok: true }
  | { method: "api"; ok: true; contactId?: string }
  | { method: "none"; ok: false; reason: string };

// --- Helpers ------------------------------------------------------------
function sanitizeFilename(name: string): string {
  // Strip directory separators, keep extension. Replace anything sketchy.
  return (
    name
      .replace(/[/\\]/g, "_")
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .slice(0, 120) || "upload"
  );
}

function buildCustomFields(payload: ApplicationData) {
  const out: Array<{ id: string; field_value: string }> = [];

  if (GHL_CF_YEARS_EXPERIENCE) {
    out.push({ id: GHL_CF_YEARS_EXPERIENCE, field_value: payload.yearsExperience });
  }
  if (GHL_CF_LICENSE) {
    out.push({ id: GHL_CF_LICENSE, field_value: payload.hasLicense });
  }
  if (GHL_CF_APPRENTICE_DATE && payload.apprenticeLicenseDate) {
    out.push({ id: GHL_CF_APPRENTICE_DATE, field_value: payload.apprenticeLicenseDate });
  }
  if (GHL_CF_CURRENT_EMPLOYER && payload.currentEmployer) {
    out.push({ id: GHL_CF_CURRENT_EMPLOYER, field_value: payload.currentEmployer });
  }
  if (GHL_CF_AVAILABILITY) {
    out.push({ id: GHL_CF_AVAILABILITY, field_value: payload.availability });
  }
  if (GHL_CF_MESSAGE && payload.message) {
    out.push({ id: GHL_CF_MESSAGE, field_value: payload.message });
  }
  if (GHL_CF_RESUME_URLS && payload.resumeUrls.length > 0) {
    out.push({ id: GHL_CF_RESUME_URLS, field_value: payload.resumeUrls.join("\n") });
  }

  return out;
}

async function tryWebhook(payload: ApplicationData): Promise<boolean> {
  if (!GHL_WEBHOOK_URL) return false;
  try {
    const res = await fetch(GHL_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(GHL_WEBHOOK_SECRET ? { "x-webhook-secret": GHL_WEBHOOK_SECRET } : {}),
      },
      body: JSON.stringify({
        ...payload,
        source: "plumbers911jobs.com",
        tags: ["plumbers-911", "website-apply"],
        submittedAt: new Date().toISOString(),
      }),
    });
    if (!res.ok) {
      console.error(
        `GHL webhook responded with ${res.status}:`,
        await res.text().catch(() => ""),
      );
      return false;
    }
    return true;
  } catch (err) {
    console.error("GHL webhook fetch failed:", err);
    return false;
  }
}

async function tryRestApi(
  payload: ApplicationData,
): Promise<{ ok: boolean; contactId?: string }> {
  if (!GHL_LOCATION_ID || !GHL_API_KEY) return { ok: false };

  const customFields = buildCustomFields(payload);

  const body: Record<string, unknown> = {
    locationId: GHL_LOCATION_ID,
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    phone: payload.phone,
    source: "plumbers911jobs.com",
    tags: ["plumbers-911", "website-apply"],
  };
  if (customFields.length > 0) body.customFields = customFields;

  try {
    const res = await fetch(`${GHL_API_BASE}/contacts/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GHL_API_KEY}`,
        Version: "2021-07-28",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error(
        `GHL REST contact create failed (${res.status}):`,
        await res.text().catch(() => ""),
      );
      return { ok: false };
    }

    const result = (await res.json().catch(() => null)) as
      | { contact?: { id?: string } }
      | null;
    const contactId = result?.contact?.id;

    // Best-effort: also attach a structured note containing everything
    // (useful as a single-glance summary even when custom fields are populated).
    if (contactId) {
      const note = [
        `Years experience: ${payload.yearsExperience}`,
        `License: ${payload.hasLicense}`,
        payload.apprenticeLicenseDate
          ? `Apprentice license start date: ${payload.apprenticeLicenseDate}`
          : null,
        payload.currentEmployer ? `Current employer: ${payload.currentEmployer}` : null,
        `Availability: ${payload.availability}`,
        payload.message ? `Message: ${payload.message}` : null,
        payload.resumeUrls.length > 0
          ? `Resume files:\n${payload.resumeUrls.join("\n")}`
          : null,
        `Submitted: ${new Date().toISOString()}`,
      ]
        .filter(Boolean)
        .join("\n");

      try {
        await fetch(`${GHL_API_BASE}/contacts/${contactId}/notes`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GHL_API_KEY}`,
            Version: "2021-07-28",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ body: note, userId: "" }),
        });
      } catch (noteErr) {
        console.error("GHL note attach failed (non-fatal):", noteErr);
      }
    }

    return { ok: true, contactId };
  } catch (err) {
    console.error("GHL REST fetch failed:", err);
    return { ok: false };
  }
}

async function forwardToGHL(payload: ApplicationData): Promise<ForwardResult> {
  if (await tryWebhook(payload)) {
    return { method: "webhook", ok: true };
  }

  const apiResult = await tryRestApi(payload);
  if (apiResult.ok) {
    return { method: "api", ok: true, contactId: apiResult.contactId };
  }

  const reason =
    !GHL_WEBHOOK_URL && !(GHL_LOCATION_ID && GHL_API_KEY)
      ? "no GHL credentials configured"
      : "all GHL forwarding attempts failed";
  return { method: "none", ok: false, reason };
}

// --- POST handler -------------------------------------------------------
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let formData: FormData;

    if (contentType.includes("multipart/form-data")) {
      formData = await request.formData();
    } else if (contentType.includes("application/json")) {
      // Backwards compatibility with any client still sending JSON.
      const json = await request.json();
      formData = new FormData();
      Object.entries(json).forEach(([k, v]) =>
        formData.append(k, v == null ? "" : String(v)),
      );
    } else {
      return NextResponse.json(
        { error: "Unsupported content-type" },
        { status: 415 },
      );
    }

    const get = (key: string) => {
      const v = formData.get(key);
      return typeof v === "string" ? v.trim() : "";
    };

    const firstName = get("firstName");
    const lastName = get("lastName");
    const email = get("email");
    const phone = get("phone");
    const yearsExperience = get("yearsExperience");
    const hasLicense = get("hasLicense");
    const apprenticeLicenseDate = get("apprenticeLicenseDate");
    const currentEmployer = get("currentEmployer");
    const availability = get("availability");
    const message = get("message");

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !yearsExperience ||
      !hasLicense ||
      !availability
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (hasLicense === "apprentice" && !apprenticeLicenseDate) {
      return NextResponse.json(
        { error: "Apprentice license start date is required" },
        { status: 400 },
      );
    }

    // --- Files ---
    const fileEntries = formData.getAll("files").filter((f): f is File => f instanceof File);

    if (fileEntries.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Maximum ${MAX_FILES} files allowed` },
        { status: 400 },
      );
    }
    for (const file of fileEntries) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds 10 MB` },
          { status: 400 },
        );
      }
      if (!ALLOWED_FILE_TYPES.has(file.type)) {
        return NextResponse.json(
          { error: `File type not allowed: ${file.name} (${file.type})` },
          { status: 400 },
        );
      }
    }

    // Upload to Vercel Blob if any files present and BLOB_READ_WRITE_TOKEN set.
    const resumeUrls: string[] = [];
    if (fileEntries.length > 0) {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.error(
          "Files uploaded but BLOB_READ_WRITE_TOKEN is not configured. Skipping upload.",
        );
      } else {
        const stamp = Date.now();
        const safeFolder = sanitizeFilename(`${lastName}-${firstName}`).toLowerCase();
        for (const file of fileEntries) {
          try {
            const filename = sanitizeFilename(file.name);
            const blob = await put(
              `applications/${stamp}-${safeFolder}/${filename}`,
              file,
              {
                access: "public",
                addRandomSuffix: true,
                contentType: file.type,
              },
            );
            resumeUrls.push(blob.url);
          } catch (uploadErr) {
            console.error(`Failed to upload ${file.name}:`, uploadErr);
          }
        }
      }
    }

    const payload: ApplicationData = {
      firstName,
      lastName,
      email,
      phone,
      yearsExperience,
      hasLicense,
      apprenticeLicenseDate: apprenticeLicenseDate || null,
      currentEmployer: currentEmployer || null,
      availability,
      message: message || null,
      resumeUrls,
    };

    const forwardResult = await forwardToGHL(payload);

    console.log("=== NEW APPLICATION ===");
    console.log(`Name: ${firstName} ${lastName}`);
    console.log(`Email: ${email}`);
    console.log(`Phone: ${phone}`);
    console.log(`Experience: ${yearsExperience} years`);
    console.log(`License: ${hasLicense}`);
    if (hasLicense === "apprentice") {
      console.log(`Apprentice License Start Date: ${apprenticeLicenseDate || "Not provided"}`);
    }
    console.log(`Current Employer: ${currentEmployer || "Not provided"}`);
    console.log(`Availability: ${availability}`);
    console.log(`Message: ${message || "None"}`);
    console.log(`Files uploaded: ${resumeUrls.length}`);
    resumeUrls.forEach((url, i) => console.log(`  [${i + 1}] ${url}`));
    if (forwardResult.ok) {
      const detail =
        forwardResult.method === "api" && forwardResult.contactId
          ? ` (contact ${forwardResult.contactId})`
          : "";
      console.log(`GHL forwarding: ${forwardResult.method}${detail}`);
    } else {
      console.log(`GHL forwarding: skipped (${forwardResult.reason})`);
    }
    console.log("=======================");

    return NextResponse.json({ success: true, message: "Application received" });
  } catch (error) {
    console.error("apply route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

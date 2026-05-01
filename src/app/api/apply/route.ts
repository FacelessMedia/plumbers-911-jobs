import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

// --- Env -----------------------------------------------------------------
const GHL_WEBHOOK_URL = process.env.GHL_WEBHOOK_URL;
const GHL_WEBHOOK_SECRET = process.env.GHL_WEBHOOK_SECRET;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_API_BASE = "https://services.leadconnectorhq.com";

// GHL custom field *keys* (not IDs). These are the stable "Unique Keys" shown in
// GHL Settings -> Custom Fields. They're stripped out of any merge-token syntax
// the user may paste (e.g. `{{ contact.years_of_experience }}` -> `years_of_experience`).
function normalizeFieldKey(raw: string | undefined, fallback: string): string {
  if (!raw) return fallback;
  const trimmed = raw.trim();
  // Accept the full GHL merge token and strip it down to just the key.
  const mergeMatch = trimmed.match(/\{\{\s*contact\.([a-zA-Z0-9_]+)\s*\}\}/);
  if (mergeMatch) return mergeMatch[1];
  return trimmed;
}

const KEY_YEARS_EXPERIENCE = normalizeFieldKey(
  process.env.GHL_CF_YEARS_EXPERIENCE,
  "years_of_experience",
);
const KEY_LICENSE = normalizeFieldKey(process.env.GHL_CF_LICENSE, "plumbing_license");
const KEY_APPRENTICE_DATE = normalizeFieldKey(
  process.env.GHL_CF_APPRENTICE_DATE,
  "apprentice_license_date",
);
const KEY_CURRENT_EMPLOYER = normalizeFieldKey(
  process.env.GHL_CF_CURRENT_EMPLOYER,
  "current_employer",
);
const KEY_AVAILABILITY = normalizeFieldKey(process.env.GHL_CF_AVAILABILITY, "availability");
const KEY_MESSAGE = normalizeFieldKey(process.env.GHL_CF_MESSAGE, "application_message");
const KEY_RESUME_FILES = normalizeFieldKey(
  process.env.GHL_CF_RESUME_FILES ?? process.env.GHL_CF_RESUME_URLS,
  "resume_upload",
);

// --- File upload constraints --------------------------------------------
// Must match GHL's accepted types for /forms/upload-custom-files.
// (GHL does NOT accept HEIC/WEBP.)
const ALLOWED_FILE_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
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
  privacyConsent: {
    accepted: boolean;
    acceptedAt: string;
    ipAddress: string | null;
  };
}

type ForwardResult =
  | { method: "webhook"; ok: true; filesUploaded: number }
  | { method: "api"; ok: true; contactId?: string; filesUploaded: number }
  | { method: "none"; ok: false; reason: string };

// --- Helpers ------------------------------------------------------------
type CustomFieldEntry = { key: string; field_value: string | string[] };

function buildCustomFields(payload: ApplicationData): CustomFieldEntry[] {
  const out: CustomFieldEntry[] = [];

  if (KEY_YEARS_EXPERIENCE && payload.yearsExperience) {
    out.push({ key: KEY_YEARS_EXPERIENCE, field_value: payload.yearsExperience });
  }
  if (KEY_LICENSE && payload.hasLicense) {
    out.push({ key: KEY_LICENSE, field_value: payload.hasLicense });
  }
  if (KEY_APPRENTICE_DATE && payload.apprenticeLicenseDate) {
    out.push({ key: KEY_APPRENTICE_DATE, field_value: payload.apprenticeLicenseDate });
  }
  if (KEY_CURRENT_EMPLOYER && payload.currentEmployer) {
    out.push({ key: KEY_CURRENT_EMPLOYER, field_value: payload.currentEmployer });
  }
  if (KEY_AVAILABILITY && payload.availability) {
    out.push({ key: KEY_AVAILABILITY, field_value: payload.availability });
  }
  if (KEY_MESSAGE && payload.message) {
    out.push({ key: KEY_MESSAGE, field_value: payload.message });
  }
  // NOTE: Resume Upload field is NOT populated here. FILE_UPLOAD custom fields
  // can only be filled via POST /forms/upload-custom-files (multipart).
  // See uploadFilesToGhl() below.

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

// Upload files to a FILE_UPLOAD custom field on an existing contact.
// Returns the number of files successfully uploaded.
// See: https://marketplace.gohighlevel.com/docs/ghl/forms/upload-to-custom-fields
async function uploadFilesToGhl(
  contactId: string,
  files: File[],
  customFieldId: string,
): Promise<number> {
  if (!GHL_API_KEY || !GHL_LOCATION_ID || files.length === 0 || !customFieldId) {
    return 0;
  }
  try {
    const fd = new FormData();
    for (const file of files) {
      // Field name format required by GHL: `<customFieldId>_<unique-id>`
      const key = `${customFieldId}_${randomUUID()}`;
      // Re-wrap as a fresh Blob so we're not re-using an already-consumed stream
      // from the incoming Request.formData().
      const buf = await file.arrayBuffer();
      const blob = new Blob([buf], { type: file.type || "application/octet-stream" });
      fd.append(key, blob, file.name);
    }
    const url =
      `${GHL_API_BASE}/forms/upload-custom-files` +
      `?contactId=${encodeURIComponent(contactId)}` +
      `&locationId=${encodeURIComponent(GHL_LOCATION_ID)}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GHL_API_KEY}`,
        Version: "2021-07-28",
        Accept: "application/json",
        // NOTE: do NOT set Content-Type — let fetch set the multipart boundary.
      },
      body: fd,
    });
    const bodyText = await res.text().catch(() => "");
    if (!res.ok) {
      console.error(`GHL file upload failed (${res.status}):`, bodyText);
      return 0;
    }
    console.log(
      `GHL file upload succeeded for contact ${contactId}: uploaded ${files.length} file(s)`,
    );
    return files.length;
  } catch (err) {
    console.error("GHL file upload fetch failed:", err);
    return 0;
  }
}

// Cache GHL custom-field key -> ID map per Lambda cold start. GHL's v2 API
// needs IDs in the `customFields` payload, but humans configure keys, so we
// resolve at runtime once and hold onto the result.
let customFieldKeyToIdPromise: Promise<Record<string, string>> | null = null;

async function getCustomFieldKeyToIdMap(): Promise<Record<string, string>> {
  if (!customFieldKeyToIdPromise) {
    customFieldKeyToIdPromise = (async () => {
      if (!GHL_LOCATION_ID || !GHL_API_KEY) return {};
      try {
        const res = await fetch(
          `${GHL_API_BASE}/locations/${GHL_LOCATION_ID}/customFields`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${GHL_API_KEY}`,
              Version: "2021-07-28",
              Accept: "application/json",
            },
          },
        );
        if (!res.ok) {
          console.error(
            `GHL customFields list failed (${res.status}):`,
            await res.text().catch(() => ""),
          );
          return {};
        }
        const json = (await res.json().catch(() => null)) as
          | { customFields?: Array<{ id?: string; fieldKey?: string }> }
          | null;
        const map: Record<string, string> = {};
        for (const f of json?.customFields ?? []) {
          if (f.id && f.fieldKey) {
            // fieldKey comes back as e.g. "contact.years_of_experience" — strip the prefix.
            const key = f.fieldKey.replace(/^contact\./, "");
            map[key] = f.id;
          }
        }
        console.log(
          `GHL custom fields resolved: ${Object.keys(map).length} keys cached`,
        );
        return map;
      } catch (err) {
        console.error("GHL customFields list fetch failed:", err);
        return {};
      }
    })();
  }
  return customFieldKeyToIdPromise;
}

async function tryRestApi(
  payload: ApplicationData,
  files: File[],
): Promise<{ ok: boolean; contactId?: string; filesUploaded: number }> {
  if (!GHL_LOCATION_ID || !GHL_API_KEY) return { ok: false, filesUploaded: 0 };

  const keyEntries = buildCustomFields(payload);
  const keyToId = await getCustomFieldKeyToIdMap();

  // Translate {key, field_value} -> {id, field_value}. Skip any entries whose
  // key isn't found in the GHL location (log a warning so we can fix config).
  const customFields: Array<{ id: string; field_value: string | string[] }> = [];
  for (const entry of keyEntries) {
    const id = keyToId[entry.key];
    if (id) {
      customFields.push({ id, field_value: entry.field_value });
    } else {
      console.warn(
        `GHL custom field key not found in location: "${entry.key}". Skipping.`,
      );
    }
  }

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
      return { ok: false, filesUploaded: 0 };
    }

    const result = (await res.json().catch(() => null)) as
      | { contact?: { id?: string } }
      | null;
    const contactId = result?.contact?.id;

    // Upload resume files to the Resume Upload custom field (FILE_UPLOAD type).
    let filesUploaded = 0;
    if (contactId && files.length > 0) {
      const resumeFieldId = keyToId[KEY_RESUME_FILES];
      if (resumeFieldId) {
        filesUploaded = await uploadFilesToGhl(contactId, files, resumeFieldId);
      } else {
        console.warn(
          `Resume Upload field key "${KEY_RESUME_FILES}" not found in GHL location — skipping file upload.`,
        );
      }
    }

    // Best-effort: attach a structured note (single-glance summary + audit trail).
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
        files.length > 0
          ? `Files uploaded: ${filesUploaded}/${files.length} — see Resume Upload custom field.`
          : null,
        "--- Privacy Consent ---",
        `Accepted: ${payload.privacyConsent.accepted ? "YES" : "NO"}`,
        `Accepted at: ${payload.privacyConsent.acceptedAt}`,
        `IP address: ${payload.privacyConsent.ipAddress ?? "unknown"}`,
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

    return { ok: true, contactId, filesUploaded };
  } catch (err) {
    console.error("GHL REST fetch failed:", err);
    return { ok: false, filesUploaded: 0 };
  }
}

async function forwardToGHL(
  payload: ApplicationData,
  files: File[],
): Promise<ForwardResult> {
  // Prefer REST API when credentials are present — it's the only path that
  // can upload files to the FILE_UPLOAD custom field.
  if (GHL_LOCATION_ID && GHL_API_KEY) {
    const apiResult = await tryRestApi(payload, files);
    if (apiResult.ok) {
      return {
        method: "api",
        ok: true,
        contactId: apiResult.contactId,
        filesUploaded: apiResult.filesUploaded,
      };
    }
  }

  // Fallback: webhook (data only — file uploads not supported here).
  if (await tryWebhook(payload)) {
    return { method: "webhook", ok: true, filesUploaded: 0 };
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

    if (hasLicense === "Apprentice" && !apprenticeLicenseDate) {
      return NextResponse.json(
        { error: "Apprentice license start date is required" },
        { status: 400 },
      );
    }

    // Privacy consent is required and must be recorded for compliance.
    const privacyConsentRaw = get("privacyConsent");
    const privacyConsentAtRaw = get("privacyConsentAt");
    const consentAccepted = privacyConsentRaw === "true" || privacyConsentRaw === "on";
    if (!consentAccepted) {
      return NextResponse.json(
        { error: "Privacy Policy consent is required" },
        { status: 400 },
      );
    }
    const consentAt = privacyConsentAtRaw || new Date().toISOString();
    // Best-effort IP capture for the consent audit trail.
    const consentIp =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      null;

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
      privacyConsent: {
        accepted: true,
        acceptedAt: consentAt,
        ipAddress: consentIp,
      },
    };

    const forwardResult = await forwardToGHL(payload, fileEntries);

    console.log("=== NEW APPLICATION ===");
    console.log(`Name: ${firstName} ${lastName}`);
    console.log(`Email: ${email}`);
    console.log(`Phone: ${phone}`);
    console.log(`Experience: ${yearsExperience} years`);
    console.log(`License: ${hasLicense}`);
    if (hasLicense === "Apprentice") {
      console.log(`Apprentice License Start Date: ${apprenticeLicenseDate || "Not provided"}`);
    }
    console.log(`Current Employer: ${currentEmployer || "Not provided"}`);
    console.log(`Availability: ${availability}`);
    console.log(`Message: ${message || "None"}`);
    console.log(`Files attached: ${fileEntries.length}`);
    if (forwardResult.ok) {
      const detail =
        forwardResult.method === "api" && forwardResult.contactId
          ? ` (contact ${forwardResult.contactId}, files ${forwardResult.filesUploaded}/${fileEntries.length})`
          : "";
      console.log(`GHL forwarding: ${forwardResult.method}${detail}`);
    } else {
      console.log(`GHL forwarding: skipped (${forwardResult.reason})`);
    }
    console.log("=======================");

    return NextResponse.json({
      success: true,
      message: "Application received",
      debug: {
        method: forwardResult.ok ? forwardResult.method : "none",
        contactId:
          forwardResult.ok && forwardResult.method === "api"
            ? forwardResult.contactId
            : undefined,
        filesAttached: fileEntries.length,
        filesUploaded: forwardResult.ok ? forwardResult.filesUploaded : 0,
        reason: forwardResult.ok ? undefined : forwardResult.reason,
      },
    });
  } catch (error) {
    console.error("apply route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

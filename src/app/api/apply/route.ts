import { NextResponse } from "next/server";

const GHL_WEBHOOK_URL = process.env.GHL_WEBHOOK_URL;
const GHL_WEBHOOK_SECRET = process.env.GHL_WEBHOOK_SECRET;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_API_BASE = "https://services.leadconnectorhq.com";

interface ApplicationPayload {
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
}

type ForwardResult =
  | { method: "webhook"; ok: true }
  | { method: "api"; ok: true; contactId?: string }
  | { method: "none"; ok: false; reason: string };

async function tryWebhook(payload: ApplicationPayload): Promise<boolean> {
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
  payload: ApplicationPayload,
): Promise<{ ok: boolean; contactId?: string }> {
  if (!GHL_LOCATION_ID || !GHL_API_KEY) return { ok: false };

  // GHL v2 REST API doesn't accept arbitrary custom field names — only IDs.
  // Until the team maps custom field IDs in GHL, dump all extra context into
  // a structured Notes/description block so nothing is lost.
  const notes = [
    `Years experience: ${payload.yearsExperience}`,
    `License: ${payload.hasLicense}`,
    payload.apprenticeLicenseDate
      ? `Apprentice license start date: ${payload.apprenticeLicenseDate}`
      : null,
    payload.currentEmployer ? `Current employer: ${payload.currentEmployer}` : null,
    `Availability: ${payload.availability}`,
    payload.message ? `Message: ${payload.message}` : null,
    `Submitted: ${new Date().toISOString()}`,
  ]
    .filter(Boolean)
    .join("\n");

  const body = {
    locationId: GHL_LOCATION_ID,
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    phone: payload.phone,
    source: "plumbers911jobs.com",
    tags: ["plumbers-911", "website-apply"],
  };

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

    // Best-effort: attach the structured notes to the new contact.
    if (contactId) {
      try {
        await fetch(`${GHL_API_BASE}/contacts/${contactId}/notes`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GHL_API_KEY}`,
            Version: "2021-07-28",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ body: notes, userId: "" }),
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

async function forwardToGHL(payload: ApplicationPayload): Promise<ForwardResult> {
  // 1) Try the webhook first (preferred — workflow handles all the wiring).
  if (await tryWebhook(payload)) {
    return { method: "webhook", ok: true };
  }

  // 2) Fall back to direct REST API contact creation.
  const apiResult = await tryRestApi(payload);
  if (apiResult.ok) {
    return { method: "api", ok: true, contactId: apiResult.contactId };
  }

  // 3) Nothing configured — application is logged only.
  const reason = !GHL_WEBHOOK_URL && !(GHL_LOCATION_ID && GHL_API_KEY)
    ? "no GHL credentials configured"
    : "all GHL forwarding attempts failed";
  return { method: "none", ok: false, reason };
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      yearsExperience,
      hasLicense,
      apprenticeLicenseDate,
      currentEmployer,
      availability,
      message,
    } = data;

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

    const payload: ApplicationPayload = {
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

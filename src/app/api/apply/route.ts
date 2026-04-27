import { NextResponse } from "next/server";

const GHL_WEBHOOK_URL = process.env.GHL_WEBHOOK_URL;
const GHL_WEBHOOK_SECRET = process.env.GHL_WEBHOOK_SECRET;

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

    const payload = {
      firstName,
      lastName,
      email,
      phone,
      source: "plumbers911jobs.com",
      tags: ["plumbers-911", "website-apply"],
      customField: {
        yearsExperience,
        hasLicense,
        apprenticeLicenseDate: apprenticeLicenseDate || null,
        currentEmployer: currentEmployer || null,
        availability,
        message: message || null,
      },
      submittedAt: new Date().toISOString(),
    };

    // Forward to Go High Level when webhook URL is configured.
    if (GHL_WEBHOOK_URL) {
      try {
        const res = await fetch(GHL_WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(GHL_WEBHOOK_SECRET ? { "x-webhook-secret": GHL_WEBHOOK_SECRET } : {}),
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          console.error(
            `GHL webhook responded with ${res.status}:`,
            await res.text().catch(() => ""),
          );
        }
      } catch (ghlError) {
        console.error("Failed to forward to GHL webhook:", ghlError);
        // We still return success to the user — logs capture the data.
      }
    }

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
    console.log(`GHL forwarding: ${GHL_WEBHOOK_URL ? "enabled" : "disabled (no GHL_WEBHOOK_URL)"}`);
    console.log("=======================");

    return NextResponse.json({ success: true, message: "Application received" });
  } catch (error) {
    console.error("apply route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const { firstName, lastName, email, phone, yearsExperience, hasLicense, apprenticeLicenseDate, currentEmployer, availability, message } = data;

    if (!firstName || !lastName || !email || !phone || !yearsExperience || !hasLicense || !availability) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (hasLicense === "apprentice" && !apprenticeLicenseDate) {
      return NextResponse.json({ error: "Apprentice license start date is required" }, { status: 400 });
    }

    // TODO: Replace with Go High Level webhook URL when ready
    // Example: await fetch('https://services.leadconnectorhq.com/hooks/YOUR_WEBHOOK_ID', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     firstName,
    //     lastName,
    //     email,
    //     phone,
    //     customField: {
    //       yearsExperience,
    //       hasLicense,
    //       currentEmployer,
    //       availability,
    //       message,
    //     },
    //   }),
    // });

    // For now, log the application (visible in server logs)
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
    console.log("=======================");

    return NextResponse.json({ success: true, message: "Application received" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

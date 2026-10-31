import { NextResponse } from "next/server";
import { mapProjects, type MapCity } from "@/content/locations";

/**
 * Private-visit enquiries. Validates on the server as well as in the form, then forwards the lead as
 * JSON to ENQUIRY_WEBHOOK_URL (a CRM, Zapier/Make hook or email relay).
 *
 * Until that variable is set the lead is only written to the server log: connect it before launch.
 */
const CITIES: MapCity[] = ["Surat", "Vapi", "Silvassa", "Daman"];
const TIMES = ["Weekday morning", "Weekday evening", "Weekend"];

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  // Honeypot: real visitors never see this field, so anything in it is a bot. Pretend it worked.
  if (text(body.website, 200)) return NextResponse.json({ ok: true });

  const name = text(body.name, 80);
  const phone = text(body.phone, 20).replace(/\D/g, "");
  const city = text(body.city, 20);
  const project = text(body.project, 80);
  const time = text(body.time, 40);

  if (name.length < 2) return NextResponse.json({ error: "Please enter your name." }, { status: 422 });
  if (!/^[6-9]\d{9}$/.test(phone)) return NextResponse.json({ error: "Please enter a 10-digit mobile number." }, { status: 422 });
  if (city && !CITIES.includes(city as MapCity)) return NextResponse.json({ error: "Unknown city." }, { status: 422 });
  if (project && !mapProjects.some((p) => p.name === project && (!city || p.city === city)))
    return NextResponse.json({ error: "Unknown project." }, { status: 422 });
  if (time && !TIMES.includes(time)) return NextResponse.json({ error: "Unknown visit time." }, { status: 422 });

  const lead = { name, phone: `+91${phone}`, city, project, time, source: "website-private-visit", at: new Date().toISOString() };

  const hook = process.env.ENQUIRY_WEBHOOK_URL;
  if (!hook) {
    console.warn("[enquiry] ENQUIRY_WEBHOOK_URL is not set; lead not forwarded:", lead);
    return NextResponse.json({ ok: true });
  }
  try {
    const res = await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead) });
    if (!res.ok) throw new Error(`webhook ${res.status}`);
  } catch (err) {
    console.error("[enquiry] forwarding failed:", err);
    return NextResponse.json({ error: "We couldn't send this just now." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

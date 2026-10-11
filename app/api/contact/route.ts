import { NextResponse } from "next/server";

/**
 * Contact endpoint.
 *
 * Server-only secrets live in environment variables (never `NEXT_PUBLIC_*`) and
 * the route stays fully functional — with an honest "not configured" response —
 * when nothing is set. Two delivery options are supported:
 *
 *   RESEND_API_KEY + CONTACT_TO_EMAIL  → email via Resend's HTTP API
 *   WEBHOOK_URL                        → any JSON-accepting endpoint
 *
 * Everything is validated by hand (no schema dependency in the client bundle).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Payload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  /** Honeypot — filled only by bots. */
  company?: unknown;
};

const MAX = { name: 120, email: 200, message: 5000 };

/** Naive in-memory throttle. Enough to stop casual form spam on a portfolio. */
const submissions = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (submissions.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);

  // Keep the map from growing without bound on a long-lived server.
  if (submissions.size > 500) {
    for (const [key, times] of submissions) {
      if (times.every((time) => now - time > WINDOW_MS)) submissions.delete(key);
    }
  }

  submissions.set(ip, recent);
  return recent.length > LIMIT;
}

function asTrimmedString(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) return null;
  return trimmed;
}

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, message: "Too many messages from this address. Please try again later." },
      { status: 429 },
    );
  }

  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  // Silently accept and drop honeypot hits — bots get a success, humans get none.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true, message: "Thanks." });
  }

  const name = asTrimmedString(body.name, MAX.name);
  const email = asTrimmedString(body.email, MAX.email);
  const message = asTrimmedString(body.message, MAX.message);

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Please include a name (max 120 characters).";
  if (!email || !isEmail(email)) errors.email = "Please include a valid email address.";
  if (!message || message.length < 10) errors.message = "Please write at least 10 characters.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;

  const summary = { name, email, message, receivedAt: new Date().toISOString() };

  try {
    if (resendKey && to) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: email,
          subject: `Portfolio enquiry from ${name}`,
          text: `${message}\n\n— ${name} <${email}>`,
        }),
      });

      if (!response.ok) {
        const detail = await response.text();
        console.error("[contact] Resend rejected the message:", detail);
        return NextResponse.json(
          { ok: false, message: "The mail provider rejected the message. Please email me directly." },
          { status: 502 },
        );
      }

      return NextResponse.json({ ok: true, message: "Message sent. I'll reply shortly." });
    }

    if (webhookUrl) {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(summary),
      });
      if (!response.ok) throw new Error(`Webhook responded ${response.status}`);
      return NextResponse.json({ ok: true, message: "Message received. I'll reply shortly." });
    }
  } catch (error) {
    console.error("[contact] Delivery failed:", error);
    return NextResponse.json(
      { ok: false, message: "Delivery failed. Please email me directly." },
      { status: 502 },
    );
  }

  // Nothing configured: log for local development and tell the client the truth
  // so it can surface the mailto fallback instead of pretending to send.
  console.info("[contact] No provider configured. Submission:", summary);
  return NextResponse.json(
    {
      ok: false,
      configured: false,
      message:
        "The contact form is not connected to a mail provider yet — use the email link instead.",
    },
    { status: 503 },
  );
}

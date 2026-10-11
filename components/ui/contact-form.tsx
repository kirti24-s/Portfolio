"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, Send, TriangleAlert } from "lucide-react";

import { siteConfig } from "@/data/site-config";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent" | "error" | "unconfigured";

const FIELD =
  "w-full border border-line bg-carbon/40 px-4 py-3 font-sans text-sm text-chrome outline-none transition-colors placeholder:text-ash-dim focus:border-volt/60";

/**
 * Contact form.
 *
 * Posts to `/api/contact`, which validates server-side and returns an explicit
 * `unconfigured` state when no mail provider is set up — so the form never
 * pretends to have sent something it did not. The mailto link is always visible
 * as the guaranteed path.
 */
export function ContactForm({ className }: { className?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("sending");
    setMessage(null);
    setFieldErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        errors?: Record<string, string>;
        configured?: boolean;
      };

      if (payload.errors) setFieldErrors(payload.errors);

      if (response.ok && payload.ok) {
        setStatus("sent");
        setMessage(payload.message ?? "Message sent.");
        form.reset();
        return;
      }

      if (payload.configured === false) {
        setStatus("unconfigured");
        setMessage(payload.message ?? "Use the email link instead.");
        return;
      }

      setStatus("error");
      setMessage(payload.message ?? "Something went wrong. Please email me directly.");
    } catch {
      setStatus("error");
      setMessage("Network error. Please email me directly.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-5", className)} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-name" className="eyebrow">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            maxLength={120}
            placeholder="Ada Lovelace"
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
            className={cn(FIELD, fieldErrors.name && "border-red-400/60")}
          />
          {fieldErrors.name ? (
            <span id="contact-name-error" className="font-mono text-[0.625rem] text-red-300">
              {fieldErrors.name}
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="contact-email" className="eyebrow">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={200}
            placeholder="you@company.com"
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
            className={cn(FIELD, fieldErrors.email && "border-red-400/60")}
          />
          {fieldErrors.email ? (
            <span id="contact-email-error" className="font-mono text-[0.625rem] text-red-300">
              {fieldErrors.email}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-message" className="eyebrow">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          maxLength={5000}
          placeholder="What are you building, and where could I help?"
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
          className={cn(FIELD, "resize-y", fieldErrors.message && "border-red-400/60")}
        />
        {fieldErrors.message ? (
          <span id="contact-message-error" className="font-mono text-[0.625rem] text-red-300">
            {fieldErrors.message}
          </span>
        ) : null}
      </div>

      {/* Honeypot — visually and semantically hidden from humans. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <motion.button
          type="submit"
          disabled={status === "sending"}
          whileHover={{ y: -2 }}
          whileTap={{ y: 0, scale: 0.985 }}
          className="inline-flex h-12 items-center gap-3 bg-volt px-6 text-sm font-medium text-obsidian transition-colors hover:bg-volt-soft disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : status === "sent" ? (
            <Check className="size-4" aria-hidden="true" />
          ) : (
            <Send className="size-4" aria-hidden="true" />
          )}
          {status === "sending" ? "Sending…" : status === "sent" ? "Sent" : "Send message"}
        </motion.button>

        <a
          href={`mailto:${siteConfig.email}`}
          className="font-mono text-[0.6875rem] tracking-[0.16em] text-ash uppercase underline-offset-4 transition-colors hover:text-volt hover:underline"
        >
          or email directly
        </a>
      </div>

      {/* Live region: every outcome is announced, including the honest ones. */}
      <div role="status" aria-live="polite" className="min-h-5">
        {message ? (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex items-start gap-2 font-mono text-[0.6875rem] leading-relaxed tracking-[0.06em]",
              status === "sent" && "text-volt",
              status === "unconfigured" && "text-amber-300",
              status === "error" && "text-red-300",
            )}
          >
            {status === "error" || status === "unconfigured" ? (
              <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            ) : null}
            {message}
          </motion.p>
        ) : null}
      </div>
    </form>
  );
}

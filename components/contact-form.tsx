"use client";

import { useState } from "react";
import { useSite } from "./site-context";
import { Arrow, Check } from "./icons";
import { Field, Toggle } from "./exhibit-flow";
import { countryName, formCountries } from "@/lib/editions";
import { fmt } from "@/lib/i18n";
import { track } from "@/lib/analytics";
import { getAttribution } from "@/lib/attribution";

const emailOk = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
const topics = ["exhibitor", "visitor", "buyer", "partner", "media", "speaker", "other"] as const;

/** Contact / inquiry (PRD §5.1 conversion layer). The topic becomes the CRM lead type. */
export function ContactForm({ initialTopic }: { initialTopic?: string | null }) {
  const { dict, locale, edition } = useSite();
  const d = dict.contact;
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [tried, setTried] = useState(false);
  const [f, setF] = useState({
    type: (topics as readonly string[]).includes(initialTopic ?? "") ? (initialTopic as (typeof topics)[number]) : "other",
    name: "",
    company: "",
    role: "",
    email: "",
    phone: "",
    country: edition === "sn" ? "SN" : "DZ",
    message: "",
    consent: false,
    hp: "",
  });
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((x) => ({ ...x, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (f.name.trim().length < 2 || !emailOk(f.email) || f.message.trim().length < 2) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...f, edition, locale, attribution: getAttribution() }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      track("contact_submitted", { topic: f.type });
    } catch {
      setStatus("error");
    }
  };

  if (status === "done")
    return (
      <div className="rounded-md border border-line bg-graphite p-8 sm:p-12" role="status">
        <span className="grid size-12 place-items-center rounded-full bg-limestone text-basalt">
          <Check size={22} />
        </span>
        <h2 className="display mt-8 text-5xl">{d.successTitle}</h2>
        <p className="mt-4 text-limestone/80">{fmt(d.successLead, { email: f.email })}</p>
      </div>
    );

  return (
    <form noValidate onSubmit={submit} className="rounded-md border border-line bg-graphite/60 p-6 sm:p-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label={d.topic}>
            {(p) => (
              <select {...p} className="field" value={f.type} onChange={(e) => set("type", e.target.value as (typeof topics)[number])}>
                {topics.map((k) => (
                  <option key={k} value={k}>
                    {d.topics[k]}
                  </option>
                ))}
              </select>
            )}
          </Field>
        </div>
        <Field label={dict.form.name} required error={tried && f.name.trim().length < 2 ? dict.form.required : undefined}>
          {(p) => <input {...p} className="field" value={f.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />}
        </Field>
        <Field label={dict.form.email} required error={tried && !emailOk(f.email) ? dict.form.invalidEmail : undefined}>
          {(p) => <input {...p} className="field" type="email" dir="ltr" value={f.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />}
        </Field>
        <Field label={dict.form.company}>
          {(p) => <input {...p} className="field" value={f.company} onChange={(e) => set("company", e.target.value)} autoComplete="organization" />}
        </Field>
        <Field label={dict.form.role}>
          {(p) => <input {...p} className="field" value={f.role} onChange={(e) => set("role", e.target.value)} autoComplete="organization-title" />}
        </Field>
        <Field label={dict.form.phone}>
          {(p) => <input {...p} className="field" type="tel" dir="ltr" value={f.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" />}
        </Field>
        <Field label={dict.form.country}>
          {(p) => (
            <select {...p} className="field" value={f.country} onChange={(e) => set("country", e.target.value)}>
              {formCountries.map((c) => (
                <option key={c} value={c}>
                  {countryName(c, locale)}
                </option>
              ))}
            </select>
          )}
        </Field>
        <div className="sm:col-span-2">
          <Field label={d.message} required error={tried && f.message.trim().length < 2 ? dict.form.required : undefined}>
            {(p) => <textarea {...p} rows={5} className="field" value={f.message} onChange={(e) => set("message", e.target.value)} />}
          </Field>
        </div>
        <input tabIndex={-1} aria-hidden className="hidden" value={f.hp} onChange={(e) => set("hp", e.target.value)} autoComplete="off" />
      </div>
      <div className="mt-6">
        <Toggle label={dict.form.consent} checked={f.consent} onChange={(v) => set("consent", v)} />
      </div>
      {status === "error" && (
        <p role="alert" className="mt-6 text-sm text-[#e59a86]">
          {dict.form.error}
        </p>
      )}
      <button type="submit" disabled={status === "sending"} className="btn btn-solid mt-8 disabled:opacity-60">
        {status === "sending" ? dict.form.sending : d.submit} <Arrow size={16} />
      </button>
    </form>
  );
}

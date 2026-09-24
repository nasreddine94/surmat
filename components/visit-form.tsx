"use client";

import { useState } from "react";
import { useSite } from "./site-context";
import { Arrow, Check } from "./icons";
import { Field, Toggle } from "./exhibit-flow";
import { sectors, type SectorId } from "@/content/sectors";
import { exhibitorBySlug } from "@/content/exhibitors";
import { countryName, formCountries } from "@/lib/editions";
import { fmt, t } from "@/lib/i18n";
import { track } from "@/lib/analytics";

const emailOk = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
const profiles = ["architect", "developer", "contractor", "distributor", "buyer", "manufacturer", "other"] as const;

export function VisitForm({ meeting }: { meeting: string | null }) {
  const { dict, locale, edition } = useSite();
  const d = dict.visit;
  const ex = meeting ? exhibitorBySlug(meeting) : undefined;
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [tried, setTried] = useState(false);
  const [f, setF] = useState({
    profile: "architect" as (typeof profiles)[number],
    interests: [] as SectorId[],
    name: "",
    company: "",
    email: "",
    phone: "",
    country: edition === "sn" ? "SN" : "DZ",
    consent: false,
    hp: "",
  });
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((x) => ({ ...x, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (f.name.trim().length < 2 || !emailOk(f.email)) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: "visitor", edition, locale, meeting: ex?.slug ?? null, ...f }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      track("registration_completed", { profile: f.profile, meeting: ex?.slug });
    } catch {
      setStatus("error");
    }
  };

  if (status === "done")
    return (
      <div className="rounded-2xl border border-line bg-graphite p-8 sm:p-12" role="status">
        <span className="grid size-12 place-items-center rounded-full bg-limestone text-basalt">
          <Check size={22} />
        </span>
        <h2 className="display mt-8 text-5xl">{d.successTitle}</h2>
        <p className="mt-4 text-limestone/80">{fmt(d.successLead, { email: f.email })}</p>
      </div>
    );

  return (
    <form noValidate onSubmit={submit} className="rounded-2xl border border-line bg-graphite/60 p-6 sm:p-10">
      <h2 className="display text-3xl sm:text-4xl">{d.formTitle}</h2>
      {ex && (
        <p className="mt-3 inline-flex rounded-full border border-travertine/40 px-3 py-1 text-sm text-travertine">
          {fmt(d.meetingWith, { name: ex.name })}
        </p>
      )}

      <fieldset className="mt-8">
        <legend className="label">{d.profile}</legend>
        <div className="flex flex-wrap gap-2" role="radiogroup">
          {profiles.map((p) => (
            <button key={p} type="button" role="radio" aria-checked={f.profile === p} className="chip" onClick={() => set("profile", p)}>
              {d.profiles[p]}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-7">
        <legend className="label">{d.interests}</legend>
        <div className="flex flex-wrap gap-2">
          {sectors.map((s) => {
            const on = f.interests.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={on}
                className="chip"
                onClick={() => set("interests", on ? f.interests.filter((x) => x !== s.id) : [...f.interests, s.id])}
              >
                <span className="size-2 rounded-full" style={{ background: s.accent }} />
                {t(s.short, locale)}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Field label={dict.form.name} required error={tried && f.name.trim().length < 2 ? dict.form.required : undefined}>
          {(p) => <input {...p} className="field" value={f.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />}
        </Field>
        <Field label={dict.form.company}>
          {(p) => <input {...p} className="field" value={f.company} onChange={(e) => set("company", e.target.value)} autoComplete="organization" />}
        </Field>
        <Field label={dict.form.email} required error={tried && !emailOk(f.email) ? dict.form.invalidEmail : undefined}>
          {(p) => <input {...p} className="field" type="email" dir="ltr" value={f.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />}
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

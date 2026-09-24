"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useSite } from "./site-context";
import { Swatch } from "./swatch";
import { Arrow, Check } from "./icons";
import { sectors, sectorById, type SectorId } from "@/content/sectors";
import { countryName, formCountries } from "@/lib/editions";
import { fmt, t } from "@/lib/i18n";
import { recommendSpace } from "@/lib/space";
import { track } from "@/lib/analytics";

const emailOk = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);

type State = {
  sectors: SectorId[];
  company: string;
  website: string;
  country: string;
  families: number;
  brands: number;
  machinery: boolean;
  demo: boolean;
  meetingRoom: boolean;
  description: string;
  space: number | "";
  name: string;
  role: string;
  email: string;
  phone: string;
  consent: boolean;
  hp: string; // honeypot
};

export function ExhibitFlow({ initialSector, stand }: { initialSector: SectorId | null; stand: string | null }) {
  const { dict, locale, edition } = useSite();
  const d = dict.exhibit;
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [tried, setTried] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [s, setS] = useState<State>({
    sectors: initialSector ? [initialSector] : [],
    company: "",
    website: "",
    country: edition === "sn" ? "SN" : "DZ",
    families: 2,
    brands: 1,
    machinery: initialSector === "surface-technologies",
    demo: false,
    meetingRoom: false,
    description: "",
    space: "",
    name: "",
    role: "",
    email: "",
    phone: "",
    consent: true,
    hp: "",
  });
  const set = <K extends keyof State>(k: K, v: State[K]) => setS((x) => ({ ...x, [k]: v }));
  const rec = useMemo(() => recommendSpace(s), [s]);
  const heading = useRef<HTMLHeadingElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (step > 0) heading.current?.focus();
  }, [step]);

  const valid = [
    s.sectors.length > 0,
    s.company.trim().length > 1,
    true,
    true,
    s.name.trim().length > 1 && emailOk(s.email),
  ];

  const next = () => {
    setTried(true);
    if (!valid[step]) return;
    if (!started.current) {
      started.current = true;
      track("application_started", { sector: s.sectors[0] });
    }
    setTried(false);
    track("application_step", { step: step + 1 });
    setStep((x) => x + 1);
  };

  const submit = async () => {
    setTried(true);
    if (!valid.every(Boolean)) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "exhibitor",
          edition,
          locale,
          stand,
          ...s,
          space: s.space || rec.min,
          recommended: rec,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("done");
      track("application_completed", { sectors: s.sectors.join(","), space: s.space || rec.min });
    } catch {
      setStatus("error");
    }
  };

  const primary = s.sectors[0] ? sectorById(s.sectors[0]) : undefined;

  if (status === "done")
    return (
      <div className="relative overflow-hidden rounded-2xl border border-line">
        <Swatch tex={primary?.tex ?? "calacatta"} seed={primary?.seed ?? 7} res={512} className="absolute inset-0" eager />
        <div className="relative bg-gradient-to-t from-basalt via-basalt/85 to-basalt/40 px-6 py-20 sm:px-12">
          <span className="grid size-12 place-items-center rounded-full bg-limestone text-basalt">
            <Check size={22} />
          </span>
          <h2 className="display mt-8 text-5xl sm:text-6xl" tabIndex={-1}>
            {d.successTitle}
          </h2>
          <p className="mt-4 max-w-lg text-limestone/80">
            {fmt(d.successLead, { email: s.email, sector: primary ? t(primary.short, locale) : "" })}
          </p>
        </div>
      </div>
    );

  const titles = [d.manufacture, d.companyTitle, d.portfolioTitle, d.spaceTitle, d.contactTitle];

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (step < 4) next();
        else submit();
      }}
      className="rounded-2xl border border-line bg-graphite/60"
    >
      <ol className="flex border-b border-line" aria-label={d.title}>
        {d.steps.map((label, i) => (
          <li key={label} className="flex-1">
            <button
              type="button"
              disabled={i > step}
              onClick={() => i < step && setStep(i)}
              aria-current={i === step ? "step" : undefined}
              className="relative flex w-full flex-col items-start gap-1 px-3 py-4 text-start text-[0.7rem] text-fog disabled:cursor-default aria-[current]:text-limestone sm:px-5 sm:text-xs"
            >
              <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <span className="hidden sm:block">{label}</span>
              <span
                className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-travertine transition-transform duration-500 rtl:origin-right"
                style={{ transform: `scaleX(${i < step ? 1 : i === step ? 0.5 : 0})` }}
              />
            </button>
          </li>
        ))}
      </ol>

      <div className="p-6 sm:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={reduce ? false : { opacity: 0, x: locale === "ar" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 ref={heading} tabIndex={-1} className="display text-3xl outline-none sm:text-4xl">
              {titles[step]}
            </h2>

            {step === 0 && (
              <fieldset className="mt-8">
                <legend className="sr-only">{d.manufacture}</legend>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {sectors.map((x) => {
                    const on = s.sectors.includes(x.id);
                    return (
                      <label key={x.id} className="group relative cursor-pointer">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={on}
                          onChange={() => set("sectors", on ? s.sectors.filter((y) => y !== x.id) : [...s.sectors, x.id])}
                        />
                        <Swatch
                          tex={x.tex}
                          seed={x.seed}
                          res={320}
                          className={`aspect-[4/3] rounded-lg transition peer-focus-visible:ring-2 peer-focus-visible:ring-travertine ${on ? "ring-2 ring-limestone" : "ring-1 ring-line"}`}
                        >
                          <div className={`absolute inset-0 transition ${on ? "bg-black/10" : "bg-black/45 group-hover:bg-black/30"}`} />
                          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/75 to-transparent" />
                          <span className="absolute inset-x-3 bottom-3 text-sm leading-tight">{t(x.name, locale)}</span>
                          {on && (
                            <span className="absolute end-3 top-3 grid size-6 place-items-center rounded-full bg-limestone text-basalt">
                              <Check size={14} />
                            </span>
                          )}
                        </Swatch>
                      </label>
                    );
                  })}
                </div>
                {tried && !valid[0] && <p className="mt-4 text-sm text-[#e59a86]">{d.pickOne}</p>}
              </fieldset>
            )}

            {step === 1 && (
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <Field label={d.companyName} required error={tried && !valid[1] ? dict.form.required : undefined}>
                  {(p) => <input {...p} className="field" value={s.company} onChange={(e) => set("company", e.target.value)} autoComplete="organization" />}
                </Field>
                <Field label={d.website}>
                  {(p) => <input {...p} className="field" type="url" inputMode="url" dir="ltr" value={s.website} onChange={(e) => set("website", e.target.value)} placeholder="https://" />}
                </Field>
                <Field label={d.country}>
                  {(p) => (
                    <select {...p} className="field" value={s.country} onChange={(e) => set("country", e.target.value)}>
                      {formCountries.map((c) => (
                        <option key={c} value={c}>
                          {countryName(c, locale)}
                        </option>
                      ))}
                      <option value="OTHER">…</option>
                    </select>
                  )}
                </Field>
                <div className="sm:col-span-2">
                  <input tabIndex={-1} aria-hidden className="hidden" value={s.hp} onChange={(e) => set("hp", e.target.value)} autoComplete="off" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <Stepper label={d.families} value={s.families} min={1} max={30} onChange={(v) => set("families", v)} />
                <Stepper label={d.brands} value={s.brands} min={1} max={15} onChange={(v) => set("brands", v)} />
                <div className="space-y-3 sm:col-span-2">
                  <Toggle label={d.machinery} checked={s.machinery} onChange={(v) => set("machinery", v)} />
                  <Toggle label={d.demo} checked={s.demo} onChange={(v) => set("demo", v)} />
                  <Toggle label={d.meetingRoom} checked={s.meetingRoom} onChange={(v) => set("meetingRoom", v)} />
                </div>
                <div className="sm:col-span-2">
                  <Field label={d.description}>
                    {(p) => <textarea {...p} rows={3} className="field" value={s.description} onChange={(e) => set("description", e.target.value)} />}
                  </Field>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="mt-8">
                <div className="rounded-xl border border-line bg-basalt p-6">
                  <p className="text-sm text-limestone/80">{fmt(d.recommended, { min: rec.min, max: rec.max })}</p>
                  <div className="mt-6 flex items-end gap-2" aria-hidden>
                    {[rec.min, Math.round((rec.min + rec.max) / 2 / 9) * 9, rec.max].map((m, i) => (
                      <button
                        key={i}
                        type="button"
                        tabIndex={-1}
                        onClick={() => set("space", m)}
                        className={`flex flex-col items-center justify-end rounded-md border text-xs transition ${
                          (s.space || rec.min) === m ? "border-limestone bg-limestone/10" : "border-line hover:border-fog"
                        }`}
                        style={{ width: `${Math.sqrt(m) * 9}px`, height: `${Math.sqrt(m) * 9}px` }}
                      >
                        <span className="pb-1.5">{m} m²</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-6 max-w-xs">
                  <Field label={d.requested}>
                    {(p) => (
                      <input
                        {...p}
                        className="field"
                        type="number"
                        min={9}
                        step={9}
                        inputMode="numeric"
                        value={s.space === "" ? rec.min : s.space}
                        onChange={(e) => set("space", e.target.value ? Number(e.target.value) : "")}
                      />
                    )}
                  </Field>
                </div>
                {stand && (
                  <p className="mt-4 text-sm text-travertine">
                    {dict.exhibitors.stand} {stand}
                  </p>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <Field label={dict.form.name} required error={tried && s.name.trim().length < 2 ? dict.form.required : undefined}>
                  {(p) => <input {...p} className="field" value={s.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />}
                </Field>
                <Field label={dict.form.role}>
                  {(p) => <input {...p} className="field" value={s.role} onChange={(e) => set("role", e.target.value)} autoComplete="organization-title" />}
                </Field>
                <Field label={dict.form.email} required error={tried && !emailOk(s.email) ? dict.form.invalidEmail : undefined}>
                  {(p) => <input {...p} className="field" type="email" dir="ltr" value={s.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />}
                </Field>
                <Field label={dict.form.phone}>
                  {(p) => <input {...p} className="field" type="tel" dir="ltr" value={s.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" />}
                </Field>
                <div className="sm:col-span-2">
                  <Toggle label={dict.form.consent} checked={s.consent} onChange={(v) => set("consent", v)} />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {status === "error" && (
          <p role="alert" className="mt-6 text-sm text-[#e59a86]">
            {dict.form.error}
          </p>
        )}

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-line pt-6">
          {step > 0 ? (
            <button type="button" onClick={() => setStep((x) => x - 1)} className="btn btn-ghost btn-sm">
              {d.back}
            </button>
          ) : (
            <span />
          )}
          <button type="submit" disabled={status === "sending"} className="btn btn-solid disabled:opacity-60">
            {status === "sending" ? dict.form.sending : step < 4 ? d.next : d.submit}
            <Arrow size={16} />
          </button>
        </div>
      </div>
    </form>
  );
}

export function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: (p: { id: string; "aria-invalid"?: boolean; "aria-describedby"?: string; required?: boolean }) => React.ReactNode;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
        {required && <span aria-hidden> *</span>}
      </label>
      {children({ id, required, "aria-invalid": error ? true : undefined, "aria-describedby": error ? `${id}-e` : undefined })}
      {error && (
        <p id={`${id}-e`} className="mt-1.5 text-xs text-[#e59a86]">
          {error}
        </p>
      )}
    </div>
  );
}

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm">
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="relative h-6 w-10 shrink-0 rounded-full border border-line bg-basalt transition peer-checked:border-travertine peer-checked:bg-travertine/30 peer-focus-visible:ring-2 peer-focus-visible:ring-travertine after:absolute after:top-0.5 after:start-0.5 after:size-[1.125rem] after:rounded-full after:bg-fog after:transition-all peer-checked:after:start-[1.1rem] peer-checked:after:bg-limestone" />
      <span className="text-limestone/85">{label}</span>
    </label>
  );
}

function Stepper({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div>
      <p className="label">{label}</p>
      <div className="flex h-12 items-center rounded-lg border border-line bg-graphite">
        <button type="button" className="grid h-full w-12 place-items-center text-lg hover:bg-ash" onClick={() => onChange(Math.max(min, value - 1))} aria-label={`${label} −`}>
          −
        </button>
        <output className="flex-1 text-center tabular-nums" aria-live="polite">
          {value}
        </output>
        <button type="button" className="grid h-full w-12 place-items-center text-lg hover:bg-ash" onClick={() => onChange(Math.min(max, value + 1))} aria-label={`${label} +`}>
          +
        </button>
      </div>
    </div>
  );
}

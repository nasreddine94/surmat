import type { Metadata } from "next";
import { EventBand } from "@/components/event-band";
import Link from "next/link";
import { Arrow, Check } from "@/components/icons";
import { Swatch } from "@/components/swatch";
import { alternates, href, resolve } from "@/lib/routing";

export async function generateMetadata({ params }: PageProps<"/[edition]/[locale]/pro">): Promise<Metadata> {
  const { edition, locale, dict } = await resolve(params);
  return { title: dict.pro.title, description: dict.pro.lead, alternates: alternates({ edition, locale }, "pro"), robots: { index: false } };
}

/** Espace Pro (PRD §56): announced here; the gated area opens to confirmed exhibitors. */
export default async function ProPage({ params }: PageProps<"/[edition]/[locale]/pro">) {
  const { edition, locale, dict, ed } = await resolve(params);
  const c = { edition, locale };
  const p = dict.pro;
  return (
    <div className="shell pt-32">
      <div className="relative overflow-hidden rounded-md border border-line">
        <Swatch tex="nero" seed={4} res={640} className="absolute inset-0" />
        <div className="relative grid gap-12 bg-gradient-to-tr from-ink via-ink/90 to-ink/60 p-8 sm:p-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="eyebrow">SURMAT</p>
            <h1 className="display mt-4 text-5xl sm:text-7xl">{p.title}</h1>
            <p className="mt-5 max-w-md text-limestone/80">{p.lead}</p>
            <p className="mt-8 inline-flex rounded-xs border border-gold/40 px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-gold">{p.soon}</p>
          </div>
          <ul className="space-y-4 self-center text-sm text-limestone/85">
            {p.features.map((f) => (
              <li key={f} className="flex gap-3">
                <Check size={18} className="mt-0.5 shrink-0 text-gold" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          { label: p.exhibitorCta, path: "exhibit" },
          { label: p.visitorCta, path: "visit" },
          { label: p.contactCta, path: "contact?topic=exhibitor" },
        ].map((x) => (
          <Link key={x.path} href={href(c, x.path)} className="group flex items-center justify-between rounded-md border border-line p-6 hover:border-line-strong">
            {x.label}
            <span className="arrow-circle">
              <Arrow size={14} />
            </span>
          </Link>
        ))}
      </div>
      <EventBand dict={dict} c={c} ed={ed} bare />
    </div>
  );
}

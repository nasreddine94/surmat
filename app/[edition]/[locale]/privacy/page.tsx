import type { Metadata } from "next";
import Link from "next/link";
import { alternates, href, resolve } from "@/lib/routing";

export async function generateMetadata({ params }: PageProps<"/[edition]/[locale]/privacy">): Promise<Metadata> {
  const { edition, locale, dict } = await resolve(params);
  return { title: dict.privacy.title, description: dict.privacy.lead, alternates: alternates({ edition, locale }, "privacy") };
}

/** What this site actually collects and why (PRD §71). Keep in step with app/api/*. */
export default async function PrivacyPage({ params }: PageProps<"/[edition]/[locale]/privacy">) {
  const { edition, locale, dict } = await resolve(params);
  const p = dict.privacy;
  return (
    <article className="shell max-w-3xl pt-32">
      <h1 className="display text-5xl sm:text-7xl">{p.title}</h1>
      <p className="mt-5 text-limestone/75">{p.lead}</p>
      {p.sections.map((s) => (
        <section key={s.title} className="mt-10 border-t border-line pt-8">
          <h2 className="eyebrow">{s.title}</h2>
          <p className="mt-4 leading-relaxed text-limestone/80">{s.text}</p>
        </section>
      ))}
      <p className="mt-12 text-sm">
        <Link href={href({ edition, locale }, "contact?topic=other")} className="btn btn-ghost">
          {dict.footer.contact}
        </Link>
      </p>
    </article>
  );
}

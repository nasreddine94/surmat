import type { Metadata } from "next";
import Link from "next/link";
import { alternates, href, resolve } from "@/lib/routing";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[edition]/[locale]/legal">): Promise<Metadata> {
  const { edition, locale, dict } = await resolve(params);
  return { title: dict.legal.title, alternates: alternates({ edition, locale }, "legal") };
}

export default async function LegalPage({ params }: PageProps<"/[edition]/[locale]/legal">) {
  const { edition, locale, dict } = await resolve(params);
  const l = dict.legal;
  const o = site.organiser;
  const publisher = [o.name, o.address, o.registration, o.email].filter(Boolean);
  return (
    <article className="shell max-w-3xl pt-32">
      <h1 className="display text-5xl sm:text-7xl">{l.title}</h1>
      <section className="mt-12 border-t border-line pt-8">
        <h2 className="eyebrow">{l.publisher}</h2>
        {publisher.length ? (
          <address className="mt-4 whitespace-pre-line not-italic text-limestone/85">{publisher.join("\n")}</address>
        ) : (
          <p className="mt-4 text-limestone/75">{l.pending}</p>
        )}
      </section>
      <section className="mt-10 border-t border-line pt-8">
        <h2 className="eyebrow">{l.hosting}</h2>
        <p className="mt-4 text-limestone/75">{l.hostingText}</p>
      </section>
      <section className="mt-10 border-t border-line pt-8">
        <h2 className="eyebrow">{l.ip}</h2>
        <p className="mt-4 text-limestone/75">{l.ipText}</p>
      </section>
      <p className="mt-12 text-sm">
        <Link href={href({ edition, locale }, "privacy")} className="underline decoration-line underline-offset-4">
          {dict.footer.privacy}
        </Link>
        {" · "}
        <Link href={href({ edition, locale }, "contact")} className="underline decoration-line underline-offset-4">
          {dict.footer.contact}
        </Link>
      </p>
    </article>
  );
}

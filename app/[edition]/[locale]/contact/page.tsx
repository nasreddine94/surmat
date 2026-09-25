import type { Metadata } from "next";
import { EventBand } from "@/components/event-band";
import { ContactForm } from "@/components/contact-form";
import { alternates, resolve } from "@/lib/routing";
import { editions } from "@/lib/editions";
import { t } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[edition]/[locale]/contact">): Promise<Metadata> {
  const { edition, locale, dict } = await resolve(params);
  return { title: dict.contact.title, description: dict.contact.lead, alternates: alternates({ edition, locale }, "contact") };
}

export default async function ContactPage({ params, searchParams }: PageProps<"/[edition]/[locale]/contact">) {
  const { edition, locale, dict, ed } = await resolve(params);
  const sp = await searchParams;
  const topic = typeof sp.topic === "string" ? sp.topic : null;
  return (
    <>
      <div className="shell grid gap-12 pt-32 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <p className="eyebrow">{t(ed.name, locale)}</p>
          <h1 className="display mt-4 text-5xl sm:text-7xl">{dict.contact.title}</h1>
          <p className="mt-5 max-w-md text-limestone/75">{dict.contact.lead}</p>
          <dl className="mt-10 space-y-6 text-sm">
            {(["dz", "sn"] as const).map((id) => (
              <div key={id} className={id === edition ? "" : "opacity-70"}>
                <dt className="eyebrow">{t(editions[id].name, locale)}</dt>
                <dd className="mt-2 text-limestone/80">
                  {t(editions[id].city, locale)}
                  {editions[id].venue && <> · {t(editions[id].venue!, locale)}</>}
                  {editions[id].contactEmail && (
                    <a href={`mailto:${editions[id].contactEmail}`} className="mt-1 block text-gold" dir="ltr">
                      {editions[id].contactEmail}
                    </a>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <ContactForm initialTopic={topic} />
      </div>
      <EventBand dict={dict} c={{ edition, locale }} ed={ed} />
    </>
  );
}

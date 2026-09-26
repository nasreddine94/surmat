import { JsonLd, faqJsonLd } from "./json-ld";
import { Plus } from "./icons";
import { faq, glance, type FaqId } from "@/content/answers";
import { familyCount, familyGroups } from "@/content/families";
import { editionIds, editions, type Edition } from "@/lib/editions";
import { fmt, localeLabel, locales, t, type Dict, type Locale } from "@/lib/i18n";

/** Values that fill the answer templates, taken from live edition data. */
function answerVars(ed: Edition, locale: Locale, dict: Dict) {
  return {
    edition: t(ed.name, locale),
    venue: ed.venue ? t(ed.venue, locale) : `${t(ed.city, locale)} (${dict.edition.venueTBA})`,
    dates: ed.dates ? t(ed.dates, locale) : dict.edition.datesTBA,
    districts: familyGroups.length,
    families: familyCount,
    list: familyGroups.map((g) => t(g.name, locale)).join(", "),
    exhibitors: ed.targets.exhibitors,
    visitors: ed.targets.visitors,
  };
}

/** The same Q&As as plain text, for FAQPage structured data and llms.txt. */
export function answers(ed: Edition, locale: Locale, dict: Dict, only?: FaqId[]) {
  const v = answerVars(ed, locale, dict);
  return faq.filter((f) => !only || only.includes(f.id)).map((f) => ({ q: fmt(t(f.q, locale), v), a: fmt(t(f.a, locale), v) }));
}

/**
 * Answer-first block (AEO / GEO): the key facts as a definition list and the common questions
 * with short, self-contained answers — visible on the page and mirrored in FAQPage JSON-LD.
 */
export function AnswersSection({ ed, locale, dict, only, facts = true }: { ed: Edition; locale: Locale; dict: Dict; only?: FaqId[]; facts?: boolean }) {
  const v = answerVars(ed, locale, dict);
  const qa = answers(ed, locale, dict, only);
  const rows: [string, string][] = [
    [t(glance.event, locale), t(glance.eventValue, locale)],
    [t(glance.venue, locale), v.venue],
    [t(glance.dates, locale), v.dates],
    [t(glance.scope, locale), fmt(t(glance.scopeValue, locale), v)],
    [t(glance.audience, locale), fmt(t(glance.audienceValue, locale), v)],
    [t(glance.admission, locale), t(glance.admissionValue, locale)],
    [t(glance.editions, locale), editionIds.map((id) => `${t(editions[id].name, locale)} — ${t(editions[id].city, locale)}`).join(" · ")],
    [t(glance.languages, locale), locales.map((l) => localeLabel[l].name).join(" · ")],
  ];

  return (
    <section className="shell pt-24 sm:pt-32" aria-labelledby="h-answers">
      <JsonLd data={faqJsonLd(qa)} />
      <div className={`grid gap-10 ${facts ? "lg:grid-cols-[0.9fr_1.1fr] lg:gap-16" : ""}`}>
        {facts && (
          <div>
            <p className="eyebrow">{t(glance.eyebrow, locale)}</p>
            <h2 id="h-answers" className="display mt-4 text-4xl sm:text-5xl">
              {t(glance.title, locale)}
            </h2>
            <dl className="mt-8 divide-y divide-line border-y border-line text-sm">
              {rows.map(([k, val]) => (
                <div key={k} className="grid gap-1 py-3.5 sm:grid-cols-[9rem_1fr] sm:gap-6">
                  <dt className="text-fog">{k}</dt>
                  <dd className="text-limestone/90">{val}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
        <div>
          <h2 id={facts ? undefined : "h-answers"} className={facts ? "eyebrow" : "display text-4xl sm:text-5xl"}>
            {t(glance.faqTitle, locale)}
          </h2>
          <div className={`divide-y divide-line border-y border-line ${facts ? "mt-8" : "mt-8"}`}>
            {qa.map(({ q, a }, i) => (
              // Answers stay in the HTML when collapsed, so search and AI crawlers read them.
              <details key={q} className="group py-1" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-4 text-start text-base text-limestone marker:hidden sm:text-lg [&::-webkit-details-marker]:hidden">
                  <h3 className="font-normal">{q}</h3>
                  <Plus size={18} className="mt-1 shrink-0 text-fog transition-transform duration-300 group-open:rotate-45" />
                </summary>
                <p className="max-w-2xl pb-5 text-sm leading-relaxed text-limestone/75">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { editionIds, editions, type EditionId } from "@/lib/editions";
import { fmt, getDict, langTag, localeLabel, locales, t, type Locale } from "@/lib/i18n";
import { sectors } from "@/content/sectors";
import { site } from "@/lib/site";

export function Footer({ edition, locale }: { edition: EditionId; locale: Locale }) {
  const dict = getDict(locale);
  const base = `/${edition}/${locale}`;
  return (
    <footer className="mt-32 border-t border-line">
      <div className="shell grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
        <div>
          <p className="wordmark text-2xl">SURMAT</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-fog">{dict.footer.tagline}</p>
        </div>
        <div>
          <h2 className="eyebrow mb-4">{dict.nav.materials}</h2>
          <ul className="space-y-2.5 text-sm text-limestone/80">
            {sectors.map((s) => (
              <li key={s.id}>
                <Link className="hover:text-limestone" href={`${base}/materials/${s.id}`}>
                  {t(s.name, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="eyebrow mb-4">{dict.footer.platform}</h2>
          <ul className="space-y-2.5 text-sm text-limestone/80">
            {(["board", "applications", "exhibitors", "experience", "visit", "exhibit", "partners"] as const).map((k) => (
              <li key={k}>
                <Link className="hover:text-limestone" href={`${base}/${k}`}>
                  {dict.nav[k]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="eyebrow mb-4">{dict.footer.editions}</h2>
          <ul className="space-y-2.5 text-sm text-limestone/80">
            {editionIds.map((id) => (
              <li key={id}>
                <Link className="hover:text-limestone" href={`/${id}/${locale}`}>
                  {t(editions[id].name, locale)} — {t(editions[id].city, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="eyebrow mb-4">{dict.footer.languages}</h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm text-limestone/80">
            {locales.map((l) => (
              <li key={l}>
                <Link lang={langTag(l)} hrefLang={langTag(l)} href={`/${edition}/${l}`} aria-current={l === locale ? "true" : undefined} className="hover:text-limestone aria-[current]:text-gold">
                  {localeLabel[l].name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="shell flex flex-col gap-4 border-t border-line py-6 text-xs text-fog md:flex-row md:items-center md:justify-between">
        <p>{fmt(dict.footer.rights, { year: new Date().getFullYear() })}</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {(["legal", "privacy", "contact"] as const).map((k) => (
            <li key={k}>
              <Link href={`${base}/${k}`} className="hover:text-limestone">
                {dict.footer[k]}
              </Link>
            </li>
          ))}
          <li>
            <Link href={`${base}/pro`} className="hover:text-limestone">
              {dict.nav.pro}
            </Link>
          </li>
          {(Object.entries(site.social) as [keyof typeof site.social, string | null][])
            .filter(([, url]) => url)
            .map(([k, url]) => (
              <li key={k}>
                <a href={url!} rel="noopener" target="_blank" className="hover:text-limestone">
                  {{ linkedin: "LinkedIn", instagram: "Instagram", youtube: "YouTube" }[k]}
                </a>
              </li>
            ))}
        </ul>
      </div>
    </footer>
  );
}

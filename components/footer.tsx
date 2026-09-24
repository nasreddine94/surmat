import Link from "next/link";
import { editionIds, editions, type EditionId } from "@/lib/editions";
import { fmt, getDict, localeLabel, locales, t, type Locale } from "@/lib/i18n";
import { sectors } from "@/content/sectors";

export function Footer({ edition, locale }: { edition: EditionId; locale: Locale }) {
  const dict = getDict(locale);
  const base = `/${edition}/${locale}`;
  return (
    <footer className="mt-32 border-t border-line">
      <div className="shell grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
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
            {(["applications", "exhibitors", "experience", "visit", "exhibit"] as const).map((k) => (
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
          <ul className="mt-6 flex gap-3 text-xs text-fog">
            {locales.map((l) => (
              <li key={l}>
                <Link lang={l} hrefLang={l} href={`/${edition}/${l}`} className="hover:text-limestone">
                  {localeLabel[l].name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="shell border-t border-line py-6 text-xs text-fog">
        {fmt(dict.footer.rights, { year: new Date().getFullYear() })}
      </div>
    </footer>
  );
}

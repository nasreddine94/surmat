"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { useSite } from "./site-context";
import { MaterialTile } from "./material-tile";
import { SearchIcon } from "./icons";
import { sectors, type SectorId } from "@/content/sectors";
import { materials } from "@/content/materials";
import { fmt, t } from "@/lib/i18n";
import { search } from "@/lib/search";

export function Catalogue({ initialSector }: { initialSector: SectorId | null }) {
  const { dict, locale, link } = useSite();
  const [sector, setSector] = useState<SectorId | null>(initialSector);
  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);

  const list = useMemo(() => {
    let l = dq.trim() ? search(dq).materials : materials;
    if (sector) l = l.filter((m) => m.sector === sector);
    return l;
  }, [dq, sector]);

  const choose = (s: SectorId | null) => {
    setSector(s);
    const url = new URL(window.location.href);
    if (s) url.searchParams.set("sector", s);
    else url.searchParams.delete("sector");
    window.history.replaceState(null, "", url);
  };

  const grouped = !dq.trim();

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-4 border-b border-line bg-basalt/85 px-4 py-4 backdrop-blur-xl md:-mx-8 md:px-8 lg:top-[4.5rem] xl:-mx-12 xl:px-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <label className="flex h-11 items-center gap-3 rounded-full border border-line px-4 focus-within:border-travertine lg:w-80">
            <SearchIcon size={16} className="text-fog" />
            <span className="sr-only">{dict.catalogue.search}</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={dict.catalogue.search}
              className="h-full w-full bg-transparent text-sm outline-none placeholder:text-fog"
            />
          </label>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:pb-0" role="group">
            <button type="button" className="chip shrink-0" aria-pressed={!sector} onClick={() => choose(null)}>
              {dict.catalogue.all}
            </button>
            {sectors.map((s) => (
              <button key={s.id} type="button" className="chip shrink-0" aria-pressed={sector === s.id} onClick={() => choose(s.id)}>
                <span className="size-2 rounded-full" style={{ background: s.accent }} />
                {t(s.short, locale)}
              </button>
            ))}
          </div>
          <p className="text-xs text-fog lg:ms-auto" aria-live="polite">
            {fmt(dict.catalogue.count, { n: list.length })}
          </p>
        </div>
      </div>

      {list.length === 0 && <p className="py-20 text-center text-fog">{fmt(dict.catalogue.noResults, { q: dq })}</p>}

      {grouped
        ? sectors
            .filter((s) => !sector || s.id === sector)
            .map((s) => {
              const items = list.filter((m) => m.sector === s.id);
              return (
                <section key={s.id} className="border-b border-line py-12" aria-labelledby={`sec-${s.id}`}>
                  <div className="mb-6 flex items-end justify-between gap-6">
                    <div>
                      <p className="eyebrow">
                        {dict.exhibitors.district} {String.fromCharCode(64 + s.order)}
                      </p>
                      <h2 id={`sec-${s.id}`} className="display mt-2 text-3xl sm:text-4xl">
                        {t(s.name, locale)}
                      </h2>
                    </div>
                    <Link href={link(`materials/${s.id}`)} className="hidden shrink-0 text-sm text-limestone/70 hover:text-limestone sm:block">
                      {dict.common.learnMore} →
                    </Link>
                  </div>
                  <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {items.map((m) => (
                      <li key={m.slug}>
                        <MaterialTile material={m} />
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })
        : list.length > 0 && (
            <ul className="grid grid-cols-2 gap-3 py-12 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {list.map((m) => (
                <li key={m.slug}>
                  <MaterialTile material={m} showSector />
                </li>
              ))}
            </ul>
          )}
    </div>
  );
}

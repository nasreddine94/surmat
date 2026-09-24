"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useSite } from "./site-context";
import { Swatch } from "./swatch";
import { Arrow, Close, SearchIcon } from "./icons";
import { search } from "@/lib/search";
import { fmt, t } from "@/lib/i18n";
import { sectorById } from "@/content/sectors";
import { track } from "@/lib/analytics";

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-3">
      <h3 className="eyebrow px-2 pb-2">{title}</h3>
      <ul>{children}</ul>
    </section>
  );
}

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { dict, locale, edition, link } = useSite();
  const ref = useRef<HTMLDialogElement>(null);
  const [q, setQ] = useState("");
  const dq = useDeferredValue(q);
  const res = useMemo(() => search(dq, edition), [dq, edition]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => {
    if (dq.trim().length < 3) return;
    const id = setTimeout(() => track("search", { q: dq, results: res.materials.length }), 800);
    return () => clearTimeout(id);
  }, [dq, res.materials.length]);

  const total = res.materials.length + res.sectors.length + res.applications.length + res.exhibitors.length;

  const row = "flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-ash focus-visible:bg-ash";

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-label={dict.search.title}
      className="m-auto mt-[8vh] w-[min(44rem,calc(100vw-2rem))] max-h-[80vh] overflow-hidden rounded-2xl border border-line bg-graphite p-0 text-limestone shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 border-b border-line px-4">
        <SearchIcon size={18} className="shrink-0 text-fog" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={dict.search.placeholder}
          aria-label={dict.search.title}
          className="h-14 w-full bg-transparent text-base outline-none placeholder:text-fog"
        />
        <button type="button" onClick={onClose} aria-label={dict.nav.close} className="grid size-9 shrink-0 place-items-center rounded-full hover:bg-ash">
          <Close size={16} />
        </button>
      </div>
      <div className="max-h-[calc(80vh-3.5rem)] overflow-y-auto px-2 pb-3" onClick={(e) => (e.target as HTMLElement).closest("a") && onClose()}>
        {!q.trim() && <p className="px-2 py-6 text-sm text-fog">{dict.search.empty}</p>}
        {q.trim() && total === 0 && <p className="px-2 py-6 text-sm text-fog">{fmt(dict.search.none, { q })}</p>}
        {res.materials.length > 0 && (
          <Group title={dict.search.materials}>
            {res.materials.slice(0, 6).map((m) => (
              <li key={m.slug}>
                <Link href={link(`materials/${m.slug}`)} className={row}>
                  <Swatch tex={m.tex} seed={m.seed} res={96} className="size-9 shrink-0 rounded-md" eager />
                  <span className="flex-1">
                    <span className="block text-sm">{t(m.name, locale)}</span>
                    <span className="block text-xs text-fog">{t(sectorById(m.sector)!.name, locale)}</span>
                  </span>
                  <Arrow size={14} className="text-fog" />
                </Link>
              </li>
            ))}
          </Group>
        )}
        {res.applications.length > 0 && (
          <Group title={dict.search.applications}>
            {res.applications.slice(0, 3).map((a) => (
              <li key={a.id}>
                <Link href={link(`applications/${a.id}`)} className={row}>
                  <span className="flex-1 text-sm">
                    {t(a.name, locale)} <span className="text-fog">· {t(a.sub, locale)}</span>
                  </span>
                  <Arrow size={14} className="text-fog" />
                </Link>
              </li>
            ))}
          </Group>
        )}
        {res.sectors.length > 0 && (
          <Group title={dict.search.sectors}>
            {res.sectors.slice(0, 3).map((s) => (
              <li key={s.id}>
                <Link href={link(`materials/${s.id}`)} className={row}>
                  <span className="size-2 rounded-full" style={{ background: s.accent }} />
                  <span className="flex-1 text-sm">{t(s.name, locale)}</span>
                  <Arrow size={14} className="text-fog" />
                </Link>
              </li>
            ))}
          </Group>
        )}
        {res.exhibitors.length > 0 && (
          <Group title={dict.search.exhibitors}>
            {res.exhibitors.slice(0, 4).map((e) => (
              <li key={e.slug}>
                <Link href={link(`exhibitors/${e.slug}`)} className={row}>
                  <span className="flex-1 text-sm">{e.name}</span>
                  <span className="text-xs text-fog">{e.stands[edition]}</span>
                  <Arrow size={14} className="text-fog" />
                </Link>
              </li>
            ))}
          </Group>
        )}
      </div>
    </dialog>
  );
}

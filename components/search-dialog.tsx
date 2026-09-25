"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useSite } from "./site-context";
import { Swatch } from "./swatch";
import { Arrow, Close, SearchIcon } from "./icons";
import { search } from "@/lib/search";
import { fmt, t } from "@/lib/i18n";
import { sectorById } from "@/content/sectors";
import { materialBySlug } from "@/content/materials";
import { applications } from "@/content/applications";
import { exhibitorsFor } from "@/content/exhibitors";

const POPULAR = ["marble", "porcelain", "zellige", "microcement", "travertine", "wall-panels"];
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
    if (open && !d.open) {
      d.showModal();
      track("search_open");
    }
    if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => {
    if (dq.trim().length < 3) return;
    const id = setTimeout(() => track("search", { q: dq, results: res.materials.length }), 800);
    return () => clearTimeout(id);
  }, [dq, res.materials.length]);

  const total = res.materials.length + res.sectors.length + res.applications.length + res.exhibitors.length;

  const row = "flex items-center gap-3 rounded-sm px-2 py-2 hover:bg-ash focus-visible:bg-ash";

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-label={dict.search.title}
      className="m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden bg-ink/95 p-0 text-limestone backdrop-blur-xl backdrop:bg-black/70"
    >
      <div className="mx-auto flex w-[min(56rem,calc(100vw-2rem))] items-center gap-3 border-b border-line-strong px-2 pt-[8vh]">
        <SearchIcon size={18} className="shrink-0 text-fog" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={dict.search.placeholder}
          aria-label={dict.search.title}
          onKeyDown={(e) => e.key === "Enter" && q.trim() && track("search_submit", { q, results: total })}
          className="display h-20 w-full bg-transparent text-3xl outline-none placeholder:text-fog sm:text-4xl"
        />
        <button type="button" onClick={onClose} aria-label={dict.nav.close} className="grid size-9 shrink-0 place-items-center rounded-full hover:bg-ash">
          <Close size={16} />
        </button>
      </div>
      <div className="mx-auto h-[calc(100dvh-8vh-5rem)] w-[min(56rem,calc(100vw-2rem))] overflow-y-auto pb-10" onClick={(e) => (e.target as HTMLElement).closest("a") && onClose()}>
        {!q.trim() && (
          <div className="space-y-8 py-8">
            <section>
              <h3 className="eyebrow mb-4 px-2">{dict.search.popularMaterials}</h3>
              <ul className="grid grid-cols-3 gap-2 px-2 sm:grid-cols-6">
                {POPULAR.map((slug) => {
                  const m = materialBySlug(slug)!;
                  return (
                    <li key={slug}>
                      <Link href={link(`materials/${slug}`)} className="group block">
                        <Swatch tex={m.tex} seed={m.seed} res={160} eager className="aspect-square rounded-sm transition-transform duration-500 group-hover:scale-[1.03]" />
                        <span className="mt-2 block text-xs text-limestone/80">{t(m.name, locale)}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
            <section>
              <h3 className="eyebrow mb-4 px-2">{dict.search.popularApplications}</h3>
              <ul className="flex flex-wrap gap-2 px-2">
                {applications.map((a) => (
                  <li key={a.id}>
                    <Link href={link(`applications/${a.id}`)} className="chip">
                      {t(a.name, locale)}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="eyebrow mb-2 px-2">{dict.search.featuredExhibitors}</h3>
              <ul>
                {exhibitorsFor(edition).slice(0, 4).map((e) => (
                  <li key={e.slug}>
                    <Link href={link(`exhibitors/${e.slug}`)} className={row}>
                      <span className="flex-1 text-sm">{e.name}</span>
                      <span className="text-xs text-fog">{t(sectorById(e.sectors[0])!.short, locale)}</span>
                      <Arrow size={14} className="flip-rtl text-fog" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
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
                  <Arrow size={14} className="flip-rtl text-fog" />
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
                  <Arrow size={14} className="flip-rtl text-fog" />
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
                  <Arrow size={14} className="flip-rtl text-fog" />
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
                  <Arrow size={14} className="flip-rtl text-fog" />
                </Link>
              </li>
            ))}
          </Group>
        )}
      </div>
    </dialog>
  );
}

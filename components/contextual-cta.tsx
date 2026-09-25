"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useSite } from "./site-context";
import { Swatch } from "./swatch";
import { Arrow, Close } from "./icons";
import { sectors, sectorById, type SectorId } from "@/content/sectors";
import { t } from "@/lib/i18n";
import { track } from "@/lib/analytics";

/**
 * "Exhibit this product" — the CTA follows the material. It appears once the
 * visitor has engaged with a page (scrolled past the hero) and speaks in the
 * voice of the page's sector.
 */
export function ContextualCTA({ sector, context }: { sector?: SectorId; context: string }) {
  const { dict, locale, link } = useSite();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const dlg = useRef<HTMLDialogElement>(null);
  const reduce = useReducedMotion();
  const s = sector ? sectorById(sector) : undefined;

  useEffect(() => {
    const on = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const label = s ? t(s.ctaLabel, locale) : dict.hero.exhibit;
  const applyHref = link(`exhibit${s ? `?sector=${s.id}` : ""}`);

  return (
    <>
      <AnimatePresence>
        {visible && !open && (
          <motion.button
            type="button"
            initial={reduce ? false : { y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => {
              setOpen(true);
              track("exhibit_cta_click", { from: context, sector: s?.id, stage: "open" });
            }}
            className="group fixed bottom-4 end-4 z-40 flex items-center gap-3 rounded-full border border-line bg-graphite/90 py-1.5 pe-1.5 ps-1.5 text-sm shadow-2xl backdrop-blur-xl hover:border-fog sm:bottom-6 sm:end-6"
          >
            <Swatch tex={s?.tex ?? "marble"} seed={s?.seed ?? 1} res={96} className="size-9 rounded-full" eager />
            <span className="max-w-[14rem] truncate">{label}</span>
            <span className="arrow-circle size-9">
              <Arrow size={14} />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <dialog
        ref={dlg}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === dlg.current && setOpen(false)}
        aria-labelledby="cta-title"
        className="m-auto w-[min(34rem,calc(100vw-2rem))] overflow-hidden rounded-md border border-line bg-graphite p-0 text-limestone shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        <Swatch tex={s?.tex ?? "calacatta"} seed={s?.seed ?? 7} res={384} className="h-36" eager>
          <div className="sample-shade absolute inset-0" />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute end-3 top-3 grid size-9 place-items-center rounded-full bg-black/40 backdrop-blur"
            aria-label={dict.cta.close}
          >
            <Close size={16} />
          </button>
        </Swatch>
        <div className="p-6 sm:p-8">
          <p className="eyebrow">{dict.cta.dialogTitle}</p>
          <h2 id="cta-title" className="display mt-3 text-4xl">
            {dict.cta.dialogLead}
          </h2>
          {s && <p className="mt-3 text-sm text-limestone/75">{t(s.pitch, locale)}</p>}
          <ul className="mt-6 flex flex-wrap gap-2">
            {sectors.map((x) => (
              <li key={x.id}>
                <Link
                  href={link(`exhibit?sector=${x.id}`)}
                  aria-current={x.id === s?.id ? "true" : undefined}
                  className="chip"
                  onClick={() => track("exhibit_cta_click", { from: context, sector: x.id, stage: "sector" })}
                >
                  <span className="size-2 rounded-full" style={{ background: x.accent }} />
                  {t(x.short, locale)}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={applyHref}
            className="btn btn-solid mt-8 w-full justify-center"
            onClick={() => track("exhibit_cta_click", { from: context, sector: s?.id, stage: "apply" })}
          >
            {dict.cta.apply} <Arrow size={16} />
          </Link>
        </div>
      </dialog>
    </>
  );
}

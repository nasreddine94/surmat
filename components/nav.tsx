"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSite } from "./site-context";
import { Arrow, Chevron, Close, MenuIcon, SearchIcon } from "./icons";
import { SearchDialog } from "./search-dialog";
import { countryName, editionIds, editions } from "@/lib/editions";
import { langTag, localeLabel, locales, t } from "@/lib/i18n";
import { track } from "@/lib/analytics";

const items = ["materials", "applications", "exhibitors", "experience", "visit", "exhibit"] as const;

export function Flag({ code, className = "" }: { code: string; className?: string }) {
  // Simplified flags drawn inline — no external assets.
  if (code === "DZ")
    return (
      <svg viewBox="0 0 30 20" className={className} aria-hidden>
        <rect width="15" height="20" fill="#1b7a3e" />
        <rect x="15" width="15" height="20" fill="#f4f4f4" />
        <circle cx="15.8" cy="10" r="5" fill="#d21034" />
        <circle cx="17" cy="10" r="4" fill="#f4f4f4" />
        <path d="M19.3 10l-3.1 1 1.9-2.7v3.4l-1.9-2.7z" fill="#d21034" />
      </svg>
    );
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden>
      <rect width="10" height="20" fill="#00853f" />
      <rect x="10" width="10" height="20" fill="#fdef42" />
      <rect x="20" width="10" height="20" fill="#e31b23" />
      <path d="M15 6.5l1 2.9h3l-2.4 1.8.9 2.9-2.5-1.8-2.5 1.8.9-2.9-2.4-1.8h3z" fill="#00853f" />
    </svg>
  );
}

export function swapSegment(pathname: string, index: 1 | 2, value: string) {
  const parts = pathname.split("/");
  parts[index] = value;
  return parts.join("/") || "/";
}

/** Close a popover on outside click or Escape. */
function useDismiss(ref: React.RefObject<HTMLElement | null>, open: boolean, setOpen: (v: boolean) => void) {
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [ref, open, setOpen]);
}

const setCookie = (k: string, v: string) => {
  document.cookie = `${k}=${v}; path=/; max-age=31536000; samesite=lax`;
};

export function Nav() {
  const { dict, locale, edition, link } = useSite();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [edOpen, setEdOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const edRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const isHome = pathname === link();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest("input, textarea, select");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  useDismiss(edRef, edOpen, setEdOpen);
  useDismiss(langRef, langOpen, setLangOpen);

  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenu(false);
  }

  const ed = editions[edition];
  const solid = scrolled || !isHome || menu;

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[100] btn btn-solid btn-sm">
        {dict.nav.skip}
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 border-b ${
          solid ? "glass-header-solid border-line" : "glass-header border-transparent"
        }`}
      >
        {/* Event bar — the site is an exhibition first: where, when, and the two ways in. */}
        <div className={`overflow-hidden border-b border-line/60 bg-ink/70 transition-[max-height,opacity] duration-500 ${scrolled ? "max-h-0 opacity-0" : "max-h-9 opacity-100"}`} aria-hidden={scrolled || undefined}>
          <div className="shell flex h-8 items-center justify-between gap-4 text-[0.7rem] text-limestone/75">
            <p className="flex min-w-0 items-center gap-2 truncate">
              <span className="size-1.5 shrink-0 rounded-full bg-gold motion-safe:animate-pulse" />
              <span className="hidden uppercase tracking-[0.16em] text-gold md:inline">{dict.event.bar}</span>
              <span className="hidden text-fog md:inline">·</span>
              <span className="truncate">
                {ed.venue ? t(ed.venue, locale) : t(ed.city, locale)} · {ed.dates ? t(ed.dates, locale) : dict.edition.datesTBA}
              </span>
            </p>
            <span className="flex shrink-0 items-center gap-4">
              <Link href={link("exhibit")} tabIndex={scrolled ? -1 : undefined} onClick={() => track("exhibit_cta_click", { from: "event_bar" })} className="flex items-center gap-1 font-medium text-limestone hover:text-gold">
                {dict.event.bookStand} <Arrow size={11} />
              </Link>
              <Link href={link("visit")} tabIndex={scrolled ? -1 : undefined} onClick={() => track("visit_cta_click", { from: "event_bar" })} className="hidden hover:text-limestone sm:inline">
                {dict.event.freeVisit}
              </Link>
            </span>
          </div>
        </div>
        <div className={`shell flex items-center gap-5 transition-[height] duration-500 ${scrolled ? "h-14 lg:h-16" : "h-16 lg:h-[4.75rem]"}`}>
          <Link href={link()} className="flex shrink-0 items-center" aria-label="SURMAT">
            <span className="wordmark text-[1.35rem] leading-none">SURMAT</span>
          </Link>
          <div className="hidden items-center gap-1 border-s border-line ps-4 sm:flex">
            <div ref={edRef} className="relative">
              <button
                type="button"
                aria-expanded={edOpen}
                aria-haspopup="true"
                onClick={() => setEdOpen((v) => !v)}
                className="flex h-10 items-center gap-2 rounded-full px-2 text-[0.8rem] text-limestone/85 hover:text-limestone"
              >
                <Flag code={ed.country} className="h-3.5 w-[1.3rem] rounded-[2px]" />
                <span>{countryName(ed.country, locale)}</span>
                <Chevron size={14} />
                <span className="sr-only">{dict.nav.edition}</span>
              </button>
              {edOpen && (
                <ul className="absolute start-0 top-12 w-60 overflow-hidden rounded-md border border-line bg-graphite/95 p-1.5 shadow-2xl backdrop-blur-xl">
                  {editionIds.map((id) => {
                    const e = editions[id];
                    return (
                      <li key={id}>
                        <Link
                          href={swapSegment(pathname, 1, id)}
                          aria-current={id === edition ? "true" : undefined}
                          onClick={() => {
                            setCookie("surmat_edition", id);
                            track("country_switch", { to: id });
                            setEdOpen(false);
                          }}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-ash aria-[current]:bg-ash"
                        >
                          <Flag code={e.country} className="h-4 w-6 rounded-[2px]" />
                          <span className="flex-1">{t(e.name, locale)}</span>
                          <span className="text-xs text-fog">{t(e.city, locale)}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <span aria-hidden className="text-fog">·</span>
            <div ref={langRef} className="relative">
              <button
                type="button"
                aria-expanded={langOpen}
                aria-haspopup="true"
                onClick={() => setLangOpen((v) => !v)}
                className="flex h-10 items-center gap-1.5 rounded-full px-2 text-[0.8rem] text-limestone/85 hover:text-limestone"
              >
                <span lang={langTag(locale)}>{localeLabel[locale].name}</span>
                <Chevron size={14} />
                <span className="sr-only">{dict.nav.language}</span>
              </button>
              {langOpen && (
                <ul
                  aria-label={dict.nav.language}
                  className="absolute start-0 top-12 grid w-72 grid-cols-2 gap-0.5 overflow-hidden rounded-md border border-line bg-graphite/95 p-1.5 shadow-2xl backdrop-blur-xl"
                >
                  {locales.map((l) => (
                    <li key={l}>
                      <Link
                        href={swapSegment(pathname, 2, l)}
                        hrefLang={langTag(l)}
                        lang={langTag(l)}
                        aria-current={l === locale ? "true" : undefined}
                        onClick={() => {
                          setCookie("surmat_locale", l);
                          track("language_switch", { to: l });
                          setLangOpen(false);
                        }}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-ash aria-[current]:bg-ash"
                      >
                        <span className="w-6 text-xs text-fog">{localeLabel[l].short}</span>
                        {localeLabel[l].name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <nav aria-label="Primary" className="mx-auto hidden lg:block">
            <ul className="flex items-center gap-7">
              {items.map((k) => {
                const href = link(k);
                const active = pathname.startsWith(href);
                return (
                  <li key={k}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={`relative text-[0.82rem] transition-colors hover:text-limestone ${
                        active ? "text-limestone" : "text-limestone/70"
                      } after:absolute after:-bottom-1.5 after:start-0 after:h-px after:bg-travertine after:transition-all ${
                        active ? "after:w-full" : "after:w-0"
                      }`}
                    >
                      {dict.nav[k]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ms-auto flex items-center gap-2 lg:ms-0 lg:gap-4">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="grid size-10 place-items-center rounded-full text-limestone/80 hover:text-limestone"
              aria-label={dict.nav.search}
            >
              <SearchIcon size={18} />
            </button>

            <Link href={link("pro")} className="btn btn-ghost btn-sm hidden lg:inline-flex">
              {dict.nav.pro}
            </Link>

            <button
              type="button"
              className="grid size-10 place-items-center lg:hidden"
              aria-expanded={menu}
              aria-controls="mobile-menu"
              onClick={() => setMenu((v) => !v)}
              aria-label={menu ? dict.nav.close : dict.nav.menu}
            >
              {menu ? <Close size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </div>

        {menu && (
          <div id="mobile-menu" className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-basalt lg:hidden">
            <nav className="shell flex flex-col py-6" aria-label="Mobile">
              {items.map((k) => (
                <Link key={k} href={link(k)} className="display border-b border-line py-4 text-3xl">
                  {dict.nav[k]}
                </Link>
              ))}
              <div className="mt-8 flex flex-wrap gap-2">
                {editionIds.map((id) => (
                  <Link
                    key={id}
                    href={swapSegment(pathname, 1, id)}
                    aria-current={id === edition ? "true" : undefined}
                    onClick={() => setCookie("surmat_edition", id)}
                    className="chip"
                  >
                    <Flag code={editions[id].country} className="h-3 w-[1.1rem] rounded-[2px]" />
                    {t(editions[id].name, locale)}
                  </Link>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {locales.map((l) => (
                  <Link
                    key={l}
                    lang={langTag(l)}
                    href={swapSegment(pathname, 2, l)}
                    aria-current={l === locale ? "true" : undefined}
                    onClick={() => setCookie("surmat_locale", l)}
                    className="chip"
                  >
                    {localeLabel[l].name}
                  </Link>
                ))}
              </div>
              <Link href={link("visit")} className="btn btn-solid mt-8 justify-center">
                {dict.nav.register}
              </Link>
              <Link href={link("pro")} className="btn btn-ghost mt-3 justify-center">
                {dict.nav.pro}
              </Link>
            </nav>
          </div>
        )}
      </header>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

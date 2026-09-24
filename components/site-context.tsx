"use client";

import { createContext, useContext } from "react";
import type { Dict, Locale } from "@/lib/i18n";
import type { EditionId } from "@/lib/editions";

type Site = { edition: EditionId; locale: Locale; dict: Dict };
const SiteCtx = createContext<Site | null>(null);

export function SiteProvider({ value, children }: { value: Site; children: React.ReactNode }) {
  return <SiteCtx.Provider value={value}>{children}</SiteCtx.Provider>;
}

export function useSite() {
  const v = useContext(SiteCtx);
  if (!v) throw new Error("useSite outside SiteProvider");
  const link = (path = "") => `/${v.edition}/${v.locale}${path ? `/${path.replace(/^\//, "")}` : ""}`;
  return { ...v, link };
}

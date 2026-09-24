import Link from "next/link";
import { Swatch } from "./swatch";
import { Arrow } from "./icons";
import type { Exhibitor } from "@/content/exhibitors";
import { materialBySlug } from "@/content/materials";
import { sectorById } from "@/content/sectors";
import { countryName } from "@/lib/editions";
import { getDict, t } from "@/lib/i18n";
import { href, type Ctx } from "@/lib/routing";

/** A mini showroom: product wall of the exhibitor's materials, not a logo card. */
export function ExhibitorCard({ exhibitor: e, ctx }: { exhibitor: Exhibitor; ctx: Ctx }) {
  const dict = getDict(ctx.locale);
  const mats = e.materials.slice(0, 4).map((s) => materialBySlug(s)!);
  const sec = sectorById(e.sectors[0])!;
  return (
    <Link href={href(ctx, `exhibitors/${e.slug}`)} className="group block overflow-hidden rounded-lg border border-line bg-graphite transition-colors hover:border-fog">
      <div className="grid h-32 grid-cols-4 gap-px bg-line">
        {mats.map((m) => (
          <Swatch key={m.slug} tex={m.tex} seed={m.seed} res={160} className="h-full transition-transform duration-700 group-hover:scale-105" />
        ))}
      </div>
      <div className="flex items-start justify-between gap-4 p-5">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.18em] text-fog">
            <span className="me-2 inline-block size-1.5 rounded-full align-middle" style={{ background: sec.accent }} />
            {t(sec.short, ctx.locale)}
            {e.stands[ctx.edition] && ` · ${dict.exhibitors.stand} ${e.stands[ctx.edition]}`}
          </p>
          <h3 className="mt-2 text-lg">{e.name}</h3>
          <p className="mt-1 text-xs text-fog">
            {countryName(e.country, ctx.locale)}
            {e.sample && <span className="ms-2 text-travertine">· {dict.exhibitors.sample}</span>}
          </p>
        </div>
        <span className="arrow-circle mt-1 shrink-0">
          <Arrow size={14} />
        </span>
      </div>
    </Link>
  );
}

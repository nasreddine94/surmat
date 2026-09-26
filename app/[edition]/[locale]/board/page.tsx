import type { Metadata } from "next";
import { MaterialBoard } from "@/components/material-board";
import { BoardSynthesis } from "@/components/board-synthesis";
import { SystemsExplorer } from "@/components/systems-explorer";
import { EventBand } from "@/components/event-band";
import { ContextualCTA } from "@/components/contextual-cta";
import { alternates, resolve } from "@/lib/routing";

export async function generateMetadata({ params }: PageProps<"/[edition]/[locale]/board">): Promise<Metadata> {
  const { edition, locale, dict } = await resolve(params);
  return { title: dict.board.pageTitle, description: dict.board.pageLead, alternates: alternates({ edition, locale }, "board") };
}

/** The material board & render studio: every product family, sample to space. */
export default async function BoardPage({ params }: PageProps<"/[edition]/[locale]/board">) {
  const { edition, locale, dict, ed } = await resolve(params);
  const c = { edition, locale };
  return (
    <div className="shell pt-32">
      <p className="eyebrow">{dict.board.eyebrow}</p>
      <h1 className="display mt-4 text-5xl sm:text-7xl">{dict.board.pageTitle}</h1>
      <p className="mt-5 max-w-2xl text-limestone/75">{dict.board.pageLead}</p>
      <BoardSynthesis bare />
      <MaterialBoard bare />
      <SystemsExplorer bare />
      <EventBand dict={dict} c={c} ed={ed} bare />
      <ContextualCTA context="catalogue" />
    </div>
  );
}

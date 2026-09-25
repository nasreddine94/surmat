import { Swatch } from "./swatch";
import { applicationById, type ApplicationId } from "@/content/applications";
import { materialBySlug } from "@/content/materials";

/** Cover for an application: its signature feature material, with the floor material as a base band. */
export function SpaceCover({ id, className = "aspect-[16/10]" }: { id: ApplicationId; className?: string }) {
  const app = applicationById(id)!;
  const feature = materialBySlug(app.surfaces.feature)!;
  const floor = materialBySlug(app.surfaces.floor)!;
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Swatch tex={feature.tex} seed={feature.seed} res={384} className="absolute inset-0" />
      <Swatch tex={floor.tex} seed={floor.seed} res={256} className="absolute inset-x-0 bottom-0 h-[28%] border-t border-black/30" />
      <div className="absolute inset-0" style={{ background: `radial-gradient(70% 60% at 50% 20%, ${app.light}33, transparent 70%)` }} />
    </div>
  );
}

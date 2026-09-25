import Image from "next/image";
import { media, type MediaKey } from "@/content/event-media";

/**
 * An event image that fills its (positioned) parent. Visualisations carry a discreet label so
 * generated imagery is never presented as a photograph of a past edition.
 */
export function EventImage({
  id,
  alt,
  sizes,
  label,
  priority,
  className = "",
}: {
  id: MediaKey;
  alt: string;
  sizes: string;
  /** "Visualisation" in the page language; omit to hide the label. */
  label?: string;
  priority?: boolean;
  className?: string;
}) {
  const m = media[id];
  return (
    <>
      <Image src={m.src} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${className}`} />
      {m.visual && label && (
        <span className="pointer-events-none absolute end-2 top-2 z-[1] rounded-xs bg-ink/55 px-1.5 py-0.5 text-[0.58rem] uppercase tracking-[0.14em] text-limestone/60 backdrop-blur-sm">
          {label}
        </span>
      )}
    </>
  );
}

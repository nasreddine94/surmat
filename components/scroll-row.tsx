"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Chevron } from "./icons";

/**
 * A horizontal row of chips or tabs that never hides its last items: arrow buttons appear at
 * each end while there is more to see, the edges fade, the row can be dragged with a mouse
 * (touch and trackpads scroll natively), and the selected item is kept in view.
 * Works in both reading directions.
 */
export function ScrollRow({
  children,
  className = "",
  wrapClassName = "",
  role,
  label,
  prevLabel = "‹",
  nextLabel = "›",
}: {
  children: ReactNode;
  className?: string;
  wrapClassName?: string;
  role?: string;
  label?: string;
  prevLabel?: string;
  nextLabel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: false, end: false });
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pos = Math.abs(el.scrollLeft); // negative in RTL
    setEdge({ start: pos > 4, end: pos < max - 4 });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    el.addEventListener("scroll", update, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, [update]);

  // Keep the selected tab / chip in view — only when the selection itself changes, so the
  // arrows and dragging are never pulled back.
  const lastSel = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sel = el.querySelector<HTMLElement>('[aria-selected="true"], [aria-current], [aria-pressed="true"]');
    if (!sel || sel === lastSel.current) return;
    const first = lastSel.current === null;
    lastSel.current = sel;
    const a = sel.getBoundingClientRect(), b = el.getBoundingClientRect();
    if (a.left < b.left + 40 || a.right > b.right - 40) {
      el.scrollBy({ left: a.left - b.left - b.width / 2 + a.width / 2, behavior: first ? "auto" : "smooth" });
    }
  });

  const rtl = () => (ref.current ? getComputedStyle(ref.current).direction === "rtl" : false);
  const page = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    // dir 1 = towards the end of the row in reading order
    el.scrollBy({ left: dir * (rtl() ? -1 : 1) * el.clientWidth * 0.7, behavior: "smooth" });
  };

  return (
    <div className={`relative ${wrapClassName}`}>
      <div
        ref={ref}
        role={role}
        aria-label={label}
        className={`flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || !ref.current) return;
          drag.current = { down: true, x: e.clientX, left: ref.current.scrollLeft, moved: false };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d.down || !ref.current) return;
          const dx = e.clientX - d.x;
          if (Math.abs(dx) > 4) d.moved = true;
          ref.current.scrollLeft = d.left - dx;
        }}
        onPointerUp={() => (drag.current.down = false)}
        onPointerLeave={() => (drag.current.down = false)}
        onClickCapture={(e) => {
          // A drag should not also click the tab under the pointer.
          if (drag.current.moved) {
            e.preventDefault();
            e.stopPropagation();
            drag.current.moved = false;
          }
        }}
      >
        {children}
      </div>

      {/* Edge fades */}
      <span aria-hidden className={`pointer-events-none absolute inset-y-0 start-0 w-12 bg-gradient-to-r from-basalt to-transparent transition-opacity rtl:bg-gradient-to-l ${edge.start ? "opacity-100" : "opacity-0"}`} />
      <span aria-hidden className={`pointer-events-none absolute inset-y-0 end-0 w-12 bg-gradient-to-l from-basalt to-transparent transition-opacity rtl:bg-gradient-to-r ${edge.end ? "opacity-100" : "opacity-0"}`} />

      {/* Arrows */}
      {edge.start && (
        <button
          type="button"
          onClick={() => page(-1)}
          aria-label={prevLabel}
          className="absolute start-0 top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-line-strong bg-graphite/95 text-limestone shadow-lg backdrop-blur hover:border-gold hover:text-gold"
        >
          <Chevron size={14} className="rotate-90 rtl:-rotate-90" />
        </button>
      )}
      {edge.end && (
        <button
          type="button"
          onClick={() => page(1)}
          aria-label={nextLabel}
          className="absolute end-0 top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-line-strong bg-graphite/95 text-limestone shadow-lg backdrop-blur hover:border-gold hover:text-gold"
        >
          <Chevron size={14} className="-rotate-90 rtl:rotate-90" />
        </button>
      )}
    </div>
  );
}

type P = React.SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 16, p: P) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...p,
});

/** Arrow points forward in reading direction (mirrored in RTL). */
export const Arrow = ({ size, className = "", ...p }: P) => (
  <svg {...base(size, p)} className={`flip-rtl ${className}`}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);
export const Plus = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const Close = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
export const SearchIcon = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4.2-4.2" />
  </svg>
);
export const MenuIcon = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M4 8h16M4 16h16" />
  </svg>
);
export const Chevron = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M7 10l5 5 5-5" />
  </svg>
);
export const Layers = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M12 3l9 5-9 5-9-5 9-5z" />
    <path d="M3 13l9 5 9-5" />
  </svg>
);
export const GlobeIcon = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.5 2.6 3.6 5.4 3.6 8.5s-1.1 5.9-3.6 8.5c-2.5-2.6-3.6-5.4-3.6-8.5S9.5 6.1 12 3.5z" />
  </svg>
);
export const People = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 19c.6-3.2 3-5 6-5s5.4 1.8 6 5" />
    <circle cx="17" cy="9" r="2.4" />
    <path d="M16.5 14c2.4.2 4 1.6 4.5 4" />
  </svg>
);
export const Badge = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <rect x="5" y="3.5" width="14" height="17" rx="2" />
    <circle cx="12" cy="10" r="2.6" />
    <path d="M8.5 17c.6-1.8 1.9-2.7 3.5-2.7s2.9.9 3.5 2.7" />
  </svg>
);
export const Calendar = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </svg>
);
export const Pin = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0113 0c0 5.4-6.5 11-6.5 11z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
);
export const Check = ({ size, ...p }: P) => (
  <svg {...base(size, p)}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

/**
 * Orbit constants shared by the hero (which starts texture work early) and the lazily
 * loaded WebGL scene. Kept free of three.js so importing it costs nothing.
 */

/** Samples on the inner ring — the ones seen close up. */
export const NEAR_COUNT = 15;

/** Near-ring samples get full-resolution relief; far ones sit in fog and bokeh. */
export const mapSize = (index: number) => (index < NEAR_COUNT ? 512 : 256);

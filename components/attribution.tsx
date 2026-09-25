"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/** Records UTM / landing page on the first page view of a visit. Renders nothing. */
export function AttributionCapture() {
  useEffect(() => captureAttribution(), []);
  return null;
}

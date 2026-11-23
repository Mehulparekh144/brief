"use client";
import posthog from "posthog-js";
import { useEffect } from "react";

// Loads only when NEXT_PUBLIC_POSTHOG_KEY is set. Without it, track() does nothing.
const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
let started = false;

function start() {
  if (!KEY || started || typeof window === "undefined") return;
  posthog.init(KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    capture_pageview: "history_change",
    person_profiles: "identified_only",
  });
  started = true;
}

/** Starts PostHog and ties events to the signed-in user. */
export function Analytics({ userId, login }: { userId?: string; login?: string }) {
  useEffect(() => {
    start();
    if (started && userId) posthog.identify(userId, { login });
  }, [userId, login]);
  return null;
}

export function track(event: string, props?: Record<string, unknown>) {
  start();
  if (started) posthog.capture(event, props);
}

/** Fires one event when it mounts (for server-rendered pages). */
export function TrackOnce({ event, props }: { event: string; props?: Record<string, unknown> }) {
  useEffect(() => {
    track(event, props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

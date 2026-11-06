export type SiteTheme = "light" | "dark";
const themePreferences = ["time", "system", "light", "dark"] as const;
export type ThemePreference = (typeof themePreferences)[number];

export const themeStorageKey = "developer-john:theme-preference:v1";
export const themeSchedule = { lightStartHour: 7, lightEndHour: 19 } as const;

export function themeAtLocalTime(date: Date): SiteTheme {
  const hour = date.getHours();
  return hour >= themeSchedule.lightStartHour && hour < themeSchedule.lightEndHour ? "light" : "dark";
}

function readPreference(window: Window): ThemePreference {
  try {
    const saved = window.localStorage.getItem(themeStorageKey);
    return isThemePreference(saved) ? saved : "time";
  } catch {
    return "time";
  }
}

function isThemePreference(value: unknown): value is ThemePreference {
  return typeof value === "string" && themePreferences.includes(value as ThemePreference);
}

// Apply before paint; never use the NAS/build server's clock to choose a visitor's theme.
export const themeInitialization = `(()=>{let preference="time";try{const saved=localStorage.getItem(${JSON.stringify(themeStorageKey)});if(${JSON.stringify(themePreferences)}.includes(saved))preference=saved;}catch{}const hour=new Date().getHours();document.documentElement.dataset.theme=preference==="light"||preference==="dark"?preference:preference==="system"&&typeof matchMedia==="function"?(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):(hour>=${themeSchedule.lightStartHour}&&hour<${themeSchedule.lightEndHour}?"light":"dark");})();`;

export type ThemeController = {
  setPreference: (preference: ThemePreference) => void;
  destroy: () => void;
};

export function watchSiteTheme(document: Document, window: Window, onPreference: (preference: ThemePreference) => void, onTheme?: (theme: SiteTheme) => void): ThemeController {
  let preference = readPreference(window);
  let timer: number | undefined;
  const device = typeof window.matchMedia === "function" ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function refresh() {
    if (timer !== undefined) window.clearTimeout(timer);
    timer = undefined;
    const now = new Date();
    const fixed = preference === "light" || preference === "dark";
    const theme: SiteTheme = preference === "light" || preference === "dark" ? preference
      : preference === "system" && device ? device.matches ? "dark" : "light"
        : themeAtLocalTime(now);
    document.documentElement.dataset.theme = theme;
    onTheme?.(theme);
    if (document.visibilityState === "hidden" || fixed || (preference === "system" && device)) return;

    const nextBoundary = new Date(now);
    const hour = now.getHours();
    nextBoundary.setHours(hour < themeSchedule.lightStartHour ? themeSchedule.lightStartHour
      : hour < themeSchedule.lightEndHour ? themeSchedule.lightEndHour
        : 24 + themeSchedule.lightStartHour, 0, 0, 0);
    // Recheck while visible in case the system time or time zone changes.
    timer = window.setTimeout(refresh, Math.min(nextBoundary.getTime() - now.getTime(), 60_000));
  }

  function storageChanged(event: StorageEvent) {
    if (event.key !== null && event.key !== themeStorageKey) return;
    // Ignore sessionStorage and other storage areas.
    try { if (event.storageArea && event.storageArea !== window.localStorage) return; } catch { return; }
    preference = readPreference(window);
    onPreference(preference);
    refresh();
  }

  document.addEventListener("visibilitychange", refresh);
  window.addEventListener("focus", refresh);
  window.addEventListener("pageshow", refresh);
  window.addEventListener("storage", storageChanged);
  device?.addEventListener("change", refresh);
  onPreference(preference);
  refresh();

  return {
    setPreference(next) {
      if (!isThemePreference(next)) return;
      preference = next;
      // A blocked/full store must not stop the selection working in the current tab.
      try { window.localStorage.setItem(themeStorageKey, next); } catch { /* Keep the in-memory selection. */ }
      onPreference(preference);
      refresh();
    },
    destroy() {
      if (timer !== undefined) window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("pageshow", refresh);
      window.removeEventListener("storage", storageChanged);
      device?.removeEventListener("change", refresh);
    },
  };
}

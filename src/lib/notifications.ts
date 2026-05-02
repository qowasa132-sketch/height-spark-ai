// Reminder system. Detects the runtime and uses the best available channel:
//   1. Median.co WebView app  -> real OS local notifications via median JS bridge
//      (works offline, fires even when app is closed, scheduled by the OS).
//   2. Web browser            -> Web Notifications API (in-app while open).
//   3. Fallback               -> sonner toast inside the app.
//
// We intentionally do NOT use Capacitor here because the app will be wrapped
// with Median.co / Webtoapp.design (pure WebView, no Capacitor runtime).
import { toast } from "sonner";

export interface ReminderSettings {
  bedtime: boolean; // 10pm
  water: boolean; // every 2h between 9-21
  exercise: boolean; // 6pm daily
  measurements: boolean; // weekly Sunday 9am
}

const SETTINGS_KEY = "hb_reminders";
const FIRED_KEY = "hb_reminders_fired"; // map "YYYY-MM-DD#slot" -> 1

export const DEFAULT_SETTINGS: ReminderSettings = {
  bedtime: true,
  water: false,
  exercise: false,
  measurements: true,
};

// ---------- Runtime detection ----------

// Median injects `window.median` and a UA token "median" / "gonative".
type MedianBridge = {
  localNotifications?: {
    send?: (opts: {
      title: string;
      body: string;
      // ISO date string for one-off, or repeat config
      sendAtUnixTimestamp?: number;
      repeats?: "daily" | "weekly" | "hourly";
      tag?: string;
    }) => void;
    clear?: (opts?: { tag?: string }) => void;
    clearAll?: () => void;
    promptForPermission?: () => Promise<{ granted: boolean }> | void;
  };
  permissions?: {
    request?: (opts: { permissions: string[] }) => Promise<{ granted: string[] }>;
  };
};

function getMedian(): MedianBridge | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { median?: MedianBridge; gonative?: MedianBridge };
  const bridge = w.median || w.gonative;
  if (bridge) return bridge;
  // UA detection fallback (bridge may load slightly later than first call).
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("median") || ua.includes("gonative")) {
    // Bridge not ready yet — return null so we fall back this call.
    return null;
  }
  return null;
}

const isMedianApp = (): boolean => {
  if (typeof window === "undefined") return false;
  if (getMedian()) return true;
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes("median") || ua.includes("gonative");
};

// ---------- Settings persistence ----------

export function loadReminderSettings(): ReminderSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveReminderSettings(s: ReminderSettings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  // Re-sync OS schedule whenever settings change.
  if (isMedianApp()) {
    void syncMedianSchedule(s);
  }
}

// ---------- Permission ----------

export type PermState = NotificationPermission | "unsupported";

export async function requestNotificationPermission(): Promise<PermState> {
  if (typeof window === "undefined") return "denied";

  // Median app — ask the OS for notification permission.
  if (isMedianApp()) {
    const median = getMedian();
    try {
      if (median?.localNotifications?.promptForPermission) {
        const res = await median.localNotifications.promptForPermission();
        if (res && typeof res === "object" && "granted" in res) {
          return res.granted ? "granted" : "denied";
        }
        return "granted";
      }
      if (median?.permissions?.request) {
        const res = await median.permissions.request({ permissions: ["notifications"] });
        return res.granted?.includes("notifications") ? "granted" : "denied";
      }
    } catch {
      /* fall through */
    }
    // If the bridge call doesn't return a value, assume the user got the prompt.
    return "granted";
  }

  // Web fallback.
  if (!("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted" || Notification.permission === "denied") {
    return Notification.permission;
  }
  try {
    return await Notification.requestPermission();
  } catch {
    return "denied";
  }
}

export function getNotificationPermission(): PermState {
  if (typeof window === "undefined") return "denied";
  if (isMedianApp()) {
    // Median doesn't expose a sync permission read; assume default until user toggles.
    return "default";
  }
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission;
}

// Kept for API compatibility with the drawer component.
export async function checkNativePermission(): Promise<PermState> {
  return getNotificationPermission();
}

// ---------- Median scheduling ----------
//
// Median's localNotifications.send() schedules a single OS-level notification.
// We schedule the next occurrence and tag it so we can replace it cleanly.

const TAGS = {
  bedtime: "rem_bedtime",
  exercise: "rem_exercise",
  measurements: "rem_measurements",
  waterPrefix: "rem_water_",
};

function nextOccurrence(hour: number, minute: number, weekday?: number): number {
  // weekday: 0=Sun..6=Sat (JS convention)
  const now = new Date();
  const next = new Date();
  next.setHours(hour, minute, 0, 0);
  if (typeof weekday === "number") {
    const diff = (weekday - now.getDay() + 7) % 7;
    next.setDate(now.getDate() + diff);
    if (diff === 0 && next.getTime() <= now.getTime()) {
      next.setDate(next.getDate() + 7);
    }
  } else if (next.getTime() <= now.getTime()) {
    next.setDate(next.getDate() + 1);
  }
  return Math.floor(next.getTime() / 1000);
}

async function syncMedianSchedule(s: ReminderSettings) {
  const median = getMedian();
  if (!median?.localNotifications?.send) return;

  try {
    // Clear all our previous schedules.
    if (median.localNotifications.clearAll) {
      median.localNotifications.clearAll();
    } else if (median.localNotifications.clear) {
      median.localNotifications.clear({ tag: TAGS.bedtime });
      median.localNotifications.clear({ tag: TAGS.exercise });
      median.localNotifications.clear({ tag: TAGS.measurements });
      for (let h = 9; h <= 21; h += 2) {
        median.localNotifications.clear({ tag: TAGS.waterPrefix + h });
      }
    }

    if (s.bedtime) {
      median.localNotifications.send({
        title: "وقت النوم 🌙",
        body: "أوقف الشاشات الآن واذهب للنوم — هرمون النمو يُفرز في النوم العميق.",
        sendAtUnixTimestamp: nextOccurrence(22, 0),
        repeats: "daily",
        tag: TAGS.bedtime,
      });
    }
    if (s.exercise) {
      median.localNotifications.send({
        title: "وقت التمرين 🏃",
        body: "١٥ دقيقة تمدد أو تمارين كافية لتحفيز هرمون النمو.",
        sendAtUnixTimestamp: nextOccurrence(18, 0),
        repeats: "daily",
        tag: TAGS.exercise,
      });
    }
    if (s.measurements) {
      median.localNotifications.send({
        title: "قياس أسبوعي 📏",
        body: "سجّل طولك ووزنك لمتابعة تقدمك.",
        sendAtUnixTimestamp: nextOccurrence(9, 0, 0), // Sunday
        repeats: "weekly",
        tag: TAGS.measurements,
      });
    }
    if (s.water) {
      for (let h = 9; h <= 21; h += 2) {
        median.localNotifications.send({
          title: "اشرب الماء 💧",
          body: "كأس ماء الآن يساعد نمو العظام والمفاصل.",
          sendAtUnixTimestamp: nextOccurrence(h, 0),
          repeats: "daily",
          tag: TAGS.waterPrefix + h,
        });
      }
    }
  } catch (err) {
    console.warn("Failed to sync Median notifications", err);
  }
}

export async function ensureNativeSchedule() {
  if (!isMedianApp()) return;
  await syncMedianSchedule(loadReminderSettings());
}

// ---------- Web/in-app fallback (when app is open in browser) ----------

function fire(slot: string, title: string, body: string) {
  if (typeof window === "undefined") return;
  let fired: Record<string, number> = {};
  try {
    fired = JSON.parse(localStorage.getItem(FIRED_KEY) || "{}");
  } catch {
    fired = {};
  }
  if (fired[slot]) return;
  fired[slot] = Date.now();
  const cutoff = Date.now() - 1000 * 60 * 60 * 48;
  for (const k of Object.keys(fired)) if (fired[k] < cutoff) delete fired[k];
  localStorage.setItem(FIRED_KEY, JSON.stringify(fired));

  if ("Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(title, { body, icon: "/favicon.ico" });
      return;
    } catch {
      /* fall through */
    }
  }
  toast(title, { description: body });
}

function dayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Web only — inside Median the OS handles delivery so we skip ticking.
export function tickReminders(s: ReminderSettings) {
  if (typeof window === "undefined") return;
  if (isMedianApp()) return;
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const dk = dayKey(now);

  if (s.bedtime && h === 22 && m < 30) {
    fire(`${dk}#bedtime`, "وقت النوم 🌙", "أوقف الشاشات الآن واذهب للنوم — هرمون النمو يُفرز في النوم العميق.");
  }
  if (s.water && h >= 9 && h <= 21 && h % 2 === 1 && m < 5) {
    fire(`${dk}#water-${h}`, "اشرب الماء 💧", "كأس ماء الآن يساعد نمو العظام والمفاصل.");
  }
  if (s.exercise && h === 18 && m < 10) {
    fire(`${dk}#exercise`, "وقت التمرين 🏃", "١٥ دقيقة تمدد أو تمارين كافية لتحفيز هرمون النمو.");
  }
  if (s.measurements && now.getDay() === 0 && h === 9 && m < 10) {
    fire(`${dk}#measurements`, "قياس أسبوعي 📏", "سجّل طولك ووزنك لمتابعة تقدمك.");
  }
}

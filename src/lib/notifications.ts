// Reminder system. On iOS/Android (Capacitor) uses Local Notifications API to
// schedule real OS notifications. On the web uses Web Notifications API,
// otherwise falls back to in-app sonner toasts.
import { toast } from "sonner";
import { Capacitor } from "@capacitor/core";
import { LocalNotifications, type ScheduleOptions } from "@capacitor/local-notifications";

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

const isNative = () => {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
};

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
  // Re-sync native schedule whenever settings change.
  if (isNative()) {
    void syncNativeSchedule(s);
  }
}

export type PermState = NotificationPermission | "unsupported";

export async function requestNotificationPermission(): Promise<PermState> {
  if (typeof window === "undefined") return "denied";

  // Native (iOS / Android) — real OS prompt.
  if (isNative()) {
    try {
      const res = await LocalNotifications.requestPermissions();
      return res.display === "granted" ? "granted" : "denied";
    } catch {
      return "denied";
    }
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
  if (isNative()) {
    // Native permission is fetched async; assume granted-or-prompt allowed.
    // Use checkNativePermission() for an accurate value.
    return "default";
  }
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission;
}

export async function checkNativePermission(): Promise<PermState> {
  if (!isNative()) return getNotificationPermission();
  try {
    const res = await LocalNotifications.checkPermissions();
    return res.display === "granted" ? "granted" : res.display === "denied" ? "denied" : "default";
  } catch {
    return "denied";
  }
}

// ---------- Native scheduling ----------

// Stable IDs per slot (must be 32-bit int).
const NATIVE_IDS = {
  bedtime: 1001,
  exercise: 1002,
  measurements: 1003,
  // Water: 1100 + hour
};

async function syncNativeSchedule(s: ReminderSettings) {
  if (!isNative()) return;
  try {
    // Cancel all our previously scheduled notifications first.
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length) {
      await LocalNotifications.cancel({ notifications: pending.notifications.map((n) => ({ id: n.id })) });
    }

    const toSchedule: ScheduleOptions["notifications"] = [];

    if (s.bedtime) {
      toSchedule.push({
        id: NATIVE_IDS.bedtime,
        title: "وقت النوم 🌙",
        body: "أوقف الشاشات الآن واذهب للنوم — هرمون النمو يُفرز في النوم العميق.",
        schedule: { on: { hour: 22, minute: 0 }, allowWhileIdle: true },
      });
    }
    if (s.exercise) {
      toSchedule.push({
        id: NATIVE_IDS.exercise,
        title: "وقت التمرين 🏃",
        body: "١٥ دقيقة تمدد أو تمارين كافية لتحفيز هرمون النمو.",
        schedule: { on: { hour: 18, minute: 0 }, allowWhileIdle: true },
      });
    }
    if (s.measurements) {
      toSchedule.push({
        id: NATIVE_IDS.measurements,
        title: "قياس أسبوعي 📏",
        body: "سجّل طولك ووزنك لمتابعة تقدمك.",
        // weekday: 1 = Sunday in Capacitor's schedule.on
        schedule: { on: { weekday: 1, hour: 9, minute: 0 }, allowWhileIdle: true },
      });
    }
    if (s.water) {
      for (let h = 9; h <= 21; h += 2) {
        toSchedule.push({
          id: 1100 + h,
          title: "اشرب الماء 💧",
          body: "كأس ماء الآن يساعد نمو العظام والمفاصل.",
          schedule: { on: { hour: h, minute: 0 }, allowWhileIdle: true },
        });
      }
    }

    if (toSchedule.length) {
      await LocalNotifications.schedule({ notifications: toSchedule });
    }
  } catch (err) {
    console.warn("Failed to sync native notifications", err);
  }
}

export async function ensureNativeSchedule() {
  if (!isNative()) return;
  await syncNativeSchedule(loadReminderSettings());
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

// Web only — on native the OS handles scheduling, no need to tick.
export function tickReminders(s: ReminderSettings) {
  if (typeof window === "undefined") return;
  if (isNative()) return;
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

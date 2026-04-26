// Lightweight reminder system. Uses Web Notifications API when granted,
// otherwise falls back to in-app sonner toasts.
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
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) return "denied";
  if (Notification.permission === "granted" || Notification.permission === "denied") {
    return Notification.permission;
  }
  try {
    return await Notification.requestPermission();
  } catch {
    return "denied";
  }
}

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  return Notification.permission;
}

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
  // Keep map small
  const cutoff = Date.now() - 1000 * 60 * 60 * 48;
  for (const k of Object.keys(fired)) if (fired[k] < cutoff) delete fired[k];
  localStorage.setItem(FIRED_KEY, JSON.stringify(fired));

  if ("Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(title, { body, icon: "/favicon.ico" });
      return;
    } catch {
      /* fall through to toast */
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

// Check current time against schedule and fire any due reminders.
// Called periodically from a React effect while the app is open.
export function tickReminders(s: ReminderSettings) {
  if (typeof window === "undefined") return;
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

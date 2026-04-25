// Achievement badges, persisted in localStorage. Evaluated from logs.
import {
  computeStreak,
  HABIT_KEYS,
  loadAllLogs,
  loadTodayLog,
  type DailyLog,
} from "@/lib/dailyLog";

export interface BadgeDef {
  id: string;
  emoji: string;
  name: string;
  description: string;
}

export const BADGES: BadgeDef[] = [
  { id: "first_day", emoji: "🥇", name: "أول يوم تتبّع", description: "بدأت رحلتك — سجّل أول يوم." },
  { id: "first_habit", emoji: "✅", name: "أول عادة", description: "أكملت أول عادة في خطتك." },
  { id: "streak_3", emoji: "✨", name: "٣ أيام متتالية", description: "تتبّعت ٣ أيام بدون انقطاع." },
  { id: "streak_7", emoji: "🔥", name: "٧ أيام متتالية", description: "تتبّعت لمدة أسبوع كامل بدون انقطاع." },
  { id: "streak_30", emoji: "🏆", name: "٣٠ يوم متتالية", description: "شهر كامل من الالتزام!" },
  { id: "five_days", emoji: "📅", name: "٥ أيام نشاط", description: "استخدمت التطبيق في ٥ أيام مختلفة." },
  { id: "twenty_days", emoji: "🗓️", name: "٢٠ يوم نشاط", description: "استخدمت التطبيق في ٢٠ يوم مختلف." },
  { id: "water_week", emoji: "💧", name: "أسبوع الماء", description: "شربت ٢ لتر يومياً لمدة ٧ أيام." },
  { id: "ten_workouts", emoji: "🏃", name: "١٠ تمارين", description: "أكملت ١٠ جلسات تمرين." },
  { id: "sleep_week", emoji: "🌙", name: "أسبوع نوم مثالي", description: "٨ ساعات نوم لمدة ٧ أيام متتالية." },
  { id: "perfect_day", emoji: "🎯", name: "يوم مثالي", description: "أكملت جميع العادات الست في يوم واحد." },
];

const KEY = "hb_badges";

export function loadEarnedBadges(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function save(ids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(Array.from(new Set(ids))));
}

function lastNDays(logs: DailyLog[], n: number): DailyLog[] {
  return logs.slice(-n);
}

// Evaluate badges; returns IDs newly unlocked since last call.
export function evaluateBadges(): string[] {
  if (typeof window === "undefined") return [];
  const earned = new Set(loadEarnedBadges());
  const newly: string[] = [];
  const all = loadAllLogs();
  const today = loadTodayLog();

  const grant = (id: string) => {
    if (!earned.has(id)) {
      earned.add(id);
      newly.push(id);
    }
  };

  if (all.length >= 1) grant("first_day");
  if (all.length >= 5) grant("five_days");
  if (all.length >= 20) grant("twenty_days");
  if (HABIT_KEYS.some((h) => today.habits[h])) grant("first_habit");
  const streak = computeStreak();
  if (streak >= 3) grant("streak_3");
  if (streak >= 7) grant("streak_7");
  if (streak >= 30) grant("streak_30");

  const last7 = lastNDays(all, 7);
  if (last7.length === 7 && last7.every((l) => l.waterMl >= 2000)) grant("water_week");

  const totalWorkouts = all.reduce((acc, l) => acc + l.workoutsDone.length, 0);
  if (totalWorkouts >= 10) grant("ten_workouts");

  if (last7.length === 7 && last7.every((l) => (l.sleepHours ?? 0) >= 8)) grant("sleep_week");

  if (HABIT_KEYS.every((h) => today.habits[h])) grant("perfect_day");

  if (newly.length) save(Array.from(earned));
  return newly;
}

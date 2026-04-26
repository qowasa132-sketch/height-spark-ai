// Daily habit log — local-storage keyed by YYYY-MM-DD. No accounts.
export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

export const MEAL_LABELS: Record<MealType, string> = {
  breakfast: "فطور",
  lunch: "غداء",
  dinner: "عشاء",
  snack: "سناك",
};

export const MEAL_EMOJI: Record<MealType, string> = {
  breakfast: "🌅",
  lunch: "🍽️",
  dinner: "🌙",
  snack: "🍎",
};

export interface FoodEntry {
  id: string;
  name: string;
  grams: number;
  calories: number;
  proteinG: number;
  calciumMg: number;
  vitaminDIu: number;
  meal?: MealType;
}

export type HabitKey =
  | "noScreens"
  | "noCaffeine"
  | "vitamins"
  | "steps10k"
  | "water2L"
  | "exercise1h";

export const HABIT_KEYS: HabitKey[] = [
  "noScreens",
  "noCaffeine",
  "vitamins",
  "steps10k",
  "water2L",
  "exercise1h",
];

export interface DailyLog {
  date: string;
  // Sleep
  sleepHours?: number;
  bedtime?: string; // HH:MM
  wakeTime?: string;
  // Legacy nutrition chips (kept for back-compat)
  nutritionItems: string[];
  // New nutrition tracker
  foods: FoodEntry[];
  waterMl: number;
  // Sport / exercise
  sportMinutes: number;
  sportTypes: string[];
  workoutsDone: string[]; // exercise ids completed
  // Body
  weightKg?: number;
  // Daily habits
  habits: Partial<Record<HabitKey, boolean>>;
}

const KEY = "hb_daily_log";

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function emptyLog(date: string): DailyLog {
  return {
    date,
    nutritionItems: [],
    foods: [],
    waterMl: 0,
    sportMinutes: 0,
    sportTypes: [],
    workoutsDone: [],
    habits: {},
  };
}

// Migrate older logs that may be missing newer fields
function normalize(log: Partial<DailyLog> & { date: string }): DailyLog {
  return {
    ...emptyLog(log.date),
    ...log,
    nutritionItems: log.nutritionItems ?? [],
    foods: log.foods ?? [],
    waterMl: log.waterMl ?? 0,
    sportTypes: log.sportTypes ?? [],
    workoutsDone: log.workoutsDone ?? [],
    habits: log.habits ?? {},
    sportMinutes: log.sportMinutes ?? 0,
  };
}

type LogMap = Record<string, DailyLog>;

function readAll(): LogMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as LogMap;
    const out: LogMap = {};
    for (const k of Object.keys(parsed)) out[k] = normalize(parsed[k]);
    return out;
  } catch {
    return {};
  }
}

function writeAll(map: LogMap) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(map));
}

export function loadTodayLog(): DailyLog {
  const k = todayKey();
  const all = readAll();
  return all[k] ?? emptyLog(k);
}

export function saveTodayLog(log: DailyLog) {
  const all = readAll();
  all[log.date] = normalize(log);
  writeAll(all);
}

export function loadLogHistory(days = 30): DailyLog[] {
  const all = readAll();
  const out: DailyLog[] = [];
  const now = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const k = todayKey(d);
    if (all[k]) out.push(all[k]);
  }
  return out;
}

export function loadAllLogs(): DailyLog[] {
  return Object.values(readAll()).sort((a, b) => a.date.localeCompare(b.date));
}

function isLogged(log: DailyLog): boolean {
  return (
    (log.sleepHours ?? 0) > 0 ||
    log.foods.length > 0 ||
    log.nutritionItems.length > 0 ||
    log.sportMinutes > 0 ||
    log.workoutsDone.length > 0 ||
    log.waterMl > 0 ||
    Object.values(log.habits).some(Boolean)
  );
}

export function computeStreak(): number {
  const all = readAll();
  let streak = 0;
  const now = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const k = todayKey(d);
    const log = all[k];
    if (log && isLogged(log)) streak++;
    else if (i === 0) continue;
    else break;
  }
  return streak;
}

// Per-habit streak
export function computeHabitStreak(habit: HabitKey): number {
  const all = readAll();
  let streak = 0;
  const now = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const k = todayKey(d);
    const log = all[k];
    if (log && log.habits[habit]) streak++;
    else if (i === 0) continue;
    else break;
  }
  return streak;
}

// Aggregate daily nutrition totals
export function nutritionTotals(log: DailyLog) {
  return log.foods.reduce(
    (acc, f) => ({
      calories: acc.calories + f.calories,
      proteinG: acc.proteinG + f.proteinG,
      calciumMg: acc.calciumMg + f.calciumMg,
      vitaminDIu: acc.vitaminDIu + f.vitaminDIu,
    }),
    { calories: 0, proteinG: 0, calciumMg: 0, vitaminDIu: 0 },
  );
}

// Daily habit log — local-storage keyed by YYYY-MM-DD. No accounts.
export interface DailyLog {
  date: string;
  sleepHours?: number;
  nutritionItems: string[]; // e.g. ["protein", "dairy"]
  sportMinutes: number;
  sportTypes: string[];
}

const KEY = "hb_daily_log";

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function emptyLog(date: string): DailyLog {
  return { date, nutritionItems: [], sportMinutes: 0, sportTypes: [] };
}

type LogMap = Record<string, DailyLog>;

function readAll(): LogMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as LogMap) : {};
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
  all[log.date] = log;
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

function isLogged(log: DailyLog): boolean {
  return (
    (log.sleepHours ?? 0) > 0 ||
    log.nutritionItems.length > 0 ||
    log.sportMinutes > 0
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
    else if (i === 0) continue; // today not logged yet — don't break streak
    else break;
  }
  return streak;
}

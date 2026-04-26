// Weekly self-measurements log. Stored locally per device.
export interface MeasurementEntry {
  date: string; // YYYY-MM-DD
  ts: number;
  heightCm?: number;
  weightKg?: number;
  note?: string;
}

const KEY = "hb_measurements";

function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function loadMeasurements(): MeasurementEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as MeasurementEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveMeasurements(list: MeasurementEntry[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function addMeasurement(entry: Omit<MeasurementEntry, "date" | "ts">) {
  const list = loadMeasurements();
  const date = todayKey();
  const ts = Date.now();
  // Replace today's entry if exists
  const filtered = list.filter((e) => e.date !== date);
  const next = [...filtered, { ...entry, date, ts }].sort((a, b) => a.ts - b.ts);
  saveMeasurements(next);
  return next;
}

export function isSundayMeasurementDue(): boolean {
  const now = new Date();
  if (now.getDay() !== 0) return false; // 0 = Sunday
  const list = loadMeasurements();
  if (list.length === 0) return true;
  const last = list[list.length - 1];
  return last.date !== todayKey();
}

export function daysUntilNextSunday(): number {
  const now = new Date();
  const dow = now.getDay();
  return dow === 0 ? 0 : 7 - dow;
}

export function lastEntry(): MeasurementEntry | null {
  const list = loadMeasurements();
  return list.length ? list[list.length - 1] : null;
}

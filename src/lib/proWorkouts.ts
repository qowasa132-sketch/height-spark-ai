// Curated YouTube workouts for height & posture, with localStorage progress.
export interface ProWorkout {
  id: string;
  title: string;
  category: "spine" | "stretch" | "strength" | "mobility";
  durationMin: number;
  youtubeId: string;
  description: string;
}

export const PRO_WORKOUTS: ProWorkout[] = [
  { id: "hang-routine", title: "تعليق على البار لإطالة العمود الفقري", category: "spine", durationMin: 5, youtubeId: "RP7T7iXbpKc", description: "روتين تعليق متدرج لفك ضغط الفقرات وزيادة المسافة بينها." },
  { id: "cobra-stretch", title: "إطالة الكوبرا للظهر", category: "stretch", durationMin: 8, youtubeId: "Z9g-Y0K1VEM", description: "إطالة لطيفة لأسفل الظهر تساعد على تحسين الانحناء." },
  { id: "decompression", title: "تمارين فك ضغط العمود الفقري", category: "spine", durationMin: 12, youtubeId: "pkjQ9rZcnxY", description: "روتين شامل لفك الضغط عن العمود الفقري بدون معدات." },
  { id: "full-stretch", title: "إطالة كاملة للجسم — ١٥ دقيقة", category: "stretch", durationMin: 15, youtubeId: "g_tea8ZNk5A", description: "روتين إطالة شامل لكل عضلات الجسم." },
  { id: "posture-fix", title: "إصلاح الوضعية في ١٠ دقائق", category: "mobility", durationMin: 10, youtubeId: "RqcOCBb4arc", description: "تمارين تصحيح الوضعية للعنق والكتفين." },
  { id: "core-strength", title: "تقوية الجذع لدعم الفقرات", category: "strength", durationMin: 10, youtubeId: "DHD1-2P94DI", description: "تمارين بطن وظهر لتثبيت العمود الفقري." },
  { id: "yoga-tall", title: "يوغا للطول والمرونة", category: "mobility", durationMin: 20, youtubeId: "EvMTrP4eEJ8", description: "جلسة يوغا تركّز على الإطالة الرأسية." },
  { id: "morning-mobility", title: "روتين صباحي للحركة", category: "mobility", durationMin: 7, youtubeId: "nZcLEmPoGpA", description: "ابدأ يومك بحركة كاملة لكل المفاصل." },
];

export interface WorkoutLog {
  workoutId: string;
  date: string; // YYYY-MM-DD
  intensity?: number; // 1-10
  notes?: string;
}

const KEY = "hb_pro_workouts";

export function loadWorkoutLogs(): WorkoutLog[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as WorkoutLog[]) : [];
  } catch { return []; }
}

export function logWorkout(entry: WorkoutLog) {
  if (typeof window === "undefined") return;
  const all = loadWorkoutLogs();
  all.push(entry);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function workoutStats() {
  const all = loadWorkoutLogs();
  const today = new Date().toISOString().slice(0, 10);
  return {
    total: all.length,
    today: all.filter((l) => l.date === today).length,
    thisWeek: all.filter((l) => {
      const d = new Date(l.date);
      const diff = (Date.now() - d.getTime()) / 86400000;
      return diff <= 7;
    }).length,
  };
}

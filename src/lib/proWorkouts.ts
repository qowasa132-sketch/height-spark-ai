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
  { id: "hang-bar", title: "التعليق على البار لفك ضغط الفقرات", category: "spine", durationMin: 7, youtubeId: "MTKyXTHiWfQ", description: "كيف يساعد التعليق على البار العمود الفقري — شرح وتطبيق." },
  { id: "dead-hang", title: "التعليق الميت لفك الضغط ومرونة الكتف", category: "spine", durationMin: 7, youtubeId: "0EyK4MlzCvM", description: "روتين التعليق الميت للعمود الفقري وحزام الكتف." },
  { id: "yoga-tall-asanas", title: "٥ وضعيات يوغا لزيادة الطول طبيعياً", category: "mobility", durationMin: 6, youtubeId: "DdprJId3jkU", description: "أساناس يوغا تستهدف إطالة العمود الفقري والساقين." },
  { id: "grow-taller-yoga", title: "١٠ دقائق يوغا للطول — روتين يومي", category: "mobility", durationMin: 10, youtubeId: "yz6F8-w3K-o", description: "روتين يومي بسيط أثبت فعاليته في تحسين الوضعية والظهور أطول." },
  { id: "full-stretch-mizi", title: "إطالة كاملة الجسم لزيادة الطول وتحسين الوضعية", category: "stretch", durationMin: 20, youtubeId: "8PRxdvMND-A", description: "روتين إطالة شامل من قناة MIZI." },
  { id: "look-taller-yoga", title: "١٠ دقائق يوغا لتظهر أطول فوراً", category: "mobility", durationMin: 10, youtubeId: "HXiJ6hIxLGE", description: "وضعيات تفتح الصدر وتُطيل العمود الفقري." },
  { id: "cobra-pose", title: "وضعية الكوبرا الصحيحة للظهر", category: "stretch", durationMin: 3, youtubeId: "mMnv_lgta4w", description: "شرح سريع لوضعية الكوبرا بشكل آمن وفعّال." },
  { id: "morning-mobility", title: "٧ دقائق حركة صباحية لكامل الجسم", category: "mobility", durationMin: 7, youtubeId: "MqgDKhch6v8", description: "ابدأ يومك بروتين حركة شامل لكل المفاصل." },
  { id: "daily-stretch-7", title: "٧ دقائق إطالة يومية — مرونة كاملة", category: "stretch", durationMin: 7, youtubeId: "XQzqWAhiCJc", description: "إطالة يومية لكامل الجسم لتخفيف التوتر." },
  { id: "morning-flex", title: "روتين صباحي للمرونة والتيبّس", category: "mobility", durationMin: 14, youtubeId: "fBABKia1G7U", description: "روتين صباحي مع Yoga With Tim لإزالة التيبس." },
  { id: "headstand-yoga", title: "يوغا الوقوف على الرأس لزيادة الطول", category: "strength", durationMin: 10, youtubeId: "WpxAceWDszI", description: "تمرين متقدّم لتحسين الوضعية والثقة." },
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

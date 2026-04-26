// Curated YouTube workouts for height & posture, with localStorage progress.
// All video IDs verified working via YouTube oEmbed API.
export interface ProWorkout {
  id: string;
  title: string;
  category: "spine" | "stretch" | "strength" | "mobility";
  durationMin: number;
  youtubeId: string;
  description: string;
}

export const PRO_WORKOUTS: ProWorkout[] = [
  // Spine / decompression
  { id: "hang-bar", title: "التعليق على البار لفك ضغط الفقرات", category: "spine", durationMin: 7, youtubeId: "MTKyXTHiWfQ", description: "كيف يساعد التعليق على البار العمود الفقري — شرح وتطبيق." },
  { id: "dead-hang", title: "التعليق الميت لفك الضغط ومرونة الكتف", category: "spine", durationMin: 7, youtubeId: "0EyK4MlzCvM", description: "روتين التعليق الميت للعمود الفقري وحزام الكتف." },
  { id: "cobra-pose", title: "وضعية الكوبرا الصحيحة للظهر", category: "spine", durationMin: 3, youtubeId: "mMnv_lgta4w", description: "شرح سريع لوضعية الكوبرا بشكل آمن وفعّال." },
  { id: "mountain-pose", title: "وضعية الجبل (تاداسانا) للوضعية المثالية", category: "spine", durationMin: 4, youtubeId: "2HTvZp5rPrg", description: "أساس كل وضعيات اليوغا — تحسين محاذاة العمود الفقري." },

  // Mobility / yoga for height
  { id: "yoga-tall-asanas", title: "٥ وضعيات يوغا لزيادة الطول طبيعياً", category: "mobility", durationMin: 6, youtubeId: "DdprJId3jkU", description: "أساناس يوغا تستهدف إطالة العمود الفقري والساقين." },
  { id: "grow-taller-yoga", title: "١٠ دقائق يوغا للطول — روتين يومي", category: "mobility", durationMin: 10, youtubeId: "yz6F8-w3K-o", description: "روتين يومي بسيط لتحسين الوضعية والظهور أطول." },
  { id: "look-taller-yoga", title: "١٠ دقائق يوغا لتظهر أطول فوراً", category: "mobility", durationMin: 10, youtubeId: "HXiJ6hIxLGE", description: "وضعيات تفتح الصدر وتُطيل العمود الفقري." },
  { id: "morning-mobility", title: "٧ دقائق حركة صباحية لكامل الجسم", category: "mobility", durationMin: 7, youtubeId: "MqgDKhch6v8", description: "ابدأ يومك بروتين حركة شامل لكل المفاصل." },
  { id: "morning-flex", title: "روتين صباحي للمرونة وإزالة التيبّس", category: "mobility", durationMin: 14, youtubeId: "fBABKia1G7U", description: "روتين صباحي مع Yoga With Tim لإزالة التيبس." },
  { id: "morning-yoga-beginners", title: "١٠ دقائق يوغا صباحية للمبتدئين", category: "mobility", durationMin: 10, youtubeId: "VaoV1PrYft4", description: "روتين صباحي لطيف من Sarah Beth Yoga." },
  { id: "yoga-beginners-20", title: "٢٠ دقيقة يوغا للمبتدئين في المنزل", category: "mobility", durationMin: 20, youtubeId: "v7AYKMP6rOE", description: "روتين كامل من Yoga With Adriene." },
  { id: "morning-yoga-kassandra", title: "١٠ دقائق إطالة يوغا صباحية", category: "mobility", durationMin: 10, youtubeId: "4pKly2JojMw", description: "روتين سريع مع Yoga with Kassandra." },
  { id: "yoga-day1-adriene", title: "اليوم ١ — تخفّف معنا (٣٠ يوم يوغا)", category: "mobility", durationMin: 25, youtubeId: "oBu-pQG6sTY", description: "بداية تحدي ٣٠ يوم من Yoga With Adriene." },
  { id: "yoga-teens", title: "يوغا للمراهقين", category: "mobility", durationMin: 25, youtubeId: "7kgZnJqzNaU", description: "روتين يوغا مصمّم خصيصاً للمراهقين في فترة النمو." },
  { id: "desk-yoga", title: "يوغا على المكتب — لمن يجلس كثيراً", category: "mobility", durationMin: 10, youtubeId: "tAUf7aajBWE", description: "حركات سريعة لتعديل الوضعية أثناء الجلوس." },

  // Stretching / flexibility
  { id: "full-stretch-mizi", title: "إطالة كاملة للجسم لزيادة الطول", category: "stretch", durationMin: 20, youtubeId: "8PRxdvMND-A", description: "روتين إطالة شامل من قناة MIZI." },
  { id: "daily-stretch-7", title: "٧ دقائق إطالة يومية — مرونة كاملة", category: "stretch", durationMin: 7, youtubeId: "XQzqWAhiCJc", description: "إطالة يومية لكامل الجسم لتخفيف التوتر." },
  { id: "full-body-stretch-15", title: "١٥ دقيقة إطالة شاملة يومية", category: "stretch", durationMin: 15, youtubeId: "g_tea8ZNk5A", description: "روتين كامل من Mady Morrison للمرونة والاسترخاء." },
  { id: "beginner-stretch-15", title: "١٥ دقيقة إطالة للمبتدئين", category: "stretch", durationMin: 15, youtubeId: "L_xrDAtykMI", description: "روتين مرونة للمبتدئين مع Tom Merrick." },
  { id: "stretch-anxiety", title: "٢٠ دقيقة إطالة لتخفيف التوتر", category: "stretch", durationMin: 20, youtubeId: "sTANio_2E0Q", description: "يوغا/إطالة للقلق والتوتر مع MadFit." },
  { id: "bowflex-stretch-5", title: "٥ دقائق إطالة كاملة للجسم", category: "stretch", durationMin: 5, youtubeId: "2L2lnxIcNmo", description: "إطالة سريعة قبل/بعد التمرين من Bowflex." },
  { id: "stretch-not-flexible", title: "٨ دقائق إطالة لغير المرنين", category: "stretch", durationMin: 8, youtubeId: "FI51zRzgIe4", description: "بداية مثالية لمن يبدأ من الصفر." },
  { id: "beginner-flex-madfit", title: "روتين مرونة للمبتدئين", category: "stretch", durationMin: 12, youtubeId: "qULTwquOuT4", description: "إطالات لمن يفتقر للمرونة — MadFit." },
  { id: "deep-stretch-yoga", title: "يوغا إطالة عميقة للجسم كامل", category: "stretch", durationMin: 40, youtubeId: "GLy2rYHwUqY", description: "جلسة طويلة من Yoga With Adriene للمرونة." },
  { id: "full-body-flow", title: "٢٠ دقيقة فلو يوغا لكامل الجسم", category: "stretch", durationMin: 20, youtubeId: "b1H3xO3x_Js", description: "تدفق متوازن لتحسين المرونة والوضعية." },
  { id: "yoga-strength-flex", title: "يوغا قوة ومرونة ٢٥ دقيقة", category: "stretch", durationMin: 25, youtubeId: "Eml2xnoLpYE", description: "روتين قوة ومرونة مع growingannanas." },

  // Strength
  { id: "headstand-yoga", title: "يوغا الوقوف على الرأس لزيادة الطول", category: "strength", durationMin: 10, youtubeId: "WpxAceWDszI", description: "تمرين متقدّم لتحسين الوضعية والثقة." },
  { id: "no-gym-tabata", title: "تاباتا كامل للجسم بدون أدوات", category: "strength", durationMin: 5, youtubeId: "Tz9d7By2ytQ", description: "٥ دقائق تاباتا عالية الكثافة." },
  { id: "no-repeat-strength", title: "٣٠ دقيقة قوة لكامل الجسم", category: "strength", durationMin: 30, youtubeId: "tj0o8aH9vJw", description: "تمرين قوة بدون تكرار للحركات." },
  { id: "dumbbell-home", title: "أفضل ١٠ تمارين دمبل في المنزل", category: "strength", durationMin: 12, youtubeId: "w86EalEoFRY", description: "بناء العضلات بالأوزان البسيطة." },
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

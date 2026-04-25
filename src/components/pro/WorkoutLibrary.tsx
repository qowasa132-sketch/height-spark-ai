// Curated YouTube workout library + progress tracker
import { useEffect, useState } from "react";
import { Play, X, Check, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { PRO_WORKOUTS, loadWorkoutLogs, logWorkout, workoutStats, type ProWorkout } from "@/lib/proWorkouts";

const CATEGORIES = [
  { id: "all", label: "الكل" },
  { id: "spine", label: "العمود الفقري" },
  { id: "stretch", label: "إطالة" },
  { id: "mobility", label: "حركة" },
  { id: "strength", label: "تقوية" },
] as const;

export function WorkoutLibrary() {
  const [cat, setCat] = useState<string>("all");
  const [open, setOpen] = useState<ProWorkout | null>(null);
  const [stats, setStats] = useState({ total: 0, today: 0, thisWeek: 0 });
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    setStats(workoutStats());
    const today = new Date().toISOString().slice(0, 10);
    setCompleted(new Set(loadWorkoutLogs().filter((l) => l.date === today).map((l) => l.workoutId)));
  }, []);

  const filtered = cat === "all" ? PRO_WORKOUTS : PRO_WORKOUTS.filter((w) => w.category === cat);

  const markDone = (w: ProWorkout) => {
    logWorkout({ workoutId: w.id, date: new Date().toISOString().slice(0, 10) });
    setStats(workoutStats());
    setCompleted((prev) => new Set([...prev, w.id]));
    toast.success("أحسنت! تم تسجيل التمرين 💪");
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <StatBox label="اليوم" value={stats.today} />
        <StatBox label="الأسبوع" value={stats.thisWeek} />
        <StatBox label="الإجمالي" value={stats.total} />
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-smooth ${cat === c.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((w) => (
          <div key={w.id} className="overflow-hidden rounded-xl border border-border bg-card/60">
            <button onClick={() => setOpen(w)} className="flex w-full items-center gap-3 p-3 text-start">
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                <img src={`https://img.youtube.com/vi/${w.youtubeId}/mqdefault.jpg`} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play className="h-5 w-5 fill-white text-white" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{w.title}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{w.durationMin} دقيقة</p>
              </div>
              {completed.has(w.id) && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </div>
              )}
            </button>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/70 backdrop-blur-sm sm:items-center sm:justify-center" onClick={() => setOpen(null)}>
          <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-border bg-card p-4 sm:rounded-3xl">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold">{open.title}</h3>
                <p className="text-xs text-muted-foreground">{open.durationMin} دقيقة</p>
              </div>
              <button onClick={() => setOpen(null)} className="rounded-full bg-muted p-1.5"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-3 aspect-video overflow-hidden rounded-xl bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${open.youtubeId}?rel=0`}
                title={open.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{open.description}</p>
            <button
              onClick={() => { markDone(open); setOpen(null); }}
              disabled={completed.has(open.id)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
            >
              <TrendingUp className="h-4 w-4" />
              {completed.has(open.id) ? "تم اليوم ✓" : "سجّل كمكتمل"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card/60 p-2.5 text-center">
      <p className="text-xl font-bold text-primary">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

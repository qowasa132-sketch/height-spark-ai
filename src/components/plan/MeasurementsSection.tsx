import { useState } from "react";
import { Ruler, Plus, TrendingUp, CalendarCheck } from "lucide-react";
import { toast } from "sonner";
import { SectionCard, Stat } from "./SectionCard";
import { RewardGate } from "@/components/RewardGate";
import {
  loadMeasurements,
  addMeasurement,
  isSundayMeasurementDue,
  daysUntilNextSunday,
  lastEntry,
  type MeasurementEntry,
} from "@/lib/measurements";
import { loadProfile, saveProfile } from "@/lib/profile";

const DAY_NAMES = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

export function MeasurementsSection() {
  const profile = loadProfile();
  const [entries, setEntries] = useState<MeasurementEntry[]>(() => loadMeasurements());
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState<string>(() => String(lastEntry()?.heightCm ?? profile.heightCm ?? ""));
  const [weight, setWeight] = useState<string>(() => String(lastEntry()?.weightKg ?? profile.weightKg ?? ""));

  const due = isSundayMeasurementDue();
  const daysLeft = daysUntilNextSunday();
  const last = entries[entries.length - 1];
  const first = entries[0];

  const heightDelta =
    last && first && last.heightCm != null && first.heightCm != null
      ? +(last.heightCm - first.heightCm).toFixed(1)
      : 0;
  const weightDelta =
    last && first && last.weightKg != null && first.weightKg != null
      ? +(last.weightKg - first.weightKg).toFixed(1)
      : 0;

  const handleSave = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h && !w) {
      toast.error("أدخل قياساً واحداً على الأقل");
      return;
    }
    const next = addMeasurement({
      heightCm: isFinite(h) && h > 0 ? h : undefined,
      weightKg: isFinite(w) && w > 0 ? w : undefined,
    });
    setEntries(next);
    // Sync latest into profile so the rest of the app uses it
    const patch = { ...profile };
    if (isFinite(h) && h > 0) patch.heightCm = h;
    if (isFinite(w) && w > 0) patch.weightKg = w;
    saveProfile(patch);
    setOpen(false);
    toast.success("تم حفظ القياسات", { description: "أحسنت! استمر في المتابعة الأسبوعية." });
  };

  // Last 6 entries for mini chart
  const recent = entries.slice(-6);
  const heights = recent.map((e) => e.heightCm).filter((v): v is number => v != null);
  const minH = heights.length ? Math.min(...heights) - 0.5 : 0;
  const maxH = heights.length ? Math.max(...heights) + 0.5 : 1;
  const range = Math.max(0.5, maxH - minH);

  return (
    <SectionCard
      icon={<Ruler className="h-5 w-5" />}
      title="القياسات الأسبوعية"
      hint={due ? "اليوم الأحد — وقت تسجيل قياساتك! 📏" : `قياسك القادم بعد ${daysLeft} يوم`}
      right={
        due ? (
          <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
            مستحق
          </span>
        ) : (
          <CalendarCheck className="h-4 w-4 text-muted-foreground" />
        )
      }
    >
      {!open ? (
        <>
          <div className="grid grid-cols-3 gap-2">
            <Stat
              label="آخر طول"
              value={last?.heightCm != null ? last.heightCm.toFixed(1) : "—"}
              suffix={last?.heightCm != null ? "سم" : undefined}
            />
            <Stat
              label="آخر وزن"
              value={last?.weightKg != null ? last.weightKg.toFixed(1) : "—"}
              suffix={last?.weightKg != null ? "كجم" : undefined}
            />
            <Stat label="عدد القياسات" value={entries.length} />
          </div>

          {entries.length > 1 && (
            <div className="mt-3 rounded-2xl border border-border bg-background/40 p-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5" />
                  تقدمك منذ البداية
                </div>
                <div className="font-bold">
                  <span className={heightDelta > 0 ? "text-primary" : "text-foreground"}>
                    {heightDelta > 0 ? "+" : ""}
                    {heightDelta} سم
                  </span>
                  <span className="mx-1 text-muted-foreground">·</span>
                  <span className="text-foreground">
                    {weightDelta > 0 ? "+" : ""}
                    {weightDelta} كجم
                  </span>
                </div>
              </div>
              {heights.length >= 2 && (
                <div className="mt-3 flex h-12 items-end justify-between gap-1">
                  {recent.map((e, i) => {
                    const v = e.heightCm;
                    const pct = v != null ? ((v - minH) / range) * 100 : 0;
                    return (
                      <div key={i} className="flex flex-1 flex-col items-center gap-1">
                        <div
                          className="w-full rounded-t-md bg-gradient-primary"
                          style={{ height: `${Math.max(8, pct)}%` }}
                          title={v != null ? `${v} سم` : ""}
                        />
                        <span className="text-[9px] text-muted-foreground">
                          {DAY_NAMES[new Date(e.ts).getDay()].slice(0, 3)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <RewardGate actionName="log your measurements" onReward={() => setOpen(true)}>
            <button
              type="button"
              className={`mt-3 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                due
                  ? "bg-gradient-primary text-primary-foreground shadow-glow"
                  : "border border-border bg-background/40 text-foreground"
              }`}
            >
              <Plus className="h-4 w-4" />
              {entries.length === 0 ? "سجّل أول قياس" : due ? "أضف قياسات اليوم" : "إضافة قياس جديد"}
            </button>
          </RewardGate>
        </>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">الطول (سم)</label>
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
              placeholder="مثال: 172.5"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">الوزن (كجم)</label>
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
              placeholder="مثال: 65"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-2xl border border-border bg-background/40 px-4 py-2.5 text-sm font-medium text-foreground"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 rounded-2xl bg-gradient-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-glow"
            >
              حفظ
            </button>
          </div>
        </div>
      )}
    </SectionCard>
  );
}

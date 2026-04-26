import { Target, Check, Flame } from "lucide-react";
import { SectionCard } from "./SectionCard";
import { RewardGate } from "@/components/RewardGate";
import { HABIT_KEYS, computeHabitStreak, type DailyLog, type HabitKey } from "@/lib/dailyLog";

const HABITS: { key: HabitKey; emoji: string; label: string }[] = [
  { key: "noScreens", emoji: "📵", label: "إيقاف الشاشات قبل النوم بساعة" },
  { key: "noCaffeine", emoji: "☕", label: "بدون كافيين قبل النوم بـ ٨ ساعات" },
  { key: "vitamins", emoji: "💊", label: "فيتامينات الزنك + D3" },
  { key: "steps10k", emoji: "🚶", label: "المشي ١٠,٠٠٠ خطوة" },
  { key: "water2L", emoji: "💧", label: "شرب ٢ لتر ماء" },
  { key: "exercise1h", emoji: "🏃", label: "ساعة تمرين" },
];

interface Props {
  log: DailyLog;
  update: (patch: Partial<DailyLog>) => void;
}

export function HabitsSection({ log, update }: Props) {
  const completed = HABIT_KEYS.filter((k) => log.habits[k]).length;

  const toggle = (key: HabitKey) => {
    update({ habits: { ...log.habits, [key]: !log.habits[key] } });
  };

  return (
    <SectionCard
      icon={<Target className="h-5 w-5" />}
      title="عاداتي اليومية"
      hint="ست عادات صغيرة ترفع طولك المحتمل"
      right={
        <span className="text-[10px] text-muted-foreground">
          {completed} / {HABIT_KEYS.length}
        </span>
      }
    >
      <ul className="space-y-2">
        {HABITS.map((h) => {
          const done = !!log.habits[h.key];
          const streak = done ? computeHabitStreak(h.key) : 0;
          return (
            <li key={h.key}>
              <RewardGate actionName={`log "${h.label}"`} onReward={() => toggle(h.key)}>
                <button
                  type="button"
                  className={`flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-start transition-smooth ${
                    done ? "border-primary bg-primary/10" : "border-border bg-background/40"
                  }`}
                >
                  <span className="text-2xl">{h.emoji}</span>
                  <span className="flex-1 text-sm font-medium text-foreground">{h.label}</span>
                  {streak > 1 && (
                    <span className="flex items-center gap-0.5 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                      <Flame className="h-3 w-3" /> {streak}
                    </span>
                  )}
                  <span
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                      done ? "border-primary bg-primary text-primary-foreground" : "border-border"
                    }`}
                  >
                    {done && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  </span>
                </button>
              </RewardGate>
            </li>
          );
        })}
      </ul>
    </SectionCard>
  );
}

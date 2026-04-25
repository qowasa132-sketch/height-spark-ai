import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Flame, Bell, Trophy } from "lucide-react";
import { toast } from "sonner";
import { BottomTabs } from "@/components/BottomTabs";
import { loadProfile } from "@/lib/profile";
import {
  loadTodayLog,
  saveTodayLog,
  computeStreak,
  type DailyLog,
} from "@/lib/dailyLog";
import { ExerciseSection } from "@/components/plan/ExerciseSection";
import { NutritionSection } from "@/components/plan/NutritionSection";
import { SleepSection } from "@/components/plan/SleepSection";
import { HabitsSection } from "@/components/plan/HabitsSection";
import { RemindersDrawer } from "@/components/plan/RemindersDrawer";
import { BadgesDrawer } from "@/components/plan/BadgesDrawer";
import { evaluateBadges, BADGES } from "@/lib/badges";
import { loadReminderSettings, tickReminders } from "@/lib/notifications";

export const Route = createFileRoute("/plan")({
  component: PlanPage,
  head: () => ({ meta: [{ title: "خطتك اليومية — هايت بوست" }] }),
});

function PlanPage() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [log, setLog] = useState<DailyLog | null>(null);
  const [streak, setStreak] = useState(0);
  const [remindersOpen, setRemindersOpen] = useState(false);
  const [badgesOpen, setBadgesOpen] = useState(false);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    const profile = loadProfile();
    if (!profile.completedAt) {
      navigate({ to: "/" });
      return;
    }
    setLog(loadTodayLog());
    setStreak(computeStreak());
    setMounted(true);

    // Reminder loop while page is open
    const fire = () => tickReminders(loadReminderSettings());
    fire();
    tickRef.current = window.setInterval(fire, 60_000) as unknown as number;
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, [navigate]);

  if (!mounted || !log) {
    return (
      <main className="min-h-screen bg-background pb-24">
        <BottomTabs active="free" />
      </main>
    );
  }

  const update = (patch: Partial<DailyLog>) => {
    const next = { ...log, ...patch };
    setLog(next);
    saveTodayLog(next);
    setStreak(computeStreak());
    // Evaluate badges and announce new ones
    const newly = evaluateBadges();
    for (const id of newly) {
      const b = BADGES.find((x) => x.id === id);
      if (b) toast.success(`إنجاز جديد ${b.emoji}`, { description: b.name });
    }
  };

  return (
    <main className="relative min-h-screen bg-background pb-24">
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-glow opacity-40 pointer-events-none" />
      <div className="relative mx-auto max-w-md px-5 pt-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-foreground glow-text">خطتك اليومية</h1>
            <p className="mt-1 text-sm text-muted-foreground">عادات صغيرة، سنتيمترات كبيرة.</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setBadgesOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/80 text-foreground backdrop-blur-md"
              aria-label="الإنجازات"
            >
              <Trophy className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setRemindersOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/80 text-foreground backdrop-blur-md"
              aria-label="التذكيرات"
            >
              <Bell className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1 rounded-full border border-primary/30 bg-card/80 px-2.5 py-1.5 backdrop-blur-md">
              <Flame className={`h-4 w-4 ${streak > 0 ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-sm font-bold text-foreground">{streak}</span>
            </div>
          </div>
        </div>

        <ExerciseSection log={log} update={update} />
        <NutritionSection log={log} update={update} />
        <SleepSection log={log} update={update} />
        <HabitsSection log={log} update={update} />
      </div>

      <BottomTabs active="free" />

      {remindersOpen && <RemindersDrawer onClose={() => setRemindersOpen(false)} />}
      {badgesOpen && <BadgesDrawer onClose={() => setBadgesOpen(false)} />}
    </main>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Moon, Apple, Dumbbell, Flame, Check } from "lucide-react";
import { BottomTabs } from "@/components/BottomTabs";
import { loadProfile } from "@/lib/profile";
import {
  loadTodayLog,
  saveTodayLog,
  computeStreak,
  type DailyLog,
} from "@/lib/dailyLog";

export const Route = createFileRoute("/plan")({
  component: PlanPage,
  head: () => ({ meta: [{ title: "Daily Plan — HeightBoost" }] }),
});

const NUTRITION_KEYS = ["protein", "dairy", "greens", "fruit", "nuts", "eggs", "fish"] as const;
const SPORT_KEYS = ["stretching", "basketball", "swimming", "cycling", "jumprope", "running"] as const;
const SLEEP_GOAL = 8;
const NUTRITION_GOAL = 4;
const SPORT_GOAL = 30;

function PlanPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [log, setLog] = useState<DailyLog | null>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const profile = loadProfile();
    if (!profile.completedAt) {
      navigate({ to: "/" });
      return;
    }
    setLog(loadTodayLog());
    setStreak(computeStreak());
    setMounted(true);
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
  };

  const setSleep = (h: number) => update({ sleepHours: h });
  const toggleNutrition = (key: string) => {
    const has = log.nutritionItems.includes(key);
    update({
      nutritionItems: has
        ? log.nutritionItems.filter((k) => k !== key)
        : [...log.nutritionItems, key],
    });
  };
  const toggleSport = (key: string) => {
    const has = log.sportTypes.includes(key);
    const types = has ? log.sportTypes.filter((k) => k !== key) : [...log.sportTypes, key];
    // bump minutes by 10 when adding, leave alone when removing
    const minutes = has ? log.sportMinutes : Math.min(180, log.sportMinutes + 10);
    update({ sportTypes: types, sportMinutes: minutes });
  };
  const setSportMinutes = (m: number) => update({ sportMinutes: Math.max(0, Math.min(180, m)) });

  return (
    <main className="relative min-h-screen bg-background pb-24">
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-glow opacity-40 pointer-events-none" />
      <div className="relative mx-auto max-w-md px-5 pt-8">
        {/* Header + streak */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground glow-text">{t("plan.title")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t("plan.subtitle")}</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-card/80 px-3 py-1.5 backdrop-blur-md">
            <Flame className={`h-4 w-4 ${streak > 0 ? "text-primary" : "text-muted-foreground"}`} />
            <span className="text-sm font-bold text-foreground">{streak}</span>
          </div>
        </div>

        {/* Sleep */}
        <Section
          icon={<Moon className="h-5 w-5" />}
          title={t("plan.sleep.title")}
          hint={t("plan.sleep.hint")}
          progress={Math.min(100, ((log.sleepHours ?? 0) / SLEEP_GOAL) * 100)}
          goalLabel={t("plan.sleep.goal")}
        >
          <div className="flex items-baseline justify-center gap-2 py-2">
            <span className="text-5xl font-bold text-primary glow-text">{log.sleepHours ?? 0}</span>
            <span className="text-base text-muted-foreground">h</span>
          </div>
          <input
            type="range"
            min={4}
            max={12}
            step={0.5}
            value={log.sleepHours ?? 0}
            onChange={(e) => setSleep(Number(e.target.value))}
            className="w-full accent-[var(--primary)]"
          />
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
            <span>4h</span>
            <span>8h</span>
            <span>12h</span>
          </div>
        </Section>

        {/* Nutrition */}
        <Section
          icon={<Apple className="h-5 w-5" />}
          title={t("plan.nutrition.title")}
          hint={t("plan.nutrition.hint")}
          progress={Math.min(100, (log.nutritionItems.length / NUTRITION_GOAL) * 100)}
          goalLabel={t("plan.nutrition.goal")}
        >
          <div className="flex flex-wrap gap-2">
            {NUTRITION_KEYS.map((key) => {
              const active = log.nutritionItems.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => toggleNutrition(key)}
                  className={`flex items-center gap-1.5 rounded-full border-2 px-3.5 py-2 text-xs font-medium transition-smooth ${
                    active
                      ? "border-primary bg-primary/15 text-foreground shadow-glow"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {active && <Check className="h-3 w-3" strokeWidth={3} />}
                  {t(`plan.nutrition.items.${key}`)}
                </button>
              );
            })}
          </div>
        </Section>

        {/* Sport */}
        <Section
          icon={<Dumbbell className="h-5 w-5" />}
          title={t("plan.sport.title")}
          hint={t("plan.sport.hint")}
          progress={Math.min(100, (log.sportMinutes / SPORT_GOAL) * 100)}
          goalLabel={t("plan.sport.goal")}
        >
          <div className="flex flex-wrap gap-2">
            {SPORT_KEYS.map((key) => {
              const active = log.sportTypes.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => toggleSport(key)}
                  className={`rounded-full border-2 px-3.5 py-2 text-xs font-medium transition-smooth ${
                    active
                      ? "border-primary bg-primary/15 text-foreground shadow-glow"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {t(`plan.sport.types.${key}`)}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-card/80 px-4 py-3">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              {t("plan.sport.minutes", { count: log.sportMinutes })}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSportMinutes(log.sportMinutes - 5)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-foreground transition-smooth hover:border-primary"
                aria-label="-5 min"
              >
                −
              </button>
              <span className="w-10 text-center text-base font-bold text-foreground">{log.sportMinutes}</span>
              <button
                onClick={() => setSportMinutes(log.sportMinutes + 5)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-foreground transition-smooth hover:border-primary"
                aria-label="+5 min"
              >
                +
              </button>
            </div>
          </div>
        </Section>
      </div>

      <BottomTabs active="free" />
    </main>
  );
}

function Section({
  icon,
  title,
  hint,
  goalLabel,
  progress,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  hint: string;
  goalLabel: string;
  progress: number;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 rounded-3xl border border-border bg-card/80 p-5 backdrop-blur-md shadow-card">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-base font-bold text-foreground">{title}</h2>
            <span className="text-[10px] text-muted-foreground">{goalLabel}</span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
        </div>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-gradient-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

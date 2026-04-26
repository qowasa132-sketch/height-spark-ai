import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Settings, User, Moon, Apple, Dumbbell, Sparkles } from "lucide-react";
import { loadProfile, type Profile } from "@/lib/profile";
import { predict, cmToFtIn, type Prediction } from "@/lib/prediction";
import { loadTodayLog, type DailyLog } from "@/lib/dailyLog";
import { BottomTabs } from "@/components/BottomTabs";

export const Route = createFileRoute("/home")({
  component: HomePage,
  head: () => ({ meta: [{ title: "Home — HeightBoost" }] }),
});

function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<Profile>({ unit: "metric" });
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [log, setLog] = useState<DailyLog | null>(null);

  useEffect(() => {
    const p = loadProfile();
    if (!p.completedAt) {
      navigate({ to: "/" });
      return;
    }
    setProfile(p);
    setPrediction(predict(p));
    setLog(loadTodayLog());
    setMounted(true);
  }, [navigate]);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-background pb-24">
        <BottomTabs active="home" />
      </main>
    );
  }

  const isImperial = profile.unit === "imperial";
  const heightLabel = (cm: number) => {
    if (!isImperial) return `${cm.toFixed(1)} cm`;
    const { ft, in: inches } = cmToFtIn(cm);
    return `${ft}'${inches}"`;
  };

  const sleepValue = log?.sleepHours ? `${log.sleepHours}h` : "—";
  const nutritionValue = log ? String(log.nutritionItems.length) : "0";
  const sportValue = log ? `${log.sportMinutes}m` : "0";

  return (
    <main className="relative min-h-screen bg-background pb-24">
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-glow opacity-50 pointer-events-none" />

      <div className="relative mx-auto max-w-md px-5 pt-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/settings"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card/80 text-foreground backdrop-blur-md shadow-card transition-smooth hover:bg-card"
          >
            <Settings className="h-5 w-5" />
          </Link>
          <Link
            to="/profile"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card/80 text-foreground backdrop-blur-md shadow-card transition-smooth hover:bg-card"
          >
            <User className="h-5 w-5" />
          </Link>
        </div>

        {/* Hero prediction */}
        {prediction && (
          <section className="mt-8 rounded-3xl border border-primary/30 bg-card/80 p-6 backdrop-blur-md shadow-glow animate-[fade-in_0.5s_ease-out]">
            <p className="text-center text-xs uppercase tracking-widest text-muted-foreground">
              {t("home.predicted")}
            </p>
            <p className="mt-2 text-center text-6xl font-bold text-primary glow-text">
              {heightLabel(prediction.predictedCm)}
            </p>
            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {t("home.spurt")}
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {prediction.growthSpurtPct}%
                </p>
              </div>
              <div className="text-end">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  مفتوح
                </p>
                <p className="mt-1 text-2xl font-bold text-primary">
                  +{prediction.unlockedCm} سم
                </p>
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-gradient-primary transition-all duration-1000"
                style={{ width: `${prediction.growthSpurtPct}%` }}
              />
            </div>
          </section>
        )}

        {/* Dashboard cards — link to plan */}
        <section className="mt-6">
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {t("home.track")}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <DashCard to="/plan" icon={<Moon className="h-5 w-5" />} label={t("home.sleep")} value={sleepValue} />
            <DashCard to="/plan" icon={<Apple className="h-5 w-5" />} label={t("home.nutrition")} value={nutritionValue} />
            <DashCard to="/plan" icon={<Dumbbell className="h-5 w-5" />} label={t("home.sport")} value={sportValue} />
          </div>
        </section>

        {/* Premium teaser — Pro features still available via the Pro tab */}
        {!profile.isPremium && (
          <button
            onClick={() => navigate({ to: "/pro" })}
            className="mt-6 flex w-full items-center gap-3 rounded-2xl border border-primary/40 bg-primary/5 p-4 text-start transition-smooth hover:bg-primary/10"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">جرّب ميزات برو</p>
              <p className="text-xs text-muted-foreground">تحليل القوام بالذكاء، خطط طعام، والمزيد</p>
            </div>
          </button>
        )}
      </div>

      <BottomTabs active="home" />
    </main>
  );
}

function DashCard({
  icon,
  label,
  value,
  to,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  to: "/plan";
}) {
  return (
    <Link
      to={to}
      className="rounded-2xl border border-border bg-card p-4 shadow-card transition-smooth hover:border-primary/50"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
        {icon}
      </div>
      <p className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-lg font-bold text-foreground">{value}</p>
    </Link>
  );
}

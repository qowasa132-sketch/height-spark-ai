import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Settings, User, Moon, Apple, Dumbbell, Sparkles, Lock } from "lucide-react";
import { loadProfile, type Profile } from "@/lib/profile";
import { predict, cmToFtIn, type Prediction } from "@/lib/prediction";
import { BottomTabs } from "@/components/BottomTabs";

export const Route = createFileRoute("/home")({
  component: HomePage,
  head: () => ({ meta: [{ title: "Home — HeightBoost AI" }] }),
});

function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>({ unit: "metric" });
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  useEffect(() => {
    const p = loadProfile();
    if (!p.completedAt) {
      navigate({ to: "/" });
      return;
    }
    setProfile(p);
    setPrediction(predict(p));
  }, [navigate]);

  const isImperial = profile.unit === "imperial";
  const heightLabel = (cm: number) => {
    if (!isImperial) return `${cm.toFixed(1)} cm`;
    const { ft, in: inches } = cmToFtIn(cm);
    return `${ft}'${inches}"`;
  };

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
                  Unlocked
                </p>
                <p className="mt-1 text-2xl font-bold text-primary">
                  +{prediction.unlockedCm} cm
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

        {/* Dashboard cards */}
        <section className="mt-6">
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {t("home.track")}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <DashCard icon={<Moon className="h-5 w-5" />} label={t("home.sleep")} value={profile.sleepHours ? `${profile.sleepHours}h` : "—"} />
            <DashCard icon={<Apple className="h-5 w-5" />} label={t("home.nutrition")} value="0" />
            <DashCard icon={<Dumbbell className="h-5 w-5" />} label={t("home.sport")} value="0" />
          </div>
        </section>

        {/* Premium teaser */}
        {!profile.isPremium && (
          <button
            onClick={() => navigate({ to: "/paywall" })}
            className="mt-6 flex w-full items-center gap-3 rounded-2xl border border-primary/40 bg-primary/5 p-4 text-start transition-smooth hover:bg-primary/10"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Unlock Pro features</p>
              <p className="text-xs text-muted-foreground">AI posture, meal plans & more</p>
            </div>
            <Lock className="h-4 w-4 text-primary" />
          </button>
        )}
      </div>

      <BottomTabs active="home" />
    </main>
  );
}

function DashCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card transition-smooth hover:border-primary/50">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
        {icon}
      </div>
      <p className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-lg font-bold text-foreground">{value}</p>
    </div>
  );
}

export function BottomTabs({ active }: { active: "home" | "free" | "premium" | "ai" }) {
  const { t } = useTranslation();
  const tabs = [
    { id: "home" as const, label: t("tabs.home"), icon: HomeIcon, to: "/home" as const },
    { id: "free" as const, label: t("tabs.free"), icon: Apple, to: "/home" as const },
    { id: "premium" as const, label: t("tabs.premium"), icon: Sparkles, to: "/home" as const },
    { id: "ai" as const, label: t("tabs.ai"), icon: MessageCircle, to: "/home" as const },
  ];
  return (
    <nav className="fixed bottom-0 inset-x-0 z-20 border-t border-border bg-card/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md justify-around px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.id}
              to={tab.to}
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2 transition-smooth ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

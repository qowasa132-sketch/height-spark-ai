import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { loadProfile, saveProfile, type Profile } from "@/lib/profile";
import { predict, cmToFtIn, type Prediction } from "@/lib/prediction";
import { formatPriceUSD } from "@/lib/currency";

export const Route = createFileRoute("/paywall")({
  component: Paywall,
  head: () => ({ meta: [{ title: "Unlock your plan — HeightBoost" }] }),
});

type Plan = "yearly" | "monthly" | "weekly";

const WEEKLY_USD: Record<Plan, number> = {
  yearly: 2,
  monthly: 5,
  weekly: 10,
};

function Paywall() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>({ unit: "metric" });
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [selected, setSelected] = useState<Plan>("yearly");

  useEffect(() => {
    const p = loadProfile();
    setProfile(p);
    setPrediction(predict(p));
  }, []);

  const handleSubscribe = () => {
    // Mockup paywall — pretend to unlock and continue to Home
    saveProfile({ ...profile, isPremium: true });
    navigate({ to: "/home" });
  };

  const handleSkip = () => navigate({ to: "/home" });

  const isImperial = profile.unit === "imperial";
  const heightLabel = (cm: number) => {
    if (!isImperial) return `${cm.toFixed(1)} cm`;
    const { ft, in: inches } = cmToFtIn(cm);
    return `${ft}'${inches}"`;
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background pb-32">
      <div className="absolute inset-0 bg-gradient-glow opacity-60" />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
        <button
          onClick={handleSkip}
          className="absolute top-6 end-6 text-xs text-muted-foreground hover:text-foreground transition-smooth"
        >
          ✕
        </button>

        <div className="text-center animate-[fade-in_0.5s_ease-out]">
          <h1 className="text-3xl font-bold text-foreground glow-text">
            {t("paywall.title")}
          </h1>
        </div>

        {/* Prediction reveal */}
        {prediction && (
          <div className="mt-8 grid grid-cols-2 gap-3 animate-[fade-in_0.6s_ease-out]">
            <Stat
              label={t("paywall.predicted")}
              value={heightLabel(prediction.predictedCm)}
            />
            <Stat
              label={t("paywall.spurt")}
              value={`${prediction.growthSpurtPct}%`}
            />
          </div>
        )}

        {/* Plans */}
        <div className="mt-8 space-y-3">
          <PlanCard
            plan="yearly"
            label={t("paywall.yearly")}
            price={`${formatPriceUSD(WEEKLY_USD.yearly, i18n.language)}${t("paywall.perWeek")}`}
            badge={t("paywall.specialOffer")}
            featured
            selected={selected === "yearly"}
            onSelect={() => setSelected("yearly")}
          />
          <PlanCard
            plan="monthly"
            label={t("paywall.monthly")}
            price={`${formatPriceUSD(WEEKLY_USD.monthly, i18n.language)}${t("paywall.perWeek")}`}
            selected={selected === "monthly"}
            onSelect={() => setSelected("monthly")}
          />
          <PlanCard
            plan="weekly"
            label={t("paywall.weekly")}
            price={formatPriceUSD(WEEKLY_USD.weekly, i18n.language)}
            selected={selected === "weekly"}
            onSelect={() => setSelected("weekly")}
          />
        </div>

        <button
          onClick={handleSubscribe}
          className="mt-8 w-full rounded-2xl bg-gradient-primary py-4 text-base font-semibold text-primary-foreground shadow-glow transition-smooth active:scale-[0.98]"
        >
          {t("paywall.cta")}
        </button>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          {t("paywall.terms")} · {t("paywall.restore")}
        </p>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-primary/30 bg-card/80 p-4 text-center backdrop-blur-md shadow-card">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold text-primary glow-text">{value}</p>
    </div>
  );
}

function PlanCard({
  plan: _plan,
  label,
  price,
  badge,
  featured,
  selected,
  onSelect,
}: {
  plan: Plan;
  label: string;
  price: string;
  badge?: string;
  featured?: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`relative w-full rounded-2xl border-2 p-4 text-start transition-smooth ${
        selected
          ? "border-primary bg-primary/10 shadow-glow"
          : "border-border bg-card hover:border-primary/50"
      }`}
    >
      {badge && featured && (
        <span className="absolute -top-2.5 start-4 rounded-full bg-gradient-primary px-3 py-0.5 text-[10px] font-bold text-primary-foreground">
          {badge}
        </span>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
              selected ? "border-primary bg-primary" : "border-muted-foreground"
            }`}
          >
            {selected && <Check className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={3} />}
          </div>
          <span className="font-semibold text-foreground">{label}</span>
        </div>
        <span className="text-base font-bold text-primary">{price}</span>
      </div>
    </button>
  );
}

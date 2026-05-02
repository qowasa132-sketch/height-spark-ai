import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { BarChart3, FileText, LineChart, User, Shield, Check, Loader2 } from "lucide-react";

export const Route = createFileRoute("/loading")({
  component: Loading,
  head: () => ({ meta: [{ title: "Building your plan…" }] }),
});

function Loading() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const total = 6000;
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + 1;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate({ to: "/home" }), 400);
          return 100;
        }
        return next;
      });
    }, total / 100);
    return () => clearInterval(interval);
  }, [navigate]);

  const steps = [
    { key: "growthFactors", icon: BarChart3, threshold: 20 },
    { key: "genetic", icon: FileText, threshold: 40 },
    { key: "window", icon: LineChart, threshold: 60 },
    { key: "plan", icon: User, threshold: 80 },
    { key: "routine", icon: Shield, threshold: 100 },
  ] as const;

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-glow opacity-40" />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-6 pt-12 pb-8">
        <h1 className="text-center text-3xl font-bold text-foreground">
          {t("loading.title")}
        </h1>

        {/* Avatar with rings */}
        <div className="relative mx-auto my-10 flex h-44 w-44 items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-primary/20" />
          <div className="absolute inset-3 rounded-full border border-primary/30" />
          <div className="absolute inset-6 rounded-full border border-primary/40" />
          <div className="absolute inset-10 rounded-full bg-gradient-primary shadow-glow" />
          <User className="relative h-20 w-20 text-primary-foreground" strokeWidth={2} fill="currentColor" />
        </div>

        {/* Progression */}
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{t("loading.progression")}</span>
          <span className="text-sm font-semibold text-foreground">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-gradient-primary transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Steps */}
        <div className="mt-8 space-y-3">
          {steps.map((step, idx) => {
            const done = progress >= step.threshold;
            const active = !done && (idx === 0 || progress >= steps[idx - 1].threshold);
            const pending = !done && !active;
            const Icon = step.icon;
            return (
              <div
                key={step.key}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-4 transition-smooth ${
                  pending
                    ? "border-border/40 bg-muted/20 opacity-50"
                    : "border-primary/20 bg-primary/5"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    pending ? "bg-muted" : "bg-primary"
                  }`}
                >
                  {active ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary-foreground" />
                  ) : (
                    <Icon className={`h-5 w-5 ${pending ? "text-muted-foreground" : "text-primary-foreground"}`} />
                  )}
                </div>
                <span className={`flex-1 text-base font-medium ${pending ? "text-muted-foreground" : "text-foreground"}`}>
                  {t(`loading.steps.${step.key}`)}
                </span>
                {done && (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary">
                    <Check className="h-4 w-4 text-primary-foreground" strokeWidth={3} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

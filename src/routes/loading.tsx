import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/loading")({
  component: Loading,
  head: () => ({ meta: [{ title: "Building your plan…" }] }),
});

const STAGES = ["analyzing", "predicting", "building"] as const;

function Loading() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const total = 3500; // ms total
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + 1.2;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate({ to: "/home" }), 300);
          return 100;
        }
        if (next > 66) setStage(2);
        else if (next > 33) setStage(1);
        return next;
      });
    }, total / 100);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-glow opacity-60" />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6">
        {/* Animated rings */}
        <div className="relative mb-12 flex h-40 w-40 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
          <div className="absolute inset-4 rounded-full border-2 border-primary/50 animate-pulse" />
          <div className="absolute inset-8 rounded-full bg-gradient-primary shadow-glow animate-pulse" />
          <span className="relative text-3xl font-bold text-primary-foreground">
            {Math.round(progress)}%
          </span>
        </div>

        <h2 className="text-xl font-semibold text-foreground text-center min-h-[3rem]">
          {t(`loading.${STAGES[stage]}`)}
        </h2>

        <div className="mt-8 w-full max-w-xs">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-gradient-primary transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

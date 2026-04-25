import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import "@/lib/i18n";
import appIcon from "@/assets/app-icon.webp";

export const Route = createFileRoute("/")({
  component: Welcome,
  head: () => ({
    meta: [
      { title: "HeightBoost — Unlock Your Height Potential" },
      { name: "description", content: "Science-backed height prediction and a personalized growth plan. Private, no account needed." },
    ],
  }),
});

function LangToggle() {
  const { i18n: i } = useTranslation();
  const toggle = () => i.changeLanguage(i.language === "ar" ? "en" : "ar");
  return (
    <button
      onClick={toggle}
      className="absolute top-6 end-6 rounded-full border border-border bg-card/60 px-4 py-2 text-xs font-medium text-foreground backdrop-blur-md transition-smooth hover:bg-card"
    >
      {i.language === "ar" ? "English" : "العربية"}
    </button>
  );
}

function Welcome() {
  const { t, i18n: i } = useTranslation();
  const [, setTick] = useState(0);
  useEffect(() => {
    const onChange = () => setTick((n) => n + 1);
    i.on("languageChanged", onChange);
    return () => i.off("languageChanged", onChange);
  }, [i]);
  return (
    <main className="relative min-h-screen overflow-hidden bg-background" key={i.language}>
      <div className="absolute inset-0 bg-gradient-glow opacity-60 pointer-events-none" />
      <LangToggle />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col items-center justify-between px-6 py-16">
        <div />
        <div className="flex flex-col items-center text-center animate-[fade-in_0.6s_ease-out]">
          <img
            src={appIcon}
            alt="HeightBoost"
            className="h-32 w-32 rounded-3xl shadow-glow mb-8"
          />
          <h1 className="text-4xl font-bold tracking-tight text-foreground glow-text">
            {t("welcome.title")}
          </h1>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-xs">
            {t("welcome.subtitle")}
          </p>
        </div>
        <div className="w-full flex flex-col items-center gap-4">
          <Link
            to="/onboarding"
            className="w-full rounded-2xl bg-gradient-primary py-4 text-center text-base font-semibold text-primary-foreground shadow-glow transition-smooth active:scale-[0.98]"
          >
            {t("welcome.cta")}
          </Link>
          <p className="text-xs text-muted-foreground">{t("welcome.privacy")}</p>
        </div>
      </div>
    </main>
  );
}

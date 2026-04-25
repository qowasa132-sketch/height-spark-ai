import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import i18n, { normalizeLanguage, setAppLanguage } from "@/lib/i18n";
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
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const language = mounted ? normalizeLanguage(i.resolvedLanguage || i.language) : "en";
  const targetLanguage = language === "ar" ? "en" : "ar";
  const label = targetLanguage === "ar" ? "العربية" : "English";

  return (
    <button
      type="button"
      aria-label="Change language"
      onClick={() => setAppLanguage(normalizeLanguage(i.resolvedLanguage || i.language) === "ar" ? "en" : "ar")}
      className="absolute top-6 end-6 min-w-24 rounded-full border border-border bg-card/60 px-4 py-2 text-xs font-medium text-foreground backdrop-blur-md transition-smooth hover:bg-card"
    >
      {mounted ? label : "العربية"}
    </button>
  );
}

function Welcome() {
  const { t, i18n: i } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedLanguage = normalizeLanguage(localStorage.getItem("hb_lang") || i18n.language);
    setAppLanguage(storedLanguage);
    const onChange = () => setMounted(true);
    i.on("languageChanged", onChange);
    return () => i.off("languageChanged", onChange);
  }, [i]);

  const title = mounted ? t("welcome.title") : "HeightBoost";
  const subtitle = mounted
    ? t("welcome.subtitle")
    : "Discover your true height potential with science-backed analysis.";
  const cta = mounted ? t("welcome.cta") : "Start Free Analysis";
  const privacy = mounted ? t("welcome.privacy") : "100% private. No account needed.";

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
            {title}
          </h1>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-xs">
            {subtitle}
          </p>
        </div>
        <div className="w-full flex flex-col items-center gap-4">
          <Link
            to="/onboarding"
            className="w-full rounded-2xl bg-gradient-primary py-4 text-center text-base font-semibold text-primary-foreground shadow-glow transition-smooth active:scale-[0.98]"
          >
            {cta}
          </Link>
          <p className="text-xs text-muted-foreground">{privacy}</p>
        </div>
      </div>
    </main>
  );
}

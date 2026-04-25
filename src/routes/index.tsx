import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { setAppLanguage } from "@/lib/i18n";
import appIcon from "@/assets/app-icon.webp";

export const Route = createFileRoute("/")({
  component: Welcome,
  head: () => ({
    meta: [
      { title: "HeightBoost — اكتشف إمكانات طولك" },
      { name: "description", content: "توقع علمي لطولك وخطة نمو شخصية. خصوصية كاملة، لا حاجة لحساب." },
    ],
  }),
});

function Welcome() {
  const { t } = useTranslation();

  useEffect(() => {
    setAppLanguage("ar");
  }, []);

  const subtitle = t("welcome.subtitle");
  const cta = t("welcome.cta");
  const privacy = t("welcome.privacy");

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-glow opacity-60 pointer-events-none" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col items-center justify-between px-6 py-16">
        <div />
        <div className="flex flex-col items-center text-center animate-[fade-in_0.6s_ease-out]">
          <img
            src={appIcon}
            alt="HeightBoost"
            className="h-32 w-32 rounded-3xl shadow-glow mb-8"
          />
          <h1 className="text-4xl font-bold tracking-tight text-foreground glow-text" dir="ltr">
            HeightBoost
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

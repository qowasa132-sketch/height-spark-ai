import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Home as HomeIcon, Apple, Sparkles, MessageCircle } from "lucide-react";

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

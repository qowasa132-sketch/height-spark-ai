import { Link } from "@tanstack/react-router";
import { Home as HomeIcon, Apple, Sparkles } from "lucide-react";

type Tab = "home" | "free" | "premium" | "ai";

export function BottomTabs({ active }: { active: Tab }) {
  const tabs = [
    { id: "home" as const, label: "الرئيسية", icon: HomeIcon, to: "/home" as const },
    { id: "free" as const, label: "خطتي", icon: Apple, to: "/plan" as const },
    { id: "ai" as const, label: "برو AI", icon: Sparkles, to: "/pro" as const },
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

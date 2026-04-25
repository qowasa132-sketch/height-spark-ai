import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { loadProfile, type Profile } from "@/lib/profile";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({ meta: [{ title: "Profile — HeightBoost AI" }] }),
});

function ProfilePage() {
  const { t } = useTranslation();
  const [p, setP] = useState<Profile>({ unit: "metric" });

  useEffect(() => {
    setP(loadProfile());
  }, []);

  const rows: Array<[string, string]> = [
    ["Gender", p.gender ?? "—"],
    ["Age", p.age ? `${p.age}` : "—"],
    ["Ethnicity", p.ethnicity ?? "—"],
    ["Height", p.heightCm ? `${p.heightCm} cm` : "—"],
    ["Weight", p.weightKg ? `${p.weightKg} kg` : "—"],
    ["Mother's height", p.motherHeightCm ? `${p.motherHeightCm} cm` : "—"],
    ["Father's height", p.fatherHeightCm ? `${p.fatherHeightCm} cm` : "—"],
    ["Foot size", p.footSizeCm ? `${p.footSizeCm} cm` : "—"],
    ["Workout", p.workout ?? "—"],
    ["Facial hair", p.facialHair ?? "—"],
    ["Acne", p.acne ?? "—"],
    ["Underarm hair", p.underarmHair === undefined ? "—" : p.underarmHair ? "Yes" : "No"],
    ["Sleep", p.sleepHours ? `${p.sleepHours}h` : "—"],
    ["Dream height", p.dreamHeightCm ? `${p.dreamHeightCm} cm` : "—"],
  ];

  return (
    <main className="min-h-screen bg-background pb-12">
      <div className="mx-auto max-w-md px-5 pt-6">
        <div className="flex items-center gap-3">
          <Link
            to="/home"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground transition-smooth rtl:rotate-180"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-foreground">{t("home.profile")}</h1>
        </div>

        <ul className="mt-6 overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
          {rows.map(([k, v]) => (
            <li key={k} className="flex items-center justify-between px-5 py-3.5">
              <span className="text-sm text-muted-foreground">{k}</span>
              <span className="text-sm font-medium text-foreground capitalize">{v}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

import { useTranslation } from "react-i18next";
import { OnboardingStep } from "./OnboardingStep";
import type { Profile } from "@/lib/profile";

interface Props {
  profile: Profile;
  update: (p: Partial<Profile>) => void;
  onNext: () => void;
}

export function HeightWeightStep({ profile, update, onNext }: Props) {
  const { t } = useTranslation();
  const isMetric = profile.unit !== "imperial";

  const setUnit = (u: "metric" | "imperial") => update({ unit: u });

  return (
    <OnboardingStep
      title={t("onboarding.measurements.title")}
      subtitle={t("onboarding.measurements.subtitle")}
      canContinue={!!profile.heightCm && !!profile.weightKg}
      onNext={onNext}
    >
      <div className="mb-6 flex rounded-2xl bg-muted p-1">
        <button
          onClick={() => setUnit("metric")}
          className={`flex-1 rounded-xl py-2 text-sm font-medium transition-smooth ${
            isMetric ? "bg-card text-foreground shadow-card" : "text-muted-foreground"
          }`}
        >
          {t("common.metric")}
        </button>
        <button
          onClick={() => setUnit("imperial")}
          className={`flex-1 rounded-xl py-2 text-sm font-medium transition-smooth ${
            !isMetric ? "bg-card text-foreground shadow-card" : "text-muted-foreground"
          }`}
        >
          {t("common.imperial")}
        </button>
      </div>

      <div className="space-y-4">
        <Field
          label={t("onboarding.measurements.title").includes("Height") ? "Height" : "Height / الطول"}
          value={profile.heightCm}
          unit={isMetric ? t("common.cm") : t("common.in")}
          onChange={(v) => update({ heightCm: isMetric ? v : Math.round(v * 2.54 * 10) / 10 })}
          displayValue={isMetric ? profile.heightCm : profile.heightCm ? Math.round(profile.heightCm / 2.54) : undefined}
        />
        <Field
          label={"Weight / الوزن"}
          value={profile.weightKg}
          unit={isMetric ? t("common.kg") : t("common.lb")}
          onChange={(v) => update({ weightKg: isMetric ? v : Math.round(v * 0.453592 * 10) / 10 })}
          displayValue={isMetric ? profile.weightKg : profile.weightKg ? Math.round(profile.weightKg / 0.453592) : undefined}
        />
      </div>
    </OnboardingStep>
  );
}

function Field({
  label,
  unit,
  onChange,
  displayValue,
}: {
  label: string;
  value: number | undefined;
  displayValue: number | undefined;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-2xl border-2 border-border bg-card px-5 py-4">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <div className="flex items-baseline gap-1.5">
        <input
          type="number"
          inputMode="decimal"
          value={displayValue ?? ""}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (!Number.isNaN(n)) onChange(n);
          }}
          placeholder="0"
          className="w-20 bg-transparent text-end text-2xl font-bold text-foreground outline-none placeholder:text-muted-foreground/30"
        />
        <span className="text-sm font-medium text-muted-foreground">{unit}</span>
      </div>
    </label>
  );
}

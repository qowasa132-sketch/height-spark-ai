import { useTranslation } from "react-i18next";
import { OnboardingStep } from "./OnboardingStep";
import type { Profile } from "@/lib/profile";

interface Props {
  profile: Profile;
  update: (p: Partial<Profile>) => void;
  onNext: () => void;
}

export function ParentsStep({ profile, update, onNext }: Props) {
  const { t } = useTranslation();
  return (
    <OnboardingStep
      title={t("onboarding.parents.title")}
      subtitle={t("onboarding.parents.subtitle")}
      canContinue={!!profile.motherHeightCm && !!profile.fatherHeightCm}
      onNext={onNext}
    >
      <div className="space-y-4">
        <Row
          label={t("onboarding.parents.mother")}
          value={profile.motherHeightCm}
          unit={t("common.cm")}
          onChange={(v) => update({ motherHeightCm: v })}
        />
        <Row
          label={t("onboarding.parents.father")}
          value={profile.fatherHeightCm}
          unit={t("common.cm")}
          onChange={(v) => update({ fatherHeightCm: v })}
        />
      </div>
    </OnboardingStep>
  );
}

function Row({
  label,
  value,
  unit,
  onChange,
}: {
  label: string;
  value: number | undefined;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-2xl border-2 border-border bg-card px-5 py-4">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <div className="flex items-baseline gap-1.5">
        <input
          type="number"
          inputMode="numeric"
          value={value ?? ""}
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

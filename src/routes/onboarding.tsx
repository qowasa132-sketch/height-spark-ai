import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { loadProfile, saveProfile, type Profile } from "@/lib/profile";
import { OnboardingStep } from "@/components/onboarding/OnboardingStep";
import { ChoiceList } from "@/components/onboarding/ChoiceList";
import { NumberInput } from "@/components/onboarding/NumberInput";
import { HeightWeightStep } from "@/components/onboarding/HeightWeightStep";
import { ParentsStep } from "@/components/onboarding/ParentsStep";
import { EducationalStep } from "@/components/onboarding/EducationalStep";
import { CostStep } from "@/components/onboarding/CostStep";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
  head: () => ({ meta: [{ title: "Onboarding — HeightBoost" }] }),
});

const TOTAL_STEPS = 16;

function Onboarding() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Profile>({ unit: "metric" });

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  const update = (patch: Partial<Profile>) => {
    const next = { ...profile, ...patch };
    setProfile(next);
    saveProfile(next);
  };

  const next = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
    else {
      saveProfile({ ...profile, completedAt: Date.now() });
      navigate({ to: "/loading" });
    }
  };

  const back = () => {
    if (step > 1) setStep(step - 1);
    else navigate({ to: "/" });
  };

  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <main className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-gradient-glow opacity-30 pointer-events-none" />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col px-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={back}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card/60 text-foreground backdrop-blur-md transition-smooth hover:bg-card rtl:rotate-180"
            aria-label={t("common.back")}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-gradient-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {t("onboarding.progress", { current: step, total: TOTAL_STEPS })}
            </p>
          </div>
        </div>

        {/* Step content */}
        <div key={step} className="flex flex-1 flex-col animate-[fade-in_0.4s_ease-out]">
          <Step step={step} profile={profile} update={update} onNext={next} />
        </div>
      </div>
    </main>
  );
}

function Step({
  step,
  profile,
  update,
  onNext,
}: {
  step: number;
  profile: Profile;
  update: (p: Partial<Profile>) => void;
  onNext: () => void;
}) {
  const { t } = useTranslation();

  switch (step) {
    case 1:
      return (
        <OnboardingStep
          title={t("onboarding.gender.title")}
          subtitle={t("onboarding.gender.subtitle")}
          canContinue={!!profile.gender}
          onNext={onNext}
        >
          <ChoiceList
            value={profile.gender}
            onChange={(v) => update({ gender: v as Profile["gender"] })}
            options={[
              { value: "male", label: t("common.male") },
              { value: "female", label: t("common.female") },
              { value: "other", label: t("common.other") },
            ]}
          />
        </OnboardingStep>
      );
    case 2:
      return (
        <OnboardingStep
          title={t("onboarding.age.title")}
          subtitle={t("onboarding.age.subtitle")}
          canContinue={!!profile.age && profile.age >= 8 && profile.age <= 80}
          onNext={onNext}
        >
          <NumberInput
            value={profile.age}
            onChange={(v) => update({ age: v })}
            unit={t("common.years")}
            min={8}
            max={80}
          />
        </OnboardingStep>
      );
    case 3:
      return (
        <OnboardingStep
          title={t("onboarding.ethnicity.title")}
          subtitle={t("onboarding.ethnicity.subtitle")}
          canContinue={!!profile.ethnicity}
          onNext={onNext}
        >
          <ChoiceList
            value={profile.ethnicity}
            onChange={(v) => update({ ethnicity: v as Profile["ethnicity"] })}
            options={[
              { value: "asian", label: t("onboarding.ethnicity.asian") },
              { value: "black", label: t("onboarding.ethnicity.black") },
              { value: "caucasian", label: t("onboarding.ethnicity.caucasian") },
              { value: "hispanic", label: t("onboarding.ethnicity.hispanic") },
              { value: "middleEastern", label: t("onboarding.ethnicity.middleEastern") },
              { value: "mixed", label: t("onboarding.ethnicity.mixed") },
              { value: "other", label: t("onboarding.ethnicity.other") },
            ]}
          />
        </OnboardingStep>
      );
    case 4:
      return (
        <HeightWeightStep profile={profile} update={update} onNext={onNext} />
      );
    case 5:
      return (
        <ParentsStep profile={profile} update={update} onNext={onNext} />
      );
    case 6:
      return (
        <OnboardingStep
          title={t("onboarding.foot.title")}
          subtitle={t("onboarding.foot.subtitle")}
          canContinue={!!profile.footSizeCm}
          onNext={onNext}
        >
          <NumberInput
            value={profile.footSizeCm}
            onChange={(v) => update({ footSizeCm: v })}
            unit={t("common.cm")}
            min={15}
            max={40}
          />
        </OnboardingStep>
      );
    case 7:
      return (
        <EducationalStep
          title={t("onboarding.education.title")}
          subtitle={t("onboarding.education.subtitle")}
          body={t("onboarding.education.body")}
          onNext={onNext}
          icon="🧬"
        />
      );
    case 8:
      return (
        <OnboardingStep
          title={t("onboarding.workout.title")}
          subtitle={t("onboarding.workout.subtitle")}
          canContinue={!!profile.workout}
          onNext={onNext}
        >
          <ChoiceList
            value={profile.workout}
            onChange={(v) => update({ workout: v as Profile["workout"] })}
            options={[
              { value: "none", label: t("onboarding.workout.none") },
              { value: "light", label: t("onboarding.workout.light") },
              { value: "moderate", label: t("onboarding.workout.moderate") },
              { value: "heavy", label: t("onboarding.workout.heavy") },
            ]}
          />
        </OnboardingStep>
      );
    case 9:
      return (
        <OnboardingStep
          title={t("onboarding.facialHair.title")}
          subtitle={t("onboarding.facialHair.subtitle")}
          canContinue={!!profile.facialHair}
          onNext={onNext}
        >
          <ChoiceList
            value={profile.facialHair}
            onChange={(v) => update({ facialHair: v as Profile["facialHair"] })}
            options={[
              { value: "none", label: t("onboarding.facialHair.none") },
              { value: "light", label: t("onboarding.facialHair.light") },
              { value: "patchy", label: t("onboarding.facialHair.patchy") },
              { value: "moderate", label: t("onboarding.facialHair.moderate") },
              { value: "full", label: t("onboarding.facialHair.full") },
            ]}
          />
        </OnboardingStep>
      );
    case 10:
      return (
        <OnboardingStep
          title={t("onboarding.acne.title")}
          subtitle={t("onboarding.acne.subtitle")}
          canContinue={!!profile.acne}
          onNext={onNext}
        >
          <ChoiceList
            value={profile.acne}
            onChange={(v) => update({ acne: v as Profile["acne"] })}
            options={[
              { value: "none", label: t("onboarding.acne.none") },
              { value: "occasional", label: t("onboarding.acne.occasional") },
              { value: "frequent", label: t("onboarding.acne.frequent") },
            ]}
          />
        </OnboardingStep>
      );
    case 11:
      return (
        <OnboardingStep
          title={t("onboarding.underarm.title")}
          subtitle={t("onboarding.underarm.subtitle")}
          canContinue={profile.underarmHair !== undefined}
          onNext={onNext}
        >
          <ChoiceList
            value={profile.underarmHair === undefined ? undefined : profile.underarmHair ? "yes" : "no"}
            onChange={(v) => update({ underarmHair: v === "yes" })}
            options={[
              { value: "yes", label: t("common.yes") },
              { value: "no", label: t("common.no") },
            ]}
          />
        </OnboardingStep>
      );
    case 12:
      return (
        <OnboardingStep
          title={t("onboarding.sleep.title")}
          subtitle={t("onboarding.sleep.subtitle")}
          canContinue={!!profile.sleepHours}
          onNext={onNext}
        >
          <NumberInput
            value={profile.sleepHours}
            onChange={(v) => update({ sleepHours: v })}
            unit={t("common.hours")}
            min={3}
            max={14}
          />
        </OnboardingStep>
      );
    case 13:
      return (
        <OnboardingStep
          title={t("onboarding.dream.title")}
          subtitle={t("onboarding.dream.subtitle")}
          canContinue={!!profile.dreamHeightCm}
          onNext={onNext}
        >
          <NumberInput
            value={profile.dreamHeightCm}
            onChange={(v) => update({ dreamHeightCm: v })}
            unit={t("common.cm")}
            min={140}
            max={230}
          />
        </OnboardingStep>
      );
    case 14:
      return (
        <EducationalStep
          title={t("onboarding.accuracy.title")}
          subtitle={t("onboarding.accuracy.subtitle")}
          body={t("onboarding.accuracy.body")}
          onNext={onNext}
          icon="🎯"
        />
      );
    case 15:
      return <CostStep onNext={onNext} />;
    case 16:
      return (
        <EducationalStep
          title={t("onboarding.final.title")}
          subtitle={t("onboarding.final.subtitle")}
          body={t("onboarding.final.body")}
          onNext={onNext}
          ctaLabel={t("onboarding.final.cta")}
          icon="🚀"
        />
      );
    default:
      return null;
  }
}

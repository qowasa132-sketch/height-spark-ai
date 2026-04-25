import { useTranslation } from "react-i18next";
import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  canContinue: boolean;
  onNext: () => void;
  ctaLabel?: string;
}

export function OnboardingStep({ title, subtitle, children, canContinue, onNext, ctaLabel }: Props) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-1 flex-col pt-8 pb-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground leading-tight">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex-1">{children}</div>
      <button
        onClick={onNext}
        disabled={!canContinue}
        className="mt-8 w-full rounded-2xl bg-gradient-primary py-4 text-base font-semibold text-primary-foreground shadow-glow transition-smooth active:scale-[0.98] disabled:opacity-30 disabled:shadow-none"
      >
        {ctaLabel || t("common.next")}
      </button>
    </div>
  );
}

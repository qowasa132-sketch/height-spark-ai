import { useTranslation } from "react-i18next";
import { Check, Crown, Sparkles } from "lucide-react";

interface Props {
  onNext: () => void;
}

export function PlansPreviewStep({ onNext }: Props) {
  const { t } = useTranslation();

  const freeFeatures = t("onboarding.plansPreview.freeFeatures", {
    returnObjects: true,
  }) as string[];
  const proFeatures = t("onboarding.plansPreview.proFeatures", {
    returnObjects: true,
  }) as string[];

  return (
    <div className="flex flex-1 flex-col py-4">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary text-3xl shadow-glow">
          ✨
        </div>
        <h2 className="text-2xl font-bold text-foreground glow-text leading-tight">
          {t("onboarding.plansPreview.title")}
        </h2>
        <p className="mt-2 text-sm font-medium text-primary">
          {t("onboarding.plansPreview.subtitle")}
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {/* Free plan */}
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-bold text-foreground">
              {t("onboarding.plansPreview.freeTitle")}
            </h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("onboarding.plansPreview.freeSubtitle")}
          </p>
          <ul className="mt-3 space-y-2">
            {freeFeatures.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-foreground/90">
                <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pro plan */}
        <div className="relative rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 to-card/60 p-4 backdrop-blur-md shadow-glow">
          <div className="absolute -top-2 right-4 rounded-full bg-gradient-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground">
            {t("onboarding.plansPreview.recommended")}
          </div>
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">
              {t("onboarding.plansPreview.proTitle")}
            </h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("onboarding.plansPreview.proSubtitle")}
          </p>
          <ul className="mt-3 space-y-2">
            {proFeatures.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-foreground/90">
                <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={onNext}
        className="mt-6 w-full rounded-2xl bg-gradient-primary py-4 text-base font-semibold text-primary-foreground shadow-glow transition-smooth active:scale-[0.98]"
      >
        {t("common.continue")}
      </button>
    </div>
  );
}

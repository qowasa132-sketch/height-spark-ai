import { useTranslation } from "react-i18next";

interface Props {
  title: string;
  subtitle: string;
  body: string;
  icon?: string;
  onNext: () => void;
  ctaLabel?: string;
}

export function EducationalStep({ title, subtitle, body, icon, onNext, ctaLabel }: Props) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-1 flex-col py-6">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        {icon && (
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-primary text-5xl shadow-glow">
            {icon}
          </div>
        )}
        <h2 className="text-3xl font-bold text-foreground glow-text leading-tight">{title}</h2>
        <p className="mt-3 text-base font-medium text-primary">{subtitle}</p>
        <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">{body}</p>
      </div>
      <button
        onClick={onNext}
        className="mt-8 w-full rounded-2xl bg-gradient-primary py-4 text-base font-semibold text-primary-foreground shadow-glow transition-smooth active:scale-[0.98]"
      >
        {ctaLabel || t("common.continue")}
      </button>
    </div>
  );
}

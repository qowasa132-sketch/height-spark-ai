import { useTranslation } from "react-i18next";

export function CostStep({ onNext }: { onNext: () => void }) {
  const { t } = useTranslation();
  const items = t("onboarding.cost.items", { returnObjects: true }) as string[];
  return (
    <div className="flex flex-1 flex-col py-6">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15 text-3xl">
          ⚠️
        </div>
        <h2 className="text-2xl font-bold text-foreground leading-tight">{t("onboarding.cost.title")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("onboarding.cost.subtitle")}</p>
      </div>
      <ul className="flex-1 space-y-3">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-3 rounded-2xl border border-border bg-card p-4 animate-[fade-in_0.4s_ease-out]"
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: "backwards" }}
          >
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
              {i + 1}
            </span>
            <span className="text-sm leading-relaxed text-foreground">{item}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onNext}
        className="mt-6 w-full rounded-2xl bg-gradient-primary py-4 text-base font-semibold text-primary-foreground shadow-glow transition-smooth active:scale-[0.98]"
      >
        {t("common.continue")}
      </button>
    </div>
  );
}

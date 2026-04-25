import type { ReactNode } from "react";

export function SectionCard({
  icon,
  title,
  hint,
  right,
  children,
}: {
  icon: ReactNode;
  title: string;
  hint?: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mt-5 rounded-3xl border border-border bg-card/80 p-5 backdrop-blur-md shadow-card">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-base font-bold text-foreground">{title}</h2>
            {right}
          </div>
          {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
      <div
        className="h-full bg-gradient-primary transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function Stat({ label, value, suffix }: { label: string; value: string | number; suffix?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background/40 px-3 py-2 text-center">
      <div className="text-base font-bold text-foreground">
        {value}
        {suffix && <span className="ms-0.5 text-[10px] font-normal text-muted-foreground">{suffix}</span>}
      </div>
      <div className="mt-0.5 text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}

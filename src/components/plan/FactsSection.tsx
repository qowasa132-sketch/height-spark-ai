import { useMemo, useState } from "react";
import { Lightbulb, Sparkles, ChevronRight, X } from "lucide-react";
import { SectionCard } from "./SectionCard";
import { RewardGate } from "@/components/RewardGate";
import {
  HEIGHT_FACTS,
  FACT_CATEGORIES,
  getDailyFact,
  type FactCategory,
  type HeightFact,
} from "@/lib/heightFacts";

export function FactsSection() {
  const [open, setOpen] = useState(false);
  const [activeCat, setActiveCat] = useState<FactCategory>("hormones");
  const [selected, setSelected] = useState<HeightFact | null>(null);

  const daily = useMemo(() => getDailyFact(), []);
  const list = useMemo(
    () => HEIGHT_FACTS.filter((f) => f.category === activeCat),
    [activeCat]
  );

  return (
    <>
      <SectionCard
        icon={<Lightbulb className="h-5 w-5" />}
        title="حقائق عن الطول"
        hint="معلومات علمية مدهشة قد لا تعرفها"
        right={
          <RewardGate actionName="explore all height facts" onReward={() => setOpen(true)}>
            <button
              type="button"
              className="rounded-full border border-border bg-background/40 px-2.5 py-1 text-[11px] font-semibold text-foreground"
            >
              استكشف الكل
            </button>
          </RewardGate>
        }
      >
        <RewardGate
          actionName="reveal today's height fact"
          onReward={() => {
            setSelected(daily);
            setOpen(true);
          }}
        >
          <button
            type="button"
            className="group flex w-full items-start gap-3 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-4 text-right"
          >
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-primary">
                حقيقة اليوم
              </div>
              <div className="mt-0.5 text-sm font-bold text-foreground">{daily.title}</div>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {daily.body}
              </p>
            </div>
            <ChevronRight className="mt-1 h-4 w-4 flex-shrink-0 rotate-180 text-muted-foreground transition group-hover:text-foreground" />
          </button>
        </RewardGate>
      </SectionCard>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => {
            setOpen(false);
            setSelected(null);
          }}
        >
          <div
            className="relative max-h-[88vh] w-full max-w-md overflow-hidden rounded-t-3xl border-t border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {selected ? selected.title : "حقائق عن الطول"}
                </h3>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {selected ? "معلومة علمية" : `${HEIGHT_FACTS.length} حقيقة موثقة`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (selected) setSelected(null);
                  else setOpen(false);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/60 text-foreground"
                aria-label="إغلاق"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {selected ? (
              <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
                <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    {FACT_CATEGORIES.find((c) => c.id === selected.category)?.emoji}{" "}
                    {FACT_CATEGORIES.find((c) => c.id === selected.category)?.label}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-foreground">{selected.body}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="mt-4 w-full rounded-2xl border border-border bg-background/40 py-3 text-sm font-semibold text-foreground"
                >
                  تصفح المزيد من الحقائق
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-2 overflow-x-auto px-5 py-3">
                  {FACT_CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActiveCat(c.id)}
                      className={`flex-shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        activeCat === c.id
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border bg-background/40 text-muted-foreground"
                      }`}
                    >
                      <span className="me-1">{c.emoji}</span>
                      {c.label}
                    </button>
                  ))}
                </div>
                <div className="max-h-[60vh] overflow-y-auto px-5 pb-6">
                  <div className="space-y-2">
                    {list.map((f) => (
                      <RewardGate key={f.id} actionName={`reveal "${f.title}"`} onReward={() => setSelected(f)}>
                        <button
                          type="button"
                          className="flex w-full items-start gap-3 rounded-2xl border border-border bg-background/40 p-3 text-right transition hover:border-primary/40"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold text-foreground">{f.title}</div>
                            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                              {f.body}
                            </p>
                          </div>
                          <ChevronRight className="mt-1 h-4 w-4 flex-shrink-0 rotate-180 text-muted-foreground" />
                        </button>
                      </RewardGate>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

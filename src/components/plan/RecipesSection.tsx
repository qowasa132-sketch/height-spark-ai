import { useState } from "react";
import { ChefHat, Clock, Users, X, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { SectionCard } from "./SectionCard";
import { RewardGate } from "@/components/RewardGate";
import { RECIPES, type Recipe } from "@/lib/recipes";
import type { DailyLog, FoodEntry } from "@/lib/dailyLog";

interface Props {
  log: DailyLog;
  update: (patch: Partial<DailyLog>) => void;
}

export function RecipesSection({ log, update }: Props) {
  const [picked, setPicked] = useState<Recipe | null>(null);

  const addToLog = (r: Recipe) => {
    const entry: FoodEntry = {
      id: `recipe-${r.id}-${Date.now()}`,
      name: r.name,
      grams: 100, // recipe portion treated as one serving
      calories: r.nutrition.calories,
      proteinG: r.nutrition.proteinG,
      calciumMg: r.nutrition.calciumMg,
      vitaminDIu: r.nutrition.vitaminDIu,
    };
    update({ foods: [...log.foods, entry] });
    toast.success(`أُضيفت ${r.name} لمذكرة اليوم`);
    setPicked(null);
  };

  return (
    <>
      <SectionCard
        icon={<ChefHat className="h-5 w-5" />}
        title="وصفات لنمو العظام والطول"
        hint="وجبات بسيطة غنية بالكالسيوم والبروتين وفيتامين د"
      >
        <div className="grid grid-cols-2 gap-2">
          {RECIPES.map((r) => (
            <RewardGate key={r.id} actionName={`view "${r.name}" recipe`} onReward={() => setPicked(r)}>
              <button
                type="button"
                className="group relative flex flex-col items-start overflow-hidden rounded-2xl border border-border bg-background/50 p-3 text-start transition-smooth hover:border-primary/50 hover:bg-primary/5"
              >
                <div className="text-3xl">{r.emoji}</div>
                <div className="mt-1.5 line-clamp-2 text-xs font-bold text-foreground">{r.name}</div>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-0.5">
                    <Clock className="h-2.5 w-2.5" /> {r.time}
                  </span>
                  <span>·</span>
                  <span>{Math.round(r.nutrition.calciumMg)} مغ كالسيوم</span>
                </div>
              </button>
            </RewardGate>
          ))}
        </div>
      </SectionCard>

      {picked && <RecipeModal recipe={picked} onClose={() => setPicked(null)} onAdd={addToLog} />}
    </>
  );
}

function RecipeModal({
  recipe,
  onClose,
  onAdd,
}: {
  recipe: Recipe;
  onClose: () => void;
  onAdd: (r: Recipe) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-border bg-card p-5 shadow-glow sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="text-4xl">{recipe.emoji}</div>
            <h3 className="mt-2 text-lg font-bold text-foreground">{recipe.name}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {recipe.time}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" /> {recipe.servings} حصة
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-foreground"
            aria-label="إغلاق"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Benefits */}
        <div className="mb-4 rounded-2xl bg-primary/10 p-3">
          <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold text-primary">
            <Sparkles className="h-3 w-3" /> فوائد للنمو
          </div>
          <ul className="space-y-1 text-[11px] text-foreground">
            {recipe.benefits.map((b) => (
              <li key={b} className="flex items-start gap-1.5">
                <span className="text-primary">•</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Nutrition */}
        <div className="mb-4 grid grid-cols-4 gap-1.5">
          <NutriPill label="سعرات" value={recipe.nutrition.calories} />
          <NutriPill label="بروتين" value={recipe.nutrition.proteinG} suffix="غ" />
          <NutriPill label="كالسيوم" value={recipe.nutrition.calciumMg} suffix="مغ" />
          <NutriPill label="فيتامين د" value={recipe.nutrition.vitaminDIu} suffix="و.د" />
        </div>

        {/* Ingredients */}
        <h4 className="mb-2 text-sm font-bold text-foreground">المكونات</h4>
        <ul className="mb-4 space-y-1 text-xs text-foreground">
          {recipe.ingredients.map((i) => (
            <li key={i} className="flex items-start gap-2 rounded-lg bg-background/40 px-2 py-1.5">
              <span className="text-primary">◆</span>
              <span>{i}</span>
            </li>
          ))}
        </ul>

        {/* Steps */}
        <h4 className="mb-2 text-sm font-bold text-foreground">طريقة التحضير</h4>
        <ol className="mb-5 space-y-2 text-xs text-foreground">
          {recipe.steps.map((s, idx) => (
            <li key={s} className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                {idx + 1}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={() => onAdd(recipe)}
          className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-gradient-primary py-3 text-sm font-bold text-primary-foreground shadow-glow"
        >
          <Plus className="h-4 w-4" /> أضف لمذكرة اليوم
        </button>
      </div>
    </div>
  );
}

function NutriPill({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/50 px-1.5 py-2 text-center">
      <div className="text-sm font-bold text-foreground">
        {Math.round(value)}
        {suffix && <span className="text-[9px] text-muted-foreground">{suffix}</span>}
      </div>
      <div className="mt-0.5 text-[9px] text-muted-foreground">{label}</div>
    </div>
  );
}

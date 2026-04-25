// AI meal plan + supplement generator
import { useState } from "react";
import { Loader2, Sparkles, Pill, ChefHat } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { loadProfile } from "@/lib/profile";

interface Meal { name: string; title: string; calories: number; protein: number; ingredients: string[]; steps: string[]; whyForGrowth: string }
interface MealPlan { totalCalories: number; totalProtein: number; meals: Meal[] }
interface Supplement { name: string; dose: string; timing: string; reason: string; priority: string }
interface SuppPlan { supplements: Supplement[]; disclaimer: string }

export function NutritionAI() {
  const [tab, setTab] = useState<"meals" | "supps">("meals");
  const [prefs, setPrefs] = useState("");
  const [allergies, setAllergies] = useState("");
  const [loading, setLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [suppPlan, setSuppPlan] = useState<SuppPlan | null>(null);
  const [openMeal, setOpenMeal] = useState<number | null>(null);

  const generate = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("nutrition-plan", {
        body: { profile: loadProfile(), preferences: prefs, allergies, mode: tab === "supps" ? "supplements" : "meals" },
      });
      if (error) throw error;
      if ((data as { error?: string })?.error) { toast.error((data as { error: string }).error); return; }
      if (tab === "meals") setMealPlan(data as MealPlan);
      else setSuppPlan(data as SuppPlan);
    } catch (e) {
      console.error(e);
      toast.error("تعذّر التوليد. حاول مجدداً.");
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2 rounded-xl bg-card/60 p-1">
        <button
          onClick={() => setTab("meals")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-smooth ${tab === "meals" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          <ChefHat className="h-3.5 w-3.5" /> وجبات اليوم
        </button>
        <button
          onClick={() => setTab("supps")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-smooth ${tab === "supps" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        >
          <Pill className="h-3.5 w-3.5" /> مكملات مخصصة
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <input
          value={prefs}
          onChange={(e) => setPrefs(e.target.value)}
          placeholder="تفضيلاتك (مثلاً: نباتي، أحب السمك)"
          dir="rtl"
          className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <input
          value={allergies}
          onChange={(e) => setAllergies(e.target.value)}
          placeholder="الحساسية أو ما تتجنبه (مثلاً: لاكتوز، مكسرات)"
          dir="rtl"
          className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </div>

      <button
        onClick={generate}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        {loading ? "جاري التوليد..." : tab === "meals" ? "ولّد خطة وجبات" : "ولّد توصيات المكملات"}
      </button>

      {tab === "meals" && mealPlan && (
        <div className="space-y-2 rounded-2xl border border-primary/30 bg-card/80 p-3 backdrop-blur-md">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">السعرات: <strong className="text-foreground">{mealPlan.totalCalories}</strong></span>
            <span className="text-muted-foreground">البروتين: <strong className="text-foreground">{mealPlan.totalProtein}g</strong></span>
          </div>
          {mealPlan.meals.map((m, i) => (
            <div key={i} className="rounded-xl border border-border bg-background/50">
              <button
                onClick={() => setOpenMeal(openMeal === i ? null : i)}
                className="flex w-full items-center justify-between p-3 text-start"
              >
                <div>
                  <p className="text-[11px] text-muted-foreground">{m.name}</p>
                  <p className="text-sm font-semibold">{m.title}</p>
                </div>
                <div className="text-end">
                  <p className="text-xs font-bold text-primary">{m.calories} kcal</p>
                  <p className="text-[10px] text-muted-foreground">{m.protein}g بروتين</p>
                </div>
              </button>
              {openMeal === i && (
                <div className="space-y-2 border-t border-border p-3">
                  <div>
                    <p className="text-[11px] font-bold text-muted-foreground">المكونات</p>
                    <ul className="mt-1 list-disc space-y-0.5 ps-5 text-xs">
                      {m.ingredients.map((ing, j) => <li key={j}>{ing}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-muted-foreground">طريقة التحضير</p>
                    <ol className="mt-1 list-decimal space-y-0.5 ps-5 text-xs">
                      {m.steps.map((s, j) => <li key={j}>{s}</li>)}
                    </ol>
                  </div>
                  <p className="rounded-lg bg-primary/10 p-2 text-[11px] text-foreground">💡 {m.whyForGrowth}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "supps" && suppPlan && (
        <div className="space-y-2 rounded-2xl border border-primary/30 bg-card/80 p-3 backdrop-blur-md">
          {suppPlan.supplements.map((s, i) => (
            <div key={i} className="rounded-xl border border-border bg-background/50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{s.name}</span>
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] text-primary">{s.priority}</span>
              </div>
              <p className="mt-1 text-xs"><strong className="text-muted-foreground">الجرعة:</strong> {s.dose}</p>
              <p className="text-xs"><strong className="text-muted-foreground">التوقيت:</strong> {s.timing}</p>
              <p className="mt-1.5 text-[11px] text-muted-foreground">{s.reason}</p>
            </div>
          ))}
          <p className="rounded-lg bg-muted p-2 text-[10px] text-muted-foreground">⚠️ {suppPlan.disclaimer}</p>
        </div>
      )}
    </div>
  );
}

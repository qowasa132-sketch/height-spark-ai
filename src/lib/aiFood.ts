import { supabase } from "@/integrations/supabase/client";

export interface AIFood {
  name: string;
  nameEn: string;
  caloriesPer100g: number;
  proteinG: number;
  calciumMg: number;
  vitaminDIu: number;
}

export async function lookupFoodAI(query: string): Promise<AIFood> {
  const { data, error } = await supabase.functions.invoke("food-lookup", {
    body: { query },
  });
  if (error) {
    // supabase-js wraps non-2xx into FunctionsHttpError; try to surface message
    const status = (error as { context?: { status?: number } }).context?.status;
    if (status === 429) throw new Error("تم تجاوز الحد، حاول بعد قليل.");
    if (status === 402) throw new Error("نفذ رصيد الذكاء الاصطناعي.");
    throw new Error("تعذّر البحث، حاول مجدداً.");
  }
  if (!data || typeof data !== "object" || !("name" in data)) {
    throw new Error("لا نتيجة لهذا الطعام.");
  }
  return data as AIFood;
}

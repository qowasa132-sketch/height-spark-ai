// AI meal plan + supplement recommendation generator
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { profile, preferences, allergies, mode } = await req.json();
    const KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!KEY) throw new Error("LOVABLE_API_KEY missing");

    const isSupp = mode === "supplements";

    const tools = isSupp
      ? [{
          type: "function",
          function: {
            name: "report_supplements",
            description: "اقتراح مكملات مخصصة لنمو العظام والطول",
            parameters: {
              type: "object",
              properties: {
                supplements: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      dose: { type: "string" },
                      timing: { type: "string" },
                      reason: { type: "string" },
                      priority: { type: "string", enum: ["أساسي", "موصى به", "اختياري"] },
                    },
                    required: ["name", "dose", "timing", "reason", "priority"],
                  },
                },
                disclaimer: { type: "string" },
              },
              required: ["supplements", "disclaimer"],
              additionalProperties: false,
            },
          },
        }]
      : [{
          type: "function",
          function: {
            name: "report_meal_plan",
            description: "خطة وجبات يوم واحد لدعم نمو الطول",
            parameters: {
              type: "object",
              properties: {
                totalCalories: { type: "integer" },
                totalProtein: { type: "integer" },
                meals: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string", description: "إفطار / وجبة خفيفة / غداء / عشاء" },
                      title: { type: "string", description: "اسم الوصفة" },
                      calories: { type: "integer" },
                      protein: { type: "integer" },
                      ingredients: { type: "array", items: { type: "string" } },
                      steps: { type: "array", items: { type: "string" } },
                      whyForGrowth: { type: "string" },
                    },
                    required: ["name", "title", "calories", "protein", "ingredients", "steps", "whyForGrowth"],
                  },
                },
              },
              required: ["totalCalories", "totalProtein", "meals"],
              additionalProperties: false,
            },
          },
        }];

    const userPrompt = isSupp
      ? `اقترح مكملات لشخص: عمر ${profile?.age ?? "؟"}، جنس ${profile?.gender ?? "؟"}، طول ${profile?.heightCm ?? "؟"} سم، نشاط ${profile?.workout ?? "؟"}، نوم ${profile?.sleepHours ?? "؟"} س. تفضيلات: ${preferences || "لا يوجد"}. حساسيات: ${allergies || "لا يوجد"}. ركّز على فيتامين D، الكالسيوم، الزنك، المغنيسيوم، البروتين.`
      : `صمّم خطة وجبات يوم كامل لشخص: عمر ${profile?.age ?? "؟"}، جنس ${profile?.gender ?? "؟"}، طول ${profile?.heightCm ?? "؟"} سم، وزن ${profile?.weightKg ?? "؟"} كجم، نشاط ${profile?.workout ?? "؟"}. تفضيلات: ${preferences || "لا يوجد"}. حساسيات/استثناءات: ${allergies || "لا يوجد"}. ٤ وجبات (إفطار، خفيفة، غداء، عشاء)، أطعمة عربية مألوفة، عالية البروتين والكالسيوم وفيتامين D.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "أنت خبير تغذية متخصص في نمو المراهقين والشباب. أجب بالعربية." },
          { role: "user", content: userPrompt },
        ],
        tools,
        tool_choice: { type: "function", function: { name: tools[0].function.name } },
      }),
    });

    if (!resp.ok) {
      if (resp.status === 429) return new Response(JSON.stringify({ error: "تم تجاوز الحد." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (resp.status === 402) return new Response(JSON.stringify({ error: "نفدت الأرصدة." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const t = await resp.text();
      console.error("nutrition err", resp.status, t);
      return new Response(JSON.stringify({ error: "تعذّر التوليد" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await resp.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!args) return new Response(JSON.stringify({ error: "لا توجد نتيجة" }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    return new Response(args, { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("nutrition-plan error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

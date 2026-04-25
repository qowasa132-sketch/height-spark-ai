// Food lookup via Lovable AI — returns nutrition for any food name.
// deno-lint-ignore-file no-explicit-any

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string") {
      return new Response(JSON.stringify({ error: "query required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content:
                "أنت خبير تغذية. أعد قيم التغذية لأي طعام لكل ١٠٠ غرام. استخدم متوسطات USDA/المصادر الموثوقة. الاسم بالعربية الفصحى.",
            },
            {
              role: "user",
              content: `أعطني القيم الغذائية لـ "${query}" لكل ١٠٠ غرام.`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "return_nutrition",
                description: "Return nutrition facts per 100g of a food",
                parameters: {
                  type: "object",
                  properties: {
                    name: { type: "string", description: "اسم الطعام بالعربية" },
                    nameEn: { type: "string", description: "English name" },
                    caloriesPer100g: { type: "number" },
                    proteinG: { type: "number" },
                    calciumMg: { type: "number" },
                    vitaminDIu: { type: "number" },
                  },
                  required: [
                    "name",
                    "nameEn",
                    "caloriesPer100g",
                    "proteinG",
                    "calciumMg",
                    "vitaminDIu",
                  ],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "return_nutrition" },
          },
        }),
      },
    );

    if (!response.ok) {
      const txt = await response.text();
      console.error("AI gateway error", response.status, txt);
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "تم تجاوز الحد، حاول بعد قليل." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "نفذ رصيد الذكاء الاصطناعي." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      return new Response(JSON.stringify({ error: "AI error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const call = data?.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) {
      return new Response(JSON.stringify({ error: "لا نتيجة" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const args = JSON.parse(call.function.arguments);
    return new Response(JSON.stringify(args), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("food-lookup error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "خطأ" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

// X-Ray bone-age estimation from a hand/wrist radiograph using Lovable AI vision
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageDataUrl, chronologicalAge, gender } = await req.json();
    if (!imageDataUrl || typeof imageDataUrl !== "string") {
      return new Response(JSON.stringify({ error: "imageDataUrl مطلوب" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!KEY) throw new Error("LOVABLE_API_KEY missing");

    const tools = [
      {
        type: "function",
        function: {
          name: "report_bone_age",
          description: "تقرير تقديري لعمر العظام وحالة صفائح النمو",
          parameters: {
            type: "object",
            properties: {
              isXray: { type: "boolean", description: "هل الصورة فعلاً أشعة سينية لرسغ ويد؟" },
              estimatedBoneAgeYears: {
                type: "number",
                description: "عمر العظام المقدّر بالسنوات (مثال 14.5).",
              },
              ageRangeLow: { type: "number" },
              ageRangeHigh: { type: "number" },
              growthPlatesStatus: {
                type: "string",
                enum: ["مفتوحة", "شبه مغلقة", "مغلقة", "غير واضحة"],
                description: "حالة صفائح النمو الكلية في الصورة.",
              },
              remainingGrowthPotentialCm: {
                type: "number",
                description: "تقدير تقريبي للسنتيمترات المتبقية للنمو (0 إذا انغلقت الصفائح).",
              },
              confidence: { type: "string", enum: ["منخفضة", "متوسطة", "عالية"] },
              summary: { type: "string", description: "ملخص بالعربية شامل ومفهوم لغير المختص." },
              indicators: {
                type: "array",
                description: "علامات لوحظت (مثل اندماج المشاش، اتساع الصفيحة...).",
                items: { type: "string" },
              },
              recommendations: {
                type: "array",
                description: "نصائح عملية بناءً على الحالة.",
                items: { type: "string" },
              },
              disclaimer: { type: "string" },
            },
            required: [
              "isXray",
              "estimatedBoneAgeYears",
              "ageRangeLow",
              "ageRangeHigh",
              "growthPlatesStatus",
              "remainingGrowthPotentialCm",
              "confidence",
              "summary",
              "indicators",
              "recommendations",
              "disclaimer",
            ],
            additionalProperties: false,
          },
        },
      },
    ];

    const sysPrompt = `أنت مساعد طبي تعليمي متخصص بقراءة أشعة رسغ اليد لتقدير عمر العظام (Bone Age) وفقاً لمنهج Greulich-Pyle بشكل تقريبي.
- لست بديلاً عن طبيب أشعة، لكن قدّم تقديراً تعليمياً مبنياً على ما تراه.
- إذا لم تكن الصورة أشعة لرسغ/يد، اضبط isXray=false وأعطِ ملخصاً يطلب صورة صحيحة.
- صفائح النمو المفتوحة تعني إمكانية نمو متبقية. المغلقة تعني توقف النمو الطولي عملياً.
- قدّر السنتيمترات المتبقية بشكل واقعي: مفتوحة بوضوح ٥-١٥سم، شبه مغلقة ١-٤سم، مغلقة ٠.
- أضف disclaimer واضح أن النتيجة تقديرية وليست تشخيصاً طبياً.`;

    const userText = `العمر الزمني للمستخدم: ${
      chronologicalAge ?? "غير محدد"
    } سنة. الجنس: ${gender ?? "غير محدد"}. حلّل الصورة وأعد التقرير عبر الأداة.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: sysPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: userText },
              { type: "image_url", image_url: { url: imageDataUrl } },
            ],
          },
        ],
        tools,
        tool_choice: { type: "function", function: { name: "report_bone_age" } },
      }),
    });

    if (!resp.ok) {
      if (resp.status === 429)
        return new Response(JSON.stringify({ error: "تم تجاوز حدود الطلبات. حاول لاحقاً." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      if (resp.status === 402)
        return new Response(JSON.stringify({ error: "نفدت الأرصدة." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      const t = await resp.text();
      console.error("xray err", resp.status, t);
      return new Response(JSON.stringify({ error: "تعذّر التحليل" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!args) {
      return new Response(JSON.stringify({ error: "لا توجد نتيجة" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(args, { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("xray-bone-age error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

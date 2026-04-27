// Posture analysis from a side-view photo using Gemini Vision
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageDataUrl } = await req.json();
    if (!imageDataUrl || typeof imageDataUrl !== "string") {
      return new Response(JSON.stringify({ error: "imageDataUrl مطلوب" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    // Cap image data URL at ~7MB (covers ~5MB raw image base64-encoded)
    if (imageDataUrl.length > 7_000_000) {
      return new Response(JSON.stringify({ error: "الصورة كبيرة جداً (الحد ٥ ميغا)." }), {
        status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!imageDataUrl.startsWith("data:image/")) {
      return new Response(JSON.stringify({ error: "صيغة صورة غير صالحة" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!KEY) throw new Error("LOVABLE_API_KEY missing");

    const tools = [{
      type: "function",
      function: {
        name: "report_posture",
        description: "تقرير تحليل الوضعية من صورة جانبية",
        parameters: {
          type: "object",
          properties: {
            score: { type: "integer", description: "تقييم من 0 إلى 100" },
            summary: { type: "string", description: "ملخص قصير بالعربية" },
            issues: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string", description: "اسم المشكلة بالعربية" },
                  severity: { type: "string", enum: ["خفيفة", "متوسطة", "شديدة"] },
                  explanation: { type: "string" },
                },
                required: ["name", "severity", "explanation"],
              },
            },
            exercises: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  duration: { type: "string", description: "المدة أو التكرار" },
                  steps: { type: "array", items: { type: "string" } },
                },
                required: ["name", "duration", "steps"],
              },
            },
          },
          required: ["score", "summary", "issues", "exercises"],
          additionalProperties: false,
        },
      },
    }];

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content:
              "أنت أخصائي علاج طبيعي. حلّل الوضعية من صورة جانبية واحدة واذكر اختلال محاذاة الرأس، انحناء الكتف، تقوس الظهر العلوي (Kyphosis)، تقوس أسفل الظهر (Lordosis)، ميلان الحوض. اقترح 3-5 تمارين تصحيحية. كن واقعياً وحذّر إذا كانت الصورة غير مناسبة.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: "حلّل هذه الصورة الجانبية للوضعية وأعد التقرير عبر الأداة." },
              { type: "image_url", image_url: { url: imageDataUrl } },
            ],
          },
        ],
        tools,
        tool_choice: { type: "function", function: { name: "report_posture" } },
      }),
    });

    if (!resp.ok) {
      if (resp.status === 429)
        return new Response(JSON.stringify({ error: "تم تجاوز الحد. حاول لاحقاً." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (resp.status === 402)
        return new Response(JSON.stringify({ error: "نفدت الأرصدة." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const t = await resp.text();
      console.error("vision err", resp.status, t);
      return new Response(JSON.stringify({ error: "تعذّر التحليل" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await resp.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!args) {
      return new Response(JSON.stringify({ error: "لا توجد نتيجة" }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const parsed = JSON.parse(args);
    return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("posture-analyze error", e);
    return new Response(JSON.stringify({ error: "خطأ في الخادم" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

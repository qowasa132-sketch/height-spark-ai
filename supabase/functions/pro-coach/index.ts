// AI growth coach — streaming chat via Lovable AI Gateway
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM = `أنت "كوتش الطول" — مدرب شخصي عربي ودود ومحترف داخل تطبيق هايت بوست.
دورك: تجاوب على أسئلة المستخدم عن زيادة الطول، صحة العمود الفقري، التغذية، النوم، التمارين، والمكملات.

قواعد:
- جاوب دائماً بالعربية الفصحى البسيطة.
- كن موجزاً (2-5 جمل عادة) إلا إذا طلب التفاصيل.
- استخدم بيانات المستخدم (إن وُجدت في رسالة النظام) لتخصيص النصيحة.
- لا تعِد بزيادة طول مستحيلة بعد إغلاق صفائح النمو (~18 للذكور، ~16 للإناث). اشرح بصدق أن التحسين يأتي من الوضعية، فك ضغط الفقرات، والصحة العامة.
- لا تصف أدوية بوصفة. لو سُئل عن هرمون النمو أو أدوية، انصح بمراجعة طبيب.
- شجّع وكن إيجابياً.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, profile } = await req.json();
    const KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!KEY) throw new Error("LOVABLE_API_KEY missing");

    const profileLine = profile
      ? `بيانات المستخدم: العمر ${profile.age ?? "؟"}، الجنس ${profile.gender ?? "؟"}، الطول الحالي ${profile.heightCm ?? "؟"} سم، الطول المستهدف ${profile.dreamHeightCm ?? "؟"} سم.`
      : "";

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        stream: true,
        messages: [
          { role: "system", content: SYSTEM + (profileLine ? "\n\n" + profileLine : "") },
          ...messages,
        ],
      }),
    });

    if (!resp.ok) {
      if (resp.status === 429)
        return new Response(JSON.stringify({ error: "تم تجاوز حد الطلبات. حاول بعد دقيقة." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      if (resp.status === 402)
        return new Response(JSON.stringify({ error: "نفدت الأرصدة. أضف رصيداً للمتابعة." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      const t = await resp.text();
      console.error("AI error:", resp.status, t);
      return new Response(JSON.stringify({ error: "خطأ في الذكاء الاصطناعي" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(resp.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("pro-coach error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

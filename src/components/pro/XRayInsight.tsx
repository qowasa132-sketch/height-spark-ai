// X-Ray bone-age insight: upload hand/wrist X-Ray, get bone age + growth-plate status
import { useRef, useState } from "react";
import { Upload, Loader2, AlertTriangle, ScanLine } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { loadProfile } from "@/lib/profile";

interface XRayReport {
  isXray: boolean;
  estimatedBoneAgeYears: number;
  ageRangeLow: number;
  ageRangeHigh: number;
  growthPlatesStatus: "مفتوحة" | "شبه مغلقة" | "مغلقة" | "غير واضحة";
  remainingGrowthPotentialCm: number;
  confidence: "منخفضة" | "متوسطة" | "عالية";
  summary: string;
  indicators: string[];
  recommendations: string[];
  disclaimer: string;
}

export function XRayInsight() {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [report, setReport] = useState<XRayReport | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("الصورة كبيرة جداً (أقصى 5MB)");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImgUrl(reader.result as string);
      setReport(null);
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!imgUrl) return;
    const profile = loadProfile();
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("xray-bone-age", {
        body: {
          imageDataUrl: imgUrl,
          chronologicalAge: profile.age,
          gender: profile.gender,
        },
      });
      if (error) throw error;
      if ((data as { error?: string })?.error) {
        toast.error((data as { error: string }).error);
        return;
      }
      setReport(data as XRayReport);
    } catch (e) {
      console.error(e);
      toast.error("تعذّر التحليل. حاول مجدداً.");
    } finally {
      setLoading(false);
    }
  };

  const profile = loadProfile();
  const ageDiff = report ? report.estimatedBoneAgeYears - (profile.age ?? report.estimatedBoneAgeYears) : 0;

  return (
    <div className="space-y-3">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {!imgUrl && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            ارفع صورة أشعة سينية لرسغ ويدك اليسرى (الأكثر دقة طبياً). يحدد الذكاء الاصطناعي عمر العظام التقريبي وحالة صفائح النمو.
          </p>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-1 rounded-xl border border-border bg-card/60 p-5 text-foreground"
          >
            <Upload className="h-5 w-5 text-primary" />
            <span className="text-xs font-medium">اختر صورة الأشعة</span>
          </button>
          <p className="flex items-start gap-1 text-[10px] text-muted-foreground">
            <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
            هذه أداة تعليمية تقديرية وليست تشخيصاً طبياً. استشر طبيب أشعة للنتائج الرسمية.
          </p>
        </div>
      )}

      {imgUrl && (
        <div className="space-y-2">
          <img
            src={imgUrl}
            alt="x-ray"
            className="mx-auto max-h-64 rounded-xl border border-border bg-black"
          />
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setImgUrl(null);
                setReport(null);
              }}
              className="rounded-xl border border-border bg-card py-2.5 text-sm font-medium"
            >
              صورة أخرى
            </button>
            <button
              onClick={analyze}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanLine className="h-4 w-4" />}
              {loading ? "جاري التحليل..." : "حلّل الأشعة"}
            </button>
          </div>
        </div>
      )}

      {report && (
        <div className="space-y-3 rounded-2xl border border-primary/30 bg-card/80 p-4 backdrop-blur-md">
          {!report.isXray && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
              لم نتعرف على صورة الأشعة. ارفع صورة سينية لرسغ ويد بإضاءة واضحة.
            </div>
          )}

          {report.isXray && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-border bg-background/50 p-3 text-center">
                  <div className="text-[10px] text-muted-foreground">عمر العظام التقديري</div>
                  <div className="mt-0.5 text-2xl font-bold text-primary glow-text">
                    {report.estimatedBoneAgeYears.toFixed(1)}
                    <span className="ms-1 text-xs font-normal text-muted-foreground">سنة</span>
                  </div>
                  <div className="text-[9px] text-muted-foreground">
                    ({report.ageRangeLow.toFixed(1)} – {report.ageRangeHigh.toFixed(1)})
                  </div>
                </div>
                <div className="rounded-xl border border-border bg-background/50 p-3 text-center">
                  <div className="text-[10px] text-muted-foreground">صفائح النمو</div>
                  <div className="mt-0.5 text-base font-bold text-foreground">
                    {report.growthPlatesStatus}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    إمكانية متبقية: ~{report.remainingGrowthPotentialCm}سم
                  </div>
                </div>
              </div>

              {profile.age != null && (
                <div className="rounded-xl border border-border bg-background/50 p-3 text-center text-xs">
                  العمر الزمني: <span className="font-bold">{profile.age}</span> سنة ·{" "}
                  {ageDiff > 0.5 ? (
                    <span className="text-primary font-bold">عظامك أصغر من عمرك بـ{ageDiff.toFixed(1)} سنة 🎉</span>
                  ) : ageDiff < -0.5 ? (
                    <span className="text-chart-4 font-bold">عظامك أكبر من عمرك بـ{Math.abs(ageDiff).toFixed(1)} سنة</span>
                  ) : (
                    <span className="text-foreground">عظامك توافق عمرك تقريباً</span>
                  )}
                </div>
              )}

              <p className="text-sm text-foreground">{report.summary}</p>

              {report.indicators.length > 0 && (
                <div>
                  <h4 className="mb-1 text-xs font-bold text-muted-foreground">العلامات الملاحظة</h4>
                  <ul className="list-disc space-y-0.5 ps-5 text-xs text-foreground">
                    {report.indicators.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}

              {report.recommendations.length > 0 && (
                <div>
                  <h4 className="mb-1 text-xs font-bold text-muted-foreground">توصيات</h4>
                  <ul className="list-disc space-y-0.5 ps-5 text-xs text-foreground">
                    {report.recommendations.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}

              <p className="rounded-lg bg-muted/40 p-2 text-[10px] text-muted-foreground">
                ⚠️ {report.disclaimer}
              </p>
              <div className="text-[10px] text-muted-foreground">ثقة التحليل: {report.confidence}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

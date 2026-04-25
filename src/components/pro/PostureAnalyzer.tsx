// Photo-based posture analyzer
import { useRef, useState } from "react";
import { Camera, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Issue { name: string; severity: string; explanation: string }
interface Exercise { name: string; duration: string; steps: string[] }
interface Report { score: number; summary: string; issues: Issue[]; exercises: Exercise[] }

export function PostureAnalyzer() {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) { toast.error("الصورة كبيرة جداً (أقصى 5MB)"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setImgUrl(url);
      setReport(null);
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!imgUrl) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("posture-analyze", {
        body: { imageDataUrl: imgUrl },
      });
      if (error) throw error;
      if ((data as { error?: string })?.error) { toast.error((data as { error: string }).error); return; }
      setReport(data as Report);
    } catch (e) {
      console.error(e);
      toast.error("تعذّر التحليل. حاول مجدداً.");
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {!imgUrl && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            التقط صورة جانبية كاملة الجسم بإضاءة جيدة، مع ملابس ضيقة لرؤية الوضعية بوضوح.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              className="flex flex-col items-center justify-center gap-1 rounded-xl border border-border bg-card/60 p-4 text-foreground"
            >
              <Camera className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium">التقط صورة</span>
            </button>
            <button
              onClick={() => { if (fileRef.current) { fileRef.current.removeAttribute("capture"); fileRef.current.click(); fileRef.current.setAttribute("capture", "environment"); } }}
              className="flex flex-col items-center justify-center gap-1 rounded-xl border border-border bg-card/60 p-4 text-foreground"
            >
              <Upload className="h-5 w-5 text-primary" />
              <span className="text-xs font-medium">من المعرض</span>
            </button>
          </div>
        </div>
      )}

      {imgUrl && (
        <div className="space-y-2">
          <img src={imgUrl} alt="posture" className="mx-auto max-h-64 rounded-xl border border-border" />
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setImgUrl(null); setReport(null); }}
              className="rounded-xl border border-border bg-card py-2.5 text-sm font-medium"
            >
              صورة أخرى
            </button>
            <button
              onClick={analyze}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "جاري التحليل..." : "حلّل الآن"}
            </button>
          </div>
        </div>
      )}

      {report && (
        <div className="space-y-3 rounded-2xl border border-primary/30 bg-card/80 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">تقييم الوضعية</span>
            <span className="text-3xl font-bold text-primary glow-text">{report.score}<span className="text-sm text-muted-foreground">/100</span></span>
          </div>
          <p className="text-sm text-foreground">{report.summary}</p>

          {report.issues.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground">الملاحظات</h4>
              {report.issues.map((iss, i) => (
                <div key={i} className="rounded-xl border border-border bg-background/50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{iss.name}</span>
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] text-primary">{iss.severity}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{iss.explanation}</p>
                </div>
              ))}
            </div>
          )}

          {report.exercises.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground">تمارين تصحيحية</h4>
              {report.exercises.map((ex, i) => (
                <div key={i} className="rounded-xl border border-border bg-background/50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{ex.name}</span>
                    <span className="text-[10px] text-muted-foreground">{ex.duration}</span>
                  </div>
                  <ol className="mt-1.5 list-decimal space-y-0.5 ps-5 text-xs text-foreground">
                    {ex.steps.map((s, j) => <li key={j}>{s}</li>)}
                  </ol>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

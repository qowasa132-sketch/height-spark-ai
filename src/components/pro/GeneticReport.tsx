// Genetic vs Lifestyle report: shows how much height comes from DNA vs habits
import { useMemo } from "react";
import { Dna, TrendingUp, Target } from "lucide-react";
import { loadProfile } from "@/lib/profile";
import { predict } from "@/lib/prediction";

interface Breakdown {
  geneticCm: number;
  currentHeightCm: number;
  lifestyleAchievedCm: number;
  lifestylePotentialCm: number;
  predictedAdultCm: number;
  factors: {
    label: string;
    contributionCm: number;
    status: "ok" | "warn" | "bad";
    tip: string;
  }[];
}

function computeBreakdown(): Breakdown | null {
  const p = loadProfile();
  const pred = predict(p);
  if (!pred || !p.heightCm || !p.motherHeightCm || !p.fatherHeightCm) return null;

  // Genetic baseline = mid-parental height (Tanner) ~ 70% of final height per literature
  const geneticCm = pred.midParentalCm;

  // Lifestyle factors — each can add or subtract cm vs the baseline
  const factors: Breakdown["factors"] = [];

  // Sleep — biggest lever (GH released during deep sleep)
  if (p.sleepHours == null) {
    factors.push({ label: "النوم", contributionCm: 0, status: "warn", tip: "أكمل بياناتك لتقييم تأثير النوم." });
  } else if (p.sleepHours >= 8) {
    factors.push({ label: "النوم", contributionCm: 1.5, status: "ok", tip: "ممتاز — هرمون النمو في ذروته." });
  } else if (p.sleepHours >= 7) {
    factors.push({ label: "النوم", contributionCm: 0.5, status: "warn", tip: "زِد ساعة لتحصل على ١.٥سم." });
  } else {
    factors.push({ label: "النوم", contributionCm: -2, status: "bad", tip: "نومك القصير يكلّفك حتى ٢سم. زِده فوراً." });
  }

  // Workout — moderate stress on bones promotes growth
  if (p.workout === "heavy") factors.push({ label: "النشاط البدني", contributionCm: 1.5, status: "ok", tip: "ممتاز." });
  else if (p.workout === "moderate") factors.push({ label: "النشاط البدني", contributionCm: 1, status: "ok", tip: "جيد، يمكنك إضافة ٠.٥سم بمزيد." });
  else if (p.workout === "light") factors.push({ label: "النشاط البدني", contributionCm: 0.3, status: "warn", tip: "ارفع نشاطك لـ٤-٥ مرات/أسبوع." });
  else factors.push({ label: "النشاط البدني", contributionCm: -0.5, status: "bad", tip: "ابدأ بـ٣ مرات/أسبوع." });

  // Nutrition (heuristic from acne flag — acne can indicate poor diet)
  if (p.acne === "frequent") factors.push({ label: "التغذية", contributionCm: -1, status: "bad", tip: "قلّل السكر والمعالجات وزِد البروتين والكالسيوم." });
  else if (p.acne === "occasional") factors.push({ label: "التغذية", contributionCm: 0, status: "warn", tip: "حسّن جودة وجباتك للوصول إلى +١سم." });
  else factors.push({ label: "التغذية", contributionCm: 1, status: "ok", tip: "بشرة صافية = تغذية متوازنة. أحسنت." });

  // Posture / standing tall — can give 2-5 visible cm
  factors.push({
    label: "الوضعية والاستقامة",
    contributionCm: 2,
    status: "warn",
    tip: "تمارين تصحيحية = حتى ٥سم طول ظاهري فوراً.",
  });

  const lifestyleAchievedCm = factors.reduce((s, f) => s + Math.max(0, f.contributionCm), 0);
  const lifestylePotentialCm = factors.reduce(
    (s, f) => s + (f.status === "ok" ? f.contributionCm : Math.max(f.contributionCm, 0) + (f.status === "bad" ? 2 : 1)),
    0,
  );

  return {
    geneticCm: Math.round(geneticCm * 10) / 10,
    currentHeightCm: p.heightCm,
    lifestyleAchievedCm: Math.round(lifestyleAchievedCm * 10) / 10,
    lifestylePotentialCm: Math.round(lifestylePotentialCm * 10) / 10,
    predictedAdultCm: pred.predictedCm,
    factors,
  };
}

export function GeneticReport() {
  const data = useMemo(() => computeBreakdown(), []);

  if (!data) {
    return (
      <p className="text-xs text-muted-foreground">
        أكمل بياناتك (الطول، الوزن، طول الوالدين) لاستخراج تقريرك الجيني.
      </p>
    );
  }

  // For visualization: compute % share of genetics vs lifestyle in current height
  const dnaShare = Math.min(95, Math.max(60, Math.round((data.geneticCm / data.currentHeightCm) * 100)));
  const lifestyleShare = 100 - dnaShare;

  return (
    <div className="space-y-3">
      {/* Hero split bar */}
      <div className="rounded-2xl border border-border bg-background/50 p-3">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 font-bold text-primary">
            <Dna className="h-3.5 w-3.5" /> الجينات {dnaShare}%
          </span>
          <span className="flex items-center gap-1 font-bold text-chart-4">
            نمط الحياة {lifestyleShare}% <TrendingUp className="h-3.5 w-3.5" />
          </span>
        </div>
        <div className="flex h-3 overflow-hidden rounded-full">
          <div className="bg-gradient-primary" style={{ width: `${dnaShare}%` }} />
          <div className="bg-chart-4" style={{ width: `${lifestyleShare}%` }} />
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          ~{data.geneticCm}سم من طولك الحالي مصدره جيناتك. الباقي وأكثر يعتمد على عاداتك.
        </p>
      </div>

      {/* Headline numbers */}
      <div className="grid grid-cols-3 gap-2">
        <Mini label="جيني" value={`${data.geneticCm}`} suffix="سم" tone="primary" />
        <Mini label="مكاسب حالية" value={`+${data.lifestyleAchievedCm}`} suffix="سم" tone="ok" />
        <Mini label="إمكانية إضافية" value={`+${(data.lifestylePotentialCm - data.lifestyleAchievedCm).toFixed(1)}`} suffix="سم" tone="warn" />
      </div>

      {/* Predicted */}
      <div className="rounded-2xl border border-primary/30 bg-card/80 p-3 text-center">
        <div className="text-[10px] text-muted-foreground">طولك المتوقع كبالغ</div>
        <div className="mt-0.5 text-2xl font-bold text-primary glow-text">
          {data.predictedAdultCm}
          <span className="ms-1 text-sm font-normal text-muted-foreground">سم</span>
        </div>
      </div>

      {/* Per-factor breakdown */}
      <div className="space-y-1.5">
        <h4 className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
          <Target className="h-3.5 w-3.5" /> أين تكسب أو تخسر السنتيمترات؟
        </h4>
        {data.factors.map((f, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-background/40 px-3 py-2">
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-foreground">{f.label}</div>
              <div className="text-[10px] text-muted-foreground">{f.tip}</div>
            </div>
            <div
              className={`ms-2 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                f.status === "ok"
                  ? "bg-primary/15 text-primary"
                  : f.status === "warn"
                    ? "bg-chart-4/15 text-chart-4"
                    : "bg-destructive/15 text-destructive"
              }`}
            >
              {f.contributionCm > 0 ? "+" : ""}
              {f.contributionCm}سم
            </div>
          </div>
        ))}
      </div>

      <p className="rounded-lg bg-muted/40 p-2 text-[10px] text-muted-foreground">
        التقدير مبني على معادلة Tanner للطول الجيني المتوقع، مع تعديلات نمط الحياة. النتائج الفردية قد تختلف.
      </p>
    </div>
  );
}

function Mini({
  label,
  value,
  suffix,
  tone,
}: {
  label: string;
  value: string;
  suffix?: string;
  tone: "primary" | "ok" | "warn";
}) {
  const color = tone === "primary" ? "text-primary" : tone === "ok" ? "text-foreground" : "text-chart-4";
  return (
    <div className="rounded-xl border border-border bg-background/40 p-2 text-center">
      <div className={`text-base font-bold ${color}`}>
        {value}
        {suffix && <span className="ms-0.5 text-[10px] font-normal text-muted-foreground">{suffix}</span>}
      </div>
      <div className="mt-0.5 text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}

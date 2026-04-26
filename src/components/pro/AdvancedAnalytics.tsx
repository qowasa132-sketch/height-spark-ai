// Advanced analytics: growth velocity chart + spurt alerts
import { useMemo } from "react";
import { TrendingUp, Zap, AlertCircle } from "lucide-react";
import { loadMeasurements, type Measurement } from "@/lib/measurements";

interface VelocityPoint {
  dateLabel: string;
  cmPerMonth: number;
  fromCm: number;
  toCm: number;
}

function computeVelocity(entries: Measurement[]): VelocityPoint[] {
  if (entries.length < 2) return [];
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const points: VelocityPoint[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const cur = sorted[i];
    const days = (new Date(cur.date).getTime() - new Date(prev.date).getTime()) / 86400000;
    if (days < 7) continue; // ignore noise from very close entries
    const cm = cur.heightCm - prev.heightCm;
    const cmPerMonth = (cm / days) * 30;
    points.push({
      dateLabel: cur.date.slice(5),
      cmPerMonth: Math.round(cmPerMonth * 100) / 100,
      fromCm: prev.heightCm,
      toCm: cur.heightCm,
    });
  }
  return points;
}

export function AdvancedAnalytics() {
  const entries = useMemo(() => loadMeasurements(), []);
  const velocity = useMemo(() => computeVelocity(entries), [entries]);

  if (entries.length < 2) {
    return (
      <p className="text-xs text-muted-foreground">
        أضف قياسين للطول على الأقل (بفارق أسبوع أو أكثر) من قسم القياسات في خطتي لرؤية تحليلك المتقدم.
      </p>
    );
  }

  // Growth spurt detection: > 0.7 cm/month is rapid for teens
  const lastVel = velocity[velocity.length - 1]?.cmPerMonth ?? 0;
  const inSpurt = lastVel >= 0.7;
  const slow = lastVel > 0 && lastVel < 0.2;

  // Build sparkline points
  const max = Math.max(0.1, ...velocity.map((v) => v.cmPerMonth));
  const min = Math.min(0, ...velocity.map((v) => v.cmPerMonth));
  const range = max - min || 1;
  const W = 280;
  const H = 80;
  const stepX = velocity.length > 1 ? W / (velocity.length - 1) : 0;
  const points = velocity
    .map((v, i) => {
      const x = i * stepX;
      const y = H - ((v.cmPerMonth - min) / range) * (H - 8) - 4;
      return `${x},${y}`;
    })
    .join(" ");

  // Annual projection
  const avgVel = velocity.length
    ? velocity.reduce((s, v) => s + v.cmPerMonth, 0) / velocity.length
    : 0;
  const yearlyProjectionCm = Math.round(avgVel * 12 * 10) / 10;

  return (
    <div className="space-y-3">
      {/* Spurt alert */}
      {inSpurt && (
        <div className="rounded-2xl border border-primary/40 bg-primary/10 p-3">
          <div className="flex items-center gap-1.5 text-sm font-bold text-primary">
            <Zap className="h-4 w-4" /> طفرة نمو نشطة! 🔥
          </div>
          <p className="mt-1 text-xs text-foreground">
            معدلك الحالي <strong>{lastVel}سم/شهر</strong> أعلى من الطبيعي. هذه فترة ذهبية:
          </p>
          <ul className="mt-1.5 list-disc space-y-0.5 ps-5 text-[11px] text-foreground">
            <li>زِد البروتين إلى ١.٦غ/كغ من وزنك يومياً.</li>
            <li>نَم ٩ ساعات على الأقل — هرمون النمو في ذروته.</li>
            <li>تجنّب الإجهاد البدني الزائد، ركّز على القفز والإطالة.</li>
            <li>كالسيوم + فيتامين D3 + زنك بدون انقطاع.</li>
          </ul>
        </div>
      )}
      {slow && (
        <div className="rounded-2xl border border-chart-4/40 bg-chart-4/10 p-3">
          <div className="flex items-center gap-1.5 text-sm font-bold text-chart-4">
            <AlertCircle className="h-4 w-4" /> نمو بطيء حالياً
          </div>
          <p className="mt-1 text-xs text-foreground">
            معدلك {lastVel}سم/شهر — راجع نومك وتغذيتك. قد تكون بين موجتين.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <Stat label="آخر معدل" value={`${lastVel}`} suffix="سم/شهر" tone="primary" />
        <Stat label="متوسط" value={`${(Math.round(avgVel * 100) / 100)}`} suffix="سم/شهر" tone="default" />
        <Stat label="توقع سنوي" value={`${yearlyProjectionCm}`} suffix="سم" tone="primary" />
      </div>

      {/* Velocity chart */}
      <div className="rounded-2xl border border-border bg-background/50 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs font-bold text-foreground">
            <TrendingUp className="h-3.5 w-3.5 text-primary" /> سرعة النمو (سم/شهر)
          </span>
          <span className="text-[10px] text-muted-foreground">{velocity.length} قياس</span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="h-20 w-full">
          {/* Spurt threshold line */}
          {(() => {
            const y = H - ((0.7 - min) / range) * (H - 8) - 4;
            return (
              <line
                x1={0}
                y1={y}
                x2={W}
                y2={y}
                stroke="oklch(var(--primary) / 0.3)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            );
          })()}
          <polyline
            fill="none"
            stroke="oklch(var(--primary))"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={points}
          />
          {velocity.map((v, i) => {
            const x = i * stepX;
            const y = H - ((v.cmPerMonth - min) / range) * (H - 8) - 4;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={v.cmPerMonth >= 0.7 ? 4 : 2.5}
                fill={v.cmPerMonth >= 0.7 ? "oklch(var(--primary))" : "oklch(var(--foreground) / 0.6)"}
              />
            );
          })}
        </svg>
        <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
          <span className="inline-block h-0.5 w-3 bg-primary/40" /> خط طفرة النمو (٠.٧سم/شهر)
        </div>
      </div>

      {/* Recent entries */}
      <div className="space-y-1">
        <h4 className="text-xs font-bold text-muted-foreground">آخر التغيّرات</h4>
        {velocity.slice(-4).reverse().map((v, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-background/40 px-3 py-1.5">
            <span className="text-[11px] text-muted-foreground">{v.dateLabel}</span>
            <span className="text-xs">
              {v.fromCm} → <strong>{v.toCm}سم</strong>
            </span>
            <span className={`text-[11px] font-bold ${v.cmPerMonth >= 0.7 ? "text-primary" : "text-foreground"}`}>
              {v.cmPerMonth >= 0 ? "+" : ""}{v.cmPerMonth}سم/شهر
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, suffix, tone }: { label: string; value: string; suffix: string; tone: "primary" | "default" }) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-2 text-center">
      <div className={`text-base font-bold ${tone === "primary" ? "text-primary" : "text-foreground"}`}>
        {value}
        <span className="ms-0.5 text-[10px] font-normal text-muted-foreground">{suffix}</span>
      </div>
      <div className="mt-0.5 text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}

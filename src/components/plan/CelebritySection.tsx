import { useEffect, useMemo, useRef, useState } from "react";
import { Share2, Sparkles, Shuffle } from "lucide-react";
import { toast } from "sonner";
import { SectionCard } from "./SectionCard";
import { loadProfile } from "@/lib/profile";
import { CELEBRITIES, getCelebrityMatch, getCategoryLabel, type Celebrity } from "@/lib/celebrities";
import { cmToFtIn } from "@/lib/prediction";

export function CelebritySection() {
  const [heightCm, setHeightCm] = useState<number | null>(null);
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [match, setMatch] = useState<Celebrity | null>(null);
  const [seed, setSeed] = useState<number>(() => Math.floor(Date.now() / (1000 * 60 * 60 * 24)));
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const p = loadProfile();
    if (p.heightCm) {
      setHeightCm(p.heightCm);
      setUnit(p.unit);
      setMatch(getCelebrityMatch(p.heightCm, seed));
    }
  }, [seed]);

  const heightLabel = useMemo(() => {
    if (!match) return "";
    if (unit === "metric") return `${match.heightCm} سم`;
    const { ft, in: inches } = cmToFtIn(match.heightCm);
    return `${ft}'${inches}"`;
  }, [match, unit]);

  const userHeightLabel = useMemo(() => {
    if (heightCm == null) return "";
    if (unit === "metric") return `${heightCm} سم`;
    const { ft, in: inches } = cmToFtIn(heightCm);
    return `${ft}'${inches}"`;
  }, [heightCm, unit]);

  const diff = heightCm != null && match ? Math.abs(heightCm - match.heightCm) : null;

  const handleShuffle = () => {
    setSeed((s) => s + 1);
  };

  const handleShare = async () => {
    if (!match || heightCm == null) return;
    const shareText = `طولي ${userHeightLabel} — نفس طول ${match.nameAr} ${match.emoji}!\nاكتشف توأم طولك من المشاهير 👇`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "توأم طولي من المشاهير",
          text: shareText,
        });
        return;
      }
    } catch {
      // user cancelled or unsupported
    }
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success("تم نسخ النص للمشاركة 📋");
    } catch {
      toast.error("تعذرت المشاركة");
    }
  };

  if (heightCm == null) {
    return (
      <SectionCard title="توأم طولك من المشاهير" subtitle="أضف طولك في إعدادات الملف الشخصي لرؤية الميزة." />
    );
  }

  if (!match) return null;

  return (
    <SectionCard
      title="توأم طولك من المشاهير"
      subtitle="شاركها على ستوري وتحدّى أصدقائك"
      action={
        <button
          type="button"
          onClick={handleShuffle}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card/80 text-foreground transition-smooth hover:border-primary/50"
          aria-label="مشهور آخر"
        >
          <Shuffle className="h-4 w-4" />
        </button>
      }
    >
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-5 shadow-glow"
      >
        <div className="absolute -end-6 -top-6 h-24 w-24 rounded-full bg-primary/20 blur-3xl" />

        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          <span>توأم اليوم</span>
        </div>

        <div className="mt-3 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-primary text-3xl shadow-glow">
            {match.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-bold text-foreground">{match.nameAr}</p>
            <p className="text-xs text-muted-foreground">{getCategoryLabel(match.category)}</p>
            <p className="mt-1 text-2xl font-bold text-primary glow-text">{heightLabel}</p>
          </div>
        </div>

        {/* Side-by-side bars */}
        <div className="mt-5 space-y-2">
          <Bar label="أنت" value={userHeightLabel} cm={heightCm} max={Math.max(heightCm, match.heightCm)} accent="primary" />
          <Bar label={match.nameAr} value={heightLabel} cm={match.heightCm} max={Math.max(heightCm, match.heightCm)} accent="muted" />
        </div>

        {diff != null && (
          <p className="mt-4 text-center text-xs text-muted-foreground">
            {diff === 0 ? (
              <span className="text-primary font-semibold">طولكما متطابق تماماً! 🎯</span>
            ) : (
              <>الفرق فقط <span className="font-semibold text-foreground">{diff} سم</span></>
            )}
          </p>
        )}

        <p className="mt-3 rounded-xl bg-card/60 p-3 text-xs leading-relaxed text-muted-foreground">
          {match.fact}
        </p>

        <button
          type="button"
          onClick={handleShare}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth active:scale-[0.98]"
        >
          <Share2 className="h-4 w-4" />
          شاركها على ستوري
        </button>
      </div>

      <p className="mt-3 text-center text-[11px] text-muted-foreground">
        من بين {CELEBRITIES.length}+ شخصية عالمية
      </p>
    </SectionCard>
  );
}

function Bar({
  label,
  value,
  cm,
  max,
  accent,
}: {
  label: string;
  value: string;
  cm: number;
  max: number;
  accent: "primary" | "muted";
}) {
  const pct = Math.max(20, Math.round((cm / max) * 100));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-foreground">{value}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            accent === "primary" ? "bg-gradient-primary" : "bg-foreground/40"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

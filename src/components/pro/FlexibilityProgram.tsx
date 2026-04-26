// Flexibility & Mobility programs for spinal health
import { useState } from "react";
import { ChevronRight, Clock, Sparkles } from "lucide-react";

interface Move { name: string; hold: string; cue: string }
interface Plan {
  id: string;
  title: string;
  emoji: string;
  desc: string;
  durationMin: number;
  moves: Move[];
}

const PLANS: Plan[] = [
  {
    id: "spine",
    title: "تخفيف الضغط على العمود الفقري",
    emoji: "🌿",
    desc: "روتين يومي 10 دقائق لإطالة الفقرات وتحرير المسافات بين الأقراص.",
    durationMin: 10,
    moves: [
      { name: "تعليق على عقلة (Dead Hang)", hold: "٣×٣٠ ثانية", cue: "استرخِ تماماً واترك جاذبيتك تطيل عمودك." },
      { name: "وضعية الطفل (Child's Pose)", hold: "٢×٦٠ ثانية", cue: "اركع واسجد، مدّ ذراعيك للأمام." },
      { name: "Cat-Cow", hold: "٣×١٠ تكرار", cue: "تنفّس بعمق مع كل تبديل بين القوس والتقوّس." },
      { name: "Sphinx Pose", hold: "٢×٤٥ ثانية", cue: "استلقِ على البطن وارتكز على ساعديك." },
    ],
  },
  {
    id: "hips",
    title: "فتح الورك والحوض",
    emoji: "🦵",
    desc: "عضلات الورك المشدودة تسحب الحوض وتقصّر القامة. حرّرها.",
    durationMin: 12,
    moves: [
      { name: "Pigeon Pose", hold: "٢×٦٠ ثانية لكل جانب", cue: "اشعر بالشد في جانب الورك العلوي." },
      { name: "90/90 Hip Stretch", hold: "٣×٤٥ ثانية لكل جهة", cue: "اجلس مع زاوية ٩٠° لكل ركبة وانحنِ للأمام." },
      { name: "Frog Stretch", hold: "٢×٦٠ ثانية", cue: "افتح ركبتيك على الأرض ومدّ الورك للخلف." },
      { name: "Couch Stretch", hold: "٢×٤٥ ثانية لكل ساق", cue: "ضع قدمك الخلفية على أريكة واسحب الورك للأمام." },
    ],
  },
  {
    id: "hams",
    title: "إطالة السلسلة الخلفية",
    emoji: "🧘",
    desc: "أوتار الركبة وأسفل الظهر — مفتاح وضعية مستقيمة وقامة أطول.",
    durationMin: 8,
    moves: [
      { name: "Forward Fold", hold: "٣×٤٥ ثانية", cue: "قف ودعّ ظهرك يتدلى من الورك بدون قفل الركبتين." },
      { name: "Seated Hamstring", hold: "٢×٦٠ ثانية لكل ساق", cue: "اجلس وانحنِ نحو القدم الممدودة." },
      { name: "Downward Dog", hold: "٣×٣٠ ثانية", cue: "ادفع وركيك للأعلى وكعبيك نحو الأرض." },
    ],
  },
  {
    id: "thoracic",
    title: "تحرير الظهر العلوي",
    emoji: "🌀",
    desc: "حركة الظهر العلوي تفرد الكتفين وتفتح الصدر.",
    durationMin: 7,
    moves: [
      { name: "Thread the Needle", hold: "٢×٦٠ ثانية لكل جانب", cue: "من وضعية الزحف، مرّر ذراعك تحت جسمك." },
      { name: "Open Book", hold: "٣×١٠ تكرار لكل جانب", cue: "استلقِ جانباً وافتح صدرك للسقف." },
      { name: "Foam Roll T-Spine", hold: "٢×٦٠ ثانية", cue: "تدحرج ببطء على الفوم رول للظهر العلوي." },
    ],
  },
];

export function FlexibilityProgram() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
          <Sparkles className="h-3.5 w-3.5" /> ليه المرونة مهمة؟
        </div>
        <p className="mt-1 text-xs text-foreground">
          العضلات المشدودة تضغط الفقرات وتقصّر قامتك حتى ٢-٣سم. هذه البرامج تحرّر المسافات وتفرد عمودك تدريجياً.
        </p>
      </div>

      {PLANS.map((p) => (
        <div key={p.id} className="overflow-hidden rounded-2xl border border-border bg-card/60">
          <button
            onClick={() => setOpen(open === p.id ? null : p.id)}
            className="flex w-full items-center gap-3 p-3 text-start"
          >
            <span className="text-2xl">{p.emoji}</span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-foreground">{p.title}</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">{p.desc}</div>
              <div className="mt-1 inline-flex items-center gap-1 text-[10px] text-primary">
                <Clock className="h-3 w-3" /> {p.durationMin} دقائق
              </div>
            </div>
            <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${open === p.id ? "rotate-90" : ""}`} />
          </button>
          {open === p.id && (
            <div className="space-y-2 border-t border-border bg-background/40 p-3">
              {p.moves.map((m, i) => (
                <div key={i} className="rounded-xl border border-border bg-card/60 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">{m.name}</span>
                    <span className="text-[10px] text-muted-foreground">{m.hold}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{m.cue}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

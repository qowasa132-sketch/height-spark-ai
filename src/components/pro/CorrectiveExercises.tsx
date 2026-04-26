// Corrective Exercise Library — postural conditions with targeted programs
import { useState } from "react";
import { ChevronRight, Sparkles, Clock } from "lucide-react";

interface Exercise {
  name: string;
  duration: string;
  steps: string[];
}

interface Program {
  id: string;
  condition: string;
  emoji: string;
  description: string;
  visibleGainCm: string; // e.g. "2-3"
  exercises: Exercise[];
}

const PROGRAMS: Program[] = [
  {
    id: "kyphosis",
    condition: "تحدّب الظهر العلوي (Kyphosis)",
    emoji: "🦴",
    description: "انحناء الظهر للأمام بسبب الجلوس الطويل. تصحيحه يكشف ٢-٤سم خفية.",
    visibleGainCm: "2-4",
    exercises: [
      {
        name: "Wall Angels",
        duration: "٣×١٠ تكرار",
        steps: [
          "قف وظهرك ملاصق للجدار بالكامل (الرأس، الكتفين، الأرداف).",
          "ارفع ذراعيك بشكل (W) ثم مدّهما لأعلى (Y) ببطء.",
          "حافظ على ملامسة الكتفين والمرفقين للجدار طوال الحركة.",
        ],
      },
      {
        name: "Prone Cobra",
        duration: "٣×٣٠ ثانية",
        steps: [
          "استلقِ على بطنك، الذراعان بجانب الجسم.",
          "ارفع صدرك ورأسك مع تدوير الكتفين للخلف.",
          "اعصر لوحَي الكتف معاً واثبت ٣٠ ثانية.",
        ],
      },
      {
        name: "Foam Roller للصدر",
        duration: "٢×٦٠ ثانية",
        steps: [
          "ضع الفوم رول أفقياً تحت لوحَي الكتف.",
          "اشبك يديك خلف الرأس وانزل بصدرك للخلف.",
          "تنفّس عميقاً واسمح للصدر بالانفتاح.",
        ],
      },
      {
        name: "Chin Tucks",
        duration: "٣×١٥ تكرار",
        steps: [
          "اجلس باستقامة وانظر للأمام.",
          "اسحب ذقنك للخلف (صنع ذقن مزدوج).",
          "اثبت ٥ ثوانٍ ثم استرخِ.",
        ],
      },
    ],
  },
  {
    id: "lordosis",
    condition: "تقوّس أسفل الظهر (Lordosis)",
    emoji: "⚙️",
    description: "ميلان الحوض للأمام يبرز البطن ويقصّر الظهر. علاجه يفرد العمود.",
    visibleGainCm: "1-3",
    exercises: [
      {
        name: "Pelvic Tilt",
        duration: "٣×١٢ تكرار",
        steps: [
          "استلقِ على ظهرك مع ثني الركبتين.",
          "اضغط أسفل ظهرك إلى الأرض مع شد عضلات البطن.",
          "اثبت ٥ ثوانٍ ثم استرخِ.",
        ],
      },
      {
        name: "Glute Bridge",
        duration: "٣×١٥ تكرار",
        steps: [
          "استلقِ على الظهر مع ثني الركبتين والقدمين على الأرض.",
          "ارفع وركيك حتى يشكّل جسمك خطاً مستقيماً.",
          "اعصر عضلات المؤخرة في القمة لمدة ثانيتين.",
        ],
      },
      {
        name: "تمدد عضلة الورك (Hip Flexor Stretch)",
        duration: "٣×٤٥ ثانية لكل جانب",
        steps: [
          "اركع على ركبة واحدة والقدم الأخرى أمامك.",
          "ادفع الورك للأمام مع شد عضلات المؤخرة.",
          "اشعر بالشد في مقدمة الفخذ، اثبت ٤٥ ثانية.",
        ],
      },
      {
        name: "Dead Bug",
        duration: "٣×١٠ لكل جهة",
        steps: [
          "استلقِ على الظهر، اليدان للسقف والركبتان مرفوعتان ٩٠°.",
          "أنزل ذراعاً ورجلاً معاكسة ببطء.",
          "ارجع وكرّر مع الجهة الأخرى مع شد البطن.",
        ],
      },
    ],
  },
  {
    id: "pelvic-tilt",
    condition: "ميلان الحوض الجانبي (Pelvic Tilt)",
    emoji: "🩴",
    description: "اختلاف ارتفاع الحوض يجعل ساقاً تبدو أقصر. التوازن يفرد القامة.",
    visibleGainCm: "1-2",
    exercises: [
      {
        name: "Side Plank",
        duration: "٣×٣٠ ثانية لكل جانب",
        steps: [
          "استلقِ على جنبك وادعم نفسك على الكوع والقدم.",
          "ارفع وركك ليكون جسمك خطاً مستقيماً.",
          "اثبت ٣٠ ثانية مع التنفس بانتظام.",
        ],
      },
      {
        name: "Clamshells",
        duration: "٣×١٥ لكل جانب",
        steps: [
          "استلقِ على جنبك مع ثني الركبتين.",
          "افتح الركبة العلوية مع إبقاء القدمين متلاصقتين.",
          "اعصر عضلة المؤخرة الجانبية وارجع ببطء.",
        ],
      },
      {
        name: "Single-Leg Deadlift",
        duration: "٣×١٠ لكل ساق",
        steps: [
          "قف على ساق واحدة مع الإمساك بوزن خفيف.",
          "انحنِ للأمام مع رفع الساق الخلفية.",
          "ارجع للوضع المستقيم ببطء، حافظ على الاتزان.",
        ],
      },
    ],
  },
  {
    id: "forward-head",
    condition: "اندفاع الرأس للأمام (Forward Head)",
    emoji: "👤",
    description: "رأسك مدفوع للأمام بسبب الموبايل. كل ٢.٥سم اندفاع = +٤.٥كغ على الرقبة.",
    visibleGainCm: "1-2",
    exercises: [
      {
        name: "Chin Tucks",
        duration: "٤×١٥ تكرار",
        steps: [
          "اجلس باستقامة، انظر للأمام.",
          "اسحب ذقنك للخلف بحركة أفقية (ليس للأسفل).",
          "اثبت ٥ ثوانٍ، كرر.",
        ],
      },
      {
        name: "Doorway Stretch للصدر",
        duration: "٣×٣٠ ثانية",
        steps: [
          "قف عند إطار باب وضع ساعديك على الجانبين.",
          "تقدم بقدم واحدة للأمام لتشعر بالشد في الصدر.",
          "اثبت ٣٠ ثانية وكرّر.",
        ],
      },
      {
        name: "Scapular Squeezes",
        duration: "٣×٢٠ تكرار",
        steps: [
          "اجلس أو قف باستقامة.",
          "اعصر لوحَي الكتف معاً ببطء.",
          "اثبت ٣ ثوانٍ ثم استرخِ.",
        ],
      },
    ],
  },
];

export function CorrectiveExercises() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
          <Sparkles className="h-3.5 w-3.5" /> النتيجة الفورية
        </div>
        <p className="mt-1 text-xs text-foreground">
          تصحيح الوضعية يمنحك من <strong>٢ إلى ٥ سم</strong> طولاً ظاهرياً فورياً بمجرد استقامة العمود الفقري — بدون انتظار سنوات.
        </p>
      </div>

      <div className="space-y-2">
        {PROGRAMS.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-2xl border border-border bg-card/60">
            <button
              onClick={() => setOpen(open === p.id ? null : p.id)}
              className="flex w-full items-center gap-3 p-3 text-start"
            >
              <span className="text-2xl">{p.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-foreground">{p.condition}</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">{p.description}</div>
                <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                  <Sparkles className="h-2.5 w-2.5" /> +{p.visibleGainCm}سم ظاهري
                </div>
              </div>
              <ChevronRight
                className={`h-4 w-4 text-muted-foreground transition-transform ${open === p.id ? "rotate-90" : ""}`}
              />
            </button>

            {open === p.id && (
              <div className="border-t border-border bg-background/40 p-3 space-y-2">
                {p.exercises.map((ex, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card/60 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">{ex.name}</span>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-3 w-3" /> {ex.duration}
                      </span>
                    </div>
                    <ol className="mt-1.5 list-decimal space-y-0.5 ps-5 text-xs text-foreground">
                      {ex.steps.map((s, j) => <li key={j}>{s}</li>)}
                    </ol>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

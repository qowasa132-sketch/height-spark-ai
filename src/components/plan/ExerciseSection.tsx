import { useState } from "react";
import { Dumbbell, Play, Check, X } from "lucide-react";
import { SectionCard, ProgressBar } from "./SectionCard";
import type { DailyLog } from "@/lib/dailyLog";

interface Exercise {
  id: string;
  name: string;
  category: "posture" | "stretch";
  durationSec: number;
  description: string;
  // YouTube video ID for embed
  videoId: string;
  steps: string[];
}

const EXERCISES: Exercise[] = [
  // Posture
  {
    id: "wall-angel",
    name: "ملاك الجدار",
    category: "posture",
    durationSec: 60,
    description: "يصحّح انحناء الكتفين ويستقيم العمود الفقري.",
    videoId: "1UU4VvklQ44",
    steps: [
      "قف وظهرك ملتصق بالجدار، قدماك على بُعد ١٥ سم منه.",
      "ارفع ذراعيك على شكل حرف Y مع لمس الجدار.",
      "اخفض ذراعيك ببطء إلى شكل W.",
      "كرّر ١٠ مرات بحركة بطيئة ومتحكمة.",
    ],
  },
  {
    id: "chin-tuck",
    name: "سحب الذقن",
    category: "posture",
    durationSec: 45,
    description: "يصحّح وضعية الرأس الأمامية ويُطيل الرقبة.",
    videoId: "KqR1EoEmq9c",
    steps: [
      "اجلس باستقامة وانظر للأمام.",
      "اسحب ذقنك للخلف كأنك تصنع ذقناً مزدوجة.",
      "اثبت ٥ ثوانٍ ثم استرخِ.",
      "كرّر ١٠ مرات.",
    ],
  },
  {
    id: "cat-cow",
    name: "القطة والبقرة",
    category: "posture",
    durationSec: 90,
    description: "يحسّن مرونة العمود الفقري بكامل امتداده.",
    videoId: "y39PrKY_4JM",
    steps: [
      "ابدأ على الأربع، اليدين تحت الكتفين والركبتين تحت الوركين.",
      "استنشق وانزل البطن واسحب الرأس لأعلى (بقرة).",
      "ازفر وقوّس الظهر للأعلى مع سحب الذقن للصدر (قطة).",
      "كرّر ١٠ تكرارات بطيئة.",
    ],
  },
  // Stretch
  {
    id: "hang",
    name: "التعليق على البار",
    category: "stretch",
    durationSec: 60,
    description: "يفك ضغط العمود الفقري ويزيد المسافة بين الفقرات.",
    videoId: "9eY15prKcUY",
    steps: [
      "أمسك بار العقلة بقبضة عريضة قليلاً.",
      "علّق بثقل جسمك مع استرخاء الكتفين.",
      "اثبت ٢٠–٣٠ ثانية، ٣ جولات.",
      "تنفس ببطء ولا تقفز للأسفل — انزل بهدوء.",
    ],
  },
  {
    id: "cobra",
    name: "وضعية الكوبرا",
    category: "stretch",
    durationSec: 60,
    description: "يطيل الجزء الأمامي من الجذع ويُحسّن مرونة الظهر.",
    videoId: "k48O2CxvZ3o",
    steps: [
      "استلقِ على بطنك واليدين تحت الكتفين.",
      "ادفع جذعك لأعلى مع إبقاء الحوض على الأرض.",
      "اثبت ٢٠ ثانية، ٣ مرات.",
      "تنفس بعمق طوال التمرين.",
    ],
  },
  {
    id: "child-pose",
    name: "وضعية الطفل",
    category: "stretch",
    durationSec: 60,
    description: "يُريح أسفل الظهر والوركين.",
    videoId: "kH12QrSGedM",
    steps: [
      "اجلس على ركبتيك واجعل قدميك متلامستين.",
      "انحنِ للأمام بذراعين ممدودتين.",
      "ضع جبهتك على الأرض واسترخِ.",
      "اثبت ٣٠–٤٥ ثانية.",
    ],
  },
];

interface Props {
  log: DailyLog;
  update: (patch: Partial<DailyLog>) => void;
}

const GOAL = 3;

export function ExerciseSection({ log, update }: Props) {
  const [active, setActive] = useState<Exercise | null>(null);
  const done = log.workoutsDone.length;
  const progress = (done / GOAL) * 100;

  const toggleDone = (id: string) => {
    const has = log.workoutsDone.includes(id);
    const workoutsDone = has ? log.workoutsDone.filter((x) => x !== id) : [...log.workoutsDone, id];
    const sportMinutes = Math.max(0, Math.min(180, workoutsDone.length * 15));
    update({ workoutsDone, sportMinutes });
  };

  return (
    <SectionCard
      icon={<Dumbbell className="h-5 w-5" />}
      title="التمارين"
      hint="تصحيح الوضعية وإطالة العمود الفقري"
      right={
        <span className="text-[10px] text-muted-foreground">
          {done} / {GOAL}
        </span>
      }
    >
      <div className="mb-3">
        <ProgressBar value={progress} />
      </div>
      <div className="space-y-2">
        {EXERCISES.map((ex) => {
          const isDone = log.workoutsDone.includes(ex.id);
          return (
            <div
              key={ex.id}
              className={`flex items-center gap-2 rounded-2xl border-2 p-3 transition-smooth ${
                isDone ? "border-primary bg-primary/10" : "border-border bg-background/40"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleDone(ex.id)}
                aria-label={isDone ? "إلغاء" : "تم"}
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 transition-smooth ${
                  isDone ? "border-primary bg-primary text-primary-foreground" : "border-border"
                }`}
              >
                {isDone && <Check className="h-4 w-4" strokeWidth={3} />}
              </button>
              <button
                type="button"
                onClick={() => setActive(ex)}
                className="relative flex h-12 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black"
                aria-label="معاينة"
              >
                <img
                  src={`https://i.ytimg.com/vi/${ex.videoId}/mqdefault.jpg`}
                  alt=""
                  className="h-full w-full object-cover opacity-80"
                  loading="lazy"
                />
                <Play className="absolute h-4 w-4 text-white drop-shadow" fill="white" />
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-foreground">{ex.name}</span>
                  <span className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">
                    {ex.category === "posture" ? "وضعية" : "إطالة"}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{ex.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {active && (
        <ExerciseModal
          exercise={active}
          onClose={() => setActive(null)}
          onComplete={() => {
            if (!log.workoutsDone.includes(active.id)) toggleDone(active.id);
            setActive(null);
          }}
        />
      )}
    </SectionCard>
  );
}

function ExerciseModal({
  exercise,
  onClose,
  onComplete,
}: {
  exercise: Exercise;
  onClose: () => void;
  onComplete: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-border bg-card p-6 shadow-glow sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute end-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground"
          aria-label="إغلاق"
        >
          <X className="h-4 w-4" />
        </button>
        <h3 className="text-lg font-bold text-foreground">{exercise.name}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{exercise.description}</p>

        {/* Real video */}
        <div className="my-4 aspect-video w-full overflow-hidden rounded-2xl bg-black">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${exercise.videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={exercise.name}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <ol className="space-y-2">
          {exercise.steps.map((step, i) => (
            <li key={i} className="flex gap-2 text-xs text-foreground">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                {i + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={onComplete}
          className="mt-6 w-full rounded-2xl bg-gradient-primary py-3 text-sm font-bold text-primary-foreground shadow-glow transition-smooth hover:opacity-90"
        >
          تم الإنجاز ✓
        </button>
      </div>
    </div>
  );
}

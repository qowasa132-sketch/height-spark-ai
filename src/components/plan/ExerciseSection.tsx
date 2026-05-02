import { Dumbbell, Check } from "lucide-react";
import { SectionCard, ProgressBar } from "./SectionCard";
import { RewardGate } from "@/components/RewardGate";
import type { DailyLog } from "@/lib/dailyLog";
import wallAngelVideo from "../../../public/exercises/wall-angel.mp4.asset.json";
import chinTuckVideo from "../../../public/exercises/chin-tuck.mp4.asset.json";
import catCowVideo from "../../../public/exercises/cat-cow.mp4.asset.json";
import hangVideo from "../../../public/exercises/hang.mp4.asset.json";
import cobraVideo from "../../../public/exercises/cobra.mp4.asset.json";
import childPoseVideo from "../../../public/exercises/child-pose.mp4.asset.json";

interface Exercise {
  id: string;
  name: string;
  category: "posture" | "stretch";
  durationSec: number;
  description: string;
  videoUrl: string;
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
    videoUrl: wallAngelVideo.url,
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
    videoUrl: chinTuckVideo.url,
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
    videoUrl: catCowVideo.url,
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
    videoUrl: hangVideo.url,
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
    videoUrl: cobraVideo.url,
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
    videoUrl: childPoseVideo.url,
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
      <div className="space-y-4">
        {EXERCISES.map((ex) => {
          const isDone = log.workoutsDone.includes(ex.id);
          return (
            <div
              key={ex.id}
              className={`overflow-hidden rounded-2xl border-2 transition-smooth ${
                isDone ? "border-primary bg-primary/10" : "border-border bg-background/40"
              }`}
            >
              {/* Header */}
              <div className="flex items-center gap-2 p-3">
                <RewardGate actionName={`mark "${ex.name}" as done`} onReward={() => toggleDone(ex.id)}>
                  <button
                    type="button"
                    aria-label={isDone ? "إلغاء" : "تم"}
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 transition-smooth ${
                      isDone ? "border-primary bg-primary text-primary-foreground" : "border-border"
                    }`}
                  >
                    {isDone && <Check className="h-4 w-4" strokeWidth={3} />}
                  </button>
                </RewardGate>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-foreground">{ex.name}</span>
                    <span className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] text-muted-foreground">
                      {ex.category === "posture" ? "وضعية" : "إطالة"}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{ex.description}</p>
                </div>
              </div>

              {/* Inline video */}
              <div className="aspect-video w-full overflow-hidden bg-black">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${ex.videoId}?rel=0&modestbranding=1&playsinline=1`}
                  title={ex.name}
                  loading="lazy"
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Steps */}
              <ol className="space-y-2 px-3 pt-3 pb-3">
                {ex.steps.map((step, i) => (
                  <li key={i} className="flex gap-2 text-xs text-foreground">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

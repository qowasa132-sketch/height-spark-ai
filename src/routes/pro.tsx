import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Sparkles, Lock,
  Brain, Dumbbell, ChefHat, MessageCircle,
  ScanLine, Dna, Activity, Camera,
  Wind, Pill,
  TrendingUp,
} from "lucide-react";
import { BottomTabs } from "@/components/BottomTabs";
import { SectionCard } from "@/components/plan/SectionCard";
import { loadProfile } from "@/lib/profile";

import { CoachChat } from "@/components/pro/CoachChat";
import { PostureAnalyzer } from "@/components/pro/PostureAnalyzer";
import { NutritionAI } from "@/components/pro/NutritionAI";
import { WorkoutLibrary } from "@/components/pro/WorkoutLibrary";
import { XRayInsight } from "@/components/pro/XRayInsight";
import { GeneticReport } from "@/components/pro/GeneticReport";
import { CorrectiveExercises } from "@/components/pro/CorrectiveExercises";
import { FlexibilityProgram } from "@/components/pro/FlexibilityProgram";
import { SupplementsAdvisor } from "@/components/pro/SupplementsAdvisor";
import { AdvancedAnalytics } from "@/components/pro/AdvancedAnalytics";

export const Route = createFileRoute("/pro")({
  component: ProPage,
  head: () => ({ meta: [{ title: "برو — هايت بوست" }] }),
});

type TabId = "analysis" | "plans" | "tracking" | "coach";

const TABS: { id: TabId; label: string; icon: typeof Brain }[] = [
  { id: "analysis", label: "التحليل", icon: Brain },
  { id: "plans", label: "الخطط", icon: ChefHat },
  { id: "tracking", label: "التتبع", icon: TrendingUp },
  { id: "coach", label: "الكوتش", icon: MessageCircle },
];

function ProPage() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [tab, setTab] = useState<TabId>("analysis");

  useEffect(() => {
    const p = loadProfile();
    if (!p.completedAt) { navigate({ to: "/" }); return; }
    setIsPremium(!!p.isPremium);
    setMounted(true);
  }, [navigate]);

  if (!mounted) return <main className="min-h-screen bg-background pb-24"><BottomTabs active="ai" /></main>;

  if (!isPremium) {
    return (
      <main className="relative min-h-screen bg-background pb-24">
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-glow opacity-40 pointer-events-none" />
        <div className="relative mx-auto max-w-md px-5 pt-8">
          <h1 className="text-2xl font-bold text-foreground glow-text">برو</h1>
          <p className="mt-1 text-sm text-muted-foreground">منصة كاملة لتسريع نموك بالذكاء الاصطناعي.</p>

          <div className="mt-6 space-y-2.5">
            <FeaturePeek icon={<ScanLine className="h-5 w-5" />} title="تحليل صور العظام (X-Ray)" desc="ارفع صورة أشعة وتعرّف على عمر عظامك وحالة صفائح النمو." />
            <FeaturePeek icon={<Dna className="h-5 w-5" />} title="تقرير الجينات vs نمط الحياة" desc="كم سنتيمتراً من جيناتك؟ وكم تستطيع كسبه بعاداتك؟" />
            <FeaturePeek icon={<Brain className="h-5 w-5" />} title="توقع نمو AI متقدم" desc="خوارزميات تحلل بياناتك لتوقع طولك النهائي بدقة." />
            <FeaturePeek icon={<Camera className="h-5 w-5" />} title="تحليل الوضعية بالصورة" desc="تقييم زوايا جسمك من صورة جانبية + تمارين تصحيحية." />
            <FeaturePeek icon={<Activity className="h-5 w-5" />} title="تمارين تصحيحية للوضعية" desc="خطط للحدبة، تقوّس الظهر، ميلان الحوض. حتى +٥سم ظاهري." />
            <FeaturePeek icon={<Wind className="h-5 w-5" />} title="برامج المرونة وتحرير العمود" desc="روتينات إطالة وتفتيح للورك والظهر." />
            <FeaturePeek icon={<ChefHat className="h-5 w-5" />} title="خطط تغذية ووصفات مخصصة" desc="وجبات يومية حسب تفضيلاتك وحساسياتك." />
            <FeaturePeek icon={<Pill className="h-5 w-5" />} title="مكملات موصى بها لك" desc="جرعات وتوقيتات مخصصة بناءً على بياناتك." />
            <FeaturePeek icon={<TrendingUp className="h-5 w-5" />} title="تحليلات النمو المتقدمة" desc="رسم سرعة النمو + تنبيهات طفرات النمو." />
            <FeaturePeek icon={<Dumbbell className="h-5 w-5" />} title="مكتبة تمارين + تحميل تدريجي" desc="فيديوهات بقيادة مدربين + تتبع تقدمك." />
            <FeaturePeek icon={<MessageCircle className="h-5 w-5" />} title="كوتش AI ٢٤/٧" desc="محادثة ذكية تجاوب على كل أسئلتك." />
          </div>

          <button
            onClick={() => navigate({ to: "/paywall" })}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-primary py-4 text-base font-semibold text-primary-foreground shadow-glow transition-smooth active:scale-[0.98]"
          >
            <Sparkles className="h-5 w-5" />
            افتح برو الآن
          </button>
        </div>
        <BottomTabs active="ai" />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-background pb-24">
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-glow opacity-40 pointer-events-none" />
      <div className="relative mx-auto max-w-md px-5 pt-8">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-foreground glow-text">برو</h1>
          <span className="rounded-full bg-gradient-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">PRO</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">منصتك الذكية المخصصة لك.</p>

        {/* Tabs */}
        <div className="sticky top-2 z-10 mt-5 -mx-1 grid grid-cols-4 gap-1 rounded-2xl border border-border bg-card/80 p-1 backdrop-blur-md">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex flex-col items-center justify-center gap-0.5 rounded-xl py-2 text-[10px] font-semibold transition-smooth ${
                  active ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {tab === "analysis" && (
          <>
            <SectionCard icon={<ScanLine className="h-5 w-5" />} title="تحليل صور العظام (X-Ray)" hint="عمر العظام + صفائح النمو.">
              <XRayInsight />
            </SectionCard>
            <SectionCard icon={<Dna className="h-5 w-5" />} title="تقرير الجينات vs نمط الحياة" hint="من أين يأتي طولك؟">
              <GeneticReport />
            </SectionCard>
            <SectionCard icon={<Camera className="h-5 w-5" />} title="تحليل الوضعية" hint="ارفع صورة جانبية كاملة الجسم.">
              <PostureAnalyzer />
            </SectionCard>
          </>
        )}

        {tab === "plans" && (
          <>
            <SectionCard icon={<ChefHat className="h-5 w-5" />} title="تغذية بالذكاء الاصطناعي" hint="وجبات ووصفات مخصصة.">
              <NutritionAI />
            </SectionCard>
            <SectionCard icon={<Pill className="h-5 w-5" />} title="مكملات موصى بها لك" hint="جرعات وتوقيتات مخصصة.">
              <SupplementsAdvisor />
            </SectionCard>
            <SectionCard icon={<Activity className="h-5 w-5" />} title="تمارين تصحيحية للوضعية" hint="حدبة، تقوّس، ميلان الحوض.">
              <CorrectiveExercises />
            </SectionCard>
            <SectionCard icon={<Wind className="h-5 w-5" />} title="مرونة وتحرير العمود" hint="إطالات يومية لقامة أطول.">
              <FlexibilityProgram />
            </SectionCard>
            <SectionCard icon={<Dumbbell className="h-5 w-5" />} title="مكتبة التمارين الكاملة" hint="فيديوهات + تتبع تقدمك.">
              <WorkoutLibrary />
            </SectionCard>
          </>
        )}

        {tab === "tracking" && (
          <SectionCard icon={<TrendingUp className="h-5 w-5" />} title="تحليلات النمو المتقدمة" hint="سرعة النمو + تنبيهات الطفرات.">
            <AdvancedAnalytics />
          </SectionCard>
        )}

        {tab === "coach" && (
          <SectionCard icon={<MessageCircle className="h-5 w-5" />} title="كوتش الطول AI" hint="اسأل أي شيء يخص رحلتك.">
            <CoachChat />
          </SectionCard>
        )}
      </div>
      <BottomTabs active="ai" />
    </main>
  );
}

function FeaturePeek({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-card/60 p-3 backdrop-blur-md">
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
        {icon}
        <Lock className="absolute -bottom-1 -end-1 h-3.5 w-3.5 rounded-full bg-card p-0.5 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

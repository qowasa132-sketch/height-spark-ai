import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, MessageCircle, Camera, ChefHat, Dumbbell, Lock } from "lucide-react";
import { BottomTabs } from "@/components/BottomTabs";
import { SectionCard } from "@/components/plan/SectionCard";
import { loadProfile } from "@/lib/profile";
import { CoachChat } from "@/components/pro/CoachChat";
import { PostureAnalyzer } from "@/components/pro/PostureAnalyzer";
import { NutritionAI } from "@/components/pro/NutritionAI";
import { WorkoutLibrary } from "@/components/pro/WorkoutLibrary";

export const Route = createFileRoute("/pro")({
  component: ProPage,
  head: () => ({ meta: [{ title: "برو AI — هايت بوست" }] }),
});

function ProPage() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

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
          <h1 className="text-2xl font-bold text-foreground glow-text">برو AI</h1>
          <p className="mt-1 text-sm text-muted-foreground">مميزات الذكاء الاصطناعي المتقدمة لتسريع نموك.</p>

          <div className="mt-8 space-y-3">
            <FeaturePeek icon={<MessageCircle className="h-5 w-5" />} title="كوتش الطول الذكي" desc="محادثة AI ٢٤/٧ تجاوب على أسئلتك بناءً على بياناتك." />
            <FeaturePeek icon={<Camera className="h-5 w-5" />} title="تحليل الوضعية بالصورة" desc="ارفع صورة جانبية واحصل على تقييم وتمارين تصحيحية." />
            <FeaturePeek icon={<ChefHat className="h-5 w-5" />} title="خطط تغذية ومكملات مخصصة" desc="وجبات يومية ومكملات بناءً على تفضيلاتك وحساسياتك." />
            <FeaturePeek icon={<Dumbbell className="h-5 w-5" />} title="مكتبة فيديوهات تمارين" desc="تمارين بقيادة مدربين + تتبع تدريجي للتقدم." />
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
          <h1 className="text-2xl font-bold text-foreground glow-text">برو AI</h1>
          <span className="rounded-full bg-gradient-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">PRO</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">مميزات الذكاء الاصطناعي المخصصة لك.</p>

        <SectionCard icon={<MessageCircle className="h-5 w-5" />} title="كوتش الطول" hint="اسأل أي شيء يخص رحلتك.">
          <CoachChat />
        </SectionCard>

        <SectionCard icon={<Camera className="h-5 w-5" />} title="تحليل الوضعية" hint="ارفع صورة جانبية كاملة الجسم.">
          <PostureAnalyzer />
        </SectionCard>

        <SectionCard icon={<ChefHat className="h-5 w-5" />} title="تغذية ومكملات بالذكاء الاصطناعي" hint="مخصصة بناءً على بياناتك.">
          <NutritionAI />
        </SectionCard>

        <SectionCard icon={<Dumbbell className="h-5 w-5" />} title="مكتبة التمارين" hint="فيديوهات بقيادة مدربين + تتبع تقدمك.">
          <WorkoutLibrary />
        </SectionCard>
      </div>
      <BottomTabs active="ai" />
    </main>
  );
}

function FeaturePeek({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-md">
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

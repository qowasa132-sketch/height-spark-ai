// Personalized supplement recommendations based on profile + lifestyle signals
import { useMemo } from "react";
import { Pill, AlertTriangle } from "lucide-react";
import { loadProfile } from "@/lib/profile";

interface Supplement {
  name: string;
  dose: string;
  why: string;
  priority: "أساسي" | "موصى به" | "اختياري";
  timing: string;
}

function recommend(): { items: Supplement[]; notes: string[] } {
  const p = loadProfile();
  const items: Supplement[] = [];
  const notes: string[] = [];

  // Core stack (everyone trying to grow benefits)
  items.push({
    name: "فيتامين D3",
    dose: "٢٠٠٠–٤٠٠٠ IU يومياً",
    why: "ضروري لامتصاص الكالسيوم وصحة العظام. نقصه شائع جداً.",
    priority: "أساسي",
    timing: "صباحاً مع وجبة دهنية",
  });
  items.push({
    name: "الكالسيوم",
    dose: "١٠٠٠–١٣٠٠ ملغ يومياً (موزّع)",
    why: "اللبنة الأساسية للعظام أثناء النمو.",
    priority: "أساسي",
    timing: "جرعتين مع الوجبات",
  });
  items.push({
    name: "الزنك",
    dose: "١٥–٢٥ ملغ يومياً",
    why: "ضروري لإفراز هرمون النمو وانقسام الخلايا.",
    priority: "أساسي",
    timing: "مساءً قبل النوم",
  });
  items.push({
    name: "المغنيسيوم (Glycinate)",
    dose: "٣٠٠–٤٠٠ ملغ مساءً",
    why: "يحسّن النوم العميق حيث يُفرز هرمون النوم بكثافة.",
    priority: "موصى به",
    timing: "قبل النوم بساعة",
  });

  if (p.workout === "moderate" || p.workout === "heavy") {
    items.push({
      name: "بروتين Whey",
      dose: "٢٥–٣٠غ بعد التمرين",
      why: "نشاطك العالي يرفع حاجتك للبروتين لبناء العظم والعضل.",
      priority: "موصى به",
      timing: "خلال ٣٠ دقيقة بعد التمرين",
    });
  }

  if (p.sleepHours != null && p.sleepHours < 7) {
    items.push({
      name: "Melatonin",
      dose: "٠.٥–١ ملغ قبل النوم بـ٣٠ دقيقة",
      why: "نومك أقل من المثالي — جرعة صغيرة قد تساعد على النوم العميق.",
      priority: "اختياري",
      timing: "قبل النوم بـ٣٠ دقيقة",
    });
    notes.push("⚠️ Melatonin مكمل قوي. ابدأ بأقل جرعة واستشر طبيباً للاستخدام المستمر.");
  }

  // Vegetarian/limited diet hint via acne
  if (p.acne === "frequent") {
    items.push({
      name: "Omega-3 (EPA/DHA)",
      dose: "١٠٠٠–٢٠٠٠ ملغ يومياً",
      why: "يقلل الالتهاب الذي قد يساهم في حب الشباب ويدعم الصحة العامة.",
      priority: "موصى به",
      timing: "مع وجبة",
    });
  }

  if (p.age && p.age < 18) {
    items.push({
      name: "Multivitamin للمراهقين",
      dose: "حصة واحدة يومياً",
      why: "يغطي ثغرات صغيرة في النظام الغذائي خلال طفرة النمو.",
      priority: "موصى به",
      timing: "مع الإفطار",
    });
  }

  notes.push("🩺 هذه التوصيات تعليمية. استشر طبيباً قبل البدء بأي مكمل، خاصة إذا كنت تتناول أدوية أو لديك حالة طبية.");

  return { items, notes };
}

const PRIORITY_STYLES: Record<Supplement["priority"], string> = {
  "أساسي": "bg-primary/15 text-primary",
  "موصى به": "bg-chart-4/15 text-chart-4",
  "اختياري": "bg-muted text-muted-foreground",
};

export function SupplementsAdvisor() {
  const { items, notes } = useMemo(() => recommend(), []);

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        توصيات مخصصة لك بناءً على عمرك، نشاطك، نومك، وعلامات نظامك الغذائي.
      </p>

      <div className="space-y-2">
        {items.map((s, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card/60 p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <Pill className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <div className="text-sm font-bold text-foreground">{s.name}</div>
                  <div className="text-[11px] text-muted-foreground">{s.dose}</div>
                </div>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${PRIORITY_STYLES[s.priority]}`}>
                {s.priority}
              </span>
            </div>
            <p className="mt-2 text-xs text-foreground">{s.why}</p>
            <p className="mt-1 text-[10px] text-muted-foreground">⏱ {s.timing}</p>
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        {notes.map((n, i) => (
          <div key={i} className="flex items-start gap-2 rounded-lg bg-muted/40 p-2 text-[10px] text-muted-foreground">
            <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
            <span>{n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

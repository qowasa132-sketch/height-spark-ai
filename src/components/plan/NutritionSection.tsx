import { useEffect, useRef, useState } from "react";
import { Apple, Search, Plus, Trash2, X, Camera, Droplets, Scale, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SectionCard, ProgressBar, Stat } from "./SectionCard";
import {
  type DailyLog,
  type FoodEntry,
  nutritionTotals,
} from "@/lib/dailyLog";
import { lookupBarcode } from "@/lib/foodDb";
import { lookupFoodAI, type AIFood } from "@/lib/aiFood";
import { loadProfile, saveProfile } from "@/lib/profile";

interface Props {
  log: DailyLog;
  update: (patch: Partial<DailyLog>) => void;
}

const GOAL_CAL = 2400;
const GOAL_PROTEIN = 90; // g
const GOAL_CALCIUM = 1300; // mg (teen requirement)
const GOAL_VIT_D = 600; // IU
const GOAL_WATER = 2000; // ml

export function NutritionSection({ log, update }: Props) {
  const [foodOpen, setFoodOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [weightOpen, setWeightOpen] = useState(false);

  const totals = nutritionTotals(log);

  const addFood = (entry: FoodEntry) => {
    update({ foods: [...log.foods, entry] });
    toast.success(`أُضيف ${entry.name}`);
  };
  const removeFood = (id: string) => {
    update({ foods: log.foods.filter((f) => f.id !== id) });
  };

  const addWater = (delta: number) => {
    const next = Math.max(0, Math.min(5000, log.waterMl + delta));
    update({ waterMl: next });
  };

  return (
    <>
      <SectionCard
        icon={<Apple className="h-5 w-5" />}
        title="التغذية"
        hint="تتبّع السعرات والبروتين والكالسيوم وفيتامين د"
      >
        {/* Macros grid */}
        <div className="grid grid-cols-4 gap-1.5">
          <Stat label="سعرات" value={Math.round(totals.calories)} />
          <Stat label="بروتين" value={Math.round(totals.proteinG)} suffix="غ" />
          <Stat label="كالسيوم" value={Math.round(totals.calciumMg)} suffix="مغ" />
          <Stat label="فيتامين د" value={Math.round(totals.vitaminDIu)} suffix="و.د" />
        </div>
        <div className="mt-3 space-y-1.5">
          <MiniBar label="السعرات" value={totals.calories} goal={GOAL_CAL} />
          <MiniBar label="البروتين" value={totals.proteinG} goal={GOAL_PROTEIN} />
          <MiniBar label="الكالسيوم" value={totals.calciumMg} goal={GOAL_CALCIUM} />
          <MiniBar label="فيتامين د" value={totals.vitaminDIu} goal={GOAL_VIT_D} />
        </div>

        {/* Add buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setFoodOpen(true)}
            className="flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-primary py-2.5 text-xs font-bold text-primary-foreground shadow-glow"
          >
            <Search className="h-3.5 w-3.5" /> إضافة بالكتابة
          </button>
          <button
            type="button"
            onClick={() => setScannerOpen(true)}
            className="flex items-center justify-center gap-1.5 rounded-2xl border-2 border-primary/40 bg-card py-2.5 text-xs font-bold text-foreground"
          >
            <Camera className="h-3.5 w-3.5" /> مسح باركود
          </button>
        </div>

        {/* Today's foods */}
        {log.foods.length > 0 && (
          <ul className="mt-4 space-y-1.5">
            {log.foods.map((f) => (
              <li
                key={f.id}
                className="flex items-center justify-between rounded-xl border border-border bg-background/40 px-3 py-2 text-xs"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold text-foreground">{f.name}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {f.grams}غ · {Math.round(f.calories)} سعرة · {Math.round(f.proteinG)}غ بروتين
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFood(f.id)}
                  className="ms-2 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  aria-label="حذف"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      {/* Water */}
      <SectionCard
        icon={<Droplets className="h-5 w-5" />}
        title="الماء"
        hint="الترطيب أساس النمو والمفاصل"
        right={<span className="text-[10px] text-muted-foreground">{log.waterMl} / {GOAL_WATER} مل</span>}
      >
        <ProgressBar value={(log.waterMl / GOAL_WATER) * 100} />
        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => addWater(-250)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground"
            aria-label="-250"
          >
            −
          </button>
          <div className="flex-1 grid grid-cols-3 gap-1.5">
            {[250, 500, 1000].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => addWater(v)}
                className="rounded-xl border-2 border-primary/40 bg-card py-2 text-xs font-bold text-foreground transition-smooth hover:bg-primary/10"
              >
                +{v} مل
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addWater(250)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary font-bold text-primary-foreground shadow-glow"
            aria-label="+250"
          >
            +
          </button>
        </div>
      </SectionCard>

      {/* BMI + Weight */}
      <SectionCard
        icon={<Scale className="h-5 w-5" />}
        title="الوزن ومؤشر كتلة الجسم"
        hint="تتبّع أسبوعي يساعد في تقييم النمو"
        right={
          <button
            type="button"
            onClick={() => setWeightOpen(true)}
            className="flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-bold text-primary"
          >
            <Plus className="h-3 w-3" /> تسجيل
          </button>
        }
      >
        <BmiCard log={log} />
      </SectionCard>

      {foodOpen && <FoodSearchModal onClose={() => setFoodOpen(false)} onAdd={addFood} />}
      {scannerOpen && <BarcodeScannerModal onClose={() => setScannerOpen(false)} onAdd={addFood} />}
      {weightOpen && <WeightModal log={log} update={update} onClose={() => setWeightOpen(false)} />}
    </>
  );
}

function MiniBar({ label, value, goal }: { label: string; value: number; goal: number }) {
  const pct = Math.min(100, (value / goal) * 100);
  return (
    <div>
      <div className="mb-0.5 flex justify-between text-[10px] text-muted-foreground">
        <span>{label}</span>
        <span>
          {Math.round(value)} / {goal}
        </span>
      </div>
      <ProgressBar value={pct} />
    </div>
  );
}

function BmiCard({ log }: { log: DailyLog }) {
  const profile = loadProfile();
  const weight = log.weightKg ?? profile.weightKg;
  const height = profile.heightCm;
  if (!weight || !height) {
    return <p className="text-xs text-muted-foreground">أكمل ملفك الشخصي لحساب مؤشر كتلة الجسم.</p>;
  }
  const m = height / 100;
  const bmi = weight / (m * m);
  let label = "طبيعي";
  let color = "text-primary";
  if (bmi < 18.5) {
    label = "نقص وزن";
    color = "text-chart-4";
  } else if (bmi >= 25 && bmi < 30) {
    label = "زيادة وزن";
    color = "text-chart-4";
  } else if (bmi >= 30) {
    label = "سمنة";
    color = "text-destructive";
  }
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <div className={`text-3xl font-bold glow-text ${color}`}>{bmi.toFixed(1)}</div>
        <div className={`text-xs font-semibold ${color}`}>{label}</div>
      </div>
      <div className="text-end text-[11px] text-muted-foreground">
        <div>الوزن: <span className="text-foreground">{weight} كغ</span></div>
        <div className="mt-0.5">الطول: <span className="text-foreground">{height} سم</span></div>
      </div>
    </div>
  );
}

// ---------- AI Food search modal ----------
function FoodSearchModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (entry: FoodEntry) => void;
}) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [picked, setPicked] = useState<AIFood | null>(null);
  const [grams, setGrams] = useState(100);

  const search = async () => {
    const query = q.trim();
    if (!query) return;
    setLoading(true);
    setErr(null);
    try {
      const food = await lookupFoodAI(query);
      setPicked(food);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "خطأ";
      setErr(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const commit = () => {
    if (!picked) return;
    const factor = grams / 100;
    onAdd({
      id: `ai-${Date.now()}`,
      name: picked.name,
      grams,
      calories: picked.caloriesPer100g * factor,
      proteinG: picked.proteinG * factor,
      calciumMg: picked.calciumMg * factor,
      vitaminDIu: picked.vitaminDIu * factor,
    });
    onClose();
  };

  return (
    <ModalShell onClose={onClose} title="إضافة طعام">
      {!picked ? (
        <>
          <div className="mb-3 flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-2 text-[11px] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>مدعوم بالذكاء الاصطناعي — اكتب أي طعام تريده</span>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              search();
            }}
            className="relative"
          >
            <Search className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="مثال: كبسة دجاج، شاورما، تفاح…"
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 pe-10 text-sm text-foreground outline-none focus:border-primary"
            />
          </form>
          <button
            type="button"
            onClick={search}
            disabled={loading || !q.trim()}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-primary py-3 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> جارٍ البحث…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> ابحث بالذكاء الاصطناعي
              </>
            )}
          </button>
          {err && <p className="mt-3 text-center text-xs text-destructive">{err}</p>}
          <p className="mt-4 text-center text-[10px] text-muted-foreground">
            يمكن البحث عن أي طعام حرفياً — أطباق عربية، عالمية، منتجات تجارية…
          </p>
        </>
      ) : (
        <ServingPicker
          name={picked.name}
          per100={{
            calories: picked.caloriesPer100g,
            proteinG: picked.proteinG,
            calciumMg: picked.calciumMg,
            vitaminDIu: picked.vitaminDIu,
          }}
          grams={grams}
          setGrams={setGrams}
          onBack={() => setPicked(null)}
          onAdd={commit}
        />
      )}
    </ModalShell>
  );
}

function ServingPicker({
  name,
  per100,
  grams,
  setGrams,
  onBack,
  onAdd,
}: {
  name: string;
  per100: { calories: number; proteinG: number; calciumMg: number; vitaminDIu: number };
  grams: number;
  setGrams: (g: number) => void;
  onBack: () => void;
  onAdd: () => void;
}) {
  const f = grams / 100;
  return (
    <div>
      <button type="button" onClick={onBack} className="mb-2 text-xs text-muted-foreground">
        ← رجوع
      </button>
      <h4 className="text-base font-bold text-foreground">{name}</h4>
      <label className="mt-4 block">
        <span className="text-xs text-muted-foreground">الكمية (غرام)</span>
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setGrams(Math.max(10, grams - 25))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground"
          >
            −
          </button>
          <input
            type="number"
            min={10}
            max={2000}
            value={grams}
            onChange={(e) => setGrams(Math.max(10, Math.min(2000, Number(e.target.value) || 0)))}
            className="flex-1 rounded-2xl border border-border bg-background px-4 py-2 text-center text-lg font-bold text-foreground outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={() => setGrams(Math.min(2000, grams + 25))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground"
          >
            +
          </button>
        </div>
      </label>
      <div className="mt-4 grid grid-cols-4 gap-1.5">
        <Stat label="سعرات" value={Math.round(per100.calories * f)} />
        <Stat label="بروتين" value={Math.round(per100.proteinG * f)} suffix="غ" />
        <Stat label="كالسيوم" value={Math.round(per100.calciumMg * f)} suffix="مغ" />
        <Stat label="فيتامين د" value={Math.round(per100.vitaminDIu * f)} suffix="و.د" />
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="mt-6 w-full rounded-2xl bg-gradient-primary py-3 text-sm font-bold text-primary-foreground shadow-glow"
      >
        أضف للمذكرة
      </button>
    </div>
  );
}

// ---------- Barcode scanner modal ----------
function BarcodeScannerModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (entry: FoodEntry) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(true);
  const [result, setResult] = useState<{ name: string; per100: { calories: number; proteinG: number; calciumMg: number; vitaminDIu: number } } | null>(null);
  const [grams, setGrams] = useState(100);
  const [manualCode, setManualCode] = useState("");

  useEffect(() => {
    if (!scanning) return;
    let controls: { stop: () => void } | null = null;
    let cancelled = false;

    (async () => {
      try {
        const { BrowserMultiFormatReader } = await import("@zxing/browser");
        const reader = new BrowserMultiFormatReader();
        controls = await reader.decodeFromVideoDevice(undefined, videoRef.current!, async (res) => {
          if (cancelled || !res) return;
          const code = res.getText();
          controls?.stop();
          await handleCode(code);
        });
      } catch (e) {
        setError("لا يمكن الوصول إلى الكاميرا. أدخل الرمز يدوياً.");
      }
    })();

    return () => {
      cancelled = true;
      controls?.stop();
    };
  }, [scanning]);

  const handleCode = async (code: string) => {
    setScanning(false);
    const off = await lookupBarcode(code);
    if (!off) {
      toast.error(`لم نجد المنتج (${code})`);
      setScanning(true);
      return;
    }
    setResult({
      name: off.name,
      per100: {
        calories: off.caloriesPer100g,
        proteinG: off.proteinG,
        calciumMg: off.calciumMg,
        vitaminDIu: off.vitaminDIu,
      },
    });
  };

  const commit = () => {
    if (!result) return;
    const f = grams / 100;
    onAdd({
      id: `barcode-${Date.now()}`,
      name: result.name,
      grams,
      calories: result.per100.calories * f,
      proteinG: result.per100.proteinG * f,
      calciumMg: result.per100.calciumMg * f,
      vitaminDIu: result.per100.vitaminDIu * f,
    });
    onClose();
  };

  return (
    <ModalShell onClose={onClose} title="مسح الباركود">
      {!result ? (
        <>
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-black">
            <video ref={videoRef} className="h-full w-full object-cover" autoPlay playsInline muted />
            <div className="pointer-events-none absolute inset-8 rounded-2xl border-2 border-primary/80 shadow-glow" />
          </div>
          {error && <p className="mt-3 text-center text-xs text-destructive">{error}</p>}
          <div className="mt-4 flex gap-2">
            <input
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value.replace(/\D/g, ""))}
              placeholder="أدخل الرمز يدوياً"
              className="flex-1 rounded-2xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            />
            <button
              type="button"
              disabled={manualCode.length < 6}
              onClick={() => handleCode(manualCode)}
              className="rounded-2xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground disabled:opacity-40"
            >
              بحث
            </button>
          </div>
        </>
      ) : (
        <ServingPicker
          name={result.name}
          per100={result.per100}
          grams={grams}
          setGrams={setGrams}
          onBack={() => {
            setResult(null);
            setScanning(true);
          }}
          onAdd={commit}
        />
      )}
    </ModalShell>
  );
}

// ---------- Weight modal ----------
function WeightModal({
  log,
  update,
  onClose,
}: {
  log: DailyLog;
  update: (patch: Partial<DailyLog>) => void;
  onClose: () => void;
}) {
  const profile = loadProfile();
  const [weight, setWeight] = useState<number>(log.weightKg ?? profile.weightKg ?? 60);
  const commit = () => {
    update({ weightKg: weight });
    saveProfile({ ...profile, weightKg: weight });
    toast.success("تم تسجيل وزنك");
    onClose();
  };
  return (
    <ModalShell onClose={onClose} title="تسجيل الوزن">
      <div className="my-4 text-center">
        <div className="text-5xl font-bold text-primary glow-text">{weight}</div>
        <div className="mt-1 text-xs text-muted-foreground">كيلوغرام</div>
      </div>
      <input
        type="range"
        min={20}
        max={150}
        step={0.5}
        value={weight}
        onChange={(e) => setWeight(Number(e.target.value))}
        className="w-full accent-[var(--primary)]"
      />
      <button
        type="button"
        onClick={commit}
        className="mt-6 w-full rounded-2xl bg-gradient-primary py-3 text-sm font-bold text-primary-foreground shadow-glow"
      >
        حفظ
      </button>
    </ModalShell>
  );
}

// ---------- Modal shell ----------
function ModalShell({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-border bg-card p-5 shadow-glow sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground"
            aria-label="إغلاق"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

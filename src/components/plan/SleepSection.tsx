import { Moon } from "lucide-react";
import { SectionCard, ProgressBar } from "./SectionCard";
import { loadLogHistory, type DailyLog } from "@/lib/dailyLog";

interface Props {
  log: DailyLog;
  update: (patch: Partial<DailyLog>) => void;
}

const GOAL = 8;

export function SleepSection({ log, update }: Props) {
  const hours = log.sleepHours ?? 0;
  const history = loadLogHistory(7);
  const avg = history.length
    ? history.reduce((a, l) => a + (l.sleepHours ?? 0), 0) / history.length
    : 0;

  return (
    <SectionCard
      icon={<Moon className="h-5 w-5" />}
      title="النوم"
      hint="٨+ ساعات تطلق هرمون النمو في النوم العميق"
      right={<span className="text-[10px] text-muted-foreground">الهدف: {GOAL} ساعات</span>}
    >
      <div className="flex items-baseline justify-center gap-2 py-2">
        <span className="text-5xl font-bold text-primary glow-text">{hours}</span>
        <span className="text-base text-muted-foreground">ساعة</span>
      </div>
      <input
        type="range"
        min={4}
        max={12}
        step={0.5}
        value={hours}
        onChange={(e) => update({ sleepHours: Number(e.target.value) })}
        className="w-full accent-[var(--primary)]"
      />
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        <span>٤س</span>
        <span>٨س</span>
        <span>١٢س</span>
      </div>

      <ProgressBar value={(hours / GOAL) * 100} />

      <div className="mt-4 grid grid-cols-2 gap-2">
        <label className="block">
          <span className="text-[10px] text-muted-foreground">وقت النوم</span>
          <input
            type="time"
            value={log.bedtime ?? ""}
            onChange={(e) => update({ bedtime: e.target.value })}
            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          />
        </label>
        <label className="block">
          <span className="text-[10px] text-muted-foreground">الاستيقاظ</span>
          <input
            type="time"
            value={log.wakeTime ?? ""}
            onChange={(e) => update({ wakeTime: e.target.value })}
            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          />
        </label>
      </div>

      {history.length > 1 && (
        <div className="mt-4 rounded-2xl border border-border bg-background/40 p-3">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>متوسط آخر ٧ أيام</span>
            <span className="font-bold text-foreground">{avg.toFixed(1)} ساعة</span>
          </div>
          <div className="mt-2 flex h-12 items-end gap-1">
            {history.slice().reverse().map((l, i) => {
              const h = l.sleepHours ?? 0;
              const pct = Math.min(100, (h / 12) * 100);
              return (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-gradient-primary opacity-80"
                  style={{ height: `${Math.max(4, pct)}%` }}
                  title={`${l.date}: ${h}س`}
                />
              );
            })}
          </div>
        </div>
      )}
    </SectionCard>
  );
}

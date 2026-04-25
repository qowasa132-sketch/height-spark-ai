import { X, Trophy } from "lucide-react";
import { BADGES, loadEarnedBadges } from "@/lib/badges";

export function BadgesDrawer({ onClose }: { onClose: () => void }) {
  const earned = new Set(loadEarnedBadges());
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-border bg-card p-5 shadow-glow sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">إنجازاتي</h3>
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
              {earned.size} / {BADGES.length}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted"
            aria-label="إغلاق"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <ul className="grid grid-cols-2 gap-2.5">
          {BADGES.map((b) => {
            const got = earned.has(b.id);
            return (
              <li
                key={b.id}
                className={`rounded-2xl border-2 p-3 text-center transition-smooth ${
                  got
                    ? "border-primary bg-primary/10 shadow-glow"
                    : "border-border bg-background/40 opacity-60 grayscale"
                }`}
              >
                <div className="text-3xl">{b.emoji}</div>
                <div className="mt-1 text-xs font-bold text-foreground">{b.name}</div>
                <div className="mt-0.5 text-[10px] leading-tight text-muted-foreground">{b.description}</div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

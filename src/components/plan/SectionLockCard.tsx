import { useState, type ReactNode } from "react";
import { Rocket, Clock, X } from "lucide-react";
import { RewardGate } from "@/components/RewardGate";

interface Props {
  title: string;
  /** The actual section content rendered inside the unlocked modal. */
  children: ReactNode;
  /** Short verb describing the action — used in the reward consent popup. */
  actionName: string;
}

/**
 * Locked hero card shown in the plan page.
 * Tapping the rocket triggers the RewardGate (ad/Pro), then opens the section
 * inside a full-screen modal so the user can interact with it.
 */
export function SectionLockCard({ title, children, actionName }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="relative mt-4 overflow-hidden rounded-3xl border border-border bg-card/60 backdrop-blur-md">
        <div className="flex flex-col items-center px-5 pt-6 pb-8">
          <p className="text-xs text-muted-foreground">سيتم فتحه</p>
          <RewardGate actionName={actionName} onReward={() => setOpen(true)}>
            <button
              type="button"
              className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-foreground/90 px-3 py-1.5 text-xs font-semibold text-background shadow-sm transition-smooth active:scale-[0.97]"
            >
              <Clock className="h-3.5 w-3.5" />
              اضغط للفتح!
            </button>
          </RewardGate>
          <h2 className="mt-3 text-3xl font-bold text-foreground">{title}</h2>

          {/* Glowing rocket */}
          <RewardGate actionName={actionName} onReward={() => setOpen(true)}>
            <button
              type="button"
              aria-label={`فتح قسم ${title}`}
              className="relative my-10 flex h-56 w-56 items-center justify-center transition-smooth active:scale-[0.97]"
            >
              {/* Concentric glow rings */}
              <span className="absolute inset-0 rounded-full bg-primary/5" />
              <span className="absolute inset-6 rounded-full bg-primary/10" />
              <span className="absolute inset-12 rounded-full bg-primary/20 blur-sm" />
              <span className="absolute inset-16 rounded-full bg-primary/40 blur-md animate-pulse" />
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-glow">
                <Rocket className="h-8 w-8 text-primary-foreground" strokeWidth={2.2} />
              </span>
            </button>
          </RewardGate>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-border bg-background p-5 shadow-glow sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute end-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground"
              aria-label="إغلاق"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="pt-2">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}

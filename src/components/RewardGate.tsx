import { useState, type ReactElement, cloneElement, type MouseEvent } from "react";
import { Loader2, Play, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { loadProfile } from "@/lib/profile";
import { showRewardedAd, TEST_REWARDED_AD_UNIT_ID } from "@/lib/admob";

interface RewardGateProps {
  /** Action to run AFTER the user finishes the rewarded ad (or immediately if Pro). */
  onReward: () => void | Promise<void>;
  /** Trigger element (button/link). Its onClick will be wrapped. */
  children: ReactElement<{ onClick?: (e: MouseEvent) => void; disabled?: boolean }>;
  /** Short verb describing the gated action — used in the consent popup. */
  actionName: string;
  /** Override the AdMob Rewarded Ad Unit ID. Defaults to Google's official test ID. */
  adUnitId?: string;
}

type Phase = "idle" | "consent" | "loading" | "error";

/**
 * Policy-compliant Rewarded Ad gate.
 * - Apple Guideline 3.2.2 / Google: explicit opt-in popup with Cancel.
 * - Never auto-plays; never blocks the user on failure.
 * - Triggers ATT request on iOS before AdMob initializes (handled in showRewardedAd).
 * - Only fires onReward after the Rewarded event has been received.
 */
export function RewardGate({
  onReward,
  children,
  actionName,
  adUnitId = TEST_REWARDED_AD_UNIT_ID,
}: RewardGateProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const openConsent = (e: MouseEvent) => {
    e.preventDefault?.();
    e.stopPropagation?.();

    // Pro users skip the ad entirely.
    const profile = loadProfile();
    if (profile.isPremium) {
      void onReward();
      return;
    }
    setErrorMsg("");
    setPhase("consent");
  };

  const cancel = () => {
    setPhase("idle");
    setErrorMsg("");
  };

  const startAd = async () => {
    setPhase("loading");
    const result = await showRewardedAd(adUnitId);

    switch (result.status) {
      case "earned":
        setPhase("idle");
        await onReward();
        break;

      case "unsupported":
        // Web preview / no native AdMob — let the action through for testing.
        setPhase("idle");
        await onReward();
        break;

      case "dismissed":
        setPhase("idle");
        toast.error("Ad not completed", {
          description: "Please watch the full video to unlock this.",
        });
        break;

      case "failed":
        setErrorMsg(
          result.reason === "load"
            ? "No ads available right now. Please try again later."
            : "Something went wrong loading the ad. Please try again later.",
        );
        setPhase("error");
        break;
    }
  };

  const trigger = cloneElement(children, {
    onClick: openConsent,
    disabled: phase === "loading" || children.props.disabled,
  });

  return (
    <>
      {trigger}

      {phase !== "idle" && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-t-3xl border border-border bg-card p-5 shadow-glow sm:rounded-3xl">
            {phase === "consent" && (
              <>
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
                  <Play className="h-5 w-5" />
                </div>
                <h2 className="text-center text-base font-bold text-foreground">
                  Watch a short video to {actionName}?
                </h2>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Free plan users can unlock this by watching a short ad. Upgrade to Pro to skip ads.
                </p>
                <div className="mt-5 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={startAd}
                    className="w-full rounded-2xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth active:scale-[0.98]"
                  >
                    Watch video
                  </button>
                  <button
                    type="button"
                    onClick={cancel}
                    className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-border bg-card py-3 text-sm font-medium text-foreground transition-smooth active:scale-[0.98]"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              </>
            )}

            {phase === "loading" && (
              <div className="flex flex-col items-center gap-3 py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-sm text-foreground">Loading ad…</p>
                <button
                  type="button"
                  onClick={cancel}
                  className="text-xs text-muted-foreground underline"
                >
                  Cancel
                </button>
              </div>
            )}

            {phase === "error" && (
              <>
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <h2 className="text-center text-base font-bold text-foreground">
                  Couldn’t load ad
                </h2>
                <p className="mt-2 text-center text-xs text-muted-foreground">{errorMsg}</p>
                <div className="mt-5 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={startAd}
                    className="w-full rounded-2xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth active:scale-[0.98]"
                  >
                    Try again
                  </button>
                  <button
                    type="button"
                    onClick={cancel}
                    className="w-full rounded-2xl border border-border bg-card py-3 text-sm font-medium text-foreground transition-smooth active:scale-[0.98]"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

import { useState, type ReactElement, cloneElement, type MouseEvent } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { loadProfile } from "@/lib/profile";
import { showRewardedAd, TEST_REWARDED_AD_UNIT_ID } from "@/lib/admob";

interface RewardGateProps {
  /** The action to run AFTER the user finishes the rewarded ad (or immediately if Pro). */
  onReward: () => void | Promise<void>;
  /** Trigger element (button/link). Its onClick will be wrapped. */
  children: ReactElement<{ onClick?: (e: MouseEvent) => void; disabled?: boolean }>;
  /** Override the AdMob Rewarded Ad Unit ID. Defaults to Google's test ID. */
  adUnitId?: string;
  /** Optional loading label shown while the ad is being prepared. */
  loadingLabel?: string;
}

/**
 * Wraps any clickable child. For free-plan users it shows a Rewarded Video Ad
 * and only runs `onReward` once the ad is fully watched. Pro users skip the ad.
 */
export function RewardGate({
  onReward,
  children,
  adUnitId = TEST_REWARDED_AD_UNIT_ID,
  loadingLabel = "Loading ad…",
}: RewardGateProps) {
  const [busy, setBusy] = useState(false);

  const handleClick = async (e: MouseEvent) => {
    e.preventDefault?.();
    e.stopPropagation?.();
    if (busy) return;

    const profile = loadProfile();
    const isPro = !!profile.isPremium;

    // Pro users bypass the ad entirely.
    if (isPro) {
      await onReward();
      return;
    }

    setBusy(true);
    try {
      const earned = await showRewardedAd(adUnitId);
      if (earned) {
        await onReward();
      } else {
        toast.error("Ad not completed", {
          description: "Please watch the full video to unlock this action.",
        });
      }
    } finally {
      setBusy(false);
    }
  };

  const trigger = cloneElement(children, {
    onClick: handleClick,
    disabled: busy || children.props.disabled,
  });

  return (
    <>
      {trigger}
      {busy && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground shadow-glow">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            {loadingLabel}
          </div>
        </div>
      )}
    </>
  );
}

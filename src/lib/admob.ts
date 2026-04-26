// Thin wrapper around @capacitor-community/admob.
// Safe to import on web — falls back to a no-op when not running on a native platform.

import { Capacitor } from "@capacitor/core";

// Official Google test Ad Unit IDs.
export const TEST_REWARDED_AD_UNIT_ID = "ca-app-pub-3940256099942544/5224354917";

let initialized = false;

export function isNative(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

async function ensureInitialized(): Promise<boolean> {
  if (!isNative()) return false;
  if (initialized) return true;
  try {
    const { AdMob } = await import("@capacitor-community/admob");
    await AdMob.initialize({
      initializeForTesting: true,
      testingDevices: [],
    });
    initialized = true;
    return true;
  } catch (err) {
    console.warn("[admob] init failed", err);
    return false;
  }
}

/**
 * Show a Rewarded Video Ad. Resolves to `true` only when the user actually
 * finishes the ad and earns the reward. On web (or any failure) it resolves
 * to `true` so the gated action still runs in development.
 */
export async function showRewardedAd(
  adUnitId: string = TEST_REWARDED_AD_UNIT_ID,
): Promise<boolean> {
  // Outside a native shell there is no AdMob — let the action through.
  if (!(await ensureInitialized())) return true;

  const { AdMob, RewardAdPluginEvents } = await import("@capacitor-community/admob");

  return new Promise<boolean>(async (resolve) => {
    let earned = false;
    const listeners: Array<{ remove: () => Promise<void> }> = [];

    const cleanup = async () => {
      for (const l of listeners) {
        try {
          await l.remove();
        } catch {
          /* noop */
        }
      }
    };

    try {
      listeners.push(
        await AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
          earned = true;
        }),
      );
      listeners.push(
        await AdMob.addListener(RewardAdPluginEvents.Dismissed, async () => {
          await cleanup();
          resolve(earned);
        }),
      );
      listeners.push(
        await AdMob.addListener(RewardAdPluginEvents.FailedToLoad, async () => {
          await cleanup();
          resolve(false);
        }),
      );
      listeners.push(
        await AdMob.addListener(RewardAdPluginEvents.FailedToShow, async () => {
          await cleanup();
          resolve(false);
        }),
      );

      await AdMob.prepareRewardVideoAd({ adId: adUnitId });
      await AdMob.showRewardVideoAd();
    } catch (err) {
      console.warn("[admob] showRewardedAd error", err);
      await cleanup();
      resolve(false);
    }
  });
}

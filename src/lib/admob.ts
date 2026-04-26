// AdMob helper with iOS App Tracking Transparency (ATT) request.
// Safe on web — falls back to no-op so the gated action can still be tested in the browser.

import { Capacitor } from "@capacitor/core";

// Official Google test Ad Unit ID for Rewarded Video.
export const TEST_REWARDED_AD_UNIT_ID = "ca-app-pub-3940256099942544/5224354917";

let initialized = false;
let attRequested = false;

export function isNative(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

export function getPlatform(): string {
  try {
    return Capacitor.getPlatform();
  } catch {
    return "web";
  }
}

/**
 * Request App Tracking Transparency permission on iOS 14.5+.
 * Required by Apple before SDKs can use IDFA for personalized ads.
 */
async function requestATT(): Promise<"authorized" | "denied" | "restricted" | "notDetermined" | "unavailable"> {
  if (attRequested) return "authorized";
  attRequested = true;

  if (getPlatform() !== "ios") return "unavailable";

  try {
    const { AppTrackingTransparency } = await import(
      "capacitor-plugin-app-tracking-transparency"
    );
    const { status } = await AppTrackingTransparency.getStatus();
    if (status === "notDetermined") {
      const res = await AppTrackingTransparency.requestPermission();
      return res.status as "authorized" | "denied" | "restricted" | "notDetermined";
    }
    return status as "authorized" | "denied" | "restricted" | "notDetermined";
  } catch (err) {
    console.warn("[att] request failed", err);
    return "unavailable";
  }
}

async function ensureInitialized(): Promise<boolean> {
  if (!isNative()) return false;
  if (initialized) return true;

  // 1) Ask for ATT FIRST (before AdMob initializes), per Apple guidelines.
  const attStatus = await requestATT();
  const trackingAuthorized = attStatus === "authorized";

  try {
    const { AdMob } = await import("@capacitor-community/admob");
    await AdMob.initialize({
      // When user denied ATT we must request non-personalized ads only.
      // The plugin handles non-personalized via ad request options at show time;
      // initializeForTesting=true keeps test devices opted in for previews.
      initializeForTesting: true,
      testingDevices: [],
      // The plugin reads tracking auth automatically on iOS once ATT is set.
      // We just record it for the load call below.
    });
    initialized = true;
    // Stash for later use (non-personalized when user denies tracking)
    (globalThis as unknown as { __admobNpa?: boolean }).__admobNpa =
      !trackingAuthorized;
    return true;
  } catch (err) {
    console.warn("[admob] init failed", err);
    return false;
  }
}

export type RewardedAdResult =
  | { status: "earned" }
  | { status: "dismissed" } // user closed before earning
  | { status: "failed"; reason: "load" | "show" | "init" | "exception"; message?: string }
  | { status: "unsupported" }; // running on web

/**
 * Show a Rewarded Video Ad. Resolves with a discriminated result so the caller
 * can decide what to do on each outcome (per Apple/Google policy: never block).
 */
export async function showRewardedAd(
  adUnitId: string = TEST_REWARDED_AD_UNIT_ID,
): Promise<RewardedAdResult> {
  if (!isNative()) return { status: "unsupported" };

  const ok = await ensureInitialized();
  if (!ok) return { status: "failed", reason: "init" };

  let AdMob: typeof import("@capacitor-community/admob").AdMob;
  let RewardAdPluginEvents: typeof import("@capacitor-community/admob").RewardAdPluginEvents;
  try {
    const mod = await import("@capacitor-community/admob");
    AdMob = mod.AdMob;
    RewardAdPluginEvents = mod.RewardAdPluginEvents;
  } catch (err) {
    return { status: "failed", reason: "exception", message: String(err) };
  }

  const npa = !!(globalThis as unknown as { __admobNpa?: boolean }).__admobNpa;

  return new Promise<RewardedAdResult>(async (resolve) => {
    let earned = false;
    let settled = false;
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

    const settle = async (result: RewardedAdResult) => {
      if (settled) return;
      settled = true;
      await cleanup();
      resolve(result);
    };

    try {
      listeners.push(
        await AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
          earned = true;
        }),
      );
      listeners.push(
        await AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
          settle(earned ? { status: "earned" } : { status: "dismissed" });
        }),
      );
      listeners.push(
        await AdMob.addListener(RewardAdPluginEvents.FailedToLoad, (e: unknown) => {
          settle({ status: "failed", reason: "load", message: safeMsg(e) });
        }),
      );
      listeners.push(
        await AdMob.addListener(RewardAdPluginEvents.FailedToShow, (e: unknown) => {
          settle({ status: "failed", reason: "show", message: safeMsg(e) });
        }),
      );

      await AdMob.prepareRewardVideoAd({
        adId: adUnitId,
        // Force non-personalized ads if ATT was not authorized.
        npa,
      });
      await AdMob.showRewardVideoAd();
    } catch (err) {
      settle({ status: "failed", reason: "exception", message: String(err) });
    }
  });
}

function safeMsg(e: unknown): string | undefined {
  if (!e) return undefined;
  if (typeof e === "string") return e;
  if (typeof e === "object" && e && "message" in e) return String((e as { message: unknown }).message);
  return undefined;
}

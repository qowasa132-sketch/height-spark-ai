// User profile types & local storage. No accounts — everything stays on device.
export type Gender = "male" | "female" | "other";
export type Ethnicity = "asian" | "black" | "caucasian" | "hispanic" | "middleEastern" | "mixed" | "other";
export type Unit = "metric" | "imperial";
export type Frequency = "none" | "light" | "moderate" | "heavy";
export type FacialHair = "none" | "light" | "patchy" | "moderate" | "full";
export type Acne = "none" | "occasional" | "frequent";

export interface Profile {
  gender?: Gender;
  age?: number;
  ethnicity?: Ethnicity;
  unit: Unit;
  heightCm?: number;
  weightKg?: number;
  motherHeightCm?: number;
  fatherHeightCm?: number;
  footSizeCm?: number;
  workout?: Frequency;
  facialHair?: FacialHair;
  acne?: Acne;
  underarmHair?: boolean;
  sleepHours?: number;
  dreamHeightCm?: number;
  completedAt?: number;
  isPremium?: boolean;
}

const KEY = "hb_profile";

export function loadProfile(): Profile {
  if (typeof window === "undefined") return { unit: "metric" };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { unit: "metric" };
    return { unit: "metric", ...JSON.parse(raw) };
  } catch {
    return { unit: "metric" };
  }
}

export function saveProfile(p: Profile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function clearProfile() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

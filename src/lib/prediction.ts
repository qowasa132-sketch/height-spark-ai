import type { Profile } from "./profile";

/**
 * Simplified Khamis-Roche-style adult height prediction.
 * Real Khamis-Roche uses regression coefficients tied to age in months.
 * This is a transparent, pedagogically-sound approximation built on:
 *   - Mid-parental height (Tanner formula)
 *   - Sex offset (+6.5 cm males / -6.5 cm females from MPH)
 *   - Current height anchor that decays as you approach adulthood
 *   - Lifestyle deltas (sleep, workout, habits) bounded ±4 cm
 */
export interface Prediction {
  predictedCm: number;
  midParentalCm: number;
  growthSpurtPct: number; // 0–100, remaining potential from current height
  unlockedCm: number;     // gain available from habits
}

function lifestyleDelta(p: Profile): number {
  let delta = 0;
  if (p.sleepHours != null) {
    if (p.sleepHours >= 8) delta += 1.5;
    else if (p.sleepHours >= 7) delta += 0.5;
    else if (p.sleepHours < 6) delta -= 2;
  }
  if (p.workout === "moderate") delta += 1;
  else if (p.workout === "heavy") delta += 1.5;
  else if (p.workout === "none") delta -= 0.5;
  return Math.max(-4, Math.min(4, delta));
}

export function predict(p: Profile): Prediction | null {
  if (!p.heightCm || !p.motherHeightCm || !p.fatherHeightCm || !p.gender || !p.age) return null;

  const sexOffset = p.gender === "female" ? -6.5 : 6.5;
  const midParentalCm = (p.motherHeightCm + p.fatherHeightCm) / 2 + sexOffset;

  // Weight: mid-parental dominates for younger, current height dominates for older
  const ageWeight = Math.max(0, Math.min(1, (p.age - 10) / 12)); // 0 at age 10, 1 at age 22+
  const base = midParentalCm * (1 - ageWeight * 0.5) + p.heightCm * (ageWeight * 0.5);

  // Anchor: never predict less than current height
  const adjusted = Math.max(p.heightCm, base) + lifestyleDelta(p);
  const predictedCm = Math.round(adjusted * 10) / 10;

  const remaining = predictedCm - p.heightCm;
  const growthSpurtPct = Math.max(0, Math.min(100, Math.round((remaining / 25) * 100)));
  const unlockedCm = Math.max(0, Math.round(remaining * 10) / 10);

  return { predictedCm, midParentalCm: Math.round(midParentalCm * 10) / 10, growthSpurtPct, unlockedCm };
}

export function cmToFtIn(cm: number): { ft: number; in: number } {
  const totalIn = cm / 2.54;
  const ft = Math.floor(totalIn / 12);
  const inches = Math.round(totalIn - ft * 12);
  return { ft, in: inches };
}

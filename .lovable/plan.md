# Build the Free Plan Tab (Daily Trackers)

The bottom tabs currently all route to `/home`, which is broken. The most foundational next step is the **Free Plan tab** — the daily habit trackers (Sleep, Nutrition, Sport). This unlocks real user value before we add Pro (payments) or AI (chat).

## What we'll build

### 1. New route: `src/routes/plan.tsx` — `/plan`
A daily tracker page with three sections:

- **Sleep** — slider 4–12 hours with visual moon indicator. Saves last night's hours.
- **Nutrition** — quick-add chips for growth-supporting foods (protein, dairy, leafy greens, fruit, nuts). Tap to log. Daily counter.
- **Sport** — toggle buttons for activity type (stretching, basketball, swimming, cycling, jump rope) + minutes input. Daily counter.

Each section shows today's progress vs. a recommended daily goal, with a circular ring or progress bar.

### 2. Daily log storage: `src/lib/dailyLog.ts`
Local-storage-based log keyed by date (`YYYY-MM-DD`):
```ts
interface DailyLog {
  date: string;
  sleepHours?: number;
  nutritionItems: string[];   // e.g. ["protein", "dairy"]
  sportMinutes: number;
  sportTypes: string[];
}
```
Helpers: `loadTodayLog()`, `saveTodayLog()`, `loadLogHistory(days)` for the streak.

### 3. Streak indicator
Top of plan page: "🔥 X day streak" computed from history of consecutive days with at least one logged item.

### 4. Wire up `BottomTabs`
Update `src/components/BottomTabs.tsx` so:
- Home tab → `/home`
- Plan (Free) tab → `/plan` ✅ new
- Pro tab → `/paywall` (already exists)
- AI tab → stays on `/home` for now, with a "Coming soon" tooltip

### 5. Home dashboard sync
Update `src/routes/home.tsx` "Track" cards (Sleep, Nutrition, Sport) to read from today's log so values stay in sync between Home and Plan.

### 6. i18n strings
Add `plan.*` keys (sleep, nutrition, sport, streak, recommended, addItem, minutes, etc.) to both `src/lib/locales/en.ts` and `src/lib/locales/ar.ts`.

### 7. Hydration fix (small follow-up)
The console shows a hydration mismatch on `/home` because i18n resolves the language on the client only. Apply the same `mounted` gate pattern already used in `LangToggle` to any translated text on `home.tsx` (or render the Home page client-only after mount).

## Out of scope for this step
- Pro tab content (will need payment provider — separate plan)
- AI chat tab (will need Lovable AI Gateway setup — separate plan)
- Cross-device sync (currently device-local; can add Lovable Cloud later)

## Files touched
- **New:** `src/routes/plan.tsx`, `src/lib/dailyLog.ts`
- **Edit:** `src/components/BottomTabs.tsx`, `src/routes/home.tsx`, `src/lib/locales/en.ts`, `src/lib/locales/ar.ts`

After this ships, the next logical step would be the **AI chat tab** (cheaper to build than Pro since Lovable AI Gateway has no API key requirement), then the **Pro paywall** with a real payment provider.
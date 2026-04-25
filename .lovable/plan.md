# Phase 2 — الخطة (Plan tab v2)

Rebuild `/plan` as a 4-section Arabic experience with deep daily tracking,
streaks, reminders and badges. Replace the current simple tracker.

## Section 1 — التمارين (Exercise)
- **تمارين تصحيح الوضعية (Posture)**: library of 4–6 simple exercises with
  step-by-step animated SVG/CSS guides focused on spinal alignment.
- **روتين الإطالة الأساسي (Stretching)**: guided routine (timer per move) to
  decompress the spine and improve flexibility.
- Mark workout as done → counts toward "1 hour of exercise" daily habit and
  sport minutes log.

## Section 2 — التغذية (Nutrition) — Pro calorie tracker
Replaces the simple chip list. Mini MyFitnessPal:
- **Add food by name**: search a built-in Arabic/English food DB
  (~80 common foods) with calories + protein + calcium + vitamin D per 100g.
- **Barcode scan**: use OpenFoodFacts public API (no key required) via
  `@zxing/browser` for camera scanning. Graceful fallback to manual entry.
- Daily totals: calories, protein (g), calcium (mg), vitamin D (IU).
- **Water intake**: +250ml buttons, goal 2L, reminder toggle.
- **BMI calculator**: derived from profile height + weight.
- **Weekly weight log**: simple weight entry per day, sparkline of last 7 entries.

## Section 3 — النوم (Sleep)
- Hours slider 4–12h, goal configurable (default 8h).
- Bedtime + wake time inputs (optional).
- 7-day sleep average chart.

## Section 4 — العادات اليومية (Daily Habits) — streak grid
Six fixed habits with simple toggle + streak per habit:
1. إيقاف الشاشات قبل النوم بساعة
2. لا كافيين قبل 8 ساعات من النوم
3. فيتامينات الزنك + D3
4. المشي 10,000 خطوة
5. شرب 2 لتر ماء
6. ساعة تمرين

Top-of-page combined streak (🔥) = consecutive days with ≥1 habit done.

## Reminders & Notifications
- Settings panel inside `/plan`:
  - تذكير النوم 10 مساءً (default on)
  - تذكير الماء كل ساعتين
  - تذكير التمرين يومياً 6 مساءً
  - تذكير القياسات أسبوعياً
- Implementation: Browser Notifications API (request permission) +
  in-app toast fallback via `sonner`. Schedule via `setTimeout` loop
  while tab is open + check on visibility change.

## Achievement Badges
Award + persist badges in localStorage:
- 🥇 أول يوم تتبّع
- 🔥 ٧ أيام متتالية
- 💧 أسبوع كامل من شرب الماء
- 🏃 ١٠ تمارين مكتملة
- 🌙 أسبوع نوم ٨ ساعات
- 🎯 إكمال جميع العادات في يوم واحد
Badges drawer accessible from top of `/plan`.

## Architecture
- **New** `src/lib/foodDb.ts` — built-in food database (Arabic/English names + macros).
- **New** `src/lib/notifications.ts` — permission, scheduling, in-app fallback.
- **New** `src/lib/badges.ts` — badge definitions, evaluation, storage.
- **Extend** `src/lib/dailyLog.ts`: add `foods`, `waterMl`, `weightKg`,
  `bedtime`, `wakeTime`, `habits` (record of 6 booleans), `workoutsDone`.
- **New components** in `src/components/plan/`:
  - `ExerciseSection.tsx` (with `ExerciseLibrary` modal)
  - `NutritionSection.tsx` (with `FoodSearch` + `BarcodeScanner` modals)
  - `SleepSection.tsx`
  - `HabitsSection.tsx`
  - `BadgesDrawer.tsx`
  - `RemindersSettings.tsx`
- **Rewrite** `src/routes/plan.tsx` as a thin shell composing the sections.
- **i18n**: add ~80 keys under `plan.*` in `src/lib/locales/ar.ts`
  (English file kept minimal since app is Arabic-only).
- **Hydration fix**: gate any translated text in `BottomTabs` and root
  layouts behind a `mounted` flag (also fixes existing console error).

## Out of scope this round
- Cross-device sync of food log (still device-local).
- AI-based food photo recognition (Pro/AI tab future work).
- Real push notifications when tab closed (would need service worker).

## Files touched
- New: `src/lib/foodDb.ts`, `src/lib/notifications.ts`, `src/lib/badges.ts`,
  `src/components/plan/*` (6 files).
- Edit: `src/lib/dailyLog.ts`, `src/routes/plan.tsx`, `src/lib/locales/ar.ts`,
  `src/lib/locales/en.ts`, `src/components/BottomTabs.tsx`.
- Dep: `bun add @zxing/browser @zxing/library`

import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { toast } from "sonner";
import {
  loadReminderSettings,
  saveReminderSettings,
  requestNotificationPermission,
  getNotificationPermission,
  checkNativePermission,
  type ReminderSettings,
  type PermState,
} from "@/lib/notifications";

const ROWS: { key: keyof ReminderSettings; emoji: string; label: string; hint: string }[] = [
  { key: "bedtime", emoji: "🌙", label: "تذكير النوم", hint: "كل ليلة الساعة ١٠ مساءً" },
  { key: "water", emoji: "💧", label: "تذكير الماء", hint: "كل ساعتين بين ٩ص و٩م" },
  { key: "exercise", emoji: "🏃", label: "تذكير التمرين", hint: "يومياً الساعة ٦ مساءً" },
  { key: "measurements", emoji: "📏", label: "قياسات أسبوعية", hint: "كل أحد الساعة ٩ صباحاً" },
];

export function RemindersDrawer({ onClose }: { onClose: () => void }) {
  const [settings, setSettings] = useState<ReminderSettings>(loadReminderSettings());
  const [perm, setPerm] = useState(getNotificationPermission());

  const setRow = async (key: keyof ReminderSettings, value: boolean) => {
    if (value && perm !== "granted" && perm !== "unsupported") {
      const next = await requestNotificationPermission();
      setPerm(next);
      if (next !== "granted") {
        toast.message("سنستخدم تنبيهات داخل التطبيق", {
          description: "لتفعيل إشعارات النظام، اسمح بالإشعارات من إعدادات المتصفح.",
        });
      }
    }
    const next = { ...settings, [key]: value };
    setSettings(next);
    saveReminderSettings(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-md rounded-t-3xl border border-border bg-card p-5 shadow-glow sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">التذكيرات</h3>
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

        {perm === "denied" && (
          <div className="mb-3 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-[11px] text-destructive">
            الإشعارات معطّلة من المتصفح. ستصلك التذكيرات داخل التطبيق فقط.
          </div>
        )}
        {perm === "unsupported" && (
          <div className="mb-3 rounded-xl border border-border bg-muted p-3 text-[11px] text-muted-foreground">
            متصفحك لا يدعم إشعارات النظام — سنُظهر التذكيرات داخل التطبيق.
          </div>
        )}

        <ul className="space-y-2">
          {ROWS.map((r) => (
            <li key={r.key}>
              <label className="flex items-center gap-3 rounded-2xl border border-border bg-background/40 p-3 cursor-pointer">
                <span className="text-2xl">{r.emoji}</span>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-foreground">{r.label}</div>
                  <div className="text-[10px] text-muted-foreground">{r.hint}</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings[r.key]}
                  onChange={(e) => setRow(r.key, e.target.checked)}
                  className="h-5 w-5 accent-[var(--primary)]"
                />
              </label>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-center text-[10px] text-muted-foreground">
          التذكيرات تعمل عند فتح التطبيق. للإشعارات في الخلفية ثبّت الموقع كتطبيق.
        </p>
      </div>
    </div>
  );
}

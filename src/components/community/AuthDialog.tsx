import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { signInWithEmail, signUpWithEmail } from "@/lib/auth";

export function AuthDialog({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        if (name.trim().length < 2) throw new Error("الاسم قصير جداً");
        const { error } = await signUpWithEmail(email.trim(), password, name.trim());
        if (error) throw error;
        toast.success("تم إنشاء الحساب");
      } else {
        const { error } = await signInWithEmail(email.trim(), password);
        if (error) throw error;
        toast.success("أهلاً بعودتك");
      }
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "حدث خطأ";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-md rounded-t-3xl border border-border bg-card p-5 shadow-glow sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">
            {mode === "signup" ? "إنشاء حساب للمشاركة" : "تسجيل الدخول"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-muted"
            aria-label="إغلاق"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <input
              type="text"
              required
              minLength={2}
              maxLength={40}
              placeholder="اسم العرض"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground"
            />
          )}
          <input
            type="email"
            required
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground"
            dir="ltr"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="كلمة المرور (٦ أحرف على الأقل)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground"
            dir="ltr"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-2xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-50"
          >
            {busy ? "..." : mode === "signup" ? "إنشاء حساب" : "دخول"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
          className="mt-3 w-full text-center text-xs text-muted-foreground underline"
        >
          {mode === "signup" ? "لدي حساب — تسجيل الدخول" : "ليس لدي حساب — إنشاء جديد"}
        </button>
      </div>
    </div>
  );
}

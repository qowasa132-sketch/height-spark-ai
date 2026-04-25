import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ChevronLeft } from "lucide-react";
import { clearProfile } from "@/lib/profile";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "الإعدادات — HeightBoost" }] }),
});

function SettingsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const items = [
    { label: "الإشعارات" },
    { label: "الدعم" },
    { label: "ملاحظاتك" },
    { label: "الإبلاغ عن مشكلة" },
    { label: "الخصوصية" },
    { label: "الشروط" },
  ];

  const reset = () => {
    if (confirm("إعادة تعيين الملف؟ سيتم مسح جميع بياناتك.")) {
      clearProfile();
      navigate({ to: "/" });
    }
  };

  return (
    <main className="min-h-screen bg-background pb-12">
      <div className="mx-auto max-w-md px-5 pt-6">
        <div className="flex items-center gap-3">
          <Link
            to="/home"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground transition-smooth rtl:rotate-180"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-foreground">{t("home.settings")}</h1>
        </div>

        <ul className="mt-6 overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
          {items.map((item) => (
            <li key={item.label}>
              <button className="flex w-full items-center justify-between px-5 py-4 text-start transition-smooth hover:bg-muted">
                <span className="text-sm font-medium text-foreground">{item.label}</span>
                <span className="text-muted-foreground">›</span>
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={reset}
          className="mt-6 w-full rounded-2xl border border-destructive/40 bg-destructive/10 py-4 text-sm font-semibold text-destructive transition-smooth hover:bg-destructive/20"
        >
          إعادة تعيين الملف وحذف البيانات
        </button>
      </div>
    </main>
  );
}

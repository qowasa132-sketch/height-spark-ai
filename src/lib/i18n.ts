import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "./locales/en";
import { ar } from "./locales/ar";

export type AppLanguage = "en" | "ar";

export function normalizeLanguage(lng?: string | null): AppLanguage {
  return lng?.toLowerCase().startsWith("ar") ? "ar" : "en";
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: "en",
    fallbackLng: "en",
    supportedLngs: ["en", "ar"],
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
}

export function applyDirection(lng: string) {
  if (typeof document === "undefined") return;
  const language = normalizeLanguage(lng);
  document.documentElement.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
  document.documentElement.setAttribute("lang", language);
}

export async function setAppLanguage(lng: AppLanguage) {
  if (typeof window !== "undefined") localStorage.setItem("hb_lang", lng);
  applyDirection(lng);
  await i18n.changeLanguage(lng);
}

i18n.on("languageChanged", applyDirection);

export default i18n;

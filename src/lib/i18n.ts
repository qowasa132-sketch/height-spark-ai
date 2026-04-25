import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { ar } from "./locales/ar";

export type AppLanguage = "ar";

export function normalizeLanguage(_lng?: string | null): AppLanguage {
  return "ar";
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      ar: { translation: ar },
    },
    lng: "ar",
    fallbackLng: "ar",
    supportedLngs: ["ar"],
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
}

export function applyDirection(_lng?: string) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("dir", "rtl");
  document.documentElement.setAttribute("lang", "ar");
}

export async function setAppLanguage(_lng?: AppLanguage) {
  if (typeof window !== "undefined") localStorage.setItem("hb_lang", "ar");
  applyDirection();
  await i18n.changeLanguage("ar");
}

i18n.on("languageChanged", applyDirection);

export default i18n;

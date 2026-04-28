import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import i18n, { normalizeLanguage, setAppLanguage } from "@/lib/i18n";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground glow-text">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-smooth hover:scale-105"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#0a1420" },
      { title: "HeightBoost — Unlock Your Height Potential" },
      { name: "description", content: "Science-backed height prediction and personalized growth plans. 100% private, no account needed." },
      { property: "og:title", content: "HeightBoost — Unlock Your Height Potential" },
      { property: "og:description", content: "Science-backed height prediction and personalized growth plans. 100% private, no account needed." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "HeightBoost — Unlock Your Height Potential" },
      { name: "twitter:description", content: "Science-backed height prediction and personalized growth plans. 100% private, no account needed." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/085f05c7-e93f-4770-a898-f17c93f81a2d/id-preview-e323bf25--f9ea4524-b501-49e3-a07f-153b3fde59f3.lovable.app-1777254467923.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/085f05c7-e93f-4770-a898-f17c93f81a2d/id-preview-e323bf25--f9ea4524-b501-49e3-a07f-153b3fde59f3.lovable.app-1777254467923.png" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  useEffect(() => {
    setAppLanguage(normalizeLanguage(localStorage.getItem("hb_lang") || i18n.language));
  }, []);
  return (
    <>
      <Outlet />
      <Toaster position="top-center" richColors />
    </>
  );
}

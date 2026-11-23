import type { Metadata } from "next";
import Backdrop from "@/components/Backdrop";
import IphoneAdminDashboard from "@/components/IphoneAdminDashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "לוח הסקר והניוזלטר | Shift Smart",
  robots: { index: false, follow: false },
  manifest: "/iphone-admin.webmanifest",
  appleWebApp: { capable: false, title: "תוצאות iPhone" },
  icons: { apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" } },
};

export default function IphoneAdminPage() {
  return (
    <>
      <Backdrop />
      <IphoneAdminDashboard />
    </>
  );
}

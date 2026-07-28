import { Clock4, Download, Mail, Users, type LucideIcon } from "lucide-react";

import {
  BETA_GROUP_URL,
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  EXTERNAL_LINK_PROPS,
  PLAY_STORE_URL,
} from "@/lib/links";

type FooterLink = {
  label: string;
  href: string;
  icon: LucideIcon;
  /** קישור פנימי כמו mailto לא נפתח בלשונית חדשה */
  external: boolean;
};

const FOOTER_LINKS: FooterLink[] = [
  {
    label: "הורדה מ‑Google Play",
    href: PLAY_STORE_URL,
    icon: Download,
    external: true,
  },
  {
    label: "קבוצת הבודקים",
    href: BETA_GROUP_URL,
    icon: Users,
    external: true,
  },
  {
    label: CONTACT_EMAIL,
    href: CONTACT_MAILTO,
    icon: Mail,
    external: false,
  },
];

export default function Footer() {
  /* נקבע בזמן הבנייה — מונע פער בין רינדור השרת לרינדור הלקוח */
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 px-5 pb-10 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-6xl">
        <div className="rule-hair" />

        <div className="flex flex-col gap-8 pt-10 sm:flex-row sm:items-center sm:justify-between">
          {/* ---------- מותג ---------- */}
          <div className="flex items-center gap-3">
            <span className="panel flex size-10 items-center justify-center rounded-lg">
              <Clock4 className="size-4 text-neon" strokeWidth={1.75} />
            </span>
            <div>
              <p className="font-display text-base text-chalk">Shift Smart</p>
              <p className="text-sm text-mist">ניהול משמרות ושעון נוכחות חכם</p>
            </div>
          </div>

          {/* ---------- קישורים ויצירת קשר ---------- */}
          <nav aria-label="קישורים ויצירת קשר">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {FOOTER_LINKS.map(({ label, href, icon: Icon, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? EXTERNAL_LINK_PROPS : {})}
                    className="group inline-flex items-center gap-2 text-sm text-mist transition duration-300 hover:text-neon"
                  >
                    <Icon
                      className="size-4 transition duration-300 group-hover:text-neon"
                      strokeWidth={1.75}
                    />
                    <span dir={external ? "rtl" : "ltr"}>{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-10 text-xs text-mist/70">
          © {year} Shift Smart. כל הזכויות שמורות. האפליקציה נמצאת בשלב בטא
          סגורה והתכונות עשויות להשתנות.
        </p>
      </div>
    </footer>
  );
}

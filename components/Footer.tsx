import { Clock4, Download, Mail, Users, type LucideIcon } from "lucide-react";

import { FacebookIcon, InstagramIcon } from "@/components/SocialIcons";
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

type SocialLink = {
  label: string;
  href: string;
  Icon: typeof FacebookIcon;
  /** צבע המותג שנדלק במעבר עכבר */
  hover: string;
};

/*
 * הקישורים החברתיים עדיין מצביעים ל-"#" עד שיהיו עמודים אמיתיים.
 * במעבר עכבר האייקון והמסגרת נצבעים בצבע המותג ומקבלים הילה תואמת.
 */
const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "עמוד הפייסבוק של Shift Smart",
    href: "#",
    Icon: FacebookIcon,
    hover:
      "hover:border-[#1877F2] hover:text-[#1877F2] hover:shadow-[0_0_24px_-6px_#1877F2]",
  },
  {
    label: "עמוד האינסטגרם של Shift Smart",
    href: "#",
    Icon: InstagramIcon,
    hover:
      "hover:border-[#E1306C] hover:text-[#E1306C] hover:shadow-[0_0_24px_-6px_#E1306C]",
  },
];

export default function Footer() {
  /* נקבע בזמן הבנייה — מונע פער בין רינדור השרת לרינדור הלקוח */
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 px-5 pb-10 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-6xl">
        <div className="rule-hair" />

        <div className="flex flex-col gap-10 pt-12 lg:flex-row lg:items-start lg:justify-between">
          {/* ---------- מותג ---------- */}
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <span className="panel brackets flex size-11 items-center justify-center rounded-xl">
                <Clock4 className="size-5 text-neon" strokeWidth={1.75} />
              </span>
              <div>
                <p className="font-display text-base text-chalk">Shift Smart</p>
                <p className="text-sm text-mist">
                  ניהול משמרות ושעון נוכחות חכם
                </p>
              </div>
            </div>

            {/* ---------- רשתות חברתיות ---------- */}
            <div className="mt-7">
              <p className="text-xs tracking-wide text-mist">עקבו אחרינו</p>
              <ul className="mt-3 flex items-center gap-3">
                {SOCIAL_LINKS.map(({ label, href, Icon, hover }) => (
                  <li key={label}>
                    <a
                      href={href}
                      aria-label={label}
                      className={`panel flex size-11 items-center justify-center rounded-full text-mist transition duration-300 hover:-translate-y-0.5 ${hover}`}
                    >
                      <Icon className="size-5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ---------- קישורים ויצירת קשר ---------- */}
          <nav aria-label="קישורים ויצירת קשר">
            <p className="text-xs tracking-wide text-mist">קישורים</p>
            <ul className="mt-3 flex flex-col gap-3">
              {FOOTER_LINKS.map(({ label, href, icon: Icon, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? EXTERNAL_LINK_PROPS : {})}
                    className="group inline-flex items-center gap-2.5 text-sm text-mist transition duration-300 hover:text-neon"
                  >
                    <Icon
                      className="size-4 shrink-0 transition duration-300 group-hover:text-neon"
                      strokeWidth={1.75}
                    />
                    <span dir={external ? "rtl" : "ltr"}>{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="rule-hair mt-12" />

        <p className="mt-6 text-xs leading-relaxed text-mist/70">
          © {year} Shift Smart. כל הזכויות שמורות. האפליקציה נמצאת בשלב בטא
          סגורה והתכונות עשויות להשתנות.
        </p>
      </div>
    </footer>
  );
}

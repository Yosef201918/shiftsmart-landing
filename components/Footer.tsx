"use client";

import { Clock4, Download, Mail, Users, type LucideIcon } from "lucide-react";

import { FacebookIcon, InstagramIcon, TiktokIcon } from "@/components/SocialIcons";
import {
  BETA_GROUP_URL,
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  EXTERNAL_LINK_PROPS,
  INSTAGRAM_URL,
  PLAY_STORE_URL,
  TIKTOK_URL,
} from "@/lib/links";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type FooterLink = {
  label: string;
  href: string;
  icon: LucideIcon;
  external: boolean;
  /**
   * מכריח דיר LTR על כתובת המייל בלבד — היא תמיד תווים לטיניים ללא קשר
   * לשפת הממשק. שני הקישורים המתורגמים האחרים לא צריכים דיר משלהם;
   * הם יורשים אותו מ-<html> ומתהפכים ממילא נכון בכל שפה.
   */
  forceLtr?: boolean;
};

type SocialLink = {
  label: string;
  href: string;
  Icon: typeof FacebookIcon;
  /** צבע המותג שנדלק במעבר עכבר */
  hover: string;
  /** האם לפתוח בלשונית חדשה עם מאפייני האבטחה של EXTERNAL_LINK_PROPS */
  external: boolean;
};

export default function Footer() {
  const { t } = useLanguage();

  /* נקבע בזמן הבנייה — מונע פער בין רינדור השרת לרינדור הלקוח */
  const year = new Date().getFullYear();

  const footerLinks: FooterLink[] = [
    {
      label: t.footer.linkPlayStore,
      href: PLAY_STORE_URL,
      icon: Download,
      external: true,
    },
    {
      label: t.footer.linkBetaGroup,
      href: BETA_GROUP_URL,
      icon: Users,
      external: true,
    },
    {
      label: CONTACT_EMAIL,
      href: CONTACT_MAILTO,
      icon: Mail,
      external: false,
      forceLtr: true,
    },
  ];

  /*
   * הקישור לפייסבוק עדיין מצביע ל-"#" עד שיהיה עמוד אמיתי; אינסטגרם וטיקטוק
   * כבר מחוברים לפרופילים הרשמיים. במעבר עכבר האייקון והמסגרת נצבעים בצבע
   * המותג ומקבלים הילה תואמת.
   */
  const socialLinks: SocialLink[] = [
    {
      label: t.footer.socialFacebookAria,
      href: "#",
      Icon: FacebookIcon,
      hover:
        "hover:border-[#1877F2] hover:text-[#1877F2] hover:shadow-[0_0_24px_-6px_#1877F2]",
      external: false,
    },
    {
      label: t.footer.socialInstagramAria,
      href: INSTAGRAM_URL,
      Icon: InstagramIcon,
      hover:
        "hover:border-[#E1306C] hover:text-[#E1306C] hover:shadow-[0_0_24px_-6px_#E1306C]",
      external: true,
    },
    {
      label: t.footer.socialTiktokAria,
      href: TIKTOK_URL,
      Icon: TiktokIcon,
      hover:
        "hover:border-[#25F4EE] hover:text-[#25F4EE] hover:shadow-[0_0_24px_-6px_#25F4EE]",
      external: true,
    },
  ];

  return (
    // id="site-footer": משמש עוגן ל-IntersectionObserver ב-StickyCta,
    // כדי שהכפתור הצף ידע להיעלם ברגע שהפוטר נכנס לתצוגה (ראו הסבר שם).
    <footer id="site-footer" className="relative z-10 px-5 pb-10 sm:px-8 lg:px-12">
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
                <p className="font-display text-base text-chalk">
                  {t.brand.name}
                </p>
                <p className="text-sm text-mist">{t.footer.tagline}</p>
              </div>
            </div>

            {/* ---------- רשתות חברתיות ---------- */}
            <div className="mt-7">
              <p className="text-xs tracking-wide text-mist">
                {t.footer.followUs}
              </p>
              <ul className="mt-3 flex items-center gap-3">
                {socialLinks.map(({ label, href, Icon, hover, external }) => (
                  <li key={label}>
                    <a
                      href={href}
                      aria-label={label}
                      {...(external ? EXTERNAL_LINK_PROPS : {})}
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
          <nav aria-label={t.footer.linksAriaLabel}>
            <ul className="mt-3 flex flex-col gap-3">
              {footerLinks.map(({ label, href, icon: Icon, external, forceLtr }) => (
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
                    <span dir={forceLtr ? "ltr" : undefined}>{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="rule-hair mt-12" />

        <p className="mt-6 text-xs leading-relaxed text-mist/70">
          {t.footer.copyright(year)}
        </p>
      </div>
    </footer>
  );
}

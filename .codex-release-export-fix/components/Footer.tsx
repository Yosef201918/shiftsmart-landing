"use client";

import Image from "next/image";
import { ArrowUpRight, Download, FileText, Mail, ShieldCheck } from "lucide-react";
import { FacebookIcon, InstagramIcon, TiktokIcon } from "@/components/SocialIcons";
import { CONTACT_EMAIL, CONTACT_MAILTO, EXTERNAL_LINK_PROPS, FACEBOOK_URL, INSTAGRAM_URL, PLAY_STORE_URL, TIKTOK_URL } from "@/lib/links";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import NewsletterSignup from "@/components/NewsletterSignup";

export default function Footer() {
  const { t } = useLanguage();
  const socialLinks = [
    { label: t.footer.socialFacebookAria, name: "Facebook", href: FACEBOOK_URL, Icon: FacebookIcon, theme: "facebook" },
    { label: t.footer.socialInstagramAria, name: "Instagram", href: INSTAGRAM_URL, Icon: InstagramIcon, theme: "instagram" },
    { label: t.footer.socialTiktokAria, name: "TikTok", href: TIKTOK_URL, Icon: TiktokIcon, theme: "tiktok" },
  ];

  return (
    <footer id="site-footer" className="relative z-10 px-5 pb-8 pt-8 sm:px-8 lg:px-12">
      <div className="footer-shell mx-auto max-w-6xl">
        <NewsletterSignup />
        <div className="grid gap-10 p-6 sm:p-9 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-16 lg:p-12">
          <div>
            <div className="flex items-center gap-4">
              <Image src="/icon-192.png" alt="" width={76} height={76} className="brand-app-icon size-[68px] shrink-0 rounded-[19px] sm:size-[76px]" />
              <div>
                <p className="font-display text-2xl text-chalk sm:text-3xl" dir="ltr">{t.brand.name}</p>
                <p className="mt-1 max-w-xs text-sm leading-relaxed text-mist">{t.footer.tagline}</p>
              </div>
            </div>
            <p className="mb-4 mt-8 text-sm text-mist">{t.footer.followUs}</p>
            <ul className="flex flex-wrap gap-4">
              {socialLinks.map(({ label, name, href, Icon, theme }) => (
                <li key={name}>
                  <a href={href} aria-label={label} {...EXTERNAL_LINK_PROPS} className="footer-social-link group">
                    <span className={`footer-social-tile footer-social-${theme}`}><Icon className="size-6" /></span>
                    <span className="mt-3 text-[11px] font-medium tracking-wide text-mist transition-colors group-hover:text-chalk" dir="ltr">{name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-download-panel min-w-0 rounded-2xl p-4 sm:p-7">
            <p className="mb-5 font-display text-lg sm:text-xl leading-relaxed text-chalk">{t.hero.kicker}</p>
            <a href={PLAY_STORE_URL} data-download-placement="footer" {...EXTERNAL_LINK_PROPS} className="footer-download-button flex min-h-16 w-full items-center justify-between gap-4 rounded-xl px-3 py-4 sm:px-5">
              <span className="flex items-center gap-2 sm:gap-3"><Download className="size-5 shrink-0 sm:size-6" strokeWidth={2} /><span className="whitespace-nowrap font-display text-xs sm:text-base">{t.footer.linkPlayStore}</span></span>
              <ArrowUpRight className="hidden size-5 shrink-0 sm:block" aria-hidden="true" />
            </a>
            <a href={CONTACT_MAILTO} className="mt-5 flex min-h-11 items-center justify-center gap-2 text-sm text-mist transition-colors hover:text-neon"><Mail className="size-4 shrink-0" aria-hidden="true" /><span dir="ltr">{CONTACT_EMAIL}</span></a>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 px-6 py-5 sm:px-9 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <nav aria-label={t.footer.linksAriaLabel} className="flex flex-wrap gap-x-6 gap-y-1">
            <a href="/privacy" className="inline-flex min-h-11 items-center gap-2 text-sm text-mist transition-colors hover:text-neon"><ShieldCheck className="size-4" aria-hidden="true" />{t.footer.linkPrivacyPolicy}</a>
            <a href="/terms" className="inline-flex min-h-11 items-center gap-2 text-sm text-mist transition-colors hover:text-neon"><FileText className="size-4" aria-hidden="true" />{t.footer.linkTermsOfService}</a>
          </nav>
          <p className="text-xs leading-relaxed text-mist/70">{t.footer.copyright(new Date().getFullYear())}</p>
        </div>
      </div>
    </footer>
  );
}

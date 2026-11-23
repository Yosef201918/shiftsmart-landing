import AboutTimeTracking from "@/components/AboutTimeTracking";
import DownloadTracking from "@/components/DownloadTracking";
import SkipToContent from "@/components/SkipToContent";
import AppPoster from "@/components/AppPoster";
import AppCarousel from "@/components/AppCarousel";
import Backdrop from "@/components/Backdrop";
import Faq from "@/components/Faq";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import MotionProvider from "@/components/MotionProvider";
import LaunchBanner from "@/components/LaunchBanner";
import PhoneShowcase from "@/components/PhoneShowcase";
import Reviews from "@/components/Reviews";
import Roadmap from "@/components/Roadmap";
import StickyCta from "@/components/StickyCta";
import WhatsNew from "@/components/WhatsNew";

// תמונת המוצר המאושרת מופיעה בסמוך לפתיחה.
export default function Home() {
  return (
    <>
      <SkipToContent />
      <Backdrop />
      <DownloadTracking />

      <MotionProvider>
        <main className="relative z-10 flex-1">
          {/* מחוץ ל-<section id="hero"> בכוונה — ראו הסבר ב-LaunchBanner.tsx */}
          <LaunchBanner />
          <Hero />
          <AppPoster />
          <PhoneShowcase />
          <WhatsNew />
          <Features />
          <AboutTimeTracking />
          <Reviews />
          <AppCarousel />
          <Roadmap />
          <Faq />
        </main>

        <StickyCta />
      </MotionProvider>

      <Footer />
    </>
  );
}

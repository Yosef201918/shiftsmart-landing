import AppCarousel from "@/components/AppCarousel";
import Backdrop from "@/components/Backdrop";
import BetaSteps from "@/components/BetaSteps";
import Faq from "@/components/Faq";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import MotionProvider from "@/components/MotionProvider";
import PhoneShowcase from "@/components/PhoneShowcase";
import Roadmap from "@/components/Roadmap";
import StickyCta from "@/components/StickyCta";
import WhatsNew from "@/components/WhatsNew";

/*
 * סדר הקריאה זהה במובייל ובדסקטופ:
 * כותרת ופעולות → מה חדש → מדריך ההצטרפות → מוקאפ האפליקציה → יכולות →
 * גלריה → שאלות.
 */
export default function Home() {
  return (
    <>
      <Backdrop />

      <MotionProvider>
        <main className="relative z-10 flex-1">
          <Hero />
          <WhatsNew />
          <BetaSteps />
          <PhoneShowcase />
          <Features />
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

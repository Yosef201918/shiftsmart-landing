import AppCarousel from "@/components/AppCarousel";
import Backdrop from "@/components/Backdrop";
import BetaSteps from "@/components/BetaSteps";
import Faq from "@/components/Faq";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import MotionProvider from "@/components/MotionProvider";
import StickyCta from "@/components/StickyCta";

export default function Home() {
  return (
    <>
      <Backdrop />

      <MotionProvider>
        <main className="relative z-10 flex-1">
          <Hero />
          <BetaSteps />
          <Features />
          <AppCarousel />
          <Faq />
        </main>

        <StickyCta />
      </MotionProvider>

      <Footer />
    </>
  );
}

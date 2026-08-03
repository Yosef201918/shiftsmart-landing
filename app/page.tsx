import AppCarousel from "@/components/AppCarousel";
import Backdrop from "@/components/Backdrop";
import Faq from "@/components/Faq";
import Features from "@/components/Features";
import FeedbackFab from "@/components/FeedbackFab";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import MotionProvider from "@/components/MotionProvider";
import PhoneShowcase from "@/components/PhoneShowcase";
import Roadmap from "@/components/Roadmap";
import StickyCta from "@/components/StickyCta";
import WhatsNew from "@/components/WhatsNew";

/*
 * שלב 16: מדריך שלושת השלבים (BetaSteps) כבר לא מקטע עצמאי בעמוד — הוא
 * עבר להיות מרונדר בתוך <Hero> עצמו, מיד מתחת לכפתורי הפעולה, כדי שיהיה
 * גלוי בלי גלילה. סדר הקריאה בעמוד:
 * הירו (כולל כותרת → פעולות → מדריך → אמון) → מה חדש → מוקאפ האפליקציה →
 * יכולות → גלריה → מפת דרכים → שאלות.
 */
export default function Home() {
  return (
    <>
      <Backdrop />

      <MotionProvider>
        <main className="relative z-10 flex-1">
          <Hero />
          <WhatsNew />
          <PhoneShowcase />
          <Features />
          <AppCarousel />
          <Roadmap />
          <Faq />
        </main>

        <StickyCta />
        <FeedbackFab />
      </MotionProvider>

      <Footer />
    </>
  );
}

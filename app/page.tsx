import AppCarousel from "@/components/AppCarousel";
import Backdrop from "@/components/Backdrop";
import Faq from "@/components/Faq";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import MotionProvider from "@/components/MotionProvider";
import PhoneShowcase from "@/components/PhoneShowcase";
import Reviews from "@/components/Reviews";
import Roadmap from "@/components/Roadmap";
import StickyCta from "@/components/StickyCta";
import WhatsNew from "@/components/WhatsNew";

/*
 * שלב 17: כפתור הפידבק הצף (FeedbackFab) הוסר לגמרי והוחלף במקטע ביקורות
 * ציבורי (Reviews) בסגנון Google Play, מיד אחרי מקטע היכולות. סדר הקריאה
 * בעמוד: הירו (כולל כותרת → פעולות → מדריך → אמון) → מה חדש → מוקאפ
 * האפליקציה → יכולות → ביקורות → גלריה → מפת דרכים → שאלות.
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

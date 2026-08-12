import AppCarousel from "@/components/AppCarousel";
import AppPoster from "@/components/AppPoster";
import Backdrop from "@/components/Backdrop";
import Faq from "@/components/Faq";
import Features from "@/components/Features";
import FeatureRequest from "@/components/FeatureRequest";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import MotionProvider from "@/components/MotionProvider";
import PhoneShowcase from "@/components/PhoneShowcase";
import Reviews from "@/components/Reviews";
import Roadmap from "@/components/Roadmap";
import StickyCta from "@/components/StickyCta";
import WhatsNew from "@/components/WhatsNew";

/*
 * שלב 25: פוסטר המותג הרשמי (AppPoster, ICON.jpg) נוסף מיד אחרי ה-Hero —
 * מקטע עצמאי ולא בתוך ה-Hero עצמו, כדי לא לפגוע במאמץ משלב 16 לשמור על
 * מדריך שלושת השלבים גלוי בלי גלילה במובייל. סדר הקריאה בעמוד: הירו
 * (כותרת → פעולות → שיתוף → מדריך → אמון) → פוסטר המותג → מה חדש →
 * מוקאפ האפליקציה → יכולות → ביקורות → גלריה → מפת דרכים → הצעת פיצ'ר →
 * שאלות.
 */
export default function Home() {
  return (
    <>
      <Backdrop />

      <MotionProvider>
        <main className="relative z-10 flex-1">
          <Hero />
          <AppPoster />
          <WhatsNew />
          <PhoneShowcase />
          <Features />
          <Reviews />
          <AppCarousel />
          <Roadmap />
          <FeatureRequest />
          <Faq />
        </main>

        <StickyCta />
      </MotionProvider>

      <Footer />
    </>
  );
}

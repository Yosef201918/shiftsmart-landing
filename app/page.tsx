import AppCarousel from "@/components/AppCarousel";
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
 * שלב 21: כפתור שיתוף חכם נוסף בתוך ה-Hero (מיד מתחת לכפתורי הפעולה
 * הראשיים), ומקטע "הצעת פיצ'ר" נוסף אחרי מפת הדרכים — המשכיות הגיונית
 * מ"מה מתוכנן להמשך" ל"יש לכם רעיון למה שיבוא אחרי זה?". סדר הקריאה
 * בעמוד: הירו (כותרת → פעולות → שיתוף → מדריך → אמון) → מה חדש → מוקאפ
 * האפליקציה → יכולות → ביקורות → גלריה → מפת דרכים → הצעת פיצ'ר → שאלות.
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
          <FeatureRequest />
          <Faq />
        </main>

        <StickyCta />
      </MotionProvider>

      <Footer />
    </>
  );
}

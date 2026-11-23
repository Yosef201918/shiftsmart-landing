import type { Metadata } from "next";
import Backdrop from "@/components/Backdrop";
import IphoneSurvey from "@/components/IphoneSurvey";

export const metadata: Metadata = {
  title: "סקר ביקוש לגרסת iPhone | Shift Smart",
  description: "עזרו לנו לבדוק את הביקוש לגרסת iPhone של Shift Smart.",
};

export default function IphoneSurveyPage() {
  return (
    <>
      <Backdrop />
      <IphoneSurvey />
    </>
  );
}

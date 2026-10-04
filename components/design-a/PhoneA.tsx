import Image from "next/image";

import type { ScreenAsset } from "@/lib/designAssets";

type PhoneAProps = {
  asset: ScreenAsset;
  /** מיקום ורוחב השלדה (Tailwind). המכשיר תמיד ממוקם בהחלטת הקורא (absolute/relative) */
  className?: string;
  priority?: boolean;
};

/*
 * שלדת מכשיר שנבנית ב-CSS סביב מסך אפליקציה אמיתי. פינות המסך מעוגלות יותר
 * מהפינות השחורות שנשארו בחיתוך המקורי, ולכן הן נחתכות לגמרי. החיתוך מתחיל
 * בשורת הכותרת של האפליקציה, ולכן אין "אי" עליון שיסתיר אותה.
 */
export default function PhoneA({ asset, className = "", priority = false }: PhoneAProps) {
  return (
    <div
      className={`rounded-[2.5rem] border border-da-line-strong bg-[#020605] p-[7px] shadow-[0_44px_70px_-34px_rgb(0_0_0/0.95),inset_0_0_0_1px_rgb(255_255_255/0.05)] ${className}`}
    >
      <div className="relative overflow-hidden rounded-[2.05rem]">
        <Image
          src={asset.src}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          priority={priority}
          sizes="(min-width: 1024px) 20rem, 17rem"
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}

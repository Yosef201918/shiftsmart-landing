import Image from "next/image";

import type { ScreenAsset } from "@/lib/designAssets";

type PhoneBProps = {
  asset: ScreenAsset;
  /** רוחב השלדה (Tailwind) */
  className?: string;
  /** מכהה מכשיר משני כדי שהמרכזי יבלוט */
  dim?: boolean;
  priority?: boolean;
};

/*
 * שלדת מכשיר של כיוון B: מסגרת דקה יותר מ-A עם קצה בהיר עדין (כמו מתכת
 * מוברשת), מסך אמיתי בפנים. החיתוך מתחיל בשורת הכותרת של האפליקציה, ולכן
 * אין "אי" עליון שיסתיר אותה.
 */
export default function PhoneB({
  asset,
  className = "",
  dim = false,
  priority = false,
}: PhoneBProps) {
  return (
    <div
      className={`relative shrink-0 rounded-[2.3rem] bg-[#0a0f0d] p-[5px] shadow-[0_50px_70px_-32px_rgb(0_0_0/0.95),inset_0_0_0_1px_rgb(255_255_255/0.16)] ${className}`}
    >
      <div className="relative overflow-hidden rounded-[1.95rem]">
        <Image
          src={asset.src}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          priority={priority}
          sizes="(min-width: 1024px) 19rem, 14rem"
          className="h-auto w-full"
        />
        {dim ? (
          <span aria-hidden="true" className="absolute inset-0 bg-black/40" />
        ) : null}
      </div>
    </div>
  );
}

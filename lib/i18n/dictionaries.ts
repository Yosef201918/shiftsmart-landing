export type Lang = "he" | "en";

export interface TitledItem {
  title: string;
  description: string;
}

export interface StepItem extends TitledItem {
  /** רק לשני השלבים הראשונים — הכרטיס כולו הופך לקישור */
  linkLabel?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ShotItem {
  /** נתיב תמונה משלו לכל שפה — הצילומים העבריים והאנגליים הם קבצים נפרדים */
  src: string;
  width: number;
  height: number;
  alt: string;
}

/**
 * קטע טקסט בודד בתוך פסקה משפטית (privacy/terms) שדורש הדגשה חזותית
 * (מודגש/קוד) באמצע משפט. הרכיב שמרנדר את זה (RichText) ממפה format
 * ל-<strong>/<code> — כך אפשר לתרגם פסקאות עם הדגשות מוטמעות בלי לשכפל
 * JSX בכל שפה.
 */
export interface RichTextSegment {
  text: string;
  format?: "bold" | "code";
}

/** פריט הרשאה בודד בדף מדיניות הפרטיות — תווית מודגשת ואחריה הסבר */
export interface PermissionItem {
  label: string;
  body: string;
}

/**
 * טיפוסי tuple באורך קבוע (במקום `TitledItem[]` גנרי) מכריחים את TypeScript
 * לוודא שלכל שפה יש בדיוק אותו מספר פריטים באותו סדר — אם תתווסף תכונה
 * לעברית ותישכח מהאנגלית, זו שגיאת קומפילציה ולא באג שקט בפרודקשן.
 */
export interface Dictionary {
  meta: {
    title: string;
    description: string;
    keywords: string[];
    ogDescription: string;
  };
  brand: {
    name: string;
    launchBadge: string;
  };
  languageSwitcher: {
    hebrewLabel: string;
    englishLabel: string;
    groupAriaLabel: string;
  };
  hero: {
    kicker: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    audience: string;
    downloadCta: string;
    platformNotice: string;
  };
  whatsNew: {
    kicker: string;
    titlePrefix: string;
    titleHighlight: string;
    subtitle: string;
    /** תווית קטנה על כל כרטיס — "חדש" / "NEW" */
    badgeLabel: string;
    items: [TitledItem, TitledItem, TitledItem];
  };
  aboutTimeTracking: {
    kicker: string;
    titlePrefix: string;
    titleHighlight: string;
    body: string;
  };
  quickStart: {
    kicker: string;
    titlePrefix: string;
    titleHighlight: string;
    titleSuffix: string;
    subtitle: string;
    steps: [StepItem, StepItem, StepItem];
  };
  features: {
    kicker: string;
    titlePrefix: string;
    titleHighlight: string;
    items: [
      TitledItem,
      TitledItem,
      TitledItem,
      TitledItem,
      TitledItem,
      TitledItem,
      TitledItem,
      TitledItem,
      TitledItem,
      TitledItem,
      TitledItem,
      TitledItem,
    ];
  };
  reviews: {
    kicker: string;
    titlePrefix: string;
    titleHighlight: string;
    subtitle: string;
    /** דירוג ברירת מחדל שמוצג עד שיש ולפחות ביקורת מאושרת אחת בטבלה */
    averageRating: string;
    ratingAriaLabel: (rating: number) => string;
    writeReviewCta: string;
    toastMessage: string;
    /** מוצג בזמן שהבקשה ל-Supabase רצה */
    loadingLabel: string;
    /** מוצג כשאין עדיין אף ביקורת מאושרת בטבלה */
    emptyState: string;
    /** מוצג אם השליפה מ-Supabase נכשלה (בעיית רשת/הרשאות) */
    errorState: string;
    /** מוצג אם שליחת הביקורת החדשה נכשלה */
    submitError: string;
    /** מוצג אם נשלחה ביקורת נוספת לפני שחלף זמן ההמתנה בין שליחות */
    rateLimitError: string;
    modal: {
      title: string;
      nameLabel: string;
      namePlaceholder: string;
      ratingLabel: string;
      ratingAria: (stars: number) => string;
      reviewLabel: string;
      reviewPlaceholder: string;
      submitCta: string;
      closeAria: string;
    };
  };
  gallery: {
    kicker: string;
    titlePrefix: string;
    titleHighlight: string;
    prevAria: string;
    nextAria: string;
    goToSlideAria: (position: number) => string;
    /**
     * מספר הצילומים אינו זהה בהכרח בין השפות (למשל האנגלית קיבלה צילום
     * נוסף ב-7 בעוד העברית נשארה ב-6), ולכן זהו מערך גמיש ולא tuple קבוע
     * כמו שאר האוספים בקובץ הזה.
     */
    shots: ShotItem[];
  };
  roadmap: {
    kicker: string;
    titlePrefix: string;
    titleHighlight: string;
    subtitle: string;
    milestones: [TitledItem, TitledItem, TitledItem];
  };
  faq: {
    kicker: string;
    titlePrefix: string;
    titleHighlight: string;
    subtitle: string;
    items: [
      FaqItem,
      FaqItem,
      FaqItem,
      FaqItem,
      FaqItem,
      FaqItem,
      FaqItem,
      FaqItem,
      FaqItem,
    ];
  };
  footer: {
    tagline: string;
    followUs: string;
    linksAriaLabel: string;
    linkPlayStore: string;
    linkPrivacyPolicy: string;
    linkTermsOfService: string;
    socialFacebookAria: string;
    socialInstagramAria: string;
    socialTiktokAria: string;
    copyright: (year: number) => string;
  };
  stickyCta: {
    label: string;
  };
  share: {
    buttonLabel: string;
    copiedLabel: string;
    /** כותרת שנשלחת ל-navigator.share() (שדה title של ה-API) */
    title: string;
    /**
     * בונה את טקסט השיתוף המלא. siteUrl חייב להופיע כטקסט רגיל (לא קישור
     * בתוך קישור אחר) כי זה מה שוואטסאפ סורק כדי למשוך את תמונת ה-OG
     * לתצוגה המקדימה.
     */
    buildText: (siteUrl: string) => string;
  };
  featureRequest: {
    buttonLabel: string;
    modalTitle: string;
    modalSubtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    featureLabel: string;
    featurePlaceholder: string;
    submitCta: string;
    closeAria: string;
    toastMessage: string;
    /** מוצג אם השליחה ל-Supabase נכשלה */
    submitError: string;
    /** מוצג אם נשלחה הצעה נוספת לפני שחלף זמן ההמתנה בין שליחות */
    rateLimitError: string;
  };
  phoneShowcase: {
    /**
     * לעברית זהו נכס ייעודי (mockup-v2.jpg) שנבחר במיוחד להירו. לאנגלית לא
     * סופק נכס מקביל — עד שיסופק אחד, המסך הראשון מתוך צילומי המסך
     * האנגליים (English screenshot1.jpg, מציג משמרת פעילה) משמש תחליף,
     * כי הוא הכי קרוב תוכנית לתמונת ה-mockup העברית (טיימר משמרת רץ).
     */
    mockupSrc: string;
    mockupWidth: number;
    mockupHeight: number;
    mockupAlt: string;
  };
  appPoster: {
    kicker: string;
    titlePrefix: string;
    titleHighlight: string;
    /** נכס ייעודי לכל שפה: הלוגו והסלוגן השיווקי כבר צרובים בתוך התמונה עצמה */
    imageSrc: string;
    imageWidth: number;
    imageHeight: number;
    imageAlt: string;
  };
  cookieConsent: {
    heading: string;
    body: string;
    privacyLinkLabel: string;
    acceptLabel: string;
    rejectLabel: string;
  };
  launchBanner: {
    message: string;
    ctaLabel: string;
  };
  privacy: {
    metaTitle: string;
    metaDescription: string;
    pageTitle: string;
    lastUpdated: string;
    backToHome: string;
    intro: string;
    dataPrinciple: { title: string; body: RichTextSegment[] };
    permissionsTitle: string;
    permissions: [
      PermissionItem,
      PermissionItem,
      PermissionItem,
      PermissionItem,
      PermissionItem,
    ];
    backup: { title: string; body: string };
    driveBackup: {
      title: string;
      paragraph1: RichTextSegment[];
      paragraph2: RichTextSegment[];
      paragraph3: string;
    };
    /** שאלון המשוב האופציונלי בתוך האפליקציה — היוצא מן הכלל היחיד לעיקרון "הכול נשאר במכשיר" */
    feedbackSurvey: { title: string; body: string; deletionRequest: string };
    /** רכישות תוך-אפליקתיות (שדרוג Pro) — מעובדות ע"י Google Play, לא על ידינו */
    inAppPurchases: { title: string; body: string };
    thirdPartySharing: { title: string; body: string };
    /** requestNote נגמר בנקודתיים: אחריו מוצג קישור המייל (ראו PrivacyPolicyContent) */
    dataDeletion: { title: string; body: string; requestNote: string };
    minors: { title: string; body: string };
    /** הנתונים שנאספים דרך אתר השיווק עצמו (טפסים, ניתוח תנועה, אחסון מקומי) — נפרד מהאפליקציה */
    website: {
      title: string;
      items: [PermissionItem, PermissionItem, PermissionItem, PermissionItem];
    };
    policyChanges: { title: string; body: string };
    /** אילו חוקי פרטיות חלים על האפליקציה, ולמה — נוסף לבקשת עמידה בדין */
    applicableLaw: { title: string; body: string };
    contactTitle: string;
    contactBody: string;
  };
  terms: {
    metaTitle: string;
    metaDescription: string;
    pageTitle: string;
    lastUpdated: string;
    backToHome: string;
    intro: string;
    serviceDescription: { title: string; body: string };
    /** גיל מינימלי וזיקה למדיניות הפרטיות */
    eligibility: { title: string; body: string };
    /** אחריות על נתונים וגיבוי */
    dataAndBackup: { title: string; body: string };
    /** רכישת Pro: חד-פעמית כיום, תכונות עתידיות עשויות להיות נפרדות (כולל מנוי), החזרים */
    purchases: { title: string; body: string };
    userResponsibilityTitle: string;
    userResponsibilityItems: [string, string, string];
    intellectualProperty: { title: string; body: string };
    liability: { title: string; body: string };
    changes: { title: string; body: string };
    governingLaw: { title: string; body: string };
    contactTitle: string;
    contactBody: string;
  };
}

/*
 * סעיף הגיל — נוסח זהה בדיוק במדיניות הפרטיות ובתנאי השימוש, בכל שפה. מוגדר פעם אחת כאן
 * כדי שלא ייווצר סטייה בין שני המסמכים.
 */
const AGE_CLAUSE_HE =
  "האפליקציה מיועדת למי שמלאו לו 18 שנים. קטינים מגיל 13 רשאים להשתמש בה רק בהסכמת הורה או אפוטרופוס, והאפליקציה אינה מיועדת לילדים מתחת לגיל 13.";
const AGE_CLAUSE_EN =
  "The app is intended for people aged 18 and over. Minors aged 13 and over may use it only with the consent of a parent or legal guardian, and the app is not intended for children under 13.";

const he: Dictionary = {
  meta: {
    title: "Shift Smart – שעון נוכחות וניהול משמרות",
    description:
      "שעון נוכחות דיגיטלי לניהול משמרות ושכר, מותאם למאבטחים, סדרנים ומסעדות. הורידו את Shift Smart בחינם מ-Google Play.",
    keywords: [
      "ניהול משמרות",
      "שעון נוכחות",
      "מעקב שעות עבודה",
      "דוח שעות",
      "Shift Smart",
    ],
    ogDescription:
      "שעון נוכחות דיגיטלי לניהול משמרות ושכר. הורידו את Shift Smart בחינם מ-Google Play.",
  },
  brand: {
    name: "Shift Smart",
    launchBadge: "זמינה עכשיו ב-Google Play",
  },
  languageSwitcher: {
    hebrewLabel: "עברית",
    englishLabel: "English",
    groupAriaLabel: "בחירת שפה",
  },
  hero: {
    kicker: "המשמרות שלכם. בשליטה מלאה.",
    titleLine1: "עובדים במשמרות?",
    titleLine2: "יש דרך חכמה יותר.",
    subtitle:
      "נהלו את המשמרות שלכם, עקבו אחרי השעות וחשבו את השכר בקלות, ישירות מהטלפון.",
    audience: "מושלם למאבטחים סדרנים, מסעדות וכל מי שחי על משמרות.",
    downloadCta: "הורדה מ-Google Play",
    platformNotice:
      "שימו לב: זמין למכשירי אנדרואיד בלבד.",
  },
  whatsNew: {
    kicker: "עדכונים",
    titlePrefix: "🚀 מה חדש ",
    titleHighlight: "באפליקציה?",
    subtitle: "(עדכונים אחרונים)",
    badgeLabel: "חדש",
    items: [
      {
        title: "זיהוי חגים ותעריף 150%",
        description:
          "האפליקציה מזהה חגים ושבתות ומחשבת בהם אוטומטית תעריף של 150%.",
      },
      {
        title: "יעד כללי וצבירת חופשה ומחלה",
        description:
          "מגדירים יעד כללי, ועוקבים אחרי צבירת ימי החופשה והמחלה שלכם.",
      },
      {
        title: "עד שתי תגיות ועריכת שעת התחלה",
        description:
          "בוחרים עד שתי תגיות לכל משמרת, ואפשר לערוך את שעת ההתחלה גם בזמן שהמשמרת רצה.",
      },
    ],
  },
  aboutTimeTracking: {
    kicker: "למה זה חשוב",
    titlePrefix: "מה זה בעצם ",
    titleHighlight: "שעון נוכחות דיגיטלי?",
    body: "שעון נוכחות דיגיטלי מחליף רישום ידני בפנקס או בזיכרון, ומתעד באופן מדויק מתי התחלתם ומתי סיימתם כל משמרת. עבור עובדים במשמרות — מאבטחים, סדרנים, צוותי מסעדות ועוד — זה ההבדל בין הערכה גסה של השכר לבין ידיעה מדויקת כמה שעות עבדתם וכמה זה שווה, בלי לחכות לתלוש כדי לגלות.",
  },
  quickStart: {
    kicker: "התחלה מהירה",
    titlePrefix: "איך ",
    titleHighlight: "מתחילים",
    titleSuffix: "?",
    subtitle: "שלושה שלבים פשוטים, וכל הנתונים שלכם מוכנים.",
    steps: [
      {
        title: "הורדה מ-Google Play",
        description:
          "מורידים את Shift Smart ישירות מהחנות — האפליקציה זמינה עכשיו לכולם, בלי הרשמה מוקדמת.",
        linkLabel: "לחנות Google Play",
      },
      {
        title: "הגדרת מקום עבודה ותעריף",
        description:
          "מזינים את תעריף השעה שלכם ופרטי מקום העבודה — האפליקציה תדע לחשב את השכר בהתאם.",
      },
      {
        title: "מתחילים להחתים ולראות שכר מדויק",
        description:
          "מכאן האפליקציה עוקבת אחרי המשמרות שלכם ומציגה בכל רגע בדיוק כמה הרווחתם.",
      },
    ],
  },
  features: {
    kicker: "01 — 12",
    titlePrefix: "כל מה שיש ",
    titleHighlight: "בפנים",
    items: [
      {
        title: "החתמה בטביעת אצבע",
        description: "כניסה ויציאה קלה ומאובטחת.",
      },
      {
        title: "מחשבון שכר וטיפים",
        description: "שעות נוספות, שבתות וחגים – הכל אוטומטי.",
      },
      {
        title: "יומן משמרות חכם",
        description:
          "יומן ייעודי בתוך האפליקציה פלוס סנכרון אוטומטי ליומן Google.",
      },
      {
        title: "חיווי קולי",
        description: 'צליל "ביפ" בכל החתמה.',
      },
      {
        title: "דוחות וגיבוי",
        description: "סיכום חודשי מפורט ושיתוף דוחות; ב-Pro: ייצוא Excel חודשי, דוח מס שנתי וגיבוי ל-Drive.",
      },
      {
        title: "וידוא מיקום חכם",
        description: "שמירה מדויקת של תחילת המשמרת.",
      },
      {
        title: "חיסכון בסוללה ופרטיות",
        description: "עיצוב כהה, והנתונים נשארים אצלכם במכשיר כברירת מחדל — גיבוי ל-Drive ומשוב הם אופציונליים.",
      },
      {
        title: "ניהול משרות",
        description:
          "תמיכה במספר מקומות עבודה, כולל הגדרת משמרות בוקר/צהריים/ערב/לילה.",
      },
      {
        title: "פירוט ניכויי שכר מלא",
        description:
          "ביטוח לאומי, מס בריאות, פנסיה, קרן השתלמות ומס הכנסה — כל ניכוי עם אחוז לעריכה משלו והשפעה מיידית על השכר הנטו.",
      },
      {
        title: "ווידג'ט חכם למסך הבית",
        description:
          "הפעלה ועצירה ישירה ממסך הבית, כולל מעקב חי אחרי סטטוס המשמרת.",
      },
      {
        title: "אוטומציה בסיום משמרת",
        description:
          "מעבר אוטומטי לסיכום השעות והקפצת חלון הערות כדי שלא תשכחו שום טיפ.",
      },
      {
        title: "תבניות משמרת וימי חופשה",
        description:
          "יוצרים סדרת משמרות שלמה מדפוס שבועי קבוע בלחיצה אחת, ועוקבים אחרי מכסת ימי המחלה והחופשה השנתית שלכם.",
      },
    ],
  },
  reviews: {
    kicker: "דירוגים וביקורות",
    titlePrefix: "מה ",
    titleHighlight: "אומרים עלינו",
    subtitle: "מבוסס על ביקורות המשתמשים שלנו",
    averageRating: "4.9",
    ratingAriaLabel: (rating) => `דירוג ${rating} מתוך 5 כוכבים`,
    writeReviewCta: "כתוב ביקורת",
    toastMessage: "תודה! הביקורת שלך נשלחה לאישור.",
    loadingLabel: "טוען ביקורות...",
    emptyState: "היו הראשונים לכתוב ביקורת על האפליקציה!",
    errorState: "לא הצלחנו לטעון ביקורות כרגע. נסו לרענן את הדף.",
    submitError: "שליחת הביקורת נכשלה. בדקו את החיבור ונסו שוב.",
    rateLimitError: "כבר שלחתם ביקורת לפני רגע. נסו שוב בעוד כחצי דקה.",
    modal: {
      title: "כתיבת ביקורת",
      nameLabel: "שם",
      namePlaceholder: "איך קוראים לך?",
      ratingLabel: "דירוג",
      ratingAria: (stars) => `דירוג ${stars} כוכבים`,
      reviewLabel: "הביקורת שלך",
      reviewPlaceholder: "ספרו לנו איך הייתה החוויה שלכם עם האפליקציה...",
      submitCta: "שליחת ביקורת",
      closeAria: "סגירת חלון הביקורת",
    },
  },
  gallery: {
    kicker: "GALLERY",
    titlePrefix: "הצצה ",
    titleHighlight: "לאפליקציה",
    prevAria: "המסך הקודם",
    nextAria: "המסך הבא",
    goToSlideAria: (position) => `מעבר למסך ${position}`,
    shots: [
      {
        src: "/Screenshot 1.jpg",
        width: 768,
        height: 1376,
        alt: "מסך שעון הנוכחות: כפתור הפעלת שעון בטביעת אצבע, בחירת משרה, תעריף לשעה וצבירה במשמרת",
      },
      {
        src: "/Screenshot 2.jpg",
        width: 768,
        height: 1376,
        alt: "מסך ההגדרות: מצב לילה, בחירת שפת האפליקציה בין עברית לאנגלית וחיסכון סוללה מקסימלי למסכי AMOLED",
      },
      {
        src: "/Screenshot 3.jpg",
        width: 768,
        height: 1376,
        alt: "מסך המשרות: רשימת מקומות עבודה עם תעריף לשעה, החזר נסיעות ומיקום שמור לכל משרה",
      },
      {
        src: "/Screenshot 4.jpg",
        width: 768,
        height: 1376,
        alt: "מסך ההיסטוריה: ייצוא דוח חודשי ל-PDF ולוואטסאפ, ורשימת משמרות עם תאריך, שעות ושכר לכל משמרת",
      },
      {
        src: "/Screenshot 5.jpg",
        width: 768,
        height: 1376,
        alt: "מסך היומן: לוח חודשי עם סימון ימי עבודה והוספת משמרת מתוכננת מראש",
      },
      {
        src: "/Screenshot 6.jpg",
        width: 768,
        height: 1376,
        alt: "מסך הסיכום החודשי: סך הרווח לחודש, שכר נטו משוער, התקדמות מול יעד חודשי ופילוח לפי משרה",
      },
    ],
  },
  roadmap: {
    kicker: "מפת דרכים",
    titlePrefix: "מה מתוכנן ",
    titleHighlight: "להמשך?",
    subtitle:
      "זו רק ההתחלה. אלה הדברים שנמצאים על שולחן העבודה שלנו עכשיו.",
    milestones: [
      {
        title: "גרסת iOS",
        description:
          "אותה אפליקציה בדיוק, עם אותם מסכים ואותם חישובים — גם למשתמשי אייפון.",
      },
      {
        title: "גרסת Pro",
        description:
          "שדרוג Pro כבר זמין ברכישה חד-פעמית. תכונות Pro נוספות נמצאות בתכנון, ולא בהכרח יהיו כלולות ברכישה הקיימת — ייתכן שיוצעו בנפרד, למשל במנוי, ללא מחיר או תאריך סופיים.",
      },
      {
        title: "גיבוי וסנכרון ל-Google Drive",
        description:
          "גיבוי ידני ל-Google Drive כבר זמין. גיבוי אוטומטי וסנכרון נוספים לחשבון ה-Google Drive נמצאים בפיתוח פעיל.",
      },
    ],
  },
  faq: {
    kicker: "FAQ",
    titlePrefix: "שאלות ",
    titleHighlight: "ותשובות",
    subtitle:
      "כל מה שנשאלנו הכי הרבה על חישוב שעות וניהול משמרות. לא מצאתם תשובה? אנחנו זמינים במייל.",
    items: [
      {
        question: "האם צריך תהליך הרשמה מיוחד כדי להוריד את האפליקציה?",
        answer:
          "לא — מורידים את Shift Smart ישירות מ-Google Play, בלי שום תהליך הרשמה מוקדם. מורידים ומתחילים להשתמש מיד.",
      },
      {
        question: "האם האפליקציה בחינם?",
        answer:
          "האפליקציה להורדה בחינם, כולל שעון הנוכחות והחישובים הבסיסיים. בנוסף יש שדרוג Pro אופציונלי ברכישה חד-פעמית דרך Google Play, הכולל גיבוי ושחזור ל-Google Drive (עד 10 גרסאות), ייצוא Excel חודשי ודוח מס שנתי. תכונות Pro חדשות בעתיד לא בהכרח יהיו כלולות ברכישה זו — ייתכן שיוצעו בנפרד, למשל במנוי — ונציין זאת בבירור לפני כל חיוב.",
      },
      {
        question: "מה עושים אם מצאתי באג?",
        answer:
          "נשמח לדעת! אפשר לדווח לנו ישירות במקטע הביקורות למעלה בעמוד, או לשלוח לנו מייל ל-yoseffstor@gmail.com. כל דיווח עוזר לנו לשפר את האפליקציה.",
      },
      {
        question: "איך מחושבות שעות נוספות?",
        answer:
          "בכל משמרת האפליקציה משווה את סך השעות שנצברו לאורך יום העבודה שהגדרתם. כל שעה מעבר לסף מסומנת בנפרד ומחושבת לפי אחוז התוספת שקבעתם, כך שהסכום שמופיע בסיכום החודשי כבר כולל אותן ואין צורך בחישוב ידני.",
      },
      {
        question: "מה קורה אם שכחתי להחתים כניסה או יציאה?",
        answer:
          "אפשר להוסיף או לתקן משמרת ידנית בכל רגע. נכנסים ליומן, בוחרים את התאריך הרלוונטי ומזינים את שעות ההתחלה והסיום. הסיכום החודשי וסך ההכנסות מתעדכנים מיד, בלי לפגוע בשאר המשמרות.",
      },
      {
        question: "אפשר לנהל כמה מקומות עבודה במקביל?",
        answer:
          "כן. מגדירים לכל מקום עבודה תעריף שעתי ואורך משמרת משלו, וכל משמרת משויכת למקום שבו עבדתם בפועל. הדוח החודשי מציג פילוח נפרד לכל מקום עבודה וגם סיכום כולל של כל השעות וההכנסות יחד.",
      },
      {
        question: "מה זה שעון נוכחות דיגיטלי, ולמה עדיף על פנקס או Excel?",
        answer:
          "שעון נוכחות דיגיטלי מתעד לכם אוטומטית את שעת הכניסה והיציאה בכל משמרת, ומחשב מיד כמה שעות עבדתם וכמה זה שווה בכסף — בלי לזכור לרשום ידנית ובלי טעויות חישוב שקורות בפנקס או בגיליון Excel. ב-Shift Smart כל זה קורה על המכשיר שלכם בזמן אמת, כך שבסוף החודש הסיכום כבר מוכן ומדויק.",
      },
      {
        question: "איך Shift Smart מחשבת שעות עבודה ושכר?",
        answer:
          "לכל מקום עבודה מגדירים תעריף שעתי ואורך משמרת משלו; בכל משמרת האפליקציה סופרת את השעות בפועל, ומעבר לסף שקבעתם היא מוסיפה אוטומטית את אחוז השעות הנוספות. הסיכום החודשי מרכז את כל המשמרות מכל מקומות העבודה יחד עם סך ההכנסות, בלי צורך בשום חישוב ידני.",
      },
      {
        question:
          "האם Shift Smart מתאימה לניהול משמרות בעברית, למאבטחים, סדרנים וצוותי מסעדות?",
        answer:
          "כן — האפליקציה מיועדת בדיוק לקהל הזה: מאבטחים, סדרנים, צוותי מסעדות וכל מי שעובד במשמרות משתנות. הממשק כולו בעברית ומותאם RTL, ותומך במספר מקומות עבודה עם תעריפים שונים במקביל — בדיוק המבנה הנפוץ בעבודות משמרות.",
      },
    ],
  },
  footer: {
    tagline: "ניהול משמרות ושעון נוכחות חכם",
    followUs: "עקבו אחרינו",
    linksAriaLabel: "קישורים ויצירת קשר",
    linkPlayStore: "הורדה מ‑Google Play",
    linkPrivacyPolicy: "מדיניות פרטיות",
    linkTermsOfService: "תנאי שימוש",
    socialFacebookAria: "עמוד הפייסבוק של Shift Smart",
    socialInstagramAria: "עמוד האינסטגרם של Shift Smart",
    socialTiktokAria: "עמוד הטיקטוק של Shift Smart",
    copyright: (year) =>
      `© ${year} Shift Smart. כל הזכויות שמורות.`,
  },
  stickyCta: {
    label: "הורידו את Shift Smart",
  },
  share: {
    buttonLabel: "שתף את האפליקציה",
    copiedLabel: "הועתק!",
    title: "הכירו את Shift Smart!",
    buildText: (siteUrl) =>
      `מה הולך? גם לך יוצא לעבור על תלוש המשכורת בסוף החודש ולתהות איך חישבו בדיוק את השעות הנוספות וההפסקות? 📉\nתכלס, חבל על האנרגיות שלך. בין כל הריצות בעבודה, הדוחות והלחץ היומיומי, הדבר האחרון שצריך זה כאב ראש מול גיליונות אקסל מסובכים או חישובים ידניים שלפעמים מפספסים אגורות חשובות.\nבדיוק בשביל זה פיתחנו את Shift Smart – שעון נוכחות חכם שפשוט עושה סדר בראש ובארנק. 📱✨\nמהיום יודעים בדיוק מה השכר המדויק, עד האגורה האחרונה, בלי ניירת ובלי ניחושים מיותרים. האפליקציה מרכזת הכל במקום אחד בצורה פשוטה, שקופה ונוחה שחוסכת לך המון זמן יקר ועצבים.\nשווה לגמרי לבדוק את זה ולראות איך אפשר להקל על עצמך את החיים כבר מהחודש הקרוב.\nכל הפרטים והורדה מהירה מחכים לך ממש כאן:\n${siteUrl}`,
  },
  featureRequest: {
    buttonLabel: "הצעת פיצ'ר",
    modalTitle: "הצעת פיצ'ר",
    modalSubtitle: "יש לכם רעיון שיהפוך את Shift Smart לטובה יותר? נשמח לשמוע.",
    nameLabel: "שם",
    namePlaceholder: "איך קוראים לך?",
    featureLabel: "איזה פיצ'ר תרצו לראות?",
    featurePlaceholder: "ספרו לנו על הרעיון שלכם...",
    submitCta: "שליחת הצעה",
    closeAria: "סגירת חלון הצעת הפיצ'ר",
    toastMessage: "תודה! ההצעה שלך נרשמה ותיבדק.",
    submitError: "שליחת ההצעה נכשלה. בדקו את החיבור ונסו שוב.",
    rateLimitError: "כבר שלחתם הצעה לפני רגע. נסו שוב בעוד כחצי דקה.",
  },
  phoneShowcase: {
    mockupSrc: "/mockup-v2.jpg",
    mockupWidth: 768,
    mockupHeight: 1376,
    mockupAlt:
      "מסך שעון הנוכחות באפליקציית Shift Smart: משמרת פעילה עם טיימר רץ, תעריף לשעה וצבירה מצטברת במשמרת",
  },
  appPoster: {
    kicker: "האפליקציה",
    titlePrefix: "הכירו את ",
    titleHighlight: "Shift Smart",
    imageSrc: "/Sharing image.png",
    imageWidth: 947,
    imageHeight: 1661,
    imageAlt:
      "פוסטר Shift Smart — אייקון האפליקציה והסלוגן: המשמרות שלכם. בשליטה מלאה.",
  },
  cookieConsent: {
    heading: "אנחנו משתמשים בעוגיות",
    body: "האתר משתמש בעוגיות חיוניות לתפעולו ולשיפור החוויה שלכם. לפרטים נוספים ראו את",
    privacyLinkLabel: "מדיניות הפרטיות",
    acceptLabel: "מאשר/ת",
    rejectLabel: "דוחה",
  },
  launchBanner: {
    message: "🎉 זמינה עכשיו ב-Google Play!",
    ctaLabel: "הורידו עכשיו",
  },
  privacy: {
    metaTitle: "מדיניות פרטיות — Shift Smart",
    metaDescription:
      "מדיניות הפרטיות של אפליקציית Shift Smart — אילו נתונים האפליקציה משתמשת בהם, אילו הרשאות היא מבקשת, ואיך נשמרים הנתונים שלך.",
    pageTitle: "מדיניות פרטיות — Shift Smart",
    lastUpdated: "עודכן לאחרונה: 09.10.2026",
    backToHome: "חזרה לדף הבית",
    intro:
      "תודה שאתם משתמשים ב-Shift Smart (\"האפליקציה\"). מדיניות זו מסבירה אילו נתונים האפליקציה משתמשת בהם ואיך.",
    /*
     * דצמבר 2026: נוסח הפסקה עודכן — הניסוח הקודם ("אנחנו לא מפעילים שרת
     * שאוסף... את הנתונים האלה") היה סותר בפועל את התנהגות האפליקציה
     * (שאלון משוב אופציונלי ששולח נתונים לשרת), מה שיצר אי-התאמה מול
     * Google Play Data Safety. הפסקה כאן מציינת מפורשות את היוצא מן הכלל.
     */
    dataPrinciple: {
      title: "עיקרון מרכזי: הנתונים שלך נשארים אצלך",
      body: [
        {
          text: "הנתונים שאתם מזינים (עבודות, משמרות, שכר, הערות, תמונות והגדרות) נשמרים ",
        },
        { text: "רק על המכשיר שלכם", format: "bold" },
        {
          text: ". איננו מפעילים שרת שאוסף את נתוני המשמרות והשכר שלכם, ואיננו מוכרים או משתפים אותם. היוצאים מן הכלל הם שני אלה בלבד, והם אופציונליים: גיבוי לחשבון ה-Google Drive האישי שלכם, ושאלון המשוב, המתוארים בהמשך.",
        },
      ],
    },
    permissionsTitle: "אילו הרשאות האפליקציה מבקשת ולמה",
    permissions: [
      {
        label: "מיקום (כולל ברקע):",
        /* עודכן: תיאור מדויק יותר של השימושים בפועל (אימות בהחתמה, בחירת מיקום במפה) ותלות ב-Google Maps */
        body: "משמש לאימות מיקום בעת החתמה, לבחירת מיקום העבודה במפה, ו(רק אם הפעלתם את האפשרות) לזיהוי יציאה מאזור העבודה גם כשהאפליקציה סגורה, כדי להזכיר להחתים יציאה או לסיים משמרת אוטומטית. נתוני המיקום מעובדים ונשמרים במכשיר בלבד ולא נשלחים לשרת שלנו. הצגת המפה מתבצעת באמצעות Google Maps, ולכן Google מעבדת בקשות מפה לפי מדיניות הפרטיות שלה.",
      },
      {
        label: "התראות:",
        body: "משמשות לתזכורות משמרת מתוכננת, אישורי סיום משמרת, והתראות יעד שכר. כל ההתראות הן מקומיות (Local Notifications) — לא נעשה שימוש בשירותי Push מרוחקים.",
      },
      {
        label: "יומן (קריאה/כתיבה):",
        /* עודכן: נוספה הבהרה מפורשת שגם משמרות מתוכננות (לא רק אירועים קיימים) נכתבות למכשיר בלבד */
        body: "משמשת אך ורק לתכונת סנכרון המשמרות ליומן — ורק אם בחרתם להפעיל או להשתמש בתכונה זו. בעת סנכרון, משמרות מתוכננות נשמרות גם ביומן של המכשיר (ולא רק באפליקציה), ואירועי היומן נוצרים ונקראים מקומית על המכשיר בלבד. איננו שולחים שום נתון יומן לשרת חיצוני. אם היומן שבחרתם מסונכרן עם חשבון ענן (למשל Google), הסנכרון הזה מתבצע על ידי המכשיר או ספק היומן ולא על ידינו.",
      },
      {
        label: "מצלמה/גלריה:",
        body: "משמשות רק אם בחרתם לצרף תמונה (למשל קבלה או תלוש) למשמרת בהיסטוריה. התמונה נשמרת מקומית על המכשיר.",
      },
      {
        label: "אימות ביומטרי (טביעת אצבע/פנים):",
        body: "אופציונלי, לנעילת האפליקציה בלבד — לא נשלח ולא נשמר שום נתון ביומטרי על ידינו; האימות מתבצע כולו על ידי מערכת ההפעלה של המכשיר.",
      },
    ],
    backup: {
      title: "גיבוי ושחזור",
      body: "האפליקציה מאפשרת לכם לייצא גיבוי של הנתונים שלכם לקובץ, ולשתף אותו (לדוגמה לענן האישי שלכם או לאחסון אחר) לפי בחירתכם בלבד. אנחנו לא מקבלים או שומרים עותק מהגיבוי הזה בשום שלב.",
    },
    driveBackup: {
      title: "גיבוי אופציונלי ל-Google Drive",
      paragraph1: [
        { text: "בנוסף לגיבוי המקומי לקובץ, האפליקציה מציעה תכונה " },
        { text: "אופציונלית", format: "bold" },
        {
          text: " — כבויה כברירת מחדל ופועלת רק אם תפעילו אותה — לגיבוי ושחזור של נתוני האפליקציה (עבודות, משמרות ורשומות נלוות) לחשבון ה-Google Drive האישי שלכם. הגיבוי כולל את נתוני האפליקציה (משמרות, עבודות, יעדים, הגדרות וכתובת המייל של חשבון Google המחובר). תמונות, קבלות וקבצים מצורפים אינם מגובים ונשארים במכשיר בלבד. לאחר שחזור במכשיר אחר או לאחר התקנה מחדש הם לא יהיו זמינים. כדי להשתמש בה יש להתחבר במפורש עם חשבון Google ולאשר גישה במסך ההרשאות של Google עצמו.",
        },
      ],
      paragraph2: [
        {
          text: "התכונה משתמשת בהרשאת ה-Drive המוגבלת של Google הידועה בשם ",
        },
        { text: "drive.file", format: "code" },
        { text: ". המשמעות: לאפליקציה יש גישה " },
        { text: "רק", format: "bold" },
        {
          text: " לקבצי הגיבוי שהיא עצמה יצרה — היא לא יכולה לראות, לגשת או לנהל שום קובץ, תמונה, מסמך או תיקייה אחרים שכבר קיימים בחשבון ה-Drive שלכם. בכל גיבוי נוצר קובץ גיבוי חדש ומתוארך. האפליקציה שומרת עד 10 גיבויים אחרונים ומוחקת אוטומטית ישנים יותר, ורק קבצים שהאפליקציה עצמה יצרה. בעת שחזור אתם בוחרים איזה גיבוי לשחזר, ולפני כל שחזור נשמר במכשיר עותק ביטחון זמני של הנתונים הנוכחיים. ניתן למחוק כל קובץ גיבוי ישירות מתוך ה-Drive.",
        },
      ],
      paragraph3:
        "שום נתון שנאסף דרך התכונה הזו לא משותף עם שום צד שלישי — הוא נשמר ישירות בחשבון ה-Google Drive שלכם, בשליטתכם המלאה, וניתן למחוק אותו בכל עת ישירות מתוך ה-Drive. ניתוק/יציאה מחשבון ה-Google בהגדרות האפליקציה מבטלים את הגישה הזו.",
    },
    /* חדש: מתעד את שאלון המשוב האופציונלי, שהוא כרגע היוצא היחיד מהכלל "הכול נשאר במכשיר" */
    feedbackSurvey: {
      title: "שאלון משוב (אופציונלי)",
      body: "אם בחרתם למלא את שאלון המשוב בתוך האפליקציה, התשובות שלכם (דירוג של 1–5 כוכבים, סימון בחירות, טקסט חופשי, גרסת האפליקציה, שפה ופלטפורמת המכשיר — למשל Android) נשלחות לשרת שלנו המתארח ב-Cloudflare (שירות ענן שעשוי לעבד מידע גם מחוץ לישראל) ומשמשות לשיפור האפליקציה בלבד. איננו אוספים או שולחים מזהה מכשיר. אם תבחרו להזין שם, הוא יישלח יחד עם התשובות. אם לא תזינו שם, המשוב אנונימי. כתובת ה-IP של המכשיר נחשפת טכנית לשרת בעת השליחה, ומשמשת רק להגבלת קצב נגד ספאם, ואינה נשמרת עם התשובות. אין חובה למלא את השאלון.",
      deletionRequest: "לבקשת מחיקת משוב ששלחתם, פנו אלינו במייל:",
    },
    /* חדש: מתעד את תשלומי ה-Pro תוך-אפליקתיים לצורך התאמה ל-Data Safety */
    inAppPurchases: {
      title: "רכישות בתוך האפליקציה",
      body: "רכישות בתוך האפליקציה (שדרוג Pro, רכישה חד-פעמית) מעובדות על ידי Google Play. איננו מקבלים ואיננו שומרים פרטי תשלום. סטטוס הרכישה נקבע לפי Google Play ונשמר גם במכשיר, כדי שהתכונות ימשיכו לעבוד. פרטי הרכישה, ההחזרים ותכונות Pro עתידיות מפורטים בתנאי השימוש.",
    },
    thirdPartySharing: {
      title: "שיתוף עם צדדים שלישיים",
      body: "האפליקציה מאפשרת לכם לשתף דוחות (PDF/טקסט) בעצמכם דרך אפליקציות אחרות המותקנות על המכשיר (למשל וואטסאפ, מייל) — זו פעולה יזומה שלכם, ואנחנו לא מעורבים בהעברת המידע הזה ולא רואים אותו.",
    },
    dataDeletion: {
      title: "מחיקת נתונים",
      body: "אתם יכולים למחוק עבודות, משמרות בודדות, או לאפס את כל נתוני האפליקציה בכל עת מתוך ההגדרות. מחיקה כזו היא מיידית ומלאה על המכשיר. גיבויים בחשבון ה-Google Drive שלכם ניתן למחוק ישירות משם.",
      requestNote:
        "נתונים שנשמרו אצלנו (משוב שנשלח מהאפליקציה, וביקורות או הצעות פיצ'ר שנשלחו דרך האתר): לבקשת עיון, תיקון או מחיקה, פנו אלינו במייל:",
    },
    minors: {
      title: "קטינים",
      body: `${AGE_CLAUSE_HE} איננו אוספים ביודעין מידע מילדים מתחת לגיל 13.`,
    },
    website: {
      title: "הנתונים באתר זה",
      items: [
        {
          label: "ביקורות והצעות פיצ'ר:",
          body: "כששולחים ביקורת דרך האתר, נשמרים במסד הנתונים שלנו (Supabase) השם שהוזן, הדירוג (1–5 כוכבים) ותוכן הביקורת. בהצעת פיצ'ר נשמרים השם ותיאור הרעיון. ביקורת מוצגת באתר (שם ותוכן) רק לאחר אישור ידני שלנו. אין חובה לשלוח אותן, ומומלץ לא לכלול בהן פרטים אישיים. שירות הענן של Supabase עשוי לאחסן מידע גם בשרתים מחוץ לישראל. לבקשת מחיקה, ראו את הסעיף \"מחיקת נתונים\" למעלה.",
        },
        {
          label: "Vercel Analytics:",
          body: "סטטיסטיקות תנועה אנונימיות לאתר (למשל צפיות בדפים), ללא שימוש בעוגיות.",
        },
        {
          label: "Google Analytics:",
          body: "תג Google נטען רק אם אישרתם עוגיות בבאנר ההסכמה, ומשמש לסטטיסטיקות שימוש באתר. אם דחיתם או לא בחרתם — הוא לא נטען.",
        },
        {
          label: "אחסון מקומי בדפדפן:",
          body: "נשמרות העדפת השפה שבחרתם והבחירה שלכם בבאנר העוגיות, כדי לזכור אותן בביקורים הבאים.",
        },
      ],
    },
    policyChanges: {
      title: "שינויים במדיניות זו",
      body: "ייתכן שנעדכן מדיניות זו מעת לעת עם הוספת פיצ'רים לאפליקציה. נעדכן את תאריך \"עודכן לאחרונה\" בראש העמוד בכל שינוי מהותי.",
    },
    applicableLaw: {
      title: "אילו חוקי פרטיות חלים על מדיניות זו",
      body: "האפליקציה מיועדת בעיקרה למשתמשים בישראל ופותחה על ידי מפתח ישראלי, ולכן מדיניות זו כפופה לחוק הגנת הפרטיות הישראלי, כפי שתוקן בתיקון 13 (בתוקף מאוגוסט 2025), המחייב שקיפות לגבי איסוף ושימוש במידע אישי. האפליקציה אינה מכוונת לתושבי האיחוד האירופי או קליפורניה. אם וכאשר בסיס המשתמשים יתרחב לאזורים אלו בהיקף משמעותי, נבחן את הדרישות החלות עלינו ונעדכן מדיניות זו בהתאם.",
    },
    contactTitle: "יצירת קשר",
    contactBody:
      "Shift Smart מופעלת על ידי מפתח עצמאי בישראל. לשאלות בנוגע למדיניות פרטיות זו, ניתן ליצור קשר בכתובת:",
  },
  terms: {
    metaTitle: "תנאי שימוש — Shift Smart",
    metaDescription:
      "תנאי השימוש באפליקציית Shift Smart — הסכמה לתנאים, תיאור השירות, גיל מינימלי, רכישות Pro, אחריות המשתמש, קניין רוחני והגבלת אחריות.",
    pageTitle: "תנאי שימוש — Shift Smart",
    lastUpdated: "עודכן לאחרונה: 09.10.2026",
    backToHome: "חזרה לדף הבית",
    intro:
      "תנאי שימוש אלה (\"התנאים\") חלים על השימוש באפליקציית Shift Smart (\"האפליקציה\"). התקנת האפליקציה או השימוש בה מהווים הסכמה מלאה לתנאים אלה. אם אינכם מסכימים לחלק כלשהו מתנאים אלה, אנא הימנעו משימוש באפליקציה.",
    serviceDescription: {
      title: "תיאור השירות",
      body: "Shift Smart היא אפליקציית אנדרואיד מקומית (offline-first) לניהול משמרות, שעון נוכחות וחישוב שכר. האפליקציה מסייעת לכם לעקוב אחרי שעות העבודה, לחשב שכר, שעות נוספות ותוספות בהתאם לנתונים שאתם מזינים, ולייצא דוחות וסיכומים. Shift Smart אינה שירות תשלומי שכר רשמי, אינה מחוברת למעסיק שלכם, ואינה מבצעת העברת כספים, למעט רכישת Pro האופציונלית המעובדת על ידי Google Play.",
    },
    eligibility: {
      title: "גיל מינימלי ופרטיות",
      body: `${AGE_CLAUSE_HE} השימוש באפליקציה כפוף גם למדיניות הפרטיות באתר, המסבירה אילו נתונים נשמרים ואיפה.`,
    },
    dataAndBackup: {
      title: "אחריות על נתונים וגיבוי",
      body: "ייתכנו תקלות או שגיאות חישוב. מומלץ לגבות את הנתונים באופן שוטף דרך תכונת הגיבוי באפליקציה.",
    },
    purchases: {
      title: "רכישות Pro",
      body: "האפליקציה כוללת שדרוג Pro אופציונלי, הנרכש ברכישה חד-פעמית דרך Google Play. המחיר מוצג ב-Google Play לפני הרכישה, והרכישה כוללת את תכונות ה-Pro הקיימות במועד הרכישה. תכונות Pro חדשות שנוסיף בעתיד אינן בהכרח כלולות ברכישה זו, וייתכן שיוצעו בנפרד, לרבות במסגרת מנוי או בתשלום נוסף; במקרה כזה נציין זאת בבירור לפני כל חיוב. התשלום וההחזרים כפופים לתנאי Google Play ולמדיניות ההחזרים שלה (בדרך כלל ניתן לבקש החזר דרך Google בתוך 48 שעות מהרכישה), ובכל מקרה מבלי לגרוע מזכויותיכם לפי דיני הגנת הצרכן. לפניות בנושא רכישה ניתן לפנות אלינו גם במייל.",
    },
    userResponsibilityTitle: "אחריות המשתמש",
    userResponsibilityItems: [
      "אתם אחראים להזין נתונים מדויקים — שעות עבודה, תעריף שעתי ותוספות — שכן דיוק החישובים תלוי לחלוטין בנתונים שהזנתם.",
      "Shift Smart היא כלי עזר בלבד ואינה תחליף לתלוש השכר הרשמי או לבדיקה מול המעסיק שלכם. חובה לוודא כל תשלום שכר בפועל מול המעסיק ומול תלוש השכר הרשמי.",
      "אתם אחראים לשימוש חוקי באפליקציה בלבד, ולא להשתמש בה בניגוד לכל דין או להסכם העסקה שלכם.",
    ],
    intellectualProperty: {
      title: "קניין רוחני",
      body: "כל הזכויות באפליקציה — לרבות הקוד, העיצוב, הלוגו והתוכן — שייכות לבעלי Shift Smart. אין להעתיק, להנדס לאחור, להפיץ מחדש או ליצור יצירות נגזרות מהאפליקציה ללא אישור מראש ובכתב.",
    },
    liability: {
      title: "הגבלת אחריות",
      body: "האפליקציה מסופקת \"כפי שהיא\" (AS IS), ללא התחייבות לדיוק, זמינות רצופה או התאמה למטרה מסוימת. במידה המרבית שהדין מתיר, Shift Smart ומפתחיה לא יישאו באחריות לנזק ישיר או עקיף שייגרם כתוצאה משימוש באפליקציה, לרבות טעויות חישוב שכר, אובדן נתונים או אי-זמינות זמנית של השירות. אין באמור כדי לפגוע בזכויות שהדין הקוגנטי, ובכלל זה דיני הגנת הצרכן, מקנה לכם ושאינן ניתנות להתניה, או באחריות שאי אפשר להגביל לפי דין.",
    },
    changes: {
      title: "שינויים באפליקציה ובתנאים",
      body: "אנחנו רשאים לעדכן, לשנות או להפסיק תכונות באפליקציה בכל עת. ייתכן שנעדכן גם את תנאי השימוש הללו מעת לעת — נעדכן את תאריך \"עודכן לאחרונה\" בראש העמוד בכל שינוי מהותי. המשך שימוש באפליקציה לאחר עדכון מהווה הסכמה לתנאים המעודכנים.",
    },
    governingLaw: {
      title: "דין חל וסמכות שיפוט",
      body: "תנאי שימוש אלה כפופים לדיני מדינת ישראל. סמכות השיפוט בכל מחלוקת הנוגעת אליהם נתונה לבתי המשפט המוסמכים בישראל, וזאת מבלי לגרוע מכל זכות שהדין הקוגנטי מקנה לכם כצרכנים.",
    },
    contactTitle: "יצירת קשר",
    contactBody:
      "Shift Smart מופעלת על ידי מפתח עצמאי בישראל. לשאלות בנוגע לתנאי שימוש אלה, ניתן ליצור קשר בכתובת:",
  },
};

const en: Dictionary = {
  meta: {
    title: "Shift Smart – Time Clock & Shift Management",
    description:
      "A digital time clock app for shift management and payroll — built for security guards, stewards, and restaurant staff. Download Shift Smart free on Google Play.",
    keywords: [
      "shift management",
      "time clock",
      "work hours tracking",
      "hours report",
      "Shift Smart",
    ],
    ogDescription:
      "A digital time clock app for shift management and payroll. Download Shift Smart free on Google Play.",
  },
  brand: {
    name: "Shift Smart",
    launchBadge: "Now available on Google Play",
  },
  languageSwitcher: {
    hebrewLabel: "עברית",
    englishLabel: "English",
    groupAriaLabel: "Language selection",
  },
  hero: {
    kicker: "Your shifts. In control.",
    titleLine1: "Work shifts?",
    titleLine2: "There's a smarter way.",
    subtitle:
      "Manage your shifts, track your hours, and calculate your pay easily right from your phone.",
    audience:
      "Perfect for security guards, stewards, restaurant staff, and anyone living life in shifts.",
    downloadCta: "Get it on Google Play",
    platformNotice:
      "Please note: Android devices only for now.",
  },
  whatsNew: {
    kicker: "UPDATES",
    titlePrefix: "🚀 What's ",
    titleHighlight: "New?",
    subtitle: "(Latest Updates)",
    badgeLabel: "NEW",
    items: [
      {
        title: "Holiday Detection and 150% Rate",
        description:
          "The app detects holidays and Saturdays and automatically applies a 150% rate to them.",
      },
      {
        title: "General Goal, Vacation & Sick Accrual",
        description:
          "Set a general goal, and track how your vacation and sick days accrue.",
      },
      {
        title: "Up to Two Tags and Editable Start Time",
        description:
          "Choose up to two tags per shift, and edit the start time even while the shift is running.",
      },
    ],
  },
  aboutTimeTracking: {
    kicker: "Why it matters",
    titlePrefix: "What is a ",
    titleHighlight: "digital time clock?",
    body: "A digital time clock replaces manual notes in a paper log or your memory, accurately recording exactly when each shift started and ended. For shift workers — security guards, stewards, restaurant staff, and more — that's the difference between a rough guess at your pay and knowing exactly how many hours you worked and what they're worth, without waiting for a payslip to find out.",
  },
  quickStart: {
    kicker: "GET STARTED",
    titlePrefix: "How do ",
    titleHighlight: "you get started",
    titleSuffix: "?",
    subtitle: "Three simple steps, and your data is ready to go.",
    steps: [
      {
        title: "Download from Google Play",
        description:
          "Get Shift Smart straight from the store — the app is available to everyone now, no sign-up required.",
        linkLabel: "Go to Google Play",
      },
      {
        title: "Set Up Your Workplace and Rate",
        description:
          "Enter your hourly rate and workplace details — the app will calculate your pay accordingly.",
      },
      {
        title: "Start Clocking In and See Accurate Pay",
        description:
          "From here the app tracks your shifts and shows you exactly how much you've earned, in real time.",
      },
    ],
  },
  features: {
    kicker: "01 — 12",
    titlePrefix: "Everything ",
    titleHighlight: "Inside",
    items: [
      {
        title: "Fingerprint Clock-in",
        description: "Easy, secure clock-in and clock-out.",
      },
      {
        title: "Wage & Tips Calculator",
        description:
          "Overtime, weekends, and holidays — all calculated automatically.",
      },
      {
        title: "Smart Shift Calendar",
        description:
          "A dedicated in-app calendar plus automatic sync with Google Calendar.",
      },
      {
        title: "Audio Alerts",
        description: 'A "beep" sound with every clock-in.',
      },
      {
        title: "Reports & Backup",
        description:
          "Detailed monthly summaries and report sharing; in Pro: monthly Excel export, yearly tax report, and Drive backup.",
      },
      {
        title: "Smart Location Check",
        description: "Precisely records where your shift began.",
      },
      {
        title: "Battery Saving & Privacy",
        description: "Dark design, and your data stays on your device by default — Drive backup and feedback are optional.",
      },
      {
        title: "Multiple Workplaces",
        description:
          "Support for multiple workplaces, including morning/noon/evening/night shift setups.",
      },
      {
        title: "Full Salary Deductions Breakdown",
        description:
          "National Insurance, health tax, pension, study fund, and income tax — each deduction with its own editable rate and instant effect on your net pay.",
      },
      {
        title: "Smart Home Screen Widget",
        description:
          "Start and stop directly from your home screen with live shift tracking.",
      },
      {
        title: "Shift End Automation",
        description:
          "Auto-redirect to hours summary and quick notes pop-up so you never forget a tip.",
      },
      {
        title: "Shift Templates & Time Off",
        description:
          "Generate a whole series of shifts from a fixed weekly pattern in one tap, and track your annual sick and vacation day balance.",
      },
    ],
  },
  reviews: {
    kicker: "RATINGS & REVIEWS",
    titlePrefix: "What ",
    titleHighlight: "People Say",
    subtitle: "Based on our users' reviews",
    averageRating: "4.9",
    ratingAriaLabel: (rating) => `Rated ${rating} out of 5 stars`,
    writeReviewCta: "Write a Review",
    toastMessage: "Thank you! Your review has been submitted for approval.",
    loadingLabel: "Loading reviews...",
    emptyState: "Be the first to review the app!",
    errorState: "We couldn't load reviews right now. Try refreshing the page.",
    submitError: "Couldn't submit your review. Check your connection and try again.",
    rateLimitError: "You just submitted a review. Please try again in about half a minute.",
    modal: {
      title: "Write a Review",
      nameLabel: "Name",
      namePlaceholder: "What's your name?",
      ratingLabel: "Rating",
      ratingAria: (stars) => `Rate ${stars} stars`,
      reviewLabel: "Your Review",
      reviewPlaceholder: "Tell us about your experience with the app...",
      submitCta: "Submit Review",
      closeAria: "Close review dialog",
    },
  },
  gallery: {
    kicker: "GALLERY",
    titlePrefix: "A Look ",
    titleHighlight: "Inside the App",
    prevAria: "Previous screen",
    nextAria: "Next screen",
    goToSlideAria: (position) => `Go to screen ${position}`,
    /*
     * הצילומים האנגליים מציגים סט מסכים שונה במקצת מהעברי — למשל אין כאן
     * מסכי היסטוריה/יומן נפרדים, אך יש מסך "מוכן להתחיל" (idle) ושני מסכי
     * הגדרות. ה-alt כאן מתאר בדיוק את מה שמופיע בכל תמונה אנגלית בפועל,
     * ולא תרגום מילולי של ה-alt העברי המקביל.
     */
    shots: [
      {
        src: "/English screenshot1.png",
        width: 941,
        height: 1672,
        alt: "Active shift screen: running timer with a Clock Out button, hourly rate, and current shift earnings",
      },
      {
        src: "/English screenshot2.png",
        width: 941,
        height: 1672,
        alt: "Idle clock screen: \"Ready to start working\" with a Start Clock button and fingerprint authentication prompt",
      },
      {
        src: "/English screenshot3.png",
        width: 941,
        height: 1672,
        alt: "Jobs screen: list of workplaces with hourly rate, travel reimbursement, and saved location for each job",
      },
      {
        src: "/English screenshot4.png",
        width: 941,
        height: 1672,
        alt: "Monthly summary screen: total earnings for the month, progress toward a monthly goal, and a breakdown by job",
      },
      {
        src: "/English screenshot5.png",
        width: 941,
        height: 1672,
        alt: "Settings screen: night mode, in-app language toggle between Hebrew and English, and vibration feedback",
      },
      {
        src: "/English screenshot6.png",
        width: 941,
        height: 1672,
        alt: "Settings screen: sound alerts, maximum battery saving for AMOLED screens, and fingerprint/Face ID clock-in",
      },
      {
        src: "/English screenshot7.png",
        width: 941,
        height: 1672,
        alt: "Settings screen: dark mode toggle, in-app language switch between English and Hebrew, and quick clock vibration/sound options",
      },
    ],
  },
  roadmap: {
    kicker: "Roadmap",
    titlePrefix: "What's ",
    titleHighlight: "Coming Next?",
    subtitle:
      "This is just the beginning. Here's what's on our desk right now.",
    milestones: [
      {
        title: "iOS Version",
        description:
          "The exact same app, with the same screens and the same calculations — for iPhone users too.",
      },
      {
        title: "Pro Tier",
        description:
          "The Pro upgrade is already available as a one-time purchase. Additional Pro features are being planned and are not necessarily included in the existing purchase — they may be offered separately, for example as a subscription, with no final price or date yet.",
      },
      {
        title: "Google Drive Backup & Sync",
        description:
          "Manual backup to Google Drive is already available. Automatic backup and sync to your Google Drive account are actively in development.",
      },
    ],
  },
  faq: {
    kicker: "FAQ",
    titlePrefix: "Frequently Asked ",
    titleHighlight: "Questions",
    subtitle:
      "The questions we get asked the most about calculating hours and managing shifts. Can't find your answer? We're available by email.",
    items: [
      {
        question: "Do I need to sign up for anything special to download the app?",
        answer:
          "No — you download Shift Smart straight from Google Play, with no sign-up process beforehand. Just install it and get started right away.",
      },
      {
        question: "Is the app free?",
        answer:
          "The app is free to download, including the time clock and the core calculations. There is also an optional Pro upgrade, bought as a one-time purchase through Google Play, which includes backup and restore to Google Drive (up to 10 versions), monthly Excel export, and a yearly tax report. New Pro features added in the future are not necessarily included in this purchase — they may be offered separately, for example as a subscription — and we will state it clearly before any charge.",
      },
      {
        question: "What should I do if I find a bug?",
        answer:
          "We'd love to know! You can report it directly in the reviews section above, or email us at yoseffstor@gmail.com. Every report helps us improve the app.",
      },
      {
        question: "How is overtime calculated?",
        answer:
          "In every shift, the app compares the total hours accrued across the workday you defined. Every hour beyond the threshold is marked separately and calculated using the overtime percentage you set, so the number in your monthly summary already includes it — no manual math required.",
      },
      {
        question: "What if I forget to clock in or out?",
        answer:
          "You can add or fix a shift manually at any time. Open the calendar, pick the relevant date, and enter the start and end times. The monthly summary and total income update immediately, without affecting your other shifts.",
      },
      {
        question: "Can I manage several workplaces at once?",
        answer:
          "Yes. Each workplace gets its own hourly rate and shift length, and every shift is linked to the place you actually worked at. The monthly report shows a separate breakdown per workplace, plus one combined summary of all hours and income.",
      },
      {
        question: "What is a digital time clock, and why is it better than a paper log or Excel?",
        answer:
          "A digital time clock automatically records your clock-in and clock-out times for every shift, and instantly calculates how many hours you worked and how much that's worth — no manual writing, and none of the calculation mistakes that creep into a paper log or spreadsheet. With Shift Smart, all of this happens on your device in real time, so your monthly summary is ready and accurate by the end of the month.",
      },
      {
        question: "How does Shift Smart calculate work hours and pay?",
        answer:
          "You set an hourly rate and shift length for each workplace; during every shift the app tracks your actual hours, and once you pass the threshold you defined, it automatically adds the overtime percentage. The monthly summary brings together every shift from every workplace along with total income, with no manual math needed.",
      },
      {
        question:
          "Does Shift Smart support Hebrew shift management for security guards, stewards, and restaurant staff?",
        answer:
          "Yes — the app is built exactly for that audience: security guards, stewards, restaurant staff, and anyone working variable shifts. The entire interface is in Hebrew with full RTL support, and it handles multiple workplaces with different rates at once — exactly the structure common in shift-based jobs.",
      },
    ],
  },
  footer: {
    tagline: "Smart shift management and time clock",
    followUs: "Follow us",
    linksAriaLabel: "Links and contact",
    linkPlayStore: "Get it on Google Play",
    linkPrivacyPolicy: "Privacy Policy",
    linkTermsOfService: "Terms of Service",
    socialFacebookAria: "Shift Smart on Facebook",
    socialInstagramAria: "Shift Smart on Instagram",
    socialTiktokAria: "Shift Smart on TikTok",
    copyright: (year) =>
      `© ${year} Shift Smart. All rights reserved.`,
  },
  stickyCta: {
    label: "Download Shift Smart",
  },
  share: {
    buttonLabel: "Share App",
    copiedLabel: "Copied!",
    title: "Meet Shift Smart!",
    buildText: (siteUrl) =>
      `What's going on? Do you also dread checking your payslip at the end of the month, wondering exactly how they calculated your overtime and breaks? 📉\nHonestly, it's not worth the energy. Between the running around at work, the reports, and the daily pressure, the last thing you need is a headache over complicated spreadsheets or manual calculations that sometimes miss important cents.\nThat's exactly why we built Shift Smart – a smart time clock that simply gets your head and your wallet in order. 📱✨\nFrom today, you'll know exactly what your pay is, down to the last cent, without paperwork and without unnecessary guesswork. The app brings everything together in one simple, transparent, convenient place that saves you tons of precious time and stress.\nIt's definitely worth checking out and seeing how you can make your life easier starting next month.\nAll the details and a quick download are waiting for you right here:\n${siteUrl}`,
  },
  featureRequest: {
    buttonLabel: "Suggest a Feature",
    modalTitle: "Suggest a Feature",
    modalSubtitle: "Got an idea that would make Shift Smart better? We'd love to hear it.",
    nameLabel: "Name",
    namePlaceholder: "What's your name?",
    featureLabel: "What feature would you like to see?",
    featurePlaceholder: "Tell us about your idea...",
    submitCta: "Submit Suggestion",
    closeAria: "Close feature request dialog",
    toastMessage: "Thank you! Your suggestion has been submitted for review.",
    submitError: "Couldn't submit your suggestion. Check your connection and try again.",
    rateLimitError: "You just submitted a suggestion. Please try again in about half a minute.",
  },
  phoneShowcase: {
    mockupSrc: "/English screenshot1.png",
    mockupWidth: 941,
    mockupHeight: 1672,
    mockupAlt:
      "Shift Smart active shift screen: running timer, Clock Out button, hourly rate, and current shift earnings",
  },
  appPoster: {
    kicker: "THE APP",
    titlePrefix: "Meet ",
    titleHighlight: "Shift Smart",
    imageSrc: "/Sharing image2.png",
    imageWidth: 947,
    imageHeight: 1661,
    imageAlt:
      "Shift Smart poster — app icon and tagline: Your shifts. In control.",
  },
  cookieConsent: {
    heading: "We use cookies",
    body: "This site uses essential cookies to operate and improve your experience. For more details, see our",
    privacyLinkLabel: "Privacy Policy",
    acceptLabel: "Accept",
    rejectLabel: "Reject",
  },
  launchBanner: {
    message: "🎉 Now available on Google Play!",
    ctaLabel: "Download now",
  },
  privacy: {
    metaTitle: "Privacy Policy — Shift Smart",
    metaDescription:
      "Shift Smart's privacy policy — what data the app uses, what permissions it requests, and how your data is stored.",
    pageTitle: "Privacy Policy — Shift Smart",
    lastUpdated: "Last updated: 09.10.2026",
    backToHome: "Back to home",
    intro:
      'Thank you for using Shift Smart ("the app"). This policy explains what data the app uses and how.',
    /* Updated to match dataPrinciple in the Hebrew block: the previous wording ("we do not run a server that collects... this data") contradicted the app's actual behavior (the optional feedback survey sends data to a server), which created a mismatch with Google Play's Data Safety form. This wording states the exception explicitly. */
    dataPrinciple: {
      title: "Core Principle: Your Data Stays With You",
      body: [
        {
          text: "The data you enter (jobs, shifts, pay, notes, photos, and settings) is stored ",
        },
        { text: "only on your device", format: "bold" },
        {
          text: ". We do not run a server that collects your shift and pay data, and we do not sell or share it. The only exceptions are these two, both optional: backup to your own personal Google Drive account, and the feedback survey, both described below.",
        },
      ],
    },
    permissionsTitle: "What Permissions the App Requests, and Why",
    permissions: [
      {
        label: "Location (including in the background):",
        /* Updated: more accurate description of the actual uses (verifying location at clock-in, picking the work location on a map) and the Google Maps dependency */
        body: "Used to verify your location when clocking in, to pick the work location on a map, and — only if you enable it — to detect leaving the work area even when the app is closed, in order to remind you to clock out or end the shift automatically. Location data is processed and stored on your device only and is not sent to our server. The map is displayed using Google Maps, so Google processes map requests under its own privacy policy.",
      },
      {
        label: "Notifications:",
        body: "Used for scheduled shift reminders, clock-out confirmations, and pay-goal alerts. All notifications are local (Local Notifications) — no remote push service is used.",
      },
      {
        label: "Calendar (read/write):",
        /* Updated: explicitly clarifies that scheduled shifts, not just existing events, are written to the device only */
        body: "Used solely for the shift-to-calendar sync feature — and only if you choose to enable or use it. When you sync, scheduled shifts are saved to your device's calendar as well (not only inside the app), and calendar events are created and read locally on your device only. We never send any calendar data to an external server. If the calendar you choose is synced to a cloud account (for example, Google), that sync is performed by your device or calendar provider, not by us.",
      },
      {
        label: "Camera/Gallery:",
        body: "Used only if you choose to attach a photo (for example, a receipt or payslip) to a shift in your history. The photo is stored locally on your device.",
      },
      {
        label: "Biometric authentication (fingerprint/face):",
        body: "Optional, used only to lock the app — we never send or store any biometric data ourselves; authentication is handled entirely by your device's operating system.",
      },
    ],
    backup: {
      title: "Backup & Restore",
      body: "The app lets you export a backup of your data to a file and share it (for example, to your personal cloud or other storage) entirely at your own discretion. We never receive or keep a copy of this backup at any stage.",
    },
    driveBackup: {
      title: "Optional Google Drive Backup",
      paragraph1: [
        { text: "In addition to the local file backup, the app offers an " },
        { text: "optional", format: "bold" },
        {
          text: " feature — off by default and active only if you turn it on — to back up and restore your app data (jobs, shifts, and related records) to your personal Google Drive account. The backup includes the app's data (shifts, jobs, goals, settings, and the email address of the connected Google account). Photos, receipts, and attached files are not backed up and stay on your device only. After restoring on another device or after reinstalling, they will not be available. Using it requires you to explicitly sign in with a Google account and grant access on Google's own permission screen.",
        },
      ],
      paragraph2: [
        {
          text: "The feature uses Google's restricted Drive permission known as ",
        },
        { text: "drive.file", format: "code" },
        { text: ". This means the app has access " },
        { text: "only", format: "bold" },
        {
          text: " to the backup files it created itself — it cannot see, access, or manage any other file, photo, document, or folder already in your Drive account. Each backup creates a new, dated backup file. The app keeps up to the 10 most recent backups and automatically deletes older ones, and only files the app itself created. When restoring, you choose which backup to restore, and before every restore a temporary safety copy of your current data is saved on your device. You can delete any backup file directly from your Drive.",
        },
      ],
      paragraph3:
        "No data collected through this feature is shared with any third party — it is stored directly in your Google Drive account, entirely under your control, and can be deleted at any time directly from your Drive. Disconnecting or signing out of the Google account in the app's settings revokes this access.",
    },
    /* New: documents the optional feedback survey, currently the one exception to the "everything stays on-device" principle */
    feedbackSurvey: {
      title: "Feedback Survey (Optional)",
      body: "If you choose to complete the in-app feedback survey, your answers (a 1–5 star rating, selected options, free text, app version, language, and device platform — for example, Android) are sent to our server hosted on Cloudflare (a cloud service that may process data outside Israel) and are used only to improve the app. We do not collect or send a device identifier. If you choose to enter a name, it is sent together with your answers. If you do not enter a name, the feedback is anonymous. Your device's IP address is technically exposed to the server when you submit, is used only for rate limiting against spam, and is not stored with your answers. Completing the survey is not required.",
      deletionRequest: "To request deletion of feedback you have already sent, contact us by email:",
    },
    /* New: documents in-app Pro purchases for Data Safety consistency */
    inAppPurchases: {
      title: "In-App Purchases",
      body: "In-app purchases (Pro upgrade, a one-time purchase) are processed by Google Play. We do not receive or store payment details. The purchase status is determined by Google Play and is also stored on your device so that the features keep working. Purchase details, refunds, and future Pro features are described in the Terms of Service.",
    },
    thirdPartySharing: {
      title: "Sharing With Third Parties",
      body: "The app lets you share reports (PDF/text) yourself through other apps installed on your device (for example, WhatsApp or email) — this is an action you initiate, and we are not involved in transmitting this information and do not see it.",
    },
    dataDeletion: {
      title: "Data Deletion",
      body: "You can delete jobs, individual shifts, or reset all app data at any time from Settings. Such deletion is immediate and complete on your device. Backups in your Google Drive account can be deleted directly from there.",
      requestNote:
        "Data we hold (feedback sent from the app, and reviews or feature requests submitted through the site): to request access, correction, or deletion, contact us by email:",
    },
    minors: {
      title: "Minors",
      body: `${AGE_CLAUSE_EN} We do not knowingly collect information from children under 13.`,
    },
    website: {
      title: "Data on This Website",
      items: [
        {
          label: "Reviews and feature requests:",
          body: "When you submit a review through the site, the name you entered, the rating (1–5 stars), and the review text are stored in our database (Supabase). For a feature request, the name and the idea description are stored. A review is shown on the site (name and text) only after our manual approval. Submitting either is not required, and we recommend not including personal details in them. Supabase's cloud service may store data on servers outside Israel. To request deletion, see the \"Data Deletion\" section above.",
        },
        {
          label: "Vercel Analytics:",
          body: "Anonymous traffic statistics for the site (for example, page views), without the use of cookies.",
        },
        {
          label: "Google Analytics:",
          body: "The Google tag is loaded only if you accept cookies in the consent banner, and is used for website usage statistics. If you decline or make no choice, it is not loaded.",
        },
        {
          label: "Browser local storage:",
          body: "Your chosen language preference and your choice in the cookie banner are saved so they can be remembered on later visits.",
        },
      ],
    },
    policyChanges: {
      title: "Changes to This Policy",
      body: 'We may update this policy from time to time as features are added to the app. We will update the "Last updated" date at the top of the page with every material change.',
    },
    applicableLaw: {
      title: "Which Privacy Laws Apply to This Policy",
      body: "The app is primarily intended for users in Israel and was developed by an Israeli developer, so this policy is governed by Israel's Privacy Protection Law, as amended by Amendment 13 (in effect since August 2025), which requires transparency about the collection and use of personal data. The app is not directed at residents of the European Union or California. If and when our user base expands significantly into those regions, we will review the requirements that apply to us and update this policy accordingly.",
    },
    contactTitle: "Contact Us",
    contactBody:
      "Shift Smart is operated by an independent developer in Israel. For questions about this privacy policy, you can reach us at:",
  },
  terms: {
    metaTitle: "Terms of Service — Shift Smart",
    metaDescription:
      "Shift Smart's terms of service — agreement to the terms, service description, minimum age, Pro purchases, user responsibility, intellectual property, and limitation of liability.",
    pageTitle: "Terms of Service — Shift Smart",
    lastUpdated: "Last updated: 09.10.2026",
    backToHome: "Back to home",
    intro:
      'These Terms of Service ("the Terms") govern your use of the Shift Smart app ("the app"). Installing or using the app constitutes your full agreement to these Terms. If you do not agree to any part of these Terms, please refrain from using the app.',
    serviceDescription: {
      title: "Service Description",
      body: "Shift Smart is a local, offline-first Android app for shift management, time tracking, and pay calculation. The app helps you track your work hours, calculate pay, overtime, and bonuses based on the data you enter, and export reports and summaries. Shift Smart is not an official payroll service, is not connected to your employer, and does not perform any transfer of funds, other than the optional Pro purchase processed by Google Play.",
    },
    eligibility: {
      title: "Minimum Age and Privacy",
      body: `${AGE_CLAUSE_EN} Your use of the app is also subject to the privacy policy on this site, which explains what data is stored and where.`,
    },
    dataAndBackup: {
      title: "Data Responsibility and Backup",
      body: "Faults or calculation errors may occur. We recommend backing up your data regularly using the app's backup feature.",
    },
    purchases: {
      title: "Pro Purchases",
      body: "The app includes an optional Pro upgrade, bought as a one-time purchase through Google Play. The price is shown in Google Play before you buy, and the purchase includes the Pro features that exist at the time of purchase. New Pro features we add in the future are not necessarily included in this purchase and may be offered separately, including as a subscription or for an additional fee; in that case we will state it clearly before any charge. Payment and refunds are subject to Google Play's terms and refund policy (you can usually request a refund through Google within 48 hours of purchase), and in any case without limiting your rights under consumer protection law. For purchase-related questions you can also contact us by email.",
    },
    userResponsibilityTitle: "User Responsibility",
    userResponsibilityItems: [
      "You are responsible for entering accurate data — work hours, hourly rate, and bonuses — since the accuracy of all calculations depends entirely on the data you provide.",
      "Shift Smart is a helper tool only and is not a substitute for your official payslip or for checking with your employer. You must verify every actual pay payment against your employer and your official payslip.",
      "You are responsible for using the app only lawfully, and not in violation of any law or your employment agreement.",
    ],
    intellectualProperty: {
      title: "Intellectual Property",
      body: "All rights in the app — including the code, design, logo, and content — belong to the owners of Shift Smart. You may not copy, reverse-engineer, redistribute, or create derivative works from the app without prior written permission.",
    },
    liability: {
      title: "Limitation of Liability",
      body: "The app is provided \"as is,\" with no warranty of accuracy, continuous availability, or fitness for a particular purpose. To the maximum extent permitted by law, Shift Smart and its developers shall not be liable for any direct or indirect damage resulting from use of the app, including pay calculation errors, data loss, or temporary unavailability of the service. Nothing in this section limits rights that mandatory law, including consumer protection law, grants you and that cannot be waived, or any liability that cannot be limited by law.",
    },
    changes: {
      title: "Changes to the App and These Terms",
      body: 'We may update, change, or discontinue features in the app at any time. We may also update these Terms of Service from time to time — we will update the "Last updated" date at the top of the page with every material change. Continued use of the app after an update constitutes acceptance of the updated Terms.',
    },
    governingLaw: {
      title: "Governing Law and Jurisdiction",
      body: "These Terms of Service are governed by the laws of the State of Israel. The courts of the State of Israel that have competent jurisdiction shall hear any dispute related to them, without limiting any right that mandatory law grants you as a consumer.",
    },
    contactTitle: "Contact Us",
    contactBody:
      "Shift Smart is operated by an independent developer in Israel. For questions about these Terms of Service, you can reach us at:",
  },
};

export const dictionaries: Record<Lang, Dictionary> = { he, en };

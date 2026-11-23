import { MARKETING_SHOTS } from "@/lib/marketingAssets";
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
    planNote: string;
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
      TitledItem,
    ];
  };
  reviews: {
    kicker: string;
    titlePrefix: string;
    titleHighlight: string;
    subtitle: string;
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
    validationError: string;
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
      submittingLabel: string;
      ratingRequired: string;
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
    milestones: [TitledItem];
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
    manualCopyLabel: string;
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
    submittingLabel: string;
    closeAria: string;
    toastMessage: string;
    /** מוצג אם השליחה ל-Supabase נכשלה */
    submitError: string;
    validationError: string;
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
    bugReports: { title: string; body: string; deletionRequest: string };
    /** רכישות תוך-אפליקתיות (שדרוג Pro) — מעובדות ע"י Google Play, לא על ידינו */
    inAppPurchases: { title: string; body: string };
    thirdPartySharing: { title: string; body: string };
    /** requestNote נגמר בנקודתיים: אחריו מוצג קישור המייל (ראו PrivacyPolicyContent) */
    dataDeletion: { title: string; body: string; requestNote: string };
    minors: { title: string; body: string };
    /** הנתונים שנאספים דרך אתר השיווק עצמו (טפסים, ניתוח תנועה, אחסון מקומי) — נפרד מהאפליקציה */
    website: {
      title: string;
      items: [PermissionItem, PermissionItem, PermissionItem, PermissionItem, PermissionItem, PermissionItem];
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
      "נהלו משמרות, תעדו שעות עבודה וקבלו אומדן שכר לפי התעריפים שלכם. Shift Smart זמינה לאנדרואיד להורדה בחינם מ-Google Play.",
    keywords: [
      "ניהול משמרות",
      "שעון נוכחות",
      "מעקב שעות עבודה",
      "דוח שעות",
      "Shift Smart",
    ],
    ogDescription:
      "מעקב אחר משמרות, שעות עבודה ושכר משוער בטלפון. הורידו את Shift Smart בחינם מ-Google Play.",
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
    planNote: "גלו מה אפשר לעשות באפליקציה",
    titleLine1: "עובדים במשמרות?",
    titleLine2: "יש דרך חכמה יותר.",
    subtitle:
      "נהלו את המשמרות, עקבו אחרי שעות העבודה וראו את השכר המשוער לפי התעריף שלכם.",
    audience: "למאבטחים, סדרנים, צוותי מסעדות ולכל מי שעובד במשמרות.",
    downloadCta: "הורדה מ-Google Play",
    platformNotice:
      "זמין לאנדרואיד דרך Google Play.",
  },
  whatsNew: {
    kicker: "עדכונים",
    titlePrefix: "מה חדש ",
    titleHighlight: "באפליקציה?",
    subtitle: "חדש בגרסה 1.8.5",
    badgeLabel: "חדש",
    items: [
      {
            "title": "תקלה או רעיון? דברו איתנו",
            "description": "נכנסים להגדרות ובוחרים ״תקלה או הצעה״. שולחים דיווח או רעיון ישירות מהאפליקציה, ואפשר לצרף צילום מסך שיעזור לנו להבין מה קרה."
      },
      {
            "title": "מסך ניכויים חדש ומסודר",
            "description": "הניכויים מוצגים בצורה ברורה יותר, עם חישוב ביטוח לאומי ומס בריאות לפי מדרגות החישוב."
      },
      {
            "title": "הווידג׳ט נשאר מעודכן",
            "description": "הסכום בווידג׳ט מתעדכן גם כשהאפליקציה סגורה. מעדיפים פרטיות? אפשר להסתיר את הסכומים גם בווידג׳ט."
      }
],
  },
  aboutTimeTracking: {
    kicker: "מעקב שעות",
    titlePrefix: "מה זה בעצם ",
    titleHighlight: "שעון נוכחות דיגיטלי?",
    body: "מחתימים כניסה ויציאה בטלפון, והמשמרות נשמרות במקום אחד. השכר המשוער מחושב לפי השעות, התעריפים וההגדרות שלכם. בסוף החודש אפשר לעבור על הרישום ולהשוות לתלוש השכר.",
  },
  quickStart: {
    kicker: "התחלה מהירה",
    titlePrefix: "איך ",
    titleHighlight: "מתחילים",
    titleSuffix: "?",
    subtitle: "מההורדה ועד למשמרת הראשונה.",
    steps: [
      {
        title: "מורידים את האפליקציה",
        description:
          "מתקינים את Shift Smart מ-Google Play.",
        linkLabel: "לחנות Google Play",
      },
      {
        title: "מגדירים עבודה ותעריף",
        description:
          "מוסיפים מקום עבודה ומזינים תעריף לשעה.",
      },
      {
        title: "מחתימים כניסה ויציאה",
        description:
          "עוקבים אחרי שעות העבודה והשכר המשוער.",
      },
    ],
  },
  features: {
    kicker: "יכולות האפליקציה",
    titlePrefix: "מה אפשר לעשות ",
    titleHighlight: "באפליקציה",
    items: [
      {
        title: "החתמה בטביעת אצבע",
        description: "מאמתים כניסה ויציאה בטביעת אצבע. ביציאה דרך הווידג׳ט מתבקש אישור.",
      },
      {
        title: "חישוב שכר וטיפים",
        description: "רואים את שעות העבודה, הטיפים והשכר המשוער במקום אחד, לפי התעריפים שהגדרתם.",
      },
      {
        title: "יומן משמרות",
        description:
          "מתכננים זמני התחלה וסיום, מקבלים תזכורת להחתים יציאה ומסנכרנים ליומן המכשיר, כולל Google Calendar.",
      },
      {
        title: "צליל בהחתמה",
        description: "שומעים צליל אישור בהחתמת כניסה או יציאה.",
      },
      {
        title: "דוחות וסיכומים",
        description: "צופים בסיכום החודשי, עוברים על המשמרות ומשתפים דוחות מתוך האפליקציה.",
      },
      {
        title: "תיעוד מיקום",
        description: "שומרים את המיקום שבו התחילה המשמרת.",
      },
      {
        title: "הנתונים נשארים אצלכם",
        description: "הנתונים נשמרים במכשיר כברירת מחדל. גיבוי ל-Drive ושליחת משוב הם לבחירתכם.",
      },
      {
        title: "כמה מקומות עבודה",
        description:
          "מגדירים לכל עבודה תעריף משלה ומשמרות בוקר, צהריים, ערב או לילה.",
      },
      {
        title: "פירוט ניכויים",
        description:
          "מגדירים אחוזים לביטוח לאומי, מס בריאות, פנסיה, קרן השתלמות ומס הכנסה, ורואים את השפעתם על אומדן הנטו.",
      },
      {
        title: "ווידג׳ט למסך הבית",
        description:
          "מתחילים ומסיימים משמרת ישירות ממסך הבית ורואים אם השעון פועל.",
      },
      {
        title: "סיכום בסיום המשמרת",
        description:
          "עוברים לסיכום השעות ומוסיפים הערות, למשל על טיפים שקיבלתם.",
      },
      {
        title: "תבניות משמרת וימי חופשה",
        description:
          "קובעים שעות משמרת לכל יום בשבוע ועוקבים אחרי ימי חופשה ומחלה.",
      },
      { title: "דיווח תקלות והצעת פיצ׳רים", description: "מצאתם תקלה או יש לכם רעיון? דרך הגדרות האפליקציה אפשר לשלוח דיווח עם צילום מסך או להציע פיצ׳ר חדש." },
    ],
  },
  reviews: {
    kicker: "דירוגים וביקורות",
    titlePrefix: "מה ",
    titleHighlight: "אומרים עלינו",
    subtitle: "לפי הביקורות שנכתבו באתר",
    ratingAriaLabel: (rating) => `דירוג ${rating} מתוך 5 כוכבים`,
    writeReviewCta: "כתבו ביקורת",
    toastMessage: "תודה! הביקורת נשלחה ותוצג לאחר אישור.",
    loadingLabel: "טוען ביקורות...",
    emptyState: "היו הראשונים לכתוב ביקורת על האפליקציה!",
    errorState: "לא הצלחנו לטעון ביקורות כרגע. נסו לרענן את הדף.",
    validationError: "כתבו שם וביקורת: עד 60 תווים בשם ועד 500 תווים בביקורת. השדות לא יכולים להיות ריקים.",
    submitError: "שליחת הביקורת נכשלה. בדקו את החיבור ונסו שוב.",
    rateLimitError: "נשלחו כמה בקשות בזמן קצר. המתינו מעט ונסו שוב.",
    modal: {
      title: "כתיבת ביקורת",
      nameLabel: "שם",
      namePlaceholder: "השם שלכם",
      ratingLabel: "דירוג",
      ratingAria: (stars) => `דירוג ${stars} כוכבים`,
      reviewLabel: "הביקורת שלכם",
      reviewPlaceholder: "ספרו לנו איך הייתה החוויה שלכם עם האפליקציה...",
      submitCta: "שליחת ביקורת",
      submittingLabel: "שולחים את הביקורת…",
      ratingRequired: "בחרו דירוג כוכבים לפני השליחה.",
      closeAria: "סגירת חלון הביקורת",
    },
  },
  gallery: {
    kicker: "מסכי האפליקציה",
    titlePrefix: "הצצה ",
    titleHighlight: "לאפליקציה",
    prevAria: "המסך הקודם",
    nextAria: "המסך הבא",
    goToSlideAria: (position) => `מעבר למסך ${position}`,
    shots: MARKETING_SHOTS.he,
  },
  roadmap: {
    kicker: "מפת דרכים",
    titlePrefix: "מה מתוכנן ",
    titleHighlight: "להמשך?",
    subtitle:
      "אלה התכונות שמתוכננות להמשך. עדיין אין תאריכי השקה סופיים.",
    milestones: [
      {
        title: "גרסת iOS",
        description:
          "גרסה למשתמשי iPhone נמצאת בתכנון. כיום האפליקציה זמינה לאנדרואיד.",
      },
    ],
  },
  faq: {
    kicker: "FAQ",
    titlePrefix: "שאלות ",
    titleHighlight: "ותשובות",
    subtitle:
      "תשובות על ההורדה, המשמרות וחישובי השכר. לשאלות נוספות אפשר לפנות אלינו במייל.",
    items: [
      {
        question: "איך מורידים את האפליקציה?",
        answer:
          "לוחצים על כפתור ההורדה באתר ומתקינים את Shift Smart מ-Google Play במכשיר אנדרואיד.",
      },
      {
        question: "האם האפליקציה בחינם?",
        answer:
          "כן. אפשר להוריד את האפליקציה ולהשתמש בשעון הנוכחות ובחישובי הבסיס בחינם.",
      },
      {
        question: "מה עושים אם מצאתי באג?",
        answer:
          "אפשר לדווח על תקלה דרך הגדרות האפליקציה ולצרף צילום מסך. אפשר גם לפנות במייל ל-yoseffstor@gmail.com עם תיאור הבעיה ודגם המכשיר.",
      },
      {
        question: "איך מחושבות שעות נוספות?",
        answer:
          "לפי סף יום העבודה ואחוזי התוספת שהגדרתם באפליקציה. שעות שמעבר לסף מחושבות בתעריף המתאים ונכללות בסיכום החודשי.",
      },
      {
        question: "מה קורה אם שכחתי להחתים כניסה או יציאה?",
        answer:
          "אפשר להוסיף משמרת או לתקן אותה ידנית ביומן. בוחרים תאריך ומזינים את שעות ההתחלה והסיום. הסיכום החודשי מתעדכן בהתאם.",
      },
      {
        question: "אפשר לנהל כמה מקומות עבודה במקביל?",
        answer:
          "כן. מגדירים לכל מקום עבודה תעריף ואורך משמרת משלו. הדוח החודשי מציג פירוט לפי מקום עבודה וגם סיכום כולל של השעות והשכר המשוער.",
      },
      {
        question: "אפשר לסנכרן משמרות ליומן?",
        answer:
          "כן. אפשר לסנכרן את המשמרות ליומן המכשיר, כולל יומן Google, לפי היומן שבחרתם.",
      },
      {
        question: "על מה מבוסס חישוב השכר?",
        answer:
          "על השעות שרשמתם, התעריף של כל מקום עבודה והגדרות התוספות והניכויים שלכם. שעות נוספות מחושבות לפי הסף והאחוזים שהגדרתם. הסיכום הוא אומדן שמאפשר להשוות את הרישום לתלוש השכר.",
      },
      {
        question:
          "באילו מכשירים ושפות אפשר להשתמש?",
        answer:
          "האפליקציה זמינה לאנדרואיד, בעברית ובאנגלית. גרסת iPhone נמצאת בתכנון ועדיין אין לה תאריך השקה.",
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
    manualCopyLabel: "לא הצלחנו להעתיק אוטומטית. אפשר לבחור ולהעתיק את הטקסט כאן:",
    title: "הכירו את Shift Smart!",
    buildText: (siteUrl) => `Shift Smart לניהול משמרות ושעות עבודה. אפשר להחתים כניסה ויציאה ולראות שכר משוער לפי התעריף שמגדירים. האפליקציה זמינה לאנדרואיד.\nלפרטים ולהורדה: ${siteUrl}`,
  },
  featureRequest: {
    buttonLabel: "הצעת פיצ'ר",
    modalTitle: "הצעת פיצ'ר",
    modalSubtitle: "איזו אפשרות חסרה לכם באפליקציה? כתבו לנו מה הייתם רוצים להוסיף.",
    nameLabel: "שם",
    namePlaceholder: "השם שלכם",
    featureLabel: "איזה פיצ'ר תרצו לראות?",
    featurePlaceholder: "ספרו לנו על הרעיון שלכם...",
    submitCta: "שליחת הצעה",
    submittingLabel: "שולחים את ההצעה…",
    closeAria: "סגירת חלון הצעת הפיצ'ר",
    toastMessage: "תודה! ההצעה נשלחה ותיבדק.",
    validationError: "הזינו שם והצעה עם תוכן גלוי: עד 60 תווים בשם ועד 1,000 בהצעה.",
    submitError: "שליחת ההצעה נכשלה. בדקו את החיבור ונסו שוב.",
    rateLimitError: "נשלחו כמה בקשות בזמן קצר. המתינו מעט ונסו שוב.",
  },
  phoneShowcase: {
    mockupSrc: MARKETING_SHOTS.he[0].src,
    mockupWidth: 1024,
    mockupHeight: 1536,
    mockupAlt: MARKETING_SHOTS.he[0].alt,
  },
  appPoster: {
    kicker: "האפליקציה",
    titlePrefix: "הכירו את ",
    titleHighlight: "Shift Smart",
    imageSrc: "/marketing/brand-v3/he.png",
    imageWidth: 948,
    imageHeight: 1659,
    imageAlt:
      "פוסטר Shift Smart: המשמרות שלך. בשליטה. עובדים במשמרות? יש דרך חכמה יותר. נהלו את המשמרות שלכם, עקבו אחרי השעות וחשבו את השכר בקלות וישירות מהנייד. משמרות, שעות, שכר ודוחות.",
  },
  cookieConsent: {
    heading: "אנחנו משתמשים בעוגיות",
    body: "באישורכם נפעיל את Google Analytics למדידת השימוש באתר. בחירת השפה וההעדפה שלכם נשמרות בדפדפן. לפרטים ראו את",
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
    lastUpdated: "עודכן לאחרונה: 03.11.2026",
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
          text: ". איננו מפעילים שרת שאוסף את נתוני המשמרות והשכר שלכם ואיננו מוכרים אותם. פעולות שאתם בוחרים לבצע עשויות להעביר מידע מחוץ למכשיר: למשל גיבוי לחשבון Google Drive שלכם, שליחת משוב או דיווח עם תמונה, חיפוש כתובת או בחירת מקום במפה באמצעות Google, שיתוף דוחות וקבצים וסנכרון באמצעות ספק היומן שבחרתם. השימושים האלה מפורטים בהמשך.",
        },
      ],
    },
    permissionsTitle: "אילו הרשאות האפליקציה מבקשת ולמה",
    permissions: [
      {
        label: "מיקום (כולל ברקע):",
        /* עודכן: תיאור מדויק יותר של השימושים בפועל (אימות בהחתמה, בחירת מיקום במפה) ותלות ב-Google Maps */
        body: "משמש לאימות מיקום בעת החתמה, לבחירת מיקום העבודה במפה, ו(רק אם הפעלתם את האפשרות) לזיהוי יציאה מאזור העבודה גם כשהאפליקציה סגורה, כדי להזכיר להחתים יציאה או לסיים משמרת אוטומטית. נתוני המיקום של המכשיר מעובדים ונשמרים במכשיר בלבד ולא נשלחים לשרת שלנו. כאשר מחפשים כתובת או בוחרים את מקום העבודה במפה, הכתובת או הנקודה נשלחות לשירות המיקום של Google כדי למצוא את המקום. הכתובת שנמצאה נשמרת רק בטלפון. הצגת המפה והבקשות האלה מתבצעות באמצעות Google, והן כפופות למדיניות הפרטיות שלה.",
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
        body: "משמשות אם בחרתם לצרף תמונה למשמרת בהיסטוריה או לדיווח על תקלה או הצעת פיצ'ר. תמונה שמצורפת למשמרת נשמרת מקומית במכשיר; תמונה שנשלחת בדיווח מועברת כפי שמתואר בסעיף הדיווחים בהמשך.",
      },
      {
        label: "אימות ביומטרי (טביעת אצבע/פנים):",
        body: "משמש לאימות בהחתמת כניסה ויציאה, בהתאם להגדרות באפליקציה. ביציאה מהווידג׳ט מתבקש אישור. איננו מקבלים או שומרים נתונים ביומטריים; האימות הביומטרי מתבצע על ידי מערכת ההפעלה של המכשיר.",
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
    bugReports: {
      title: "דיווח על תקלה או הצעת פיצ'ר (אופציונלי)",
      body: "אם בחרתם לשלוח דיווח על תקלה מתוך ההגדרות, נשלחים לשרת שלנו המתארח ב-Cloudflare התיאור שכתבתם, דגם המכשיר, גרסת מערכת ההפעלה, גרסת האפליקציה והשפה. אם בחרתם לצרף תמונה (למשל צילום מסך), היא מועברת דרך השרת ישירות אלינו בהודעת Telegram ואינה נשמרת בשרת. הדיווח עצמו נשמר בשרת לצורך תיקון התקלה בלבד. בהצעת פיצ'ר נשלחים רק הטקסט, התמונה (אם צורפה), גרסת האפליקציה והשפה, בלי פרטי מכשיר. אל תצרפו תמונה שיש בה פרטים אישיים שאינכם רוצים לשתף.",
      deletionRequest: "לבקשת מחיקת דיווח, פנו אלינו במייל:",
    },
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
          label: "ביקורות באתר:",
          body: "כששולחים ביקורת דרך האתר, נשמרים במסד הנתונים שלנו (Supabase) השם שהוזן, הדירוג (1–5 כוכבים) ותוכן הביקורת. ביקורת מוצגת באתר (שם ותוכן) רק לאחר אישור ידני שלנו. אין חובה לשלוח אותן, ומומלץ לא לכלול בהן פרטים אישיים. שירות הענן של Supabase עשוי לאחסן מידע גם בשרתים מחוץ לישראל. לבקשת מחיקה, ראו את הסעיף \"מחיקת נתונים\" למעלה.",
        },
        {
          label: "Vercel Analytics:",
          body: "סטטיסטיקות תנועה אנונימיות לאתר (למשל צפיות בדפים), ללא שימוש בעוגיות.",
        },
        {
          label: "סקר ביקוש לגרסת iPhone:",
          body: "השתתפות בסקר היא לבחירתכם. ב-Supabase נשמרות התשובות לגבי סוג המכשיר, עבודה במשמרות ורמת העניין, הערה אם הוזנה, שפת הטופס, מקור הגעה כללי וזמן השליחה. אפשר להשתתף ללא שם, טלפון או מייל. אם בחרתם במפורש לקבל עדכון והזנתם מייל, נשמור גם אותו ואת מועד ההסכמה לצורך עדכונים על גרסת iPhone בלבד. שליחת הסקר אינה שולחת כרגע מייל אוטומטי. התשובות ופרטי הקשר אינם מוצגים לציבור ואינם נשלחים על ידינו ל-Google Analytics. ניתן לבקש מחיקה או להפסיק עדכונים דרך כתובת הקשר במדיניות זו. המידע נשמר לצורך בדיקת הביקוש והעדכונים שביקשתם; שירות Supabase עשוי לאחסן אותו מחוץ לישראל.",
        },
        {
          label: "הרשמה לעדכוני גרסאות:",
          body: "ההרשמה לניוזלטר היא בחירה נפרדת מסקר האייפון. כשהשירות פעיל, כתובת המייל שהזנתם מועברת ל-Sender לצורך משלוח מייל אישור והרשמה לעדכוני גרסאות של Shift Smart. ההצטרפות לרשימה מושלמת לאחר אישור הקישור במייל. אין חובה להירשם כדי להשתמש באתר או לענות לסקר, ואפשר להסיר את ההרשמה בקישור שבכל עדכון או לפנות אלינו בבקשת מחיקה. Sender מעבדת כתובות ומידע על ההרשמה, האישור והמסירה לצורך תפעול השירות, ועשויה לעבד מידע מחוץ לישראל. איננו מעבירים אליה את תשובות סקר האייפון לצורך הניוזלטר. הכתובות אינן מוצגות לציבור ואינן נשלחות על ידינו ל-Google Analytics.",
        },
        {
          label: "Google Analytics:",
          body: "תג Google נטען רק אם אישרתם עוגיות בבאנר ההסכמה, ומשמש לסטטיסטיקות שימוש באתר. אם דחיתם או לא בחרתם — הוא לא נטען.",
        },
        {
          label: "אחסון מקומי בדפדפן:",
          body: "בחירת שפה ידנית והבחירה בבאנר העוגיות נשמרות כדי לזכור אותן בביקורים הבאים. בנוסף, זמני שליחת טפסים נשמרים זמנית ב-sessionStorage לצורך הגבלת שליחות חוזרות במהלך סשן הדפדפן.",
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
      "Manage shifts, record work hours, and estimate pay using your rates. Shift Smart is available for Android, free to download from Google Play.",
    keywords: [
      "shift management",
      "time clock",
      "work hours tracking",
      "hours report",
      "Shift Smart",
    ],
    ogDescription:
      "Track shifts, work hours, and estimated pay on your phone. Download Shift Smart free from Google Play.",
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
    planNote: "Explore the app’s features",
    titleLine1: "Work shifts?",
    titleLine2: "There's a smarter way.",
    subtitle:
      "Manage your shifts, track your work hours, and see estimated pay based on your hourly rate.",
    audience:
      "For security guards, stewards, restaurant staff, and anyone who works shifts.",
    downloadCta: "Get it on Google Play",
    platformNotice:
      "Available for Android on Google Play.",
  },
  whatsNew: {
    kicker: "UPDATES",
    titlePrefix: "What’s ",
    titleHighlight: "new?",
    subtitle: "New in version 1.8.5",
    badgeLabel: "NEW",
    items: [
      {
            "title": "A bug or an idea? Let us know",
            "description": "Open Settings and choose “Bug or suggestion” to send feedback directly from the app. You can attach a screenshot to help us understand what happened."
      },
      {
            "title": "A clearer deductions screen",
            "description": "The redesigned screen makes deductions easier to follow, with National Insurance and health insurance calculated using the applicable brackets."
      },
      {
            "title": "Your widget stays up to date",
            "description": "The widget amount updates even when the app is closed. You can also hide amounts in the widget for more privacy."
      }
],
  },
  aboutTimeTracking: {
    kicker: "TIME TRACKING",
    titlePrefix: "What is a ",
    titleHighlight: "digital time clock?",
    body: "Clock in and out on your phone and keep your shifts in one place. Estimated pay is calculated using your hours, rates, and settings. At the end of the month, review your records and compare them with your payslip.",
  },
  quickStart: {
    kicker: "GET STARTED",
    titlePrefix: "How do ",
    titleHighlight: "you get started",
    titleSuffix: "?",
    subtitle: "From download to your first shift.",
    steps: [
      {
        title: "Download the app",
        description:
          "Install Shift Smart from Google Play.",
        linkLabel: "Go to Google Play",
      },
      {
        title: "Set your job and rate",
        description:
          "Add a workplace and enter your hourly rate.",
      },
      {
        title: "Clock in and out",
        description:
          "Track your work hours and estimated pay.",
      },
    ],
  },
  features: {
    kicker: "APP FEATURES",
    titlePrefix: "What you can do ",
    titleHighlight: "with Shift Smart",
    items: [
      {
        title: "Fingerprint clock-in",
        description: "Verify clock-in and clock-out with your fingerprint. Clocking out through the widget asks for confirmation.",
      },
      {
        title: "Pay and tips",
        description:
          "See your work hours, tips, and estimated pay in one place, using the rates you set.",
      },
      {
        title: "Shift calendar",
        description:
          "Plan start and end times, get a clock-out reminder, and sync shifts to your device calendar, including Google Calendar.",
      },
      {
        title: "Clock-in sound",
        description: "Hear a confirmation sound when you clock in or out.",
      },
      {
        title: "Reports and summaries",
        description:
          "View your monthly summary, review your shifts, and share reports from the app.",
      },
      {
        title: "Location records",
        description: "Save the location where your shift started.",
      },
      {
        title: "Your data, on your device",
        description: "Your data stays on your device by default. Drive backup and sending feedback are optional.",
      },
      {
        title: "Multiple workplaces",
        description:
          "Set a rate for each workplace and define morning, afternoon, evening, or night shifts.",
      },
      {
        title: "Deduction breakdown",
        description:
          "Set rates for National Insurance, health tax, pension, study fund, and income tax, and see their effect on estimated net pay.",
      },
      {
        title: "Home screen widget",
        description:
          "Start and stop a shift from your home screen and see whether the clock is running.",
      },
      {
        title: "End-of-shift summary",
        description:
          "Review your hours and add notes, such as tips you received.",
      },
      {
        title: "Shift templates and time off",
        description:
          "Set shift hours for each weekday and keep track of vacation and sick days.",
      },
      { title: "Bug reports and feature ideas", description: "Found a bug or have an idea? Use the app settings to send a bug report with a screenshot or suggest a new feature." },
    ],
  },
  reviews: {
    kicker: "RATINGS & REVIEWS",
    titlePrefix: "What ",
    titleHighlight: "People Say",
    subtitle: "Based on reviews submitted on this website",
    ratingAriaLabel: (rating) => `Rated ${rating} out of 5 stars`,
    writeReviewCta: "Write a Review",
    toastMessage: "Thank you! Your review has been submitted for approval.",
    loadingLabel: "Loading reviews...",
    emptyState: "Be the first to review the app!",
    errorState: "We couldn't load reviews right now. Try refreshing the page.",
    validationError: "Enter your name and review: up to 60 characters for the name and 500 for the review. Neither field can be blank.",
    submitError: "Couldn't submit your review. Check your connection and try again.",
    rateLimitError: "Several requests were sent in a short time. Please wait and try again.",
    modal: {
      title: "Write a Review",
      nameLabel: "Name",
      namePlaceholder: "What's your name?",
      ratingLabel: "Rating",
      ratingAria: (stars) => `Rate ${stars} stars`,
      reviewLabel: "Your Review",
      reviewPlaceholder: "Tell us about your experience with the app...",
      submitCta: "Submit Review",
      submittingLabel: "Submitting your review…",
      ratingRequired: "Choose a star rating before submitting.",
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
    shots: MARKETING_SHOTS.en,
  },
  roadmap: {
    kicker: "Roadmap",
    titlePrefix: "What's ",
    titleHighlight: "Coming Next?",
    subtitle:
      "Features planned for future updates. Release dates have not been finalized.",
    milestones: [
      {
        title: "iOS Version",
        description:
          "An iPhone version is planned. The app is currently available for Android.",
      },
    ],
  },
  faq: {
    kicker: "FAQ",
    titlePrefix: "Frequently Asked ",
    titleHighlight: "Questions",
    subtitle:
      "Answers about downloading the app, tracking shifts, and calculating pay. Email us if you have another question.",
    items: [
      {
        question: "How do I download the app?",
        answer:
          "Use a download button on this website to open Google Play and install Shift Smart on your Android device.",
      },
      {
        question: "Is the app free?",
        answer:
          "Yes. You can download the app and use the time clock and core calculations for free.",
      },
      {
        question: "What should I do if I find a bug?",
        answer:
          "Report a bug through the app settings and attach a screenshot. You can also email yoseffstor@gmail.com with a description of the problem and your device model.",
      },
      {
        question: "How is overtime calculated?",
        answer:
          "Overtime uses the workday threshold and extra-pay percentages you set in the app. Hours beyond the threshold are calculated at the corresponding rate and included in the monthly summary.",
      },
      {
        question: "What if I forget to clock in or out?",
        answer:
          "Add or edit the shift manually in the calendar. Choose a date and enter the start and end times. The monthly summary updates accordingly.",
      },
      {
        question: "Can I manage several workplaces at once?",
        answer:
          "Yes. Set a rate and shift length for each workplace. The monthly report shows a breakdown by workplace and a combined summary of hours and estimated pay.",
      },
      {
        question: "Can I sync shifts to my calendar?",
        answer:
          "Yes. You can sync shifts to your selected device calendar, including Google Calendar.",
      },
      {
        question: "What is the pay estimate based on?",
        answer:
          "Your recorded hours, each workplace’s hourly rate, and your extra-pay and deduction settings. Overtime uses the threshold and percentages you set. The summary is an estimate you can compare with your payslip.",
      },
      {
        question:
          "Which devices and languages are supported?",
        answer:
          "The app is available for Android in Hebrew and English. An iPhone version is planned, with no release date yet.",
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
    manualCopyLabel: "Automatic copying failed. You can select and copy the text below:",
    title: "Meet Shift Smart!",
    buildText: (siteUrl) => `Shift Smart helps you keep track of shifts and work hours. You can clock in and out and see estimated pay based on your hourly rate. It’s available for Android.\nDetails and download: ${siteUrl}`,
  },
  featureRequest: {
    buttonLabel: "Suggest a Feature",
    modalTitle: "Suggest a Feature",
    modalSubtitle: "What’s missing from the app? Tell us what you’d like to add.",
    nameLabel: "Name",
    namePlaceholder: "What's your name?",
    featureLabel: "What feature would you like to see?",
    featurePlaceholder: "Tell us about your idea...",
    submitCta: "Submit Suggestion",
    submittingLabel: "Submitting your suggestion…",
    closeAria: "Close feature request dialog",
    toastMessage: "Thank you! Your suggestion has been submitted for review.",
    validationError: "Enter a name and suggestion with visible text: up to 60 characters for the name and 1,000 for the suggestion.",
    submitError: "Couldn't submit your suggestion. Check your connection and try again.",
    rateLimitError: "Several requests were sent in a short time. Please wait and try again.",
  },
  phoneShowcase: {
    mockupSrc: MARKETING_SHOTS.en[0].src,
    mockupWidth: 1024,
    mockupHeight: 1536,
    mockupAlt: MARKETING_SHOTS.en[0].alt,
  },
  appPoster: {
    kicker: "THE APP",
    titlePrefix: "Meet ",
    titleHighlight: "Shift Smart",
    imageSrc: "/marketing/brand-v3/en.png",
    imageWidth: 948,
    imageHeight: 1660,
    imageAlt:
      "Shift Smart: Your shifts. In control. Work shifts? There’s a smarter way. Manage your shifts, track your hours, and calculate your pay easily right from your phone. Shifts, hours, pay and reports.",
  },
  cookieConsent: {
    heading: "We use cookies",
    body: "With your permission, we’ll use Google Analytics to measure website usage. Your language and consent preferences are saved in your browser. For details, see our",
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
    lastUpdated: "Last updated: 03.11.2026",
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
          text: ". We do not run a server that collects your shift and pay data, and we do not sell it. Actions you choose may transfer information outside your device, such as backing up to your Google Drive, sending feedback or a report with an image, finding an address or selecting a place through Google, sharing reports and files, or syncing through your selected calendar provider. These uses are described below.",
        },
      ],
    },
    permissionsTitle: "What Permissions the App Requests, and Why",
    permissions: [
      {
        label: "Location (including in the background):",
        /* Updated: more accurate description of the actual uses (verifying location at clock-in, picking the work location on a map) and the Google Maps dependency */
        body: "Used to verify your location when clocking in, to pick the work location on a map, and — only if you enable it — to detect leaving the work area even when the app is closed, in order to remind you to clock out or end the shift automatically. Your device's location data is processed and stored on your device only and is not sent to our server. When you search for an address or pick your workplace on the map, the address or point is sent to Google's location service to find the place. The resulting address is stored only on your phone. The map and these requests are handled by Google and are subject to its own privacy policy.",
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
        body: "Used if you choose to attach an image to a shift in your history, a bug report, or a feature idea. Images attached to shifts stay on your device; images submitted with a report are transferred as described in the reports section below.",
      },
      {
        label: "Biometric authentication (fingerprint/face):",
        body: "Used to verify clock-in and clock-out according to your app settings. Clocking out through the widget asks for confirmation. We do not receive or store biometric data; biometric verification is performed by your device’s operating system.",
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
    bugReports: {
      title: "Bug reports and feature ideas (optional)",
      body: "If you choose to send a bug report from Settings, the description you wrote, the device model, OS version, app version and language are sent to our server hosted on Cloudflare. If you choose to attach an image (e.g. a screenshot), it is passed through the server directly to us as a Telegram message and is not stored on the server. The report itself is stored on the server only to fix the problem. A feature idea sends only the text, the image (if attached), app version and language, without device details. Do not attach an image containing personal details you do not want to share.",
      deletionRequest: "To request deletion of a report, email us:",
    },
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
          label: "Website reviews:",
          body: "When you submit a review through the site, the name you entered, the rating (1–5 stars), and the review text are stored in our database (Supabase). A review is shown on the site (name and text) only after our manual approval. Submitting a review is optional, and we recommend not including personal details in it. Supabase's cloud service may store data on servers outside Israel. To request deletion, see the \"Data Deletion\" section above.",
        },
        {
          label: "Vercel Analytics:",
          body: "Anonymous traffic statistics for the site (for example, page views), without the use of cookies.",
        },
        {
          label: "iPhone interest survey:",
          body: "Participation is optional. Supabase stores your device type, shift-work and interest answers, an optional comment, form language, general referral source and submission time. No name, phone number or email is required. If you explicitly opt in and provide an email, we also store it and the consent time solely for iPhone-version updates. Submitting the survey does not send an automatic email at this time. Responses and contact details are not public and are not sent by us to Google Analytics. You may request deletion or stop updates using the contact address in this policy. Data is retained for demand assessment and the updates you requested; Supabase may store it outside Israel.",
        },
        {
          label: "Release newsletter:",
          body: "Newsletter signup is separate from the iPhone survey. When the service is active, your email is sent to Sender to request a confirmation email and subscribe to Shift Smart release updates. Joining the list is completed after confirming the email link. Signup is not required to use the website or answer the survey. You can unsubscribe in each update or contact us to request deletion. Sender processes email addresses and signup, confirmation and delivery information to operate the service and may process it outside Israel. We do not send iPhone survey answers to Sender for the newsletter. Email addresses are not public and are not sent by us to Google Analytics.",
        },
        {
          label: "Google Analytics:",
          body: "The Google tag is loaded only if you accept cookies in the consent banner, and is used for website usage statistics. If you decline or make no choice, it is not loaded.",
        },
        {
          label: "Browser local storage:",
          body: "Your manual language choice and cookie-banner choice are saved for later visits. Form submission times are also saved temporarily in sessionStorage to limit repeated submissions during the browser session.",
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








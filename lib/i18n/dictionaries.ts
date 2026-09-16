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
    betaBadge: string;
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
    socialProof: string;
    starsAriaLabel: string;
    betaWarning: string;
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
  betaSteps: {
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
    shots: [ShotItem, ShotItem, ShotItem, ShotItem, ShotItem, ShotItem];
  };
  roadmap: {
    kicker: string;
    titlePrefix: string;
    titleHighlight: string;
    subtitle: string;
    milestones: [TitledItem, TitledItem, TitledItem, TitledItem];
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
    imageAlt: string;
  };
  cookieConsent: {
    heading: string;
    body: string;
    privacyLinkLabel: string;
    acceptLabel: string;
    rejectLabel: string;
  };
  openBetaBanner: {
    message: string;
    ctaLabel: string;
  };
}

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
    betaBadge: "בטא פתוחה",
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
    socialProof:
      "הצטרפו למאבטחים, סדרנים ומנהלי משמרות שכבר מנהלים את הזמן שלהם חכם.",
    starsAriaLabel: "חמישה כוכבים",
    betaWarning:
      "שימו לב: זמין למכשירי אנדרואיד בלבד. אנחנו בגרסת בטא (Beta) – משתפרים כל הזמן!",
  },
  whatsNew: {
    kicker: "עדכונים",
    titlePrefix: "🚀 מה חדש ",
    titleHighlight: "באפליקציה?",
    subtitle: "(עדכונים אחרונים)",
    badgeLabel: "חדש",
    items: [
      {
        title: "תגיות משמרת מותאמות אישית",
        description:
          'בוחרים צבע ותעריף משלכם לכל תגית, כולל תגית שבת/מוצ"ש חכמה שמחשבת אוטומטית תעריף 150% גם במשמרת שלא נופלת בשבת בלוח השנה.',
      },
      {
        title: "סימון ימי מחלה וחופשה מהיומן",
        description:
          "מסמנים יום מחלה או חופשה ישירות מתוך תצוגת היומן, והיתרה השנתית שלכם מתעדכנת מיד.",
      },
      {
        title: "עדכון ידני לסכום המשמרת",
        description:
          "לא מסתדר עם החישוב האוטומטי? קובעים סכום סופי משלכם לכל משמרת, שמחליף את החישוב בכל מקום שהשכר מוצג.",
      },
    ],
  },
  aboutTimeTracking: {
    kicker: "למה זה חשוב",
    titlePrefix: "מה זה בעצם ",
    titleHighlight: "שעון נוכחות דיגיטלי?",
    body: "שעון נוכחות דיגיטלי מחליף רישום ידני בפנקס או בזיכרון, ומתעד באופן מדויק מתי התחלתם ומתי סיימתם כל משמרת. עבור עובדים במשמרות — מאבטחים, סדרנים, צוותי מסעדות ועוד — זה ההבדל בין הערכה גסה של השכר לבין ידיעה מדויקת כמה שעות עבדתם וכמה זה שווה, בלי לחכות לתלוש כדי לגלות.",
  },
  betaSteps: {
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
        description: "סיכום חודשי מפורט, ייצוא לוואטסאפ/PDF, ומערכת גיבוי.",
      },
      {
        title: "וידוא מיקום חכם",
        description: "שמירה מדויקת של תחילת המשמרת.",
      },
      {
        title: "חיסכון בסוללה ופרטיות",
        description: "עיצוב כהה, נתונים נשארים אך ורק במכשיר שלכם.",
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
    subtitle: "מבוסס על משתמשי הבטא שלנו",
    averageRating: "4.9",
    ratingAriaLabel: (rating) => `דירוג ${rating} מתוך 5 כוכבים`,
    writeReviewCta: "כתוב ביקורת",
    toastMessage: "תודה! הביקורת שלך נשלחה לאישור.",
    loadingLabel: "טוען ביקורות...",
    emptyState: "היו הראשונים לכתוב ביקורת על הבטא!",
    errorState: "לא הצלחנו לטעון ביקורות כרגע. נסו לרענן את הדף.",
    submitError: "שליחת הביקורת נכשלה. בדקו את החיבור ונסו שוב.",
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
      "הבטא היא רק ההתחלה. אלה הדברים שנמצאים על שולחן העבודה שלנו עכשיו.",
    milestones: [
      {
        title: "גרסת iOS",
        description:
          "אותה אפליקציה בדיוק, עם אותם מסכים ואותם חישובים — גם למשתמשי אייפון.",
      },
      {
        title: "יצירת דוחות מס ישירים",
        description:
          "הפקת דוח שנתי מסודר של שעות והכנסות, מוכן להגשה ולשליחה לרואה החשבון.",
      },
      {
        title: "גרסת Pro",
        description:
          "רבדים נוספים בתשלום מתוכננים לאחר סיום הבטא — כרגע נמצאים בפיתוח, ללא מחיר או תאריך סופיים.",
      },
      {
        title: "גיבוי וסנכרון ל-Google Drive",
        description:
          "גיבוי אוטומטי של הנתונים שלכם ישירות לחשבון ה-Google Drive, בנוסף לגיבוי הידני הקיים — בפיתוח פעיל.",
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
          "לא יותר — Shift Smart עברה לבטא פתוחה, כך שאפשר להוריד אותה ישירות מ-Google Play בלי שום קבוצת בודקים או תהליך הרשמה מוקדם. מורידים ומתחילים להשתמש מיד.",
      },
      {
        question: "האם האפליקציה תישאר בחינם?",
        answer:
          "כן — כל התכונות שזמינות היום ימשיכו להיות חינמיות גם אחרי הבטא. בעתיד ייתכן שנוסיף תכונות פרימיום אופציונליות, אבל שעון הנוכחות והחישובים הבסיסיים יישארו חינמיים תמיד.",
      },
      {
        question: "מה עושים אם מצאתי באג?",
        answer:
          "נשמח לדעת! אפשר לדווח לנו ישירות במקטע הביקורות למעלה בעמוד, או לשלוח לנו מייל ל-yoseffstor@gmail.com. כל דיווח עוזר לנו לשפר את הבטא לפני ההשקה הרשמית.",
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
      `© ${year} Shift Smart. כל הזכויות שמורות. האפליקציה נמצאת בשלב בטא פתוחה והתכונות עשויות להשתנות.`,
  },
  stickyCta: {
    label: "הורידו את Shift Smart",
  },
  share: {
    buttonLabel: "שתף את האפליקציה",
    copiedLabel: "הועתק!",
    title: "הצטרפו לבטא של Shift Smart!",
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
    imageAlt:
      "פוסטר Shift Smart — שעון נוכחות חכם: ניהול משמרות חכם ויעיל",
  },
  cookieConsent: {
    heading: "אנחנו משתמשים בעוגיות",
    body: "האתר משתמש בעוגיות חיוניות לתפעולו ולשיפור החוויה שלכם. לפרטים נוספים ראו את",
    privacyLinkLabel: "מדיניות הפרטיות",
    acceptLabel: "מאשר/ת",
    rejectLabel: "דוחה",
  },
  openBetaBanner: {
    message: "🎉 הבטא הפתוחה עלתה לאוויר — זמינה עכשיו לכולם ב-Google Play!",
    ctaLabel: "הורידו עכשיו",
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
    betaBadge: "Open Beta",
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
    socialProof:
      "Join security guards, stewards, and shift managers who already manage their time smarter.",
    starsAriaLabel: "Five stars",
    betaWarning:
      "Please note: Android devices only for now. We're in Beta — improving all the time!",
  },
  whatsNew: {
    kicker: "UPDATES",
    titlePrefix: "🚀 What's ",
    titleHighlight: "New?",
    subtitle: "(Latest Updates)",
    badgeLabel: "NEW",
    items: [
      {
        title: "Custom Shift Tags",
        description:
          "Pick your own color and rate for every tag, including a smart Shabbat/Motzash tag that automatically applies the 150% rate even on a shift that doesn't fall on Saturday by the calendar.",
      },
      {
        title: "Mark Sick & Vacation Days from the Calendar",
        description:
          "Mark a sick or vacation day right from the calendar view, and your annual balance updates instantly.",
      },
      {
        title: "Manual Shift Amount Override",
        description:
          "Doesn't match the automatic calculation? Set your own final amount for any shift, and it replaces the calculation everywhere your pay is shown.",
      },
    ],
  },
  aboutTimeTracking: {
    kicker: "Why it matters",
    titlePrefix: "What is a ",
    titleHighlight: "digital time clock?",
    body: "A digital time clock replaces manual notes in a paper log or your memory, accurately recording exactly when each shift started and ended. For shift workers — security guards, stewards, restaurant staff, and more — that's the difference between a rough guess at your pay and knowing exactly how many hours you worked and what they're worth, without waiting for a payslip to find out.",
  },
  betaSteps: {
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
          "Detailed monthly summaries, export to WhatsApp/PDF, and a full backup system.",
      },
      {
        title: "Smart Location Check",
        description: "Precisely records where your shift began.",
      },
      {
        title: "Battery Saving & Privacy",
        description: "Dark design, and your data stays only on your device.",
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
    subtitle: "Based on our beta testers",
    averageRating: "4.9",
    ratingAriaLabel: (rating) => `Rated ${rating} out of 5 stars`,
    writeReviewCta: "Write a Review",
    toastMessage: "Thank you! Your review has been submitted for approval.",
    loadingLabel: "Loading reviews...",
    emptyState: "Be the first to review the Beta!",
    errorState: "We couldn't load reviews right now. Try refreshing the page.",
    submitError: "Couldn't submit your review. Check your connection and try again.",
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
        src: "/English screenshot1.jpg",
        width: 1079,
        height: 2495,
        alt: "Active shift screen: running timer with a Clock Out button, hourly rate, and current shift earnings",
      },
      {
        src: "/English screenshot2.jpg",
        width: 1080,
        height: 2118,
        alt: "Idle clock screen: \"Ready to start working\" with a Start Clock button and fingerprint authentication prompt",
      },
      {
        src: "/English screenshot3.jpg",
        width: 1080,
        height: 2124,
        alt: "Jobs screen: list of workplaces with hourly rate, travel reimbursement, and saved location for each job",
      },
      {
        src: "/English screenshot4.jpg",
        width: 1080,
        height: 2402,
        alt: "Monthly summary screen: total earnings for the month, progress toward a monthly goal, and a breakdown by job",
      },
      {
        src: "/English screenshot5.jpg",
        width: 1080,
        height: 2124,
        alt: "Settings screen: night mode, in-app language toggle between Hebrew and English, and vibration feedback",
      },
      {
        src: "/English screenshot6.jpg",
        width: 1080,
        height: 2124,
        alt: "Settings screen: sound alerts, maximum battery saving for AMOLED screens, and fingerprint/Face ID clock-in",
      },
    ],
  },
  roadmap: {
    kicker: "Roadmap",
    titlePrefix: "What's ",
    titleHighlight: "Coming Next?",
    subtitle:
      "The Beta is just the beginning. Here's what's on our desk right now.",
    milestones: [
      {
        title: "iOS Version",
        description:
          "The exact same app, with the same screens and the same calculations — for iPhone users too.",
      },
      {
        title: "Direct Tax Reports",
        description:
          "Generate a tidy annual report of hours and income, ready to file and send to your accountant.",
      },
      {
        title: "Pro Tier",
        description:
          "Additional paid tiers are planned for after the Beta — currently in development, with no final price or date yet.",
      },
      {
        title: "Google Drive Backup & Sync",
        description:
          "Automatic backup of your data straight to your Google Drive account, alongside the existing manual backup — actively in development.",
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
          "Not anymore — Shift Smart is now in Open Beta, so you can download it straight from Google Play with no testers group or sign-up process. Just install it and get started right away.",
      },
      {
        question: "Will the app stay free?",
        answer:
          "Yes — every feature available today will stay free after the Beta too. We might add optional premium features down the line, but the core time clock and calculations will always be free.",
      },
      {
        question: "What should I do if I find a bug?",
        answer:
          "We'd love to know! You can report it directly in the reviews section above, or email us at yoseffstor@gmail.com. Every report helps us improve the Beta before the official launch.",
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
      `© ${year} Shift Smart. All rights reserved. The app is currently in Open Beta and features may change.`,
  },
  stickyCta: {
    label: "Download Shift Smart",
  },
  share: {
    buttonLabel: "Share App",
    copiedLabel: "Copied!",
    title: "Join the Shift Smart Beta!",
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
  },
  phoneShowcase: {
    mockupSrc: "/English screenshot1.jpg",
    mockupWidth: 1079,
    mockupHeight: 2495,
    mockupAlt:
      "Shift Smart active shift screen: running timer, Clock Out button, hourly rate, and current shift earnings",
  },
  appPoster: {
    kicker: "THE APP",
    titlePrefix: "Meet ",
    titleHighlight: "Shift Smart",
    imageAlt:
      "Shift Smart poster — smart attendance clock: efficient, intelligent shift management",
  },
  cookieConsent: {
    heading: "We use cookies",
    body: "This site uses essential cookies to operate and improve your experience. For more details, see our",
    privacyLinkLabel: "Privacy Policy",
    acceptLabel: "Accept",
    rejectLabel: "Reject",
  },
  openBetaBanner: {
    message: "🎉 Open Beta is live — available now on Google Play!",
    ctaLabel: "Download now",
  },
};

export const dictionaries: Record<Lang, Dictionary> = { he, en };

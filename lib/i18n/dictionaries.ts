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
    joinBetaCta: string;
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
    ];
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
    milestones: [TitledItem, TitledItem, TitledItem];
  };
  faq: {
    kicker: string;
    titlePrefix: string;
    titleHighlight: string;
    subtitle: string;
    items: [FaqItem, FaqItem, FaqItem];
  };
  footer: {
    tagline: string;
    followUs: string;
    linksAriaLabel: string;
    linkPlayStore: string;
    linkBetaGroup: string;
    socialFacebookAria: string;
    socialInstagramAria: string;
    socialTiktokAria: string;
    copyright: (year: number) => string;
  };
  stickyCta: {
    label: string;
  };
  phoneShowcase: {
    /**
     * לעברית זהו נכס ייעודי (mockup-v2.png) שנבחר במיוחד להירו. לאנגלית לא
     * סופק נכס מקביל — עד שיסופק אחד, המסך הראשון מתוך צילומי המסך
     * האנגליים (English screenshot1.jpg, מציג משמרת פעילה) משמש תחליף,
     * כי הוא הכי קרוב תוכנית לתמונת ה-mockup העברית (טיימר משמרת רץ).
     */
    mockupSrc: string;
    mockupWidth: number;
    mockupHeight: number;
    mockupAlt: string;
  };
}

const he: Dictionary = {
  meta: {
    title: "Shift Smart - ניהול משמרות ברמה אחרת!",
    description:
      "שעון הנוכחות שיעשה לכם סדר בשעות ובשכר. מושלם למאבטחים, סדרנים וכל מי שחי על משמרות — הצטרפו לבטא הסגורה עוד היום.",
    keywords: [
      "ניהול משמרות",
      "שעון נוכחות",
      "מעקב שעות עבודה",
      "דוח שעות",
      "Shift Smart",
    ],
    ogDescription:
      "שעון הנוכחות שיעשה לכם סדר בשעות ובשכר. הצטרפו לבטא הסגורה של Shift Smart.",
  },
  brand: {
    name: "Shift Smart",
    betaBadge: "בטא סגורה",
  },
  languageSwitcher: {
    hebrewLabel: "עברית",
    englishLabel: "English",
    groupAriaLabel: "בחירת שפה",
  },
  hero: {
    kicker: "Shift Smart - ניהול משמרות ברמה אחרת!",
    titleLine1: "קורעים את התחת במשמרות?",
    titleLine2: "מצאתי לכם את הפתרון!",
    subtitle: "שעון הנוכחות שיעשה לכם סדר בשעות ובשכר.",
    audience: "מושלם למאבטחים סדרנים, מסעדות וכל מי שחי על משמרות.",
    downloadCta: "הורדה מ-Google Play",
    joinBetaCta: "הצטרפו לבטא הסגורה",
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
    subtitle: "(עדכוני השבוע האחרון)",
    badgeLabel: "חדש",
    items: [
      {
        title: "ווידג'ט חכם למסך הבית (Smart Widget)",
        description:
          "הפעלה ועצירה של שעון הנוכחות בלחיצת כפתור מהירה ישירות ממסך הבית, מבלי לפתוח את האפליקציה. מעקב חי ונוח אחרי סטטוס המשמרת שלך מכל מסך.",
      },
      {
        title: "אוטומציה ונוחות בסיום משמרת",
        description:
          "מעבר אוטומטי להיסטוריה (העברה למסך סיכום השעות מיד ביציאה) והערות מהירות (הקפצת חלון הערה אוטומטי כדי לא לשכוח טיפים או חריגים).",
      },
      {
        title: "שליטה מלאה בהתראות וברטט",
        description:
          "התאמה אישית של חוויית המשתמש - שליטה מלאה על הפעלה או כיבוי של צלילי חיווי ורטט בכל כניסה ויציאה ממשמרת.",
      },
    ],
  },
  betaSteps: {
    kicker: "BETA",
    titlePrefix: "איך מצטרפים ",
    titleHighlight: "לבטא",
    titleSuffix: "?",
    subtitle: "שלושה שלבים, כמה דקות, ואתם בפנים.",
    steps: [
      {
        title: "הצטרפות לקבוצת הבודקים",
        description:
          "נרשמים לקבוצת הבודקים בחשבון Google שממנו תורידו את האפליקציה. זה מה שפותח את הגישה לגרסת הבטא.",
        linkLabel: "לקבוצת הבודקים",
      },
      {
        title: "הורדת האפליקציה",
        description:
          "אחרי ההצטרפות נכנסים לדף האפליקציה בחנות Google Play ומתקינים כרגיל.",
        linkLabel: "לחנות Google Play",
      },
      {
        title: "כניסה חלקה וניהול משמרות",
        description:
          "מגדירים מקום עבודה ותעריף שעתי ומתחילים להחתים. מכאן השעות נספרות לבד.",
      },
    ],
  },
  features: {
    kicker: "01 — 09",
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
        title: "תכונות פרימיום",
        description: "חינם למשתמשי בטא כמו ייצוא ל-PDF ועוד...",
      },
    ],
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
        width: 1080,
        height: 2525,
        alt: "מסך שעון הנוכחות: כפתור הפעלת שעון בטביעת אצבע, בחירת משרה, תעריף לשעה וצבירה במשמרת",
      },
      {
        src: "/Screenshot 2.jpg",
        width: 1080,
        height: 2340,
        alt: "מסך ההגדרות: מצב לילה, בחירת שפת האפליקציה בין עברית לאנגלית וחיסכון סוללה מקסימלי למסכי AMOLED",
      },
      {
        src: "/Screenshot 3.jpg",
        width: 1080,
        height: 2340,
        alt: "מסך המשרות: רשימת מקומות עבודה עם תעריף לשעה, החזר נסיעות ומיקום שמור לכל משרה",
      },
      {
        src: "/Screenshot 4.jpg",
        width: 1080,
        height: 3389,
        alt: "מסך ההיסטוריה: ייצוא דוח חודשי ל-PDF ולוואטסאפ, ורשימת משמרות עם תאריך, שעות ושכר לכל משמרת",
      },
      {
        src: "/Screenshot 5.jpg",
        width: 1080,
        height: 2466,
        alt: "מסך היומן: לוח חודשי עם סימון ימי עבודה והוספת משמרת מתוכננת מראש",
      },
      {
        src: "/Screenshot 6.jpg",
        width: 1080,
        height: 2768,
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
        title: "מערכת תזכורות חכמה",
        description:
          "תזכורת אוטומטית להחתים כניסה ויציאה לפי המשמרות שתכננתם, כדי שלא תשכחו אף פעם.",
      },
      {
        title: "יצירת דוחות מס ישירים",
        description:
          "הפקת דוח שנתי מסודר של שעות והכנסות, מוכן להגשה ולשליחה לרואה החשבון.",
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
    ],
  },
  footer: {
    tagline: "ניהול משמרות ושעון נוכחות חכם",
    followUs: "עקבו אחרינו",
    linksAriaLabel: "קישורים ויצירת קשר",
    linkPlayStore: "הורדה מ‑Google Play",
    linkBetaGroup: "קבוצת הבודקים",
    socialFacebookAria: "עמוד הפייסבוק של Shift Smart",
    socialInstagramAria: "עמוד האינסטגרם של Shift Smart",
    socialTiktokAria: "עמוד הטיקטוק של Shift Smart",
    copyright: (year) =>
      `© ${year} Shift Smart. כל הזכויות שמורות. האפליקציה נמצאת בשלב בטא סגורה והתכונות עשויות להשתנות.`,
  },
  stickyCta: {
    label: "הצטרפו לבטא הסגורה",
  },
  phoneShowcase: {
    mockupSrc: "/mockup-v2.png",
    mockupWidth: 380,
    mockupHeight: 757,
    mockupAlt:
      "מסך שעון הנוכחות באפליקציית Shift Smart: משמרת פעילה עם טיימר רץ, תעריף לשעה וצבירה מצטברת במשמרת",
  },
};

const en: Dictionary = {
  meta: {
    title: "Shift Smart - Shift Management on Another Level",
    description:
      "The ultimate attendance clock for security guards and shift workers. Track your hours, calculate your pay automatically, and never lose a shekel again — join the closed Beta today.",
    keywords: [
      "shift management",
      "time clock",
      "work hours tracking",
      "hours report",
      "Shift Smart",
    ],
    ogDescription:
      "The ultimate attendance clock for security guards and shift workers. Track your hours and calculate your pay automatically with Shift Smart.",
  },
  brand: {
    name: "Shift Smart",
    betaBadge: "Closed Beta",
  },
  languageSwitcher: {
    hebrewLabel: "עברית",
    englishLabel: "English",
    groupAriaLabel: "Language selection",
  },
  hero: {
    kicker: "Shift Smart - Shift Management on Another Level!",
    titleLine1: "Grinding Through Endless Shifts?",
    titleLine2: "I Found You The Fix!",
    subtitle: "The time clock that finally gets your hours and pay in order.",
    audience:
      "Perfect for security guards, stewards, restaurant staff, and anyone living life in shifts.",
    downloadCta: "Get it on Google Play",
    joinBetaCta: "Join the Closed Beta",
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
        title: "Smart Home Screen Widget",
        description:
          "Start and stop the attendance clock with a quick button press directly from your home screen, without opening the app. Live and convenient tracking of your shift status.",
      },
      {
        title: "Automation & Convenience at Shift End",
        description:
          "Automatic redirect to history (instantly moves you to the summary screen upon clocking out) and Quick Notes (automatic note pop-up so you never forget tips or unusual events).",
      },
      {
        title: "Full Control Over Notifications & Vibration",
        description:
          "Personalized user experience - full control to enable or disable sound notifications and vibration for every clock-in and clock-out.",
      },
    ],
  },
  betaSteps: {
    kicker: "BETA",
    titlePrefix: "How to Join the ",
    titleHighlight: "Beta",
    titleSuffix: "?",
    subtitle: "Three steps, a few minutes, and you're in.",
    steps: [
      {
        title: "Join the Testers Group",
        description:
          "Sign up for the testers group using the Google account you'll download the app with. That's what unlocks access to the Beta.",
        linkLabel: "Go to the Testers Group",
      },
      {
        title: "Download the App",
        description:
          "After joining, head to the app page on Google Play and install it as usual.",
        linkLabel: "Go to Google Play",
      },
      {
        title: "Smooth Sign-in & Shift Management",
        description:
          "Set your workplace and hourly rate, then start clocking in. From here, your hours count themselves.",
      },
    ],
  },
  features: {
    kicker: "01 — 09",
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
        title: "Premium Features",
        description: "Free for Beta users — like PDF export and more...",
      },
    ],
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
        title: "Smart Reminders System",
        description:
          "Automatic reminders to clock in and out based on your planned shifts, so you never forget.",
      },
      {
        title: "Direct Tax Reports",
        description:
          "Generate a tidy annual report of hours and income, ready to file and send to your accountant.",
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
    ],
  },
  footer: {
    tagline: "Smart shift management and time clock",
    followUs: "Follow us",
    linksAriaLabel: "Links and contact",
    linkPlayStore: "Get it on Google Play",
    linkBetaGroup: "Testers Group",
    socialFacebookAria: "Shift Smart on Facebook",
    socialInstagramAria: "Shift Smart on Instagram",
    socialTiktokAria: "Shift Smart on TikTok",
    copyright: (year) =>
      `© ${year} Shift Smart. All rights reserved. The app is currently in closed Beta and features may change.`,
  },
  stickyCta: {
    label: "Join the Closed Beta",
  },
  phoneShowcase: {
    mockupSrc: "/English screenshot1.jpg",
    mockupWidth: 1079,
    mockupHeight: 2495,
    mockupAlt:
      "Shift Smart active shift screen: running timer, Clock Out button, hourly rate, and current shift earnings",
  },
};

export const dictionaries: Record<Lang, Dictionary> = { he, en };

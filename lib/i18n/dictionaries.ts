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
    copyright: (year: number) => string;
  };
  stickyCta: {
    label: string;
  };
  phoneShowcase: {
    mockupAlt: string;
  };
}

const he: Dictionary = {
  meta: {
    title: "Shift Smart — ניהול משמרות ושעון נוכחות חכם",
    description:
      "Shift Smart הוא שעון נוכחות חכם שסופר עבורכם את השעות, מסדר את המשמרות ומפיק דוח מדויק בלחיצה אחת. הצטרפו לבטא הסגורה.",
    keywords: [
      "ניהול משמרות",
      "שעון נוכחות",
      "מעקב שעות עבודה",
      "דוח שעות",
      "Shift Smart",
    ],
    ogDescription:
      "שעון נוכחות חכם שסופר עבורכם את השעות, מסדר את המשמרות ומפיק דוח מדויק בלחיצה אחת.",
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
        alt: "מסך שעון הנוכחות: כפתור הפעלת שעון בטביעת אצבע, בחירת משרה, תעריף לשעה וצבירה במשמרת",
      },
      {
        alt: "מסך ההגדרות: מצב לילה, בחירת שפת האפליקציה בין עברית לאנגלית וחיסכון סוללה מקסימלי למסכי AMOLED",
      },
      {
        alt: "מסך המשרות: רשימת מקומות עבודה עם תעריף לשעה, החזר נסיעות ומיקום שמור לכל משרה",
      },
      {
        alt: "מסך ההיסטוריה: ייצוא דוח חודשי ל-PDF ולוואטסאפ, ורשימת משמרות עם תאריך, שעות ושכר לכל משמרת",
      },
      {
        alt: "מסך היומן: לוח חודשי עם סימון ימי עבודה והוספת משמרת מתוכננת מראש",
      },
      {
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
    copyright: (year) =>
      `© ${year} Shift Smart. כל הזכויות שמורות. האפליקציה נמצאת בשלב בטא סגורה והתכונות עשויות להשתנות.`,
  },
  stickyCta: {
    label: "הצטרפו לבטא הסגורה",
  },
  phoneShowcase: {
    mockupAlt:
      "מסך שעון הנוכחות באפליקציית Shift Smart: משמרת פעילה עם טיימר רץ, תעריף לשעה וצבירה מצטברת במשמרת",
  },
};

const en: Dictionary = {
  meta: {
    title: "Shift Smart — Smart Shift Management & Time Clock",
    description:
      "Shift Smart is a smart time clock that counts your hours, organizes your shifts, and generates an accurate report in one tap. Join the closed Beta.",
    keywords: [
      "shift management",
      "time clock",
      "work hours tracking",
      "hours report",
      "Shift Smart",
    ],
    ogDescription:
      "A smart time clock that counts your hours, organizes your shifts, and generates an accurate report in one tap.",
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
    shots: [
      {
        alt: "Time clock screen: fingerprint clock-in button, workplace selector, hourly rate, and shift earnings",
      },
      {
        alt: "Settings screen: night mode, app language toggle between Hebrew and English, and maximum battery saving for AMOLED screens",
      },
      {
        alt: "Workplaces screen: list of jobs with hourly rate, travel reimbursement, and saved location for each workplace",
      },
      {
        alt: "History screen: export a monthly report to PDF/WhatsApp, plus a shift list with date, hours, and pay for each shift",
      },
      {
        alt: "Calendar screen: monthly view with marked workdays and adding a shift planned in advance",
      },
      {
        alt: "Monthly summary screen: total monthly earnings, estimated net pay, progress toward a monthly goal, and a breakdown by workplace",
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
    copyright: (year) =>
      `© ${year} Shift Smart. All rights reserved. The app is currently in closed Beta and features may change.`,
  },
  stickyCta: {
    label: "Join the Closed Beta",
  },
  phoneShowcase: {
    mockupAlt:
      "Shift Smart time clock screen: active shift with a running timer, hourly rate, and accumulated shift earnings",
  },
};

export const dictionaries: Record<Lang, Dictionary> = { he, en };

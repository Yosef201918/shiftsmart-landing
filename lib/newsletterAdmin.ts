export type NewsletterStatus = "active" | "pending" | "unsubscribed" | "bounced" | "spam" | "unknown";

export type NewsletterMember = {
  id: string;
  email: string;
  created: string | null;
  status: NewsletterStatus;
};

export type NewsletterPage = {
  members: NewsletterMember[];
  page: number;
  total: number;
  lastPage: number;
};

export const newsletterStatusLabels: Record<NewsletterStatus, string> = {
  active: "אישרו הרשמה",
  pending: "לא אישרו עדיין",
  unsubscribed: "הסירו הרשמה",
  bounced: "כתובת עם כשל מסירה",
  spam: "דיווחו כספאם",
  unknown: "סטטוס לא מזוהה",
};

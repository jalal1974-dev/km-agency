export type Locale = "ar" | "en";

export const locales: Locale[] = ["ar", "en"];

export function isLocale(value: string): value is Locale {
  return value === "ar" || value === "en";
}

export function dir(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr";
}

export const dictionary = {
  ar: {
    home: "الرئيسية",
    about: "من نحن",
    services: "الخدمات",
    portfolio: "الأعمال",
    packages: "الباقات",
    insights: "المدونة",
    contact: "تواصل معنا",
    admin: "الإدارة",
    startProject: "ابدأ مشروعك",
    whatsapp: "واتساب",
    heroTitle: "KM Agency تبني حضورك الرقمي ليبيع وينمو",
    heroText: "مواقع ومنصات، هوية تجارية، تسويق رقمي، فيديو، وأتمتة ذكاء اصطناعي ضمن تجربة احترافية قابلة للإدارة والقياس.",
    heroKicker: "وكالة رقمية متكاملة للنمو",
    explore: "استعرض الخدمات",
    featuredServices: "خدمات رئيسية",
    servicesText: "كل خدمة لها صفحة واضحة ونموذج طلب مخصص يجمع المعلومات الصحيحة من البداية.",
    process: "طريقة العمل",
    processText: "نبدأ بفهم الهدف، ثم نبني تجربة تقنع العميل وتسهل المتابعة.",
    adminLogin: "تسجيل دخول الإدارة",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    signIn: "دخول",
    dashboard: "لوحة التحكم",
    inquiries: "الطلبات",
    service: "الخدمة",
    status: "الحالة",
    submitted: "تاريخ الإرسال",
    logout: "تسجيل الخروج",
    submit: "إرسال الطلب",
    inquirySuccess: "تم إرسال طلبك بنجاح. رقم الطلب",
    required: "هذا الحقل مطلوب",
    thankYou: "شكرا لك",
    nextStep: "سنراجع التفاصيل ونتواصل معك خلال يوم عمل.",
    all: "الكل"
  },
  en: {
    home: "Home",
    about: "About",
    services: "Services",
    portfolio: "Portfolio",
    packages: "Packages",
    insights: "Insights",
    contact: "Contact",
    admin: "Admin",
    startProject: "Start Your Project",
    whatsapp: "WhatsApp",
    heroTitle: "KM Agency builds digital presence that sells and grows",
    heroText: "Web platforms, branding, digital marketing, video, and AI automation inside a professional, measurable, admin-managed experience.",
    heroKicker: "Full-service digital growth agency",
    explore: "Explore Services",
    featuredServices: "Featured Services",
    servicesText: "Every service has a clear page and a tailored inquiry form that gathers the right information from the start.",
    process: "Work Process",
    processText: "We understand the goal first, then build an experience that persuades customers and supports follow-up.",
    adminLogin: "Admin Login",
    email: "Email",
    password: "Password",
    signIn: "Sign In",
    dashboard: "Dashboard",
    inquiries: "Inquiries",
    service: "Service",
    status: "Status",
    submitted: "Submitted",
    logout: "Log out",
    submit: "Submit Inquiry",
    inquirySuccess: "Your inquiry was submitted. Reference",
    required: "This field is required",
    thankYou: "Thank you",
    nextStep: "We will review the details and contact you within one business day.",
    all: "All"
  }
} satisfies Record<Locale, Record<string, string>>;

export const fallbackServices = [
  {
    slug: "website-development",
    titleAr: "تطوير المواقع والمنصات",
    titleEn: "Website & Platform Development",
    excerptAr: "مواقع ومنصات احترافية مع لوحة إدارة ونماذج وربط تقني.",
    excerptEn: "Professional websites and platforms with admin dashboards, forms, and integrations.",
    featured: true,
    category: { nameAr: "المواقع والتطوير", nameEn: "Web & Development" }
  },
  {
    slug: "landing-pages",
    titleAr: "تصميم صفحات الهبوط",
    titleEn: "Landing Page Design",
    excerptAr: "صفحات هبوط عالية التحويل للحملات وجمع العملاء.",
    excerptEn: "High-converting landing pages for campaigns and lead generation.",
    featured: true,
    category: { nameAr: "المواقع والتطوير", nameEn: "Web & Development" }
  },
  {
    slug: "ecommerce-development",
    titleAr: "تطوير المتاجر الإلكترونية",
    titleEn: "E-Commerce Development",
    excerptAr: "متاجر جاهزة للبيع مع إدارة منتجات وطلبات ودفع.",
    excerptEn: "Stores ready for selling with product, order, and payment management.",
    featured: true,
    category: { nameAr: "المواقع والتطوير", nameEn: "Web & Development" }
  },
  {
    slug: "full-branding",
    titleAr: "باقة هوية تجارية كاملة",
    titleEn: "Full Branding Package",
    excerptAr: "استراتيجية علامة، شعار، ألوان، خطوط، ودليل استخدام احترافي.",
    excerptEn: "Brand strategy, logo, colors, typography, and professional guidelines.",
    featured: true,
    category: { nameAr: "الهوية والإبداع", nameEn: "Branding & Creative" }
  },
  {
    slug: "logo-design",
    titleAr: "تصميم شعار",
    titleEn: "Logo Design",
    excerptAr: "شعار احترافي بملفات جاهزة للطباعة والاستخدام الرقمي.",
    excerptEn: "Professional logo files ready for print and digital use.",
    featured: false,
    category: { nameAr: "الهوية والإبداع", nameEn: "Branding & Creative" }
  },
  {
    slug: "company-profile",
    titleAr: "تصميم بروفايل شركة",
    titleEn: "Company Profile Design",
    excerptAr: "بروفايل عربي وإنجليزي يعرض الشركة وخدماتها باحتراف.",
    excerptEn: "Arabic and English company profiles that present services professionally.",
    featured: false,
    category: { nameAr: "الهوية والإبداع", nameEn: "Branding & Creative" }
  },
  {
    slug: "campaign-management",
    titleAr: "إدارة الحملات الإعلانية",
    titleEn: "Campaign Management",
    excerptAr: "تخطيط وتنفيذ وتحسين حملات Meta وGoogle وTikTok.",
    excerptEn: "Planning, launching, and optimizing Meta, Google, and TikTok campaigns.",
    featured: true,
    category: { nameAr: "التسويق والنمو", nameEn: "Marketing & Growth" }
  },
  {
    slug: "social-media-management",
    titleAr: "إدارة السوشيال ميديا",
    titleEn: "Social Media Management",
    excerptAr: "تقويم محتوى، تصميم منشورات، نشر، ومتابعة أداء شهرية.",
    excerptEn: "Content calendars, post design, publishing, and monthly reporting.",
    featured: true,
    category: { nameAr: "التسويق والنمو", nameEn: "Marketing & Growth" }
  },
  {
    slug: "content-creation",
    titleAr: "إنشاء محتوى سوشيال ميديا",
    titleEn: "Social Media Content Creation",
    excerptAr: "منشورات، كاروسيل، ستوري، أغلفة ريلز، ونصوص تسويقية.",
    excerptEn: "Posts, carousels, stories, reel covers, and marketing captions.",
    featured: false,
    category: { nameAr: "التسويق والنمو", nameEn: "Marketing & Growth" }
  },
  {
    slug: "seo",
    titleAr: "تحسين محركات البحث",
    titleEn: "Search Engine Optimization",
    excerptAr: "تدقيق SEO، كلمات مفتاحية، تحسين تقني، وبيانات وصفية.",
    excerptEn: "SEO audits, keyword research, technical optimization, and metadata.",
    featured: false,
    category: { nameAr: "التسويق والنمو", nameEn: "Marketing & Growth" }
  },
  {
    slug: "short-video-editing",
    titleAr: "مونتاج الفيديو القصير",
    titleEn: "Short-Form Video Editing",
    excerptAr: "Reels وTikTok وShorts بخطافات قوية وأسلوب مناسب للعلامة.",
    excerptEn: "Reels, TikTok, and Shorts with strong hooks and brand styling.",
    featured: true,
    category: { nameAr: "الفيديو والميديا", nameEn: "Video & Media" }
  },
  {
    slug: "motion-graphics",
    titleAr: "موشن جرافيك",
    titleEn: "Motion Graphics",
    excerptAr: "شروحات، عناوين، رسوم متحركة، وعناصر بصرية احترافية.",
    excerptEn: "Explainers, titles, animation, and professional motion assets.",
    featured: false,
    category: { nameAr: "الفيديو والميديا", nameEn: "Video & Media" }
  },
  {
    slug: "ai-business-automation",
    titleAr: "أتمتة الأعمال بالذكاء الاصطناعي",
    titleEn: "AI Business Automation",
    excerptAr: "أدوات تقلل المهام المتكررة وتحسن المتابعة والتقارير.",
    excerptEn: "Tools that reduce repetitive tasks and improve follow-up and reporting.",
    featured: true,
    category: { nameAr: "الذكاء الاصطناعي", nameEn: "AI & Automation" }
  }
];

export function getFallbackService(slug: string) {
  const service = fallbackServices.find(item => item.slug === slug);
  if (!service) return null;
  return {
    ...service,
    descriptionAr: `${service.titleAr} من KM Agency تشمل التخطيط والتنفيذ والمتابعة بطريقة احترافية موجهة للنمو.`,
    descriptionEn: `${service.titleEn} by KM Agency includes planning, execution, and follow-up with a growth-focused approach.`,
    startingPrice: null,
    timeline: "2-6 weeks",
    benefits: [
      { textAr: "تحسين الثقة والتحويل", textEn: "Improved trust and conversion" },
      { textAr: "تنفيذ منظم قابل للقياس", textEn: "Structured execution that can be measured" }
    ],
    deliverables: [
      { textAr: "تحليل المتطلبات", textEn: "Requirements analysis" },
      { textAr: "تنفيذ احترافي", textEn: "Professional execution" },
      { textAr: "تسليم واضح للمتابعة", textEn: "Clear handoff for follow-up" }
    ],
    formSchemas: [
      {
        fields: [
          { key: "fullName", type: "text", labelAr: "الاسم الكامل", labelEn: "Full name", placeholderAr: null, placeholderEn: null, required: true, optionsJson: null },
          { key: "company", type: "text", labelAr: "اسم الشركة", labelEn: "Company name", placeholderAr: null, placeholderEn: null, required: false, optionsJson: null },
          { key: "phone", type: "phone", labelAr: "رقم الهاتف", labelEn: "Phone number", placeholderAr: null, placeholderEn: null, required: true, optionsJson: null },
          { key: "email", type: "email", labelAr: "البريد الإلكتروني", labelEn: "Email", placeholderAr: null, placeholderEn: null, required: true, optionsJson: null },
          { key: "budget", type: "budget", labelAr: "الميزانية", labelEn: "Budget range", placeholderAr: null, placeholderEn: null, required: true, optionsJson: null },
          { key: "requirements", type: "textarea", labelAr: "تفاصيل الطلب", labelEn: "Project requirements", placeholderAr: null, placeholderEn: null, required: true, optionsJson: null }
        ]
      }
    ]
  };
}

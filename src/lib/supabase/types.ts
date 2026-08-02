export type ServiceRow = {
  id: string;
  slug: string;
  title_ar: string;
  title_en: string;
  excerpt_ar: string;
  excerpt_en: string;
  description_ar: string;
  description_en: string;
  featured: boolean;
  starting_price: string | null;
  timeline: string | null;
  service_categories: { name_ar: string; name_en: string } | null;
  service_benefits?: { text_ar: string; text_en: string }[];
  service_deliverables?: { text_ar: string; text_en: string }[];
  form_schemas?: {
    id: string;
    form_fields: {
      id: string;
      key: string;
      type: string;
      label_ar: string;
      label_en: string;
      placeholder_ar: string | null;
      placeholder_en: string | null;
      required: boolean;
      options: string[] | null;
    }[];
  }[];
};

export type InquiryRow = {
  id: string;
  reference: string;
  status: string;
  name: string;
  email: string;
  phone: string;
  budget: string | null;
  created_at: string;
  services: { title_en: string; title_ar: string } | null;
};

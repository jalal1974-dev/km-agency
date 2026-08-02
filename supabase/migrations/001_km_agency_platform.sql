create extension if not exists pgcrypto;

create type public.locale as enum ('ar', 'en');
create type public.inquiry_status as enum ('new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost');
create type public.field_type as enum ('text', 'textarea', 'email', 'phone', 'number', 'url', 'date', 'select', 'multiselect', 'checkbox', 'file', 'budget');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null default 'viewer',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.service_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ar text not null,
  name_en text not null,
  description_ar text,
  description_en text,
  sort_order int not null default 0
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.service_categories(id) on delete restrict,
  slug text not null unique,
  title_ar text not null,
  title_en text not null,
  excerpt_ar text not null,
  excerpt_en text not null,
  description_ar text not null,
  description_en text not null,
  featured boolean not null default false,
  published boolean not null default true,
  sort_order int not null default 0,
  starting_price text,
  timeline text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.service_benefits (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  text_ar text not null,
  text_en text not null,
  sort_order int not null default 0
);

create table public.service_deliverables (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  text_ar text not null,
  text_en text not null,
  sort_order int not null default 0
);

create table public.form_schemas (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  name text not null,
  version int not null default 1,
  active boolean not null default true
);

create table public.form_fields (
  id uuid primary key default gen_random_uuid(),
  schema_id uuid not null references public.form_schemas(id) on delete cascade,
  key text not null,
  type public.field_type not null,
  label_ar text not null,
  label_en text not null,
  placeholder_ar text,
  placeholder_en text,
  required boolean not null default false,
  options jsonb not null default '[]'::jsonb,
  help_ar text,
  help_en text,
  sort_order int not null default 0,
  active boolean not null default true
);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  service_id uuid not null references public.services(id) on delete restrict,
  form_schema_id uuid references public.form_schemas(id) on delete set null,
  status public.inquiry_status not null default 'new',
  name text not null,
  email text not null,
  phone text not null,
  whatsapp text,
  company text,
  country text,
  budget text,
  locale public.locale not null default 'ar',
  source text,
  utm jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inquiry_answers (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  field_id uuid references public.form_fields(id) on delete set null,
  field_key text not null,
  field_label text not null,
  field_type text not null,
  value text not null,
  display_value text not null,
  locale public.locale not null
);

create table public.packages (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references public.services(id) on delete set null,
  name_ar text not null,
  name_en text not null,
  description_ar text not null,
  description_en text not null,
  price text,
  currency text not null default 'JOD',
  billing_type text not null,
  recommended boolean not null default false,
  active boolean not null default true,
  sort_order int not null default 0
);

create table public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references public.services(id) on delete set null,
  slug text not null unique,
  title_ar text not null,
  title_en text not null,
  client_name text not null,
  industry text not null,
  summary_ar text not null,
  summary_en text not null,
  results_ar text not null,
  results_en text not null,
  featured boolean not null default false,
  published boolean not null default true
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  company text,
  role text,
  quote_ar text not null,
  quote_en text not null,
  rating int not null default 5,
  featured boolean not null default false,
  published boolean not null default true
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_ar text not null,
  title_en text not null,
  excerpt_ar text not null,
  excerpt_en text not null,
  content_ar text not null,
  content_en text not null,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.website_settings (
  key text primary key,
  value text not null
);

create index inquiries_status_idx on public.inquiries(status);
create index inquiries_service_idx on public.inquiries(service_id);
create index inquiries_created_idx on public.inquiries(created_at desc);
create index services_published_idx on public.services(published, sort_order);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and active = true
      and role in ('admin', 'super_admin')
  );
$$;

alter table public.profiles enable row level security;
alter table public.service_categories enable row level security;
alter table public.services enable row level security;
alter table public.service_benefits enable row level security;
alter table public.service_deliverables enable row level security;
alter table public.form_schemas enable row level security;
alter table public.form_fields enable row level security;
alter table public.inquiries enable row level security;
alter table public.inquiry_answers enable row level security;
alter table public.packages enable row level security;
alter table public.portfolio_projects enable row level security;
alter table public.testimonials enable row level security;
alter table public.blog_posts enable row level security;
alter table public.website_settings enable row level security;

create policy "public read categories" on public.service_categories for select using (true);
create policy "public read services" on public.services for select using (published = true or public.is_admin());
create policy "public read benefits" on public.service_benefits for select using (true);
create policy "public read deliverables" on public.service_deliverables for select using (true);
create policy "public read active schemas" on public.form_schemas for select using (active = true or public.is_admin());
create policy "public read active fields" on public.form_fields for select using (active = true or public.is_admin());
create policy "public insert inquiries" on public.inquiries for insert with check (true);
create policy "public insert inquiry answers" on public.inquiry_answers for insert with check (true);
create policy "admin read inquiries" on public.inquiries for select using (public.is_admin());
create policy "admin update inquiries" on public.inquiries for update using (public.is_admin()) with check (public.is_admin());
create policy "admin read answers" on public.inquiry_answers for select using (public.is_admin());
create policy "public read packages" on public.packages for select using (active = true or public.is_admin());
create policy "public read portfolio" on public.portfolio_projects for select using (published = true or public.is_admin());
create policy "public read testimonials" on public.testimonials for select using (published = true or public.is_admin());
create policy "public read blog" on public.blog_posts for select using (published = true or public.is_admin());
create policy "public read settings" on public.website_settings for select using (true);
create policy "admin manage content categories" on public.service_categories for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage content services" on public.services for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage forms schemas" on public.form_schemas for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manage forms fields" on public.form_fields for all using (public.is_admin()) with check (public.is_admin());
create policy "admin read profiles" on public.profiles for select using (public.is_admin() or id = auth.uid());
create policy "admin update profiles" on public.profiles for update using (public.is_admin()) with check (public.is_admin());

insert into public.website_settings(key, value) values ('whatsapp_number', '962777066779') on conflict (key) do update set value = excluded.value;

insert into public.service_categories(slug, name_ar, name_en, sort_order) values
('web', 'المواقع والتطوير', 'Web & Development', 1),
('brand', 'الهوية والإبداع', 'Branding & Creative', 2),
('marketing', 'التسويق والنمو', 'Marketing & Growth', 3),
('video', 'الفيديو والميديا', 'Video & Media', 4),
('ai', 'الذكاء الاصطناعي والأتمتة', 'AI & Automation', 5),
('business', 'خدمات الأعمال', 'Business Services', 6)
on conflict (slug) do update set name_ar = excluded.name_ar, name_en = excluded.name_en;

with data(category_slug, slug, featured, title_ar, title_en, excerpt_ar, excerpt_en, sort_order) as (
  values
  ('web','website-development',true,'تطوير المواقع والمنصات','Website & Platform Development','مواقع ومنصات احترافية مع لوحة إدارة ونماذج وربط تقني.','Professional websites and platforms with admin dashboards, forms, and integrations.',1),
  ('web','landing-pages',true,'تصميم صفحات الهبوط','Landing Page Design','صفحات هبوط عالية التحويل للحملات وجمع العملاء.','High-converting landing pages for campaigns and lead generation.',2),
  ('web','ecommerce-development',true,'تطوير المتاجر الإلكترونية','E-Commerce Development','متاجر جاهزة للبيع مع إدارة منتجات وطلبات ودفع.','Stores ready for selling with product, order, and payment management.',3),
  ('brand','branding-package',true,'باقة هوية تجارية كاملة','Full Branding Package','استراتيجية، شعار، ألوان، خطوط، ودليل هوية.','Strategy, logo, colors, typography, and brand guidelines.',4),
  ('marketing','social-media-management',true,'إدارة السوشيال ميديا','Social Media Management','تقويم محتوى، تصميم، نشر، ومتابعة أداء.','Content calendars, design, publishing, and reporting.',5),
  ('marketing','paid-advertising',true,'إدارة الحملات الإعلانية','Paid Advertising Campaigns','إعلانات Meta وGoogle وTikTok بتتبع وتحسين.','Meta, Google, and TikTok campaigns with tracking and optimization.',6),
  ('video','short-form-video',true,'مونتاج الفيديو القصير','Short-Form Video Editing','Reels وTikTok وShorts بأسلوب جذاب ومناسب للعلامة.','Reels, TikTok, and Shorts edited with hooks and brand styling.',7),
  ('ai','ai-business-automation',true,'أتمتة الأعمال بالذكاء الاصطناعي','AI Business Automation','أدوات تقلل المهام المتكررة وتحسن المتابعة.','Tools that reduce repetitive tasks and improve follow-up.',8),
  ('ai','whatsapp-ai-agent',true,'وكيل واتساب ذكي','WhatsApp AI Agent','ردود تلقائية وتأهيل عملاء وجمع طلبات بالعربية والإنجليزية.','Automated replies, lead qualification, and inquiry capture in Arabic and English.',9),
  ('business','monthly-growth-package',true,'باقة نمو رقمي شهرية','Monthly Digital Growth Package','تنفيذ شهري متكامل للتصميم والتسويق والتحسين.','Monthly integrated design, marketing, and optimization support.',10)
)
insert into public.services(category_id, slug, featured, title_ar, title_en, excerpt_ar, excerpt_en, description_ar, description_en, sort_order, timeline)
select c.id, d.slug, d.featured, d.title_ar, d.title_en, d.excerpt_ar, d.excerpt_en,
       d.title_ar || ' من KM Agency تشمل التخطيط، التصميم، التنفيذ، والقياس بطريقة احترافية موجهة للنمو.',
       d.title_en || ' by KM Agency includes planning, design, execution, and measurement with a growth-focused approach.',
       d.sort_order, '2-6 weeks'
from data d
join public.service_categories c on c.slug = d.category_slug
on conflict (slug) do update set title_ar = excluded.title_ar, title_en = excluded.title_en, excerpt_ar = excluded.excerpt_ar, excerpt_en = excluded.excerpt_en, featured = excluded.featured;

insert into public.form_schemas(service_id, name)
select id, title_en || ' Inquiry'
from public.services
on conflict do nothing;

insert into public.form_fields(schema_id, key, type, label_ar, label_en, required, options, sort_order)
select fs.id, f.key, f.type::public.field_type, f.label_ar, f.label_en, f.required, f.options::jsonb, f.sort_order
from public.form_schemas fs
cross join (
  values
  ('fullName','text','الاسم الكامل','Full name',true,'[]',1),
  ('company','text','اسم الشركة','Company name',false,'[]',2),
  ('phone','phone','رقم الهاتف','Phone number',true,'[]',3),
  ('whatsapp','phone','رقم واتساب','WhatsApp number',false,'[]',4),
  ('email','email','البريد الإلكتروني','Email',true,'[]',5),
  ('country','text','الدولة','Country',false,'[]',6),
  ('budget','budget','الميزانية','Budget range',true,'["Under 500 JOD","500 - 1500 JOD","1500 - 5000 JOD","5000+ JOD","Not sure"]',7),
  ('requirements','textarea','تفاصيل الطلب','Project requirements',true,'[]',8)
) as f(key,type,label_ar,label_en,required,options,sort_order)
where not exists (select 1 from public.form_fields existing where existing.schema_id = fs.id and existing.key = f.key);

insert into public.packages(name_ar, name_en, description_ar, description_en, price, billing_type, recommended, sort_order) values
('Starter','Starter','بداية منظمة لمشروع صغير.','A focused start for a smaller project.','Contact for price','Project-based',false,1),
('Growth','Growth','أفضل خيار لمعظم الشركات.','Best fit for most growing companies.','Starting from 750 JOD','Starting from',true,2),
('Enterprise','Enterprise','منصات وتكاملات مخصصة.','Custom platforms and integrations.','Custom quote','Custom quote',false,3);

insert into public.testimonials(client_name, company, quote_ar, quote_en, featured) values
('Rania Haddad','Travel Brand','الفريق حول أفكارنا إلى موقع واضح يجلب طلبات فعلية.','The team turned our ideas into a clear website that generates real inquiries.',true),
('Omar Saleh','Clinic Group','تجربة منظمة وتصميم احترافي واهتمام بالتفاصيل.','A structured experience, professional design, and real attention to detail.',true);

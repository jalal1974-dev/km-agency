delete from public.services where slug = 'whatsapp-ai-agent';

with data(category_slug, slug, featured, title_ar, title_en, excerpt_ar, excerpt_en, sort_order) as (
  values
  ('brand','full-branding',true,'باقة هوية تجارية كاملة','Full Branding Package','استراتيجية علامة، شعار، ألوان، خطوط، ودليل استخدام احترافي.','Brand strategy, logo, colors, typography, and professional guidelines.',4),
  ('brand','logo-design',false,'تصميم شعار','Logo Design','شعار احترافي بملفات جاهزة للطباعة والاستخدام الرقمي.','Professional logo files ready for print and digital use.',5),
  ('brand','company-profile',false,'تصميم بروفايل شركة','Company Profile Design','بروفايل عربي وإنجليزي يعرض الشركة وخدماتها باحتراف.','Arabic and English company profiles that present services professionally.',6),
  ('marketing','campaign-management',true,'إدارة الحملات الإعلانية','Campaign Management','تخطيط وتنفيذ وتحسين حملات Meta وGoogle وTikTok.','Planning, launching, and optimizing Meta, Google, and TikTok campaigns.',7),
  ('marketing','social-media-management',true,'إدارة السوشيال ميديا','Social Media Management','تقويم محتوى، تصميم منشورات، نشر، ومتابعة أداء شهرية.','Content calendars, post design, publishing, and monthly reporting.',8),
  ('marketing','content-creation',false,'إنشاء محتوى سوشيال ميديا','Social Media Content Creation','منشورات، كاروسيل، ستوري، أغلفة ريلز، ونصوص تسويقية.','Posts, carousels, stories, reel covers, and marketing captions.',9),
  ('marketing','seo',false,'تحسين محركات البحث','Search Engine Optimization','تدقيق SEO، كلمات مفتاحية، تحسين تقني، وبيانات وصفية.','SEO audits, keyword research, technical optimization, and metadata.',10),
  ('video','short-video-editing',true,'مونتاج الفيديو القصير','Short-Form Video Editing','Reels وTikTok وShorts بخطافات قوية وأسلوب مناسب للعلامة.','Reels, TikTok, and Shorts with strong hooks and brand styling.',11),
  ('video','motion-graphics',false,'موشن جرافيك','Motion Graphics','شروحات، عناوين، رسوم متحركة، وعناصر بصرية احترافية.','Explainers, titles, animation, and professional motion assets.',12),
  ('ai','ai-business-automation',true,'أتمتة الأعمال بالذكاء الاصطناعي','AI Business Automation','أدوات تقلل المهام المتكررة وتحسن المتابعة والتقارير.','Tools that reduce repetitive tasks and improve follow-up and reporting.',13)
)
insert into public.services(category_id, slug, featured, title_ar, title_en, excerpt_ar, excerpt_en, description_ar, description_en, sort_order, timeline)
select c.id, d.slug, d.featured, d.title_ar, d.title_en, d.excerpt_ar, d.excerpt_en,
       d.title_ar || ' من KM Agency تشمل التخطيط والتنفيذ والمتابعة بطريقة احترافية موجهة للنمو.',
       d.title_en || ' by KM Agency includes planning, execution, and follow-up with a growth-focused approach.',
       d.sort_order, '2-6 weeks'
from data d
join public.service_categories c on c.slug = d.category_slug
on conflict (slug) do update set
  title_ar = excluded.title_ar,
  title_en = excluded.title_en,
  excerpt_ar = excluded.excerpt_ar,
  excerpt_en = excluded.excerpt_en,
  description_ar = excluded.description_ar,
  description_en = excluded.description_en,
  featured = excluded.featured,
  sort_order = excluded.sort_order;

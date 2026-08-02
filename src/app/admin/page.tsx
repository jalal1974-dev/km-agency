import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/admin/actions";
import { hasPreviewAdminSession } from "@/lib/admin-session";
import { fallbackServices } from "@/lib/fallback-data";
import { getLocalInquiries } from "@/lib/local-inquiries";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

const navItems = [
  ["overview", "Overview"],
  ["inquiries", "Inquiries"],
  ["services", "Services"],
  ["forms", "Form Builder"],
  ["packages", "Packages"],
  ["portfolio", "Portfolio"],
  ["blog", "Blog"],
  ["testimonials", "Testimonials"],
  ["users", "Users"],
  ["settings", "Settings"]
] as const;

const packages: Array<[string, string, string]> = [
  ["Starter", "Contact for price", "Landing pages, starter branding, and WhatsApp CTA setup."],
  ["Growth", "Starting from 750 JOD", "Website, SEO setup, lead forms, and campaign-ready structure."],
  ["Enterprise", "Custom quote", "Custom platform, automation, dashboard, and integrations."]
];

const portfolio: Array<[string, string, string]> = [
  ["Travel Growth Website", "Website & Platform Development", "Lead-focused booking experience."],
  ["Clinic Brand Refresh", "Full Branding Package", "Modern identity and conversion-focused profile."],
  ["Retail Campaign Launch", "Campaign Management", "Paid campaign setup with clear lead tracking."]
];

const blog: Array<[string, string]> = [
  ["How to choose the right digital service", "SEO-ready article for service discovery."],
  ["What makes a landing page convert", "Conversion strategy and page structure."],
  ["Why brand consistency improves sales", "Branding and trust-building insight."]
];

const testimonials: Array<[string, string]> = [
  ["Rania Haddad", "The team turned our ideas into a clear website that generates real inquiries."],
  ["Omar Saleh", "A structured experience, professional design, and real attention to detail."]
];

function statusColor(status: string) {
  if (status === "won") return "bg-emerald-100 text-emerald-800";
  if (status === "qualified") return "bg-blue-100 text-blue-800";
  if (status === "contacted") return "bg-amber-100 text-amber-800";
  return "bg-slate-100 text-slate-800";
}

function SectionTitle({ title, text }: { title: string; text: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-2xl font-black text-ink">{title}</h2>
      <p className="mt-1 text-sm text-muted">{text}</p>
    </div>
  );
}

export default async function AdminPage({
  searchParams
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const { section } = await searchParams;
  const activeSection = navItems.some(([id]) => id === section) ? section || "overview" : "overview";
  const previewAdmin = await hasPreviewAdminSession();
  const configured = isSupabaseConfigured();

  if (!previewAdmin && !configured) redirect("/admin/login");

  const supabase = await createSupabaseServerClient();
  const { data: userData } = configured ? await supabase.auth.getUser() : { data: { user: null } };
  if (!userData.user && !previewAdmin) redirect("/admin/login");

  const localInquiries = configured ? [] : await getLocalInquiries();
  const [{ data: inquiries }, { count: serviceCount }, { count: packageCount }, { count: postCount }] = configured
    ? await Promise.all([
        supabase.from("inquiries").select("id,reference,status,name,email,phone,budget,created_at,services(title_en,title_ar)").order("created_at", { ascending: false }).limit(25),
        supabase.from("services").select("id", { count: "exact", head: true }),
        supabase.from("packages").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true })
      ])
    : [{ data: localInquiries }, { count: fallbackServices.length }, { count: packages.length }, { count: blog.length }];
  const rows = inquiries || [];

  function renderInquiries() {
    return (
      <section className="rounded-ui border border-line bg-white p-5 shadow-soft">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <SectionTitle title="Inquiries" text="Every public form submission is stored here with the user phone number visible." />
          <a className="rounded-ui bg-brand-600 px-4 py-2 text-sm font-bold text-white" href="/admin/inquiries.csv">Export CSV</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left text-muted">
                <th className="py-3 pr-3">Reference</th>
                <th className="py-3 pr-3">Client</th>
                <th className="py-3 pr-3">Phone Number</th>
                <th className="py-3 pr-3">Service</th>
                <th className="py-3 pr-3">Budget</th>
                <th className="py-3 pr-3">Status</th>
                <th className="py-3 pr-3">Email</th>
                <th className="py-3 pr-3">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {rows.length ? rows.map(inquiry => (
                <tr key={inquiry.id} className="border-b border-line">
                  <td className="py-4 pr-3 font-black">{inquiry.reference}</td>
                  <td className="py-4 pr-3">
                    <strong>{inquiry.name}</strong>
                    <p className="text-muted">{inquiry.email}</p>
                    <p className="mt-1 rounded-ui bg-brand-50 px-2 py-1 font-black text-brand-600">Phone: {inquiry.phone || "Not provided"}</p>
                  </td>
                  <td className="py-4 pr-3 text-lg font-black text-ink">{inquiry.phone || "Not provided"}</td>
                  <td className="py-4 pr-3">{(Array.isArray(inquiry.services) ? inquiry.services[0] : inquiry.services)?.title_en || ""}</td>
                  <td className="py-4 pr-3">{inquiry.budget || "Not set"}</td>
                  <td className="py-4 pr-3"><span className={`rounded-full px-2 py-1 text-xs font-black ${statusColor(inquiry.status)}`}>{inquiry.status}</span></td>
                  <td className="py-4 pr-3">{("email_status" in inquiry && inquiry.email_status) || "saved"}</td>
                  <td className="py-4 pr-3">{new Date(inquiry.created_at).toLocaleDateString()}</td>
                </tr>
              )) : (
                <tr><td className="py-6 text-muted" colSpan={8}>No inquiries yet. Submit a service form to see it here.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  function renderCards(title: string, text: string, items: Array<[string, string, string?]>) {
    return (
      <section className="rounded-ui border border-line bg-white p-5 shadow-soft">
        <SectionTitle title={title} text={text} />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map(([name, meta, description]) => (
            <article key={name} className="rounded-ui border border-line bg-[#FAFBFF] p-5">
              <h3 className="text-lg font-black text-ink">{name}</h3>
              <p className="mt-1 text-sm font-bold text-brand-600">{meta}</p>
              {description ? <p className="mt-3 text-sm text-muted">{description}</p> : null}
            </article>
          ))}
        </div>
      </section>
    );
  }

  function renderSection() {
    if (activeSection === "inquiries") return renderInquiries();
    if (activeSection === "services") {
      return renderCards("Services", "Published service pages and inquiry paths.", fallbackServices.map(service => [service.titleEn, service.category.nameEn, service.excerptEn]));
    }
    if (activeSection === "forms") {
      return renderCards("Form Builder", "Each service can use a custom inquiry schema.", fallbackServices.slice(0, 9).map(service => [service.titleEn, "Active form", "Name, company, phone, email, budget, and project requirements."]));
    }
    if (activeSection === "packages") return renderCards("Packages", "Editable package offers for different project sizes.", packages);
    if (activeSection === "portfolio") return renderCards("Portfolio", "Project case studies ready for expansion.", portfolio);
    if (activeSection === "blog") return renderCards("Blog", "SEO-focused insights and articles.", blog.map(item => [item[0], "Draft-ready", item[1]]));
    if (activeSection === "testimonials") return renderCards("Testimonials", "Client proof for trust and conversion.", testimonials.map(item => [item[0], "5 star", item[1]]));
    if (activeSection === "users") {
      return renderCards("Users", "Admin accounts and access management.", [["CEO Admin", "ceo@kmagency.online", "Full dashboard access in local preview mode."]]);
    }
    if (activeSection === "settings") {
      return renderCards("Settings", "Website contact, SEO, and publishing settings.", [
        ["Phone", "+962 777 066 779", "Used in header, hero, contact section, and WhatsApp links."],
        ["Sales email", "sales@kmagency.online", "Used for thank-you emails through Hostinger SMTP."],
        ["SEO domain", "https://kmagency.online", "Used for canonical URLs, sitemap, and structured data."]
      ]);
    }
    return (
      <div className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["Inquiries", rows.length],
            ["Services", serviceCount || 0],
            ["Packages", packageCount || 0],
            ["Blog posts", postCount || 0]
          ].map(([label, value]) => (
            <Link key={label} href={`/admin?section=${String(label).toLowerCase().replace(" posts", "").replace("inquiries", "inquiries")}`} className="rounded-ui border border-line bg-white p-5 shadow-soft transition hover:border-brand-500">
              <p className="text-sm font-bold text-muted">{label}</p>
              <strong className="mt-2 block text-4xl font-black text-ink">{value}</strong>
            </Link>
          ))}
        </div>
        {renderInquiries()}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F7FB]">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-line bg-[#0E1836] p-5 text-white lg:block">
        <Link href="/ar" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-ui bg-white text-sm font-black text-brand-900">KM</span>
          <span className="text-lg font-black">KM Admin</span>
        </Link>
        <nav className="mt-10 grid gap-2 text-sm font-bold text-white/75">
          {navItems.map(([id, label]) => (
            <Link key={id} href={`/admin?section=${id}`} className={`rounded-ui px-3 py-2 transition hover:bg-white/10 hover:text-white ${activeSection === id ? "bg-white/14 text-white" : ""}`}>
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="lg:pl-72">
        <header className="sticky top-0 z-30 flex min-h-20 items-center justify-between border-b border-line bg-white/90 px-5 backdrop-blur">
          <div>
            <h1 className="text-2xl font-black text-ink">{navItems.find(([id]) => id === activeSection)?.[1] || "Dashboard"}</h1>
            <p className="text-sm text-muted">Protected lead and content management</p>
          </div>
          <form action={logoutAction}>
            <button className="rounded-ui border border-line bg-white px-4 py-2 text-sm font-bold text-ink" type="submit">Log out</button>
          </form>
        </header>

        <div className="p-5">
          <div className="mb-4 flex gap-2 overflow-x-auto lg:hidden">
            {navItems.map(([id, label]) => (
              <Link key={id} href={`/admin?section=${id}`} className={`whitespace-nowrap rounded-ui border px-3 py-2 text-sm font-bold ${activeSection === id ? "border-brand-600 bg-brand-600 text-white" : "border-line bg-white text-ink"}`}>
                {label}
              </Link>
            ))}
          </div>
          {renderSection()}
        </div>
      </section>
    </main>
  );
}

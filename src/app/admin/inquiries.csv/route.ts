import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { hasPreviewAdminSession } from "@/lib/admin-session";
import { getLocalInquiries } from "@/lib/local-inquiries";

export async function GET() {
  const previewAdmin = await hasPreviewAdminSession();
  if (!previewAdmin && !isSupabaseConfigured()) return new Response("Unauthorized", { status: 401 });

  const supabase = await createSupabaseServerClient();
  const { data: userData } = isSupabaseConfigured() ? await supabase.auth.getUser() : { data: { user: null } };
  if (!userData.user && !previewAdmin) return new Response("Unauthorized", { status: 401 });

  if (!isSupabaseConfigured()) {
    const localRows = await getLocalInquiries();
    const header = ["reference", "name", "email", "phone", "service", "budget", "status", "emailStatus", "createdAt"];
    const csv = [
      header.join(","),
      ...localRows.map(row =>
        [
          row.reference,
          row.name,
          row.email,
          row.phone,
          row.services.title_en,
          row.budget || "",
          row.status,
          row.email_status,
          row.created_at
        ].map(value => JSON.stringify(value)).join(",")
      )
    ].join("\n");

    return new Response(csv, {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": "attachment; filename=km-agency-inquiries.csv"
      }
    });
  }

  const { data: rows } = await supabase
    .from("inquiries")
    .select("reference,name,email,phone,budget,status,created_at,services(title_en)")
    .order("created_at", { ascending: false });
  const header = ["reference", "name", "email", "phone", "service", "budget", "status", "createdAt"];
  const csv = [
    header.join(","),
    ...(rows || []).map(row =>
      [
        row.reference,
        row.name,
        row.email,
        row.phone,
        (Array.isArray(row.services) ? row.services[0] : row.services)?.title_en || "",
        row.budget || "",
        row.status,
        row.created_at
      ].map(value => JSON.stringify(value)).join(",")
    )
  ].join("\n");

  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": "attachment; filename=km-agency-inquiries.csv"
    }
  });
}

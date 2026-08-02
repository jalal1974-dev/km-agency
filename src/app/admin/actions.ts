"use server";

import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { clearPreviewAdminSession, isLocalAdminCredential, setPreviewAdminSession } from "@/lib/admin-session";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  if (isLocalAdminCredential(email, password)) {
    await setPreviewAdminSession();
    redirect("/admin");
  }

  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (!error) redirect("/admin");
  }

  redirect("/admin/login?error=1");
}

export async function logoutAction() {
  await clearPreviewAdminSession();
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}

export async function goToAdmin() {
  redirect("/admin");
}

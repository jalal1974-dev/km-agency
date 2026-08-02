import { redirect } from "next/navigation";
import { loginAction } from "@/app/admin/actions";
import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { hasPreviewAdminSession } from "@/lib/admin-session";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await hasPreviewAdminSession()) redirect("/admin");
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    if (data.user) redirect("/admin");
  }
  const { error } = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center bg-[#0E1836] p-6">
      <section className="w-full max-w-md rounded-ui bg-white p-7 shadow-soft">
        <div className="mb-7">
          <span className="grid h-12 w-12 place-items-center rounded-ui bg-brand-900 text-sm font-black text-white">KM</span>
          <h1 className="mt-5 text-3xl font-black text-ink">Admin Login</h1>
          <p className="mt-2 text-muted">Protected dashboard access for KM Agency administrators.</p>
        </div>
        <form action={loginAction} className="grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-black">Email</span>
            <input className="rounded-ui border border-line px-3 py-3 focus-ring" name="email" type="email" required placeholder="ceo@kmagency.online" defaultValue="ceo@kmagency.online" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-black">Password</span>
            <input className="rounded-ui border border-line px-3 py-3 focus-ring" name="password" type="password" required placeholder="••••••••" />
          </label>
          <button className="min-h-11 rounded-ui bg-brand-600 px-4 py-3 text-sm font-bold text-white shadow-soft" type="submit">
            Sign in
          </button>
        </form>
        {error ? <p className="mt-4 rounded-ui bg-red-50 p-3 text-sm font-bold text-red-700">Invalid email or password.</p> : null}
        <p className="mt-5 rounded-ui bg-slate-50 p-3 text-sm text-muted">
          Use the administrator account configured for this website.
        </p>
      </section>
    </main>
  );
}

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

type CookieToSet = { name: string; value: string; options: Record<string, unknown> };

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const publicKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export function isSupabaseConfigured() {
  return Boolean(
    url &&
      publicKey &&
      serviceKey &&
      !url.includes("replace-me") &&
      publicKey !== "replace-me" &&
      serviceKey !== "replace-me"
  );
}

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(url, publicKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server components cannot set cookies. Middleware or actions refresh them.
        }
      }
    }
  });
}

export function createSupabaseServiceClient() {
  return createClient(url, serviceKey || publicKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

import { cookies } from "next/headers";

const cookieName = "km_admin_preview";
const cookieValue = "authenticated";

export async function setPreviewAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(cookieName, cookieValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 8
  });
}

export async function clearPreviewAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export async function hasPreviewAdminSession() {
  const cookieStore = await cookies();
  return cookieStore.get(cookieName)?.value === cookieValue;
}

export function isLocalAdminCredential(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  return Boolean(adminEmail && adminPassword && email === adminEmail && password === adminPassword);
}

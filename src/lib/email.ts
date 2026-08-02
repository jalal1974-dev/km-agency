import nodemailer from "nodemailer";
import type { Locale } from "@/lib/i18n";

export type EmailStatus = "sent" | "not_configured" | "failed";

export async function sendThankYouEmail({
  to,
  name,
  reference,
  serviceName,
  locale
}: {
  to: string;
  name: string;
  reference: string;
  serviceName: string;
  locale: Locale;
}): Promise<EmailStatus> {
  const host = process.env.SMTP_HOST || "smtp.hostinger.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER || "sales@kmagency.online";
  const pass = process.env.SMTP_PASSWORD;

  if (!pass) return "not_configured";

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });

  const subject = locale === "ar" ? `تم استلام طلبك - ${reference}` : `We received your inquiry - ${reference}`;
  const html =
    locale === "ar"
      ? `<div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;line-height:1.8"><h2>شكرا ${name}</h2><p>تم استلام طلبك بخصوص خدمة <strong>${serviceName}</strong>.</p><p>رقم الطلب: <strong>${reference}</strong></p><p>سيتواصل معك فريق KM Agency قريبا.</p></div>`
      : `<div style="font-family:Arial,sans-serif;line-height:1.7"><h2>Thank you, ${name}</h2><p>We received your inquiry for <strong>${serviceName}</strong>.</p><p>Reference: <strong>${reference}</strong></p><p>The KM Agency team will contact you soon.</p></div>`;

  try {
    await transporter.sendMail({
      from: `KM Agency <${user}>`,
      to,
      subject,
      html
    });
    return "sent";
  } catch {
    return "failed";
  }
}

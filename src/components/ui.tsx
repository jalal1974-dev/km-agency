import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "dark" | "outline" | "whatsapp";
  className?: string;
}) {
  const styles = {
    primary: "bg-brand-600 text-white shadow-soft hover:bg-brand-500",
    dark: "bg-ink text-white hover:bg-brand-900",
    outline: "border border-line bg-white text-ink hover:border-brand-500",
    whatsapp: "bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
  };
  const external = href.startsWith("http");
  const content = (
    <span className={cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-ui px-4 py-2.5 text-sm font-bold transition", styles[variant], className)}>
      {variant === "whatsapp" ? <MessageCircle size={18} /> : null}
      {children}
      {external && variant !== "whatsapp" ? <ArrowUpRight size={17} /> : null}
    </span>
  );
  return external ? (
    <a href={href} target="_blank" rel="noreferrer">
      {content}
    </a>
  ) : (
    <Link href={href}>{content}</Link>
  );
}

export function SectionHeader({ kicker, title, text }: { kicker: string; title: string; text?: string }) {
  return (
    <div className="mb-8 max-w-3xl">
      <div>
        <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-sm font-bold text-brand-600">{kicker}</span>
        <h2 className="mt-4 text-3xl font-black tracking-normal text-ink md:text-5xl">{title}</h2>
      </div>
      {text ? <p className="mt-4 max-w-2xl text-base text-muted">{text}</p> : null}
    </div>
  );
}

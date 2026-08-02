import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type LocalInquiry = {
  id: string;
  reference: string;
  status: string;
  name: string;
  email: string;
  phone: string;
  budget: string | null;
  created_at: string;
  email_status: string;
  services: { title_en: string; title_ar: string };
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "inquiries.json");

export async function getLocalInquiries(): Promise<LocalInquiry[]> {
  try {
    const content = await readFile(dataFile, "utf8");
    return JSON.parse(content) as LocalInquiry[];
  } catch {
    return [];
  }
}

export async function saveLocalInquiry(inquiry: LocalInquiry) {
  await mkdir(dataDir, { recursive: true });
  const rows = await getLocalInquiries();
  await writeFile(dataFile, JSON.stringify([inquiry, ...rows], null, 2), "utf8");
}

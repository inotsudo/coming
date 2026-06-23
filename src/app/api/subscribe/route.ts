import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { resolveMx } from "dns/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "subscribers.json");

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "tempmail.com", "throwaway.email", "guerrillamail.com",
  "sharklasers.com", "guerrillamailblock.com", "grr.la", "dispostable.com",
  "yopmail.com", "trashmail.com", "fakeinbox.com", "tempail.com",
  "mailnesia.com", "maildrop.cc", "discard.email", "temp-mail.org",
]);

async function readSubscribers(): Promise<{ email: string; subscribedAt: string }[]> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeSubscribers(subscribers: { email: string; subscribedAt: string }[]) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(subscribers, null, 2));
}

async function verifyEmailDomain(email: string): Promise<{ valid: boolean; code?: string }> {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) {
    return { valid: false, code: "FORMAT" };
  }

  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { valid: false, code: "DISPOSABLE" };
  }

  try {
    const records = await resolveMx(domain);
    if (!records || records.length === 0) {
      return { valid: false, code: "NO_DOMAIN" };
    }
    return { valid: true };
  } catch {
    return { valid: false, code: "DOMAIN_NOT_EXIST" };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ code: "REQUIRED" }, { status: 400 });
    }

    const trimmed = email.trim().toLowerCase();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed)) {
      return NextResponse.json({ code: "FORMAT" }, { status: 400 });
    }

    const domainCheck = await verifyEmailDomain(trimmed);
    if (!domainCheck.valid) {
      return NextResponse.json({ code: domainCheck.code }, { status: 400 });
    }

    const subscribers = await readSubscribers();

    if (subscribers.some((s) => s.email === trimmed)) {
      return NextResponse.json({ code: "ALREADY" }, { status: 200 });
    }

    subscribers.push({ email: trimmed, subscribedAt: new Date().toISOString() });
    await writeSubscribers(subscribers);

    return NextResponse.json({ code: "SUCCESS" }, { status: 201 });
  } catch {
    return NextResponse.json({ code: "SERVER" }, { status: 500 });
  }
}

export async function GET() {
  const subscribers = await readSubscribers();
  return NextResponse.json({ count: subscribers.length, subscribers });
}

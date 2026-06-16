import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { defaultSession, sessionOptions, type SessionData } from "@/lib/session";

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session.isLoggedIn) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function verifyPin(pin: string): Promise<boolean> {
  const pinHash = process.env.PIN_HASH;
  if (!pinHash) {
    throw new Error("PIN_HASH is not configured");
  }
  return bcrypt.compare(pin, pinHash);
}

export async function createSession() {
  const session = await getSession();
  session.isLoggedIn = true;
  await session.save();
}

export async function destroySession() {
  const session = await getSession();
  session.isLoggedIn = false;
  Object.assign(session, defaultSession);
  await session.save();
}

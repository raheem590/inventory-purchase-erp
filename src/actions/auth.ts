"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSession, verifyPin } from "@/lib/auth";
import {
  checkRateLimit,
  clearAttempts,
  recordFailedAttempt,
} from "@/lib/rate-limit";
import { pinSchema } from "@/lib/validations";

export type LoginState = {
  error?: string;
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = pinSchema.safeParse(formData.get("pin"));

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid PIN" };
  }

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    "unknown";

  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return { error: rateLimit.message };
  }

  const isValid = await verifyPin(parsed.data);
  if (!isValid) {
    recordFailedAttempt(ip);
    return { error: "Incorrect PIN. Please try again." };
  }

  clearAttempts(ip);
  await createSession();
  redirect("/dashboard");
}

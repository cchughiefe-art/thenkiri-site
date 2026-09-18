import { createHmac, timingSafeEqual } from "crypto";

export function adminCookieValue() {
  const secret = process.env.ADMIN_COOKIE_SECRET || "";
  const password = process.env.ADMIN_PASSWORD || "";
  return createHmac("sha256", secret).update(password).digest("hex");
}

export function isAdminCookie(value?: string) {
  if (!value) return false;
  const expected = adminCookieValue();
  if (!expected || value.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}

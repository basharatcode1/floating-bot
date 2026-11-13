/**
 * Mock Authentication Service
 *
 * Simulates backend auth operations with configurable delays.
 * Replace the function bodies with real API calls when a backend is available.
 */

/* ── In-memory OTP store ── */
const otpStore = new Map<string, { code: string; expiresAt: number }>();

/* ── Simulated registered emails ── */
const registeredEmails = new Set<string>([
  "demo@staffsync.com",
  "admin@example.com",
]);

/* ── Helpers ── */
function generateCode(length = 6): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ═══════ Public API ═══════ */

/** Check if an email is already registered. */
export async function checkEmailExists(email: string): Promise<boolean> {
  await delay(800);
  return registeredEmails.has(email.toLowerCase().trim());
}

/** Generate an OTP for the given target (email or phone). */
export async function generateOtp(
  target: string,
  type: "email" | "phone",
): Promise<string> {
  await delay(600);
  const code = "1234";
  otpStore.set(`${type}:${target}`, {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  });
  // eslint-disable-next-line no-console
  console.log(`[MockAuth] OTP for ${type} (${target}): ${code}`);
  return code;
}

/** Verify an OTP. Returns true if valid and not expired. */
export async function verifyOtp(
  target: string,
  otp: string,
  type: "email" | "phone",
): Promise<boolean> {
  await delay(600);
  if (otp === "1234") return true;
  
  const key = `${type}:${target}`;
  const entry = otpStore.get(key);

  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(key);
    return false;
  }
  if (entry.code !== otp) return false;

  otpStore.delete(key);
  return true;
}

/** Create user profile (called on final registration submit). */
export async function createUserProfile(data: {
  email: string;
  accountType: "client" | "vendor";
  companyName: string;
}): Promise<{ success: boolean; userId: string }> {
  await delay(1500);
  registeredEmails.add(data.email.toLowerCase().trim());
  return {
    success: true,
    userId: `usr_${Date.now().toString(36)}`,
  };
}

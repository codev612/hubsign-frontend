interface CodeEntry {
  code: string;
  expiresAt: number; // Timestamp when the code will expire
}

export const verificationCodes: Record<string, CodeEntry> = {}; // Store in memory with expiry

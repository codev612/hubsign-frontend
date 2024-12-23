// app/api/verifyCode/route.ts
import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

import { verificationCodes } from "@/lib/shared";

export async function POST(req: Request) {
  const { email, code, userToken }: { email: string; code: string, userToken: string } = await req.json();

  const entry = verificationCodes[email]; // Access the stored entry for the email
  const currentTime = Date.now(); // Get current time
  // Check if code exists and is valid, and has not expired
  if (entry && entry.code === code && currentTime < entry.expiresAt) {
    delete verificationCodes[email]; // Remove code upon successful verification

    // Respond with a success message and URL for redirection
    return NextResponse.json(
      {
        message: "Code verified successfully",
        // redirect: '/signupsuccess'
      },
      { status: 200 },
    );
  } else {
    // Code is either invalid or expired
    return NextResponse.json(
      { error: "Invalid or expired verification code" },
      { status: 400 },
    );
  }
}

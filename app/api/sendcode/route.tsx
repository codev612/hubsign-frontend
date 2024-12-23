// app/api/sendVerificationCode/route.ts
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { NextResponse } from "next/server";
import { verificationCodes } from "@/lib/shared";
import jwt from "jsonwebtoken";

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY || "",
});

const sentFrom = new Sender(
  process.env.MAILERSEND_API_DOMAIN || "",
  "Dmytro Zaiets",
);

// Function to generate a random 6-digit verification code
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a random 6-digit number as a string
};

export async function POST(req: Request) {
  const { email }: { email: string } = await req.json();

  // Generate a 6-digit verification code
  const verificationCode = generateVerificationCode();

  const expiresAt = Date.now() + 3 * 60 * 1000; // Code expires in 3 minutes

  // Store the code along with its expiry time
  verificationCodes[email] = { code: verificationCode, expiresAt };

  const recipients = [new Recipient(email, "Your Client")];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject("Your verification code")
    .setHtml(
      `<p>Your verification code is: <strong>${verificationCode}</strong>. This code will be expired in 3 minutes.</p>`,
    )
    .setText(
      `<p>Your verification code is: <strong>${verificationCode}</strong>. This code will be expired in 3 minutes.</p>`,
    );

  try {
    const response = await mailerSend.email.send(emailParams);
    console.log(response);
    // Create a JWT
    const token = jwt.sign({ email }, process.env.JWT_SECRET || "esign", {
      expiresIn: "1h",
    });

    return NextResponse.json(
      { message: "Verification code sent" },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Unable to send email" },
      { status: 500 },
    );
  }
}

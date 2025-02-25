"use server";

import { redirect } from "next/navigation";

import { credential } from "@/interface/interface";
import { createSession } from "@/lib/session";

// Initialize the userInfo object with empty values
const userInfo: credential = {
  email: "",
  password: "",
};

export async function signin(prevState: any, formData: FormData) {
  if (
    (formData.get("email") as string) === "" ||
    (formData.get("password") as string) === ""
  )
    return { message: "enter an email or password", isLoding: false };

  userInfo.email = formData.get("email") as string as string;
  userInfo.password = formData.get("password") as string as string;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/signin`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...userInfo }),
    },
  );

  const json = await response.json();

  if (!response.ok) {
    return { message: json.message, isLoading: false };
  }

  await createSession(json.access_token);

  // Redirect to /checkinbox with the email as a query parameter
  return redirect("/plan");
}

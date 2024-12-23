"use server";

import { redirect } from "next/navigation";

// Define an interface for User Information
interface UserInfo {
  email: string;
  firstname: string;
  lastname: string;
  phonenumber: string;
  password: string;
}

// Initialize the userInfo object with empty values
const userInfo: UserInfo = {
  email: "",
  firstname: "",
  lastname: "",
  phonenumber: "",
  password: "",
};

export async function inputEmail(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;

  if (email === "") return redirect("/signupfree");
  const res = await fetch(`${process.env.SERVER_URL}/users/emailcheck`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: formData.get("email") }),
  });

  const user = await res.json();

  console.log(user);

  if (user.password) {
    return { message: "Already exists", isLoading: false };
  }

  userInfo.email = email;

  return redirect(`/signupstarted?uid=${user.userToken}`);
}

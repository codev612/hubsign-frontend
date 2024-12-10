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

const verifyCode: String = "";

export async function inputEmail(prevState: any, formData: FormData) {

  const email = formData.get("email") as string;

  if (email === "") return redirect("/signupfree");

  const res = await fetch(`${process.env.SERVER_URL}/users/emailcheck`,{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: formData.get("email") }),
  })

  const json = await res.json();
  console.log(res.status)

  switch (res.status) {
    case 409:
      return { message: 'Already exists' };
    case 201:
      userInfo.email = email;
      return redirect("/signupstarted");
    default:
      return { message: 'Please enter a valid email' };
  }
}

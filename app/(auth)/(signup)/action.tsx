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
  //   const res = await fetch('https://...')
  //   const json = await res.json()

  //   if (!res.ok) {
  // return { message: 'Please enter a valid email' }
  //   }
  userInfo.email = formData.get("email") as string;
  console.log(userInfo.email);

  if (userInfo.email === "") return redirect("/signupfree");

  return redirect("/signupstarted");
}

export async function inputContactInfo(prevState: any, formData: FormData) {
  //   const res = await fetch('https://...')
  //   const json = await res.json()

  //   if (!res.ok) {
  // return { message: 'Please enter a valid email' }
  //   }

  userInfo.firstname = formData.get("firstname") as string;
  userInfo.lastname = formData.get("lastname") as string;
  userInfo.phonenumber = formData.get("phonenumber") as string;

  if (userInfo.email === "") return redirect("/signupfree");

  const response = await fetch(
    "http://localhost:3000/api/sendverificationcode",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: userInfo.email, name: userInfo.firstname }),
    },
  );

  console.log(userInfo);

  if (!response.ok) {
    return { message: "Invalid email" };
  }

  // return redirect("/signupcheck");
  return redirect("/signupcheck");
}

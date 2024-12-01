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
  if(userInfo.email === "") return redirect("/signupfree");

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
  console.log(userInfo);

  if(userInfo.email === "") return redirect("/signupfree");

  // return redirect("/signupcheck");
  return redirect("/signupcheck");
}

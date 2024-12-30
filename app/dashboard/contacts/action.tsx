"use server";

import { redirect } from "next/navigation";
import { siteConfig } from "@/config/site";
import { getUser } from "@/lib/dal";

export async function updateContact(prevState: any, formData: FormData) {
  if (
    (formData.get("email") as string) === "" ||
    (formData.get("name") as string) === ""
  )
    return { message: "enter an email or name", isLoding: false };

  const id = formData.get("id") as string

  const user = await getUser();
  if(!user) return redirect("/signin");

  const url = id === "new" 
    ? `${siteConfig.links.server}/contacts/update` 
    : `${siteConfig.links.server}/contacts/update/${id}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
        user: user.email,
        email: formData.get("email") as string, 
        name: formData.get("name") as string }),
  });

  if (!response.ok) {
    return { message: "Server error", isLoading: false };
  }
  
  // Redirect to /checkinbox with the email as a query parameter
  // return {message: json, isLoading: false};
  redirect("/dashboard/contacts");
}

import { redirect } from "next/navigation";

import { siteConfig } from "@/config/site";

// Define an interface for User Information
interface UserInfo {
  email: string;
  password: string;
}

// Initialize the userInfo object with empty values
const userInfo: UserInfo = {
  email: "",
  password: "",
};

export async function inputEmail(prevState: any, formData: FormData) {
  if ((formData.get("email") as string) === "")
    return { message: "enter an email", isLoding: false };

  userInfo.email = formData.get("email") as string as string;
  const user = await fetch(`${siteConfig.links.server}/users/emailcheck`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: formData.get("email") as string }),
  });

  const json = await user.json();

  if (!json.password) {
    return { message: "Not existing user", isLoading: false };
  }

  const response = await fetch("/api/sendcode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: formData.get("email") as string }),
  });

  const json1 = await response.json();

  if (!response.ok) return { message: "Invalid email", isLoading: false };

  // Redirect to /checkinbox with the email as a query parameter
  return redirect(`/checkinbox?uid=${json.userToken}`);
}

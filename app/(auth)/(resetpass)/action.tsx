import { redirect } from "next/navigation";

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
    return { message: "enter an email" };

  userInfo.email = formData.get("email") as string as string;

  const response = await fetch(
    "http://localhost:3000/api/sendverificationcode",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: formData.get("email") as string }),
    },
  );

  if (!response.ok) return { message: "Invalid email" };

  // Redirect to /checkinbox with the email as a query parameter
  return redirect(
    `/checkinbox?email=${encodeURIComponent(formData.get("email") as string)}`,
  );
}

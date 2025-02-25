"use server";

import { getUser } from "@/lib/dal";

export async function updateContact(prevState: any, formData: FormData) {
  if (
    (formData.get("email") as string) === "" ||
    (formData.get("name") as string) === ""
  )
    return { message: "enter an email or name", isLoding: false };

  const id = formData.get("id") as string;

  const user = await getUser();

  if (!user)
    return {
      state: "error",
      message: "Server disconnected",
      data: {},
      isLoading: false,
    };

  const url =
    id === "new"
      ? `${process.env.NEXT_PUBLIC_SERVER_URL}/contacts/update`
      : `${process.env.NEXT_PUBLIC_SERVER_URL}/contacts/update/${id}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: user.email,
        email: formData.get("email") as string,
        name: formData.get("name") as string,
      }),
    });

    const json = await response.json();

    if (!response.ok) {
      return { state: "error", message: "Error", data: {}, isLoading: false };
    }

    return {
      state: "success",
      message: "Success",
      data: json,
      isLoading: false,
    };
  } catch (error) {
    console.log(error);

    return {
      state: "error",
      message: "Server disconnected",
      data: {},
      isLoading: false,
    };
  }
}

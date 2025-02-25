import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const verifySession = cache(async () => {
  const session = (await cookies()).get("session")?.value;

  if (!session) {
    return null;
  }

  return session;
});

export const getUser = cache(async () => {
  const session = await verifySession();

  if (!session) redirect("/signin");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/profile`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`, // Attach token to Authorization header
        },
      },
    );

    const json = await response.json();

    if (!response.ok) {
      console.log(response);
      redirect("/signin");
    }

    return json;
  } catch (error) {
    console.log(error);

    return null;
  }
});

export const getContacts = async () => {
  const session = await verifySession();

  if (!session) redirect("/signin");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/contacts`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session}`, // Attach token to Authorization header
        },
      },
    );

    const json = await response.json();

    if (!response.ok) {
      redirect("/signin");
    }

    return json;
  } catch (error) {
    console.log(error);

    return null;
  }
};

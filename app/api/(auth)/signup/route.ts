// app/api/verifyCode/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const {
    email,
    userToken,
    firstname,
    lastname,
    phonenumber,
    password,
  }: {
    email: string;
    userToken: string;
    firstname: string;
    lastname: string;
    password: string;
    phonenumber: string;
  } = await req.json();

  // Check if code exists and is valid, and has not expired
  if (userToken === "") {
    return NextResponse.json(
      {
        error: "invalid token",
      },
      { status: 400 },
    );
  } else {
    const response = await fetch(`${process.env.SERVER_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        userToken,
        firstname,
        lastname,
        phonenumber,
        password,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          message: "Server error",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "Signed up successfully",
      },
      { status: 201 },
    );
  }
}

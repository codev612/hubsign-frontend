// app/api/verifyCode/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const { email, firstname, lastname, phonenumber, token, password }: 
        { email: string; firstname: string, lastname: string, 
        password: string, phonenumber: string, token: string } = await req.json();

  // Check if code exists and is valid, and has not expired
  if (!token) {
    return NextResponse.json(
      {
        error: "invalid token",
      },
      { status: 400 },
    );
  } else {
    try {
        jwt.verify(token, process.env.JWT_SECRET || ''); // Verify the token
        const response = await fetch(`${process.env.SERVER_URL}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, firstname, lastname, phonenumber, password }), 
        })
        if(!response.ok) {
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
      } catch (error) {
        return NextResponse.json(
            {
                error: "invalid token",
            },
            { status: 400 },
        );
      }
  }
}

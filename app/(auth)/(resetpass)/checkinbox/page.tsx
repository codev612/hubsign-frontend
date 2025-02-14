"use client";

import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import StateBoard from "@/components/ui/stateboard";

export default function Checkinbox() {
  const searchParams = useSearchParams(); // Get search params
  const userToken = searchParams.get("uid");
  const email = Cookies.get("email"); // Retrieve the email from the query string

  const router = useRouter();

  const [state, setState] = useState({
    state: "text-error",
    bgColor: "bg-bgdanger",
    text: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [code, setCode] = useState<string[]>(Array(6).fill("")); // Create an array with 6 empty strings

  const handleChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;

    // Allow only one digit
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newCode = [...code];

      newCode[index] = value;
      setCode(newCode);

      // Focus next input field
      if (value && index < 5) {
        document.getElementById(`digit-${index + 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      // Focus previous input if backspace is pressed on empty input
      document.getElementById(`digit-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (
    event: React.ClipboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    const pastedData = event.clipboardData.getData("text");

    // Check if pasted data is exactly 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split("").map((digit) => digit);

      setCode(newCode);
      document.getElementById(`digit-5`)?.focus(); // Focus last input
      event.preventDefault(); // Prevent default paste behavior
    } else {
      event.preventDefault(); // Prevent invalid paste
    }
  };

  useEffect(() => {
    Cookies.set("USER_TOKEN", userToken || "");
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const verificationCode = code.join(""); // Join the array to submit as a string

    try {
      setIsLoading(true);
      const response = await fetch("/api/verifycode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          code: verificationCode,
          userToken,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        setState({
          ...state,
          text: json.error,
          state: "text-error",
          bgColor: "bg-bgdanger",
        });
        setIsLoading(false);

        return;
      } else {
        // const data = await response.json();
        router.push(`/newpass`);
      }
    } catch (error) {
      setState({
        ...state,
        text: "Unexpected error. Try later",
        state: "text-error",
        bgColor: "bg-bgdanger",
      });
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const response = await fetch("/api/sendcode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: Cookies.get("email"),
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        setState({
          ...state,
          text: json.error,
          state: "text-error",
          bgColor: "bg-bgdanger",
        });

        return;
      } else {
        setState({
          ...state,
          text: "Resent a confirmation code.",
          state: "text-text",
          bgColor: "bg-info",
        });
      }
    } catch (error) {
      setState({
        ...state,
        text: "Unexpected error. Try later",
        state: "text-error",
        bgColor: "bg-bgdanger",
      });
    }
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <form
        className="flex flex-col justify-center bg-forecolor p-10 gap-4 rounded-md"
        style={{ width: "382px" }}
        onSubmit={handleSubmit}
      >
        <p style={{ fontSize: "1.5rem", fontWeight: 500 }}>Check your inbox</p>
        <p className="text-text mb-2">
          Please enter 6-digit code. Then create and confirm your new password.
        </p>
        <div className="flex justify-around">
          {code.map((digit, index) => (
            <input
              key={index}
              required
              className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md"
              id={`digit-${index}`}
              maxLength={1}
              type="text"
              value={digit}
              onChange={(event) => handleChange(index, event)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onPaste={(event) => handlePaste(event, index)}
            />
          ))}
        </div>
        {state.text !== "" ? (
          <StateBoard
            bgColor={state.bgColor}
            state={state.state}
            text={state.text}
          />
        ) : (
          ""
        )}
        <div className="text-sm">
          {"Didn't get the code? "}
          <Button
            className="bg-forecolor text-link"
            size="md"
            onPress={handleResend}
          >
            Resend the code
          </Button>
        </div>
        <Button
          fullWidth
          className="text-white"
          color="primary"
          isLoading={isLoading}
          size="md"
          type="submit"
        >
          Verify
        </Button>
      </form>
    </section>
  );
}

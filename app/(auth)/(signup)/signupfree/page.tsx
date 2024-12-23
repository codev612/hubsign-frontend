"use client";

import React, { useEffect, useState } from "react";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import { useFormState } from "react-dom";
import Cookies from "js-cookie";
import { inputEmail } from "../action";
import LoadingButton from "@/components/global/loadingbutton";
import StateBoard from "@/components/global/stateboard";

const initialState = {
  message: "",
  isLoading: false,
};

export default function Signupfree() {
  const [state, formAction] = useFormState(inputEmail, initialState);

  // email format validation
  const [value, setEmailValue] = useState("");

  const [isLoading, setIsLoading] = useState(initialState.isLoading);

  const validateEmail = (value: string) =>
    // value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
    value.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/);

  const isInvalid = React.useMemo(() => {
    if (value === "") return false;
    Cookies.set("email", value);

    return validateEmail(value) ? false : true;
  }, [value]);

  useEffect(() => {
    setEmailValue(Cookies.get("email") || "");
  }, []);

  useEffect(()=>setIsLoading(state.isLoading),[state]);

  return (
    <form
      action={formAction}
      onSubmit={()=>setIsLoading(true)}
      className="flex flex-col items-start justify-center bg-background gap-4 rounded-md max-w-lg"
      style={{ width: "24rem" }}
    >
      <p style={{ fontSize: "2rem", fontWeight: 500 }}>
        Signup to eSign and try for free for 30 days
      </p>
      <p className="text-text mb-2 text-sm">
        Enter your email to get started. No credit card required
      </p>
      <div className="flex flex-col w-full">
        <Input
          required
          errorMessage="Please enter a valid email format"
          isInvalid={isInvalid}
          label="Email"
          labelPlacement={"outside"}
          name="email"
          placeholder="Enter your email"
          size="md"
          type="email"
          value={value}
          variant={"bordered"}
          onValueChange={setEmailValue}
        />
        { state.message!=="" ? <StateBoard state="text-error" text={state.message} /> : "" }
      </div>
      <LoadingButton title="Get Started" isLoading={isLoading}></LoadingButton>

      <div className="flex flex-col items-center justify-center">
        <div>
          By clicking the Get Started above, you agree to the{" "}
          <Link href="/">
            <p>Terms & Conditions</p>
          </Link>{" "}
          and{" "}
          <Link href="/">
            <p>Privacy Policy</p>
          </Link>
        </div>
      </div>
    </form>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useFormState } from "react-dom";
import Cookies from "js-cookie";
import { inputEmail } from "../action";
import LoadingButton from "@/components/global/loadingbutton";
import StateBoard from "@/components/global/stateboard";

const initialState = {
  message: "",
  isLoading: false,
};

export default function Resetpass() {
  const [state, formAction] = useFormState(inputEmail, initialState);
  // email format validation
  const [value, setEmailValue] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(initialState.isLoading);

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isInvalid = React.useMemo(() => {
    if (value === "") return false;
    Cookies.set("email", value);
    return validateEmail(value) ? false : true;
  }, [value]);

  useEffect(()=>setIsLoading(false),[state]);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <form
        action={formAction}
        onSubmit={()=>setIsLoading(true)}
        className="flex flex-col justify-center bg-forecolor p-10 gap-4 rounded-md"
        style={{ width: "382px" }}
      >
        <p style={{ fontSize: "1.5rem", fontWeight: 500 }}>Reset Password</p>
        <p className="text-text mb-2">
          Please provide the email address linked to your eSign account, and we
          will send instructions to reset your password
        </p>
        <Input
          required
          errorMessage="Please enter a valid email"
          isInvalid={isInvalid}
          label="Email"
          labelPlacement={"outside"}
          name="email"
          placeholder="Enter your email"
          size="md"
          type="text"
          variant={"bordered"}
          onValueChange={setEmailValue}
        />
        { state.message!=="" ? <StateBoard state="text-error" text={state.message} /> : "" }
        <LoadingButton title="Send Verification Email" isLoading={isLoading}></LoadingButton>
        <Link href="/signin">
          <Button fullWidth className="text-text" size="md" variant="bordered">
            Back to Log in
          </Button>
        </Link>
      </form>
    </section>
  );
}

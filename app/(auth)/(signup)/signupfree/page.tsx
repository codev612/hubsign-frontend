"use client";

import React, { useEffect, useState } from "react";
import { Link } from "@nextui-org/link";
// import { Snippet } from "@nextui-org/snippet";
// import { Code } from "@nextui-org/code";
// import { button as buttonStyles } from "@nextui-org/theme";
// import { siteConfig } from "@/config/site";
// import { title, subtitle } from "@/components/primitives";
// import { GithubIcon } from "@/components/icons";
import { Input } from "@nextui-org/input";
// import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
// import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { Button } from "@nextui-org/button";
import { useFormState } from "react-dom";

import { inputEmail } from "../action";

const initialState = {
  message: "",
};

export default function Signupfree() {
  const [state, formAction] = useFormState(inputEmail, initialState);

  // email format validation
  const [value, setEmailValue] = useState("");

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isInvalid = React.useMemo(() => {
    if (value === "") return false;
    localStorage.setItem("email", value);

    return validateEmail(value) ? false : true;
  }, [value]);

  useEffect(() => {
    setEmailValue(localStorage.getItem("email") || "");
  }, []);

  return (
    <form
      action={formAction}
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
        <p className="text-error">{state.message}</p>
      </div>
      <Button
        fullWidth
        className="text-white"
        color="primary"
        size="md"
        type="submit"
      >
        Get Started
      </Button>
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

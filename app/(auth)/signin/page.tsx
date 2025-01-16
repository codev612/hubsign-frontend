"use client";

import React, { useEffect, useState } from "react";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { signin } from "./action";
import LoadingButton from "@/components/common/loadingbutton";
import StateBoard from "@/components/common/stateboard";

interface InitialState {
  message: string;
  isLoading: boolean;
}

const initialState: InitialState = {
  message: "",
  isLoading: false,
};

export default function Signin() {
  const router = useRouter();
  const [state, formAction] = useActionState(signin, initialState);
  // visible password
  const [isVisible, setIsVisible] = useState(false);
  // loading button
  const [isLoading, setIsLoading] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  // email format validation
  const [value, setEmailValue] = useState("");

  const [password, setPassword] = useState("");

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isInvalid = React.useMemo(() => {
    if (value === "") return false;

    return validateEmail(value) ? false : true;
  }, [value]);

  useEffect(() => {
    setIsLoading(false);
  }, [state]);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <form
        action={formAction}
        className="flex flex-col justify-center bg-forecolor p-10 gap-4 rounded-md"
        style={{ width: "382px" }}
        onSubmit={() => setIsLoading(true)}
      >
        <p style={{ fontSize: "2rem", fontWeight: 500 }}>Log in to eSign</p>
        <p className="text-text mb-2">
          Enter your credentials to access your account
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
          type="email"
          value={value}
          variant="bordered"
          onValueChange={setEmailValue}
        />
        <Input
          required
          className="mb-0"
          endContent={
            <button
              aria-label="toggle password visibility"
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <VisibilityOffOutlinedIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <VisibilityOutlinedIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          errorMessage="Please enter a valid password"
          label="Password"
          labelPlacement={"outside"}
          name="password"
          placeholder="Enter your password"
          size="md"
          type={isVisible ? "text" : "password"}
          value={password}
          variant="bordered"
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* <p className="text-error mt-0" style={{fontSize:'12px', textAlign:'left'}}>{state}</p> */}
        {state.message !== "" ? (
          <StateBoard state="text-error" text={state.message} />
        ) : (
          ""
        )}
        <Link href="/resetpass">
          <p className="text-text test-start" style={{ textAlign: "start" }}>
            {"Forgot your password?"}
          </p>
        </Link>
        <LoadingButton isLoading={isLoading} title="Login" />
        <div className="flex flex-col items-center justify-center">
          <Link href="/signupfree">
            <p className="text-text">{"Don't have an account?"}</p>
          </Link>
          <Link href="/signupfree">
            <p>Signup for 30 days free trial</p>
          </Link>
        </div>
      </form>
    </section>
  );
}

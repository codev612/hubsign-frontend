"use client";

import React, { useState } from "react";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { Button } from "@nextui-org/button";
import LoadingButton from "@/components/global/loadingbutton";
import { siteConfig } from "@/config/site";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Signin() {
  const router = useRouter();
  // visible password
  const [isVisible, setIsVisible] = useState(false);
  // loading button
  const [isLoading, setIsLoading] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  // email format validation
  const [value, setEmailValue] = useState("");
  
  const [password, setPassword] = useState("");

  const [state, setState] = useState("");

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const isInvalid = React.useMemo(() => {
    if (value === "") return false;

    return validateEmail(value) ? false : true;
  }, [value]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    const response = await fetch(`${siteConfig.links.server}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email:value, password: password }),
    });

    setIsLoading(false);

    const data = await response.json();

    if (!response.ok) {
      setState(data.message);
      return;
    }
      
    Cookies.set("ACCESS_TOKEN", data.access_token);
    console.log(data)
    console.log('signin success');
    // router.push(`/signin`);
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <form
        className="flex flex-col justify-center bg-forecolor p-10 gap-4 rounded-md"
        style={{ width: "382px" }}
        onSubmit={handleSubmit}
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
          placeholder="Enter your email"
          size="md"
          type="email"
          variant={"bordered"}
          onValueChange={setEmailValue}
        />
        <Input
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
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
          errorMessage="Please enter a valid password"
          label="Password"
          labelPlacement={"outside"}
          placeholder="Enter your password"
          size="md"
          type={isVisible ? "text" : "password"}
          variant="bordered"
        />
        <p className="text-error mt-0" style={{fontSize:'12px', textAlign:'left'}}>{state}</p>
        <Link href="/resetpass">
          <p className="text-text test-start" style={{textAlign:'start'}}>{"Forgot your password?"}</p>
        </Link>
        <LoadingButton title="Login" isLoading={isLoading}></LoadingButton>
        <div className="flex flex-col items-center justify-center">
          <Link href="/signupfree">
            <p className="text-text">{"Don't have an account?"}</p>
          </Link>
          <Link href="/signupfree">
            <p>Signup for 30 days free trial</p>
          </Link>
        </div>
      </form>
      {/* <div className="inline-block max-w-xl text-center justify-center bg-forecolor">
            <span className={title()}>Make&nbsp;</span>
            <span className={title({ color: "violet" })}>Signin&nbsp;</span>
            <br />
            <span className={title()}>
            websites regardless of your design experience.
            </span>
            <div className={subtitle({ class: "mt-4" })}>
            Beautiful, fast and modern React UI library.
            </div>
        </div>

        <div className="flex gap-3">
            <Link
            isExternal
            className={buttonStyles({
                color: "primary",
                radius: "full",
                variant: "shadow",
            })}
            href={siteConfig.links.docs}
            >
            Documentation
            </Link>
            <Link
            isExternal
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href={siteConfig.links.github}
            >
            <GithubIcon size={20} />
            GitHub
            </Link>
        </div>

        <div className="mt-8">
            <Snippet hideCopyButton hideSymbol variant="bordered">
            <span>
                Get started by editing <Code color="primary">app/page.tsx</Code>
            </span>
            </Snippet>
        </div> */}
    </section>
  );
}

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
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { Button } from "@nextui-org/button";
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation';
import { siteConfig } from "@/config/site";

export default function Newpass() {
  //
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [passState6, setPassState6] = useState(false);
  const [passStateContain, setPassStateContain] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [match, setMatch] = useState(false);
  const [state, setState] = useState("");

  // Regex pattern for password validation
  // const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[<>])(?=\S)(.{6,})$/;// At least 6 characters, one uppercase, one lowercase, and no spaces
  const invalidCharPattern = /[<>]/; // Invalid characters: < and >

  const validatePassword = (inputPassword: string) => {
    // Check password length
    if (password.length >= 6) {
      setPassState6(true);
    } else {
      setPassState6(false);
    }

    // Check for invalid characters
    console.log(setPassStateContain(!invalidCharPattern.test(inputPassword)));

    // if (passwordPattern.test(inputPassword)) {
    //     setPassStateContain(true)
    //     // setErrorMessage(''); // Clear error message on valid password
    // } else {
    //     setPassStateContain(false)
    //     // setErrorMessage('Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, and one of the special characters (< or >), and must not contain spaces.');
    // }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setPassword(value);
    validatePassword(value);
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;

    setConfirmPassword(value);

    value === password ? setMatch(true) : setMatch(false);
  };

  // visible password
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const PasswordDesc = () => (
    <div>
      <div className="flex items-center gap-1">
        <input
          readOnly
          style={{
            borderRadius: "50%", // Makes the input circular
            width: "10px", // Width of the input dot
            height: "10px", // Height of the input dot
            backgroundColor: passState6 ? "blue" : "inherit",
          }}
        />
        <p className="text-text">at least 6 characters</p>
      </div>
      <div className="flex items-center gap-1">
        <input
          readOnly
          style={{
            borderRadius: "50%", // Makes the input circular
            width: "10px", // Width of the input dot
            height: "10px", // Height of the input dot
            backgroundColor: passStateContain ? "blue" : "inherit",
          }}
        />
        <p className="text-text">{"1 not containing spaces and <,> case"}</p>
      </div>
    </div>
  );

  const MatchDesc = () => (
    <p className="text-text">{match ? "Match" : "Not match"}</p>
  );

  const handleResetPass = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch(`${siteConfig.links.server}/users/resetpass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userToken: Cookies.get("USER_TOKEN"), password: password }),
    });

    if (!response.ok) {
      // setState("Invalid code");
      setState("Reset failed");
      return;
    } else {
      // const data = await response.json();
      Cookies.remove("USER_TOKEN");
      router.push(`/signin`);
    }
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <form
        className="flex flex-col items-center justify-center bg-forecolor p-10 gap-4 rounded-md"
        style={{ width: "382px" }}
        onSubmit={handleResetPass}
      >
        <p style={{ fontSize: "2rem", fontWeight: 500 }}>New Password</p>
        <p className="text-text mb-2">
          Enter your credentials to access your account
        </p>
        <Input
          description={<PasswordDesc />}
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
          label="Password"
          labelPlacement={"outside"}
          placeholder="Enter your password"
          size="md"
          type={isVisible ? "text" : "password"}
          value={password}
          variant="bordered"
          onChange={handlePasswordChange}
        />
        <Input
          description={<MatchDesc />}
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
          label="Password"
          labelPlacement={"outside"}
          placeholder="Enter your password"
          size="md"
          type={isVisible ? "text" : "password"}
          value={confirmPassword}
          variant="bordered"
          onChange={handleConfirmPasswordChange}
        />
        <p className="text-error">{state}</p>
        <Button fullWidth className="text-white" color="primary" size="md" type="submit">
          Reset Password
        </Button>
        <div className="flex flex-col items-center justify-center">
          <Link href="/">
            <p className="text-text">{"Don't have an account?"}</p>
          </Link>
          <Link href="/">
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

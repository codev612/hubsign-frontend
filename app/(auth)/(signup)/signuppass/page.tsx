"use client";

import React, { useState } from "react";
import { Input } from "@nextui-org/input";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Signuppass: React.FC = () => {
  // State variables with TypeScript types
  const router = useRouter();
  const [password, setPassword] = useState<string>("");
  const [passState6, setPassState6] = useState<boolean>(false);
  const [passStateContain, setPassStateContain] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [match, setMatch] = useState<boolean>(false);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [state, setState] = useState<String>("");

  // Regex pattern for password validation
  const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[<>])(?=\S)(.{6,})$/; // At least 4 characters, one uppercase, one lowercase, and specific character "+<>"
  const invalidCharPattern = /[<>]/; // Invalid characters: < and >

  // Validate password length and content
  const validatePassword = (inputPassword: string) => {
    const lengthValid = inputPassword.length > 5;

    setPassState6(lengthValid);
    setPassStateContain(!invalidCharPattern.test(inputPassword));

    return lengthValid && !invalidCharPattern.test(inputPassword);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const isMatch = value === confirmPassword;

    setMatch(isMatch);
    setPassword(value);

    const isValid = validatePassword(value);

    setIsPasswordValid(isValid && isMatch); // Update the button status
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;

    setConfirmPassword(value);

    const isMatch = value === password;

    setMatch(isMatch);

    // Update valid state depending on password validation and match
    setIsPasswordValid(isMatch && validatePassword(password));
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  // Password Description component
  const PasswordDesc: React.FC = () => (
    <div>
      <div className="flex items-center gap-1">
        <input
          readOnly
          style={{
            borderRadius: "50%",
            width: "10px",
            height: "10px",
            backgroundColor: passState6 ? "blue" : "inherit",
          }}
        />
        <p className="text-text">at least 6 characters</p>{" "}
        {/* Changed to 6 characters as per regex */}
      </div>

      <div className="flex items-center gap-1">
        <input
          readOnly
          style={{
            borderRadius: "50%",
            width: "10px",
            height: "10px",
            backgroundColor: passStateContain ? "blue" : "inherit",
          }}
        />
        <p className="text-text">{"1 not containing spaces and <,> case"}</p>
      </div>
    </div>
  );

  const MatchDesc: React.FC = () => (
    <p className="text-text">{match ? "Match" : "Not match"}</p>
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: Cookies.get("email"),
        firstname: Cookies.get("firstname"),
        lastname: Cookies.get("lastname"),
        phonenumber: Cookies.get("phonenumber"),
        password: password,
        userToken: Cookies.get("USER_TOKEN"),
      }),
    });

    if (!response.ok) {
      setState("Signup failed");

      return;
    } else {
      Cookies.remove("USER_TOKEN");
      router.push("/signupsuccess"); // Navigate to the next step
    }
  };

  return (
    <form
      className="flex flex-col items-start justify-center bg-background gap-4 rounded-md max-w-lg w-full"
      style={{ width: "32rem" }}
      onSubmit={handleSubmit}
    >
      <p style={{ fontSize: "2rem", fontWeight: 500 }}>New Password</p>
      <p className="text-text mb-2 text-sm">
        Enter your credentials to access your account
      </p>

      <Input
        fullWidth
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
        label="Confirm Password"
        labelPlacement={"outside"}
        placeholder="Confirm your password"
        size="md"
        type={isVisible ? "text" : "password"}
        value={confirmPassword}
        variant="bordered"
        onChange={handleConfirmPasswordChange}
      />
      <p className="text-error">{state}</p>

      <Button
        fullWidth
        className="text-white"
        color="primary"
        isDisabled={!isPasswordValid}
        size="md"
        type="submit"
      >
        Start using eSign
      </Button>
    </form>
  );
};

export default Signuppass;

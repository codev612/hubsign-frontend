"use client";

import React, { useEffect, useState } from "react";
// import { Link } from "@nextui-org/link";
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

export default function Signuppass() {
  //
  const [password, setPassword] = useState("");

  const [passState6, setPassState6] = useState(false);

  const [passStateContain, setPassStateContain] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");

  const [match, setMatch] = useState(false);

  // State to control button enabled/disabled status
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  useEffect(() => {
    console.log(isPasswordValid)
  }, [password])

  // Regex pattern for password validation
  const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[<>])(?=\S)(.{4,})$/; // At least 6 characters, one uppercase, one lowercase, and no spaces
  const invalidCharPattern = /[<>]/; // Invalid characters: < and >

  const validatePassword = (inputPassword: string) => {
    // Check password length
    if (password.length > 4) {
      setPassState6(true);
    } else {
      setPassState6(false);
    }

    // Check for invalid characters
    setPassStateContain(!invalidCharPattern.test(inputPassword));

    // Validate complete password with pattern
    // const isValid = passwordPattern.test(inputPassword);
    return inputPassword.length >= 4 && passStateContain;
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    const isMatch = value === confirmPassword;
    setMatch(isMatch);

    setPassword(value);
    const isValid = validatePassword(value);
    setIsPasswordValid(isValid && isMatch); // Update the button status
  };

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setConfirmPassword(value);
    const isMatch = value === password;
    setMatch(isMatch);
    
    // Update valid state depending on password validation and match
    setIsPasswordValid(isMatch && validatePassword(password));
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

  return (
    <form
      className="flex flex-col items-start justify-center bg-background gap-4 rounded-md max-w-lg w-full"
      style={{ width: "32rem" }}
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
        label="Password"
        labelPlacement={"outside"}
        placeholder="Enter your password"
        size="md"
        type={isVisible ? "text" : "password"}
        value={confirmPassword}
        variant="bordered"
        onChange={handleConfirmPasswordChange}
      />
      <Button 
      fullWidth 
      className="text-white" 
      color="primary" 
      size="md"
      isDisabled={!isPasswordValid}
      >
        Start using eSign
      </Button>
    </form>
  );
}

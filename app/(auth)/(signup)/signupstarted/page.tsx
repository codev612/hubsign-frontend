"use client";
import React, { useState, useEffect } from "react";
// import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
// import InputMask from "react-input-mask";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { useFormState } from "react-dom";

import { inputContactInfo } from "../action";

const initialState = {
  message: "",
};

export default function Signupstarted() {
  const [state, formAction] = useFormState(inputContactInfo, initialState);

  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    switch (name) {
      case 'firstname':
        setFirstName(value);
        break;
      case 'lastname':
        setLastName(value);
        break;
      case 'phonenumber':
        setPhoneNumber(value);
        break;
      default:
        break;
    }

    if (isMounted) {
      localStorage.setItem(name, value); // Only save when mounted
    }
  };

  useEffect(() => {
    setIsMounted(true); // Set mounted to true after the first render

    setFirstName( localStorage.getItem('firstname') || "");
    setLastName( localStorage.getItem('lastname') || "");
    setPhoneNumber(localStorage.getItem('phonenumber') || "");
  }, []);

  return (
    <form
      action={formAction}
      className="flex flex-col items-start justify-center bg-background gap-4 rounded-md max-w-lg"
      style={{ width: "24rem" }}
    >
      <p style={{ fontSize: "2rem", fontWeight: 500 }}>{"Let's get started"}</p>
      <p className="text-text mb-2">Add your info to make collaboration easy</p>
      <div className="flex justify-between gap-1 w-full">
        <Input
          required
          label="First Name"
          labelPlacement="outside"
          placeholder="Your first name"
          type="text"
          variant="bordered"
          name="firstname"
          value={firstname}
          onChange={handleInputChange}
          // size="md"
          fullWidth
        />
        <Input
          label="Last Name"
          labelPlacement="outside"
          placeholder="Your last name"
          type="text"
          variant="bordered"
          name="lastname"
          value={lastname}
          onChange={handleInputChange}
          // size="md"
          fullWidth
        />
      </div>
      <Input
        required
        label="Phone Number"
        labelPlacement="outside"
        placeholder="+1 (999) 999 9999"
        type="text"
        variant="bordered"
        name="phonenumber"
        value={phonenumber}
        onChange={handleInputChange}
        // size="md"
        fullWidth
      />
      <Button
        fullWidth
        className="text-white"
        color="primary"
        size="md"
        type="submit"
      >
        Next
        <ArrowForwardOutlinedIcon fontSize="small" />
      </Button>
    </form>
  );
}

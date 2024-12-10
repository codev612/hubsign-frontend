"use client";
import React, { useState, useEffect } from "react";
// import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
// import InputMask from "react-input-mask";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { useFormState } from "react-dom";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const initialState = {
  message: "",
};

export default function Signupstarted() {
  const router = useRouter()
  const [state, setState] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    switch (name) {
      case "firstname":
        setFirstName(value);
        break;
      case "lastname":
        setLastName(value);
        break;
      case "phonenumber":
        setPhoneNumber(value);
        break;
      default:
        break;
    }

    if (isMounted) {
      Cookies.set(name, value); // Only save when mounted
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch('/api/sendcode', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: Cookies.get("email"),
      }),
    });

    if (!response.ok) {
      setState("Unexpected error. Try later");

      return;
    } else {
      // const data = await response.json();
      router.push("/signupcheck");
    }
  };

  useEffect(() => {
    setIsMounted(true); // Set mounted to true after the first render

    setFirstName(Cookies.get("firstname") || "");
    setLastName(Cookies.get("lastname") || "");
    setPhoneNumber(Cookies.get("phonenumber") || "");
  }, []);

  return (
    <form
      // action={formAction}
      onSubmit={handleSubmit}
      className="flex flex-col items-start justify-center bg-background gap-4 rounded-md max-w-lg"
      style={{ width: "24rem" }}
    >
      <p style={{ fontSize: "2rem", fontWeight: 500 }}>{"Let's get started"}</p>
      <p className="text-text mb-2 text-sm">
        Add your info to make collaboration easy
      </p>
      <div className="flex justify-between gap-1 w-full">
        <Input
          required
          label="First Name"
          labelPlacement="outside"
          name="firstname"
          placeholder="Your first name"
          type="text"
          value={firstname}
          variant="bordered"
          onChange={handleInputChange}
          // size="md"
          fullWidth
        />
        <Input
          label="Last Name"
          labelPlacement="outside"
          name="lastname"
          placeholder="Your last name"
          type="text"
          value={lastname}
          variant="bordered"
          onChange={handleInputChange}
          // size="md"
          fullWidth
        />
      </div>
      <Input
        required
        label="Phone Number"
        labelPlacement="outside"
        name="phonenumber"
        placeholder="+1 (999) 999 9999"
        type="text"
        value={phonenumber}
        variant="bordered"
        onChange={handleInputChange}
        // size="md"
        fullWidth
      />
      <p className="text-error">{state}</p>
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

"use client";

import React from "react";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";

export default function Signupsuccess() {
  return (
    <form
      className="flex flex-col items-start justify-center bg-background gap-4 rounded-md max-w-lg"
      style={{ width: "24rem" }}
    >
      <VerifiedOutlinedIcon />
      <p style={{ fontSize: "2rem", fontWeight: 500 }}>
        You are all set! Sign your first document
      </p>
      <p className="text-text mb-2 text-sm">
        Congrats! Your account is set up, and you can start using eSign.{" "}
      </p>

      <Link className="w-full" href="/signin">
        <Button fullWidth className="text-white" color="primary" size="md">
          Sign First Document
        </Button>
      </Link>
      <Link className="w-full" href="/signin">
        <Button fullWidth className="text-text" size="md" variant="bordered">
          Go to the Dashboard
        </Button>
      </Link>
    </form>
  );
}

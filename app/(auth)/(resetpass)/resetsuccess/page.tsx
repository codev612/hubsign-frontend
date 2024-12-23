"use client";

import React from "react";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";

export default function Resetsuccess() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <form
        className="flex flex-col justify-center bg-forecolor p-10 gap-4 rounded-md"
        style={{ width: "382px" }}
      >
        <VerifiedOutlinedIcon />
        <p style={{ fontSize: "1.25rem", fontWeight: 500 }}>
          Password successfully reset
        </p>
        <p className="text-text mb-2">
          Your password has been successfully reset. Click below to log in.{" "}
        </p>

        <Link href="/signin">
          <Button fullWidth className="text-white" color="primary" size="md">
            Back to log in
          </Button>
        </Link>
      </form>
    </section>
  );
}

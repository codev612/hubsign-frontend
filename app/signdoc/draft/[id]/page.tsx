"use client";

import React from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import SideBar from "@/components/layouts/signdoc/sidebar";
// import DocEditor from "@/components/pages/signdoc/doceditor";
const DocEditor = dynamic(
  () => import("@/components/pages/signdoc/doceditor"),
  { ssr: false },
);

const SignDoc = () => {
  const router = useRouter();
  return (
    <>
      <DocEditor />
    </>
  );
};

export default SignDoc;

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
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
      {/* <div className="flex flex-col h-full p-4 bg-forecolor gap-4 overflow-y-auto">
        <SideBar />
      </div> */}
      <div className="flex flex-col h-full w-full p-4 bg-forecolor gap-4 overflow-y-auto">
        <DocEditor />
      </div>
    </>
  );
};

export default SignDoc;

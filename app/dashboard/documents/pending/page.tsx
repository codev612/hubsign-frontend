"use client";

import React from "react";
import { usePathname } from "next/navigation";

import PageMenu from "@/components/layouts/common/pagemenu";
import { siteConfig } from "@/config/site";

export default function Pending() {
  const path = usePathname();

  return (
    <>
      <PageMenu currentPath={path} items={siteConfig.pagemenu.document} />
      <h1>pendig</h1>
    </>
  );
}

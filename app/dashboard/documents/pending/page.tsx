"use client";

import React from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

import PageMenu from "@/components/layouts/common/pagemenu";
import { siteConfig } from "@/config/site";
const DataTable = dynamic(() => import("@/components/pages/dashboards/documents/pending/datatable"), {
  ssr: false,
});

export default function Pending() {
  const path = usePathname();

  return (
    <>
      <PageMenu currentPath={path} items={siteConfig.pagemenu.document} />
      <DataTable />
    </>
  );
}

"use client";

import React from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const DataTable = dynamic(() => import("@/components/pages/dashboards/template/datatable"), {
  ssr: false,
});

export default function Template() {

  return (
    <>
      <DataTable />
    </>
  );
}

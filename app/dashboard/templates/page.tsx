"use client";

import React from "react";
import dynamic from "next/dynamic";

const DataTable = dynamic(() => import("@/components/pages/dashboard/template/datatable"), {
  ssr: false,
});

export default function Template() {

  return (
    <>
      <DataTable />
    </>
  );
}

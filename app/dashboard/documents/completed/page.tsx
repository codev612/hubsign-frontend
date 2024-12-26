"use client";

import React, { useState } from "react";
import PageMenu from "@/components/layouts/common/pagemenu";
import { siteConfig } from "@/config/site";
import { usePathname } from "next/navigation";
import DataTable from "@/components/common/datatable";

export default function Completed() {
    const path = usePathname();
    return (
        <>
            <PageMenu items={siteConfig.pagemenu.document} currentPath={path} />
            <DataTable />
        </>
    );
}

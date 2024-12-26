"use client";

import React, { useState } from "react";
import Link from "next/link";
import PageMenu from "@/components/layouts/common/pagemenu";
import { siteConfig } from "@/config/site";
import { usePathname } from "next/navigation";

export default function Pending() {
    const path = usePathname();
    return (
        <>
            <PageMenu items={siteConfig.pagemenu.document} currentPath={path} />
            <h1>pendig</h1>
        </>
    );
}

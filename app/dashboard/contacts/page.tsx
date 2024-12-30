// "use client";

import React from "react";
// import { usePathname } from "next/navigation";
import DataTable from "@/components/pages/contacts/datatable";
import { siteConfig } from "@/config/site";
import { getContacts } from "@/lib/dal";

export default async function Contacts() {

  const contacts = await getContacts();

  return (
    <>
      <DataTable initialData={contacts} />
    </>
  );
}

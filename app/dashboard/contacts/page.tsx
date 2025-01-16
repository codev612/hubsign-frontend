import React from "react";
import { getContacts } from "@/lib/dal";
import { Contact } from "@/interface/interface";
import Contacts from "./contacts"; // Correct import for Contacts component

export default async function Page() {
  const contacts: Contact[] = await getContacts();  // Explicitly define the type for contacts

  return (
    <>
      <Contacts contacts={contacts} />  {/* Pass contacts prop to Contacts component */}
    </>
  );
}

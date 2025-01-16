"use client"

import dynamic from "next/dynamic";
const DataTable = dynamic(() => import('@/components/pages/contacts/datatable'), { ssr: false });
import { Contact } from "@/interface/interface";

type ContactsListProps = {
  contacts: Contact[];
};

const Contacts = ({ contacts }: ContactsListProps) => {
  return (
    <DataTable initialData={contacts} />
  );
};

export default Contacts;

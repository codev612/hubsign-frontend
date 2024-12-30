import PageTitleBar from "@/components/layouts/common/pagetitlebar";
import { getContacts } from "@/lib/dal";

export default async function ContactsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageTitleBar buttonTitle="New Contact" buttonLink={"/dashboard/contacts/new"} pageTitle="Contacts" description="An overview of all recipients you’ve shared documents with." />
      {children}
    </>
  );
}

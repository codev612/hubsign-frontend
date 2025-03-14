import PageTitleBar from "@/components/layouts/common/pagetitlebar";
import { useModal } from "@/context/modal";

export default async function ContactsLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      <PageTitleBar
        buttonLink={"contact"}
        buttonTitle="New Contact"
        description="An overview of all recipients you’ve shared documents with."
        pageTitle="Contacts"
      />
      {children}
    </>
  );
}

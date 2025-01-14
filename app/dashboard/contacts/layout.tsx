import PageTitleBar from "@/components/layouts/common/pagetitlebar";

export default async function ContactsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageTitleBar
        buttonLink={"/dashboard/contacts/new"}
        buttonTitle="New Contact"
        description="An overview of all recipients you’ve shared documents with."
        pageTitle="Contacts"
      />
      {children}
    </>
  );
}

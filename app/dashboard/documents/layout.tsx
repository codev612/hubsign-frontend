import PageTitleBar from "@/components/layouts/common/pagetitlebar";

export default async function DocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
        <PageTitleBar pageTitle="Documents" buttonTitle="New Document" />
        {children}
    </>
  );
}

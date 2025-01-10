import PageTitleBar from "@/components/layouts/common/pagetitlebar";

export default async function DocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageTitleBar buttonTitle="New Document" buttonLink="/adddoc" pageTitle="Documents" />
      {children}
    </>
  );
}

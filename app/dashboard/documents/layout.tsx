import PageTitleBar from "@/components/layouts/common/pagetitlebar";

export default async function DocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageTitleBar
        buttonLink="/adddoc"
        buttonTitle="New Document"
        pageTitle="Documents"
      />
      {children}
    </>
  );
}

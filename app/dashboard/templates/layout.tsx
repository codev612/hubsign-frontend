import PageTitleBar from "@/components/layouts/common/pagetitlebar";

export default async function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageTitleBar
        buttonLink="template"
        buttonTitle="New Template"
        pageTitle="Templates"
      />
      {children}
    </>
  );
}
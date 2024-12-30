import { Navbar } from "@/components/layouts/common/navbar";
import { Bottombar } from "@/components/layouts/plan/bottombar";
import { getUser } from "@/lib/dal";

export default async function PlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <>
      <Navbar user={user} />
      <main className="container mx-auto max-w-7xl px-6 flex-grow bg-background">
        {children}
      </main>
      <Bottombar />
    </>
  );
}

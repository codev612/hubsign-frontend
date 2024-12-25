import Sidebar from "@/components/layouts/dashboard/sidebar";
import { Navbar } from "@/components/layouts/global/navbar";
import { Bottombar } from "@/components/layouts/plan/bottombar";
import { getUser } from "@/lib/dal";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  return (
    <>
      {/* <Navbar user={user} /> */}
      <main className="container w-full p-0 m-0 flex-grow bg-background">
        <section className="flex flex-row">
            <Sidebar user={user} />
            {children}
        </section>
      </main>
      {/* <Bottombar /> */}
    </>
  );
}

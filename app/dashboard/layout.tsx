import Sidebar from "@/components/layouts/dashboard/sidebar";
import { getUser } from "@/lib/dal";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <>
      <main className="w-full flex-grow bg-background p-0 m-0">
        <section className="flex flex-row w-full h-screen">
          <Sidebar user={user} />
          <div className="flex flex-col h-full w-full p-4 bg-forecolor gap-4 overflow-y-auto">
            {children}
          </div>
        </section>
      </main>
    </>
  );
}

import Sidebar from "@/components/layouts/dashboard/sidebar";
import { UserProvider } from "@/context/user";
import { ModalProvider } from "@/context/modal";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      <UserProvider>
        <ModalProvider>
          <main className="w-full flex-grow bg-background p-0 m-0">
            <section className="flex flex-row w-full h-screen">
              <Sidebar />
              <div className="flex flex-col h-full w-full p-4 bg-forecolor gap-4 overflow-y-auto">
                {children}
              </div>
            </section>
          </main>
        </ModalProvider>
      </UserProvider>
    </>
  );
}

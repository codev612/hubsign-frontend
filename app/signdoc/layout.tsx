import React from "react";
import { Navbar } from "@/components/layouts/signdoc/navbar";
import { CanvasProvider } from "@/context/canvas";
import { UserProvider } from "@/context/user";

interface SignDocLayoutProps {
  children: React.ReactNode;
}

export default async function SignDocLayout({ children }: SignDocLayoutProps) {
  return (
    <UserProvider>
      <CanvasProvider>
        <Navbar />
        <main className="w-full flex-grow bg-background p-0 m-0 bg-forecolor">
          <section className="flex flex-row w-full">
            <div className="flex flex-col h-full w-full p-4 bg-forecolor gap-4">
              {children}
            </div>
          </section>
        </main>
      </CanvasProvider>
    </UserProvider>
  );
}

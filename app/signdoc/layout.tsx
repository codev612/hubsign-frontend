import React from "react";

// import { Navbar } from "@/components/layouts/adddoc/navbar";
import { Navbar } from "@/components/layouts/signdoc/navbar";
import Room from "./room";
import { TooltipProvider } from "@/components/canvas/ui/tooltip";

interface NewDocLayoutProps {
  children: React.ReactNode;
}

export default async function SignDocLayout({ children }: NewDocLayoutProps) {
  return (
    <>
      <Navbar />
      <main className="w-full flex-grow bg-forecolor p-0 m-0 h-screen overflow-y-auto">
        {/* <Room> */}
          <TooltipProvider>
            <section className="flex flex-row w-full">{children}</section>
          </TooltipProvider>
        {/* </Room> */}
      </main>
    </>
  );
}

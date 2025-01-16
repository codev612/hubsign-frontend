import React from "react";

// import { Navbar } from "@/components/layouts/adddoc/navbar";
import { Navbar } from "@/components/layouts/signdoc/navbar";
import Room from "./room";
// import { TooltipProvider } from "@/components/canvas/ui/tooltip";
import { CanvasProvider } from "@/context/canvas";

interface NewDocLayoutProps {
  children: React.ReactNode;
}

export default async function SignDocLayout({ children }: NewDocLayoutProps) {
  return (
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
  );
}

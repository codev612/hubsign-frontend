import React from "react";
import { Navbar } from "@/components/layouts/adddoc/navbar";
import { getContacts, getUser } from "@/lib/dal";

interface NewDocLayoutProps {
  children: React.ReactNode;
}

export default async function NewDocLayout({ children }: NewDocLayoutProps) {
  return (
    <>
      <Navbar />
      <main className="w-full flex-grow bg-forecolor">
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className="inline-block max-w-lg text-center justify-center">
            {children}
          </div>
        </section>
      </main>
    </>
  );
}

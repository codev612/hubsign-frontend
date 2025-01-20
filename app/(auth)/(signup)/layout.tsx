import { Suspense } from "react";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  // NavbarMenu,
  // NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  // NavbarMenuItem,
} from "@heroui/navbar";
import NextLink from "next/link";
import Image from "next/image";

import { Logo } from "@/components/icons";

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const Bottombar: React.FC = () => {
    return (
      <NextUINavbar className="bg-background" maxWidth="xl" position="sticky">
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand as="li" className="gap-3 max-w-fit">
            <ul className="hidden lg:flex gap-4 justify-start ml-2">
              <NavbarItem style={{ fontSize: "12px" }}>
                <NextLink className="text-text" href={"/"}>
                  © eSign, 2024, All rights reserved
                </NextLink>
              </NavbarItem>
              <NavbarItem style={{ fontSize: "12px" }}>
                <NextLink className="text-text" href={"/"}>
                  Terms of use
                </NextLink>
              </NavbarItem>
              <NavbarItem style={{ fontSize: "12px" }}>
                <NextLink className="text-text" href={"/"}>
                  Privacy Policy
                </NextLink>
              </NavbarItem>
            </ul>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent
          className="hidden sm:flex basis-1/5 sm:basis-full"
          justify="end"
        />
      </NextUINavbar>
    );
  };

  const Navbar: React.FC = () => {
    // const searchInput = (
    //   <Input
    //     aria-label="Search"
    //     classNames={{
    //       inputWrapper: "bg-default-100",
    //       input: "text-sm",
    //     }}
    //     endContent={
    //       <Kbd className="hidden lg:inline-block" keys={["command"]}>
    //         K
    //       </Kbd>
    //     }
    //     labelPlacement="outside"
    //     placeholder="Search..."
    //     startContent={
    //       <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
    //     }
    //     type="search"
    //   />
    // );

    return (
      <NextUINavbar className="bg-background" maxWidth="xl">
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand as="li" className="gap-3 max-w-fit">
            <NextLink
              className="flex justify-start items-center gap-1"
              href="/"
            >
              <Logo />
            </NextLink>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent
          className="hidden sm:flex basis-1/5 sm:basis-full"
          justify="end"
        />
      </NextUINavbar>
    );
  };

  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 flex-grow bg-background">
        <section className="flex flex-row items-center justify-between gap-1 py-1 md:py-1">
          <div className="inline-block max-w-lg text-start justify-start">
            <Suspense>{children}</Suspense>
          </div>
          {/* Image container to align the image to the right */}
          <div className="flex-shrink-0 h-full">
            <Image
              alt="Mascot"
              className="h-full w-auto object-cover" // Ensures it takes full height and keeps its aspect ratio
              height={700}
              src="/assets/img/mascot.svg"
              style={{ zIndex: 999 }}
              width={582}
            />
          </div>
        </section>
      </main>
      <Bottombar />
    </>
  );
}

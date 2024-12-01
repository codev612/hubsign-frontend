import {
  Navbar as NextUINavbar,
  NavbarContent,
  // NavbarMenu,
  // NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  // NavbarMenuItem,
} from "@nextui-org/navbar";
import NextLink from "next/link";
import { Input } from "@nextui-org/input";
import { Kbd } from "@nextui-org/kbd";
import { link as linkStyles } from "@nextui-org/theme";
import clsx from "clsx";
import Image from "next/image";

import {
  // TwitterIcon,
  // GithubIcon,
  // DiscordIcon,
  // HeartFilledIcon,
  SearchIcon,
  Logo,
} from "@/components/icons";

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const Bottombar = () => {
    const searchInput = (
      <Input
        aria-label="Search"
        classNames={{
          inputWrapper: "bg-default-100",
          input: "text-sm",
        }}
        endContent={
          <Kbd className="hidden lg:inline-block" keys={["command"]}>
            K
          </Kbd>
        }
        labelPlacement="outside"
        placeholder="Search..."
        startContent={
          <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
        }
        type="search"
      />
    );

    return (
      <NextUINavbar className="bg-background" maxWidth="xl" position="sticky">
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand as="li" className="gap-3 max-w-fit">
            <ul className="hidden lg:flex gap-4 justify-start ml-2">
              <NavbarItem className="border-2">
                <NextLink className="text-text" href={"/"}>
                  © eSign, 2024, All rights reserved
                </NextLink>
              </NavbarItem>
              {/* <NavbarItem className="border-2">
                <NextLink
                  className="text-text"
                  href={'/'}
                >
                  Terms of use
                </NextLink>
              </NavbarItem>
              <NavbarItem>
                <NextLink
                  className="text-text"
                  href={'/'}
                >
                  Privacy Policy
                </NextLink>
              </NavbarItem> */}
            </ul>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent
          className="hidden sm:flex basis-1/5 sm:basis-full"
          justify="end"
        />

        <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
          <ul className="hidden lg:flex justify-start ml-2">
            <NavbarItem className="border-2">
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={"/"}
              >
                Terms of use
              </NextLink>
            </NavbarItem>
            {/* <NavbarItem>
                    <NextLink
                    className={clsx(
                        linkStyles({ color: "foreground" }),
                        "data-[active=true]:text-primary data-[active=true]:font-medium",
                    )}
                    color="foreground"
                    href={'/'}
                    >
                    Privacy Policy
                    </NextLink>
                </NavbarItem> */}
          </ul>
        </NavbarContent>
      </NextUINavbar>
    );
  };

  const Navbar = () => {
    const searchInput = (
      <Input
        aria-label="Search"
        classNames={{
          inputWrapper: "bg-default-100",
          input: "text-sm",
        }}
        endContent={
          <Kbd className="hidden lg:inline-block" keys={["command"]}>
            K
          </Kbd>
        }
        labelPlacement="outside"
        placeholder="Search..."
        startContent={
          <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
        }
        type="search"
      />
    );

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
            {children}
          </div>
          {/* Image container to align the image to the right */}
          <div className="flex-shrink-0 h-full">
            <Image
              alt="Mascot"
              className="h-full w-auto object-cover" // Ensures it takes full height and keeps its aspect ratio
              height={700}
              src="/assets/img/mascot.png"
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

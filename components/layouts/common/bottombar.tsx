import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@nextui-org/navbar";
import { Kbd } from "@nextui-org/kbd";
import { Input } from "@nextui-org/input";
import NextLink from "next/link";

import {
  SearchIcon,
  // Logo,
} from "@/components/icons";

export const Bottombar: React.FC = () => {
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
          <NextLink
            className="flex justify-start items-center gap-1"
            href="/"
          />
          <p className="text-text text-tiny">
            © eSign, 2024, All rights reserved
          </p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="flex" justify="end">
        {/* <ul className="hidden lg:flex gap-4 justify-start ml-2"> */}
        <NavbarItem>
          <NextLink className="text-text text-tiny" href={"/"}>
            Terms of use
          </NextLink>
        </NavbarItem>
        <NavbarItem>
          <NextLink className="text-text text-tiny" href={"/"}>
            Privacy Policy
          </NextLink>
        </NavbarItem>
        {/* </ul> */}
      </NavbarContent>
    </NextUINavbar>
  );
};

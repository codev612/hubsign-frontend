"use client"

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Kbd } from "@nextui-org/kbd";
import { Input } from "@nextui-org/input";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import {
  SearchIcon,
  Logo,
} from "@/components/icons";
import UserAvatar from "@/components/common/user";

interface NavbarProps {
  user?: any
}

export const Navbar : React.FC<NavbarProps> = ({user=null}) => {
  const router = useRouter();
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

  const handleClick = () => {
    router.push("/signupfree");
  }

  return (
    <NextUINavbar className="bg-forecolor" maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        { user ? <UserAvatar username={`${user.firstname} ${user.lastname}`} email={user.email} /> : <Button
          className="text-text border-1 bg-forecolor"
          href="/signupfree"
          radius="md"
          onClick={handleClick}
        >
          {"Don't have an account? Signup"}
        </Button>}
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
      { user ? <UserAvatar username={`${user.firstname} ${user.lastname}`} email={user.email} /> : <Button
          className="text-text border-1 bg-forecolor"
          href="/signupfree"
          radius="md"
          onClick={handleClick}
        >
          {"Don't have an account? Signup"}
        </Button>}
      </NavbarContent>
    </NextUINavbar>
  );
};

"use client";

import { Navbar as NextUINavbar, NavbarContent } from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Kbd } from "@nextui-org/kbd";
import { Input } from "@nextui-org/input";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { SearchIcon } from "@/components/icons";
import UserAvatar from "@/components/common/user";

interface NavbarProps {
  user?: any;
}

export const Navbar: React.FC<NavbarProps> = ({ user = null }) => {
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
    router.back();
  };

  return (
    <NextUINavbar
      className="bg-forecolor border-b-1 w-full"
      maxWidth="full"
      position="sticky"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        {user ? (
          <UserAvatar
            email={user.email}
            username={`${user.firstname} ${user.lastname}`}
          />
        ) : (
          <Button
            className="text-text border-1 bg-forecolor"
            href="/signupfree"
            radius="md"
            onClick={handleClick}
          >
            <ArrowBackIcon />
            {"Back"}
          </Button>
        )}
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <Button className="text-forecolor" color="primary">
          Review and Finish
        </Button>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Button className="text-forecolor" color="primary">
          Review and Finish
        </Button>
      </NavbarContent>
    </NextUINavbar>
  );
};

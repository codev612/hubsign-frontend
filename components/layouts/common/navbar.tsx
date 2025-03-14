"use client";
import { useState, useRef, useEffect } from "react";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import {  Logo } from "@/components/icons";
import Avatar from "@/components/ui/avatar";
import { generateColorForRecipient } from "@/utils/canvas/utils";
import Cookies from "js-cookie";

interface NavbarProps {
  user?: any;
}

export const Navbar: React.FC<NavbarProps> = ({ user = null }) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  // useEffect(() => {
  //   function handleClickOutside(event: MouseEvent) {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
  //       setTimeout(() => setIsOpen(false), 100); // Delay closing dropdown
  //     }
  //   }
  
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  const handleSignup = () => {
    router.push("/signupfree");
  };

  const handleLogout = () => {
    Cookies.remove("session");
    router.push("/signin");
  };

  const DropdownMenu = () => {
    return (
      <div className="absolute w-[300] right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 pl-[20] pr-[20] pb-[14] pt-[20]" ref={dropdownRef}>
        <div className="text-sm border-b pb-[16] gap-1 flex flex-col">
          <p className="title-small">{user.firstname} {user.lastname}</p>
          <p className="text-gray-500">{user.email}</p>
        </div>
        <ul className="text-sm pt-[10]">
          <li>
            <button className="w-full text-left hover:bg-gray-100 pt-[6] pb-[6]" 
            onClick={() => router.push("/dashboard/documents/pending")}>
              Go to Dashboard
            </button>
          </li>
          <li>
            <button className="w-full text-left text-red-500 hover:bg-gray-100 pt-[6] pb-[6]" 
            onClick={()=>handleLogout()}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    )
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
        {user ? (
          <div className="relative">
            <button onClick={()=>setIsOpen(!isOpen)}>
              <Avatar 
              name={`${user.firstname} ${user.lastname}`}
              color={generateColorForRecipient(user.email)}
              signed={false}
              size={40}
              />
            </button>
            {isOpen && <DropdownMenu />}
          </div>
        ) : (
          <Button
            className="text-text border-1 bg-forecolor"
            href="/signupfree"
            radius="md"
            onPress={handleSignup}
          >
            {"Don't have an account? Signup"}
          </Button>
        )}
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button onClick={()=>setIsOpen(!isOpen)}>
              <Avatar 
              name={`${user.firstname} ${user.lastname}`}
              color={generateColorForRecipient(user.email)}
              signed={false}
              size={40}
              />
            </button>
            {isOpen && <DropdownMenu />}
          </div>
        ) : (
          <Button
            className="text-text border-1 bg-forecolor"
            href="/signupfree"
            radius="md"
            onPress={handleSignup}
          >
            {"Don't have an account? Signup"}
          </Button>
        )}
      </NavbarContent>
    </NextUINavbar>
  );
};

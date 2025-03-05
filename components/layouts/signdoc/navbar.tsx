"use client";

import { useCanvas } from "@/context/canvas";
import { Navbar as NextUINavbar, NavbarContent } from "@heroui/navbar";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UserAvatar from "@/components/ui/user";

interface NavbarProps {
  user?: any;
}

export const Navbar: React.FC<NavbarProps> = ({ user = null }) => {
  const router = useRouter();

  const handleClick = () => {
    router.back();
  };

  const canvasContextValues = useCanvas();

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
            onPress={handleClick}
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
        <Button 
        className="text-forecolor" 
        color="primary"
        onPress={() => canvasContextValues.setShowReviewModal(true)}
        >
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

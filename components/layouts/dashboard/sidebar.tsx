"use client";

import Link from "next/link";
import { Snippet } from "@heroui/snippet";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";
import { Button } from "@heroui/button";
import { Listbox, ListboxItem } from "@heroui/listbox";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import PermContactCalendarOutlinedIcon from "@mui/icons-material/PermContactCalendarOutlined";
import SyncOutlinedIcon from "@mui/icons-material/SyncOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { Divider } from "@heroui/react";
import { useRouter } from "next/navigation";

import { Logo } from "@/components/icons";
import UserAvatar from "@/components/ui/user";
import { useEffect } from "react";

// Define the props for the Sidebar component
interface SidebarProps {
  user: any;
}

const items = [
  {
    icon: <DescriptionOutlinedIcon />,
    link: "/dashboard/documents/pending",
    label: "Documents",
  },
  {
    icon: <PostAddOutlinedIcon />,
    link: "/dashboard/templates",
    label: "Templates",
  },
  {
    icon: <PermContactCalendarOutlinedIcon />,
    link: "/dashboard/contacts",
    label: "Contacts",
  },
  {
    icon: <SyncOutlinedIcon />,
    link: "/dashboard/integrations",
    label: "Integrations",
  },
];

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const router = useRouter();

  return (
    (<div className="flex flex-col min-w-[266px] h-screen border-r border-gray-200 w-64 p-4 bg-background gap-4 overflow-y-auto">
      <Link className="mb-4" href={"/"}>
        <Logo />
      </Link>
      <div className="mb-4">
        <UserAvatar
          email={user.email}
          username={`${user.firstname} ${user.lastname}`}
        />
      </div>
      <Snippet
        hideCopyButton
        hideSymbol
        className="text-brand bg-brand10 items-center justify-center"
      >
        <div className="items-center justify-center">
          <HourglassEmptyOutlinedIcon fontSize="small" />
          30 days of free trial left
        </div>
      </Snippet>
      <Divider />
      <Button
        fullWidth
        className="text-white my-1 min-h-[30px]"
        color="primary"
        size="md"
        // onClick={handleNewDoc}
      >
        <Link href={"/adddoc"}>
          <AddOutlinedIcon /> New Document
        </Link>
      </Button>
      <Divider />
      <div className="flex-grow w-full text-text">
        <Listbox aria-label="Sidebar menu" className="p-0" items={items}>
          {(item) => (
            // <Link href={item.link}>
            (<ListboxItem
              key={item.link}
              className="px-0"
              startContent={item.icon}
              onPress={() => router.push(item.link)}
            >
              {/* {item.icon} */}
              {item.label}
            </ListboxItem>)
            // </Link>
          )}
        </Listbox>
      </div>
      <Button
        fullWidth
        className="text-text my-5 bg-forecolor min-h-[30px]"
        size="md"
      >
        <SettingsOutlinedIcon /> Settings
      </Button>
    </div>)
  );
};

export default Sidebar;

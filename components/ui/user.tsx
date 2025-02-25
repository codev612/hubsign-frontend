import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
} from "@heroui/react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import { UserAvatarProps } from "@/interface/interface";

const UserAvatar: React.FC<UserAvatarProps> = ({
  username = "",
  email = "",
}) => {
  const router = useRouter();

  const handleLogout = async () => {
    await Cookies.remove("session");
    router.push("/signin");
  };

  return (
    <div className="flex items-center gap-4">
      {/* <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            className="transition-transform"
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">zoey@example.com</p>
          </DropdownItem>
          <DropdownItem key="settings">My Settings</DropdownItem>
          <DropdownItem key="team_settings">Team Settings</DropdownItem>
          <DropdownItem key="analytics">Analytics</DropdownItem>
          <DropdownItem key="system">System</DropdownItem>
          <DropdownItem key="configurations">Configurations</DropdownItem>
          <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
          <DropdownItem key="logout" color="danger">
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown> */}
      <Dropdown placement="bottom-start">
        <DropdownTrigger>
          <User
            as="button"
            // avatarProps={{
            //   isBordered: true,
            //   src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
            // }}
            className="transition-transform"
            description={email}
            name={username}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          {/* <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-bold">Signed in as</p>
            <p className="font-bold">@tonyreichert</p>
          </DropdownItem> */}
          {/* <DropdownItem key="settings">My Settings</DropdownItem>
          <DropdownItem key="team_settings">Team Settings</DropdownItem>
          <DropdownItem key="analytics">Analytics</DropdownItem>
          <DropdownItem key="system">System</DropdownItem>
          <DropdownItem key="configurations">Configurations</DropdownItem> */}
          <DropdownItem
            key="gotodashboard"
            onPress={() => router.push("/dashboard/documents/pending")}
          >
            Go to the dashboard
          </DropdownItem>
          <DropdownItem key="logout" color="danger" onPress={handleLogout}>
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default UserAvatar;

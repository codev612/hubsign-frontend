"use client"

import UserAvatar from '@/components/common/user';
import { Logo } from '@/components/icons';
import Link from 'next/link';
import { Snippet } from '@nextui-org/snippet';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import { Button } from '@nextui-org/button';
import { Listbox, ListboxItem } from '@nextui-org/listbox';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import PermContactCalendarOutlinedIcon from '@mui/icons-material/PermContactCalendarOutlined';
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

// Define the props for the Sidebar component
interface SidebarProps {
    user: any;
}

const items = [
    {
        icon: <DescriptionOutlinedIcon />,
        link: "new",
        label: "Documents",
    },
    {
        icon: <PostAddOutlinedIcon />,
        link: "copy",
        label: "Templates",
    },
    {
        icon: <PermContactCalendarOutlinedIcon />,
        link: "edit",
        label: "Contacts",
    },
    {
        icon: <SyncOutlinedIcon />,
        link: "delete",
        label: "Integrations",
    },
];

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
    return (
        <div className="flex flex-col h-screen border-r border-gray-200 w-64 p-4 bg-background gap-4">
            <Link href={"/"} className='mb-4'>
                <Logo />
            </Link>
            <div className='mb-4'>
                <UserAvatar username={`${user.firstname} ${user.lastname}`} email={user.email} />
            </div>
            <Snippet className='bg-brand10 text-brand50 items-center justify-center' hideSymbol hideCopyButton>
                <div><HourglassEmptyOutlinedIcon fontSize='small' />30 days of free trial left</div>
            </Snippet>
            <Button
                fullWidth
                className="text-white my-5"
                color="primary"
                size="md"
                type="submit"
            >
                <AddOutlinedIcon /> New Document
            </Button>
            <div className="flex-grow w-full text-text">
                <Listbox className='p-0' aria-label="Sidebar menu" items={items} onAction={(link) => alert(link)}>
                    {(item) => (
                        <ListboxItem
                            key={item.link}
                            className='px-0'
                        >
                            {item.icon}{item.label}
                        </ListboxItem>
                    )}
                </Listbox>
            </div>
            <Button
                fullWidth
                className="text-text my-5 bg-forecolor"
                size="md"
            >
                <SettingsOutlinedIcon /> Settings
            </Button>
        </div>
    );
}

export default Sidebar;
